import React, {useState, useRef} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Animated} from 'react-native';
import images from '../../../assets/images';
import I18n from '../../../infra/localization';
import {transparentize} from '../../../infra/utils/stringUtils';
import {useKeyboard, useAnimation} from '/hooks';
import {FormInput} from '../../../components';
import {
  View,
  Text,
  Image,
  NewTextButton,
} from '../../../components/basicComponents';
import {uiConstants, flipFlopColors, flipFlopFontsWeights} from '../../../vars';

const IMAGE_HEIGHT = 200;

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    paddingTop: uiConstants.STATUS_BAR_HEIGHT,
    paddingBottom: uiConstants.FOOTER_MARGIN_BOTTOM + 15,
    backgroundColor: flipFlopColors.white,
    justifyContent: 'space-between',
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
    marginBottom: 40,
  },
  formWrapper: {
    padding: 15,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: uiConstants.FOOTER_MARGIN_BOTTOM,
    backgroundColor: flipFlopColors.white,
    flex: 1,
  },
  submitBtn: {
    height: 50,
    borderRadius: 10,
    borderWidth: 0,
  },
  text: {
    fontSize: 16,
    lineHeight: 19,
    color: flipFlopColors.white,
    fontWeight: flipFlopFontsWeights.bold,
  },
});

function AppleDetails({onSubmit}) {
  const [firstName, setFirstName] = useState({value: ''});
  const [lastName, setLastName] = useState({value: ''});
  const lastNameInput = useRef();
  const form = useRef();
  const {keyboardHeight} = useKeyboard();
  const translateY = useAnimation({
    initialValue: 0,
    value: keyboardHeight ? -IMAGE_HEIGHT - uiConstants.STATUS_BAR_HEIGHT : 0,
    duration: 300,
  });
  const buttonBottom = useAnimation({
    initialValue: 0,
    value: -keyboardHeight,
    duration: 300,
  });
  const isSubmitDisabled = !firstName.isValid || !lastName.isValid;

  function submit() {
    onSubmit({firstName: firstName.value, lastName: lastName.value});
  }

  return (
    <View style={styles.wrapper}>
      <Animated.View ref={form} style={[{transform: [{translateY}]}]}>
        <View>
          <Image source={images.onboarding.hi} style={styles.image} />
          <View ref={form} style={[styles.formWrapper]}>
            <Text bold size={32} lineHeight={36}>
              Nice to meet you
            </Text>
            <FormInput
              label={I18n.t('common.form.first_name')}
              autoCapitalize={'words'}
              onChange={(changes) => setFirstName({...firstName, ...changes})}
              value={firstName.value}
              validations={[
                {
                  type: 'minLength',
                  value: 2,
                  errorText: I18n.t('common.form.min_chars', {minChars: 2}),
                },
              ]}
              required
              returnKeyType={'next'}
              onSubmitEditing={() => {
                lastNameInput && lastNameInput.current.focus();
              }}
              autoCorrect={false}
              focusedBorderColor={flipFlopColors.green}
            />
            <FormInput
              label={I18n.t('common.form.last_name')}
              autoCapitalize={'words'}
              onChange={(changes) => setLastName({...lastName, ...changes})}
              ref={lastNameInput}
              value={lastName.value}
              validations={[
                {
                  type: 'minLength',
                  value: 2,
                  errorText: I18n.t('common.form.min_chars', {minChars: 2}),
                },
              ]}
              required
              returnKeyType={'next'}
              autoCorrect={false}
              focusedBorderColor={flipFlopColors.green}
            />
          </View>
        </View>
      </Animated.View>
      <Animated.View
        style={[
          styles.buttonWrapper,
          {transform: [{translateY: buttonBottom}]},
        ]}>
        <NewTextButton
          disabled={isSubmitDisabled}
          size={NewTextButton.sizes.BIG55}
          style={styles.submitBtn}
          textStyle={styles.text}
          activeOpacity={0.5}
          customColor={
            isSubmitDisabled
              ? transparentize(flipFlopColors.green, 30)
              : flipFlopColors.green
          }
          onPress={submit}>
          {I18n.t('common.buttons.next')}
        </NewTextButton>
      </Animated.View>
    </View>
  );
}

AppleDetails.propTypes = {
  onSubmit: PropTypes.func,
};

export default AppleDetails;
