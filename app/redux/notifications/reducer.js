import * as actions from './actions';

const initialState = {
  unseenNotifications: 0,
  data: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.MARK_AS_READ: {
      const index = state.data.findIndex((notification) => notification.id === action.payload.id);

      return {
        ...state,
        data: [
          ...state.data.slice(0, index),
          {
            ...state.data[index],
            isRead: true
          },
          ...state.data.slice(index + 1)
        ]
      };
    }
    case actions.MARK_ALL_AS_SEEN:
      return {
        ...state,
        data: state.data.map((item) => ({
          ...item,
          isSeen: true
        })),
        unseenNotifications: 0
      };
    case actions.UPDATE_UNSEEN_NOTIFICATIONS:
      return {
        ...state,
        unseenNotifications: action.payload.unseenNotifications
      };
    default:
      return state;
  }
};

export default reducer;
