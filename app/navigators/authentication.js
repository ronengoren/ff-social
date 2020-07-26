import {createStackNavigator} from 'react-navigation-stack';
import {flipFlopColors} from '../vars';
import {screenGroupNames, screenNames} from '../vars/enums';
import * as screens from '../screens';
import SignUpWizard from './signUpWizard';

const authentication = createStackNavigator(
  {
    [screenNames.Welcome]: {
      screen: screens.Welcome,
      navigationOptions: {
        headerShown: false,
      },
    },
    // [screenNames.WebView]: {
    //   screen: screens.WebView,
    //   navigationOptions: {
    //     headerShown: false
    //   }
    // },
    [screenNames.SignIn]: {
      screen: screens.SignIn,
      navigationOptions: {
        headerShown: false,
      },
    },
    [screenNames.ForgotPassword]: {
      screen: screens.ForgotPassword,
      navigationOptions: {
        headerShown: false,
      },
    },
    [screenNames.EmailSent]: {
      screen: screens.EmailSent,
      navigationOptions: {
        headerShown: false,
      },
    },
    [screenNames.ChangePassword]: {
      screen: screens.ChangePassword,
      navigationOptions: {
        headerShown: false,
      },
    },
    [screenGroupNames.SIGN_UP_WIZARD]: {
      screen: SignUpWizard,
      navigationOptions: {
        headerShown: false,
        gesturesEnabled: false,
      },
    },
  },
  {
    initialRouteName: screenGroupNames.SIGN_UP_WIZARD,
    headerMode: 'screen',
    defaultNavigationOptions: {
      cardStyle: {
        backgroundColor: flipFlopColors.white,
      },
    },
  },
);

export default authentication;
