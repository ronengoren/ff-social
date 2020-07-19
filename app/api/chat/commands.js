import apiClient from '../apiClient';

export default {
  hideMessage: ({messageId}) =>
    apiClient.post(`/chatMessages/${messageId}/hide`),
};
