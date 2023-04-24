import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const ContableMovements = asyncComponent(() =>
  import('../../../modules/sample/ContableMovements'),
);
export default AppPage(() => <ContableMovements />);
