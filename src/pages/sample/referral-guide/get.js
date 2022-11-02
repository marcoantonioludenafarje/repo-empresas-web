import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const GetReferralGuide = asyncComponent(() =>
  import('../../../modules/sample/ReferralGuide/GetReferralGuide'),
);
export default AppPage(() => <GetReferralGuide />);
