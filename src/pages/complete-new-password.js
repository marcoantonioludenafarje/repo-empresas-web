import React from 'react';
import AppPage from '../@crema/hoc/DefaultPage/index';
import asyncComponent from '../@crema/utility/asyncComponent';

const CompleteNewPassword = asyncComponent(() =>
  import('../modules/auth/Signin/CompleteNewPassword'),
);
export default AppPage(() => <CompleteNewPassword />);
