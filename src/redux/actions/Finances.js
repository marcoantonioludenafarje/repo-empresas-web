import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  GET_FINANCES,
  ADD_FINANCE,
  DELETE_FINANCE,
  UPDATE_FINANCE,
  GET_FINANCES_FOR_RESULT_STATE,
} from '../../shared/constants/ActionTypes';
import API from '@aws-amplify/api';
import {request} from '../../@crema/utility/Utils';

export const getFinances = (payload) => {
  console.log('payload getFinances', payload);
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('post', '/facturacion/accounting/movement/list', payload)
      // API.post('tunexo', '/facturacion/accounting/movement/list', {body: payload})
      .then((data) => {
        console.log('getFinances resultado', data);
        dispatch({type: GET_FINANCES, payload: data.data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getFinances error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const getFinancesForResultState = (payload) => {
  console.log('payload getFinancesForResultState', payload);
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('post', '/facturacion/accounting/movement/list', payload)
      // API.post('tunexo', '/facturacion/accounting/movement/list', {body: payload})
      .then((data) => {
        console.log('getFinancesForResultState resultado', data);
        dispatch({
          type: GET_FINANCES_FOR_RESULT_STATE,
          payload: data.data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getFinancesForResultState error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const addFinance = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/facturacion/accounting/movement/register', {
      body: payload,
    })
      .then((data) => {
        console.log('addFinance resultado', data);
        dispatch({type: ADD_FINANCE, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: data.response.status});
      })
      .catch((error) => {
        console.log('addFinance error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const deleteFinance = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/facturacion/accounting/movement/delete', {
      body: payload,
    })
      .then((data) => {
        console.log('deleteFinance resultado', data);
        dispatch({type: DELETE_FINANCE, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: data.response.status});
      })
      .catch((error) => {
        console.log('deleteFinance error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const updateFinance = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/facturacion/accounting/movement/update', {
      body: payload,
    })
      .then((data) => {
        console.log('updateFinance resultado', data);
        dispatch({type: UPDATE_FINANCE, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: data.response.status});
      })
      .catch((error) => {
        console.log('updateFinance error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
