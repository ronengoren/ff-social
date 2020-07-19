import axios from 'axios';
import config from '../../../../config';

class StatsProvider {
  constructor() {
    this.instance = axios.create({baseURL: config.providers.stats.url});

    this.instance.interceptors.request.use((config) => {
      const {user} = global.store.getState().auth;
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`; // eslint-disable-line no-param-reassign
      }

      return config;
    });
  }

  log({entityName, eventName, data}) {
    this.instance.get(`${entityName}/${eventName}/${data}`);
  }
}

export default new StatsProvider();
