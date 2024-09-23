import {
  GET_LOCATIONS,
  GET_STARTING_LOCATIONS,
  FETCH_START,
  FETCH_SUCCESS,
  FETCH_ERROR,
  NEW_LOCATION,
  DELETE_LOCATION,
  UPDATE_LOCATION,
} from '../../shared/constants/ActionTypes';
import API from '@aws-amplify/api';
import {request} from '../../@crema/utility/Utils';
export const getLocations = (payload, jwtToken) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'GET_LOCATIONS'}});
    console.log('Llega a location el jwtToken? 122', jwtToken);
    request('post', '/facturacion/locations/list', payload)
      // API.post('tunexo', '/facturacion/carriers/list', {
      //   body: payload,
      //   headers: {
      //     Authorization: jwtToken,
      //   },
      // })
      .then((data) => {
        console.log('getLocations resultado', data);
        dispatch({
          type: GET_LOCATIONS,
          payload: data.data.response.payload,
          request: payload,
        });
        dispatch({
          type: FETCH_SUCCESS,
          payload: {
            process: 'GET_LOCATIONS',
            message: 'Listado de locaciones exitoso',
          },
        });
      })
      .catch((error) => {
        console.log('getLocations error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const getStartingLocations = (payload, jwtToken) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'GET_STARTING_LOCATIONS'}});
    console.log('Llega a location el jwtToken? 122', jwtToken);
    request('post', '/facturacion/locations/list', payload)
      .then((data) => {
        console.log('getStartingLocations resultado', data);
        dispatch({
          type: GET_STARTING_LOCATIONS,
          payload: data.data.response.payload,
          request: payload,
        });
        dispatch({
          type: FETCH_SUCCESS,
          payload: {
            process: 'GET_STARTING_LOCATIONS',
            message: 'Listado de locaciones exitoso',
          },
        });
      })
      .catch((error) => {
        console.log('getStartingLocations error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const newLocation = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('post', '/facturacion/locations/register', payload)
    //API.post('tunexo', '/facturacion/locations/register', {body: payload})
      .then((data) => {
        console.log('newLocation resultado', data);
        dispatch({type: NEW_LOCATION, payload: data.data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('newCarrier error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const deleteLocation = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('post', '/facturacion/locations/delete', payload)
    //API.post('tunexo', '/facturacion/locations/delete', {body: payload})
      .then((data) => {
        console.log('deleteLocation resultado', data);
        dispatch({type: DELETE_LOCATION, payload: data.data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('deleteLocation error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const updateLocation = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('post', '/facturacion/locations/update', payload)
    //API.post('tunexo', '/facturacion/locations/update', {body: payload})
      .then((data) => {
        console.log('updateLocation resultado', data);
        dispatch({type: UPDATE_LOCATION, payload: data.data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('updateLocation error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
