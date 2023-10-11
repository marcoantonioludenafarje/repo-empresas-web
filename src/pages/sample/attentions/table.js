import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const Table = asyncComponent(() =>
  import('../../../modules/sample/Crm/Attentions/Views'),
);
export default AppPage(() => <Table />);
