import React from 'react';
import PropTypes from 'prop-types';
import {View} from '../basicComponents';
import {StyleSheet} from 'react-native';
import {InfiniteScroll} from '../../components';
import {stylesScheme} from '../../schemas/common';
import {checkboxStyles} from '../../vars/enums';
import dataConverters from './dataConverters';
import ListMenuItem from './listMenuItem';
import listSchema from './schema';

const {listMenuItemSchema, listMenuQuerySchema} = listSchema;

const styles = StyleSheet.create({
  listMenuWrapper: {
    paddingHorizontal: 0,
  },
});

const checkSelectedItem = (itemId, selectedIds) =>
  !!(selectedIds.length && selectedIds.includes(itemId));

class ListMenu extends React.Component {
  render() {
    const {
      items,
      isSelectable,
      listStyle,
      query,
      selectedIds,
      checkboxStyle,
    } = this.props;
    const {onItemClick} = this;
    const {reducerStatePath, apiQuery, extraTopComponentsData = null} = {
      ...query,
    };

    return (
      <View style={[styles.listMenuWrapper, listStyle]}>
        {query ? (
          <InfiniteScroll
            reducerStatePath={reducerStatePath}
            apiQuery={apiQuery}
            ListItemComponent={({data}) => this.buildListMenuItem({data})}
            extraTopComponent={this.buildExtraItems({
              data: extraTopComponentsData,
            })}
          />
        ) : (
          items.map((item, index) => {
            const {text, icon, rightSideIcon, id, data, itemsCount} = item;

            return (
              <ListMenuItem
                key={id}
                checkboxStyle={checkboxStyle}
                text={text}
                icon={icon}
                rightSideIcon={rightSideIcon}
                id={id}
                data={data}
                count={itemsCount}
                onItemClick={onItemClick}
                index={index}
                isSelectable={!isSelectable ? false : isSelectable !== false}
                isSelected={checkSelectedItem(item.id, selectedIds)}
              />
            );
          })
        )}
      </View>
    );
  }

  buildExtraItems = ({data: itemsData}) => {
    if (!itemsData) return null;

    if (Array.isArray(itemsData)) {
      return (
        <React.Fragment>
          {itemsData.map((item) => this.buildListMenuItem({data: item}))}
        </React.Fragment>
      );
    } else {
      return this.buildListMenuItem({data: itemsData});
    }
  };

  buildListMenuItem = ({data: itemData = {}}) => {
    const {
      isSelectable,
      query: {adjustQueryItemData},
      selectedIds,
      checkboxStyle,
    } = this.props;
    const {onItemClick} = this;

    const dataConverter =
      adjustQueryItemData || dataConverters.defaultConverter;
    const adjustedData = dataConverter({data: itemData});
    const {
      text,
      icon,
      id,
      rightSideIcon,
      data,
      index,
      type,
      withBorder,
      itemsCount,
    } = adjustedData;

    return (
      <ListMenuItem
        checkboxStyle={checkboxStyle}
        text={text}
        icon={icon}
        id={id}
        rightSideIcon={rightSideIcon}
        data={data}
        count={itemsCount}
        index={index}
        type={type}
        withBorder={withBorder}
        onItemClick={onItemClick}
        isSelectable={!isSelectable ? false : isSelectable !== false}
        isSelected={checkSelectedItem(id, selectedIds)}
      />
    );
  };

  onItemClick = ({id, isSelectable, data}) => {
    const {
      onSelect,
      onClick,
      isMultiSelect,
      isUnselectDisabled,
      selectedIds,
    } = this.props;
    let statusSelected = true;
    let ids = [...selectedIds];

    if (isSelectable) {
      if (ids.includes(id)) {
        if (!isUnselectDisabled) {
          ids = ids.filter((_id) => _id !== id);
          statusSelected = false;
        }
      } else {
        ids.push(id);
      }

      if (!isMultiSelect) {
        ids = ids.filter((_id) => id === _id);
      }
    }

    onSelect &&
      onSelect({
        allSelected: ids,
        selected: id,
        status: statusSelected,
        id,
        data,
      });

    onClick && onClick({id, data});
  };
}

ListMenu.defaultProps = {
  items: [],
  isSelectable: false,
  isMultiSelect: false,
  listStyle: {},
  isUnselectDisabled: true,
};

ListMenu.propTypes = {
  onClick: PropTypes.func,
  onSelect: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.shape(listMenuItemSchema)),
  selectedIds: PropTypes.arrayOf(PropTypes.string),
  isSelectable: PropTypes.bool,
  isMultiSelect: PropTypes.bool,
  listStyle: stylesScheme,
  query: listMenuQuerySchema,
  isUnselectDisabled: PropTypes.bool,
  checkboxStyle: PropTypes.oneOf(Object.values(checkboxStyles)),
};

export default ListMenu;
