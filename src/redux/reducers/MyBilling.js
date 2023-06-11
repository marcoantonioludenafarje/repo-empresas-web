import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_CURRENT_MOVEMENTS_DOCUMENTS,
  RESET_MYBILLING,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  list: [],
};

const dataReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CURRENT_MOVEMENTS_DOCUMENTS:
      console.log(
        'data de reducer GET_CURRENT_MOVEMENTS_DOCUMENTS',
        action.payload,
      );
      return {
        ...state,
        currentMovementsDocuments: action.payload,
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
    case RESET_MYBILLING:
      return {
        list: [],
      };
    default:
      return state;
  }
};

export default dataReducer;
