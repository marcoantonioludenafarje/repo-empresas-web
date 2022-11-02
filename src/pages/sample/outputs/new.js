import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const NewOutput = asyncComponent(() =>
  import('../../../modules/sample/Outputs/NewOutput'),
);
export default AppPage(() => <NewOutput />);
