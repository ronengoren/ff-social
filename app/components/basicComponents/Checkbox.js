import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {View} from '../basicComponents';
import {AwesomeIcon} from '../../assets/icons';
import {flipFlopColors} from '../../vars';
import {stylesScheme} from '../../schemas';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: flipFlopColors.b90,
    backgroundColor: flipFlopColors.paleGreyTwo,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  smallSquare: {
    width: 23,
    height: 23,
    borderRadius: 5,
    borderColor: flipFlopColors.b80,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  small: {
    width: 25,
    height: 25,
    borderRadius: 8,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  medium: {
    width: 30,
    height: 30,
    borderRadius: 13,
  },
  disabled: {
    borderColor: flipFlopColors.disabledGrey,
    backgroundColor: flipFlopColors.disabledGrey,
  },
});

const HIT_SLOP = {top: 10, left: 10, bottom: 10, right: 10};

class Checkbox extends React.Component {
  render() {
    const {
      value,
      onChange,
      size,
      disabled,
      style,
      selectedBackgroundColor,
      testID,
    } = this.props;
    const backgroundColor =
      value && (selectedBackgroundColor || flipFlopColors.green);
    const compiledStyle = [
      styles.container,
      styles[size],
      style,
      value && {backgroundColor, borderColor: backgroundColor},
      disabled && styles.disabled,
    ];
    const icon = value ? (
      <AwesomeIcon
        name="check"
        size={15}
        weight="solid"
        color={flipFlopColors.white}
      />
    ) : null;
    if (onChange) {
      return (
        <TouchableOpacity
          onPress={
            !disabled ? () => onChange({value: !value, isValid: true}) : null
          }
          activeOpacity={0.5}
          style={compiledStyle}
          hitSlop={HIT_SLOP}
          testID={testID}>
          {icon}
        </TouchableOpacity>
      );
    }
    return <View style={compiledStyle}>{icon}</View>;
  }
}

Checkbox.defaultProps = {
  value: false,
  onChange: null,
  size: 'medium',
  disabled: false,
  selectedBackgroundColor: flipFlopColors.green,
};

Checkbox.propTypes = {
  value: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  style: stylesScheme,
  size: PropTypes.oneOf(['smallSquare', 'small', 'medium']),
  selectedBackgroundColor: PropTypes.string,
  testID: PropTypes.string,
};

export default Checkbox;
