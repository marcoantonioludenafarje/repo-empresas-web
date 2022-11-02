import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const OutputsTable = asyncComponent(() =>
  import('../../../modules/sample/Outputs'),
);
export default AppPage(() => <OutputsTable />);
