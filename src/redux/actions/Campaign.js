import {
  CREATE_CAMPAIGN,
  LIST_CAMPAIGN,
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
          payload: 'Se ha registrado la información correctamente',
        });
      })
      .catch((error) => {
        console.log('Nueva campaña error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};

export const getCampaigns = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START, payload: {process: 'LIST_CAMPAIGN'}});

    API.post('tunexo', '/inventory/campaings/list', {body: payload})
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
