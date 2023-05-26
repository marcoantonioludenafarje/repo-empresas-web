import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  GET_PRODUCTS,
  ADD_PRODUCT,
  DELETE_PRODUCT,
  UPDATE_PRODUCT,
  GET_CATEGORIES,
  PRODUCE_PRODUCT,
  ALL_PRODUCTS,
} from '../../shared/constants/ActionTypes';
import API from '@aws-amplify/api';

export const onGetProducts = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/products/list', {body: payload})
      .then((data) => {
        console.log('onGetProducts resultado', data);
        dispatch({type: GET_PRODUCTS, payload: data.response.payload.Items});
        dispatch({type: FETCH_SUCCESS});
      })
      .catch((error) => {
        console.log('onGetProducts error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const getAllProducts = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'ALL_PRODUCTS'}});
    API.post('tunexo', '/inventory/products/list', {body: payload})
      .then((data) => {
        console.log('getAllProducts resultado', data);
        dispatch({
          type: ALL_PRODUCTS,
          payload: data.response.payload,
          request: payload,
        });
        dispatch({
          type: FETCH_SUCCESS,
          payload: {
            process: 'ALL_PRODUCTS',
            message: 'Listado de productos exitoso',
          },
        });
      })
      .catch((error) => {
        console.log('getAllProducts error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const addProduct = (payload) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/products/register', {body: payload})
      .then((data) => {
        console.log('addProduct resultado', data);
        dispatch({type: ADD_PRODUCT, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('addProduct error', error);
        dispatch({
          type: FETCH_ERROR,
          payload: error.message /* error.message */,
        });
      });
  };
};

export const deleteProduct = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/products/delete', {body: payload})
      .then((data) => {
        console.log('deleteProduct resultado', data);
        dispatch({type: DELETE_PRODUCT, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('deleteProduct error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const updateProduct = (payload) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/products/update', {body: payload})
      .then((data) => {
        console.log('updateProduct resultado', data);
        dispatch({type: UPDATE_PRODUCT, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('updateProduct error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const getCategories = (payload) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/productCategories/list', {body: payload})
      .then((data) => {
        console.log('getCategories resultado', data);
        dispatch({type: GET_CATEGORIES, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getCategories error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const produceProduct = (payload) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/products/produce', {body: payload})
      .then((data) => {
        console.log('produceProduct resultado', data);
        dispatch({type: PRODUCE_PRODUCT, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('produceProduct error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
