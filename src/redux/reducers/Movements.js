import {
  ADD_INVOICE,
  GET_MOVEMENTS,
  GET_REFERRALGUIDE_PAGE_LISTGUIDE,
  GET_BILL_PAGE_LISTGUIDE,
  GET_RECEIPT_PAGE_LISTGUIDE,
  GET_NOTE_PAGE_LISTGUIDE,
  RES_ADD_MOVEMENT,
  GET_INVENTORY_PRODUCTS,
  ADD_MOVEMENT,
  FETCH_SUCCESS,
  FETCH_ERROR,
  UPDATE_MOVEMENT,
  DELETE_MOVEMENT,
  GENERATE_INVOICE,
  CANCEL_INVOICE,
  ADD_REFERRAL_GUIDE,
  ADD_CREDIT_NOTE,
  ADD_RECEIPT,
  GENERATE_ROUTE,
  LIST_ROUTE,
  GENERATE_DISTRIBUTION,
  LIST_DISTRIBUTION,
  TO_UPDATE_ITEM_IN_LIST_DISTRIBUTION,
  UPDATE_ROUTE,
  ROUTE_TO_REFERRAL_GUIDE,
  UPDATE_GENERATE_REFERRAL_GUIDE_VALUE,
  GET_CHILD_ROUTES,
  SET_DELIVERIES_SIMPLE,
  SET_LIST_ROUTE_PREDEFINED_____PAGE_NEW_DISTRIBUTION,
  SET_DELIVERIES_IN_ROUTE_PREDEFINED_____PAGE_NEW_DISTRIBUTION,
  SET_LIST_ROUTE_PREDEFINED_____PAGE_LIST_PREDEFINED_ROUTES,
  SET_DELIVERIES_IN_ROUTE_PREDEFINED_____PAGE_LIST_PREDEFINED_ROUTES,
  GENERATE_SELL_TICKET,
  REFERRAL_GUIDES_BATCH_CONSULT,
  CANCEL_REFERRAL_GUIDE,
  UPDATE_REFERRAL_GUIDE_ITEMS_PAGE_LIST,
  GET_INPUT_PAGE_LISTGUIDE,
  GET_OUTPUT_PAGE_LISTGUIDE,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
  list: [],
  getMovementsRes: [],
  predefinedRoutes_PageListPredefinedRoutes: [],
  lastEvaluatedKeys_PageListPredefinedRoutes: null,
  predefinedRoutes_PageNewDistribution: [],
  lastEvaluatedKeys_PageNewDistribution: null,
  selectedRoute_PageNewDistribution: null,
  selectedRoute_PageListPredefinedRoutes: null,
  referralGuideItems_pageListGuide: [],
  referralGuideLastEvalutedKey_pageListGuide: null,
  billItems_pageListBill: [],
  billLastEvalutedKey_pageListBill: null,
  receiptItems_pageListReceipt: [],
  receiptLastEvalutedKey_pageListReceipt: null,
  noteItems_pageListNote: [],
  noteLastEvalutedKey_pageListNote: null,
  inputItems_pageListInput: [],
  inputLastEvaluatedKey_pageListInput: null,
  outputItems_pageListOutput: [],
  outputLastEvaluatedKey_pageListOutput: null,
};

const movementsReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_MOVEMENTS:
      return {
        ...state,
        getMovementsRes: action.payload,
      };
    case GET_INPUT_PAGE_LISTGUIDE:
      console.log('actionProduct1234', action);
      console.log('action.payload1234', action.payload);
      let handleSortI = action.handleSort;
      if(handleSortI){
        return {
          ...state,
          inputItems_pageListInput: action.payload,
        };
      } else {
        let request = action.request.request.payload;
        let lastEvaluatedKeyRequest = null;
        let items = [];
        let lastEvaluatedKey = '';

        if (request && request.LastEvaluatedKey) {
          // En estos casos hay que agregar al listado actual de items
          items = [...state.inputItems_pageListInput, ...action.payload.Items];
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
          inputItems_pageListInput: items,
          inputLastEvaluatedKey_pageListInput: lastEvaluatedKey,
        };
      }
    case GET_OUTPUT_PAGE_LISTGUIDE:
      console.log('actionProduct1234', action);
      console.log('action.payload1234', action.payload);
      let handleSortO = action.handleSort;
      if(handleSortO){
        return {
          ...state,
          outputItems_pageListOutput: action.payload,
        };
      } else {
        let request = action.request.request.payload;
        let lastEvaluatedKeyRequest = null;
        let items = [];
        let lastEvaluatedKey = '';

        if (request && request.LastEvaluatedKey) {
          // En estos casos hay que agregar al listado actual de items
          items = [...state.outputItems_pageListOutput, ...action.payload.Items];
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
          outputItems_pageListOutput: items,
          outputLastEvaluatedKey_pageListOutput: lastEvaluatedKey,
        };
      }
    case GET_REFERRALGUIDE_PAGE_LISTGUIDE:
      // let itemsGR = [];
      // let lastEvaluatedKeyGR = '';
      // if (action.payload.callType !== 'firstTime') {
      //   itemsGR = [
      //     ...state.referralGuideItems_pageListGuide,
      //     ...action.payload.Items,
      //   ];
      //   lastEvaluatedKeyGR = action.payload.LastEvaluatedKey
      //     ? action.payload.LastEvaluatedKey
      //     : null;
      // }
      // return {
      //   ...state,
      //   referralGuideItems_pageListGuide: itemsGR,
      //   referralGuideLastEvalutedKey_pageListGuide: lastEvaluatedKeyGR,
      // };
      console.log('actionProduct1234', action);
      console.log('action.payload1234', action.payload);
      let handleSortRG = action.handleSort;
      if(handleSortRG){
        return {
          ...state,
          referralGuideItems_pageListGuide: action.payload,
        };
      } else {
        let request = action.request.request.payload;
        let lastEvaluatedKeyRequest = null;
        let items = [];
        let lastEvaluatedKey = '';

        if (request && request.LastEvaluatedKey) {
          // En estos casos hay que agregar al listado actual de items
          items = [...state.referralGuideItems_pageListGuide, ...action.payload.Items];
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
          referralGuideItems_pageListGuide: items,
          referralGuideLastEvalutedKey_pageListGuide: lastEvaluatedKey,
        };
      }
    case UPDATE_REFERRAL_GUIDE_ITEMS_PAGE_LIST:
      return {
        referralGuideItems_pageListGuide: action.payload,
      };
    case GET_BILL_PAGE_LISTGUIDE:
      // let itemsBL = [];
      // let lastEvaluatedKeyBL = '';
      // if (action.payload.callType !== 'firstTime') {
      //   itemsBL = [...state.billItems_pageListBill, ...action.payload.Items];
      //   lastEvaluatedKeyBL = action.payload.LastEvaluatedKey
      //     ? action.payload.LastEvaluatedKey
      //     : null;
      // }
      // return {
      //   ...state,
      //   billItems_pageListBill: itemsBL,
      //   billLastEvalutedKey_pageListBill: lastEvaluatedKeyBL,
      // };
      console.log('actionProduct1234', action);
      console.log('action.payload1234', action.payload);
      let handleSortBL = action.handleSort;
      if(handleSortBL){
        return {
          ...state,
          billItems_pageListBill: action.payload,
        };
      } else {
        let request = action.request.request.payload;
        let lastEvaluatedKeyRequest = null;
        let items = [];
        let lastEvaluatedKey = '';

        if (request && request.LastEvaluatedKey) {
          // En estos casos hay que agregar al listado actual de items
          items = [...state.billItems_pageListBill, ...action.payload.Items];
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
          billItems_pageListBill: items,
          billLastEvalutedKey_pageListBill: lastEvaluatedKey,
        };
      }
    case GET_RECEIPT_PAGE_LISTGUIDE:
      // let itemsRC = [];
      // let lastEvaluatedKeyRC = '';
      // if (action.payload.callType !== 'firstTime') {
      //   itemsRC = [
      //     ...state.receiptItems_pageListReceipt,
      //     ...action.payload.Items,
      //   ];
      //   lastEvaluatedKeyRC = action.payload.LastEvaluatedKey
      //     ? action.payload.LastEvaluatedKey
      //     : null;
      // }
      // return {
      //   ...state,
      //   receiptItems_pageListReceipt: itemsRC,
      //   receiptLastEvalutedKey_pageListReceipt: lastEvaluatedKeyRC,
      // };
      console.log('actionProduct1234', action);
      console.log('action.payload1234', action.payload);
      let handleSortRL = action.handleSort;
      if(handleSortRL){
        return {
          ...state,
          receiptItems_pageListReceipt: action.payload,
        };
      } else {
        let request = action.request.request.payload;
        let lastEvaluatedKeyRequest = null;
        let items = [];
        let lastEvaluatedKey = '';

        if (request && request.LastEvaluatedKey) {
          // En estos casos hay que agregar al listado actual de items
          items = [...state.receiptItems_pageListReceipt, ...action.payload.Items];
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
          receiptItems_pageListReceipt: items,
          receiptLastEvalutedKey_pageListReceipt: lastEvaluatedKey,
        };
      }
    case GET_NOTE_PAGE_LISTGUIDE:
      // let itemsNO = [];
      // let lastEvaluatedKeyNO = '';
      // if (action.payload.callType !== 'firstTime') {
      //   itemsNO = [...state.noteItems_pageListNote, ...action.payload.Items];
      //   lastEvaluatedKeyNO = action.payload.LastEvaluatedKey
      //     ? action.payload.LastEvaluatedKey
      //     : null;
      // }
      // return {
      //   ...state,
      //   noteItems_pageListNote: itemsNO,
      //   noteLastEvalutedKey_pageListNote: lastEvaluatedKeyNO,
      // };
      console.log('actionProduct1234', action);
      console.log('action.payload1234', action.payload);
      let handleSortNL = action.handleSort;
      if(handleSortNL){
        return {
          ...state,
          noteItems_pageListNote: action.payload,
        };
      } else {
        let request = action.request.request.payload;
        let lastEvaluatedKeyRequest = null;
        let items = [];
        let lastEvaluatedKey = '';

        if (request && request.LastEvaluatedKey) {
          // En estos casos hay que agregar al listado actual de items
          items = [...state.noteItems_pageListNote, ...action.payload.Items];
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
          noteItems_pageListNote: items,
          noteLastEvalutedKey_pageListNote: lastEvaluatedKey,
        };
      }
    case GET_INVENTORY_PRODUCTS:
      console.log('data de reducer GET_INVENTORY_PRODUCTS', action.payload);
      return {
        ...state,
        getInventoryProductsRes: action.payload,
      };
    case ADD_MOVEMENT:
      console.log('data de reducer ADD_MOVEMENT', action.payload);
      return {
        ...state,
        addMovementRes: action.payload,
      };
    case RES_ADD_MOVEMENT:
      console.log('data de reducer RES_ADD_MOVEMENT', action.payload);
      return {
        ...state,
        newMovementRes: action.payload,
      };
    case UPDATE_MOVEMENT:
      console.log('data de reducer UPDATE_MOVEMENT', action.payload);
      return {
        ...state,
        updateMovementRes: action.payload,
      };
    case DELETE_MOVEMENT:
      console.log('data de reducer DELETE_MOVEMENT', action.payload);
      return {
        ...state,
        deleteMovementRes: action.payload,
      };
    case GENERATE_INVOICE:
      console.log('data de reducer GENERATE_INVOICE', action.payload);
      return {
        ...state,
        generateInvoiceRes: action.payload,
      };
    case GENERATE_SELL_TICKET:
      console.log('data de reducer GENERATE_SELL_TICKET', action.payload);
      return {
        ...state,
        generateSellTicketRes: action.payload,
      };
    case ADD_INVOICE:
      console.log('data de reducer ADD_INVOICE', action.payload);
      return {
        ...state,
        addInvoiceRes: action.payload,
      };
    case CANCEL_INVOICE:
      console.log('data de reducer CANCEL_INVOICE', action.payload);
      return {
        ...state,
        cancelInvoiceRes: action.payload,
      };
    case ADD_REFERRAL_GUIDE:
      console.log('data de reducer ADD_REFERRAL_GUIDE', action.payload);
      return {
        ...state,
        addReferralGuideRes: action.payload,
      };
    case ADD_CREDIT_NOTE:
      console.log('data de reducer ADD_CREDIT_NOTE', action.payload);
      return {
        ...state,
        addCreditNoteRes: action.payload,
      };
    case ADD_RECEIPT:
      console.log('data de reducer ADD_RECEIPT', action.payload);
      return {
        ...state,
        addReceiptRes: action.payload,
      };
    case GENERATE_ROUTE:
      console.log('data de reducer GENERATE_ROUTE', action.payload);
      return {
        ...state,
        generateRouteRes: action.payload,
      };
    case UPDATE_ROUTE:
      console.log('data de reducer UPDATE_ROUTE', action.payload);
      return {
        ...state,
        updateRouteRes: action.payload,
      };
    case LIST_ROUTE:
      console.log('data de reducer LIST_ROUTE', action.payload);

      let newListRoute =
        action.payload && action.payload.Items ? action.payload.Items : [];
      if (action.request && action.request.request.payload.LastEvaluatedKey) {
        newListRoute = [...state.listRoute, ...newListRoute];
      }
      return {
        ...state,
        listRoute: newListRoute,
        LastEvaluatedKey:
          action.payload && action.payload.LastEvaluatedKey
            ? action.payload.LastEvaluatedKey
            : null,
      };

    case SET_DELIVERIES_SIMPLE:
      console.log('data de reducer SET_DELIVERIES_SIMPLE', action.payload);

      return {
        ...state,
        deliveries: action.payload,
      };

    case GET_CHILD_ROUTES:
      console.log('data de reducer GET_CHILD_ROUTES1234', action.payload);

      let deliveries = [];

      if (
        action.payload &&
        action.payload.Items &&
        action.payload.Items.length > 0
      ) {
        for (var i = 0; i < action.payload.Items.length; i++) {
          console.log('El i', i);
          console.log('action.payload123', action.payload);
          deliveries = [...deliveries, ...action.payload.Items[i].deliveries];
        }
      }

      return {
        ...state,
        deliveries,
        // childRoutes: (action.payload && action.payload.Items) ? action.payload.Items : [],
        // LastEvaluatedKeyChildRoute:
        //   action.payload && action.payload.LastEvaluatedKey
        //     ? action.payload.LastEvaluatedKey
        //     : null,
      };

    case LIST_DISTRIBUTION:
      console.log('data de reducer LIST_DISTRIBUTION', action.payload);
      return {
        ...state,
        listDistribution: action.payload,
      };

    case TO_UPDATE_ITEM_IN_LIST_DISTRIBUTION:
      console.log(
        'data de reducer TO_UPDATE_ITEM_IN_LIST_DISTRIBUTION',
        action.payload,
      );
      let indexDistribution = action.indexDistributionSelected;
      console.log('indexDistribution ahora si papu', indexDistribution);
      console.log('action.payload', action.payload);

      let newListDistributions = state.listDistribution;
      newListDistributions[indexDistribution].deliveries =
        action.payload.deliveries;
      // listDistribution[i].deliveries=
      return {
        ...state,
        listDistribution: newListDistributions,
      };

    case GENERATE_DISTRIBUTION:
      console.log('data de reducer GENERATE_DISTRIBUTION', action.payload);
      return {
        ...state,
        generateDistributionRes: action.payload,
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
    case ROUTE_TO_REFERRAL_GUIDE:
      console.log('data de reducer ROUTE_TO_REFERRAL_GUIDE', action.payload);
      return {
        ...state,
        routeToReferralGuide: action.payload,
      };
    case UPDATE_GENERATE_REFERRAL_GUIDE_VALUE:
      console.log(
        'data de reducer UPDATE_GENERATE_REFERRAL_GUIDE_VALUE',
        action.payload,
      );
      return {
        ...state,
        updateGenerateReferralGuideRes: action.payload,
      };

    case SET_LIST_ROUTE_PREDEFINED_____PAGE_NEW_DISTRIBUTION:
      console.log(
        'data de reducer SET_LIST_ROUTE_PREDEFINED_____PAGE_NEW_DISTRIBUTION',
        action.payload,
      );

      return {
        ...state,
        predefinedRoutes_PageNewDistribution: action.payload.Items,
        lastEvaluatedKeys_PageNewDistribution: action.payload.LastEvaluatedKey,
        // listRoute: action.payload.Items,
        // action.payload.Items
      };

    case SET_DELIVERIES_IN_ROUTE_PREDEFINED_____PAGE_NEW_DISTRIBUTION:
      let newItems = state.predefinedRoutes_PageNewDistribution;
      let item = newItems.filter(
        (item) => item.routePredefinedId == action.payload.routePredefinedId,
      );
      item[0].deliveries = action.payload.deliveries;
      console.log('Estamos actualizando el listRoute', newItems);
      return {
        ...state,
        predefinedRoutes_PageNewDistribution: newItems,
        // listRoute: newItems,
        selectedRoute_PageNewDistribution: action.payload,
      };

    case SET_LIST_ROUTE_PREDEFINED_____PAGE_LIST_PREDEFINED_ROUTES:
      console.log(
        'data de reducer SET_LIST_ROUTE_PREDEFINED_____PAGE_NEW_DISTRIBUTION',
        action.payload,
      );

      return {
        ...state,
        predefinedRoutes_PageListPredefinedRoutes: action.payload.Items,
        lastEvaluatedKeys_PageListPredefinedRoutes:
          action.payload.LastEvaluatedKey,
        // listRoute: action.payload.Items,
        // action.payload.Items
      };

    case SET_DELIVERIES_IN_ROUTE_PREDEFINED_____PAGE_LIST_PREDEFINED_ROUTES:
      return {
        ...state,

        selectedRoute_PageListPredefinedRoutes: action.payload,
      };

    case REFERRAL_GUIDES_BATCH_CONSULT:
      return {
        ...state,
        referralGuidesBatchConsultRes: action.payload,
      };

    case CANCEL_REFERRAL_GUIDE:
      return {
        ...state,
        cancelReferralGuideRes: action.payload,
      };
    // case SET_LIST_ROUTE_PREDEFINED_____PAGE_LIST_PREDEFINED_ROUTES:
    //   console.log(
    //     'data de reducer SET_LIST_ROUTE_PREDEFINED',
    //     action.payload,
    //   );
    //   // let items = []
    //   return {
    //     ...state,
    //     predefinedRoutes_PageListPredefinedRoutes,
    //     lastEvaluatedKeys_PageListPredefinedRoutes
    //   };

    // case SET_ROUTE_PREDEFINED_TO_UPDATE_____PAGE_LIST_PREDEFINED_ROUTES:
    //   console.log(
    //     'data de reducer SET_LIST_ROUTE_PREDEFINED',
    //     action.payload,
    //   );
    //   // let items = []
    //   return {
    //     ...state,
    //     predefinedRoutes_PageListPredefinedRoutes,
    //     lastEvaluatedKeys_PageListPredefinedRoutes
    //   };

    default:
      return state;
  }
};

export default movementsReducer;
