import {NavigationActions, StackActions} from 'react-navigation';
import {screenNames, screenGroupNames} from '../../vars/enums';
import {isEqual} from '../utils';
// import {Logger} from '../../infra/reporting';
import {getCurrentRouteName as getCurrentRouteNameUtil} from './utils';

const NON_RESETTABLE_SCREENS = {
  [screenNames.CreateGroup]: true,
  [screenNames.CreateEvent]: true,
  [screenNames.EventEdit]: true,
  [screenNames.CreatePage]: true,
  [screenNames.PostEditor]: true,
  [screenNames.AddListItem]: true,
};

let _navigator;
let _deferredNavigation;
let _prevScreenName;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function setPrevScreenName(screenName) {
  _prevScreenName = screenName;
}

function getPrevScreenName() {
  return _prevScreenName;
}

function getCurrentRouteName({withParams} = {}) {
  if (!_navigator) {
    return '';
  }
  return getCurrentRouteNameUtil(_navigator.state.nav, {withParams});
}

function navigate(routeName, params, options = {}) {
  if (!_navigator) {
    deferNavigation(routeName, params, options);
    // Logger.error({ message: 'Tried to navigate before Navigator was initialized', routeName, params, options });
    return;
  }
  const isCurrentRoute = isRequestedRouteIdenticalToCurrent({
    routeName,
    params,
  });
  if (isCurrentRoute && !options.tabReset) {
    return;
  }
  if (options.tabReset) {
    _navigator.dispatch(
      NavigationActions.navigate({
        routeName,
        params,
        action: StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({routeName, params})],
        }),
      }),
    );
  } else if (options.noPush) {
    _navigator.dispatch(
      NavigationActions.navigate({
        routeName,
        params,
      }),
    );
  } else {
    _navigator.dispatch(
      StackActions.push({
        routeName,
        params,
        action: options.initialScreen
          ? NavigationActions.navigate({
              routeName: options.initialScreen,
              params,
            })
          : null,
      }),
    );
  }
}

function goBack({key} = {}) {
  _navigator && _navigator.dispatch(NavigationActions.back({key}));
}

function replace(routeName, params) {
  _navigator &&
    _navigator.dispatch(
      StackActions.replace({
        routeName,
        params,
      }),
    );
}

function resetToScreen(routeName, key) {
  _navigator &&
    _navigator.dispatch(
      StackActions.reset({
        index: 0,
        key,
        actions: [NavigationActions.navigate({routeName})],
      }),
    );
}

function resetToHomePage(forceReset) {
  const currentRoute = getCurrentRouteName();
  if (!forceReset && NON_RESETTABLE_SCREENS[currentRoute]) {
    return;
  }

  if (currentRoute !== screenNames.HomeTab) {
    _navigator &&
      _navigator.dispatch(
        NavigationActions.navigate({
          routeName: screenNames.HomeTab,
          action: StackActions.reset({
            index: 1,
            key: null,
            actions: [
              NavigationActions.navigate({routeName: screenGroupNames.TABS}),
              NavigationActions.navigate({routeName: screenNames.HomeTab}),
            ],
          }),
        }),
      );
  }
  resetToScreen(screenNames.HomeTab);
}

function navigateToProfile(params, options) {
  const appUserId = global.store.getState().auth.user.id;
  const screenName =
    params && params.entityId === appUserId
      ? screenGroupNames.MY_CITY
      : screenNames.Profile;
  navigate(screenName, params, options);
}

function navigateToMap({location, title}) {
  navigate(screenNames.MapScreen, {title, location});
}

function deferNavigation(routeName, params, options) {
  _deferredNavigation = {routeName, params, options};
}

function conditionallyNavigateToDeferred() {
  if (_deferredNavigation) {
    navigate(
      _deferredNavigation.routeName,
      _deferredNavigation.params,
      _deferredNavigation.options,
    );
    _deferredNavigation = null;
  }
}

function isRequestedRouteIdenticalToCurrent({routeName, params = {}}) {
  const currentRoute = getCurrentRouteName({withParams: true});
  delete currentRoute.params.origin;

  if (currentRoute.name === routeName && isEqual(currentRoute.params, params)) {
    return true;
  }
  return false;
}

export default {
  navigate,
  goBack,
  replace,
  resetToScreen,
  resetToHomePage,
  navigateToProfile,
  setPrevScreenName,
  getPrevScreenName,
  navigateToMap,
  deferNavigation,
  conditionallyNavigateToDeferred,
  getCurrentRouteName,
  setTopLevelNavigator,
};
