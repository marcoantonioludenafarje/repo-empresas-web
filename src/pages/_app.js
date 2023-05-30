import * as React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@mui/material/CssBaseline';
import {CacheProvider} from '@emotion/react';
import createEmotionCache from '../createEmotionCache';
import AppContextProvider from '../@crema/utility/AppContextProvider';
import {Provider} from 'react-redux';
import AppThemeProvider from '../@crema/utility/AppThemeProvider';
import AppStyleProvider from '../@crema/utility/AppStyleProvider';
import AppLocaleProvider from '../@crema/utility/AppLocaleProvider';
// import FirebaseAuthProvider from '../@crema/services/auth/firebase/FirebaseAuthProvider';
import FirebaseAuthProvider from '../@crema/services/auth/aws-cognito/AWSAuthProvider';

import AuthRoutes from '../@crema/utility/AuthRoutes';
import {useStore} from '../redux/store'; // Client-side cache, shared for the whole session of the user in the browser.

import '../@crema/services/index';
import '../shared/vendors/index.css';
import  {useEffect } from 'react';
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;
  const store = useStore(pageProps.initialReduxState);
  var swLocation = '/service-worker.js'; 
  var swReg;
  useEffect(() => {

    if ( 'serviceWorker' in navigator) {


      // if ( url.includes('localhost') ) {
      //     swLocation = '/service-worker.js';
      // }


      window.addEventListener('load', function() {

          navigator.serviceWorker.register( swLocation ).then( function(reg){
              console.log("Se registro correctamente")
              swReg = reg;
              swReg.pushManager.getSubscription().then( ele =>{
                console.log("Alguna suscripcion", ele)
              } );

          });

      });

    }


  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <AppContextProvider>
        <Provider store={store}>
          <AppThemeProvider>
            <AppStyleProvider>
              <AppLocaleProvider>
                <FirebaseAuthProvider>
                  <AuthRoutes>
                    <CssBaseline />
                    <Component {...pageProps} />
                  </AuthRoutes>
                </FirebaseAuthProvider>
              </AppLocaleProvider>
            </AppStyleProvider>
          </AppThemeProvider>
        </Provider>
      </AppContextProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
