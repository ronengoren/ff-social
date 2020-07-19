import {analytics} from '/infra/reporting';
import {isObjectID} from '/infra/utils/stringUtils';
import {entityTypes} from '/vars/enums';

class ViewCounts {
  static sendItemsBatchSize = 3;
  static minTimeDiff = 1000 * 60;

  viewedPosts = [];
  viewedPostsToSend = [];

  postViewabilityConfig = {
    minimumViewTime: 1000,
    itemVisiblePercentThreshold: 50,
  };

  handleFeedViewableItemsChange = ({changed}) => {
    changed.forEach((item) => {
      if (isObjectID(item.item)) {
        this.handlePostViewEvent({id: item.item});
      }
    });
  };

  handlePostViewEvent({id, timestamp = Date.now()}) {
    const samePostPreviousEvents = this.viewedPosts
      .filter((vp) => vp.id === id)
      .sort((a, b) => a.timestamp - b.timestamp);
    const previousTime =
      samePostPreviousEvents[0] && samePostPreviousEvents[0].timestamp;
    const shouldCountEvent =
      !previousTime || timestamp - previousTime > ViewCounts.minTimeDiff;

    if (shouldCountEvent) {
      this.addPostView({id, timestamp});
    }
  }

  addPostView({id, timestamp}) {
    this.viewedPosts.push({id, timestamp});
    this.viewedPostsToSend.push({id, timestamp});

    if (this.viewedPostsToSend.length >= ViewCounts.sendItemsBatchSize) {
      this.sendItems();
    }

    this.handleSharedPostViewEvent({id, timestamp});
  }

  handleSharedPostViewEvent = ({id, timestamp}) => {
    const state = global.store.getState();
    const parentPost = state.posts.byId[id];

    if (
      parentPost &&
      parentPost.sharedEntity &&
      parentPost.sharedEntity.entityType === entityTypes.POST
    ) {
      this.handlePostViewEvent({
        id: parentPost.sharedEntity.entityId,
        timestamp,
      });
    }
  };

  sendItems = () => {
    if (this.viewedPostsToSend.length) {
      //   analytics.viewEvents.postsViews({ posts: this.viewedPostsToSend }).dispatch();
      this.viewedPostsToSend = [];
    }
  };
}

export default new ViewCounts();
