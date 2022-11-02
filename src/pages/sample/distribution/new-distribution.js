import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const NewRoute = asyncComponent(() =>
  import('../../../modules/sample/Distribution/NewDistribution.js'),
);
export default AppPage(() => <NewRoute />);
