import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Clipboard,
} from 'react-native';
import {connect} from 'react-redux';
// import { openActionSheet } from '/redux/general/actions';
import I18n from '../../../infra/localization';
import {
  View,
  Text,
  Avatar,
  Image,
  LoadingBackground,
  TranslatedText,
} from '../../../components/basicComponents';
// import { VideoThumbnail } from '/components/media';
import {HtmlTextWithLinks} from '../../../components';
import {AwesomeIcon} from '../../../assets/icons';
import {flipFlopColors} from '../../../vars';
import {get} from '../../../infra/utils';
import {isOnlyEmoji} from '../../../infra/utils/stringUtils';
import {getTimeOrDateIfNotToday} from '../../../infra/utils/dateTimeUtils';
import {navigationService} from '../../../infra/navigation';
// import chatService from '/infra/chat/chatService';
// import { analytics } from '/infra/reporting';
import {
  screenNames,
  chatMessageStatuses,
  entityTypes,
} from '../../../vars/enums';
import {userScheme} from '../../../schemas';
import InteractionMessageHeader from './InteractionMessageHeader';
import messageActionSheetDefinitions from './messageActionSheetDefinitions';

const MAX_IMAGE_HEIGHT = 300;
const MIN_IMAGE_HEIGHT = 150;
const MEDIA_MARGINS = 68;
const MAX_VIDEO_THUMBNAIL_HEIGHT = 180;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    marginTop: 7,
    marginRight: 55,
  },
  myMessageContainer: {
    flexDirection: 'row-reverse',
    marginLeft: 10,
  },
  firstMessageContainer: {
    marginTop: 15,
  },
  failedMessageIcon: {
    color: flipFlopColors.red,
    fontSize: 18,
    alignSelf: 'center',
    marginLeft: 8,
  },
  contentWrapper: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  myContentWrapper: {
    backgroundColor: flipFlopColors.paleGreyTwo,
    borderColor: flipFlopColors.paleGreyTwo,
  },
  othersContentWrapper: {
    marginHorizontal: 10,
    backgroundColor: flipFlopColors.white,
    borderColor: flipFlopColors.b90,
  },
  noAvatarOthersContentWrapper: {
    marginLeft: 55,
  },
  textContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  failedMessageTextContainer: {
    backgroundColor: flipFlopColors.paleRed,
  },
  unsyncedMessageTextContainer: {
    backgroundColor: flipFlopColors.paleGreyTwo,
  },
  text: {
    fontSize: 16,
    lineHeight: 19,
    color: flipFlopColors.realBlack,
  },
  verboseText: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 14,
    color: flipFlopColors.b60,
    marginTop: 5,
  },
  failedMessageText: {
    textAlign: 'right',
    paddingHorizontal: 12,
  },
  avatar: {
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  myImage: {
    backgroundColor: flipFlopColors.paleGreyTwo,
  },
  othersImage: {
    backgroundColor: flipFlopColors.white,
  },
  interactionText: {
    backgroundColor: flipFlopColors.transparent,
  },
});

class Message extends Component {
  state = {
    showVerbose: false,
    isHidden: (this.props.message.hideForUsers || []).includes(
      this.props.ownUserId,
    ),
  };

  render() {
    const {showVerbose, isHidden} = this.state;
    const {message, groupStyles, handleRetry} = this.props;
    const {attachments, html, text, status, interaction = {}} = message;
    const hasText = !!(html || text);
    const hasMedia = !!attachments[0];

    if (isHidden || (!hasText && !hasMedia)) {
      return null;
    }

    const isFailed = status === chatMessageStatuses.FAILED;
    const shouldShowAvatar =
      !this.isMe &&
      (groupStyles[0] === 'single' || groupStyles[0] === 'bottom');

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={
            isFailed ? () => handleRetry(message) : this.toggleVerboseMode
          }
          activeOpacity={1}
          onLongPress={this.showActionSheet}
          testID="chatMessage">
          <View
            style={[
              styles.messageContainer,
              this.isMe && styles.myMessageContainer,
              shouldShowAvatar && styles.firstMessageContainer,
            ]}>
            {shouldShowAvatar && (
              <Avatar
                size="medium1"
                entityId={this.actor.id}
                entityType={this.actor.identityType || entityTypes.USER}
                name={this.actor.name}
                thumbnail={this.actor.image}
                linkable
                style={styles.avatar}
              />
            )}
            {isFailed && (
              <AwesomeIcon
                name="exclamation-circle"
                style={styles.failedMessageIcon}
              />
            )}
            <View
              style={[
                styles.contentWrapper,
                this.isMe
                  ? styles.myContentWrapper
                  : styles.othersContentWrapper,
                !this.isMe &&
                  !shouldShowAvatar &&
                  styles.noAvatarOthersContentWrapper,
              ]}>
              {!!interaction.type && this.renderInteractionHeader()}
              {hasMedia && this.renderMedia()}
              {hasText && this.renderText()}
            </View>
          </View>
          {showVerbose && this.renderDetails()}
          {!!isFailed && (
            <TranslatedText
              color={flipFlopColors.red}
              style={styles.failedMessageText}>
              {I18n.t('chat.failed_message_warning')}
            </TranslatedText>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  renderText = () => {
    const {message} = this.props;
    const {html, text, status} = message;
    const {interaction = {}} = message;
    const {type: interactionType} = interaction;
    const textToRender = html
      ? html.trim().replace(/(?!^)<br\/>/gm, '\n')
      : text.trim();
    const isFailed = status === chatMessageStatuses.FAILED;
    const isSending = status === chatMessageStatuses.SENDING;
    const isEmojiOnly = isOnlyEmoji(text);
    return (
      <View
        style={[
          styles.textContainer,
          isFailed && styles.failedMessageTextContainer,
          this.isMe && !isSending && styles.unsyncedMessageTextContainer,
          interactionType && styles.interactionText,
        ]}>
        {isEmojiOnly ? (
          <Text
            size={50}
            lineHeight={60}
            onLongPress={this.showActionSheet}
            testID="chatMessageText">
            {text}
          </Text>
        ) : (
          <HtmlTextWithLinks
            text={textToRender}
            showFullText
            textStyle={styles.text}
            onLongPress={this.showActionSheet}
            testID="chatMessageText"
          />
        )}
      </View>
    );
  };

  renderMedia = () => {
    const type = get(this.props, 'message.attachments[0].type');
    switch (type) {
      case 'image':
        return this.renderImage();
      case 'video':
        return this.renderVideo();
      default:
        return null;
    }
  };

  renderVideo = () => {
    const {message} = this.props;
    const attachment = get(message, 'attachments.0');
    const {
      type,
      asset_url: url,
      thumb_url: thumbnail,
      ratio,
      status: videoStatus,
      duration,
      videoId,
      customMessageId,
    } = attachment;
    if (!url) {
      return null;
    }

    return (
      <View style={this.isMe && styles.myImage}>
        <LoadingBackground />
        {/* <VideoThumbnail media={{ type, url, thumbnail, ratio, videoStatus, duration, videoId, customMessageId }} width={this.mediaWidth} maxHeight={MAX_VIDEO_THUMBNAIL_HEIGHT} /> */}
      </View>
    );
  };

  renderImage = () => {
    const {message} = this.props;
    const {image_url, thumb_url, ratio} = get(message, 'attachments.0'); // eslint-disable-line camelcase
    const imageUrl = image_url || thumb_url; // eslint-disable-line camelcase

    if (!imageUrl) {
      return null;
    }

    const imageHeight = ratio
      ? this.calculateImageHeight({mediaWidth: this.mediaWidth, ratio})
      : MIN_IMAGE_HEIGHT;

    return (
      <View style={this.isMe && styles.myImage}>
        <TouchableOpacity
          onPress={() => this.navigateToMediasPage({imageUrl, ratio})}
          activeOpacity={1}>
          <View style={{width: this.mediaWidth, height: imageHeight}}>
            <LoadingBackground />
            <Image
              style={[
                this.isMe ? styles.myImage : styles.othersImage,
                {width: this.mediaWidth, height: imageHeight},
              ]}
              source={{uri: imageUrl}}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  renderDetails() {
    const {message, channel, ownUserId} = this.props;
    const {created_at: createdAt, user} = message;
    let text = getTimeOrDateIfNotToday(createdAt);
    // if (chatService.isPageChannel({ channel }) && chatService.isActorPageOwner({ message, channel })) {
    //   const { channelCreatorId } = chatService.getPageChannelEntityIds({ channel });
    //   if (ownUserId !== channelCreatorId) {
    //     text += ` • ${I18n.t('chat.message.sent_by', { name: user.name })}`;
    //   }
    // }
    return <TranslatedText style={styles.verboseText}>{text}</TranslatedText>;
  }

  renderInteractionHeader() {
    const {channel, message} = this.props;
    const members = get(channel, 'state.members', {});
    const recipientId = Object.keys(members).find(
      (userId) => userId !== this.actor.id,
    );
    const recipient = get(members, `${recipientId}.user`, {});

    return (
      <InteractionMessageHeader
        interaction={message.interaction}
        recipient={recipient}
        mediaWidth={this.mediaWidth}
      />
    );
  }

  //   isActorPageOwner = chatService.isPageChannel({ channel: this.props.channel }) && chatService.isActorPageOwner({ message: this.props.message, channel: this.props.channel });

  isMe =
    this.props.isMyMessage(this.props.message) ||
    (this.isActorPageOwner &&
      chatService.isPageOwner({
        channel: this.props.channel,
        userId: this.props.ownUserId,
      }));

  //   actor = this.isActorPageOwner ? chatService.getPage({ channel: this.props.channel }) : this.props.message.user;

  mediaWidth = Dimensions.get('window').width - MEDIA_MARGINS - 30;

  navigateToMediasPage = ({imageUrl, ratio}) => {
    navigationService.navigate(screenNames.MediaGalleryModal, {
      medias: [{type: 'image', url: imageUrl, ratio}],
      transition: {
        fade: true,
      },
    });
  };

  calculateImageHeight = ({mediaWidth, ratio}) => {
    const fullImageHeight = mediaWidth / ratio;
    if (fullImageHeight > MAX_IMAGE_HEIGHT) {
      return MAX_IMAGE_HEIGHT;
    } else if (fullImageHeight < MIN_IMAGE_HEIGHT) {
      return MIN_IMAGE_HEIGHT;
    }
    return fullImageHeight;
  };

  toggleVerboseMode = () => {
    this.setState(({showVerbose}) => ({showVerbose: !showVerbose}));
  };

  navigateToPostPage = (entityId) => () => {
    navigationService.navigate(screenNames.PostPage, {entityId});
  };

  //   showActionSheet = () =>
  //     this.props.openActionSheet(messageActionSheetDefinitions({ hasText: !!this.props.message.text, onCopy: this.copyText, onHide: this.showDeleteActionSheet }));

  //   showDeleteActionSheet = () =>
  //     this.props.openActionSheet(
  //       messageActionSheetDefinitions({
  //         isDeleteMode: true,
  //         onHideConfirm: this.hideMessage
  //       })
  //     );

  copyText = () => Clipboard.setString(this.props.message.text);

  hideMessage = () => {
    // chatService.hideMessage({ messageId: this.props.message.id });
    // this.setState({ isHidden: true });
    // analytics.actionEvents.hideMessage().dispatch();
  };
}

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string,
    html: PropTypes.string,
    text: PropTypes.string,
    attachments: PropTypes.arrayOf(
      PropTypes.shape({
        image_url: PropTypes.string,
        thumb_url: PropTypes.string,
        type: PropTypes.string,
        asset_url: PropTypes.string,
        ratio: PropTypes.number,
        status: PropTypes.number,
        duration: PropTypes.number,
      }),
    ),
    user: userScheme,
    created_at: PropTypes.instanceOf(Date),
    interaction: PropTypes.object,
    status: PropTypes.string,
    hideForUsers: PropTypes.arrayOf(PropTypes.string),
  }),
  channel: PropTypes.object,
  groupStyles: PropTypes.arrayOf(PropTypes.string),
  isMyMessage: PropTypes.func,
  handleRetry: PropTypes.func,
  ownUserId: PropTypes.string,
  //   openActionSheet: PropTypes.func
};

const mapStateToDispatch = (state) => ({
  ownUserId: state.auth.user.id,
});

export default connect(mapStateToDispatch, {})(Message);
