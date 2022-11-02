import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const ProvidersTable = asyncComponent(() =>
  import('../../../modules/sample/Providers'),
);
export default AppPage(() => <ProvidersTable />);
