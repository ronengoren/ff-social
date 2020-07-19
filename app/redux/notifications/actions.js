import {apiCommand} from '../apiCommands/actions';
// import {setBadgeNumber} from '../../infra/pushNotifications';
import permissionsService from '../../infra/permissions/permissionsService';
import {analytics} from '../../infra/reporting';

export const MARK_AS_READ = 'COMMUNICATIONS/MARK_AS_READ';
export const MARK_ALL_AS_SEEN = 'COMMUNICATIONS/MARK_ALL_AS_SEEN';
export const UPDATE_UNSEEN_NOTIFICATIONS =
  'COMMUNICATIONS/UPDATE_UNSEEN_NOTIFICATIONS';

export const markAsRead = (id) => (dispatch) => {
  dispatch(apiCommand('notifications.markItems', {markRead: id}));

  return dispatch({
    type: MARK_AS_READ,
    payload: {
      id,
    },
  });
};

// eslint-disable-next-line consistent-return
export const markAllAsSeen = (unreadChats = 0) => (dispatch, getState) => {
  const state = getState();
  const {unseenNotifications} = state.notifications;
  // setBadgeNumber(unreadChats);

  if (unseenNotifications) {
    dispatch(apiCommand('notifications.markItems', {markSeen: 'true'}));

    return dispatch({
      type: MARK_ALL_AS_SEEN,
    });
  }
};

export const updateUnseenNotifications = (unseenNotifications = 0) => {
  const state = global.store.getState();
  const {conversations} = state.inbox;
  const unreadChats = conversations
    ? conversations.filter(
        (conversation) =>
          conversation.lastMessage && conversation.lastMessage.isUnread,
      ).length
    : 0;
  // setBadgeNumber(unreadChats + unseenNotifications);

  return {
    type: UPDATE_UNSEEN_NOTIFICATIONS,
    payload: {
      unseenNotifications,
    },
  };
};

// export const updatePushNotificationStatus = () => async () => {
//   const pushEnabled = await permissionsService.isPermitted(
//     permissionsService.types.notification.type,
//   );
//   analytics.actionEvents
//     .updateUsersPushNotificationStatus({pushEnabled})
//     .dispatch();
// };
