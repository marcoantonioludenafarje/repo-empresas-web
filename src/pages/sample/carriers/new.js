import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const NewCarrier = asyncComponent(() =>
  import('../../../modules/sample/Carriers/NewCarrier'),
);
export default AppPage(() => <NewCarrier />);
