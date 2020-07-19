import * as actions from './actions';

const initialState = {
  scraping: false,
  success: false,
  data: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SCRAPING_START:
      return {
        scraping: true,
        success: false,
        data: null
      };

    case actions.SCRAPING_SUCCESS:
      return {
        scraping: false,
        success: true,
        data: action.payload.data
      };

    case actions.SCRAPING_FAILURE:
      return {
        scraping: false,
        success: false
      };

    case actions.SCRAPING_CANCEL:
    case actions.SCRAPING_CLEAR:
      return initialState;

    default:
      return state;
  }
};

export default reducer;
