import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const InputTable = asyncComponent(() =>
  import('../../../modules/sample/Inputs'),
);
export default AppPage(() => <InputTable />);
