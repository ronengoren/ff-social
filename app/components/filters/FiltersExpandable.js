import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, LayoutAnimation} from 'react-native';
import I18n from '../../infra/localization';
import {View, NewTextButton} from '../basicComponents';
import {flipFlopColors, commonStyles} from '../../vars';
import {filterTypes, screenNames, entityTypes} from '../../vars/enums';
import {isNil, isUndefined, cloneDeep, uniqBy} from '../../infra/utils';
import {stylesScheme} from '../../schemas';
import {navigationService} from '../../infra/navigation';
import Filter from './Filter';
import FiltersRow from './FiltersRow';

const styles = StyleSheet.create({
  filtersWrapper: {
    backgroundColor: flipFlopColors.white,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    marginBottom: 20,
  },
  filtersBtn: {
    margin: 15,
  },
  filtersBtnIcon: {
    color: flipFlopColors.green,
  },
  filtersBtnText: {
    color: flipFlopColors.green,
  },
});

const INITIAL_FILTERS_TO_SHOW = 3;

class FiltersExpandable extends React.Component {
  static ALGOLIA_ENTITY_TYPE = {
    EVENTS: 'events',
    USERS: 'users',
  };

  static getTotalsAttribute(postType, entityType) {
    let communitiesSortAttribute;
    if (postType) {
      communitiesSortAttribute = postType;
    } else if (entityType === entityTypes.EVENT) {
      communitiesSortAttribute = FiltersExpandable.ALGOLIA_ENTITY_TYPE.EVENTS;
    } else if (entityType === entityTypes.USER) {
      communitiesSortAttribute = FiltersExpandable.ALGOLIA_ENTITY_TYPE.USERS;
    }
    return communitiesSortAttribute;
  }

  constructor(props) {
    super(props);
    const {initialFilters} = props;
    this.state = {
      filters: initialFilters,
      activeFilter: '',
      showAllFilters: false,
    };
  }

  render() {
    const {
      hoodsParams,
      maxPrice,
      entityType,
      postType,
      postSubType,
      style,
      // filterDefinitions,
    } = this.props;
    const {filters, activeFilter, showAllFilters} = this.state;
    // const showAllFiltersButton =

    const showAllFiltersButton = INITIAL_FILTERS_TO_SHOW;
    //   filterDefinitions.length > INITIAL_FILTERS_TO_SHOW;
    const communitiesSortAttribute = FiltersExpandable.getTotalsAttribute(
      postType,
      entityType,
    );

    return (
      <View style={[styles.filtersWrapper, commonStyles.shadow, style]}>
        {this.renderFilters({showAllFiltersButton})}
        {showAllFiltersButton && (
          <NewTextButton
            size={NewTextButton.sizes.SMALL35}
            iconName="sliders-h"
            iconSize={16}
            iconWeight="light"
            customColor={flipFlopColors.paleGreyTwo}
            style={styles.filtersBtn}
            iconStyle={styles.filtersBtnIcon}
            textStyle={styles.filtersBtnText}
            onPress={this.toggleShowFilters}
            numberOfLines={null}>
            {I18n.t(`filters.toggleBtn.${showAllFilters ? 'hide' : 'show'}`)}
          </NewTextButton>
        )}
        {!!activeFilter && (
          <Filter
            filter={filters[activeFilter]}
            filterType={activeFilter}
            minAge={filters.minAge}
            maxAge={filters.maxAge}
            maxPrice={maxPrice}
            entityType={entityType}
            postType={postType}
            postSubType={postSubType}
            contextCountryCode={filters.contextCountryCode}
            hoodsFromSearch={filters.hoodsFromSearch}
            applyFilter={this.applyFilter}
            clearFilter={this.clearFilter}
            closeFilter={() => this.setState({activeFilter: ''})}
            hoodsParams={hoodsParams}
            neighborhoodsIds={filters.neighborhoodsIds}
            communityId={filters.community && filters.community.id}
            hoodNames={filters.hoodNames}
            communityCityName={filters.community && filters.community.cityName}
            communitiesSortAttribute={communitiesSortAttribute}
          />
        )}
      </View>
    );
  }

  componentDidUpdate(prevProps) {
    // if (
    //   prevProps.filterDefinitions.length !== this.props.filterDefinitions.length
    // ) {
    LayoutAnimation.easeInEaseOut();
    // }
  }

  renderFilters = ({showAllFiltersButton}) => {
    const {entityType, postType, filterDefinitions} = this.props;
    const {filters, showAllFilters} = this.state;
    const {community: {totals: totals = {}} = {}} = filters;

    // return uniqBy(filterDefinitions)
    //   .slice(
    //     0,
    //     showAllFilters
    //       ? filterDefinitions.length
    //       : INITIAL_FILTERS_TO_SHOW - (showAllFiltersButton ? 1 : 0),
    //   )
    //   .map((filterName) => {
    //     if (
    //       filterName === filterTypes.HOODS &&
    //       this.checkIsNoResults(postType, entityType, totals)
    //     ) {
    //       return null;
    //     }
    return (
      <FiltersRow
        // key={`${filterName}FilterRow`}
        // filterName={filterName}
        filters={filters}
        onPress={() => this.onFilterPress(filterName)}
        applyFilter={this.applyFilter}
        clearFilter={this.clearFilter}
        entityType={entityType}
        postType={postType}
      />
    );
    // });
  };

  checkIsNoResults = (postType, entityType, totals) => {
    const communitiesSortAttribute = FiltersExpandable.getTotalsAttribute(
      postType,
      entityType,
    );
    const isNoResults = totals[communitiesSortAttribute] === 0;
    return isNoResults;
  };

  onFilterPress = (filterName) => {
    if (filterName === filterTypes.PEOPLE_SEARCH) {
      navigationService.navigate(screenNames.Search, {
        peopleSearchOnly: true,
      });
    } else {
      this.setState({activeFilter: filterName});
    }
  };

  toggleShowFilters = () => {
    const {showAllFilters} = this.state;
    LayoutAnimation.easeInEaseOut();
    this.setState({showAllFilters: !showAllFilters});
  };

  applyFilter = (filter) => {
    const {resetAction, applyAction} = this.props;
    const {filters} = this.state;
    resetAction();

    this.setState({filters: {...filters, ...filter}, activeFilter: ''}, () =>
      applyAction(cloneDeep(this.state.filters)),
    );
  };

  clearFilter = ({filterName, chipIndex}) => {
    const {resetAction, applyAction, initialFilters} = this.props;
    const {filters, activeFilter} = this.state;
    resetAction();
    const filter = activeFilter || filterName;
    const newState = {activeFilter: '', filters};
    let emptyValue;
    if (filter === filterTypes.AGE) {
      newState.filters.minAge = null;
      newState.filters.maxAge = null;
    } else if (filter === filterTypes.COMMUNITY) {
      // clear the single community data
      newState.filters.community = {};
      // clear all hoods data
      newState.filters.hoodsFromSearch = null;
      newState.filters.hoodNames = null;
      newState.filters.neighborhoodsIds = null;
    } else if (filter === filterTypes.COUNTRY) {
      newState.filters.contextCountryCode = [];
    } else if (filter === filterTypes.HOODS) {
      // clear specific hood data
      const updatedHoodData = this.clearHoodsData(filters, chipIndex);
      newState.filters.hoodsFromSearch = updatedHoodData.hoodsFromSearchNew;
      newState.filters.hoodNames = updatedHoodData.hoodNamesNew;
      newState.filters.neighborhoodsIds = updatedHoodData.neighborhoodsIdsNew;
    } else if (filter === filterTypes.PEOPLE_SEARCH) {
      newState.filters.minCreatedAt = null;
      newState.filters.maxCreatedAt = null;
    } else if (filter === filterTypes.LISTING_TYPE) {
      emptyValue = initialFilters[filterTypes.LISTING_TYPE] || null;
      newState.filters.translatedTag = null;
    } else {
      emptyValue = null;
    }

    if (!isUndefined(emptyValue)) {
      if (isNil(chipIndex)) {
        newState.filters[filter] = emptyValue;
      } else {
        let filteredValues = [];
        if (Array.isArray(filters[filter])) {
          filteredValues = (filters[filter] || []).filter(
            (value, index) => index !== chipIndex,
          );
        }
        newState.filters[filter] = filteredValues.length
          ? filteredValues
          : emptyValue;
      }
    }

    this.setState({...newState}, () =>
      applyAction(cloneDeep(this.state.filters)),
    );
  };

  clearHoodsData = (filters, chipIndex) => {
    let {hoodsFromSearch, hoodNames, neighborhoodsIds} = filters;
    if (!isNil(chipIndex)) {
      const hoodName = (hoodNames || [])[chipIndex];
      hoodsFromSearch = (hoodsFromSearch || []).filter(
        (hoodObj) => hoodObj.name !== hoodName,
      );
      hoodNames = (hoodNames || []).filter(
        (hoodName, index) => index !== chipIndex,
      );
      neighborhoodsIds = (neighborhoodsIds || []).filter(
        (neighborhoodId, index) => index !== chipIndex,
      );
    }
    const hoodsFromSearchNew = (hoodsFromSearch || []).length
      ? hoodsFromSearch
      : null;
    const hoodNamesNew = (hoodNames || []).length ? hoodNames : null;
    const neighborhoodsIdsNew = (neighborhoodsIds || []).length
      ? neighborhoodsIds
      : null;
    return {hoodsFromSearchNew, hoodNamesNew, neighborhoodsIdsNew};
  };
}

FiltersExpandable.defaultProps = {
  entityType: entityTypes.POST,
  initialFilters: {},
};

FiltersExpandable.propTypes = {
  // filterDefinitions: PropTypes.array,
  applyAction: PropTypes.func,
  resetAction: PropTypes.func,
  maxPrice: PropTypes.number,
  hoodsParams: PropTypes.shape({
    reducerStatePath: PropTypes.string,
    apiQuery: PropTypes.object,
  }),
  entityType: PropTypes.string,
  postType: PropTypes.string,
  postSubType: PropTypes.string,
  style: stylesScheme,
  initialFilters: PropTypes.object,
};

export default FiltersExpandable;
