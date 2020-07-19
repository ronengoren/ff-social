import apiClient from '../apiClient';

export default {
  create: ({contextEntity, text, mediaUrl, publisherType, publisherId}) =>
    apiClient.post('/comments', {
      entityType: contextEntity.type,
      entityId: contextEntity.id,
      text,
      mediaUrl,
      publisherType,
      publisherId,
    }),

  like: ({commentId}) => apiClient.post(`/comments/${commentId}/likes`, {}),

  unlike: ({commentId}) => apiClient.delete(`/comments/${commentId}/likes`, {}),

  delete: ({commentId}) => apiClient.delete(`comments/${commentId}`),

  edit: ({commentId, text}) => apiClient.put(`comments/${commentId}`, {text}),
};
