import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {AwesomeIcon} from '../../../assets/icons';
import {Text, Checkbox, View} from '../../../components/basicComponents';
import {flipFlopColors} from '../../../vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 75,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 15,
    borderWidth: 1,
    borderColor: flipFlopColors.b70,
    borderRadius: 10,
    backgroundColor: flipFlopColors.white,
    overflow: 'hidden',
  },
  selectedContainer: {
    borderColor: flipFlopColors.green,
  },
  checkbox: {
    marginRight: 15,
    borderColor: flipFlopColors.green,
    backgroundColor: flipFlopColors.white,
  },
  topicName: {
    flex: 1,
    marginRight: 10,
  },
  iconWrapper: {
    width: 45,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class SuggestedTopicItem extends React.Component {
  render() {
    const {
      topic: {name, iconName, themeColor},
      isSelected,
      testID,
    } = this.props;
    return (
      <TouchableOpacity
        onPress={this.toggleSelection}
        activeOpacity={0.5}
        style={[styles.container, isSelected && styles.selectedContainer]}
        testID={testID}>
        <Checkbox
          value={isSelected}
          size="smallSquare"
          style={styles.checkbox}
        />
        <Text
          size={16}
          lineHeight={19}
          color={flipFlopColors.b30}
          style={styles.topicName}
          numberOfLines={1}
          forceLTR>
          {name}
        </Text>
        {!!iconName && (
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: themeColor
                  ? `#${themeColor}`
                  : flipFlopColors.green,
              },
            ]}>
            <AwesomeIcon
              name={iconName}
              size={22}
              weight="solid"
              color={flipFlopColors.white}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  }

  toggleSelection = () => {
    const {
      topic: {id},
      toggleSelection,
    } = this.props;
    toggleSelection({topicId: id});
  };
}

SuggestedTopicItem.propTypes = {
  topic: PropTypes.object,
  isSelected: PropTypes.bool,
  toggleSelection: PropTypes.func,
  testID: PropTypes.string,
};

export default SuggestedTopicItem;
