import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {View, TextButton} from '../../../components/basicComponents';
import I18n from '../../../infra/localization';
// import { analytics } from '/infra/reporting';
import {flipFlopColors} from '../../../vars';

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
    backgroundColor: flipFlopColors.green,
    borderColor: flipFlopColors.green,
  },
});

function EmailSignUpBtn({onPress}) {
  function handlePress() {
    // analytics.actionEvents.onboardingClickedContinueWithEmail().dispatch();
    onPress();
  }

  return (
    <View style={styles.wrapper}>
      <TextButton
        size="big50Height"
        iconName="envelope"
        isAwesomeIcon
        iconWeight="solid"
        iconSize={22}
        style={styles.button}
        iconStyle={styles.icon}
        onPress={handlePress}
        testID="signUpContinueWithEmailBtn">
        {I18n.t('onboarding.sign_up.email_button')}
      </TextButton>
    </View>
  );
}

EmailSignUpBtn.propTypes = {
  onPress: PropTypes.func,
};

export default EmailSignUpBtn;
