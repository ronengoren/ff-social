import {uploadStateTypes} from '../../vars/enums';
import * as actions from './actions';

const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.UPLOAD_START:
      return {
        ...state,
        [action.payload.uploadId]: {
          state: uploadStateTypes.UPLOADING,
          progress: 0,
        },
      };

    case actions.UPLOAD_PROGRESS_UPDATE:
      return {
        ...state,
        [action.payload.uploadId]: {
          ...state[action.payload.uploadId],
          progress: action.payload.value,
        },
      };

    case actions.UPLOAD_SUCCESS:
      return {
        ...state,
        [action.payload.uploadId]: {
          ...state[action.payload.uploadId],
          state: uploadStateTypes.SUCCEED,
          progress: 1,
        },
      };

    case actions.UPLOAD_CANCEL_SIGNAL:
      return {
        ...state,
        [action.payload.uploadId]: {
          ...state[action.payload.uploadId],
          state: uploadStateTypes.CANCEL_SIGNALED,
        },
      };

    case actions.UPLOAD_CANCEL:
      return {
        ...state,
        [action.payload.uploadId]: {
          ...state[action.payload.uploadId],
          state: uploadStateTypes.CANCELLED,
        },
      };

    case actions.UPLOAD_FAILURE:
      return {
        ...state,
        [action.payload.uploadId]: {
          ...state[action.payload.uploadId],
          state: uploadStateTypes.FAILED,
        },
      };

    default:
      return state;
  }
};

export default reducer;
