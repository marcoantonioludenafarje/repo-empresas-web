const ubigeos = require('../../Utils/ubigeo.json');
import {
  GET_GLOBAL_PARAMETER,
  GET_BUSINESS_PLANS,
  GET_BUSINESS_PLAN,
  GET_BUSINESS_PARAMETER,
  GET_PRESIGNED,
  GET_DATA_BUSINESS,
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_VERIFICATION_CODE,
  SET_JWT_TOKEN,
  CANCEL_COMPLETE_BUSINESS,
  GET_ROL_USER,
  WEIGHT_BUSINESS,
  MONEY_UNIT_BUSINESS,
  MONEY_SYMBOL,
  UPGRADE_TO_NEW_PLAN,
  UPDATE_ALL_BUSINESS_PARAMETER,
  UPDATE_ROL_USER_FIRST_PLAN,
  UPDATE_DATA_BUSINESS,
  ACTUAL_DATE,
  GENERATE_EXCEL_TEMPLATE_TO_ROUTES,
  UPDATE_CATALOGS,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  list: [],
};

const generalReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_BUSINESS_PLANS:
      console.log('data de reducer GET_BUSINESS_PLANS', action.payload);
      return {
        ...state,
        getBusinessPlansRes: action.payload,
      };
    case GET_BUSINESS_PLAN:
      console.log('data de reducer GET_BUSINESS_PLAN', action.payload);
      return {
        ...state,
        getBusinessPlanRes: action.payload,
      };
    case GET_BUSINESS_PARAMETER:
      console.log('data de reducer GET_BUSINESS_PARAMETER', action.payload);
      return {
        ...state,
        businessParameter: action.payload,
      };
    case GET_PRESIGNED:
      console.log('data de reducer GET_PRESIGNED', action.payload);
      return {
        ...state,
        presigned: action.payload,
      };
    case GET_GLOBAL_PARAMETER:
      console.log('data de reducer GET_GLOBAL_PARAMETER', action.payload);
      return {
        ...state,
        globalParameter: action.payload,
      };
    case FETCH_SUCCESS:
      console.log('data de reducer FETCH_SUCCESS', action.payload);
      return {
        ...state,
        generalSuccess: action.payload,
      };
    case FETCH_ERROR:
      console.log('data de reducer FETCH_ERROR', action.payload);
      return {
        ...state,
        generalError: action.payload,
      };
    case GET_DATA_BUSINESS:
      console.log('data de reducer GET_DATA_BUSINESS', action.payload);
      return {
        ...state,
        dataBusinessRes: action.payload,
      };
    case UPDATE_DATA_BUSINESS:
      console.log('data de reducer UPDATE_DATA_BUSINESS', action.payload);
      return {
        ...state,
        updateBusinessRes: action.payload,
      };
    case GET_VERIFICATION_CODE:
      console.log('data de reducer GET_VERIFICATION_CODE', action.payload);
      return {
        ...state,
        verificationCodeRes: action.payload,
      };
    case CANCEL_COMPLETE_BUSINESS:
      console.log('data de reducer CANCEL_COMPLETE_BUSINESS', action.payload);
      return {
        ...state,
        cancelCompleteBusinessRes: action.payload,
      };
    case SET_JWT_TOKEN:
      console.log('data de reducer SET_JWT_TOKEN', action.payload);
      return {
        ...state,
        jwtToken: action.payload,
      };
    case GET_ROL_USER:
      console.log('data de reducer GET_ROL_USER', action.payload);
      return {
        ...state,
        getRolUserRes: action.payload,
      };
    case UPDATE_ROL_USER_FIRST_PLAN:
      console.log('data de reducer UPDATE_ROL_USER_FIRST_PLAN', action.payload);
      return {
        ...state,
        getRolUserRes: {
          ...getRolUserRes,
          merchantSelected: {
            ...getRolUserRes.merchantSelected,
            firstPlanDefault: false,
          },
        },
      };
    case WEIGHT_BUSINESS:
      console.log('data de reducer WEIGHT_BUSINESS', action.payload);
      return {
        ...state,
        weightBusiness: action.payload,
      };
    case MONEY_UNIT_BUSINESS:
      console.log('data de reducer MONEY_UNIT_BUSINESS', action.payload);
      return {
        ...state,
        moneyUnitBusiness: action.payload,
      };
    case MONEY_SYMBOL:
      console.log('data de reducer MONEY_SYMBOL', action.payload);
      return {
        ...state,
        moneySymbol: action.payload,
      };
    case ACTUAL_DATE:
      console.log('data de reducer ACTUAL_DATE', action.payload);
      return {
        ...state,
        actualDateRes: action.payload,
      };
    case UPGRADE_TO_NEW_PLAN:
      console.log('data de reducer UPGRADE_TO_NEW_PLAN', action.payload);
      return {
        ...state,
        upgradeToNewPlanRes: action.payload,
      };
    case UPDATE_ALL_BUSINESS_PARAMETER:
      console.log(
        'data de reducer UPDATE_ALL_BUSINESS_PARAMETER',
        action.payload,
      );
      return {
        ...state,
        updateAllBusinessParameterRes: action.payload,
      };
    case GENERATE_EXCEL_TEMPLATE_TO_ROUTES:
      console.log(
        'data de reducer GENERATE_EXCEL_TEMPLATE_TO_ROUTES',
        action.payload,
      );
      return {
        ...state,
        excelTemplateGeneratedToRouteRes: action.payload,
      };
    case UPDATE_CATALOGS:
      console.log('data de reducer UPDATE_CATALOGS', action.payload);
      return {
        ...state,
        updateCatalogsRes: action.payload,
      };
    default:
      return state;
  }
};

export default generalReducer;
