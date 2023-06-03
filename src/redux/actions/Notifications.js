import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  GET_NOTIFICATIONS,
  UPDATE_NOTIFICATION_TO_SEEN,
  UPDATE_ONE_OF_THE_LIST_NOTIFICATION,
} from '../../shared/constants/ActionTypes';
import API from '@aws-amplify/api';

export const getNotifications = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/business/notification/all/get', {body: payload})
      .then((data) => {
        console.log('getNotifications resultado', data);
        dispatch({type: GET_NOTIFICATIONS, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getNotifications error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};

export const updateNotificationToSeen = (payload, list) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/business/notification/update', {body: payload})
      .then((data) => {
        console.log('updateNotificationToSeen resultado', data);
        dispatch({type: UPDATE_NOTIFICATION_TO_SEEN, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('updateNotificationToSeen error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};

export const updateOneOfTheListNotification = (data) => {
  return (dispatch) => {
    dispatch({type: UPDATE_ONE_OF_THE_LIST_NOTIFICATION, payload: data});
  };
};
