import * as actions from './actions';

const initialState = {
  around: {},
  hookedEntities: {
    data: []
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.UPDATE_REFERRERS_STATUS: {
      const { referrersIds, refStatus } = action.payload;
      const newReferrers = state.referrers.data.map((referrer) =>
        referrersIds.includes(referrer.id) ? { ...referrer, contextData: { ...referrer.contextData, refStatus } } : referrer
      );
      return { ...state, referrers: { ...state.referrers, data: newReferrers } };
    }

    case actions.RESET_USERS:
      return {
        ...state,
        results: {
          ...state.results,
          data: null
        }
      };

    default:
      return state;
  }
};

export default reducer;
