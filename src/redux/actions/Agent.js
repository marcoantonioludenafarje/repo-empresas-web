import {
  CREATE_AGENT,
  LIST_AGENT,
  UPDATE_AGENT,
  DELETE_AGENT,
  FETCH_START,
  FETCH_SUCCESS,
  FETCH_ERROR,
  START_AGENT_SESSION,
} from '../../shared/constants/ActionTypes';

import API from '@aws-amplify/api';
import {requestWhatsappModule} from '../../@crema/utility/Utils';

export const newAgent = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'CREATE_AGENT'}});
    API.post('tunexo', '/inventory/robot/register', {body: payload})
      .then((data) => {
        console.log('Nuevo agente resultado', data);
        dispatch({type: CREATE_AGENT, payload: data.response.payload});
        dispatch({
          type: FETCH_SUCCESS,
          payload: 'Se ha registrado el agente correctamente',
        });
      })
      .catch((error) => {
        console.log('Nuevo agente error', error);
        dispatch({type: FETCH_ERROR, payload: 'Error al crear el agente'});
      });
  };
};

export const getAgents = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'LIST_AGENT'}});

    API.post('tunexo', '/inventory/robot/list', {body: payload})
      .then((data) => {
        console.log('get agentes resultado', data);
        dispatch({
          type: LIST_AGENT,
          payload: data.response.payload,
          request: payload,
        });
        dispatch({
          type: FETCH_SUCCESS,
          payload: 'Listado de agentes exitoso',
        });
      })
      .catch((error) => {
        console.log('agentes error', error);

        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};

export const deleteAgents = (payload) => {
  return async (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'DELETE_AGENT'}});
    try {
      const data = await API.post('tunexo', '/inventory/robot/delete', {
        body: payload,
      });
      console.log('se borro el agente', data);
      dispatch({
        type: DELETE_AGENT,
        payload: data.response.payload,
        request: payload,
      });
      dispatch({
        type: FETCH_SUCCESS,
        payload: 'Agente eliminado exitosamente',
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

export const updateAgents = (payload) => {
  return async (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'UPDATE_AGENT'}});
    try {
      const data = await API.post('tunexo', '/inventory/robot/update', {
        body: payload,
      });
      console.log('Agente data update', data);
      dispatch({type: UPDATE_AGENT, payload: data.response.payload});
      dispatch({type: FETCH_SUCCESS, payload: 'success'});
    } catch (error) {
      console.log('Update error agente', data);
      dispatch({type: FETCH_ERROR, payload: 'error'});
    }
  };
};

export const startAgentSession = (payload) => {
  return async (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'START_AGENT_SESSION'}});

    requestWhatsappModule('post', '/api/crear-session', payload)
      .then((data) => {
        console.log('START_AGENT_SESSION data', data);
        dispatch({type: START_AGENT_SESSION, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('START_AGENT_SESSION error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
