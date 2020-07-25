import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {StyleSheet, TouchableOpacity} from 'react-native';
// import { withChannelContext } from 'stream-chat-react-native';
// import { clearMentionsList } from '/redux/mentions/actions';
import {mentionUtils} from '../../../components';
// import { analytics } from '/infra/reporting';
import I18n from '../../../infra/localization';
import {chat as chatLocalStorage} from '../../../infra/localStorage';
// import chatService from '/infra/chat/chatService';
import {get} from '../../../infra/utils';
import {View, Text, TextArea} from '../../../components/basicComponents';
import {flipFlopColors, uiConstants} from '../../../vars';
import ChatAttachmentsButtons from './ChatAttachmentsButtons';
import MessageIndicator from '../messageList/MessageIndicator';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: flipFlopColors.white,
  },
  offlineContainer: {
    backgroundColor: flipFlopColors.b97,
  },
  inputSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: flipFlopColors.b90,
  },
  textInput: {
    paddingTop: 0,
    padding: 0,
    lineHeight: 19,
    flex: 1,
    marginRight: 15,
  },
});

class ChatMessageInput extends Component {
  state = {
    text: '',
    isUploadingMedia: false,
    uploadIdsStatus: {},
  };

  render() {
    const {sendMessage, isDisabled, isInitKeyboardOpen, onLayout} = this.props;
    const {text, uploadIdsStatus, isUploadingMedia} = this.state;
    const typingUser = this.getTypingUser();

    return (
      <View onLayout={onLayout}>
        <MessageIndicator
          typingUser={typingUser}
          isUploadingMedia={isUploadingMedia}
        />
        <View style={[styles.container, isDisabled && styles.offlineContainer]}>
          <View style={[styles.inputSection]}>
            <TextArea
              editable={!isDisabled}
              onChange={this.handleFormChange}
              value={text}
              placeholder={I18n.t('chat.form_input_placeholder')}
              autoFocus={isInitKeyboardOpen}
              style={[styles.textInput]}
              defaultHeight={19}
              maxHeight={76}
              selectionColor={flipFlopColors.green}
              backgroundColor={flipFlopColors.transparent}
              testID="chatInput"
              withMentions
            />
            {!!text && (
              <TouchableOpacity
                onPress={!isDisabled ? this.handleFormSubmit : null}
                hitSlop={uiConstants.BTN_HITSLOP_15}
                testID="chatSubmitBtn">
                <Text
                  size={16}
                  lineHeight={19}
                  bold
                  color={
                    isDisabled ? flipFlopColors.b60 : flipFlopColors.green
                  }>
                  {I18n.t('chat.send_button')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {!text && (
            <ChatAttachmentsButtons
              uploadIdsStatus={uploadIdsStatus}
              onChangeUploadsState={this.changeUploadsStatus}
              onMessageSent={this.trackSendingMessage}
              sendMessage={sendMessage}
            />
          )}
        </View>
      </View>
    );
  }

  componentDidMount() {
    this.getLocalStorageText();
  }

  componentWillUnmount() {
    // const { clearMentionsList } = this.props;
    // clearMentionsList();
  }

  inputTimeOut = null;

  changeUploadsStatus = (nextState) => {
    this.setState(nextState);
  };

  trackSendingMessage = () => {
    // const { ownUser, participant, isPageChannel, channel } = this.props;
    // const { id } = participant;
    // const data = { senderId: ownUser.id, recipientId: id, conversationType: isPageChannel ? 'Page' : 'Private' };
    // if (isPageChannel) {
    //   const page = chatService.getPage({ channel });
    //   data.isSenderPageOwner = chatService.isPageOwner({ channel, userId: ownUser.id });
    //   data.pageName = get(page, 'name');
    //   data.pageId = get(page, 'id');
    // }
    // analytics.actionEvents.chatMessageAction(data).dispatch();
  };

  handleFormChange = (text) => {
    const {channel} = this.props;
    this.debouncedSetLocalStorageValue(text);
    this.setState({text});
    channel.keystroke();
  };

  handleFormSubmit = () => {
    // const { channel, sendMessage, isFromContext, mentionsList, clearMentionsList } = this.props;
    // const { text } = this.state;
    // const textWithMentions = text ? mentionUtils.getTrimmedTextWithMentionLinks(text, mentionsList) : '';
    // const message = { text: textWithMentions };
    // if (isFromContext) {
    //   message.isFromContext = true;
    // }
    // try {
    //   this.setState({ text: '' });
    //   clearTimeout(this.inputTimeOut);
    //   sendMessage(message);
    //   this.trackSendingMessage();
    //   chatLocalStorage.update({ [channel.id]: '' });
    //   clearMentionsList();
    // } catch (err) {
    //   console.log('Failed! \n ', err);
    // }
  };

  debouncedSetLocalStorageValue = (text) => {
    clearTimeout(this.inputTimeOut);
    this.inputTimeOut = setTimeout(() => this.setLocalStorageValue(text), 1000);
  };

  getLocalStorageText = async () => {
    const {channel} = this.props;
    try {
      const localStorageTexts = await chatLocalStorage.get();
      const value = localStorageTexts[channel.id];
      if (value && value.length) {
        this.setState({text: value});
      }
    } catch (err) {} // eslint-disable-line no-empty
  };

  setLocalStorageValue = (text) => {
    const {channel} = this.props;
    chatLocalStorage.update({[channel.id]: text});
  };

  getTypingUser() {
    //     const { isPageChannel, channel, ownUser, participant } = this.props;
    //     const { typing } = channel.state;
    //     const typersIds = Object.keys(typing).filter((id) => id !== ownUser.id);
    //     if (!typersIds.length) {
    //       return null;
    //     }
    //     if (isPageChannel && !typersIds.includes(participant.id) && chatService.isPageOwner({ channel, userId: ownUser.id })) {
    //       return { ...typing[typersIds[0]].user, shouldDisplayName: true };
    //     } else {
    //       return participant;
    //     }
  }
}

ChatMessageInput.propTypes = {
  participant: PropTypes.object,
  ownUser: PropTypes.object,
  isDisabled: PropTypes.bool,
  channel: PropTypes.object,
  sendMessage: PropTypes.func,
  isInitKeyboardOpen: PropTypes.bool,
  isFromContext: PropTypes.bool,
  isPageChannel: PropTypes.bool,
  mentionsList: PropTypes.array,
  onLayout: PropTypes.func,
  //   clearMentionsList: PropTypes.func
};

const mapStateToProps = (state) => ({
  mentionsList: state.mentions.mentionsList,
});

const mapDispatchToProps = {
  //   clearMentionsList
};

// ChatMessageInput = withChannelContext(ChatMessageInput);
ChatMessageInput = connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(ChatMessageInput);
export default ChatMessageInput;
