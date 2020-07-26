import React from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {View} from '../basicComponents';
import {flipFlopColors} from '../../vars';

const styles = StyleSheet.create({
  container: {
    backgroundColor: flipFlopColors.white,
    borderColor: flipFlopColors.disabledGrey,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
});

const FormSection = ({children, style}) => (
  <View style={[styles.container, style]}>{children}</View>
);

FormSection.propTypes = {
  children: PropTypes.node,
  style: PropTypes.number,
};

export default FormSection;
