import {
    FETCH_START,
    FETCH_SUCCESS,
    FETCH_ERROR,
    CREATE_SPECIALIST,
    LIST_SPECIALIST,
    DELETE_SPECIALIST,
    UPDATE_SPECIALIST,
    RESET_SPECIALIST,
  } from '../../shared/constants/ActionTypes';
  
  const INIT_STATE = {
    loading: false,
    process: '',
    successMessage: '',
    errorMessage: '',
  
    listSpecialists: [],
    specialistsLastEvaluatedKey_pageListSpecialists: null,
  };
  const specialistsReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case LIST_SPECIALIST:
        console.log('actionSPECIALIST1234', action);
        console.log('action.payload1234', action.payload);
        let request = action.request.request.payload;
        let lastEvaluatedKeyRequest = null;
        let items = [];
        let lastEvaluatedKey = '';
  
        if (request && request.LastEvaluatedKey) {
          // En estos casos hay que agregar al listado actual de items
          items = [...state.listSpecialists, ...action.payload.Items];
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
          listSpecialists: items,
          specialistsLastEvaluatedKey_pageListSpecialists: lastEvaluatedKey,
        };
      case CREATE_SPECIALIST:
        console.log('data de reducer crear nuevo especialista', action.payload);
        return {
          ...state,
          newSpecialistRes: action.payload,
        };
      case DELETE_SPECIALIST:
        console.log('data reduce DELETE SPECIALIST', action.payload);
        return {
          ...state,
          deleteSpecialistRes: action.payload,
        };
      case UPDATE_SPECIALIST:
        console.log('data reducer UPdate SPECIALIST', action.payload);
        return {
          ...state,
          updateSpecialistRes: action.payload,
        };
      case FETCH_START:
        if (!action.payload || !action.payload.process) {
          action.payload = {process: 'LIST_SPECIALIST'};
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
      case RESET_SPECIALIST:
        return {
          successMessage: '',
          errorMessage: '',
          clientsLastEvalutedKey_pageListClients: null,
        };
      default:
        return state;
    }
  };
  
  export default specialistsReducer;
  