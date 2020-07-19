import {apiQuery} from '../apiQuery/actions';
import {apiCommand} from '../apiCommands/actions';
import {patchResultsItem} from '../results/actions';
import {deletePost} from '../feed/actions';
import {deleteListItem} from '../lists/actions';
import {followPage as groupsHighlightedFollowPage} from '../groups/actions';
import {analytics} from '../../infra/reporting';
import {get} from '../../infra/utils';
import {entityTypes} from '../../vars/enums';

export const PATCH_PAGE = 'PAGES/PATCH_PAGE';
export const DELETE_REVIEW = 'PAGES/DELETE_REVIEW';
export const REVIEW_COMMENTS_LOADED = 'PAGES/REVIEW_COMMENTS_LOADED';
export const RESET_SUGGESTED_PAGES = 'PAGES/RESET_SUGGESTED_PAGES';

export const createPage = ({
  name,
  isAddressGooglePlaceId,
  googleId,
  addressLine2,
  phoneNumber,
  website,
  tags,
  mediaUrl = '',
  contextCountryCode,
}) => async (dispatch) => {
  try {
    const res = await dispatch(
      apiCommand('pages.create', {
        name,
        isAddressGooglePlaceId,
        googleId,
        addressLine2,
        phoneNumber,
        website,
        tags,
        mediaUrl,
        contextCountryCode,
      }),
    );
    const page = res.data.data;
    analytics.actionEvents
      .pageCreation({
        success: true,
        pageId: page.id,
        pageName: page.name,
        tags: page.tags,
      })
      .dispatch();
    return page;
  } catch (err) {
    analytics.actionEvents
      .pageCreation({success: false, failureReason: err.toString()})
      .dispatch();
    throw err;
  }
};

export const patchPage = ({pageId, patch, contextEntityId}) => (
  dispatch,
  getState,
) => {
  dispatch({type: PATCH_PAGE, payload: {pageId, patch, contextEntityId}});

  const patchPageOnResults = () => {
    const resultsData = getState().results.data;
    if (resultsData) {
      const page = resultsData.find((item) => item.id === pageId);
      if (page) {
        dispatch(
          patchResultsItem({
            id: page.id,
            patch: ({item}) => patch({page: item}),
          }),
        );
      }
    }
  };

  patchPageOnResults();
};

export const getPage = ({pageId}) => async (dispatch) => {
  const res = await dispatch(
    apiQuery({
      reducerStatePath: `pages.${pageId}`,
      query: {domain: 'pages', key: 'getPage', params: {pageId}},
    }),
  );
  return res.data.data;
};

export const setLoadedReviewComments = ({comments, reviewId, pageId}) => ({
  type: REVIEW_COMMENTS_LOADED,
  payload: {
    comments,
    reviewId,
    pageId,
  },
});

export const getPageReviewComments = ({
  entityType,
  entityId,
  listId,
  pageId,
}) => async (dispatch) => {
  let res;
  if (entityType === entityTypes.POST) {
    res = await dispatch(
      apiQuery({
        query: {
          domain: 'posts',
          key: 'getComments',
          params: {postId: entityId},
        },
      }),
    );
  } else if (entityType === entityTypes.LIST_ITEM) {
    res = await dispatch(
      apiQuery({
        query: {
          domain: 'lists',
          key: 'getListItemComments',
          params: {listId, listItemId: entityId},
        },
      }),
    );
  }

  dispatch(
    setLoadedReviewComments({
      comments: res.data.data,
      reviewId: entityId,
      pageId,
    }),
  );
};

export const editPage = ({
  pageId,
  name,
  about,
  isAddressGooglePlaceId,
  googleId,
  addressLine2,
  phoneNumber,
  website,
  tags,
  openingHours,
  saved,
  followed,
  contextCountryCode,
}) => async (dispatch) => {
  const res = await dispatch(
    apiCommand('pages.edit', {
      pageId,
      name,
      about,
      isAddressGooglePlaceId,
      googleId,
      addressLine2,
      phoneNumber,
      website,
      tags,
      openingHours,
      saved,
      followed,
      contextCountryCode,
    }),
  );
  dispatch(
    patchPage({
      pageId,
      patch: () => res.data.data,
    }),
  );
};

export const editImages = ({pageId, mediaUrl}) => async (dispatch) => {
  await dispatch(apiCommand('pages.editImage', {pageId, mediaUrl}));
  dispatch(
    patchPage({
      pageId,
      patch: () => ({
        media: {type: 'image', url: mediaUrl},
      }),
    }),
  );
};

export const followPage = ({
  pageId,
  pageName,
  themes,
  originType,
  contextEntityId,
}) => async (dispatch, getState) => {
  const {auth} = getState();
  const userId = auth.user.id;

  await dispatch(apiCommand('pages.addFollowers', {pageId, userIds: [userId]}));

  analytics.actionEvents
    .followPage({pageId, pageName, themes, originType})
    .dispatch();
  dispatch(dispatchPageFollowPatch({pageId, contextEntityId}));
};

const dispatchPageFollowPatch = ({pageId, contextEntityId}) => (
  dispatch,
  getState,
) => {
  const {groups} = getState();

  dispatch(
    patchPage({
      contextEntityId,
      pageId,
      patch: ({page}) => ({
        followed: true,
        totalFollowed: page.totalFollowed + 1,
      }),
    }),
  );
  const groupsHighlightedEntities = get(
    groups,
    `highlightedEntities[${contextEntityId}].data`,
    [],
  );

  if (groupsHighlightedEntities.length) {
    dispatch(groupsHighlightedFollowPage({pageId, contextEntityId}));
  }
};

export const followPages = ({pageIds, originType, contextEntityId}) => async (
  dispatch,
  getState,
) => {
  const {auth} = getState();
  const userId = auth.user.id;

  await dispatch(apiCommand('pages.followMany', {pageIds, userId}));
  pageIds.forEach((pageId) => {
    analytics.actionEvents.followPage({pageId, originType}).dispatch();
    dispatch(dispatchPageFollowPatch({pageId, contextEntityId}));
  });
};

export const addFollowersToPage = ({pageId, userIds}) => async (dispatch) => {
  await dispatch(apiCommand('pages.addFollowers', {pageId, userIds}));
};

export const unfollowPage = ({pageId, contextEntityId}) => async (dispatch) => {
  await dispatch(apiCommand('pages.unfollow', {pageId}));
  analytics.actionEvents.unFollowPage().dispatch();
  dispatch(
    patchPage({
      contextEntityId,
      pageId,
      patch: ({page}) => ({
        followed: false,
        totalFollowed: page.totalFollowed - 1,
      }),
    }),
  );
};

export const claimPage = ({pageId, claimerText}) => async (
  dispatch,
  getState,
) => {
  await dispatch(apiCommand('pages.claim', {pageId, claimerText}));
  dispatch(
    patchPage({
      pageId,
      patch: () => ({
        claimedBy: getState().auth.user.id,
      }),
    }),
  );
};

export const deleteReview = ({pageId, reviewId, entityType, listId}) => (
  dispatch,
) => {
  if (entityType === entityTypes.POST) {
    dispatch(deletePost({postId: reviewId}));
  } else {
    dispatch(deleteListItem({listId, listItemId: reviewId}));
  }
  dispatch({type: DELETE_REVIEW, payload: {pageId, reviewId}});
};

export const getSuggestedPagesTags = () => (dispatch) =>
  dispatch(
    apiQuery({
      reducerStatePath: 'pages.suggestedPagesTags',
      query: {domain: 'pages', key: 'getSuggestedPagesTags'},
    }),
  );

export const resetSuggestedPages = () => ({
  type: RESET_SUGGESTED_PAGES,
});

export const getOwnedPages = ({userId}) => (dispatch) =>
  dispatch(
    apiQuery({
      reducerStatePath: 'pages.owned',
      query: {domain: 'pages', key: 'getOwned', params: {userId}},
    }),
  );
