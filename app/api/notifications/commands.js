import apiClient from '../apiClient';

export default {
  markItems: (changes) =>
    apiClient.post('/feeds/notification/markItems', changes),
};
