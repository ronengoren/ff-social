import {apiQuery} from '../apiQuery/actions';
import {get, cloneDeep} from '../../infra/utils';
import {apiDefaults} from '../../vars';
import {handleNormalizedData} from '../normalizer';

export const FETCH_TOP_REQUEST = 'INFINITY_SCROLL/FETCH_TOP_REQUEST';
export const FETCH_TOP_SUCCESS = 'INFINITY_SCROLL/FETCH_TOP_SUCCESS';
export const FETCH_TOP_FAILURE = 'INFINITY_SCROLL/FETCH_TOP_FAILURE';

export const FETCH_BOTTOM_REQUEST = 'INFINITY_SCROLL/FETCH_BOTTOM_REQUEST';
export const FETCH_BOTTOM_SUCCESS = 'INFINITY_SCROLL/FETCH_BOTTOM_SUCCESS';
export const FETCH_BOTTOM_FAILURE = 'INFINITY_SCROLL/FETCH_BOTTOM_FAILURE';

export const RESET = 'INFINITY_SCROLL/RESET';

// const {perPage} = apiDefaults.pagination;

export const fetchTop = ({
  normalizedSchema,
  reducerStatePath,
  query,
  resetData,
  options,
}) => async (dispatch) => {
  const newQuery = cloneDeep(query);
  newQuery.params = {
    // perPage,
    ...newQuery.params,
    page: 1,
  };

  if (resetData) {
    dispatch({
      type: RESET,
      payload: {
        reducerStatePath,
      },
    });
  }

  dispatch({
    type: FETCH_TOP_REQUEST,
    payload: {
      reducerStatePath,
      query: newQuery,
    },
  });

  try {
    const res = await dispatch(
      apiQuery({
        query: newQuery,
        options,
      }),
    );

    const dataToUpdate = handleNormalizedData({
      data: res.data ? res.data.data : {},
      normalizedSchema,
      dispatch,
    });

    await dispatch({
      type: FETCH_TOP_SUCCESS,
      payload: {
        reducerStatePath,
        query: newQuery,
        data: {
          ...res.data,
          data: dataToUpdate,
        },
      },
    });
  } catch (err) {
    dispatch({
      type: FETCH_TOP_FAILURE,
      payload: {
        reducerStatePath,
        query: newQuery,
        err,
      },
    });
    throw err;
  }
};

export const fetchBottom = ({
  normalizedSchema,
  reducerStatePath,
  query,
  options,
}) => async (dispatch, getState) => {
  const state = get(getState(), reducerStatePath);

  if (!state || !state.hasMore) {
    return;
  }
  const {page, v} = state;

  const nextPage = page + 1;
  const newQuery = cloneDeep(query);

  newQuery.params = {
    // perPage,
    ...newQuery.params,
    page: nextPage,
    v,
  };

  dispatch({
    type: FETCH_BOTTOM_REQUEST,
    payload: {
      reducerStatePath,
      query: newQuery,
    },
  });

  try {
    const res = await dispatch(
      apiQuery({
        query: newQuery,
        options,
      }),
    );

    const dataToUpdate = handleNormalizedData({
      data: res.data ? res.data.data : {},
      normalizedSchema,
      dispatch,
    });

    await dispatch({
      type: FETCH_BOTTOM_SUCCESS,
      payload: {
        reducerStatePath,
        query: newQuery,
        data: {
          ...res.data,
          data: dataToUpdate,
        },
      },
    });
  } catch (err) {
    dispatch({
      type: FETCH_BOTTOM_FAILURE,
      payload: {
        reducerStatePath,
        query: newQuery,
        err,
      },
    });
  }
};
