import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  BackHandler,
} from 'react-native';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
// import { apiQuery } from '/redux/apiQuery/actions';
// import { updateProfile } from '/redux/profile/actions';
// import { analytics, Logger } from '/infra/reporting';
import {
  Image,
  Text,
  View,
  ScrollView,
  TranslatedText,
} from '../../components/basicComponents';
import {Screen} from '../../components';
import {AwesomeIcon} from '../../assets/icons';
import {flipFlopColors, uiConstants, commonStyles} from '../../vars';
import {screenNames} from '../../vars/enums';
import images from '../../assets/images';
// import { getNationalityGroups } from '/redux/auth/actions';
import {get, isEmpty, omit, sumBy, cloneDeep} from '../../infra/utils';
import {navigationService} from '../../infra/navigation';
import {
  isHighDevice,
  isShortDevice,
  isAndroid,
} from '../../infra/utils/deviceUtils';
import {misc as miscLocalStorage} from '../../infra/localStorage';
import HeaderMedia from '../../components/onboarding/HeaderMedia';
import {
  OnboardingInputField,
  useSlideUpModal,
  Wrapper,
} from '../../components/onboarding';

import countries, {
  getCountryByCode,
  getCountryImageByName,
} from './JoinCommunity/countries';
import {SearchCountry} from './JoinCommunity';
import LanguageSelectorModal from './LanguageSelectorModal';
import ReversedNationalityModal from './ReversedNationalityModal';
import CountryIcon from './CountryIcon';
import JoinOrSignupBar from '../welcome/JoinOrSignupBar';

const fieldNames = {
  ORIGIN: 'originCountry',
  DESTINATION: 'destinationCountry',
};

const errorTypes = {
  // ...fieldNames,
  // CONFLICTING_COUNTRIES: 'conflicting_types',
};

const MAX_FEATURED_COUNTRIES = 4;
const LANGUAGE_SELECTOR_HITSLOP = {top: 10, left: 20, right: 20, bottom: 5};

const styles = StyleSheet.create({
  container: {
    backgroundColor: flipFlopColors.white,
    paddingTop:
      uiConstants.PHONE_BAR_HEIGHT_TRANSLUCENT + isShortDevice ? 40 : 0,
  },
  scrollContent: {
    flexGrow: 1,
  },
  mainPadding: {
    marginHorizontal: 15,
  },
  title: {
    marginTop: 0,
    marginBottom: 64,
  },
  smallerDeviceTitle: {
    marginBottom: 32,
  },
  modalContent: {
    backgroundColor: flipFlopColors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 15,
  },
  searchCountryModalContent: {
    height: '100%',
  },
  mainContent: {
    paddingBottom: 20,
    flex: 1,
    justifyContent: 'center',
  },
  inputsWrapper: {
    justifyContent: 'space-between',
    height: 200,
  },
  smallerDeviceInputsWrapper: {
    height: 180,
  },
  countryIcon: {
    marginTop: -5,
    width: 25,
    height: 25,
    borderRadius: 25,
    marginLeft: 5,
    marginRight: 10,
  },
  languageSelector: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    top: uiConstants.PHONE_BAR_HEIGHT_TRANSLUCENT + 10,
    marginLeft: 15,
  },
  languageSelectorText: {
    marginHorizontal: 5,
    textTransform: 'uppercase',
  },
  languageSelectorTriangle: {
    borderLeftWidth: 7,
    borderLeftColor: flipFlopColors.transparent,
    borderRightWidth: 7,
    borderRightColor: flipFlopColors.transparent,
    borderTopWidth: 7,
    borderTopColor: flipFlopColors.green,
    transform: [{translateY: 1}],
  },
  languageSelectorTriangleUp: {
    transform: [{rotate: '180deg'}, {translateY: 1}],
  },
  imageBG: {
    width: 285,
    height: 230,
  },
  errorText: {
    marginTop: 15,
  },
});

const getStateByCampaign = (branchData) => {
  // const state = {};
  // const { originCountry, destinationCountry } = branchData;
  // try {
  //   if (originCountry) {
  //     const resolvedOriginCountry = getCountryByCode(Number(originCountry));
  //     if (resolvedOriginCountry) {
  //       state.originCountry = resolvedOriginCountry;
  //     }
  //   }
  //   if (destinationCountry) {
  //     const resolvedDestinationCountry = getCountryByCode(Number(destinationCountry));
  //     if (resolvedDestinationCountry) {
  //       state.destinationCountry = resolvedDestinationCountry;
  //     }
  //   }
  // } catch (err) {
  //   Logger.error({ message: 'Failed to convert branch data to countries', err, branchData });
  // }
  // return state;
};

class SetUserNationality extends React.Component {
  constructor(props) {
    super(props);
    const originCountry = get(
      props,
      'navigation.state.params.originCountry',
      {},
    );
    const destinationCountry = get(
      props,
      'navigation.state.params.destinationCountry',
      {},
    );
    const errors = {};

    if (!isEmpty(originCountry) && !isEmpty(destinationCountry)) {
      const isOriginAndDestinationAreTheSame = SetUserNationality.checkIfOriginAndDestinationAreTheSame(
        {originCountry, destinationCountry},
      );
      if (isOriginAndDestinationAreTheSame) {
        errors[errorTypes.CONFLICTING_COUNTRIES] =
          errorTypes.CONFLICTING_COUNTRIES;
      }
    }

    this.state = {
      originCountry,
      destinationCountry,
      errors,
      didUserSetLanguage: false,
    };

    [fieldNames.DESTINATION, fieldNames.ORIGIN].forEach((type) => {
      this[`${type}Input`] = React.createRef();
    });
  }

  static checkIfOriginAndDestinationAreTheSame = ({
    originCountry,
    destinationCountry,
  }) =>
    !isEmpty(originCountry) &&
    !isEmpty(destinationCountry) &&
    originCountry.countryCode === destinationCountry.countryCode;

  // eslint-disable-next-line react/sort-comp
  static modalTypes = {
    languageSelector: 'lang',
    origin: 'origin',
    destination: 'destination',
  };

  isFirstScreen = get(
    this.props,
    'navigation.state.params.isFirstScreen',
    false,
  ); // eslint-disable-line react/sort-comp

  render() {
    const {visibleModal} = this.props;
    const {errors} = this.state;

    return (
      <Wrapper
        style={styles.container}
        onStartShouldSetResponder={this.hideHints}>
        <StatusBar
          translucent
          barStyle="dark-content"
          backgroundColor="transparent"
        />

        <ScrollView
          style={commonStyles.flex1}
          contentContainerStyle={styles.scrollContent}>
          {!isShortDevice && (
            <HeaderMedia
              imageSource={images.onboarding.set_nationality_bg}
              imageStyle={styles.imageBG}
            />
          )}

          <View style={[styles.mainPadding, styles.mainContent]}>
            <Text
              size={32}
              lineHeight={40}
              bolder
              color={flipFlopColors.b30}
              style={[
                styles.title,
                !isHighDevice && styles.smallerDeviceTitle,
              ]}>
              {I18n.t('onboarding.set_user_nationality.title')}
            </Text>
            <View
              style={[
                styles.inputsWrapper,
                !isHighDevice && styles.smallerDeviceInputsWrapper,
              ]}>
              {[fieldNames.DESTINATION, fieldNames.ORIGIN].map(
                this.renderCountryField,
              )}
            </View>
            {errors && errors[errorTypes.CONFLICTING_COUNTRIES] && (
              <Text
                size={14}
                lineHeight={20}
                color={flipFlopColors.red}
                style={styles.errorText}>
                {I18n.t(
                  'onboarding.set_user_nationality.validations.same_country',
                )}
              </Text>
            )}
          </View>
        </ScrollView>

        {this.renderSubmitButton()}

        <TouchableOpacity
          hitSlop={LANGUAGE_SELECTOR_HITSLOP}
          style={styles.languageSelector}
          activeOpacity={0.75}
          onPress={this.renderLanguageModal}>
          <AwesomeIcon name="globe-asia" size={16} color={flipFlopColors.b30} />
          <Text style={styles.languageSelectorText} size={15}>
            {I18n.getLanguageInitials(I18n.getLocale())}
          </Text>
          <View
            style={[
              styles.languageSelectorTriangle,
              visibleModal === SetUserNationality.modalTypes.languageSelector &&
                styles.languageSelectorTriangleUp,
            ]}
          />
        </TouchableOpacity>
      </Wrapper>
    );
  }

  static getDerivedStateFromProps(props, state) {
    const {branchData} = props;
    if (state.branchData !== branchData && !isEmpty(branchData)) {
      return {branchData, ...getStateByCampaign(branchData)};
    }

    return null;
  }

  conditionallyFetchNationality(isInitialFetch) {
    const {originCountry, destinationCountry} = this.state;
    const isCountriesFilled =
      !isEmpty(originCountry) && !isEmpty(destinationCountry);
    if (isCountriesFilled) {
      this.fetchMatchedNationality(isInitialFetch);
    }
  }

  componentDidMount() {
    const {nationalityGroups} = this.props;
    // if (isEmpty(nationalityGroups)) {
    //   this.fetchNationalities();
    // }

    this.preloadCountryImages();
    this.conditionallyFetchNationality(true);

    if (isAndroid) {
      BackHandler.addEventListener('hardwareBackPress', this.onAndroidGoBack);
    }
  }

  componentWillUnmount() {
    if (isAndroid) {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.onAndroidGoBack,
      );
    }
  }

  onAndroidGoBack = () => this.props.navigation.isFocused();

  preloadCountryImages = () => {
    countries.forEach((country) => {
      const countryImage = getCountryImageByName(country.name);
      if (countryImage) {
        Image.prefetch(countryImage);
      }
    });
  };

  fetchNationalities = async () => {
    // const { getNationalityGroups } = this.props;
    // this.setState({ isFetchingNationalities: true });
    // await getNationalityGroups();
    // this.setState({ isFetchingNationalities: false });
  };

  fetchMatchedNationality = async (isInitialFetch) => {
    // const { originCountry, destinationCountry, didUserSetLanguage } = this.state;
    // const { countryCode: originCode } = originCountry;
    // const { countryCode: destinationCode } = destinationCountry;
    // try {
    //   const data = await this.fetchMatchedNationalityRequest({ originCode, destinationCode });
    //   const persistMatching = () => {
    //     miscLocalStorage.update({ nationalityChoices: this.state });
    //   };
    //   if (Array.isArray(data)) {
    //     this.setState({ matchedNationality: null, suggestedNationalities: data }, persistMatching);
    //   } else {
    //     const { defaultLanguage } = data;
    //     if (!isInitialFetch && defaultLanguage) {
    //       !didUserSetLanguage && I18n.changeLocalization({ locale: defaultLanguage });
    //       this.setState({ matchedNationality: data, suggestedNationalities: null }, () => {
    //         miscLocalStorage.update({ nationalityChoices: this.state, language: defaultLanguage });
    //       });
    //     } else {
    //       this.setState({ matchedNationality: data, suggestedNationalities: null }, persistMatching);
    //     }
    //   }
    // } catch (err) {
    //   Logger.error({ message: 'fetch matched nationality request failed', data: { originCountry, destinationCountry } });
    // }
  };

  fetchMatchedNationalityRequest = async ({originCode, destinationCode}) => {
    const {apiQuery} = this.props;
    const matchedNationalityResponse = await apiQuery({
      query: {
        domain: 'auth',
        key: 'matchedNationality',
        params: {originCode, destinationCode},
      },
    });
    return matchedNationalityResponse.data.data;
  };

  renderLanguageModal = () => {
    // const { showModal, hideModal } = this.props;
    // this.hideHints();
    // showModal({
    //   content: (
    //     <View style={[styles.modalContent, { paddingBottom: uiConstants.FOOTER_MARGIN_BOTTOM + 10 }]}>
    //       <LanguageSelectorModal
    //         onSelectLanguage={(lang) => {
    //           analytics.actionEvents.onboardingLanguageChanged({ from: I18n.getLocale(), to: lang }).dispatch();
    //           I18n.changeLocalization({ locale: lang });
    //           hideModal({ type: SetUserNationality.modalTypes.languageSelector });
    //           this.setState({ didUserSetLanguage: true });
    //         }}
    //         onClose={() => hideModal({ type: SetUserNationality.modalTypes.languageSelector })}
    //       />
    //     </View>
    //   ),
    //   type: SetUserNationality.modalTypes.languageSelector
    // });
  };

  renderCountryField = (type) => {
    const {errors, isFetchingNationalities} = this.state;
    const stateKey = this.state[type];
    const value = stateKey && (stateKey.adjustedName || stateKey.name);
    const showError = errors && errors[type];
    const translationPaths =
      type === fieldNames.ORIGIN
        ? `onboarding.set_user_nationality.origin_field`
        : `onboarding.set_user_nationality.destination_field`;
    const testID = `signup${
      type === fieldNames.ORIGIN ? 'Origin' : 'Destination'
    }Button`;
    return (
      <OnboardingInputField
        containerStyle={
          type === fieldNames.DESTINATION && styles.destinationInput
        }
        key={type}
        ref={this[`${type}Input`]}
        label={I18n.t(
          `${translationPaths}.${value ? 'label' : 'label_empty_field'}`,
        )}
        placeholderText={I18n.t(`${translationPaths}.placeholder`)}
        placeholderIconName="search"
        onPress={this.showCountryModal(type)}
        value={value}
        testID={testID}
        isDisabled={isFetchingNationalities}
        isDummy
        showError={showError}
        onPressHintIcon={this.handleHintVisibility(type)}
        hintText={
          <TranslatedText
            size={15}
            lineHeight={19}
            color={flipFlopColors.white}>
            {I18n.t(`${translationPaths}.hint_text`)}
          </TranslatedText>
        }
        renderIcon={this.renderCountryIcon({type})}
      />
    );
  };

  renderCountryIcon = ({type}) => () => (
    <CountryIcon country={this.state[type]} style={styles.countryIcon} />
  );

  renderSubmitButton() {
    const {errors, originCountry, destinationCountry} = this.state;
    const {user} = this.props;
    let onPress;
    onPress = this.submit;
    // const isDisabled =
    //   !!errors[errorTypes.CONFLICTING_COUNTRIES] ||
    //   !originCountry.countryCode ||
    //   !destinationCountry.countryCode;
    // const isOriginDestinationSame = SetUserNationality.checkIfOriginAndDestinationAreTheSame(
    //   {originCountry, destinationCountry},
    // );
    // if (!isOriginDestinationSame) {
    //   onPress = isDisabled ? this.showError : this.submit;
    // }

    return (
      <View style={styles.mainPadding}>
        <JoinOrSignupBar
          isSubmitDisabled={false}
          onClickSignIn={this.navigateToSignIn}
          onClickSignUp={onPress}
          signUpTestID="setUserNationalitySubmitButton"
          isConnected={!!user}
        />
      </View>
    );
  }

  showCountryModal = (type) => () => {
    // const { showModal, hideModal } = this.props;
    // const { onCountrySelection } = this;
    // const suggestedCountries = this.getSuggestedCountries(type);
    // const isSelectingOriginCountryUSA = (country) => type === fieldNames.ORIGIN && country.countryCode === 840;
    // this.hideHints();
    // showModal({
    //   content: (
    //     <View style={[styles.modalContent, styles.searchCountryModalContent]} onStartShouldSetResponder={() => true}>
    //       <SearchCountry
    //         type={type}
    //         suggestedCountries={suggestedCountries}
    //         onClose={hideModal}
    //         shouldRenderNote={isSelectingOriginCountryUSA}
    //         onSelectResult={onCountrySelection(type)}
    //       />
    //     </View>
    //   ),
    //   type
    // });
  };

  getSuggestedCountriesByType = (type) => {
    // const { nationalityGroups } = this.props;
    // const { originCountry, destinationCountry } = this.state;
    // const featuredCountries = [];
    // const filteredFeaturedCountires = [];
    // nationalityGroups.forEach((nationality) => {
    //   const { originCountryName, destinationCountryName, featured } = nationality;
    //   if (featured) {
    //     const loweredCaseDestinationCountryName = destinationCountryName.toLowerCase();
    //     const loweredCaseOriginCountryName = originCountryName.toLowerCase();
    //     if (type === fieldNames.ORIGIN) {
    //       featuredCountries.push(loweredCaseOriginCountryName);
    //       if (isEmpty(destinationCountry) || destinationCountry.name.toLowerCase() === loweredCaseDestinationCountryName) {
    //         filteredFeaturedCountires.push(loweredCaseOriginCountryName);
    //       }
    //     }
    //     if (type === fieldNames.DESTINATION) {
    //       featuredCountries.push(loweredCaseDestinationCountryName);
    //       if (isEmpty(originCountry) || originCountry.name.toLowerCase() === loweredCaseOriginCountryName) {
    //         filteredFeaturedCountires.push(loweredCaseDestinationCountryName);
    //       }
    //     }
    //   }
    // });
    // return filteredFeaturedCountires.length ? filteredFeaturedCountires : featuredCountries;
  };

  getNationalityGroupsByType = (type, item) => {
    // const { nationalityGroups } = this.props;
    // const isOriginType = type === fieldNames.ORIGIN;
    // const countryFieldName = `${isOriginType ? 'origin' : 'destination'}CountryName`;
    // return nationalityGroups.filter((nationalityGroup) => nationalityGroup[countryFieldName].toLowerCase() === item.name.toLowerCase());
  };

  sortSuggestedCountriesByType = (type) => (item1, item2) => {
    // const item1NationalityGroups = this.getNationalityGroupsByType(type, item1);
    // const item2NationalityGroups = this.getNationalityGroupsByType(type, item2);
    // return sumBy(item2NationalityGroups, 'totals.users') - sumBy(item1NationalityGroups, 'totals.users');
  };

  getSuggestedCountries = (type) => {
    // const { branchData } = this.props;
    // const branchSuggestions = get(branchData, `${type}Suggestions`);
    // if (!isEmpty(branchSuggestions)) {
    //   try {
    //     const suggestedCountries = branchSuggestions
    //       .split(',')
    //       .map((countryCode) => getCountryByCode(Number(countryCode)))
    //       .filter((country) => country);
    //     if (suggestedCountries.length) {
    //       return suggestedCountries;
    //     }
    //   } catch (err) {
    //     Logger.error({ message: 'Failed to convert branch data to suggested countries', err, branchData });
    //   }
    // }
    // const suggestedCountriesByType = this.getSuggestedCountriesByType(type);
    // return countries
    //   .filter((item) => {
    //     const { name } = item;
    //     return suggestedCountriesByType.includes(name.toLowerCase());
    //   })
    //   .slice(0, MAX_FEATURED_COUNTRIES)
    //   .sort(this.sortSuggestedCountriesByType(type));
  };

  hideHints = () => {
    // this.hideHint(fieldNames.ORIGIN);
    // this.hideHint(fieldNames.DESTINATION);
  };

  handleHintVisibility = (type) => () => {
    // analytics.actionEvents.onboardingTooltipView({ field: type === fieldNames.ORIGIN ? 'origin' : 'destination' }).dispatch();
    // if (type === fieldNames.ORIGIN) {
    //   this.hideHint(fieldNames.DESTINATION);
    // } else {
    //   this.hideHint(fieldNames.ORIGIN);
    // }
  };

  hideHint = (type) => {
    // const hideHintFunction = get(this, `${type}Input.current.hideHint`);
    // if (hideHintFunction) {
    //   hideHintFunction();
    // }
  };

  navigateToSignIn = () => {
    navigationService.navigate(screenNames.SignIn, {}, {noPush: true});
  };

  onCountrySelection = (type) => ({country}) => {
    // const { hideModal } = this.props;
    // if (type === fieldNames.ORIGIN) {
    //   analytics.actionEvents.onboardingSetOriginCountry({ country: country.name }).dispatch();
    // } else {
    //   analytics.actionEvents.onboardingSetDestinationCountry({ country: country.name }).dispatch();
    // }
    // this.setCountryState({ [type]: country });
    // hideModal();
  };

  androidBackButtonListener = () => true;

  setCountryState = (changes) => {
    // this.setState(changes, () => {
    //   const { destinationCountry, originCountry } = this.state;
    //   if (originCountry.countryCode === destinationCountry.countryCode) {
    //     this.showError(errorTypes.CONFLICTING_COUNTRIES);
    //   } else {
    //     this.conditionallyFetchNationality(false);
    //     this.clearError(errorTypes.CONFLICTING_COUNTRIES);
    //   }
    //   miscLocalStorage.update({ nationalityChoices: this.state });
    // });
  };

  isReversedNationality = ({
    nationality,
    originCountryCode,
    destinationCountryCode,
  }) =>
    nationality.destinationNumericCountryCode === originCountryCode &&
    nationality.originNumericCountryCodes.includes(destinationCountryCode);

  getReversedNationality = (navigationParams) => {
    // const { matchedNationality, suggestedNationalities, originCountry, destinationCountry } = navigationParams;
    // if (matchedNationality) return false;
    // const reversedNationality = suggestedNationalities.find((curr) =>
    //   this.isReversedNationality({ nationality: curr, originCountryCode: originCountry.countryCode, destinationCountryCode: destinationCountry.countryCode })
    // );
    // return reversedNationality;
  };

  getInputValidationErrorsState = () => {
    // const { originCountry, destinationCountry } = this.state;
    // const originDestinationValidations = {
    //   ...(!originCountry.countryCode && { [fieldNames.ORIGIN]: 'origin not selected' }),
    //   ...(!destinationCountry.countryCode && { [fieldNames.DESTINATION]: 'dest not selected' })
    // };
    // return {
    //   ...this.state.errors,
    //   ...originDestinationValidations
    // };
  };

  showError = (key) => {
    const errors = this.getInputValidationErrorsState();
    if (key) {
      errors[key] = key;
    }

    this.setState({errors});
  };

  clearError = (key) => {
    this.setState({errors: omit(this.state.errors, key)});
  };

  updateProfileAndNavigateToContinueWithNationalityScreen = async () => {
    // await this.updateProfileJourney({navigationParams});
    navigationService.navigate(
      screenNames.ContinueWithNationality,
      // cloneDeep(navigationParams),
    );
  };

  updateProfileJourney = async ({navigationParams}) => {
    // const { originCountry, destinationCountry } = navigationParams;
    // const { updateProfile, user } = this.props;
    // if (user) {
    //   const dataToSend = {
    //     user: {
    //       journey: {
    //         originPlaceSearchCountryFilter: originCountry.alpha2,
    //         originCountryName: originCountry.name,
    //         originCountryCode: originCountry.countryCode,
    //         destinationCountryCode: destinationCountry.countryCode,
    //         destinationCountryName: destinationCountry.name,
    //         destinationCountryAlpha2: destinationCountry.alpha2
    //       },
    //       settings: {
    //         language: I18n.getLocale()
    //       }
    //     }
    //   };
    //   await updateProfile({ userId: user.id, delta: dataToSend });
    // }
  };

  onReversedNationalityPress = ({navigationParams, reversedNationality}) => {
    // const newNavigationParams = { ...navigationParams };
    // newNavigationParams.originCountry = navigationParams.destinationCountry;
    // newNavigationParams.destinationCountry = navigationParams.originCountry;
    // newNavigationParams.matchedNationality = reversedNationality;
    // this.updateProfileAndNavigateToContinueWithNationalityScreen({ navigationParams: newNavigationParams });
  };

  submit = async () => {
    this.updateProfileAndNavigateToContinueWithNationalityScreen(); // const {
    //   originCountry,
    //   destinationCountry,
    //   matchedNationality,
    //   suggestedNationalities,
    // } = this.state;
    // const {showModal} = this.props;
    // // analytics.actionEvents
    // //   .onboardingClickedSetNationality({
    // //     originCountryName: originCountry.name,
    // //     destinationCountryName: destinationCountry.name,
    // //   })
    // //   .dispatch();
    // const navigationParams = {
    //   matchedNationality,
    //   originCountry,
    //   destinationCountry,
    //   suggestedNationalities,
    // };
    // try {
    //   if (!matchedNationality && !suggestedNationalities) {
    //     const data = await this.fetchMatchedNationalityRequest({
    //       originCode: originCountry.countryCode,
    //       destinationCode: destinationCountry.countryCode,
    //     });
    //     if (Array.isArray(data)) {
    //       navigationParams.suggestedNationalities = data;
    //     } else {
    //       navigationParams.matchedNationality = data;
    //     }
    //   }
    //   const reversedNationality = this.getReversedNationality(navigationParams);
    //   if (reversedNationality) {
    //     showModal({
    //       content: (
    //         <ReversedNationalityModal
    //           originCountry={originCountry}
    //           destinationCountry={destinationCountry}
    //           onOriginalNationalityPress={() =>
    //             this.updateProfileAndNavigateToContinueWithNationalityScreen({
    //               navigationParams,
    //             })
    //           }
    //           onReversedNationalityPress={() =>
    //             this.onReversedNationalityPress({
    //               navigationParams,
    //               reversedNationality,
    //             })
    //           }
    //         />
    //       ),
    //     });
    //     // analytics.viewEvents
    //     //   .countryReverse({
    //     //     originCountryName: originCountry.adjustedName,
    //     //     destinationCountryName: destinationCountry.adjustedName,
    //     //   })
    //     //   .dispatch();
    //   } else {
    //     this.updateProfileAndNavigateToContinueWithNationalityScreen({
    //       navigationParams,
    //     });
    //   }
    // } catch (err) {
    //   // Logger.error({
    //   //   message: 'fetch matched nationality request failed',
    //   //   data: {originCountry, destinationCountry},
    //   // });
    // }
  };
}

SetUserNationality.propTypes = {
  // getNationalityGroups: PropTypes.func,
  nationalityGroups: PropTypes.array,
  branchData: PropTypes.object,
  // apiQuery: PropTypes.func,
  showModal: PropTypes.func,
  hideModal: PropTypes.func,
  visibleModal: PropTypes.string,
  user: PropTypes.object,
  // updateProfile: PropTypes.func,
  navigation: PropTypes.object,
};

const mapStateToProps = (state) => ({
  branchData: get(state, 'auth.branchData'),
  nationalityGroups: get(state, 'auth.nationalityGroups') || [],
  user: get(state, 'auth.user'),
});

const mapDispatchToProps = {
  // apiQuery,
  // getNationalityGroups,
  // updateProfile
};

SetUserNationality = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SetUserNationality);
SetUserNationality = useSlideUpModal(SetUserNationality);
SetUserNationality = Screen({modalError: true})(SetUserNationality);
export default React.memo(SetUserNationality);
