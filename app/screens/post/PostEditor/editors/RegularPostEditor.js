import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {StyleSheet, ScrollView} from 'react-native';
import I18n from '../../../../infra/localization';
import {Text, TextArea, View} from '../../../../components/basicComponents';
import {RichTextShowAndEdit} from '../../../../components';
import {
  flipFlopColors,
  commonStyles,
  POST_EDITOR_FIELD_HEIGHT,
} from '../../../../vars';
import {editModes, postTypes, screenNames} from '../../../../vars/enums';
import {TagPicker} from '../../../../components/formElements';
import {navigationService} from '../../../../infra/navigation';
import {
  get,
  arrayToStringByKey,
  isAppAdmin,
  canChangeCountryPicker,
  isArraysContainsTheSameElements,
  isEmpty,
} from '../../../../infra/utils';
import {searchMentionsScheme} from '../../../../schemas';
import PreviewSection from '../commons/PreviewSection';
import {editorMediaScheme} from './schemas';

const TEXT_AREA_LINE_HEIGHT = 30;
const TEXT_AREA_MARGIN = 15;

const styles = StyleSheet.create({
  scrollViewContentContainer: {
    flexGrow: 1,
  },
  textArea: {
    flex: 1,
    paddingTop: 0,
    padding: 0,
    marginBottom: 20,
    paddingLeft: 0,
    margin: TEXT_AREA_MARGIN,
    fontSize: 20,
    lineHeight: TEXT_AREA_LINE_HEIGHT,
  },
  richTextWrapper: {
    flex: 1,
    paddingHorizontal: 15,
  },
  categoryWrapper: {
    flex: 0,
    marginHorizontal: 15,
  },
  headerText: {
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  activationWithImageOnly: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  countryPicker: {
    paddingHorizontal: 15,
  },
});

const SNAP_TO_INTERVAL = 200;
class RegularPostEditor extends Component {
  render() {
    // const {
    //   scrapedUrl,
    //   openActionSheet,
    //   clearScraping,
    //   attachedMedia,
    //   form,
    //   // onRegularInputChange,
    //   onFocusTextarea,
    //   onAddMedia,
    //   onRemoveMedia,
    //   header,
    //   headerText,
    //   textareaPlaceholder,
    //   withMentions,
    //   isPostTypeActivationWithOnlyImage,
    //   isShowCountryPicker,
    //   CountryPickerComponent,
    //   isAdmin,
    //   publishAs,
    //   isPostPickerHidden,
    //   hidePicker,
    //   featureFlags,
    //   // user,
    // } = this.props;
    const isSubmitEnabled = this.isSubmitEnabled();
    // const canChangeCountry = canChangeCountryPicker(user, publishAs);
    const {postType, tags} = form;
    const isTipRequest = postType === postTypes.TIP_REQUEST;
    return (
      <View style={[commonStyles.flex1]}>
        {React.cloneElement(header, {
          isSubmitEnabled,
          onDisabledSubmitClick: this.handleDisabledSubmitClick,
        })}
        {!!postType && (
          <React.Fragment>
            {!!headerText && (
              <Text
                size={22}
                lineHeight={30}
                color={flipFlopColors.b30}
                bold
                style={styles.headerText}
                alignLocale>
                {headerText}
              </Text>
            )}

            <ScrollView
              ref={(scroll) => {
                this.scroll = scroll;
              }}
              onLayout={this.handleLayout}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollViewContentContainer}
              disableScrollViewPanResponder
              snapToInterval={SNAP_TO_INTERVAL}>
              {isTipRequest && (
                <TagPicker
                  selectedTags={tags}
                  // onPress={hidePicker}
                  updateFunc={this.pickCategories}
                  minHeight={POST_EDITOR_FIELD_HEIGHT}
                  style={styles.categoryWrapper}
                />
              )}

              <View style={styles.richTextWrapper}>
                <RichTextShowAndEdit
                  // onPress={!isPostPickerHidden ? hidePicker : null}
                  text={form.text}
                  placeholderText={
                    textareaPlaceholder ||
                    I18n.t(`post_editor.post_placeholders.${form.postType}`)
                  }
                  // onSubmit={onRegularInputChange}
                />
              </View>
              <View style={commonStyles.flex1}>
                <TextArea
                  // onChange={onRegularInputChange}
                  value={form.text}
                  placeholder={
                    textareaPlaceholder ||
                    I18n.t(`post_editor.post_placeholders.${form.postType}`)
                  }
                  onFocus={onFocusTextarea}
                  ref={(node) => {
                    this.textInput = node;
                  }}
                  style={styles.textArea}
                  withMentions={withMentions}
                  testID="postTextArea"
                  onContentSizeChange={this.handleInputSizeChange}
                  scrollEnabled={false}
                />
              </View>

              <View
                style={
                  isPostTypeActivationWithOnlyImage &&
                  styles.activationWithImageOnly
                }>
                <PreviewSection
                  ctaText={
                    isPostTypeActivationWithOnlyImage
                      ? textareaPlaceholder
                      : null
                  }
                  handleAddMedia={onAddMedia}
                  handleRemoveMedia={onRemoveMedia}
                  openActionSheet={openActionSheet}
                  deleteScrapedUrlPreview={clearScraping}
                  isWithCta={false}
                  attachedMedia={attachedMedia}
                  scrapedUrl={scrapedUrl}
                  isPostTypeActivationWithOnlyImage={
                    isPostTypeActivationWithOnlyImage
                  }
                />
              </View>

              {isShowCountryPicker && canChangeCountry && isPostPickerHidden && (
                <View style={styles.countryPicker}>
                  <CountryPickerComponent />
                </View>
              )}
            </ScrollView>
          </React.Fragment>
        )}
      </View>
    );
  }

  componentDidUpdate() {
    const {
      searchMentions: {results, isSearching},
    } = this.props;
    const isMentionOptionsShown = results && (results.length || isSearching);
    const isOnLastLine = this.textInput && this.textInput.isOnLastLine();
    if (isMentionOptionsShown && isOnLastLine) {
      this.scrollToSecondLine();
    }
  }

  handleDisabledSubmitClick = () => {
    // const {form, hidePicker} = this.props;
    // const {postType, tags: selectedTags, text} = form;
    // if (postType === postTypes.TIP_REQUEST) {
    //   hidePicker();
    //   if (isEmpty(selectedTags)) {
    //     navigationService.navigate(screenNames.CategoryPicker, {
    //       isWithOtherOption: true,
    //       selectedTags,
    //       updateFunc: this.pickCategories,
    //     });
    //   } else if (isEmpty(text)) {
    //     this.textInput.focus();
    //   }
    // }
  };

  isSubmitEnabled() {
    // const {
    //   postData,
    //   scrapedUrl,
    //   mode,
    //   form: {text, postType, scheduledDate, tags},
    //   attachedMedia,
    //   isPostTypeActivationWithOnlyImage,
    //   contextCountryCode,
    // } = this.props;
    // const scrapedUrlId = scrapedUrl.data && scrapedUrl.data.scrapedUrlId;
    // const isTextValid = !!(text && text.trim().length);
    // let isAllFieldsFilled = isTextValid;
    // if (postType === postTypes.STATUS_UPDATE) {
    //   isAllFieldsFilled = isAllFieldsFilled || !!attachedMedia.length;
    // }
    // if (postType === postTypes.TIP_REQUEST) {
    //   const hasTags = tags && tags.length > 0;
    //   isAllFieldsFilled = isTextValid && hasTags;
    // }
    // if (isPostTypeActivationWithOnlyImage) {
    //   isAllFieldsFilled = !!attachedMedia.length;
    // }
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
    //     let isSomethingChanged = !!(
    //       text !== postData.text ||
    //       attachedMediaLocalUris !== postDataMediaUrls ||
    //       postType !== postData.postType ||
    //       (postData.link && scrapedUrlId !== postData.link.id) ||
    //       postData.scheduledDate !== scheduledDate ||
    //       contextCountryCode !== postData.contextCountryCode
    //     );
    //     if (postType === postTypes.TIP_REQUEST) {
    //       isSomethingChanged =
    //         isSomethingChanged ||
    //         !isArraysContainsTheSameElements(postData.tags, tags);
    //     }
    //     return isAllFieldsFilled && isSomethingChanged;
    //   }
    //   default:
    //     return false;
    // }
  }

  handleInputSizeChange = ({height, isChangeOnLastLine}) => {
    this.height = height;
    if (height > this.scrollHeight && isChangeOnLastLine) {
      this.scrollToSecondLine();
    }
  };

  scrollToSecondLine = () =>
    this.scroll &&
    this.scroll.scrollTo({
      x: 0,
      y: this.height + TEXT_AREA_MARGIN - TEXT_AREA_LINE_HEIGHT * 2,
      animated: true,
    });

  pickCategories = ({tags}) => {
    const {updateForm} = this.props;
    updateForm({tags});
  };

  handleLayout = ({
    nativeEvent: {
      layout: {height},
    },
  }) => {
    this.scrollHeight = height;
  };
}

RegularPostEditor.propTypes = {
  // user: PropTypes.object,
  isShowCountryPicker: PropTypes.bool,
  // CountryPickerComponent: PropTypes.element,
  // isAdmin: PropTypes.bool,
  isPostTypeActivationWithOnlyImage: PropTypes.bool,
  withMentions: PropTypes.bool,
  textareaPlaceholder: PropTypes.string,
  headerText: PropTypes.string,
  scrapedUrl: PropTypes.object,
  openActionSheet: PropTypes.func,
  clearScraping: PropTypes.func,
  attachedMedia: PropTypes.arrayOf(editorMediaScheme),
  form: PropTypes.object,
  onRegularInputChange: PropTypes.func,
  onFocusTextarea: PropTypes.func,
  onAddMedia: PropTypes.func,
  onRemoveMedia: PropTypes.func,
  postData: PropTypes.object,
  mode: PropTypes.number,
  contextCountryCode: PropTypes.arrayOf(PropTypes.number),
  publishAs: PropTypes.object,
  header: PropTypes.node,
  // searchMentions: searchMentionsScheme,
  isPostPickerHidden: PropTypes.bool,
  // hidePicker: PropTypes.func,
  // featureFlags: PropTypes.object,
  updateForm: PropTypes.func,
};

RegularPostEditor.defaultProps = {
  withMentions: true,
};

const mapStateToProps = (state) => ({
  // user: get(state, 'auth.user'),
  // isAdmin: isAppAdmin(get(state, 'auth.user')),
  // searchMentions: state.mentions.searchMentions,
  // featureFlags: state.auth.featureFlags,
});

export default connect(mapStateToProps, null, null, {forwardRef: true})(
  RegularPostEditor,
);
