import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const ProductMovementDetail = asyncComponent(() =>
  import('../../../modules/sample/Products/ProductMovementDetail'),
);
export default AppPage(() => <ProductMovementDetail />);
