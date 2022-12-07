import {
  GET_USER_DATA,
  FETCH_SUCCESS,
  FETCH_ERROR,
  USER_ATTRIBUTES,
  GET_USER,
  EMAIL_TO_SEND_CODE,
  REGISTER_USER,
  LIST_ROL,
  LIST_USER,
  UPDATE_USER,
  GET_SHOP_PRODUCTS,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  list: [],
  listProducts: [],
};

const userReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SHOP_PRODUCTS:
      console.log('data de reducer GET_SHOP_PRODUCTS', action.payload);
      return {
        ...state,
        getShopProductRes: action.payload,
      };
    case GET_USER_DATA:
      console.log('data de reducer GET_USER_DATA', action.payload);
      return {
        ...state,
        userDataRes: action.payload,
      };
    case USER_ATTRIBUTES:
      console.log('data de reducer USER_ATTRIBUTES', action.payload);
      return {
        ...state,
        userAttributes: action.payload,
      };
    case GET_USER:
      console.log('data de reducer GET_USER', action.payload);
      return {
        ...state,
        user: action.payload,
      };
    case EMAIL_TO_SEND_CODE:
      console.log('data de reducer EMAIL_TO_SEND_CODE', action.payload);
      return {
        ...state,
        emailToSendCode: action.payload,
      };
    case REGISTER_USER:
      console.log('data de reducer REGISTER_USER', action.payload);
      return {
        ...state,
        registerUserRes: action.payload,
      };
    case LIST_ROL:
      console.log('data de reducer LIST_ROL', action.payload);
      return {
        ...state,
        listRolRes: action.payload,
      };
    case LIST_USER:
      console.log('data de reducer LIST_USER', action.payload);
      return {
        ...state,
        listUserRes: action.payload,
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
    case UPDATE_USER:
      console.log('data de reducer UPDATE_USER', action.payload);
      return {
        ...state,
        updateUserRes: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
