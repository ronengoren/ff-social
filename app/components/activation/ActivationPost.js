import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import I18n from '../../infra/localization';
// import { likePost } from '/redux/feed/actions';
// import { inviteFriendRequest, approveFriendRequest, declineFriendRequest } from '/redux/friendships/actions';
import {get} from '../../infra/utils';
import {PostContent, PostFooter} from '../../components';
// import { EntityAction } from '/components/entity';
import {View} from '../basicComponents';
import {flipFlopColors, commonStyles} from '../../vars';
import {postTypes, entityTypes, originTypes} from '../../vars/enums';
import {PostContentMedia} from '../posts';
// import ActivationHeader from '../feed/ActivationHeader';
// import ActivationPostSeeMoreFooter from './ActivationPostSeeMoreFooter';

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 15,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 15,
    backgroundColor: flipFlopColors.white,
  },
  postPageWrapper: {
    marginTop: 0,
    marginHorizontal: 0,
    borderRadius: 0,
  },
  separator: {
    height: 1,
    marginHorizontal: 15,
    backgroundColor: flipFlopColors.b90,
  },
  textWrapper: {
    marginHorizontal: 15,
    marginVertical: 10,
  },
});

class ActivationPost extends React.Component {
  render() {
    const {
      screenContextId,
      screenContextType,
      data,
      appUser,
      isPostPage,
      hiddenPosts,
      originType,
    } = this.props;
    const {
      actor,
      context,
      id: postId,
      mentions,
      numOfSimilarPosts,
      payload,
    } = data;
    const {
      title,
      text,
      mediaGallery,
      totalMediaItems,
      templateData = {},
    } = payload;
    const {activationId} = templateData;

    const {id, name} = actor;
    const isPostOwner = id === appUser.id;

    if (!data || hiddenPosts[data.id] || !title) {
      return null;
    }

    return (
      <View
        style={[
          styles.wrapper,
          isPostPage && styles.postPageWrapper,
          commonStyles.shadow,
        ]}>
        {/* <ActivationHeader
          screenContextId={screenContextId}
          screenContextType={screenContextType}
          context={context}
          actor={actor}
          title={title}
          subTitle={I18n.t('posts.activation.post_actor_header', { name })}
          post={data}
          isPostPage={isPostPage}
        /> */}
        <View style={styles.textWrapper}>
          {PostContent.renderPostText({
            id,
            text,
            mentions,
            contentType: postTypes.ACTIVATION,
            isPostPage,
          })}
        </View>
        <PostContentMedia
          mediaGallery={mediaGallery}
          totalMediaItems={totalMediaItems}
          contentType={postTypes.ACTIVATION}
          isPostPage={isPostPage}
          postId={postId}
        />
        {isPostOwner ? (
          <View style={styles.separator} />
        ) : (
          {
            /* <EntityAction
            data={data}
            actor={actor}
            context={data}
            contextPost={data}
            contentType={postTypes.ACTIVATION}
            entityType={entityTypes.POST}
            size={EntityAction.sizes.BIG}
          /> */
          }
        )}
        <PostFooter post={data} isPostPage={isPostPage} />
        {/* <ActivationPostSeeMoreFooter data={data} activationId={activationId} count={numOfSimilarPosts} title={title} originType={originType} /> */}
      </View>
    );
  }
}

ActivationPost.propTypes = {
  appUser: PropTypes.object,
  data: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    about: PropTypes.string,
    payload: PropTypes.object,
    context: PropTypes.object,
    actor: PropTypes.object,
    mentions: PropTypes.array,
    numOfSimilarPosts: PropTypes.number,
  }),
  isPostPage: PropTypes.bool,
  hiddenPosts: PropTypes.object,
  originType: PropTypes.oneOf(Object.values(originTypes)),
  screenContextId: PropTypes.string,
  screenContextType: PropTypes.string,
};

const mapStateToProps = (state) => ({
  appUser: state.auth.user,
  hiddenPosts: get(state, 'auth.hiddenPosts'),
});

const mapDispatchToProps = {
  //   likePost,
  //   inviteFriendRequest,
  //   approveFriendRequest,
  //   declineFriendRequest
};

ActivationPost = connect(mapStateToProps, mapDispatchToProps)(ActivationPost);
export default ActivationPost;
