import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const Update = asyncComponent(() =>
  import('../../../modules/sample/Specialists/Update'),
);
export default AppPage(() => <Update />);
