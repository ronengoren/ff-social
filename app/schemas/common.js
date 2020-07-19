import {
  string,
  number,
  bool,
  array,
  object,
  shape,
  oneOf,
  oneOfType,
  arrayOf,
} from 'prop-types';
import {userTypes, solutionTypes} from '../vars/enums';

export const actorScheme = shape({
  id: string,
  thumbnail: string,
  name: string,
  themeColor: string,
});

export const mediaScheme = shape({
  ratio: number,
  thumbnail: string,
  type: oneOf(['image', 'video', '']),
  url: string,
});

export const solutionScheme = shape({
  solutionType: oneOf([
    solutionTypes.TREE,
    solutionTypes.TAG,
    solutionTypes.ENTITY,
  ]),
  name: string,
  tagName: string,
  entityType: string,
  entityId: string,
});

export const userScheme = shape({
  id: string,
  name: string,
  media: shape({
    thumbnail: string,
    profile: string,
  }),
  themeColor: string,
  communityId: string,
  originCountryName: string,
  currentCityName: string,
  settings: shape({
    notifications: shape({
      messages: bool,
      ongoingUpdates: bool,
      friendRequests: bool,
      comments: bool,
      likes: bool,
    }),
    showAge: bool,
    showRelationship: bool,
    showGender: bool,
  }),
  userType: oneOf(Object.values(userTypes)),
});

export const locationScheme = shape({
  placeName: string,
  fullAddress: string,
  addressLine2: string,
  city: string,
  state: string,
  zipCode: string,
  coordinates: array,
});

export const linkScheme = shape({
  url: string,
  host: string,
  id: string,
  info: shape({
    title: string,
    description: string,
    ratio: number,
    type: string,
  }),
  scrapeDate: string,
});

export const stylesScheme = oneOfType([number, bool, array, object]);

export const mentionsSchema = arrayOf(
  shape({
    entityType: string,
    entity: userScheme,
  }),
);

export const neighborhoodScheme = shape({
  id: string,
  name: string,
  location: arrayOf(number),
  media: mediaScheme,
});

export const searchMentionsScheme = shape({
  results: array,
  page: number,
  query: string,
  resultsNumberPages: number,
  resultsHits: number,
  isSearching: bool,
});
