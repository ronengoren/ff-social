import * as actions from './actions';

const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.API_COMMAND_REQUEST:
      return {
        ...state,
        [action.payload.command]: 'processing'
      };

    case actions.API_COMMAND_SUCCESS:
      return {
        ...state,
        [action.payload.command]: 'succeed'
      };

    case actions.API_COMMAND_FAILURE:
      return {
        ...state,
        [action.payload.command]: 'failed'
      };

    default:
      return state;
  }
};

export default reducer;
