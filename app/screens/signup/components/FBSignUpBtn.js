import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Keyboard} from 'react-native';
import {useDispatch} from 'react-redux';
import {signUp} from '/redux/auth/actions';
import {View, TextButton} from '../../../components/basicComponents';
import I18n from '../../../infra/localization';
// import { Logger, analytics } from '/infra/reporting';
// import ErrorsLogger from '/infra/reporting/ErrorsLogger';
import {navigationService} from '../../../infra/navigation';
// import { facebookLogin, AccessToken } from '/infra/facebook/loginService';
import {getRelevantOnboardingScreen} from '../../../infra/utils/onboardingUtils';
import {get} from '../../../infra/utils';
import {flipFlopColors} from '../../../vars';
import {signUpMethodTypes} from '../../../vars/enums';

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
    backgroundColor: flipFlopColors.facebookBlue,
    borderColor: flipFlopColors.facebookBlue,
  },
});

let reportedFacebookSignUp = false;

function FBSignUpBtn({
  showErrorAlert,
  referrer,
  matchedNationality,
  suggestedNationalities,
  originCountry,
  destinationCountry,
}) {
  const dispatch = useDispatch();
  const [isInProgress, setIsInProgress] = useState(false);

  async function handleFacebookSignUp() {
    // Keyboard.dismiss();
    // if (!reportedFacebookSignUp) {
    //   reportedFacebookSignUp = true;
    //   analytics.viewEvents
    //     .entityView({
    //       screenName: 'OB - Facebook Sign-up',
    //       origin: 'OB - Welcome '
    //     })
    //     .dispatch();
    // }
    // setIsInProgress(true);
    // try {
    //   analytics.actionEvents.onboardingClickedContinueWithFacebook({ success: true }).dispatch();
    //   const result = await facebookLogin(['public_profile', 'email', 'user_friends', 'user_hometown', 'user_location', 'user_gender']);
    //   analytics.viewEvents
    //     .tabView({
    //       screenName: 'OB - Facebook Sign Up',
    //       origin: 'OB - Add pages',
    //       subTab: 'Approved'
    //     })
    //     .dispatch();
    //   if (!result.isCancelled) {
    //     const data = await AccessToken.getCurrentAccessToken();
    //     const accessToken = data.accessToken.toString();
    //     await dispatch(
    //       signUp({
    //         method: signUpMethodTypes.FACEBOOK,
    //         params: {
    //           accessToken,
    //           referrer,
    //           originCountryCode: get(originCountry, 'countryCode'),
    //           originPlaceSearchCountryFilter: get(originCountry, 'alpha2'),
    //           originCountryName: get(originCountry, 'name'),
    //           destinationCountryCode: get(destinationCountry, 'countryCode'),
    //           destinationCountryName: get(destinationCountry, 'name'),
    //           settings: {
    //             language: I18n.getLocale()
    //           }
    //         },
    //         onNewUserSignUp: onNewUserRegistration,
    //         onError: handleError,
    //         matchedNationality
    //       })
    //     );
    //   } else {
    //     setIsInProgress(false);
    //   }
    // } catch (err) {
    //   analytics.viewEvents
    //     .tabView({
    //       screenName: 'OB - Facebook Sign Up',
    //       origin: 'OB - Add pages',
    //       subTab: 'Canceled'
    //     })
    //     .dispatch();
    //   analytics.actionEvents.onboardingClickedContinueWithFacebook({ success: false, failureReason: err }).dispatch();
    //   handleError(err);
    // }
  }

  function handleError(err) {
    // setIsInProgress(false);
    // Logger.error(`facebook sign up failed: ${err}`);
    // ErrorsLogger.fbSignInError(err);
    // if (err.code !== 'FacebookSDK') {
    //   // error source was not canceling dialog of facebook signUp
    //   showErrorAlert(err);
    // }
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
    <View style={styles.wrapper}>
      <TextButton
        size="big50Height"
        iconName="facebook-logo"
        iconSize={23}
        style={styles.button}
        iconStyle={styles.icon}
        onPress={handleFacebookSignUp}
        busy={isInProgress}>
        {I18n.t('onboarding.sign_up.facebook_button')}
      </TextButton>
    </View>
  );
}

FBSignUpBtn.propTypes = {
  showErrorAlert: PropTypes.func,
  referrer: PropTypes.object,
  matchedNationality: PropTypes.object,
  suggestedNationalities: PropTypes.array,
  originCountry: PropTypes.object,
  destinationCountry: PropTypes.object,
};

export default FBSignUpBtn;
