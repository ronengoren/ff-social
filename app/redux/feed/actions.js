import {apiCommand} from '../apiCommands/actions';
import {handleNormalizedData} from '../normalizer';
import {
  updatePostState as updateResultsPostState,
  deletePost as deleteResultsPost,
  updatePost as updateResultsPost,
} from '../results/actions';
import {updatePost as updateGroupHighlightedPost} from '../groups/actions';
import {
  likeSinglePost,
  saveSinglePost,
  updatePost as updatePostPage,
  deletePost as deletePostPage,
} from '../postPage/actions';
import {likeSuggestedItem} from '../suggestedItems/actions';
import {get, isEmpty} from '../../infra/utils';
import {feedEventTypes} from '../../vars/enums';
import {analytics, Logger} from '../../infra/reporting';

export const UPDATE_SHARED_EVENT_RSVP = 'UPDATE_SHARED_EVENT_RSVP';
export const HIDE_POST_FROM_FEED = 'HIDE_POST_FROM_FEED';
export const SAVE_POST = 'SAVE_POST';
export const LIKE_POST = 'LIKE_POST';
export const ADD_POST = 'ADD_POST';
export const UPDATE_POST = 'UPDATE_POST';
export const DELETE_POST = 'DELETE_POST';
export const UPDATE_FRIENDSHIP_STATUS = 'UPDATE_FRIENDSHIP_STATUS';
export const BOOST_UP = 'BOOST_UP';
export const BOOST_DOWN = 'BOOST_DOWN';

export const UPDATE_POST_MEDIA_GALLERY = 'UPDATE_POST_MEDIA_GALLERY';
export const updatePostMediaGallery = ({postId, mediaGallery}) => (
  dispatch,
) => {
  dispatch({type: UPDATE_POST_MEDIA_GALLERY, payload: {postId, mediaGallery}});
};

export const listItemUpdateTransformer = ({state, action}) => {
  if (state.data && state.data.length) {
    const {entityId, saved, actor} = action.payload;
    const index = state.data.findIndex((post) => {
      const id = get(post, 'payload.templateData.entity.id', -1);
      return id === entityId;
    });
    if (index !== -1) {
      const savers = state.data[index].payload.templateData.entity.savers || [];
      let saversList = [...savers];
      const oldSaves = state.data[index].payload.templateData.entity.saves || 0;
      const saves = oldSaves + (saved ? 1 : -1);
      if (!saved) {
        saversList = saversList.filter((saver) => saver.id !== actor.id);
      } else {
        saversList.splice(0, 0, actor);
      }
      return {
        ...state,
        data: [
          ...state.data.slice(0, index),
          {
            ...state.data[index],
            payload: {
              ...state.data[index].payload,
              templateData: {
                ...state.data[index].payload.templateData,
                entity: {
                  ...state.data[index].payload.templateData.entity,
                  saved,
                  saves,
                  savers: saversList,
                },
              },
            },
            saved,
            saves,
            savers: saversList,
          },
          ...state.data.slice(index + 1),
        ],
      };
    }
    return state;
  }
  return state;
};

const updatePostState = ({
  contextPost,
  postId,
  actor,
  actionName,
  actionCountName,
  actionActorsName,
}) => (data) => {
  let index;
  const isSharedPost = contextPost.id !== postId;
  if (isSharedPost) {
    index = data.findIndex((post) => post.id === contextPost.id);
  } else {
    index = data.findIndex((post) => post.id === postId);
  }
  if (index === -1) {
    return data;
  }
  const updatedPost = JSON.parse(JSON.stringify(data[index]));
  const post = isSharedPost
    ? updatedPost.sharedEntity.entity.post
    : updatedPost;
  post[actionCountName] += post[actionName] ? -1 : 1;
  post[actionName] = !post[actionName];
  if (post[actionActorsName]) {
    if (post[actionName]) {
      post[actionActorsName].splice(0, 0, actor);
    } else {
      post[actionActorsName] = post[actionActorsName].filter(
        (user) => user.id !== actor.id,
      );
    }
  }
  if (isSharedPost) {
    return [
      ...data.slice(0, index),
      {
        ...updatedPost,
        sharedEntity: {...updatedPost.sharedEntity, entity: {post}},
      },
      ...data.slice(index + 1, data.length),
    ];
  }
  return [
    ...data.slice(0, index),
    updatedPost,
    ...data.slice(index + 1, data.length),
  ];
};

const likeSavePost = ({
  transformer,
  postPageUpdateFunc,
  contextPost,
  postId,
  entityId,
  actor,
  postType,
}) => async (dispatch, getState) => {
  const state = getState();
  const {results} = state;
  const suggestedItems = get(state, `suggestedItems.${postType}.data`, []);
  const postPage = state.postPage[contextPost.id];
  const groupsHighlightedEntities = get(
    state,
    `groups.highlightedEntities[${entityId}].data`,
    [],
  );

  if (results && results.data) {
    dispatch(updateResultsPostState(transformer));
  }
  if (postPage) {
    dispatch(
      postPageUpdateFunc({contextPostId: contextPost.id, postId, actor}),
    );
  }

  if (suggestedItems.length) {
    dispatch(likeSuggestedItem({transformer, suggestedItemType: postType}));
  }

  if (groupsHighlightedEntities.length) {
    dispatch(updateGroupHighlightedPost({entityId, postId, transformer}));
  }
};

export const likePost = ({
  contextPost,
  postId,
  liked,
  entityId,
  actor,
  postType,
  originType,
  componentName,
  entityType,
  entitySubType,
  entitySubSubType,
  creator,
}) => async (dispatch) => {
  const command = !liked ? 'posts.like' : 'posts.unlike';

  dispatch({type: LIKE_POST, payload: {contextPost, postId, actor}});
  const transformer = updatePostState({
    contextPost,
    postId,
    actor,
    actionName: 'liked',
    actionCountName: 'likes',
    actionActorsName: 'likers',
  });
  dispatch(
    likeSavePost({
      command,
      transformer,
      postPageUpdateFunc: likeSinglePost,
      contextPost,
      postId,
      entityId,
      actor,
      postType,
    }),
  );

  try {
    await dispatch(apiCommand(command, {postId}));
    const analyticsAction = !liked ? 'thanksAction' : 'unThanksAction';
    analytics.actionEvents[analyticsAction]({
      actorId: actor.id,
      actorName: actor.name,
      screenCollection: originType,
      componentName,
      entityType,
      entitySubType,
      entitySubSubType,
      entityId: postId,
      creatorName: creator.name,
      creatorId: creator.id,
    }).dispatch();
  } catch (err) {
    Logger.error({errType: 'optimisticRendering', action: 'likePost', err});
  }
};

export const hidePost = (id) => ({
  type: HIDE_POST_FROM_FEED,
  payload: {postId: id},
});

// context - represents where the post is at (group, event etc...)
// contextPost - the post where the save is at
export const toggleSavePost = ({
  context,
  contextPost,
  postId,
  actor,
  postType,
}) => (dispatch) => {
  const transformer = updatePostState({
    contextPost,
    postId,
    actor,
    actionName: 'saved',
    actionCountName: 'saves',
    actionActorsName: 'savers',
  });

  dispatch({type: SAVE_POST, payload: {contextPost, postId, actor}});
  dispatch(
    likeSavePost({
      transformer,
      postPageUpdateFunc: saveSinglePost,
      contextPost,
      postId,
      entityId: context.id,
      actor,
      postType,
    }),
  );
};

export const boostUpPost = ({postId}) => async (dispatch) => {
  dispatch(apiCommand('posts.contentQuality', {postId, direction: '1'}));
  dispatch({type: BOOST_UP, payload: {postId}});
};

export const boostDownPost = ({postId}) => async (dispatch) => {
  dispatch(apiCommand('posts.contentQuality', {postId, direction: '-1'}));
  dispatch({type: BOOST_DOWN, payload: {postId}});
};

export const addPost = ({post, additionalData}) => (dispatch) => {
  const newPost = {...post, eventType: feedEventTypes.POST};

  handleNormalizedData({data: [newPost], normalizedSchema: 'FEED', dispatch});
  dispatch({type: ADD_POST, payload: {newPost, additionalData}});
};

export const updatePost = ({
  contextEntityId,
  id,
  payload,
  link,
  mentionsList,
  tags,
  postLocation,
  contextCountryCode,
}) => (dispatch, getState) => {
  const state = getState();
  const postPage = get(state, `postPage.${id}.post`);

  dispatch({
    type: UPDATE_POST,
    payload: {
      entityId: contextEntityId,
      id,
      payload,
      link,
      mentionsList,
      tags,
      postLocation,
      contextCountryCode,
    },
  });

  if (state.results && state.results.data) {
    dispatch(
      updateResultsPost({
        id,
        payload,
        link,
        mentionsList,
        postLocation,
        contextCountryCode,
      }),
    );
  }

  if (!isEmpty(postPage)) {
    dispatch(
      updatePostPage({
        id,
        payload,
        link,
        mentionsList,
        tags,
        postLocation,
        contextCountryCode,
      }),
    );
  }
};

export const deletePost = ({postId, entityId}) => async (
  dispatch,
  getState,
) => {
  await dispatch(apiCommand('posts.delete', {postId}));
  const state = getState();
  dispatch(deletePostPage({postId, entityId}));

  if (state.results && state.results.data) {
    dispatch(deleteResultsPost(postId));
  }
};

export const removeFromFeed = ({postId, entityId}) => async (
  dispatch,
  getState,
) => {
  await dispatch(apiCommand('posts.removeFromFeed', {postId}));
  const state = getState();
  dispatch(deletePostPage({postId, entityId}));

  if (state.results && state.results.data) {
    dispatch(deleteResultsPost(postId));
  }
};

export const updateSharedEventPostRSVP = ({
  postId,
  contextEntityId,
  rsvpStatus,
  rsvpCounts,
  invitees,
}) => (dispatch) => {
  dispatch({
    type: UPDATE_SHARED_EVENT_RSVP,
    payload: {
      entityId: contextEntityId,
      postId,
      rsvpStatus,
      rsvpCounts,
      invitees,
    },
  });
};

export const updateFriendshipStatus = ({postId, friendshipStatus}) => (
  dispatch,
) => {
  dispatch({
    type: UPDATE_FRIENDSHIP_STATUS,
    payload: {postId, friendshipStatus},
  });
};
