import apiClient from '../apiClient';

export default {
  gettoken: ({entityType, filename}) =>
    apiClient.post('/uploads/gettoken', {entityType, filename}),

  getImageObject: ({mediaUrl, width, height}) =>
    apiClient.post('/uploads/mediaObject', {mediaUrl, width, height}),
};
