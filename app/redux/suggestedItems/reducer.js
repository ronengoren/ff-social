import {get} from '../../infra/utils';
import {EVENT_SET_RSVP} from '../events/actions';
import {PATCH_PAGE} from '../pages/actions';
import * as actions from './actions';

const patchMixedCarousel = ({state, type, entityIdToCompare, changes}) => {
  if (state[type]) {
    const updatedState = state[type];
    Object.keys(state[type]).forEach((itemId) => {
      const item = state[type][itemId];
      updatedState[itemId] = {
        ...item,
        data: item.data.map((itemData) => {
          const {entityId, entity} = itemData;
          return {
            ...itemData,
            entity:
              entityId === entityIdToCompare
                ? {...entity, ...changes(entity)}
                : entity,
          };
        }),
      };
    });
    return {...state, [type]: updatedState};
  }

  return state;
};

const initialState = {
  feed: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.LIKED_SUGGESTED_ITEM: {
      const {suggestedItemType} = action.payload;
      let newFeedState;
      const feedStateData = get(state, `feed[${suggestedItemType}].data`);

      if (feedStateData) {
        newFeedState = {
          ...state.feed,
          [suggestedItemType]: {
            ...state.feed[suggestedItemType],
            data: action.transformer(feedStateData),
          },
        };
      } else {
        newFeedState = state.feed;
      }

      return {
        ...state,
        feed: newFeedState,
        [suggestedItemType]: {
          ...state[suggestedItemType],
          data: action.transformer(state[suggestedItemType].data),
        },
      };
    }

    case EVENT_SET_RSVP: {
      const {eventId, rsvpStatus, rsvpCounts, invitees} = action.payload;
      return patchMixedCarousel({
        state,
        type: 'mixed',
        entityIdToCompare: eventId,
        changes: () => ({userRSVP: rsvpStatus, rsvpCounts, invitees}),
      });
    }

    case PATCH_PAGE: {
      const {pageId, patch} = action.payload;
      return patchMixedCarousel({
        state,
        type: 'mixed',
        entityIdToCompare: pageId,
        changes: (entity) => patch({page: entity}),
      });
    }

    default:
      return state;
  }
};

export default reducer;
