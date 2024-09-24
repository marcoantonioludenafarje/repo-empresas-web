import {
  LIST_SALES,
  FETCH_START,
  FETCH_SUCCESS,
  FETCH_ERROR,
  NEW_SALE,
  DELETE_SALE,
  UPDATE_SALE,
  NEW_SALE_PROOF_OF_PAYMENT,
} from '../../shared/constants/ActionTypes';
import API from '@aws-amplify/api';
import {request} from '../../@crema/utility/Utils';
export const listSales = (payload, jwtToken) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'LIST_SALES'}});
    console.log('Llega a sale el jwtToken? 122', jwtToken);
    request('post', '/facturacion/sale/list', payload)
      .then((data) => {
        console.log('listSales resultado', data);
        dispatch({
          type: LIST_SALES,
          payload: data.data.response.payload,
          request: payload,
        });
        dispatch({
          type: FETCH_SUCCESS,
          payload: {
            process: 'LIST_SALES',
            message: 'Listado de Ventas exitoso',
          },
        });
      })
      .catch((error) => {
        console.log('listSales error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const newSale = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('post', '/facturacion/sale/register', payload)
      // API.post('tunexo', '/facturacion/sale/register', {body: payload})
      .then((data) => {
        console.log('newSale resultado', data.data);
        dispatch({type: NEW_SALE, payload: data.data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('newCarrier error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const newSaleProofOfPayment = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('post', '/facturacion/sale/registerProofOfPayment', payload)
      // API.post('tunexo', '/facturacion/sale/registerProofOfPayment', {
      //   body: payload,
      // })
      .then((data) => {
        console.log('newSaleProofOfPayment resultado', data.data);
        dispatch({
          type: NEW_SALE_PROOF_OF_PAYMENT,
          payload: data.data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('newSaleProofOfPayment error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const deleteSale = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('post', '/facturacion/sales/delete', payload)
      // API.post('tunexo', '/facturacion/sales/delete', {body: payload})
      .then((data) => {
        console.log('deleteSale resultado', data.data);
        dispatch({type: DELETE_SALE, payload: data.data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('deleteSale error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const updateSale = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('post', '/facturacion/sales/update', payload)
      // API.post('tunexo', '/facturacion/sales/update', {body: payload})
      .then((data) => {
        console.log('updateSale resultado', data.data);
        dispatch({type: UPDATE_SALE, payload: data.data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('updateSale error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
