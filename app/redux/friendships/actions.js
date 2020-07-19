import {apiCommand} from '../apiCommands/actions';
import {updateFriendshipStatus} from '../feed/actions';
import {analytics, Logger} from '../../infra/reporting';
import {get} from '../../infra/utils';
import {friendshipStatusType} from '../../vars/enums';
import {showFriendRequestLimitModal} from '../general/actions';
import ErrorModal from '../../components/modals/ErrorModal';

export const UPDATE_FRIEND_STATUS = 'UPDATE_FRIEND_STATUS';
export const UPDATE_FRIEND_REQUESTS = 'UPDATE_FRIEND_REQUESTS';
export const REMOVE_FROM_FRIEND_REQUESTS = 'REMOVE_FROM_FRIEND_REQUESTS';

export const updateFriendRequests = (friendRequests = 0) => ({
  type: UPDATE_FRIEND_REQUESTS,
  payload: {
    friendRequests,
  },
});

export const approveFriendRequest = ({userId, name, postId}) => async (
  dispatch,
) => {
  dispatch({
    type: UPDATE_FRIEND_STATUS,
    payload: {userId, friendshipStatus: friendshipStatusType.FRIENDS},
  });
  dispatch({type: REMOVE_FROM_FRIEND_REQUESTS, payload: {userId}});
  if (postId) {
    dispatch(
      updateFriendshipStatus({
        postId,
        friendshipStatus: friendshipStatusType.FRIENDS,
      }),
    );
  }
  try {
    await dispatch(apiCommand('friendships.approve', {toId: userId}));
    analytics.actionEvents
      .friendRequestResponse({
        requestorId: userId,
        requestorName: name,
        isApproved: true,
      })
      .dispatch();
  } catch (err) {
    Logger.error({
      errType: 'optimisticRendering',
      action: 'approveFriendRequest',
      err,
    });
  }
};

export const declineFriendRequest = ({userId, name, postId}) => async (
  dispatch,
) => {
  dispatch({
    type: UPDATE_FRIEND_STATUS,
    payload: {userId, friendshipStatus: friendshipStatusType.NOT_FRIENDS},
  });
  dispatch({type: REMOVE_FROM_FRIEND_REQUESTS, payload: {userId}});
  if (postId) {
    dispatch(
      updateFriendshipStatus({
        postId,
        friendshipStatus: friendshipStatusType.NOT_FRIENDS,
      }),
    );
  }
  try {
    await dispatch(apiCommand('friendships.unfriend', {toId: userId}));
    analytics.actionEvents
      .friendRequestResponse({
        requestorId: userId,
        requestorName: name,
        isApproved: false,
      })
      .dispatch();
  } catch (err) {
    Logger.error({
      errType: 'optimisticRendering',
      action: 'declineFriendRequest',
      err,
    });
  }
};

export const isInviteFriendRequestGotError = (res) =>
  get(res, 'data.error.code') === 19;

export const inviteFriendRequest = ({
  userId,
  userName,
  mutualFriends,
  postId,
}) => async (dispatch) => {
  dispatch({
    type: UPDATE_FRIEND_STATUS,
    payload: {userId, friendshipStatus: friendshipStatusType.REQUEST_SENT},
  });
  if (postId) {
    dispatch(
      updateFriendshipStatus({
        postId,
        friendshipStatus: friendshipStatusType.REQUEST_SENT,
      }),
    );
  }

  let res;
  try {
    res = await dispatch(apiCommand('friendships.invite', {toIds: [userId]}));
    if (isInviteFriendRequestGotError(res)) {
      dispatch(showFriendRequestLimitModal());
      dispatch({
        type: UPDATE_FRIEND_STATUS,
        payload: {userId, friendshipStatus: friendshipStatusType.NOT_FRIENDS},
      });
    } else {
      analytics.actionEvents
        .friendRequest({
          friendId: userId,
          friendName: userName,
          totalMutualFriends: mutualFriends,
        })
        .dispatch();
    }
  } catch (err) {
    if (isInviteFriendRequestGotError(res)) {
      dispatch(showFriendRequestLimitModal());
      dispatch({
        type: UPDATE_FRIEND_STATUS,
        payload: {userId, friendshipStatus: friendshipStatusType.NOT_FRIENDS},
      });
    } else {
      ErrorModal.showAlert();
    }
    Logger.error({
      errType: 'optimisticRendering',
      action: 'inviteFriendRequest',
      err,
    });
  }
  return res;
};
