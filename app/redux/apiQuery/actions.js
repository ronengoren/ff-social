// import { ErrorsLogger } from '/infra/reporting';
import {shuffleArray} from '../utils/common';
import {handleNormalizedData} from '../normalizer';

export const API_QUERY_REQUEST = 'API_QUERY_REQUEST';
export const API_QUERY_SUCCESS = 'API_QUERY_SUCCESS';
export const API_QUERY_FAILURE = 'API_QUERY_FAILURE';
export const API_QUERY_DATA_PATCH = 'API_QUERY_DATA_PATCH';

const defaultOptions = {
  resetData: true,
};

function removeDuplicatePinnedPosts({data, hiddenPinnedPosts}) {
  return data.filter((item) => {
    if (item.pinned) {
      const isHiddenPost = hiddenPinnedPosts.some((id) => item.id === id);
      if (item.injectedPinnedPost) {
        return !isHiddenPost;
      } else {
        // eslint-disable-next-line no-param-reassign
        item.injectedPinnedPost = false;
        return isHiddenPost;
      }
    }
    return true;
  });
}

export const apiQuery = ({
  normalizedSchema,
  reducerStatePath,
  query,
  options = {},
}) => async (dispatch, getState, {apiQueries}) => {
  const fullOptions = {...defaultOptions, ...options};
  const {domain, key, params} = query;
  const request = apiQueries[domain][key];

  dispatch({
    type: API_QUERY_REQUEST,
    payload: {reducerStatePath, query, options: fullOptions},
  });

  try {
    const res = await request(params);
    let {data} = res.data;

    if (fullOptions.responseMutator) {
      data = fullOptions.responseMutator(data);
    }

    if (!fullOptions.intersect && fullOptions.shuffle) {
      data = shuffleArray(data);
    }

    if (fullOptions.removeDuplicatePinnedPosts) {
      data = removeDuplicatePinnedPosts({
        data,
        hiddenPinnedPosts: getState().auth.hiddenPinnedItems,
      });
    }

    const dataToUpdate = handleNormalizedData({
      data,
      normalizedSchema,
      dispatch,
    });

    await dispatch({
      type: API_QUERY_SUCCESS,
      payload: {
        reducerStatePath,
        query,
        data: dataToUpdate,
        totalCount: res.data.totalCount,
        options: fullOptions,
      },
    });

    return {...res, data: {...res.data, data}};
  } catch (err) {
    dispatch({
      type: API_QUERY_FAILURE,
      payload: {reducerStatePath, query, err},
    });
    // ErrorsLogger.apiQueryError(query, err.toString(), err.response);
    throw err;
  }
};
