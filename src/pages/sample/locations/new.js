import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const NewLocation = asyncComponent(() =>
  import('../../../modules/sample/Locations/NewLocation'),
);
export default AppPage(() => <NewLocation />);