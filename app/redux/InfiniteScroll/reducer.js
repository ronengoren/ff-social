import {reduceNestedStateRecursion} from '../utils/common';
import {intersectList} from '../../infra/utils';
import * as actions from './actions';

export const initialState = {
  data: [],
  page: 1,
  isFetchingTop: false,
  isFetchingBottom: false,
  fetchingTopErr: null,
  fetchingBottomErr: null,
};

function hasMore(data, page, perPage) {
  if (Object.prototype.hasOwnProperty.call(data, 'hasMore')) {
    return data.hasMore;
  } else if (Object.prototype.hasOwnProperty.call(data, 'totalCount')) {
    return data.totalCount > page * perPage;
  } else {
    return false;
  }
}

const rootReducer = (state, action) => {
  if (!action.payload || !action.payload.reducerStatePath) {
    return state;
  }

  const reduceNestedState = (reducer) =>
    reduceNestedStateRecursion(
      state,
      action.payload.reducerStatePath.split('.'),
      reducer,
    );

  switch (action.type) {
    case actions.FETCH_TOP_REQUEST:
      return reduceNestedState((nestedState) => ({
        ...nestedState,
        page: action.payload.query.params.page,
        isFetchingTop: true,
      }));

    case actions.RESET:
      return reduceNestedState((nestedState) => ({
        ...nestedState,
        data: null,
      }));

    case actions.FETCH_TOP_SUCCESS: {
      const {
        data: {totalCount, v},
        data,
        query,
      } = action.payload;
      return reduceNestedState((nestedState) => ({
        ...nestedState,
        isFetchingTop: false,
        data: data.data,
        totalCount,
        v,
        hasMore: hasMore(data, query.params.page, query.params.perPage),
      }));
    }

    case actions.FETCH_TOP_FAILURE:
      return reduceNestedState((nestedState) => ({
        ...nestedState,
        isFetchingTop: false,
        fetchingTopErr: action.payload.err,
      }));

    case actions.FETCH_BOTTOM_REQUEST:
      return reduceNestedState((nestedState) => ({
        ...nestedState,
        isFetchingBottom: true,
        page: action.payload.query.params.page,
      }));

    case actions.FETCH_BOTTOM_SUCCESS: {
      const {
        data: {v},
        data,
        query,
      } = action.payload;
      return reduceNestedState((nestedState) => ({
        ...nestedState,
        isFetchingBottom: false,
        data: intersectList(nestedState.data, data.data),
        v,
        hasMore: hasMore(data, query.params.page, query.params.perPage),
      }));
    }

    case actions.FETCH_BOTTOM_FAILURE:
      return reduceNestedState((nestedState) => ({
        ...nestedState,
        isFetchingBottom: false,
        fetchingBottomErr: action.payload.err,
      }));

    default:
      return state;
  }
};

export default rootReducer;
