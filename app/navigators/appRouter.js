import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import MiddleSection from './app';

import {flipFlopColors} from '../vars';
import {screenGroupNames, screenNames} from '../vars/enums';
import * as screens from '../screens';
import authentication from './authentication';

const AppTopNavigation = createSwitchNavigator(
  {
    [screenGroupNames.AUTHENTICATION]: {
      screen: authentication,
      navigationOptions: {
        headerShown: false,
      },
    },
    [screenGroupNames.SIGNED_IN]: {
      screen: MiddleSection,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: screenGroupNames.AUTHENTICATION,
    headerMode: 'screen',
    defaultNavigationOptions: {
      cardStyle: {
        backgroundColor: flipFlopColors.white,
      },
    },
  },
);

export default createAppContainer(AppTopNavigation);
