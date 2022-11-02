import {
  NEW_REQUEST,
  FETCH_SUCCESS,
  FETCH_ERROR,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  list: [],
  listRequests: [],
};

const requestsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case NEW_REQUEST:
      console.log('data de reducer NEW_REQUEST', action.payload);
      return {
        ...state,
        newRequestRes: action.payload,
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

export default requestsReducer;
