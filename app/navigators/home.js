import {createStackNavigator} from 'react-navigation-stack';
import * as screens from '../screens';
import {screenNames} from '../vars/enums';
import {flipFlopColors} from '../vars';
import sharedRoutes from './sharedRoutes';

const Home = createStackNavigator(
  {
    [screenNames.HomeTab]: {
      screen: screens.HomeTab,
      navigationOptions: {
        headerShown: false,
        animationEnabled: false,
      },
    },
    ...sharedRoutes,
  },
  {
    initialRouteName: screenNames.HomeTab,
    headerMode: 'screen',
    defaultNavigationOptions: {
      cardStyle: {
        backgroundColor: flipFlopColors.paleGreyTwo,
      },
    },
  },
);

export default Home;
