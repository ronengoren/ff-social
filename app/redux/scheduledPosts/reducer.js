/* eslint-disable no-param-reassign */
import produce from 'immer';
import * as scheduledPostsActions from '../scheduledPosts/actions';

const initialState = {};

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case scheduledPostsActions.ADD_SCHEDULED_POST: {
        const {newPost} = action.payload;
        if (draft.data) {
          draft.data = [newPost.id, ...(state.data || [])];
        }
        break;
      }

      case scheduledPostsActions.DELETE_SCHEDULED_POST: {
        const {postId: id} = action.payload;
        const postIndex = draft.data.findIndex((postId) => postId === id);
        draft.data.splice(postIndex, 1);
        break;
      }

      default:
    }
  });

export default reducer;
