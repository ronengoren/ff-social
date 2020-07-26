import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {flipFlopColors, uiConstants} from '../../vars';
import {AwesomeIcon} from '../.././assets/icons';
import {stylesScheme} from '../../schemas';
import {navigationService} from '../../infra/navigation';

const hitSlop = {left: 15, right: 5, top: 5, bottom: 5};

const styles = StyleSheet.create({
  backButtonWrapper: {
    position: 'absolute',
    left: 15,
    top: uiConstants.PHONE_BAR_HEIGHT_TRANSLUCENT + 15,
    width: 20,
    zIndex: 10,
  },
});

function GoBackButton({onPress, style}) {
  return (
    <TouchableOpacity
      accessibilityTraits="button"
      accessibilityComponentType="button"
      activeOpacity={1}
      onPress={onPress}
      style={[styles.backButtonWrapper, style]}
      hitSlop={hitSlop}>
      <AwesomeIcon
        name="chevron-left"
        size={21}
        weight="solid"
        color={flipFlopColors.green}
      />
    </TouchableOpacity>
  );
}

GoBackButton.defaultProps = {
  onPress: navigationService.goBack,
};

GoBackButton.propTypes = {
  style: stylesScheme,
  onPress: PropTypes.func,
};

export default GoBackButton;
