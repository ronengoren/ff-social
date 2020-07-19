import apiClient from '../apiClient';
import {apiDefaults} from '../../vars';
import {appendQueryParam} from '../../infra/utils';
import {joinArrayToString} from '../../infra/utils/stringUtils';
import {allPlaceholderFilterType} from '../../vars/enums';

export default {
  getLists: ({
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
    collaborative,
    tags = [],
    featuredIn,
    contextId,
    sort,
  }) => {
    let uri = `lists/?page=${page}&perPage=${perPage}&tags=${joinArrayToString(
      tags,
    )}`;
    uri = appendQueryParam(uri, 'collaborative', collaborative);
    uri = appendQueryParam(uri, 'featuredIn', featuredIn);
    uri = appendQueryParam(uri, 'contextId', contextId);
    uri = appendQueryParam(uri, 'sort', sort);

    return apiClient.get(uri);
  },

  getList: ({
    listId,
    location,
    sortBy,
    filterByCommunityId,
    withoutItems = true,
  }) => {
    let uri = `lists/${listId}`;
    uri = appendQueryParam(uri, 'sortBy', sortBy);
    if (location) {
      uri += `&location=${location.join(',')}`;
    }

    if (filterByCommunityId !== allPlaceholderFilterType.id) {
      uri = appendQueryParam(uri, 'filterByCommunityId', filterByCommunityId);
    }

    uri = appendQueryParam(uri, 'withoutItems', withoutItems);
    return apiClient.get(uri);
  },

  getListItems: ({
    listId,
    page = apiDefaults.pagination.startPage,
    perPage = 50,
    location,
    sortBy,
    filterByCommunityId,
  }) => {
    let uri = `lists/${listId}/items?page=${page}&perPage=${perPage}`;
    uri = appendQueryParam(uri, 'sortBy', sortBy);
    if (location) {
      uri += `&location=${location.join(',')}`;
    }

    if (filterByCommunityId !== allPlaceholderFilterType.id) {
      uri = appendQueryParam(uri, 'filterByCommunityId', filterByCommunityId);
    }
    return apiClient.get(uri);
  },

  getListItem: ({listItemId}) => apiClient.get(`lists/items/${listItemId}`),

  getCommunitiesTotalItems: ({listId}) =>
    apiClient.get(`lists/${listId}/communitiesTotals`),

  getSavedLists: ({
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
    userId,
  }) => apiClient.get(`lists/saved/${userId}/?page=${page}&perPage=${perPage}`),

  getSavedListItems: ({
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
    userId,
  }) =>
    apiClient.get(
      `lists/items/saved/${userId}/?page=${page}&perPage=${perPage}`,
    ),

  getListContributors: ({
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
    listId,
  }) =>
    apiClient.get(
      `lists/${listId}/contributors?page=${page}&perPage=${perPage}`,
    ),

  getListSavers: ({
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
    listId,
  }) => apiClient.get(`lists/${listId}/savers?page=${page}&perPage=${perPage}`),

  getListItemSavers: ({
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
    listId,
    listItemId,
  }) =>
    apiClient.get(
      `lists/${listId}/${listItemId}/savers?page=${page}&perPage=${perPage}`,
    ),

  getListItemVoters: ({
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
    listId,
    listItemId,
  }) =>
    apiClient.get(
      `lists/${listId}/${listItemId}/voters?page=${page}&perPage=${perPage}`,
    ),

  getListItemComments: ({listId, listItemId, perPage = 100}) =>
    apiClient.get(`lists/${listId}/${listItemId}/comments?perPage=${perPage}`),

  isListHasPageItem: ({listId, pageId}) =>
    apiClient.get(`lists/${listId}/itemExists?pageId=${pageId}`),
};
