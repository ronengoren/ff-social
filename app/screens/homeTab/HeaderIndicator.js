import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {View, Text} from '../../components/basicComponents';
import {AwesomeIcon} from '../../assets/icons';
import {flipFlopColors, uiConstants} from '../../vars';

const styles = StyleSheet.create({
  counterWrapper: {
    position: 'absolute',
    top: -6,
    start: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
    width: 26,
    paddingHorizontal: 3,
    borderRadius: 12,
    shadowRadius: 5,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },
  counterText: {
    textAlign: 'center',
    color: flipFlopColors.white,
    letterSpacing: -1,
  },
});

const MAX_COUNT = 999;
function HeaderIndicator({
  iconName,
  action,
  count,
  badgeColor,
  iconColor,
  testID,
}) {
  const badge = (
    <View
      style={[
        styles.counterWrapper,
        {shadowColor: badgeColor, backgroundColor: badgeColor},
      ]}>
      <Text
        size={count > MAX_COUNT ? 7 : 10}
        lineHeight={12}
        bold
        style={styles.counterText}>
        {count > MAX_COUNT ? `${MAX_COUNT}+` : count}
      </Text>
    </View>
  );

  return (
    <TouchableOpacity
      onPress={action}
      activeOpacity={0.75}
      testID={testID}
      hitSlop={uiConstants.BTN_HITSLOP_15}>
      <AwesomeIcon
        name={iconName}
        size={26}
        color={iconColor}
        weight="light"
        style={styles.upperIcon}
      />
      {!!count && badge}
    </TouchableOpacity>
  );
}

HeaderIndicator.propTypes = {
  action: PropTypes.func,
  count: PropTypes.number,
  iconName: PropTypes.string,
  badgeColor: PropTypes.string,
  testID: PropTypes.string,
  iconColor: PropTypes.string,
};

HeaderIndicator.defaultProps = {
  iconColor: flipFlopColors.b30,
  badgeColor: flipFlopColors.transparent,
};

export default HeaderIndicator;
