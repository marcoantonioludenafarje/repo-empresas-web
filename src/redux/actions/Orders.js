import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  GET_ORDERS,
  NEW_ORDER,
  DELETE_ORDER,
  UPDATE_ORDER,
  CHANGE_STATUS_ORDER,
} from '../../shared/constants/ActionTypes';
import API from '@aws-amplify/api';

export const onGetOrders = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/admin/ecommerce/order/list', {body: payload})
      .then((data) => {
        console.log('onGetOrders resultado', data);
        dispatch({type: GET_ORDERS, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('onGetOrders error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const newOrder = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/admin/ecommerce/order/register', {
      body: payload,
    })
      .then((data) => {
        console.log('newCLient resultado', data);
        dispatch({type: NEW_ORDER, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('newCLient error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const deleteOrder = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/admin/ecommerce/order/delete', {
      body: payload,
    })
      .then((data) => {
        console.log('deleteOrder resultado', data);
        dispatch({type: DELETE_ORDER, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('deleteOrder error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const updateOrder = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/admin/ecommerce/order/update', {
      body: payload,
    })
      .then((data) => {
        console.log('updateOrder resultado', data);
        dispatch({type: UPDATE_ORDER, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('updateOrder error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const changeStatusOrder = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/admin/ecommerce/order/changeStatus', {
      body: payload,
    })
      .then((data) => {
        console.log('changeStatusOrder resultado', data);
        dispatch({type: CHANGE_STATUS_ORDER, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('changeStatusOrder error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
