import React from 'react';
import HorizontalGroup from './HorizontalGroup';
import HorizontalCollapse from './HorizontalCollapse';
import HorizontalItem from './HorizontalItem';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import rolesRoutesConfig from '../../../../../modules/routesConfig';
import {useAuthMethod, useAuthUser} from '../../../../utility/AuthHooks';

const HorizontalNav = () => {
  const {user, isLoading} = useAuthUser();
  return !isLoading ? (
    <List className='navbarNav'>
      {rolesRoutesConfig[user.role[0]].map((item) => (
        <React.Fragment key={item.id}>
          {item.type === 'group' && (
            <HorizontalGroup item={item} nestedLevel={0} />
          )}

          {item.type === 'collapse' && (
            <HorizontalCollapse item={item} nestedLevel={0} />
          )}

          {item.type === 'item' && (
            <HorizontalItem item={item} nestedLevel={0} />
          )}

          {item.type === 'divider' && <Divider sx={{my: 5}} />}
        </React.Fragment>
      ))}
    </List>
  ) : null;
};

export default HorizontalNav;
