import apiClient from '../apiClient';
import {appendQueryParam} from '../../infra/utils';
import {apiDefaults} from '../../vars';

export default {
  getPosts: ({
    postType,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) => {
    let uri = '/scheduledPosts';
    uri = appendQueryParam(uri, 'postType', postType);
    uri = appendQueryParam(uri, 'page', page);
    uri = appendQueryParam(uri, 'perPage', perPage);
    return apiClient.get(uri);
  },
};
