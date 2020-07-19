import apiClient from '../apiClient';
import {joinArrayToString} from '../../infra/utils/stringUtils';

export default {
  create: ({
    mediaUrl,
    name,
    website,
    startTime,
    endTime,
    privacyType,
    description,
    tags,
    googleId,
    hostEntityId,
    hostEntityType,
    contextId,
    contextType,
    contextCountryCode,
    hostType,
  }) => {
    const createPayload = {
      mediaUrl,
      name,
      website,
      startTime,
      endTime,
      privacyType,
      description,
      tags: joinArrayToString(tags),
      googleId,
      hostEntityId,
      hostEntityType,
      contextId,
      contextType,
      contextCountryCode,
      hostType,
    };
    if (contextCountryCode === undefined) {
      delete createPayload.contextCountryCode;
    }
    return apiClient.post('/events', createPayload);
  },

  edit: ({
    eventId,
    name,
    website,
    startTime,
    endTime,
    googleId,
    tags,
    description,
    privacyType,
    hostEntityId,
    hostEntityType,
    contextCountryCode,
    hostType,
  }) => {
    const createPayload = {
      name,
      website,
      startTime,
      endTime,
      googleId,
      tags: joinArrayToString(tags),
      description,
      privacyType,
      hostEntityId,
      hostEntityType,
      contextCountryCode,
      hostType,
    };
    if (contextCountryCode === undefined) {
      delete createPayload.contextCountryCode;
    }
    return apiClient.put(`/events/${eventId}`, createPayload);
  },

  editImage: ({eventId, mediaUrl}) =>
    apiClient.put(`events/${eventId}/media`, {mediaUrl}),

  setRSVP: ({eventId, rsvpStatus}) =>
    apiClient.put(`events/${eventId}/RSVP/${rsvpStatus}`),

  addInvitees: ({eventId, inviteesIds}) =>
    apiClient.post(`events/${eventId}/invitees`, {
      eventId,
      inviteesIds: joinArrayToString(inviteesIds),
    }),

  delete: ({eventId}) => apiClient.delete(`/events/${eventId}`),
};
