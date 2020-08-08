import React from 'react';
import PropTypes from 'prop-types';
import {TranslatedText, Text} from '../../../components/basicComponents';
import I18n from '../../../infra/localization';
import {get} from '../../../infra/utils';
import {numberWithCommas} from '../../../infra/utils/stringUtils';
import {getDisplayedUsersCount} from '../../../infra/utils/onboardingUtils';
import {stylesScheme} from '../../../schemas/common';
import {getCommunityTranslationByOriginAndDestination} from '../../../infra/utils/communitiesNationalitiesUtils';

const MAX_CHARS_FOR_TRANSLATION_SIZE = 70;

function JoinNationalityTitle({
  nationality,
  translationKey,
  originCountry,
  destinationCountry,
  style,
  smallTextStyle,
  smallNumbersStyle,
  textStyle,
  numbersStyle,
}) {
  const {isDummy} = 'nationality';
  const {countryCode: originCode} = originCountry;
  const locale = I18n.getLocale();
  // TODO: remove this after we will come up with proper fix for fr countries trnaslations
  const forcedLocale = locale === 'fr' ? 'en' : locale;
  const nationalityTranslation = getCommunityTranslationByOriginAndDestination({
    // originCountry,
    destinationCountry,
    forcedLocale,
  });
  const numOfUsers = getDisplayedUsersCount(
    get(nationality, `totals.usersByOrigin.${originCode}`),
  );
  const joinMembersTranslation = I18n.t(`onboarding.${translationKey}.title`, {
    nationalityTranslation,
    locale: forcedLocale,
  });
  const isSmallerTextStyle =
    joinMembersTranslation.length > MAX_CHARS_FOR_TRANSLATION_SIZE;

  return (
    <TranslatedText
      style={style}
      textStyle={isSmallerTextStyle ? smallTextStyle : textStyle}
      map={[
        {
          text: !isDummy ? `${numberWithCommas(numOfUsers)} ` : '',
          style: isSmallerTextStyle ? smallNumbersStyle : numbersStyle,
        },
      ]}>
      {joinMembersTranslation}
    </TranslatedText>
  );
}

JoinNationalityTitle.propTypes = {
  nationality: PropTypes.object,
  translationKey: PropTypes.string,
  smallTextStyle: stylesScheme,
  smallNumbersStyle: stylesScheme,
  style: stylesScheme,
  textStyle: stylesScheme,
  numbersStyle: stylesScheme,
  destinationCountry: PropTypes.object,
  originCountry: PropTypes.object,
};

export default JoinNationalityTitle;
