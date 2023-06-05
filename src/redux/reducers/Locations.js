import {
  GET_LOCATIONS,
  FETCH_SUCCESS,
  FETCH_ERROR,
  NEW_LOCATION,
  DELETE_LOCATION,
  UPDATE_LOCATION,
  RESET_LOCATIONS,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  list: [],
  getLocationsRes: [],
  locationsLastEvaluatedKey_pageListLocations: null,
};

const locationsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LOCATIONS:
      // console.log('data de reducer GET_LOCATIONS', action.payload);
      // return {
      //   ...state,
      //   getLocationsRes: action.payload,
      // };
      console.log('actionLocation1234', action);
      console.log('action.payload1234', action.payload);
      let handleSortL = action.handleSort;
      if (handleSortL) {
        return {
          ...state,
          getLocationsRes: action.payload,
        };
      } else {
        let request = action.request.request.payload;
        let lastEvaluatedKeyRequest = null;
        let items = [];
        let lastEvaluatedKey = '';

        if (request && request.LastEvaluatedKey) {
          // En estos casos hay que agregar al listado actual de items
          items = [...state.getLocationsRes, ...action.payload.Items];
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
          getLocationsRes: items,
          locationsLastEvaluatedKey_pageListLocations: lastEvaluatedKey,
        };
      }
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
    case RESET_LOCATIONS:
      return {
        list: [],
        getLocationsRes: [],
        locationsLastEvaluatedKey_pageListLocations: null,
      };
    default:
      return state;
  }
};

export default locationsReducer;
