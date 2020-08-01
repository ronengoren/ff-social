import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Keyboard} from 'react-native';
import {RichTextShowAndEdit} from '../../../../components';
import {
  DummyTextInput,
  ScrollView,
  TextInput,
  View,
} from '../../../../components/basicComponents';
import {TagPicker} from '../../../../components/formElements';
import I18n from '../../../../infra/localization';
import {navigationService} from '../../../../infra/navigation';
import {arrayToStringByKey} from '../../../../infra/utils';
import {getFormattedDateAndTime} from '../../../../infra/utils/dateTimeUtils';
import {DatesPicker} from '../../../../screens';
import {
  commonStyles,
  postEditorCommonStyles,
  POST_EDITOR_FIELD_HEIGHT,
} from '../../../../vars';
import {
  dateAndTimeFormats,
  editModes,
  screenNames,
} from '../../../../vars/enums';
import PreviewSection from '../commons/PreviewSection';
import {editorMediaScheme} from './schemas';

class GuidePostEditor extends Component {
  render() {
    // const {
    //   isScheduleSupported,
    //   scrapedUrl,
    //   openActionSheet,
    //   clearScraping,
    //   attachedMedia,
    //   form,
    //   onAddMedia,
    //   hidePicker,
    //   onRemoveMedia,
    //   updateForm,
    //   header,
    //   isShowCountryPicker,
    //   CountryPickerComponent,
    //   featureFlags,
    // } = this.props;
    const {scheduledDate, text, tags, title} = form;
    const isSubmitEnabled = this.isSubmitEnabled();

    return (
      <View style={commonStyles.flex1}>
        {React.cloneElement(header, {isSubmitEnabled})}
        <ScrollView
          style={commonStyles.flex1}
          contentContainerStyle={postEditorCommonStyles.editorWrapper}
          ref={(ref) => {
            this.postBodyScrollView = ref;
          }}>
          <PreviewSection
            handleAddMedia={onAddMedia}
            handleRemoveMedia={onRemoveMedia}
            openActionSheet={openActionSheet}
            deleteScrapedUrlPreview={clearScraping}
            isWithCta
            attachedMedia={attachedMedia}
            scrapedUrl={scrapedUrl}
          />
          <TextInput
            onChange={(val) => updateForm({title: val})}
            value={title}
            placeholder={I18n.t('guide_post_editor.titlePlaceholder')}
            // onFocus={hidePicker}
            ref={(node) => {
              this.titleInput = node;
            }}
            inputStyle={[
              postEditorCommonStyles.input,
              postEditorCommonStyles.bottomBorder,
            ]}
            height={POST_EDITOR_FIELD_HEIGHT}
          />
          <TagPicker
            selectedTags={tags}
            // onPress={hidePicker}
            updateFunc={this.pickCategories}
            minHeight={POST_EDITOR_FIELD_HEIGHT}
          />
          {isScheduleSupported && (
            <DummyTextInput
              onPress={this.navigateToDatesPicker}
              minHeight={POST_EDITOR_FIELD_HEIGHT}
              textStyle={postEditorCommonStyles.dummyInput}
              style={postEditorCommonStyles.bottomBorder}
              text={getFormattedDateAndTime(
                scheduledDate,
                dateAndTimeFormats.dateTimeWithYear,
              )}
              placeholder={I18n.t('post_editor.publish_date_header')}
            />
          )}
          {isShowCountryPicker && <CountryPickerComponent />}
          {!featureFlags.disableRichTextEditor ? (
            <RichTextShowAndEdit
              text={text}
              placeholderText={I18n.t('guide_post_editor.textPlaceholder')}
              onSubmit={this.handleTextChanged}
            />
          ) : (
            <DummyTextInput
              onPress={this.navigateToAddDescription}
              text={text}
              placeholder={I18n.t('guide_post_editor.textPlaceholder')}
              textStyle={postEditorCommonStyles.input}
            />
          )}
        </ScrollView>
      </View>
    );
  }

  handleTextChanged = (text) => {
    this.props.updateForm({text});
  };

  isSubmitEnabled() {
    // const {
    //   scrapedUrl,
    //   mode,
    //   attachedMedia,
    //   postData,
    //   form,
    //   contextCountryCode,
    // } = this.props;
    // const {text = '', title = '', postType, tags, scheduledDate} = form;
    // const scrapedUrlId = scrapedUrl.data && scrapedUrl.data.scrapedUrlId;
    // const isTextValid = !!(text && text.trim().length);
    // const isTitleAndText = !!(isTextValid && title && title.length);
    // switch (mode) {
    //   case editModes.CREATE: {
    //     return isTitleAndText && !!(tags && tags.length);
    //   }
    //   case editModes.EDIT: {
    //     const attachedMediaLocalUris = arrayToStringByKey({
    //       array: attachedMedia,
    //       key: 'localUri',
    //     });
    //     const postDataMediaUrls = arrayToStringByKey({
    //       array: postData.mediaGallery,
    //       key: 'url',
    //     });
    //     const isSomethingChanged =
    //       text !== postData.text ||
    //       postType !== postData.postType ||
    //       title !== postData.title ||
    //       (postData.link && scrapedUrlId !== postData.link.id) ||
    //       attachedMediaLocalUris !== postDataMediaUrls ||
    //       postData.scheduledDate !== scheduledDate ||
    //       contextCountryCode !== postData.contextCountryCode;
    //     return isTitleAndText && isSomethingChanged;
    //   }
    //   default:
    //     return false;
    // }
  }

  pickCategories = ({tags}) => {
    const {updateForm} = this.props;
    updateForm({tags});
  };

  navigateToDatesPicker = () => {
    Keyboard.dismiss();
    const {
      updateForm,
      form: {scheduledDate},
    } = this.props;

    navigationService.navigate(screenNames.DatesPicker, {
      startDate: scheduledDate || '',
      title: I18n.t(`post_editor.dates_editor.schedule_post_header`),
      startDateOnly: true,
      mode: DatesPicker.modes.datetime,
      saveAction: (edits = {}) => {
        const {startDate} = edits;
        updateForm({scheduledDate: startDate});
      },
    });
  };

  navigateToAddDescription = () => {
    const {updateForm, form, hidePicker} = this.props;
    hidePicker();
    navigationService.navigate(screenNames.AddDescription, {
      updateFunc: ({text}) => updateForm({text}),
      withMentions: true,
      text: form.text,
      type: 'post',
      placeholder: I18n.t('guide_post_editor.textPlaceholder'),
    });
  };
}

GuidePostEditor.propTypes = {
  CountryPickerComponent: PropTypes.node,
  isShowCountryPicker: PropTypes.bool,
  isScheduleSupported: PropTypes.bool,
  scrapedUrl: PropTypes.object,
  openActionSheet: PropTypes.func,
  clearScraping: PropTypes.func,
  attachedMedia: PropTypes.arrayOf(editorMediaScheme),
  form: PropTypes.object,
  hidePicker: PropTypes.func,
  onAddMedia: PropTypes.func,
  onRemoveMedia: PropTypes.func,
  updateForm: PropTypes.func,
  contextCountryCode: PropTypes.arrayOf(PropTypes.number),
  postData: PropTypes.object,
  mode: PropTypes.number,
  header: PropTypes.node,
  featureFlags: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  featureFlags: state.auth.featureFlags,
});
GuidePostEditor = connect(mapStateToProps)(GuidePostEditor);
export default GuidePostEditor;
