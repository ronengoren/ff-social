import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {ItemErrorBoundary, InfiniteScroll} from '../../components';
import {itemsSortTypes} from '../../vars/enums';
import PollItem from './PollItem';

class PollItems extends Component {
  static getApiQuery = ({maxVisibleItems, entityId}) => ({
    domain: 'lists',
    key: 'getListItems',
    params: {
      perPage: maxVisibleItems || 20,
      page: 2,
      listId: entityId,
      sortBy: itemsSortTypes.VOTERS,
    },
  });

  render() {
    const {data, maxVisibleItems, isPostPage, ListFooterComponent} = this.props;
    const {
      sharedEntity: {entity, entityId},
    } = data;
    const {totalItems} = entity;
    const {itemDimension} = PollItem;

    return (
      <InfiniteScroll
        listType="flat"
        testID="listPollItemScrollList"
        reducerStatePath={this.getReducerStatePath()}
        apiQuery={PollItems.getApiQuery({maxVisibleItems, entityId})}
        ListItemComponent={this.renderItem}
        showRefreshingSpinner={false}
        getItemLayout={(data, index) => ({
          length: itemDimension,
          offset: itemDimension * index,
          index,
        })}
        disableFetchBottom={!isPostPage}
        disableInitialFetch
        ListFooterComponent={
          totalItems > maxVisibleItems && ListFooterComponent
        }
      />
    );
  }

  getVotePercentage = (totalValue, partialValue) =>
    totalValue > 0 ? (partialValue / totalValue) * 100 : 0;

  getReducerStatePath = () => {
    const {data, isPostPage} = this.props;
    const {
      sharedEntity: {entityId},
    } = data;
    return isPostPage
      ? `postPage.${data.id}.post.sharedEntity.entity.items`
      : `lists.byId.${entityId}.items`;
  };

  renderItem = ({data: item, index}) => {
    const {
      data,
      maxVisibleItems,
      onSelectionPress,
      sortByVotes,
      isPostPage,
    } = this.props;
    const {
      sharedEntity: {entity},
    } = data;
    const {totalVotes: totalListVotes, totalItems} = entity;

    if (index + 1 > maxVisibleItems) {
      return null;
    }

    const {totalVotes} = item;

    return (
      <ItemErrorBoundary boundaryName="ListItemEntitySuggestedItem">
        <PollItem
          isLast={index + 1 === maxVisibleItems || index + 1 === totalItems}
          listId={entity.id}
          votersPercentage={this.getVotePercentage(totalListVotes, totalVotes)}
          animateEnter={!isPostPage}
          sortByVotes={sortByVotes}
          item={item}
          totalListVotes={totalListVotes}
          onPressItem={onSelectionPress}
          isPostPage={isPostPage}
        />
      </ItemErrorBoundary>
    );
  };
}

PollItems.propTypes = {
  data: PropTypes.object,
  sortByVotes: PropTypes.bool,
  isPostPage: PropTypes.bool,
  maxVisibleItems: PropTypes.number,
  onSelectionPress: PropTypes.func.isRequired,
  ListFooterComponent: PropTypes.node,
};

const mapStateToProps = (state) => ({
  userCommunity: state.auth.user.community,
});

PollItems = connect(mapStateToProps)(PollItems);

export default PollItems;
