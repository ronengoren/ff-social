import {apiCommand} from '../apiCommands/actions';
import {analytics} from '../../infra/reporting';
import {entityTypes} from '../../vars/enums';

export const ADD_COMMENT_PENDING = 'ADD_COMMENT_PENDING';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILED = 'ADD_COMMENT_FAILED';
export const LIKE_COMMENT = 'LIKE_COMMENT';
export const DELETE_COMMENT = 'DELETE_COMMENT';
export const UPDATE_COMMENT = 'UPDATE_COMMENT';
export const UPDATE_COMMENTS_COUNTER = 'UPDATE_COMMENTS_COUNTER';

export const createComment = ({
  actor,
  text,
  mediaUrl,
  mentions,
  contextEntity,
  topContextEntity,
  feedContextId,
  publisherId,
  publisherType,
}) => (dispatch) => {
  const tempId = `tempId${new Date()}`;
  dispatch({
    type: ADD_COMMENT_PENDING,
    payload: {actor, text, mentions, contextEntity, topContextEntity, tempId},
  });

  return new Promise((resolve, reject) => {
    dispatch(
      apiCommand('comments.create', {
        contextEntity,
        text,
        mediaUrl,
        publisherId,
        publisherType,
      }),
    )
      .then((res) => {
        dispatch({
          type: ADD_COMMENT_SUCCESS,
          payload: {
            tempId,
            actor,
            topContextEntity,
            contextEntity,
            data: res.data,
          },
        });

        if (topContextEntity.type === entityTypes.POST) {
          dispatch({
            type: UPDATE_COMMENTS_COUNTER,
            payload: {
              postId: topContextEntity.id,
              entityId: feedContextId,
              add: 1,
            },
          });
        }

        const comment = res.data.data;
        analytics.actionEvents
          .comment({
            commentId: comment.id,
            commentCreatorId: comment.actor.id,
            commentCreatorName: comment.actor.name,
            commentCreatorType: comment.actor.type,
            commentNumberOfChars: comment.text.length,
            postId: contextEntity.id,
            postCreatorId: actor.id,
            postCreatorName: actor.name,
            postType: contextEntity.type,
            postContextId: feedContextId,
            postContextName: contextEntity.name,
            hasMentions: comment.mentions && !!comment.mentions.length,
            mentions: comment.mentions,
          })
          .dispatch();

        resolve(res);
      })
      .catch((err) => {
        dispatch({
          type: ADD_COMMENT_FAILED,
          payload: {
            commentId: tempId,
            contextEntity,
            topContextEntity,
            query: 'comments.create',
            err,
          },
        });
        reject(err);
      });
  });
};

export const likeComment = ({comment}) => async (dispatch) => {
  const isLike = !comment.liked;
  dispatch({
    type: LIKE_COMMENT,
    payload: {
      commentId: comment.id,
      liked: isLike,
    },
  });

  await dispatch(
    apiCommand(`comments.${isLike ? 'like' : 'unlike'}`, {
      commentId: comment.id,
    }),
  );

  if (isLike) {
    analytics.actionEvents
      .commentLike({
        commentId: comment.id,
        commentCreatorId: comment.actor.id,
        commentCreatorName: comment.actor.name,
        numberOfChars: comment.text.length,
      })
      .dispatch();
  }
};

export const deleteComment = ({
  commentId,
  contextEntity,
  topContextEntity,
  replies,
  feedContextId,
}) => async (dispatch) => {
  await dispatch(apiCommand('comments.delete', {commentId}));

  const numberOfCommentsDeleted =
    replies && replies.length ? replies.length + 1 : 1;

  dispatch({
    type: DELETE_COMMENT,
    payload: {
      commentId,
      contextEntity,
      topContextEntity,
      numberOfCommentsDeleted,
    },
  });

  if (topContextEntity.type === entityTypes.POST) {
    dispatch({
      type: UPDATE_COMMENTS_COUNTER,
      payload: {
        postId: topContextEntity.id,
        entityId: feedContextId,
        add: -1 * numberOfCommentsDeleted,
      },
    });
  }
};

export const editComment = ({commentId, text, mentionsList}) => async (
  dispatch,
) => {
  await dispatch(apiCommand('comments.edit', {commentId, text}));
  dispatch({type: UPDATE_COMMENT, payload: {commentId, text, mentionsList}});
};
