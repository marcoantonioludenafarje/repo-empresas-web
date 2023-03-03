import {
  GET_LOCATIONS,
  FETCH_SUCCESS,
  FETCH_ERROR,
  NEW_LOCATION,
  DELETE_LOCATION,
  UPDATE_LOCATION,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  list: [],
};

const locationsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LOCATIONS:
      console.log('data de reducer GET_LOCATIONS', action.payload);
      return {
        ...state,
        getLocationsRes: action.payload,
      };
    case NEW_LOCATION:
      console.log('data de reducer NEW_LOCATION', action.payload);
      return {
        ...state,
        newLocationRes: action.payload,
      };
    case DELETE_LOCATION:
      console.log('data de reducer DELETE_LOCATION', action.payload);
      return {
        ...state,
        deleteLocationRes: action.payload,
      };
    case UPDATE_LOCATION:
      console.log('data de reducer UPDATE_LOCATION', action.payload);
      return {
        ...state,
        updateLocationRes: action.payload,
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

export default locationsReducer;