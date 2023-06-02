import {
  GET_NOTIFICATIONS,
  FETCH_SUCCESS,
  FETCH_ERROR,
  SUBSCRIPTION_STATE,
  UPDATE_NOTIFICATION_LIST,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  list: [],
  listNotifications: [],
  subscriptionStateRes: false,
  updateNotificationListRes: false,
};

const notificationsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_NOTIFICATIONS:
      console.log('data de reducer GET_NOTIFICATIONS', action.payload);
      return {
        ...state,
        getNotificationsRes: action.payload,
      };
    case SUBSCRIPTION_STATE:
      console.log('data de reducer SUBSCRIPTION_STATE', action.payload);
      return {
        ...state,
        subscriptionStateRes: action.payload,
      };
    case UPDATE_NOTIFICATION_LIST:
      console.log('data de reducer UPDATE_NOTIFICATION_LIST', action.payload);
      return {
        ...state,
        updateNotificationListRes: action.payload,
      };
    case FETCH_SUCCESS:
      console.log('data de reducer FETCH_SUCCESS', action.payload);
      return {
        ...state,
        successMessage: action.payload,
      };
    case FETCH_ERROR:
      console.log('data de reducer FETCH_ERROR', action.payload);
      return {
        ...state,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
};

export default notificationsReducer;
