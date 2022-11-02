import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const FileExplorer = asyncComponent(() =>
  import('../../../modules/sample/FileExplorer'),
);
export default AppPage(() => <FileExplorer />);
