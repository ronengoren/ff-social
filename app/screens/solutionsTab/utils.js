import {
  solutionTypes,
  screenNamesByEntityType,
  screenNames,
  suggestedSolutionsTypes,
  entityTypes,
  uiColorDefinitions,
  postTypes,
  featuredTypes,
} from '../../vars/enums';
import {navigationService} from '../../infra/navigation';
import {SuggestedItems} from '../../components';

export const HEADER_PADDING_FROM_TOP_WITH_NOTCH = 25;

export const getSolutionDataForAnalytics = (solution) => {
  const {id, name, solutionType, parent} = solution;
  const origin = navigationService.getPrevScreenName();
  const currentScreenName = screenNames.SolutionsResults;
  const isPressedBackOrCancel =
    solutionType === solutionTypes.TREE && origin === currentScreenName;

  const solutionProps = {
    'Solution Id': id,
    'Solution Name': name,
    'Solution Type': solutionType,
    ...(isPressedBackOrCancel && {'Navigated Back From Solution Tag': true}),
  };

  if (parent) {
    const {id: parentId, name: parentName, solutionType: parentType} = parent;
    solutionProps['Solution Parent Id'] = parentId;
    solutionProps['Solution Parent Name'] = parentName;
    solutionProps['Solution Parent Type'] = parentType;
  }

  return solutionProps;
};

export const getOnPressBySolutionType = ({
  child,
  onPressTag,
  onPressTree,
  onPressEntity,
}) => {
  const {solutionType} = child;

  if (solutionType === solutionTypes.TREE) {
    return onPressTree
      ? onPressTree(child)
      : navigationService.navigate(screenNames.SolutionsResults, {...child});
  }

  if (solutionType === solutionTypes.TAG) {
    return onPressTag
      ? onPressTag(child)
      : navigationService.navigate(screenNames.SolutionsResults, {...child});
  }

  if (solutionType === solutionTypes.ENTITY) {
    const {entityId, entityType} = child;
    return onPressEntity
      ? onPressEntity(child)
      : navigationService.navigate(screenNamesByEntityType[entityType], {
          entityId,
          extraData: getSolutionDataForAnalytics(child),
        });
  }

  return navigationService.goBack();
};

export const getParamsByType = ({type, numOfItemsToShow, tags}) => {
  const baseParams = {
    featuredIn: featuredTypes.SOLUTIONS,
    tags,
    page: 1,
    perPage: numOfItemsToShow,
    sort: 'rank',
  };
  const queryByType = {
    [suggestedSolutionsTypes.SUGGESTED_EXPERTS]: {
      query: {
        domain: 'pages',
        key: 'getPages',
        params: {...baseParams, roles: ['expert']},
      },
      navigateToAll: SuggestedItems.navigateToAllPosts({
        postType: postTypes.GUIDE,
        tags,
      }),
      color: uiColorDefinitions[entityTypes.PAGE],
    },
    [suggestedSolutionsTypes.SUGGESTED_GUIDES]: {
      query: {
        domain: 'posts',
        key: 'getPosts',
        params: {...baseParams, postType: postTypes.GUIDE},
      },
      navigateToAll: SuggestedItems.navigateToAllPosts({
        postType: postTypes.GUIDE,
        tags,
      }),
      color: uiColorDefinitions[postTypes.GUIDE],
    },
    [suggestedSolutionsTypes.SUGGESTED_COMMUNITY_POSTS]: {
      query: {
        domain: 'posts',
        key: 'getPosts',
        params: {
          ...baseParams,
          postTypes: [
            postTypes.STATUS_UPDATE,
            postTypes.PROMOTION,
            postTypes.TIP_REQUEST,
          ],
        },
      },
      navigateToAll: SuggestedItems.navigateToAllPosts({
        postType: postTypes.GUIDE,
        tags,
      }),
      color: uiColorDefinitions[postTypes.GUIDE],
    },
    [suggestedSolutionsTypes.SUGGESTED_GROUPS]: {
      query: {domain: 'groups', key: 'getSuggested', params: {...baseParams}},
      navigateToAll: () => SuggestedItems.navigateToSuggestedGroups({tags}),
      color: uiColorDefinitions[entityTypes.GROUP],
    },
    [suggestedSolutionsTypes.SUGGESTED_LISTS]: {
      query: {domain: 'lists', key: 'getLists', params: {...baseParams}},
      navigateToAll: () => SuggestedItems.navigateToSuggestedLists({tags}),
      color: uiColorDefinitions[entityTypes.LIST],
    },
  };

  return queryByType[type] || {};
};
