import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {flipFlopColors} from '../../vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: flipFlopColors.paleGreyTwo,
  },
});
class SolutionsHome extends React.Component {
  render() {
    return <View style={styles.container}></View>;
  }
}

export default SolutionsHome;
