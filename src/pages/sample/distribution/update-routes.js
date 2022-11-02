import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const UpdateRoute = asyncComponent(() =>
  import('../../../modules/sample/Distribution/UpdateRoute'),
);
export default AppPage(() => <UpdateRoute />);
