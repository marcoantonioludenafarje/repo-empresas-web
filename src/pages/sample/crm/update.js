import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const Update = asyncComponent(() =>
  import('../../../modules/sample/Crm/Update'),
);
export default AppPage(() => <Update />);
