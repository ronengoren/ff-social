import * as screens from '/screens';
import {flipFlopColors} from '../vars';
import {screenNames} from '../vars/enums';
import DismissibleStackNavigator from './DismissibleStackNavigator';

const CreateGroup = DismissibleStackNavigator(
  {
    [screenNames.CreateGroup]: {
      screen: screens.CreateGroup,
      navigationOptions: {
        headerShown: false,
      },
    },
    [screenNames.InviteMembers]: {
      screen: screens.InviteMembers,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: screenNames.CreateGroup,
    defaultNavigationOptions: {
      cardStyle: {
        backgroundColor: flipFlopColors.white,
      },
    },
    mode: 'card',
  },
);

export default CreateGroup;
