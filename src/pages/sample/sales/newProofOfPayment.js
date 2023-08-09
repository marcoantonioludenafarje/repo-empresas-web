import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const NewSaleProofOfPayment = asyncComponent(() =>
  import('../../../modules/sample/Sales/NewSaleProofOfPayment'),
);
export default AppPage(() => <NewSaleProofOfPayment />);
