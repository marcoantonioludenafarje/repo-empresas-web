import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const PlanRegistration = asyncComponent(() =>
  import('../../../modules/sample/PlanRegistration'),
);
export default AppPage(() => <PlanRegistration />);
