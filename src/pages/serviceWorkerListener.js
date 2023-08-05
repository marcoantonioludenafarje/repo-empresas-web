import React, {useContext, useEffect} from 'react';
//import {AppContext} from '../Utils/AppContext';
import {useDispatch} from 'react-redux';
import {UPDATE_NOTIFICATION_LIST,ONCHANGE_QR_AGENT} from '../shared/constants/ActionTypes';
const ServiceWorkerListener = () => {
  //const {dispatch} = useContext(AppContext);

  const dispatch = useDispatch();
  useEffect(() => {
    const handleServiceWorkerMessage = (event) => {
      // Manejar los mensajes recibidos del service worker
      // y realizar las acciones necesarias en tu aplicación
      console.log('listener event', event);
      const randomNumber = Math.floor(Math.random() * (10000 - 1)) + 1;
      if(event.data.data.type=="QRBot" || event.data.data.type=="failureAgentQR" || event.data.data.type=="successAgentQR"){
        dispatch({type:ONCHANGE_QR_AGENT, payload:event.data.data});
      
      }else{
        dispatch({type: UPDATE_NOTIFICATION_LIST, payload: event.data.data});
        localStorage.setItem('updateNotification', randomNumber);
        console.log('actualizando notificaciones');
      }
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
