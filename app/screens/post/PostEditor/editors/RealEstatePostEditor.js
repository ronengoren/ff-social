import React, {Component} from 'react';
import PropTypes from 'prop-types';
import I18n from '/infra/localization';
import {connect} from 'react-redux';
import {StyleSheet, Keyboard, Platform} from 'react-native';
import {
  TextArea,
  View,
  ScrollView,
  LocationInput,
  Picker,
  TextInput,
  SwitchWithText,
  CheckboxWithText,
  DummyTextInput,
} from '../../../../components/basicComponents';
import {GenericConfirmationModal} from '../../../../components/modals';
import {
  flipFlopColors,
  commonStyles,
  postEditorCommonStyles,
  POST_EDITOR_FIELD_HEIGHT,
} from '../../../../vars';
import {
  dateTimeSelectorModes,
  editModes,
  postSubTypes,
  screenNames,
  realEstateTypes,
} from '../../../../vars/enums';
import {get, arrayToStringByKey} from '../../../../infra/utils';
import {translateDate} from '../../../../infra/utils/dateTimeUtils';
import {navigationService} from '../../../../infra/navigation';
import {isRTL} from '../../../../infra/utils/stringUtils';

import PreviewSection from '../commons/PreviewSection';
import {editorMediaScheme} from './schemas';

const ROOMS_OPTIONS = Array.from({length: 10}, (item, index) => ({
  label: (index + 1).toString(),
  value: index + 1,
}));
const isIOS = Platform.OS === 'ios';
const TEXT_OFFSET = 400;
const TEXT_BOTTOM_PADDING = 60;

const styles = StyleSheet.create({
  roomsPickerContainer: {
    height: 300,
    alignItems: 'center',
  },
  roomsPicker: {
    flex: 1,
    width: Platform.select({ios: '100%', android: 100}),
  },
});

class RealEstatePostEditor extends Component {
  state = {
    roomsSelectorModalShown: false,
    roomsSelectorValue: null,
    isSizeInputFocused: false,
  };

  constructor(props) {
    super(props);
    const firstCheckboxText = I18n.t(postSubTypes.OFFERING);
    this.isRtlCheckboxes = isRTL(firstCheckboxText);
  }

  render() {
    // const {
    //   roomsSelectorModalShown,
    //   roomsSelectorValue,
    //   isSizeInputFocused,
    // } = this.state;
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
    //   CountryPickerComponent,
    //   isShowCountryPicker,
    // } = this.props;
    // const {
    //   tags,
    //   postSubType,
    //   title,
    //   location,
    //   text,
    //   templateData,
    //   active,
    // } = form;
    // const {price, size, rooms, startDate, endDate} = templateData || {};
    // const isSubmitEnabled = this.isSubmitEnabled();
    // const isOffering = postSubType === postSubTypes.OFFERING;
    // const isActiveSwitchVisible =
    //   mode === editModes.EDIT && !postData.scheduledDate;
    // const priceWithoutCommas = price && price.toString().replace(/,/g, '');
    return (
      <View style={commonStyles.flex1}>
        {React.cloneElement(header, {isSubmitEnabled})}
        <ScrollView
          style={commonStyles.flex1}
          ref={(node) => {
            this.postBodyScrollView = node;
          }}
          testID="realEstatePostEditor">
          {this.renderSubTypes()}
          {this.renderTags()}
          <View style={postEditorCommonStyles.fieldsWrapper}>
            <TextInput
              placeholder={I18n.t(
                'post_editor.real_estate.placeholders.mandatory_title',
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
              testID="realEstateTitleInput"
            />
            <TextInput
              placeholder={I18n.t(
                'post_editor.real_estate.placeholders.price_and_symbol',
              )}
              inputStyle={[
                postEditorCommonStyles.input,
                postEditorCommonStyles.bottomBorder,
              ]}
              value={priceWithoutCommas}
              onChange={(val) => updateTemplateData({price: val})}
              // onFocus={hidePicker}
              height={POST_EDITOR_FIELD_HEIGHT}
              keyboardType="numeric"
            />
            {!!tags && !!tags.length && tags[0] === realEstateTypes.SUBLET && (
              <View>
                <DummyTextInput
                  onPress={this.navigateToDatesPicker(
                    dateTimeSelectorModes.startDate,
                  )}
                  minHeight={POST_EDITOR_FIELD_HEIGHT}
                  textStyle={postEditorCommonStyles.dummyInput}
                  style={postEditorCommonStyles.bottomBorder}
                  text={translateDate(startDate)}
                  placeholder={I18n.t(
                    'post_editor.real_estate.placeholders.start_date',
                  )}
                />
                <DummyTextInput
                  onPress={this.navigateToDatesPicker(
                    dateTimeSelectorModes.endDate,
                  )}
                  minHeight={POST_EDITOR_FIELD_HEIGHT}
                  textStyle={postEditorCommonStyles.dummyInput}
                  style={postEditorCommonStyles.bottomBorder}
                  text={translateDate(endDate)}
                  placeholder={I18n.t(
                    'post_editor.real_estate.placeholders.end_date',
                  )}
                  testID="realEstateDates"
                />
              </View>
            )}
            <View
              style={[
                commonStyles.flexDirectionRow,
                postEditorCommonStyles.bottomBorder,
              ]}>
              {!!isOffering && (
                <TextInput
                  placeholder={I18n.t(
                    'post_editor.real_estate.placeholders.size_and_symbol',
                  )}
                  inputStyle={postEditorCommonStyles.input}
                  containerStyle={commonStyles.flex1}
                  value={
                    !isSizeInputFocused && size && size.length
                      ? I18n.t('post_editor.real_estate.values.size', {size})
                      : size
                  }
                  onChange={(val) => updateTemplateData({size: val})}
                  // onFocus={() => {
                  //   hidePicker();
                  //   this.setState({isSizeInputFocused: true});
                  // }}
                  onBlur={() => this.setState({isSizeInputFocused: false})}
                  height={POST_EDITOR_FIELD_HEIGHT}
                  keyboardType="numeric"
                />
              )}
              <DummyTextInput
                onPress={this.openRoomsSelecterModal}
                minHeight={POST_EDITOR_FIELD_HEIGHT}
                textStyle={postEditorCommonStyles.dummyInput}
                style={commonStyles.flex1}
                text={
                  rooms
                    ? I18n.p(rooms, 'post_editor.real_estate.values.rooms')
                    : null
                }
                placeholder={I18n.t(
                  'post_editor.real_estate.placeholders.rooms',
                )}
              />
            </View>
            <LocationInput
              value={location && location.value}
              placeholder={I18n.t(
                'post_editor.real_estate.placeholders.location',
              )}
              // onPress={hidePicker}
              onAddressChosen={(val) => updateForm({location: val})}
              onClearAddress={this.handleLocationClearPressed}
              style={postEditorCommonStyles.bottomBorder}
            />
            {isShowCountryPicker && <CountryPickerComponent />}
            {isActiveSwitchVisible && (
              <SwitchWithText
                header={I18n.t('post_editor.active_switch.header')}
                subHeader={I18n.t('post_editor.active_switch.sub_header')}
                active={active}
                onChange={(val) => updateForm({active: val})}
                // onPress={hidePicker}
                style={postEditorCommonStyles.bottomBorder}
              />
            )}
            <TextArea
              placeholder={I18n.t(
                'post_editor.real_estate.placeholders.mandatory_description',
              )}
              style={postEditorCommonStyles.input}
              value={text}
              onChange={(val) => updateForm({text: val})}
              onFocus={this.handleDescriptionFocus}
              onContentSizeChange={this.handleDescriptionSizeChanged}
              testID="realEstateDescriptionInput"
            />
          </View>
          <PreviewSection
            handleRemoveMedia={onRemoveMedia}
            openActionSheet={openActionSheet}
            attachedMedia={attachedMedia}
          />
        </ScrollView>
        <GenericConfirmationModal
          show={roomsSelectorModalShown}
          headerText={I18n.t('post_editor.real_estate.rooms_picker_title')}
          confirmText={I18n.t('common.buttons.set')}
          confirmTextColor={flipFlopColors.green}
          cancelText={I18n.t('common.buttons.cancel')}
          onCancel={this.handleRoomsSelectorModalCancel}
          onConfirm={this.handleRoomsSelectorModalConfirm}>
          <View style={styles.roomsPickerContainer}>
            <Picker
              data={ROOMS_OPTIONS}
              selectedValue={roomsSelectorValue}
              onChange={(val) => this.setState({roomsSelectorValue: val})}
              style={styles.roomsPicker}
            />
          </View>
        </GenericConfirmationModal>
      </View>
    );
  }

  componentDidMount() {
    const {
      form: {postSubType, tags},
      updateForm,
    } = this.props;

    if (![postSubTypes.OFFERING, postSubTypes.SEEKING].includes(postSubType)) {
      updateForm({postSubType: postSubTypes.OFFERING});
    }

    if (
      !tags ||
      !tags.length ||
      !Object.values(realEstateTypes).includes(tags[0])
    ) {
      updateForm({tags: [realEstateTypes.SUBLET]});
    }

    Keyboard.addListener('keyboardDidShow', this.handleKeyboardShown);
  }

  componentWillUnmount() {
    this.props.updateForm({
      tags: null,
      title: null,
      location: null,
    });
    Keyboard.removeListener('keyboardDidShow', this.handleKeyboardShown);
  }

  renderSubTypes = () => {
    const {updateForm, form} = this.props;
    const {postSubType} = form;

    return (
      <View
        style={[
          postEditorCommonStyles.checkboxesSection,
          this.isRtlCheckboxes && postEditorCommonStyles.rtlCheckboxesSection,
          postEditorCommonStyles.bottomBorder,
        ]}>
        {Object.values(postSubTypes).map((option) => (
          <CheckboxWithText
            action={() => updateForm({postSubType: option})}
            text={I18n.t(`post_editor.real_estate.type_labels.${option}`)}
            value={postSubType === option}
            style={postEditorCommonStyles.checkbox}
          />
        ))}
      </View>
    );
  };

  renderTags = () => {
    const {form} = this.props;
    const {tags, postSubType} = form;
    const isOffering = postSubType === postSubTypes.OFFERING;

    return (
      <View
        style={[
          postEditorCommonStyles.checkboxesSection,
          this.isRtlCheckboxes && postEditorCommonStyles.rtlCheckboxesSection,
          postEditorCommonStyles.bottomBorder,
        ]}>
        {Object.values(realEstateTypes).map((option) => {
          const text =
            option === realEstateTypes.BUY_SELL
              ? I18n.t(
                  `post_editor.real_estate.tag_labels.${
                    isOffering ? 'sell' : 'buy'
                  }`,
                )
              : I18n.t(`post_editor.real_estate.tag_labels.${option}`);

          return (
            <CheckboxWithText
              action={this.updateTags(option)}
              text={text}
              value={tags && tags.length && tags[0] === option}
              style={postEditorCommonStyles.checkbox}
            />
          );
        })}
      </View>
    );
  };

  updateTags = (option) => () => {
    const {updateForm, updateTemplateData} = this.props;

    updateForm({tags: [option]});
    if (option !== realEstateTypes.SUBLET) {
      updateTemplateData({startDate: null, endDate: null});
    }
  };

  handleDescriptionFocus = () => {
    // const {hidePicker} = this.props;
    // hidePicker();
    // // On Android there is an auto scrolling to the description textInput, so we don't need
    // // to add manual scroll
    // if (isIOS) {
    //   this.postBodyScrollView.scrollTo({x: 0, y: TEXT_OFFSET, animated: true});
    // }
  };

  // On Android there is an auto scrolling to the description textInput new line, so we don't need
  // to add manual scroll
  handleDescriptionSizeChanged = ({height, isChangeOnLastLine}) => {
    if (isIOS && isChangeOnLastLine) {
      const scrollToY =
        TEXT_OFFSET +
        (height > this.keyboardHeight - TEXT_BOTTOM_PADDING
          ? height - this.keyboardHeight + TEXT_BOTTOM_PADDING
          : 0);
      this.postBodyScrollView.scrollTo({x: 0, y: scrollToY, animated: false});
    }
  };

  handleKeyboardShown = (e) => {
    this.keyboardHeight = e.endCoordinates.height;
  };

  handleRoomsSelectorModalCancel = () => {
    this.setState({roomsSelectorModalShown: false});
  };

  handleRoomsSelectorModalConfirm = () => {
    this.props.updateTemplateData({rooms: this.state.roomsSelectorValue});
    this.setState({roomsSelectorModalShown: false});
  };

  openRoomsSelecterModal = () => {
    // const {
    //   form: {rooms},
    //   hidePicker,
    // } = this.props;
    // Keyboard.dismiss();
    // hidePicker();
    // this.setState({
    //   roomsSelectorModalShown: true,
    //   roomsSelectorValue: rooms || 1,
    // });
  };

  navigateToDatesPicker = (focusOn) => () => {
    // Keyboard.dismiss();
    // const {form, updateTemplateData, hidePicker} = this.props;
    // const {startDate = '', endDate = ''} = form.templateData;
    // hidePicker();
    // navigationService.navigate(screenNames.DatesPicker, {
    //   focusOn,
    //   startDate,
    //   endDate,
    //   saveAction: (edits) => updateTemplateData(edits),
    //   title: I18n.t('post_editor.dates_editor.header'),
    // });
  };

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
      location,
      templateData,
      scheduledDate,
      active,
    } = form;
    const {price, size, rooms, startDate, endDate} = templateData || {};

    const isTextValid = !!(text && text.trim().length);
    const isTitleAndText = !!(isTextValid && title && title.length);

    switch (mode) {
      case editModes.CREATE:
        return isTitleAndText;
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
          startDate !== get(postData, 'templateData.startDate', null) ||
          endDate !== get(postData, 'templateData.endDate', null) ||
          postType !== postData.postType ||
          postSubType !== postData.postSubType ||
          text !== postData.text ||
          title !== postData.title ||
          price !== get(postData, 'templateData.price', null) ||
          (postSubType === postSubTypes.OFFERING &&
            size !== get(postData, 'templateData.size', null)) ||
          rooms !== get(postData, 'templateData.rooms', null) ||
          get(location, 'value', null) !==
            get(postData, 'location.placeName', null) ||
          attachedMediaLocalUris !== postDataMediaUrls ||
          postData.scheduledDate !== scheduledDate ||
          active !== postData.active ||
          contextCountryCode !== postData.contextCountryCode;

        return isTitleAndText && isSomethingChanged;
      }
      default:
        return false;
    }
  }
}

RealEstatePostEditor.propTypes = {
  CountryPickerComponent: PropTypes.node,
  isShowCountryPicker: PropTypes.bool,
  form: PropTypes.shape({
    postType: PropTypes.string,
    postSubType: PropTypes.oneOf([postSubTypes.OFFERING, postSubTypes.SEEKING]),
    title: PropTypes.string,
    price: PropTypes.string,
    size: PropTypes.string,
    rooms: PropTypes.number,
    location: PropTypes.shape({
      googlePlaceId: PropTypes.string,
      value: PropTypes.string,
    }),
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
  header: PropTypes.node,
  contextCountryCode: PropTypes.arrayOf(PropTypes.number),
  onRemoveMedia: PropTypes.func,
  openActionSheet: PropTypes.func,
};

RealEstatePostEditor = connect(null, null, null, {forwardRef: true})(
  RealEstatePostEditor,
);
export default RealEstatePostEditor;
