import React, {useCallback} from 'react';
import {StyleSheet, Alert} from 'react-native';
import PropTypes from 'prop-types';
import videos from '../../assets/videos';
import {AwesomeIcon} from '../../assets/icons';
import {useBackHandler} from '/hooks';
import {Screen} from '../../components';
import {
  ScrollView,
  TranslatedText,
  Text,
  IconButton,
} from '../../components/basicComponents';
import {Wrapper, HeaderMedia} from '../../components/onboarding';
import {ErrorModal} from '../../components/modals';
import {get} from '../../infra/utils';
import {isHighDevice, isShortDevice} from '../../infra/utils/deviceUtils';
import I18n from '../../infra/localization';
import {navigationService} from '../../infra/navigation';
// import { isAppleAuthSupported } from '/infra/apple/authService';
// import { Logger } from '/infra/reporting';
import {flipFlopColors, flipFlopFontsWeights, uiConstants} from '../../vars';
import {authErrors, screenNames} from '../../vars/enums';
import {
  JoinNationalityTitle,
  AppleSignUpBtn,
  FBSignUpBtn,
  EmailSignUpBtn,
} from './components';

// const showAppleSignUp = isAppleAuthSupported();

let titleMarginTop = 0;
if (isHighDevice) {
  titleMarginTop = 40;
}
if (isShortDevice) {
  titleMarginTop = 90;
}

const styles = StyleSheet.create({
  video: {
    marginTop: isHighDevice ? 20 : 0,
    marginBottom: 4,
  },
  backBtn: {
    position: 'absolute',
    left: 9,
    top: 13 + uiConstants.STATUS_BAR_HEIGHT,
  },
  text: {
    color: flipFlopColors.b30,
    fontSize: 32,
    fontWeight: flipFlopFontsWeights.bold,
    lineHeight: 38,
    marginBottom: 52,
  },
  smallText: {
    fontSize: 24,
    lineHeight: 32,
  },
  numbers: {
    color: flipFlopColors.b30,
    fontSize: 32,
    lineHeight: 35,
  },
  title: {
    marginHorizontal: 15,
    marginTop: titleMarginTop,
  },
  disclaimerWrapper: {
    textAlign: 'center',
    marginHorizontal: 15,
  },
  disclaimer: {
    fontSize: 12,
    lineHeight: 17,
    color: flipFlopColors.b60,
  },
  disclaimerLink: {
    color: flipFlopColors.green,
  },
});

function SignUpMethods({navigation}) {
  // const {
  //   matchedNationality,
  //   nationality,
  //   suggestedNationalities,
  //   originCountry,
  //   destinationCountry,
  // } = get(navigation, 'state.params', {});

  // if (!originCountry || !destinationCountry) {
  //   Logger.debug({ message: 'Reached sign up methods without origin or destination', originCountry, destinationCountry, matchedNationality });
  // }

  // const handleBackPress = useCallback(() => {
  //   if (navigation.isFocused()) {
  //     goBack();
  //   }
  //   return true;
  // });
  // useBackHandler(handleBackPress);

  // function showErrorAlert(err) {
  //   const code = get(err, 'response.data.error.code');
  //   if (!code && code !== 0) {
  //     ErrorModal.showAlert('Sign Up failed');
  //   } else {
  //     Alert.alert(
  //       authErrors[code].signUp.header,
  //       authErrors[code].signUp.message,
  //       [{text: authErrors[code].signUp.button}],
  //     );
  //   }
  // }

  // function navigateToUrl(suffix) {
  //   return () =>
  //     navigationService.navigate(screenNames.WebView, {
  //       title: ' ',
  //       url: `https://www.homeis.com/${suffix}`,
  //     });
  // }

  // function goBack() {
  //   if (originCountry && destinationCountry) {
  //     navigationService.replace(screenNames.SetUserNationality, {
  //       originCountry,
  //       destinationCountry,
  //       matchedNationality,
  //     });
  //   }
  // }

  // const navigationParams = {
  //   matchedNationality,
  //   suggestedNationalities,
  //   originCountry,
  //   destinationCountry,
  // };

  return (
    <Wrapper>
      <ScrollView>
        {!isShortDevice && (
          <HeaderMedia
            videoSource={videos.onboarding.signUpMethods}
            wrapperStyle={styles.video}
          />
        )}
        <IconButton
          name="chevron-left"
          isAwesomeIcon
          iconColor="green"
          iconSize={20}
          weight="solid"
          // onPress={goBack}
          hitSlop={uiConstants.BTN_HITSLOP}
          style={styles.backBtn}
        />

        <JoinNationalityTitle
          // nationality={nationality}
          // originCountry={originCountry}
          // destinationCountry={destinationCountry}
          translationKey="sign_up_methods_screen"
          textStyle={styles.text}
          smallTextStyle={[styles.text, styles.smallText]}
          smallNumbersStyle={[styles.text, styles.numbers, styles.smallText]}
          numbersStyle={styles.numbers}
          style={styles.title}
        />
        <FBSignUpBtn />
        <EmailSignUpBtn
          onPress={() => navigationService.navigate(screenNames.SignUp)}
        />
        {/* {showAppleSignUp && (
          <AppleSignUpBtn
            showErrorAlert={showErrorAlert}
            {...navigationParams}
          />
        )} */}
        <Text style={styles.disclaimerWrapper}>
          <AwesomeIcon name="lock-alt" color={flipFlopColors.b60} />{' '}
          <TranslatedText
            textStyle={styles.disclaimer}
            map={[
              {
                text: I18n.t('onboarding.sign_up.legal.terms_link'),
                style: [styles.disclaimer, styles.disclaimerLink],
                // onPress: navigateToUrl('terms'),
              },
              {
                text: I18n.t('onboarding.sign_up.legal.privacy_policy'),
                style: [styles.disclaimer, styles.disclaimerLink],
                // onPress: navigateToUrl('privacy'),
              },
            ]}>
            {I18n.t('onboarding.sign_up_methods_screen.disclaimer')}
          </TranslatedText>
        </Text>
      </ScrollView>
    </Wrapper>
  );
}

SignUpMethods.propTypes = {
  // navigation: PropTypes.object,
};

export default Screen({modalError: true})(SignUpMethods);
