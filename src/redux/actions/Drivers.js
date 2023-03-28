import {
  GET_DRIVERS,
  FETCH_START,
  FETCH_SUCCESS,
  FETCH_ERROR,
  NEW_DRIVER,
  DELETE_DRIVER,
  UPDATE_DRIVER,
} from '../../shared/constants/ActionTypes';
import API from '@aws-amplify/api';
import {request} from '../../@crema/utility/Utils';
export const getDrivers = (payload, jwtToken) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    console.log('Llega a driver el jwtToken? 122', jwtToken);
    request('post', '/facturacion/drivers/list', payload)
      // API.post('tunexo', '/facturacion/carriers/list', {
      //   body: payload,
      //   headers: {
      //     Authorization: jwtToken,
      //   },
      // })
      .then((data) => {
        console.log('getDrivers resultado', data);
        dispatch({type: GET_DRIVERS, payload: data.data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getDrivers error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const newDriver = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/facturacion/drivers/register', {body: payload})
      .then((data) => {
        console.log('newDriver resultado', data);
        dispatch({type: NEW_DRIVER, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('newCarrier error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const deleteDriver = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/facturacion/drivers/delete', {body: payload})
      .then((data) => {
        console.log('deleteDriver resultado', data);
        dispatch({type: DELETE_DRIVER, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('deleteDriver error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const updateDriver = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/facturacion/drivers/update', {body: payload})
      .then((data) => {
        console.log('updateDriver resultado', data);
        dispatch({type: UPDATE_DRIVER, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('updateDriver error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
