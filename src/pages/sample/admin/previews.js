import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const Previews = asyncComponent(() =>
  import('../../../modules/sample/Admin/previews'),
);
export default AppPage(() => <Previews />);
