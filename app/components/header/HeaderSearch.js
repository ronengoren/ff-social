import React from 'react';
import PropTypes from 'prop-types';
import {LayoutAnimation} from 'react-native';
import {connect} from 'react-redux';
import {entityTypes, searchTypes} from '../../vars/enums';
// import { search, clearSearch } from '/redux/search/actions';
// import { searchAddress, clearSearchAddress } from '/redux/searchAddress/actions';
import {debounce, get} from '../../infra/utils';
// import { analytics } from '/infra/reporting';
import {navigationService} from '../../infra/navigation';
import HeaderSearchInput from './HeaderSearchInput';

class HeaderSearch extends React.Component {
  state = {
    queryField: this.props.searchQuery || null,
  };

  render() {
    const {queryField} = this.state;
    const {searchMode, isOnboarding, onPressClose, ...restProps} = this.props;

    return (
      <HeaderSearchInput
        ref={(node) => {
          this.SearchInput = node;
        }}
        value={queryField}
        onPress={searchMode ? null : this.handleOnPress}
        onCancel={this.handleQueryCancelPress}
        searchMode={searchMode}
        isOnboarding={isOnboarding}
        onChange={this.onChangeSearchQuery}
        onPressClose={onPressClose}
        {...restProps}
      />
    );
  }

  static getDerivedStateFromProps(props, state) {
    const {searchQuery} = props;
    // If the user clicked on the search term from the search screen
    if (
      state.searchQueryProp !== props.searchQuery &&
      searchQuery &&
      searchQuery.length
    ) {
      return {queryField: searchQuery, searchQueryProp: searchQuery};
    }
    return null;
  }

  // componentDidUpdate(prevProps) {
  //   if (!prevProps.searchMode && this.props.searchMode) {
  //     this.SearchInput.focus();
  //   }
  // }

  handleOnPress = () => {
    LayoutAnimation.easeInEaseOut();
    this.props.handleSearchFocus();
  };

  onChangeSearchQuery = (text) => {
    const {searchMode, searchAddressMode, searchQuery} = this.props;
    this.setState({queryField: text});
    this.handleSearchRequestDebounced(text);

    if (!searchAddressMode && searchMode && text && text.length) {
      const trimmedText = text.trim();
      if (trimmedText !== searchQuery) {
        this.trackSearch(text);
      }
    }
  };

  trackSearch = debounce((text) => {
    const {params = {}} = navigationService.getCurrentRouteName({
      withParams: true,
    });
    const {peopleSearchOnly} = params;
    analytics.actionEvents
      .searchRequest({
        keyword: text,
        searchType: peopleSearchOnly ? searchTypes.PEOPLE : searchTypes.GENERAL,
      })
      .dispatch();
  }, 2000);

  handleSearchRequestDebounced = debounce((text) => {
    const {
      searchMode,
      searchAddressMode,
      searchAddressData,
      searchQuery,
      communityId,
      search,
      searchAddress,
      clearSearch,
      clearSearchAddress,
      destinationTagName,
      nationalityGroupId,
    } = this.props;

    if (searchAddressMode) {
      if (text && text.length) {
        const trimmedText = text.trim();
        const {
          isNeighborhoods,
          isCities,
          country,
          types,
          prefix,
          coordinates,
        } = searchAddressData;

        if (trimmedText !== searchAddressData.query) {
          searchAddress({
            query: trimmedText,
            isNeighborhoods,
            isCities,
            country,
            types,
            prefix,
            coordinates,
            destinationTagName,
          });
        }
      } else {
        clearSearchAddress();
      }
    } else if (searchMode) {
      if (text && text.length) {
        const trimmedText = text.trim();
        if (trimmedText !== searchQuery) {
          const {params = {}} = navigationService.getCurrentRouteName({
            withParams: true,
          });
          const {withPeopleSearch, peopleSearchOnly} = params;

          if (!peopleSearchOnly) {
            search({
              query: trimmedText,
              page: 0,
              communityId,
              destinationTagName,
              searchType: searchTypes.GENERAL,
              entityTypeFilter: entityTypes.USER,
              nationalityGroupId,
            });
          }
          if (withPeopleSearch || peopleSearchOnly) {
            search({
              query: trimmedText,
              page: 0,
              communityId,
              destinationTagName,
              searchType: searchTypes.PEOPLE,
              singleEntityType: entityTypes.USER,
              nationalityGroupId,
            });
          }
        }
      } else {
        const {params = {}} = navigationService.getCurrentRouteName({
          withParams: true,
        });
        const {withPeopleSearch, peopleSearchOnly} = params;
        const searchTypesArray = [];
        if (!peopleSearchOnly) {
          searchTypesArray.push(searchTypes.GENERAL);
        }
        if (withPeopleSearch || peopleSearchOnly) {
          searchTypesArray.push(searchTypes.PEOPLE);
        }
        clearSearch({searchTypes: searchTypesArray});
      }
    }
  }, 400);

  handleQueryCancelPress = () => {
    const {searchAddress, clearSearchAddress, clearSearch} = this.props;
    this.setState({queryField: null});
    if (searchAddress) {
      clearSearchAddress();
    } else {
      const searchTypesArray = [searchTypes.GENERAL];
      const {params = {}} = navigationService.getCurrentRouteName({
        withParams: true,
      });
      if (params.withPeopleSearch) {
        searchTypesArray.push(searchTypes.PEOPLE);
      }
      clearSearch({searchTypes: searchTypesArray});
    }
  };
}

HeaderSearch.propTypes = {
  onPressClose: PropTypes.func,
  handleSearchFocus: PropTypes.func,
  isOnboarding: PropTypes.bool,
  searchMode: PropTypes.bool,
  searchAddressMode: PropTypes.bool,
  search: PropTypes.func,
  searchAddress: PropTypes.func,
  clearSearch: PropTypes.func,
  clearSearchAddress: PropTypes.func,
  communityId: PropTypes.string,
  nationalityGroupId: PropTypes.string,
  searchQuery: PropTypes.string,
  searchAddressData: PropTypes.shape({
    types: PropTypes.string,
    prefix: PropTypes.string,
    country: PropTypes.string,
    coordinates: PropTypes.array,
    query: PropTypes.string,
    results: PropTypes.array,
    isNeighborhoods: PropTypes.bool,
    isCities: PropTypes.bool,
  }),
  destinationTagName: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  destinationTagName: get(state, 'auth.user.community.destinationTagName'),
  communityId: get(state, 'auth.user.community.id'),
  nationalityGroupId: get(state, 'auth.user.nationalityGroup.id'),
  searchAddressData: state.searchAddress,
  searchQuery:
    ownProps.searchMode &&
    !ownProps.searchAddressMode &&
    state.search.searchStack.length
      ? state.search.searchStack[state.search.searchStack.length - 1].query
      : '',
});

// const mapDispatchToProps = {
//   search,
//   searchAddress,
//   clearSearch,
//   clearSearchAddress,
// };

// HeaderSearch = connect(mapStateToProps, mapDispatchToProps)(HeaderSearch);
export default HeaderSearch;
