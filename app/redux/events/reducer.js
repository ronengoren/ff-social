/* eslint-disable no-param-reassign */
import produce from 'immer';

import {merge, cloneDeep} from '../../infra/utils';
import {ADD_ENTITIES} from '../normalizer';
import {rsvpStatuses} from '../../vars/enums';
import * as actions from './actions';

const initialState = {
  suggestedEvents: {},
  myEvents: {},
  invitees: {},
  suggestedEventsTags: {},
  suggestedGuests: {},
  params: {},
  byId: {},
};

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case ADD_ENTITIES: {
        const {events} = action.payload.data;

        if (events) {
          Object.keys(events).forEach((eventId) => {
            draft.byId[eventId] = merge(
              {},
              cloneDeep(state.byId[eventId] || {}),
              events[eventId],
            );
          });
        }
        break;
      }
      case actions.EVENT_LOADED: {
        const {
          event,
          event: {id: eventId},
        } = action.payload;
        draft.byId[eventId] = event;
        break;
      }
      case actions.EVENT_CREATE: {
        const {
          event,
          event: {id: eventId},
        } = action.payload;
        draft.byId[eventId] = event;
        const myEventsData = draft.myEvents.data || [];
        myEventsData.unshift(eventId);
        draft.myEvents.data = myEventsData;
        break;
      }
      case actions.EVENT_EDIT: {
        const {eventId, patch} = action.payload;
        draft.byId[eventId] = {
          ...state.byId[eventId],
          ...patch,
        };
        break;
      }

      case actions.EVENT_SET_RSVP: {
        const {eventId, rsvpStatus, rsvpCounts} = action.payload;
        if (state.suggestedEvents.data) {
          const eventSuggestedIndex = state.suggestedEvents.data.findIndex(
            (event) => event.id === eventId,
          );
          if (eventSuggestedIndex !== -1) {
            const didUserRSVP = [rsvpStatuses.YES, rsvpStatuses.NO].includes(
              rsvpStatus,
            );
            if (didUserRSVP) {
              draft.suggestedEvents.data = [
                ...state.suggestedEvents.data.slice(0, eventSuggestedIndex),
                ...state.suggestedEvents.data.slice(eventSuggestedIndex + 1),
              ];
            }
          }
        }

        if (state.byId[eventId]) {
          draft.byId[eventId].userRSVP = rsvpStatus;
          draft.byId[eventId].rsvpCounts = rsvpCounts;
        }
        break;
      }

      case actions.EVENT_INVITE_GUESTS: {
        const {eventId, invitees} = action.payload;
        draft.byId[eventId].invitees = [
          ...state.byId[eventId].invitees,
          ...invitees,
        ];
        draft.byId[eventId].rsvpCounts.invited += invitees.length;
        break;
      }

      case actions.EVENT_UPDATE_FRIENDSHIP_STATUS: {
        const {listType, friendId, friendshipStatus} = action.payload;
        if (state.invitees[listType] && state.invitees[listType].data) {
          const friendIndex = state.invitees[listType].data.findIndex(
            (friend) => friend.id === friendId,
          );
          if (friendIndex !== -1) {
            draft.invitees[listType].data[
              friendIndex
            ].friendshipStatus = friendshipStatus;
          }
        }
        break;
      }

      case actions.EVENT_DELETE: {
        const {eventId} = action.payload;
        draft.byId[eventId] = null;
        break;
      }

      case actions.EVENT_RESET_SUGGESTED_EVENTS: {
        draft.suggestedEvents = {};
        break;
      }

      case actions.EVENT_RESET_MY_EVENTS: {
        draft.myEvents = {};
        break;
      }

      case actions.EVENT_CLEAR_INVITEES: {
        draft.invitees = {};
        break;
      }

      default:
    }
  });

export default reducer;
