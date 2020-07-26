import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {View} from '../../../components/basicComponents';
import {HomeisIcon} from '../../../assets/icons';
import {flipFlopColors} from '../../../vars';
import {stylesScheme} from '../../../schemas';
import {isShortDevice} from '../../../infra/utils/deviceUtils';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 21,
    paddingHorizontal: 15,
  },
  statusLine: {
    flex: 1,
    height: 1,
    backgroundColor: flipFlopColors.b70,
    marginHorizontal: 3,
  },
  activeScreen: {
    backgroundColor: flipFlopColors.green,
  },
});

function OnBoardingProgressBar({step, style, backgroundColor}) {
  if (isShortDevice) {
    return null;
  }

  return (
    <View style={[styles.container, style, {backgroundColor}]}>
      <HomeisIcon
        name="progress-bar-1"
        size={24}
        color={flipFlopColors.green}
      />
      <View style={[styles.statusLine, step > 1 && styles.activeScreen]} />
      <HomeisIcon
        name="progress-bar-2"
        size={24}
        color={step > 1 ? flipFlopColors.green : flipFlopColors.b70}
      />
      <View style={[styles.statusLine, step > 2 && styles.activeScreen]} />
      <HomeisIcon
        name="progress-bar-3"
        size={24}
        color={step > 2 ? flipFlopColors.green : flipFlopColors.b70}
      />
    </View>
  );
}

OnBoardingProgressBar.defaultProps = {
  step: 1,
  backgroundColor: flipFlopColors.white,
};

OnBoardingProgressBar.propTypes = {
  step: PropTypes.number,
  style: stylesScheme,
  backgroundColor: PropTypes.string,
};

export default OnBoardingProgressBar;
