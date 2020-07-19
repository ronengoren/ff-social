import {apiQuery} from '../apiQuery/actions';
import {apiCommand} from '../apiCommands/actions';
import {analytics} from '../../infra/reporting';
import {entityTypes, activationTypes} from '../../vars/enums';
import {omit} from '../../infra/utils';

export const LIST_CREATE = 'LIST_CREATE';
export const LIST_DELETE = 'LIST_DELETE';
export const LIST_UPDATE = 'LIST_UPDATE';
export const RESET_LIST_ITEMS_AND_TOTALS = 'RESET_LIST_ITEMS_AND_TOTALS';

export const LIST_LOADED = 'LIST_LOADED';
export const LIST_ITEM_LOADED = 'LIST_ITEM_LOADED';
export const LIST_FILTER_RESET = 'LIST_FILTER_RESET';

export const LIST_ITEM_VOTE = 'LIST_ITEM_VOTE';
export const LIST_ITEM_UNVOTE = 'LIST_ITEM_UNVOTE';

export const LIST_ADDED_ITEM = 'LIST_ADDED_ITEM';
export const LIST_ITEM_EDIT = 'LIST_ITEM_EDIT';
export const LIST_ITEM_DELETE = 'LIST_ITEM_DELETE';

const getItemForSubmit = ({
  listId,
  listItemId,
  title,
  description,
  mediaUrl,
  scrapedUrlId,
  pageId,
  isAddressGooglePlaceId,
  googlePlaceId,
  publisherId,
  publisherType,
  isUserMedia,
  tags,
  phoneNumber,
  filterByCommunityId,
}) => {
  // In case the user chose an item from google places / our pages, and didn't changed it's default image, we shouldn't sent the image to BE
  if ((pageId || googlePlaceId || scrapedUrlId) && !isUserMedia) {
    return {
      listId,
      listItemId,
      title,
      description,
      scrapedUrlId,
      pageId,
      isAddressGooglePlaceId,
      googlePlaceId,
      publisherId,
      publisherType,
      tags,
      phoneNumber,
      filterByCommunityId,
    };
  }
  return {
    listId,
    listItemId,
    title,
    description,
    mediaUrl,
    scrapedUrlId,
    pageId,
    isAddressGooglePlaceId,
    googlePlaceId,
    publisherId,
    publisherType,
    tags,
    phoneNumber,
    filterByCommunityId,
  };
};

export const createList = ({list, screenName}) => async (dispatch) => {
  try {
    const itemsForSubmit = list.items && list.items.map(getItemForSubmit);

    const res = await dispatch(
      apiCommand('lists.create', {...list, items: itemsForSubmit}),
    );
    const listResponse = res.data.data;
    dispatch({type: LIST_CREATE, payload: listResponse});

    analytics.actionEvents
      .postCreation({
        success: true,
        postId: listResponse.id,
        postType: entityTypes.LIST,
        postCreatorId: listResponse.creator.id,
        postCreatorName: listResponse.creator.name,
        contextId: list.contextId,
        contextType: list.contextType,
        numberOfChars: list.description.length,
        creatorEntityType: listResponse.creator.type,
        screenName,
        entityId: listResponse.id,
        tags: list.tags,
      })
      .dispatch();

    return listResponse;
  } catch (err) {
    analytics.actionEvents
      .postCreation({
        success: false,
        failureReason: err.toString(),
      })
      .dispatch();

    throw err;
  }
};

export const updateList = ({listId, delta}) => async (dispatch) => {
  await dispatch(apiCommand('lists.edit', {listId, ...delta}));
  dispatch({type: LIST_UPDATE, payload: {listId, delta}});
};

export const getList = ({
  listId,
  location,
  sortBy,
  filterByCommunityId,
  withoutItems = true,
}) => async (dispatch) => {
  const listWithoutItems = (list) => omit(list, 'items');
  const res = await dispatch(
    apiQuery({
      query: {
        domain: 'lists',
        key: 'getList',
        params: {listId, location, sortBy, filterByCommunityId, withoutItems},
      },
    }),
  );
  const {
    data: {data: list},
  } = res;

  dispatch({
    type: LIST_LOADED,
    payload: listWithoutItems(list),
  });
  return list;
};

export const getCommunitiesTotalItems = ({listId}) => async (dispatch) => {
  const res = await dispatch(
    apiQuery({
      query: {
        domain: 'lists',
        key: 'getCommunitiesTotalItems',
        params: {listId},
      },
    }),
  );
  return res.data.data;
};

export const deleteList = ({listId}) => async (dispatch) => {
  await dispatch(apiCommand('lists.delete', {listId}));
  const payload = {
    listId,
  };
  dispatch({type: LIST_DELETE, payload});
};

export const getListItem = ({listItemId}) => async (dispatch) => {
  const res = await dispatch(
    apiQuery({
      query: {domain: 'lists', key: 'getListItem', params: {listItemId}},
    }),
  );
  dispatch({type: LIST_ITEM_LOADED, payload: res.data.data});
};

export const resetListItemsAndTotals = ({listId}) => async (dispatch) => {
  dispatch({type: RESET_LIST_ITEMS_AND_TOTALS, payload: {listId}});
};

export const toggleListItemVote = ({
  listId,
  listItemId,
  voteAction,
  voter,
  sortByVotes = true,
  screenName,
  listViewType,
}) => async (dispatch) => {
  const command = voteAction ? 'lists.vote' : 'lists.unVote';
  await dispatch(apiCommand(command, {listId, listItemId}));
  await dispatch({
    type: voteAction ? LIST_ITEM_VOTE : LIST_ITEM_UNVOTE,
    payload: {
      listId,
      listItemId,
      voted: voteAction,
      voter,
      sortByVotes,
    },
  });

  const analyticsAction = voteAction
    ? analytics.actionEvents.voteAction
    : analytics.actionEvents.unVoteAction;

  analyticsAction({
    actorId: voter.id,
    actorName: voter.name,
    screenName,
    listId,
    listItemId,
    listViewType,
  }).dispatch();
};

export const addItemToList = ({data, analyticsData, isActivation}) => async (
  dispatch,
) => {
  const {
    listId,
    title,
    description,
    mediaUrl,
    scrapedUrlId,
    pageId,
    isAddressGooglePlaceId,
    googlePlaceId,
    publisherId,
    publisherType,
    isUserMedia,
    phoneNumber,
    tags,
    filterByCommunityId,
  } = data;
  const itemForSubmit = getItemForSubmit({
    listId,
    title,
    description,
    mediaUrl,
    scrapedUrlId,
    pageId,
    isAddressGooglePlaceId,
    googlePlaceId,
    publisherId,
    publisherType,
    isUserMedia,
    phoneNumber,
    tags,
    filterByCommunityId,
  });

  const res = await dispatch(
    apiCommand('lists.addItemToList', {...itemForSubmit, description}),
  );
  const newItem = res.data.data;

  const {isPassive, listName, pageName, creatorName, creatorId} = analyticsData;
  analytics.actionEvents
    .listItemCreation({
      isPassive,
      listName,
      listId,
      pageId,
      pageName,
      creatorName,
      creatorId,
      ...(isActivation && {componentName: activationTypes.ACTION}),
    })
    .dispatch();

  dispatch({
    type: LIST_ADDED_ITEM,
    payload: {
      listId,
      newItem,
    },
  });

  return newItem;
};

export const editListItem = ({
  listId,
  listItemId,
  title,
  description,
  mediaUrl,
  scrapedUrlId,
  pageId,
  googlePlaceId,
  publisherId,
  publisherType,
  isUserMedia,
}) => async (dispatch) => {
  const itemForSubmit = getItemForSubmit({
    listId,
    listItemId,
    title,
    description,
    mediaUrl,
    scrapedUrlId,
    pageId,
    googlePlaceId,
    publisherId,
    publisherType,
    isUserMedia,
  });

  const res = await dispatch(
    apiCommand('lists.editListItem', {...itemForSubmit, description}),
  );
  dispatch({
    type: LIST_ITEM_EDIT,
    payload: {
      listId,
      listItemId,
      editedItem: res.data.data,
    },
  });
};

export const deleteListItem = ({
  listId,
  listItemId,
  filterByCommunityId,
}) => async (dispatch) => {
  const res = await dispatch(
    apiCommand('lists.deleteListItem', {
      listId,
      listItemId,
      filterByCommunityId,
    }),
  );

  dispatch({
    type: LIST_ITEM_DELETE,
    payload: {
      listId,
      listItemId,
      data: res.data.data,
    },
  });
};
