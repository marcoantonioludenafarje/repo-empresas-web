import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const ActiveSubscription = asyncComponent(() =>
  import('../../../modules/sample/Subscription/ActiveSubscription'),
);
export default AppPage(() => <ActiveSubscription />);
