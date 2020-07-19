import {apiCommand} from '../apiCommands/actions';
import {handleNormalizedData} from '../normalizer';
import {addPost} from '../feed/actions';
import {feedEventTypes} from '../../vars/enums';
import {createPostDispathcher} from '../postPage/actions';

export const ADD_SCHEDULED_POST = 'ADD_SCHEDULED_POST';
export const UPDATE_SCHEDULED_POST = 'UPDATE_SCHEDULED_POST';
export const DELETE_SCHEDULED_POST = 'DELETE_SCHEDULED_POST';

export const addScheduledPost = ({post}) => (dispatch) => {
  const newPost = {...post, eventType: feedEventTypes.POST};
  handleNormalizedData({data: [newPost], normalizedSchema: 'FEED', dispatch});
  dispatch({type: ADD_SCHEDULED_POST, payload: {newPost}});
};

export const updateScheduledPost = ({postId, post}) => (dispatch) => {
  const {id, payload, link, mentions: mentionsList, tags, scheduledDate} = post;
  if (scheduledDate) {
    dispatch({
      type: UPDATE_SCHEDULED_POST,
      payload: {id, payload, link, mentionsList, tags, scheduledDate},
    });
  } else {
    dispatch({type: DELETE_SCHEDULED_POST, payload: {postId}});
    dispatch(addPost({post}));
  }
};

export const deleteScheduledPost = ({postId}) => async (dispatch) => {
  await dispatch(apiCommand('posts.delete', {postId, isScheduled: true}));
  dispatch({type: DELETE_SCHEDULED_POST, payload: {postId}});
};

export const createScheduledPost = ({
  data,
  analyticsData,
  additionalData = {},
}) => (dispatch) =>
  createPostDispathcher({
    dispatch,
    data,
    analyticsData,
    callback: addScheduledPost,
    additionalData,
  });
