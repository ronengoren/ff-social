import apiClient from '../apiClient';
import {appendQueryParam} from '../../infra/utils';
import {apiDefaults} from '../../vars';

export default {
  getNeighborhoods: ({
    populated = true,
    firstNeighborhoodId,
    destinationTagNames,
    googlePlaceId,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) => {
    let uri = `/neighborhoods?page=${page}&perPage=${perPage}`;
    uri = appendQueryParam(uri, 'populated', populated);
    uri = appendQueryParam(uri, 'firstNeighborhoodId', firstNeighborhoodId);
    uri = appendQueryParam(uri, 'destinationTagNames', destinationTagNames);
    uri = appendQueryParam(uri, 'googlePlaceId', googlePlaceId);
    return apiClient.get(uri);
  },

  getNeighborhoodEntities: ({
    savedByUserId,
    neighborhoodId,
    entityType,
    entitySubType,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) => {
    let uri = `/neighborhoods/${neighborhoodId}/entities?page=${page}&perPage=${perPage}`;
    uri = appendQueryParam(uri, 'entityType', entityType);
    uri = appendQueryParam(uri, 'entitySubType', entitySubType);
    uri = appendQueryParam(uri, 'savedByUserId', savedByUserId);
    return apiClient.get(uri);
  },
};
