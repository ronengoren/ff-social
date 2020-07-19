import {reduceNestedStateRecursion} from '../../redux/utils/common';
import {intersectList} from '../../infra/utils';
import * as actions from './actions';

const rootReducer = (state, action) => {
  if (!action.payload || !action.payload.reducerStatePath) {
    return state;
  }

  const {reducerStatePath, options, data, totalCount} = action.payload;

  const reduceNestedState = (transformer) =>
    reduceNestedStateRecursion(state, reducerStatePath.split('.'), transformer);

  switch (action.type) {
    case actions.API_QUERY_REQUEST:
      return reduceNestedState((nestedState) => ({
        loading: true,
        loaded: false,
        data: options.resetData ? null : nestedState && nestedState.data,
      }));

    case actions.API_QUERY_SUCCESS:
      return reduceNestedState((nestedState) => ({
        loading: false,
        loaded: true,
        data: options.intersect ? intersectList(nestedState.data, data) : data,
        totalCount,
        hasMore: data.hasMore,
      }));

    case actions.API_QUERY_FAILURE:
      return reduceNestedState(() => ({
        loading: false,
        loaded: false,
        err: action.payload.err,
      }));

    default:
      return state;
  }
};

export default rootReducer;
