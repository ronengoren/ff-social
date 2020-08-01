import React from 'react';
import PropTypes from 'prop-types';
import {Dimensions, Animated} from 'react-native';
import {connect} from 'react-redux';
// import { getPage } from '/redux/pages/actions';
import {View} from '../../components/basicComponents';
// import GooglePlacesService from '/infra/google/googlePlacesService';
import {commonStyles} from '../../vars';
import {editModes} from '../../vars/enums';
import PageEditorStep1 from './PageEditorStep1';
import PageEditorStep2 from './PageEditorStep2';

class PageEditor extends React.PureComponent {
  static TYPES = {
    PAGE: 'page',
    RECOMMENDATION: 'recommendation',
    LIST_ITEM: 'list_item',
  };

  constructor(props) {
    super(props);
    const screenWidth = Dimensions.get('window').width;
    this.isEditMode =
      props.mode === editModes.EDIT || (props.form && props.form.pageId);
    this.mode = this.isEditMode ? editModes.EDIT : editModes.CREATE;
    if (this.isEditMode) {
      this.loadEditedPageData();
    }
    this.state = {
      translateX: new Animated.Value(this.isEditMode ? -screenWidth : 0),
      searchTerm: this.isEditMode ? props.form.title : '',
    };
  }

  render() {
    const {
      form,
      updateForm,
      setMedia,
      type,
      header,
      backAction,
      onTitleInputFocus,
      onSubmit,
      withHeader,
      withBottomButton,
      CountryPickerComponent,
      isShowCountryPicker,
    } = this.props;
    const {translateX, searchTerm} = this.state;
    const screenWidth = Dimensions.get('window').width;

    return (
      <View style={commonStyles.flex1}>
        {withHeader &&
          React.cloneElement(header, {
            isSubmitEnabled: true,
            onSubmit: this.handleSubmit,
          })}
        <Animated.View
          style={[
            commonStyles.flex1,
            commonStyles.flexDirectionRow,
            {width: 2 * screenWidth, transform: [{translateX}]},
          ]}>
          <PageEditorStep1
            proceedToNextStep={this.proceedToNextStep}
            type={type}
            hasSearchIcon={type !== PageEditor.TYPES.PAGE}
            title={form.title}
            searchTerm={searchTerm}
            isShowSearch={!!searchTerm}
            ref={(node) => {
              this.creationEditorStep1 = node;
            }}
            onTitleInputFocus={onTitleInputFocus}
            onTitleChange={(title) => updateForm({title})}
            onFinishedTypingTitle={this.handleFinishedTypingTitle}
            mode={this.mode}
          />
          <PageEditorStep2
            form={form}
            updateForm={updateForm}
            setMedia={setMedia}
            onSubmit={onSubmit}
            navigateBack={this.returnToPreviousStep}
            closeCreatingPage={backAction}
            isPageCreationFlow={type === PageEditor.TYPES.PAGE}
            type={type}
            CountryPickerComponent={CountryPickerComponent}
            isShowCountryPicker={isShowCountryPicker}
            mode={this.mode}
            ref={(node) => {
              this.step2 = node;
            }}
            withBottomButton={withBottomButton}
          />
        </Animated.View>
      </View>
    );
  }

  handleSubmit = () => {
    const {onSubmit} = this.props;
    const isValidated = this.step2.validate();

    if (isValidated) {
      onSubmit();
    }
  };

  proceedToNextStep = async ({item}) => {
    // const screenWidth = Dimensions.get('window').width;
    // const { form, updateForm, getPage } = this.props;
    // const { id, pageId, title, mediaUrl, location, googlePlaceId, isNewPage, placeId } = item;
    // let newFormValues = {};
    // if (id !== form.id || pageId !== form.pageId || title !== form.title) {
    //   newFormValues = {
    //     title,
    //     mediaUrl,
    //     text: '',
    //     location,
    //     pageId,
    //     googlePlaceId,
    //     tags: form.tags || [],
    //     url: '',
    //     phoneNumber: '',
    //     isNewPage
    //   };
    // }
    // if (pageId) {
    //   const data = await getPage({ pageId: item.pageId });
    //   const { phones, website, media, tags } = data.page;
    //   newFormValues.phoneNumber = phones && phones.length ? phones[0].number : '';
    //   newFormValues.url = website;
    //   newFormValues.mediaUrl = media.url;
    //   newFormValues.tags = tags;
    // } else if (!placeId && googlePlaceId) {
    //   const result = await GooglePlacesService.getPlaceDetails({ googlePlaceId });
    //   newFormValues.phoneNumber = result.formatted_phone_number;
    //   newFormValues.url = result.website;
    //   newFormValues.tags = form.tags || [];
    // }
    // updateForm({ ...newFormValues }, () => this.animateTransition({ toValue: -screenWidth }));
  };

  returnToPreviousStep = () => {
    this.animateTransition({toValue: 0});
  };

  animateTransition = ({toValue}) => {
    this.state.translateX.stopAnimation();
    Animated.timing(this.state.translateX, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  inputBlur = () => {
    this.creationEditorStep1 && this.creationEditorStep1.inputBlur();
  };

  handleFinishedTypingTitle = (searchTerm) => this.setState({searchTerm});

  loadEditedPageData = async () => {
    const {form, updateForm, getPage} = this.props;
    const res = await getPage({pageId: form.pageId});
    const {phones, website} = res.page;
    updateForm({
      phoneNumber: phones && phones[0] ? phones[0].number : '',
      url: website,
    });
  };
}

PageEditor.defaultProps = {
  mode: editModes.CREATE,
  withHeader: true,
};

PageEditor.propTypes = {
  form: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.string,
    mediaUrl: PropTypes.string,
    pageId: PropTypes.string,
    googlePlaceId: PropTypes.string,
    scrapedUrlId: PropTypes.string,
    url: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  updateForm: PropTypes.func,
  setMedia: PropTypes.func,
  type: PropTypes.oneOf(Object.values(PageEditor.TYPES)),
  header: PropTypes.node,
  mode: PropTypes.oneOf(Object.values(editModes)),
  backAction: PropTypes.func,
  onTitleInputFocus: PropTypes.func,
  onSubmit: PropTypes.func,
  withHeader: PropTypes.bool,
  withBottomButton: PropTypes.bool,
  isShowCountryPicker: PropTypes.bool,
  //   getPage: PropTypes.func,
  CountryPickerComponent: PropTypes.func,
};

const mapDispatchToProps = {};

PageEditor = connect(null, mapDispatchToProps, null, {forwardRef: true})(
  PageEditor,
);
export default PageEditor;
