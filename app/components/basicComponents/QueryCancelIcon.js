import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {AwesomeIcon} from '../../assets/icons';
import {flipFlopColors} from '../../vars';
import {stylesScheme} from '../../schemas';

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    right: 8,
  },
});

const QueryCancelIcon = ({
  style,
  onPress,
  size,
  iconName,
  iconColor,
  iconWeight,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.wrapper, style]}
    activeOpacity={1}>
    <AwesomeIcon
      name={iconName}
      size={size}
      color={iconColor}
      weight={iconWeight}
    />
  </TouchableOpacity>
);

QueryCancelIcon.defaultProps = {
  size: 14,
  iconColor: flipFlopColors.b60,
  iconName: 'times-circle',
  iconWeight: 'solid',
};

QueryCancelIcon.propTypes = {
  style: stylesScheme,
  onPress: PropTypes.func,
  size: PropTypes.number,
  iconName: PropTypes.string,
  iconColor: PropTypes.string,
  iconWeight: PropTypes.string,
};

export default QueryCancelIcon;
