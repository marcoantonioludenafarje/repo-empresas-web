// utils/AppContext.js
import React, {createContext, useReducer} from 'react';
import {UPDATE_NOTIFICATION_LIST} from '../shared/constants/ActionTypes';
import PropTypes from 'prop-types';
const initialState = {
  // Define el estado inicial de tu aplicación aquí
  // ...
  updateNotificationListRes: 0,
};

const AppContext = createContext();

const appReducer = (state, action) => {
  // Implementa tus acciones y actualizaciones de estado aquí
  // ...
  switch (action.type) {
    case UPDATE_NOTIFICATION_LIST:
      console.log(
        'data de reducer AppContext UPDATE_NOTIFICATION_LIST',
        action.payload,
      );
      return {
        ...state,
        updateNotificationListRes: action.payload,
      };
    default:
      return state;
  }
};

const AppProvider = ({children}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{state, dispatch}}>
      {children}
    </AppContext.Provider>
  );
};
AppProvider.propTypes = {
  children: PropTypes.node,
};

export {AppContext, AppProvider};
