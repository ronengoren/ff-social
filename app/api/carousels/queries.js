import apiClient from '../apiClient';
import {appendQueryParam} from '../../infra/utils';
import {apiDefaults} from '../../vars';

export default {
  getEntities: ({
    id,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
    communityId,
  }) => {
    let url = `carousels/${id}/entities/?page=${page}&perPage=${perPage}`;
    url = appendQueryParam(url, 'communityId', communityId);
    return apiClient.get(url);
  },
};
