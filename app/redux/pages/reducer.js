import {get} from '../../infra/utils';
import {entityTypes, postTypes} from '../../vars/enums';
import {SAVE, UNSAVE} from '../themes/actions';
import {ADD_POST} from '../feed/actions';
import * as commentsActions from '../comments/actions';
import * as actions from './actions';

const initialState = {
  suggested: {},
  suggestedPagesCarousel: {},
  suggestedPages: {},
  experts: {},
  reviews: {},
  reviewsComments: {},
  owned: {},
  following: {},
  suggestedPagesTags: {},
};

const patchPageInList = ({list, pathcedItemIndex, patch}) => [
  ...list.slice(0, pathcedItemIndex),
  {
    ...list[pathcedItemIndex],
    ...patch({page: list[pathcedItemIndex]}),
  },
  ...list.slice(pathcedItemIndex + 1),
];

const conditionallyPatchPageInDomain = ({domain, pageId, patch}) => {
  const list = get(domain, 'data', []);
  const pathcedItemIndex = list.findIndex((page) => page.id === pageId);
  if (pathcedItemIndex > -1) {
    return {
      ...domain,
      data: patchPageInList({list, pathcedItemIndex, patch}),
    };
  } else {
    return domain;
  }
};

const getReviewPosition = ({state, reviewId}) => {
  let pageId;
  let reviewIndex;
  Object.keys(state.reviews).some((reviewsPageId) => {
    reviewIndex = state.reviews[reviewsPageId].data.findIndex(
      (review) => review.entityId === reviewId,
    );
    if (reviewIndex > -1) {
      pageId = reviewsPageId;
      return true;
    }
    return false;
  });

  return {pageId, reviewIndex};
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE: {
      const {entityId: pageId, entityType} = action.payload;

      if (entityType === entityTypes.PAGE && state[pageId]) {
        return {
          ...state,
          [pageId]: {
            ...state[pageId],
            data: {
              ...state[pageId].data,
              page: {
                ...state[pageId].data.page,
                saved: true,
                followed: true,
                totalSaves: (
                  parseInt(state[pageId].data.page.totalSaves, 10) + 1
                ).toString(),
                totalFollowed: state[pageId].data.page.totalFollowed + 1,
              },
            },
          },
        };
      }

      return state;
    }

    case UNSAVE: {
      const {entityId: pageId, entityType} = action.payload;

      if (entityType === entityTypes.PAGE && state[pageId]) {
        return {
          ...state,
          [pageId]: {
            ...state[pageId],
            data: {
              ...state[pageId].data,
              page: {
                ...state[pageId].data.page,
                saved: false,
                totalSaves: (
                  parseInt(state[pageId].data.page.totalSaves, 10) - 1
                ).toString(),
              },
            },
          },
        };
      }

      return state;
    }

    case actions.PATCH_PAGE: {
      const {pageId, patch} = action.payload;
      let newState = state;
      const newSuggested = conditionallyPatchPageInDomain({
        domain: state.suggested,
        pageId,
        patch,
      });
      const newSuggestedPages = conditionallyPatchPageInDomain({
        domain: state.suggestedPages,
        pageId,
        patch,
      });
      const newSuggestedPagesCarousel = conditionallyPatchPageInDomain({
        domain: state.suggestedPagesCarousel,
        pageId,
        patch,
      });
      const newExpertsPages = conditionallyPatchPageInDomain({
        domain: state.experts,
        pageId,
        patch,
      });
      const newOwned = conditionallyPatchPageInDomain({
        domain: state.owned,
        pageId,
        patch,
      });
      const newFollowed = conditionallyPatchPageInDomain({
        domain: state.followed,
        pageId,
        patch,
      });

      if (state[pageId]) {
        newState = {
          ...state,
          [pageId]: {
            ...state[pageId],
            data: {
              ...state[pageId].data,
              page: {
                ...state[pageId].data.page,
                ...patch({page: state[pageId].data.page}),
              },
            },
          },
        };
      }

      return {
        ...newState,
        suggested: {...newSuggested},
        suggestedPages: {...newSuggestedPages},
        suggestedPagesCarousel: {...newSuggestedPagesCarousel},
        experts: {...newExpertsPages},
        owned: {...newOwned},
        followed: {...newFollowed},
      };
    }

    case actions.DELETE_REVIEW: {
      const {pageId, reviewId} = action.payload;

      return {
        ...state,
        reviews: {
          ...state.reviews,
          [pageId]: {
            ...state.reviews[pageId],
            data: [
              ...state.reviews[pageId].data.filter(
                (review) => review.entityId !== reviewId,
              ),
            ],
          },
        },
      };
    }

    case actions.REVIEW_COMMENTS_LOADED: {
      const {reviewId, pageId, comments} = action.payload;
      const pageReviews = state.reviewsComments[pageId] || {};

      return {
        ...state,
        reviewsComments: {
          ...state.reviewsComments,
          [pageId]: {
            ...pageReviews,
            [reviewId]: comments.map((c) => c.id),
          },
        },
      };
    }

    case actions.RESET_SUGGESTED_PAGES: {
      return {
        ...state,
        suggestedPages: {},
        experts: {},
      };
    }

    case commentsActions.ADD_COMMENT_PENDING: {
      const {topContextEntity, tempId} = action.payload;
      const {pageId, reviewIndex} = getReviewPosition({
        state,
        reviewId: topContextEntity.id,
      });
      let newState = state;
      if (state.reviews[pageId]) {
        const oldCommentsIds = get(
          state,
          `reviewsComments[${pageId}][${topContextEntity.id}]`,
          [],
        );
        const pageReviewComments = state.reviewsComments[pageId] || {};

        newState = {
          ...state,
          reviewsComments: {
            ...state.reviewsComments,
            [pageId]: {
              ...pageReviewComments,
              [topContextEntity.id]: [...oldCommentsIds, tempId],
            },
          },
        };

        if (
          state.reviews[pageId].data[reviewIndex].entityType ===
          entityTypes.LIST_ITEM
        ) {
          newState.reviews[pageId].data[reviewIndex].entity.totalComments += 1;
        }
      }

      return newState;
    }

    case commentsActions.ADD_COMMENT_SUCCESS: {
      const {contextEntity, tempId, data} = action.payload;
      const {pageId} = getReviewPosition({state, reviewId: contextEntity.id});

      if (state.reviewsComments[pageId]) {
        const oldCommentsIds = get(
          state,
          `reviewsComments[${pageId}][${contextEntity.id}]`,
          [],
        );

        return {
          ...state,
          reviewsComments: {
            ...state.reviewsComments,
            [pageId]: {
              ...state.reviewsComments[pageId],
              [contextEntity.id]: oldCommentsIds.map((c) =>
                c === tempId ? data.data.id : c,
              ),
            },
          },
        };
      }

      return state;
    }

    case commentsActions.ADD_COMMENT_FAILED:
    case commentsActions.DELETE_COMMENT: {
      const {topContextEntity, commentId} = action.payload;
      const {pageId, reviewIndex} = getReviewPosition({
        state,
        reviewId: topContextEntity.id,
      });
      let newState = state;

      if (state.reviewsComments[pageId]) {
        const oldCommentsIds = get(
          state,
          `reviewsComments[${pageId}][${topContextEntity.id}]`,
          [],
        );

        newState = {
          ...state,
          reviewsComments: {
            ...state.reviewsComments,
            [pageId]: {
              ...state.reviewsComments[pageId],
              [topContextEntity.id]: oldCommentsIds.filter(
                (oldCommentId) => oldCommentId !== commentId,
              ),
            },
          },
        };

        if (
          state.reviews[pageId].data[reviewIndex].entityType ===
          entityTypes.LIST_ITEM
        ) {
          newState.reviews[pageId].data[reviewIndex].entity.totalComments -= 1;
        }
      }

      return newState;
    }

    case ADD_POST: {
      const {newPost} = action.payload;
      const {postType, pageId} = newPost.payload;
      if (
        postType === postTypes.RECOMMENDATION &&
        state[pageId] &&
        state.reviews[pageId]
      ) {
        return {
          ...state,
          reviews: {
            ...state.reviews,
            [pageId]: {
              ...state.reviews[pageId],
              data: [
                {
                  entity: newPost,
                  entityId: newPost.id,
                  entityType: entityTypes.POST,
                },
                ...state.reviews[pageId].data,
              ],
            },
          },
        };
      }
      return state;
    }

    default:
      return state;
  }
};

export default reducer;
