import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const SalesTable = asyncComponent(() =>
  import('../../../modules/sample/Sales'),
);
export default AppPage(() => <SalesTable />);
