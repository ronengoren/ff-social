import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {View, Text} from '../basicComponents';
import {flipFlopColors} from '../../vars';
import {stylesScheme} from '../../schemas';

const styles = StyleSheet.create({
  container: {
    backgroundColor: flipFlopColors.paleBlack,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const OverlayText = ({text, borderRadius, style}) => (
  <View
    style={[
      StyleSheet.absoluteFill,
      styles.container,
      borderRadius && {borderRadius},
      style,
    ]}>
    <Text size={20} color={flipFlopColors.white}>
      {text}
    </Text>
  </View>
);

OverlayText.propTypes = {
  text: PropTypes.string,
  borderRadius: PropTypes.number,
  style: stylesScheme,
};

export default OverlayText;
