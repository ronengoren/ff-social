/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  omit,
  sortedIndexBy,
  sortedLastIndexBy,
  pull,
  get,
  merge,
  cloneDeep,
} from 'lodash';
import {entityTypes} from '../../vars/enums';
import {ADD_ENTITIES} from '../normalizer';
import {SAVE, UNSAVE} from '../themes/actions';
import {getUpdatedVotesForItem} from '../utils/common';
import * as commentActions from '../comments/actions';
import * as actions from './actions';

const initialState = {
  byId: {},
  items: {},
};

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case ADD_ENTITIES: {
        const {lists} = action.payload.data;
        if (lists) {
          Object.keys(lists).forEach((key) => {
            draft.byId[key] = merge(
              {},
              cloneDeep(state.byId[key] || {}),
              lists[key],
            );
            if (lists[key].items) {
              draft.byId[key].items = {
                data: lists[key].items,
              };
            }
          });
        }
        break;
      }

      case actions.LIST_CREATE:
      case actions.LIST_LOADED: {
        const {id} = action.payload;
        draft.byId[id] = merge(state.byId[id], action.payload);
        break;
      }
      case actions.RESET_LIST_ITEMS_AND_TOTALS: {
        const {listId} = action.payload;
        draft.byId[listId] = omit(state.byId[listId], [
          'items',
          'filteredTotals',
        ]);
        break;
      }

      case actions.LIST_ITEM_LOADED: {
        const {id} = action.payload;
        draft.items[id] = {
          ...action.payload,
          comments: action.payload.comments.map((comment) => comment.id),
        };
        break;
      }

      case actions.LIST_DELETE: {
        const {listId} = action.payload;

        if (state.byId[listId]) {
          draft.byId[listId] = null;
        }

        if (state.data.data) {
          const index = state.data.data.findIndex((item) => item === listId);
          if (index > -1) {
            draft.data.data.splice(index, 1);
          }
        }
        break;
      }

      case SAVE:
      case UNSAVE: {
        const {entityType} = action.payload;

        if (entityType === entityTypes.LIST) {
          const {entityId: listId, saved, actor} = action.payload;

          if (state.byId[listId]) {
            const previousTotalSaves = state.byId[listId].totalSaves;
            draft.byId[listId].isSaved = saved;
            draft.byId[listId].totalSaves = saved
              ? previousTotalSaves + 1
              : previousTotalSaves - 1;
            if (draft.byId[listId].savers) {
              if (saved) {
                draft.byId[listId].savers.unshift(actor);
              } else {
                draft.byId[listId].savers = state.byId[listId].savers.filter(
                  (saver) => saver.id !== actor.id,
                );
              }
            }
          }
        }

        if (entityType === entityTypes.LIST_ITEM) {
          const {
            parentId: listId,
            entityId: listItemId,
            saved,
          } = action.payload;

          const listItemsData = get(state, `byId[${listId}].items.data`);
          if (listItemsData) {
            const index = listItemsData.findIndex(
              (item) => item.id === listItemId,
            );
            if (index > -1) {
              draft.byId[listId].items.data[index].isSaved = saved;
            }
          }

          if (state.items[listItemId]) {
            draft.items[listItemId].isSaved = saved;
          }
        }
        break;
      }

      case actions.LIST_ITEM_VOTE:
      case actions.LIST_ITEM_UNVOTE: {
        const {listId, listItemId, voted, voter, sortByVotes} = action.payload;
        const newState = state;

        // Item in list update
        const listItemsData = get(state, `byId[${listId}].items.data`);
        if (listItemsData) {
          const index = listItemsData.findIndex(
            (item) => item.id === listItemId,
          );
          if (index > -1) {
            const updatedItem = getUpdatedVotesForItem({
              item: listItemsData[index],
              voted,
              voter,
            });

            if (sortByVotes) {
              draft.byId[listId].items.data.splice(index, 1);
              const newItemsData = [
                ...listItemsData.slice(0, index),
                ...listItemsData.slice(index + 1),
              ];
              let insertedIndex;

              if (voted) {
                insertedIndex = sortedLastIndexBy(
                  newItemsData,
                  updatedItem,
                  (item) => -item.totalVotes,
                );
              } else {
                insertedIndex = sortedIndexBy(
                  newItemsData,
                  updatedItem,
                  (item) => -item.totalVotes,
                );
              }
              draft.byId[listId].items.data.splice(
                insertedIndex,
                0,
                updatedItem,
              );
              draft.byId[listId].items.data.forEach((item, index) => {
                draft.byId[listId].items.data[index].idx = index;
              });
            } else {
              draft.byId[listId].items.data[index] = updatedItem;
            }
            draft.byId[listId].totalVotes += voted ? 1 : -1;
          }
        }

        // Item update
        if (state.items[listItemId]) {
          draft.items[listItemId].voted = voted;
          draft.items[listItemId].totalVotes += voted ? 1 : -1;

          if (voted) {
            draft.items[listItemId].voters.unshift(voter);
          } else {
            const voterIndex = state.items[listItemId].voters.findIndex(
              (v) => v.id !== voter.id,
            );
            draft.items[listItemId].voters.splice(voterIndex, 1);
          }
        }

        // Item in city
        if (get(newState, 'savedItems.data')) {
          const index = newState.savedItems.data.findIndex(
            (item) => item.id === listItemId,
          );
          if (index > -1) {
            draft.savedItems.data[index].voted = voted;
            draft.savedItems.data[index].totalVotes += voted ? 1 : -1;
            if (voted) {
              draft.savedItems.data[index].voters.unshift(voter);
            } else {
              const voterIndex = state.savedItems.data[index].voters.findIndex(
                (v) => v.id !== voter.id,
              );
              draft.savedItems.data[index].voters.splice(voterIndex, 1);
            }
          }
        }
        break;
      }

      case actions.LIST_ADDED_ITEM: {
        const {listId, newItem} = action.payload;
        const {idx: newItemIndex} = newItem;
        if (state.byId[listId]) {
          draft.byId[listId].items.data.splice(newItemIndex, 0, newItem);

          draft.byId[listId].totalContributors = newItem.totalContributors;
          draft.byId[listId].totalItems = newItem.totalItems;
          draft.byId[listId].totalVotes = newItem.totalVotes;
          draft.byId[listId].filteredTotals = newItem.filteredTotals || {};
        }
        break;
      }

      case actions.LIST_ITEM_EDIT: {
        const {listId, listItemId, editedItem} = action.payload;

        // Update in list
        const listItemsData = get(state, `byId[${listId}].items.data`);
        if (listItemsData) {
          const index = listItemsData.findIndex(
            (item) => item.id === listItemId,
          );
          if (index > -1) {
            draft.byId[listId].items.data[index] = {
              ...state.byId[listId].items.data[index],
              ...editedItem,
            };
          }
        }

        // Update the list item
        if (state.items[listItemId]) {
          draft.items[listItemId] = {
            ...state.items[listItemId],
            ...editedItem,
          };
        }
        break;
      }

      case actions.LIST_ITEM_DELETE: {
        const {listId, listItemId, data} = action.payload;

        // Update from list
        const listItemsData = get(state, `byId[${listId}].items.data`);
        if (listItemsData) {
          const index = listItemsData.findIndex(
            (item) => item.id === listItemId,
          );
          if (index > -1) {
            draft.byId[listId].items.data.splice(index, 1);

            draft.byId[listId].totalContributors = data.totalContributors;
            draft.byId[listId].totalItems = data.totalItems;
            draft.byId[listId].totalVotes = data.totalVotes;
            draft.byId[listId].filteredTotals = data.filteredTotals || {};
          }
        }

        // Update from list items
        if (state.items[listItemId]) {
          draft.items[listItemId] = null;
        }
        break;
      }

      case commentActions.ADD_COMMENT_PENDING: {
        const {topContextEntity, contextEntity, tempId} = action.payload;

        if (state.items[topContextEntity.id]) {
          const shouldAddCommentToListItem =
            contextEntity.type === entityTypes.LIST_ITEM;
          draft.items[topContextEntity.id].totalComments =
            parseInt(state.items[topContextEntity.id].totalComments, 0) + 1;
          if (shouldAddCommentToListItem) {
            draft.items[topContextEntity.id].comments.push(tempId);
          }

          const {listId} = state.items[topContextEntity.id];
          const listItemsData = get(state, `byId[${listId}].items.data`);
          if (listItemsData) {
            const listItemIndex = listItemsData.findIndex(
              (item) => item.id === topContextEntity.id,
            );
            if (listItemIndex > -1) {
              draft.byId[listId].items.data[listItemIndex].totalComments += 1;
            }
          }
        }
        break;
      }

      case commentActions.ADD_COMMENT_SUCCESS: {
        const {contextEntity, tempId, data} = action.payload;
        if (state.items[contextEntity.id]) {
          const tempIndex = state.items[contextEntity.id].comments.findIndex(
            (commentId) => commentId === tempId,
          );
          draft.items[contextEntity.id].comments[tempIndex] = data.data.id;
        }
        break;
      }

      case commentActions.ADD_COMMENT_FAILED:
      case commentActions.DELETE_COMMENT: {
        const {
          topContextEntity,
          commentId,
          numberOfCommentsDeleted,
        } = action.payload;

        if (state.items[topContextEntity.id]) {
          draft.items[topContextEntity.id].comments = pull(
            state.items[topContextEntity.id].comments,
            commentId,
          );
          draft.items[topContextEntity.id].totalComments =
            parseInt(state.items[topContextEntity.id].totalComments, 0) -
            numberOfCommentsDeleted;

          const {listId} = state.items[topContextEntity.id];
          const listItemsData = get(state, `byId[${listId}].items.data`);
          if (listItemsData) {
            const listItemIndex = listItemsData.findIndex(
              (item) => item.id === topContextEntity.id,
            );
            if (listItemIndex > -1) {
              draft.byId[listId].items.data[
                listItemIndex
              ].totalComments -= numberOfCommentsDeleted;
            }
          }
        }
        break;
      }

      case actions.LIST_UPDATE: {
        const {listId, delta} = action.payload;
        draft.byId[listId] = {
          ...state.byId[listId],
          ...delta,
        };
        break;
      }

      default:
    }
  });

export default reducer;
