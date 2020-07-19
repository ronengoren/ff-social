import apiClient from '../apiClient';
import {appendQueryParam} from '../../infra/utils';
import {apiDefaults} from '../../vars';
import {joinArrayToString} from '../../infra/utils/stringUtils';

export default {
  getUserSavedItemsByThemes: ({
    userId,
    themes,
    entityTypes,
    featured,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) => {
    let uri = `/themes/user/${userId}?page=${page}&perPage=${perPage}`;
    uri = appendQueryParam(uri, 'themes', joinArrayToString(themes));
    uri = appendQueryParam(uri, 'entityTypes', joinArrayToString(entityTypes));
    uri = appendQueryParam(uri, 'featured', featured);
    return apiClient.get(uri);
  },

  getItemsByThemes: ({
    themes,
    entityTypes,
    tags,
    tagsToExclude,
    featured,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) => {
    let uri = `/themes/?page=${page}&perPage=${perPage}`;
    uri = appendQueryParam(uri, 'themes', joinArrayToString(themes));
    uri = appendQueryParam(uri, 'entityTypes', joinArrayToString(entityTypes));
    uri = appendQueryParam(uri, 'featured', featured);
    uri = appendQueryParam(uri, 'tags', tags);
    uri = appendQueryParam(uri, 'tagsToExclude', tagsToExclude);

    return apiClient.get(uri);
  },
};
