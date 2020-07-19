import apiClient from '../apiClient';
import {joinArrayToString} from '../../infra/utils/stringUtils';

export default {
  save: ({entityType, entityId, contextEntityId, contextEntityType, tags}) =>
    apiClient.post(`/entities/save`, {
      entityType,
      entityId,
      contextEntityId,
      contextEntityType,
      tags: joinArrayToString(tags),
      isPrivate: false,
    }),

  unsave: ({entityType, entityId}) =>
    apiClient.delete(
      `/entities/unsave?entityId=${entityId}&entityType=${entityType}`,
    ),
};
