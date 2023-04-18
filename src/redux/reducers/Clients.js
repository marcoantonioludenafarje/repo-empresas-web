import {
  GET_CLIENTS,
  NEW_CLIENT,
  DELETE_CLIENT,
  FETCH_SUCCESS,
  FETCH_ERROR,
  UPDATE_CLIENT,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  list: [],
  listClients: [],
  clientsLastEvalutedKey_pageListClients: null,
};
const clientsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CLIENTS:
      console.log("action.payload1234", action.payload)
      let request = action.request.request.payload
      let lastEvaluatedKeyRequest = null 
      let items= [];
      let lastEvaluatedKey = "";

      if(request && request.LastEvaluatedKey){
        // En estos casos hay que agregar al listado actual de items
        items = [...state.listClients, ...action.payload.Items];
        lastEvaluatedKey = action.payload.LastEvaluatedKey ? action.payload.LastEvaluatedKey : null


      }else{
        // En estos casos hay que setear con lo que venga
        items = action.payload.Items;
        lastEvaluatedKey = action.payload.LastEvaluatedKey ? action.payload.LastEvaluatedKey : null

      
      }

      return {
        ...state,
        listClients: items, 
        clientsLastEvalutedKey_pageListClients: lastEvaluatedKey
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

export default clientsReducer;
