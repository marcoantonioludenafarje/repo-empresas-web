import {
  GET_CURRENT_MOVEMENTS_DOCUMENTS,
  FETCH_START,
  FETCH_SUCCESS,
  FETCH_ERROR,
} from '../../shared/constants/ActionTypes';
import API from '@aws-amplify/api';
import {request} from '../../@crema/utility/Utils';

export const getCurrentMovementsDocumentsBusiness = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    request(
      'post',
      '/facturacion/getCurrentMovementsDocumentsBusiness',
      payload,
    )
      // API.post('tunexo', '/facturacion/getCurrentMovementsDocumentsBusiness', {
      //   body: payload,
      // })
      .then((data) => {
        console.log(
          'getCurrentMovementsDocumentsBusiness resultado',
          data.data,
        );
        dispatch({
          type: GET_CURRENT_MOVEMENTS_DOCUMENTS,
          payload: data.data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getCurrentMovementsDocumentsBusiness error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
