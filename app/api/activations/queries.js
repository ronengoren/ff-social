import apiClient from '../apiClient';
import {apiDefaults} from '../../vars';

export default {
  getActivation: ({activationId}) =>
    apiClient.get(`/activations/${activationId}`),

  getActivations: ({
    userId,
    page = apiDefaults.pagination.startPage,
    perPage = apiDefaults.pagination.perPage,
  }) =>
    apiClient.get(
      `/activations/journey/${userId}?page=${page}&perPage=${perPage}`,
    ),
};
