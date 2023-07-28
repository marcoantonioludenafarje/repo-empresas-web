import {
  CREATE_CAMPAIGN,
  LIST_CAMPAIGN,
  UPDATE_CAMPAIGN,
  DELETE_CAMPAIGN,
  FETCH_START,
  FETCH_SUCCESS,
  FETCH_ERROR,
} from '../../shared/constants/ActionTypes';

import API from '@aws-amplify/api';

export const newCampaign = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'CREATE_CAMPAIGN'}});
    API.post('tunexo', '/inventory/campaigns/register', {body: payload})
      .then((data) => {
        console.log('Nueva campaña resultado', data);
        dispatch({type: CREATE_CAMPAIGN, payload: data.response.payload});
        dispatch({
          type: FETCH_SUCCESS,
          payload: 'Se ha registrado la campaña correctamente',
        });
      })
      .catch((error) => {
        console.log('Nueva campaña error', error);
        dispatch({type: FETCH_ERROR, payload: 'Error al crear la campaña'});
      });
  };
};

export const getCampaigns = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'LIST_CAMPAIGN'}});

    API.post('tunexo', '/inventory/campaigns/list', {body: payload})
      .then((data) => {
        console.log('get CAMPAÑAAS resultado', data);
        dispatch({
          type: LIST_CAMPAIGN,
          payload: data.response.payload,
          request: payload,
        });
        dispatch({
          type: FETCH_SUCCESS,
          payload: 'Listado de campañas exitoso',
        });
      })
      .catch((error) => {
        console.log('campañas error', error);

        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};

export const deleteCampaigns = (payload) => {
  return async (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'DELETE_CAMPAIGN'}});
    try {
      const data = await API.post('tunexo', '/inventory/campaigns/delete', {
        body: payload,
      });
      console.log('se borro la campaña', data);
      dispatch({
        type: DELETE_CAMPAIGN,
        payload: data.response.payload,
        request: payload,
      });
      dispatch({
        type: FETCH_SUCCESS,
        payload: 'Campaña eliminada exitosamente',
      });
    } catch (error) {
      console.log('Error al borrar', error);
      dispatch({
        type: FETCH_ERROR,
        payload: 'Error al borrar',
      });
    }
  };
};

export const updateCampaigns = (payload) => {
  return async (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'UPDATE_CAMPAIGNS'}});
    try {
      const data = await API.post('tunexo', '/inventory/campaigns/update', {
        body: payload,
      });
      console.log('Campaña data update', data);
      dispatch({type: UPDATE_CAMPAIGN, payload: data.response.payload});
      dispatch({type: FETCH_SUCCESS, payload: 'success'});
    } catch (error) {
      console.log('Update error campaña', data);
      dispatch({type: FETCH_ERROR, payload: 'error'});
    }
  };
};
