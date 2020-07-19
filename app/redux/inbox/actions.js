// import {setBadgeNumber} from '../../infra/pushNotifications';
import {joinArrayToString} from '../../infra/utils/stringUtils';
import {apiQuery} from '../apiQuery/actions';

export const UPDATE_UNREAD_CHATS = 'INBOX/UPDATE_UNREAD_CHATS';
export const SET_CLIENT = 'INBOX/SET_CLIENT';
export const UPDATE_CHAT_STATUS = 'INBOX/UPDATE_CHAT_STATUS';
export const UPDATE_TABS_UNREAD_CHATS = 'INBOX/UPDATE_TABS_UNREAD_CHATS';
export const INCREASE_TAB_UNREAD_CHATS = 'INBOX/INCREASE_TAB_UNREAD_CHATS';
export const DECREASE_TAB_UNREAD_CHATS = 'INBOX/DECREASE_TAB_UNREAD_CHATS';

export const setClient = ({client}) => ({
  type: SET_CLIENT,
  payload: {
    client,
  },
});

export const getChatStatus = ({userIds}) => async (dispatch) => {
  const res = await dispatch(
    apiQuery({
      query: {
        domain: 'users',
        key: 'getChatStatus',
        params: {chatUserIds: joinArrayToString(userIds)},
      },
    }),
  );
  dispatch({
    type: UPDATE_CHAT_STATUS,
    payload: {
      data: res.data.data,
    },
  });
};

export const updateUnreadChats = ({unreadChats}) => {
  const state = global.store.getState();
  const {
    notifications: {unseenNotifications},
  } = state;
  // setBadgeNumber(unreadChats + unseenNotifications);

  return {
    type: UPDATE_UNREAD_CHATS,
    payload: {
      unreadChats,
    },
  };
};

export const updateTabsUnreadChats = ({inbox, requests, blocked}) => ({
  type: UPDATE_TABS_UNREAD_CHATS,
  payload: {
    inbox,
    requests,
    blocked,
  },
});

export const increaseTabUnreadChats = ({tab}) => ({
  type: INCREASE_TAB_UNREAD_CHATS,
  payload: {
    tab,
  },
});

export const decreaseTabUnreadChats = ({tab}) => ({
  type: DECREASE_TAB_UNREAD_CHATS,
  payload: {
    tab,
  },
});
