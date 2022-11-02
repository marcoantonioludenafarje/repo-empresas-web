import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const NotesTable = asyncComponent(() =>
  import('../../../modules/sample/Notes'),
);
export default AppPage(() => <NotesTable />);
