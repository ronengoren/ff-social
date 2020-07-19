import apiClient from '../apiClient';
import {apiDefaults} from '../../vars';
import {appendQueryParam} from '../../infra/utils';

export default {
  neighborhood: ({neighborhoodId, page, perPage}) =>
    apiClient.get(
      `/feeds/neighborhood/${neighborhoodId}?page=${
        page || apiDefaults.pagination.startPage
      }&perPage=${perPage || apiDefaults.pagination.perPage}`,
    ),

  news: ({communityId, contextCountryCode, page, perPage, personalized, v}) => {
    let uri = `/feeds/newsfeed?page=${
      page || apiDefaults.pagination.startPage
    }&perPage=${perPage || apiDefaults.pagination.perPage}`;
    uri = appendQueryParam(uri, 'communityId', communityId);
    uri = appendQueryParam(uri, 'contextCountryCode', contextCountryCode);
    uri = appendQueryParam(uri, 'personalized', personalized);
    uri = appendQueryParam(uri, 'v', v);
    return apiClient.get(uri);
  },

  nationality: ({nationalityGroupId, page, perPage, v}) => {
    let uri = `/feeds/nationality_group/${nationalityGroupId}?page=${
      page || apiDefaults.pagination.startPage
    }&perPage=${perPage || apiDefaults.pagination.perPage}`;
    uri = appendQueryParam(uri, 'v', v);
    return apiClient.get(uri);
  },

  community: ({
    communityId,
    contextCountryCode,
    postType,
    contextId,
    page,
    perPage,
  }) => {
    let uri = `/feeds/community/${
      communityId && postType ? `${communityId}_${postType}` : ''
    }?page=${page || apiDefaults.pagination.startPage}&perPage=${
      perPage || apiDefaults.pagination.perPage
    }&contextId=${contextId}`;
    uri = appendQueryParam(uri, 'communityId', communityId);
    uri = appendQueryParam(uri, 'contextCountryCode', contextCountryCode);
    return apiClient.get(uri);
  },

  entity: ({id, page, perPage}) =>
    apiClient.get(
      `/feeds/activities/${id}?page=${
        page || apiDefaults.pagination.startPage
      }&perPage=${perPage || apiDefaults.pagination.perPage}`,
    ),
};
