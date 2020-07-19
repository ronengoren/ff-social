import apiClient from '../apiClient';
import {apiDefaults} from '../../vars';

export default {
  notifications: ({page, perPage}) =>
    apiClient.get(
      `/feeds/notification?page=${
        page || apiDefaults.pagination.startPage
      }&perPage=${perPage || apiDefaults.pagination.perPage}`,
    ),
};
