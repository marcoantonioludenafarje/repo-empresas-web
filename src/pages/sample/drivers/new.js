import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const NewDriver = asyncComponent(() =>
  import('../../../modules/sample/Drivers/NewDriver'),
);
export default AppPage(() => <NewDriver />);
