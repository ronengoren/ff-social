import React from 'react';
import PropTypes from 'prop-types';
import {StatusBar, StyleSheet, Platform, LayoutAnimation} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../../infra/localization';
import {Screen, Header} from '../../components';
import {
  View,
  Image,
  Text,
  DashedBorder,
  TextArea,
  KeyboardAvoidingView,
  NewTextButton,
} from '../../components/basicComponents';
import {AwesomeIcon} from '../../assets/icons';
import {isEmpty, get} from '../../infra/utils';
import {isRTL} from '../../infra/utils/stringUtils';
// import { analytics, Logger } from '/infra/reporting';
import {userScheme} from '../..//schemas';
import {showSnackbar} from '../../redux/general/actions';
// import { apiQuery } from '/redux/apiQuery/actions';
// import { apiCommand } from '/redux/apiCommands/actions';
import {navigationService} from '../../infra/navigation';
import images from '../../assets/images';
import {
  snackbarTypes,
  postTypes,
  chatInteractioDefinitions,
  chatStatuses,
  chatTabTypes,
} from '../../vars/enums';
import {commonStyles, flipFlopColors} from '../../vars';
import {PostContentMeta} from '../../components/posts';

const BTN_ICON_MARGIN = 7;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  content: {
    padding: 15,
    flex: 1,
    flexDirection: 'column',
  },
  interactionBox: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  interactionBoxRtl: {
    flexDirection: 'row-reverse',
  },
  interactionHeaderRtl: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 15,
  },
  interactionHeader: {
    flex: 1,
    marginLeft: 15,
  },
  mediaWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: flipFlopColors.white,
    borderColor: flipFlopColors.b97,
    borderWidth: 1,
  },
  upperIcon: {
    position: 'absolute',
  },
  dashedBorder: {
    marginTop: 20,
    marginBottom: 5,
  },
  textInput: {
    flex: 1,
    marginBottom: 15,
    padding: 0,
  },
  button: {
    shadowColor: flipFlopColors.paleGreen,
    borderColor: flipFlopColors.transparent,
    borderRadius: 10,
  },
  buttonIcon: {
    marginRight: BTN_ICON_MARGIN,
    color: flipFlopColors.white,
  },
  buttonText: {
    fontWeight: 'bold',
    color: flipFlopColors.white,
    fontSize: 16,
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
});

class ChatInteraction extends React.Component {
  state = {
    text: null,
    isSubmitting: false,
    channelTab: null,
    participantChannelTab: null,
  };

  render() {
    const {participant, interaction} = this.props;
    const {text, channelTab, participantChannelTab} = this.state;
    const {type: interactionType} = interaction;
    const firstName =
      get(participant, 'firstName') ||
      get(participant, 'name', '').split(' ')[0];
    const isHeaderRtl = isRTL(
      I18n.t(`chat.interactions.${interactionType}.interaction_screen.title`, {
        firstName,
      }),
    );

    const isChatEnabled =
      channelTab &&
      channelTab !== chatTabTypes.BLOCKED &&
      participantChannelTab !== chatTabTypes.BLOCKED;
    const hasText = text && text.trim();
    const isDisabled = !isChatEnabled || !hasText;

    const isBoardsInteraction = Object.values(postTypes).includes(
      interactionType,
    );
    const InteractionComponent = isBoardsInteraction
      ? this.renderBoardInteraction({interaction, isHeaderRtl, firstName})
      : this.renderChatInteractions({interaction, isHeaderRtl, firstName});

    return (
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.select({ios: 'padding', android: null})}>
        <StatusBar
          translucent
          barStyle="dark-content"
          backgroundColor="transparent"
        />
        <Header
          hasBackButton
          title={I18n.t(
            `chat.interactions.${interactionType}.interaction_screen.header_title`,
            {firstName},
          )}
          titleColor={flipFlopColors.b30}
          buttonColor="b30"
          backgroundColor={flipFlopColors.white}
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

        <View style={styles.content}>
          <View
            style={[
              styles.interactionBox,
              isHeaderRtl && styles.interactionBoxRtl,
            ]}>
            {InteractionComponent}
          </View>

          <DashedBorder style={styles.dashedBorder} />

          <TextArea
            onChange={this.handleFormChange}
            value={text}
            placeholder={I18n.t(
              `chat.interactions.${interactionType}.interaction_screen.input_placeholder`,
              {firstName},
            )}
            autoFocus
            style={styles.textInput}
            selectionColor={flipFlopColors.green}
            backgroundColor={flipFlopColors.transparent}
          />

          <View style={commonStyles.flexDirectionRow}>
            <NewTextButton
              iconName="paper-plane"
              onPress={!isDisabled ? this.handleFormSubmit : null}
              disabled={isDisabled}
              activeOpacity={0.75}
              iconSize={16}
              iconWeight="solid"
              iconStyle={styles.buttonIcon}
              style={styles.button}
              size={NewTextButton.sizes.BIG55}
              customColor={
                isDisabled ? flipFlopColors.paleGreen : flipFlopColors.green
              }
              textStyle={styles.buttonText}
              withShadow={!isDisabled}>
              {I18n.t(
                `chat.interactions.${interactionType}.interaction_screen.cta_button`,
              )}
            </NewTextButton>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  componentDidMount() {
    this.getChatStatus();
  }

  renderChatInteractions = ({interaction, isHeaderRtl, firstName}) => {
    const {type: interactionType} = interaction;
    const {iconName, iconColor} = chatInteractioDefinitions[interactionType];
    return (
      <React.Fragment>
        <View style={[styles.mediaWrapper, commonStyles.smallShadow]}>
          <AwesomeIcon
            name={iconName}
            size={35}
            color={iconColor}
            weight="solid"
          />
          <AwesomeIcon
            name={iconName}
            size={35}
            color={flipFlopColors.b30}
            weight="light"
            style={styles.upperIcon}
          />
        </View>

        <View
          style={
            isHeaderRtl ? styles.interactionHeaderRtl : styles.interactionHeader
          }>
          <Text size={22} lineHeight={32} color={flipFlopColors.b30} bold>
            {I18n.t(
              `chat.interactions.${interactionType}.interaction_screen.title`,
              {firstName},
            )}
          </Text>
          <Text size={18} lineHeight={22} color={flipFlopColors.b30}>
            {I18n.t(
              `chat.interactions.${interactionType}.interaction_screen.subtitle`,
            )}
          </Text>
        </View>
      </React.Fragment>
    );
  };

  renderBoardInteraction = ({interaction, isHeaderRtl}) => {
    const {entity, isPostPage} = this.props;
    const {type: interactionType} = interaction;
    const payload = get(entity, 'payload', {});
    const mediaUrl = get(payload, 'mediaGallery.[0].url');
    const imgSource = !isEmpty(mediaUrl)
      ? {uri: mediaUrl}
      : get(images, `entityImagePlaceholders.${interactionType}`);
    const title = get(payload, 'title');
    const price = get(payload, 'templateData.price');

    return (
      <React.Fragment>
        <View style={commonStyles.smallShadow}>
          <Image source={imgSource} style={styles.mediaWrapper} />
        </View>

        <View
          style={
            isHeaderRtl ? styles.interactionHeaderRtl : styles.interactionHeader
          }>
          <PostContentMeta
            withMarginTop={false}
            withBorderTop={false}
            isRtl={isHeaderRtl}
            tags={entity.tags}
            isPostPage={isPostPage}
            contentType={payload.postType}
            postSubType={payload.postSubType}
            context={entity.context}
            price={price}
          />
          <Text
            size={22}
            lineHeight={28}
            color={flipFlopColors.b30}
            bold
            numberOfLines={2}>
            {title}
          </Text>
        </View>
      </React.Fragment>
    );
  };

  handleFormChange = (text) => {
    this.setState({text});
  };

  handleFormSubmit = async () => {
    // const { channel, interaction, participant, ownUser, showSnackbar } = this.props;
    // const { text, isSubmitting } = this.state;
    // if (isSubmitting) {
    //   return;
    // }
    // const message = {
    //   text: text.trim(),
    //   isFromContext: true,
    //   interaction
    // };
    // try {
    //   this.setState({ isSubmitting: true });
    //   await channel.sendMessage(message);
    //   analytics.actionEvents.chatMessageAction({ senderId: ownUser.id, recipientId: participant.id }).dispatch();
    //   navigationService.goBack();
    //   showSnackbar({ snackbarType: snackbarTypes.CHAT, user: participant }, { dismissAfter: 5000 });
    // } catch (err) {
    //   this.setState({ isSubmitting: false });
    //   Logger.error({ errType: 'chat', err: { message: `Failed to send interaction from ${ownUser.id}, ownUserId - ${participant.id}` } });
    // }
  };

  getChatStatus = async () => {
    // const { participant, apiQuery } = this.props;
    // try {
    //   const res = await apiQuery({ query: { domain: 'users', key: 'getStatusWithFriendshipStatus', params: { chatUserIds: participant.id } } });
    //   const { chatStatus } = res.data.data[participant.id];
    //   const channelTab = [chatStatuses.BLOCKER, chatStatuses.BLOCKED_AND_BLOCKER].includes(chatStatus) ? chatTabTypes.BLOCKED : chatTabTypes.INBOX;
    //   const participantChannelTab = [chatStatuses.BLOCKED, chatStatuses.BLOCKED_AND_BLOCKER].includes(chatStatus) ? chatTabTypes.BLOCKED : null;
    //   LayoutAnimation.easeInEaseOut();
    //   this.setState({ channelTab, participantChannelTab });
    // } catch (err) {} // eslint-disable-line no-empty
  };

  toggleChatUserBlocking = async () => {
    const {channelTab} = this.state;
    const {participant, apiCommand} = this.props;
    const action =
      channelTab === chatTabTypes.BLOCKED ? 'chatUnblockUser' : 'chatBlockUser';
    const newChannelTabState =
      channelTab === chatTabTypes.BLOCKED
        ? chatTabTypes.INBOX
        : chatTabTypes.BLOCKED;

    LayoutAnimation.easeInEaseOut();
    this.setState({channelTab: newChannelTabState});
    await apiCommand(`users.${action}`, {chatParticipantId: participant.id});
  };
}

ChatInteraction.propTypes = {
  participant: userScheme,
  entity: PropTypes.object,
  interaction: PropTypes.object,
  channel: PropTypes.object,
  isPostPage: PropTypes.bool,
  //   showSnackbar: PropTypes.func,
  //   apiQuery: PropTypes.func,
  //   apiCommand: PropTypes.func,
  ownUser: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  ownUser: get(state, 'auth.user'),
  participant: get(ownProps.navigation, 'state.params.user'),
  entity: get(ownProps.navigation, 'state.params.entity', {}),
  interaction: get(ownProps.navigation, 'state.params.interaction', {}),
  channel: get(ownProps.navigation, 'state.params.channel'),
  isPostPage: get(ownProps.navigation, 'state.params.isPostPage'),
});

const mapDispatchToProps = {
  //   showSnackbar,
  //   apiQuery,
  //   apiCommand
};

ChatInteraction = connect(mapStateToProps, mapDispatchToProps)(ChatInteraction);
ChatInteraction = Screen()(ChatInteraction);

export default ChatInteraction;
