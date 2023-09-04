import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const ReferralGuideCustomize = asyncComponent(() =>
  import('../../../modules/sample/ReferralGuide/Customize'),
);
export default AppPage(() => <ReferralGuideCustomize />);
