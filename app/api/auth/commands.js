import apiClient from '../apiClient';
import {
  getDeviceType,
  getDeviceUUID,
  getDeviceInfoForRegistration,
} from '../../infra/utils/deviceUtils';

export default {
  signIn: (args) => apiClient.post('/auth/login', args),

  fbSignIn: ({accessToken}) => apiClient.post('/auth/fbLogin', {accessToken}),

  appleSignIn: (args) => apiClient.post('auth/appleLogin', args),

  logout: () => apiClient.post('/auth/logout'),

  signUp: (args) =>
    apiClient.post('/auth/signup', {
      ...args,
      deviceInfo: getDeviceInfoForRegistration(),
    }),

  fbSignUp: (args) =>
    apiClient.post('/auth/fbSignup', {
      ...args,
      deviceInfo: getDeviceInfoForRegistration(),
    }),

  appleSignUp: (args) =>
    apiClient.post('/auth/appleSignup', {
      ...args,
      deviceInfo: getDeviceInfoForRegistration(),
    }),

  addDeviceToken: ({token}) =>
    apiClient.post('/users/deviceToken', {
      token,
      deviceType: getDeviceType(),
      deviceId: getDeviceUUID(),
    }),

  removeDeviceToken: ({token}) =>
    apiClient.delete('/users/deviceToken', {data: {token}}),

  changePassword: ({oldPassword = '', newPassword}) =>
    apiClient.put('/users/changePassword', {oldPassword, newPassword}),

  impersonate: ({userId}) => apiClient.post('/auth/impersonate', {userId}),

  refreshUserData: () =>
    apiClient.post('/flow/init', {deviceType: getDeviceType()}),

  onboarded: () => apiClient.post('/flow/onboarded'),
};
