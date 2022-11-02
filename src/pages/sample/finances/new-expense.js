import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const NewExpense = asyncComponent(() =>
  import('../../../modules/sample/Finances/NewExpense'),
);
export default AppPage(() => <NewExpense />);
