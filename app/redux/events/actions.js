import {apiCommand} from '../apiCommands/actions';
import {apiQuery} from '../apiQuery/actions';
import {updateSharedEventPostRSVP} from '../feed/actions';
import {setRSVP as setGroupEventRSVP} from '../groups/actions';
import {analytics} from '../../infra/reporting';
import {getKeyByValue, get} from '../../infra/utils';
import {eventPrivacyTypes, activationTypes} from '../../vars/enums';

export const EVENT_CREATE = 'EVENT_CREATE';
export const EVENT_LOADED = 'EVENT_LOADED';
export const EVENT_EDIT = 'EVENT_EDIT';
export const EVENT_SET_RSVP = 'EVENT_SET_RSVP';
export const EVENT_INVITE_GUESTS = 'EVENT_INVITE_GUESTS';
export const EVENT_UPDATE_FRIENDSHIP_STATUS = 'EVENT_UPDATE_FRIENDSHIP_STATUS';
export const EVENT_DELETE = 'EVENT_DELETE';
export const EVENT_RESET_SUGGESTED_EVENTS = 'EVENT_RESET_SUGGESTED_EVENTS';
export const EVENT_RESET_MY_EVENTS = 'EVENT_RESET_MY_EVENTS';
export const EVENT_CLEAR_INVITEES = 'EVENT_CLEAR_INVITEES';

export const createEvent = ({
  mediaUrl,
  name,
  website,
  startTime,
  endTime,
  privacyType,
  description,
  tags,
  googleId,
  hostEntityId,
  hostEntityType,
  contextId,
  contextType,
  creator,
  contextCountryCode,
  hostType,
  isActivation,
}) => async (dispatch) => {
  try {
    const res = await dispatch(
      apiCommand('events.create', {
        mediaUrl,
        name,
        website,
        startTime,
        endTime,
        privacyType,
        description,
        tags,
        googleId,
        hostEntityId,
        hostEntityType,
        contextId,
        contextType,
        contextCountryCode,
        hostType,
      }),
    );
    const event = res.data.data;
    event.invitees = [creator];

    analytics.actionEvents
      .eventCreation({
        ...(isActivation && {componentName: activationTypes.ACTION}),
        eventId: event.id,
        eventName: event.name,
        tags: event.tags.join(', '),
        privacyType: getKeyByValue(eventPrivacyTypes, event.privacyType),
        date: event.startTime.toString(),
      })
      .dispatch();

    dispatch({type: EVENT_CREATE, payload: {event}});
    return res;
  } catch (err) {
    // TODO: add analytics
    throw err;
  }
};

export const editEvent = ({
  eventId,
  name,
  website,
  startTime,
  endTime,
  googleId,
  tags,
  description,
  privacyType,
  host,
  contextCountryCode,
  hostType,
}) => async (dispatch) => {
  const event = await dispatch(
    apiCommand('events.edit', {
      eventId,
      name,
      website,
      startTime,
      endTime,
      googleId,
      tags,
      description,
      privacyType,
      hostEntityId: host.id,
      hostEntityType: host.entityType,
      contextCountryCode,
      hostType,
    }),
  );

  const {address} = get(event, 'data.data', {});

  dispatch({
    type: EVENT_EDIT,
    payload: {
      eventId,
      patch: {
        address,
        googlePlaceId: googleId,
        name,
        website,
        startTime,
        endTime,
        tags,
        description,
        privacyType,
        hosts: [host],
        contextCountryCode,
        hostType,
      },
    },
  });
};

export const editImages = ({eventId, mediaUrl}) => async (dispatch) => {
  await dispatch(apiCommand('events.editImage', {eventId, mediaUrl}));
  dispatch({
    type: EVENT_EDIT,
    payload: {eventId, patch: {media: {type: 'image', url: mediaUrl}}},
  });
};

export const getEvent = ({eventId}) => async (dispatch) => {
  const res = await dispatch(
    apiQuery({query: {domain: 'events', key: 'getEvent', params: {eventId}}}),
  );
  const {data} = res.data;
  const payload = {
    event: data,
  };
  dispatch({type: EVENT_LOADED, payload});
  return data;
};

export const getSuggestedEventsTags = () => (dispatch) =>
  dispatch(
    apiQuery({
      reducerStatePath: 'events.suggestedEventsTags',
      query: {domain: 'events', key: 'getSuggestedEventsTags'},
    }),
  );

export const setRSVP = ({
  eventId,
  rsvpStatus,
  oldRSVP,
  tags,
  sharedPost = false,
  postId,
  contextEntityId,
}) => async (dispatch, getState) => {
  const res = await dispatch(
    apiCommand('events.setRSVP', {eventId, rsvpStatus}),
  );
  const rsvpCounts = get(res, 'data.data.rsvpCounts', {});
  dispatch({
    type: EVENT_SET_RSVP,
    payload: {eventId, rsvpStatus, oldRSVP, rsvpCounts, tags},
  });
  if (sharedPost) {
    const invitees = get(res, 'data.data.invitees', {});
    dispatch(
      updateSharedEventPostRSVP({
        postId,
        eventId,
        contextEntityId,
        rsvpStatus,
        rsvpCounts,
        invitees,
      }),
    );
  }
  const state = getState();
  const groupsHighlightedEntities = get(
    state,
    `groups.highlightedEntities[${contextEntityId}].data`,
    [],
  );
  if (groupsHighlightedEntities.length) {
    dispatch(setGroupEventRSVP({eventId, rsvpStatus, contextEntityId}));
  }
};

export const inviteGuests = ({eventId, inviteesIds, invitees}) => async (
  dispatch,
) => {
  await dispatch(apiCommand('events.addInvitees', {eventId, inviteesIds}));
  dispatch({
    type: EVENT_INVITE_GUESTS,
    payload: {
      eventId,
      invitees,
    },
  });
};

export const updateFriendshipStatus = ({
  friendId,
  friendshipStatus,
  listType,
}) => ({
  type: EVENT_UPDATE_FRIENDSHIP_STATUS,
  payload: {friendId, friendshipStatus, listType},
});

export const deleteEvent = ({eventId}) => async (dispatch) => {
  await dispatch(apiCommand('events.delete', {eventId}));
  dispatch({type: EVENT_DELETE, payload: {eventId}});
};

export const resetSuggestedEvents = () => ({
  type: EVENT_RESET_SUGGESTED_EVENTS,
});

export const resetMyEvents = () => ({
  type: EVENT_RESET_MY_EVENTS,
});

export const clearInvitees = () => ({
  type: EVENT_CLEAR_INVITEES,
});
