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
} from '../../shared/constants/ActionTypes';
import API from '@aws-amplify/api';

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
export const createPresigned = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/utility/getPresignedUrl', {body: payload})
      .then((data) => {
        console.log('createPresigned resultado', data);
        dispatch({
          type: GET_PRESIGNED,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: data.response.status});
      })
      .catch((error) => {
        console.log('createPresigned error', error);
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
        dispatch({type: FETCH_SUCCESS, payload: data.response.status});
      })
      .catch((error) => {
        console.log('uploadFile error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
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
