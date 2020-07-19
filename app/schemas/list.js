import {string, number, bool, object, shape, arrayOf, array} from 'prop-types';
import {mediaScheme, actorScheme, linkScheme} from './common';

export const listScheme = shape({
  id: string,
  name: string,
  createdAt: string,
  media: mediaScheme,
  totalItems: number,
  totalVotes: number,
  collaborative: bool,
  contributors: arrayOf(
    shape({
      id: string,
      fullname: string,
      thumbnail: string,
      themeColor: string,
    }),
  ),
  totalContributors: number,
  isSaved: bool,
  creator: object,
  totalSaves: number,
});

export const listItemScheme = shape({
  id: string,
  idx: number,
  listId: string,
  title: string,
  description: string,
  media: arrayOf(mediaScheme),
  link: linkScheme,
  pageId: string,
  googlePlaceId: string,
  location: shape({
    placeName: string,
    fullAddress: string,
    addressLine: string,
    city: string,
    state: string,
    country: string,
    zipCode: string,
    coordinates: array,
  }),
  creator: actorScheme,
  voters: arrayOf(actorScheme),
  totalVotes: number,
  totalItems: number,
  voted: bool,
  comments: arrayOf(string),
  createdAt: string,
  isSaved: bool,
  totalComments: number,
  page: shape({
    category: object,
  }),
  phones: arrayOf(object),
});
