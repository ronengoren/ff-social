import React from 'react';
import PropTypes from 'prop-types';
import {
  Keyboard,
  StyleSheet,
  Animated,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
import {apiQuery} from '../../redux/apiQuery/actions';
import {signIn} from '../../redux/auth/actions';
// import { updateAnnotations } from '/redux/general/actions';
import {facebookLogin, AccessToken} from '../../infra/facebook/loginService';
// import { login as appleLogin, isAppleAuthSupported } from '/infra/apple/authService';
import {
  Screen,
  ApiCommandTextButton,
  FormInput,
  PasswordInput,
} from '../../components';
import {
  View,
  Text,
  TextButton,
  ScrollView,
} from '../../components/basicComponents';
import videos from '../../assets/videos';
import {ErrorModal} from '../../components/modals';
import {misc as miscLocalStorage} from '../../infra/localStorage';
// import ErrorsLogger from '/infra/reporting/ErrorsLogger';
// import { Logger, analytics } from '/infra/reporting';
import {get, isEmpty} from '../../infra/utils';
import {navigationService} from '../../infra/navigation';
import {AwesomeIcon} from '../../assets/icons';
import {flipFlopColors, uiConstants, commonStyles} from '../../vars';
import {
  screenGroupNames,
  screenNames,
  signInMethodTypes,
  authErrors,
} from '../../vars/enums';
import {getRelevantOnboardingScreen} from '../../infra/utils/onboardingUtils';
import {GoBackButton, HeaderMedia} from '../../components/onboarding';
import {isHighDevice, isShortDevice} from '../../infra/utils/deviceUtils';

// const showAppleSignIn = isAppleAuthSupported();

const VIDEO_RATIO = 1.69209809264;
const VIDEO_BOTTOM_MARGIN = 30;
const TITLE_HEIGHT = 35;
const CREATE_BTN_HEIGHT = 24;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: uiConstants.PHONE_BAR_HEIGHT_TRANSLUCENT + 18,
    paddingBottom: uiConstants.FOOTER_MARGIN_BOTTOM_ONBOARDING,
  },
  media: {
    marginTop: -8,
  },
  videoWrapper: {
    marginBottom: VIDEO_BOTTOM_MARGIN,
  },
  innerContainer: {
    marginHorizontal: 15,
    flex: 1,
  },
  innerContainerSmall: {
    marginTop: 160,
  },
  form: {
    marginBottom: 20,
  },
  emailForm: {
    marginBottom: 0,
    paddingTop: 24,
  },
  facebookButton: {
    backgroundColor: flipFlopColors.facebookBlue,
    borderColor: flipFlopColors.facebookBlue,
  },
  formSeparator: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 18,
    color: flipFlopColors.b80,
  },
  signInBtn: {
    marginBottom: 15,
  },
  signInBtnIcon: {
    position: 'absolute',
    left: 15,
  },
  appleButton: {
    backgroundColor: flipFlopColors.realBlack,
    borderColor: flipFlopColors.realBlack,
  },
  signInBtnWrapper: {
    marginHorizontal: 15,
  },
  forgotPasswordText: {
    lineHeight: 15,
    fontSize: 13,
    letterSpacing: 0.2,
    color: flipFlopColors.green,
  },
  createBtnPlaceholder: {
    paddingTop: CREATE_BTN_HEIGHT,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    color: flipFlopColors.b30,
    marginBottom: 15,
  },
  createAccountLink: {
    fontSize: 14,
    color: flipFlopColors.green,
  },
  emailVerificationBtn: {
    marginHorizontal: 15,
  },
  signUpMethods: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  smallerDeviceSignUpMethods: {
    marginBottom: 10,
  },
  personalInformationFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    const email = get(props, 'navigation.state.params.email', '');
    this.state = {
      slidedUp: false,
      facebookSignIn: false,
      appleSignIn: false,
      isKeyboardShown: false,
      isSendingMail: false,
      isEmailExists: !!email,
      isRenderCreateAccount: false,
      email: {value: email},
      password: {value: ''},
      btnY: new Animated.Value(0),
      opacity: new Animated.Value(1),
    };
  }

  render() {
    const {
      email,
      password,
      opacity,
      isKeyboardShown,
      isEmailExists,
    } = this.state;
    const {width, height} = Dimensions.get('window');
    const videoHeight = width / VIDEO_RATIO;

    return (
      <View style={styles.container}>
        <GoBackButton onPress={this.onBackButtonPress} />
        <ScrollView
          style={commonStyles.flex1}
          contentContainerStyle={{height: 2 * height}}
          scrollEnabled={false}
          scrollToOverflowEnabled
          ref={(node) => {
            this.scroll = node;
          }}>
          <Animated.View
            style={[
              styles.videoWrapper,
              {width, height: videoHeight},
              {opacity},
            ]}>
            <HeaderMedia
              videoSource={videos.signIn.welcomeBack}
              wrapperStyle={styles.media}
              videoStyle={{width, height: videoHeight}}
            />
          </Animated.View>
          <View
            style={[
              styles.innerContainer,
              isShortDevice && styles.innerContainerSmall,
            ]}>
            <Text
              size={32}
              lineHeight={TITLE_HEIGHT}
              color={flipFlopColors.b30}
              bold
              alignLocale>
              {I18n.t('onboarding.sign_in.page_header')}
            </Text>
            <View style={styles.form}>
              <FormInput
                label={I18n.t('common.form.email')}
                keyboardType="email-address"
                autoCapitalize="none"
                onChange={this.onChangeHandlerWrapper('email')}
                onFocus={this.onInputFocus}
                value={email.value}
                validations={['email']}
                errorText={email.errorText}
                required
                testID="emailInput"
                autoCorrect={false}
                style={styles.emailForm}
                focusedBorderColor={flipFlopColors.green}
                errorColor={flipFlopColors.cerise}
                onSubmitEditing={
                  email.isValid ? this.emailVerification : () => {}
                }
              />
              <React.Fragment>
                <PasswordInput
                  autoFocus
                  testID="passwordInput"
                  onChange={this.onChangeHandlerWrapper('password')}
                  onFocus={this.onInputFocus}
                  value={password.value}
                  errorText={password.errorText}
                  ref={(node) => {
                    this.passwordInput = node;
                  }}
                  onSubmitEditing={this.handleSubmitFromKeyboardPress}
                />
                <Text
                  style={styles.forgotPasswordText}
                  onPress={() =>
                    navigationService.navigate(
                      screenNames.ForgotPassword,
                      {email},
                      {noPush: true},
                    )
                  }
                  medium>
                  {I18n.t('onboarding.sign_in.password_recovery_button')}
                </Text>
              </React.Fragment>
            </View>
          </View>
        </ScrollView>
        {this.renderNextButton()}
        {this.renderSignInButton()}
        <Animated.View
          style={[
            styles.signUpMethods,
            !isHighDevice && styles.smallerDeviceSignUpMethods,
            Platform.OS === 'android' && {opacity},
          ]}>
          <React.Fragment>
            <Text style={styles.formSeparator}>
              {I18n.t('onboarding.sign_in.methods_separator')}
            </Text>
            {this.renderSocialButtons()}
            {this.renderCreateButton()}
          </React.Fragment>
        </Animated.View>
        <Animated.View
          style={[
            styles.personalInformationFooter,
            Platform.OS === 'android' && {opacity},
          ]}>
          <AwesomeIcon name="lock-alt" color={flipFlopColors.realpaleBlack} />
          <Text size={13} color={flipFlopColors.realpaleBlack}>
            {' '}
            {I18n.t('onboarding.sign_in.protected_info')}
          </Text>
        </Animated.View>
      </View>
    );
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShow = (e) => {
    const {opacity, btnY} = this.state;
    const keyboardHeight = e.endCoordinates.height;
    const {width} = Dimensions.get('window');
    const videoHeight = width / VIDEO_RATIO;
    this.setState({isKeyboardShown: true});
    this.scroll &&
      this.scroll.scrollTo({x: 0, y: videoHeight - 20, animated: true});
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Platform.OS === 'ios' &&
        Animated.timing(btnY, {
          toValue:
            -keyboardHeight + uiConstants.FOOTER_MARGIN_BOTTOM_ONBOARDING,
          duration: 300,
          useNativeDriver: true,
        }),
    ]).start();
  };

  keyboardDidHide = () => {
    const {opacity, btnY} = this.state;
    this.setState({isKeyboardShown: false});
    this.scroll && this.scroll.scrollTo({x: 0, y: 0, animated: true});
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(btnY, {toValue: 0, duration: 300, useNativeDriver: true}),
    ]).start();
  };

  renderSocialButtons = () => {
    const {facebookSignIn, appleSignIn} = this.state;
    return (
      <View>
        <View style={styles.signInBtn}>
          <TextButton
            size="big50Height"
            iconName="facebook-logo"
            iconStyle={styles.signInBtnIcon}
            iconSize={23}
            style={styles.facebookButton}
            // onPress={this.handleFacebookSignIn}
            // busy={facebookSignIn}
          >
            {I18n.t('onboarding.sign_in.facebook_button')}
          </TextButton>
        </View>
        <View style={styles.signInBtn}>
          <TextButton
            size="big50Height"
            isAwesomeIcon
            iconName="apple"
            iconWeight="brands"
            iconStyle={styles.signInBtnIcon}
            iconSize={23}
            style={styles.appleButton}
            // onPress={this.handleAppleSignIn}
            // busy={appleSignIn}
          >
            {I18n.t('onboarding.sign_in.apple_button')}
          </TextButton>
        </View>
      </View>
    );
  };

  renderCreateButton = () => (
    <Text style={styles.footerText} onPress={this.navigateToSignUp}>
      {I18n.t('onboarding.sign_in.no_account')}
      <Text onPress={this.navigateToSignUp} style={styles.createAccountLink}>
        {' '}
        {I18n.t('onboarding.sign_in.no_account_button')}
      </Text>
    </Text>
  );

  renderNextButton = () => {
    const {btnY, isSendingMail, email, isRenderCreateAccount} = this.state;
    return (
      <Animated.View
        style={[
          !isRenderCreateAccount && styles.createBtnPlaceholder,
          {transform: [{translateY: btnY}]},
        ]}
        testID="emailVerificationSubmitButton">
        <TextButton size="big50Height" style={styles.emailVerificationBtn}>
          {I18n.t('onboarding.sign_in.email_verification_button')}
        </TextButton>
      </Animated.View>
    );
  };

  emailVerification = async () => {
    const {apiQuery} = this.props;
    const {email} = this.state;
    this.setState({isSendingMail: true});
    try {
      const res = await apiQuery({
        query: {
          domain: 'auth',
          key: 'isEmailAddressExists',
          params: {email: encodeURIComponent(email.value)},
        },
      });
      const exists = get(res, 'data.data.exists');
      if (exists === true) {
        this.setState({isEmailExists: true});
      } else {
        this.setState({
          email: {
            ...this.state.email,
            errorText: 'Couldn’t find your flipflop account',
          },
          isRenderCreateAccount: true,
        });
      }
    } catch (err) {
      this.setState({
        isEmailExists: true,
      });
    }
    this.setState({
      isSendingMail: false,
    });
  };

  renderSignInButton = () => {
    const {btnY} = this.state;
    const submitDisabled = Object.keys(this.state).some(
      (key) => this.state[key].isValid === false,
    );
    return (
      <Animated.View
        style={[styles.signInBtnWrapper, {transform: [{translateY: btnY}]}]}>
        <ApiCommandTextButton
          size="big50Height"
          command="auth.signIn"
          // onPress={this.handleSubmit}
          disabled={submitDisabled}
          testID="loginBtn"
          disabledBGColor={flipFlopColors.paleGreen}>
          {I18n.t('onboarding.sign_in.submit_button')}
        </ApiCommandTextButton>
      </Animated.View>
    );
  };

  toggleSlidedUpFlag = () => {
    if (this.state.slidedUp) {
      // blur the input in case of showing the upper part
      Keyboard.dismiss();
    }
    this.setState({slidedUp: !this.state.slidedUp});
  };

  onBackButtonPress = () => {
    const {slidedUp} = this.state;
    if (!slidedUp) {
      navigationService.goBack();
    } else {
      this.toggleSlidedUpFlag();
    }
  };

  onInputFocus = () => {
    const {slidedUp} = this.state;
    if (!slidedUp) {
      this.toggleSlidedUpFlag();
    }
  };

  onChangeHandlerWrapper = (field) => (changes) => {
    this.setState((state) => ({
      [field]: {
        ...state[field],
        ...changes,
      },
    }));
  };

  navigateToSignUp = () => {
    // const {email, isRenderCreateAccount} = this.state;
    // Keyboard.dismiss();
    // navigationService.navigate(
    //   screenNames.SignUp,
    //   {email, isEmailVerified: !!isRenderCreateAccount},
    //   {noPush: true},
    // );
  };

  handleSubmit = async () => {
    // Keyboard.dismiss();
    // const { email, password } = this.state;
    // const { signIn } = this.props;
    // const { updateAnnotations } = this.props;
    // const misc = await miscLocalStorage.get();
    // updateAnnotations(misc.annotations);
    // await signIn({
    //   method: signInMethodTypes.EMAIL,
    //   params: {
    //     email: email.value,
    //     password: password.value
    //   },
    //   onUnregisteredUserSignIn: this.onNewUserRegistration,
    //   onError: this.emailSignInErrorHandler
    // });
  };

  handleSubmitFromKeyboardPress = () => {
    // const submitDisabled = Object.keys(this.state).some(
    //   (key) => this.state[key].isValid === false,
    // );
    // !submitDisabled && this.handleSubmit();
  };

  handleFacebookSignIn = async () => {
    // Keyboard.dismiss();
    // this.setState({ facebookSignIn: true });
    // const { signIn } = this.props;
    // try {
    //   analytics.actionEvents.onboardingClickedContinueWithFacebook({ success: true }).dispatch();
    //   const result = await facebookLogin(['public_profile', 'email', 'user_friends', 'user_hometown', 'user_location', 'user_gender']);
    //   analytics.viewEvents
    //     .tabView({
    //       screenName: 'OB - Facebook Sign In',
    //       origin: 'OB - Add pages',
    //       subTab: 'Approved'
    //     })
    //     .dispatch();
    //   if (!result.isCancelled) {
    //     const data = await AccessToken.getCurrentAccessToken();
    //     const accessToken = data.accessToken.toString();
    //     await signIn({
    //       method: signInMethodTypes.FACEBOOK,
    //       params: {
    //         accessToken
    //       },
    //       onUnregisteredUserSignIn: this.onNewUserRegistration,
    //       onError: this.facebookSignInErrorHandler
    //     });
    //   } else {
    //     this.setState({ facebookSignIn: false });
    //   }
    // } catch (err) {
    //   analytics.viewEvents
    //     .tabView({
    //       screenName: 'OB - Facebook Sign In',
    //       origin: 'OB - Add pages',
    //       subTab: 'Canceled'
    //     })
    //     .dispatch();
    //   analytics.actionEvents.onboardingClickedContinueWithFacebook({ success: false, failureReason: err }).dispatch();
    //   this.facebookSignInErrorHandler(err);
    // }
  };

  handleAppleSignIn = async () => {
    // Keyboard.dismiss();
    // this.setState({ appleSignIn: true });
    // const { signIn } = this.props;
    // try {
    //   analytics.actionEvents.onboardingClickedContinueWithApple({ success: true }).dispatch();
    //   const result = await appleLogin();
    //   analytics.viewEvents
    //     .tabView({
    //       screenName: 'OB - Apple Sign In',
    //       origin: 'OB - Sign In',
    //       subTab: 'Approved'
    //     })
    //     .dispatch();
    //   await signIn({
    //     method: signInMethodTypes.APPLE,
    //     params: result,
    //     onUnregisteredUserSignIn: this.onNewUserRegistration,
    //     onError: this.appleSignInErrorHandler
    //   });
    // } catch (err) {
    //   analytics.viewEvents
    //     .tabView({
    //       screenName: 'OB - Apple Sign In',
    //       subTab: 'Canceled'
    //     })
    //     .dispatch();
    //   analytics.actionEvents.onboardingClickedContinueWithApple({ success: false, failureReason: err }).dispatch();
    //   this.appleSignInErrorHandler(err);
    //   this.setState({ appleSignIn: false });
    // }
  };

  onNewUserRegistration = async ({user}) => {
    // const { nationalityChoices = {} } = await (miscLocalStorage.get() || {});
    // const { originCountry: originCountryFromLS, destinationCountry: destinationCountryFromLs } = nationalityChoices;
    // const userOriginCountry = get(user, 'journey.originCountry');
    // const originCountry = userOriginCountry && !isEmpty(userOriginCountry) ? userOriginCountry : originCountryFromLS;
    // const userDestinationCountry = get(user, 'journey.destinationCountry');
    // const destinationCountry = userDestinationCountry && !isEmpty(userDestinationCountry) ? userDestinationCountry : destinationCountryFromLs;
    // const initialScreen = getRelevantOnboardingScreen({ user });
    // const params = { origin: screenNames.SignIn, isFirstScreen: true, originCountry, destinationCountry };
    // navigationService.navigate(screenGroupNames.SIGN_UP_WIZARD, params, { initialScreen });
  };

  emailSignInErrorHandler = (err) => {
    // Logger.error(`sign in failed: ${err}`);
    // this.showErrorAlert(err);
  };

  facebookSignInErrorHandler = (err) => {
    // this.setState({ facebookSignIn: false });
    // Logger.error(`facebook sign in failed: ${err}`);
    // ErrorsLogger.fbSignInError(err);
    // if (err.code !== 'FacebookSDK') {
    //   // error source was not canceling dialog of facebook signIn
    //   this.showErrorAlert(err);
    // }
  };

  appleSignInErrorHandler = (err) => {
    // this.setState({ appleSignIn: false });
    // Logger.error(`Apple sign in failed: ${err}`);
    // ErrorsLogger.appleSignInError(err);
    // if (err) {
    //   // error source was not cancelling dialog of Apple signIn
    //   this.showErrorAlert(err);
    // }
  };

  showErrorAlert = (err) => {
    // const code = get(err, 'response.data.error.code');
    // if (!code && code !== 0) {
    //   ErrorModal.showAlert('Sign In failed');
    // } else {
    //   Alert.alert(authErrors[code].signIn.header, authErrors[code].signIn.message, [{ text: authErrors[code].signIn.button }]);
    // }
  };
}

SignIn.propTypes = {
  // signIn: PropTypes.func,
  //   updateAnnotations: PropTypes.func,
  //   apiQuery: PropTypes.func
};

const mapDispatchToProps = {
  // signIn,
  //   updateAnnotations,
  //   apiQuery
};

// SignIn = connect(null, mapDispatchToProps)();
// SignIn = Screen({modalError: true})();

export default SignIn;
