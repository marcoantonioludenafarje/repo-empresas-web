import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const ProofsOfPaymentConsolidation = asyncComponent(() =>
  import('../../../modules/sample/Proof/Consolidated'),
);
export default AppPage(() => <ProofsOfPaymentConsolidation />);
