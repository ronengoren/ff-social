import {apiCommand} from '../apiCommands/actions';

export const SCRAPING_START = 'SCRAPING_START';
export const SCRAPING_SUCCESS = 'SCRAPING_SUCCESS';
export const SCRAPING_FAILURE = 'SCRAPING_FAILURE';
export const SCRAPING_CANCEL = 'SCRAPING_CANCEL';
export const SCRAPING_CLEAR = 'SCRAPING_CLEAR';

export const scrapeUrl = ({url}) => async (dispatch) => {
  dispatch({type: SCRAPING_START});

  try {
    const res = await dispatch(apiCommand('scraping.scrapeUrl', {url}));
    dispatch({type: SCRAPING_SUCCESS, payload: {data: res.data.data}});
  } catch (err) {
    dispatch({type: SCRAPING_FAILURE});
  }
};

export const clearScraping = () => ({type: SCRAPING_CLEAR});

export const cancelScraping = () => ({type: SCRAPING_CANCEL});
