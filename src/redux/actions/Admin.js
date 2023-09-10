import {
    FETCH_ERROR,
    FETCH_START,
    FETCH_SUCCESS,
    LIST_BUSINESS,
    UP_PRODUCTIVE,
    ACTIVE_SUNAT,
    ABLE_BUSINESS
  } from '../../shared/constants/ActionTypes';
  import API from '@aws-amplify/api';

  export const getListBusiness = (payload) =>{
    return (dispatch, getState) => {
        dispatch({type: FETCH_START});
        API.post('tunexo', '/business/administrative/listbusiness', {body: payload})
          .then((data) => {
            console.log('listbusiness resultado', data);
            dispatch({type: LIST_BUSINESS, payload: data.response.payload});
            dispatch({type: FETCH_SUCCESS, payload: 'success'});
          })
          .catch((error) => {
            console.log('listbusiness error', error);
            dispatch({type: FETCH_ERROR, payload: error.message});
          });
      };
  };

  export const upgradeProductive = (payload) =>{
    return (dispatch, getState) => {
        dispatch({type: FETCH_START});
        API.post('tunexo', '/business/administrative/listbusiness', {body: payload})
          .then((data) => {
            console.log('up productive resultado', data);
            dispatch({type: UP_PRODUCTIVE, payload: data.response.payload});
            dispatch({type: FETCH_SUCCESS, payload: 'success'});
          })
          .catch((error) => {
            console.log('up productive error', error);
            dispatch({type: FETCH_ERROR, payload: error.message});
          });
      };
  };

  export const activeSunat = (payload) =>{
    return (dispatch, getState) => {
        dispatch({type: FETCH_START});
        API.post('tunexo', '/business/administrative/listbusiness', {body: payload})
          .then((data) => {
            console.log('activeSunat resultado', data);
            dispatch({type: ACTIVE_SUNAT, payload: data.response.payload});
            dispatch({type: FETCH_SUCCESS, payload: 'success'});
          })
          .catch((error) => {
            console.log('activeSunat error', error);
            dispatch({type: FETCH_ERROR, payload: error.message});
          });
      };
  };

  export const extendSuscriptionBusiness = (payload) =>{
    return (dispatch, getState) => {
        dispatch({type: FETCH_START});
        API.post('tunexo', '/business/administrative/extendSucription', {body: payload})
          .then((data) => {
            console.log('extendSuscriptionBusiness resultado', data);
            dispatch({type: EXTEND_SUSCRIPTION, payload: data.response.payload});
            dispatch({type: FETCH_SUCCESS, payload: 'success'});
          })
          .catch((error) => {
            console.log('activeSunat error', error);
            dispatch({type: FETCH_ERROR, payload: error.message});
          });
      };
  };

  export const ableBusiness = (payload) =>{
    return (dispatch, getState) => {
        dispatch({type: FETCH_START});
        API.post('tunexo', '/business/administrative/changestatusbusiness', {body: payload})
          .then((data) => {
            console.log('ableBusiness resultado', data);
            dispatch({type: ABLE_BUSINESS, payload: data.response.payload});
            dispatch({type: FETCH_SUCCESS, payload: 'success'});
          })
          .catch((error) => {
            console.log('ableBusiness error', error);
            dispatch({type: FETCH_ERROR, payload: error.message});
          });
      };
  };

