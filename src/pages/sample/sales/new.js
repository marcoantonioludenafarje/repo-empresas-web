import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const NewSale = asyncComponent(() =>
  import('../../../modules/sample/Sales/NewSale'),
);
export default AppPage(() => <NewSale />);
