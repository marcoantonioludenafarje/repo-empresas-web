import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const ReceiptsTable = asyncComponent(() =>
  import('../../../modules/sample/Receipts'),
);
export default AppPage(() => <ReceiptsTable />);
