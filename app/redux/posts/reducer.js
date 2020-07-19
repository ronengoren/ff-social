/* eslint-disable no-param-reassign */
import produce from 'immer';
import {get, merge, cloneDeep} from '../../infra/utils';
import {ADD_ENTITIES} from '../normalizer';
import {SAVE, UNSAVE} from '../themes/actions';
import {
  UPDATE_POST_MEDIA_GALLERY,
  SAVE_POST,
  BOOST_UP,
  BOOST_DOWN,
  LIKE_POST,
  UPDATE_SHARED_EVENT_RSVP,
  UPDATE_POST,
  UPDATE_FRIENDSHIP_STATUS,
} from '../feed/actions';
import {
  GROUP_HIGHLIGHT_ITEM,
  GROUP_DEHIGHLIGHTED_ITEM,
} from '../groups/actions';
import * as pagesActions from '../pages/actions';
import * as scheduledPosts from '../scheduledPosts/actions';
import * as commentsActions from '../comments/actions';
import * as eventsActions from '../events/actions';
import {entityTypes} from '../../vars/enums';

const initialState = {
  byId: {},
};

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case ADD_ENTITIES: {
        const {posts} = action.payload.data;
        if (posts) {
          Object.keys(posts).forEach((key) => {
            const postObj = cloneDeep(state.byId[key] || {});
            postObj.mentions = []; // Never merge mentions array when new mentions are added
            draft.byId[key] = merge({}, postObj, posts[key]);
          });
        }
        break;
      }

      case UPDATE_POST_MEDIA_GALLERY: {
        const {postId, mediaGallery} = action.payload;
        if (state.byId[postId]) {
          draft.byId[postId].mediaGallery = mediaGallery;
        }
        break;
      }

      case SAVE:
      case UNSAVE: {
        const {entityId, saved, actor} = action.payload;
        const postId = Object.keys(state.byId).find(
          (key) =>
            get(state.byId[key], 'payload.templateData.entity.id') === entityId,
        );

        if (state.byId[postId]) {
          const {savers, saves} = state.byId[
            postId
          ].payload.templateData.entity;
          const newSavers = savers.filter((saver) => saver.id !== actor.id);
          const newSaves = saved ? saves + 1 : saves - 1;

          draft.byId[postId].payload.templateData.entity.isSaved = saved;
          draft.byId[postId].payload.templateData.entity.savers = saved
            ? [actor, ...newSavers]
            : newSavers;
          draft.byId[postId].payload.templateData.entity.saves = newSaves;
          draft.byId[postId].saved = saved;
          draft.byId[postId].savers = saved ? [actor, ...newSavers] : newSavers;
          draft.byId[postId].saves = newSaves;
        }
        break;
      }

      case SAVE_POST: {
        const {postId, actor} = action.payload;
        const post = state.byId[postId];
        const {savers, saved, saves} = post;
        const newSavers = savers.filter((saver) => saver.id !== actor.id);
        const newSaves = saved ? saves - 1 : saves + 1;
        if (post) {
          draft.byId[postId].saves = newSaves;
          draft.byId[postId].saved = !saved;
          draft.byId[postId].savers = saved ? newSavers : [actor, ...newSavers];
        }
        break;
      }

      case BOOST_UP: {
        const {postId} = action.payload;
        const {cq} = state.byId[postId];

        const newContentQuality = cq + 10;
        draft.byId[postId].cq = newContentQuality;
        break;
      }

      case BOOST_DOWN: {
        const {postId} = action.payload;
        const {cq} = state.byId[postId];
        const newContentQuality = cq - 10;
        draft.byId[postId].cq = newContentQuality;
        break;
      }

      case LIKE_POST: {
        const {actor, postId} = action.payload;
        const post = state.byId[postId];
        const {likers, liked, likes} = post;
        const newLikers = likers.filter((liker) => liker.id !== actor.id);
        const newLikes = liked ? likes - 1 : likes + 1;

        draft.byId[postId].likes = newLikes;
        draft.byId[postId].liked = !liked;
        draft.byId[postId].likers = liked ? newLikers : [actor, ...newLikers];
        break;
      }

      case pagesActions.PATCH_PAGE: {
        const {pageId, patch} = action.payload;
        const postId = Object.keys(state.byId).find(
          (key) =>
            get(state.byId[key], 'sharedEntity.entity.page.id') === pageId,
        );

        if (postId) {
          draft.byId[postId].sharedEntity.entity.page = {
            ...state.byId[postId].sharedEntity.entity.page,
            ...patch({page: state.byId[postId].sharedEntity.entity.page}),
          };
        }
        break;
      }

      case GROUP_HIGHLIGHT_ITEM:
      case GROUP_DEHIGHLIGHTED_ITEM: {
        const {entityId, entityType} = action.payload;
        const isSharedEntityUpdated = entityType !== entityTypes.POST;
        let postId;
        if (isSharedEntityUpdated) {
          postId = Object.keys(state.byId).find(
            (key) => get(state.byId[key], 'sharedEntity.entityId') === entityId,
          );
        } else {
          postId = entityId;
        }

        if (state.byId[postId]) {
          if (isSharedEntityUpdated) {
            draft.byId[postId].sharedEntity.highlighted = !state.byId[postId]
              .sharedEntity.highlighted;
          }
          draft.byId[postId].highlighted = !state.byId[postId].highlighted;
        }
        break;
      }

      case commentsActions.UPDATE_COMMENTS_COUNTER: {
        const {postId, add} = action.payload;

        if (state.byId[postId]) {
          draft.byId[postId].comments = state.byId[postId].comments + add;
        }
        break;
      }

      case scheduledPosts.UPDATE_SCHEDULED_POST:
      case UPDATE_POST: {
        const {
          id,
          payload,
          link,
          mentionsList,
          tags,
          scheduledDate,
          postLocation,
          contextCountryCode,
        } = action.payload;
        if (state.byId[id]) {
          if (state.byId[id].scheduledDate) {
            draft.byId[id].scheduledDate = scheduledDate;
          }
          if (contextCountryCode) {
            draft.byId[id].contextCountryCode = contextCountryCode;
          }
          draft.byId[id].payload = payload;
          draft.byId[id].link = link;
          draft.byId[id].edited = true;
          draft.byId[id].mentions = mentionsList;
          draft.byId[id].tags = tags;
          draft.byId[id].postLocation = postLocation;
        }
        break;
      }

      case UPDATE_SHARED_EVENT_RSVP: {
        const {postId, rsvpStatus, rsvpCounts, invitees} = action.payload;

        if (state.byId[postId]) {
          draft.byId[postId].sharedEntity.entity.userRSVP = rsvpStatus;
          draft.byId[postId].sharedEntity.entity.rsvpCounts = rsvpCounts;
          draft.byId[postId].sharedEntity.entity.invitees = invitees;
        }
        break;
      }

      case UPDATE_FRIENDSHIP_STATUS: {
        const {postId, friendshipStatus} = action.payload;

        if (state.byId[postId]) {
          draft.byId[postId].actor.friendshipStatus = friendshipStatus;
        }
        break;
      }

      case eventsActions.EVENT_SET_RSVP: {
        const {eventId, rsvpStatus, rsvpCounts} = action.payload;
        const postId = Object.keys(state.byId).find(
          (key) => get(state.byId[key], 'sharedEntity.entity.id') === eventId,
        );

        if (postId) {
          draft.byId[postId].sharedEntity.entity.userRSVP = rsvpStatus;
          draft.byId[postId].sharedEntity.entity.rsvpCounts = rsvpCounts;
        }

        break;
      }
      default:
    }
  });

export default reducer;
