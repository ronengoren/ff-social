import {get, pull, cloneDeep} from '../../infra/utils';
import {
  UPDATE_SHARED_EVENT_RSVP,
  UPDATE_FRIENDSHIP_STATUS,
  BOOST_UP,
  BOOST_DOWN,
} from '../feed/actions';
import {entityTypes} from '../../vars/enums';
import {
  getUpdatedVotesForItem,
  appendInfiniteScrollPropsToPostWithItems,
} from '../utils/common';
import * as commentActions from '../comments/actions';
import * as listActions from '../lists/actions';
import * as actions from './actions';

const postInitialState = {
  loaded: false,
  loading: false,
  post: null,
  comments: null,
  likes: null,
};

const initialState = {};

const transformer = ({
  state,
  contextPostId,
  postId,
  actor,
  actionName,
  actionCountName,
  actionActorsName,
}) => {
  const isSharedPost = contextPostId !== postId;
  const postIdToUpdate = isSharedPost ? contextPostId : postId;
  const updatedPost = JSON.parse(JSON.stringify(state[postIdToUpdate].post));
  const post = isSharedPost
    ? updatedPost.sharedEntity.entity.post
    : updatedPost;
  post[actionCountName] += post[actionName] ? -1 : 1;
  post[actionName] = !post[actionName];
  if (post[actionName]) {
    post[actionActorsName].splice(0, 0, actor);
  } else {
    post[actionActorsName] = post[actionActorsName].filter(
      (user) => user.id !== actor.id,
    );
  }
  if (isSharedPost) {
    return {
      ...state,
      [postIdToUpdate]: {
        ...state[postIdToUpdate],
        post: {
          ...state[postIdToUpdate].post,
          sharedEntity: {
            ...state[postIdToUpdate].post.sharedEntity,
            entity: {post},
          },
        },
      },
    };
  }
  return {...state, [postIdToUpdate]: {...state[postIdToUpdate], post}};
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_POST_PENDING:
      return {
        ...state,
        [action.payload.postId]: Object.assign({}, postInitialState, {
          loading: true,
        }),
      };

    case actions.GET_POST_SUCCESS: {
      const {post} = action.payload;
      const entityListItemsPath = 'sharedEntity.entity.items';
      const entityItems = get(post, entityListItemsPath);
      const clonedPost = cloneDeep(post);
      return {
        ...state,
        [action.payload.post.id]: {
          loading: false,
          loaded: true,
          post: entityItems
            ? appendInfiniteScrollPropsToPostWithItems({
                data: entityItems,
                post: clonedPost,
              })
            : post,
          comments: action.payload.comments.map((comment) => comment.id),
          likes: action.payload.likes,
        },
      };
    }

    case actions.GET_POST_FAILURE:
      return {
        ...state,
        [action.payload.postId]: Object.assign({}, postInitialState, {
          err: action.payload.err,
        }),
      };

    case actions.UPDATE_POST: {
      const {
        id,
        payload,
        link,
        mentionsList,
        tags,
        postLocation,
        contextCountryCode,
      } = action.payload;

      if (state[id]) {
        const post = {
          ...state[id].post,
          payload,
          link,
          edited: true,
          mentions: mentionsList,
          tags,
          postLocation,
        };

        if (contextCountryCode) {
          post.contextCountryCode = contextCountryCode;
        }

        return {...state, [id]: {...state[id], post}};
      }
      return state;
    }

    case actions.LIKE_SINGLE_POST: {
      const {
        payload: {contextPostId, postId, actor},
      } = action;
      return transformer({
        state,
        contextPostId,
        postId,
        actor,
        actionName: 'liked',
        actionCountName: 'likes',
        actionActorsName: 'likers',
      });
    }

    case BOOST_UP: {
      const {postId} = action.payload;
      if (state[postId] && state[postId].post) {
        const {post} = state[postId];
        const {cq} = post;
        const newContentQuality = cq + 10;
        return {
          ...state,
          [postId]: {
            ...state[postId],
            post: {
              ...post,
              cq: newContentQuality,
            },
          },
        };
      }
      return state;
    }

    case BOOST_DOWN: {
      const {postId} = action.payload;
      if (state[postId] && state[postId].post) {
        const {post} = state[postId];
        const {cq} = post;
        const newContentQuality = cq - 10;
        return {
          ...state,
          [postId]: {
            ...state[postId],
            post: {
              ...post,
              cq: newContentQuality,
            },
          },
        };
      }
      return state;
    }

    case actions.SAVE_SINGLE_POST: {
      const {
        payload: {contextPostId, postId, actor},
      } = action;
      return transformer({
        state,
        contextPostId,
        postId,
        actor,
        actionName: 'saved',
        actionCountName: 'saves',
        actionActorsName: 'savers',
      });
    }

    case UPDATE_SHARED_EVENT_RSVP: {
      const {postId, rsvpStatus, rsvpCounts, invitees} = action.payload;
      if (state[postId] && state[postId].post) {
        return {
          ...state,
          [postId]: {
            ...state[postId],
            post: {
              ...state[postId].post,
              sharedEntity: {
                ...state[postId].post.sharedEntity,
                entity: {
                  ...state[postId].post.sharedEntity.entity,
                  userRSVP: rsvpStatus,
                  rsvpCounts,
                  invitees,
                },
              },
            },
          },
        };
      }
      return state;
    }

    case commentActions.ADD_COMMENT_PENDING: {
      const {topContextEntity, contextEntity, tempId} = action.payload;

      if (state[topContextEntity.id]) {
        const origCommentsCount = parseInt(
          state[topContextEntity.id].post.comments,
          0,
        );
        const shouldAddCommentToPost = contextEntity.type === entityTypes.POST;
        const newCommentsIds = shouldAddCommentToPost
          ? [...state[topContextEntity.id].comments, tempId]
          : state[topContextEntity.id].comments;

        return {
          ...state,
          [topContextEntity.id]: {
            ...state[topContextEntity.id],
            comments: newCommentsIds,
            post: {
              ...state[topContextEntity.id].post,
              comments: origCommentsCount + 1,
            },
          },
        };
      }

      return state;
    }

    case commentActions.ADD_COMMENT_SUCCESS: {
      const {contextEntity, tempId, data} = action.payload;
      if (state[contextEntity.id]) {
        const commentsArrayWithoutTemp = state[
          contextEntity.id
        ].comments.filter((commentId) => commentId !== tempId);

        return {
          ...state,
          [contextEntity.id]: {
            ...state[contextEntity.id],
            comments: [...commentsArrayWithoutTemp, data.data.id],
          },
        };
      }

      return state;
    }

    case commentActions.ADD_COMMENT_FAILED:
    case commentActions.DELETE_COMMENT: {
      const {
        topContextEntity,
        commentId,
        numberOfCommentsDeleted,
      } = action.payload;
      if (state[topContextEntity.id]) {
        return {
          ...state,
          [topContextEntity.id]: {
            ...state[topContextEntity.id],
            post: {
              ...state[topContextEntity.id].post,
              comments:
                parseInt(state[topContextEntity.id].post.comments, 0) -
                numberOfCommentsDeleted,
            },
            comments: pull(state[topContextEntity.id].comments, commentId),
          },
        };
      }

      return state;
    }

    case UPDATE_FRIENDSHIP_STATUS: {
      const {postId, friendshipStatus} = action.payload;

      if (state[postId]) {
        return {
          ...state,
          [postId]: {
            ...state[postId],
            post: {
              ...state[postId].post,
              actor: {
                ...state[postId].post.actor,
                friendshipStatus,
              },
            },
          },
        };
      }
      return state;
    }

    case listActions.LIST_ITEM_VOTE:
    case listActions.LIST_ITEM_UNVOTE: {
      const {listId, listItemId, voter, voted} = action.payload;
      const postId = Object.keys(state).find(
        (key) => get(state, `${key}.post.sharedEntity.entity.id`) === listId,
      );
      if (postId) {
        const {entity} = state[postId].post.sharedEntity;
        const {totalVotes} = entity;
        const index = entity.items.data.findIndex(
          (item) => item.id === listItemId,
        );

        if (index > -1) {
          const updatedItem = getUpdatedVotesForItem({
            item: entity.items.data[index],
            voted,
            voter,
          });

          const updatedStateSlice = {
            ...state[postId],
            post: {
              ...state[postId].post,
              sharedEntity: {
                ...state[postId].post.sharedEntity,
                entity: {
                  ...entity,
                  items: {
                    data: [
                      ...entity.items.data.slice(0, index),
                      updatedItem,
                      ...entity.items.data.slice(index + 1),
                    ],
                  },
                  totalVotes: voted ? totalVotes + 1 : totalVotes - 1,
                },
              },
            },
          };
          return {
            ...state,
            [postId]: updatedStateSlice,
          };
        }
        return state;
      }
      return state;
    }
    default:
      return state;
  }
};

export default reducer;
