import {
  GET_FINANCES,
  ADD_FINANCE,
  DELETE_FINANCE,
  UPDATE_FINANCE,
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_FINANCES_FOR_RESULT_STATE,
  EXPORT_EXCEL_MOVEMENTS_DETAILS,
  EXPORT_EXCEL_MOVEMENTS_SUMMARY,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  list: [],
};

const financesReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_FINANCES:
      console.log('data de reducer GET_FINANCES', action.payload);
      return {
        ...state,
        getFinancesRes: action.payload,
      };
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
      console.log('data de reducer EXPORT_EXCEL_MOVEMENTS_DETAILS', action.payload);
      return {
        ...state,
        exportExcelMovementsDetailsRes: action.payload,
      };
    case EXPORT_EXCEL_MOVEMENTS_SUMMARY:
      console.log('data de reducer EXPORT_EXCEL_MOVEMENTS_SUMMARY', action.payload);
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
    default:
      return state;
  }
};

export default financesReducer;
