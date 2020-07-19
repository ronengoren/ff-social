import * as actions from './actions';

const initialState = {
  isNeighborhoods: false,
  prefix: '',
  types: '',
  country: '',
  results: [],
  coordinates: [],
  query: '',
  isSearching: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.INIT_SEARCH_ADDRESS: {
      return {
        ...initialState,
        ...action.payload
      };
    }

    case actions.SEARCH_ADDRESS_START: {
      const previousSearchHadResults = !!state.query.length && !!state.results && !!state.results.length;
      const isQuerySmaller = !state.query.length || state.query.length > action.payload.query.length;

      return {
        ...state,
        isSearching: state.isSearching || previousSearchHadResults || isQuerySmaller,
        results: []
      };
    }

    case actions.SEARCH_ADDRESS: {
      return {
        ...state,
        query: action.payload.query,
        results: action.payload.results,
        isSearching: false
      };
    }

    case actions.CLEAR_SEARCH_ADDRESS:
      return {
        ...state,
        query: '',
        results: []
      };

    default:
      return state;
  }
};

export default reducer;
