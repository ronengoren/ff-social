/* eslint-disable no-param-reassign */
import produce from 'immer';
import {isEmpty} from '../../infra/utils';
import * as actions from './actions';

const initialState = {};

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case actions.DELETE_STORY:
      case actions.DEACTIVATE_STORY: {
        const {data} = state;
        const {id} = action.payload;
        if (!isEmpty(data)) {
          draft.data = data.filter((story) => story.id !== id);
        }
        break;
      }

      case actions.CREATE_STORY:
      case actions.EDIT_STORY: {
        const {id, data} = action.payload;
        const {active = true} = data;
        const currentStoryIndex = state.data.findIndex((s) => s.id === id);
        if (!active) {
          draft.data = state.data.filter((story) => story.id !== id);
          break;
        }

        if (currentStoryIndex > -1) {
          draft.data[currentStoryIndex] = {
            ...state.data[currentStoryIndex],
            ...data,
          };
        } else {
          draft.data = [data, ...state.data];
        }
        break;
      }
      default:
    }
  });

export default reducer;
