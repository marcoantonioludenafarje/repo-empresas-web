import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Auth from '@aws-amplify/auth';
import {Amplify} from '@aws-amplify/core';
import PropTypes from 'prop-types';
import {awsConfig} from './aws-exports';
import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  SHOW_MESSAGE,
  USER_ATTRIBUTES,
  GET_USER,
  GET_USER_DATA,
  WEIGHT_BUSINESS,
  MONEY_UNIT_BUSINESS,
  GET_BUSINESS_PARAMETER,
  MONEY_SYMBOL,
  ALL_PRODUCTS,
  GET_DATA_BUSINESS,
  SET_JWT_TOKEN,
  GET_ROL_USER,
  RESET_CARRIERS,
  RESET_CLIENTS,
  RESET_COMMON,
  RESET_DRIVERS,
  RESET_FILEEXPLORER,
  RESET_FINANCES,
  RESET_GENERAL,
  RESET_LOCATIONS,
  RESET_MOVEMENTS,
  RESET_MYBILLING,
  RESET_NOTIFICATIONS,
  RESET_ORDERS,
  RESET_PRODUCTS,
  RESET_PROVIDERS,
  RESET_REQUESTS,
  RESET_USER,
} from '../../../../shared/constants/ActionTypes';
import {useDispatch, useSelector} from 'react-redux';
import {getAllProducts} from '../../../../redux/actions/Products';
import {
  getDataBusiness,
  getRolUser,
  onGetBusinessParameter,
} from '../../../../redux/actions/General';
import {getEmailToSendCode, getUserData} from '../../../../redux/actions/User';
// import {useHistory} from 'react-router-dom';
import {useRouter} from 'next/router';
const AwsCognitoContext = createContext();
const AwsCognitoActionsContext = createContext();

export const useAwsCognito = () => useContext(AwsCognitoContext);
export const useAwsCognitoActions = () => useContext(AwsCognitoActionsContext);

import IntlMessages from '../../../../@crema/utility/IntlMessages';
import rolesRoutesConfig from '../../../../modules/routesConfig';

const AwsAuthProvider = ({children}) => {
  const [showAlert, setShowAlert] = React.useState(false);
  const [awsCognitoData, setAwsCognitoData] = useState({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  console.log('awsCognitoData 123', awsCognitoData);
  const dispatch = useDispatch();
  const history = useRouter();

  const {dataBusinessRes} = useSelector(({general}) => general);
  console.log('dataBusinessRes', dataBusinessRes);
  const {businessParameter} = useSelector(({general}) => general);
  console.log('businessParameter', businessParameter);
  // const {userDataRes} = useSelector(({user}) => user);
  const {getRolUserRes} = useSelector(({general}) => general);
  console.log('Esto es getRolUserRes', getRolUserRes);
  let listPayload;
  let businessPayload;
  let dataBusinessPayload;
  let getUserDataPayload;
  let getRolUserPayload;
  let businessParameterPayload;
  let routesRolGeneral = rolesRoutesConfig['APP_CLIENT'];

  const toGetAllProducts = (payload) => {
    dispatch(getAllProducts(payload));
  };
  const toGetDataBusiness = (payload) => {
    dispatch(getDataBusiness(payload));
  };
  const toGetEmailToSendCode = (payload) => {
    dispatch(getEmailToSendCode(payload));
  };
  const toGetUserData = (payload) => {
    dispatch(getUserData(payload));
  };
  const toGetRolUser = (payload) => {
    dispatch(getRolUser(payload));
  };
  const getBusinessParameter = (payload) => {
    dispatch(onGetBusinessParameter(payload));
  };

  useEffect(() => {
    if (getRolUserRes) {
      function checkAvailability(arr, val) {
        return arr.some((arrVal) => val === arrVal);
      }
      function searchPrivilege(getRolUserRes) {
        let pathsBack = [];

        for (let objModules of getRolUserRes.modules) {
          for (let objSubModules of objModules.submodule) {
            for (let obj of objSubModules.privileges) {
              console.log('Path agarrado: ', obj.path);
              pathsBack.push(obj.path);
            }
          }
        }
        return pathsBack;
      }
      console.log('getRolUserRes desde useeffect', getRolUserRes);
      let listPrivileges = [];
      for (let objModules of getRolUserRes.modules) {
        if (objModules.idFront) {
          listPrivileges.push(objModules.idFront);
        }
        for (let objSubModules of objModules.submodule) {
          if (objSubModules.idFront) {
            listPrivileges.push(objSubModules.idFront);
          }
        }
      }
      if (
        getRolUserRes.merchantSelected.firstPlanDefault ||
        getRolUserRes.merchantSelected.upgradeToNewPlan
      ) {
        listPrivileges.push('planRegistration');
      }
      //AQUÍ se pondría el listado de paths back
      let pathsBack;
      if (getRolUserRes) {
        pathsBack = searchPrivilege(getRolUserRes);
        localStorage.setItem('pathsBack', pathsBack);
        console.log('localstorage prueba', localStorage.getItem('pathsBack'));
      }
      console.log('Privilegios: ', getRolUserRes);
      console.log('Listado de privilegios: ', listPrivileges);
      console.log('Listado de rutas verticalNav: ', routesRolGeneral);
      if (Array.isArray(listPrivileges) && listPrivileges.length >= 1) {
        for (var i = 0; i < routesRolGeneral.length; i++) {
          if (!checkAvailability(listPrivileges, routesRolGeneral[i].id)) {
            routesRolGeneral.splice(i, 1);
            i--;
          } else {
            if (routesRolGeneral[i].children) {
              for (var j = 0; j < routesRolGeneral[i].children.length; j++) {
                if (
                  !checkAvailability(
                    listPrivileges,
                    routesRolGeneral[i].children[j].id,
                  )
                ) {
                  routesRolGeneral[i].children.splice(j, 1);
                  j--;
                }
              }
            }
          }
        }
      }
      localStorage.setItem('routesRolGeneral2', routesRolGeneral);
    }
  }, [getRolUserRes]);
  useEffect(() => {
    if (dataBusinessRes) {
      console.log('dataBusinessRes desde useeffect', dataBusinessRes);
      //console.log('userDataRes desde useeffect', userDataRes);
    }
  }, [dataBusinessRes]);
  useEffect(() => {
    if (businessParameter) {
      console.log('Agarrando BusinessParameter');
      let weightBusiness = businessParameter.find(
        (obj) => obj.abreParametro == 'DEFAULT_WEIGHT_UNIT',
      ).value;
      dispatch({type: WEIGHT_BUSINESS, payload: weightBusiness});

      const moneyData = businessParameter.find(
        (obj) => obj.abreParametro == 'DEFAULT_MONEY_UNIT',
      );
      let moneyUnitBusiness = moneyData.value;
      let moneySymbol = moneyData.metadata2;
      dispatch({type: MONEY_UNIT_BUSINESS, payload: moneyUnitBusiness});
      dispatch({type: MONEY_SYMBOL, payload: moneySymbol});
    }
  }, [businessParameter]);
  useEffect(() => {
    if (awsCognitoData.user != null && !businessParameter) {
      console.log('Cuándo entra aquí?');
      listPayload = {
        request: {
          payload: {
            merchantId: awsCognitoData.user.attributes['custom:businessId'],
          },
        },
      };
      dataBusinessPayload = {
        request: {
          payload: {
            abreParametro: null,
            codTipoparametro: null,
            merchantId: awsCognitoData.user.attributes['custom:businessId'],
          },
        },
      };
      getRolUserPayload = {
        request: {
          payload: {
            rolId: awsCognitoData.user.signInUserSession.idToken.payload.rolId,
            merchantSelectedId:
              awsCognitoData.user.signInUserSession.idToken.payload
                .merchantSelectedId,
          },
        },
      };
      businessParameterPayload = {
        request: {
          payload: {
            abreParametro: null,
            codTipoparametro: null,
            userId: awsCognitoData.user.username,
          },
        },
      };
      console.log('getUserDataPayload123', getUserDataPayload);

      /* toGetAllProducts(listPayload); */
      getBusinessParameter(businessParameterPayload);
      toGetDataBusiness(dataBusinessPayload);
      toGetRolUser(getRolUserPayload);
    }
  }, [awsCognitoData.user != null]);

  if (awsCognitoData && awsCognitoData.user) {
    console.log('Entro aca carnal');

    dispatch({type: USER_ATTRIBUTES, payload: awsCognitoData.user.attributes});
    // if(!dataBusinessRes){
    //   const toGetUserData2 = (payload) => {
    //     dispatch(getUserData(payload));
    //   };
    //   console.log('username inicial: ', localStorage.getItem('payload'))
    //   dispatch({type: FETCH_SUCCESS, payload: undefined});
    //   dispatch({type: FETCH_ERROR, payload: undefined});
    //   dispatch({type: GET_USER_DATA, payload: undefined});
    //   getUserDataPayload = {
    //     request: {
    //       payload: {
    //         userId: awsCognitoData.user.attributes,
    //       },
    //     },
    //   };
    //   console.log("getUserDataPayload está", getUserDataPayload)
    //   toGetUserData2(getUserDataPayload);
    // }
  }

  const auth = useMemo(() => {
    console.log('aca ps');
    Amplify.configure(awsConfig);
    return Auth;
  }, []);

  useEffect(() => {
    console.log('Entra ps');
    auth
      .currentAuthenticatedUser()
      .then((user) => {
        console.log('Se ejecuto bien usuario:', user);
        setAwsCognitoData({
          user: {
            ...user,
            role_cognito:
              user.signInUserSession.idToken.payload['cognito:groups'],
          },
          isAuthenticated: true,
          isLoading: false,
        });
        dispatch({type: GET_USER_DATA, payload: undefined});
        dispatch({type: GET_DATA_BUSINESS, payload: undefined});
        dispatch({type: GET_ROL_USER, payload: undefined});
        dispatch({type: GET_BUSINESS_PARAMETER, payload: undefined});
      })
      .catch(() => {
        console.log('Entro a error');
        setAwsCognitoData({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      });
  }, [auth]);

  const signIn = async ({email, password}) => {
    dispatch({type: FETCH_START});
    try {
      const user = await Auth.signIn(email, password);
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        dispatch({type: GET_USER, payload: user});
        history.replace('/complete-new-password');
        dispatch({type: FETCH_SUCCESS});
        setAwsCognitoData({
          user: undefined,
          isLoading: false,
          isAuthenticated: false,
        });
        /* const {requiredAttributes} = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
        const newUser = await Auth.completeNewPassword(user, newPassword);
        console.log('Nuevo usuario', newUser); */
      } else {
        // other situations
        console.log('user basico: ', user);
        console.log('Esto es mi amigos');
        const payload = user.signInUserSession.idToken.payload;
        const jwt = user.signInUserSession.idToken.jwtToken;
        localStorage.setItem('jwt', jwt);
        localStorage.setItem('payload', JSON.stringify(payload));
        console.log('El gran jwt', jwt);
        console.log('El gran payload', payload);
        console.log('El gran signInUserSession', user.signInUserSession);
        dispatch({type: FETCH_SUCCESS});
        setAwsCognitoData({
          user: user,
          isLoading: false,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      setAwsCognitoData({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      dispatch({type: FETCH_ERROR, payload: error.message});
    }
  };

  const signUpCognitoUser = async (data) => {
    console.log('La data papus', data);
    dispatch({type: FETCH_START});
    try {
      let objectParam = {
        username: data.email,
        password: data.password,
        attributes: {
          profile: 'INVENTORY_BUSINESS_ADMIN',
          name: data.name,
          family_name: data.lastName,
          phone_number: '+51' + data.cellphone,
          'custom:businessSocialReason': data.businessSocialReason,
          'custom:businessDocumentType': data.businessDocumentType,
          'custom:businessDocumentNum': data.businessDocumentNumber,
          'custom:businessDirection': data.businessDirection,
          'custom:promotionCode': data.promotionCode,
          'custom:businessNecessity': data.businessNecessity,
          'custom:businessUbigeo': data.ubigeo,
          'custom:product': 'INVENTORY',
          'custom:businessCountry': 'peru',
          'custom:typeClient': data.typeClient,
        },
      };
      console.log('objectParam', objectParam);
      await Auth.signUp(objectParam);
      dispatch({type: FETCH_SUCCESS});
      // console.log(" data.email" ,  data.email)
      // console.log("history", history)
      history.push({pathname: '/confirm-signup', query: {email: data.email}});
      dispatch({
        type: SHOW_MESSAGE,
        payload:
          'Se ha enviado un código a su dirección de correo electrónico registrada. ¡Ingrese el código para completar el proceso!',
      });
    } catch (error) {
      console.log('El error', error);
      console.log('El error message', error.message);

      setAwsCognitoData({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      dispatch({type: FETCH_ERROR, payload: error.message});
    }
  };
  const confirmCognitoUserSignup = async (username, code) => {
    dispatch({type: FETCH_START});
    try {
      console.log('username', username);
      console.log('code', code);
      await Auth.confirmSignUp(username, code, {
        forceAliasCreation: false,
      });
      history.replace('/signin');
      dispatch({
        type: SHOW_MESSAGE,
        payload:
          '¡Felicitaciones, el proceso de registro se ha completado, ahora puede iniciar sesión ingresando las credenciales correctas!',
      });
    } catch (error) {
      setAwsCognitoData({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      dispatch({type: FETCH_ERROR, payload: error.message});
    }
  };
  const forgotPassword = async (username, code) => {
    dispatch({type: FETCH_START});
    try {
      await Auth.forgotPassword(username);
      history.replace('/reset-password');
      toGetEmailToSendCode(username);
      dispatch({
        type: SHOW_MESSAGE,
        payload: 'Congratulations, code sent to mail',
      });
    } catch (error) {
      setAwsCognitoData({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      dispatch({type: FETCH_ERROR, payload: error.message});
    }
  };

  const forgotPasswordSubmit = async (username, code, new_password) => {
    dispatch({type: FETCH_START});
    try {
      await Auth.forgotPasswordSubmit(username, code, new_password);
      history.replace('/signin');
      dispatch({
        type: SHOW_MESSAGE,
        payload: 'Congratulations, password reset',
      });
    } catch (error) {
      setAwsCognitoData({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      dispatch({type: FETCH_ERROR, payload: error.message});
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    dispatch({type: FETCH_START});
    try {
      await Auth.currentAuthenticatedUser().then((user) => {
        return Auth.changePassword(user, oldPassword, newPassword);
      });
      /* .then((data) => console.log('changePassword Data', data))
        .catch((err) => console.log('changePassword Error', err)); */
      history.replace('/sample/home');
      dispatch({
        type: SHOW_MESSAGE,
        payload: 'Congratulations, password changed',
      });
    } catch (error) {
      /* setAwsCognitoData({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      }); */
      dispatch({type: FETCH_ERROR, payload: error.message});
    }
  };

  const completeNewPassword = async ({user, newPassword}) => {
    setAwsCognitoData({...awsCognitoData, isLoading: true});
    dispatch({type: FETCH_START});
    try {
      await Auth.completeNewPassword(user, newPassword);
      setAwsCognitoData({...awsCognitoData, isLoading: false});
      history.replace('/signin');
      dispatch({
        type: SHOW_MESSAGE,
        payload: 'Congratulations, new password made',
      });
    } catch (error) {
      setAwsCognitoData({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      dispatch({type: FETCH_ERROR, payload: error.message});
    }
  };

  const logout = async () => {
    setAwsCognitoData({...awsCognitoData, isLoading: true});
    console.log('Cerrando sesión');
    try {
      await auth.signOut();
      localStorage.removeItem('routesAndPrivileges');
      localStorage.removeItem('routesRolGeneral2');
      localStorage.removeItem('jwt');
      localStorage.removeItem('payload');
      localStorage.removeItem('updateNotificationList');
      localStorage.removeItem('updateNotification');
      localStorage.removeItem('pathsBack');
      localStorage.removeItem('updateNotification');
      
      dispatch({type: RESET_CARRIERS});
      dispatch({type: RESET_CLIENTS});
      dispatch({type: RESET_COMMON});
      dispatch({type: RESET_DRIVERS});
      dispatch({type: RESET_FILEEXPLORER});
      dispatch({type: RESET_FINANCES});
      dispatch({type: RESET_GENERAL});
      dispatch({type: RESET_LOCATIONS});
      dispatch({type: RESET_MOVEMENTS});
      dispatch({type: RESET_MYBILLING});
      dispatch({type: RESET_NOTIFICATIONS});
      dispatch({type: RESET_ORDERS});
      dispatch({type: RESET_PRODUCTS});
      dispatch({type: RESET_PROVIDERS});
      dispatch({type: RESET_REQUESTS});
      dispatch({type: RESET_USER});
      setAwsCognitoData({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      console.log('Cerrando sesión');
      //history.reload(); 
    } catch (error) {
      setAwsCognitoData({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  return (
    <AwsCognitoContext.Provider
      value={{
        ...awsCognitoData,
        auth,
      }}
    >
      <AwsCognitoActionsContext.Provider
        value={{
          logout,
          signIn,
          signUpCognitoUser,
          confirmCognitoUserSignup,
          forgotPassword,
          forgotPasswordSubmit,
          changePassword,
          completeNewPassword,
        }}
      >
        {children}
      </AwsCognitoActionsContext.Provider>
    </AwsCognitoContext.Provider>
  );
};

AwsAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AwsAuthProvider;
