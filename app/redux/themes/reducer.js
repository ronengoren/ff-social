import {get} from '../../infra/utils';
import {rsvpStatuses} from '../../vars/enums';
import {EVENT_SET_RSVP} from '../events/actions';
import * as actions from './actions';

const initialState = {
  suggestedThemeItems: {},
  savedThemeItems: {},
  savedThemes: [],
  allThemeItems: {},
};

const patchEventInArray = ({arr, patchedItemIndex, rsvpStatus, rsvpCounts}) => [
  ...arr.slice(0, patchedItemIndex),
  {
    ...arr[patchedItemIndex],
    entity: {
      ...arr[patchedItemIndex].entity,
      userRSVP: rsvpStatus,
      rsvpCounts,
    },
  },
  ...arr.slice(patchedItemIndex + 1),
];

const patchPageOrPostInArray = ({arr, patchedItemIndex, saved, actor}) => {
  const patchedEntity = {...arr[patchedItemIndex].entity};
  const delta = {
    saved,
  };
  const totalDiff = saved ? 1 : -1;

  if (Object.prototype.hasOwnProperty.call(patchedEntity, 'totalSaves')) {
    delta.totalSaves = patchedEntity.totalSaves + totalDiff;
    let oldSavers = patchedEntity.saves || [];
    oldSavers = [...oldSavers];
    delta.saves = saved
      ? [actor, ...oldSavers]
      : oldSavers.filter((s) => s.id !== actor.id);
  } else {
    delta.saves = patchedEntity.saves + totalDiff;
    let oldSavers = patchedEntity.savers || [];
    oldSavers = [...oldSavers];
    delta.savers = saved
      ? [actor, ...oldSavers]
      : oldSavers.filter((s) => s.id !== actor.id);
  }

  return [
    ...arr.slice(0, patchedItemIndex),
    {...arr[patchedItemIndex], entity: {...patchedEntity, ...delta}},
    ...arr.slice(patchedItemIndex + 1),
  ];
};

const conditionallyPatchEntity = ({
  domain,
  patch,
  entityId,
  contextId,
  ...patchParams
}) => {
  const arr = get(domain, 'data', []);
  const patchedItemIndex = arr.findIndex((entity) =>
    [entityId, contextId].includes(entity.entityId),
  );
  if (patchedItemIndex > -1) {
    return {
      ...domain,
      data: patch({arr, patchedItemIndex, ...patchParams}),
    };
  } else {
    return domain;
  }
};

const recursivelyConditionallyPatchEntity = ({
  domain,
  patch,
  entityId,
  contextId,
  ...patchParams
}) => {
  const isObjectWithoutData =
    typeof domain === 'object' &&
    !Object.prototype.hasOwnProperty.call(domain, 'data');

  if (isObjectWithoutData) {
    const newDomain = {};
    Object.keys(domain).forEach((key) => {
      newDomain[key] = recursivelyConditionallyPatchEntity({
        domain: domain[key],
        patch,
        entityId,
        contextId,
        ...patchParams,
      });
    });
    return newDomain;
  }
  return conditionallyPatchEntity({
    domain,
    patch,
    entityId,
    contextId,
    ...patchParams,
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_SAVED_THEMES_TOTALS:
      return {
        ...state,
        savedThemes: action.payload.savedThemes,
      };

    case actions.SAVE:
    case actions.UNSAVE: {
      const {tags, saved, entityId, actor, context = {}} = action.payload;
      const contextId = context.entityId; // in case the page is nested in a post we need to patch the post (context)
      const totalDiff = saved ? 1 : -1;
      const newSavedThemes = state.savedThemes.map((theme) => {
        if (tags.includes(theme.tag)) {
          return {...theme, total: theme.total + totalDiff};
        } else {
          return theme;
        }
      });

      return {
        ...state,
        savedThemes: newSavedThemes,
        suggestedThemeItems: recursivelyConditionallyPatchEntity({
          domain: state.suggestedThemeItems,
          patch: patchPageOrPostInArray,
          entityId,
          contextId,
          saved,
          actor,
        }),
        savedThemeItems: recursivelyConditionallyPatchEntity({
          domain: state.savedThemeItems,
          patch: patchPageOrPostInArray,
          entityId,
          contextId,
          saved,
          actor,
        }),
        allThemeItems: recursivelyConditionallyPatchEntity({
          domain: state.allThemeItems,
          patch: patchPageOrPostInArray,
          entityId,
          contextId,
          saved,
          actor,
        }),
      };
    }

    case actions.RESET_ALL_THEME_ITEMS: {
      return {
        ...state,
        allThemeItems: {},
        savedThemeItems: {},
      };
    }

    case EVENT_SET_RSVP: {
      const {eventId, rsvpStatus, oldRSVP, rsvpCounts, tags} = action.payload;

      const isOldStatusInterestedOrGoing = [
        rsvpStatuses.YES,
        rsvpStatuses.MAYBE,
      ].includes(oldRSVP);
      const isStatusInterestedOrGoing = [
        rsvpStatuses.YES,
        rsvpStatuses.MAYBE,
      ].includes(rsvpStatus);
      const isBacameInterestedOrGoing =
        !isOldStatusInterestedOrGoing && isStatusInterestedOrGoing;
      const isBecameNotInterestedOrGoing =
        isOldStatusInterestedOrGoing && !isStatusInterestedOrGoing;
      let totalDiff = 0;
      if (isBacameInterestedOrGoing) {
        totalDiff = 1;
      }
      if (isBecameNotInterestedOrGoing) {
        totalDiff = -1;
      }

      const newSavedThemes = state.savedThemes.map((theme) => {
        if (tags.includes(theme.tag)) {
          return {...theme, total: theme.total + totalDiff};
        } else {
          return theme;
        }
      });

      return {
        ...state,
        savedThemes: newSavedThemes,
        suggestedThemeItems: recursivelyConditionallyPatchEntity({
          domain: state.suggestedThemeItems,
          patch: patchEventInArray,
          entityId: eventId,
          rsvpStatus,
          rsvpCounts,
        }),
        savedThemeItems: recursivelyConditionallyPatchEntity({
          domain: state.savedThemeItems,
          patch: patchEventInArray,
          entityId: eventId,
          rsvpStatus,
          rsvpCounts,
        }),
        allThemeItems: recursivelyConditionallyPatchEntity({
          domain: state.allThemeItems,
          patch: patchEventInArray,
          entityId: eventId,
          rsvpStatus,
          rsvpCounts,
        }),
      };
    }
    default:
      return state;
  }
};
