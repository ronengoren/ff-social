import React, {Component} from 'react';
import PropTypes from 'prop-types';
import I18n from '../../../../infra/localization';
import {connect} from 'react-redux';
import {has} from 'lodash';
import {
  StyleSheet,
  Keyboard,
  Platform,
  TouchableOpacity,
  FlatList,
} from 'react-native';
// import { createScheduledPost } from '/redux/scheduledPosts/actions';
// import {createList, updateList} from '/redux/lists/actions';
import {
  CheckboxWithText,
  SwitchWithText,
  TextInput,
  View,
  Text,
  ScrollView,
  ImagePlaceholder,
  Image,
  DummyTextInput,
} from '../../../../components/basicComponents';
import {get, deleteObjectPropFromArrayOfObjects} from '../../../../infra/utils';
// import {NativeMediaPicker} from '/infra/media';
import {navigationService} from '../../../../infra/navigation';
import {ItemErrorBoundary, SuggestionItem} from '../../../../components';
import {
  flipFlopColors,
  commonStyles,
  postEditorCommonStyles,
  POST_EDITOR_FIELD_HEIGHT,
} from '../../../../vars';
import {DeleteModal, ErrorModal} from '../../../../components/modals';
import {TagPicker} from '../../../../components/formElements';
import {getFormattedDateAndTime} from '../../../../infra/utils/dateTimeUtils';
import {FlipFlopIcon, AwesomeIcon} from '../../../../assets/icons';
import {
  listViewTypes,
  editModes,
  screenNames,
  dateAndTimeFormats,
  mediaTypes,
  entityTypes,
  screenStateTypes,
  postTypes,
} from '../../../../vars/enums';
import {mediaScheme} from '../../../../schemas/common';
// import {createPost} from '/redux/postPage/actions';
import {DatesPicker} from '../../../../screens';
import {isRTL} from '../../../../infra/utils/stringUtils';
import PostEditorHeader from '../PostEditorHeader';

const isIOS = Platform.OS === 'ios';
const TEXT_OFFSET = 195;
const TEXT_BOTTOM_PADDING = 60;

const styles = StyleSheet.create({
  coverImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
  },
  coverImageUpdateBtn: {
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: flipFlopColors.lightBlack,
    left: 15,
    top: 75,
    height: 30,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
  },
  coverImageUpdateBtnIcon: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  coverImageUpdateBtnTxt: {
    color: flipFlopColors.white,
    marginLeft: 5,
    lineHeight: 30,
  },
  textAreaWithError: {
    borderBottomColor: flipFlopColors.vermillion,
  },
  list: {
    paddingVertical: 8,
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    backgroundColor: flipFlopColors.white,
    borderRadius: 10,
  },
  addItemIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: flipFlopColors.paleGreyTwo,
    width: 70,
    marginRight: 15,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  imagePlaceholderWithError: {
    borderStyle: 'solid',
    borderColor: flipFlopColors.watermelon,
  },
  imagePlaceholderTextWithError: {
    color: flipFlopColors.watermelon,
  },
  suggestionItem: {
    marginHorizontal: 0,
  },
  listViewSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

class ListPostEditor extends Component {
  constructor(props) {
    super(props);
    this.checkboxesLabelText = I18n.t('post_editor.list.view_type');
    this.isRtlCheckboxes = isRTL(this.firstCheckboxText);
    this.state = {
      showDeleteItemModal: false,
      screenState: screenStateTypes.COMPOSE,
      showErrorFields: false,
    };
  }

  render() {
    // const {
    //   form,
    //   hidePicker,
    //   updateForm,
    //   mode,
    //   onPostTypePress,
    //   onClose,
    //   hasPublishAsSelector,
    //   isPostAsPickerEnabled,
    //   updatePuplishAsEntity,
    //   publishAs,
    //   isShowToast,
    //   hideToast,
    //   isScheduleSupported,
    //   isViewTypesSupported,
    //   onPostAs,
    //   onPostIn,
    //   publishIn,
    //   isPostInPickerEnabled,
    //   isShowCountryPicker,
    //   CountryPickerComponent,
    // } = this.props;
    const {title, text, tags, scheduledDate, viewType} = form;
    const {showErrorFields} = this.state;

    return (
      <View style={commonStyles.flex1}>
        <PostEditorHeader
          postType={entityTypes.LIST}
          onPostTypePress={onPostTypePress}
          onClose={onClose}
          hasPublishAsSelector={hasPublishAsSelector}
          isPostAsPickerEnabled={isPostAsPickerEnabled}
          publishAs={publishAs}
          updatePuplishAsEntity={updatePuplishAsEntity}
          isShowToast={isShowToast}
          hideToast={hideToast}
          onSubmit={this.handleListSubmit}
          onPostAs={onPostAs}
          onPostIn={onPostIn}
          isPostInPickerEnabled={isPostInPickerEnabled}
          publishIn={publishIn}
          mode={mode}
          isSubmitEnabled
        />
        <ScrollView
          style={commonStyles.flex1}
          contentContainerStyle={postEditorCommonStyles.editorWrapper}
          ref={(node) => {
            this.postBodyScrollView = node;
          }}>
          {this.renderListImage()}
          <TextInput
            placeholder={I18n.t(
              'post_editor.list.placeholders.mandatory_title',
            )}
            inputStyle={[
              postEditorCommonStyles.input,
              postEditorCommonStyles.bottomBorder,
              !title && showErrorFields && styles.textAreaWithError,
            ]}
            value={title}
            onChange={(val) => updateForm({title: val})}
            // onFocus={hidePicker}
            ref={(node) => {
              this.titleInput = node;
            }}
            height={POST_EDITOR_FIELD_HEIGHT}
            testID="listTitle"
          />
          <TagPicker
            // onPress={hidePicker}
            selectedTags={tags}
            updateFunc={({tags}) => updateForm({tags})}
            style={
              (!tags || !tags.length) &&
              showErrorFields &&
              styles.textAreaWithError
            }
            minHeight={POST_EDITOR_FIELD_HEIGHT}
            testID="listTopicPicker"
          />
          <DummyTextInput
            onPress={this.navigateToAddDescription}
            minHeight={POST_EDITOR_FIELD_HEIGHT}
            textStyle={postEditorCommonStyles.dummyInput}
            style={[
              postEditorCommonStyles.bottomBorder,
              !text && showErrorFields && styles.textAreaWithError,
            ]}
            testID="listDescription"
            text={text}
            placeholder={I18n.t('groups.create.description')}
          />
          <SwitchWithText
            subHeader={I18n.t('post_editor.list.collaboration_switch')}
            active={
              has(form, 'templateData.collaborative')
                ? form.templateData.collaborative
                : true
            }
            onChange={this.handleListCollaborationOnChange}
            // onPress={hidePicker}
            style={postEditorCommonStyles.bottomBorder}
          />

          {isViewTypesSupported && (
            <View
              style={[
                styles.listViewSelector,
                this.isRtlCheckboxes &&
                  postEditorCommonStyles.rtlCheckboxesSection,
                postEditorCommonStyles.bottomBorder,
                !viewType && showErrorFields && styles.textAreaWithError,
              ]}>
              <Text color={flipFlopColors.b60} size={16}>
                {this.checkboxesLabelText}
              </Text>

              {Object.keys(listViewTypes).map((type) => (
                <CheckboxWithText
                  action={() => updateForm({viewType: listViewTypes[type]})}
                  text={listViewTypes[type]}
                  value={viewType === listViewTypes[type]}
                  style={styles.checkbox}
                />
              ))}
            </View>
          )}

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
          {mode === editModes.CREATE && this.renderListItemsSection()}
        </ScrollView>
        {this.renderModal()}
      </View>
    );
  }

  componentDidMount() {
    const {
      updateTemplateData,
      form: {templateData},
    } = this.props;
    const collaborative = get(templateData, 'collaborative');
    const items = get(templateData, 'items');
    const isCollaborativeDefined = typeof collaborative !== 'undefined';

    if (!isCollaborativeDefined || !items) {
      updateTemplateData({
        collaborative:
          typeof collaborative === 'undefined' ? true : collaborative,
        items: items || [],
      });
    }

    Keyboard.addListener('keyboardDidShow', this.handleKeyboardShown);
  }

  componentDidUpdate = (prevProps) => {
    const prevItems = get(prevProps, 'form.templateData.items', []);
    if (
      this.props.form.templateData.items &&
      prevItems &&
      this.props.form.templateData.items.length > prevItems.length
    ) {
      this.postBodyScrollView.scroll.scrollToEnd();
    }
  };

  componentWillUnmount() {
    this.props.updateForm({
      title: null,
      location: null,
      collaborative: null,
      items: null,
    });
    Keyboard.removeListener('keyboardDidShow', this.handleKeyboardShown);
  }

  renderModal = () => (
    <DeleteModal
      show={this.state.showDeleteItemModal}
      headerText={I18n.t('post_editor.list.delete_modal.header')}
      bodyText={I18n.t('post_editor.list.delete_modal.body')}
      onCancel={this.closeDeleteModal}
      onDelete={this.handleDeleteItem}
    />
  );

  renderListImage = () => {
    const {attachedMedia} = this.props;
    const mediaUrl = get(attachedMedia, '[0].url');
    if (mediaUrl) {
      return (
        <View>
          <Image style={styles.coverImage} source={{uri: mediaUrl}} />
          <TouchableOpacity
            accessibilityTraits="button"
            accessibilityComponentType="button"
            activeOpacity={1}
            style={styles.coverImageUpdateBtn}
            onPress={() => this.handleAddMedia(mediaTypes.IMAGE)}>
            <View style={styles.coverImageUpdateBtnIcon}>
              <FlipFlopIcon
                name="camera"
                size={22}
                color={flipFlopColors.white}
              />
            </View>
            <Text style={styles.coverImageUpdateBtnTxt}>
              {I18n.t('post_editor.list.update_image_button')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    const {showErrorFields} = this.state;
    return (
      <ImagePlaceholder
        type="rectangular"
        size="small"
        text={I18n.t('post_editor.list.add_image')}
        iconName="photo"
        onPress={this.handleAddMedia}
        style={showErrorFields ? styles.imagePlaceholderWithError : null}
        color={showErrorFields ? flipFlopColors.watermelon : null}
        textStyle={
          showErrorFields ? styles.imagePlaceholderTextWithError : null
        }
      />
    );
  };

  renderListItemsSection = () => {
    const {
      form: {templateData},
    } = this.props;
    const items = get(templateData, 'items', []);
    const {itemDimension} = SuggestionItem;
    return [
      <TouchableOpacity
        style={[
          styles.addItemContainer,
          commonStyles.shadow,
          {height: itemDimension},
        ]}
        onPress={this.navigateToAddItem}
        activeOpacity={0.5}
        key="addListItemButton">
        <View style={styles.addItemIconWrapper}>
          <AwesomeIcon
            name="plus-circle"
            size={26}
            weight="solid"
            color={flipFlopColors.azure}
          />
        </View>
        <Text color={flipFlopColors.azure} size={16} testID="listAddItem">
          {I18n.t('post_editor.list.add_items_link')}
        </Text>
      </TouchableOpacity>,
      <FlatList
        style={styles.list}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        data={items}
        renderItem={({item, index}) => (
          <ItemErrorBoundary boundaryName="ListItemEntitySuggestedItem">
            <SuggestionItem
              item={item}
              onRemoveItem={this.handleRemoveItem(item)}
              onPressItem={this.handleItemPressed({item, index})}
              style={styles.suggestionItem}
            />
          </ItemErrorBoundary>
        )}
        keyExtractor={(i, index) => `${index}-${i.title}`}
        disableVirtualization={false}
        getItemLayout={(data, index) => ({
          length: itemDimension,
          offset: itemDimension * index,
          index,
        })}
        key="listItemsList"
      />,
    ];
  };

  navigateToAddDescription = () => {
    // const {
    //   form: {text},
    //   updateForm,
    //   hidePicker,
    // } = this.props;
    // hidePicker();
    // navigationService.navigate(screenNames.AddDescription, {
    //   updateFunc: ({text}) => updateForm({text}),
    //   text,
    //   type: 'list',
    //   title: I18n.t('groups.create.description'),
    //   placeholder: I18n.t(
    //     'post_editor.list.placeholders.mandatory_description',
    //   ),
    // });
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

  handleRemoveItem = (item) => () => {
    // const {hidePicker} = this.props;
    // hidePicker();
    // this.setState({showDeleteItemModal: true, deleteItemId: item.id});
  };

  handleItemPressed = ({item, index}) => () => {
    // const {updateTemplateData, form, hidePicker} = this.props;
    // const {
    //   templateData: {items},
    // } = form;
    // hidePicker();
    // navigationService.navigate(screenNames.AddListItem, {
    //   list: form,
    //   item,
    //   mode: editModes.EDIT,
    //   onEditItem: (editedItem) => {
    //     updateTemplateData({
    //       items: [
    //         ...items.slice(0, index),
    //         editedItem,
    //         ...items.slice(index + 1),
    //       ],
    //     });
    //   },
    // });
  };

  handleDeleteItem = () => {
    const {updateTemplateData, form, hidePicker} = this.props;
    const {
      templateData: {items},
    } = form;
    const {deleteItemId} = this.state;

    hidePicker();
    const index = items.findIndex((item) => item.id === deleteItemId);
    updateTemplateData({
      items: [...items.slice(0, index), ...items.slice(index + 1)],
    });
    this.closeDeleteModal();
  };

  handleAddMedia = async () => {
    // const {setMedia, hidePicker} = this.props;
    // hidePicker();
    // const res = await NativeMediaPicker.show({mediaType: mediaTypes.IMAGE});
    // if (!res) return;
    // const {localUri, fileName} = res;
    // navigationService.navigate(screenNames.ImageUpload, {
    //   localUri,
    //   fileName,
    //   entityType: entityTypes.LIST,
    //   onComplete: (media) => {
    //     setMedia({media: {url: media.mediaUrl}});
    //   },
    // });
  };

  handleListSubmit = async () => {
    // const { screenState } = this.state;
    // const { mode, createPost, createScheduledPost, contextCountryCode } = this.props;
    // const {
    //   form: { scheduledDate }
    // } = this.props;
    // const submitEnabled = this.validateFields();
    // const isSubmitting = screenState === screenStateTypes.SUBMITTING;
    // if (submitEnabled && !isSubmitting) {
    //   this.setState({ screenState: screenStateTypes.SUBMITTING });
    //   Keyboard.dismiss();
    //   try {
    //     if (mode === editModes.CREATE) {
    //       const list = await this.submitCreateList();
    //       const { id, name, description, tags, creator, context } = list;
    //       const data = {
    //         text: description,
    //         title: name,
    //         tags,
    //         postType: postTypes.SHARE,
    //         contextId: context.id,
    //         contextType: context.type,
    //         templateData: { entityCreation: true },
    //         sharedEntityType: entityTypes.LIST,
    //         sharedEntityId: id,
    //         publisherId: creator.id,
    //         publisherType: creator.type,
    //         scheduledDate,
    //         contextCountryCode
    //       };
    //       if (scheduledDate) {
    //         createScheduledPost({ data });
    //       } else {
    //         createPost({ data });
    //       }
    //       navigationService.goBack();
    //       navigationService.navigate(screenNames.ListView, { entityId: id });
    //     } else {
    //       await this.submitEditList();
    //       navigationService.goBack();
    //     }
    //   } catch (err) {
    //     this.setState({ screenState: screenStateTypes.COMPOSE });
    //     ErrorModal.showAlert();
    //   }
    // }
  };

  navigateToAddItem = () => {
    // const {updateTemplateData, form, shareTo, hidePicker} = this.props;
    // hidePicker();
    // navigationService.navigate(screenNames.AddListItem, {
    //   list: form,
    //   context: shareTo,
    //   onAddItem: (item) => {
    //     updateTemplateData({items: [...form.templateData.items, item]});
    //   },
    // });
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

  handleListCollaborationOnChange = () => {
    const {updateTemplateData, form} = this.props;

    updateTemplateData({collaborative: !form.templateData.collaborative});
  };

  validateFields = () => {
    const {form, attachedMedia, isViewTypesSupported} = this.props;
    const {title, text, tags, viewType} = form;
    const mediaUrl = get(attachedMedia, '[0].url');

    if (
      !title ||
      !text ||
      !mediaUrl ||
      !tags ||
      (isViewTypesSupported && !viewType)
    ) {
      if (!mediaUrl || !title) {
        this.postBodyScrollView.scrollTo({x: 0, y: 0, animated: true});
      }
      return this.setState({showErrorFields: true}, () => false);
    }

    return true;
  };

  closeDeleteModal = () => {
    this.setState({
      showDeleteItemModal: !this.state.showDeleteItemModal,
      deleteItemId: null,
    });
  };

  submitCreateList = async () => {
    // const { form, navigation, shareTo, createList, attachedMedia, publishAs, contextCountryCode } = this.props;
    // const { title, text, templateData, tags, viewType } = form;
    // const { collaborative, items } = templateData;
    // const mediaUrl = get(attachedMedia, '[0].url');
    // const updatedItems = deleteObjectPropFromArrayOfObjects({ arr: items, propName: 'location' });
    // const data = {
    //   contextId: shareTo.id || publishAs.id,
    //   contextType: shareTo.entityType || publishAs.type || publishAs.entityType,
    //   name: title,
    //   description: text,
    //   collaborative,
    //   mediaUrl,
    //   publisherId: publishAs.id,
    //   publisherType: publishAs.type || publishAs.entityType,
    //   items: updatedItems,
    //   tags,
    //   viewType,
    //   contextCountryCode
    // };
    // const list = await createList({ list: data, screenName: navigation.state.routeName });
    // return list;
  };

  submitEditList = () => {
    // const { form, postData, updateList, attachedMedia, contextCountryCode } = this.props;
    // const { title, text, templateData, tags, viewType } = form;
    // const { collaborative } = templateData;
    // const mediaUrl = get(attachedMedia, '[0].url');
    // const delta = {
    //   mediaUrl: mediaUrl !== postData.media.url && mediaUrl,
    //   name: title !== postData.name && title,
    //   description: text !== postData.description && text,
    //   tags: tags !== postData.tags && tags,
    //   viewType
    // };
    // if (postData.contextCountryCode !== contextCountryCode) {
    //   delta.contextCountryCode = contextCountryCode;
    // }
    // Object.keys(delta).forEach((k) => {
    //   if (delta[k] === false) {
    //     delete delta[k];
    //   }
    // });
    // if (collaborative !== postData.collaborative) {
    //   delta.collaborative = collaborative;
    // }
    // updateList({ listId: postData.id, delta });
  };
}

ListPostEditor.propTypes = {
  CountryPickerComponent: PropTypes.node,
  isShowCountryPicker: PropTypes.bool,
  contextCountryCode: PropTypes.arrayOf(PropTypes.number),
  isViewTypesSupported: PropTypes.bool,
  isScheduleSupported: PropTypes.bool,
  form: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    templateData: PropTypes.shape({
      collaborative: PropTypes.bool,
      items: PropTypes.arrayOf(PropTypes.object),
    }),
    text: PropTypes.string,
    tags: PropTypes.array,
    viewType: PropTypes.string,
    scheduledDate: PropTypes.string,
  }),
  attachedMedia: PropTypes.arrayOf(mediaScheme),
  updateForm: PropTypes.func,
  setMedia: PropTypes.func,
  updateTemplateData: PropTypes.func,
  // hidePicker: PropTypes.func,
  postData: PropTypes.object,
  mode: PropTypes.number,
  navigation: PropTypes.object,
  shareTo: PropTypes.shape({
    id: PropTypes.string,
    entityType: PropTypes.string,
    name: PropTypes.string,
    media: PropTypes.object,
  }),
  publishAs: PropTypes.shape({
    id: PropTypes.string,
    entityType: PropTypes.string,
    name: PropTypes.string,
    media: PropTypes.object,
    type: PropTypes.string,
  }),
  publishIn: PropTypes.object,
  onPostTypePress: PropTypes.func,
  onClose: PropTypes.func,
  hasPublishAsSelector: PropTypes.bool,
  isShowToast: PropTypes.bool,
  hideToast: PropTypes.func,
  //   createList: PropTypes.func,
  //   updateList: PropTypes.func,
  //   createPost: PropTypes.func,
  isPostAsPickerEnabled: PropTypes.bool,
  updatePuplishAsEntity: PropTypes.func,
  onPostAs: PropTypes.func,
  onPostIn: PropTypes.func,
  isPostInPickerEnabled: PropTypes.bool,
  //   createScheduledPost: PropTypes.func
};

const mapDispatchToProps = {
  //   createList,
  //   updateList,
  //   createPost,
  //   createScheduledPost
};

ListPostEditor = connect(null, mapDispatchToProps, null, {forwardRef: true})(
  ListPostEditor,
);
export default ListPostEditor;
