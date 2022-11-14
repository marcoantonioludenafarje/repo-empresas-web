import React, {useEffect} from 'react';
import Router, {useRouter} from 'next/router';
import {initialUrl} from '../../../shared/constants/AppConst';
import AppLoader from '../../core/AppLoader';
import {useAuthUser} from '../../utility/AuthHooks';
import {useDispatch, useSelector} from 'react-redux';
import {
  useAwsCognito,
  useAwsCognitoActions,
} from '../../services/auth/aws-cognito/AWSAuthProvider';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
} from '../../../shared/constants/ActionTypes';
import {getUserData} from '../../../redux/actions/User';
const withData = (ComposedComponent) => (props) => {
  const {user, isLoading} = useAuthUser();
  const useCognito = useAwsCognito();
  const dispatch = useDispatch();
  const {asPath} = useRouter();
  const queryParams = asPath.split('?')[1];
  const {userDataRes} = useSelector(({user}) => user);
  const [completeData, setCompleteData] = React.useState(false);
  const [isUserDataResCharged, setIsUserDataResCharged] = React.useState(false);
  console.log('userDataRes de withData DefaultPage', userDataRes);

  /* const isDataUserComplete = () => {
    return (
      userDataRes &&
      userDataRes.nombres &&
      userDataRes.apellidoPat &&
      userDataRes.cellphone &&
      userDataRes.nombres.length >= 1 &&
      userDataRes.apellidoPat.length >= 1 &&
      userDataRes.cellphone.length >= 1
    );
  }; */

  /* useEffect(() => {
    setCompleteData(isDataUserComplete());
  }, [userDataRes]); */
  useEffect(() => {
    if(!user){
      console.log("No existe user")
    }
    if (!userDataRes && user) {
      console.log('Esto se ejecuta en withdata?', user);

      const toGetUserData = (payload) => {
        dispatch(getUserData(payload));
      };
      let getUserDataPayload = {
        request: {
          payload: {
            userId: user.uid,
          },
        },
      };

      toGetUserData(getUserDataPayload);
    } else if (userDataRes && user) {
      console.log('Esto se ejecuta en withdata 2?', user);
      setIsUserDataResCharged(true)
    }
  }, []);
  useEffect(() =>{
    if(!userDataRes){
      console.log("Está cambiando false")
      setIsUserDataResCharged(false)
    } else {
      console.log("Está cambiando true")
      setTimeout(() => {
        setIsUserDataResCharged(true)
      }, 2000);
    }
  }, [userDataRes])
  useEffect(() => {
    if(isUserDataResCharged && user){
      console.log("Esta es la verdadera variable", useCognito.user)
      if (useCognito.user.signInUserSession.idToken.payload.firstPlanDefault) {
        console.log("Este es el UserData Actual plam", userDataRes)
        setIsUserDataResCharged(false)
        Router.push("sample/planRegistration");
      } else if (user){
        console.log("Este es el UserData Actual home", userDataRes)
        setIsUserDataResCharged(false)
        Router.push(initialUrl + (queryParams ? '?' + queryParams : ''));

      }
    } /* else if (!completeData) {
      Router.push('/my-account');
    } */
  }, [user, isUserDataResCharged /* , completeData */]);
  if (isLoading) return <AppLoader />;
  if (user) return <AppLoader />;

  return <ComposedComponent {...props} />;
};

export default withData;
