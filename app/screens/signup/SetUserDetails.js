import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {
  Animated,
  StatusBar,
  StyleSheet,
  Keyboard,
  BackHandler,
} from 'react-native';
import {connect} from 'react-redux';
import {FormInput, Screen} from '../../components';
import {
  Image,
  Text,
  View,
  // KeyboardAwareScrollView,
} from '../../components/basicComponents';
import {
  OnboardingInputField,
  SubmitButton,
  useSlideUpModal,
  Wrapper,
} from '../../components/onboarding';
import I18n from '../../infra/localization';
import {
  misc as miscLocalStorage,
  user as userLocalStorage,
} from '../../infra/localStorage';
import {navigationService} from '../../infra/navigation';
// import { apiQuery } from '/redux/apiQuery/actions';
// import { apiCommand } from '/redux/apiCommands/actions';
// import { analytics, Logger } from '/infra/reporting';
import {get, isEmpty} from '../../infra/utils';
import {email as validateEmail} from '../../infra/utils/formValidations';
// import { joinedCommunity } from '/redux/auth/actions';
// import { updateProfile } from '/redux/profile/actions';
import {getFirstName} from '../../infra/utils/stringUtils';
// import { initSearchAddress } from '/redux/searchAddress/actions';
import {flipFlopColors, uiConstants, commonStyles} from '../../vars';
import {SearchAddress} from '/screens/searchAddress';
import HeaderSearch from '../../components/header/HeaderSearch';

import {screenNames} from '../../vars/enums';
import {AwesomeIcon, FlipFlopIcon} from '../../assets/icons';
import images from '../../assets/images';
import {formatTopCitiesToMatchPlacesServiceResponse} from '../../infra/utils/onboardingUtils';
import {
  isHighDevice,
  isShortDevice,
  isAndroid,
  isIOS,
} from '../../infra/utils/deviceUtils';
import {OnBoardingProgressBar} from './components';
import UserProfilePictureHeader, {
  WRAPPER_HEIGHT,
  SMALLER_WRAPPER_HEIGHT,
  STRIPE_HEIGHT,
} from './UserProfilePictureHeader';

const SLIDING_HEIGHT = isHighDevice
  ? WRAPPER_HEIGHT - STRIPE_HEIGHT / 2
  : SMALLER_WRAPPER_HEIGHT - STRIPE_HEIGHT / 2;
let mainContentPaddingTop = 30;
if (isHighDevice) {
  mainContentPaddingTop = 60;
}
if (isShortDevice) {
  mainContentPaddingTop = 0;
}

const MAX_TOP_CITIES = 7;
const styles = StyleSheet.create({
  wrapper: {
    paddingTop: uiConstants.PHONE_BAR_HEIGHT_TRANSLUCENT + 10,
  },
  mainContent: {
    flex: 1,
    paddingTop: mainContentPaddingTop,
  },
  mainPadding: {
    paddingHorizontal: 15,
  },
  scroll: {
    paddingBottom: 30,
  },
  smallerdeviceTitle: {
    marginBottom: 5,
  },
  titleText: {
    marginBottom: 10,
  },
  progressBar: {
    paddingBottom: 10,
  },
  skylineImage: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 119,
    height: '100%',
  },
  inputIcon: {
    marginRight: 10,
  },
  emailInput: {
    marginTop: 15,
    marginBottom: 30,
  },
  cityContainer: {
    height: 73,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: flipFlopColors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 15,
    flex: 1,
  },
  searchCityMapIcon: {
    marginLeft: 5,
    marginRight: 5,
  },
  headerSearchInputWrapper: {
    height: 45,
    marginHorizontal: 15,
    marginBottom: 15,
  },
});

const mapMarkerIcon = (
  <AwesomeIcon
    name="map-marker-alt"
    size={20}
    color={flipFlopColors.b30}
    weight="light"
    style={styles.inputIcon}
  />
);
class SetUserDetails extends Component {
  constructor(props) {
    super(props);
    const userEmail = get(props, 'user.email');
    const email = validateEmail()(userEmail);
    this.userName = get(props, 'user.name'); // To be able to do parallel request upon pressing next without losing the reference to user.name in reducer

    this.state = {
      destinationCity: null,
      progressBarAndMediaOpacity: new Animated.Value(1),
      btnY: new Animated.Value(0),
      isSubmitting: false,
    };

    // in case the user need to re-type his real email -> we're adding email to the state with empty value
    if (email && !email.isValid) {
      this.state.email = {};
    }
  }

  render() {
    const {
      progressBarAndMediaOpacity,
      destinationCity,
      email,
      btnY,
      isSubmitting,
    } = this.state;
    const {showModal} = this.props;
    const isDisabled = !destinationCity || (email && !email.isValid);

    return (
      <Wrapper style={styles.wrapper}>
        <StatusBar
          translucent
          barStyle="dark-content"
          backgroundColor="transparent"
        />

        {/* <KeyboardAwareScrollView
          style={commonStyles.flex1}
          contentContainerStyle={styles.scroll}
          keyboardDismissMode="on-drag"
          ref={(node) => {
            this.scroll = node;
          }}
        > */}
        <Animated.View style={{opacity: progressBarAndMediaOpacity}}>
          <OnBoardingProgressBar step={1} style={styles.progressBar} />
          <UserProfilePictureHeader
            modalStyle={styles.modalContent}
            showModal={showModal}
            // hideModal={this.hideModalAndAllowKeyboardAnimation}
            isSmaller={!isHighDevice}
          />
        </Animated.View>

        <View style={[styles.mainPadding, commonStyles.flex1]}>
          {this.renderTitleAndSubTitle()}
          <View style={styles.mainContent}>
            <View>
              {this.renderCurrentCityField()}
              {email && this.renderEmailField()}
            </View>
          </View>
        </View>
        {/* </KeyboardAwareScrollView> */}
        <Animated.View style={[{transform: [{translateY: btnY}]}]}>
          <SubmitButton
            withShadow={false}
            isDisabled={false}
            wrapperStyle={styles.mainPadding}
            onPress={this.submit}
            // onPress={isDisabled ? this.scrollToBottom : this.submit}
            testID="setUserDetailsSubmitButton"
            busy={isSubmitting}
          />
        </Animated.View>
      </Wrapper>
    );
  }

  componentDidMount() {
    // miscLocalStorage.update({
    //   onboardingPersistentScreen: screenNames.SetUserDetails,
    // });
    // this.getTopCities();
    // this.keyboardDidShowListener = Keyboard.addListener(
    //   'keyboardDidShow',
    //   this.keyboardDidShow,
    // );
    // this.keyboardDidHideListener = Keyboard.addListener(
    //   'keyboardDidHide',
    //   this.keyboardDidHide,
    // );
    // if (isAndroid) {
    //   BackHandler.addEventListener(
    //     'hardwareBackPress',
    //     this.androidBackButtonListener,
    //   );
    // }
  }

  componentWillUnmount() {
    // this.keyboardDidShowListener.remove();
    // this.keyboardDidHideListener.remove();

    if (isAndroid) {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        this.androidBackButtonListener,
      );
    }
  }

  androidBackButtonListener = () => this.props.navigation.isFocused();

  keyboardDidShow = (e) => {
    const {btnY, progressBarAndMediaOpacity} = this.state;
    const keyboardHeight = e.endCoordinates.height;
    if (!this.shouldAvoidAnimateKeyboardShown) {
      Animated.parallel([
        Animated.timing(progressBarAndMediaOpacity, {
          toValue: 0,
          duration: SLIDING_HEIGHT,
          useNativeDriver: true,
        }),
        isIOS &&
          Animated.timing(btnY, {
            toValue: -keyboardHeight + 10,
            duration: 300,
            useNativeDriver: true,
          }),
      ]).start();
    }
  };

  keyboardDidHide = () => {
    const {progressBarAndMediaOpacity, btnY} = this.state;
    if (!this.shouldAvoidAnimateKeyboardShown) {
      Animated.parallel([
        Animated.timing(progressBarAndMediaOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        isIOS &&
          Animated.timing(btnY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
      ]).start();
    }
  };

  async getTopCities() {
    // const { placeSearchCountryFilter, initSearchAddress } = this.props;
    // const { nationalityChoices = {} } = await (miscLocalStorage.get() || {});
    // initSearchAddress({ country: placeSearchCountryFilter, isCities: true });
    // const topCities = get(nationalityChoices, 'matchedNationality.topCities') || [];
    // if (!isEmpty(topCities)) {
    //   this.topCities = topCities.filter((city, idx) => idx < MAX_TOP_CITIES).map(formatTopCitiesToMatchPlacesServiceResponse);
    // }
  }

  renderTitleAndSubTitle() {
    // const isTitleTextSmaller = this.userName.length > 16;
    return (
      <View style={!isHighDevice && styles.smallerdeviceTitle}>
        <Text
          bolder
          // size={isTitleTextSmaller ? 28 : 32}
          // lineHeight={isTitleTextSmaller ? 34 : 38}
          color={flipFlopColors.b30}
          style={styles.titleText}>
          {/* {getFirstName(this.userName)} */}
        </Text>
        {!isShortDevice && (
          <Text size={18} lineHeight={22} color={flipFlopColors.b30}>
            {I18n.t('onboarding.set_user_details.sub_title')}
          </Text>
        )}
      </View>
    );
  }

  renderCurrentCityField() {
    const {destinationCity} = this.state;
    const value = destinationCity && destinationCity.name;
    return (
      <View style={styles.cityContainer}>
        <Image
          source={images.onboarding.skyline}
          style={styles.skylineImage}
          resizeMode="contain"
        />
        <OnboardingInputField
          // label={
          //   !isEmpty(destinationCity) &&
          //   I18n.t('onboarding.set_user_details.destination_city_field.label')
          // }
          placeholderText={I18n.t(
            'onboarding.set_user_details.destination_city_field.placeholder',
          )}
          onPress={this.showCityPickerModal}
          value={value}
          renderIconHandled
          renderIcon={({isValid}) =>
            isValid ? (
              mapMarkerIcon
            ) : (
              <FlipFlopIcon
                name="search"
                color={flipFlopColors.green}
                size={22}
                style={styles.inputIcon}
              />
            )
          }
          labelSize={OnboardingInputField.labelSizes.SMALL}
          testID="signupSearchCityButton"
          isDummy
        />
      </View>
    );
  }

  renderEmailField() {
    const {email} = this.state;

    return (
      <FormInput
        style={styles.emailInput}
        label={I18n.t('common.form.email')}
        keyboardType={'email-address'}
        autoCapitalize="none"
        // onChange={this.handleEmailChanged}
        value={email.value}
        isValid={email.isValid}
        validations={['email']}
        errorText={email.errorText}
        required
        autoCorrect={false}
        focusedBorderColor={flipFlopColors.green}
        testID="setUserDetailsEmailInput"
      />
    );
  }

  hideModalAndAllowKeyboardAnimation = () => {
    const {hideModal} = this.props;
    this.shouldAvoidAnimateKeyboardShown = false;
    hideModal();
  };

  handleEmailChanged = (changes) => {
    const {email} = this.state;
    this.setState({email: {...email, ...changes}});
  };

  showCityPickerModal = () => {
    const {showModal} = this.props;
    this.shouldAvoidAnimateKeyboardShown = true;
    showModal({
      content: (
        <View
          style={[
            styles.modalContent,
            {paddingBottom: uiConstants.FOOTER_MARGIN_BOTTOM + 10},
          ]}
          onStartShouldSetResponder={() => true}>
          <SearchAddress
            isOnboarding
            defaultValues={this.topCities}
            renderIcon={() => (
              <View style={styles.searchCityMapIcon}>{mapMarkerIcon}</View>
            )}
            onAddressChosen={this.onSelectCity}
            renderHeaderComponent={() => (
              <View style={styles.headerSearchInputWrapper}>
                <HeaderSearch
                  isOnboarding
                  searchMode
                  searchAddressMode
                  // onPressClose={this.hideModalAndAllowKeyboardAnimation}
                  searchPlaceholder={I18n.t(
                    'onboarding.set_user_details.destination_city_field.search_input_placeholder',
                  )}
                />
              </View>
            )}
          />
        </View>
      ),
    });
  };

  onSelectCity = ({value, id}) => {
    // const { email } = this.state;
    // const { originCountry } = this.props;
    // analytics.actionEvents.onboardingSetCity({ country: originCountry.name, city: value }).dispatch();
    // Keyboard.dismiss();
    // this.hideModalAndAllowKeyboardAnimation();
    // this.setState({ destinationCity: { name: value, cityId: id } });
    // email && this.scrollToBottom();
  };

  scrollToBottom = () =>
    this.scroll && this.scroll.scrollToPosition(0, 300, true);

  submit = async () => {
    // const { joinedCommunity, isOnWaitingList } = this.props;
    // const { destinationCity, isSubmitting } = this.state;
    // if (isSubmitting) {
    //   return;
    // }
    // try {
    //   this.setState({ isSubmitting: true });
    //   const { id: communityId, name: communityName } = (await this.getMatchedCommunity()) || {};
    //   await this.updateProfilePromises(communityId);
    //   await joinedCommunity({ communityId, communityName, destinationCity, isOnWaitingList });
    navigationService.navigate(screenNames.OnBoardingDiscover);
    // } catch (err) {
    //   Logger.error({ message: 'failed to submit setUserDetails form', destinationCity, err });
    // }
    // this.setState({ isSubmitting: false });
  };

  updateProfilePromises = async (communityId) => {
    // const { user, updateProfile, originCountry, apiCommand } = this.props;
    // const { destinationCity, email } = this.state;
    // const { cityId: destinationCityId, name: destinationCityName } = destinationCity;
    // const { placeSearchCountryFilter: originPlaceSearchCountryFilter, name: originCountryName, countryCode: originCountryCode } = originCountry;
    // const journey = {
    //   originPlaceSearchCountryFilter,
    //   originCountryName,
    //   originCountryCode,
    //   destinationCityId,
    //   destinationCityName
    // };
    // const dataToSend = {
    //   user: {
    //     journey
    //   },
    //   communityId
    // };
    // if (email && email.value) {
    //   dataToSend.user.email = email.value;
    //   await apiCommand('users.changeEmail', { email: email.value });
    // }
    // await updateProfile({ userId: user.id, delta: dataToSend });
  };

  getMatchedCommunity = async () => {
    //     const { originCountry, apiQuery } = this.props;
    //     const { countryCode: originCountryCode } = originCountry;
    //     const { destinationCity } = this.state;
    //     const { cityId: destinationCityId } = destinationCity;
    //     const apiQueryObject = {
    //       query: {
    //         domain: 'auth',
    //         key: 'matchedCommunity',
    //         params: { originCountryCode, destinationCityId }
    //       }
    //     };
    //     const matchedCommunityResponse = await apiQuery(apiQueryObject);
    //     const matchedCommunityData = get(matchedCommunityResponse, 'data.data');
    //     if (Array.isArray(matchedCommunityData)) {
    //       Logger.info({
    //         domain: 'onboarding',
    //         message: 'Multiple matched communities were returned',
    //         extraData: {
    //           apiQueryObject,
    //           response: matchedCommunityData
    //         }
    //       });
    //       if (!originCountryCode) {
    //         // Debugging a case where getMatchedCommunity is fired without origin country code
    //         setTimeout(async () => {
    //           const [userLS, miscLS] = await Promise.all([userLocalStorage.get(), miscLocalStorage.get()]);
    //           Logger.debug({
    //             domain: 'onboarding',
    //             message: 'Multiple matched communities were returned - deferred user log',
    //             user: get(this, 'props.user'),
    //             userLS,
    //             miscLS
    //           });
    //         }, 1000);
    //       }
    //       return get(matchedCommunityData, '[0]');
    //     }
    //     return matchedCommunityData;
  };
}

SetUserDetails.propTypes = {
  user: PropTypes.object,
  originCountry: PropTypes.object,
  isOnWaitingList: PropTypes.bool,
  showModal: PropTypes.func,
  hideModal: PropTypes.func,
  //   apiCommand: PropTypes.func,
  //   apiQuery: PropTypes.func,
  //   initSearchAddress: PropTypes.func,
  //   updateProfile: PropTypes.func,
  //   joinedCommunity: PropTypes.func,
  placeSearchCountryFilter: PropTypes.string,
  navigation: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: get(state, 'auth.user'),
  // isOnWaitingList: state.auth.waitingList,
  originCountry: get(state, 'auth.user.journey.originCountry', {}),
  placeSearchCountryFilter: get(
    state,
    'auth.user.journey.destinationCountry.placeSearchCountryFilter',
    '',
  ).toLowerCase(),
});

const mapDispatchToProps = {
  //   apiQuery,
  //   apiCommand,
  //   initSearchAddress,
  //   updateProfile,
  //   joinedCommunity
};
SetUserDetails = useSlideUpModal(SetUserDetails);
SetUserDetails = connect(mapStateToProps, mapDispatchToProps)(SetUserDetails);
export default Screen({modalError: true})(SetUserDetails);
