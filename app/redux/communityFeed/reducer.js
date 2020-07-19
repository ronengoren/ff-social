/* eslint-disable no-param-reassign */
import produce from 'immer';
import * as feedActions from '../feed/actions';
import * as authActions from '../auth/actions';

const initialState = {};

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case feedActions.ADD_POST:
        if (state.data) {
          draft.data.unshift(action.payload.newPost.id);
        }
        break;

      case authActions.ADD_HIDDEN_POST:
      case feedActions.HIDE_POST_FROM_FEED:
      case feedActions.DELETE_POST:
        if (state.data) {
          const removedPostIndex = draft.data.findIndex(
            (id) => id === action.payload.postId,
          );
          if (removedPostIndex > -1) {
            draft.data.splice(removedPostIndex, 1);
          }
        }
        break;

      default:
    }
  });

export default reducer;
