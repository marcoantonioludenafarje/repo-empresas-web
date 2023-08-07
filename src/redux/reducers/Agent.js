import {
  FETCH_START,
  FETCH_SUCCESS,
  FETCH_ERROR,
  LIST_AGENT,
  CREATE_AGENT,
  DELETE_AGENT,
  UPDATE_AGENT,
  ONCHANGE_QR_AGENT,
  RESET_AGENTS,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  loading: false,
  process: '',
  successMessage: '',
  errorMessage: '',

  listAgents: [],
  agentsLastEvaluatedKey_pageListAgents: null,
};
const agentsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case LIST_AGENT:
      console.log('actionAGENT1234', action);
      console.log('action.payload1234', action.payload);
      let request = action.request.request.payload;
      let lastEvaluatedKeyRequest = null;
      let items = [];
      let lastEvaluatedKey = '';

      if (request && request.LastEvaluatedKey) {
        // En estos casos hay que agregar al listado actual de items
        items = [...state.listAgents, ...action.payload.Items];
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
        listAgents: items,
        agentsLastEvaluatedKey_pageListAgents: lastEvaluatedKey,
      };
    case CREATE_AGENT:
      console.log('data de reducer crear nuevo agente', action.payload);
      return {
        ...state,
        newAgentRes: action.payload,
      };
    case DELETE_AGENT:
      console.log('data reduce DELETE AGENT', action.payload);
      return {
        ...state,
        deleteAgentRes: action.payload,
      };
    case UPDATE_AGENT:
      console.log('data reducer UPdate AGENT', action.payload);
      return {
        ...state,
        updateAgentRes: action.payload,
      };
    case ONCHANGE_QR_AGENT:
      console.log('data reducer Onchange AGENT', action.payload);
      return {
        ...state,
        onChangeQRAgentRes: action.payload,
      };
    case FETCH_START:
      if (!action.payload || !action.payload.process) {
        action.payload = {process: 'LIST_AGENT'};
      }

      return {
        ...state,
        // error: '',
        loading: true,
        process: action.payload.process,
      };
    case FETCH_SUCCESS:
      console.log('data de reducer FETCH_SUCCESS', action.payload);
      return {
        ...state,
        loading: false,
        successMessage: action.payload,
      };
    case FETCH_ERROR:
      console.log('data de reducer FETCH_ERROR', action.payload);

      return {
        ...state,
        errorMessage: action.payload,
      };
    case RESET_AGENTS:
      return {
        successMessage: '',
        errorMessage: '',
        clientsLastEvalutedKey_pageListClients: null,
      };
    default:
      return state;
  }
};

export default agentsReducer;
