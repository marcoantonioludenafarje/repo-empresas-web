import {
  FETCH_START,
  FETCH_SUCCESS,
  FETCH_ERROR,
  LIST_CAMPAIGN,
  CREATE_CAMPAIGN,
  DELETE_CAMPAIGN,
  UPDATE_CAMPAIGN,
  RESET_CAMPAIGNS,
  GENERATE_VARIATIONS,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  loading: false,
  process: '',
  successMessage: '',
  errorMessage: '',

  listVariations: [],
  listCampaigns: [],
  campaignsLastEvaluatedKey_pageListCampaigns: null,
};
const campaignsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case LIST_CAMPAIGN:
      console.log('actioncampaign1234', action);
      console.log('action.payload1234', action.payload);
      let request = action.request.request.payload;
      let lastEvaluatedKeyRequest = null;
      let items = [];
      let lastEvaluatedKey = '';

      if (request && request.LastEvaluatedKey) {
        // En estos casos hay que agregar al listado actual de items
        items = [...state.listCampaigns, ...action.payload.Items];
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
        listCampaigns: items,
        campaignsLastEvaluatedKey_pageListCampaigns: lastEvaluatedKey,
      };
    case CREATE_CAMPAIGN:
      console.log('data de reducer crear nueva campaña', action.payload);
      return {
        ...state,
        newCampaignRes: action.payload,
      };
    case DELETE_CAMPAIGN:
      console.log('data reduce DELETE CAMPAIGN', action.payload);
      return {
        ...state,
        deleteClientRes: action.payload,
      };
    case UPDATE_CAMPAIGN:
      console.log('data reducer UPdate CAMPAIGN', action.payload);
      return {
        ...state,
        updateClientRes: action.payload,
      };
    case FETCH_START:
      if (!action.payload || !action.payload.process) {
        action.payload = {process: 'LIST_CAMPAIGNS'};
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
    case GENERATE_VARIATIONS:
      console.log('Reducer variations', action.payload);
      return {
        ...state,
        listVariations: action.payload,
      };
    case RESET_CAMPAIGNS:
      return {
        successMessage: '',
        errorMessage: '',
        clientsLastEvalutedKey_pageListClients: null,
      };
    default:
      return state;
  }
};

export default campaignsReducer;
