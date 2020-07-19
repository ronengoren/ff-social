import apiClient from '../apiClient';

export default {
  chatBlockUser: ({chatParticipantId}) =>
    apiClient.post(`/users/${chatParticipantId}/chat/block/`),

  chatUnblockUser: ({chatParticipantId}) =>
    apiClient.post(`/users/${chatParticipantId}/chat/unblock/`),

  chatAllowUser: ({chatParticipantId}) =>
    apiClient.post(`/users/${chatParticipantId}/chat/allow/`),

  setBadgeNumber: ({badgeNumber}) =>
    apiClient.post('/users/me/setBadge', {badgeNumber}),

  verifyEmail: ({emailToValidate}) =>
    apiClient.post('/users/verifyEmail', {emailToValidate}),

  changeEmail: ({email}) => apiClient.put('users/changeEmail', {email}),

  delete: ({userId}) => apiClient.delete(`users/${userId}`),

  setInstagramToken: ({code}) =>
    apiClient.post('/users/instagramToken', {code}),

  deleteInstagramToken: ({token}) =>
    apiClient.delete('/users/instagramToken', {data: {token}}),
};
