import searchService from '../../infra/search/searchService';
import {postTypes, entityTypes} from '../../vars/enums';

export const SEARCH_MENTION_START = 'SEARCH_MENTION_START';
export const SEARCH_MENTION = 'SEARCH_MENTION';
export const CLEAR_SEARCH_MENTIONS = 'CLEAR_SEARCH_MENTIONS';
export const UPDATE_MENTIONS_LIST = 'UPDATE_MENTIONS_LIST';
export const ADD_NEW_MENTION = 'ADD_NEW_MENTION';
export const CLEAR_MENTIONS_LIST = 'CLEAR_MENTIONS_LIST';

export const searchMentions = (
  query,
  page,
  communityId,
  nationalityGroupId,
) => async (dispatch) => {
  dispatch({type: SEARCH_MENTION_START, payload: {query, page}});

  const entityTypeFilter = entityTypes.NEIGHBORHOOD;
  const results = await searchService.search({
    query,
    page,
    communityId,
    nationalityGroupId,
    typoTolerance: false,
    entityTypeFilter,
    showOnlyPostTypes: [postTypes.GUIDE],
  });

  dispatch({
    type: SEARCH_MENTION,
    payload: {
      results: results.hits,
      resultsNumberPages: results.nbPages,
      resultsHits: results.nbHits,
      query,
      page,
    },
  });
};

export const clearSearchMentions = () => ({type: CLEAR_SEARCH_MENTIONS});

export const updateMentionsList = (mentions) => ({
  type: UPDATE_MENTIONS_LIST,
  payload: mentions,
});

export const addNewMention = (mention) => ({
  type: ADD_NEW_MENTION,
  payload: mention,
});

export const clearMentionsList = () => ({type: CLEAR_MENTIONS_LIST});
