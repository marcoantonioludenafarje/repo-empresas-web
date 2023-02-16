import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const BulkLoad = asyncComponent(() =>
  import('../../../modules/sample/BulkLoad'),
);
export default AppPage(() => <BulkLoad />);
