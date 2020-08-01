import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Spinner, Text} from '../basicComponents';
import {
  flipFlopColors,
  flipFlopFonts,
  flipFlopFontsWeights,
  uiConstants,
  commonStyles,
} from '../../vars';
import {FlipFlopIcon, AwesomeIcon} from '../../assets/icons';
import {stylesScheme} from '../../schemas';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
  },
  default: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: flipFlopColors.green,
    borderWidth: 1,
    borderColor: flipFlopColors.green,
    overflow: 'hidden',
  },
  defaultText: {
    fontFamily: flipFlopFonts.medium,
    fontWeight: flipFlopFontsWeights.medium,
    fontSize: 15,
    lineHeight: 20,
    color: flipFlopColors.white,
    textAlign: 'center',
  },
  roundedDesignText: {
    fontWeight: flipFlopFontsWeights.regular,
    fontSize: 13,
  },
  defaultIcon: {
    marginRight: 7,
    lineHeight: 20,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  small: {
    height: 25,
    paddingHorizontal: 11,
    paddingTop: 2,
    paddingBottom: 1,
    borderRadius: 5,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallText: {
    fontSize: 14,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  medium: {
    height: 30,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 7,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  mediumText: {},
  // eslint-disable-next-line react-native/no-unused-styles
  large: {
    height: 35,
    paddingHorizontal: 19,
    paddingVertical: 7,
    paddingBottom: 6,
    borderRadius: 8,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  largeText: {},
  // eslint-disable-next-line react-native/no-unused-styles
  semiBig: {
    height: 40,
    paddingHorizontal: 19,
    paddingVertical: 7,
    paddingBottom: 8,
    borderRadius: 8,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  semiBigText: {
    fontSize: 15,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  big: {
    flex: 1,
    height: 45,
    paddingHorizontal: 30,
    paddingTop: 13,
    paddingBottom: 12,
    borderRadius: 7,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  big50Height: {
    height: 50,
    paddingHorizontal: 30,
    borderRadius: 7,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  bigText: {},
  // eslint-disable-next-line react-native/no-unused-styles
  bigWrapper: {
    flex: 1,
    height: 45,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  big50HeightWrapper: {
    height: 50,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  huge: {
    flex: 1,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  hugeText: {
    height: 30,
    fontSize: 18,
    lineHeight: 30,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  hugeWrapper: {
    height: 60,
  },
  footerButtonWrapper: {
    height: 60 + uiConstants.FOOTER_MARGIN_BOTTOM,
  },
  secondary: {
    backgroundColor: flipFlopColors.white,
  },
  secondaryText: {
    color: flipFlopColors.green,
  },
  secondaryNewDesign: {
    backgroundColor: flipFlopColors.white,
    borderColor: flipFlopColors.b90,
  },
  secondaryNewDesignText: {
    color: flipFlopColors.b30,
  },
  disabled: {
    backgroundColor: flipFlopColors.disabledGrey,
    borderColor: flipFlopColors.disabledGrey,
  },
  disabledText: {
    color: flipFlopColors.white,
  },
  secondaryDisabled: {
    backgroundColor: flipFlopColors.white,
    borderColor: flipFlopColors.disabledGrey,
  },
  secondaryDisabledText: {
    color: flipFlopColors.disabledGrey,
  },
  active: {
    backgroundColor: flipFlopColors.white,
    borderColor: flipFlopColors.buttonGrey,
  },
  activeText: {
    color: flipFlopColors.buttonGrey,
  },
  rounded: {
    borderRadius: 70,
  },
  spinner: {...StyleSheet.absoluteFillObject},
});

const TextButton = ({
  size = 'small',
  active,
  disabled,
  disabledBGColor,
  busy,
  secondary,
  secondaryNewDesign,
  style,
  textStyle,
  containerStyle,
  footerButton,
  iconName,
  onPress,
  iconSize = 20,
  iconWeight,
  roundedDesign,
  children,
  hitSlop,
  isAwesomeIcon,
  iconStyle,
  paddingHorizontal,
  fitToSize,
  customStyle,
  activeColor,
  ...props
}) => {
  const containerStyles = [
    styles.default,
    styles[size],
    secondary && styles.secondary,
    secondaryNewDesign && styles.secondaryNewDesign,
    active && !secondaryNewDesign && styles.active,
    disabled && !secondary && styles.disabled,
    disabled && secondary && styles.secondaryDisabled,
    disabled &&
      disabledBGColor && {
        backgroundColor: disabledBGColor,
        borderColor: 'transparent',
      },
    roundedDesign && styles.rounded,
    paddingHorizontal && {paddingHorizontal},
    fitToSize && commonStyles.flex1,
    customStyle && customStyle,
  ];

  const textStyles = [
    styles.defaultText,
    secondary && styles.secondaryText,
    secondaryNewDesign && styles.secondaryNewDesignText,
    active && styles.activeText,
    active &&
      secondaryNewDesign && {color: activeColor || flipFlopColors.green},
    disabled && !secondary && styles.disabledText,
    disabled && secondary && styles.secondaryDisabledText,
    roundedDesign && styles.roundedDesignText,
    styles[`${size}Text`],
    textStyle,
  ];

  const iconStyles = [
    styles.defaultIcon,
    {color: StyleSheet.flatten(textStyles).color},
    iconStyle,
  ];

  const spinnerStyles = [styles.spinner, containerStyles, {borderWidth: 0}];

  const bigButtonWrapperStylesArr = [styles[`${size}Wrapper`]];
  if (footerButton) {
    bigButtonWrapperStylesArr.push(styles.footerButtonWrapper);
  }

  const spinnerColor =
    active || secondary ? flipFlopColors.green : flipFlopColors.white;

  const IconComponent = isAwesomeIcon ? AwesomeIcon : FlipFlopIcon;

  if (['big', 'big50Height', 'huge'].includes(size)) {
    return (
      <TouchableOpacity
        style={bigButtonWrapperStylesArr}
        accessible
        accessibilityComponentType="button"
        accessibilityTraits="button"
        activeOpacity={busy || disabled ? 1 : 0.2}
        onPress={busy || disabled ? null : onPress}
        hitSlop={hitSlop}
        {...props}>
        <View style={[containerStyles, style, containerStyle]}>
          {iconName && (
            <IconComponent
              style={iconStyles}
              name={iconName}
              size={iconSize}
              weight={iconWeight}
            />
          )}
          <Text numberOfLines={1} style={textStyles}>
            {children}
          </Text>
          {!!busy && (
            <Spinner
              style={[spinnerStyles, style]}
              center
              size="small"
              color={spinnerColor}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  } else {
    return (
      <View style={[styles.wrapper, style, fitToSize && commonStyles.flex1]}>
        <TouchableOpacity
          accessible
          accessibilityComponentType="button"
          accessibilityTraits="button"
          activeOpacity={busy || disabled ? 1 : 0.2}
          onPress={busy || disabled ? null : onPress}
          hitSlop={hitSlop}
          style={[containerStyle, fitToSize && commonStyles.flex1]}
          {...props}>
          <View style={[containerStyles, containerStyle]}>
            {iconName && (
              <IconComponent
                style={iconStyles}
                name={iconName}
                size={iconSize}
                weight={iconWeight}
              />
            )}
            <Text numberOfLines={1} style={textStyles}>
              {children}
            </Text>
            {busy && (
              <Spinner
                style={spinnerStyles}
                center
                size="small"
                color={spinnerColor}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
};

TextButton.propTypes = {
  children: PropTypes.node,
  iconName: PropTypes.string,
  iconStyle: stylesScheme,
  style: stylesScheme,
  textStyle: stylesScheme,
  containerStyle: stylesScheme,
  customStyle: stylesScheme,
  footerButton: PropTypes.bool,
  width: PropTypes.number,
  size: PropTypes.string,
  active: PropTypes.bool,
  activeColor: PropTypes.string,
  disabled: PropTypes.bool,
  disabledBGColor: PropTypes.string,
  busy: PropTypes.bool,
  secondary: PropTypes.bool,
  secondaryNewDesign: PropTypes.bool,
  onPress: PropTypes.func,
  iconSize: PropTypes.number,
  hitSlop: PropTypes.object,
  isAwesomeIcon: PropTypes.bool,
  iconWeight: PropTypes.string,
  roundedDesign: PropTypes.bool,
  paddingHorizontal: PropTypes.number,
  fitToSize: PropTypes.bool,
};

TextButton.defaultProps = {
  hitSlop: uiConstants.BTN_HITSLOP,
  footerButton: false,
};

export default TextButton;
