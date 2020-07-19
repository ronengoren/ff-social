import apiClient from '../apiClient';
import {joinArrayToString} from '../../infra/utils/stringUtils';

export default {
  create: ({
    name,
    privacyType,
    mediaUrl,
    membersIds,
    description,
    tags,
    contextCountryCode,
  }) => {
    const createPayload = {
      name,
      privacyType,
      mediaUrl,
      membersIds: joinArrayToString(membersIds),
      description,
      tags: joinArrayToString(tags),
      contextCountryCode,
    };
    if (contextCountryCode === undefined) {
      delete createPayload.contextCountryCode;
    }
    return apiClient.post('/groups', createPayload);
  },

  editImage: ({groupId, mediaUrl}) =>
    apiClient.put(`/groups/${groupId}/media`, {mediaUrl}),

  edit: ({
    groupId,
    tags = [],
    name,
    description,
    rules = '',
    privacyType,
    hideMemberList = false,
    headerItems = [],
    allowedPostTypes = [],
    contextCountryCode,
  }) => {
    const createPayload = {
      groupId,
      tags: joinArrayToString(tags),
      name,
      description,
      rules,
      privacyType,
      contextCountryCode,
      hideMemberList,
      headerItems: joinArrayToString(headerItems),
      allowedPostTypes: joinArrayToString(allowedPostTypes),
    };
    if (contextCountryCode === undefined) {
      delete createPayload.contextCountryCode;
    }

    return apiClient.put(`/groups/${groupId}`, createPayload);
  },

  join: ({groupId}) => apiClient.put(`/groups/${groupId}/join/`, {groupId}),

  leave: ({groupId}) => apiClient.put(`/groups/${groupId}/leave/`, {groupId}),

  delete: ({groupId}) => apiClient.delete(`/groups/${groupId}`),

  addMembers: ({groupId, membersIds}) =>
    apiClient.post(`groups/${groupId}/members`, {
      groupId,
      membersIds: joinArrayToString(membersIds),
    }),

  changeMembersRole: ({groupId, membersIds, memberType}) =>
    apiClient.put(`groups/${groupId}/members`, {
      groupId,
      membersIds: joinArrayToString(membersIds),
      memberType,
    }),

  removeMembers: ({groupId, membersIds}) =>
    apiClient.delete(
      `groups/${groupId}/members?membersIds=${joinArrayToString(membersIds)}`,
    ),

  highlightEntity: ({groupId, entityId, entityType}) =>
    apiClient.put(`groups/${groupId}/recommended/`, {entityId, entityType}),

  dehighlightEntity: ({groupId, entityId}) =>
    apiClient.delete(`groups/${groupId}/recommended/?entityId=${entityId}`),

  follow: ({groupsIds}) => apiClient.post(`/groups/follow`, {groupsIds}),
};
