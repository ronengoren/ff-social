import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from '../basicComponents';
import PropTypes from 'prop-types';
import {flipFlopColors} from '../../vars';

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: flipFlopColors.black,
    paddingTop: 10,
    paddingBottom: 17,
  },
});

const FormTitle = ({children}) => (
  <Text style={styles.text} medium>
    {children}
  </Text>
);

FormTitle.propTypes = {
  children: PropTypes.string,
};

export default FormTitle;
