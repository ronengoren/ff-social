import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Text, View} from '../basicComponents';
import {flipFlopIcon, AwesomeIcon} from '../../assets/icons';
import {flipFlopColors} from '../../vars';
import {stylesScheme} from '../../schemas';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: 'dashed',
    borderColor: flipFlopColors.b70,
    backgroundColor: flipFlopColors.paleGreyTwo,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  rectangular_large: {
    width: '100%',
    height: 180,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  rectangular_medium: {
    width: '100%',
    height: 150,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  rectangular_small: {
    width: '100%',
    height: 130,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  square_large: {
    width: 180,
    height: 180,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  square_medium: {
    width: 120,
    height: 120,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  square_small: {
    width: 90,
    height: 90,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  square_tiny: {
    width: 55,
    height: 55,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  circle_medium: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  iconWithText: {
    marginBottom: 2,
  },
  text: {
    textAlign: 'center',
    lineHeight: 19,
    fontSize: 16,
    color: flipFlopColors.placeholderGrey,
  },
});

const ImagePlaceholder = ({
  type = 'rectangular',
  size = 'large',
  text,
  style,
  textStyle,
  iconName,
  iconSize = 70,
  onPress,
  color,
  isAwesomeIcon = false,
}) => {
  const computedStyle = [styles.container, styles[`${type}_${size}`], style];

  const renderIcon = () => [
    isAwesomeIcon ? (
      <AwesomeIcon
        key={1}
        name={iconName}
        color={color || flipFlopColors.placeholderGrey}
        style={text && styles.iconWithText}
        size={iconSize}
      />
    ) : (
      <flipFlopIcon
        key={1}
        name={iconName}
        size={iconSize}
        color={color || flipFlopColors.placeholderGrey}
        style={text && styles.iconWithText}
      />
    ),
    !(type === 'square' && size === 'small') && text && (
      <Text key={2} style={[styles.text, textStyle]}>
        {text}
      </Text>
    ),
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={computedStyle}
        onPress={onPress}
        activeOpacity={1}
        testID="imagePlaceholder"
        accessibilityTraits="button"
        accessibilityComponentType="button">
        {renderIcon()}
      </TouchableOpacity>
    );
  }

  return <View style={computedStyle}>{renderIcon()}</View>;
};

ImagePlaceholder.propTypes = {
  type: PropTypes.oneOf(['rectangular', 'square', 'circle']),
  size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large']),
  text: PropTypes.string,
  style: stylesScheme,
  textStyle: stylesScheme,
  iconName: PropTypes.string,
  iconSize: PropTypes.number,
  onPress: PropTypes.func,
  color: PropTypes.string,
  isAwesomeIcon: PropTypes.bool,
};

export default ImagePlaceholder;
