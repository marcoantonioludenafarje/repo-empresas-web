import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const UpdateDriver = asyncComponent(() =>
  import('../../../modules/sample/Drivers/UpdateDriver'),
);
export default AppPage(() => <UpdateDriver />);
