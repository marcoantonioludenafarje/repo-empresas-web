import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const GetReceipt = asyncComponent(() =>
  import('../../../modules/sample/Receipts/GetReceipt'),
);
export default AppPage(() => <GetReceipt />);
