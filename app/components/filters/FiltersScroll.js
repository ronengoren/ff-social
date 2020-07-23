import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import I18n from '../../infra/localization';
import {View, Text, IconButton, ScrollView, Chip} from '../basicComponents';
import {AwesomeIcon} from '../../assets/icons';
import {flipFlopColors} from '../../vars';
import {filterTypes} from '../../vars/enums';
import {getDayAndMonth} from '../../infra/utils/dateTimeUtils';
import {remove} from '../../infra/utils';
import {stylesScheme} from '../../schemas';
import Filter from './Filter';
import AgeFilter from './AgeFilter';

const styles = StyleSheet.create({
  filtersWrapper: {
    alignItems: 'center',
    paddingBottom: 5,
  },
  filterByText: {
    marginLeft: 15,
    marginRight: 10,
  },
  filterStyle: {
    borderRadius: 18,
    marginRight: 10,
  },
  activeFilterStyle: {
    backgroundColor: flipFlopColors.white,
    borderColor: flipFlopColors.green,
  },
  filterTextStyle: {
    fontSize: 13,
    lineHeight: 34,
  },
  activeFilterTextStyle: {
    color: flipFlopColors.green,
  },
  caretIcon: {
    marginLeft: 7,
    lineHeight: 34,
  },
  clearIcon: {
    height: 32,
    marginRight: -10,
  },
});

class FiltersScroll extends React.Component {
  constructor(props) {
    super(props);
    const {initialFilters, filterDefinitions} = props;
    this.state = {
      filterDefinitions,
      filters: initialFilters,
      activeFilter: '',
    };
  }

  render() {
    const {hoodsParams, maxPrice, postType, postSubType, style} = this.props;
    const {filterDefinitions, filters, activeFilter} = this.state;
    const content = filterDefinitions.map((filterName) => {
      const isActive =
        !!filters[filterName] ||
        (filterName === filterTypes.AGE &&
          (filters.minAge || filters.maxAge)) ||
        (filterName === filterTypes.RECENTLY_JOINED &&
          (filters.minCreatedAt || filters.maxCreatedAt));
      const afterComponent = isActive ? (
        <IconButton
          name="times-circle"
          isAwesomeIcon
          weight="solid"
          iconSize={14}
          iconColor="green"
          style={styles.clearIcon}
          onPress={() => this.clearCurrentFilter({filterName})}
        />
      ) : (
        <AwesomeIcon
          name="caret-down"
          size={14}
          color={flipFlopColors.b30}
          style={styles.caretIcon}
          weight="solid"
        />
      );
      return (
        <Chip
          key={filterName}
          onPress={() => this.setState({activeFilter: filterName})}
          style={[styles.filterStyle, isActive && styles.activeFilterStyle]}
          textStyle={[
            styles.filterTextStyle,
            isActive && styles.activeFilterTextStyle,
          ]}
          isBold
          afterTextComponent={afterComponent}>
          {this.getFilterName({filterName})}
        </Chip>
      );
    });
    return (
      <View style={style}>
        <ScrollView
          contentContainerStyle={styles.filtersWrapper}
          horizontal
          showsHorizontalScrollIndicator={false}>
          <Text
            size={13}
            lineHeight={15}
            color={flipFlopColors.b30}
            bold
            style={styles.filterByText}>
            {I18n.t('filters.title')}
          </Text>
          {content}
        </ScrollView>
        {!!activeFilter && (
          <Filter
            filter={filters[activeFilter]}
            filterType={activeFilter}
            minAge={filters.minAge}
            maxAge={filters.maxAge}
            maxPrice={maxPrice}
            postType={postType}
            postSubType={postSubType}
            hoodsFromSearch={filters.hoodsFromSearch}
            applyFilter={this.applyFilter}
            clearFilter={this.clearCurrentFilter}
            closeFilter={() => this.setState({activeFilter: ''})}
            hoodsParams={hoodsParams}
            neighborhoodsIds={filters.neighborhoodsIds}
            hoodNames={filters.hoodNames}
          />
        )}
      </View>
    );
  }

  getFilterName = ({filterName}) => {
    const {filters} = this.state;
    if (!filters[filterName]) {
      if (
        filterName === filterTypes.AGE &&
        (filters.minAge || filters.maxAge)
      ) {
        return `${I18n.t(`filters.age.header`)}: ${
          filters.minAge || AgeFilter.values.min
        } - ${filters.maxAge || AgeFilter.values.max}`;
      }
      return I18n.t(`filters.${filterName}.header`);
    }
    switch (filterName) {
      case filterTypes.RELATIONSHIP_STATUS: {
        let text = I18n.t(
          `filters.relationshipStatuses.${filters[filterName][0]}`,
        );
        text +=
          filters[filterName].length > 1
            ? `, ${I18n.t(
                `filters.relationshipStatuses.${filters[filterName][1]}`,
              )}`
            : '';
        text +=
          filters[filterName].length > 2
            ? `, +${filters[filterName].length - 2} ${I18n.t(`filters.more`)}`
            : '';
        return text;
      }
      case filterTypes.GENDER: {
        return filters[filterName].map(
          (filter, index) =>
            `${I18n.t(`filters.genders.${filter}`)}${
              index + 1 < filters[filterName].length ? ', ' : ''
            }`,
        );
      }
      case filterTypes.FRIENDSHIP_STATUS: {
        return filters[filterName].map(
          (filter, index) =>
            `${I18n.t(`filters.friendshipStatuses.${filter}`)}${
              index + 1 < filters[filterName].length ? ', ' : ''
            }`,
        );
      }
      case filterTypes.PRICE: {
        return `${I18n.t(`filters.price.header`)}: ${
          filters.price.currentMin || filters.price.minValue
        } - ${filters.price.currentMax || filters.price.maxValue}`;
      }
      case filterTypes.ROOMS: {
        return `${I18n.t(`filters.rooms.header`)}: ${filters.rooms}+`;
      }
      case filterTypes.HOODS: {
        return `${filters.hoodNames[0]}${
          filters.hoodNames.length > 1
            ? `, +${filters.hoodNames.length - 1} ${I18n.t(`filters.more`)}`
            : ''
        }`;
      }
      case filterTypes.DATES: {
        return `${I18n.t('filters.dates.from')} ${getDayAndMonth(
          filters.dates.startDate,
        )}${
          filters.dates.endDate
            ? ` ${I18n.t('filters.dates.to')} ${getDayAndMonth(
                filters.dates.endDate,
              )}`
            : ''
        }`;
      }
      case filterTypes.LISTING_TYPE: {
        return filters.translatedTag;
      }
      default: {
        return filterName;
      }
    }
  };

  applyFilter = (filter) => {
    const {resetAction, applyAction} = this.props;
    const {filters} = this.state;
    resetAction();
    this.setState({filters: {...filters, ...filter}, activeFilter: ''}, () =>
      applyAction(this.state.filters),
    );
  };

  clearCurrentFilter = ({filterName}) => {
    const {resetAction, applyAction} = this.props;
    const {filters, activeFilter, filterDefinitions} = this.state;
    resetAction();
    const filter = activeFilter || filterName;
    const newState = {
      activeFilter: '',
      filters: {...filters, [filter]: null},
      filterDefinitions,
    };
    if (filter === filterTypes.AGE) {
      newState.filters.minAge = null;
      newState.filters.maxAge = null;
    }
    if (filter === filterTypes.HOODS) {
      newState.filters.hoodsFromSearch = null;
      newState.filters.hoodNames = null;
      newState.filters.neighborhoodsIds = null;
    }
    if (filter === filterTypes.RECENTLY_JOINED) {
      newState.filterDefinitions = remove(
        [...newState.filterDefinitions],
        (f) => f !== filter,
      );
      newState.filters.minCreatedAt = null;
      newState.filters.maxCreatedAt = null;
    }
    this.setState({...newState}, () => applyAction(this.state.filters));
  };
}

FiltersScroll.defaultProps = {
  initialFilters: {},
};

FiltersScroll.propTypes = {
  filterDefinitions: PropTypes.array,
  applyAction: PropTypes.func,
  resetAction: PropTypes.func,
  maxPrice: PropTypes.number,
  hoodsParams: PropTypes.shape({
    reducerStatePath: PropTypes.string,
    apiQuery: PropTypes.object,
  }),
  postType: PropTypes.string,
  postSubType: PropTypes.string,
  style: stylesScheme,
  initialFilters: PropTypes.object,
};

export default FiltersScroll;
