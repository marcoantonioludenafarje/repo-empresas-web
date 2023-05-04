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
    dispatch({type: FETCH_START, payload: {process: 'LIST_CLIENTS'}});

    API.post('tunexo', '/inventory/clients/list', {body: payload})
      .then((data) => {
        console.log('onGetClients resultado', data);
        dispatch({
          type: GET_CLIENTS,
          payload: data.response.payload,
          request: payload,
        });
        dispatch({
          type: FETCH_SUCCESS,
          payload: {
            process: 'LIST_CLIENTS',
            message: 'Listado de clientes exitoso',
          },
        });
      })
      .catch((error) => {
        console.log('onGetClients error', error);
        dispatch({
          type: FETCH_ERROR,
          payload: {
            process: 'LIST_CLIENTS',
            message: 'Hubo un error durante el listado del cliente',
          },
        });

        // dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const newClient = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'CREATE_NEW_CLIENT'}});
    API.post('tunexo', '/inventory/clients/register', {body: payload})
      .then((data) => {
        console.log('newCLient resultado', data);
        dispatch({type: NEW_CLIENT, payload: data.response.payload});
        dispatch({
          type: FETCH_SUCCESS,
          payload: {
            process: 'CREATE_NEW_CLIENT',
            message: 'Se ha registrado la información correctamente',
          },
        });
      })
      .catch((error) => {
        console.log('newCLient error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
        dispatch({
          type: FETCH_ERROR,
          payload: {
            process: 'CREATE_NEW_CLIENT',
            message: 'Se ha producido un error al registrar.',
          },
        });
      });
  };
};
export const deleteClient = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'DELETE_CLIENT'}});

    API.post('tunexo', '/inventory/clients/delete', {body: payload})
      .then((data) => {
        console.log('deleteClient resultado', data);
        dispatch({type: DELETE_CLIENT, payload: data.response.payload});
        // dispatch({type: FETCH_SUCCESS, payload: {process: "CREATE_NEW_USER", message: 'Cliente creado exitosamente'}});
        dispatch({
          type: FETCH_SUCCESS,
          payload: {
            process: 'DELETE_CLIENT',
            message: 'Cliente eliminado exitosamente',
          },
        });
      })
      .catch((error) => {
        console.log('deleteClient error', error);
        // dispatch({type: FETCH_ERROR, payload: 'error'});
        dispatch({
          type: FETCH_ERROR,
          payload: {
            process: 'DELETE_CLIENT',
            message: 'Hubo un error durante la eliminación del cliente',
          },
        });
      });
  };
};
export const updateClient = (payload) => {
  return (dispatch, getState) => {
    // dispatch({type: FETCH_START});
    dispatch({type: FETCH_START, payload: {process: 'UPDATE_CLIENT'}});

    API.post('tunexo', '/inventory/clients/update', {body: payload})
      .then((data) => {
        console.log('updateClient resultado', data);
        dispatch({type: UPDATE_CLIENT, payload: data.response.payload});
        // dispatch({type: FETCH_SUCCESS, payload: 'success'});
        dispatch({
          type: FETCH_SUCCESS,
          payload: {
            process: 'UPDATE_CLIENT',
            message: 'Cliente actualizado exitosamente',
          },
        });
      })
      .catch((error) => {
        console.log('updateClient error', error);
        // dispatch({type: FETCH_ERROR, payload: 'error'});

        dispatch({
          type: FETCH_ERROR,
          payload: {
            process: 'UPDATE_CLIENT',
            message: 'Hubo un error durante la actualización del cliente',
          },
        });
      });
  };
};
