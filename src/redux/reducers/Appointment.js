import {
  FETCH_START,
  FETCH_SUCCESS,
  FETCH_ERROR,
  LIST_APPOINTMENT,
  CREATE_APPOINTMENT,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  loading: false,
  process: '',
  successMessage: '',
  errorMessage: '',

  listAppointments: [],
  campaignsLastEvaluatedKey_pageListCampaigns: null,
};
const appointmentsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case LIST_APPOINTMENT:
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
    case CREATE_APPOINTMENT:
      console.log('data de reducer crear nueva cita', action.payload);
      return {
        ...state,
        newCampaignRes: action.payload,
      };

    case FETCH_START:
      if (!action.payload || !action.payload.process) {
        action.payload = {process: 'LIST_APPOINTMENT'};
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
    //   case RESET_APPOINTMENT:
    //     return {
    //       successMessage: '',
    //       errorMessage: '',
    //       clientsLastEvalutedKey_pageListClients: null,
    //     };
    default:
      return state;
  }
};

export default appointmentsReducer;
