import React from 'react';
import {StyleSheet} from 'react-native';
import {View} from '../basicComponents';
import {flipFlopColors} from '../../vars';

const styles = StyleSheet.create({
  separator: {
    height: 10,
    width: '100%',
    backgroundColor: flipFlopColors.fillGrey,
    borderWidth: 1,
    borderColor: flipFlopColors.disabledGrey,
  },
});

const FormSectionSeparator = () => <View style={styles.separator} />;

export default FormSectionSeparator;
