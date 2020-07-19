import apiClient from '../apiClient';
import {apiDefaults} from '../../vars';
import {appendQueryParam} from '../../infra/utils';
import {joinArrayToString} from '../../infra/utils/stringUtils';
import {featuredTypes} from '../../vars/enums';

const pageUserStatusTypes = {
  OWNER: 0,
  FOLLOWING: 1,
  FOLLOWING_OR_OWNER: 2,
  FOLLOWING_AND_OWNER: 3,
  NOT_FOLLOWING: 4,
};

export default {
  getPages: ({
    tags,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
    roles,
    featuredIn,
    sort,
  }) => {
    let uri = '/pages';
    uri = appendQueryParam(uri, 'tags', tags && encodeURIComponent(tags));
    uri = appendQueryParam(uri, 'roles', joinArrayToString(roles));
    uri = appendQueryParam(uri, 'featuredIn', featuredIn);
    uri = appendQueryParam(uri, 'page', page);
    uri = appendQueryParam(uri, 'perPage', perPage);
    uri = appendQueryParam(uri, 'sort', sort);

    return apiClient.get(uri);
  },

  getSuggestedPagesByTheme: ({
    roles,
    theme,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
    nationalityGroupId,
  }) => {
    let uri = '/pages';
    uri = appendQueryParam(uri, 'page', page);
    uri = appendQueryParam(uri, 'perPage', perPage);

    if (roles) {
      uri = appendQueryParam(uri, 'roles', roles);
    }

    if (theme) {
      uri = appendQueryParam(uri, 'tags', theme && encodeURIComponent(theme));
    } else if (!roles) {
      uri = appendQueryParam(uri, 'featuredIn', featuredTypes.SOLUTIONS);
    }

    if (nationalityGroupId) {
      uri = appendQueryParam(uri, 'nationalityGroupId', nationalityGroupId);
      uri = appendQueryParam(uri, 'nationalOnly', 'false');
    }

    return apiClient.get(uri);
  },

  getByCategory: ({
    categoryId,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) =>
    apiClient.get(
      `/pages/?categoryId=${categoryId}&page=${page}&perPage=${perPage}`,
    ),

  getPage: ({pageId}) => apiClient.get(`pages/${pageId}`),

  follows: ({
    pageId,
    excludeEventId,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
    searchTerm,
  }) => {
    let uri = `/pages/${pageId}/follows?page=${page}&perPage=${perPage}`;
    uri = appendQueryParam(uri, 'excludeEventId', excludeEventId);
    uri = appendQueryParam(uri, 'name', searchTerm);
    return apiClient.get(uri);
  },

  saves: ({
    pageId,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) => apiClient.get(`/pages/${pageId}/saves?page=${page}&perPage=${perPage}`),

  user: ({
    userId,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) => apiClient.get(`/pages/user/${userId}?&page=${page}&perPage=${perPage}`),

  getNewReviews: ({
    pageId,
    reviewId,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) => {
    let uri = `/pages/${pageId}/references?page=${page}&perPage=${perPage}`;
    uri = appendQueryParam(uri, 'referenceId', reviewId);
    return apiClient.get(uri);
  },

  getOwned: ({
    userId,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) =>
    apiClient.get(
      `/pages/user/${userId}?userStatusType=${pageUserStatusTypes.OWNER}&page=${page}&perPage=${perPage}`,
    ),

  getFollowed: ({
    userId,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) =>
    apiClient.get(
      `/pages/user/${userId}?userStatusType=${pageUserStatusTypes.FOLLOWING}&page=${page}&perPage=${perPage}`,
    ),

  getOwnedAndFollowed: ({
    userId,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) =>
    apiClient.get(
      `/pages/user/${userId}?userStatusType=${pageUserStatusTypes.FOLLOWING_OR_OWNER}&page=${page}&perPage=${perPage}`,
    ),

  getSuggestedPagesTags: () => apiClient.get('pages/distinctTags'),
};
