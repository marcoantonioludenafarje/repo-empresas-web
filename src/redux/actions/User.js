import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  GET_USER_DATA,
  USER_ATTRIBUTES,
  EMAIL_TO_SEND_CODE,
  REGISTER_USER,
  GET_USER,
  LIST_ROL,
  LIST_USER,
  UPDATE_USER,
  GET_SHOP_PRODUCTS,
  ACTIVE_USER,
} from '../../shared/constants/ActionTypes';
import API from '@aws-amplify/api';
import {request} from '../../@crema/utility/Utils';
import {request2} from '../../@crema/utility/Utils';
export const getShopProducts = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request2('post', '/gofast/products/list', payload)
      .then((data) => {
        console.log('getShopProducts resultado', data);
        console.log('getShopProducts resultado', data.response.payload);
        dispatch({type: GET_SHOP_PRODUCTS, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getShopProducts error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const getUserData = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    /* request('post', '/new/user/getUserInventory', payload) */
    API.post('tunexo', '/new/user/getUserInventory', {body: payload})
      .then((data) => {
        console.log('getUserData resultado', data.response.payload);
        dispatch({type: GET_USER_DATA, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getUserData error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const registerUser = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/new/user/registerUserInventory', {body: payload})
      .then((data) => {
        console.log('registerUser resultado', data);
        dispatch({type: REGISTER_USER, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('registerUser error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const listRol = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/new/user/listRolInventory', {body: payload})
      .then((data) => {
        console.log('listRol resultado', data);
        dispatch({type: LIST_ROL, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('listRol error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const listUser = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/new/user/listUserInventory', {body: payload})
      .then((data) => {
        console.log('listUser resultado', data);
        dispatch({type: LIST_USER, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('listUser error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const updateUser = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/new/user/updateUserInventory', {body: payload})
      .then((data) => {
        console.log('updateUser resultado', data);
        dispatch({type: UPDATE_USER, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('updateUser error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};
export const getUserAttributes = (attributes) => {
  return (dispatch) => dispatch({type: USER_ATTRIBUTES, payload: attributes});
};
export const getUser = (user) => {
  return (dispatch) => dispatch({type: GET_USER, payload: user});
};
export const getEmailToSendCode = (email) => {
  return (dispatch) => dispatch({type: EMAIL_TO_SEND_CODE, payload: email});
};

export const updateActive = (payload) => {
  console.log('confeti >>', payload);
  return (dispatch) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/business/administrative/changestatususer', {
      body: payload,
    })
      .then((data) => {
        console.log('indactive actions', data);
        dispatch({type: ACTIVE_USER, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('indactive actions error', error);
        dispatch({tpye: FETCH_ERROR, payload: error.message});
      });
  };
};

export const changeRol = (payload) => {
  console.log('confeti >>', payload);
  return (dispatch) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/business/administrative/changeroluser', {
      body: payload,
    })
      .then((data) => {
        console.log('rol actions', data);
        dispatch({type: CHANGE_ROL, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('rol actions error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};


export const changeWarehouses = (payload) => {
  console.log('confeti >>', payload);
  return (dispatch) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/business/administrative/assignwarehousestouser', {
      body: payload,
    })
      .then((data) => {
        console.log('rol actions', data);
        // dispatch({type: CHANGE_ROL, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('rol actions error', error);
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};



