import apiClient from '../apiClient';
import {joinArrayToString} from '../../infra/utils/stringUtils';

export default {
  create: ({
    name,
    claimed,
    about,
    isAddressGooglePlaceId,
    googleId,
    addressLine2,
    phoneNumber,
    website,
    tags,
    mediaUrl,
    contextCountryCode,
  }) => {
    const createPayload = {
      name,
      claimed,
      about,
      isAddressGooglePlaceId,
      googleId,
      addressLine2,
      phoneNumber,
      website,
      tags: joinArrayToString(tags),
      mediaUrl,
      contextCountryCode,
    };
    if (contextCountryCode === undefined) {
      delete createPayload.contextCountryCode;
    }
    return apiClient.post('/pages', createPayload);
  },

  edit: ({
    pageId,
    name,
    about,
    isAddressGooglePlaceId,
    googleId,
    addressLine2,
    phoneNumber,
    website,
    tags,
    openingHours,
    contextCountryCode,
  }) => {
    const createPayload = {
      pageId,
      name,
      about,
      isAddressGooglePlaceId,
      googleId,
      addressLine2,
      phoneNumber,
      website,
      tags: joinArrayToString(tags),
      openingHours,
      contextCountryCode,
    };
    if (contextCountryCode === undefined) {
      delete createPayload.contextCountryCode;
    }
    return apiClient.put(`/pages/${pageId}`, createPayload);
  },

  editImage: ({pageId, mediaUrl}) =>
    apiClient.put(`/pages/${pageId}/media`, {mediaUrl}),

  delete: ({pageId}) => apiClient.delete(`/pages/${pageId}`),

  claim: ({pageId, claimerText}) =>
    apiClient.put(`/pages/${pageId}/claim`, {claimerText}),

  addFollowers: ({pageId, userIds}) =>
    apiClient.post(`/pages/${pageId}/follows`, {
      userIds: joinArrayToString(userIds),
    }),

  unfollow: ({pageId}) => apiClient.delete(`/pages/${pageId}/follows`),

  addReview: ({pageId, text}) =>
    apiClient.post(`/pages/${pageId}/reviews/`, {pageId, text}),

  followMany: ({userId, pageIds}) =>
    apiClient.post(`/pages/user/${userId}/follow`, {
      pagesIds: Array.isArray(pageIds) ? pageIds.join(',') : pageIds,
    }),
};
