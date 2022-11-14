import React, {useEffect} from 'react';
import Router, {useRouter} from 'next/router';
import {initialUrl} from '../../../shared/constants/AppConst';
import AppLoader from '../../core/AppLoader';
import {useAuthUser} from '../../utility/AuthHooks';
import {useSelector} from 'react-redux';

const withData = (ComposedComponent) => (props) => {
  const {user, isLoading} = useAuthUser();
  const {asPath} = useRouter();
  const queryParams = asPath.split('?')[1];
  const {userDataRes} = useSelector(({user}) => user);
  const [completeData, setCompleteData] = React.useState(false);
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
    if(userDataRes){
      if (userDataRes.merchantSelected.isEcommerceEnabled) {
        Router.push("sample/planRegistration");
      } else if (user){
        Router.push(initialUrl + (queryParams ? '?' + queryParams : ''));

      }
    } else {
      if (user) {
        Router.push(initialUrl + (queryParams ? '?' + queryParams : ''));
      } 
    }/* else if (!completeData) {
      Router.push('/my-account');
    } */
  }, [user /* , completeData */]);
  if (isLoading) return <AppLoader />;
  if (user) return <AppLoader />;

  return <ComposedComponent {...props} />;
};

export default withData;
