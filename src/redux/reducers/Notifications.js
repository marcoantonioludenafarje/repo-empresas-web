import {
  GET_NOTIFICATIONS,
  FETCH_SUCCESS,
  FETCH_ERROR,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  list: [],
  listNotifications: [],
};

const notificationsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_NOTIFICATIONS:
      console.log('data de reducer GET_NOTIFICATIONS', action.payload);
      return {
        ...state,
        getNotificationsRes: action.payload,
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
