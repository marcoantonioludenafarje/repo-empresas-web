import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const UpdateClient = asyncComponent(() =>
  import('../../../modules/sample/Clients/UpdateClient'),
);
export default AppPage(() => <UpdateClient />);
