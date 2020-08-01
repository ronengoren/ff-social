import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {View} from '../basicComponents';
import {flipFlopColors} from '../../vars';
import {
  entityTypes,
  postTypes,
  listViewTypes,
  originTypes,
  passivePostSubTypes,
} from '../../vars/enums';
import {mentionsSchema} from '../../schemas/common';
import {get} from '../../infra/utils';
import {ActivationPost} from '../../components/activation';
import {PollPost} from '../../components/poll';
import {JoinedYourCommunityPost} from '../../components/joinedYourCommunity';
import {InstagramPassivePostFooter} from '../../components/instagram';
import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostFooter from './PostFooter';

const styles = StyleSheet.create({
  container: {
    backgroundColor: flipFlopColors.paleGreyTwo,
    marginHorizontal: 10,
    marginTop: 15,
    marginBottom: 10,
    borderRadius: 15,
    shadowColor: flipFlopColors.boxShadow,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 3,
  },
});

class Post extends React.Component {
  constructor(props) {
    super(props);
    const {data} = props;
    const {payload} = data;
    this.isPollPost =
      get(data, 'sharedEntity.entity.viewType') === listViewTypes.POLL &&
      get(data, 'sharedEntity.entity.items');
    this.isJoinCommunityPost =
      payload.postType === postTypes.PASSIVE_POST &&
      payload.postSubType === passivePostSubTypes.COMMUNITY_JOINED;
    this.isActivationPost = payload.postType === postTypes.ACTIVATION;
    this.isInstagramPost =
      payload.postType === postTypes.PASSIVE_POST &&
      payload.postSubType === passivePostSubTypes.INSTAGRAM_CONNECT;
  }

  static supportedPostTypes = {
    statusUpdate: true,
    tipRequest: true,
    recommendation: true,
    meeting: true,
    homeNostalgic: true,
    package: true,
    guide: true,
    entityShare: true,
    promotion: true,
    job: true,
    realEstate: true,
    giveAndTake: true,
    groupAnnouncement: true,
    passive: true,
    activation: true,
  };

  render() {
    const {
      data,
      screenContextType,
      screenContextId,
      activeHomeTab,
      refreshFeed,
      originType,
      testID,
    } = this.props;
    const {postType} = get(this.props, 'data.payload', {});
    const isEvent = get(data, 'sharedEntity.entityType') === entityTypes.EVENT;
    const isGuide = postType === postTypes.GUIDE;
    const isAlternatePostView =
      [originTypes.POST_RESULT].includes(originType) &&
      (isEvent ||
        [
          postTypes.REAL_ESTATE,
          postTypes.GIVE_TAKE,
          postTypes.JOB,
          postTypes.GUIDE,
        ].includes(postType));

    const hideShareFromFooter = isEvent || isGuide;

    if (!Post.supportedPostTypes[data.payload.postType]) {
      return null;
    }

    const {scheduledDate} = data;
    if (this.isJoinCommunityPost) {
      return <JoinedYourCommunityPost data={data} />;
    }

    if (this.isPollPost) {
      return (
        <PollPost
          data={data}
          originType={originType}
          screenContextType={screenContextType}
          screenContextId={screenContextId}
          maxVisibleItems={4}
        />
      );
    }

    if (this.isActivationPost) {
      return (
        <ActivationPost
          data={data}
          originType={originType}
          screenContextType={screenContextType}
          screenContextId={screenContextId}
        />
      );
    }

    if (this.isInstagramPost) {
      return (
        <View style={styles.container} testID={testID}>
          <PostHeader
            post={data}
            screenContextType={screenContextType}
            screenContextId={screenContextId}
            activeHomeTab={activeHomeTab}
            refreshFeed={refreshFeed}
          />
          <PostContent post={data} originType={originType} />
          <InstagramPassivePostFooter data={data} />
        </View>
      );
    }

    return (
      <View style={styles.container} testID={testID}>
        {!isAlternatePostView && (
          <PostHeader
            post={data}
            screenContextType={screenContextType}
            screenContextId={screenContextId}
            activeHomeTab={activeHomeTab}
            refreshFeed={refreshFeed}
          />
        )}
        <PostContent
          isAlternatePostView={isAlternatePostView}
          post={data}
          originType={originType}
        />
        {!scheduledDate && (
          <PostFooter
            post={data}
            originType={originType}
            isWithoutShare={hideShareFromFooter}
          />
        )}
      </View>
    );
  }
}

Post.propTypes = {
  data: PropTypes.shape({
    actor: PropTypes.shape({
      id: PropTypes.string,
      thumbnail: PropTypes.string,
      name: PropTypes.string,
    }),
    eventTime: PropTypes.string,
    payload: PropTypes.shape({
      postType: PropTypes.oneOf(Object.values(postTypes)),
      text: PropTypes.string,
      image: PropTypes.string,
      templateData: PropTypes.object,
      postSubType: PropTypes.string,
    }),
    context: PropTypes.object,
    liked: PropTypes.bool,
    likes: PropTypes.number,
    comments: PropTypes.number,
    mentions: mentionsSchema,
    hasPermissions: PropTypes.array,
    scheduledDate: PropTypes.string,
  }),
  activeHomeTab: PropTypes.string,
  refreshFeed: PropTypes.func,
  screenContextType: PropTypes.string,
  screenContextId: PropTypes.string,
  originType: PropTypes.oneOf(Object.values(originTypes)),
  testID: PropTypes.string,
};

export default Post;
