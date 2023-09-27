import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const CleanUp = asyncComponent(() =>
  import('../../../modules/sample/Admin/cleanUp'),
);
export default AppPage(() => <CleanUp />);
