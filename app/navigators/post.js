import {createStackNavigator} from 'react-navigation-stack';
import {flipFlopColors} from '../vars';
import {screenNames} from '../vars/enums';
import * as screens from '../screens';

const Post = createStackNavigator(
  {
    [screenNames.PostPage]: {
      screen: screens.PostPage,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: screenNames.PostPage,
    defaultNavigationOptions: {
      cardStyle: {
        backgroundColor: flipFlopColors.white,
      },
    },
  },
);

export default Post;
