import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {View, PlaceholderRectangle} from '../basicComponents';

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 70,
    padding: 15,
  },
});

class NotificationsLoadingState extends Component {
  static renderPlaceholderItem(key) {
    return (
      <View style={styles.itemContainer} key={key}>
        <PlaceholderRectangle
          width={55}
          height={55}
          borderRadius={40}
          marginBottom={0}
          marginRight={15}
        />
        <View>
          <PlaceholderRectangle
            width={170}
            height={15}
            borderRadius={8}
            marginBottom={10}
            marginRight={0}
          />
          <PlaceholderRectangle
            width={100}
            height={12}
            borderRadius={8}
            marginBottom={0}
            marginRight={0}
          />
        </View>
      </View>
    );
  }

  render() {
    const placeholderItems = [];
    for (let i = 0; i < 10; i += 1) {
      placeholderItems.push(NotificationsLoadingState.renderPlaceholderItem(i));
    }
    return placeholderItems;
  }
}

export default NotificationsLoadingState;
