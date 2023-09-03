import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const Productive = asyncComponent(() =>
  import('../../../modules/sample/Admin/productive'),
);
export default AppPage(() => <Productive />);
