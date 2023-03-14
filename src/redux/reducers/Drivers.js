import {
  GET_DRIVERS,
  FETCH_SUCCESS,
  FETCH_ERROR,
  NEW_DRIVER,
  DELETE_DRIVER,
  UPDATE_DRIVER,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  list: [],
};

const driversReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DRIVERS:
      console.log('data de reducer GET_DRIVERS', action.payload);
      return {
        ...state,
        getDriversRes: action.payload,
      };
    case NEW_DRIVER:
      console.log('data de reducer NEW_DRIVER', action.payload);
      return {
        ...state,
        newDriverRes: action.payload,
      };
    case DELETE_DRIVER:
      console.log('data de reducer DELETE_DRIVER', action.payload);
      return {
        ...state,
        deleteDriverRes: action.payload,
      };
    case UPDATE_DRIVER:
      console.log('data de reducer UPDATE_DRIVER', action.payload);
      return {
        ...state,
        updateDriverRes: action.payload,
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

export default driversReducer;
