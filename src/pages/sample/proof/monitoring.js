import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const ProofMonitoring = asyncComponent(() =>
  import('../../../modules/sample/Proof/Monitoring'),
);
export default AppPage(() => <ProofMonitoring />);
