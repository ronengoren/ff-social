import apiClient from '../apiClient';

export default {
  getIdentityToken: ({nonce}) => apiClient.post('/flow/getChatToken', {nonce}),
};
