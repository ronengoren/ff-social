import React from 'react';
import * as screens from '/screens';
import I18n from '../infra/localization';
import {flipFlopColors} from '/vars';
import {Header} from '../components';
import {screenGroupNames} from '../vars/enums';
import {createStackNavigator} from 'react-navigation-stack';
import sharedRoutes from './sharedRoutes';

const Notifications = createStackNavigator(
  {
    [screenGroupNames.NOTIFICATIONS]: {
      screen: screens.Notifications,
      navigationOptions: () => {
        const title = I18n.t('communication_center.notifications.header');
        return {
          header: <Header title={title} />,
          animationEnabled: false,
        };
      },
    },
    ...sharedRoutes,
  },
  {
    initialRouteName: screenGroupNames.NOTIFICATIONS,
    headerMode: 'screen',
    defaultNavigationOptions: {
      cardStyle: {
        backgroundColor: flipFlopColors.white,
      },
    },
  },
);

export default Notifications;
