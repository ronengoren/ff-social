import { fetchTop } from '../InfiniteScroll/actions';

export const REMOVE_SOLUTITON_CAROUSEL = 'REMOVE_SOLUTITON_CAROUSEL';
export const API_QUERY_SUCCESS = 'API_QUERY_SUCCESS';
export const API_QUERY_FAILURE = 'API_QUERY_FAILURE';
export const API_QUERY_DATA_PATCH = 'API_QUERY_DATA_PATCH';

export const getSolutionsCarousel = ({ reducerStatePath, query }) => (dispatch) => dispatch(fetchTop({ normalizedSchema: 'MIXED_TYPE_ENTITIES', reducerStatePath, query }));

export const removeSolutionsCarrousel = ({ type, id }) => (dispatch) => {
  dispatch({
    type: REMOVE_SOLUTITON_CAROUSEL,
    payload: {
      type,
      id
    }
  });
};
