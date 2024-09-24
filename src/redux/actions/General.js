import {
  FETCH_START,
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_GLOBAL_PARAMETER,
  GET_BUSINESS_PARAMETER,
  GET_BUSINESS_PLANS,
  GET_BUSINESS_PLAN,
  GET_PRESIGNED,
  GET_DATA_BUSINESS,
  GET_VERIFICATION_CODE,
  CANCEL_COMPLETE_BUSINESS,
  GET_ROL_USER,
  UPGRADE_TO_NEW_PLAN,
  UPDATE_ALL_BUSINESS_PARAMETER,
  UPDATE_NOTIFICATION_BUSINESS_PARAMETER,
  UPDATE_ROL_USER_FIRST_PLAN,
  UPDATE_DATA_BUSINESS,
  ACTUAL_DATE,
  GENERATE_EXCEL_TEMPLATE_TO_ROUTES,
  GENERATE_EXCEL_TEMPLATE_TO_BULK_LOAD,
  GENERATE_EXCEL_TEMPLATE_TO_REFERRALGUIDES,
  GENERATE_EXCEL_TEMPLATE_TO_BILLS,
  GENERATE_EXCEL_TEMPLATE_TO_RECEIPTS,
  GENERATE_EXCEL_TEMPLATE_TO_NOTES,
  GENERATE_EXCEL_TEMPLATE_TO_CLIENTS,
  GENERATE_EXCEL_TEMPLATE_TO_PROVIDERS,
  UPDATE_CATALOGS,
  DELETE_CATALOGS,
  GET_CLIENTS_PRESIGNED,
  GET_IMAGE_PRESIGNED,
  CUSTOMIZE_PDF,
  VALIDATE_SUNAT,
  SEND_TUNEXO_CREDENTIALS,
} from '../../shared/constants/ActionTypes';
import API from '@aws-amplify/api';
import {request} from '../../@crema/utility/Utils';

import {
  requestSendCredentials,
  sunatValidateRequest,
} from '../../@crema/utility/Utils';
export const onGetBusinessParameter = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/utility/businessParameter/list', {body: payload})
      .then((data) => {
        console.log('onGetBusinessParameter resultado', data);
        dispatch({
          type: GET_BUSINESS_PARAMETER,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS});
      })
      .catch((error) => {
        console.log('onGetBusinessParameter error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const onGetGlobalParameter = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/utility/globalParameter/list', {body: payload})
      .then((data) => {
        console.log('onGetGlobalParameter resultado', data);
        dispatch({
          type: GET_GLOBAL_PARAMETER,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS});
      })
      .catch((error) => {
        console.log('onGetGlobalParameter error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const createPresigned = (payload, file) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    const key = payload?.request?.payload.name;
    API.post('tunexo', '/utility/getPresignedUrl', {body: payload})
      .then(async (data) => {
        data.response.payload.response.payload.name = key;
        console.log('createPresigned resultado', data);
        dispatch({
          type: GET_PRESIGNED,
          payload: data.response.payload.response.payload,
        });
        let newPresigned = {...data?.response?.payload.response.payload};
        newPresigned.name = key;
        console.log('newPresigned json', newPresigned);
        // dispatch({type: FETCH_SUCCESS, payload: data.response.status});
        await dispatch(uploadFileByPresign(newPresigned?.presignedS3Url, file));
      })
      .catch((error) => {
        console.log('createPresigned error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const createImagePresigned = (payload, file) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    const key = payload?.request?.payload.name;
    console.log('newImage', key);
    API.post('tunexo', '/utility/preSignAnyPathMerchant', {body: payload})
      .then(async (data) => {
        data.response.payload.response.payload.name = key;
        console.log('createImagePresigned resultado', data);
        dispatch({
          type: GET_IMAGE_PRESIGNED,
          payload: data.response.payload.response.payload,
        });
        let newPresigned = {...data?.response?.payload.response.payload};
        newPresigned.name = key;
        console.log('newImagePresigned json', newPresigned);
        // dispatch({type: FETCH_SUCCESS, payload: data.response.status});
        console.log('newImagePresigned', file);
        await dispatch(uploadFileByPresign(newPresigned?.presignedS3Url, file));
      })
      .catch((error) => {
        console.log('createImagePresigned error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const createClientsPresigned = (payload, file) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    const key = payload?.request?.payload.name;
    API.post('tunexo', '/utility/getPresignedUrl', {body: payload})
      .then(async (data) => {
        data.response.payload.response.payload.name = key;
        console.log('createClientsPresigned resultado', data);
        dispatch({
          type: GET_CLIENTS_PRESIGNED,
          payload: data.response.payload.response.payload,
        });
        let newPresigned = {...data?.response?.payload.response.payload};
        newPresigned.name = key;
        console.log('newClientsPresigned json', newPresigned);
        // dispatch({type: FETCH_SUCCESS, payload: data.response.status});
        await dispatch(uploadFileByPresign(newPresigned?.presignedS3Url, file));
      })
      .catch((error) => {
        console.log('createClientsPresigned error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const getDataBusiness = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/business/get', {body: payload})
      .then((data) => {
        console.log('getDataBusiness resultado', data);
        dispatch({
          type: GET_DATA_BUSINESS,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: data.response.status});
      })
      .catch((error) => {
        console.log('getDataBusiness error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const updateDataBusiness = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/business/update', {body: payload})
      .then((data) => {
        console.log('updateDataBusiness resultado', data);
        dispatch({
          type: UPDATE_DATA_BUSINESS,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: data.response.status});
      })
      .catch((error) => {
        console.log('updateDataBusiness error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const uploadFile = (payload, url) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post(url, {body: payload})
      .then((data) => {
        console.log('uploadFile resultado', data);
        dispatch({
          type: GET_PRESIGNED,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('uploadFile error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const uploadFileByPresign = (url, file) => {
  return async (dispatch) => {
    dispatch({type: FETCH_START});
    console.log('image', url, 'filesImages', file);
    await fetch(url, {
      method: 'PUT',
      body: file.image,
    })
      .then((response) => response.json())
      .then((json) => {
        console.log('Cuál es el json de uploadFileByPresign', json);
        dispatch({type: FETCH_SUCCESS});
      })
      .catch((err) => {
        //dispatch({type: FETCH_ERROR, payload: err.message || err});
        console.log('uploadImage error', err);
      });
  };
};
export const getVerificationCode = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/business/get', {body: payload})
      .then((data) => {
        console.log('getVerificationCode resultado', data);
        dispatch({
          type: GET_VERIFICATION_CODE,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: data.response.status});
      })
      .catch((error) => {
        console.log('getVerificationCode error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const cancellCompleteBusiness = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/business/get', {body: payload})
      .then((data) => {
        console.log('cancellCompleteBusiness resultado', data);
        dispatch({
          type: CANCEL_COMPLETE_BUSINESS,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: data.response.status});
      })
      .catch((error) => {
        console.log('cancellCompleteBusiness error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const getRolUser = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/new/user/getRolInventory', {body: payload})
      .then((data) => {
        console.log('getRolUser resultado', data);
        dispatch({
          type: GET_ROL_USER,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: data.response.status});
      })
      .catch((error) => {
        console.log('getRolUser error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const upgradeToNewPlan = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/business/upgradeBusinessToNewPlan', {body: payload})
      .then((data) => {
        console.log('upgradeToNewPlan resultado', data);
        dispatch({
          type: UPGRADE_TO_NEW_PLAN,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: data.response.status});
      })
      .catch((error) => {
        console.log('upgradeToNewPlan error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const onGetBusinessPlans = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/business/plan/list', {body: payload})
      .then((data) => {
        console.log('onGetBusinessPlans resultado', data);
        dispatch({
          type: GET_BUSINESS_PLANS,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS});
      })
      .catch((error) => {
        console.log('onGetBusinessPlans error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const onGetBusinessPlan = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/business/plan/get', {body: payload})
      .then((data) => {
        console.log('onGetBusinessPlan resultado', data);
        dispatch({
          type: GET_BUSINESS_PLAN,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS});
      })
      .catch((error) => {
        console.log('onGetBusinessPlan error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const updateAllBusinessParameter = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/parameters/update', {body: payload})
      .then((data) => {
        console.log('updateAllBusinessParameter resultado', data);
        dispatch({
          type: UPDATE_ALL_BUSINESS_PARAMETER,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('updateAllBusinessParameter error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const updateNotificationBusinessParameter = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/notifications/update', {body: payload})
      .then((data) => {
        console.log('updateNotificationBusinessParameter resultado', data);
        dispatch({
          type: UPDATE_NOTIFICATION_BUSINESS_PARAMETER,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: data.status.success});
      })
      .catch((error) => {
        console.log('updateNotificationBusinessParameter error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const exportExcelTemplateToGenerateRoute = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('post', '/facturacion/exportExcelTemplateToGenerateRoute', payload)
      // API.post('tunexo', '/facturacion/exportExcelTemplateToGenerateRoute', {
      //   body: payload,
      // })
      .then((data) => {
        console.log('onExportExcelTemplateToGenerateRoute resultado', data);
        dispatch({
          type: GENERATE_EXCEL_TEMPLATE_TO_ROUTES,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS});
      })
      .catch((error) => {
        console.log('onExportExcelTemplateToGenerateRoute error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const exportExcelTemplateToBulkLoad = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/utility/exportExcelTemplateToBulkLoad', {
      body: payload,
    })
      .then((data) => {
        console.log('onExportExcelTemplateToBulkLoad resultado', data);
        dispatch({
          type: GENERATE_EXCEL_TEMPLATE_TO_BULK_LOAD,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS});
      })
      .catch((error) => {
        console.log('onExportExcelTemplateToBulkLoad error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const updateCatalogs = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/parameter/catalog', {body: payload})
      .then((data) => {
        console.log('updateCatalogs resultado', data);
        dispatch({
          type: UPDATE_CATALOGS,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('updateCatalogs error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const deleteCatalogs = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/parameter/deleteCatalogs', {body: payload})
      .then((data) => {
        console.log('deleteCatalog resultado', data);
        dispatch({
          type: DELETE_CATALOGS,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('deleteCatalogs error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const actualDate = () => {
  return (dispatch) => dispatch({type: ACTUAL_DATE});
};

export const exportExcelTemplateToReferralGuides = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/exportReferralGuides', {
      body: payload,
    })
      .then((data) => {
        console.log('exportExcelTemplateToReferralGuides resultado', data);
        dispatch({
          type: GENERATE_EXCEL_TEMPLATE_TO_REFERRALGUIDES,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS});
      })
      .catch((error) => {
        console.log('exportExcelTemplateToReferralGuides error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const exportExcelTemplateToBills = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/exportBills', {
      body: payload,
    })
      .then((data) => {
        console.log('exportExcelTemplateToBills resultado', data);
        dispatch({
          type: GENERATE_EXCEL_TEMPLATE_TO_BILLS,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS});
      })
      .catch((error) => {
        console.log('exportExcelTemplateToBills error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const exportExcelTemplateToReceipts = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/exportReceipts', {
      body: payload,
    })
      .then((data) => {
        console.log('exportExcelTemplateToReceipts resultado', data);
        dispatch({
          type: GENERATE_EXCEL_TEMPLATE_TO_RECEIPTS,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS});
      })
      .catch((error) => {
        console.log('exportExcelTemplateToReceipts error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const exportExcelTemplateToNotes = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/exportNotes', {
      body: payload,
    })
      .then((data) => {
        console.log('exportExcelTemplateToNotes resultado', data);
        dispatch({
          type: GENERATE_EXCEL_TEMPLATE_TO_NOTES,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS});
      })
      .catch((error) => {
        console.log('exportExcelTemplateToNotes error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const exportExcelTemplateToClients = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/exportClients', {
      body: payload,
    })
      .then((data) => {
        console.log('exportExcelTemplateToClients resultado', data);
        dispatch({
          type: GENERATE_EXCEL_TEMPLATE_TO_CLIENTS,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS});
      })
      .catch((error) => {
        console.log('exportExcelTemplateToClients error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const exportExcelTemplateToProviders = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/inventory/exportProviders', {
      body: payload,
    })
      .then((data) => {
        console.log('exportExcelTemplateToProviders resultado', data);
        dispatch({
          type: GENERATE_EXCEL_TEMPLATE_TO_PROVIDERS,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS});
      })
      .catch((error) => {
        console.log('exportExcelTemplateToProviders error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const customizePdf = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request('post', '/facturacion/customizePdf', payload)
      // API.post('tunexo', '/facturacion/customizePdf', {
      //   body: payload,
      // })
      .then((data) => {
        console.log('customizePdf resultado', data);
        dispatch({
          type: CUSTOMIZE_PDF,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('customizePdf error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const validateSUNAT = (payload) => {
  return (dispatch, getState) => {
    //dispatch({type: FETCH_START, payload: {process: 'VALIDATE_SUNAT'}});
    sunatValidateRequest(payload.type, payload.nro)
      .then((data) => {
        console.log('validateSUNAT resultado', data);
        dispatch({
          type: VALIDATE_SUNAT,
          payload: data.data,
          request: payload,
        });
        // dispatch({
        //   type: FETCH_SUCCESS,
        //   payload: {
        //     process: 'VALIDATE_SUNAT',
        //     message: 'Validar sunat',
        //   },
        // });
      })
      .catch((error) => {
        console.log('validateSUNAT error', error);
        //dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const onSendTunexoCredentials = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    requestSendCredentials('post', '', {
      ...payload,
    })
      .then((data) => {
        console.log('onSendTunexoCredentials resultado', data);
        dispatch({
          type: SEND_TUNEXO_CREDENTIALS,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS});
      })
      .catch((error) => {
        console.log('onSendTunexoCredentials error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
