/* eslint-disable no-param-reassign */
import produce from 'immer';
import {get} from '../../infra/utils';
import * as actions from './actions';

const initialState = {
  searchStack: {},
  searchTerms: [],
};

const initialSearchItem = {
  results: null,
  page: 0,
  query: null,
  resultsNumberPages: 0,
  resultsHits: 0,
  isSearching: false,
};

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case actions.SEARCH_START: {
        const {searchType, query, page} = action.payload;
        const lastSearchItem = get(state, `searchStack.${searchType}`);
        const hadResultsInPreviousSearch = lastSearchItem.results
          ? !!lastSearchItem.results.length
          : true;
        const isQuerySmaller =
          !lastSearchItem.query || lastSearchItem.query.length > query.length;
        const updatedItem = {
          ...lastSearchItem,
          query,
          page,
          isSearching:
            lastSearchItem.isSearching ||
            hadResultsInPreviousSearch ||
            isQuerySmaller,
          results: page === 0 ? [] : lastSearchItem.results,
        };

        draft.searchStack[searchType] = updatedItem;
        break;
      }

      case actions.SEARCH: {
        const {
          searchType,
          page,
          query,
          results,
          resultsHits,
          resultsNumberPages,
        } = action.payload;
        const lastSearchItem = state.searchStack[searchType];
        const updatedItem = {
          ...lastSearchItem,
          resultsNumberPages,
          resultsHits,
          results:
            query === lastSearchItem.query && lastSearchItem.results && page > 0
              ? lastSearchItem.results.concat(results)
              : results,
          isSearching: false,
        };
        draft.searchStack[searchType] = updatedItem;

        break;
      }

      case actions.CLEAR_SEARCH: {
        const {searchTypes} = action.payload;
        searchTypes.forEach((type) => {
          draft.searchStack[type] = {};
        });
        break;
      }

      case actions.INIT_SEARCH: {
        const {searchTypes} = action.payload;
        searchTypes.forEach((type) => {
          draft.searchStack[type] = initialSearchItem;
        });
        break;
      }

      case actions.REMOVE_SEARCH: {
        const {searchTypes} = action.payload;
        searchTypes.forEach((type) => {
          delete draft.searchStack[type];
        });
        break;
      }

      case actions.INIT_SEARCH_TERMS:
      case actions.ADD_SEARCH_TERM:
        draft.searchTerms = action.payload.searchTerms;
        break;

      default:
    }
  });

export default reducer;
