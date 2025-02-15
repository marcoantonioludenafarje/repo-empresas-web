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
  DELETE_ROUTE,
  GENERATE_DISTRIBUTION,
  LIST_DISTRIBUTION,
  TO_UPDATE_ITEM_IN_LIST_DISTRIBUTION,
  UPDATE_ROUTE,
  UPDATE_GENERATE_REFERRAL_GUIDE_VALUE,
  GET_CHILD_ROUTES,
  SET_LIST_ROUTE_PREDEFINED_____PAGE_NEW_DISTRIBUTION,
  SET_DELIVERIES_IN_ROUTE_PREDEFINED_____PAGE_NEW_DISTRIBUTION,
  SET_LIST_ROUTE_PREDEFINED_____PAGE_LIST_PREDEFINED_ROUTES,
  SET_DELIVERIES_IN_ROUTE_PREDEFINED_____PAGE_LIST_PREDEFINED_ROUTES,
  GET_REFERRALGUIDE_PAGE_LISTGUIDE,
  GET_BILL_PAGE_LISTGUIDE,
  GET_RECEIPT_PAGE_LISTGUIDE,
  GET_NOTE_PAGE_LISTGUIDE,
  GENERATE_SELL_TICKET,
  REFERRAL_GUIDES_BATCH_CONSULT,
  CANCEL_REFERRAL_GUIDE,
  GET_OUTPUT_PAGE_LISTGUIDE,
  GET_INPUT_PAGE_LISTGUIDE,
  PREVISUALIZE_BILL,
  PREVISUALIZE_REFERRAL_GUIDE,
  PROOF_MONITORING,
  REGISTER_TRANSACTION,
  GENERATE_EXCEL_TEMPLATE_TO_CONSOLIDATED,
  GENERATE_EXCEL_SUMMARY_ROUTES,
  GENERATE_EXCEL_SHEETS_DISPATCH,
  GENERATE_TRACEABILITY_SHEETS,
} from '../../shared/constants/ActionTypes';
import API from '@aws-amplify/api';
import {request} from '../../@crema/utility/Utils';

export const getOutputItems_pageListOutput = (payload) => {
  return (dispatch, getState) => {
    dispatch({
      type: FETCH_START,
      payload: {process: 'GET_OUTPUT_PAGE_LISTGUIDE'},
    });
    console.log('/inventory/outputs/v1/list', {body: payload});
    API.post('tunexo', '/inventory/outputs/v1/list', {body: payload})
      .then((data) => {
        console.log('getOutputItems_pageListOutput resultado', data);
        dispatch({
          type: GET_OUTPUT_PAGE_LISTGUIDE,
          payload: data.response.payload,
          request: payload,
        });
        dispatch({
          type: FETCH_SUCCESS,
          payload: {
            process: 'GET_OUTPUT_PAGE_LISTGUIDE',
            message: 'Listado de salidas exitoso',
          },
        });
      })
      .catch((error) => {
        console.log('getOutputItems_pageListOutput error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const getInputItems_pageListInput = (payload) => {
  return (dispatch, getState) => {
    dispatch({
      type: FETCH_START,
      payload: {process: 'GET_INPUT_PAGE_LISTGUIDE'},
    });
    console.log('/inventory/inputs/v1/list', {body: payload});
    API.post('tunexo', '/inventory/inputs/v1/list', {body: payload})
      .then((data) => {
        console.log('getInputItems_pageListInput resultado', data);
        dispatch({
          type: GET_INPUT_PAGE_LISTGUIDE,
          payload: data.response.payload,
          request: payload,
        });
        dispatch({
          type: FETCH_SUCCESS,
          payload: {
            process: 'GET_INPUT_PAGE_LISTGUIDE',
            message: 'Listado de entradas exitoso',
          },
        });
      })
      .catch((error) => {
        console.log('getInputItems_pageListInput error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const getMovements = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    console.log('/inventory/movementProducts/list', {body: payload});
    API.post('tunexo', '/inventory/movementProducts/list', {body: payload})
      .then((data) => {
        console.log('getMovements123 resultado', data);
        dispatch({
          type: GET_MOVEMENTS,
          payload: data.response.payload,
          request: payload,
        });
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
export const generateSellTicket = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('post', '/facturacion/sellTicket/register', payload)
      // API.post('tunexo', '/facturacion/sellTicket/register', {
      //   body: payload,
      // })
      .then((data) => {
        console.log('generateSellTicket resultado', data.data);
        dispatch({
          type: GENERATE_SELL_TICKET,
          payload: data.data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('generateSellTicket error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const addInvoice = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('post', '/facturacion/bill/register', payload)
      // API.post('tunexo', '/facturacion/bill/register', {
      //   body: payload,
      // })
      .then((data) => {
        console.log('addInvoice resultado', data.data);
        dispatch({
          type: ADD_INVOICE,
          payload: data.data.response.payload,
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
    request('post', '/facturacion/receipt/register', payload)
      // API.post('tunexo', '/facturacion/receipt/register', {
      //   body: payload,
      // })
      .then((data) => {
        console.log('addReceipt resultado', data.data);
        dispatch({
          type: ADD_RECEIPT,
          payload: data.data.response.payload,
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
    request('post', '/facturacion/bill/cancel', payload)
      // API.post('tunexo', '/facturacion/bill/cancel', {
      //   body: payload,
      // })
      .then((data) => {
        console.log('cancelInvoice resultado', data.data);
        dispatch({
          type: CANCEL_INVOICE,
          payload: data.data.response.payload,
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
    request('post', '/facturacion/referralGuide/register', payload)
      // API.post('tunexo', '/facturacion/referralGuide/register', {
      //   body: payload,
      // })
      .then((data) => {
        console.log('addReferrealGuide resultado', data.data);
        dispatch({
          type: ADD_REFERRAL_GUIDE,
          payload: data.data.response.payload,
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
    request('post', '/facturacion/creditNote/register', payload)
      // API.post('tunexo', '/facturacion/creditNote/register', {
      //   body: payload,
      // })
      .then((data) => {
        console.log('addCreditNote resultado', data.data);
        dispatch({
          type: ADD_CREDIT_NOTE,
          payload: data.data.response.payload,
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
    request('post', '/facturacion/routePredefined/register', payload)
      // API.post('tunexo', '/facturacion/routePredefined/register', {
      //   body: payload,
      // })
      .then((data) => {
        console.log('generatePredefinedRoute resultado', data.data);
        dispatch({
          type: GENERATE_ROUTE,
          payload: data.data.response.payload,
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
    request('post', '/facturacion/routePredefined/update', payload)
      // API.post('tunexo', '/facturacion/routePredefined/update', {
      //   body: payload,
      // })
      .then((data) => {
        console.log('updatePredefinedRoute resultado', data.data);
        dispatch({
          type: UPDATE_ROUTE,
          payload: data.data.response.payload,
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
    request('post', '/facturacion/routePredefined/list', payload)
      // API.post('tunexo', '/facturacion/routePredefined/list', {
      //   body: payload,
      // })
      .then((data) => {
        console.log('listRoutes resultado', data.data);
        dispatch({
          type: LIST_ROUTE,
          payload: data.data.response.payload,
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
    request('post', '/facturacion/routePredefined/getChild', payload)
      // API.post('tunexo', '/facturacion/routePredefined/getChild', {
      //   body: payload,
      // })
      .then((data) => {
        console.log('getChildRoute resultado', data.data);
        dispatch({
          type: GET_CHILD_ROUTES,
          payload: data.data.response.payload,
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

export const listDistributions = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('post', '/facturacion/deliveryDistribution/list', payload)
      // API.post('tunexo', '/facturacion/deliveryDistribution/list', {
      //   body: payload,
      // })
      .then((data) => {
        console.log('listDistributions resultado', data.data);
        dispatch({
          type: LIST_DISTRIBUTION,
          payload: data.data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('listDistributions error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const getOneDistribution = (payload) => {
  console.log('payload getOneDistribution', payload);
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request(
      'get',
      `/distribution/deliveryDistribution/${payload.deliveryDistributionId}`,
      {
        body: payload,
      },
    )
      .then((data) => {
        console.log('getOneDistribution resultado', data);
        dispatch({
          type: LIST_DISTRIBUTION,
          payload: [data.data],
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getOneDistribution error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const getDistribution = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request(
      'get',
      `/distribution/deliveryDistribution/${payload.deliveryDistributionId}`,
      {
        // request('get',  `/distribution/deliveryDistribution`, {

        body: payload,
      },
    )
      .then((data) => {
        console.log('getDistribution resultado', data);
        dispatch({
          type: TO_UPDATE_ITEM_IN_LIST_DISTRIBUTION,
          payload: data.data,
          indexDistributionSelected: payload.indexDistributionSelected,
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
    request('post', '/facturacion/deliveryDistribution/register', payload)
      // API.post('tunexo', '/facturacion/deliveryDistribution/register', {
      //   body: payload,
      // })
      .then((data) => {
        console.log('generateDistribution resultado', data.data);
        dispatch({
          type: GENERATE_DISTRIBUTION,
          payload: data.data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('generateDistribution error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const exportExcelSummaryRoutes = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request(
      'post',
      '/facturacion/deliveryDistribution/exportExcelRoutes',
      payload,
    )
      // API.post('tunexo', '/facturacion/deliveryDistribution/exportExcelRoutes', {
      //   body: payload,
      // })
      .then((data) => {
        console.log('listDistributions resultado', data.data);
        dispatch({
          type: GENERATE_EXCEL_SUMMARY_ROUTES,
          payload: data.data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('listDistributions error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const exportExcelSummaryItems = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('post', '/facturacion/routePredefined/exportExcelItems', payload)
      // API.post('tunexo', '/facturacion/routePredefined/exportExcelItems', {
      //   body: payload,
      // })
      .then((data) => {
        console.log('listDistributions resultado', data.data);
        dispatch({
          type: GENERATE_EXCEL_SUMMARY_ROUTES,
          payload: data.data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('listDistributions error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const exportExcelSheetsDispatchFile = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request(
      'post',
      '/facturacion/routesPredefined/generateDownloadSheets',
      payload,
    )
      // API.post('tunexo', '/facturacion/routesPredefined/generateDownloadSheets', {
      //   body: payload,
      // })
      .then((data) => {
        console.log('exportExcelSheetsDispatchFile resultado', data.data);
        dispatch({
          type: GENERATE_EXCEL_SHEETS_DISPATCH,
          payload: data.data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('exportExcelSheetsDispatchFile error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const generateTraceabilitySheets = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request(
      'post',
      '/facturacion/distribution/generateTraceabilitySheets',
      payload,
    )
      .then((data) => {
        console.log('generateTraceabilitySheets resultado', data.data);
        dispatch({
          type: GENERATE_TRACEABILITY_SHEETS,
          payload: data.data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('generateTraceabilitySheets error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const updateReferralGuideValue = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request(
      'post',
      '/facturacion/deliveryDistribution/updateDeliveryReferralGuide',
      payload,
    )
      // API.post(
      //   'tunexo',
      //   '/facturacion/deliveryDistribution/updateDeliveryReferralGuide',
      //   {
      //     body: payload,
      //   },
      // )
      .then((data) => {
        console.log('updateReferralGuideValue resultado', data.data);
        dispatch({
          type: UPDATE_GENERATE_REFERRAL_GUIDE_VALUE,
          payload: data.data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('updateReferralGuideValue error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const listPredefinedRoutes_____PageNewDistribution = (payload) => {
  console.log('payload10000', payload);

  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('get', '/distribution/routesPredefined', {
      body: payload,
    })
      .then((data) => {
        console.log(
          'listPredefinedRoutes_____PageNewDistribution resultado',
          data,
        );
        dispatch({
          type: SET_LIST_ROUTE_PREDEFINED_____PAGE_NEW_DISTRIBUTION,
          payload: data.data,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log(
          'listPredefinedRoutes_____PageNewDistribution error',
          error,
        );
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const listPredefinedRoutes_____PageListPredefinedRoutes = (payload) => {
  console.log('payload10000', payload);

  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('get', '/distribution/routesPredefined', {
      body: payload,
    })
      .then((data) => {
        console.log(
          'listPredefinedRoutes_____PageNewDistribution resultado',
          data,
        );
        dispatch({
          type: SET_LIST_ROUTE_PREDEFINED_____PAGE_LIST_PREDEFINED_ROUTES,
          payload: data.data,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log(
          'listPredefinedRoutes_____PageNewDistribution error',
          error,
        );
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const deletePredefinedRoute = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('post', '/facturacion/routePredefined/delete', payload)
      // API.post('tunexo', '/facturacion/routePredefined/delete', {
      //   body: payload,
      // })
      .then((data) => {
        console.log('deletePredefinedRoute resultado', data.data);
        dispatch({
          type: DELETE_ROUTE,
          payload: data.data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('deletePredefinedRoute error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const getPredefinedRoute_____PageListPredefinedRoutes = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request(
      'get',
      `/distribution/routesPredefined/${payload.routePredefinedId}`,
      {
        body: payload,
      },
    )
      .then((data) => {
        console.log(
          'getPredefinedRoute_PageListPredefinedRoutes resultado',
          data,
        );
        dispatch({
          type: SET_DELIVERIES_IN_ROUTE_PREDEFINED_____PAGE_LIST_PREDEFINED_ROUTES,
          payload: data.data,
        });

        // dispatch({
        //   type: SET_LIST_ROUTE_PREDEFINED,
        //   payload: data.response.payload,
        // });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getChildRoute error', error);
      });
  };
};
export const getReferralGuides_PageListGuide = (payload) => {
  return (dispatch, getState) => {
    dispatch({
      type: FETCH_START,
      payload: {process: 'GET_REFERRALGUIDE_PAGE_LISTGUIDE'},
    });
    console.log('/inventory/referralGuides/v1/list', {body: payload});
    API.post('tunexo', '/inventory/referralGuides/v1/list', {body: payload})
      .then((data) => {
        console.log('getReferralGuides_PageListGuide resultado', data);
        dispatch({
          type: GET_REFERRALGUIDE_PAGE_LISTGUIDE,
          payload: data.response.payload,
          request: payload,
        });
        dispatch({
          type: FETCH_SUCCESS,
          payload: {
            process: 'GET_REFERRALGUIDE_PAGE_LISTGUIDE',
            message: 'Listado de guías de remisión exitoso',
          },
        });
      })
      .catch((error) => {
        console.log('getReferralGuides_PageListGuide error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const getPredefinedRoute_____PageNewDistribution = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request(
      'get',
      `/distribution/routesPredefined/${payload.routePredefinedId}`,
      {
        body: payload,
      },
    )
      .then((data) => {
        console.log(
          'getPredefinedRoute_PageListPredefinedRoutes resultado',
          data,
        );
        dispatch({
          type: SET_DELIVERIES_IN_ROUTE_PREDEFINED_____PAGE_NEW_DISTRIBUTION,
          payload: data.data,
        });

        // dispatch({
        //   type: SET_LIST_ROUTE_PREDEFINED,
        //   payload: data.response.payload,
        // });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getChildRoute error', error);
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
        dispatch({
          type: GET_BILL_PAGE_LISTGUIDE,
          payload: data.response.payload,
          request: payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getBillItems_pageListBill error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const registerNewDistribution_____PageNewDistribution = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('post', '/distribution/deliveryDistribution', {
      body: payload,
    })
      .then((data) => {
        console.log('getChildRoute resultado', data);
        // dispatch({
        //   type: SET_LIST_ROUTE_PREDEFINED,
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

export const getReceiptItems_pageListReceipt = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    console.log('/inventory/receipt/v1/list', {body: payload});
    API.post('tunexo', '/inventory/receipts/v1/list', {body: payload})
      .then((data) => {
        console.log('getReceiptItems_pageListReceipt resultado', data);
        dispatch({
          type: GET_RECEIPT_PAGE_LISTGUIDE,
          payload: data.response.payload,
          request: payload,
        });
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
        dispatch({
          type: GET_NOTE_PAGE_LISTGUIDE,
          payload: data.response.payload,
          request: payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getNoteItems_pageListNote error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const referralGuidesBatchConsult = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    console.log('/facturacion/consultReferralGuideStatus', {body: payload});
    request('post', '/facturacion/consultReferralGuideStatus', payload)
      // API.post('tunexo', '/facturacion/consultReferralGuideStatus', {
      //   body: payload,
      // })
      .then((data) => {
        console.log('referralGuidesBatchConsult resultado', data.data);
        dispatch({
          type: REFERRAL_GUIDES_BATCH_CONSULT,
          payload: data.data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('referralGuidesBatchConsult error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const cancelReferralGuide = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('post', '/facturacion/referralGuide/cancel', payload)
      // API.post('tunexo', '/facturacion/referralGuide/cancel', {
      //   body: payload,
      // })
      .then((data) => {
        console.log('cancelReferralGuide resultado', data.data);
        dispatch({
          type: CANCEL_REFERRAL_GUIDE,
          payload: data.data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('cancelReferralGuide error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const previsualizeBill = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('post', '/facturacion/bill/pdfPrevisualizer', payload)
      // API.post('tunexo', '/facturacion/bill/pdfPrevisualizer', {
      //   body: payload,
      // })
      .then((data) => {
        console.log('previsualizeBill resultado', data.data);
        dispatch({
          type: PREVISUALIZE_BILL,
          payload: data.data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('previsualizeBill error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const previsualizeReferralGuide = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('post', '/facturacion/referralGuide/pdfPrevisualizer', payload)
      // API.post('tunexo', '/facturacion/referralGuide/pdfPrevisualizer', {
      //   body: payload,
      // })
      .then((data) => {
        console.log('previsualizeReferralGuide resultado', data.data);
        dispatch({
          type: PREVISUALIZE_REFERRAL_GUIDE,
          payload: data.data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('previsualizeReferralGuide error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const proofMonitoring = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/proofMonitoring', {
      body: payload,
    })
      .then((data) => {
        console.log('proofMonitoring resultado', data);
        dispatch({
          type: PROOF_MONITORING,
          payload: data.response.payload,
          request: payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('proofMonitoring error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const registerTransaction = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('post', '/facturacion/updateProofTransactionDate', payload)
      // API.post('tunexo', '/facturacion/updateProofTransactionDate', {
      //   body: payload,
      // })
      .then((data) => {
        console.log('updateProofTransactionDate resultado', data.data);
        dispatch({
          type: REGISTER_TRANSACTION,
          payload: data.data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('updateProofTransactionDate error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const exportExcelTemplateToConsolidated = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/exportReceipts', {
      body: payload,
    })
      .then((data) => {
        console.log('exportExcelTemplateToConsolidated resultado', data);
        dispatch({
          type: GENERATE_EXCEL_TEMPLATE_TO_CONSOLIDATED,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS});
      })
      .catch((error) => {
        console.log('exportExcelTemplateToConsolidated error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
