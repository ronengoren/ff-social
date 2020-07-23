import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FlatList, View, StyleSheet, Keyboard} from 'react-native';
import I18n from '../../infra/localization';
import {EmptySearch, ItemErrorBoundary} from '../../components';
import {Spinner} from '../basicComponents';
import {flipFlopColors, commonStyles} from '../../vars';
import {SearchResultRow, ITEM_HEIGHT} from './SearchResultRow';

const styles = StyleSheet.create({
  footer: {
    height: ITEM_HEIGHT,
  },
  footerSpinner: {
    flex: 1,
  },
});

class SearchResultsList extends Component {
  // We use the state's page and not the page from the store since the store's
  // page is not being updated fast enough - which can lead to multiple searches on
  // the same page
  state = {
    page: 0,
  };

  render = () => {
    const {
      results,
      query,
      onSearchResultPress,
      isSearching,
      dismissOnScroll,
      emptyComponentStyle,
      customResultComponent,
      listHeaderComponent,
      shouldShowEmptyState,
      shouldShowRowSeparator,
      isFlexWhenEmpty,
      isHorizontal,
    } = this.props;
    const ResultRowComponent = customResultComponent || SearchResultRow;
    return (
      <FlatList
        contentContainerStyle={
          !results.length && isFlexWhenEmpty && commonStyles.flex1
        }
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        onEndReached={this.handleEndReached}
        onScroll={dismissOnScroll ? this.handleScroll : () => {}}
        data={results}
        horizontal={isHorizontal}
        renderItem={({item, index}) => (
          <ItemErrorBoundary boundaryName="SearchItem">
            <ResultRowComponent
              searchResult={item}
              searchQuery={query}
              onPress={(result) => onSearchResultPress(result, index)}
              shouldShowSeparator={shouldShowRowSeparator}
            />
          </ItemErrorBoundary>
        )}
        keyExtractor={(i) => i.objectID}
        ListEmptyComponent={
          <View style={emptyComponentStyle}>
            {isSearching && (!results || !results.length) ? (
              <Spinner color={flipFlopColors.secondaryBlack} />
            ) : (
              shouldShowEmptyState && (
                <EmptySearch
                  text={I18n.t('search_result.empty_state', {query})}
                />
              )
            )}
          </View>
        }
        ListHeaderComponent={listHeaderComponent}
        ListFooterComponent={this.renderFooter}
        disableVirtualization={false}
        shouldItemUpdate={(props, nextProps) => props.item !== nextProps.item}
        getItemLayout={
          customResultComponent
            ? null
            : (data, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })
        }
      />
    );
  };

  static getDerivedStateFromProps(props, state) {
    if (props.query !== state.query) {
      return {
        page: 0,
        query: props.query,
      };
    }
    return null;
  }

  handleEndReached = () => {
    const {querySearch, query, resultsNumberPages} = this.props;
    const isNotLastPage = resultsNumberPages > this.state.page + 1;

    if (isNotLastPage) {
      this.setState({page: this.state.page + 1}, () =>
        querySearch(query, this.state.page),
      );
    }
  };

  handleScroll = () => {
    Keyboard.dismiss();
  };

  renderFooter = () => {
    const {isSearching, results} = this.props;
    return (
      <View style={styles.footer}>
        {!!(isSearching && results && results.length) && (
          <Spinner
            style={styles.footerSpinner}
            color={flipFlopColors.secondaryBlack}
          />
        )}
      </View>
    );
  };
}

SearchResultsList.defaultProps = {
  dismissOnScroll: true,
  listHeaderComponent: null,
  shouldShowEmptyState: true,
  isFlexWhenEmpty: true,
};

SearchResultsList.propTypes = {
  results: PropTypes.array,
  resultsNumberPages: PropTypes.number,
  query: PropTypes.string,
  querySearch: PropTypes.func,
  onSearchResultPress: PropTypes.func,
  isSearching: PropTypes.bool,
  dismissOnScroll: PropTypes.bool,
  emptyComponentStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
  customResultComponent: PropTypes.func,
  listHeaderComponent: PropTypes.node,
  shouldShowEmptyState: PropTypes.bool,
  shouldShowRowSeparator: PropTypes.bool,
  isFlexWhenEmpty: PropTypes.bool,
  isHorizontal: PropTypes.bool,
};

export default SearchResultsList;
