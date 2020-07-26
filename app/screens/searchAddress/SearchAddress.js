import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FlatList, View, Platform} from 'react-native';
import I18n from '../../infra/localization';
import {connect} from 'react-redux';
// import { clearSearchAddress } from '/redux/searchAddress/actions';
import {
  EmptySearch,
  Screen,
  ItemErrorBoundary,
  SearchAddressResultRow,
} from '../../components';
import {Spinner, KeyboardAvoidingView} from '../../components/basicComponents';
import {navigationService} from '../../infra/navigation';
import {commonStyles, flipFlopColors, uiConstants} from '../../vars';
import {delegateNavigationStateParamsToProps} from '../../infra/navigation/utils';
import {isEmpty} from '../../infra/utils';

class SearchAddress extends Component {
  state = {
    isAddressChosen: false,
  };

  render() {
    const {
      renderHeaderComponent,
      // searchAddress: {results, isSearching},
      defaultValues,
    } = this.props;
    // const dataSource = !isEmpty(results) ? results : defaultValues;
    return (
      <View style={commonStyles.flex1}>
        {!!renderHeaderComponent &&
          renderHeaderComponent({onSelect: this.handleSearchResultPress})}
        <KeyboardAvoidingView
          style={commonStyles.flex1}
          keyboardVerticalOffset={uiConstants.NAVBAR_HEIGHT}
          behavior={Platform.OS === 'ios' ? 'padding' : null}>
          <FlatList
            contentContainerStyle={commonStyles.flex1}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
            // data={dataSource}
            renderItem={this.renderSearchResultItem}
            ListEmptyComponent={
              <Spinner color={flipFlopColors.secondaryBlack} />
            }
            // ListEmptyComponent={
            //   isSearching && (!results || !results.length) ? (
            //     <Spinner color={flipFlopColors.secondaryBlack} />
            //   ) : (
            //     <EmptySearch text={this.getEmptyScreenText()} />
            //   )
            // }
            getItemLayout={(data, index) => ({
              length: SearchAddressResultRow.ITEM_HEIGHT,
              offset: SearchAddressResultRow.ITEM_HEIGHT * index,
              index,
            })}
          />
        </KeyboardAvoidingView>
      </View>
    );
  }

  //   componentWillUnmount = () => {
  //     const { onExitWithNoSelection, clearSearchAddress } = this.props;

  //     clearSearchAddress();
  //     if (!this.state.isAddressChosen) {
  //       onExitWithNoSelection && onExitWithNoSelection();
  //     }
  //   };

  renderSearchResultItem = ({item}) => {
    const {renderIcon, searchAddress} = this.props;
    return (
      <ItemErrorBoundary boundaryName="SearchAddressItem">
        <SearchAddressResultRow
          searchResult={item}
          renderIcon={renderIcon}
          searchQuery={searchAddress.query}
          onPress={this.handleSearchResultPress}
          testID="searchAddressResult"
        />
      </ItemErrorBoundary>
    );
  };

  handleSearchResultPress = async (searchResult) => {
    const {searchAddress, isScreen, onAddressChosen} = this.props;
    const {isNeighborhoods} = searchAddress;
    const value = isNeighborhoods
      ? searchResult.name
      : searchResult.description;

    this.setState({isAddressChosen: true});
    await onAddressChosen({
      value,
      googlePlaceId: searchResult.place_id,
      id: searchResult.id,
    });

    if (isScreen) {
      navigationService.goBack();
    }
  };

  getEmptyScreenText = () => {
    const {searchAddress, placeholderText} = this.props;
    const {query, isNeighborhoods} = searchAddress;

    if (query) {
      return I18n.t('search_address.not_found', {query});
    } else if (placeholderText) {
      return placeholderText;
    } else {
      return isNeighborhoods
        ? I18n.t('search_address.search_neighborhood_placeholder')
        : I18n.t('search_address.search_address_placeholder');
    }
  };
}

const mapStateToProps = (state, ownProps) => ({
  // ...delegateNavigationStateParamsToProps(ownProps),
  searchAddress: state.searchAddress,
});

const mapDispatchToProps = {
  //   clearSearchAddress
};

SearchAddress.propTypes = {
  renderIcon: PropTypes.func,
  onAddressChosen: PropTypes.func,
  onExitWithNoSelection: PropTypes.func,
  renderHeaderComponent: PropTypes.func,
  placeholderText: PropTypes.string,
  defaultValues: PropTypes.array,
  isScreen: PropTypes.bool,
  //   clearSearchAddress: PropTypes.func,
  searchAddress: PropTypes.shape({
    isNeighborhoods: PropTypes.bool,
    query: PropTypes.string,
    // results: PropTypes.arrayOf(PropTypes.object),
    isSearching: PropTypes.bool,
  }),
};

SearchAddress = connect(mapStateToProps, mapDispatchToProps)(SearchAddress);

const SearchAddressScreen = Screen({modalError: true})(SearchAddress);
export default SearchAddressScreen;
