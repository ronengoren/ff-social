import apiClient from '../apiClient';

export default {
  editProfile: ({
    id = 'me',
    name = {},
    birthday,
    settings = {},
    relationship,
    numOfKids,
    gender,
    workDetails = {},
    user = {journey: {}},
    bio,
    communityId,
  }) =>
    apiClient.put(`/users/${id}/profile`, {
      firstName: name.firstName,
      lastName: name.lastName,
      birthday,
      relationship,
      numOfKids,
      gender,
      settings,
      workPlace: workDetails.place,
      workTitle: workDetails.title,
      journeyArrivedDate: user.journey.arrivedDate,
      originGoogleId: user.journey.originGoogleId,
      neighborhoodId: user.journey.currentlyLiveInId,
      originCountryName: user.journey.originCountryName,
      originPlaceSearchCountryFilter:
        user.journey.originPlaceSearchCountryFilter,
      destinationCityName: user.journey.destinationCityName,
      destinationCityGooglePlaceId: user.journey.destinationCityGooglePlaceId,
      destinationCityId: user.journey.destinationCityId,
      destinationCountryName: user.journey.destinationCountryName,
      destinationCountryCode: user.journey.destinationCountryCode,
      destinationCountryAlpha2: user.journey.destinationCountryAlpha2,
      bio,
      communityId,
    }),

  editImage: ({userId, imageUrl}) =>
    apiClient.put(`/users/${userId}/media`, {imageUrl}),
};
