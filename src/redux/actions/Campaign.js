import {
  CREATE_CAMPAIGN,
  LIST_CAMPAIGN,
  UPDATE_CAMPAIGN,
  DELETE_CAMPAIGN,
  FETCH_START,
  FETCH_SUCCESS,
  FETCH_ERROR,
  GENERATE_VARIATIONS,
} from '../../shared/constants/ActionTypes';

import API from '@aws-amplify/api';
import {request3} from '../../@crema/utility/Utils';

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
      const data = await API.post('tunexo', '/inventory/campaigns/cancel', {
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

export const generateVariations = (payload) => {
  return async (dispatch) => {
    dispatch({type: FETCH_START, payload: {process: 'GENERATE_VARIATIONS'}});
    console.log('variations payload', payload);
    try {
      const data = await API.post('tunexo', '/inventory/generate', {
        body: payload,
      });
      console.log('Variations>>', data);
      dispatch({type: GENERATE_VARIATIONS, payload: data.response.payload});
      dispatch({type: FETCH_SUCCESS, payload: 'success'});
      return data.response.payload;
    } catch (error) {
      console.log('ERROR ACTION VARIATION', error);
      dispatch({type: FETCH_ERROR, payload: 'error'});
    }
  };
};

export const getCampaign = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request3('get', `/inventory/campaigns/${payload.campaignId}`, {
      body: payload,
    })
      .then((data) => {
        console.log('getCampaignMicroservice resultado', data);
        dispatch({
          type: GET_CAMPAIGN,
          payload: data.data,
        });

        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getCampaign error', error);
      });
  };
};

export const newCampaign2 = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'CREATE_CAMPAIGN'}});
    request3('post', `/inventory/campaigns`, {
      body: payload,
    })
      .then((data) => {
        console.log('Nueva campaña resultado', data);
        dispatch({type: CREATE_CAMPAIGN, payload: data.data});
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

export const getCampaigns2 = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'LIST_CAMPAIGN'}});

    request3('get', `/inventory/campaigns`, {
      body: payload,
    })
      .then((data) => {
        console.log('get CAMPAÑAAS resultado', data);
        dispatch({
          type: LIST_CAMPAIGN,
          payload: data.data,
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

export const deleteCampaigns2 = (payload) => {
  return async (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'DELETE_CAMPAIGN'}});
    try {
      const data = await request3(
        'delete',
        `/inventory/campaigns/${payload.campaignId}`,
        {
          body: payload,
        },
      );
      console.log('se borro la campaña', data);
      dispatch({
        type: DELETE_CAMPAIGN,
        payload: data.data,
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

export const updateCampaigns2 = (payload) => {
  return async (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'UPDATE_CAMPAIGNS'}});
    try {
      const data = await request3('put', '/inventory/campaigns', {
        body: payload,
      });
      console.log('Campaña data update', data);
      dispatch({type: UPDATE_CAMPAIGN, payload: data.data});
      dispatch({type: FETCH_SUCCESS, payload: 'success'});
    } catch (error) {
      console.log('Update error campaña', data);
      dispatch({type: FETCH_ERROR, payload: 'error'});
    }
  };
};
