import {
  CREATE_SPECIALIST,
  LIST_SPECIALIST,
  DELETE_SPECIALIST,
  UPDATE_SPECIALIST,
  FETCH_START,
  FETCH_SUCCESS,
  FETCH_ERROR,
} from '../../shared/constants/ActionTypes';

import API from '@aws-amplify/api';

export const newSpecialist = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'CREATE_SPECIALIST'}});
    API.post('tunexo', '/inventory/specialist/register', {body: payload})
      .then((data) => {
        console.log('Nuevo agente resultado', data);
        dispatch({type: CREATE_SPECIALIST, payload: data.response.payload});
        dispatch({
          type: FETCH_SUCCESS,
          payload: 'Se ha registrado el especialista correctamente',
        });
      })
      .catch((error) => {
        console.log('Nuevo agente error', error);
        dispatch({
          type: FETCH_ERROR,
          payload: 'Error al crear el especialista',
        });
      });
  };
};

export const getSpecialists = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'LIST_SPECIALIST'}});

    API.post('tunexo', '/inventory/specialist/list', {body: payload})
      .then((data) => {
        console.log('get especialistas resultado', data);
        dispatch({
          type: LIST_SPECIALIST,
          payload: data.response.payload,
          request: payload,
        });
        dispatch({
          type: FETCH_SUCCESS,
          payload: 'Listado de especialistas exitoso',
        });
      })
      .catch((error) => {
        console.log('agentes error', error);

        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};

export const deleteSpecialists = (payload) => {
  return async (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'DELETE_SPECIALIST'}});
    try {
      const data = await API.post('tunexo', '/inventory/specialist/delete', {
        body: payload,
      });
      console.log('se borro el especialista', data);
      dispatch({
        type: DELETE_SPECIALIST,
        payload: data.response.payload,
        request: payload,
      });
      dispatch({
        type: FETCH_SUCCESS,
        payload: 'Especialista eliminado exitosamente',
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

export const updateSpecialists = (payload) => {
  return async (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'UPDATE_SPECIALIST'}});
    try {
      const data = await API.post('tunexo', '/inventory/specialist/update', {
        body: payload,
      });
      console.log('Especialista data update', data);
      dispatch({type: UPDATE_SPECIALIST, payload: data.response.payload});
      dispatch({type: FETCH_SUCCESS, payload: 'success'});
    } catch (error) {
      console.log('Update error especialista', data);
      dispatch({type: FETCH_ERROR, payload: 'error'});
    }
  };
};
