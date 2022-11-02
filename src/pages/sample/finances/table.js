import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const FinancesTable = asyncComponent(() =>
  import('../../../modules/sample/Finances'),
);
export default AppPage(() => <FinancesTable />);
