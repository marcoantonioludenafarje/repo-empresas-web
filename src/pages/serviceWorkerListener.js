import React, {useContext, useEffect} from 'react';
import {AppContext} from '../Utils/AppContext';
import {UPDATE_NOTIFICATION_LIST} from '../shared/constants/ActionTypes';
const ServiceWorkerListener = () => {
  const {dispatch} = useContext(AppContext);

  useEffect(() => {
    const handleServiceWorkerMessage = (event) => {
      // Manejar los mensajes recibidos del service worker
      // y realizar las acciones necesarias en tu aplicación
      const randomNumber = Math.floor(Math.random() * (10000 - 1)) + 1;
      dispatch({type: 'UPDATE_NOTIFICATION_LIST', payload: randomNumber});
      localStorage.setItem('updateNotification', randomNumber);
      console.log('actualizando notificaciones');
    };
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener(
        'message',
        handleServiceWorkerMessage,
      );
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener(
          'message',
          handleServiceWorkerMessage,
        );
      }
    };
  }, []);

  return null;
};

export default ServiceWorkerListener;
