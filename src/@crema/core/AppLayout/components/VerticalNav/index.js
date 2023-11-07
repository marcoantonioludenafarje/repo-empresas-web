import React, {useEffect, useRef} from 'react';
import List from '@mui/material/List';

import rolesRoutesConfig from '../../../../../modules/routesConfig';
import NavVerticalGroup from './VerticalNavGroup';
import VerticalCollapse from './VerticalCollapse';
import VerticalItem from './VerticalItem';
import {useRouter} from 'next/router';
import {useAuthMethod, useAuthUser} from '../../../../utility/AuthHooks';
import {getRolUser} from '../../../../../redux/actions/General';
import {useDispatch, useSelector} from 'react-redux';
import {useState} from 'react';
import PropTypes from 'prop-types';
const VerticalNav = ({closeMenu}) => {
  const listRef = useRef(null);
  const router = useRouter();
  const {user, isLoading, isAuthenticated} = useAuthUser();
  const {getRolUserRes} = useSelector(({general}) => general);

  const [routesRolGeneral, setRoutesRolGeneral] = useState([]);

  useEffect(() => {
    if (
      rolesRoutesConfig[user.role[0]] &&
      rolesRoutesConfig[user.role[0]].length > 0 &&
      getRolUserRes &&
      getRolUserRes.merchantSelected
    ) {
      if (
        getRolUserRes.merchantSelected.firstPlanDefault ||
        getRolUserRes.merchantSelected.upgradeToNewPlan
      ) {
        console.log('Las cositas', rolesRoutesConfig[user.role[0]]);
        let cositas = rolesRoutesConfig[user.role[0]].map((item) => {
          if (item.children && item.children.length > 0) {
            return {
              ...item,
              children: item.children.map((elem) => ({
                ...elem,
                urlRedirect: '/sample/planRegistration',
                isProtected: true,
              })),
            };
          } else {
            return {
              ...item,
              urlRedirect: '/sample/planRegistration',
              isProtected: true,
            };
          }
        });
        console.log('Entro aca papu yeah', cositas);
        setRoutesRolGeneral(cositas);
      } else {
        console.log('Ya volvio a las rutas normales');
        setRoutesRolGeneral(rolesRoutesConfig[user.role[0]]);
      }
    }
  }, [rolesRoutesConfig, getRolUserRes]);

  return !isLoading &&
    isAuthenticated &&
    routesRolGeneral &&
    routesRolGeneral.length > 0 ? (
    <List
      ref={listRef}
      sx={{
        position: 'relative',
        padding: 0,
      }}
      component='div'
    >
      {routesRolGeneral.map((item) => (
        <React.Fragment key={item.id}>
          {/* <span key={item.id + "blue"}>{JSON.stringify(item)}</span> */}
          {item.type === 'group' && (
            <NavVerticalGroup item={item} level={0} router={router} closeM={closeMenu}/>
          )}

          {item.type === 'collapse' && (
            <VerticalCollapse item={item} level={0} router={router} closeM={closeMenu}/>
          )}

          {item.type === 'item' && (
            <VerticalItem item={item} level={0} router={router} closeM={closeMenu}/>
          )}
        </React.Fragment>
      ))}
    </List>
  ) : null;
};

export default VerticalNav;
VerticalNav.propTypes = {
  closeM: PropTypes.func,
};