import React from 'react';
import {RoutePermittedRole} from 'shared/constants/AppConst';

export const sampleConfigs = [
  {
    permittedRole: RoutePermittedRole.user,
    path: '/sample/products',
    component: React.lazy(() => import('./Products')),
  },
  {
    permittedRole: RoutePermittedRole.user,
    path: '/sample/inputs',
    component: React.lazy(() => import('./Inputs')),
  },
  {
    permittedRole: RoutePermittedRole.admin,
    path: '/sample/page-3',
    component: React.lazy(() => import('./Page3')),
  },
];
