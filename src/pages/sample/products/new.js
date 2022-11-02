import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const NewProduct = asyncComponent(() =>
  import('../../../modules/sample/Products/NewProduct'),
);
export default AppPage(() => <NewProduct />);
