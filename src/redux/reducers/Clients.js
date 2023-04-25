import {
  GET_CLIENTS,
  NEW_CLIENT,
  DELETE_CLIENT,
  FETCH_START,
  FETCH_SUCCESS,
  FETCH_ERROR,
  UPDATE_CLIENT,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  loading: false,
  process: '',
  successMessage: '',
  errorMessage: '',

  list: [],
  listClients: [],
  clientsLastEvalutedKey_pageListClients: null,
};
const clientsReducer = (state = INIT_STATE, action) => {
  console.log('El action', action);

  switch (action.type) {
    case GET_CLIENTS:
      console.log('action.payload1234', action.payload);
      let request = action.request.request.payload;
      let lastEvaluatedKeyRequest = null;
      let items = [];
      let lastEvaluatedKey = '';

      if (request && request.LastEvaluatedKey) {
        // En estos casos hay que agregar al listado actual de items
        items = [...state.listClients, ...action.payload.Items];
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
        listClients: items,
        clientsLastEvalutedKey_pageListClients: lastEvaluatedKey,
      };
    case NEW_CLIENT:
      console.log('data de reducer NEW_CLIENT', action.payload);
      return {
        ...state,
        newClientRes: action.payload,
      };
    case DELETE_CLIENT:
      console.log('data de reducer DELETE_CLIENT', action.payload);
      return {
        ...state,
        deleteClientRes: action.payload,
      };
    case UPDATE_CLIENT:
      console.log('data de reducer UPDATE_CLIENT', action.payload);
      return {
        ...state,
        updateClientRes: action.payload,
      };
    case FETCH_START:
      if (!action.payload || !action.payload.process) {
        action.payload = {process: 'LIST_CLIENTS'};
      }
      return {
        ...state,
        // error: '',
        loading: true,
        process: action.payload.process,
      };

    case FETCH_SUCCESS:
      if (!action.payload || !action.payload.process) {
        action.payload = {process: 'LIST_CLIENTS', message: 'Exito'};
      }
      console.log('data de reducer FETCH_SUCCESS', action.payload);
      return {
        ...state,
        loading: false,
        // successMessage: action.payload,
        process: action.payload.process,
        successMessage: action.payload.message,
      };
    case FETCH_ERROR:
      console.log('data de reducer FETCH_ERROR', action.payload);
      if (!action.payload || !action.payload.process) {
        action.payload = {process: 'LIST_CLIENTS', message: 'Error'};
      }

      return {
        ...state,
        // errorMessage: action.payload,
        loading: false,
        process: action.payload.process,
        errorMessage: action.payload.message,
      };
    default:
      return state;
  }
};

export default clientsReducer;
