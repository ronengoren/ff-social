import apiClient from '../apiClient';
import {apiDefaults} from '../../vars';
import {groupRoleTypes, groupType} from '../../vars/enums';
import {isEmpty, compact, appendQueryParam} from '../../infra/utils';

export default {
  getSuggested: ({
    theme,
    tags,
    featuredIn,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
    sort,
  }) => {
    let url = `groups/?page=${page}&perPage=${perPage}&groupType=${groupType.GROUP}`;
    const themesAndTags = compact([theme, tags].flat());
    url = appendQueryParam(
      url,
      'tagsFilter',
      !isEmpty(themesAndTags) && encodeURIComponent(themesAndTags),
    );
    url = appendQueryParam(url, 'featuredIn', featuredIn);
    url = appendQueryParam(url, 'sort', sort);
    return apiClient.get(url);
  },

  getSuggestedGroupsTags: () => apiClient.get('groups/distinctTags'),

  getManaged: ({
    userId,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) =>
    apiClient.get(
      `groups/user/${userId}/?memberTypeFilter=${groupRoleTypes.OWNER}&page=${page}&perPage=${perPage}`,
    ),

  getManagedAndRecent: ({
    userId,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) =>
    apiClient.get(
      `groups/user/${userId}/?page=${page}&perPage=${perPage}&groupType=${groupType.GROUP}`,
    ),

  getUserGroupsOrFeaturedGroups: ({
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) => {
    const uri = `groups/userGroupsOrFeatured?page=${page}&perPage=${perPage}`;
    return apiClient.get(uri);
  },

  getMembered: ({
    userId,
    groupType,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) => {
    let uri = `groups/user/${userId}/?memberTypeFilter=${groupRoleTypes.IN_THE_GROUP}&page=${page}&perPage=${perPage}`;
    uri = appendQueryParam(uri, 'groupType', groupType);
    return apiClient.get(uri);
  },

  getGroup: ({groupId}) => apiClient.get(`groups/${groupId}`),

  getMembers: ({
    groupId,
    excludeEventId,
    name,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) => {
    let url = `groups/${groupId}/members/?page=${page}&perPage=${perPage}`;
    url = appendQueryParam(url, 'excludeEventId', excludeEventId);
    url = appendQueryParam(url, 'name', name);
    return apiClient.get(url);
  },

  getPendingMembers: ({
    groupId,
    name,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) => {
    let url = `groups/${groupId}/members/?memberTypeFilter=3&page=${page}&perPage=${perPage}`;
    url = appendQueryParam(url, 'name', name);
    return apiClient.get(url);
  },

  getHighlightedEntities: ({
    groupId,
    page = apiDefaults.pagination.startPage,
    perPage = 20,
  }) =>
    apiClient.get(
      `groups/${groupId}/recommended/?page=${page}&perPage=${perPage}`,
    ),
};
