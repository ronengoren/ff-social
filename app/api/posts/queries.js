import apiClient from '../apiClient';
import {appendQueryParam} from '../../infra/utils';
import {apiDefaults} from '../../vars';
import {joinArrayToString} from '../../infra/utils/stringUtils';

export default {
  getPosts: ({
    featuredIn,
    tags,
    communityId,
    postType,
    postTypes,
    postSubType,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
    date,
    actors = [],
    contextId,
    neighborhoodsIds,
    startDate,
    endDate,
    minPrice,
    maxPrice,
    minRooms,
    maxRooms,
    activationId,
    active,
    sort,
    minComments,
    maxComments,
  }) => {
    let uri = '/posts';
    uri = appendQueryParam(uri, 'tags', tags && encodeURIComponent(tags));
    uri = appendQueryParam(uri, 'communityId', communityId);
    uri = appendQueryParam(uri, 'postType', postType);
    uri = appendQueryParam(uri, 'postTypes', joinArrayToString(postTypes));
    uri = appendQueryParam(uri, 'postSubType', postSubType);
    uri = appendQueryParam(uri, 'page', page);
    uri = appendQueryParam(uri, 'perPage', perPage);
    uri = appendQueryParam(uri, 'featuredIn', featuredIn);
    uri = appendQueryParam(uri, 'date', date);
    uri = appendQueryParam(uri, 'actors', joinArrayToString(actors));
    uri = appendQueryParam(uri, 'contextId', contextId);
    uri = appendQueryParam(
      uri,
      'neighborhoodsIds',
      joinArrayToString(neighborhoodsIds),
    );
    uri = appendQueryParam(uri, 'startDate', startDate);
    uri = appendQueryParam(uri, 'endDate', endDate);
    uri = appendQueryParam(uri, 'minPrice', minPrice);
    uri = appendQueryParam(uri, 'maxPrice', maxPrice);
    uri = appendQueryParam(uri, 'minRooms', minRooms);
    uri = appendQueryParam(uri, 'maxRooms', maxRooms);
    uri = appendQueryParam(uri, 'activationId', activationId);
    uri = appendQueryParam(uri, 'active', active);
    uri = appendQueryParam(uri, 'sort', sort);
    uri = appendQueryParam(uri, 'minComments', minComments);
    uri = appendQueryParam(uri, 'maxComments', maxComments);

    return apiClient.get(uri);
  },

  thankedBy: ({
    postId,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) => apiClient.get(`/posts/${postId}/likes?page=${page}&perPage=${perPage}`),

  savedBy: ({
    postId,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) =>
    apiClient.get(`/posts/${postId}/savers?page=${page}&perPage=${perPage}`),

  getPost: ({postId}) => apiClient.get(`/posts/${postId}`),

  getDistinctTagsByPostTypeAndContext: ({postType, contextId}) => {
    let uri = `/posts/distinctTags`;
    uri = appendQueryParam(uri, 'postType', postType);
    uri = appendQueryParam(uri, 'contextId', contextId);
    return apiClient.get(uri);
  },

  getSavedPosts: ({
    userId,
    postType,
    tags,
    contextId,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) => {
    let uri = `/posts/saved/${userId}`;
    uri = appendQueryParam(uri, 'postType', postType);
    uri = appendQueryParam(uri, 'tags', encodeURIComponent(tags));
    uri = appendQueryParam(uri, 'contextId', contextId);
    uri = appendQueryParam(uri, 'page', page);
    uri = appendQueryParam(uri, 'perPage', perPage);
    return apiClient.get(uri);
  },

  getComments: ({postId, perPage = 100}) =>
    apiClient.get(`posts/${postId}/comments?perPage=${perPage}`),

  getHoodsByPosts: ({
    postType,
    postSubType,
    communityId,
    tags,
    contextId,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) => {
    let uri = '/posts/hoods';
    uri = appendQueryParam(uri, 'communityId', communityId);
    uri = appendQueryParam(uri, 'tags', tags && encodeURIComponent(tags));
    uri = appendQueryParam(uri, 'postType', postType);
    uri = appendQueryParam(uri, 'postSubType', postSubType);
    uri = appendQueryParam(uri, 'contextId', contextId);
    uri = appendQueryParam(uri, 'page', page);
    uri = appendQueryParam(uri, 'perPage', perPage);
    return apiClient.get(uri);
  },
};
