import {apiQuery} from '../apiQuery/actions';
import {apiCommand} from '../apiCommands/actions';
import {groupRoleTypes, groupPrivacyType, groupType} from '../../vars/enums';
import {analytics} from '../../infra/reporting';
import {getKeyByValue} from '../../infra/utils';
import {joinArrayToString} from '../../infra/utils/stringUtils';

export const GROUP_CREATE = 'GROUP_CREATE';
export const GROUP_LOADED = 'GROUP_LOADED';
export const GROUP_PATCH_IMAGE = 'GROUP_PATCH_IMAGE';
export const GROUP_EDIT = 'GROUP_EDIT';
export const GROUP_DELETE = 'GROUP_DELETE';
export const GROUP_JOIN_OR_LEAVE = 'GROUP_JOIN_OR_LEAVE';
export const GROUP_PATCH = 'GROUP_PATCH';
export const GROUP_RESET_SUGGESTED_GROUPS = 'GROUP_RESET_SUGGESTED_GROUPS';

export const GROUP_HIGHLIGHT_ITEM = 'GROUP_HIGHLIGHT_ITEM';
export const GROUP_DEHIGHLIGHTED_ITEM = 'GROUP_DEHIGHLIGHTED_ITEM';

export const EVENT_SET_RSVP = 'GROUP/EVENT_SET_RSVP';
export const UPDATE_POST = 'GROUP/UPDATE_POST';
export const FOLLOW_PAGE = 'GROUP/FOLLOW_PAGE';

export const createGroup = ({
  name,
  description,
  tags,
  privacyType,
  mediaUrl,
  membersIds,
  contextCountryCode,
}) => async (dispatch) => {
  try {
    const res = await dispatch(
      apiCommand('groups.create', {
        name,
        privacyType,
        description,
        tags,
        mediaUrl,
        membersIds,
        contextCountryCode,
      }),
    );
    const group = res.data.data;
    dispatch({type: GROUP_CREATE, payload: {group}});

    analytics.actionEvents
      .groupCreation({
        success: true,
        groupId: group.id,
        groupName: group.name,
        category: joinArrayToString(group.tags),
        totalMembers: group.membersCount,
        containsMedia: !!mediaUrl,
        privacyType: group.privacyType,
        contextCountryCode,
      })
      .dispatch();

    return res;
  } catch (err) {
    analytics.actionEvents
      .groupCreation({
        success: false,
        failureReason: err.toString(),
      })
      .dispatch();

    throw err;
  }
};

export const getGroup = ({groupId}) => async (dispatch) => {
  const res = await dispatch(
    apiQuery({query: {domain: 'groups', key: 'getGroup', params: {groupId}}}),
  );
  const {data} = res;
  const payload = {
    group: data.data,
  };
  dispatch({type: GROUP_LOADED, payload});
  return data.data;
};

export const editImages = ({groupId, mediaUrl}) => async (dispatch) => {
  const res = await dispatch(
    apiCommand('groups.editImage', {groupId, mediaUrl}),
  );
  const {
    data: {
      data: {
        media: {thumbnail},
      },
    },
  } = res;
  dispatch({
    type: GROUP_PATCH_IMAGE,
    payload: {groupId, media: {thumbnail, url: mediaUrl}},
  });
};

export const editGroup = ({
  groupId,
  name,
  tags,
  description,
  rules,
  privacyType,
  hideMemberList,
  headerItems,
  allowedPostTypes,
  contextCountryCode,
}) => async (dispatch) => {
  const res = await dispatch(
    apiCommand('groups.edit', {
      groupId,
      name,
      tags,
      description,
      rules,
      privacyType,
      hideMemberList,
      headerItems,
      allowedPostTypes,
      contextCountryCode,
    }),
  );
  const {
    data: {data},
  } = res;
  dispatch({
    type: GROUP_EDIT,
    payload: {
      groupId,
      patch: {
        name: data.name,
        tags: data.tags,
        description: data.description,
        rules: data.rules,
        privacyType: data.privacyType,
        hideMemberList: data.hideMemberList,
        headerItems: data.headerItems,
        allowedPostTypes: data.allowedPostTypes,
        contextCountryCode: data.contextCountryCode,
      },
    },
  });
};

export const joinGroup = ({
  groupId,
  groupName,
  totalMembers,
  privacyType,
  user,
  originType,
  contextEntityId,
}) => async (dispatch) => {
  const res = await dispatch(apiCommand('groups.join', {groupId}));

  analytics.actionEvents
    .joinedGroup({
      groupId,
      groupName,
      totalMembers,
      privacyType: getKeyByValue(groupPrivacyType, privacyType),
      originType,
    })
    .dispatch();

  const {id, name, themeColor, media} = user;
  const newMember = {id, name, themeColor, media};
  dispatch({
    type: GROUP_JOIN_OR_LEAVE,
    payload: {
      contextEntityId,
      groupId,
      member: newMember,
      addMember: res.data.data.members[0].memberType !== groupRoleTypes.PENDING,
      patch: {
        membersCount: res.data.data.membersCount,
        pendingCount: res.data.data.pendingCount,
        memberType: res.data.data.members[0].memberType,
      },
    },
  });
};

export const leaveGroup = ({groupId, user, contextEntityId}) => async (
  dispatch,
) => {
  const res = await dispatch(apiCommand('groups.leave', {groupId}));
  analytics.actionEvents.unJoinedGroup().dispatch();
  dispatch({
    type: GROUP_JOIN_OR_LEAVE,
    payload: {
      contextEntityId,
      groupId,
      member: user,
      removeMember: true,
      patch: {
        membersCount: res.data.data.membersCount,
        pendingCount: res.data.data.pendingCount,
        memberType: groupRoleTypes.NOT_MEMBER,
      },
    },
  });
};

export const changeMemberRole = ({groupId, memberId, memberType}) => async (
  dispatch,
) => {
  const res = await dispatch(
    apiCommand('groups.changeMembersRole', {
      groupId,
      membersIds: [memberId],
      memberType,
    }),
  );
  dispatch({
    type: GROUP_PATCH,
    payload: {
      groupId,
      data: {
        membersCount: res.data.data.membersCount,
        pendingCount: res.data.data.pendingCount,
      },
    },
  });
};

export const removeMember = ({groupId, memberId}) => async (dispatch) => {
  const res = await dispatch(
    apiCommand('groups.removeMembers', {groupId, membersIds: [memberId]}),
  );
  dispatch({
    type: GROUP_PATCH,
    payload: {
      groupId,
      data: {
        membersCount: res.data.data.membersCount,
        pendingCount: res.data.data.pendingCount,
      },
    },
  });
};

export const addMembers = ({groupId, membersIds}) => async (dispatch) => {
  await dispatch(apiCommand('groups.addMembers', {groupId, membersIds}));
};

export const deleteGroup = ({groupId}) => async (dispatch) => {
  await dispatch(apiCommand('groups.delete', {groupId}));
  dispatch({type: GROUP_DELETE, payload: {groupId}});
};

export const resetSuggestedGroups = () => ({
  type: GROUP_RESET_SUGGESTED_GROUPS,
});

export const getSuggestedGroupsTags = () => (dispatch) =>
  dispatch(
    apiQuery({
      reducerStatePath: 'groups.suggestedGroupsTags',
      query: {domain: 'groups', key: 'getSuggestedGroupsTags'},
    }),
  );

export const highlightEntity = ({
  groupId,
  entityId,
  entityType,
  entityData,
}) => (dispatch) => {
  dispatch(
    apiCommand('groups.highlightEntity', {groupId, entityId, entityType}),
  );
  dispatch({
    type: GROUP_HIGHLIGHT_ITEM,
    payload: {
      groupId,
      entityId,
      entityType,
      entityData,
    },
  });
};

export const dehighlightEntity = ({groupId, entityId, entityType}) => (
  dispatch,
) => {
  dispatch(apiCommand('groups.dehighlightEntity', {groupId, entityId}));
  dispatch({
    type: GROUP_DEHIGHLIGHTED_ITEM,
    payload: {
      groupId,
      entityId,
      entityType,
    },
  });
};

export const updatePost = ({entityId, postId, transformer}) => ({
  type: UPDATE_POST,
  payload: {entityId, postId, transformer},
});

export const setRSVP = ({eventId, rsvpStatus, contextEntityId}) => ({
  type: EVENT_SET_RSVP,
  payload: {eventId, rsvpStatus, contextEntityId},
});

export const followPage = ({pageId, contextEntityId}) => ({
  type: FOLLOW_PAGE,
  payload: {pageId, contextEntityId},
});

export const getMemberedWithGroupTypeGroup = ({userId}) => (dispatch) =>
  dispatch(
    apiQuery({
      reducerStatePath: 'groups.memberedInTypeGroup',
      query: {
        domain: 'groups',
        key: 'getMembered',
        params: {userId, groupType: groupType.GROUP},
      },
    }),
  );
