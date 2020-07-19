import {apiQuery} from '../apiQuery/actions';
import {apiCommand} from '../apiCommands/actions';
import {addPost} from '../feed/actions';

import {analytics} from '../../infra/reporting';
import {get} from '../../infra/utils';

export const GET_POST_PENDING = 'GET_POST_PENDING';
export const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
export const GET_POST_FAILURE = 'GET_POST_FAILURE';
export const UPDATE_POST = 'UPDATE_POST';
export const DELETE_POST = 'DELETE_POST';

export const LIKE_SINGLE_POST = 'LIKE_SINGLE_POST';
export const SAVE_SINGLE_POST = 'SAVE_SINGLE_POST';

export const updatePost = ({
  id,
  payload,
  link,
  mentionsList,
  tags,
  postLocation,
  contextCountryCode,
}) => (dispatch) => {
  dispatch({
    type: UPDATE_POST,
    payload: {
      id,
      payload,
      link,
      mentionsList,
      tags,
      postLocation,
      contextCountryCode,
    },
  });
};

export const deletePost = ({postId, entityId}) => (dispatch) => {
  dispatch({type: DELETE_POST, payload: {postId, entityId}});
};

export const getPost = ({postId}) => (dispatch) => {
  dispatch({type: GET_POST_PENDING, payload: {postId}});

  return new Promise((resolve, reject) => {
    dispatch(
      apiQuery({query: {domain: 'posts', key: 'getPost', params: {postId}}}),
    )
      .then((res) => {
        dispatch({
          type: GET_POST_SUCCESS,
          payload: res.data.data,
        });
        resolve();
      })
      .catch((err) => {
        dispatch({
          type: GET_POST_FAILURE,
          payload: {
            postId,
            query: 'posts.getPost',
            err,
          },
        });
        reject(err);
      });
  });
};

export const likeSinglePost = ({contextPostId, postId, actor}) => ({
  type: LIKE_SINGLE_POST,
  payload: {
    contextPostId,
    postId,
    actor,
  },
});

export const saveSinglePost = ({contextPostId, postId, actor}) => ({
  type: SAVE_SINGLE_POST,
  payload: {
    contextPostId,
    postId,
    actor,
  },
});

export const createPostDispathcher = async ({
  dispatch,
  data,
  analyticsData,
  callback = addPost,
  additionalData = {},
}) => {
  let post;
  try {
    post = await dispatch(apiCommand('posts.create', data));
    const {id, scheduledDate} = post.data.data;
    const {
      contextType,
      contextId,
      postType,
      postSubType,
      sharedEntityId,
      sharedEntityType,
    } = data;
    if (analyticsData) {
      const {
        postCreatorId,
        postCreatorName,
        contextName,
        numberOfChars,
        mentions,
        screenName,
        origin,
        isPassive = false,
        activationPostData,
        activationType,
        activationSubType,
        tags,
      } = analyticsData;

      analytics.actionEvents
        .postCreation({
          success: true,
          postId: id,
          postType,
          postSubType,
          containsMedia: !!get(data, 'mediaGallery.length'),
          postCreatorId,
          postCreatorName,
          contextId,
          contextType,
          contextName,
          numberOfChars,
          hasMentions: !!(mentions && mentions.length),
          mentions,
          sharedEntityId,
          sharedEntityType,
          creatorEntityType: contextType,
          screenName,
          origin,
          entityId: id,
          isPassive,
          activationPostData,
          scheduledDate,
          activationType,
          activationSubType,
          tags,
        })
        .dispatch();
    }

    callback && dispatch(callback({post: post.data.data, additionalData}));
  } catch (err) {
    analytics.actionEvents
      .postCreation({
        success: false,
        failureReason: err.toString(),
      })
      .dispatch();
    throw err;
  }

  return post;
};

export const createPost = ({
  data,
  additionalData = {},
  analyticsData,
}) => async (dispatch) =>
  createPostDispathcher({
    dispatch,
    data,
    analyticsData,
    callback: addPost,
    additionalData,
  });
