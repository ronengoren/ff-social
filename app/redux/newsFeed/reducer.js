import * as feedActions from '../feed/actions';
import * as authActions from '../auth/actions';

const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case feedActions.ADD_POST:
      return {
        ...state,
        data: [action.payload.newPost.id, ...state.data],
      };
    case authActions.ADD_HIDDEN_POST:
    case feedActions.DELETE_POST:
    case feedActions.HIDE_POST_FROM_FEED:
      return {
        ...state,
        data: state.data.filter((id) => id !== action.payload.postId),
      };
    default:
      return state;
  }
};

export default reducer;
