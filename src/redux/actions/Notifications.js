import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  GET_NOTIFICATIONS,
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
