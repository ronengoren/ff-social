import apiClient from '../apiClient';

export default {
  likedBy: ({commentId}) => apiClient.get(`/comments/${commentId}/likes`),
};
