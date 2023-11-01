import {
  FETCH_START,
  FETCH_SUCCESS,
  FETCH_ERROR,
  CREATE_ATTENTION,
  LIST_ATTENTION,
  EDIT_ATTENTION,
  DELETE_ATTENTION,
} from '../../shared/constants/ActionTypes';

import API from '@aws-amplify/api';

export const newAttention = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'CREATE_ATTENTION'}});
    API.post('tunexo', '/business/attention/register', {body: payload})
      .then((data) => {
        console.log('Nueva atención resultado', data);
        dispatch({type: CREATE_ATTENTION, payload: data.response.payload});
        dispatch({
          type: FETCH_SUCCESS,
          payload: 'Se ha registrado la atención correctamente',
        });
      })
      .catch((error) => {
        console.log('Nueva ATENCION error', error);
        dispatch({type: FETCH_ERROR, payload: 'Error al crear la atención'});
      });
  };
};

export const getAttention = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'LIST_ATTENTION'}});

    API.post('tunexo', '/business/attention/list', {body: payload})
      .then((data) => {
        console.log('get ATENCIONS resultado', data);
        dispatch({
          type: LIST_ATTENTION,
          payload: data.response.payload,
          request: payload,
        });
        dispatch({
          type: FETCH_SUCCESS,
          payload: 'Listado de ATENCIONs exitoso',
        });
      })
      .catch((error) => {
        console.log('ATENCIONs error', error);

        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};

export const updateAttention = (payload) => {
  return async (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'EDIT_ATTENTION'}});
    try {
      const data = await API.post('tunexo', '/business/attention/update', {
        body: payload,
      });
      console.log('ATENCION action data update', data);
      dispatch({type: EDIT_ATTENTION, payload: data.response.payload});
      dispatch({type: FETCH_SUCCESS, payload: 'success'});
    } catch (error) {
      console.log('Update error ATENCION', data);
      dispatch({type: FETCH_ERROR, payload: 'error'});
    }
  };
};

export const deleteAttention = (payload) => {
  return async (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'DELETE_ATTENTION'}});
    try {
      const data = await API.post('tunexo', '/business/attention/delete', {
        body: payload,
      });
      console.log('se borro la ATENCION', data);
      dispatch({
        type: DELETE_ATTENTION,
        payload: data.response.payload,
        request: payload,
      });
      dispatch({
        type: FETCH_SUCCESS,
        payload: 'ATENCION eliminada exitosamente',
      });
    } catch (error) {
      console.log('Error al borrar', error);
      dispatch({
        type: FETCH_ERROR,
        payload: 'Error al borrar',
      });
    }
  };
};
