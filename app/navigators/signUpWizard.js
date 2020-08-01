import React from 'react';
import {Animated, Easing} from 'react-native';
import I18n from '../infra/localization';
import * as screens from '../screens';
import {flipFlopColors} from '../vars';
import {screenNames} from '../vars/enums';
import {Header} from '../components';
import {createStackNavigator} from 'react-navigation-stack';

const preventRouteTransition = () => ({
  transitionSpec: {
    duration: 0,
    timing: Animated.timing,
    easing: Easing.step0,
  },
});

const SignUpWizard = createStackNavigator(
  {
    [screenNames.SignUp]: {
      screen: screens.SignUp,
      navigationOptions: {
        headerShown: false,
        gesturesEnabled: false,
      },
    },
    [screenNames.SetUserGender]: {
      screen: screens.SetUserGender,
      navigationOptions: {
        headerShown: false,
        gesturesEnabled: false,
      },
    },
    [screenNames.SetUserNationality]: {
      screen: screens.SetUserNationality,
      navigationOptions: () => ({
        headerShown: false,
        gesturesEnabled: false,
      }),
    },
    [screenNames.ContinueWithNationality]: {
      screen: screens.ContinueWithNationality,
      navigationOptions: () => ({
        headerShown: false,
        gesturesEnabled: false,
      }),
    },
    [screenNames.SignUpMethods]: {
      screen: screens.SignUpMethods,
      navigationOptions: () => ({
        headerShown: false,
        gesturesEnabled: false,
      }),
    },
    [screenNames.SetUserDetails]: {
      screen: screens.SetUserDetails,
      navigationOptions: {
        headerShown: false,
        gesturesEnabled: false,
      },
    },
    [screenNames.NoNationality]: {
      screen: screens.NoNationality,
      navigationOptions: {
        headerShown: false,
        gesturesEnabled: false,
      },
    },
    [screenNames.ImageUpload]: {
      screen: screens.ImageUpload,
      navigationOptions: {
        headerShown: false,
        gesturesEnabled: false,
      },
    },
    [screenNames.SearchCountry]: {
      screen: screens.SearchCountry,
      navigationOptions: {
        headerShown: false,
        gesturesEnabled: false,
      },
    },
    [screenNames.EditProfileDate]: {
      screen: screens.EditProfileDate,
      navigationOptions: () => {
        const title = I18n.t('onboarding.set_arrival_date.title');
        return {
          header: <Header hasBackButton title={title} />,
        };
      },
    },
    [screenNames.SearchAddress]: {
      screen: screens.SearchAddress,
      navigationOptions: {
        header: <Header searchMode searchAddressMode />,
      },
    },
    [screenNames.OnBoardingAddFriends]: {
      screen: screens.OnBoardingAddFriends,
      navigationOptions: {
        headerShown: false,
        gesturesEnabled: false,
      },
    },
    [screenNames.OnBoardingDiscover]: {
      screen: screens.OnBoardingDiscover,
      navigationOptions: {
        headerShown: false,
        gesturesEnabled: false,
      },
    },
    [screenNames.AllowNotifications]: {
      screen: screens.AllowNotifications,
      navigationOptions: {
        headerShown: false,
        gesturesEnabled: false,
      },
    },
    [screenNames.WebView]: {
      screen: screens.WebView,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: screenNames.SetUserNationality,
    defaultNavigationOptions: {
      cardStyle: {
        backgroundColor: flipFlopColors.white,
      },
    },
    headerMode: 'screen',
    transitionConfig: preventRouteTransition,
  },
);

export default SignUpWizard;
