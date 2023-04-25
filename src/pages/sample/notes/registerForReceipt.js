import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const GetCreditNoteForReceipt = asyncComponent(() =>
  import('../../../modules/sample/Notes/GetCreditNoteForReceipt'),
);
export default AppPage(() => <GetCreditNoteForReceipt />);
