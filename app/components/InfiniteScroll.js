import React from 'react';
import PropTypes from 'prop-types';
import {FlatList, StyleSheet, View, VirtualizedList, Text} from 'react-native';
import {connect} from 'react-redux';
import {fetchBottom, fetchTop} from '../redux/InfiniteScroll/actions';
import {get, isNil} from '../infra/utils';
import {Spinner} from '../components/basicComponents';
import {ItemErrorBoundary} from '../components';
import {stylesScheme} from '../schemas';

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 20,
  },
  spinner: {
    marginTop: '20%', // TODO: temporary solution
  },
});

const listTypes = {
  BASIC: 'basic',
  FLAT: 'flat',
};

// start demo FlatList
const DATA1 = [
  {
    index: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    item: 'First Item',
  },
  {
    index: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    item: 'Second Item',
  },
  {
    index: '58694a0f-3da1-471f-bd96-145571e29d72',
    item: 'Third Item',
  },
];
const FlatListItem = ({title}) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);
// end demo FlatList

class InfiniteScroll extends React.Component {
  state = {
    throwError: null,
    isFirstDataLoaded: false,
  };
  render() {
    const {
      listType = listTypes.BASIC,
      horizontal,
      keyExtractor,
      data,
      isFetchingTop,
      onRef,
      onLayout,
      numColumns,
      disableRefresh,
      extraData,
      getItemLayout,
      onScroll,
      ListHeaderComponent,
      stickyHeader,
      contentContainerStyle,
      keyboardDismissMode,
      viewabilityConfig,
      onViewableItemsChanged,
      showRefreshingSpinner,
      ListLoadingComponent,
    } = this.props;
    const {isFirstDataLoaded} = this.state;

    const adjustedData = this.getAdjustedData();

    let stickyHeaderIndices;
    if (stickyHeader) {
      stickyHeaderIndices = ListHeaderComponent ? [1] : [0];
    }
    const renderItem = ({item}) => <FlatListItem title={item.item} />;
    const allowSpinner = ListLoadingComponent ? !!isFirstDataLoaded : true;
    const refreshing =
      !disableRefresh &&
      showRefreshingSpinner &&
      allowSpinner &&
      !!data &&
      !!data.length &&
      isFetchingTop;

    if (listType === listTypes.BASIC) {
      return (
        <VirtualizedList
          onLayout={onLayout}
          ref={this.handleFeedRef}
          data={adjustedData}
          renderItem={this.renderItem}
          keyExtractor={keyExtractor}
          onRefresh={!disableRefresh && this.fetchTop}
          refreshing={refreshing}
          onEndReachedThreshold={2}
          ListFooterComponent={this.renderFooter}
          ListHeaderComponent={ListHeaderComponent}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          removeClippedSubviews={false}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode={keyboardDismissMode}
          getItemCount={(data) => (data ? data.length : 0)}
          getItem={(data, index) => data[index]}
          ListEmptyComponent={this.renderListEmptyComponent()}
          extraData={extraData}
          onScroll={onScroll}
          scrollEventThrottle={50}
          horizontal={horizontal}
          stickyHeaderIndices={stickyHeaderIndices}
          contentContainerStyle={contentContainerStyle}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
        />
      );
    }
    return (
      <FlatList
        data={DATA1}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListFooterComponent={this.renderFooter}
      />
    );
  }
  getAdjustedData = () => {
    const {
      data,
      addedData,
      stickyHeader,
      extraTopComponent,
      extraBottomComponent,
    } = this.props;
    let adjustedData = data
      ? [...data]
      : [{component: this.renderListEmptyComponent(), nonListItem: true}];
    if (extraTopComponent && data) {
      adjustedData = [
        {component: extraTopComponent, nonListItem: true},
        ...adjustedData,
      ];
    }
    if (addedData) {
      adjustedData = [...addedData, ...adjustedData];
    }
    if (extraBottomComponent && data) {
      adjustedData = [
        ...adjustedData,
        {component: extraBottomComponent, nonListItem: true},
      ];
    }
    if (stickyHeader) {
      adjustedData = [
        {component: stickyHeader, nonListItem: true},
        ...adjustedData,
      ];
    }

    return adjustedData;
  };

  renderItem = ({item, index}) => {
    const {
      extraBottomComponent,
      ListItemComponent,
      listItemProps = {},
    } = this.props;
    const hasExtraBottomComponent = !!extraBottomComponent;
    if (item.nonListItem) {
      return item.component;
    }

    return (
      <ItemErrorBoundary key="scrollItem" boundaryName="scrollItem">
        <ListItemComponent
          data={item}
          index={index}
          hasExtraBottomComponent={hasExtraBottomComponent}
          {...listItemProps}
        />
      </ItemErrorBoundary>
    );
  };
  renderListEmptyComponent = () => {
    const {isListErrorShown} = this.state;
    const {
      data,
      ListEmptyComponent,
      ListLoadingComponent,
      ListErrorComponent,
      horizontal,
      totalCount,
    } = this.props;

    if (isListErrorShown) {
      return ListErrorComponent;
    } else if (!ListLoadingComponent && !data) {
      if (horizontal) {
        return null;
      }
      return <Spinner style={styles.spinner} size="large" key="loader" />;
    } else if (
      (isNil(totalCount) || totalCount === 0) &&
      data &&
      data.length === 0
    ) {
      return ListEmptyComponent;
    } else {
      return ListLoadingComponent;
    }
  };
  renderFooter = () => {
    const {
      horizontal,
      isFetchingBottom,
      hasMore,
      ListFooterComponent,
    } = this.props;
    if (!horizontal && isFetchingBottom && hasMore) {
      return (
        <View style={styles.footer}>
          <Spinner size="large" />
          {ListFooterComponent}
        </View>
      );
    }
    return ListFooterComponent;
  };

  fetchTop = async ({isInitialFetch, apiQueryChanged} = {}) => {
    const {
      normalizedSchema,
      reducerStatePath,
      apiQuery,
      fetchTop,
      resetDataOnFetchTop,
      data,
      onTopFetchAction,
      ListErrorComponent,
      options,
    } = this.props;
    const {isFirstDataLoaded} = this.state;

    this.setState({
      isListErrorShown: false,
      isFirstDataLoaded: apiQueryChanged ? false : isFirstDataLoaded,
    });

    try {
      await fetchTop({
        normalizedSchema,
        reducerStatePath,
        query: apiQuery,
        resetData: resetDataOnFetchTop,
        options,
      });
      if (isInitialFetch) {
        this.setState({isFirstDataLoaded: true});
      }
      data && onTopFetchAction && onTopFetchAction({isInitialFetch});
    } catch (err) {
      // In case we already have something in the list - don't fail the entire list
      if (!data || !data.length) {
        if (ListErrorComponent) {
          this.setState({isListErrorShown: true});
        } else {
          this.setState({throwError: err});
        }
      }
    }
  };
  fetchBottom = () => {
    const {
      normalizedSchema,
      reducerStatePath,
      apiQuery,
      fetchBottom,
      isFetchingBottom,
      disableFetchBottom,
      options,
    } = this.props;
    !isFetchingBottom &&
      !disableFetchBottom &&
      fetchBottom({
        normalizedSchema,
        reducerStatePath,
        query: apiQuery,
        options,
      });
  };

  handleFeedRef = (node) => {
    setImmediate(() => {
      if (node) {
        this.listComponentRef = node;
        const {onRef} = this.props;
        onRef && onRef(node);
      }
    });
  };

  scrollToIndex = ({index}) => {
    const {data} = this.props;
    if (index > -1 && data && data.length && this.listComponentRef) {
      this.listComponentRef.scrollToIndex({index});
    }
  };

  scrollToOffset = ({offset, force = false}) => {
    const {data} = this.props;
    ((data && data.length) || force) &&
      this.listComponentRef &&
      this.listComponentRef.scrollToOffset({offset});
  };
}

InfiniteScroll.defaultProps = {
  numColumns: 1,
  ListHeaderComponent: null,
  ListLoadingComponent: null,
  ListEmptyComponent: null,
  ListFooterComponent: null,
  keyboardDismissMode: 'on-drag',
  extraTopComponent: null,
  extraBottomComponent: null,
  keyExtractor: (item, index) => item.entityId || item.id || index.toString(),
  showRefreshingSpinner: true,
  disableFetchBottom: false,
};

InfiniteScroll.propTypes = {
  data: PropTypes.array,
  onUpdate: PropTypes.func,
  listType: PropTypes.string,
  reducerStatePath: PropTypes.string,
  normalizedSchema: PropTypes.string,
  apiQuery: PropTypes.object,
  resetDataOnFetchTop: PropTypes.bool,
  hasMore: PropTypes.bool,
  keyExtractor: PropTypes.func,
  ListHeaderComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  ListFooterComponent: PropTypes.node,
  ListErrorComponent: PropTypes.node,
  onRef: PropTypes.func,
  onLayout: PropTypes.func,
  numColumns: PropTypes.number,
  disableRefresh: PropTypes.bool,
  fetchBottom: PropTypes.func,
  fetchTop: PropTypes.func,
  isFetchingBottom: PropTypes.bool,
  isFetchingTop: PropTypes.bool,
  ListEmptyComponent: PropTypes.node,
  ListLoadingComponent: PropTypes.node,
  disableInitialFetch: PropTypes.bool,
  extraData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  addedData: PropTypes.array,
  getItemLayout: PropTypes.func,
  onScroll: PropTypes.func,
  horizontal: PropTypes.bool,
  onTopFetchAction: PropTypes.func,
  stickyHeader: PropTypes.node,
  contentContainerStyle: stylesScheme,
  keyboardDismissMode: PropTypes.string,
  ListItemComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  listItemProps: PropTypes.object,
  viewabilityConfig: PropTypes.object,
  onViewableItemsChanged: PropTypes.func,
  extraTopComponent: PropTypes.node,
  extraBottomComponent: PropTypes.node,
  showRefreshingSpinner: PropTypes.bool,
  disableFetchBottom: PropTypes.bool,
  totalCount: PropTypes.number,
  options: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
  data: get(state, `${ownProps.reducerStatePath}.data`, null),
  totalCount: get(state, `${ownProps.reducerStatePath}.totalCount`, null),
  isFetchingTop: get(
    state,
    `${ownProps.reducerStatePath}.isFetchingTop`,
    false,
  ),
  isFetchingBottom: get(
    state,
    `${ownProps.reducerStatePath}.isFetchingBottom`,
    false,
  ),
  hasMore: get(state, `${ownProps.reducerStatePath}.hasMore`, false),
  v: get(state, `${ownProps.reducerStatePath}.v`),
});

const mapDispatchToProps = {fetchTop, fetchBottom};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(InfiniteScroll);
