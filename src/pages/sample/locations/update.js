import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const UpdateLocation = asyncComponent(() =>
  import('../../../modules/sample/Locations/UpdateLocation'),
);
export default AppPage(() => <UpdateLocation />);
