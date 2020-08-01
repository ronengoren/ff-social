import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from '../basicComponents';
import {AwesomeIcon} from '../../assets/icons';
import {flipFlopColors, commonStyles} from '../../vars';
import {isNil} from '../../infra/utils';
import {isRTL} from '../../infra/utils/stringUtils';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    marginLeft: 5,
  },
  rtlStyle: {
    textAlign: 'right',
  },
});

class DummyTextInput extends Component {
  render() {
    const {
      onPress,
      minHeight,
      style,
      textStyle,
      text,
      placeholder,
      testID,
      withArrowCTA,
      forceLTR,
    } = this.props;
    const isRtl = !forceLTR && isRTL(text || placeholder);
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={onPress}
        style={[styles.wrapper, {minHeight}, style]}>
        <Text
          style={[
            {minHeight},
            isRtl && styles.rtlStyle,
            commonStyles.flex1,
            textStyle,
          ]}
          color={text ? flipFlopColors.realBlack : flipFlopColors.b60}
          alignLocale
          testID={testID}>
          {!isNil(text) && text.toString() ? text : placeholder}
        </Text>
        {withArrowCTA && (
          <AwesomeIcon
            name="chevron-right"
            color={flipFlopColors.b60}
            size={16}
            weight="light"
            style={styles.icon}
          />
        )}
      </TouchableOpacity>
    );
  }
}

DummyTextInput.propTypes = {
  onPress: PropTypes.func,
  minHeight: PropTypes.number,
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array,
    PropTypes.object,
  ]),
  textStyle: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array,
    PropTypes.object,
  ]),
  text: PropTypes.string,
  placeholder: PropTypes.string,
  testID: PropTypes.string,
  withArrowCTA: PropTypes.bool,
  forceLTR: PropTypes.bool,
};

DummyTextInput.defaultProps = {
  minHeight: 160,
  withArrowCTA: false,
};

export default DummyTextInput;
