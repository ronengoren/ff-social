import React, {Component} from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import {StyleSheet} from 'react-native';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
// import { search as querySearch, initSearchInStack } from '/redux/search/actions';
import {ListMenu} from '../../components/listMenu';
import {View, TextInput, QueryCancelIcon} from '../basicComponents';
import {flipFlopColors} from '../../vars';
import {searchTypes, checkboxStyles} from '../../vars/enums';
import {compact, get, isEmpty} from '../../infra/utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 25,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 60,
    width: '100%',
    paddingVertical: 10,
    backgroundColor: flipFlopColors.white,
    borderBottomWidth: 1,
    borderBottomColor: flipFlopColors.b90,
  },
  inputContainer: {
    width: '100%',
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: flipFlopColors.transparent,
    backgroundColor: flipFlopColors.veryLightPink,
  },
  inputContainerFocused: {
    backgroundColor: flipFlopColors.white,
    borderColor: flipFlopColors.green,
  },
  input: {
    fontSize: 16,
    color: flipFlopColors.b30,
    padding: 0,
    paddingLeft: 10,
    paddingRight: 25,
  },
  cancelIcon: {
    position: 'absolute',
    top: 23,
    right: 10,
  },
  listMenuContainer: {
    minHeight: 280,
  },
});

class CommunitiesFilter extends Component {
  state = {
    searchTerm: '',
    isInputFocused: false,
  };

  render() {
    const {searchTerm, isInputFocused} = this.state;
    const {communityId, withHeader} = this.props;
    const communitiesResultsSorted = this.getSortedCommunities();
    const formatedCommunities =
      CommunitiesFilter.formatCommunities(communitiesResultsSorted) || [];
    const selectedIdAsArr = communityId ? [communityId] : [];
    return (
      <View style={styles.container}>
        {withHeader && (
          <View style={styles.searchInputContainer}>
            <TextInput
              onChange={(val) => this.setState({searchTerm: val})}
              onChangeDebounced={this.handleQueryChange}
              debounceTime={100}
              containerStyle={[
                styles.inputContainer,
                isInputFocused && styles.inputContainerFocused,
              ]}
              autoCapitalize="none"
              value={searchTerm}
              placeholder={I18n.t('filters.community.search')}
              placeholderTextColor={flipFlopColors.b60}
              inputStyle={styles.input}
              height={38}
              onFocus={this.handleInputFocus}
              onBlur={this.handleInputBlur}
            />
            {!!searchTerm && (
              <QueryCancelIcon
                onPress={this.clearSearch}
                iconColor={flipFlopColors.b70}
                style={styles.cancelIcon}
              />
            )}
          </View>
        )}
        <ListMenu
          listStyle={styles.listMenuContainer}
          checkboxStyle={checkboxStyles.RECTANGLE}
          selectedIds={selectedIdAsArr}
          onSelect={this.handleCommunitySelected}
          items={formatedCommunities}
          isSelectable
        />
      </View>
    );
  }

  componentDidMount() {
    this.searchCommunity();
  }

  static formatCommunities = memoize((communities) =>
    (communities || []).map((community) => ({
      id: community.objectID || community.id,
      value: community.name,
      text: community.cityName,
      itemsCount: community.itemsCount,
      totals: community.totals,
    })),
  );

  getSortedCommunities = () => {
    const {
      communitiesResults,
      communitiesSortAttribute,
      totals,
      additionalFilteresSelectors,
    } = this.props;
    const communities = communitiesResults ? [...communitiesResults] : [];
    let communitiesWithTotals = [];
    const getCommunityTotal = (community) =>
      totals &&
      totals.find((c) => c.id === (community.id || community.objectID));
    if (Array.isArray(totals)) {
      communitiesWithTotals = communities
        .filter(getCommunityTotal)
        .map((community) => ({
          ...community,
          itemsCount: getCommunityTotal(community).totalItems,
        }))
        .sort((a, b) => (a.itemsCount > b.itemsCount ? -1 : 1));
    }

    const communitiesWithoutTotals = communities
      .filter((community) => !getCommunityTotal(community))
      .sort((a, b) => {
        if (a.totals && b.totals) {
          return a.totals[communitiesSortAttribute] >
            b.totals[communitiesSortAttribute]
            ? -1
            : 1;
        }
        return -1;
      });

    const communitiesSorted = compact([
      ...communitiesWithTotals,
      ...communitiesWithoutTotals,
    ]);

    if (!isEmpty(communitiesSorted)) {
      return [...compact(additionalFilteresSelectors), ...communitiesSorted];
    }

    return communitiesSorted;
  };

  handleCommunitySelected = (eventData) => {
    const {onCommunityChanged, withHeader, onPressFilter} = this.props;
    const communitiesResultsSorted = this.getSortedCommunities();
    const formatedCommunities =
      CommunitiesFilter.formatCommunities(communitiesResultsSorted) || [];
    const {id} = eventData;
    if (id === this.props.communityId) {
      onCommunityChanged({});

      if (!withHeader && onPressFilter) {
        onPressFilter();
      }

      return;
    }

    const selectedCommunity = formatedCommunities.find(
      (community) => community.id === id,
    );
    onCommunityChanged({
      id,
      cityName: selectedCommunity.text,
      name: selectedCommunity.value,
      totals: selectedCommunity.totals,
    });
    if (!withHeader && onPressFilter) {
      onPressFilter();
    }
  };

  handleInputFocus = () => {
    const {isInputFocused} = this.state;
    !isInputFocused && this.setState({isInputFocused: true});
  };

  handleInputBlur = () => {
    const {isInputFocused} = this.state;
    isInputFocused && this.setState({isInputFocused: false});
  };

  handleQueryChange = (searchQuery) => {
    if (searchQuery) {
      const trimmedSearchQuery = searchQuery.trim();
      this.searchCommunity(trimmedSearchQuery);
    } else {
      this.searchCommunity();
    }
  };

  searchCommunity = (query = '') => {
    const {querySearch, initSearchInStack, nationalityGroupId} = this.props;
    initSearchInStack({
      searchTypes: [searchTypes.COMMUNITIES],
    });

    querySearch({
      query,
      nationalityGroupId,
      searchType: searchTypes.COMMUNITIES,
      perPage: 100,
    });
  };

  clearSearch = () => {
    this.searchCommunity();
    this.setState({searchTerm: ''});
  };
}

CommunitiesFilter.defaultProps = {
  additionalFilteresSelectors: [],
  onPressFilter: () => {},
};

CommunitiesFilter.propTypes = {
  withHeader: PropTypes.bool,
  onPressFilter: PropTypes.func,
  totals: PropTypes.array,
  onCommunityChanged: PropTypes.func.isRequired,
  querySearch: PropTypes.func,
  communitiesResults: PropTypes.arrayOf(PropTypes.object),
  initSearchInStack: PropTypes.func,
  nationalityGroupId: PropTypes.string,
  communityId: PropTypes.string,
  communitiesSortAttribute: PropTypes.string,
  additionalFilteresSelectors: PropTypes.array,
};

const mapStateToProps = (state) => ({
  searchAddressData: state.searchAddress,
  // user: state.auth.user,
  communitiesResults: get(state, 'search.searchStack.communities.results'),
  nationalityGroupId: get(state, 'auth.user.nationalityGroup.id'),
});

const mapDispatchToProps = {
  // querySearch,
  // initSearchInStack
};

CommunitiesFilter = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommunitiesFilter);
export default CommunitiesFilter;
