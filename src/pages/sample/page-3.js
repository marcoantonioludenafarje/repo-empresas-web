import React from 'react';
import AppPage from '../../@crema/hoc/AppPage';
import asyncComponent from '../../@crema/utility/asyncComponent';

const Page3 = asyncComponent(() => import('../../modules/sample/Page3'));
export default AppPage(() => <Page3 />);
