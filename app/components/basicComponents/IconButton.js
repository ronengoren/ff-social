import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {FlipFlopIcon, AwesomeIcon} from '../../assets/icons';
import {flipFlopColors, uiConstants} from '../../vars';

const styles = StyleSheet.create({
  defaultContainer: {
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallContainer: {
    height: 20,
    width: 20,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  largeContainer: {
    height: 40,
    width: 40,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  xlargeContainer: {
    height: 70,
    width: 70,
  },
  disabledIcon: {
    color: flipFlopColors.disabledGrey,
  },
});

const IconButton = ({
  name,
  size = 'default',
  iconColor = 'buttonGrey',
  disabled,
  onPress,
  onLongPress,
  style,
  iconStyle,
  iconSize,
  isAwesomeIcon,
  weight,
  hitSlop,
  ...restProps
}) => {
  const containerStyle = [
    styles.defaultContainer,
    styles[`${size}Container`],
    disabled && styles.disabled,
    style,
  ];

  const flipFlopIcon = [disabled && styles.disabledIcon, iconStyle];

  const buttonIconSize = size === 'large' ? 26 : 19;
  const calculatedIconColor = disabled
    ? flipFlopColors.b70
    : flipFlopColors[iconColor];

  return (
    <TouchableOpacity
      accessible
      accessibilityComponentType="button"
      accessibilityTraits="button"
      style={containerStyle}
      onPress={disabled ? null : onPress}
      onLongPress={disabled ? null : onLongPress}
      activeOpacity={disabled ? 1 : 0.6}
      hitSlop={hitSlop}
      {...restProps}>
      {isAwesomeIcon ? (
        <AwesomeIcon
          name={name}
          weight={weight}
          color={calculatedIconColor}
          style={flipFlopIcon}
          size={iconSize || buttonIconSize}
        />
      ) : (
        <FlipFlopIcon
          name={name}
          color={calculatedIconColor}
          style={flipFlopIcon}
          size={iconSize || buttonIconSize}
        />
      )}
    </TouchableOpacity>
  );
};

IconButton.defaultProps = {
  hitSlop: uiConstants.BTN_HITSLOP,
};

IconButton.propTypes = {
  hitSlop: PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
  }),
  name: PropTypes.string,
  iconColor: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  style: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
    PropTypes.object,
  ]),
  iconStyle: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.number,
    PropTypes.object,
  ]),
  iconSize: PropTypes.number,
  isAwesomeIcon: PropTypes.bool,
  weight: PropTypes.string,
};

export default IconButton;
