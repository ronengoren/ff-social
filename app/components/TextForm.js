import React, {Component} from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import {StyleSheet, Keyboard, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {
  TextArea,
  View,
  TextButton,
  IconButton,
  Image,
  BadgeIcon,
  ProgressBar,
  Avatar,
} from './basicComponents';
// import { NativeMediaPicker } from '/infra/media';
// import { upload, cancelUpload } from '/redux/uploads/actions';
// import { getOwnedPages } from '/redux/pages/actions';
import {flipFlopColors} from '../vars';
import {entityTypes, mediaTypes, screenStateTypes} from '../vars/enums';
import {getFilePathFromLocalUri, pick, get} from '../infra/utils';
import PostAsPicker from '../screens/post/PostEditor/pickers/PostAsPicker';
import postAs from '../infra/localStorage/postAs';
import {AwesomeIcon} from '../assets/icons';

const INITIAL_FORM_HEIGHT = 51;
const LINE_HEIGHT = 18.5;

const styles = StyleSheet.create({
  messageInputWrapper: {
    flex: 0,
    minHeight: INITIAL_FORM_HEIGHT,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 11,
    borderTopColor: flipFlopColors.disabledGrey,
    borderTopWidth: 1,
    backgroundColor: flipFlopColors.white,
  },
  postAsAvatar: {
    marginRight: 8,
  },
  postAsWrapper: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    maxWidth: 60,
    alignItems: 'center',
  },
  imagePickerWrapper: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 50,
  },
  imagePickerIcon: {
    position: 'relative',
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 50,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
    marginRight: 4,
    alignSelf: 'center',
  },
  messageInputFocus: {
    marginRight: 5,
  },
  submitButton: {
    marginHorizontal: 5,
  },
  submitTextButton: {
    marginVertical: 10,
    alignSelf: 'flex-end',
  },
  icon: {
    marginHorizontal: 5,
    alignSelf: 'center',
  },
  previewImage: {
    alignSelf: 'flex-end',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: flipFlopColors.greyB90,
    width: 40,
    height: 40,
  },
  removePreviewIcon: {
    top: -6,
  },
});

class TextForm extends Component {
  constructor(props) {
    super(props);

    this.maxFormHeight = LINE_HEIGHT * props.maxLines;

    this.state = {
      activeUploadId: null,
      localUri: null,
      submitted: false,
      resetAutoCorrect: false, // eslint-disable-line react/no-unused-state
      autoCorrect: true,
      screenState: screenStateTypes.COMPOSE,
      isPostAsPickerVisible: false,
      publishAs: {
        ...pick(this.props.user, [
          'id',
          'name',
          'media',
          'themeColor',
          'userType',
          'roles',
          'community',
        ]),
        entityType: entityTypes.USER,
        type: entityTypes.USER,
      },
      isFocus: false,
    };
  }

  render() {
    const {
      activeUploadId,
      screenState,
      isPostAsPickerVisible,
      publishAs,
      isFocus,
    } = this.state;
    const {
      form,
      placeholder,
      withMentions,
      withImage,
      autoFocus,
      uploads,
      user,
      pagesOwned,
    } = this.props;
    const {text} = form.state;
    const {localUri, autoCorrect} = this.state;
    // const upload = uploads[activeUploadId];
    // const isProgressBarShown = upload && screenState === screenStateTypes.UPLOAD;
    // const { entityType: publishAsEntityType, media: { thumbnail: publishAsThumbnail } = {}, name: publishAsName = '', id: publishAsEntityId } = publishAs;
    // const hasOwnedPages = !!get(pagesOwned, 'data.length', 0);

    return (
      <View>
        {isProgressBarShown && (
          <ProgressBar
            progress={upload.progress}
            color={flipFlopColors.green}
          />
        )}
        <View style={styles.messageInputWrapper}>
          {hasOwnedPages && (
            <TouchableOpacity
              onPress={this.openPostAsPicker}
              style={styles.postAsWrapper}>
              <Avatar
                style={styles.postAsAvatar}
                entityId={publishAsEntityId}
                size="medium1"
                name={publishAsName}
                entityType={publishAsEntityType}
                thumbnail={publishAsThumbnail}
                linkable={false}
              />
              <AwesomeIcon name={'caret-down'} weight={'solid'} />
            </TouchableOpacity>
          )}

          {isPostAsPickerVisible && (
            <PostAsPicker
              headerText={I18n.t('comment.comment_as')}
              selectedIds={publishAs ? [publishAs.id] : []}
              user={user}
              onClose={this.closePostPicker}
              onSelect={this.selectPostAs}
            />
          )}

          <TextArea
            style={[styles.messageInput, isFocus && styles.messageInputFocus]}
            onChange={this.onInputChanged}
            value={text}
            placeholder={placeholder}
            maxHeight={this.maxFormHeight}
            defaultHeight={25}
            ref={(node) => {
              this.textArea = node;
            }}
            spellCheck
            withMentions={withMentions}
            autoCorrect={autoCorrect}
            autoFocus={autoFocus}
            onFocus={this.onTextFocus}
          />
          <View style={styles.imagePickerWrapper}>
            <View style={styles.imagePickerIcon}>
              {withImage &&
                (localUri ? (
                  [
                    <Image
                      key="previewImage"
                      source={{uri: localUri}}
                      style={styles.previewImage}
                    />,
                    <BadgeIcon
                      key="previewImageBadge"
                      icon="close"
                      style={styles.removePreviewIcon}
                      onPress={this.removeImage}
                    />,
                  ]
                ) : (
                  <IconButton
                    iconSize={25}
                    name="camera"
                    style={styles.icon}
                    size="large"
                    onPress={this.handleCameraButtonPress}
                  />
                ))}
            </View>
          </View>

          <View style={styles.sendButtonWrapper}>{this.renderButton()}</View>
        </View>
      </View>
    );
  }

  static getDerivedStateFromProps(props, state) {
    // Fixing a bug that happens on Android with autocorrect keyboard. Looks like
    // the keyboard is not being reset after the text is cleared. so switching the autocorrect off
    // and then back on does the trick: https://github.com/facebook/react-native/pull/12462#issuecomment-298812731
    if (!props.form.state.text && state.resetAutoCorrect) {
      return {autoCorrect: false, resetAutoCorrect: false};
    } else if (!state.autoCorrect) {
      return {autoCorrect: true};
    }
    return null;
  }

  //   async componentDidMount() {
  //     const { updatedText, form } = this.props;

  //     if (updatedText && updatedText.length) {
  //       form.onChange({ text: updatedText });
  //     }

  //     const commentAs = await postAs.get();
  //     if (commentAs) {
  //       // eslint-disable-next-line react/no-did-mount-set-state
  //       this.setState({
  //         publishAs: commentAs
  //       });
  //     }

  //     if (!get(this.props, 'pagesOwned.loaded', false)) {
  //       this.props.getOwnedPages({ userId: this.props.user.id });
  //     }
  //   }

  componentDidUpdate(prevProps) {
    const {form, text, updatedText} = this.props;
    if (prevProps.text !== text) {
      form.onChange({text});
    }

    const isTextEmpty = !(prevProps.text && prevProps.text.length);
    if (isTextEmpty && prevProps.updatedText !== updatedText) {
      form.onChange({text: updatedText});
    }
  }

  closePostPicker = () => {
    this.setState({
      isPostAsPickerVisible: false,
    });
  };

  openPostAsPicker = () => {
    this.setState({
      isPostAsPickerVisible: true,
    });
  };

  selectPostAs = ({data}) => {
    this.setState({
      publishAs: data,
    });

    postAs.set(data);
  };

  renderButton() {
    const {form, btnIconName, btnText, forceDisable} = this.props;
    const {text} = form.state;
    const {localUri, submitted} = this.state;
    const isSubmitButtonDisabled =
      forceDisable || ((!text || !text.length) && !localUri) || submitted;

    if (btnText) {
      return (
        <TextButton
          size="medium"
          disabled={isSubmitButtonDisabled}
          style={styles.submitTextButton}
          onPress={this.handleSubmit}>
          {btnText}
        </TextButton>
      );
    }

    return (
      <IconButton
        name={btnIconName}
        iconColor={'green'}
        size="large"
        disabled={isSubmitButtonDisabled}
        onPress={this.handleSubmit}
        style={styles.submitButton}
      />
    );
  }

  onInputChanged = (text) => {
    const {form, onChange} = this.props;

    form.onChange({text});
    onChange && onChange(text);
  };

  onTextFocus = () => {
    this.setState({isFocus: true});
  };

  handleCameraButtonPress = async () => {
    // const { upload, onMediaChooseStart, onMediaChooseEnd } = this.props;
    // onMediaChooseStart && onMediaChooseStart();
    // const res = await NativeMediaPicker.show({ mediaType: mediaTypes.IMAGE });
    // onMediaChooseEnd && onMediaChooseEnd();
    // if (!res) return;
    // const { localUri, fileName } = res;
    // this.setState({ localUri });
    // this.focus();
    // const filePath = getFilePathFromLocalUri(localUri);
    // const { url } = await upload({
    //   entityType: 'comment',
    //   fileName,
    //   filePath,
    //   onStart: (id) => this.setState({ activeUploadId: id }),
    //   onFinish: () => this.setState({ activeUploadId: null })
    // });
    // if (url) {
    //   this.props.form.onChange({ mediaUrl: url });
    //   if (this.state.screenState === screenStateTypes.UPLOAD) {
    //     this.handleSubmit();
    //   }
    // }
  };

  handleSubmit = async () => {
    // const { activeUploadId, localUri, publishAs } = this.state;
    // const { onPress, form, dismissKeyboard, onChange } = this.props;
    // if (activeUploadId) {
    //   this.setState({ screenState: screenStateTypes.UPLOAD, submitted: true });
    // } else {
    //   this.setState({ screenState: screenStateTypes.SUBMITTING, submitted: true });
    //   try {
    //     await onPress({ text: form.state.text, mediaUrl: form.state.mediaUrl, publishAs });
    //     this.setState({ submitted: false, resetAutoCorrect: true }); // eslint-disable-line react/no-unused-state
    //     form.onReset();
    //     onChange && onChange('');
    //     if (localUri) {
    //       this.setState({ localUri: null });
    //     }
    //     dismissKeyboard && Keyboard.dismiss();
    //   } catch (e) {
    //     this.setState({ submitted: false });
    //   }
    // }
  };

  reset() {
    this.props.form.onReset();
  }

  focus() {
    return this.textArea.focus();
  }

  blur() {
    return this.textArea.blur();
  }

  removeImage = () => {
    // this.setState({ localUri: null, screenState: screenStateTypes.COMPOSE, submitted: false });
    // this.props.form.onChange({ mediaUrl: null });
    // this.cancelUpload();
  };

  cancelUpload = () => {
    // const { activeUploadId } = this.state;
    // const { cancelUpload } = this.props;
    // if (activeUploadId) {
    //   cancelUpload({ uploadId: activeUploadId });
    // }
  };
}

TextForm.defaultProps = {
  btnIconName: 'send',
  maxLines: 5,
  dismissKeyboard: true,
  autoFocus: false,
};

TextForm.propTypes = {
  pagesOwned: PropTypes.object,
  user: PropTypes.object,
  form: PropTypes.object,
  onChange: PropTypes.func,
  onPress: PropTypes.func.isRequired,
  btnIconName: PropTypes.string,
  btnText: PropTypes.string,
  placeholder: PropTypes.string,
  maxLines: PropTypes.number,
  text: PropTypes.string,
  updatedText: PropTypes.string,
  dismissKeyboard: PropTypes.bool,
  withMentions: PropTypes.bool,
  withImage: PropTypes.bool,
  autoFocus: PropTypes.bool,
  forceDisable: PropTypes.bool,
  //   cancelUpload: PropTypes.func,
  //   upload: PropTypes.func,
  uploads: PropTypes.object,
  onMediaChooseStart: PropTypes.func,
  onMediaChooseEnd: PropTypes.func,
  //   getOwnedPages: PropTypes.func
};

const mapStateToProps = (state) => ({
  uploads: state.uploads,
  user: state.auth.user,
  pagesOwned: state.pages.owned,
});

const mapDispatchToProps = {
  //   upload,
  //   cancelUpload,
  //   getOwnedPages
};

TextForm = connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(TextForm);
export default TextForm;
