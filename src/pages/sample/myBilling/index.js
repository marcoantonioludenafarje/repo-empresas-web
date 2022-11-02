import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const MyBilling = asyncComponent(() =>
  import('../../../modules/sample/MyBilling'),
);
export default AppPage(() => <MyBilling />);
