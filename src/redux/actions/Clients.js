import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  GET_CLIENTS,
  NEW_CLIENT,
  DELETE_CLIENT,
  UPDATE_CLIENT,
} from '../../shared/constants/ActionTypes';
import API from '@aws-amplify/api';

export const onGetClients = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/clients/list', {body: payload})
      .then((data) => {
        console.log('onGetClients resultado', data);
        dispatch({type: GET_CLIENTS, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('onGetClients error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const newClient = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/clients/register', {body: payload})
      .then((data) => {
        console.log('newCLient resultado', data);
        dispatch({type: NEW_CLIENT, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('newCLient error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const deleteClient = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/clients/delete', {body: payload})
      .then((data) => {
        console.log('deleteClient resultado', data);
        dispatch({type: DELETE_CLIENT, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('deleteClient error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const updateClient = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/clients/update', {body: payload})
      .then((data) => {
        console.log('updateClient resultado', data);
        dispatch({type: UPDATE_CLIENT, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('updateClient error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
