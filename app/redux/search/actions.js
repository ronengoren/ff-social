import searchService from '../../infra/search/searchService';
import {search as searchLocalStorage} from '../../infra/localStorage';
import {Logger} from '../../infra/reporting';
import {searchTypes} from '../../vars/enums';

export const SEARCH = 'SEARCH';
export const SEARCH_START = 'SEARCH_START';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';
export const INIT_SEARCH = 'INIT_SEARCH';
export const REMOVE_SEARCH = 'REMOVE_SEARCH';
export const INIT_SEARCH_TERMS = 'INIT_SEARCH_TERMS';
export const ADD_SEARCH_TERM = 'ADD_SEARCH_TERM';

const MAX_SEARCH_TERM = 6;

export const search = ({
  query,
  page,
  perPage,
  communityId,
  nationalityGroupId,
  destinationTagName,
  singleEntityType,
  entityTypeFilter,
  searchType,
}) => async (dispatch) => {
  dispatch({type: SEARCH_START, payload: {query, searchType, page}});

  let results;
  if (searchType === searchTypes.COMMUNITIES) {
    results = await searchService.searchCommunities({
      query,
      nationalityGroupId,
      page,
      perPage,
    });
  } else {
    results = await searchService.search({
      query,
      page,
      perPage,
      communityId,
      destinationTagName,
      typoTolerance: true,
      entityTypeFilter,
      singleEntityType,
      nationalityGroupId,
    });
  }

  dispatch({
    type: SEARCH,
    payload: {
      results: results.hits,
      resultsNumberPages: results.nbPages,
      resultsHits: results.nbHits,
      query,
      page,
      searchType,
    },
  });
};

export const clearSearch = ({searchTypes}) => ({
  type: CLEAR_SEARCH,
  payload: {searchTypes},
});

export const initSearchInStack = ({searchTypes}) => ({
  type: INIT_SEARCH,
  payload: {searchTypes},
});

export const removeSearchFromStack = ({searchTypes}) => ({
  type: REMOVE_SEARCH,
  payload: {searchTypes},
});

export const getSearchTerms = (userId) => async (dispatch) => {
  let searchTerms = [];
  try {
    const localStorage = await searchLocalStorage.get();
    if (localStorage && localStorage[userId]) {
      searchTerms = localStorage[userId];
    }
  } catch (err) {
    Logger.error(`Failed to fetch search local storage ${err}`);
  }

  dispatch({
    type: INIT_SEARCH_TERMS,
    payload: {searchTerms},
  });
};

export const addSearchTerm = (userId, oldSearchTerms, newTerm) => async (
  dispatch,
) => {
  const searchTerms = [...oldSearchTerms];
  const termIndex = searchTerms.findIndex((term) => term === newTerm);

  if (termIndex > -1) {
    searchTerms.splice(termIndex, 1);
  } else if (searchTerms.length > MAX_SEARCH_TERM - 1) {
    searchTerms.splice(-1);
  }

  searchTerms.unshift(newTerm);

  try {
    await searchLocalStorage.set({[userId]: searchTerms});
  } catch (err) {
    Logger.error(`Failed to set search local storage ${err}`);
  }

  dispatch({
    type: INIT_SEARCH_TERMS,
    payload: {searchTerms},
  });
};
