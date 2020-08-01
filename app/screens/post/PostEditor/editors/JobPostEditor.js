import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import I18n from '../../../../infra/localization';
import {
  TextArea,
  View,
  CheckboxWithText,
  TextInput,
  ScrollView,
  LocationInput,
  SwitchWithText,
} from '../../../../components/basicComponents';
import {TagPicker} from '../../../../components/formElements';
import {
  commonStyles,
  postEditorCommonStyles,
  POST_EDITOR_FIELD_HEIGHT,
} from '../../../../vars';
import {editModes, postSubTypes, jobTypes} from '../../../../vars/enums';
import {get} from '../../../../infra/utils';
import {
  addSpaceOnCapitalsAndCapitalize,
  isRTL,
} from '../../../../infra/utils/stringUtils';

class JobPostEditor extends Component {
  constructor(props) {
    super(props);
    this.firstCheckboxText = I18n.t('post_editor.job.offering_label');
    this.isRtlCheckboxes = isRTL(this.firstCheckboxText);
  }

  render() {
    // const {
    //   form,
    //   hidePicker,
    //   header,
    //   updateForm,
    //   updateTemplateData,
    //   postData,
    //   mode,
    //   isShowCountryPicker,
    //   CountryPickerComponent,
    // } = this.props;
    const {postSubType, title, location, templateData, tags, active} = form;
    const {company} = templateData || {};
    const isSubmitEnabled = this.isSubmitEnabled();
    const isJobOffering = postSubType === postSubTypes.OFFERING;
    const isJobSeeking = postSubType === postSubTypes.SEEKING;
    const descriptionPlaceholderText =
      postSubType === postSubTypes.OFFERING
        ? I18n.t('post_editor.job.offering_placeholder')
        : I18n.t('post_editor.job.looking_placeholder');
    const jobCategories = this.getJobCategories();
    const isActiveSwitchVisible =
      mode === editModes.EDIT && !postData.scheduledDate;

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
              value={isJobOffering}
              style={postEditorCommonStyles.checkbox}
            />
            <CheckboxWithText
              action={() =>
                this.handleCheckboxChosen({postSubType: postSubTypes.SEEKING})
              }
              text={I18n.t('post_editor.job.looking_label')}
              value={isJobSeeking}
              style={postEditorCommonStyles.checkbox}
            />
          </View>
          <View style={postEditorCommonStyles.fieldsWrapper}>
            <TextInput
              placeholder={I18n.t('post_editor.job.title_placeholder')}
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
            />
            {isJobOffering && (
              <TextInput
                placeholder={I18n.t('post_editor.job.company_placeholder')}
                inputStyle={[
                  postEditorCommonStyles.input,
                  postEditorCommonStyles.bottomBorder,
                ]}
                value={company}
                onChange={(val) => updateTemplateData({company: val})}
                // onFocus={hidePicker}
                height={POST_EDITOR_FIELD_HEIGHT}
              />
            )}
            <LocationInput
              value={location && location.value}
              placeholder={I18n.t('post_editor.job.location_placeholder')}
              // onPress={hidePicker}
              onAddressChosen={(val) => updateForm({location: val})}
              onClearAddress={() => updateForm({location: null})}
              style={postEditorCommonStyles.bottomBorder}
            />
            <TagPicker
              selectedTags={tags}
              options={jobCategories}
              updateFunc={updateForm}
              translationKey="post_editor.job.categories"
              minHeight={POST_EDITOR_FIELD_HEIGHT}
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
              onChange={this.handleTextChanged}
              value={form.text}
              placeholder={descriptionPlaceholderText}
              // onFocus={hidePicker}
              style={postEditorCommonStyles.input}
              withMentions
              testID="postTextArea"
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  componentDidMount() {
    const {
      form: {postSubType},
      updateForm,
    } = this.props;

    if (![postSubTypes.OFFERING, postSubTypes.SEEKING].includes(postSubType)) {
      updateForm({postSubType: postSubTypes.OFFERING});
    }
  }

  componentWillUnmount() {
    this.props.updateForm({
      location: null,
      text: null,
      title: null,
    });
  }

  handleCheckboxChosen = (updateFormData) => {
    // const {hidePicker, updateForm} = this.props;
    // hidePicker();
    // updateForm(updateFormData);
  };

  handleTextChanged = (val) => this.props.updateForm({text: val});

  isSubmitEnabled() {
    const {form, mode, postData, contextCountryCode} = this.props;
    const {
      postSubType,
      title,
      text,
      location,
      templateData,
      tags,
      scheduledDate,
      active,
    } = form;
    const {company} = templateData || {};
    const isTextValid = !!(text && text.trim().length);
    const isTitleAndTextAndTag = !!(
      isTextValid &&
      title &&
      title.length &&
      tags &&
      tags.length
    );

    switch (mode) {
      case editModes.CREATE:
        return isTitleAndTextAndTag;
      case editModes.EDIT: {
        const isSomethingChanged =
          postSubType !== postData.postSubType ||
          text !== postData.text ||
          title !== postData.title ||
          tags[0] !== postData.tags[0] ||
          company !== get(postData, 'templateData.company') ||
          get(location, 'googlePlaceId', null) !==
            get(postData, 'location.googlePlaceId', null) ||
          postData.scheduledDate !== scheduledDate ||
          active !== postData.active ||
          contextCountryCode !== postData.contextCountryCode;

        return isTitleAndTextAndTag && isSomethingChanged;
      }

      default:
        return false;
    }
  }

  getJobCategories = () =>
    Object.values(jobTypes).map((category) => ({
      name: I18n.t(`post_editor.job.categories.${category}`, {
        defaultValue: addSpaceOnCapitalsAndCapitalize(category),
      }),
      tags: [category],
    }));
}

JobPostEditor.propTypes = {
  CountryPickerComponent: PropTypes.node,
  isShowCountryPicker: PropTypes.bool,
  form: PropTypes.shape({
    postSubType: PropTypes.oneOf([postSubTypes.OFFERING, postSubTypes.SEEKING]),
    title: PropTypes.string,
    company: PropTypes.string,
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
  updateForm: PropTypes.func,
  updateTemplateData: PropTypes.func,
  // hidePicker: PropTypes.func,
  postData: PropTypes.object,
  contextCountryCode: PropTypes.arrayOf(PropTypes.number),
  mode: PropTypes.number,
  header: PropTypes.node,
};

JobPostEditor = connect(null, null, null, {forwardRef: true})(JobPostEditor);
export default JobPostEditor;
