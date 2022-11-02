import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const ClientsTable = asyncComponent(() =>
  import('../../../modules/sample/Clients'),
);
export default AppPage(() => <ClientsTable />);
