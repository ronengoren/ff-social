import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
// import { Chat, ChannelList, ChannelListMessenger, InfiniteScrollPaginator } from 'stream-chat-react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// import { getChatStatus } from '/redux/inbox/actions';
import images from '../../../assets/images';
import {View, Spinner} from '../../../components/basicComponents';
import {ConversationListsLoadingState} from '../../../components/loaders';
import {ErrorDefault} from '../../../components/errorBoundaries//../../components/errorBoundaries/errorScreens';
import {ItemErrorBoundary} from '../../../components';
import {EmptyList} from '../../../components/emptyState';
// import chatService from '/infra/chat/chatService';
import {get, debounce, uniqBy, uniqWith, isEqual} from '../../../infra/utils';
import {navigationService} from '../../../infra/navigation';
// import { Logger } from '/infra/reporting';
import I18n from '../../../infra/localization';
import {commonStyles, flipFlopColors} from '../../../vars';
import {screenNames, chatTabTypes} from '../../../vars/enums';
import ConversationItem from './ConversationItem';
import InboxEmptyList from './EmptyList';
import PageFilter from './PageFilter';

const styles = StyleSheet.create({
  emptyList: {
    backgroundColor: flipFlopColors.white,
  },
  emptyListImage: {
    width: 176,
    height: 198,
    right: -30,
  },
});

class ConversationsList extends Component {
  state = {
    refreshConversationsKey: 0,
    isNotificationsCtaVisible: false,
    filterByMember: null,
  };

  render() {
    const {filterByMember} = this.state;
    const {client, userId, activeTab, isUnreadSort, pagesCount} = this.props;
    // const filters = chatService.getFiltersByTab({ tab: activeTab, userId, filterByMember });
    let sort = {last_message_at: -1};
    let options = {message_limit: 1, limit: 30, presence: true};
    if (isUnreadSort) {
      sort = {has_unread: -1};
      options = {message_limit: 1, limit: 30, presence: true};
    }

    if (!client || !client.userID) {
      return (
        <View style={commonStyles.flex1}>
          <Spinner />
        </View>
      );
    }

    return (
      <React.Fragment>
        {pagesCount > 1 && (
          <PageFilter
            value={filterByMember}
            onChange={(val) => this.setState({filterByMember: val})}
          />
        )}
        {/* <Chat client={client}>
          <ChannelList
            List={ChannelListMessenger}
            Preview={(props) => (
              <ItemErrorBoundary boundaryName="conversationItem">
                <ConversationItem {...props} onMount={this.handleItemMount} onTabChange={props.retry} tab={activeTab} />
              </ItemErrorBoundary>
            )}
            Paginator={(props) => <InfiniteScrollPaginator threshold={300} {...props} />}
            LoadingIndicator={ConversationListsLoadingState}
            EmptyStateIndicator={this.renderEmptyState}
            LoadingErrorIndicator={this.renderErrorState}
            filters={filters}
            sort={sort}
            options={options}
            loadMoreThreshold={4}
            onSelect={this.navigateToChat}
            onAddedToChannel={() => {}} // overriding Stream native behaviour which adds new channels from any tab
            onMessageNew={this.handleNewMessage}
            onChannelUpdated={this.handleChannelUpdated}
          />
        </Chat> */}
      </React.Fragment>
    );
  }

  componentDidMount() {
    this.initConversations();
  }

  //   componentDidUpdate(prevProps, prevState) {
  //     const { userId, client, activeTab } = this.props;
  //     const hasUserChanged = userId && userId !== prevProps.userId;
  //     const hasStreamUser = !!get(client, 'userID', false);
  //     if (hasUserChanged || !hasStreamUser) {
  //       this.initConversations();
  //     }
  //     if (activeTab === chatTabTypes.REQUESTS && prevState.activeTab !== chatTabTypes.REQUESTS) {
  //       setTimeout(() => chatService.markTabAsRead({ tab: chatTabTypes.REQUESTS }), 3000);
  //     }
  //   }

  onNotificationDialogChange = (isVisible) => {
    this.setState({isNotificationsCtaVisible: isVisible});
  };

  chatStatusesToFetch = [];

  renderErrorState = ({error, retry}) => {
    // const { refreshConversationsKey } = this.state;
    // Logger.error({ errType: 'chat', err: { screen: 'ConversationsList', message: 'ChannelList failed', trialCount: refreshConversationsKey + 1, error } });
    // if (!refreshConversationsKey) {
    //   retry && retry();
    //   this.setState({ refreshConversationsKey: 1 });
    // }
    // return <ErrorDefault onRefresh={retry} />;
  };

  renderEmptyState = () => {
    const {activeTab} = this.props;
    switch (activeTab) {
      case chatTabTypes.PAGES:
        return (
          <EmptyList
            title={I18n.t(
              'communication_center.conversations.empty_states.pages.header',
            )}
            imageSrc={images.chat.noMessages}
            imageStyle={styles.emptyListImage}
            style={styles.emptyList}
          />
        );
      case chatTabTypes.REQUESTS:
        return (
          <EmptyList
            title={I18n.t(
              'communication_center.conversations.empty_states.requests.header',
            )}
            iconName="envelope"
            iconSize={45}
            style={styles.emptyList}
          />
        );
      case chatTabTypes.BLOCKED:
        return (
          <EmptyList
            title={I18n.t(
              'communication_center.conversations.empty_states.blocked.header',
            )}
            iconName="block"
            iconSize={40}
            style={styles.emptyList}
          />
        );
      case chatTabTypes.INBOX:
      default:
        return (
          <InboxEmptyList
            isNotificationsCtaVisible={this.state.isNotificationsCtaVisible}
          />
        );
    }
  };

  async initConversations() {
    // const { client, userId } = this.props;
    // if (!client || !client.userID) {
    //   await chatService.init(userId);
    // }
  }

  handleNewMessage = async (ChannelList, event) => {
    // const { userId, activeTab } = this.props;
    // const channel = await chatService.getChannelByChannelId({ channelId: event.channel.id, shouldWatch: true });
    // if (channel.data[`${userId}_tab`] === activeTab) {
    //   // This is stream-chat-react-native handler for a new message
    //   // We want this only if it's relevant to this tab
    //   ChannelList.setState((prevState) => ({
    //     channels: uniqBy([channel, ...prevState.channels], 'cid'),
    //     channelIds: uniqWith([channel.id, ...prevState.channelIds], isEqual),
    //     offset: prevState.offset + 1
    //   }));
    // }
  };

  handleChannelUpdated = (ChannelList, event) => {
    const {userId, activeTab} = this.props;

    if (event.channel[`${userId}_tab`] !== activeTab) {
      if (ChannelList._unmounted) return;
      ChannelList.setState((prevState) => {
        const channels = prevState.channels.filter(
          (channel) => channel.cid !== event.channel.cid,
        );
        const channelIds = prevState.channelIds.filter(
          (cid) => cid !== event.channel.cid,
        );
        return {
          channels,
          channelIds,
        };
      });
    }
  };

  handleItemMount = (participantId) => {
    // this.chatStatusesToFetch.push(participantId);
    // this.getChatStatus();
  };

  getChatStatus = debounce(() => {
    // const { getChatStatus } = this.props;
    // getChatStatus({ userIds: this.chatStatusesToFetch });
    // this.chatStatusesToFetch = [];
  }, 500);

  navigateToChat = (channel) => {
    const {userId: ownUserId} = this.props;
    // const participant = chatService.getParticipant({ channel, ownUserId });
    navigationService.navigate(screenNames.Chat, {
      participantId: participant.id,
      participantName: participant.name,
      participantAvatar: participant.image,
      isInitComposeMode: false,
      channelId: channel.cid,
    });
  };
}

ConversationsList.propTypes = {
  userId: PropTypes.string,
  client: PropTypes.object,
  //   getChatStatus: PropTypes.func,
  activeTab: PropTypes.oneOf(Object.values(chatTabTypes)),
  isUnreadSort: PropTypes.bool,
  pagesCount: PropTypes.number,
};

const mapStateToProps = (state) => ({
  //   userId: state.auth.user.id,
  client: get(state, 'inbox.client'),
});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ConversationsList);
