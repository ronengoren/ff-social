import React from 'react';
import PropTypes from 'prop-types';
import {Keyboard, StyleSheet, Alert, Dimensions} from 'react-native';
import {connect} from 'react-redux';
// import { updateAnnotations } from '/redux/general/actions';
import I18n from '../../infra/localization';
// import { apiQuery } from '/redux/apiQuery/actions';
// import {signUp} from '/redux/auth/actions';
import {Screen, FormInput, PasswordInput} from '../../components';
import {
  View,
  KeyboardAvoidingView,
  Text,
  ScrollView,
} from '../../components/basicComponents';
import {
  Wrapper,
  GoBackButton,
  SubmitButton,
  CountriesIcons,
} from '../../components/onboarding';

import {ErrorModal} from '../../components/modals';
import {misc as miscLocalStorage} from '../../infra/localStorage';
// import {Logger, analytics} from '/infra/reporting';
import {get} from '../../infra/utils';
import {
  isHighDevice,
  isShortDevice,
  isAndroid,
} from '../../infra/utils/deviceUtils';
import {navigationService} from '../../infra/navigation';
import {flipFlopColors, uiConstants, commonStyles} from '../../vars';
import {
  screenNames,
  signUpMethodTypes,
  authErrors,
  downloadLinks,
} from '../../vars/enums';
import {getRelevantOnboardingScreen} from '../../infra/utils/onboardingUtils';
// import {getFirstReferringParams} from '/infra/referrerInfo';

const styles = StyleSheet.create({
  header: {
    paddingTop:
      uiConstants.PHONE_BAR_HEIGHT_TRANSLUCENT + (isHighDevice ? 76 : 56),
    paddingHorizontal: 15,
    backgroundColor: flipFlopColors.white,
  },
  backButton: {
    marginTop: 8,
  },
  flags: {
    position: 'absolute',
    right: 15,
    top: uiConstants.PHONE_BAR_HEIGHT_TRANSLUCENT + 20,
  },
  wrapper: {
    marginHorizontal: 20,
  },
  signUpButton: {
    position: 'absolute',
    bottom: uiConstants.FOOTER_MARGIN_BOTTOM + 15,
    left: 15,
    right: 15,
  },
  rowSeparator: {
    marginHorizontal: 22,
  },
});

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: {
        value: get(this.props, 'navigation.state.params.email.value', ''),
      },
      firstName: {value: ''},
      lastName: {value: ''},
      password: {value: ''},
      referrer: {
        id: undefined,
        linkType: undefined,
      },
      isEmailVerified: get(
        this.props,
        'navigation.state.params.isEmailVerified',
        false,
      ),
      isVerifyingEmail: false,
      isSubmitting: false,
    };
  }

  render() {
    const {
      email,
      firstName,
      lastName,
      password,
      isEmailVerified,
      isVerifyingEmail,
      isSubmitting,
    } = this.state;
    const {originCountry, destinationCountry} = this.props;
    const {height} = Dimensions.get('window');

    return (
      <Wrapper>
        <ScrollView
          contentContainerStyle={{height: 2 * height}}
          ref={(node) => {
            this.scroll = node;
          }}
          scrollToOverflowEnabled>
          <View style={styles.header}>
            <Text
              bold
              size={32}
              lineHeight={36}
              color={flipFlopColors.b30}
              alignLocale>
              {I18n.t('onboarding.sign_up.page_header')}
            </Text>
            {!!originCountry && !!destinationCountry && (
              <CountriesIcons
                originCountry={originCountry}
                destinationCountry={destinationCountry}
                size={30}
                style={styles.flags}
              />
            )}
            <GoBackButton style={styles.backButton} />
          </View>

          <View style={styles.wrapper}>
            <FormInput
              label={I18n.t('common.form.email')}
              keyboardType={'email-address'}
              autoCapitalize={'none'}
              onChange={this.handleChangeHandlerWrapper('email')}
              value={email.value}
              validations={process.env.WITH_TESTS !== 'true' ? ['email'] : []}
              errorText={email.errorText}
              required
              returnKeyType={isEmailVerified ? 'next' : 'done'}
              ref={(node) => {
                this.emailInput = node;
              }}
              onSubmitEditing={() => {
                isEmailVerified
                  ? this.passwordInput.focus()
                  : this.handleNext();
              }}
              autoCorrect={false}
              focusedBorderColor={flipFlopColors.green}
              testID="signupEmailInput"
              autoFocus={!email.value}
            />
            {isEmailVerified && (
              <React.Fragment>
                <PasswordInput
                  value={password.value}
                  errorText={password.errorText}
                  onChange={this.handleChangeHandlerWrapper('password')}
                  onFocus={() => {
                    isAndroid &&
                      this.scroll &&
                      this.scroll.scrollTo({
                        x: 0,
                        y: isShortDevice ? 120 : 40,
                        animated: true,
                      });
                  }}
                  ref={(node) => {
                    this.passwordInput = node;
                  }}
                  onSubmitEditing={() => {
                    this.firstNameInput.focus();
                  }}
                  testID="signupPasswordInput"
                />
                <View style={[commonStyles.flexDirectionRow]}>
                  <FormInput
                    style={commonStyles.flex1}
                    label={I18n.t('common.form.first_name')}
                    autoCapitalize={'words'}
                    onChange={this.handleChangeHandlerWrapper('firstName')}
                    value={firstName.value}
                    errorText={firstName.errorText}
                    validations={[
                      {
                        type: 'minLength',
                        value: 2,
                        errorText: I18n.t('common.form.min_chars', {
                          minChars: 2,
                        }),
                      },
                    ]}
                    required
                    returnKeyType={'next'}
                    ref={(node) => {
                      this.firstNameInput = node;
                    }}
                    onSubmitEditing={() => {
                      this.lastNameInput.focus();
                    }}
                    autoCorrect={false}
                    focusedBorderColor={flipFlopColors.green}
                    testID="signupFirstNameInput"
                  />
                  <View style={styles.rowSeparator} />
                  <FormInput
                    style={commonStyles.flex1}
                    label={I18n.t('common.form.last_name')}
                    autoCapitalize={'words'}
                    onChange={this.handleChangeHandlerWrapper('lastName')}
                    value={lastName.value}
                    errorText={lastName.errorText}
                    validations={[
                      {
                        type: 'minLength',
                        value: 2,
                        errorText: I18n.t('common.form.min_chars', {
                          minChars: 2,
                        }),
                      },
                    ]}
                    required
                    returnKeyType={'done'}
                    ref={(node) => {
                      this.lastNameInput = node;
                    }}
                    onSubmitEditing={this.handleSubmit}
                    autoCorrect={false}
                    focusedBorderColor={flipFlopColors.green}
                    testID="signupLastNameInput"
                  />
                </View>
              </React.Fragment>
            )}
          </View>
        </ScrollView>
        <KeyboardAvoidingView
          style={styles.signUpButton}
          keyboardVerticalOffset={15}>
          <SubmitButton
            // onPress={isEmailVerified ? this.handleSubmit : this.handleNext}
            // isDisabled={this.isSubmitDisabled()}
            // busy={isEmailVerified ? isSubmitting : isVerifyingEmail}
            testID="signupSubmitBtn"
            label={
              isEmailVerified
                ? I18n.t('onboarding.sign_up.submit_button')
                : I18n.t('common.buttons.next')
            }
          />
        </KeyboardAvoidingView>
      </Wrapper>
    );
  }

  componentDidMount() {
    const {email} = this.state;
    this.setBranchReferrer();
    if (email.value) {
      this.handleNext();
    }
  }

  isSubmitDisabled = () => {
    const {isEmailVerified, email} = this.state;
    return isEmailVerified
      ? Object.keys(this.state).some((key) => this.state[key].isValid === false)
      : !email.value.length;
  };

  setBranchReferrer() {
    // getFirstReferringParams().then((response) => {
    //   if (!response.rid) {
    //     return;
    //   }
    //   let linkType = 'Unknown';
    //   const referralLink = response['~referring_link'];
    //   if (referralLink) {
    //     Object.entries(downloadLinks).forEach(([key, value]) => {
    //       if (referralLink.indexOf(value) > -1) {
    //         linkType = key;
    //       }
    //     });
    //   }
    //   const newState = {
    //     referrer: {
    //       id: response.rid,
    //       linkType,
    //     },
    //   };
    //   this.setState(newState);
    // });
  }

  handleChangeHandlerWrapper = (field) => (changes) => {
    this.setState((state) => ({
      [field]: {
        ...state[field],
        ...changes,
      },
    }));
  };

  navigateToSignIn = () => {
    const {email} = this.state;
    navigationService.navigate(
      screenNames.SignIn,
      {email: email.value},
      {noPush: true},
    );
  };

  handleNext = async () => {
    // const { email } = this.state;
    // const { apiQuery } = this.props;
    // if (email.isValid) {
    //   this.setState({ isVerifyingEmail: true });
    //   try {
    //     const res = await apiQuery({ query: { domain: 'auth', key: 'isEmailAddressExists', params: { email: encodeURIComponent(email.value) } } });
    //     const exists = get(res, 'data.data.exists');
    //     if (exists) {
    //       this.navigateToSignIn();
    //     } else {
    //       this.setState({ isEmailVerified: true });
    //       this.passwordInput.focus();
    //     }
    //   } catch (err) {
    //     this.setState({ isEmailVerified: true });
    //     this.passwordInput.focus();
    //     Logger.error({ message: 'failed to verify email', err, email });
    //   }
    //   this.setState({ isVerifyingEmail: false });
    // } else {
    //   this.emailInput.handleInputBlur();
    // }
  };

  handleSubmit = async () => {
    // const { updateAnnotations, originCountry, destinationCountry, matchedNationality } = this.props;
    // const misc = (await miscLocalStorage.get()) || {};
    // updateAnnotations(misc.annotations);
    // if (this.isSubmitDisabled()) {
    //   Alert.alert('There was a problem', 'Please review the form and try again', [{ text: 'OK' }]);
    //   return;
    // }
    // Keyboard.dismiss();
    // const { email, firstName, lastName, password, referrer } = this.state;
    // const { id, linkType } = referrer;
    // const { signUp } = this.props;
    // this.setState({ isSubmitting: true });
    // await signUp({
    //   method: signUpMethodTypes.EMAIL,
    //   params: {
    //     email: email.value,
    //     firstName: firstName.value,
    //     lastName: lastName.value,
    //     password: password.value,
    //     referrer: {
    //       id,
    //       linkType
    //     },
    //     originCountryCode: get(originCountry, 'countryCode'),
    //     originPlaceSearchCountryFilter: get(originCountry, 'alpha2'),
    //     originCountryName: get(originCountry, 'name'),
    //     destinationCountryCode: get(destinationCountry, 'countryCode'),
    //     destinationCountryName: get(destinationCountry, 'name'),
    //     settings: {
    //       language: I18n.getLocale()
    //     }
    //   },
    //   onNewUserSignUp: this.onNewUserRegistration,
    //   onError: this.regularSignUpErrorHandler,
    //   matchedNationality
    // });
  };

  onNewUserRegistration = ({user}) => {
    // const {email} = this.state;
    // const {
    //   matchedNationality,
    //   suggestedNationalities,
    //   originCountry,
    //   destinationCountry,
    // } = this.props;
    // this.setState({isSubmitting: false});
    // analytics.actionEvents
    //   .onboardingClickedClickedGetStarted({email: email.value, success: true})
    //   .dispatch();
    // const nextScreen = getRelevantOnboardingScreen({
    //   user,
    //   matchedNationality,
    //   suggestedNationalities,
    // });
    // navigationService.navigate(nextScreen, {
    //   suggestedNationalities,
    //   originCountry,
    //   destinationCountry,
    // });
  };

  regularSignUpErrorHandler = (err) => {
    // const { email } = this.state;
    // this.setState({ isSubmitting: false });
    // Logger.error(`sign up failed: ${err}`);
    // const code = get(err, 'response.data.error.code');
    // if (code || code === 0) {
    //   if (get(authErrors, `[${code}].field`)) {
    //     this.setState({
    //       [authErrors[code].field]: {
    //         ...this.state[authErrors[code].field],
    //         valid: false,
    //         errorText: authErrors[code].message
    //       }
    //     });
    //     analytics.actionEvents.onboardingClickedClickedGetStarted({ email: email.value, success: false, failureReason: authErrors[code].message }).dispatch();
    //   } else {
    //     analytics.actionEvents.onboardingClickedClickedGetStarted({ email: email.value, success: false, failureReason: authErrors[code].signUp.message }).dispatch();
    //     this.showErrorAlert(err);
    //   }
    // } else {
    //   ErrorModal.showAlert('Sign Up failed');
    // }
  };

  showErrorAlert = (err) => {
    // const code = get(err, 'response.data.error.code');
    // if (this.isMissingAppleDetails()) {
    //   this.setState({ showAppleDetailsForm: true });
    // } else if (!code && code !== 0) {
    //   ErrorModal.showAlert('Sign Up failed');
    // } else {
    //   Alert.alert(authErrors[code].signUp.header, authErrors[code].signUp.message, [{ text: authErrors[code].signUp.button }]);
    // }
  };
}

SignUp.propTypes = {
  matchedNationality: PropTypes.object,
  suggestedNationalities: PropTypes.array,
  originCountry: PropTypes.object,
  destinationCountry: PropTypes.object,
  //   signUp: PropTypes.func,
  //   updateAnnotations: PropTypes.func,
  //   apiQuery: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  const navigationParams = get(ownProps, 'navigation.state.params', {});
  return navigationParams;
};
const mapDispatchToProps = {
  //   signUp,
  //   updateAnnotations,
  //   apiQuery
};

SignUp = connect(mapStateToProps, mapDispatchToProps)(SignUp);
export default Screen({modalError: true})(SignUp);
