import apiClient from '../../api/apiClient';
import {appendQueryParam} from '../../infra/utils';

export default {
  getNationalities: () => apiClient.get('nationalityGroups/nationalities'),

  getNationalityGroups: () => apiClient.get('nationalityGroups'),

  getFacebookProfileImage: ({accessToken}) =>
    apiClient.get(`auth/getFacebookProfileImage/?accessToken=${accessToken}`),

  forgotPassword: ({email}) =>
    apiClient.get(`auth/forgotPassword/?email=${email}`),

  isEmailAddressExists: ({email}) =>
    apiClient.get(`auth/isEmailAddressExists/${email}`),

  getCommunitySettings: ({communityId}) =>
    apiClient.get(`/flow/communitySettings/${communityId}`),

  matchedCommunity: ({originCountryCode, destinationCityId}) => {
    let uri = '/communities/matchedCommunity/';
    uri = appendQueryParam(uri, 'originCountryCode', originCountryCode);
    uri = appendQueryParam(uri, 'destinationCityId', destinationCityId);
    return apiClient.get(uri);
  },

  matchedNationality: ({originCode, destinationCode}) => {
    let uri = '/nationalityGroups/matchedNationality/';
    uri = appendQueryParam(uri, 'originCode', originCode);
    uri = appendQueryParam(uri, 'destinationCode', destinationCode);
    return apiClient.get(uri);
  },
};
