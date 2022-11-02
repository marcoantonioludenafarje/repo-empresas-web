import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const Gaphics = asyncComponent(() =>
  import('../../../modules/sample/Graphics'),
);
export default AppPage(() => <Gaphics />);
