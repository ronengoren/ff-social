import apiClient from '../apiClient';
import {appendQueryParam} from '../../infra/utils';
import {joinArrayToString} from '../../infra/utils/stringUtils';
import {apiDefaults} from '../../vars';
import {friendshipStatusType} from '../../vars/enums';

export default {
  around: ({type, latitude, longitude, page, perPage}) => {
    let uri = '/users/around';
    uri = appendQueryParam(uri, 'locationType', type);
    uri = appendQueryParam(uri, 'latitude', latitude);
    uri = appendQueryParam(uri, 'longitude', longitude);
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

  getUserHookedEntities: ({
    page,
    perPage,
    ownedEntitiesTypes,
    hookedEntitiesTypes,
  }) => {
    let uri = 'users/hookedEntities';
    uri = appendQueryParam(uri, 'ownedEntitiesTypes', ownedEntitiesTypes);
    uri = appendQueryParam(uri, 'hookedEntitiesTypes', hookedEntitiesTypes);
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

  getChatStatus: ({chatUserIds}) =>
    apiClient.get(`/users/chat/status/?chatUserIds=${chatUserIds}`),

  getStatusWithFriendshipStatus: ({chatUserIds}) =>
    apiClient.get(
      `/users/chat/statusWithFriendshipStatus/?chatUserIds=${chatUserIds}`,
    ),

  getReferrers: ({page = 1, perPage = 100}) =>
    apiClient.get(`/users/referrers?page=${page}&perPage=${perPage}`),

  getUserTotals: ({userId}) => apiClient.get(`/users/${userId}/totals`),

  getHoodsByUsers: ({
    communityId,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) => {
    let uri = '/users/hoods';
    uri = appendQueryParam(uri, 'page', page);
    uri = appendQueryParam(uri, 'perPage', perPage);
    uri = appendQueryParam(uri, 'communityId', communityId);
    return apiClient.get(uri);
  },

  getUsers: ({
    communityId,
    contextCountryCode,
    neighborhoodsIds,
    genders,
    roles,
    friendshipStatuses = [],
    relationshipStatuses,
    minAge,
    maxAge,
    minCreatedAt,
    maxCreatedAt,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) => {
    const friends =
      friendshipStatuses && friendshipStatuses.length === 1
        ? (friendshipStatuses[0] === friendshipStatusType.FRIENDS).toString()
        : null;

    let uri = '/users';
    uri = appendQueryParam(uri, 'contextCountryCode', contextCountryCode);
    uri = appendQueryParam(uri, 'communityId', communityId);
    uri = appendQueryParam(
      uri,
      'neighborhoodsIds',
      joinArrayToString(neighborhoodsIds),
    );
    uri = appendQueryParam(uri, 'genders', joinArrayToString(genders));
    uri = appendQueryParam(uri, 'friends', friends);
    uri = appendQueryParam(
      uri,
      'relationshipStatuses',
      joinArrayToString(relationshipStatuses),
    );
    uri = appendQueryParam(uri, 'minAge', minAge);
    uri = appendQueryParam(uri, 'maxAge', maxAge);
    uri = appendQueryParam(uri, 'roles', roles);
    uri = appendQueryParam(uri, 'minCreatedAt', minCreatedAt);
    uri = appendQueryParam(uri, 'maxCreatedAt', maxCreatedAt);
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

  getConnectedAccounts: () => apiClient.get('/users/connectedAccounts'),
};
