/* eslint-disable no-param-reassign */
import produce from 'immer';
import * as feedActions from '../feed/actions';
import * as authActions from '../auth/actions';

const initialState = {};

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case feedActions.ADD_POST: {
        const {newPost} = action.payload;
        const entityId = newPost.context.id;

        if (draft[entityId]) {
          draft[entityId].data.unshift(newPost.id);
        }
        break;
      }

      case authActions.ADD_HIDDEN_POST:
      case feedActions.HIDE_POST_FROM_FEED:
      case feedActions.DELETE_POST: {
        const {postId} = action.payload;

        Object.keys(state).forEach((feed) => {
          if (state[feed] && state[feed].data) {
            const removedPostIndex = state[feed].data.findIndex(
              (id) => id === postId,
            );
            if (removedPostIndex > -1) {
              draft[feed].data.splice(removedPostIndex, 1);
            }
          }
        });
        break;
      }

      default:
    }
  });

export default reducer;
