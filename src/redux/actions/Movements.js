import {
  FETCH_ERROR,
  ADD_MOVEMENT,
  UPDATE_MOVEMENT,
  RES_ADD_MOVEMENT,
  GET_MOVEMENTS,
  GET_INVENTORY_PRODUCTS,
  DELETE_MOVEMENT,
  GENERATE_INVOICE,
  ADD_REFERRAL_GUIDE,
  LIST_INVOICE,
  ADD_INVOICE,
  CANCEL_INVOICE,
  FETCH_START,
  FETCH_SUCCESS,
  ADD_CREDIT_NOTE,
  ADD_RECEIPT,
  GENERATE_ROUTE,
  LIST_ROUTE,
  GENERATE_DISTRIBUTION,
  LIST_DISTRIBUTION,
  TO_UPDATE_ITEM_IN_LIST_DISTRIBUTION,
  UPDATE_ROUTE,
  UPDATE_GENERATE_REFERRAL_GUIDE_VALUE,
  GET_CHILD_ROUTES,
  GET_REFERRALGUIDE_PAGE_LISTGUIDE,
  GET_BILL_PAGE_LISTGUIDE,
  GET_RECEIPT_PAGE_LISTGUIDE,
  GET_NOTE_PAGE_LISTGUIDE
} from '../../shared/constants/ActionTypes';
import API from '@aws-amplify/api';
import {request} from '../../@crema/utility/Utils';

export const getMovements = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    console.log('/inventory/movementProducts/list', {body: payload});
    API.post('tunexo', '/inventory/movementProducts/list', {body: payload})
      .then((data) => {
        console.log('getMovements123 resultado', data);
        dispatch({type: GET_MOVEMENTS, payload: data.response.payload, request: payload,});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getMovements error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const getInventoryProducts = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/movementProducts/list', {body: payload})
      .then((data) => {
        console.log('getInventoryProducts resultado', data);
        dispatch({
          type: GET_INVENTORY_PRODUCTS,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getInventoryProducts error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const addMovement = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/movementProducts/register', {body: payload})
      .then((data) => {
        console.log('addMovement resultado', data);
        dispatch({
          type: ADD_MOVEMENT,
          payload: data.response.payload,
        });
        dispatch({
          type: RES_ADD_MOVEMENT,
          payload: data.response,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('addMovement error', error);
        dispatch({type: FETCH_ERROR, payload: 'error' /* error.message */});
      });
  };
};
export const updateMovement = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/movementProducts/update', {body: payload})
      .then((data) => {
        console.log('updateMovement resultado', data);
        dispatch({
          type: UPDATE_MOVEMENT,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('updateMovement error', error);
        dispatch({type: FETCH_ERROR, payload: 'error' /* error.message */});
      });
  };
};
export const deleteMovement = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/movementProducts/delete', {body: payload})
      .then((data) => {
        console.log('deleteMovement resultado', data);
        dispatch({
          type: DELETE_MOVEMENT,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('deleteMovement error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const generateInvoice = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/movementProducts/list', {
      body: payload,
    })
      .then((data) => {
        console.log('generateInvoice resultado', data);
        dispatch({
          type: LIST_INVOICE,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('generateInvoice error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const addInvoice = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/facturacion/bill/register', {
      body: payload,
    })
      .then((data) => {
        console.log('addInvoice resultado', data);
        dispatch({
          type: ADD_INVOICE,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('addInvoice error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const addReceipt = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/facturacion/receipt/register', {
      body: payload,
    })
      .then((data) => {
        console.log('addReceipt resultado', data);
        dispatch({
          type: ADD_RECEIPT,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('addReceipt error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const cancelInvoice = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/facturacion/bill/cancel', {
      body: payload,
    })
      .then((data) => {
        console.log('cancelInvoice resultado', data);
        dispatch({
          type: CANCEL_INVOICE,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('cancelInvoice error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const addReferrealGuide = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/facturacion/referralGuide/register', {
      body: payload,
    })
      .then((data) => {
        console.log('addReferrealGuide resultado', data);
        dispatch({
          type: ADD_REFERRAL_GUIDE,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('addReferrealGuide error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const addCreditNote = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/facturacion/creditNote/register', {
      body: payload,
    })
      .then((data) => {
        console.log('addCreditNote resultado', data);
        dispatch({
          type: ADD_CREDIT_NOTE,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('addCreditNote error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const generatePredefinedRoute = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/facturacion/routePredefined/register', {
      body: payload,
    })
      .then((data) => {
        console.log('generatePredefinedRoute resultado', data);
        dispatch({
          type: GENERATE_ROUTE,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('generatePredefinedRoute error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const updatePredefinedRoute = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/facturacion/routePredefined/update', {
      body: payload,
    })
      .then((data) => {
        console.log('updatePredefinedRoute resultado', data);
        dispatch({
          type: UPDATE_ROUTE,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('updatePredefinedRoute error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const listRoutes = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/facturacion/routePredefined/list', {
      body: payload,
    })
      .then((data) => {
        console.log('listRoutes resultado', data);
        dispatch({
          type: LIST_ROUTE,
          payload: data.response.payload,
          request: payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('listRoutes error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const getChildRoutes = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/facturacion/routePredefined/getChild', {
      body: payload,
    })
      .then((data) => {
        console.log('getChildRoute resultado', data);
        dispatch({
          type: GET_CHILD_ROUTES,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getChildRoute error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const listNewRoutes = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('get', '/distribution/routesPredefined/17838393', {
      body: payload,
    })
      .then((data) => {
        console.log('getChildRoute resultado', data);
        // dispatch({
        //   type: GET_CHILD_ROUTES,
        //   payload: data.response.payload,
        // });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getChildRoute error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};


export const getSpecificRoutesNew = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('get', '/distribution/routesPredefined/17838393', {
      body: payload,
    })
      .then((data) => {
        console.log('getChildRoute resultado', data);
        // dispatch({
        //   type: GET_CHILD_ROUTES,
        //   payload: data.response.payload,
        // });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getChildRoute error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};


export const listDistributions = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/facturacion/deliveryDistribution/list', {
      body: payload,
    })
      .then((data) => {
        console.log('listDistributions resultado', data);
        dispatch({
          type: LIST_DISTRIBUTION,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('listDistributions error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};



export const getDistribution= (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('get',  `/distribution/deliveryDistribution/${payload.deliveryDistributionId}`, {
    // request('get',  `/distribution/deliveryDistribution`, {
      
      body: payload,
    })
      .then((data) => {
        console.log('getDistribution resultado', data);
        dispatch({
          type: TO_UPDATE_ITEM_IN_LIST_DISTRIBUTION,
          payload: data.data,
          indexDistributionSelected: payload.indexDistributionSelected
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getDistribution error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const generateDistribution = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/facturacion/deliveryDistribution/register', {
      body: payload,
    })
      .then((data) => {
        console.log('generateDistribution resultado', data);
        dispatch({
          type: GENERATE_DISTRIBUTION,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('generateDistribution error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const updateReferralGuideValue = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post(
      'tunexo',
      '/facturacion/deliveryDistribution/updateDeliveryReferralGuide',
      {
        body: payload,
      },
    )
      .then((data) => {
        console.log('updateReferralGuideValue resultado', data);
        dispatch({
          type: UPDATE_GENERATE_REFERRAL_GUIDE_VALUE,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('updateReferralGuideValue error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const getReferralGuides_PageListGuide = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    console.log('/inventory/referralGuides/v1/list', {body: payload});
    API.post('tunexo', '/inventory/referralGuides/v1/list', {body: payload})
      .then((data) => {
        console.log('getReferralGuides_PageListGuide resultado', data);
        dispatch({type: GET_REFERRALGUIDE_PAGE_LISTGUIDE, payload: data.response.payload, request: payload,});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getReferralGuides_PageListGuide error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const getBillItems_pageListBill = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    console.log('/inventory/bill/v1/list', {body: payload});
    API.post('tunexo', '/inventory/bills/v1/list', {body: payload})
      .then((data) => {
        console.log('getBillItems_pageListBill resultado', data);
        dispatch({type: GET_BILL_PAGE_LISTGUIDE, payload: data.response.payload, request: payload,});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getBillItems_pageListBill error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const getReceiptItems_pageListReceipt = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    console.log('/inventory/receipt/v1/list', {body: payload});
    API.post('tunexo', '/inventory/receipts/v1/list', {body: payload})
      .then((data) => {
        console.log('getReceiptItems_pageListReceipt resultado', data);
        dispatch({type: GET_RECEIPT_PAGE_LISTGUIDE, payload: data.response.payload, request: payload,});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getReceiptItems_pageListReceipt error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const getNoteItems_pageListNote = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    console.log('/inventory/notes/v1/list', {body: payload});
    API.post('tunexo', '/inventory/notes/v1/list', {body: payload})
      .then((data) => {
        console.log('getNoteItems_pageListNote resultado', data);
        dispatch({type: GET_NOTE_PAGE_LISTGUIDE, payload: data.response.payload, request: payload,});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getNoteItems_pageListNote error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
