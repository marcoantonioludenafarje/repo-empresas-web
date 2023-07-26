import {
    LIST_SALES,
    FETCH_SUCCESS,
    FETCH_ERROR,
    NEW_SALE,
    DELETE_SALE,
    UPDATE_SALE,
    RESET_SALES,
} from '../../shared/constants/ActionTypes';

const INIT_STATE = {
    list: [],
    listSalesRes: [],
    salesLastEvaluatedKey_pageListSales: null,
};

const salesReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case LIST_SALES:
            console.log('actionSales1234', action);
            console.log('action.payload1234', action.payload);
            let handleSortS = action.handleSort;
            if (handleSortS) {
                return {
                    ...state,
                    listSalesRes: action.payload,
                };
            } else {
                let request = action.request.request.payload;
                let lastEvaluatedKeyRequest = null;
                let items = [];
                let lastEvaluatedKey = '';

                if (request && request.LastEvaluatedKey) {
                    // En estos casos hay que agregar al listado actual de items
                    items = [...state.listSalesRes, ...action.payload.Items];
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
                    listSalesRes: items,
                    salesLastEvaluatedKey_pageListSales: lastEvaluatedKey,
                };
            }
        case NEW_SALE:
            console.log('data de reducer NEW_SALE', action.payload);
            return {
                ...state,
                newSaleRes: action.payload,
            };
        case DELETE_SALE:
            console.log('data de reducer DELETE_SALE', action.payload);
            return {
                ...state,
                deleteSaleRes: action.payload,
            };
        case UPDATE_SALE:
            console.log('data de reducer UPDATE_SALE', action.payload);
            return {
                ...state,
                updateSaleRes: action.payload,
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
        case RESET_SALES:
            return {
                list: [],
                listSalesRes: [],
                salesLastEvaluatedKey_pageListSales: null,
            };
        default:
            return state;
    }
};

export default salesReducer;
