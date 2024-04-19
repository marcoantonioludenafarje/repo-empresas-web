import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  DELETE_OBJECT,
  GET_DATA,
  GENERATE_PRESIGNED,
  CHANGE_NAME_OBJECT,
  DOWNLOAD_ZIP,
  UPLOAD_FILE,
  RESET_FILEEXPLORER,
  COLLATE_RECORDS_AND_GUIDES,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  list: [],
  collateRecordsAndGuidesRes: "",
};

const dataReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case COLLATE_RECORDS_AND_GUIDES:
      console.log('url del collate', action.payload);
      return {
        ...state,
        collateRecordsAndGuidesRes: action.payload.message
      }
    case GET_DATA:
      console.log('data de reducer GET_DATA', action.payload);
      return {
        ...state,
        getDataRes: action.payload,
      };
    case GENERATE_PRESIGNED:
      console.log('data de reducer GENERATE_PRESIGNED', action.payload);
      return {
        ...state,
        getPresignedRes: action.payload,
      };
    case UPLOAD_FILE:
      console.log('data de reducer UPLOAD_FILE', action.payload);
      return {
        ...state,
        uploadFileRes: action.payload,
      };
    case DELETE_OBJECT:
      console.log('data de reducer DELETE_OBJECT', action.payload);
      return {
        ...state,
        deleteObjectRes: action.payload,
      };
    case CHANGE_NAME_OBJECT:
      console.log('data de reducer CHANGE_NAME_OBJECT', action.payload);
      return {
        ...state,
        changeNameObjectRes: action.payload,
      };
    case DOWNLOAD_ZIP:
      console.log('data de reducer DOWNLOAD_ZIP', action.payload);
      return {
        ...state,
        downloadZipRes: action.payload,
      };
    case FETCH_SUCCESS:
      console.log('data de reducer FETCH_SUCCESS', action.payload);
      return {
        ...state,
        successMessage: action.payload,
      };
    case FETCH_ERROR:
      console.log('data de reducer FETCH_ERROR', action.payload);
      return {
        ...state,
        errorMessage: action.payload,
      };
    case RESET_FILEEXPLORER:
      return {
        list: [],
      };
    default:
      return state;
  }
};

export default dataReducer;
