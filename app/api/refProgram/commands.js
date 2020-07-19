import apiClient from '../apiClient';

export default {
  redeem: ({requesterEmail, userIdsToRedeem}) =>
    apiClient.post(`/refProgram/redeemRequest`, {
      requesterEmail,
      userIdsToRedeem,
    }),
};
