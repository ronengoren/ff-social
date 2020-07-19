import countries from '../../screens/signup/JoinCommunity/countries';
import {isEmpty, get} from '../../infra/utils';

// eslint-disable-next-line import/prefer-default-export
export const getUserUpperLevelCountries = ({user}) => {
  if (!user) {
    return countries;
  }

  const {nationalityGroup} = user;
  const {originNumericCountryCodes} = nationalityGroup;
  const filtered = countries.filter((country) =>
    originNumericCountryCodes.includes(country.countryCode),
  );
  return filtered;
};

export const hasProfilePicture = (user = {}) =>
  !isEmpty(get(user, 'media.profile') || get(user, 'media.thumbnail'));
