import React from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from '../basicComponents';
import {FlipFlopIcon} from '../../assets/icons';
import {flipFlopColors} from '../../vars';
import {stylesScheme} from '../../schemas';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: 'dashed',
    borderColor: flipFlopColors.placeholderGrey,
    backgroundColor: flipFlopColors.fillGrey,
  },
  flexRow: {
    flexDirection: 'row',
  },
  iconMargin: {
    marginRight: 10,
  },
  text: {
    color: flipFlopColors.placeholderGrey,
  },
});

const CallToActionArea = ({
  isSecondary,
  text,
  style,
  textStyle = null,
  mediumWeight,
  iconName,
  iconColor = flipFlopColors.placeholderGrey,
  onPress,
  iconSize = 30,
}) => (
  <TouchableOpacity
    style={[styles.container, !isSecondary && styles.flexRow, style]}
    onPress={onPress}
    activeOpacity={1}>
    {!!iconName && (
      <FlipFlopIcon
        name={iconName}
        size={iconSize}
        color={iconColor}
        style={!isSecondary && styles.iconMargin}
      />
    )}
    <Text style={[styles.text, textStyle]} medium={mediumWeight} alignLocale>
      {text}
    </Text>
  </TouchableOpacity>
);

CallToActionArea.propTypes = {
  text: PropTypes.string,
  style: stylesScheme,
  textStyle: stylesScheme,
  mediumWeight: PropTypes.bool,
  iconName: PropTypes.string,
  onPress: PropTypes.func,
  iconSize: PropTypes.number,
  iconColor: PropTypes.string,
  isSecondary: PropTypes.bool,
};

export default CallToActionArea;
