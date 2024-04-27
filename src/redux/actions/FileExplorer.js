import {
  GET_DATA,
  CHANGE_NAME_OBJECT,
  GENERATE_PRESIGNED,
  UPLOAD_FILE,
  DOWNLOAD_ZIP,
  DELETE_OBJECT,
  FETCH_START,
  FETCH_SUCCESS,
  FETCH_ERROR,
  COLLATE_RECORDS_AND_GUIDES,
} from '../../shared/constants/ActionTypes';
import API from '@aws-amplify/api';

export const getData = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/utility/listObjectsPathMerchant', {body: payload})
      .then((data) => {
        console.log('getData resultado', data);
        dispatch({type: GET_DATA, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('getData error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const generatePresigned = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/utility/preSignAnyPathMerchant', {body: payload})
      .then((data) => {
        console.log('generatePresigned resultado', data);
        dispatch({type: GENERATE_PRESIGNED, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('generatePresigned error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const collateRecordsAndGuides = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/utility/distribution/consolidatedPdf', {body: payload})
      .then((data) => {
        console.log('collateRecordsAndGuides resultado', data);
        dispatch({
          type: COLLATE_RECORDS_AND_GUIDES,
          payload: data.response.payload,
        });
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('collateRecordsAndGuides error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const uploadFile = (url, data) => {
  return async (dispatch) => {
    dispatch({type: FETCH_START});
    await fetch(url, {method: 'PUT', body: data})
      .then((data) => {
        console.log('uploadFile resultado', data);
        dispatch({type: UPLOAD_FILE, payload: data});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('uploadFile error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const deleteObject = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/utility/deleteObjectsPathMerchant', {body: payload})
      .then((data) => {
        console.log('deleteObject resultado', data);
        dispatch({type: DELETE_OBJECT, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('deleteObject error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const changeNameObject = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/utility/changeNameObjectsPathMerchant', {
      body: payload,
    })
      .then((data) => {
        console.log('changeNameObject resultado', data);
        dispatch({type: CHANGE_NAME_OBJECT, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('changeNameObject error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
export const downloadZip = (payload) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_START});
    API.post('tunexo', '/utility/generateZipObjectsPathMerchant', {
      body: payload,
    })
      .then((data) => {
        console.log('downloadZip resultado', data);
        dispatch({type: DOWNLOAD_ZIP, payload: data.response.payload});
        dispatch({type: FETCH_SUCCESS, payload: 'success'});
      })
      .catch((error) => {
        console.log('downloadZip error', error);
        dispatch({type: FETCH_ERROR, payload: 'error'});
      });
  };
};
