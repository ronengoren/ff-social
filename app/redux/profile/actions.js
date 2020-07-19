import {apiCommand} from '../apiCommands/actions';
import {apiQuery} from '../apiQuery/actions';
import {editImages as editAuthImages} from '../auth/actions';
import {setSavedThemes} from '../themes/actions';
import {get} from '../../infra/utils';

export const PROFILE_UPDATE = 'PROFILE_UPDATE';
export const UPDATE_FRIEND_STATUS = 'UPDATE_FRIEND_STATUS';
export const EDIT_IMAGE = 'PROFILE/EDIT_IMAGE';
export const SET_INSTAGRAM_TOKEN = 'SET_INSTAGRAM_TOKEN';
export const DELETE_INSTAGRAM_TOKEN = 'DELETE_INSTAGRAM_TOKEN';

export const getProfile = ({userId}) => async (dispatch, getState) => {
  const state = getState();
  const isOwnProfile = state.auth.user.id === userId;

  const res = await dispatch(
    apiQuery({
      reducerStatePath: `profile.${userId}`,
      query: {domain: 'profile', key: 'getProfile', params: {userId}},
      options: {resetData: false},
    }),
  );
  const {data = {}} = res;
  const savedThemes = get(data, 'data.themes.savedTotals');
  if (savedThemes && isOwnProfile) {
    dispatch(setSavedThemes({savedThemes: res.data.data.themes.savedTotals}));
  }
  return data.data;
};

export const editImages = ({userId, imageUrl}) => async (dispatch) => {
  const res = await dispatch(
    apiCommand('profile.editImage', {imageUrl, userId}),
  );
  const {media} = res.data.data;
  dispatch({type: EDIT_IMAGE, payload: {userId, media}});
  dispatch(editAuthImages({media}));
};

export const updateProfile = ({userId, delta}) => async (dispatch) => {
  const res = await dispatch(apiCommand('profile.editProfile', {...delta}));

  dispatch({
    type: PROFILE_UPDATE,
    payload: {
      userId,
      data: res.data.data,
    },
  });
  return res.data.data;
};

export const setInstagramToken = ({code}) => async (dispatch, getState) => {
  const userId = getState().auth.user.id;
  const res = await dispatch(apiCommand('users.setInstagramToken', {code}));
  const token = get(res, 'data.data.token');

  dispatch({
    type: SET_INSTAGRAM_TOKEN,
    payload: {token, userId},
  });
};

export const deleteInstagramToken = () => (dispatch, getState) => {
  const state = getState();
  const userId = state.auth.user.id;
  const {instagramToken, instagramV2Token} = state.profile[userId].data.user;
  dispatch(
    apiCommand('users.deleteInstagramToken', {
      token: instagramToken || instagramV2Token,
    }),
  );
  dispatch({
    type: DELETE_INSTAGRAM_TOKEN,
    payload: {userId},
  });
};
