import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import * as screens from '../screens';
import {Header} from '../components';
import {screenGroupNames, screenNames} from '../vars/enums';
import {flipFlopColors} from '../vars';
// import CreateGroup from './createGroup';
import sharedRoutes from './sharedRoutes';

const Groups = createStackNavigator(
  {
    [screenNames.GroupsTab]: {
      screen: screens.GroupsTab,
      navigationOptions: {
        header: <Header />,
        animationEnabled: false,
      },
    },
    // [screenNames.InviteMembers]: {
    //   screen: screens.InviteMembers,
    //   navigationOptions: {
    //     headerShown: false
    //   }
    // },
    // [screenGroupNames.CREATE_GROUP_MODAL]: {
    //   screen: CreateGroup,
    //   navigationOptions: {
    //     headerShown: false,
    //     gesturesEnabled: false
    //   }
    // },
    ...sharedRoutes,
  },
  {
    initialRouteName: screenNames.GroupsTab,
    headerMode: 'screen',
    defaultNavigationOptions: {
      cardStyle: {
        backgroundColor: flipFlopColors.white,
      },
    },
  },
);

export default Groups;
