import {
  GET_FINANCES,
  ALL_FINANCES,
  ADD_FINANCE,
  DELETE_FINANCE,
  UPDATE_FINANCE,
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_FINANCES_FOR_RESULT_STATE,
  EXPORT_EXCEL_MOVEMENTS_DETAILS,
  EXPORT_EXCEL_MOVEMENTS_SUMMARY,
  RESET_FINANCES,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  list: [],
  allFinancesRes: [],
  financesLastEvaluatedKey_pageListFinances: null,
};

const financesReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_FINANCES:
      console.log('data de reducer GET_FINANCES', action.payload);
      return {
        ...state,
        getFinancesRes: action.payload,
      };
    case ALL_FINANCES:
      console.log('actionProduct1234', action);
      console.log('action.payload1234', action.payload);
      console.log('Se está ejecutando ALL_FINANCES reducer');
      let handleSortFinances = action.handleSort;
      if (handleSortFinances) {
        return {
          ...state,
          allFinancesRes: action.payload,
        };
      } else {
        let request = action.request.request.payload;
        let lastEvaluatedKeyRequest = null;
        let items = [];
        let lastEvaluatedKey = '';

        if (request && request.LastEvaluatedKey) {
          // En estos casos hay que agregar al listado actual de items
          items = [...state.allFinancesRes, ...action.payload.Items];
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
          allFinancesRes: items,
          financesLastEvaluatedKey_pageListFinances: lastEvaluatedKey,
        };
      }
    case GET_FINANCES_FOR_RESULT_STATE:
      console.log(
        'data de reducer GET_FINANCES_FOR_RESULT_STATE',
        action.payload,
      );
      return {
        ...state,
        getFinancesForResultStateRes: action.payload,
      };
    case ADD_FINANCE:
      console.log('data de reducer ADD_FINANCE', action.payload);
      return {
        ...state,
        addFinanceRes: action.payload,
      };
    case DELETE_FINANCE:
      console.log('data de reducer DELETE_FINANCE', action.payload);
      return {
        ...state,
        deleteFinanceRes: action.payload,
      };
    case UPDATE_FINANCE:
      console.log('data de reducer UPDATE_FINANCE', action.payload);
      return {
        ...state,
        updateFinanceRes: action.payload,
      };
    case EXPORT_EXCEL_MOVEMENTS_DETAILS:
      console.log(
        'data de reducer EXPORT_EXCEL_MOVEMENTS_DETAILS',
        action.payload,
      );
      return {
        ...state,
        exportExcelMovementsDetailsRes: action.payload,
      };
    case EXPORT_EXCEL_MOVEMENTS_SUMMARY:
      console.log(
        'data de reducer EXPORT_EXCEL_MOVEMENTS_SUMMARY',
        action.payload,
      );
      return {
        ...state,
        exportExcelMovementsSummaryRes: action.payload,
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
    case RESET_FINANCES:
      return {
        list: [],
        allFinancesRes: [],
        financesLastEvaluatedKey_pageListFinances: null,
      };
    default:
      return state;
  }
};

export default financesReducer;
