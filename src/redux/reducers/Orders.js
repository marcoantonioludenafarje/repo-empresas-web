import {
  GET_ORDERS,
  NEW_ORDER,
  DELETE_ORDER,
  FETCH_SUCCESS,
  FETCH_ERROR,
  UPDATE_ORDER,
  CHANGE_STATUS_ORDER,
  RESET_ORDERS,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  list: [],
  listOrders: [],
};
const ordersReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ORDERS:
      console.log('data de reducer GET_ORDERS', action.payload);
      return {
        ...state,
        listOrders: action.payload,
      };
    case NEW_ORDER:
      console.log('data de reducer NEW_ORDER', action.payload);
      return {
        ...state,
        newOrderRes: action.payload,
      };
    case DELETE_ORDER:
      console.log('data de reducer DELETE_ORDER', action.payload);
      return {
        ...state,
        deleteOrderRes: action.payload,
      };
    case UPDATE_ORDER:
      console.log('data de reducer UPDATE_ORDER', action.payload);
      return {
        ...state,
        updateOrderRes: action.payload,
      };
    case CHANGE_STATUS_ORDER:
      console.log('data de reducer CHANGE_STATUS_ORDER', action.payload);
      return {
        ...state,
        changeStatusOrderRes: action.payload,
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
    case RESET_ORDERS:
      return {
        list: [],
        listOrders: [],
      };
    default:
      return state;
  }
};

export default ordersReducer;
