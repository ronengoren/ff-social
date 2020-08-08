import {apiCommand} from '../apiCommands/actions';
import {apiQuery} from '../apiQuery/actions';
// import {
//   updateUnseenNotifications,
//   updatePushNotificationStatus,
// } from '../notifications/actions';
import {updateFriendRequests} from '../friendships/actions';
import {setSavedThemes} from '../themes/actions';
import {updateAnnotations} from '../general/actions';
import {
  user as userLocalStorage,
  flags as flagsLocalStorage,
  hiddenPinnedItems as hiddenPinnedItemsLocalStorage,
  hiddenPosts as hiddenPostsLocalStorage,
  misc as miscLocalStorage,
  chat as chatLocalStorage,
  appSettings as appSettingsLocalStorage,
  search as searchLocalStorage,
  medias as mediasLocalStorage,
  commentAs as commentAsLocalStorage,
} from '../../infra/localStorage';
// import * as pushManager from '../../infra/pushNotifications';
import {getDeviceLang, getDeviceLocales} from '../../infra/utils/deviceUtils';
import {get, isEmpty} from '../../infra/utils';
import {extractBranchLinkData} from '../../infra/utils/linkingUtils';
import {analytics, Logger} from '../../infra/reporting';
import I18n from '../../infra/localization';
import {
  signInMethodTypes,
  signUpMethodTypes,
  screenGroupNames,
  screenNames,
} from '../../vars/enums';
import chatService from '../../infra/chat/chatService';
import {navigationService} from '../../infra/navigation';
import permissionsService from '../../infra/permissions/permissionsService';
import {setTestFairyUserData} from '../../infra/testFairy';
import {hasProfilePicture} from '../../infra/utils/userUtils';

export const SIGN_IN_BEGIN = 'AUTH/SIGN_IN_BEGIN';
export const SIGN_IN_SUCCESS = 'AUTH/SIGN_IN_SUCCESS';
export const SIGN_IN_FAILURE = 'AUTH/SIGN_IN_FAILURE';

export const LOGOUT_BEGIN = 'AUTH/LOGOUT_BEGIN';
export const LOGOUT_SUCCESS = 'AUTH/LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'AUTH/LOGOUT_FAILURE';

export const SIGN_UP_BEGIN = 'AUTH/SIGN_UP_BEGIN';
export const SIGN_UP_SUCCESS = 'AUTH/SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'AUTH/SIGN_UP_FAILURE';

export const TURN_ON_NEW_USER_WELCOME = 'TURN_ON_NEW_USER_WELCOME';
export const TURN_OFF_NEW_USER_WELCOME = 'TURN_OFF_NEW_USER_WELCOME';

export const SET_USER = 'AUTH/SET_USER';
export const SET_COMMUNITY = 'AUTH/SET_COMMUNITY';
export const SET_TOKEN = 'AUTH/SET_TOKEN';
export const RESET_USER = 'AUTH/RESET_USER';

export const EDIT_IMAGES = 'AUTH/EDIT_IMAGES';

export const ADDED_TO_WAITING_LIST = 'ADDED_TO_WAITING_LIST';
export const LOADED_NATIONALITIES = 'LOADED_NATIONALITIES';
export const LOADED_NATIONALITIY_GROUPS = 'LOADED_NATIONALITIY_GROUPS';

export const LOAD_FEATURE_FLAGS = 'LOAD_FEATURE_FLAGS';
export const CHANGE_FEATURE_FLAG = 'CHANGE_FEATURE_FLAG';
export const UPDATE_SERVER_FEATURE_FLAGS = 'UPDATE_SERVER_FEATURE_FLAGS';

export const UPDATE_PERMISSION = 'UPDATE_PERMISSION';

export const SET_HIDDEN_PINNED_ITEMS = 'SET_HIDDEN_PINNED_ITEMS';
export const SET_HIDDEN_POSTS = 'SET_HIDDEN_POSTS';
export const ADD_HIDDEN_POST = 'ADD_HIDDEN_POST';

export const UPDATE_APP_TOTALS = 'UPDATE_APP_TOTALS';
export const ADD_BRANCH_REFERER_DATA = 'ADD_BRANCH_REFERER_DATA';

export const UPDATE_USER_LANGUAGE = 'UPDATE_USER_LANGUAGE';
export const UPDATE_USER_DESTINATION_NEIGHBORHOOD =
  'UPDATE_USER_DESTINATION_NEIGHBORHOOD';

function User({
  instagramToken,
  instagramV2Token,
  token,
  id,
  email,
  name,
  media,
  themeColor,
  gender,
  settings,
  userType,
  community,
  nationalityGroup,
  journey,
  roles,
  totals,
}) {
  this.instagramToken = instagramToken;
  this.instagramV2Token = instagramV2Token;
  this.token = token;
  this.gender = gender;
  this.id = id;
  this.email = email;
  this.name = name;
  this.media = media;
  this.themeColor = themeColor;
  this.settings = settings || {};
  this.userType = userType;
  this.community = community;
  this.nationalityGroup = nationalityGroup;
  this.journey = journey;
  this.roles = roles;
  this.totals = totals;
}

export const appendBranchDataToUser = (branchData) => ({
  type: ADD_BRANCH_REFERER_DATA,
  payload: branchData,
});

export const setHiddenPinnedItems = () => async (dispatch) => {
  const hiddenPinnedItems = (await hiddenPinnedItemsLocalStorage.get()) || [];
  dispatch({type: SET_HIDDEN_PINNED_ITEMS, payload: {hiddenPinnedItems}});
};

export const setHiddenPosts = () => async (dispatch) => {
  await hiddenPostsLocalStorage.checkAndRemoveExpired();
  const hiddenPosts = (await hiddenPostsLocalStorage.get()) || {};
  dispatch({type: SET_HIDDEN_POSTS, payload: {hiddenPosts}});
};

export const addHiddenPost = (postId, cacheData = true) => async (dispatch) => {
  dispatch({type: ADD_HIDDEN_POST, payload: {postId}});
  await hiddenPostsLocalStorage.update({[postId]: cacheData});
  dispatch(setHiddenPosts());
};

export const setUser = (user) => async (dispatch) => {
  const {name, id, email, gender, journey = {}, roles} = user;
  const communityId = get(user, 'community.id');
  const communityName = get(user, 'community.name');
  const nationalityGroupId = get(user, 'nationalityGroup.id');
  const nationalityGroupName = get(user, 'nationalityGroup.name');
  const contextCountryCode = get(user, 'journey.originCountry.countryCode');
  const contextCountryName = get(user, 'journey.originCountry.name');
  const destinationCountryName = get(user, 'journey.destinationCountry.name');

  const {currentlyLiveIn, origin} = journey;

  setTestFairyUserData(user);
  dispatch({type: SET_USER, payload: user});

  const featureFlags = await flagsLocalStorage.get();
  dispatch({type: LOAD_FEATURE_FLAGS, payload: featureFlags});
  await userLocalStorage.set(user);

  // pushManager.setUserId(id);
  // pushManager.setUserTags(user);
  chatService.init(id);

  dispatch(setHiddenPinnedItems());
  dispatch(setHiddenPosts());

  analytics.lifecycleEvents
    .startSession({
      email,
      userId: id,
      userName: name,
      communityId,
      communityName,
      nationalityGroupId,
      nationalityGroupName,
      gender,
      origin,
      currentlyLiveIn,
      contextCountryName,
      contextCountryCode,
      destinationCountryName,
      roles,
      hasProfilePicture: hasProfilePicture(user),
    })
    .dispatch();
  addAnalyticsPushToken();
};

// const addAnalyticsPushToken = async () => {
//   try {
//     const token = await pushManager.getPushToken();
//     if (token) {
//       analytics.lifecycleEvents.addPushToken({token}).dispatch();
//     }
//   } catch (err) {
//     Logger.error('Failed to add analytics push token', err);
//   }
// };

const logoutProviders = () => {
  chatService.resetUser();
  // pushManager.resetUser();
};

export const logout = ({onError}) => async (dispatch) => {
  dispatch({type: LOGOUT_BEGIN});
  try {
    analytics.actionEvents.logout().dispatch();
    // const token = await pushManager.getPushToken();
    await dispatch(apiCommand('auth.logout', {deviceToken: token}));
    await cleanLocalstorage();
    logoutProviders();
    analytics.lifecycleEvents.endSession().dispatch();
    navigationService.navigate(screenNames.Welcome, {}, {noPush: true});

    dispatch({type: LOGOUT_SUCCESS});
    dispatch({type: RESET_USER});
  } catch (err) {
    dispatch({type: LOGOUT_FAILURE, payload: {err}});
    onError && onError(err);
  }
};

export const refreshUserData = () => async (dispatch) => {
  try {
    const userData = await dispatch(apiCommand('auth.refreshUserData'));
    const data = get(userData, 'data.data', {});
    const {
      community,
      nationalityGroup,
      token,
      featureFlags: featureFlagsFromServer,
    } = data;

    if (!isEmpty(featureFlagsFromServer)) {
      await dispatch(addFeatureFlagsFromServer(featureFlagsFromServer));
    }

    await dispatch(
      setUser(new User({...data.user, token, community, nationalityGroup})),
    );

    // dispatch(updateUnseenNotifications(data.unseenNotifications));
    dispatch(updateFriendRequests(data.friendRequests));
    dispatch(updateUserLanguage({locale: get(data, 'user.settings.language')}));
    // dispatch(updatePushNotificationStatus());

    if (data.totals) {
      const {savedThemes, ...appTotals} = data.totals;
      dispatch({
        type: UPDATE_APP_TOTALS,
        payload: appTotals,
      });
      dispatch(setSavedThemes({savedThemes}));
    }

    await dispatch(getCommunitySettings({community}));
    dispatch(updateLocationPermission());
  } catch (err) {
    if (
      err.message.includes('401') ||
      err.message.includes('Unauthenticated')
    ) {
      dispatch(logout({}));
    }
  }
};

export const setCommunity = ({community}) => ({
  type: SET_COMMUNITY,
  payload: {
    community,
  },
});

export const getNationalities = () => async (dispatch) => {
  const res = await dispatch(
    apiQuery({query: {domain: 'auth', key: 'getNationalities'}}),
  );
  dispatch({
    type: LOADED_NATIONALITIES,
    payload: {
      nationalities: res.data.data,
    },
  });
};

export const getNationalityGroups = () => async (dispatch) => {
  const res = await dispatch(
    apiQuery({query: {domain: 'auth', key: 'getNationalityGroups'}}),
  );
  dispatch({
    type: LOADED_NATIONALITIY_GROUPS,
    payload: {
      nationalityGroups: res.data.data,
    },
  });
};

export const getCommunitySettings = ({
  community,
}: {
  community: Object,
}) => async (dispatch: Function) => {
  const {id: communityId} = community;
  await dispatch(
    apiQuery({
      reducerStatePath: 'auth.appSettings',
      query: {
        domain: 'auth',
        key: 'getCommunitySettings',
        params: {communityId},
      },
    }),
  );
};

const signInApiCommandsByMethodType = {
  [signInMethodTypes.EMAIL]: 'auth.signIn',
  [signInMethodTypes.FACEBOOK]: 'auth.fbSignIn',
  [signInMethodTypes.APPLE]: 'auth.appleSignIn',
};

export const signIn = ({
  method,
  params,
  onUnregisteredUserSignIn,
  onError,
}) => async (dispatch) => {
  dispatch({type: SIGN_IN_BEGIN});
  try {
    const res = await dispatch(
      apiCommand(signInApiCommandsByMethodType[method], params),
    );
    const {data, token} = res.data;
    if (data.newUser) {
      dispatch({type: SET_USER, payload: new User({...data.user, token})});
      await dispatch(getNationalities());
      onUnregisteredUserSignIn && onUnregisteredUserSignIn({user: data.user});
    } else {
      await dispatch(setUser(new User({...data.user, token})));

      dispatch({type: SIGN_IN_SUCCESS});

      await dispatch(refreshUserData());
      navigationService.navigate(
        screenGroupNames.SIGNED_IN,
        {},
        {noPush: true},
      );
      const {auth} = global.store.getState();

      analytics.actionEvents
        .signIn({
          success: true,
          email: data.user.email,
          name: data.user.name,
          registrationMethod: method,
          communityId: get(data, 'user.community.id'),
          communityName: get(auth, 'user.community.name'),
        })
        .dispatch();
    }
  } catch (err) {
    dispatch({type: SIGN_IN_FAILURE, payload: {err}});

    analytics.actionEvents
      .signIn({
        success: false,
        failureReason: err.toString(),
      })
      .dispatch();

    onError && onError(err);
  }
};

const signUpApiCommandsByMethodType = {
  [signUpMethodTypes.EMAIL]: 'auth.signUp',
  [signUpMethodTypes.FACEBOOK]: 'auth.fbSignUp',
  [signUpMethodTypes.APPLE]: 'auth.appleSignUp',
};

const trackSignup = async (trackProps) => {
  const branchData = await extractBranchLinkData();
  const {success, ...restTrackProps} = trackProps;
  analytics.actionEvents[success ? 'signup' : 'signupFailed']({
    ...restTrackProps,
    ...branchData,
  }).dispatch();
};

const trackJoinedCommunity = async (trackProps) => {
  const branchData = await extractBranchLinkData();
  analytics.actionEvents
    .onboardingJoinedCommunity({...branchData, ...trackProps})
    .dispatch();
};

export const signUp = ({
  method,
  params,
  onNewUserSignUp,
  onError,
  matchedNationality,
}) => async (dispatch) => {
  dispatch({type: SIGN_UP_BEGIN});

  try {
    const res = await dispatch(
      apiCommand(signUpApiCommandsByMethodType[method], params),
    );

    const {data, token} = res.data;
    dispatch({type: SET_USER, payload: new User({...data.user, token})});
    const {
      id: userId,
      email,
      name: userName,
      community,
      journey,
      roles,
    } = data.user;
    const communityId = get(community, 'id');
    const contextCountryCode = get(journey, 'originCountry.countryCode');
    const contextCountryName = get(journey, 'originCountry.name');
    const destinationCountryName = get(journey, 'destinationCountry.name');
    const deviceLanguage = getDeviceLang();
    const deviceLocales = getDeviceLocales();

    if (data.newUser) {
      dispatch({type: SIGN_UP_SUCCESS});

      analytics.lifecycleEvents
        .createIdentity({
          userId,
          email,
          userName,
          deviceLanguage,
          deviceLocales,
          nationalityGroupId: get(matchedNationality, 'id'),
          nationalityGroupName: get(matchedNationality, 'name'),
          contextCountryCode,
          contextCountryName,
          destinationCountryName,
          roles,
          hasProfilePicture: hasProfilePicture(data.user),
        })
        .dispatch();
      trackSignup({success: true, registrationMethod: method});
      await Promise.all([
        userLocalStorage.set({...data.user, token}),
        miscLocalStorage.update({isNewUser: true}),
      ]);
      await dispatch(getNationalities());
      onNewUserSignUp && onNewUserSignUp({user: data.user});
    } else {
      dispatch({type: SIGN_IN_SUCCESS});
      await dispatch(refreshUserData());
      navigationService.navigate(
        screenGroupNames.SIGNED_IN,
        {},
        {noPush: true},
      );

      analytics.actionEvents
        .signIn({
          success: true,
          email,
          name: userName,
          registrationMethod: method,
          communityId,
        })
        .dispatch();
    }
  } catch (err) {
    dispatch({type: SIGN_UP_FAILURE, payload: {err}});
    trackSignup({
      success: false,
      registrationMethod: method,
      failureReason: err.toString(),
    });
    onError && onError(err);
  }
};

export const joinedCommunity = ({
  communityId,
  communityName,
  destinationCity,
  isOnWaitingList,
}) => async (dispatch) => {
  miscLocalStorage.update({isNewUser: false});
  trackJoinedCommunity({
    communityId,
    communityName,
    destinationCity,
    isOnWaitingList,
  });
  await dispatch(refreshUserData());
};

export const finishedOnBoarding = () => () => {
  dispatch({type: TURN_ON_NEW_USER_WELCOME});
  dispatch({type: SIGN_IN_SUCCESS});
  dispatch(apiCommand('auth.onboarded'));
  navigationService.navigate(screenGroupNames.SIGNED_IN, {}, {noPush: true});
};

export const turnOffNewUserWelcome = () => ({
  type: TURN_OFF_NEW_USER_WELCOME,
});

export const editImages = ({media, newUser}) => async (dispatch) => {
  if (!newUser) {
    await userLocalStorage.update({media});
  }
  dispatch({type: EDIT_IMAGES, payload: {media}});
};

export const setToken = ({token}) => ({
  type: SET_TOKEN,
  payload: {token},
});

export const changedPassword = ({oldPassword, newPassword, onError}) => async (
  dispatch,
) => {
  try {
    await dispatch(
      apiCommand('auth.changePassword', {oldPassword, newPassword}),
    );
    dispatch({type: SIGN_IN_SUCCESS});
    await dispatch(refreshUserData());
    navigationService.navigate(screenGroupNames.SIGNED_IN, {}, {noPush: true});
  } catch (err) {
    dispatch({type: SIGN_IN_FAILURE, payload: {err}});
    analytics.actionEvents
      .signIn({
        success: false,
        failureReason: err.toString(),
      })
      .dispatch();
    onError(err);
  }
};

export const addToWaitingList = ({userId, fromCountry, toCountry, email}) => (
  dispatch,
) => {
  dispatch({type: ADDED_TO_WAITING_LIST});
  dispatch(
    apiCommand('waitingList.add', {userId, fromCountry, toCountry, email}),
  );
  analytics.actionEvents
    .onboardingMissingCommunity({fromCountry, toCountry})
    .dispatch();
};

export const addFeatureFlagsFromServer = (featureFlags) => (dispatch) => {
  dispatch({
    type: UPDATE_SERVER_FEATURE_FLAGS,
    payload: featureFlags,
  });
};

export const changeFeatureFlag = ({flag, flagState}) => (dispatch) => {
  flagsLocalStorage.update({[flag]: flagState});
  dispatch({
    type: CHANGE_FEATURE_FLAG,
    payload: {flag, flagState},
  });
};

export const updateUserLanguage = ({locale}) => {
  I18n.changeUserLocalization({locale});
  return {
    type: UPDATE_USER_LANGUAGE,
    payload: locale || 'en',
  };
};

export const updateUserDestinationNeighborhood = ({
  destinationCity,
  destinationTagName,
}) => async (dispatch) => {
  let destinationNeighborhood = {};

  if (destinationCity && destinationTagName) {
    const neighborhoods = await dispatch(
      apiQuery({
        query: {
          domain: 'neighborhoods',
          key: 'getNeighborhoods',
          params: {
            googlePlaceId: destinationCity.googlePlaceId,
            destinationTagNames: destinationTagName,
            populated: false,
          },
        },
      }),
    );

    if (neighborhoods.data.data.length) {
      destinationNeighborhood = neighborhoods.data.data[0];
    }
  }

  dispatch({
    type: UPDATE_USER_DESTINATION_NEIGHBORHOOD,
    payload: {destinationNeighborhood},
  });
};

export const impersonate = ({userId}) => async (dispatch) => {
  try {
    const res = await dispatch(apiCommand('auth.impersonate', {userId}));
    const {data, token} = res.data;
    const avoidFeatureFlagsReset = true;
    await cleanLocalstorage(avoidFeatureFlagsReset);
    navigationService.navigate(
      screenGroupNames.AUTHENTICATION,
      {},
      {noPush: true},
    );
    await dispatch({type: LOGOUT_SUCCESS});
    await dispatch({type: RESET_USER});
    await dispatch(updateAnnotations({welcome: true}));
    await dispatch(setUser(new User({...data.user, token})));
    await dispatch({type: SIGN_IN_SUCCESS});
    await dispatch(refreshUserData());
    navigationService.navigate(screenGroupNames.SIGNED_IN, {}, {noPush: true});
  } catch (err) {
    dispatch({type: SIGN_IN_FAILURE, payload: {err}});
  }
};

export const getConnectedAcounts = () => async (dispatch, getState) => {
  const state = getState();
  const connectedAccounts = get(state, 'auth.user.connectedAccounts.data');

  if (connectedAccounts) {
    return connectedAccounts;
  } else {
    const response = await dispatch(
      apiQuery({
        reducerStatePath: `auth.user.connectedAccounts`,
        query: {
          domain: 'users',
          key: 'getConnectedAccounts',
        },
      }),
    );

    return response.data.data;
  }
};

export const updatePermission = ({permission, permissionState}) => ({
  type: UPDATE_PERMISSION,
  payload: {
    permission,
    permissionState,
  },
});

const updateLocationPermission = () => async (dispatch) => {
  const isLocationPermitted = await permissionsService.isPermitted(
    permissionsService.types.location,
  );
  dispatch(
    updatePermission({
      permission: 'location',
      permissionState: isLocationPermitted,
    }),
  );
};

const cleanLocalstorage = async (avoidFeatureFlagsReset) => {
  await Promise.all([
    userLocalStorage.remove(),
    miscLocalStorage.remove(),
    !avoidFeatureFlagsReset && flagsLocalStorage.remove(),
    hiddenPinnedItemsLocalStorage.remove(),
    hiddenPostsLocalStorage.remove(),
    chatLocalStorage.remove(),
    appSettingsLocalStorage.remove(),
    searchLocalStorage.remove(),
    mediasLocalStorage.remove(),
    commentAsLocalStorage.remove(),
  ]);
};
