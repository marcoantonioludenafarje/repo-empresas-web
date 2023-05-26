import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  GET_PROVIDERS,
  NEW_PROVIDER,
  DELETE_PROVIDER,
  UPDATE_PROVIDER,
} from '../../shared/constants/ActionTypes';
import API from '@aws-amplify/api';

export const onGetProviders = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'GET_PROVIDERS'}});
    API.post('tunexo', '/inventory/providers/list', {body: payload})
      .then((data) => {
        console.log('onGetProviders resultado', data);
        dispatch({
          type: GET_PROVIDERS,
          payload: data.response.payload,
          request: payload,
        });
        dispatch({
          type: FETCH_SUCCESS,
          process: 'GET_PROVIDERS',
          message: 'Listado de proveedores exitoso',
        });
      })
      .catch((error) => {
        console.log('onGetProviders error', error);
        dispatch({
          type: FETCH_ERROR,
          process: 'GET_PROVIDERS',
          message: 'Hubo un error durante el listado de proveedores',
        });
      });
  };
};
export const newProvider = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/providers/register', {body: payload})
      .then((data) => {
        console.log('newProvider resultado', data);
        dispatch({type: NEW_PROVIDER, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('newProvider error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const deleteProvider = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/providers/delete', {body: payload})
      .then((data) => {
        console.log('deleteProvider resultado', data);
        dispatch({type: DELETE_PROVIDER, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('deleteProvider error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const updateProvider = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/providers/update', {body: payload})
      .then((data) => {
        console.log('updateProvider resultado', data);
        dispatch({type: UPDATE_PROVIDER, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('updateProvider error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
