/* eslint-disable no-await-in-loop */
import {StreamChat, decodeBase64} from 'stream-chat';
import config from '../../config';
import {apiCommand} from '../../redux/apiCommands/actions';
import {
  setClient,
  updateUnreadChats,
  updateTabsUnreadChats,
  increaseTabUnreadChats,
  decreaseTabUnreadChats,
} from '../../redux/inbox/actions';
import {get, isNil, delayInMilliseconds} from '../utils';
import {Logger} from '../reporting';
import {chatTabTypes, internalConversationTypes} from '../../vars/enums';

const CHANNELS_PER_UNREAD_REQUEST = 10;
const UNREAD_REQUEST_PAGES = 5;
const TIME_BUFFER = 2 * 60 * 60 * 1000; // 2 hours

const streamEvents = {
  notifications: {
    markRead: 'notification.mark_read',
    messageNew: 'notification.message_new',
  },
  messages: {
    new: 'message.new',
  },
  connection: {
    recovered: 'connection.recovered',
  },
  channel: {
    updated: 'channel.updated',
  },
};

class ChatService {
  newMessageListeners = {};
  initPromise;

  async init(userId) {
    await this.initPromise;
    this.initPromise = this._init(userId);
    await this.initPromise;
  }

  async _init(userId) {
    try {
      const clientUserId = get(this.streamClient, 'userID');
      if (!this.streamClient) {
        this._setClient();
      }
      if (userId && clientUserId !== userId) {
        await this._setUser(userId);
        this._updateUnreadCount();
        this._watchUnreadCount();
      } else if (this._isTokenExpired()) {
        await this._updateUser(userId);
      }
      global.store.dispatch(setClient({client: this.streamClient}));
    } catch (err) {
      Logger.error({
        errType: 'chat',
        err: {
          screen: 'chatService',
          message: 'init failed',
          hasClient: !!this.streamClient,
          err,
        },
      });
    }
  }

  resetUser = async () => {
    if (this.streamClient) {
      await this.streamClient.disconnect();
    }
  };

  getParticipantId({channel, ownUserId, membersObj}) {
    if (this.isPageChannel({channel})) {
      const {pageId, channelCreatorId} = this.getPageChannelEntityIds({
        channel,
      });
      return channelCreatorId === ownUserId ? pageId : channelCreatorId;
    } else {
      return Object.keys(membersObj).filter((id) => id !== ownUserId)[0];
    }
  }

  getParticipant({channel, ownUserId}) {
    const membersObj = get(channel, 'state.members', {});
    const participantId = this.getParticipantId({
      channel,
      ownUserId,
      membersObj,
    });
    const participant = get(membersObj, `[${participantId}].user`, null);
    return participant;
  }

  async getChannelOrCreate({participantId, channelId}) {
    if (!participantId) {
      Logger.error({
        errType: 'chat',
        err: {message: 'getChannelOrCreate with no participantId'},
      });
      return null;
    }
    await this._ensureClientReady();
    let channel = await this._getChannel({participantId, channelId});
    if (!channel) {
      channel = await this._createChannel(participantId);
    }

    return channel;
  }

  async _getChannel({participantId, channelId}) {
    if (channelId) {
      const channel = await this.getChannelByChannelId({
        channelId,
        shouldWatch: true,
        shouldWatchPresence: true,
      });
      return channel;
    } else {
      const ownUserId = ChatService._getUserId();
      const filters = {
        type: 'messaging',
        members: [ownUserId, participantId],
        distinct: true,
      };
      const sort = {last_message_at: -1};
      const options = {subscribe: true, presence: true};
      const channels = await this.streamClient.queryChannels(
        filters,
        sort,
        options,
      );

      return channels && channels[0];
    }
  }

  async _createChannel(participantId) {
    const userId = ChatService._getUserId();
    const channel = this.streamClient.channel('messaging', {
      members: [participantId, userId],
    });
    await channel.watch();
    return channel;
  }

  async getPageChannelOrCreate({participantId, pageId, ownersIds}) {
    const tabsPerUser = {[`${participantId}_tab`]: chatTabTypes.INBOX};
    [pageId, ...ownersIds].forEach((id) => {
      tabsPerUser[`${id}_tab`] = chatTabTypes.PAGES;
    });
    const channel = this.streamClient.channel(
      'messaging',
      `page-${pageId}-${participantId}`,
      {
        flipFlopChannelType: internalConversationTypes.PAGE,
        members: [participantId, pageId, ...ownersIds],
        ...tabsPerUser,
      },
    );
    await channel.watch({presence: true});
    return channel;
  }

  async getChannelByChannelId({
    channelId,
    shouldWatch,
    shouldWatchPresence = false,
  }) {
    await this._ensureClientReady();
    const adjustedChannelId = channelId.replace('messaging:', '');

    const channel = this.streamClient.channel('messaging', adjustedChannelId);
    shouldWatch
      ? await channel.watch({presence: shouldWatchPresence})
      : await channel.create();
    return channel;
  }

  _updateUnreadCount() {
    this._updateGlobalUnreadChats();
    this._updateTabUnreadChats();
  }

  _updateGlobalUnreadChats() {
    const unreadChats = get(this.streamClient, 'user.unread_channels');
    if (!isNil(unreadChats)) {
      global.store.dispatch(updateUnreadChats({unreadChats}));
    }
  }

  async _updateTabUnreadChats() {
    const maxUnreadChannels =
      UNREAD_REQUEST_PAGES * CHANNELS_PER_UNREAD_REQUEST;
    const [
      inboxUnreadChannels,
      requestsUnreadChannels,
      blockedUnreadChannels,
    ] = await Promise.all([
      this._getTabUnreadCount(chatTabTypes.INBOX),
      this._getTabUnreadCount(chatTabTypes.REQUESTS),
      this._getTabUnreadCount(chatTabTypes.BLOCKED),
    ]);
    global.store.dispatch(
      updateTabsUnreadChats({
        [chatTabTypes.INBOX]:
          inboxUnreadChannels >= maxUnreadChannels
            ? `${maxUnreadChannels}+`
            : inboxUnreadChannels,
        [chatTabTypes.REQUESTS]:
          requestsUnreadChannels >= maxUnreadChannels
            ? `${maxUnreadChannels}+`
            : requestsUnreadChannels,
        [chatTabTypes.BLOCKED]:
          blockedUnreadChannels >= maxUnreadChannels
            ? `${maxUnreadChannels}+`
            : blockedUnreadChannels,
      }),
    );
  }

  async _getTabUnreadCount(tab) {
    const userId = ChatService._getUserId();
    const filters = this.getFiltersByTab({tab, userId});
    const sort = {has_unread: -1};
    let unreadChannelsCount = 0;
    let channels = [];
    let page = 1;
    let isAllChannelsUnread = true;

    do {
      const options = {
        offset: (page - 1) * CHANNELS_PER_UNREAD_REQUEST,
        message_limit: 1,
      };
      channels = await this.streamClient.queryChannels(filters, sort, options);
      unreadChannelsCount += channels.filter(
        (channel) => !!this.getUnreadCount({channel, userId}),
      ).length;
      isAllChannelsUnread =
        (page - 1) * CHANNELS_PER_UNREAD_REQUEST + channels.length ===
        unreadChannelsCount;
      page += 1;
    } while (
      page - 1 < UNREAD_REQUEST_PAGES &&
      unreadChannelsCount &&
      isAllChannelsUnread
    );

    return unreadChannelsCount;
  }

  _watchUnreadCount() {
    const userId = ChatService._getUserId();

    this.streamClient.on(async (event) => {
      const {
        type,
        user,
        cid: channelId,
        unread_channels: unreadChats,
        channel,
      } = event;
      if (type === streamEvents.notifications.markRead) {
        this._handleMarkRead({unreadChats, userId, channel});
      }
      if (type === streamEvents.messages.new && user.id !== userId) {
        this._handleNewMessage({unreadChats, channelId, userId});
      }
      if (type === streamEvents.notifications.messageNew) {
        this._handleNewMessageNotification({unreadChats, channel, userId});
      }
      if (type === streamEvents.connection.recovered) {
        this._updateUnreadCount();
      }
      if (!isNil(unreadChats)) {
        global.store.dispatch(updateUnreadChats({unreadChats}));
      }
    });
  }

  _isEqualToUnreadChats(count) {
    const {unreadChats} = global.store.getState().inbox;
    return typeof unreadChats === 'string' ? true : count === unreadChats; // we don't want to change unread count of "50+" (string)
  }

  _isTabUnreadManageable(tab) {
    const unreadTabChats = global.store.getState().inbox.unreadTabsChats[tab];
    return typeof unreadTabChats !== 'string'; // we don't manage unread count of type '50+'
  }

  _handleMarkRead({unreadChats, userId, channel}) {
    const isUnreadCountChanged = !this._isEqualToUnreadChats(unreadChats);
    if (isUnreadCountChanged) {
      const tab = channel[`${userId}_tab`];
      const isTabUnreadManageable = this._isTabUnreadManageable(tab);
      isTabUnreadManageable &&
        global.store.dispatch(decreaseTabUnreadChats({tab}));
    }
  }

  async _handleNewMessage({unreadChats, channelId, userId}) {
    this.fireNewMessageListener({channelId});

    const isUnreadCountChanged = !this._isEqualToUnreadChats(unreadChats);
    if (isUnreadCountChanged) {
      const channel = await this.getChannelByChannelId({channelId});
      const tab = channel.data[`${userId}_tab`];
      const isTabUnreadManageable = this._isTabUnreadManageable(tab);
      isTabUnreadManageable &&
        global.store.dispatch(increaseTabUnreadChats({tab}));
    }
  }

  fireNewMessageListener({channelId}) {
    if (this.newMessageListeners[channelId]) {
      this.newMessageListeners[channelId]();
    }
  }

  _handleNewMessageNotification({unreadChats, channel, userId}) {
    const isUnreadCountChanged = !this._isEqualToUnreadChats(unreadChats);
    if (isUnreadCountChanged) {
      const tab = channel[`${userId}_tab`];
      const isTabUnreadManageable = this._isTabUnreadManageable(tab);
      isTabUnreadManageable &&
        global.store.dispatch(increaseTabUnreadChats({tab}));
    }
  }

  _setClient() {
    if (!this.streamClient) {
      const logger = (logLevel, message, extraData) => {
        if (logLevel === 'error') {
          Logger.error({
            errType: 'chat',
            err: {
              screen: 'chatService',
              message,
              extraData,
              streamUserId: get(this.streamClient, 'userID'),
              hasClient: !!this.streamClient,
            },
          });
        }
      };
      const options = {timeout: 9000, logger};
      this.streamClient = new StreamChat(
        config.providers.stream.apiKey,
        {},
        options,
      );
    }
  }

  _isTokenExpired() {
    const userToken = this.streamClient.tokenManager.getToken();
    const now = (new Date().getTime() - TIME_BUFFER) / 1000;

    if (!userToken) {
      return true;
    }

    const payloadB64Encoded = userToken.split('.')[1];
    const payloadJsonEncoded = decodeBase64(payloadB64Encoded);
    const {exp} = JSON.parse(payloadJsonEncoded);

    if (exp === null) {
      return false;
    }

    return exp < now;
  }

  async _setUser(userId = ChatService._getUserId()) {
    if (this.streamClient.userID && this.streamClient.userID !== userId) {
      await this.resetUser();
    }
    if (!this.streamClient.userID && !this.isSettingClient) {
      this.isSettingClient = true;
      await this._setToken(userId);
      this.isSettingClient = false;
    }
  }

  async _updateUser(userId = ChatService._getUserId()) {
    await this.resetUser();
    await this._setToken(userId);
    this._updateUnreadCount();
    this._watchUnreadCount();
  }

  async _setToken(userId) {
    const res = await global.store.dispatch(
      apiCommand('inbox.getIdentityToken', {}),
    );
    const identityToken = get(res, 'data.data.identity_token');
    await this.streamClient.setUser(
      {
        id: userId,
      },
      identityToken,
    );
  }

  async _ensureClientReady() {
    if (!this.isEnsuringClient && !get(this.streamClient, 'userID')) {
      this.isEnsuringClient = true;
      await this.init();
      this.isEnsuringClient = false;
    }
  }

  async hideMessage({messageId}) {
    try {
      await global.store.dispatch(apiCommand('chat.hideMessage', {messageId}));
    } catch (err) {
      Logger.error({
        errType: 'chat',
        err: {
          screen: 'chat',
          message: 'Failed to hide message',
          err,
          messageId,
        },
      });
    }
  }

  async hideConversation({channelId}) {
    await this._ensureClientReady();
    const channel = await this.getChannelByChannelId({channelId});
    await channel.hide();
  }

  static _getUserId() {
    const state = global.store.getState();
    const userId = get(state, 'auth.user.id');
    return userId;
  }

  addNewMessageListener = ({channelId, cb}) => {
    this.newMessageListeners[channelId] = cb;
  };

  removeNewMessageListener = ({channelId}) => {
    delete this.newMessageListeners[channelId];
  };

  markTabAsRead = async ({tab}) => {
    const userId = ChatService._getUserId();
    await this._ensureClientReady();
    const maxToUpdate = 50;
    const filters = this.getFiltersByTab({tab});
    const sort = {has_unread: -1};
    let channels = [];
    let isAllChannelsUnread = true;
    let updatedChannelsCount = 0;

    do {
      channels = await this.streamClient.queryChannels(filters, sort, {});
      const unreadChannels = channels.filter(
        (channel) => !!this.getUnreadCount({channel, userId}),
      );
      isAllChannelsUnread = channels.length === unreadChannels.length;
      updatedChannelsCount += updatedChannelsCount.length;
      const markReadPromises = unreadChannels.map((channel) =>
        channel.markRead(),
      );
      await Promise.all(markReadPromises);
      await delayInMilliseconds(3000);
    } while (updatedChannelsCount < maxToUpdate && isAllChannelsUnread);
  };

  getFiltersByTab({tab, userId = ChatService._getUserId(), filterByMember}) {
    let tabFilter;
    if (tab === chatTabTypes.REQUESTS) {
      tabFilter = {
        $and: [
          {
            members: {
              $in: [userId],
            },
          },
          {
            $or: [
              {[`${userId}_tab`]: tab},
              {[`${userId}_tab`]: {$exists: false}},
            ],
          },
        ],
      };
    } else {
      tabFilter = {[`${userId}_tab`]: tab, members: {$in: [userId]}};
      if (filterByMember) {
        tabFilter.members = {$in: [filterByMember]};
      }
    }
    const filters = {type: 'messaging', ...tabFilter};
    return filters;
  }

  isPageChannel({channel}) {
    const flipFlopChannelType = get(channel, 'data.flipFlopChannelType');
    return flipFlopChannelType === internalConversationTypes.PAGE;
  }

  isActorPageOwner({message, channel}) {
    const channelCreatorId = channel.id.split('-')[2];
    const senderId = message.user.id;
    return senderId !== channelCreatorId;
  }

  getPageChannelEntityIds({channel}) {
    const [, pageId, channelCreatorId] = channel.id.split('-');
    const memberIds = Object.keys(channel.state.members);
    const ownerIds = memberIds.filter(
      (id) => ![pageId, channelCreatorId].includes(id),
    );
    return {pageId, channelCreatorId, ownerIds};
  }

  isPageOwner({channel, userId}) {
    const channelCreatorId = channel.id.split('-')[2];
    return userId !== channelCreatorId;
  }

  getPage({channel}) {
    const pageId = channel.id.split('-')[1];
    const page = get(channel, `state.members[${pageId}].user`, {});
    return page;
  }

  getUnreadCount({channel, userId}) {
    return get(channel, `state.read.${userId}.unread_messages`, 0);
  }
}

export default new ChatService();
