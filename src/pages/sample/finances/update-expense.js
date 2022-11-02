import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const UpdateExpense = asyncComponent(() =>
  import('../../../modules/sample/Finances/UpdateExpense'),
);
export default AppPage(() => <UpdateExpense />);
