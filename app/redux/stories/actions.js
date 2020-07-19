import {Alert} from 'react-native';
import {get} from '../../infra/utils';
import {apiCommand} from '../apiCommands/actions';

export const CREATE_STORY = 'CREATE_STORY';
export const DEACTIVATE_STORY = 'DEACTIVATE_STORY';
export const EDIT_STORY = 'EDIT_STORY';
export const DELETE_STORY = 'DELETE_STORY';

const deleteStoryInternally = (storyId) => ({
  type: DELETE_STORY,
  payload: {
    id: storyId,
  },
});

export const createStory = ({data}) => async (dispatch) => {
  try {
    const res = await dispatch(apiCommand('stories.create', data));
    const resData = get(res, 'data.data');
    dispatch({
      type: CREATE_STORY,
      payload: {
        data: resData,
        id: resData.id,
      },
    });
    return res;
  } catch (err) {
    Alert.alert(`Create story failed`);
    return null;
  }
};

export const editStory = ({storyId, data, ownUserCommunityId}) => async (
  dispatch,
) => {
  try {
    const res = await dispatch(apiCommand('stories.edit', {storyId, ...data}));
    const dataToPatch = {...get(res, 'data.data')};
    dataToPatch.communityId = data.communityId;
    dataToPatch.nationalityGroupId = data.nationalityGroupId;

    const isChangingStoryCommunity =
      dataToPatch.communityId && dataToPatch.communityId !== ownUserCommunityId;
    if (isChangingStoryCommunity) {
      dispatch(deleteStoryInternally(storyId));
    } else {
      dispatch({
        type: EDIT_STORY,
        payload: {
          id: storyId,
          data: dataToPatch,
        },
      });
    }

    return res;
  } catch (err) {
    Alert.alert(`Edit story ${storyId} failed`);
    return null;
  }
};

export const deactivateStory = ({storyId}) => async (dispatch) => {
  try {
    const res = await dispatch(
      apiCommand('stories.edit', {storyId, active: false}),
    );
    dispatch({
      type: DEACTIVATE_STORY,
      payload: {
        id: storyId,
      },
    });
    return res;
  } catch (err) {
    Alert.alert(`Deactivate story ${storyId} failed`);
    return null;
  }
};

export const deleteStory = ({storyId}) => async (dispatch) => {
  try {
    const res = await dispatch(apiCommand('stories.delete', {storyId}));
    dispatch(deleteStoryInternally(storyId));
    return res;
  } catch (err) {
    Alert.alert(`Delete story ${storyId} failed`);
    return null;
  }
};
