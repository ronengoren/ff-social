import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import I18n from '../../infra/localization';
import {Text} from '../../components/basicComponents';
import {SubmitButton} from '../../components/onboarding';
import {flipFlopColors} from '../../vars';
import {isRTL, isHebrewOrArabic} from '../../infra/utils/stringUtils';

const styles = StyleSheet.create({
  footerInnerWrapper: {
    marginTop: 10,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: 0.2,
    color: flipFlopColors.placeholderGrey,
  },
  footerLink: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: 0.2,
    color: flipFlopColors.green,
  },
  hebrewText: {
    lineHeight: 21,
  },
  rtlText: {
    direction: 'rtl',
  },
});

function JoinOrSignupBar({
  onClickSignIn,
  onClickSignUp,
  isSubmitDisabled,
  signUpTestID,
  signInTestID,
  isConnected,
}) {
  const navigateToSignIn = () => {
    onClickSignIn && onClickSignIn();
  };

  const navigateToSignUp = () => {
    onClickSignUp && onClickSignUp();
  };

  const titleText = I18n.t('onboarding.welcome.have_account');
  const isRTLText = isRTL(titleText);
  const isHebrewText = isHebrewOrArabic(titleText);
  return (
    <React.Fragment>
      <SubmitButton />
      <SubmitButton
        isAbsolute={false}
        isDisabled={isSubmitDisabled}
        onPress={navigateToSignUp}
        testID={signUpTestID}
        label={I18n.t('onboarding.welcome.button')}
      />
      {!isConnected && (
        <Text
          onPress={navigateToSignIn}
          testID={signInTestID}
          style={[styles.footerInnerWrapper, isRTLText && styles.rtlText]}>
          <Text style={styles.footerText} medium>
            {titleText}{' '}
          </Text>
          <Text
            style={[styles.footerLink, isHebrewText && styles.hebrewText]}
            medium>
            {I18n.t('onboarding.welcome.have_account_button')}
          </Text>
        </Text>
      )}
    </React.Fragment>
  );
}

JoinOrSignupBar.defaultProps = {
  signUpTestID: 'signupBtn',
  signInTestID: 'signinBtn',
};

JoinOrSignupBar.propTypes = {
  isSubmitDisabled: PropTypes.bool,
  onClickSignUp: PropTypes.func,
  onClickSignIn: PropTypes.func,
  signUpTestID: PropTypes.string,
  signInTestID: PropTypes.string,
  isConnected: PropTypes.bool,
};

export default JoinOrSignupBar;
