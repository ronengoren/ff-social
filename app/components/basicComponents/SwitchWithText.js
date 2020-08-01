import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {View, Switch, Text} from '../basicComponents';
import {flipFlopColors} from '../../vars';
import {isRTL} from '../../infra/utils/stringUtils';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 15,
  },
  contents: {
    flex: 1,
    paddingRight: 10,
  },
  header: {
    marginBottom: 4,
  },
  rtlStyle: {
    textAlign: 'right',
  },
});

class SwitchWithText extends Component {
  render() {
    const {
      style,
      header,
      subHeader,
      onChange,
      onPress,
      active,
      forceLTR,
    } = this.props;

    const isRtl = !forceLTR && isRTL(header || subHeader);
    return (
      <View style={[styles.wrapper, style]}>
        {isRtl && (
          <Switch
            forceRTL={isRtl}
            onChange={onChange}
            onPress={onPress}
            active={active}
            activeColor={flipFlopColors.green}
          />
        )}
        <View style={styles.contents}>
          {!!header && (
            <Text
              size={16}
              lineHeight={19}
              color={flipFlopColors.b60}
              style={[styles.header, isRtl && styles.rtlStyle]}>
              {header}
            </Text>
          )}
          {!!subHeader && (
            <Text
              size={header ? 13 : 16}
              lineHeight={19}
              color={flipFlopColors.b60}
              style={isRtl && styles.rtlStyle}>
              {subHeader}
            </Text>
          )}
        </View>
        {!isRtl && (
          <Switch
            onChange={onChange}
            onPress={onPress}
            active={active}
            activeColor={flipFlopColors.green}
          />
        )}
      </View>
    );
  }
}

SwitchWithText.propTypes = {
  style: PropTypes.object,
  header: PropTypes.string,
  subHeader: PropTypes.string,
  onChange: PropTypes.func,
  active: PropTypes.bool,
  onPress: PropTypes.func,
  forceLTR: PropTypes.bool,
};

export default SwitchWithText;
