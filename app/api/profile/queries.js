import apiClient from '../apiClient';

export default {
  getProfile: ({userId}) => apiClient.get(`/users/${userId}`),
};
