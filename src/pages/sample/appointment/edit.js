import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const Edit = asyncComponent(() =>
  import('../../../modules/sample/Crm/Appoinment/Edit'),
);
export default AppPage(() => <Edit />);
