import React from 'react';
import AppPage from '../../@crema/hoc/AppPage';
import asyncComponent from '../../@crema/utility/asyncComponent';

const Home = asyncComponent(() => import('../../modules/sample/Home'));
export default AppPage(() => <Home />);
