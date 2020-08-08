import React from 'react';
import * as screens from '/screens';
import I18n from '../infra/localization';
import {Header} from '../components';
import {possesify} from '../infra/utils/stringUtils';
import {flipFlopColors} from '../vars';
import {screenGroupNames, screenNames, locationTypes} from '///vars/enums';
// import Post from './post';
// import sharedListsRoutes from './lists';
// import sharedEventsRoutes from './events';

const sharedRoutes = {
  // [screenGroupNames.POST]: {
  //   screen: Post,
  //   navigationOptions: {
  //     headerShown: false
  //   }
  // },
  // [screenNames.CommentEditor]: {
  //   screen: screens.CommentEditor,
  //   navigationOptions: {
  //     headerShown: false,
  //     gestureEnabled: false
  //   }
  // },
  [screenNames.Chat]: {
    screen: screens.Chat,
    navigationOptions: {
      headerShown: false,
    },
  },
  [screenNames.ChatInteraction]: {
    screen: screens.ChatInteraction,
    navigationOptions: {
      headerShown: false,
    },
  },
  // [screenNames.Search]: {
  //   screen: screens.Search,
  //   navigationOptions: {
  //     header: <Header searchMode />
  //   }
  // },
  // [screenNames.EntitiesList]: {
  //   screen: screens.EntitiesList,
  //   navigationOptions: {
  //     headerShown: false
  //   }
  // },
  // [screenNames.PostListsView]: {
  //   screen: screens.PostListsView,
  //   navigationOptions: {
  //     headerShown: false
  //   }
  // },
  // [screenNames.EntitiesInLocation]: {
  //   screen: screens.EntitiesInLocation,
  //   navigationOptions: ({ navigation }) => {
  //     const { type, name } = navigation.state.params;
  //     const title = I18n.t(type === locationTypes.ORIGIN ? 'profile.entities_in_location.from_header' : 'profile.entities_in_location.around_header', { name });
  //     return {
  //       header: <Header hasBackButton title={title} />
  //     };
  //   }
  // },
  // [screenNames.OthersFriendsList]: {
  //   screen: screens.OthersFriendsList,
  //   navigationOptions: ({ navigation }) => {
  //     const name = possesify(navigation.state.params.name);
  //     const title = I18n.t('profile.others_friends_list.header', { name });
  //     return {
  //       header: <Header hasBackButton title={title} />
  //     };
  //   }
  // },
  // [screenNames.PageView]: {
  //   screen: screens.PageView,
  //   navigationOptions: {
  //     headerShown: false
  //   }
  // },
  // [screenNames.SaversAndFollowers]: {
  //   screen: screens.SaversAndFollowers,
  //   navigationOptions: ({ navigation }) => {
  //     const title = navigation.state.params.pageName || I18n.t('savers_and_followers.title');
  //     return {
  //       header: <Header hasBackButton title={title} backgroundColor={flipFlopColors.blueberry} titleColor={flipFlopColors.white} buttonColor="white" />
  //     };
  //   }
  // },
  // [screenNames.InviteFollowers]: {
  //   screen: screens.PageInviteFollowers,
  //   navigationOptions: {
  //     headerShown: false
  //   }
  // },
  // [screenNames.PageEdit]: {
  //   screen: screens.PageEdit,
  //   navigationOptions: {
  //     headerShown: false
  //   }
  // },
  // [screenNames.OpeningHoursSelector]: {
  //   screen: screens.OpeningHoursSelector,
  //   navigationOptions: () => {
  //     const title = I18n.t('page.opening_hours_selector.header');
  //     return {
  //       header: <Header title={title} hasBackButton />
  //     };
  //   }
  // },
  // [screenNames.CityResults]: {
  //   screen: screens.CityResults,
  //   navigationOptions: {
  //     headerShown: false
  //   }
  // },
  // [screenNames.GroupView]: {
  //   screen: screens.GroupView,
  //   navigationOptions: {
  //     headerShown: false,
  //   },
  // },
  // [screenNames.GroupRules]: {
  //   screen: screens.GroupRules,
  //   navigationOptions: {
  //     headerShown: false
  //   }
  // },
  // [screenNames.GroupEdit]: {
  //   screen: screens.GroupEdit,
  //   navigationOptions: {
  //     headerShown: false
  //   }
  // },
  // [screenNames.ViewOnlyMembersList]: {
  //   screen: screens.ViewOnlyMembersList,
  //   navigationOptions: {
  //     headerShown: false
  //   }
  // },
  // [screenNames.ManageGroupMembers]: {
  //   screen: screens.ManageGroupMembers,
  //   navigationOptions: {
  //     headerShown: false
  //   }
  // },
  [screenNames.Profile]: {
    screen: screens.Profile,
    navigationOptions: {
      headerShown: false,
    },
  },
  // [screenNames.ProfileGroupsList]: {
  //   screen: screens.ProfileGroupsList,
  //   navigationOptions: ({ navigation }) => {
  //     const { user, isOwnProfile } = navigation.state.params;
  //     const name = possesify(user.name);
  //     const title = isOwnProfile ? I18n.t('profile.profile_groups_list.own_header') : I18n.t('profile.profile_groups_list.header', { name });
  //     return {
  //       header: <Header hasBackButton title={title} rightComponent={screens.ProfileGroupsList.renderCreateButton()} />
  //     };
  //   }
  // },
  // [screenNames.ProfilePagesList]: {
  //   screen: screens.ProfilePagesList,
  //   navigationOptions: ({ navigation }) => {
  //     const { user, isOwnProfile } = navigation.state.params;
  //     const name = possesify(user.name);
  //     const title = isOwnProfile ? I18n.t('profile.profile_pages_list.own_header') : I18n.t('profile.profile_pages_list.header', { name });
  //     return {
  //       header: <Header hasBackButton title={title} rightComponent={screens.ProfilePagesList.renderCreateButton()} />
  //     };
  //   }
  // },
  [screenGroupNames.MY_CITY]: {
    screen: screens.Profile,
    navigationOptions: {
      headerShown: false,
    },
  },
  [screenGroupNames.CHAT_LOBBY]: {
    screen: screens.ChatLobby,
    navigationOptions: {
      headerShown: false,
      cardStyle: {
        backgroundColor: flipFlopColors.white,
      },
    },
  },
  // [screenNames.MyThemeView]: {
  //   screen: screens.MyThemeView,
  //   navigationOptions: {
  //     headerShown: false
  //   }
  // },
  // [screenNames.MyNeighborhoodView]: {
  //   screen: screens.MyNeighborhoodView,
  //   navigationOptions: {
  //     headerShown: false
  //   }
  // },
  // [screenNames.OthersThemeView]: {
  //   screen: screens.OthersThemeView,
  //   navigationOptions: {
  //     headerShown: false
  //   }
  // },
  // [screenNames.Pages]: {
  //   screen: screens.Pages,
  //   navigationOptions: ({ navigation }) => {
  //     const { headerParams } = navigation.state.params;
  //     return {
  //       header: <Header hasBackButton {...headerParams} />
  //     };
  //   }
  // },
  // [screenNames.EditProfileDate]: {
  //   screen: screens.EditProfileDate,
  //   navigationOptions: () => {
  //     const title = I18n.t('profile.edit.generic_header');
  //     return {
  //       header: <Header hasBackButton title={title} />
  //     };
  //   }
  // },
  // [screenNames.IntroductionPostEditorScreen]: {
  //   screen: screens.IntroductionPostEditorScreen,
  //   navigationOptions: () => {
  //     const title = I18n.t('posts.introduction.screen_header');
  //     return {
  //       header: <Header hasBackButton title={title} />
  //     };
  //   }
  // },
  // [screenNames.MapScreen]: {
  //   screen: screens.MapScreen,
  //   navigationOptions: ({ navigation }) => {
  //     const { title } = navigation.state.params;
  //     return {
  //       header: <Header hasBackButton title={title} isHideSearch />
  //     };
  //   }
  // },
  // [screenNames.SavedItemsView]: {
  //   screen: screens.SavedItemsView,
  //   navigationOptions: {
  //     headerShown: false
  //   }
  // },
  // ...sharedListsRoutes,
  // ...sharedEventsRoutes
};

export default sharedRoutes;
