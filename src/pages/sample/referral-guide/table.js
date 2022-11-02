import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const ReferralGuideTable = asyncComponent(() =>
  import('../../../modules/sample/ReferralGuide'),
);
export default AppPage(() => <ReferralGuideTable />);
