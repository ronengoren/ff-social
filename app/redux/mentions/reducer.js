import * as actions from './actions';

const emptySearchMention = {
  results: [],
  page: 0,
  query: null,
  resultsNumberPages: 0,
  resultsHits: -1,
  isSearching: false
};

const initialState = {
  mentionsList: [],
  searchMentions: { ...emptySearchMention }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SEARCH_MENTION_START: {
      const lastSearchResults = state.searchMentions.results;
      const hadResultsInPreviousSearch = lastSearchResults ? !!lastSearchResults.length : true;
      const isQuerySmaller = !state.searchMentions.query || state.searchMentions.query.length > action.payload.query.length;

      return {
        ...state,
        searchMentions: {
          ...state.searchMentions,
          query: action.payload.query,
          page: action.payload.page,
          isSearching: state.isSearching || hadResultsInPreviousSearch || isQuerySmaller,
          results: action.payload.page === 0 ? [] : lastSearchResults
        }
      };
    }

    case actions.SEARCH_MENTION: {
      if (action.payload.query === state.searchMentions.query) {
        return {
          ...state,
          searchMentions: {
            results: action.payload.page > 0 ? state.searchMentions.results.concat(action.payload.results) : action.payload.results,
            query: action.payload.query,
            page: action.payload.page,
            resultsNumberPages: action.payload.resultsNumberPages,
            resultsHits: action.payload.resultsHits,
            isSearching: false
          }
        };
      }

      return state;
    }

    case actions.CLEAR_SEARCH_MENTIONS:
      return {
        ...state,
        searchMentions: { ...emptySearchMention }
      };

    case actions.ADD_NEW_MENTION:
      return {
        ...state,
        mentionsList: [...state.mentionsList, action.payload]
      };

    case actions.UPDATE_MENTIONS_LIST:
      return {
        ...state,
        mentionsList: action.payload || []
      };

    case actions.CLEAR_MENTIONS_LIST:
      return initialState;

    default:
      return state;
  }
};

export default reducer;
