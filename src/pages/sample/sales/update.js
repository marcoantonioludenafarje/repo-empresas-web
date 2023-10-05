import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const UpdateSale = asyncComponent(() =>
  import('../../../modules/sample/Sales/UpdateSale'),
);
export default AppPage(() => <UpdateSale />);
