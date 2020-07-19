/* eslint-disable no-param-reassign */
import produce from 'immer';
import {get, merge} from '../../infra/utils';
import * as friendshipActions from '../friendships/actions';
import * as feedActions from '../feed/actions';
import * as authActions from '../auth/actions';
import * as actions from './actions';

const initialState = {};

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case feedActions.ADD_POST: {
        const {newPost, additionalData = {}} = action.payload;
        const actorId = get(newPost, 'actor.id');
        const profileActivation = get(state, `activations.${actorId}.data`);

        if (profileActivation) {
          const insertionIndex = profileActivation.findIndex((activation) => {
            const profileAppearanceRank = get(
              activation,
              'profileAppearanceRank',
            );
            return (
              !activation.post ||
              profileAppearanceRank <
                get(additionalData, 'activation.profileAppearanceRank', 0)
            );
          });
          const nextNewPost = merge(
            {},
            {...additionalData.activation, post: newPost},
          );
          draft.activations[actorId].data.splice(
            insertionIndex,
            0,
            nextNewPost,
          );
        }
        break;
      }

      case actions.EDIT_IMAGE:
        if (state[action.payload.userId]) {
          draft[action.payload.userId].data.user.media = action.payload.media;
        }
        break;

      case actions.PROFILE_UPDATE: {
        const {userId, data} = action.payload;

        if (state[userId]) {
          const oldData = get(state[userId], 'data', {});
          const oldUser = get(state[userId], 'data.user', {});
          const {user, ...restData} = data;
          const {aroundCurrent = null, aroundCommunity = null} = user;

          draft[userId].data = {
            ...oldData,
            ...restData,
            aroundCurrent,
            aroundCommunity,
          };
          draft[userId].data.user = {...oldUser, ...user};
        }
        break;
      }

      case actions.SET_INSTAGRAM_TOKEN: {
        const {token, userId} = action.payload;
        if (draft[userId]) {
          draft[userId].data.user.instagramV2Token = token;
        }
        break;
      }

      case actions.DELETE_INSTAGRAM_TOKEN: {
        const {userId} = action.payload;
        if (draft[userId]) {
          draft[userId].data.user.instagramToken = null;
          draft[userId].data.user.instagramV2Token = null;
        }
        break;
      }

      case friendshipActions.UPDATE_FRIEND_STATUS: {
        const {userId, friendshipStatus} = action.payload;
        if (state[userId]) {
          draft[userId].data.friendshipStatus = friendshipStatus;
        }

        break;
      }

      case authActions.ADD_HIDDEN_POST:
      case feedActions.HIDE_POST_FROM_FEED:
      case feedActions.DELETE_POST: {
        const {postId} = action.payload;
        if (state.activations) {
          const activationId = postId;
          Object.keys(state.activations).forEach((profileId) => {
            const activation = get(state, `activations.${profileId}.data`);
            if (activation) {
              const removedPostIndex = activation.findIndex((activation) => {
                const ctaIndex =
                  !activation.post && activation.id === activationId;
                const postIndex =
                  activation.post && activation.post.id === activationId;
                return ctaIndex || postIndex;
              });
              if (removedPostIndex > -1) {
                draft.activations[profileId].data.splice(removedPostIndex, 1);
              }
            }
          });
        }
        break;
      }

      default:
    }
  });

export default reducer;
