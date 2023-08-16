import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const Create = asyncComponent(() =>
  import('../../../modules/sample/Crm/Appoinment/Createappoinment'),
);
export default AppPage(() => <Create />);
