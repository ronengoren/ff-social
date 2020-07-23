import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {Header} from '../components';
import * as screens from '../screens';
import I18n from '../infra/localization';
import {flipFlopColors} from '../vars';
import {screenNames, screenGroupNames} from '../vars/enums';
import sharedRoutes from './sharedRoutes';

const MyCity = createStackNavigator(
  {
    [screenGroupNames.MY_CITY]: {
      screen: screens.Profile,
      navigationOptions: {
        headerShown: false,
      },
    },
    // [screenNames.EditProfile]: {
    //   screen: screens.EditProfile,
    //   navigationOptions: {
    //     headerShown: false
    //   }
    // },
    // [screenNames.EditProfileRelationship]: {
    //   screen: screens.EditProfileRelationship,
    //   navigationOptions: () => {
    //     const title = I18n.t('profile.edit_profile_relationship.header');
    //     return {
    //       header: <Header hasBackButton title={title} />
    //     };
    //   }
    // },
    // [screenNames.EditProfileGender]: {
    //   screen: screens.EditProfileGender,
    //   navigationOptions: () => {
    //     const title = I18n.t('profile.edit.generic_header');
    //     return {
    //       header: <Header hasBackButton title={title} />
    //     };
    //   }
    // },
    // [screenNames.Settings]: {
    //   screen: screens.Settings,
    //   navigationOptions: () => {
    //     const title = I18n.t('profile.settings.screen_header');
    //     return {
    //       header: <Header hasBackButton title={title} />
    //     };
    //   }
    // },
    // [screenNames.ChangeEmail]: {
    //   screen: screens.ChangeEmail,
    //   navigationOptions: {
    //     headerShown: false
    //   }
    // },
    // [screenNames.DeleteAccountConfirmation]: {
    //   screen: screens.DeleteAccountConfirmation,
    //   navigationOptions: {
    //     headerShown: false
    //   }
    // },
    // [screenNames.DeleteAccount]: {
    //   screen: screens.DeleteAccount,
    //   navigationOptions: {
    //     headerShown: false
    //   }
    // },
    // [screenNames.ConnectedUsersList]: {
    //   screen: screens.ConnectedUsersList,
    //   navigationOptions: () => {
    //     const title = I18n.t('profile.connected_users_list.header');
    //     return {
    //       header: <Header hasBackButton title={title} />
    //     };
    //   }
    // },
    ...sharedRoutes,
  },
  {
    initialRouteName: screenGroupNames.MY_CITY,
    headerMode: 'screen',
    defaultNavigationOptions: {
      cardStyle: {
        backgroundColor: flipFlopColors.white,
      },
    },
  },
);

export default MyCity;
