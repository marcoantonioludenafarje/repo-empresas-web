import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const UpdateInput = asyncComponent(() =>
  import('../../../modules/sample/Inputs/UpdateInput'),
);
export default AppPage(() => <UpdateInput />);
