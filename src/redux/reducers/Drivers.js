import {
  GET_DRIVERS,
  FETCH_SUCCESS,
  FETCH_ERROR,
  NEW_DRIVER,
  DELETE_DRIVER,
  UPDATE_DRIVER,
  RESET_DRIVERS,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  list: [],
  getDriversRes: [],
  driversLastEvaluatedKey_pageListDrivers: null,
};

const driversReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_DRIVERS:
      // console.log('data de reducer GET_DRIVERS', action.payload);
      // return {
      //   ...state,
      //   getDriversRes: action.payload,
      // };
      console.log('actionLocation1234', action);
      console.log('action.payload1234', action.payload);
      let handleSortD = action.handleSort;
      if (handleSortD) {
        return {
          ...state,
          getDriversRes: action.payload,
        };
      } else {
        let request = action.request.request.payload;
        let lastEvaluatedKeyRequest = null;
        let items = [];
        let lastEvaluatedKey = '';

        if (request && request.LastEvaluatedKey) {
          // En estos casos hay que agregar al listado actual de items
          items = [...state.getDriversRes, ...action.payload.Items];
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
          getDriversRes: items,
          driversLastEvaluatedKey_pageListDrivers: lastEvaluatedKey,
        };
      }
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
    case RESET_DRIVERS:
      return {
        list: [],
        getDriversRes: [],
        driversLastEvaluatedKey_pageListDrivers: null,
      };
    default:
      return state;
  }
};

export default driversReducer;
