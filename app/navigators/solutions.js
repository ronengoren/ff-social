import React from 'react';
import {createStackNavigator, TransitionPresets} from 'react-navigation-stack';
import * as screens from '../screens';
import {screenNames} from '../vars/enums';
// import ResultsHeaderChips from '/screens/solutionsTab/results/ResultsHeaderChips';
import {get} from '../infra/utils';
import {flipFlopColors} from '../vars';
import sharedRoutes from './sharedRoutes';

const Solutions = createStackNavigator(
  {
    [screenNames.SolutionsHome]: {
      screen: screens.SolutionsHome,
      navigationOptions: {
        headerShown: false,
        animationEnabled: false,
        ...TransitionPresets.SlideFromRightIOS,
      },
    },
    // [screenNames.SolutionsResults]: {
    //   screen: screens.SolutionsResults,
    //   navigationOptions: ({ navigation }) => {
    //     const solution = get(navigation, 'state.params');
    //     return {
    //       header: <ResultsHeaderChips navigation={navigation} solution={solution} />,
    //       animationEnabled: true,
    //       ...TransitionPresets.SlideFromRightIOS
    //     };
    //   }
    // },
    ...sharedRoutes,
  },
  {
    initialRouteName: screenNames.SolutionsHome,
    headerMode: 'screen',
    defaultNavigationOptions: {
      cardStyle: {
        backgroundColor: flipFlopColors.white,
      },
    },
  },
);

export default Solutions;
