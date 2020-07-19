import apiClient from '../apiClient';

export default {
  create: ({entityId, entityType, reportType, description = ''}) =>
    apiClient.post('/reports/create', {
      entityId,
      entityType,
      reportType,
      description,
    }),
};
