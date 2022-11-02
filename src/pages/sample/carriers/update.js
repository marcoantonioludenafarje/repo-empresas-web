import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const UpdateCarrier = asyncComponent(() =>
  import('../../../modules/sample/Carriers/UpdateCarrier'),
);
export default AppPage(() => <UpdateCarrier />);
