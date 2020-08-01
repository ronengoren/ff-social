import React, {Component} from 'react';
import PropTypes from 'prop-types';
import I18n from '/infra/localization';
import {Keyboard, LayoutAnimation, Platform} from 'react-native';
import {
  TextArea,
  View,
  ScrollView,
  TextInput,
  CheckboxWithText,
  SwitchWithText,
} from '../../../../components/basicComponents';
import {
  commonStyles,
  postEditorCommonStyles,
  POST_EDITOR_FIELD_HEIGHT,
} from '../../../../vars';
import {editModes, postSubTypes, giveTakeTypes} from '../../../../vars/enums';
import {get, arrayToStringByKey} from '../../../../infra/utils';
import {isRTL} from '../../../../infra/utils/stringUtils';
import {editorMediaScheme} from './schemas';
import PreviewSection from '../commons/PreviewSection';

const isIOS = Platform.OS === 'ios';
const TEXT_OFFERING_PRICE_OFFSET = 220;
const TEXT_OFFERING_FREE_OFFSET = 170;
const TEXT_SEEKING_OFFSET = 110;
const TEXT_BOTTOM_PADDING = 70;

class GiveTakePostEditor extends Component {
  constructor(props) {
    super(props);
    this.firstCheckboxText = I18n.t(
      'post_editor.give_take.type_labels.offering',
    );
    this.isRtlCheckboxes = isRTL(this.firstCheckboxText);
  }

  render() {
    // const {
    //   form,
    //   hidePicker,
    //   header,
    //   updateForm,
    //   updateTemplateData,
    //   attachedMedia,
    //   onRemoveMedia,
    //   openActionSheet,
    //   postData,
    //   mode,
    //   isShowCountryPicker,
    //   CountryPickerComponent,
    // } = this.props;
    const {postSubType, tags, title, text, templateData, active} = form;
    const {price} = templateData || {};
    const isSubmitEnabled = this.isSubmitEnabled();
    const isOffering = postSubType === postSubTypes.OFFERING;
    const isSeeking = postSubType === postSubTypes.SEEKING;
    const tag = tags && tags[0];
    const isActiveSwitchVisible =
      mode === editModes.EDIT && !postData.scheduledDate;
    const priceWithoutCommas = price && price.toString().replace(/,/g, '');
    return (
      <View style={commonStyles.flex1}>
        {React.cloneElement(header, {isSubmitEnabled})}
        <ScrollView
          style={commonStyles.flex1}
          ref={(node) => {
            this.postBodyScrollView = node;
          }}>
          <View
            style={[
              postEditorCommonStyles.checkboxesSection,
              this.isRtlCheckboxes &&
                postEditorCommonStyles.rtlCheckboxesSection,
              postEditorCommonStyles.bottomBorder,
            ]}>
            <CheckboxWithText
              action={() =>
                this.handleCheckboxChosen({postSubType: postSubTypes.OFFERING})
              }
              text={this.firstCheckboxText}
              value={isOffering}
              style={postEditorCommonStyles.checkbox}
            />
            <CheckboxWithText
              action={() =>
                this.handleCheckboxChosen({
                  postSubType: postSubTypes.SEEKING,
                  tags: [],
                })
              }
              text={I18n.t('post_editor.give_take.type_labels.seeking')}
              value={isSeeking}
              style={postEditorCommonStyles.checkbox}
            />
          </View>
          {isOffering && (
            <View
              style={[
                postEditorCommonStyles.checkboxesSection,
                this.isRtlCheckboxes &&
                  postEditorCommonStyles.rtlCheckboxesSection,
                postEditorCommonStyles.bottomBorder,
              ]}>
              <CheckboxWithText
                action={this.handleFreeTagChosen}
                text={I18n.t('post_editor.give_take.tag_labels.free')}
                value={tag === giveTakeTypes.FREE}
                style={postEditorCommonStyles.checkbox}
              />
              <CheckboxWithText
                action={() =>
                  this.handleCheckboxChosen({tags: [giveTakeTypes.PRICE]})
                }
                text={I18n.t('post_editor.give_take.tag_labels.price')}
                value={tag === giveTakeTypes.PRICE}
                style={postEditorCommonStyles.checkbox}
              />
            </View>
          )}
          <View style={postEditorCommonStyles.fieldsWrapper}>
            {isOffering && tag === giveTakeTypes.PRICE && (
              <TextInput
                placeholder={I18n.t(
                  'post_editor.give_take.placeholders.price_and_symbol',
                )}
                inputStyle={[
                  postEditorCommonStyles.input,
                  postEditorCommonStyles.bottomBorder,
                ]}
                value={priceWithoutCommas}
                onChange={(val) => updateTemplateData({price: val})}
                // onFocus={hidePicker}
                ref={(node) => {
                  this.priceInput = node;
                }}
                height={POST_EDITOR_FIELD_HEIGHT}
                keyboardType="numeric"
              />
            )}
            <TextInput
              placeholder={I18n.t(
                'post_editor.give_take.placeholders.mandatory_title',
              )}
              inputStyle={[
                postEditorCommonStyles.input,
                postEditorCommonStyles.bottomBorder,
              ]}
              value={title}
              onChange={(val) => updateForm({title: val})}
              // onFocus={hidePicker}
              ref={(node) => {
                this.titleInput = node;
              }}
              height={POST_EDITOR_FIELD_HEIGHT}
              testID="giveTakeTitle"
            />
            {isShowCountryPicker && <CountryPickerComponent />}
            {isActiveSwitchVisible && (
              <SwitchWithText
                header={I18n.t('post_editor.active_switch.header')}
                subHeader={I18n.t('post_editor.active_switch.sub_header')}
                active={active}
                onChange={(val) => updateForm({active: val})}
                // onPress={hidePicker}
                style={[
                  postEditorCommonStyles.activeSwitch,
                  postEditorCommonStyles.bottomBorder,
                ]}
              />
            )}
            <View style={commonStyles.flex1}>
              <TextArea
                placeholder={I18n.t(
                  'post_editor.give_take.placeholders.mandatory_description',
                )}
                style={postEditorCommonStyles.input}
                value={text}
                onChange={(val) => updateForm({text: val})}
                onFocus={this.handleDescriptionFocus}
                onContentSizeChange={this.handleDescriptionSizeChanged}
                defaultHeight={POST_EDITOR_FIELD_HEIGHT}
                testID="giveTakeDescription"
              />
            </View>
          </View>
          <PreviewSection
            handleRemoveMedia={onRemoveMedia}
            openActionSheet={openActionSheet}
            attachedMedia={attachedMedia}
          />
        </ScrollView>
      </View>
    );
  }

  componentDidMount() {
    const {
      form: {postSubType, tags},
      updateForm,
    } = this.props;
    Keyboard.addListener('keyboardDidShow', this.handleKeyboardShown);

    if (![postSubTypes.OFFERING, postSubTypes.SEEKING].includes(postSubType)) {
      updateForm({postSubType: postSubTypes.OFFERING});
    }

    if (!tags || !Object.values(giveTakeTypes).includes(tags[0])) {
      updateForm({tags: [giveTakeTypes.FREE]});
    }
  }

  componentWillUnmount() {
    this.props.updateForm({
      tags: null,
      title: null,
    });
    Keyboard.removeListener('keyboardDidShow', this.handleKeyboardShown);
  }

  handleCheckboxChosen = (updateFormData) => {
    // const {hidePicker, updateForm} = this.props;
    // hidePicker();
    // LayoutAnimation.easeInEaseOut();
    // updateForm(updateFormData);
  };

  handleFreeTagChosen = () => {
    const {updateTemplateData} = this.props;
    this.handleCheckboxChosen({tags: [giveTakeTypes.FREE]});
    updateTemplateData({price: null});
  };

  handleDescriptionFocus = () => {
    // const {hidePicker} = this.props;
    // hidePicker();
    // // On Android there is an auto scrolling to the description textInput, so we don't need
    // // to add manual scroll
    // if (isIOS) {
    //   const textOffset = this.getDescriptionTextOffset();
    //   this.postBodyScrollView.scrollTo({x: 0, y: textOffset, animated: true});
    // }
  };

  // On Android there is an auto scrolling to the description textInput new line, so we don't need
  // to add manual scroll
  handleDescriptionSizeChanged = ({height, isChangeOnLastLine}) => {
    if (isIOS && isChangeOnLastLine) {
      const textOffset = this.getDescriptionTextOffset();
      const scrollToY =
        textOffset +
        (height > this.keyboardHeight - TEXT_BOTTOM_PADDING
          ? height - this.keyboardHeight + TEXT_BOTTOM_PADDING
          : 0);
      this.postBodyScrollView.scrollTo({x: 0, y: scrollToY, animated: false});
    }
  };

  handleKeyboardShown = (e) => {
    this.keyboardHeight = e.endCoordinates.height;
  };

  getDescriptionTextOffset() {
    const {
      form: {tags},
      mode,
    } = this.props;

    const offeringTextOffset =
      tags && tags[0] === giveTakeTypes.PRICE
        ? TEXT_OFFERING_PRICE_OFFSET
        : TEXT_OFFERING_FREE_OFFSET;
    const textOffset =
      this.props.form.postSubType === postSubTypes.OFFERING
        ? offeringTextOffset
        : TEXT_SEEKING_OFFSET;
    const editModeOffset =
      mode === editModes.EDIT ? POST_EDITOR_FIELD_HEIGHT : 0;

    return textOffset + editModeOffset;
  }

  isSubmitEnabled() {
    const {
      form,
      mode,
      postData,
      attachedMedia,
      contextCountryCode,
    } = this.props;
    const {
      postType,
      postSubType,
      title,
      text,
      templateData,
      tags,
      scheduledDate,
      active,
    } = form;
    const {price} = templateData || {};
    const tag = tags && tags[0];
    const postDataTag = postData.tags && postData.tags[0];

    const isSeeking = postSubType === postSubTypes.SEEKING;
    const isTextValid = !!(text && text.trim().length);
    const isTitleAndText = !!(isTextValid && title && title.length);
    const areAllFieldsFilled =
      isTitleAndText && (isSeeking || tag === giveTakeTypes.FREE || !!price);
    switch (mode) {
      case editModes.CREATE:
        return areAllFieldsFilled;
      case editModes.EDIT: {
        const attachedMediaLocalUris = arrayToStringByKey({
          array: attachedMedia,
          key: 'localUri',
        });
        const postDataMediaUrls = arrayToStringByKey({
          array: postData.mediaGallery,
          key: 'url',
        });
        const isSomethingChanged =
          postType !== postData.postType ||
          postSubType !== postData.postSubType ||
          tag !== postDataTag ||
          text !== postData.text ||
          title !== postData.title ||
          price !== get(postData, 'templateData.price', null) ||
          attachedMediaLocalUris !== postDataMediaUrls ||
          postData.scheduledDate !== scheduledDate ||
          active !== postData.active ||
          contextCountryCode !== postData.contextCountryCode;

        return areAllFieldsFilled && isSomethingChanged;
      }
      default:
        return false;
    }
  }

  inputBlur = () => {
    this.priceInput && this.priceInput.blur();
    this.textInput && this.textInput.blur();
  };
}

GiveTakePostEditor.propTypes = {
  CountryPickerComponent: PropTypes.node,
  isShowCountryPicker: PropTypes.bool,
  form: PropTypes.shape({
    postType: PropTypes.string,
    postSubType: PropTypes.oneOf([postSubTypes.OFFERING, postSubTypes.SEEKING]),
    title: PropTypes.string,
    price: PropTypes.string,
    text: PropTypes.string,
    active: PropTypes.bool,
    templateData: PropTypes.object,
    tags: PropTypes.array,
    scheduledDate: PropTypes.string,
  }),
  attachedMedia: PropTypes.arrayOf(editorMediaScheme),
  updateForm: PropTypes.func,
  updateTemplateData: PropTypes.func,
  // hidePicker: PropTypes.func,
  postData: PropTypes.object,
  mode: PropTypes.number,
  contextCountryCode: PropTypes.arrayOf(PropTypes.number),
  header: PropTypes.node,
  onRemoveMedia: PropTypes.func,
  openActionSheet: PropTypes.func,
};

export default GiveTakePostEditor;
