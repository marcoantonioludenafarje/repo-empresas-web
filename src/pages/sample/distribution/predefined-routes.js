import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const RoutesTable = asyncComponent(() =>
  import('../../../modules/sample/Distribution/PredefinedRoutes'),
);
export default AppPage(() => <RoutesTable />);
