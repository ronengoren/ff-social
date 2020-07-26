import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import * as screens from '../screens';
import I18n from '../infra/localization';
import {screenNames} from '../vars/enums';
import {Header} from '../components';
import {flipFlopColors} from '../vars';
import sharedRoutes from './sharedRoutes';

const People = createStackNavigator(
  {
    [screenNames.PeopleTab]: {
      screen: screens.PeopleTab,
      navigationOptions: {
        headerShown: false,
        animationEnabled: false,
      },
    },
    [screenNames.InviteFriends]: {
      screen: screens.InviteFriends,
      navigationOptions: () => {
        const title = I18n.t('people.invite_friends.screen_header');
        return {
          header: <Header hasBackButton title={title} />,
        };
      },
    },
    [screenNames.ReferralProgramStatus]: {
      screen: screens.ReferralProgramStatus,
      navigationOptions: () => {
        const title = I18n.t('referral_program_status.screen_header');
        return {
          header: <Header hasBackButton title={title} />,
        };
      },
    },
    [screenNames.Settings]: {
      screen: screens.Settings,
      navigationOptions: () => {
        const title = I18n.t('profile.settings.screen_header');
        return {
          header: <Header hasBackButton title={title} />,
        };
      },
    },
    [screenNames.ReferralRedeemed]: {
      screen: screens.ReferralRedeemed,
      navigationOptions: {
        headerShown: false,
      },
    },
    ...sharedRoutes,
  },
  {
    initialRouteName: screenNames.ReferralRedeemed,
    headerMode: 'screen',
    defaultNavigationOptions: {
      cardStyle: {
        backgroundColor: flipFlopColors.white,
      },
    },
  },
);

export default People;
