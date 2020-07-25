import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, VirtualizedList} from 'react-native';
import {connect} from 'react-redux';
// import { fetchTop, fetchBottom } from '/redux/InfiniteScroll/actions';
import {get} from '../../infra/utils';
import {flipFlopColors, commonStyles} from '../../vars';
import {ItemErrorBoundary} from '../../components';
import {Spinner} from '../basicComponents';
import UsersListItemWithStates from './UsersListItemWithStates';

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: flipFlopColors.fillGrey,
  },
  searchModeSpinner: {
    paddingVertical: 60,
  },
});

class UsersList extends React.Component {
  render() {
    const {
      stateComponents,
      stateGetters = [],
      renderRightComponent = null,
      keyExtractor,
      data,
      externalDataSource,
      extraData,
      isFetchingTop,
      onUserPressed,
      showBadgeCheck,
      badgeProps,
      showUserJoinDate,
    } = this.props;

    const listData = externalDataSource || data;
    return (
      <VirtualizedList
        contentContainerStyle={
          listData && !listData.length && commonStyles.flex1
        }
        data={listData}
        extraData={extraData}
        renderItem={({item}) => (
          <ItemErrorBoundary boundaryName="userListItem">
            <UsersListItemWithStates
              user={item}
              stateComponents={stateComponents}
              itemState={this.getItemCurrentState({item, stateGetters})}
              renderRightComponent={renderRightComponent}
              onUserPressed={onUserPressed}
              showBadgeCheck={showBadgeCheck}
              badgeProps={badgeProps}
              showUserJoinDate={showUserJoinDate}
            />
          </ItemErrorBoundary>
        )}
        keyExtractor={keyExtractor}
        // onRefresh={this.fetchTop}
        refreshing={(!!externalDataSource || !!data) && isFetchingTop}
        onEndReached={this.fetchBottom}
        onEndReachedThreshold={0.5}
        ListFooterComponent={this.renderFooter}
        ListHeaderComponent={null}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode={'on-drag'}
        getItemCount={(data) => (data ? data.length : 0)}
        getItem={(data, index) => data[index]}
        ListEmptyComponent={this.renderListEmptyComponent()}
      />
    );
  }

  componentDidMount() {
    // this.fetchTop();
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(this.props.apiQuery) !== JSON.stringify(prevProps.apiQuery)
    ) {
      //   this.fetchTop();
    }
  }

  renderListEmptyComponent = () => {
    const {
      data,
      externalDataSource,
      ListEmptyComponent,
      ListLoadingComponent,
    } = this.props;
    if (!ListLoadingComponent && !externalDataSource && !data) {
      return (
        <View style={styles.searchModeSpinner}>
          <Spinner size="large" />
        </View>
      );
    } else if (
      (externalDataSource && !externalDataSource.length) ||
      (data && !data.length)
    ) {
      return ListEmptyComponent;
    } else {
      return ListLoadingComponent;
    }
  };

  renderFooter = () => {
    const {isFetchingBottom, hasMore} = this.props;
    if (isFetchingBottom && hasMore) {
      return (
        <View style={styles.footer}>
          <Spinner size="large" />
        </View>
      );
    }
    return null;
  };

  fetchTop = () => {
    // const { reducerStatePath, apiQuery, fetchTop } = this.props;
    // fetchTop({ reducerStatePath, query: apiQuery, resetData: true });
  };

  fetchBottom = () => {
    // const { reducerStatePath, apiQuery, fetchBottom } = this.props;
    // fetchBottom({ reducerStatePath, query: apiQuery });
  };

  getItemCurrentState = ({item, stateGetters}) => {
    let state = -1;
    let res;
    stateGetters.every((getter, index) => {
      res = !!getter(item);
      state = res ? index : state;
      return !res;
    });
    return state;
  };
}

UsersList.propTypes = {
  stateComponents: PropTypes.arrayOf(PropTypes.func),
  stateGetters: PropTypes.array,
  renderRightComponent: PropTypes.func,
  keyExtractor: PropTypes.func,
  data: PropTypes.array,
  externalDataSource: PropTypes.array,
  extraData: PropTypes.object,
  isFetchingTop: PropTypes.bool,
  ListEmptyComponent: PropTypes.node,
  ListLoadingComponent: PropTypes.node,
  reducerStatePath: PropTypes.string,
  apiQuery: PropTypes.object,
  //   fetchTop: PropTypes.func,
  fetchBottom: PropTypes.func,
  isFetchingBottom: PropTypes.bool,
  hasMore: PropTypes.bool,
  onUserPressed: PropTypes.func,
  showBadgeCheck: PropTypes.func,
  badgeProps: PropTypes.shape({
    name: PropTypes.string,
    color: PropTypes.string,
    position: PropTypes.string,
  }),
  showUserJoinDate: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  data: get(state, `${ownProps.reducerStatePath}.data`),
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
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(UsersList);
