import apiClient from '../apiClient';
import {appendQueryParam} from '../../infra/utils';
import {storyActions} from '../../vars/enums';

const getStoryPayload = (params) => {
  const {
    preText,
    text,
    media,
    rank,
    communityId,
    nationalityGroupId,
    contextCountryCode,
    screenName,
    screenParams,
    actionType = storyActions.NAVIGATE,
    active = true,
  } = params;

  const payload = {
    preText,
    text,
    media,
    rank,
    communityId,
    nationalityGroupId,
    contextCountryCode,
    screenName,
    screenParams,
    actionType,
    active,
  };

  if (payload.contextCountryCode === undefined) {
    delete payload.contextCountryCode;
  }

  return payload;
};

export default {
  create: (params) => {
    let uri = '/stories';
    uri = appendQueryParam(uri);
    const payload = getStoryPayload(params);

    return apiClient.post(uri, payload);
  },

  edit: (params) => {
    const {storyId} = params;
    const uri = `/stories/${storyId}`;
    const payload = getStoryPayload(params);

    if (payload.contextCountryCode === undefined) {
      delete payload.contextCountryCode;
    }

    return apiClient.put(uri, payload);
  },

  delete: ({storyId}) => apiClient.delete(`/stories/${storyId}`),
};
