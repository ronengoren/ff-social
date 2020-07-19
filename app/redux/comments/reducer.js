/* eslint-disable no-param-reassign */
import produce from 'immer';
import {entityTypes} from '../../vars/enums';
import {GET_POST_SUCCESS} from '../postPage/actions';
import {LIST_ITEM_LOADED} from '../lists/actions';
import {REVIEW_COMMENTS_LOADED} from '../pages/actions';
import * as actions from './actions';

const initialState = {};

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case LIST_ITEM_LOADED:
      case REVIEW_COMMENTS_LOADED:
      case GET_POST_SUCCESS: {
        action.payload.comments.forEach((comment) => {
          let internalComments = [];
          if (comment.comments) {
            comment.comments.forEach((internalComment) => {
              draft[internalComment.id] = internalComment;
            });

            internalComments = comment.comments.map((comment) => comment.id);
          }
          draft[comment.id] = comment;
          draft[comment.id].comments = internalComments;
        });
        break;
      }

      case actions.ADD_COMMENT_PENDING: {
        const {contextEntity, actor, text, mentions, tempId} = action.payload;
        const addedComment = {
          id: tempId,
          actor,
          text,
          eventTime: '',
          likes: 0,
          liked: false,
          posting: true,
          mentions,
          comments: [],
        };
        draft[tempId] = addedComment;

        if (contextEntity.type === entityTypes.COMMENT) {
          draft[contextEntity.id].comments.push(tempId);
        }
        break;
      }

      case actions.ADD_COMMENT_SUCCESS: {
        const {contextEntity, actor, data, tempId} = action.payload;

        const addedComment = {
          id: data.data.id,
          actor,
          text: data.data.text,
          media: data.data.media,
          eventTime: data.data.eventTime,
          likes: 0,
          liked: false,
          mentions: data.data.mentions,
          comments: [],
        };

        delete draft[tempId];
        draft[addedComment.id] = addedComment;

        if (contextEntity.type === entityTypes.COMMENT) {
          const tempCommentIndex = state[contextEntity.id].comments.findIndex(
            (c) => c === tempId,
          );
          draft[contextEntity.id].comments.splice(tempCommentIndex, 1);
          draft[contextEntity.id].comments.push(addedComment.id);
        }
        break;
      }

      case actions.LIKE_COMMENT: {
        const {commentId, liked} = action.payload;

        draft[commentId].liked = liked;
        draft[commentId].likes += liked ? 1 : -1;
        break;
      }

      case actions.ADD_COMMENT_FAILED:
      case actions.DELETE_COMMENT: {
        const {commentId, contextEntity} = action.payload;

        if (contextEntity.type === entityTypes.COMMENT) {
          const removedCommentIndex = draft[
            contextEntity.id
          ].comments.findIndex((c) => c === commentId);
          draft[contextEntity.id].comments.splice(removedCommentIndex, 1);
        }

        if (draft[commentId].comments) {
          draft[commentId].comments.forEach((replyCommentId) => {
            delete draft[replyCommentId];
          });
        }

        delete draft[commentId];
        break;
      }

      case actions.UPDATE_COMMENT: {
        const {commentId, text, mentionsList} = action.payload;
        draft[commentId].text = text;
        draft[commentId].mentions = mentionsList;
        break;
      }

      default:
    }
  });

export default reducer;
