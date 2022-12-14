import {
  GET_CLIENTS,
  NEW_CLIENT,
  DELETE_CLIENT,
  FETCH_SUCCESS,
  FETCH_ERROR,
  UPDATE_CLIENT,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  list: [],
  listClients: [],
};
const clientsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CLIENTS:
      console.log('data de reducer GET_CLIENTS', action.payload);
      return {
        ...state,
        listClients: action.payload,
      };
    case NEW_CLIENT:
      console.log('data de reducer NEW_CLIENT', action.payload);
      return {
        ...state,
        newClientRes: action.payload,
      };
    case DELETE_CLIENT:
      console.log('data de reducer DELETE_CLIENT', action.payload);
      return {
        ...state,
        deleteClientRes: action.payload,
      };
    case UPDATE_CLIENT:
      console.log('data de reducer UPDATE_CLIENT', action.payload);
      return {
        ...state,
        updateClientRes: action.payload,
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
    default:
      return state;
  }
};

export default clientsReducer;
