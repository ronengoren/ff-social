import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import I18n from '../../../../infra/localization';
import {
  TextArea,
  TextInput,
  View,
  ScrollView,
} from '../../../../components/basicComponents';
import {editModes} from '../../../../vars/enums';
import {
  POST_EDITOR_FIELD_HEIGHT,
  postEditorCommonStyles,
} from '../../../../vars';
import {arrayToStringByKey} from '../../../../infra/utils';
import PreviewSection from '../commons/PreviewSection';
import {editorMediaScheme} from './schemas';
import {commonStyles} from '../../../../vars';

const styles = StyleSheet.create({
  textArea: {
    minHeight: 80,
    paddingHorizontal: 0,
    paddingVertical: 15,
  },
  countryPicker: {
    marginBottom: 15,
  },
});

class TitledPostEditor extends Component {
  render() {
    // const {
    //   scrapedUrl,
    //   openActionSheet,
    //   clearScraping,
    //   attachedMedia,
    //   form,
    //   // onRegularInputChange,
    //   updateForm,
    //   hidePicker,
    //   onAddMedia,
    //   onRemoveMedia,
    //   header,
    //   isShowCountryPicker,
    //   CountryPickerComponent,
    // } = this.props;
    const isSubmitEnabled = this.isSubmitEnabled();

    return (
      <View style={commonStyles.flex1}>
        {React.cloneElement(header, {isSubmitEnabled})}
        <ScrollView
          style={commonStyles.flex1}
          ref={(node) => {
            this.postBodyScrollView = node;
          }}>
          <View style={postEditorCommonStyles.fieldsWrapper}>
            <TextInput
              placeholder={I18n.t('post_editor.titled_post.title_label')}
              style={[
                postEditorCommonStyles.input,
                postEditorCommonStyles.bottomBorder,
              ]}
              value={form.title}
              onChange={(val) => updateForm({title: val})}
              // onFocus={hidePicker}
              ref={(node) => {
                this.titleInput = node;
              }}
              height={POST_EDITOR_FIELD_HEIGHT}
            />
            {isShowCountryPicker && (
              <View style={styles.countryPicker}>
                <CountryPickerComponent />
              </View>
            )}
            <TextArea
              // onChange={onRegularInputChange}
              value={form.text}
              placeholder={I18n.t(
                `post_editor.post_placeholders.${form.postType}`,
              )}
              // onFocus={hidePicker}
              style={styles.textArea}
              withMentions
            />
          </View>
          <PreviewSection
            handleAddMedia={onAddMedia}
            handleRemoveMedia={onRemoveMedia}
            openActionSheet={openActionSheet}
            deleteScrapedUrlPreview={clearScraping}
            isWithCta={false}
            attachedMedia={attachedMedia}
            scrapedUrl={scrapedUrl}
          />
        </ScrollView>
      </View>
    );
  }

  isSubmitEnabled() {
    // const {
    //   postData,
    //   scrapedUrl,
    //   mode,
    //   form: {text, title, postType},
    //   attachedMedia,
    //   contextCountryCode,
    // } = this.props;
    // const scrapedUrlId = scrapedUrl.data && scrapedUrl.data.scrapedUrlId;
    // const isTextValid = !!(text && text.trim().length);
    // const isAllFieldsFilled = !!(isTextValid && title && title.length);
    // switch (mode) {
    //   case editModes.CREATE: {
    //     return isAllFieldsFilled;
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
    //     const isSomethingChanged = !!(
    //       text !== postData.text ||
    //       title !== postData.title ||
    //       attachedMediaLocalUris !== postDataMediaUrls ||
    //       postType !== postData.postType ||
    //       (postData.link && scrapedUrlId !== postData.link.id) ||
    //       contextCountryCode !== postData.contextCountryCode
    //     );
    //     return isAllFieldsFilled && isSomethingChanged;
    //   }
    //   default:
    //     return false;
    // }
  }
}

TitledPostEditor.propTypes = {
  isShowCountryPicker: PropTypes.func,
  CountryPickerComponent: PropTypes.node,
  scrapedUrl: PropTypes.object,
  openActionSheet: PropTypes.func,
  clearScraping: PropTypes.func,
  attachedMedia: PropTypes.arrayOf(editorMediaScheme),
  form: PropTypes.object,
  // onRegularInputChange: PropTypes.func,
  updateForm: PropTypes.func,
  // hidePicker: PropTypes.func,
  onAddMedia: PropTypes.func,
  onRemoveMedia: PropTypes.func,
  postData: PropTypes.object,
  mode: PropTypes.number,
  contextCountryCode: PropTypes.arrayOf(PropTypes.number),
  header: PropTypes.node,
};

export default TitledPostEditor;
