import {
  FETCH_START,
  FETCH_SUCCESS,
  FETCH_ERROR,
  CREATE_APPOINTMENT,
  LIST_APPOINTMENT,
  EDIT_APPOINTMENT,
  DELETE_APPOINTMENT,
} from '../../shared/constants/ActionTypes';

import API from '@aws-amplify/api';

export const newAppointment = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'CREATE_APPOINTMENT'}});
    API.post('tunexo', '/inventory/appointment/register', {body: payload})
      .then((data) => {
        console.log('Nueva CITA resultado', data);
        dispatch({type: CREATE_APPOINTMENT, payload: data.response.payload});
        dispatch({
          type: FETCH_SUCCESS,
          payload: 'Se ha registrado la cita correctamente',
        });
      })
      .catch((error) => {
        console.log('Nueva cita error', error);
        dispatch({type: FETCH_ERROR, payload: 'Error al crear la cita'});
      });
  };
};

export const getAppointment = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'LIST_APPOINTMENT'}});

    API.post('tunexo', '/inventory/appointment/list', {body: payload})
      .then((data) => {
        console.log('get CITAS resultado', data);
        dispatch({
          type: LIST_APPOINTMENT,
          payload: data.response.payload,
          request: payload,
        });
        dispatch({
          type: FETCH_SUCCESS,
          payload: 'Listado de citas exitoso',
        });
      })
      .catch((error) => {
        console.log('citas error', error);

        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};

export const updateAppointment = (payload) => {
  return async (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'EDIT_APPOINTMENT'}});
    try {
      const data = await API.post('tunexo', '/inventory/appointment/update', {
        body: payload,
      });
      console.log('Cita action data update', data);
      dispatch({type: EDIT_APPOINTMENT, payload: data.response.payload});
      dispatch({type: FETCH_SUCCESS, payload: 'success'});
    } catch (error) {
      console.log('Update error cita', data);
      dispatch({type: FETCH_ERROR, payload: 'error'});
    }
  };
};


export const deleteAppointment = (payload) => {
  return async (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'DELETE_APPOINTMENT'}});
    try {
      const data = await API.post('tunexo', '/inventory/appointment/delete', {
        body: payload,
      });
      console.log('se borro la cita', data);
      dispatch({
        type: DELETE_APPOINTMENT,
        payload: data.response.payload,
        request: payload,
      });
      dispatch({
        type: FETCH_SUCCESS,
        payload: 'CITA eliminada exitosamente',
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