import {flipFlopColors} from '../../vars';

const UI_DEFINITIONS = {
  myhood: {iconName: 'map-marker-alt', backgroundColor: flipFlopColors.skyBlue},
  family: {
    iconName: 'male',
    secondIconName: 'female',
    backgroundColor: flipFlopColors.liliac,
  },
  eatDrink: {iconName: 'utensils', backgroundColor: flipFlopColors.pinky},
  essentials: {
    iconName: 'toolbox',
    backgroundColor: flipFlopColors.periwinkleBlue,
  },
  health: {iconName: 'user-md', backgroundColor: flipFlopColors.sandYellow},
  lifestyle: {
    iconName: 'paint-brush',
    backgroundColor: flipFlopColors.tiffanyBlue,
  },
  legal: {iconName: 'gavel', backgroundColor: flipFlopColors.lightTeal},
  travel: {iconName: 'plane', backgroundColor: flipFlopColors.apricotTwo},
  other: {
    iconName: 'feather-alt',
    backgroundColor: flipFlopColors.lightGreyBlue,
  },
  default: {iconName: 'folder', backgroundColor: flipFlopColors.silver},
};

export const themesEnums = {
  MY_HOOD: 'myhood',
  FAMILY: 'family',
  EAT_DRINK: 'eatDrink',
  ESSENTIALS: 'essentials',
  HEALTH: 'health',
  LIFESTYLE: 'lifestyle',
  LEGAL: 'legal',
  TRAVEL: 'travel',
  PROMOTIONS: 'promotions',
  OTHER: 'other',
  DEFAULT: 'default',
};

export const getThemeUI = (theme) =>
  UI_DEFINITIONS[theme] || UI_DEFINITIONS.default; // eslint-disable-line import/prefer-default-export

export const MY_HOOD = 'myhood';
