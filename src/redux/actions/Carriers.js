import {
  GET_CARRIERS,
  FETCH_START,
  FETCH_SUCCESS,
  FETCH_ERROR,
  NEW_CARRIER,
  DELETE_CARRIER,
  UPDATE_CARRIER,
} from '../../shared/constants/ActionTypes';
import API from '@aws-amplify/api';
import {request} from '../../@crema/utility/Utils';
export const getCarriers = (payload, jwtToken) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'GET_CARRIERS'}});
    console.log('Llega a carrier el jwtToken? 122', jwtToken);
    request('post', '/facturacion/carriers/list', payload)
      // API.post('tunexo', '/facturacion/carriers/list', {
      //   body: payload,
      //   headers: {
      //     Authorization: jwtToken,
      //   },
      // })
      .then((data) => {
        console.log('getCarriers resultado', data);
        dispatch({
          type: GET_CARRIERS,
          payload: data.data.response.payload,
          request: payload,
        });
        dispatch({
          type: FETCH_SUCCESS,
          payload: {
            process: 'GET_CARRIERS',
            message: 'Listado de empresas transportistas exitoso',
          },
        });
      })
      .catch((error) => {
        console.log('getCarriers error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const newCarrier = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('post', '/facturacion/carriers/register', payload)
      //API.post('tunexo', '/facturacion/carriers/register', {body: payload})
      .then((data) => {
        console.log('newCarrier resultado', data.data);
        dispatch({type: NEW_CARRIER, payload: data.data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('newCarrier error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const deleteCarrier = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('post', '/facturacion/carriers/delete', payload)
      //API.post('tunexo', '/facturacion/carriers/delete', {body: payload})
      .then((data) => {
        console.log('deleteCarrier resultado', data.data);
        dispatch({type: DELETE_CARRIER, payload: data.data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('deleteCarrier error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const updateCarrier = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('post', '/facturacion/carriers/update', payload)
      //API.post('tunexo', '/facturacion/carriers/update', {body: payload})
      .then((data) => {
        console.log('updateCarrier resultado', data.data);
        dispatch({type: UPDATE_CARRIER, payload: data.data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('updateCarrier error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
