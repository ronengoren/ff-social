import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {View} from '../basicComponents';
import {flipFlopColors} from '../../vars';

const styles = StyleSheet.create({
  container: {
    width: 0,
    height: 0,
    backgroundColor: flipFlopColors.transparent,
    borderStyle: 'solid',
  },
});

const Triangle = ({style, direction, width, height, color}) => {
  const getBorderStyles = () => {
    switch (direction) {
      case 'up':
        return {
          borderTopWidth: 0,
          borderRightWidth: width / 2.0,
          borderBottomWidth: height,
          borderLeftWidth: width / 2.0,
          borderTopColor: flipFlopColors.transparent,
          borderRightColor: flipFlopColors.transparent,
          borderBottomColor: color,
          borderLeftColor: flipFlopColors.transparent,
        };
      case 'right':
        return {
          borderTopWidth: height / 2.0,
          borderRightWidth: 0,
          borderBottomWidth: height / 2.0,
          borderLeftWidth: width,
          borderTopColor: flipFlopColors.transparent,
          borderRightColor: flipFlopColors.transparent,
          borderBottomColor: flipFlopColors.transparent,
          borderLeftColor: color,
        };
      case 'down':
        return {
          borderTopWidth: height,
          borderRightWidth: width / 2.0,
          borderBottomWidth: 0,
          borderLeftWidth: width / 2.0,
          borderTopColor: color,
          borderRightColor: flipFlopColors.transparent,
          borderBottomColor: flipFlopColors.transparent,
          borderLeftColor: flipFlopColors.transparent,
        };
      case 'left':
        return {
          borderTopWidth: height / 2.0,
          borderRightWidth: width,
          borderBottomWidth: height / 2.0,
          borderLeftWidth: 0,
          borderTopColor: flipFlopColors.transparent,
          borderRightColor: color,
          borderBottomColor: flipFlopColors.transparent,
          borderLeftColor: flipFlopColors.transparent,
        };
      case 'up-left':
        return {
          borderTopWidth: height,
          borderRightWidth: width,
          borderBottomWidth: 0,
          borderLeftWidth: 0,
          borderTopColor: color,
          borderRightColor: flipFlopColors.transparent,
          borderBottomColor: flipFlopColors.transparent,
          borderLeftColor: flipFlopColors.transparent,
        };
      case 'up-right':
        return {
          borderTopWidth: 0,
          borderRightWidth: width,
          borderBottomWidth: height,
          borderLeftWidth: 0,
          borderTopColor: flipFlopColors.transparent,
          borderRightColor: color,
          borderBottomColor: flipFlopColors.transparent,
          borderLeftColor: flipFlopColors.transparent,
        };
      case 'down-left':
        return {
          borderTopWidth: height,
          borderRightWidth: 0,
          borderBottomWidth: 0,
          borderLeftWidth: width,
          borderTopColor: flipFlopColors.transparent,
          borderRightColor: flipFlopColors.transparent,
          borderBottomColor: flipFlopColors.transparent,
          borderLeftColor: color,
        };
      case 'down-right':
        return {
          borderTopWidth: 0,
          borderRightWidth: 0,
          borderBottomWidth: height,
          borderLeftWidth: width,
          borderTopColor: flipFlopColors.transparent,
          borderRightColor: flipFlopColors.transparent,
          borderBottomColor: color,
          borderLeftColor: flipFlopColors.transparent,
        };
      default:
        return {};
    }
  };

  const borderStyles = getBorderStyles();
  return <View style={[styles.container, borderStyles, style]} />;
};

Triangle.propTypes = {
  direction: PropTypes.oneOf([
    'up',
    'right',
    'down',
    'left',
    'up-right',
    'up-left',
    'down-right',
    'down-left',
  ]),
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
};

Triangle.defaultProps = {
  direction: 'up',
  width: 0,
  height: 0,
  color: flipFlopColors.white,
};

export default Triangle;
