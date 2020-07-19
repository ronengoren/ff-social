import apiClient from '../apiClient';
import {appendQueryParam} from '../../infra/utils';
import {apiDefaults} from '../../vars';

export default {
  getStories: ({
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) => {
    let uri = '/stories';
    uri = appendQueryParam(uri, 'page', page);
    uri = appendQueryParam(uri, 'perPage', perPage);
    return apiClient.get(uri);
  },
};
