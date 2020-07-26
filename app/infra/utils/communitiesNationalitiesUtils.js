import I18n from '/infra/localization';
import {isNil, get} from '../utils';
import {getCountryByCode} from '../../screens/signup/JoinCommunity/countries';

const getTranslatedPath = ({path, value, plural}) => {
  if (!value) {
    return value;
  }
  let translationFunc = 't';
  const translationParams = [
    `${path}.${value.toLowerCase().replace(/ /g, '_')}`,
    {defaultValue: value},
  ];
  if (!isNil(plural)) {
    translationParams.unshift(plural ? 2 : 1);
    translationFunc = 'p';
  }
  return I18n[translationFunc](...translationParams);
};

export const getTranslatedOriginNativesName = ({
  originNativesName,
  plural = true,
}) =>
  getTranslatedPath({
    path: 'shared.natives_name',
    value: originNativesName,
    plural,
  });

export const getTranslatedDestination = ({destinationCountryName}) =>
  getTranslatedPath({path: 'shared.areas', value: destinationCountryName});

export const getCommunityTranslationByOriginAndDestination = ({
  originCountry,
  destinationCountry,
  forcedLocale,
}) => {
  const locale = forcedLocale || I18n.getLocale();
  // const {name: originName, countryCode: originCode} = originCountry;
  const {
    countryCode: destinationCountryCode,
    name: destinationCountryName,
  } = destinationCountry;
  const currentDestinationCountryFromSet = getCountryByCode(
    destinationCountryCode,
  );
  const destination =
    get(currentDestinationCountryFromSet, `translations.${locale}`) ||
    destinationCountryName;
  // const currentOriginFromSet = getCountryByCode(originCode);

  const origin =
    get(currentOriginFromSet, `pluralNation.${locale}`) || originName;
  const linkWord = I18n.getLinkWordPlaceholder({linkTo: destination});

  return I18n.t('common.X_in_Y', {origin, destination, linkWord, locale});
};

export const isBoundlessEnabled = (nationalityGroup) =>
  get(nationalityGroup, 'featureFlags.useCountryGranularityFeatures', false);
export const isGenderFilterEnabled = (nationalityGroup) =>
  get(nationalityGroup, 'featureFlags.showGenderFilter', true);
