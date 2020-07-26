import {isNil, get, isEmpty} from '../../infra/utils';
import {screenNames, genderType} from '../../vars/enums';

export const getRelevantOnboardingScreen = ({
  user,
  matchedNationality,
  suggestedNationalities,
}) => {
  if (matchedNationality) {
    if (user) {
      const isGenderNotValid =
        isNil(get(user, 'gender')) ||
        get(user, 'gender') === genderType.UNKNOWN;

      if (isGenderNotValid) {
        return screenNames.SetUserGender;
      }
      return screenNames.SetUserDetails;
    } else {
      return screenNames.SignUp;
    }
  } else if (
    suggestedNationalities &&
    !isEmpty(user.journey.originCountry) &&
    !isEmpty(user.journey.destinationCountry)
  ) {
    return screenNames.NoNationality;
  } else if (user) {
    return screenNames.SetUserNationality;
  }

  return screenNames.SetUserDetails;
};

const MINIMUM_NUM_OF_USERS = 1236;

export const getDisplayedUsersCount = (usersCount) => {
  const displayedUsersCount = Math.max(usersCount, MINIMUM_NUM_OF_USERS);
  return displayedUsersCount;
};

// eslint-disable-next-line camelcase
export const formatTopCitiesToMatchPlacesServiceResponse = ({
  name: description,
  count,
  cityId,
}) => ({
  id: cityId,
  description,
  count,
});
