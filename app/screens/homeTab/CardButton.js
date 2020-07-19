import React, {Component} from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../../constants/Colors';
import Constants from '../../constants/Constants';

class CardButton extends Component<Props> {
  render() {
    return (
      <TouchableOpacity activeOpacity={0.5} style={styles.container}>
        <Text adjustsFontSizeToFit numberOfLines={1} style={styles.item}></Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BLUE_DARK,
    borderColor: Colors.BLACK,
    margin: 1,
  },
  item: {
    color: Colors.BLACK,
    fontSize: 20 * (Constants.maxDimension / Constants.baseMaxDimension),
    fontFamily: 'AvenirNext-Regular',
  },
});

export default CardButton;
