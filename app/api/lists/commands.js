import apiClient from '../apiClient';
import {joinArrayToString} from '../../infra/utils/stringUtils';
import {appendQueryParam} from '../../infra/utils';

export default {
  create: ({
    contextId,
    contextType,
    name,
    description,
    collaborative,
    mediaUrl,
    publisherId,
    publisherType,
    items,
    tags,
    viewType,
    contextCountryCode,
  }) => {
    let uri = '/lists';
    uri = appendQueryParam(uri);

    const listPayload = {
      contextId,
      contextType,
      name,
      description,
      collaborative,
      mediaUrl,
      publisherId,
      publisherType,
      items,
      tags: joinArrayToString(tags),
      viewType,
      contextCountryCode,
    };

    if (contextCountryCode === undefined) {
      delete listPayload.contextCountryCode;
    }

    return apiClient.post(uri, listPayload);
  },

  edit: ({
    listId,
    name,
    description,
    collaborative,
    mediaUrl,
    items,
    tags,
    viewType,
    contextCountryCode,
  }) => {
    const uri = `/lists/${listId}`;
    const listPayload = {
      name,
      description,
      collaborative,
      mediaUrl,
      items,
      tags: joinArrayToString(tags),
      viewType,
      contextCountryCode,
    };

    if (contextCountryCode === undefined) {
      delete listPayload.contextCountryCode;
    }

    return apiClient.put(uri, listPayload);
  },

  delete: ({listId}) => apiClient.delete(`/lists/${listId}`),

  vote: ({listId, listItemId}) =>
    apiClient.post(`/lists/${listId}/${listItemId}/vote`),

  unVote: ({listId, listItemId}) =>
    apiClient.delete(`/lists/${listId}/${listItemId}/vote`),

  addItemToList: ({
    listId,
    title,
    description,
    mediaUrl,
    scrapedUrlId,
    pageId,
    isAddressGooglePlaceId,
    googlePlaceId,
    publisherId,
    publisherType,
    phoneNumber,
    tags,
    filterByCommunityId,
  }) =>
    apiClient.post(`/lists/${listId}/item`, {
      title,
      description,
      mediaUrl,
      scrapedUrlId,
      pageId,
      isAddressGooglePlaceId,
      googlePlaceId,
      publisherId,
      publisherType,
      phoneNumber,
      filterByCommunityId,
      tags: joinArrayToString(tags),
    }),

  editListItem: ({
    listId,
    listItemId,
    title,
    description,
    mediaUrl,
    scrapedUrlId,
    pageId,
    isAddressGooglePlaceId,
    googlePlaceId,
    publisherId,
    publisherType,
  }) =>
    apiClient.put(`/lists/${listId}/${listItemId}`, {
      title,
      description,
      mediaUrl,
      scrapedUrlId,
      pageId,
      isAddressGooglePlaceId,
      googlePlaceId,
      publisherId,
      publisherType,
    }),

  deleteListItem: ({listId, listItemId, filterByCommunityId}) => {
    let uri = `/lists/${listId}/${listItemId}`;
    uri = appendQueryParam(uri, 'filterByCommunityId', filterByCommunityId);
    return apiClient.delete(uri);
  },
};
