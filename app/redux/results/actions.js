export const PATCH_ITEM = 'RESULTS/PATCH_ITEM';
export const RESET = 'RESULTS/RESET';
export const UPDATE_POST_STATE = 'RESULTS/UPDATE_POST_STATE';
export const DELETE_POST = 'RESULTS/DELETE_POST';
export const UPDATE_POST = 'RESULTS/UPDATE_POST';

export const patchResultsItem = ({ id, patch }) => ({
  type: PATCH_ITEM,
  payload: { id, patch }
});

export const resetResults = () => ({
  type: RESET
});

export const updatePostState = (transformer) => ({
  type: UPDATE_POST_STATE,
  transformer
});

export const deletePost = (postId) => ({
  type: DELETE_POST,
  payload: { postId }
});

export const updatePost = ({ id, payload, link, mentionsList, postLocation }) => ({
  type: UPDATE_POST,
  payload: { id, payload, link, mentionsList, postLocation }
});
