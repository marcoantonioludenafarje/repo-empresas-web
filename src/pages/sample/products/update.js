import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const UpdateProduct = asyncComponent(() =>
  import('../../../modules/sample/Products/UpdateProduct'),
);
export default AppPage(() => <UpdateProduct />);
