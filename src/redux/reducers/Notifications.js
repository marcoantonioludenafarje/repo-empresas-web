import {
  GET_NOTIFICATIONS,
  FETCH_SUCCESS,
  FETCH_ERROR,
  SUBSCRIPTION_STATE,
  UPDATE_NOTIFICATION_LIST,
  UPDATE_NOTIFICATION_TO_SEEN,
  UPDATE_ONE_OF_THE_LIST_NOTIFICATION,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  list: [],
  getNotificationsRes: [],
  subscriptionStateRes: false,
  updateNotificationListRes: false,
  updateNotificationToSeenRes: '',
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
        getNotificationsRes: state.getNotificationsRes.concat(action.payload),
      };
    case UPDATE_NOTIFICATION_TO_SEEN:
      console.log(
        'data de reducer UPDATE_NOTIFICATION_TO_SEEN',
        action.payload,
      );
      return {
        ...state,
        updateNotificationToSeenRes: action.payload,
      };
    case UPDATE_ONE_OF_THE_LIST_NOTIFICATION:
      console.log(
        'data de reducer UPDATE_ONE_OF_THE_LIST_NOTIFICATION',
        action.payload,
      );
      const newNotifications = state.getNotificationsRes.map((obj) => {
        if (
          obj.notificationId == action.payload.request.payload.notificationId
        ) {
          if (obj.seenBy) {
            obj.seenBy.push(action.payload.request.payload.userId);
          } else {
            obj.seenBy = [action.payload.request.payload.userId];
          }
        }
        return obj;
      });
      console.log('newNotifications', newNotifications);
      return {
        ...state,
        getNotificationsRes: newNotifications,
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
