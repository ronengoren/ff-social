import apiClient from '../apiClient';
import {joinArrayToString} from '../../infra/utils/stringUtils';

export default {
  invite: ({toIds}) =>
    apiClient.post('/friendships/invite', {toIds: joinArrayToString(toIds)}),

  approve: ({toId}) => apiClient.post('/friendships/approve', {toId}),

  unfriend: ({toId}) => apiClient.post('/friendships/unfriend', {toId}),
};
