import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, StatusBar, TouchableOpacity, Keyboard} from 'react-native';
import I18n from '../../../infra/localization';
import {View, Text, Toast, Avatar} from '../../../components/basicComponents';
import {uiConstants, flipFlopColors} from '../../../vars';
import {screenNames, editModes, postTypes} from '../../../vars/enums';
import {isRTL} from '../../../infra/utils/stringUtils';
import {AwesomeIcon, HomeisIcon} from '../../../assets/icons';
import {get, isEmpty} from '../../../infra/utils';
import {navigationService} from '../../../infra/navigation';
import UploadHeader from './commons/UploadHeader';

const MIN_TITLE_HORIZONTAL_MARGIN = 10;

const BTN_HITSLOP = {top: 15, left: 15, right: 15, bottom: 15};
const MIDDLE_SECTION_CONTAINER_HEIGHT = 38;
const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: flipFlopColors.paleGreyTwo,
    borderBottomColor: flipFlopColors.b90,
  },
  wrapperContent: {
    paddingTop: 30 + uiConstants.NAVBAR_TOP_MARGIN,
    borderBottomWidth: 1,
    borderBottomColor: flipFlopColors.b90,
    flexDirection: 'row',
    overflow: 'hidden',
    paddingBottom: 7,
    paddingHorizontal: 15,
  },
  rtlWrapperContent: {
    direction: 'rtl',
  },
  middleSection: {
    flex: 1,
    alignItems: 'center',
    height: MIDDLE_SECTION_CONTAINER_HEIGHT,
    justifyContent: 'center',
  },
  postInIconSelector: {
    marginLeft: 5,
  },
  toastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toastIcon: {
    marginRight: 5,
  },
  pickersRoot: {
    flexDirection: 'row',
    backgroundColor: flipFlopColors.white,
    paddingTop: 15,
    paddingBottom: 8,
    alignItems: 'center',
  },
  pickerLeftWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 5,
  },
  pickerLeft: {
    borderRadius: 5,
    backgroundColor: flipFlopColors.paleGreyTwo,
    flex: 1,
    paddingTop: 2,
    paddingBottom: 3,
    paddingRight: 10,
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerRightWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 15,
    marginLeft: 5,
  },
  pickerRight: {
    borderRadius: 5,
    backgroundColor: flipFlopColors.paleGreyTwo,
    flex: 1,
    paddingTop: 2,
    paddingBottom: 3,
    paddingRight: 10,
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  triangleWrapper: {
    marginLeft: 'auto',
    marginTop: 3,
    marginRight: 4,
  },
  triangle: {
    marginLeft: 5,
    lineHeight: 10,
  },
  triangleUp: {
    marginLeft: 5,
    marginTop: 5,
  },
  triangleDown: {
    marginLeft: 5,
    marginTop: -5,
  },
  pickerTextWrapper: {
    marginRight: 15,
  },
  cancelButtonWrapper: {
    justifyContent: 'center',
  },
  middleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonWrapper: {
    justifyContent: 'center',
  },
  avatarWrapper: {
    marginRight: 8,
    marginLeft: 15,
    borderColor: flipFlopColors.b95,
    borderWidth: 1,
    borderRadius: 30,
  },
});

class PostEditorHeader extends Component {
  state = {
    leftComponentWidth: 0,
    rightComponentWidth: 0,
  };

  // This is needed for postTypes picker
  // eslint-disable-next-line react/sort-comp
  static offsetFromTop =
    styles.wrapperContent.paddingTop +
    styles.wrapperContent.paddingBottom +
    styles.wrapperContent.borderBottomWidth +
    styles.middleSection.height;

  render() {
    const {uploads, isUploading, isMiddleSectionHidden} = this.props;
    const isRTLText = isRTL(I18n.t('post_editor.post_button'));

    if (uploads && isUploading) {
      return this.renderUploadHeader();
    }

    return (
      <View style={styles.wrapper}>
        <View
          style={[
            styles.wrapperContent,
            isRTLText && styles.rtlWrapperContent,
          ]}>
          <StatusBar
            translucent
            barStyle="dark-content"
            backgroundColor="transparent"
          />
          {this.renderCancelButton()}
          {this.renderMiddleSection({isRTLText})}
          {this.renderSubmitButton()}
          {this.renderToastView()}
        </View>

        {!isMiddleSectionHidden && (
          <View style={styles.pickersRoot}>
            {this.renderPickerIcon()}

            {this.renderLeftPicker()}

            {this.renderRightPicker()}
          </View>
        )}
      </View>
    );
  }

  renderPickerIcon = () => {
    const {publishAs = {}} = this.props;
    const {
      entityType: publishAsEntityType,
      media: {thumbnail: publishAsThumbnail} = {},
      name: publishAsName = '',
      id: publishAsEntityId,
    } = publishAs;

    return (
      <View style={styles.avatarWrapper}>
        <Avatar
          entityId={publishAsEntityId}
          size="medium1"
          name={publishAsName}
          entityType={publishAsEntityType}
          thumbnail={publishAsThumbnail}
          linkable={false}
        />
      </View>
    );
  };

  renderLeftPicker = () => {
    const {
      publishAs = {},
      isPostAsPickerEnabled,
      isPostAsPickerOpen,
    } = this.props;
    const postAsTextColor = isPostAsPickerOpen
      ? flipFlopColors.green
      : flipFlopColors.b30;

    return (
      <View style={styles.pickerLeftWrapper}>
        <TouchableOpacity
          onPress={isPostAsPickerEnabled ? this.openPostAsPicker : null}
          style={styles.pickerLeft}
          activeOpacity={0.5}>
          <View>
            <View>
              <Text size={10} lineHeight={15} color={postAsTextColor}>
                {I18n.t('post_editor.post_as', {publisherName: ''})}
              </Text>
            </View>
            <View style={styles.pickerTextWrapper}>
              <Text
                numberOfLines={1}
                size={11}
                ellipsizeMode="tail"
                medium
                lineHeight={13}
                color={postAsTextColor}>
                {publishAs.name}
              </Text>
            </View>
          </View>
          <View style={styles.triangleWrapper}>
            <AwesomeIcon
              style={styles.triangle}
              name="sort-down"
              size={16}
              color={flipFlopColors.green}
              weight="solid"
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  renderRightPicker = () => {
    const {publishIn = {}, isPostInPickerOpen} = this.props;
    const postInTextColor = isPostInPickerOpen
      ? flipFlopColors.green
      : flipFlopColors.b30;

    return (
      <View style={styles.pickerRightWrapper}>
        <TouchableOpacity
          onPress={this.openPostInPicker}
          style={styles.pickerRight}
          activeOpacity={0.5}>
          <View>
            <View>
              <Text size={10} lineHeight={15} color={postInTextColor}>
                {`${I18n.t('post_editor.post_to')} `}
              </Text>
            </View>
            <View style={styles.pickerTextWrapper}>
              <Text
                numberOfLines={1}
                size={11}
                ellipsizeMode="tail"
                medium
                lineHeight={13}
                color={postInTextColor}>
                {publishIn.name}
              </Text>
            </View>
          </View>
          <View style={styles.triangleWrapper}>
            <AwesomeIcon
              style={styles.triangle}
              name={'sort-down'}
              size={16}
              color={flipFlopColors.green}
              weight="solid"
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  openPostAsPicker = () => {
    const {onPostAs} = this.props;

    onPostAs();
  };

  openPostInPicker = () => {
    const {onPostIn, isPostInPickerEnabled} = this.props;
    isPostInPickerEnabled && onPostIn();
  };

  renderUploadHeader() {
    const {uploads, uploadIds} = this.props;
    const progress =
      uploadIds.reduce((total, current) => {
        const itemProgress = get(uploads, `[${current}].progress`, 1);
        return total + itemProgress;
      }, 0) / uploadIds.length;

    return <UploadHeader progress={progress} />;
  }

  renderCancelButton() {
    const {onClose} = this.props;
    return (
      <TouchableOpacity
        style={styles.cancelButtonWrapper}
        activeOpacity={0.75}
        hitSlop={BTN_HITSLOP}
        onPress={onClose}>
        <Text
          size={16}
          lineHeight={20}
          color={flipFlopColors.green}
          testID="postEditorHeaderCloseButton"
          onLayout={this.calcLeftComponentWidth}>
          {I18n.t('common.buttons.cancel')}
        </Text>
      </TouchableOpacity>
    );
  }

  renderMiddleSection({isRTLText}) {
    const {leftComponentWidth, rightComponentWidth} = this.state;
    const {
      postType,
      onPostTypePress,
      isButtonsAndTitleHidden,
      isPickerHidden,
      headerTitle,
    } = this.props;
    const marginRight =
      Math.max(leftComponentWidth - rightComponentWidth, 0) +
      MIN_TITLE_HORIZONTAL_MARGIN;
    const marginLeft =
      Math.max(rightComponentWidth - leftComponentWidth, 0) +
      MIN_TITLE_HORIZONTAL_MARGIN;
    const creationPostTypeText = this.getPostTypeText();

    return (
      <TouchableOpacity
        onPress={isEmpty(postType) ? null : onPostTypePress}
        style={[styles.middleSection, {marginLeft, marginRight}]}
        activeOpacity={isEmpty(postType) ? 1 : 0.5}>
        {!isButtonsAndTitleHidden && (
          <View
            style={[
              styles.middleWrapper,
              isRTLText && styles.rtlWrapperContent,
            ]}>
            <Text size={16} lineHeight={20} color={flipFlopColors.b30} bold>
              {headerTitle || creationPostTypeText}
            </Text>
            {!isEmpty(postType) && onPostTypePress && (
              <AwesomeIcon
                onPress={onPostTypePress}
                style={isPickerHidden ? styles.triangleDown : styles.triangleUp}
                name={isPickerHidden ? 'sort-down' : 'sort-up'}
                size={16}
                color={flipFlopColors.green}
                weight="solid"
              />
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  }

  renderPublishAsSelector() {
    const {isPostAsPickerEnabled} = this.props;

    return (
      isPostAsPickerEnabled && (
        <AwesomeIcon
          name="caret-down"
          size={14}
          color={flipFlopColors.b60}
          weight="solid"
          style={styles.postInIconSelector}
        />
      )
    );
  }

  renderSubmitButton() {
    const {mode, onSubmit, onDisabledSubmitClick, isSubmitEnabled} = this.props;
    const text =
      mode === editModes.CREATE
        ? I18n.t('post_editor.post_button')
        : I18n.t('post_editor.post_button');

    return (
      <TouchableOpacity
        style={styles.submitButtonWrapper}
        activeOpacity={isSubmitEnabled ? 0.75 : 1}
        hitSlop={BTN_HITSLOP}
        onPress={isSubmitEnabled ? onSubmit : onDisabledSubmitClick}>
        <Text
          bold
          size={16}
          lineHeight={20}
          color={isSubmitEnabled ? flipFlopColors.green : flipFlopColors.b70}
          testID="postEditorSubmitCommand"
          onLayout={this.calcRightComponentWidth}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  }

  renderToastView = () => {
    const {errorsCount, hideToast, isShowToast} = this.props;
    return (
      <Toast
        color={flipFlopColors.red}
        showToast={isShowToast}
        onComplete={hideToast}
        toastTopPosition={-40}>
        <View style={styles.toastContainer}>
          <View style={styles.toastContent}>
            <AwesomeIcon
              name="exclamation-circle"
              size={16}
              weight="solid"
              color={flipFlopColors.white}
              style={styles.toastIcon}
            />
            <Text color={flipFlopColors.white}>
              {I18n.p(errorsCount, 'post_editor.image_upload_error.toast')}
            </Text>
          </View>
          <HomeisIcon
            name="close"
            size={11}
            color={flipFlopColors.white}
            onPress={hideToast}
            hitSlop={uiConstants.BTN_HITSLOP}
          />
        </View>
      </Toast>
    );
  };

  getPostTypeText = () => {
    const {postType} = this.props;
    if (!postType) {
      return I18n.t('post_editor.create_post_title');
    }
    if (postType === postTypes.ACTIVATION) {
      return '';
    }
    return I18n.t(`post_editor.post_type_definitions.${postType}.text`);
  };

  navigateToHookedEntitiesList = () => {
    Keyboard.dismiss();
    const {updatePuplishAsEntity} = this.props;
    navigationService.navigate(screenNames.HookedEntitiesList, {
      saveAction: updatePuplishAsEntity,
    });
  };

  calcLeftComponentWidth = (e) => {
    this.setState({leftComponentWidth: e.nativeEvent.layout.width});
  };

  calcRightComponentWidth = (e) => {
    this.setState({rightComponentWidth: e.nativeEvent.layout.width});
  };
}

PostEditorHeader.propTypes = {
  headerTitle: PropTypes.string,
  isMiddleSectionHidden: PropTypes.bool,
  uploads: PropTypes.shape({
    progress: PropTypes.number,
  }),
  uploadIds: PropTypes.arrayOf(PropTypes.string),
  isUploading: PropTypes.bool,
  postType: PropTypes.string,
  publishAs: PropTypes.shape({
    id: PropTypes.string,
    entityType: PropTypes.string,
    name: PropTypes.string,
    media: PropTypes.object,
  }),
  publishIn: PropTypes.object,
  errorsCount: PropTypes.number,
  isShowToast: PropTypes.bool,
  hideToast: PropTypes.func,
  onPostTypePress: PropTypes.func,
  onClose: PropTypes.func,
  onDisabledSubmitClick: PropTypes.func,
  onSubmit: PropTypes.func,
  updatePuplishAsEntity: PropTypes.func,
  mode: PropTypes.number,
  isSubmitEnabled: PropTypes.bool,
  isPostAsPickerEnabled: PropTypes.bool,
  isPostInPickerEnabled: PropTypes.bool,
  onPostAs: PropTypes.func,
  onPostIn: PropTypes.func,
  isPostAsPickerOpen: PropTypes.bool,
  isPostInPickerOpen: PropTypes.bool,
  isButtonsAndTitleHidden: PropTypes.bool,
  isPickerHidden: PropTypes.bool,
};

PostEditorHeader.defaultProps = {
  isButtonsAndTitleHidden: false,
  isMiddleSectionHidden: false,
  onDisabledSubmitClick: null,
};

export default PostEditorHeader;
