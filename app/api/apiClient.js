import axios from 'axios';
import config from '../config';
import {
  getDeviceType,
  getVersionNumber,
  getVersionBuildNumber,
} from '../infra/utils/deviceUtils';

const instance = axios.create({
  baseURL: config.api.url,
  timeout: config.api.timeout,
});

instance.interceptors.request.use(
  (config) => {
    const {user} = global.store.getState().auth;
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`; // eslint-disable-line no-param-reassign
    }

    config.headers.appBuildNumber = getVersionBuildNumber(); // eslint-disable-line no-param-reassign
    config.headers.appVersion = getVersionNumber(); // eslint-disable-line no-param-reassign
    config.headers.device = getDeviceType(); // eslint-disable-line no-param-reassign
    return config;
  },
  (error) =>
    // Do something with request error
    Promise.reject(error),
);

export default instance;
