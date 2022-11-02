import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  NEW_REQUEST,
} from '../../shared/constants/ActionTypes';
import API from '@aws-amplify/api';

export const newRequest = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/business/ticket/register', {body: payload})
      .then((data) => {
        console.log('newRequest resultado', data);
        dispatch({type: NEW_REQUEST, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('newRequest error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
