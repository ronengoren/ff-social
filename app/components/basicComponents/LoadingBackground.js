import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {View, Spinner} from '../basicComponents';
import {flipFlopColors} from '../../vars';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const LoadingBackground = ({
  height,
  width,
  backgroundColor = flipFlopColors.paleGreyTwo,
  borderRadius,
}) => (
  <View
    style={[
      !height && StyleSheet.absoluteFill,
      styles.container,
      {height, width, backgroundColor, borderRadius},
    ]}>
    <Spinner />
  </View>
);

LoadingBackground.propTypes = {
  borderRadius: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  backgroundColor: PropTypes.string,
};

export default LoadingBackground;
