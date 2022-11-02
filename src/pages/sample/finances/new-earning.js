import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const NewEarning = asyncComponent(() =>
  import('../../../modules/sample/Finances/NewEarning'),
);
export default AppPage(() => <NewEarning />);
