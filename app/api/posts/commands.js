import apiClient from '../apiClient';
import {joinArrayToString} from '../../infra/utils/stringUtils';

export default {
  create: ({
    contextId,
    contextType,
    text,
    postType,
    mediaGallery,
    title,
    scrapedUrlId,
    sharedEntityType,
    sharedEntityId,
    isAddressGooglePlaceId,
    locationId,
    postSubType,
    tags,
    templateData,
    pageId,
    url,
    phoneNumber,
    publisherId,
    publisherType,
    scheduledDate,
    contextCountryCode,
  }) => {
    const createPayload = {
      contextId,
      contextType,
      text,
      postType,
      mediaGallery,
      title,
      scrapedUrlId,
      sharedEntityType,
      sharedEntityId,
      isAddressGooglePlaceId,
      locationId,
      postSubType,
      tags: joinArrayToString(tags),
      templateData,
      pageId,
      url,
      phoneNumber,
      publisherId,
      publisherType,
      scheduledDate,
      contextCountryCode,
    };
    if (contextCountryCode === undefined) {
      delete createPayload.contextCountryCode;
    }

    return apiClient.post('/posts', createPayload);
  },

  edit: ({
    postId,
    text,
    postType,
    mediaGallery,
    title,
    scrapedUrlId,
    locationId,
    postSubType,
    tags,
    templateData,
    pageId,
    scheduledDate,
    isScheduled,
    active,
    contextCountryCode,
  }) => {
    const postPayload = {
      text,
      postType,
      mediaGallery,
      title,
      scrapedUrlId,
      locationId,
      postSubType,
      tags: joinArrayToString(tags),
      templateData,
      pageId,
      scheduledDate,
      isScheduled,
      active,
      contextCountryCode,
    };

    if (contextCountryCode === undefined) {
      delete postPayload.contextCountryCode;
    }

    return apiClient.put(`/posts/${postId}/withHistory`, postPayload);
  },

  like: ({postId}) => apiClient.post(`/posts/${postId}/likes`, {}),

  unlike: ({postId}) => apiClient.delete(`/posts/${postId}/likes`, {}),

  delete: ({postId, isScheduled}) =>
    apiClient.delete(`/posts/${postId}`, {
      data: {isScheduled},
    }),

  removeFromFeed: ({postId}) =>
    apiClient.put(`/posts/${postId}/removeFromFeed`),

  pin: ({postId}) => apiClient.post(`/posts/${postId}/pin`),

  unpin: ({postId}) => apiClient.post(`/posts/${postId}/unpin`),

  contentQuality: ({postId, direction}) =>
    apiClient.put(`/posts/${postId}/cq`, {direction}),
};
