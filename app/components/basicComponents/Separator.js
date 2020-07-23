import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {View} from '../basicComponents';
import {flipFlopColors} from '../../vars';
import {stylesScheme} from '../../schemas';

const styles = StyleSheet.create({
  container: {
    height: 10,
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: flipFlopColors.b90,
    backgroundColor: flipFlopColors.fillGrey,
  },
});

const Separator = ({height, style}) => (
  <View
    style={[styles.container, style, typeof height !== 'undefined' && {height}]}
  />
);

Separator.propTypes = {
  height: PropTypes.number,
  style: stylesScheme,
};

export default Separator;
