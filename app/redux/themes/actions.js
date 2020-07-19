import {apiCommand} from '../apiCommands/actions';
import {toggleSavePost} from '../feed/actions';
import {analytics} from '../../infra/reporting';
import {entityTypes} from '../../vars/enums';

export const SAVE = 'SAVE';
export const UNSAVE = 'UNSAVE';
export const SET_SAVED_THEMES_TOTALS = 'SET_SAVED_THEMES_TOTALS';
export const RESET_ALL_THEME_ITEMS = 'RESET_ALL_THEME_ITEMS';

const saveAnalytics = ({
  entityType,
  entityId,
  entityName,
  saveAction,
  actor,
  componentName,
  originType,
  creator = {},
  entitySubType,
  entitySubSubType,
  themes,
}) => {
  const analyticsAction = saveAction ? 'saveAction' : 'unSaveAction';
  analytics.actionEvents[analyticsAction]({
    actorId: actor.id,
    actorName: actor.name,
    screenCollection: originType,
    componentName,
    entityType,
    entitySubType,
    entitySubSubType,
    entityId,
    entityName,
    creatorName: creator.name,
    creatorId: creator.id,
    themes,
  }).dispatch();
};

const saveAnalyticsWithPersonalizedData = ({
  saveAction,
  context,
  entityName,
  actor,
  componentName,
  originType,
  themes,
  entityType,
  entitySubType,
  entityId,
  creator,
}) => {
  const dataToSend = {
    entityType,
    entityId,
    entityName,
    saveAction,
    actor,
    componentName,
    originType,
    creator,
    entitySubType,
    themes,
  };
  if (context && context.entity) {
    saveAnalytics({
      ...dataToSend,
      entityType: context.entityType,
      entityId: context.entityId,
      creator: context.entity.actor,
      entitySubType:
        context.entityType === entityTypes.LIST_ITEM
          ? entityTypes.LIST_ITEM
          : context.entity.payload.postType,
    });
  } else {
    saveAnalytics(dataToSend);
  }
};

export const saveToThemes = ({
  contextPost,
  context = {},
  postType,
  themes,
  entityId,
  entityType,
  entitySubType,
  entityName,
  actor,
  originType,
  componentName,
  creator,
  parentId,
}) => async (dispatch) => {
  await dispatch(
    apiCommand('themes.save', {
      tags: themes,
      entityId,
      entityType,
      contextEntityId: context.entityId,
      contextEntityType: context.entityType,
    }),
  );

  // We need to normalize posts and use the regular SAVE action for posts as well
  if (entityType === entityTypes.POST) {
    await dispatch(
      toggleSavePost({contextPost, context, postId: entityId, actor, postType}),
    );
  }
  await dispatch({
    type: SAVE,
    payload: {
      tags: themes,
      entityId,
      entityType,
      saved: true,
      actor,
      parentId,
      context,
    },
  });

  saveAnalyticsWithPersonalizedData({
    saveAction: true,
    context,
    contextPost,
    entityName,
    actor,
    componentName,
    originType,
    themes,
    entityType,
    entitySubType,
    entityId,
    creator,
  });
};

export const unsave = ({
  contextPost,
  context,
  postType,
  entityId,
  entityType,
  entityName,
  actor,
  originType,
  componentName,
  creator,
  parentId,
}) => async (dispatch) => {
  const res = await dispatch(
    apiCommand('themes.unsave', {entityId, entityType}),
  );

  // We need to normalize posts and use the regular UNSAVE action for posts as well
  if (entityType === entityTypes.POST) {
    await dispatch(
      toggleSavePost({contextPost, context, postId: entityId, actor, postType}),
    );
  }
  await dispatch({
    type: UNSAVE,
    payload: {
      entityId,
      entityType,
      saved: false,
      actor,
      parentId,
      tags: res.data.data.removedTags,
      context,
    },
  });

  saveAnalytics({
    entityType,
    entityId,
    entityName,
    saveAction: false,
    actor,
    componentName,
    originType,
    creator,
    entitySubType: postType,
  });
};

export const setSavedThemes = ({savedThemes}) => ({
  type: SET_SAVED_THEMES_TOTALS,
  payload: {
    savedThemes,
  },
});

export const resetAllThemeItems = () => ({
  type: RESET_ALL_THEME_ITEMS,
});
