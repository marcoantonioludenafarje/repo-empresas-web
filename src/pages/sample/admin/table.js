import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const Views = asyncComponent(() =>
  import('../../../modules/sample/Admin/views'),
);
export default AppPage(() => <Views />);
