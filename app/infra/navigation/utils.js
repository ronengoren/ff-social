import {get} from './utils';
import {navigationService} from './index';
import {screenNames, postTypes, entityTypes} from '../../vars/enums';
import {plural} from 'pluralize';

function getCurrentRouteName(navState, {withParams} = {}) {
  if (!navState) {
    return null;
  }
  const route = navState.routes[navState.index];

  if (route.routes) {
    return getCurrentRouteName(route, {withParams}); // nested routes
  } else {
    if (withParams) {
      return {
        name: route.routeName,
        params: {...route.params},
      };
    }
    return route.routeName;
  }
}

export {getCurrentRouteName}; // eslint-disable-line import/prefer-default-export

export const delegateNavigationStateParamsToProps = (ownProps) => {
  // if this is empty -> we rendered this component and not navigated to as screen
  const paramsFromNavigation = get(ownProps, 'navigation.state.params') || {};

  return {
    ...paramsFromNavigation,
    isScreen: !!ownProps.navigation,
  };
};

export const navigateToPostType = (postType, contextId) => {
  switch (postType) {
    case postTypes.GUIDE: {
      navigationService.navigate(screenNames.PostListsView, {
        postType,
        contextId,
      });
      break;
    }
    case postTypes.REAL_ESTATE:
    case postTypes.JOB:
    case postTypes.GIVE_TAKE:
    case postTypes.TIP_REQUEST:
    case postTypes.PROMOTION:
    case postTypes.RECOMMENDATION: {
      navigationService.navigate(screenNames.CityResults, {
        postType,
        contextId,
      });
      break;
    }
    case entityTypes.LIST:
    case plural(entityTypes.LIST): {
      navigationService.navigate(screenNames.ListOfLists, {contextId});
      break;
    }
    default:
      break;
  }
};
