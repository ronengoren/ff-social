import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Checkbox, Text} from '../basicComponents';
import {flipFlopColors} from '../../vars';
import {ListMenuItem} from '../../components/listMenu';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 65,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: flipFlopColors.b90,
  },
  checkbox: {
    marginRight: 15,
  },
});

class FilterRow extends Component {
  static rowStyles = {
    default: 'default',
    extended: 'extended',
  };

  render() {
    const {
      index,
      action,
      isActive,
      text,
      data,
      selectedItems,
      ignoredItems,
      rowStyle,
    } = this.props;
    if (ignoredItems && ignoredItems.includes(data.id)) {
      return null;
    }

    let adjustedAction = action;
    let isActiveAdjusted = isActive;
    let adjustedText = text;
    if (data) {
      adjustedAction = () => action({id: data.id, name: data.name});
      isActiveAdjusted =
        selectedItems.findIndex((item) => item === data.id) > -1;
      adjustedText = data.name;
    }
    const listMenuItemId = data ? data.id : text;

    return rowStyle === FilterRow.rowStyles.extended ? (
      <ListMenuItem
        onItemClick={() => adjustedAction()}
        text={adjustedText}
        isSelectable
        id={listMenuItemId}
        isSelected={isActiveAdjusted}
      />
    ) : (
      <TouchableOpacity
        onPress={adjustedAction}
        activeOpacity={0.5}
        style={[styles.wrapper, !!index && styles.borderTop]}>
        <Checkbox
          value={isActiveAdjusted}
          size="small"
          selectedBackgroundColor={flipFlopColors.green}
          style={styles.checkbox}
        />
        <Text size={16} lineHeight={20} color={flipFlopColors.b30}>
          {adjustedText}
        </Text>
      </TouchableOpacity>
    );
  }
}

FilterRow.defaultProps = {
  rowStyle: FilterRow.rowStyles.default,
  selectedItems: [],
};

FilterRow.propTypes = {
  index: PropTypes.number,
  action: PropTypes.func,
  isActive: PropTypes.bool,
  text: PropTypes.string,
  data: PropTypes.object,
  selectedItems: PropTypes.array,
  ignoredItems: PropTypes.array,
  rowStyle: PropTypes.oneOf(Object.values(FilterRow.rowStyles)),
};

export default FilterRow;
