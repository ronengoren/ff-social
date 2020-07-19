import {isEmpty} from '../../infra/utils';
import * as actions from './actions';
import * as commentsActions from '../comments/actions';

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.PATCH_ITEM: {
      const {id, patch} = action.payload;
      const i = state.data.findIndex((item) => item.id === id);
      return {
        ...state,
        data: [
          ...state.data.slice(0, i),
          {
            ...state.data[i],
            ...patch({item: state.data[i]}),
          },
          ...state.data.slice(i + 1),
        ],
      };
    }

    case actions.RESET:
      return {
        ...state,
        data: null,
      };

    case actions.UPDATE_POST_STATE:
      return {
        ...state,
        data: action.transformer(state.data),
      };

    case actions.DELETE_POST:
      return {
        ...state,
        data: state.data.filter((post) => post.id !== action.payload.postId),
      };
    case commentsActions.UPDATE_COMMENTS_COUNTER: {
      if (!state.data) return state;

      const index = state.data.findIndex(
        (post) => post.id === action.payload.postId,
      );
      if (index !== -1) {
        return {
          ...state,
          data: [
            ...state.data.slice(0, index),
            {
              ...state.data[index],
              comments: state.data[index].comments + action.payload.add,
            },
            ...state.data.slice(index + 1),
          ],
        };
      }
      return state;
    }
    case actions.UPDATE_POST: {
      const {
        id,
        payload,
        link,
        mentionsList,
        postLocation,
        contextCountryCode,
      } = action.payload;
      const index = state.data.findIndex((post) => post.id === id);
      if (index !== -1) {
        const post = {
          ...state.data[index],
          payload,
          link,
          edited: true,
          mentions: mentionsList,
          postLocation,
        };

        if (!isEmpty(contextCountryCode)) {
          post.contextCountryCode = contextCountryCode;
        }

        return {
          ...state,
          data: [
            ...state.data.slice(0, index),
            post,
            ...state.data.slice(index + 1),
          ],
        };
      }
      return state;
    }

    default:
      return state;
  }
};
