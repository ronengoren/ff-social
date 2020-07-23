import I18n from '../../infra/localization';
import {addSpaceOnCapitalsAndCapitalize} from '../../infra/utils/stringUtils';
import {MY_HOOD} from './enums';

// eslint-disable-next-line import/prefer-default-export
export const getThemeTagTranslation = ({theme, community} = {}) => {
  if (!theme) {
    return '';
  }

  let themeSuffix = '';
  const isMyHood = theme === MY_HOOD;
  if (isMyHood) {
    themeSuffix += `.${community.destinationPartitionLevel}`;
  }

  const defaultValue = addSpaceOnCapitalsAndCapitalize(theme);
  return I18n.t(`shared.tags.${theme}${themeSuffix}`, {
    defaultValue: I18n.t(`themes.${theme}${themeSuffix}`, {defaultValue}),
  });
};
