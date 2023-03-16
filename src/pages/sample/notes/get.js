import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const GetCreditNote = asyncComponent(() =>
  import('../../../modules/sample/Notes/GetCreditNote'),
);
export default AppPage(() => <GetCreditNote />);
