import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const DriversTable = asyncComponent(() =>
  import('../../../modules/sample/Drivers'),
);
export default AppPage(() => <DriversTable />);
