import React from 'react';
import AppPage from '../../../@crema/hoc/AppPage';
import asyncComponent from '../../../@crema/utility/asyncComponent';

const LocationsTable = asyncComponent(() =>
  import('../../../modules/sample/Locations'),
);
export default AppPage(() => <LocationsTable />);
