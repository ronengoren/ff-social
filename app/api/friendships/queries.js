import apiClient from '../apiClient';
import {appendQueryParam} from '../../infra/utils';
import {apiDefaults} from '../../vars';

export default {
  friends: ({
    userId,
    page,
    perPage,
    excludePageId,
    searchTerm,
    excludeMutual,
    excludeGroupId,
    excludeEventId,
  }) => {
    let uri = `/friendships/friends/${userId || 'me'}`;
    uri = appendQueryParam(uri, 'excludePageId', excludePageId);
    uri = appendQueryParam(uri, 'excludeGroupId', excludeGroupId);
    uri = appendQueryParam(uri, 'excludeEventId', excludeEventId);
    uri = appendQueryParam(uri, 'excludeMutual', excludeMutual);
    uri = appendQueryParam(uri, 'searchTerm', searchTerm);
    uri = appendQueryParam(
      uri,
      'page',
      page || apiDefaults.pagination.startPage,
    );
    uri = appendQueryParam(
      uri,
      'perPage',
      perPage || apiDefaults.pagination.perPage,
    );
    return apiClient.get(uri);
  },

  mutual: ({id, page, perPage}) =>
    apiClient.get(
      `/friendships/mutual/${id}?page=${
        page || apiDefaults.pagination.startPage
      }&perPage=${perPage || apiDefaults.pagination.perPage}`,
    ),

  requests: ({page, perPage}) =>
    apiClient.get(
      `/friendships/friendRequests?page=${
        page || apiDefaults.pagination.startPage
      }&perPage=${perPage || apiDefaults.pagination.perPage}`,
    ),

  recommended: ({page, perPage}) =>
    apiClient.get(
      `/friendships/recommended?page=${
        page || apiDefaults.pagination.startPage
      }&perPage=${perPage || apiDefaults.pagination.perPage}`,
    ),
};
