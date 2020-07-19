/* eslint-disable no-param-reassign */
import produce from 'immer';
import {LOGOUT_SUCCESS} from '../auth/actions';
import * as actions from './actions';

const initialState = {
  unreadChats: 0,
  unreadTabsChats: {
    inbox: 0,
    requests: 0,
    blocked: 0,
  },
  client: null,
  chatStatus: {},
};

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case actions.SET_CLIENT:
        draft.client = action.payload.client;
        break;
      case actions.UPDATE_CHAT_STATUS:
        draft.chatStatus = {...state.chatStatus, ...action.payload.data};
        break;
      case actions.UPDATE_UNREAD_CHATS:
        draft.unreadChats = action.payload.unreadChats;
        break;
      case actions.UPDATE_TABS_UNREAD_CHATS:
        draft.unreadTabsChats.inbox = action.payload.inbox || 0;
        draft.unreadTabsChats.requests = action.payload.requests || 0;
        draft.unreadTabsChats.blocked = action.payload.blocked || 0;
        break;
      case actions.INCREASE_TAB_UNREAD_CHATS: {
        const {tab} = action.payload;
        draft.unreadTabsChats[tab] = state.unreadTabsChats[tab] + 1;
        break;
      }
      case actions.DECREASE_TAB_UNREAD_CHATS: {
        const {tab} = action.payload;
        draft.unreadTabsChats[tab] = Math.max(
          state.unreadTabsChats[tab] - 1,
          0,
        );
        break;
      }
      case LOGOUT_SUCCESS:
        draft.chatStatus = {};
        draft.unreadChats = 0;
        break;
      default:
    }
  });

export default reducer;
