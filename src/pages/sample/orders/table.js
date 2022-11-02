import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const OrdersTable = asyncComponent(() =>
  import('../../../modules/sample/Orders'),
);
export default AppPage(() => <OrdersTable />);
