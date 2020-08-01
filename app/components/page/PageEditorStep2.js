import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
// import { initSearchAddress } from '/redux/searchAddress/actions';
// import { scrapeUrl, clearScraping } from '/redux/urlScraping/actions';
import {TagPicker} from '../../components/formElements';
import {UploadImageButton} from '../../components/uploadImageButton';
import {ClaimModal} from '../../components/page';
import {ErrorModal} from '../../components/modals';
import {
  ScrollView,
  View,
  Text,
  NewTextButton,
  Image,
} from '../../components/basicComponents';
import {AwesomeIcon, FlipFlopIcon} from '../../assets/icons';
import images from '../../assets/images';
import {
  commonStyles,
  flipFlopColors,
  uiConstants,
  flipFlopFontsWeights,
} from '../../vars';
import {screenNames, entityTypes, editModes} from '../../vars/enums';
import {removeAddressSuffix} from '../../infra/utils/addressUtils';
import {navigationService} from '../../infra/navigation';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '50%',
    backgroundColor: flipFlopColors.white,
  },
  goBackButtonWrapper: {
    flexDirection: 'row',
    marginVertical: 10,
    marginLeft: 20,
  },
  goBackButtonIcon: {
    marginRight: 8,
  },
  goBackButtonPlaceholder: {
    width: '100%',
    height: 30,
  },
  pagePreviewWrapper: {
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 20,
    backgroundColor: flipFlopColors.white,
  },
  pagePreviewImageWrapper: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  pagePreviewImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  pagePreviewTitle: {
    marginHorizontal: 15,
    marginVertical: 10,
  },
  existingPageDisclaimer: {
    marginHorizontal: 40,
    marginBottom: 30,
    textAlign: 'center',
  },
  claimBtn: {
    alignSelf: 'center',
  },
  claimBtnText: {
    color: flipFlopColors.white,
  },
  detailsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  locationIcon: {
    marginRight: 5,
    marginLeft: -2,
  },
  websiteIcon: {
    marginRight: 9,
  },
  phoneIcon: {
    marginRight: 9,
  },
  tagsWrapperText: {
    fontSize: 22,
    lineHeight: 30,
    color: flipFlopColors.b30,
    fontWeight: flipFlopFontsWeights.bold,
  },
  tagsWrapperTextWithError: {
    color: flipFlopColors.vermillion,
  },
  formWrapper: {
    marginHorizontal: 20,
  },
  descriptionWrapper: {
    marginBottom: 25,
    marginHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: flipFlopColors.b90,
  },
  descriptionHeader: {
    marginBottom: 5,
  },
  createPageButtonWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: flipFlopColors.green,
  },
  createPageButton: {
    marginVertical: uiConstants.NAVBAR_TOP_MARGIN,
    borderRadius: 0,
  },
  createPageText: {
    fontSize: 16,
    color: flipFlopColors.white,
  },
  uploadPageImageBtn: {
    position: 'absolute',
    top: 50,
    left: 138,
  },
});

class PageEditorStep2 extends React.Component {
  state = {
    hasErrors: false,
    isClaimModalVisible: false,
  };

  render() {
    const {
      isPageCreationFlow,
      form: {isNewPage, pageId},
      mode,
      withBottomButton,
      isShowCountryPicker,
      CountryPickerComponent,
    } = this.props;

    return (
      <View style={styles.wrapper}>
        <ScrollView
          style={commonStyles.flex1}
          keyboardDismissMode="on-drag"
          testID="creationEditorFinalStep">
          {mode === editModes.CREATE ? (
            <TouchableOpacity
              onPress={this.navigateBack}
              activeOpacity={1}
              style={styles.goBackButtonWrapper}>
              <AwesomeIcon
                name="angle-left"
                size={14}
                color={flipFlopColors.green}
                weight="solid"
                style={styles.goBackButtonIcon}
              />
              <Text size={13} lineHeight={15} color={flipFlopColors.green}>
                {I18n.t('page.create.part2.go_back')}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.goBackButtonPlaceholder} />
          )}
          {this.renderPagePreview()}
          {!isPageCreationFlow && this.renderRecommendationSection()}
          {!isNewPage &&
            pageId &&
            isPageCreationFlow &&
            this.renderClaimPageState()}
          {!pageId && this.renderCategoriesSection()}
          {isShowCountryPicker && (
            <View style={styles.formWrapper}>
              <CountryPickerComponent />
            </View>
          )}
        </ScrollView>
        {withBottomButton &&
          (isNewPage || !pageId || !isPageCreationFlow) &&
          this.renderSubmitButton()}
      </View>
    );
  }

  // componentDidUpdate(prevProps) {
  //   const {scrapedUrl, form, updateForm} = this.props;
  //   const hasNoPreviouslyScrapedUrl =
  //     !prevProps.scrapedUrl.data && scrapedUrl.data;
  //   const hasScrapedNewUrl =
  //     scrapedUrl.data &&
  //     prevProps.scrapedUrl.data &&
  //     scrapedUrl.data.url !== prevProps.scrapedUrl.data.url;
  //   if (hasNoPreviouslyScrapedUrl || hasScrapedNewUrl) {
  //     const {image} = scrapedUrl.data;
  //     if (!form.mediaUrl && image.url) {
  //       updateForm({mediaUrl: image.url});
  //     }
  //   }
  // }

  isSubmitEnabled = false;
  renderPagePreview = () => {
    const {
      form: {title, location, url, phoneNumber, isNewPage},
    } = this.props;
    const shouldShowLocation = location || isNewPage;
    const shouldShowUrl = url || isNewPage;
    const shouldShowPhoneNumber = phoneNumber || isNewPage;
    return (
      <View style={[commonStyles.shadow, styles.pagePreviewWrapper]}>
        {this.renderPagePreviewImage()}
        <Text
          size={18}
          lineHeight={22}
          color={flipFlopColors.b30}
          bold
          numberOfLines={1}
          style={styles.pagePreviewTitle}>
          {title}
        </Text>
        {shouldShowLocation && this.renderPageLocation({isNewPage})}
        {shouldShowUrl && this.renderPageUrl({isNewPage})}
        {shouldShowPhoneNumber && this.renderPagePhoneNumber({isNewPage})}
      </View>
    );
  };

  renderPagePreviewImage = () => {
    const {
      form: {pageId, mediaUrl},
      isPageCreationFlow,
    } = this.props;
    const source = mediaUrl
      ? {uri: mediaUrl}
      : images.pageCreation.pageImagePlaceholder;
    const isUploadImageButtonVisible =
      !isPageCreationFlow || (isPageCreationFlow && !pageId);
    return (
      <View style={styles.pagePreviewImageWrapper}>
        <Image
          source={source}
          style={styles.pagePreviewImage}
          resizeMode="cover"
        />
        {isUploadImageButtonVisible && (
          <UploadImageButton
            entityType={entityTypes.PAGE}
            saveMedia={this.updateUploadedImage}
            hasImage={!!mediaUrl}
            style={styles.uploadPageImageBtn}
          />
        )}
      </View>
    );
  };

  renderPageLocation = ({isNewPage}) => {
    const {
      form: {location},
    } = this.props;
    const action = isNewPage ? this.addPageAddress : null;
    const color =
      !location && isNewPage ? flipFlopColors.green : flipFlopColors.b30;
    const icon = (
      <FlipFlopIcon
        name="location"
        size={16}
        color={flipFlopColors.b30}
        style={styles.locationIcon}
      />
    );
    const text = location
      ? removeAddressSuffix(location)
      : I18n.t('page.create.part2.address_placeholder');
    return this.renderPageDetailRow({action, icon, text, color});
  };

  renderPageUrl = ({isNewPage}) => {
    const {
      form: {url},
    } = this.props;
    const action = isNewPage
      ? () => this.navigateToAddingPageDetails({field: 'url'})
      : null;
    const color = !url && isNewPage ? flipFlopColors.green : flipFlopColors.b30;
    const icon = (
      <AwesomeIcon
        name="link"
        size={10}
        color={flipFlopColors.b30}
        weight="solid"
        style={styles.websiteIcon}
      />
    );
    const text = url || I18n.t('page.create.part2.website_placeholder');
    return this.renderPageDetailRow({action, icon, text, color});
  };

  renderPagePhoneNumber = ({isNewPage}) => {
    const {
      form: {phoneNumber},
    } = this.props;
    const action = isNewPage
      ? () => this.navigateToAddingPageDetails({field: 'phoneNumber'})
      : null;
    const color =
      !phoneNumber && isNewPage ? flipFlopColors.green : flipFlopColors.b30;
    const icon = (
      <AwesomeIcon
        name="phone"
        size={10}
        color={flipFlopColors.b30}
        weight="solid"
        style={styles.phoneIcon}
      />
    );
    const text =
      phoneNumber || I18n.t('page.create.part2.phone_number_placeholder');
    return this.renderPageDetailRow({action, icon, text, color});
  };

  renderPageDetailRow = ({action, icon, text, color}) => (
    <TouchableOpacity
      onPress={action}
      activeOpacity={action ? 0.5 : 1}
      style={styles.detailsRow}>
      {icon}
      <Text
        size={14}
        lineHeight={16}
        color={color}
        numberOfLines={1}
        style={commonStyles.flex1}>
        {text}
      </Text>
    </TouchableOpacity>
  );

  renderRecommendationSection = () => {
    const {
      form: {text},
      type,
    } = this.props;
    const {hasErrors} = this.state;
    const isMissingDescription = hasErrors && (!text || !text.trim());
    return (
      <TouchableOpacity
        onPress={this.navigateToAddingDescription}
        activeOpacity={0.5}
        style={styles.descriptionWrapper}
        key="description"
        testID={`${type}Description`}>
        <Text
          size={22}
          lineHeight={30}
          color={
            isMissingDescription
              ? flipFlopColors.vermillion
              : flipFlopColors.b30
          }
          bold
          style={styles.descriptionHeader}>
          {I18n.t('page.create.part2.description.header')}
        </Text>
        <Text
          size={18}
          lineHeight={22}
          color={text ? flipFlopColors.b30 : flipFlopColors.b70}
          style={styles.description}
          numberOfLines={2}>
          {text || I18n.t('page.create.part2.description.placeholder')}
        </Text>
      </TouchableOpacity>
    );
  };

  renderClaimPageState = () => {
    const {
      form: {pageId},
    } = this.props;
    const {isClaimModalVisible} = this.state;
    return [
      <Text
        size={18}
        lineHeight={26}
        color={flipFlopColors.b30}
        style={styles.existingPageDisclaimer}
        key="disclaimer">
        {I18n.t('page.create.part2.existing_page_disclaimer')}
      </Text>,
      <NewTextButton
        size={NewTextButton.sizes.BIG50}
        customColor={flipFlopColors.green}
        onPress={this.toggleClaimModal}
        width={200}
        style={styles.claimBtn}
        textStyle={styles.claimBtnText}
        key="claimOwnershipBtn">
        {I18n.t('page.create.part2.claim_ownership')}
      </NewTextButton>,
      <ClaimModal
        isModalVisible={isClaimModalVisible}
        onCancelAction={this.toggleClaimModal}
        pageId={pageId}
        onDoneAction={this.finishedClaiming}
        key="claimModal"
      />,
    ];
  };

  renderCategoriesSection = () => {
    const {
      form: {tags},
      type,
    } = this.props;
    const {hasErrors} = this.state;
    const isMissingTags = hasErrors && (!tags || !tags.length);
    return (
      <TagPicker
        selectedTags={tags}
        updateFunc={this.updateTags}
        style={styles.formWrapper}
        subHeaderStyle={[
          styles.tagsWrapperText,
          isMissingTags && styles.tagsWrapperTextWithError,
        ]}
        testID={`select${type}Tags`}
      />
    );
  };

  renderSubmitButton = () => {
    const {type, mode} = this.props;
    const buttonText =
      mode === editModes.CREATE
        ? I18n.t(`page.create.part2.submit_button.${type}`)
        : I18n.t('page.create.part2.save_button');
    return (
      <View style={styles.createPageButtonWrapper} key="submitButton">
        <NewTextButton
          size={NewTextButton.sizes.BIG60}
          customColor={flipFlopColors.green}
          onPress={this.handleSubmit}
          style={styles.createPageButton}
          textStyle={styles.createPageText}
          testID={`${type}SubmitButton`}
          busy={this.isSubmitEnabled}>
          {buttonText}
        </NewTextButton>
      </View>
    );
  };

  navigateBack = () => {
    const {navigateBack} = this.props;
    navigateBack();
    this.setState({hasErrors: false});
  };

  toggleClaimModal = () => {
    const {isClaimModalVisible} = this.state;
    this.setState({isClaimModalVisible: !isClaimModalVisible});
  };

  finishedClaiming = () => {
    const {closeCreatingPage} = this.props;
    this.toggleClaimModal();
    closeCreatingPage();
  };

  navigateToAddingPageDetails = ({field}) => {
    const {
      form: {url, phoneNumber},
    } = this.props;
    navigationService.navigate(screenNames.AddPageDetails, {
      updateFields: this.updateUrlAndPhoneNumber,
      url,
      phoneNumber,
      fieldToFocus: field,
    });
  };

  navigateToAddingDescription = () => {
    const {
      form: {text},
      type,
    } = this.props;
    navigationService.navigate(screenNames.AddDescription, {
      updateFunc: this.updateDescription,
      text,
      type,
      subTitle: I18n.t('page.create.part2.description.header'),
      placeholder: I18n.t('page.create.part2.description.placeholder'),
    });
  };

  addPageAddress = () => {
    // const { initSearchAddress, community, updateForm } = this.props;
    // const { destinationCountryCode, destinationLocation } = community;
    // initSearchAddress({ country: destinationCountryCode, coordinates: destinationLocation, types: 'geocode|establishment' });
    // navigationService.navigate(screenNames.SearchAddress, {
    //   onAddressChosen: (address) => updateForm({ location: address.value, isAddressGooglePlaceId: true, googlePlaceId: address.googlePlaceId })
    // });
  };

  updateUploadedImage = ({mediaUrl}) => {
    const {setMedia, updateForm} = this.props;
    setMedia && setMedia({media: {url: mediaUrl}});
    updateForm({mediaUrl, isUserMedia: true});
  };

  updateTags = ({tags}) => {
    const {updateForm} = this.props;
    updateForm({tags});
  };

  updateUrlAndPhoneNumber = ({url, phoneNumber}) => {
    // const { updateForm } = this.props;
    // updateForm({ url, phoneNumber }, this.scrapeUrlIfNecessary);
  };

  updateDescription = ({text}) => {
    const {updateForm} = this.props;
    updateForm({text});
  };

  scrapeUrlIfNecessary = async () => {
    // const {
    //   isPageCreationFlow,
    //   form: { url },
    //   scrapedUrl,
    //   scrapeUrl,
    //   clearScraping
    // } = this.props;
    // if (!isPageCreationFlow) {
    //   if (url) {
    //     if (this.scrapedUrl !== url) {
    //       this.scrapedUrl = url;
    //       await scrapeUrl({ url });
    //     }
    //   } else if (scrapedUrl.data) {
    //     clearScraping();
    //   }
    // }
  };

  validate = () => {
    const {
      isPageCreationFlow,
      form: {pageId, text, tags},
    } = this.props;
    const isMissingTags = !pageId && (!tags || !tags.length);
    const isMissingDescription = !isPageCreationFlow && (!text || !text.trim());
    if (this.isSubmitEnabled) {
      return false;
    }
    if (isMissingTags || isMissingDescription) {
      this.setState({hasErrors: true});
      return false;
    }
    return true;
  };

  handleSubmit = () => {
    const isValidated = this.validate();
    if (isValidated) {
      this.isSubmitEnabled = true;
      this.forceUpdate();
      this.handleSubmitRequest();
    }
  };

  handleSubmitRequest = async () => {
    const {onSubmit} = this.props;
    try {
      await onSubmit();
    } catch (err) {
      ErrorModal.showAlert();
    } finally {
      this.submitIsDisabled = false;
    }
  };
}

PageEditorStep2.propTypes = {
  type: PropTypes.string,
  form: PropTypes.shape({
    pageId: PropTypes.string,
    googlePlaceId: PropTypes.string,
    mediaUrl: PropTypes.string,
    title: PropTypes.string,
    location: PropTypes.string,
    isNewPage: PropTypes.bool,
    url: PropTypes.string,
    text: PropTypes.string,
    tags: PropTypes.array,
    phoneNumber: PropTypes.string,
  }),
  community: PropTypes.shape({
    destinationLocation: PropTypes.array,
    destinationCountryCode: PropTypes.string,
  }),
  isPageCreationFlow: PropTypes.bool,
  mode: PropTypes.oneOf(Object.values(editModes)),
  scrapedUrl: PropTypes.object,
  //   scrapeUrl: PropTypes.func,
  //   clearScraping: PropTypes.func,
  updateForm: PropTypes.func,
  setMedia: PropTypes.func,
  navigateBack: PropTypes.func,
  closeCreatingPage: PropTypes.func,
  //   initSearchAddress: PropTypes.func,
  onSubmit: PropTypes.func,
  withBottomButton: PropTypes.bool,
  isShowCountryPicker: PropTypes.bool,
  CountryPickerComponent: PropTypes.func,
};

const mapStateToProps = (state) => ({
  community: state.auth.user.community,
  scrapedUrl: state.urlScraping,
});

const mapDispatchToProps = {
  //   initSearchAddress,
  //   scrapeUrl,
  //   clearScraping
};

PageEditorStep2 = connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(PageEditorStep2);
export default PageEditorStep2;
