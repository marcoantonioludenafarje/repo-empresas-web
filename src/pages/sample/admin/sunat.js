import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const Sunat = asyncComponent(() =>
  import('../../../modules/sample/Admin/sunat'),
);
export default AppPage(() => <Sunat />);
