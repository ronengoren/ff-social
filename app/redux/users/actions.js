import {apiQuery} from '../apiQuery/actions';
import {apiCommand} from '../apiCommands/actions';
import {joinArrayToString} from '../../infra/utils/stringUtils';
import {referrerStatus} from '../../vars/enums';

export const UPDATE_REFERRERS_STATUS = 'UPDATE_REFERRERS_STATUS';
export const RESET_USERS = 'RESET_USERS';

export const getUserHookedEntities = ({
  ownedEntitiesTypes = [],
  hookedEntitiesTypes = [],
}) => (dispatch) =>
  dispatch(
    apiQuery({
      reducerStatePath: 'users.hookedEntities',
      query: {
        domain: 'users',
        key: 'getUserHookedEntities',
        params: {
          ownedEntitiesTypes: joinArrayToString(ownedEntitiesTypes),
          hookedEntitiesTypes: joinArrayToString(hookedEntitiesTypes),
        },
      },
    }),
  );

export const getUsersAround = ({latitude, longitude, name, numberOfUsers}) => (
  dispatch,
) =>
  dispatch(
    apiQuery({
      reducerStatePath: `users.around.${name}`,
      query: {
        domain: 'users',
        key: 'around',
        params: {latitude, longitude, perPage: numberOfUsers},
      },
    }),
  );

export const redeemReferral = ({requesterEmail, userIdsToRedeem}) => async (
  dispatch,
) => {
  await dispatch(
    apiCommand('refProgram.redeem', {requesterEmail, userIdsToRedeem}),
  );
  dispatch({
    type: UPDATE_REFERRERS_STATUS,
    payload: {
      referrersIds: userIdsToRedeem,
      refStatus: referrerStatus.REDEEM_IN_PROGRESS,
    },
  });
};

export const resetUsersResults = () => ({
  type: RESET_USERS,
});
