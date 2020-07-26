import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Keyboard} from 'react-native';
import {useDispatch} from 'react-redux';
import {signUp} from '/redux/auth/actions';
import {View, TextButton} from '../../../components/basicComponents';
import I18n from '../../../infra/localization';
// import { Logger, analytics } from '/infra/reporting';
// import ErrorsLogger from '/infra/reporting/ErrorsLogger';
// import { login as appleLogin } from '/infra/apple/authService';
import {navigationService} from '../../../infra/navigation';
import {getRelevantOnboardingScreen} from '../../../infra/utils/onboardingUtils';
import {flipFlopColors} from '../../../vars';
import {signUpMethodTypes} from '../../../vars/enums';
import AppleDetails from './AppleDetails';

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 15,
    marginHorizontal: 15,
  },
  icon: {
    position: 'absolute',
    left: 15,
  },

  button: {
    backgroundColor: flipFlopColors.realBlack,
    borderColor: flipFlopColors.realBlack,
  },
});

let appleSignUpDetails;

function AppleSignUpBtn({
  showErrorAlert,
  referrer,
  matchedNationality,
  suggestedNationalities,
  originCountry,
  destinationCountry,
}) {
  const dispatch = useDispatch();
  const [isInProgress, setIsInProgress] = useState(false);
  const [isAppleDetailsFormShown, setIsAppleDetailsFormShown] = useState(false);
  async function handleAppleSignUp() {
    Keyboard.dismiss();
    setIsInProgress(true);

    try {
      if (!appleSignUpDetails) {
        analytics.actionEvents
          .onboardingClickedContinueWithApple({success: true})
          .dispatch();
        appleSignUpDetails = await appleLogin();
      }
      analytics.viewEvents
        .tabView({
          screenName: 'OB - Apple Sign Up',
          origin: 'OB - Welcome',
          subTab: 'Approved',
        })
        .dispatch();

      await dispatch(
        signUp({
          method: signUpMethodTypes.APPLE,
          params: {
            ...appleSignUpDetails,
            referrer,
            originCountryCode: originCountry.countryCode,
            originPlaceSearchCountryFilter: originCountry.alpha2,
            originCountryName: originCountry.name,
            destinationCountryCode: destinationCountry.countryCode,
            destinationCountryName: destinationCountry.name,
            settings: {
              language: I18n.getLocale(),
            },
          },
          onNewUserSignUp: onNewUserRegistration,
          onError: appleSignInErrorHandler,
          matchedNationality,
        }),
      );
    } catch (err) {
      analytics.viewEvents
        .tabView({
          screenName: 'OB - Apple Sign Up',
          subTab: 'Canceled',
        })
        .dispatch();
      analytics.actionEvents
        .onboardingClickedContinueWithApple({
          success: false,
          failureReason: err,
        })
        .dispatch();
      appleSignInErrorHandler(err);
    }
  }

  function appleSignInErrorHandler(err) {
    if (isMissingAppleDetails()) {
      setIsAppleDetailsFormShown(true);
    } else if (err) {
      // error source was not cancelling dialog of Apple signIn
      if (isMissingAppleDetails()) {
        setIsAppleDetailsFormShown(true);
      } else {
        showErrorAlert(err);
      }
    }
    setIsInProgress(false);
    Logger.error(`Apple sign in failed: ${err}`);
    ErrorsLogger.appleSignInError(err);
  }

  function isMissingAppleDetails() {
    return (
      appleSignUpDetails &&
      (!appleSignUpDetails.firstName || !appleSignUpDetails.firstName)
    );
  }

  function handleAppleDetailsSubmit({firstName, lastName}) {
    appleSignUpDetails = {...appleSignUpDetails, firstName, lastName};
    setIsAppleDetailsFormShown(false);
    handleAppleSignUp();
  }

  function onNewUserRegistration({user}) {
    const nextScreen = getRelevantOnboardingScreen({
      user,
      matchedNationality,
      suggestedNationalities,
    });
    navigationService.navigate(nextScreen, {
      suggestedNationalities,
      originCountry,
      destinationCountry,
    });
  }

  return (
    <React.Fragment>
      <View style={styles.wrapper}>
        <TextButton
          size="big50Height"
          isAwesomeIcon
          iconName="apple"
          iconWeight="brands"
          iconSize={23}
          style={styles.button}
          iconStyle={styles.icon}
          onPress={handleAppleSignUp}
          busy={isInProgress}>
          {I18n.t('onboarding.sign_up.apple_button')}
        </TextButton>
      </View>
      {isAppleDetailsFormShown && (
        <AppleDetails onSubmit={handleAppleDetailsSubmit} />
      )}
    </React.Fragment>
  );
}

AppleSignUpBtn.propTypes = {
  showErrorAlert: PropTypes.func,
  referrer: PropTypes.object,
  matchedNationality: PropTypes.object,
  suggestedNationalities: PropTypes.array,
  originCountry: PropTypes.object,
  destinationCountry: PropTypes.object,
};

export default AppleSignUpBtn;
