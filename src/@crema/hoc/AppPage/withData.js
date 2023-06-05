import React, {useEffect} from 'react';
import Router, {useRouter} from 'next/router';
import AppLoader from '../../core/AppLoader';
import {useAuthUser} from '../../utility/AuthHooks';

import {getUserData} from '../../../redux/actions/User';
import {useDispatch, useSelector} from 'react-redux';
const withData = (ComposedComponent) => (props) => {
  const {user, isLoading} = useAuthUser();
  const {asPath} = useRouter();
  const queryParams = asPath.split('?')[1];
  const [completeData, setCompleteData] = React.useState('waiting');

  const dispatch = useDispatch();
  const {userDataRes} = useSelector(({user}) => user);
  // //Si no está que llame
  useEffect(() => {
    if (!userDataRes && localStorage.getItem('payload')) {
      console.log('Esto se ejecuta with data?');

      const toGetUserData = (payload) => {
        dispatch(getUserData(payload));
      };
      let getUserDataPayload = {
        request: {
          payload: {
            userId: JSON.parse(localStorage.getItem('payload')).sub,
          },
        },
      };

      toGetUserData(getUserDataPayload);
    }
  }, []);
  console.log('userDataRes de withData AppPage', userDataRes);

  const isDataUserComplete = () => {
    let values = {
      userDataRes: userDataRes ? true : false,
      'userDataRes.nombres': userDataRes && userDataRes.nombres ? true : false,
      'userDataRes.apellidoPat':
        userDataRes && userDataRes.apellidoPat ? true : false,
      'userDataRes.cellphone':
        userDataRes && userDataRes.cellphone ? true : false,
      'userDataRes.nombres.length':
        userDataRes && userDataRes.nombres && userDataRes.nombres.length >= 1,
      'userDataRes.apellidoPat.length':
        userDataRes &&
        userDataRes.apellidoPat &&
        userDataRes.apellidoPat.length >= 1,
      'userDataRes.cellphone.length':
        userDataRes &&
        userDataRes.cellphone &&
        userDataRes.cellphone.length >= 1,
    };
    let allCorrect = Object.values(values).reduce((a, b) => a && b);
    return allCorrect;
  };

  useEffect(() => {
    if (userDataRes) {
      setCompleteData(isDataUserComplete());
    }
  }, [userDataRes]);

  useEffect(() => {
    console.log('completeData', completeData);
    if (!user && !isLoading) {
      Router.push('/signin' + (queryParams ? '?' + queryParams : ''));
    } else if (completeData === false) {
      Router.push({
        pathname: '/my-account',
        query: {nameView: 'personalInfo'},
      });
      setCompleteData('waiting');
    }
  }, [user, isLoading]);
  if (!user || isLoading) return <AppLoader />;

  return <ComposedComponent {...props} />;
};
export default withData;
