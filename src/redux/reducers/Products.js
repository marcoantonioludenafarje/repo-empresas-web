import {
  PRODUCE_PRODUCT,
  GET_PRODUCTS,
  ADD_PRODUCT,
  DELETE_PRODUCT,
  UPDATE_PRODUCT,
  GET_CATEGORIES,
  ALL_PRODUCTS,
  FETCH_SUCCESS,
  FETCH_ERROR,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  list: [],
  listProducts: [],
  allProductsRes: [],
  productsLastEvaluatedKey_pageListProducts: null,
};

const productsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PRODUCTS:
      console.log('data de reducer GET_PRODUCTS', action.payload);
      return {
        ...state,
        listProducts: action.payload,
      };
    case ADD_PRODUCT:
      console.log('data de reducer ADD_PRODUCT', action.payload);
      return {
        ...state,
        addProductResponse: action.payload,
      };
    case DELETE_PRODUCT:
      console.log('data de reducer DELETE_PRODUCT', action.payload);
      return {
        ...state,
        deleteProductRes: action.payload,
      };
    case UPDATE_PRODUCT:
      console.log('data de reducer UPDATE_PRODUCT', action.payload);
      return {
        ...state,
        updateProductRes: action.payload,
      };
    case GET_CATEGORIES:
      console.log('data de reducer GET_CATEGORIES', action.payload);
      return {
        ...state,
        getCategoriesRes: action.payload,
      };
    case PRODUCE_PRODUCT:
      console.log('data de reducer PRODUCE_PRODUCT', action.payload);
      return {
        ...state,
        produceProductRes: action.payload,
      };
    case ALL_PRODUCTS:
      console.log('actionProduct1234', action);
      console.log('action.payload1234', action.payload);
      let handleSort = action.handleSort;
      if(handleSort){
        return {
          ...state,
          allProductsRes: action.payload,
        };
      } else {
        let request = action.request.request.payload;
        let lastEvaluatedKeyRequest = null;
        let items = [];
        let lastEvaluatedKey = '';

        if (request && request.LastEvaluatedKey) {
          // En estos casos hay que agregar al listado actual de items
          items = [...state.allProductsRes, ...action.payload.Items];
          lastEvaluatedKey = action.payload.LastEvaluatedKey
            ? action.payload.LastEvaluatedKey
            : null;
        } else {
          // En estos casos hay que setear con lo que venga
          items = action.payload.Items;
          lastEvaluatedKey = action.payload.LastEvaluatedKey
            ? action.payload.LastEvaluatedKey
            : null;
        }

        return {
          ...state,
          allProductsRes: items,
          productsLastEvaluatedKey_pageListProducts: lastEvaluatedKey,
        };
      }
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

export default productsReducer;
