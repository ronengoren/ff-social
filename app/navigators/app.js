import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import * as screens from '../screens';
import I18n from '../infra/localization';
import {screenGroupNames, screenNames} from '../vars/enums';
import {Header, CustomTabBar} from '../components';
import {flipFlopColors} from '../vars';
import {get} from '../infra/utils';
import Home from './home';
import Groups from './groups';
import MyCity from './myCity';
import People from './people';
import Solutions from './solutions';
// import Chat from './chat';
import Notifications from './notifications';
// import CreateEvent from './createEvent';
// import CreatePage from './createPage';

const screenInterpolator = (sceneProps) => {
  const transitions = {};
  const {position, layout, scene} = sceneProps;
  const thisSceneIndex = scene.index;
  const height = layout.initHeight;
  const width = layout.initWidth;

  const params = scene.route.params || {};

  const translateX = position.interpolate({
    inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
    outputRange: [width, 0, 0],
  });

  const translateY = position.interpolate({
    inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
    outputRange: [height, 0, 0],
  });

  const opacity = position.interpolate({
    inputRange: [thisSceneIndex - 1, thisSceneIndex - 0.5, thisSceneIndex],
    outputRange: [0, 1, 1],
  });

  const slideInFromBottom = {transform: [{translateY}]};
  if (!params.transition) {
    return slideInFromBottom;
  }

  if (params.transition.slideRight) {
    transitions.transform = [{translateX}];
  }

  if (params.transition.fade) {
    transitions.opacity = opacity;
  }

  return transitions;
};

const TabSection = createBottomTabNavigator(
  {
    [screenGroupNames.HOME_TAB]: {
      screen: Home,
    },
    [screenGroupNames.PEOPLE_TAB]: {
      screen: People,
    },
    [screenGroupNames.SOLUTIONS]: {
      screen: Solutions,
      navigationOptions: {
        tabBarTestID: 'solutionsTabBtn',
      },
    },
    [screenGroupNames.GROUPS_TAB]: {
      screen: Groups,
      navigationOptions: {
        tabBarTestID: 'groupsTabBtn',
      },
    },
    [screenGroupNames.MY_CITY]: {
      screen: MyCity,
    },
    [screenGroupNames.NOTIFICATIONS]: {
      screen: Notifications,
    },
    // [screenGroupNames.CHAT_LOBBY]: {
    //   screen: Chat
    // }
  },
  {
    initialRouteName: screenGroupNames.NOTIFICATIONS,
    tabBarComponent: CustomTabBar,
    lazy: true,
    animationEnabled: false,
    swipeEnabled: false,
  },
);

const MiddleSection = createStackNavigator(
  {
    [screenGroupNames.TABS]: {
      screen: TabSection,
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
    // [screenNames.PostEditor]: {
    //   screen: screens.PostEditor,
    //   navigationOptions: {
    //     headerShown: false,
    //     gesturesEnabled: false
    //   }
    // },
    // [screenNames.RichTextEditor]: {
    //   screen: screens.RichTextEditor,
    //   navigationOptions: {
    //     header: null
    //   }
    // },
    // [screenNames.AbusiveReportForm]: {
    //   screen: screens.AbusiveReportForm,
    //   navigationOptions: () => ({
    //     header: <Header hasBackButton withShadow={false} withBorderBottom={false} searchMode={false} isHideSearch />,
    //     gesturesEnabled: false
    //   })
    // },
    // [screenNames.DatesPicker]: {
    //   screen: screens.DatesPicker,
    //   navigationOptions: ({ navigation }) => {
    //     const title = get(navigation, 'state.params.title');
    //     const color = get(navigation, 'state.params.color');

    //     return {
    //       header: <Header hasBackButton title={title} backgroundColor={color} />
    //     };
    //   }
    // },
    // [screenNames.AddPageDetails]: {
    //   screen: screens.AddPageDetails,
    //   navigationOptions: {
    //     headerShown: false
    //   }
    // },
    // [screenNames.AddDescription]: {
    //   screen: screens.AddDescription,
    //   navigationOptions: {
    //     headerShown: false
    //   }
    // },
    // [screenGroupNames.CREATE_EVENT_MODAL]: {
    //   screen: CreateEvent,
    //   navigationOptions: {
    //     headerShown: false,
    //     gesturesEnabled: false
    //   }
    // },
    // [screenGroupNames.CREATE_PAGE_MODAL]: {
    //   screen: CreatePage,
    //   navigationOptions: {
    //     headerShown: false,
    //     gesturesEnabled: false
    //   }
    // },
    // [screenNames.AddListItem]: {
    //   screen: screens.AddListItem,
    //   navigationOptions: ({ navigation }) => {
    //     const item = get(navigation, 'state.params.item', null);
    //     const title = item ? I18n.t('list.add_item.edit_header') : I18n.t('list.add_item.add_header');
    //     return {
    //       header: <Header title={title} hasBackButton backgroundColor={flipFlopColors.paleGreyTwo} titleColor={flipFlopColors.b30} buttonColor={flipFlopColors.b30} />
    //     };
    //   }
    // },
    // [screenNames.CategoryPicker]: {
    //   screen: screens.CategoryPicker,
    //   navigationOptions: {
    //     headerShown: false
    //   }
    // },
    // [screenNames.SearchAddress]: {
    //   screen: screens.SearchAddress,
    //   navigationOptions: {
    //     header: <Header searchMode searchAddressMode />
    //   }
    // },
    // [screenNames.HookedEntitiesList]: {
    //   screen: screens.HookedEntitiesList,
    //   navigationOptions: () => {
    //     const title = I18n.t('publisher_picker.title');
    //     return {
    //       header: <Header hasBackButton title={title} backgroundColor={flipFlopColors.paleGreyTwo} buttonColor={flipFlopColors.b30} titleColor={flipFlopColors.b30} />
    //     };
    //   }
    // },
    // [screenNames.ContextPicker]: {
    //   screen: screens.ContextPicker,
    //   navigationOptions: () => {
    //     const title = I18n.t('context_picker.title');
    //     return {
    //       header: <Header hasBackButton title={title} backgroundColor={flipFlopColors.paleGreyTwo} buttonColor={flipFlopColors.b30} titleColor={flipFlopColors.b30} />
    //     };
    //   }
    // },
    // [screenNames.Medias]: {
    //   screen: screens.Medias,
    //   navigationOptions: {
    //     header: <Header hasBackButton isHideSearch />
    //   }
    // },
    // [screenNames.PostVideoModal]: {
    //   screen: screens.PostVideoModal,
    //   navigationOptions: {
    //     headerShown: false
    //   }
    // },
    // [screenNames.MediaModal]: {
    //   screen: screens.MediaModal,
    //   navigationOptions: {
    //     headerShown: false
    //   }
    // },
    // [screenNames.MediaGalleryModal]: {
    //   screen: screens.MediaGalleryModal,
    //   navigationOptions: {
    //     headerShown: false
    //   }
    // },
    // [screenNames.ImageUpload]: {
    //   screen: screens.ImageUpload,
    //   navigationOptions: {
    //     headerShown: false,
    //     gesturesEnabled: false
    //   }
    // }
  },
  {
    initialRouteName: screenGroupNames.TABS,
    defaultNavigationOptions: {
      cardStyle: {
        backgroundColor: flipFlopColors.white,
      },
    },
    mode: 'modal',
    StackNavigatorConfig: () => ({
      screenInterpolator,
    }),
  },
);

export default MiddleSection;
