import * as screens from '/screens';
import {flipFlopColors} from '/vars';
import {screenNames} from '../vars/enums';
import {createStackNavigator} from 'react-navigation-stack';
import sharedRoutes from './sharedRoutes';

const Chat = createStackNavigator(
  {
    ...sharedRoutes,
    [screenNames.ChatUserSelector]: {
      screen: screens.ChatUserSelector,
      navigationOptions: () => ({
        headerShown: false,
      }),
    },
    [screenNames.ConversationsList]: {
      screen: screens.ConversationsList,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: screenNames.ChatLobby,
    headerMode: 'screen',
    defaultNavigationOptions: {
      cardStyle: {
        backgroundColor: flipFlopColors.white,
      },
    },
  },
);

export default Chat;
