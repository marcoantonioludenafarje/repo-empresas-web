import {
  GET_PROVIDERS,
  NEW_PROVIDER,
  FETCH_SUCCESS,
  FETCH_ERROR,
  DELETE_PROVIDER,
  UPDATE_PROVIDER,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  list: [],
  listProviders: [],
  providersLastEvalutedKey_pageListProviders: null,
};

const providersReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PROVIDERS:
      console.log('data de reducer GET_PROVIDERS', action.payload);
      let items = [];
      let lastEvaluatedKey = '';
      if (action.payload.callType !== 'firstTime') {
        items = [...state.listProviders, ...action.payload.Items];
        lastEvaluatedKey = action.payload.LastEvaluatedKey
          ? action.payload.LastEvaluatedKey
          : null;
      }
      return {
        ...state,
        listProviders: items,
        providersLastEvalutedKey_pageListProviders: lastEvaluatedKey,
      };
    case NEW_PROVIDER:
      console.log('data de reducer NEW_PROVIDER', action.payload);
      return {
        ...state,
        newProviderRes: action.payload,
      };
    case DELETE_PROVIDER:
      console.log('data de reducer DELETE_PROVIDER', action.payload);
      return {
        ...state,
        deleteProviderRes: action.payload,
      };
    case UPDATE_PROVIDER:
      console.log('data de reducer UPDATE_PROVIDER', action.payload);
      return {
        ...state,
        updateProviderRes: action.payload,
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

export default providersReducer;
