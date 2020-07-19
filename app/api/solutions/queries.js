import apiClient from '../apiClient';

export default {
  getTree: () => apiClient.get(`/solutionTrees`),
};
