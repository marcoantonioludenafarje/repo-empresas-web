import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const UpdateEarning = asyncComponent(() =>
  import('../../../modules/sample/Finances/UpdateEarning'),
);
export default AppPage(() => <UpdateEarning />);
