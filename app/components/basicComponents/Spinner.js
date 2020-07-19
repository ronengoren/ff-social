import React from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  content: {
    padding: 50,
  },
  centeredContent: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

const Spinner = ({center, color = 'black', ...props}) => (
  <ActivityIndicator
    animating
    style={!center ? styles.content : styles.centeredContent}
    color={color}
    {...props}
  />
);

Spinner.propTypes = {
  center: PropTypes.bool,
  color: PropTypes.string,
};

export default Spinner;
