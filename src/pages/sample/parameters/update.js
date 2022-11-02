import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const UpdateParameters = asyncComponent(() =>
  import('../../../modules/sample/Parameters/NewRoute'),
);
export default AppPage(() => <UpdateParameters />);
