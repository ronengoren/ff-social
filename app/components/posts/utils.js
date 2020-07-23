import I18n from '../../infra/localization';
import {postTypes, postSubTypes, entityTypes} from '../../vars/enums';
import {get} from '../../infra/utils';
import {
  getDaysDifference,
  getLocaleTimeForFeed,
  translateDateTimeAMPM,
} from '../../infra/utils/dateTimeUtils';
// import { getTranslatedOriginNativesName } from '/infra/utils/communitiesNationalitiesUtils';
import {getCountryByCode} from '../../screens/signup/JoinCommunity/countries';

const getPostTimeText = ({eventTime, scheduledDate, user}) => {
  if (scheduledDate) {
    return I18n.t('posts.header.scheduled_to', {
      scheduledDate: translateDateTimeAMPM(scheduledDate),
    });
  }
  const shouldShowAccurateTime = get(
    user,
    'nationalityGroup.featureFlags.showPublishTime',
  );
  const daysDifference = getDaysDifference(eventTime);
  const isPostedToday = daysDifference < 1;
  const isPostedThisWeek = daysDifference >= 1 && daysDifference <= 6;
  const isPostedThisMonth = daysDifference <= 27;
  if (isPostedToday && !shouldShowAccurateTime) {
    return I18n.t('posts.header.today');
  }
  if (isPostedToday && !!shouldShowAccurateTime) {
    return getLocaleTimeForFeed(eventTime);
  }
  if (isPostedThisWeek) {
    return I18n.t('posts.header.weeks.one');
  }
  return isPostedThisMonth
    ? I18n.t('posts.header.weeks', {count: Math.ceil(daysDifference / 7)})
    : getLocaleTimeForFeed(eventTime);
};

const getPostNationalityName = ({originNativesName, contextCountryCode}) => {
  //   if (contextCountryCode) {
  //     const { nationality: contextNationality } = getCountryByCode(contextCountryCode);
  //     return I18n.t('posts.header.nationality_references.for', { nationalityName: contextNationality });
  //   } else {
  //     const nationalityName = getTranslatedOriginNativesName({ originNativesName });
  //     return I18n.t('posts.header.nationality_references.all', { nationalityName });
  //   }
};

const isBoardPost = ({entityType, postType}) =>
  entityType === entityTypes.EVENT ||
  (entityType === entityTypes.POST &&
    [postTypes.REAL_ESTATE, postTypes.GIVE_TAKE, postTypes.JOB].includes(
      postType,
    ));

const getTranslatedPostType = ({postType, postSubType, tags}) => {
  let translatedPostType = postType;
  switch (postType) {
    case postTypes.GIVE_TAKE:
      if (tags && tags.length) {
        translatedPostType = I18n.t(
          `postTypes.${postType}.${postSubType}.${tags[0]}`,
        );
      } else {
        translatedPostType =
          postSubType === postSubTypes.OFFERING
            ? I18n.t(`postTypes.${postType}.generic_header`)
            : I18n.t(`postTypes.${postType}.${postSubType}`);
      }

      break;
    case postTypes.JOB:
      translatedPostType = I18n.t(`postTypes.${postType}.${postSubType}`);
      break;
    case postTypes.REAL_ESTATE:
      translatedPostType = I18n.t(
        `postTypes.${postType}.${postSubType}.${tags[0]}`,
        {defaults: [{scope: `postTypes.${postType}.generic_header`}]},
      );
      break;
    default:
      translatedPostType = I18n.t(`postTypes.titles.${postType}`);
      translatedPostType = I18n.t(`postTypes.titles.${postType}`);
  }

  return translatedPostType;
};

export {
  getPostTimeText,
  getTranslatedPostType,
  getPostNationalityName,
  isBoardPost,
};
