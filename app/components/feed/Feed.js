import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {View, Text} from '../basicComponents';
import {InfiniteScroll, ScreenErrorBoundary} from '../../components';
import FeedItem from './FeedItem';
import {EntitiesLoadingState} from '../../components/entity';
import {boundaryNames, originTypes} from '../../vars/enums';
import ViewCountsService from '../../infra/viewCounts';

class Feed extends Component {
  render() {
    const {showErrorPageOnFail} = this.props;

    if (showErrorPageOnFail) {
      return (
        <ScreenErrorBoundary boundaryName={boundaryNames.FEED}>
          {this.renderList()}
        </ScreenErrorBoundary>
      );
    } else {
      return this.renderList();
    }
  }
  renderList = () => {
    const {
      showErrorPageOnFail,
      apiQuery,
      reducerStatePath,
      screenContextType,
      screenContextId,
      scrollToFeedTop,
      activeHomeTab,
      hiddenPinnedPosts,
      ListHeaderComponent,
      ListEmptyComponent,
      originType,
      extraTopComponent,
      ...props
    } = this.props;

    return (
      <InfiniteScroll
        ref={(node) => {
          this.infiniteScroll = node;
        }}
        ListItemComponent={FeedItem}
        listItemProps={{
          screenContextType,
          screenContextId,
          scrollToFeedTop,
          activeHomeTab,
          refreshFeed: this.refreshFeed,
          originType,
        }}
        apiQuery={apiQuery}
        reducerStatePath={reducerStatePath}
        keyExtractor={this.keyExtractor}
        ListLoadingComponent={
          <EntitiesLoadingState key="entitiesLoadingState" />
        }
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        viewabilityConfig={ViewCountsService.postViewabilityConfig}
        extraTopComponent={extraTopComponent}
        options={{removeDuplicatePinnedPosts: true}}
        {...props}
      />
    );
  };
  scrollToIndex = ({index}) => {
    this.infiniteScroll && this.infiniteScroll.scrollToIndex({index});
  };

  scrollToOffset = ({offset}) => {
    this.infiniteScroll && this.infiniteScroll.scrollToOffset({offset});
  };

  refreshFeed = () => {
    this.infiniteScroll.fetchTop();
  };

  keyExtractor = (i, index) => {
    const {stickyHeader} = this.props;
    if (i.nonListItem) {
      return i.component.key;
    }

    const adjustedIndex = stickyHeader ? index - 1 : index;
    const key = i.id || i;
    return adjustedIndex === 0 && typeof key === 'string'
      ? `possiblyPinned-${key}`
      : key;
  };
}

Feed.defaultProps = {
  showErrorPageOnFail: true,
};

Feed.propTypes = {
  apiQuery: PropTypes.object,
  reducerStatePath: PropTypes.string,
  screenContextType: PropTypes.string,
  screenContextId: PropTypes.string,
  componentRef: PropTypes.func,
  scrollToFeedTop: PropTypes.func,
  activeHomeTab: PropTypes.string,
  originType: PropTypes.oneOf(Object.values(originTypes)),
  showErrorPageOnFail: PropTypes.bool,
  hiddenPinnedPosts: PropTypes.arrayOf(PropTypes.string),
  ListHeaderComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  ListEmptyComponent: PropTypes.node,
  stickyHeader: PropTypes.node,
  extraTopComponent: PropTypes.node,
};

const mapStateToProps = (state) => ({
  // hiddenPinnedPosts: state.auth.hiddenPinnedPosts,
});

export default connect(mapStateToProps, null, null, {forwardRef: true})(Feed);
