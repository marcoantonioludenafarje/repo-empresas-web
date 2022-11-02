import {
  GET_CARRIERS,
  FETCH_SUCCESS,
  FETCH_ERROR,
  NEW_CARRIER,
  DELETE_CARRIER,
  UPDATE_CARRIER,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  list: [],
};

const carriersReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CARRIERS:
      console.log('data de reducer GET_CARRIERS', action.payload);
      return {
        ...state,
        getCarriersRes: action.payload,
      };
    case NEW_CARRIER:
      console.log('data de reducer NEW_CARRIER', action.payload);
      return {
        ...state,
        newCarrierRes: action.payload,
      };
    case DELETE_CARRIER:
      console.log('data de reducer DELETE_CARRIER', action.payload);
      return {
        ...state,
        deleteCarrierRes: action.payload,
      };
    case UPDATE_CARRIER:
      console.log('data de reducer UPDATE_CARRIER', action.payload);
      return {
        ...state,
        updateCarrierRes: action.payload,
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

export default carriersReducer;
