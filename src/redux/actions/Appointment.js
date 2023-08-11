import {
    FETCH_START,
    FETCH_SUCCESS,
    FETCH_ERROR,
    CREATE_APPOINTMENT,
    LIST_APPOINTMENT
  } from '../../shared/constants/ActionTypes';
  
  import API from '@aws-amplify/api';
  
  export const newAppointment = (payload) => {
    return (dispatch, getState) => {
      dispatch({type: FETCH_START, payload: {process: 'CREATE_CAMPAIGN'}});
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
      dispatch({type: FETCH_START, payload: {process: 'LIST_CAMPAIGN'}});
  
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
