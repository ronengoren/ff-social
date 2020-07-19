/* eslint-disable no-param-reassign */
import produce from 'immer';
import * as actions from './actions';

const initialState = {
  isOnline: true,
  snackbars: {},
  selectedCommunity: {},
  selectedContextCountryCode: [],
  actionSheet: null,
  showFriendRequestLimitModal: false,
  showCommunityRoleModal: false,
  showAnnotationsModal: false,
  annotations: {}
};

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case actions.CONNECTION_CHANGED:
        draft.isOnline = action.payload.online;
        break;
      case actions.SHOW_SNACKBAR: {
        draft.snackbars[action.payload.snackbarType] = {
          isVisible: true,
          componentProps: action.payload.componentProps
        };
        break;
      }
      case actions.HIDE_SNACKBAR: {
        const { snackbarType } = action.payload;
        draft.snackbars[snackbarType].isVisible = false;
        break;
      }
      case actions.SET_SELECTED_COMMUNITY: {
        draft.selectedCommunity = action.payload.selectedCommunity;
        break;
      }
      case actions.RESET_SELECTED_COMMUNITY: {
        draft.selectedCommunity = {};
        break;
      }
      case actions.SET_SELECTED_CONTEXT_COUNTRY_CODE: {
        draft.selectedContextCountryCode = action.payload.selectedContextCountryCode;
        break;
      }
      case actions.RESET_SELECTED_CONTEXT_COUNTRY_CODE: {
        draft.selectedContextCountryCode = [];
        break;
      }
      case actions.OPEN_ACTION_SHEET:
        draft.actionSheet = action.payload.data;
        break;
      case actions.CLOSE_ACTION_SHEET:
        draft.actionSheet = null;
        break;
      case actions.SHOW_FRIEND_REQUEST_LIMIT_MODAL:
        draft.showFriendRequestLimitModal = true;
        break;
      case actions.CLOSE_FRIEND_REQUEST_LIMIT_MODAL:
        draft.showFriendRequestLimitModal = false;
        break;
      case actions.SHOW_COMMUNITY_ROLE_MODAL:
        draft.showCommunityRoleModal = true;
        draft.communityRoleModalType = action.payload.type;
        draft.badgeOriginalType = action.payload.badgeOriginalType;
        break;
      case actions.CLOSE_COMMUNITY_ROLE_MODAL:
        draft.showCommunityRoleModal = false;
        draft.communityRoleModalType = null;
        draft.badgeOriginalType = null;
        break;
      case actions.SHOW_TOP_LEVEL_MODAL:
        draft.showAnnotationsModal = true;
        draft.annotationsModalProps = action.payload.annotationsModalProps;
        break;
      case actions.CLOSE_TOP_LEVEL_MODAL:
        draft.showAnnotationsModal = false;
        draft.annotationsModalProps = null;
        break;
      case actions.UPDATE_ANNOTATIONS: {
        const annotations = state.annotations || {};
        draft.annotations = { ...annotations, ...action.payload.changes };
        break;
      }
      default:
    }
  });

export default reducer;
