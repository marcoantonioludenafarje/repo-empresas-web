import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const CarriersTable = asyncComponent(() =>
  import('../../../modules/sample/Carriers'),
);
export default AppPage(() => <CarriersTable />);
