import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {SwipeRow} from 'react-native-swipe-list-view';
// import { openActionSheet } from '/redux/general/actions';
import I18n from '../../../infra/localization';
import {View, Text, Avatar} from '../../../components/basicComponents';
// import { HtmlTextWithLinks } from '/components';
import {AwesomeIcon} from '../../../assets/icons';
import {
  flipFlopColors,
  flipFlopFontsWeights,
  commonStyles,
} from '../../../vars';
import {
  avatarBadgePosition,
  chatStatuses,
  chatInteractioDefinitions,
  chatTabTypes,
} from '../../../vars/enums';
import {isRTL} from '../../../infra/utils/stringUtils';
import {getLocaleTimeForFeed} from '../../../infra/utils/dateTimeUtils';
// import chatService from '/infra/chat/chatService';
import {InteractionIcon} from '../../../components/interactions';
import {get} from '../../../infra/utils';
import hideActionSheetDefinitions from './hideActionSheetDefinitions';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 90,
    alignItems: 'center',
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: flipFlopColors.veryLightPink,
    backgroundColor: flipFlopColors.white,
  },
  image: {
    marginRight: 15,
  },
  content: {
    flex: 1,
    paddingTop: 5,
    paddingRight: 8,
  },
  conversationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  readText: {
    color: flipFlopColors.b60,
  },
  unreadText: {
    color: flipFlopColors.realBlack,
    fontWeight: flipFlopFontsWeights.bold,
  },
  participantText: {
    flex: 1,
    marginRight: 15,
  },
  sentAtText: {
    marginTop: 6,
    flex: 0,
  },
  textWrapper: {
    flexDirection: 'row',
    height: 20,
  },
  htmlText: {
    fontSize: 16,
  },
  unreadIndicator: {
    alignSelf: 'center',
    width: 5,
    height: 5,
    marginHorizontal: 10,
    borderRadius: 22.5,
    backgroundColor: flipFlopColors.pinkishRed,
  },
  imageMessage: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageMessageIcon: {
    marginRight: 5,
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hidden: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  hiddenBtn: {
    backgroundColor: flipFlopColors.red,
    height: 90,
    width: 80,
    paddingHorizontal: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hideConversationIcon: {
    marginBottom: 9,
  },
});

class ConversationItem extends Component {
  state = {
    isHidden: false,
  };

  render() {
    const {isHidden} = this.state;
    const {
      channel,
      ownUserId,
      participant,
      chatStatus,
      setActiveChannel,
    } = this.props;

    if (isHidden || !participant || participant.locked) {
      return null;
    }

    const lastMessage = [...channel.state.messages]
      .reverse()
      .find((message) => !(message.hideForUsers || []).includes(ownUserId));
    if (!lastMessage) {
      return null;
    }
    const interaction = get(channel, 'data.interaction') || {};
    const {type: interactionType} = interaction;
    const canShowOnlineStatus = chatStatus === chatStatuses.NOT_BLOCKED;

    const isLastMessegerMe = lastMessage.user.id === ownUserId;
    // const isLastMessageRead = chatService.getUnreadCount({ channel, userId: ownUserId }) === 0;
    const textStyle = isLastMessageRead ? styles.readText : styles.unreadText;

    return (
      <SwipeRow rightOpenValue={-80}>
        {this.renderHiddenBtn()}
        <TouchableOpacity
          onPress={() => setActiveChannel(channel)}
          activeOpacity={1}
          style={styles.container}
          key={channel.id}
          testId="conversationItem">
          <Avatar
            size="medium2"
            style={styles.image}
            entityId={''}
            entityType="user"
            thumbnail={participant.image}
            name={participant.name}
            showBadge={canShowOnlineStatus && participant.online}
            badgePosition={avatarBadgePosition.BOTTOM}
            badgeColor={flipFlopColors.green}
            linkable={false}
          />
          <View style={styles.content}>
            <View style={styles.conversationDetails}>
              <Text
                style={styles.participantText}
                numberOfLines={1}
                bold={!isLastMessageRead}
                size={16}
                lineHeight={19}
                color={
                  isLastMessageRead
                    ? flipFlopColors.b30
                    : flipFlopColors.realBlack
                }
                testID="conversationParticipantName">
                {participant.name
                  ? participant.name
                  : I18n.t(
                      'communication_center.conversations.default_user_name',
                    )}
              </Text>
            </View>

            <View style={styles.textWrapper}>
              {isLastMessegerMe && (
                <Text style={textStyle} size={16} lineHeight={19}>
                  {I18n.t('communication_center.conversations.my_message')}
                </Text>
              )}
              {this.renderMessage({
                message: lastMessage,
                isUnread: !isLastMessageRead,
              })}
            </View>
            {this.renderDetails(lastMessage)}
          </View>

          <View style={styles.indicators}>
            {!!interactionType &&
              this.renderInteractionTypeIndication(interactionType)}
            {!isLastMessageRead && <View style={styles.unreadIndicator} />}
          </View>
        </TouchableOpacity>
      </SwipeRow>
    );
  }

  //   componentDidMount() {
  //     const { participant, onMount } = this.props;
  //     onMount(participant.id);
  //   }

  //   componentWillUnmount() {
  //     const { channel } = this.props;
  //     chatService.removeNewMessageListener({ channelId: channel.cid });
  //   }

  renderHiddenBtn = () => (
    <View style={styles.hidden}>
      <TouchableOpacity
        style={styles.hiddenBtn}
        onPress={this.showHideConversationModal}>
        <AwesomeIcon
          name="trash-alt"
          size={20}
          color={flipFlopColors.white}
          style={styles.hideConversationIcon}
        />
        <Text color={flipFlopColors.white}>
          {I18n.t('communication_center.conversations.hide.button')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  renderMessage = ({message, isUnread}) => {
    // const { attachments, html, text } = message;
    // const imageUrl = get(attachments, '0.image_url');
    // if (imageUrl) {
    //   return this.renderImagePlaceholder({ isUnread });
    // } else {
    //   return this.renderHTML({ html: html || text, isUnread });
    // }
  };

  renderInteractionTypeIndication = (interactionType) => {
    const {
      iconColor,
      iconName,
      iconSize,
      isBoardsInteraction,
    } = chatInteractioDefinitions[interactionType];
    return (
      <InteractionIcon
        iconSize={iconSize}
        iconName={iconName}
        iconColor={iconColor}
        buttonSize={40}
        withShadow
        withBorder
        isBoardsInteraction={isBoardsInteraction}
      />
    );
  };

  renderImagePlaceholder({isUnread}) {
    const color = isUnread ? flipFlopColors.realBlack : flipFlopColors.b60;
    const textStyle = isUnread ? styles.unreadText : styles.readText;

    return (
      <View style={styles.imageMessage}>
        <AwesomeIcon
          name="camera"
          size={14}
          color={color}
          weight="solid"
          style={styles.imageMessageIcon}
        />
        <Text size={16} lineHeight={19} style={textStyle}>
          {I18n.t('communication_center.conversations.image_message')}
        </Text>
      </View>
    );
  }

  //   renderHTML({ html, isUnread }) {
  //     const htmlTextLineHeight = isRTL(html) ? 22 : 19;
  //     const textStyle = isUnread ? styles.unreadText : styles.readText;

  //     return (
  //       <HtmlTextWithLinks
  //         key={!!isUnread}
  //         wrapperStyle={commonStyles.flex1}
  //         text={html.trim()}
  //         numberOfLines={1}
  //         textStyle={[textStyle, styles.htmlText]}
  //         lineHeight={htmlTextLineHeight}
  //         showExpand={false}
  //         showTranslateButton={false}
  //       />
  //     );
  //   }

  renderDetails(lastMessage) {
    const {channel, tab} = this.props;
    const isPagesTab = tab === chatTabTypes.PAGES;
    // const page = isPagesTab && chatService.getPage({ channel });

    return (
      <Text
        style={styles.sentAtText}
        size={12}
        lineHeight={14}
        color={flipFlopColors.b60}
        numberOfLines={1}>
        {page && (
          <React.Fragment>
            <Text
              style={styles.sentAtText}
              size={12}
              lineHeight={14}
              color={flipFlopColors.green}>
              {page.name}
            </Text>
            {' • '}
          </React.Fragment>
        )}
        {getLocaleTimeForFeed(lastMessage.created_at)}
      </Text>
    );
  }

  showHideConversationModal = () => {
    // const { openActionSheet } = this.props;
    // openActionSheet(hideActionSheetDefinitions({ onHideConfirm: this.hideConversation }));
  };

  hideConversation = () => {
    // const {
    //   channel: { cid: channelId }
    // } = this.props;
    // chatService.hideConversation({ channelId });
    // this.setState({ isHidden: true });
    // chatService.addNewMessageListener({ channelId, cb: this.onNewMessage });
  };

  onNewMessage = () => {
    // const { channel } = this.props;
    // this.setState({ isHidden: false });
    // chatService.removeNewMessageListener({ channelId: channel.cid });
  };
}

ConversationItem.propTypes = {
  setActiveChannel: PropTypes.func,
  channel: PropTypes.object,
  ownUserId: PropTypes.string,
  chatStatus: PropTypes.number,
  participant: PropTypes.shape({
    id: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    online: PropTypes.bool,
    locked: PropTypes.bool,
  }),
  onMount: PropTypes.func,
  //   openActionSheet: PropTypes.func,
  tab: PropTypes.oneOf(Object.values(chatTabTypes)),
};

const mapStateToProps = (state, ownProps) => {
  //   const ownUserId = state.auth.user.id;
  //   const participant = chatService.getParticipant({ channel: ownProps.channel, ownUserId });
  //   return {
  //     ownUserId,
  //     chatStatus: get(state, `inbox.chatStatus[${participant.id}]`),
  //     participant
  //   };
};

export default connect(mapStateToProps, {})(ConversationItem);
