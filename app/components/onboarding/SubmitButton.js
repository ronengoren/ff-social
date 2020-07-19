import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {
  NewTextButton,
  View,
  Image,
  Text,
} from '../../components/basicComponents';
import {flipFlopColors, flipFlopFontsWeights} from '../../vars';
import {transparentize} from '../../infra/utils/stringUtils';
import I18n from '../../infra/localization';
import {stylesScheme} from '../../schemas';
import images from '../../assets/images';

const BUTTON_HEIGHT = 50;

const styles = StyleSheet.create({
  absoluteWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonWrapper: {
    height: BUTTON_HEIGHT,
  },
  submitBtn: {
    height: BUTTON_HEIGHT,
    borderRadius: 10,
    borderWidth: 0,
  },
  text: {
    fontSize: 16,
    lineHeight: 19,
    color: flipFlopColors.white,
    fontWeight: flipFlopFontsWeights.bold,
  },
  gradient: {
    position: 'absolute',
    top: -50,
    height: 50,
    width: '100%',
  },
});

function SubmitButton({
  isDisabled,
  withTopGradient = false,
  wrapperStyle,
  isAbsolute,
  label = I18n.t('common.buttons.next'),
  padding,
  children,
  ...restProps
}) {
  return (
    <View style={[isAbsolute && styles.absoluteWrapper]}>
      <View style={[styles.buttonWrapper, wrapperStyle]}>
        {withTopGradient && (
          <Image
            source={images.common.gradientPaleGreyTwo}
            style={styles.gradient}
            resizeMode="stretch"
          />
        )}
        {/* <NewTextButton
          style={styles.submitBtn}
          textStyle={styles.text}
          activeOpacity={0.5}
          customColor={
            isDisabled
              ? transparentize(flipFlopColors.green, 30)
              : flipFlopColors.green
          }
          {...restProps}
          >
          {label || children}
        </NewTextButton> */}
      </View>
    </View>
  );
}

SubmitButton.propTypes = {
  withTopGradient: PropTypes.bool,
  wrapperStyle: stylesScheme,
  children: PropTypes.node,
  isDisabled: PropTypes.bool,
  isAbsolute: PropTypes.bool,
  label: PropTypes.string,
  padding: PropTypes.bool,
};

export default SubmitButton;
