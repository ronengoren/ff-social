import {StyleSheet} from 'react-native';
import {flipFlopColors} from '../vars';

const commonStyles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  textAlignCenter: {
    textAlign: 'center',
  },
  shadow: {
    backgroundColor: flipFlopColors.white,
    shadowColor: flipFlopColors.boxShadow,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 4,
  },
  smallShadow: {
    shadowColor: flipFlopColors.boxShadow,
    shadowRadius: 8,
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
  },
  tinyShadow: {
    shadowColor: flipFlopColors.boxShadow,
    shadowRadius: 5,
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 2,
  },
  newSmallShadow: {
    shadowColor: flipFlopColors.boxShadowDarker,
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  textShadow: {
    textShadowColor: flipFlopColors.realBlack20,
    textShadowOffset: {width: 0, height: 3},
    textShadowRadius: 5,
  },
  greenBtnShadow: {
    shadowColor: flipFlopColors.green,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    elevation: 2,
  },
});

export default commonStyles;
