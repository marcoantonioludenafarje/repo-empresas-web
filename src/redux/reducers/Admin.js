import {
    FETCH_SUCCESS,
    FETCH_ERROR,
    FETCH_START,
    UP_PRODUCTIVE,
    LIST_BUSINESS,
    ACTIVE_SUNAT,
    ABLE_BUSINESS,
    EXTEND_SUSCRIPTION,
  } from '../../shared/constants/ActionTypes';
  
  const INIT_STATE = {
    listBusin: [],
  };
  
  const adminReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
      case LIST_BUSINESS:
        console.log('data de reducer list business', action.payload);
        return {
          ...state,
          listBusinessRes: action.payload,
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
      case ABLE_BUSINESS:
        console.log('data reducer able business', action.payload);
        return{
          ...state,
          ableBusinessRes: action.payload
        }
      case ACTIVE_SUNAT:
        console.log('data reducer active sunat', action.payload);
        return{
          ...state,
          activeSunatres: action.payload
        }
      case UP_PRODUCTIVE:
        console.log('data reducer up productive', action.payload);
        return{
          ...state,
          upProductiveRes: action.payload
        }
      case EXTEND_SUSCRIPTION:
        console.log('data reducer extend suscription', action.payload);
        return{
          ...state,
          extendSuscripcionRes: action.payload
        }
    
      // case RESET_USER:
      //   return {
      //     list: [],
      //     listProducts: [],
      //   };
      default:
        return state;
    }
  };
  
  export default adminReducer;
  