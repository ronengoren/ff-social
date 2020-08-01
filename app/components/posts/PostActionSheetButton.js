import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {apiCommand} from '/redux/apiCommands/actions';
// import { openActionSheet, closeActionSheet } from '/redux/general/actions';
// import { deletePost, removeFromFeed, boostUpPost, boostDownPost } from '/redux/feed/actions';
// import { deleteScheduledPost } from '/redux/scheduledPosts/actions';
// import { setHiddenPinnedItems } from '/redux/auth/actions';
// import { highlightEntity, dehighlightEntity } from '/redux/groups/actions';
import {IconButton} from '../basicComponents';
// import { postActionSheetDefinition } from '/components/posts';
// import { reportActionSheetDefinition } from '/common/actionsheets';
import {
  screenNames,
  entityTypes,
  postTypes,
  reportTypes,
} from '../../vars/enums';
// import { hiddenPinnedItems as hiddenPinnedItemsLocalStorage } from '/infra/localStorage';
import {get, isAppAdmin} from '../../infra/utils';
import {navigationService} from '../../infra/navigation';
import {userScheme, mentionsSchema} from '../../schemas/common';

class PostActionSheetButton extends React.Component {
  render() {
    const {style, iconSize, iconColor, iconName, isAwesomeIcon} = this.props;

    return (
      <IconButton
        isAwesomeIcon={isAwesomeIcon}
        name={iconName}
        iconColor={iconColor}
        iconSize={iconSize}
        onPress={this.onMenuClick}
        testID="postHeaderMoreBtn"
        style={style}
      />
    );
  }

  onMenuClick = () => {
    // const {
    //   post,
    //   user,
    //   openActionSheet,
    //   post: { hasPermissions, context, actor },
    //   activeHomeTab
    // } = this.props;
    // const isAdmin = isAppAdmin(user);
    // const actionSheet = postActionSheetDefinition({
    //   contextEntityId: context.id,
    //   contextEntityType: context.type,
    //   contextEntityName: context.name,
    //   publishAs: actor,
    //   onReport: () => this.handleAbusiveReport(isAdmin),
    //   post,
    //   userId: user.id,
    //   enterDeleteMode: this.onDelete,
    //   hasPermissions,
    //   activeHomeTab,
    //   onHidePinnedPost: this.handleHidePinnedPost,
    //   onHighlight: this.handleHighlightPost,
    //   onDehighlight: this.handleDehighlightPost,
    //   onPin: this.handlePinPost,
    //   onUnpin: this.handleUnpinPost,
    //   onBoostUp: isAdmin && this.handleBoostUpPost,
    //   onBoostDown: isAdmin && this.handleBoostDownPost,
    //   canReportBadContent: isAdmin,
    //   canAddToStory: isAdmin
    // });
    // openActionSheet(actionSheet);
  };

  handleAbusiveReport = (isAdmin) => {
    // const { post, closeActionSheet } = this.props;
    // const formSheetHandler = reportActionSheetDefinition({
    //   entityType: entityTypes.POST,
    //   entityId: post.id,
    //   reports: isAdmin ? [reportTypes.BAD_CONTENT] : undefined
    // });
    // const formSheet = formSheetHandler({});
    // closeActionSheet();
    // navigationService.navigate(screenNames.AbusiveReportForm, { formSheet, entityType: entityTypes.POST, entityId: post.id });
  };

  onDelete = (removeFromFeedOnly = false) => {
    // const { post, user, openActionSheet } = this.props;
    // const actionSheet = postActionSheetDefinition({
    //   deletePostMode: { removeFromFeedOnly },
    //   onReport: this.onReport,
    //   post,
    //   userId: user.id,
    //   deletePost: this.handlePostDeletion
    // });
    // openActionSheet(actionSheet);
  };

  handlePostDeletion = async (removeFromFeedOnly = false) => {
    // const {
    //   isPostPage,
    //   deletePost,
    //   removeFromFeed,
    //   deleteScheduledPost,
    //   post: { id, context, scheduledDate }
    // } = this.props;
    // if (scheduledDate) {
    //   deleteScheduledPost({ postId: id });
    // } else {
    //   const action = removeFromFeedOnly ? removeFromFeed : deletePost;
    //   action({ postId: id, entityId: context && context.id });
    // }
    // if (isPostPage) {
    //   navigationService.goBack();
    // }
  };

  handleHidePinnedPost = async () => {
    // const {
    //   post: { id },
    //   setHiddenPinnedItems
    // } = this.props;
    // await hiddenPinnedItemsLocalStorage.add(id);
    // setHiddenPinnedItems();
  };

  handleHighlightPost = () => {
    // const {
    //   highlightEntity,
    //   post: {
    //     id,
    //     context,
    //     payload: { postType },
    //     sharedEntity,
    //     eventType
    //   },
    //   post
    // } = this.props;
    // let entityId;
    // let entityType;
    // let entityData;
    // if (postType === postTypes.SHARE) {
    //   ({ entityId, entityType } = sharedEntity);
    //   if (entityType === entityTypes.PAGE) {
    //     entityData = sharedEntity.entity.page;
    //   } else if (entityType === entityTypes.POST) {
    //     entityData = sharedEntity.entity.post;
    //   } else {
    //     entityData = sharedEntity.entity;
    //   }
    // } else {
    //   entityId = id;
    //   entityType = eventType;
    //   entityData = post;
    // }
    // highlightEntity({ groupId: context.id, entityId, entityType, entityData });
  };

  handleDehighlightPost = () => {
    // const {
    //   dehighlightEntity,
    //   post: {
    //     id,
    //     context,
    //     payload: { postType },
    //     sharedEntity,
    //     eventType
    //   }
    // } = this.props;
    // const entityId = sharedEntity && sharedEntity.entity && sharedEntity.highlighted ? sharedEntity.entity.id : id;
    // const entityType = postType === postTypes.SHARE ? sharedEntity.entityType : eventType;
    // dehighlightEntity({ groupId: context.id, entityId, entityType });
  };

  handlePinPost = async () => {
    const {
      apiCommand,
      refreshFeed,
      post: {id},
    } = this.props;
    await apiCommand('posts.pin', {postId: id});
    refreshFeed();
  };

  handleUnpinPost = async () => {
    const {
      apiCommand,
      refreshFeed,
      post: {id},
    } = this.props;
    await apiCommand('posts.unpin', {postId: id});
    refreshFeed();
  };

  handleBoostUpPost = async () => {
    // const {
    //   post: { id },
    //   boostUpPost
    // } = this.props;
    // boostUpPost({ postId: id });
  };

  handleBoostDownPost = async () => {
    //     const {
    //       post: { id },
    //       boostDownPost
    //     } = this.props;
    //     boostDownPost({ postId: id });
  };
}

PostActionSheetButton.propTypes = {
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.array,
    PropTypes.object,
  ]),
  post: PropTypes.shape({
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
    }),
    context: PropTypes.object,
    liked: PropTypes.bool,
    likes: PropTypes.number,
    comments: PropTypes.number,
    mentions: mentionsSchema,
    sharedEntity: PropTypes.shape({
      entityId: PropTypes.string,
      entityType: PropTypes.string,
      entity: PropTypes.object,
      highlighted: PropTypes.bool,
    }),
    hasPermissions: PropTypes.array,
    id: PropTypes.string,
    scheduledDate: PropTypes.string,
    eventType: PropTypes.string,
  }),
  activeHomeTab: PropTypes.string,
  refreshFeed: PropTypes.func,
  user: userScheme,
  isPostPage: PropTypes.bool,
  //   deletePost: PropTypes.func,
  //   removeFromFeed: PropTypes.func,
  //   boostUpPost: PropTypes.func,
  //   boostDownPost: PropTypes.func,
  //   deleteScheduledPost: PropTypes.func,
  //   openActionSheet: PropTypes.func,
  //   closeActionSheet: PropTypes.func,
  //   setHiddenPinnedItems: PropTypes.func,
  apiCommand: PropTypes.func,
  //   highlightEntity: PropTypes.func,
  //   dehighlightEntity: PropTypes.func,
  iconColor: PropTypes.string,
  iconName: PropTypes.string,
  iconSize: PropTypes.number,
  isAwesomeIcon: PropTypes.bool,
};

PostActionSheetButton.defaultProps = {
  iconSize: 22,
  iconColor: 'b80',
  iconName: 'more',
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  userHood: get(state, 'auth.user.journey.neighborhood', null),
});

const mapDispatchToProps = {
  //   openActionSheet,
  //   closeActionSheet,
  //   deletePost,
  //   removeFromFeed,
  //   boostUpPost,
  //   boostDownPost,
  //   deleteScheduledPost,
  //   setHiddenPinnedItems,
  //   apiCommand,
  //   highlightEntity,
  //   dehighlightEntity
};

PostActionSheetButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostActionSheetButton);
export default PostActionSheetButton;
