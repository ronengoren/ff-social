import apiClient from '../apiClient';
import {getDeviceInfoForRegistration} from '../../infra/utils/deviceUtils';

export default {
  add: ({userId, fromCountry, toCountry, email = ''}) =>
    apiClient.post('/waitingList', {
      userId,
      fromCountry,
      toCountry,
      email,
      deviceInfo: getDeviceInfoForRegistration(),
    }),
};
