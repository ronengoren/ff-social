import apiClient from '../../api/apiClient';
import {apiDefaults} from '../../vars';
import {appendQueryParam} from '../../infra/utils';
import {joinArrayToString} from '../../infra/utils/stringUtils';

export default {
  get: ({
    featuredIn,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) => {
    let url = `events/?page=${page}&perPage=${perPage}`;
    url = appendQueryParam(url, 'featuredIn', featuredIn);
    return apiClient.get(url);
  },

  getSuggested: ({
    communityId,
    neighborhoodsIds,
    theme,
    fromStartDateTime,
    toEndDateTime,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) => {
    let uri = `events/suggested/?page=${page}&perPage=${perPage}`;
    uri = appendQueryParam(uri, 'communityId', communityId);
    uri = appendQueryParam(
      uri,
      'neighborhoodsIds',
      joinArrayToString(neighborhoodsIds),
    );
    uri = appendQueryParam(uri, 'tagsFilter', theme);
    uri = appendQueryParam(uri, 'fromStartDateTime', fromStartDateTime);
    uri = appendQueryParam(uri, 'toEndDateTime', toEndDateTime);
    return apiClient.get(uri);
  },

  getUserEvents: ({
    userId = 'me',
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
    userRoleFilter,
    timestampFilter,
  }) => {
    let uri = `events/user/${userId}?page=${page}&perPage=${perPage}`;
    uri = appendQueryParam(uri, 'userRoleFilter', userRoleFilter);
    uri = appendQueryParam(uri, 'timestampFilter', timestampFilter);
    return apiClient.get(uri);
  },

  getHoods: ({communityId}) => {
    let uri = '/events/hoods';
    uri = appendQueryParam(uri, 'communityId', communityId);
    return apiClient.get(uri);
  },

  getEvent: ({eventId}) => apiClient.get(`events/${eventId}`),

  getSuggestedEventsTags: () => apiClient.get('events/suggested/distinctTags'),

  getInviteesList: ({
    eventId,
    inviteeRSVPFilter,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) =>
    apiClient.get(
      `events/${eventId}/invitees/?inviteeRSVPFilter=${inviteeRSVPFilter}&page=${page}&perPage=${perPage}`,
    ),
};
