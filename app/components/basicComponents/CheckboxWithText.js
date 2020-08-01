import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {View, Checkbox, Text} from '../basicComponents';
import {flipFlopColors} from '../../vars';
import {isRTL} from '../../infra/utils/stringUtils';

const styles = StyleSheet.create({
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  rtlCheckboxWrapper: {
    flexDirection: 'row-reverse',
  },
  checkbox: {
    marginRight: 10,
  },
  rtlCheckbox: {
    marginRight: 0,
    marginLeft: 10,
  },
});

class CheckboxWithText extends Component {
  render() {
    const {style, action, text, value, selectedBackgroundColor} = this.props;
    const isRtl = isRTL(text);
    return (
      <View
        style={[
          styles.checkboxWrapper,
          isRtl && styles.rtlCheckboxWrapper,
          style,
        ]}>
        <Checkbox
          onChange={action}
          size="small"
          style={[styles.checkbox, isRtl && styles.rtlCheckbox]}
          value={value}
          selectedBackgroundColor={selectedBackgroundColor}
        />
        <Text onPress={action} size={16} lineHeight={22} alignLocale>
          {text}
        </Text>
      </View>
    );
  }
}

CheckboxWithText.propTypes = {
  style: PropTypes.object,
  action: PropTypes.func,
  text: PropTypes.string,
  value: PropTypes.string,
  selectedBackgroundColor: PropTypes.string,
};

CheckboxWithText.defaultProps = {
  selectedBackgroundColor: flipFlopColors.green,
};

export default CheckboxWithText;
