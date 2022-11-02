import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const UpdateOutput = asyncComponent(() =>
  import('../../../modules/sample/Outputs/UpdateOutput'),
);
export default AppPage(() => <UpdateOutput />);
