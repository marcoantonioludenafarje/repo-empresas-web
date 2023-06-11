import {
  GET_CARRIERS,
  FETCH_SUCCESS,
  FETCH_ERROR,
  NEW_CARRIER,
  DELETE_CARRIER,
  UPDATE_CARRIER,
  RESET_CARRIERS,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  getCarriersRes: [],
  carriersLastEvaluatedKey_pageListCarriers: null,
};

const carriersReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CARRIERS:
      // console.log('data de reducer GET_CARRIERS', action.payload);
      // return {
      //   ...state,
      //   getCarriersRes: action.payload,
      // };
      console.log('actionLocation1234', action);
      console.log('action.payload1234', action.payload);
      let handleSortC = action.handleSort;
      if (handleSortC) {
        return {
          ...state,
          getCarriersRes: action.payload,
        };
      } else {
        let request = action.request.request.payload;
        let lastEvaluatedKeyRequest = null;
        let items = [];
        let lastEvaluatedKey = '';

        if (request && request.LastEvaluatedKey) {
          // En estos casos hay que agregar al listado actual de items
          items = [...state.getCarriersRes, ...action.payload.Items];
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
          getCarriersRes: items,
          carriersLastEvaluatedKey_pageListCarriers: lastEvaluatedKey,
        };
      }
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
    case RESET_CARRIERS:
      console.log('reseteando Reducer de Carriers');
      return {
        getCarriersRes: [],
        carriersLastEvaluatedKey_pageListCarriers: null,
      };
    default:
      return state;
  }
};

export default carriersReducer;
