import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const DistributionsTable = asyncComponent(() =>
  import('../../../modules/sample/Distribution/Distributions'),
);
export default AppPage(() => <DistributionsTable />);
