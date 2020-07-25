import React, {Component} from 'react';
// import {
//   Chat as StreamChat,
//   Channel,
//   MessageList,
// } from 'stream-chat-react-native';
import PropTypes from 'prop-types';
import {
  Dimensions,
  StyleSheet,
  LayoutAnimation,
  Keyboard,
  Platform,
} from 'react-native';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
import {chat as chatLocalStorage} from '../../infra/localStorage';
// import { apiQuery } from '/redux/apiQuery/actions';
// import { openActionSheet } from '/redux/general/actions';
// import { apiCommand } from '/redux/apiCommands/actions';

import {Header, Screen, SearchMentionsResultsList} from '../../components';
import {
  View,
  Text,
  Spinner,
  KeyboardAvoidingView,
} from '../../components/basicComponents';
import {ErrorDefault} from '../../components/errorBoundaries/errorScreens';
import {flipFlopColors, commonStyles, uiConstants} from '../../vars';
import {
  chatStatuses,
  chatTabTypes,
  entityTypes,
  screenNames,
} from '../../vars/enums';
import {get, isBoolean} from '../../infra/utils';
import {getLocaleTimeForFeed} from '../../infra/utils/dateTimeUtils';
// import chatService from '/infra/chat/chatService';
import {navigationService} from '../../infra/navigation';
// import { Logger, analytics } from '/infra/reporting';
import {searchMentionsScheme} from '../../schemas';
import {ChatMessageInput} from './messageInput';
import {DateSeparator, EmptyList, Message} from './messageList';
import BlockMessage from './BlockMessage';
import EnableChatNotificationDialog from './EnableChatNotificationDialog';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: flipFlopColors.white,
  },
  content: {
    flex: 1,
    paddingBottom: uiConstants.FOOTER_MARGIN_BOTTOM,
    backgroundColor: flipFlopColors.white,
  },
  contentWithKeyboard: {
    paddingBottom: Platform.select({ios: 0, android: 20}),
  },
  contentWithToast: {
    paddingBottom: uiConstants.FOOTER_MARGIN_BOTTOM + 10,
  },
  header: {
    // Must have a defined zIndex in order for the enable notifications banner to appear like it slides from the header.
    zIndex: 2,
  },
  blockedUserToast: {
    width: '100%',
    height: 30,
    fontSize: 12,
    color: flipFlopColors.white,
    lineHeight: 30,
    textAlign: 'center',
    backgroundColor: flipFlopColors.b70,
  },
  unblockBtn: {
    fontSize: 12,
    color: flipFlopColors.white,
    lineHeight: 30,
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
    textDecorationColor: flipFlopColors.white,
  },
  searchResults: {
    position: 'absolute',
    top: uiConstants.NAVBAR_HEIGHT,
    width: '100%',
    flex: 1,
    backgroundColor: flipFlopColors.white,
  },
});

class Chat extends Component {
  constructor(props) {
    super(props);
    const {navigation} = props;
    const {
      isInitComposeMode,
      participantId,
      participantName,
      participantAvatar,
    } = navigation.state.params;
    const participant = {
      id: participantId,
      name: participantName,
      image: participantAvatar,
    };

    this.state = {
      participant,
      refreshChatKey: 0,
      isKeyboardOpen: isBoolean(isInitComposeMode) ? isInitComposeMode : true,
      channelTab: null,
      participantChannelTab: null,
    };
  }

  static screenName = 'Chat';

  render() {
    const {
      channel,
      participant,
      refreshChatKey,
      isKeyboardOpen,
      channelTab,
      participantChannelTab,
    } = this.state;

    const {client, navigation, user, isOnline, searchMentions} = this.props;
    const {isInitComposeMode, isFromContext} = navigation.state.params;
    const isInitKeyboardOpen = isBoolean(isInitComposeMode)
      ? isInitComposeMode
      : true;

    if (!channel || !client || !client.userID) {
      return this.renderLoadingState();
    }

    const isBlockMessageShown = channelTab === chatTabTypes.REQUESTS;
    const isBlockToastShown = [channelTab, participantChannelTab].includes(
      chatTabTypes.BLOCKED,
    );
    const isInputShown =
      [chatTabTypes.INBOX, chatTabTypes.PAGES].includes(channelTab) &&
      participantChannelTab !== chatTabTypes.BLOCKED;

    return (
      <KeyboardAvoidingView style={styles.wrapper}>
        {/* <StreamChat client={client} key={refreshChatKey}>
          <Channel
            client={client}
            channel={channel}
            LoadingIndicator={this.renderLoadingState}
            LoadingErrorIndicator={this.renderErrorState}
            EmptyStateIndicator={() => <EmptyList participantName={participant.name} participantAvatar={participant.image} participantId={participant.id} />}
          >
            <View style={[styles.content, isKeyboardOpen && styles.contentWithKeyboard, isBlockToastShown && styles.contentWithToast]}>
              {this.renderHeader()}
              <EnableChatNotificationDialog />
              <MessageList messageActions={false} Message={Message} DateSeparator={DateSeparator} TypingIndicator={null} />
              {isBlockMessageShown && (
                <BlockMessage
                  participantFullName={participant.name}
                  toggleChatUserBlocking={() => this.toggleChatUserBlocking('decline')}
                  handleAllowClick={this.handleAllowClick}
                />
              )}
              {isInputShown && (
                <ChatMessageInput
                  participant={participant}
                  ownUser={user}
                  isDisabled={!isOnline}
                  isInitKeyboardOpen={isInitKeyboardOpen}
                  isFromContext={isFromContext}
                  isPageChannel={chatService.isPageChannel({ channel })}
                  onLayout={this.handleInputLayout}
                />
              )}
              {this.shouldShowMentionSearch(searchMentions) && this.renderSearchResults()}
            </View>
          </Channel>
        </StreamChat> */}
      </KeyboardAvoidingView>
    );
  }

  async componentDidMount() {
    // const { navigation, client, ownUserId } = this.props;
    // const { participantId, pageId, channelId } = navigation.state.params;
    // if (!client || !client.userID) {
    //   await chatService.init(ownUserId);
    // }
    // if (pageId || participantId || channelId) {
    //   this.getChannelAndParticipant();
    //   this.watchUserPresence();
    // }
    // this.sendHideBlockFromLS();
    // this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.handleKeyboardShown);
    // this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.handleKeyboardHidden);
  }

  componentWillUnmount() {
    // const { client } = this.props;
    // this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
    // this.keyboardDidHideListener && this.keyboardDidHideListener.remove();
    // client.off('user.presence.changed', this.handleUserPresenceChanged);
  }

  renderSearchResults = () => (
    <View
      style={[styles.searchResults, {height: this.getSearchResultsHeight()}]}>
      <SearchMentionsResultsList />
    </View>
  );

  renderLoadingState = () => (
    <View style={commonStyles.flex1}>
      <Spinner />
    </View>
  );

  renderErrorState = () => {
    // Logger.error({ errType: 'chat', err: { screen: 'Chat', message: 'Channel failed' } });
    return <ErrorDefault onRefresh={this.refreshChat} />;
  };

  renderHeader() {
    const {channelTab, participantChannelTab, participant} = this.state;
    const {
      name,
      last_active: memberLastSeenAt,
      online: isOnline,
      userLocation,
    } = participant;

    return (
      <View style={styles.header}>
        <Header
          title={name}
          subTitle={this.getSubTitle({
            isOnline,
            memberLastSeenAt,
            participantChannelTab,
            userLocation,
          })}
          titleOnPress={this.navigateToParticipant}
          hasBackButton
          rightBtnIconName="more-horizontal"
          // rightBtnAction={this.openActionSheet}
        />

        {participantChannelTab === chatTabTypes.BLOCKED && (
          <Text style={styles.blockedUserToast}>
            {I18n.t('chat.disabled_chat_toast_message')}
          </Text>
        )}
        {channelTab === chatTabTypes.BLOCKED && (
          <Text style={styles.blockedUserToast}>
            {I18n.t('chat.blocked_user_toast_message')}&nbsp;
            <Text
              onPress={this.toggleChatUserBlocking}
              style={styles.unblockBtn}
              bold>
              {I18n.t('chat.unblock_user_button')}
            </Text>
          </Text>
        )}
      </View>
    );
  }

  handleKeyboardShown = (event) => {
    const {isKeyboardOpen} = this.state;
    !isKeyboardOpen && this.setState({isKeyboardOpen: true});
    this.keyboardHeight = event.endCoordinates.height;
  };

  handleKeyboardHidden = () => {
    const {isKeyboardOpen} = this.state;
    isKeyboardOpen && this.setState({isKeyboardOpen: false});
  };

  handleInputLayout = (e) => {
    this.inputHeight = e.nativeEvent.layout.height;
  };

  getSearchResultsHeight() {
    return (
      Dimensions.get('window').height -
      this.keyboardHeight -
      this.inputHeight -
      uiConstants.NAVBAR_HEIGHT
    );
  }

  async getChannelAndParticipant() {
    // const { ownUserId, navigation } = this.props;
    // const { participantId } = navigation.state.params;
    // const newChannel = await this.getChannel();
    // if (newChannel) {
    //   const participant = chatService.getParticipant({ channel: newChannel, ownUserId });
    //   const channelTab = get(newChannel, `data[${ownUserId}_tab]`);
    //   const participantChannelTab = get(newChannel, `data[${participant.id}_tab]`);
    //   if (!channelTab || !participantChannelTab) {
    //     this.getChatStatus();
    //   }
    //   LayoutAnimation.easeInEaseOut();
    //   this.setState({ channel: newChannel, participant, channelTab, participantChannelTab });
    // } else {
    //   Logger.error({ errType: 'chat', err: { message: 'Failed to fetch chat channel', participantId } });
    // }
    // return newChannel;
  }

  async getChannel() {
    const {ownUserId, navigation} = this.props;
    const {
      participantId,
      pageId,
      ownersIds,
      channelId,
      entityId,
    } = navigation.state.params;
    let channel;
    if (channelId || entityId) {
      channel = await chatService.getChannelByChannelId({
        channelId: channelId || entityId,
        shouldWatch: true,
        shouldWatchPresence: true,
      });
    } else if (pageId) {
      channel = await chatService.getPageChannelOrCreate({
        participantId: ownUserId,
        pageId,
        ownersIds,
      });
    } else {
      channel = await chatService.getChannelOrCreate({
        participantId,
        channelId,
      });
    }
    return channel;
  }

  watchUserPresence() {
    const {client} = this.props;
    if (client) {
      client.on('user.presence.changed', this.handleUserPresenceChanged);
    }
  }

  handleUserPresenceChanged = ({user}) => {
    const {participantId} = this.props;
    if (user.id === participantId) {
      this.setState({participant: user});
    }
  };

  getChatStatus = async () => {
    // const { participantId, apiQuery } = this.props;
    // try {
    //   const res = await apiQuery({ query: { domain: 'users', key: 'getStatusWithFriendshipStatus', params: { chatUserIds: participantId } } });
    //   const { chatStatus } = res.data.data[participantId];
    //   const channelTab = [chatStatuses.BLOCKER, chatStatuses.BLOCKED_AND_BLOCKER].includes(chatStatus) ? chatTabTypes.BLOCKED : chatTabTypes.INBOX;
    //   const participantChannelTab = [chatStatuses.BLOCKED, chatStatuses.BLOCKED_AND_BLOCKER].includes(chatStatus) ? chatTabTypes.BLOCKED : null;
    //   LayoutAnimation.easeInEaseOut();
    //   this.setState({ channelTab, participantChannelTab });
    // } catch (err) {} // eslint-disable-line no-empty
  };

  getSubTitle = ({
    isOnline,
    memberLastSeenAt,
    participantChannelTab,
    userLocation,
  }) => {
    if (participantChannelTab === chatTabTypes.BLOCKED) {
      return '';
    }

    let subTitle = '';
    if (isOnline) {
      subTitle = 'Online now';
    } else if (memberLastSeenAt) {
      const lastSeenAtText = getLocaleTimeForFeed(memberLastSeenAt);
      subTitle += lastSeenAtText;
    }

    if (userLocation) {
      subTitle += ` · ${userLocation}`;
    }

    return subTitle;
  };

  sendHideBlockFromLS = async () => {
    const {apiCommand} = this.props;
    try {
      const localStorageTexts = (await chatLocalStorage.get()) || {};
      const lsWithoutHideBlock = {};
      let shouldUpdateLS = false;
      Object.keys(localStorageTexts).forEach((key) => {
        if (key.startsWith('hideBlockMessage')) {
          shouldUpdateLS = true;
          apiCommand('users.chatAllowUser', {chatParticipantId: key.slice(17)});
        } else {
          lsWithoutHideBlock[key] = localStorageTexts[key];
        }
      });
      shouldUpdateLS && chatLocalStorage.set(lsWithoutHideBlock);
    } catch (err) {} // eslint-disable-line no-empty
  };

  refreshChat = () =>
    this.setState(({refreshChatKey}) => ({refreshChatKey: refreshChatKey + 1}));

  navigateToParticipant = () => {
    const {participant} = this.state;
    if (participant.identityType === entityTypes.PAGE) {
      navigationService.navigate(screenNames.PageView, {
        entityId: participant.id,
      });
    } else {
      navigationService.navigateToProfile({
        entityId: participant.id,
        data: {
          id: participant.id,
          name: participant.name,
          themeColor: participant.themeColor,
          thumbnail: participant.image,
        },
      });
    }
  };

  openActionSheet = () => {
    // const { participant, channelTab } = this.state;
    // const { openActionSheet } = this.props;
    // const options = [
    //   {
    //     id: 'profile',
    //     text: I18n.t('chat.action_sheet.view_profile', { participantFullName: participant.name }),
    //     iconName: 'discover',
    //     shouldClose: true,
    //     action: this.navigateToParticipant
    //   }
    // ];
    // if (channelTab && channelTab !== chatTabTypes.PAGES) {
    //   const buttonText = channelTab === chatTabTypes.BLOCKED ? I18n.t('chat.action_sheet.unblock_user') : I18n.t('chat.action_sheet.block_user');
    //   options.push({
    //     id: 'block',
    //     text: buttonText,
    //     awesomeIconName: channelTab === chatTabTypes.BLOCKED ? 'unlock' : 'lock',
    //     awesomeIconSize: 15,
    //     shouldClose: true,
    //     action: this.toggleChatUserBlocking
    //   });
    // }
    // const data = {
    //   options,
    //   hasCancelButton: true
    // };
    // openActionSheet(data);
  };

  toggleChatUserBlocking = async (type = 'block') => {
    const {channelTab} = this.state;
    const {
      participantId,
      participantName,
      apiCommand,
      onTabChange,
    } = this.props;
    const action =
      channelTab === chatTabTypes.BLOCKED ? 'chatUnblockUser' : 'chatBlockUser';
    const newChannelTabState =
      channelTab === chatTabTypes.BLOCKED
        ? chatTabTypes.INBOX
        : chatTabTypes.BLOCKED;

    Platform.OS !== 'android' && LayoutAnimation.easeInEaseOut();
    this.setState({channelTab: newChannelTabState});
    await apiCommand(`users.${action}`, {chatParticipantId: participantId});
    // analytics.actionEvents.conversationBlockSubmission({ type, participantId, participantName }).dispatch();
    onTabChange && onTabChange();
  };

  handleAllowClick = async () => {
    const {participantId, apiCommand, onTabChange} = this.props;
    LayoutAnimation.easeInEaseOut();
    this.setState({channelTab: chatTabTypes.INBOX});
    await apiCommand('users.chatAllowUser', {chatParticipantId: participantId});
    onTabChange && onTabChange();
  };

  shouldShowMentionSearch = ({results, isSearching}) =>
    !!results && (!!results.length || isSearching);
}

Chat.propTypes = {
  navigation: PropTypes.object,
  user: PropTypes.object,
  isOnline: PropTypes.bool,
  ownUserId: PropTypes.string,
  client: PropTypes.object,
  // apiQuery: PropTypes.func,
  // apiCommand: PropTypes.func,
  // openActionSheet: PropTypes.func,
  participantId: PropTypes.string,
  participantName: PropTypes.string,
  onTabChange: PropTypes.func,
  searchMentions: searchMentionsScheme,
};

const mapStateToProps = (state, ownProps) => {
  const {participantId, participantName} = ownProps.navigation.state.params;

  return {
    isOnline: get(state, 'general.isOnline'),
    user: state.auth.user,
    client: get(state, 'inbox.client'),
    ownUserId: state.auth.user.id,
    participantId,
    participantName,
    searchMentions: state.mentions.searchMentions,
  };
};

const mapDispatchToProps = {
  // apiQuery,
  // apiCommand,
  // openActionSheet
};

Chat = connect(mapStateToProps, mapDispatchToProps)(Chat);
Chat = Screen()(Chat);

export default Chat;
