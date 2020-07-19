/* eslint-disable no-param-reassign */
import produce from 'immer';

import {merge, cloneDeep} from '../../infra/utils';
import {ADD_ENTITIES} from '../normalizer';
import {entityTypes} from '../../vars/enums';
import * as actions from './actions';

const initialState = {
  suggestedGroups: {},
  suggestedGroupsTags: {},
  myGroups: {},
  members: {},
  pendingMembers: {},
  params: {},
  highlightedEntities: {},
  membered: {},
  memberedInTypeGroup: {},
  managed: {},
  byId: {},
};

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case ADD_ENTITIES: {
        const {groups} = action.payload.data;

        if (groups) {
          Object.keys(groups).forEach((groupId) => {
            draft.byId[groupId] = merge(
              {},
              cloneDeep(state.byId[groupId] || {}),
              groups[groupId],
            );
          });
        }
        break;
      }
      case actions.GROUP_LOADED: {
        const {
          group,
          group: {id: groupId},
        } = action.payload;
        draft.byId[groupId] = group;
        break;
      }
      case actions.GROUP_CREATE: {
        const {
          group,
          group: {id: groupId},
        } = action.payload;
        draft.byId[groupId] = group;
        draft.myGroups.data.unshift(groupId);
        break;
      }
      case actions.GROUP_EDIT: {
        const {groupId, patch} = action.payload;
        draft.byId[groupId] = {
          ...state.byId[groupId],
          ...patch,
        };
        break;
      }
      case actions.GROUP_PATCH_IMAGE: {
        const {groupId, media} = action.payload;
        draft.byId[groupId].media = media;
        break;
      }
      case actions.GROUP_JOIN_OR_LEAVE: {
        const {
          groupId,
          patch: {pendingCount, memberType},
          member,
          addMember,
          removeMember,
        } = action.payload;
        if (state.byId[groupId]) {
          draft.byId[groupId].pendingCount = pendingCount;
          draft.byId[groupId].memberType = memberType;
          if (addMember) {
            (draft.byId[groupId].lastMembers || []).unshift(member);
            draft.byId[groupId].membersCount += 1;
          } else if (!addMember && removeMember) {
            draft.byId[groupId].lastMembers = state.byId[
              groupId
            ].lastMembers.filter(
              (existingMember) => existingMember.id !== member.id,
            );
            draft.byId[groupId].membersCount -= 1;
          }
        }
        break;
      }
      case actions.GROUP_PATCH: {
        const {groupId, data} = action.payload;
        draft.byId[groupId] = {
          ...state.byId[groupId],
          ...data,
        };
        break;
      }
      case actions.GROUP_DELETE: {
        const {groupId} = action.payload;
        draft.byId[groupId] = null;
        break;
      }
      case actions.FOLLOW_PAGE: {
        const {pageId, contextEntityId} = action.payload;
        const index = state.highlightedEntities[contextEntityId].data.findIndex(
          (item) => item.entityId === pageId,
        );

        if (index > -1) {
          draft.highlightedEntities[contextEntityId].data[
            index
          ].entity.followed = true;
          draft.highlightedEntities[contextEntityId].data[
            index
          ].entity.totalFollowed += 1;
        }
        break;
      }
      case actions.GROUP_RESET_SUGGESTED_GROUPS: {
        draft.suggestedGroups = {};
        break;
      }
      case actions.EVENT_SET_RSVP: {
        const {eventId, rsvpStatus, contextEntityId} = action.payload;
        const index = state.highlightedEntities[contextEntityId].data.findIndex(
          (item) => item.entityId === eventId,
        );

        if (index > -1) {
          draft.highlightedEntities[contextEntityId].data[
            index
          ].entity.userRSVP = rsvpStatus;
        }
        break;
      }
      case actions.GROUP_HIGHLIGHT_ITEM: {
        const {groupId, entityId, entityType, entityData} = action.payload;
        if (
          state.highlightedEntities[groupId] &&
          state.highlightedEntities[groupId].data
        ) {
          draft.highlightedEntities[groupId].data.unshift({
            entityId,
            entityType,
            entity: {id: entityData.id, schema: entityTypes.POST},
          });
        }
        break;
      }
      case actions.GROUP_DEHIGHLIGHTED_ITEM: {
        const {groupId, entityId} = action.payload;
        if (
          state.highlightedEntities[groupId] &&
          state.highlightedEntities[groupId].data
        ) {
          draft.highlightedEntities[groupId].data = state.highlightedEntities[
            groupId
          ].data.filter((item) => item.entityId !== entityId);
        }
        break;
      }
      default:
    }
  });

export default reducer;
