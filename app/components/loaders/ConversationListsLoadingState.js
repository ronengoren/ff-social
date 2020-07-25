import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {View, PlaceholderRectangle} from '../basicComponents';
import {flipFlopColors} from '../../vars';

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    height: 90,
    alignItems: 'center',
    marginHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: flipFlopColors.veryLightPink,
  },
  placeholders: {
    marginTop: 6,
  },
});

class ConversationListsLoadingState extends Component {
  static renderPlaceholderItem() {
    return (
      <View style={[styles.itemContainer]}>
        <PlaceholderRectangle
          width={55}
          height={55}
          borderRadius={40}
          marginBottom={0}
          marginRight={15}
        />
        <View style={styles.placeholders}>
          <PlaceholderRectangle
            width={100}
            height={14}
            borderRadius={8}
            marginBottom={10}
            marginRight={0}
          />
          <PlaceholderRectangle
            width={130}
            height={14}
            borderRadius={8}
            marginBottom={10}
            marginRight={0}
          />
          <PlaceholderRectangle
            width={80}
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
    return React.Children.toArray(
      Array.from({length: 10}).map(
        ConversationListsLoadingState.renderPlaceholderItem,
      ),
    );
  }
}

export default ConversationListsLoadingState;
