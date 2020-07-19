/* eslint-disable no-param-reassign */
import produce from 'immer';
import {get} from '../../infra/utils';
import * as actions from './actions';

const initialState = {
  carousels: {},
};

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case actions.REMOVE_SOLUTITON_CAROUSEL: {
        const {type, id} = action.payload;
        const carousels = get(draft, `carousels.${id}`);
        if (carousels && carousels[type]) {
          delete carousels[type];
        }
        break;
      }
      default:
    }
  });

export default reducer;
