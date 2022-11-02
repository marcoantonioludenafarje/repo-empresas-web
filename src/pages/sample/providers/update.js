import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const UpdateProvider = asyncComponent(() =>
  import('../../../modules/sample/Providers/UpdateProvider'),
);
export default AppPage(() => <UpdateProvider />);
