import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const GetBills = asyncComponent(() =>
  import('../../../modules/sample/Bills/GetBill'),
);
export default AppPage(() => <GetBills />);
