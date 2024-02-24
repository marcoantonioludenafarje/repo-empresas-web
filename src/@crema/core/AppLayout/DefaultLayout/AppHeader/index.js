import React, {useContext} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import AppLngSwitcher from '@crema/core/AppLngSwitcher';
import Box from '@mui/material/Box';
import AppSearchBar from '@crema/core/AppSearchBar';
import Hidden from '@mui/material/Hidden';
import IconButton from '@mui/material/IconButton';

import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import {blue, grey} from '@mui/material/colors';
import axios from 'axios';

import IntlMessages from '../../../../../@crema/utility/IntlMessages';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Link,
  Button,
  IconMenu,
  Badge,
  Typography,
} from '@mui/material';
import {toggleNavCollapsed} from '../../../../../redux/actions';
import MenuIcon from '@mui/icons-material/Menu';
import AppMessages from '../../../AppMessages';
import AppNotifications from '../../../AppNotifications';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ServiceWorkerListener from '../../../../../pages/serviceWorkerListener';

import {getNotifications} from '../../../../../redux/actions/Notifications';
import {
  onGetBusinessParameter,
  onGetGlobalParameter,
} from '../../../../../redux/actions/General';
import {getUserData} from '../../../../../redux/actions/User';
import YouTubeIcon from '@mui/icons-material/YouTube';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationAddOutlinedIcon from '@mui/icons-material/NotificationAddOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AppTooltip from '../../../AppTooltip';
import {alpha} from '@mui/material/styles';
import AppLogo from '../../components/AppLogo';
import Notification from '../../components/Notification';
import {useIntl} from 'react-intl';
import ActiveSubscription from '../../../../../modules/sample/Subscription/ActiveSubscription';

import NewRequest from '../../../../../modules/sample/Request/NewRequest';
import RequestIcon from '../../../../../assets/icon/requestIcon.svg';
import NotificationEmpty from '../../../../../assets/icon/notificationEmpty.svg';
import NotificationNonEmpty from '../../../../../assets/icon/notificationNonEmpty.svg';
import NotificationOFF from '../../../../../assets/icon/notificationOFF1.svg';
import NotificationON from '../../../../../assets/icon/notificationON1.svg';
import ManualIcon from '../../../../../assets/icon/manual.svg';

import {
  SUBSCRIPTION_STATE,
  UPDATE_NOTIFICATION_LIST,
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
  GET_NOTIFICATIONS,
} from '../../../../../shared/constants/ActionTypes';
import {useDispatch, useSelector} from 'react-redux';
import localforage from 'localforage';

//import SwivelClient from 'swivel';

// let SwivelClient = null;
// if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
//   SwivelClient = require('swivel');
// }
import {AppContext} from '../../../../../Utils/AppContext';
import {useEffect} from 'react';
import {makeStyles} from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  header: {
    fontSize: '1em',
    color: '#f0220e',
  },
  horizontalCenter: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

//FORCE UPDATE
const useForceUpdate = () => {
  const [reload, setReload] = React.useState(0); // integer state
  return () => setReload((value) => value + 1); // update the state to force render
};
const AppHeader = (props) => {
  const classes = useStyles(props);
  const {messages} = useIntl();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [newRequestState, setNewRequestState] = React.useState(false);
  const [requestType, setRequestType] = React.useState('');
  const [allowedNotifications, setAllowedNotifications] = React.useState(false);
  const [notificationUpdate, setNotificationUpdate] = React.useState(0);
  const [cantdias, setCantdias] = React.useState(10);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  let getActiveNotifications = [];
  const handleClose = () => {
    setAnchorEl(null);
  };
  const dispatch = useDispatch();
  const forceUpdate = useForceUpdate();
  const {userDataRes} = useSelector(({user}) => user);
  const {subscriptionStateRes, updateNotificationListRes} = useSelector(
    ({notifications}) => notifications,
  );
  //const {updateNotificationListRes} = useContext(AppContext); // Ejemplo de uso del useContext con el contexto de la aplicación
  const {getNotificationsRes} = useSelector(({notifications}) => notifications);
  const {businessParameter, globalParameter} = useSelector(
    ({general}) => general,
  );
  console.log('businessParameter123', businessParameter);
  console.log('globalParameter123', globalParameter);
  const {dataBusinessRes} = useSelector(({general}) => general);
  console.log('dataBusinessRes', dataBusinessRes);
  const toGetNotifications = (payload) => {
    dispatch(getNotifications(payload));
  };
  console.log('subscriptionStateRes inicial', subscriptionStateRes);
  const requestAxios = (method, path, payload) => {
    console.log('Ahora axios');
    switch (method) {
      case 'post':
        // code block
        return axios[method](
          `${process.env.REACT_APP_ENDPOINT_GATEWAY_URL}${path}`,
          payload,
          {
            headers: {
              Authorization: localStorage.getItem('jwt'),
              'Content-type': 'application/json',
            },
          },
        );
        break;
      case 'get':
        return axios[method](
          `${process.env.REACT_APP_ENDPOINT_GATEWAY_URL}${path}`,
          {
            headers: {
              Authorization: localStorage.getItem('jwt'),
              'Content-type': 'application/json',
              merchantid: payload.body.merchantId,
            },
          },
        );
        // code block
        break;
      default:
      // code block
    }
  };
  const handleSubscribe = () => {
    console.log('Hola handleSubscribe');

    const verificaSuscripcion = () => {
      dispatch({type: SUBSCRIPTION_STATE, payload: true});
    };
    if ('serviceWorker' in navigator && !allowedNotifications) {
      // navigator.serviceWorker.controller.postMessage({
      //   action: 'subscribe',
      //   subscription: 'Aquí puedes pasar la información de la suscripción'
      // });
      let swReg;
      var swLocation = '/service-worker3.js';
      const cancelarSuscripcion = () => {
        swReg.pushManager.getSubscription().then((subs) => {
          if (subs) {
            subs
              .unsubscribe()
              .then(() => dispatch({type: SUBSCRIPTION_STATE, payload: false}));
          }
        });
      };
      navigator.serviceWorker
        .getRegistration()
        .then((registration) => {
          if (registration) {
            // Si hay un registro existente
            swReg = registration;
            console.log('Registro existente:', swReg);
            // Realiza las operaciones adicionales aquí
            // Realiza las operaciones adicionales aquí
            requestAxios('post', '/utility/webpushnotifications/getKey', {
              request: {
                payload: {
                  message: 'Obteniendo Key',
                },
              },
            })
              .then((res) => res.data.response.payload.data)
              .then((key) => new Uint8Array(key))
              .then((dataKey) => {
                console.log('getKey resultado', dataKey);
                swReg.pushManager
                  .subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: dataKey,
                  })
                  .then((res) => res.toJSON())
                  .then((suscripcion) => {
                    console.log(suscripcion);
                    requestAxios(
                      'post',
                      '/utility/webpushnotifications/saveSuscription',
                      {
                        request: {
                          payload: {
                            userId: userDataRes.userId,
                            merchantId: userDataRes.merchantSelected.merchantId,
                            subscription: suscripcion,
                          },
                        },
                      },
                    )
                      .then(verificaSuscripcion)
                      .catch(cancelarSuscripcion);
                  });
              })
              .catch((error) => {
                console.log('getKey error', error);
              });
          } else {
            // Si no hay un registro existente, regístralo
            navigator.serviceWorker
              .register(swLocation)
              .then((registration) => {
                swReg = registration;
                console.log('Nuevo registro:', swReg);
                // Realiza las operaciones adicionales aquí
                requestAxios('post', '/utility/webpushnotifications/getKey', {
                  request: {
                    payload: {
                      message: 'Obteniendo Key',
                    },
                  },
                })
                  .then((res) => res.data.response.payload.data)
                  .then((key) => new Uint8Array(key))
                  .then((dataKey) => {
                    console.log('getKey resultado', dataKey);
                    swReg.pushManager
                      .subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: dataKey,
                      })
                      .then((res) => res.toJSON())
                      .then((suscripcion) => {
                        console.log(suscripcion);
                        requestAxios(
                          'post',
                          '/utility/webpushnotifications/saveSuscription',
                          {
                            request: {
                              payload: {
                                userId: userDataRes.userId,
                                merchantId:
                                  userDataRes.merchantSelected.merchantId,
                                subscription: suscripcion,
                              },
                            },
                          },
                        )
                          .then(verificaSuscripcion)
                          .catch(cancelarSuscripcion);
                      });
                  })
                  .catch((error) => {
                    console.log('getKey error', error);
                  });
              })
              .catch((error) => {
                console.log('Error al registrar el Service Worker:', error);
              });
          }
        })
        .catch((error) => {
          console.log('Error al obtener el registro de Service Worker:', error);
        });
    } else if ('serviceWorker' in navigator && allowedNotifications) {
      let swReg;
      var swLocation = '/service-worker3.js';
      const cancelarSuscripcion = () => {
        swReg.pushManager.getSubscription().then((subs) => {
          if (subs) {
            subs.unsubscribe().then(() => {
              swReg.unregister().then(() => {
                dispatch({type: SUBSCRIPTION_STATE, payload: false});
              });
            });
          }
        });
      };
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          // Si hay un registro existente
          swReg = registration;
          console.log('Registro existente:', swReg);
          cancelarSuscripcion();
        }
      });
    }
  };
  const sendNewRequest = () => {
    setNewRequestState(true);
  };
  function enviarNotificacion() {
    const notificationOpts = {
      body: 'Este es el cuerpo de la notificación',
      icon: 'img/icons/icon-72x72.png',
    };

    const n = new Notification('Hola Mundo', notificationOpts);

    n.onclick = () => {
      console.log('Click');
    };
  }
  // const sendNotification = () => {
  //   requestAxios('post', '/utility/webpushnotifications/sendPushMessages', {
  //     request: {
  //       payload: {
  //         userId: userDataRes.userId,
  //         merchantId: userDataRes.merchantSelected.merchantId,
  //         title: 'HOLA TITULO',
  //         message: 'HOLA CUERPO',
  //         usuario: userDataRes.userId,
  //         saleId: '64e9bc0c-03e4-4a73-bda0-ebb2f0e67a28',
  //         url: 'http://localhost:3000/sample/home',
  //       },
  //     },
  //   })
  //     .then((notificacion) => {
  //       console.log(notificacion);
  //     })
  //     .catch((error) => {
  //       console.log('Error al enviar notificacion:', error);
  //     });
  // };

  useEffect(() => {
    console.log('UseEffect de AppHeader');
    if (!userDataRes) {
      console.log('Esto se ejecuta notificaciones?');

      const toGetUserData = (payload) => {
        dispatch(getUserData(payload));
      };
      let getUserDataPayload = {
        request: {
          payload: {
            userId: localStorage.getItem('payload')
              ? JSON.parse(localStorage.getItem('payload')).sub
              : '',
          },
        },
      };

      toGetUserData(getUserDataPayload);
    }
    let swReg;
    var swLocation = '/service-worker3.js';
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistration()
        .then((registration) => {
          if (registration) {
            // Si hay un registro existente
            swReg = registration;
            console.log('Registro existente:', swReg);
            // Realiza las operaciones adicionales aquí
            swReg.pushManager.getSubscription().then((ele) => {
              console.log('Alguna suscripcion AppHeader', ele);
              if (ele) {
                dispatch({type: SUBSCRIPTION_STATE, payload: true});
              }
            });
          } else {
            console.log('No hay registro existente:', swReg);
            // Si no hay un registro existente, regístralo
            navigator.serviceWorker
              .register(swLocation)
              .then((registration) => {
                swReg = registration;
                console.log('Nuevo registro:', swReg);
                // Realiza las operaciones adicionales aquí
                swReg.pushManager.getSubscription().then((ele) => {
                  console.log('Alguna suscripcion AppHeader', ele);
                  if (ele) {
                    dispatch({type: SUBSCRIPTION_STATE, payload: true});
                  }
                });
              })
              .catch((error) => {
                console.log('Error al registrar el Service Worker:', error);
              });
          }
        })
        .catch((error) => {
          console.log('Error al obtener el registro de Service Worker:', error);
        });
    }
  }, []);
  useEffect(() => {
    if (userDataRes) {
      if (!getNotificationsRes) {
        dispatch({type: GET_NOTIFICATIONS, payload: undefined});
        let listNotificationsPayload = {
          request: {
            payload: {
              merchantMasterId: '',
            },
          },
        };
        listNotificationsPayload.request.payload.merchantId =
          userDataRes.merchantMasterId;
        listNotificationsPayload.request.payload.userId = userDataRes.userId;
        toGetNotifications(listNotificationsPayload);
      }
      if (
        userDataRes.merchantSelected.plans &&
        userDataRes.merchantSelected.plans.find((obj) => obj.active == true)
          .finishAt
      ) {
        console.log('xxx', 'entro');
        setCantdias(
          Math.ceil(
            (userDataRes.merchantSelected.plans.find(
              (obj) => obj.active == true,
            ).finishAt -
              Date.now()) /
              (1000 * 60 * 60 * 24),
          ),
        );
        console.log('xxx1', cantdias);
      }
    }
  }, [userDataRes]);
  useEffect(() => {
    setAllowedNotifications(subscriptionStateRes);
  }, [subscriptionStateRes]);

  // const detectLocalStorageChanges = (callback) => {
  //   // Copia el estado actual del localStorage
  //   const oldState = { ...localStorage };

  //   // Función que compara el estado anterior y el nuevo estado del localStorage
  //   const checkChanges = () => {
  //     for (const key in localStorage) {
  //       if (localStorage.hasOwnProperty(key) && oldState[key] !== localStorage[key]) {
  //         callback(key, localStorage[key]);
  //       }
  //     }
  //   };

  //   // Evento para detectar cambios en el localStorage
  //   window.addEventListener('storage', checkChanges);

  //   return () => {
  //     // Remover el evento al finalizar
  //     window.removeEventListener('storage', checkChanges);
  //   };
  // };

  // // Ejemplo de uso
  // const handleLocalStorageChange = (key, value) => {
  //   console.log(`El valor de ${key} ha cambiado a ${value}`);
  // };

  // // Iniciar la detección de cambios en el localStorage
  // const unsubscribe = detectLocalStorageChanges(handleLocalStorageChange);

  // useEffect(() => {
  //   function checkUserData() {
  //     const item = localStorage.getItem('notificationUpdate')

  //     if (item) {
  //       setNotificationUpdate(item)
  //     }
  //   }

  //   window.addEventListener('storage', checkUserData)

  //   return () => {
  //     window.removeEventListener('storage', checkUserData)
  //   }
  // }, [])

  useEffect(() => {
    if (updateNotificationListRes) {
      console.log(
        'updateNotificationListRes de AppHeader',
        updateNotificationListRes,
      );
      forceUpdate();
    }
  }, [updateNotificationListRes]);

  // useEffect(() => {
  //   // if ('serviceWorker' in navigator && !allowedNotifications) {
  //   //   const swivel = new SwivelClient();
  //   //   const messageHandler = (message) => {
  //   //     if (message.type === 'updateNotification') {
  //   //       // Manejar la notificación recibida desde el Service Worker
  //   //       const { title, options } = message.data;
  //   //       console.log('Notificación recibida:', title, options);
  //   //       const randomNumber =  Math.floor(Math.random() * (10000 - 1)) + 1;
  //   //       setNotificationUpdate(randomNumber)
  //   //     }
  //   //   };
  //   //   swivel.on(messageHandler);
  //   //   // Cleanup function
  //   //   return () => {
  //   //     // Deregister the message listener if needed
  //   //     // swivel.off(messageHandler);
  //   //   };
  //   // }

  //   localforage.config({
  //     driver: localforage.LOCALSTORAGE,
  //   });

  //   const handleLocalStorageChange = (changes) => {
  //     console.log('Cambios en el localStorage:', changes);
  //     // Realizar las acciones necesarias en función de los cambios en el localStorage
  //   };

  //   localforage.on('change', handleLocalStorageChange);

  //   // Limpiar la escucha cuando el componente se desmonta
  //   return () => {
  //     localforage.off('change', handleLocalStorageChange);
  //   };
  // }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'clave') {
        const nuevoValor = event.newValue;
        console.log('Nuevo valor:', nuevoValor);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  return (
    <AppBar
      position='relative'
      color='inherit'
      sx={{
        boxShadow: 'none',
        borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
        backgroundColor: 'background.paper',
        width: {
          xs: '100%',
        },
      }}
      className='app-bar'
    >
      <ServiceWorkerListener />
      <Toolbar
        sx={{
          boxSizing: 'border-box',
          minHeight: {xs: 56, sm: 70},
          paddingLeft: {xs: 5},
          paddingRight: {xs: 5, md: 7.5, xl: 12.5},
        }}
      >
        <AppLogo />
        <IconButton
          sx={{
            mt: 1,
            '& svg': {
              height: 35,
              width: 35,
            },
            color: 'text.secondary',
          }}
          edge='end'
          color='inherit'
          aria-label='open drawer'
          onClick={() =>
            window.open(
              'https://drive.google.com/file/d/1bQBsf4o9f9kZjf_vmEFRONodeUBXGk1l/view?usp=sharing',
            )
          }
        >
          <ManualIcon />
        </IconButton>

        <Box display='flex' flexGrow={1}>
          {/* whatever is on the left side */}
          <Hidden lgUp>
            <IconButton
              sx={{color: 'text.secondary'}}
              edge='start'
              className='menu-btn'
              color='inherit'
              aria-label='open drawer'
              onClick={() => dispatch(toggleNavCollapsed())}
              size='large'
            >
              <MenuIcon
                sx={{
                  width: 35,
                  height: 35,
                }}
              />
            </IconButton>
          </Hidden>
        </Box>
        {/* whatever is on the right side */}
        <Hidden smDown>
          {localStorage.getItem('payload') &&
          JSON.parse(localStorage.getItem('payload')).profile ==
            'INVENTORY_BUSINESS_ADMIN' &&
          userDataRes &&
          userDataRes.merchantSelected.isEcommerceEnabled == true ? (
            <Button
              sx={{
                position: 'relative',
                bottom: -5,
                minWidth: 100,
              }}
              color='secondary'
              variant='contained'
              onClick={() =>
                window.open(
                  `https://dynamic-seahorse-63fc0f.netlify.app/ecommerce?business=${userDataRes.merchantSelected.ecommerceMerchantSlug}`,
                )
              }
            >
              <IntlMessages id='common.eCommerceBusiness' />
            </Button>
          ) : null}
        </Hidden>
        <Hidden smDown>
          {localStorage.getItem('payload') &&
          JSON.parse(localStorage.getItem('payload')).profile ==
            'INVENTORY_BUSINESS_ADMIN' &&
          cantdias <= 5 ? (
            <Typography
              variant='h1'
              sx={{textAlign: 'center'}}
              className={classes.header}
              component='div'
              gutterBottom
            >
              Faltan {cantdias} día(s) para el vencimiento de su suscripción
            </Typography>
          ) : null}
        </Hidden>
        <IconButton
          sx={{
            mt: 1,
            '& svg': {
              height: 35,
              width: 35,
            },
            color: 'text.secondary',
          }}
          edge='end'
          color='inherit'
          aria-label='open drawer'
          onClick={() => {
            setRequestType('');
            sendNewRequest();
          }}
        >
          <RequestIcon />
        </IconButton>
        {/* <Hidden smDown>
          <Box sx={{ml: 4}}>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                marginLeft: -2,
                marginRight: -2,
              }}
            >
              <IconButton
                sx={{
                  mt: 1,
                  '& svg': {
                    height: 35,
                    width: 35,
                  },
                  color: 'text.secondary',
                }}
                edge='end'
                color='inherit'
                aria-label='open drawer'
                onClick={() => {
                  sendNotification();
                }}
              >
                <Button
                  sx={{
                    borderRadius: 0,
                    width: '100%',
                    textTransform: 'capitalize',
                    marginTop: 'auto',
                    height: 40,
                  }}
                  variant='contained'
                  color='primary'
                >
                  Enviar Notificacion
                </Button>
              </IconButton>
            </Box>
          </Box>
        </Hidden> */}
        <Box sx={{ml: 4}}>
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              marginLeft: -2,
              marginRight: -2,
            }}
          >
            <IconButton
              className='icon-btn'
              sx={{
                mt: 3,
                '& svg': {
                  height: 35,
                  width: 35,
                },
                color: (theme) => theme.palette.text.secondary,
                border: 1,
                borderColor: 'transparent',
              }}
              onClick={() => {
                handleSubscribe();
              }}
              size='large'
            >
              {allowedNotifications ? <NotificationON /> : <NotificationOFF />}
            </IconButton>

            {/*<IconButton
                sx={{
                  mt: 1,
                  '& svg': {
                    height: 35,
                    width: 35,
                  },
                  color: 'text.secondary',
                }}
                edge='end'
                color='inherit'
                aria-label='open drawer'
                onClick={() => {
                  handleSubscribe();
                }}
              >
                <Button
                  sx={{
                    borderRadius: 0,
                    width: '100%',
                    textTransform: 'capitalize',
                    marginTop: 'auto',
                    height: 40,
                  }}
                  variant='contained'
                  color='primary'
                >
                  Notificaciones {allowedNotifications ? 'ON' : 'OFF'}
                </Button>
                </IconButton>*/}
          </Box>
        </Box>
        <Box sx={{ml: 4}}>
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              marginLeft: -2,
              marginRight: -2,
            }}
          >
            <Box sx={{}}>
              <AppNotifications />
            </Box>
          </Box>

          <Menu
            id='simple-menu'
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem>
              <AppNotifications isMenu />
            </MenuItem>
            <MenuItem>
              <AppMessages isMenu />
            </MenuItem>
            <MenuItem>Setting</MenuItem>
          </Menu>
        </Box>

        {/*         
        <IconButton
          color="secondary"
          onClick={() => window.open('https://www.youtube.com/@tunexo-facturacionelectronica')}
          aria-label="Ver Tutorial en YouTube"
          sx={{mt:2, 
            width: 54.33,
            height: 54.33,}} 
        >
          <YouTubeIcon sx={{
            width: 40.33,
            height: 40.33,}} />
        </IconButton> */}
        {/* <IconButton
          sx={{
            mt: 3,
            '& svg': {
              height: 35,
              width: 35,
            },
          }}
          aria-label='open drawer'
          onClick={() => dispatch(toggleNavCollapsed())}
        >
          {getActiveNotifications.length > 0 ? (
            <NotificationNonEmpty />
          ) : (
            <NotificationEmpty />
          )}
        </IconButton> */}
        <Hidden smDown>
          {localStorage.getItem('payload') &&
          JSON.parse(localStorage.getItem('payload')).profile ==
            'INVENTORY_BUSINESS_ADMIN' &&
          userDataRes &&
          userDataRes.merchantSelected.firstPlanDefault == true ? (
            <Button
              sx={{
                position: 'relative',
                bottom: -5,
                minWidth: 100,
              }}
              color='primary'
              variant='contained'
              onClick={() => {
                setRequestType('planActivation');
                sendNewRequest();
              }}
            >
              <IntlMessages id='common.activePlan' />
            </Button>
          ) : null}
        </Hidden>

        {/* <Button
          onClick={() => setOpenStatus(true)}
          sx={{mx: 4}}
          variant='outlined'
          color='error'
        >
          {messages['sidebar.sample.subscription.active']}
        </Button> */}
        {/* <AppSearchBar iconPosition='right' placeholder='Search…' /> */}
        <Box
          sx={{
            flexGrow: 0.1,
          }}
        />

        {/* Para cambiar de idioma */}
        {/* <AppLngSwitcher iconOnly={true} tooltipPosition='bottom' /> */}
      </Toolbar>

      <Dialog
        open={openStatus}
        onClose={() => setOpenStatus(false)}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <ActiveSubscription />
      </Dialog>

      <Dialog
        open={newRequestState}
        onClose={() => {
          setRequestType('');
          setNewRequestState(false);
        }}
        fullWidth
        maxWidth='x1'
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          <IconButton
            aria-label='close'
            onClick={() => setNewRequestState(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{display: 'flex'}}>
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            <NewRequest
              data={{
                yearMovement: '2022',
                monthMovement: 'MAY',
                merchantId: 'a9b1b2165ef740c9b4fcfd16c3f478ad',
                subType: 'planActivation',
              }}
              subType={requestType}
              closeNewRequest={() => setNewRequestState(false)}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </AppBar>
  );
};
export default AppHeader;
