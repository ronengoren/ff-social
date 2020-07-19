import {misc as miscLocalstorage} from '../../infra/localStorage';
import {analytics} from '../../infra/reporting';

export const OPEN_ACTION_SHEET = 'OPEN_ACTION_SHEET';
export const CLOSE_ACTION_SHEET = 'CLOSE_ACTION_SHEET';

export const CONNECTION_CHANGED = 'CONNECTION_CHANGED';

export const SHOW_SNACKBAR = 'SHOW_SNACKBAR';
export const HIDE_SNACKBAR = 'HIDE_SNACKBAR';

export const SET_SELECTED_COMMUNITY = 'SET_SELECTED_COMMUNITY';
export const RESET_SELECTED_COMMUNITY = 'RESET_SELECTED_COMMUNITY';

export const SET_SELECTED_CONTEXT_COUNTRY_CODE =
  'SET_SELECTED_CONTEXT_COUNTRY_CODE';
export const RESET_SELECTED_CONTEXT_COUNTRY_CODE =
  'RESET_SELECTED_CONTEXT_COUNTRY_CODE';

export const SHOW_FRIEND_REQUEST_LIMIT_MODAL =
  'SHOW_FRIEND_REQUEST_LIMIT_MODAL';
export const CLOSE_FRIEND_REQUEST_LIMIT_MODAL =
  'CLOSE_FRIEND_REQUEST_LIMIT_MODAL';
export const SHOW_TOP_LEVEL_MODAL = 'SHOW_TOP_LEVEL_MODAL';
export const CLOSE_TOP_LEVEL_MODAL = 'CLOSE_TOP_LEVEL_MODAL';

export const UPDATE_ANNOTATIONS = 'UPDATE_ANNOTATIONS';

export const SHOW_COMMUNITY_ROLE_MODAL = 'SHOW_COMMUNITY_ROLE_MODAL';
export const CLOSE_COMMUNITY_ROLE_MODAL = 'CLOSE_COMMUNITY_ROLE_MODAL';

export const openActionSheet = (data) => ({
  type: OPEN_ACTION_SHEET,
  payload: {
    data,
  },
});

export const closeActionSheet = () => ({
  type: CLOSE_ACTION_SHEET,
});

export const setConnection = ({online}) => (dispatch) => {
  dispatch({
    type: CONNECTION_CHANGED,
    payload: {online},
  });
};

export const showSnackbar = ({snackbarType, ...componentProps}, options) => (
  dispatch,
) => {
  dispatch({
    type: SHOW_SNACKBAR,
    payload: {
      snackbarType,
      componentProps,
    },
  });

  if (options) {
    const {dismissAfter} = options;
    if (dismissAfter) {
      setTimeout(() => {
        dispatch(hideSnackbar({snackbarType}));
      }, dismissAfter);
    }
  }
};

export const hideSnackbar = ({snackbarType}) => ({
  type: HIDE_SNACKBAR,
  payload: {
    snackbarType,
  },
});

export const setSelectedCommunity = (selectedCommunity) => ({
  type: SET_SELECTED_COMMUNITY,
  payload: {
    selectedCommunity,
  },
});

export const resetSelectedCommunity = () => ({
  type: RESET_SELECTED_COMMUNITY,
  payload: {},
});

export const setSelectedCountry = (selectedContextCountryCode) => ({
  type: SET_SELECTED_CONTEXT_COUNTRY_CODE,
  payload: {
    selectedContextCountryCode,
  },
});

export const resetSelectedCountry = () => ({
  type: RESET_SELECTED_CONTEXT_COUNTRY_CODE,
  payload: {},
});

export const showFriendRequestLimitModal = () => ({
  type: SHOW_FRIEND_REQUEST_LIMIT_MODAL,
  payload: {},
});

export const closeFriendRequestLimitModal = () => ({
  type: CLOSE_FRIEND_REQUEST_LIMIT_MODAL,
  payload: {},
});

export const showCommunityRoleModal = ({type, badgeOriginalType}) => ({
  type: SHOW_COMMUNITY_ROLE_MODAL,
  payload: {
    type,
    badgeOriginalType,
  },
});

export const closeCommunityRoleModal = () => ({
  type: CLOSE_COMMUNITY_ROLE_MODAL,
});

export const showAnnotationsModal = ({
  screenName,
  origin,
  annotationType,
  ...annotationsModalProps
}) => {
  analytics.viewEvents
    .annotationView({screenName, origin, annotationType})
    .dispatch();
  return {
    type: SHOW_TOP_LEVEL_MODAL,
    payload: {annotationsModalProps},
  };
};

export const closeAnnotationsModal = () => ({
  type: CLOSE_TOP_LEVEL_MODAL,
  payload: {},
});

export const updateAnnotations = (changes) => {
  miscLocalstorage.updateAnnotations(changes);
  return {
    type: UPDATE_ANNOTATIONS,
    payload: {changes},
  };
};
