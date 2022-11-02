import React, {useEffect} from 'react';
import List from '@mui/material/List';

import rolesRoutesConfig from '../../../../../modules/routesConfig';
import NavVerticalGroup from './VerticalNavGroup';
import VerticalCollapse from './VerticalCollapse';
import VerticalItem from './VerticalItem';
import {useRouter} from 'next/router';
import {useAuthMethod, useAuthUser} from '../../../../utility/AuthHooks';
import {getRolUser} from '../../../../../redux/actions/General';
import {useDispatch, useSelector} from 'react-redux';
const VerticalNav = () => {
  const router = useRouter();
  const {user, isLoading, isAuthenticated} = useAuthUser();
  console.log('Usuario', user);
  console.log('aca ps amiguo', rolesRoutesConfig, user);
  const {getRolUserRes} = useSelector(({general}) => general);
  let routesRolGeneral = rolesRoutesConfig[user.role[0]];
  const [menuItems, setMenuItems] = React.useState('');

  function checkAvailability(arr, val) {
    return arr.some((arrVal) => val === arrVal);
  }
  function searchPrivilege(getRolUserRes) {
    let pathsBack = [];

    for (let objModules of getRolUserRes.modules) {
      for (let objSubModules of objModules.submodule) {
        for (let obj of objSubModules.privileges) {
          console.log('Path agarrado: ', obj.path);
          pathsBack.push(obj.path);
        }
      }
    }
    return pathsBack;
  }

  useEffect(() => {
    // let listPrivileges = [];

    // if (getRolUserRes) {
    //   for (let objModules of getRolUserRes.modules) {
    //     if (objModules.idFront) {
    //       listPrivileges.push(objModules.idFront);
    //     }
    //     for (let objSubModules of objModules.submodule) {
    //       if (objSubModules.idFront) {
    //         listPrivileges.push(objSubModules.idFront);
    //       }
    //     }
    //   }
    // }
    // //AQUÍ se pondría el listado de paths back
    // let pathsBack;
    // if (getRolUserRes) {
    //   pathsBack = searchPrivilege(getRolUserRes)
    //   localStorage.setItem('pathsBack', pathsBack);
    //   console.log("localstorage prueba", localStorage.getItem('pathsBack'));
    // }
    // console.log('Privilegios: ', getRolUserRes);
    // console.log('Listado de privilegios: ', listPrivileges);
    // console.log('Listado de rutas verticalNav: ', routesRolGeneral);
    // if (Array.isArray(listPrivileges) && listPrivileges.length >= 1) {
    //   for (var i = 0; i < routesRolGeneral.length; i++) {
    //     if (!checkAvailability(listPrivileges, routesRolGeneral[i].id)) {
    //       routesRolGeneral.splice(i, 1);
    //       i--;
    //     } else {
    //       if (routesRolGeneral[i].children) {
    //         for (var j = 0; j < routesRolGeneral[i].children.length; j++) {
    //           if (
    //             !checkAvailability(
    //               listPrivileges,
    //               routesRolGeneral[i].children[j].id,
    //             )
    //           ) {
    //             routesRolGeneral[i].children.splice(j, 1);
    //             j--;
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
    routesRolGeneral = localStorage.getItem('routesRolGeneral2');
    localStorage.setItem('routesAndPrivileges', true);
  }, []);

  console.log('Final de rutas final: ', routesRolGeneral);
  console.log('LocalStoragr Routes', localStorage.getItem('routesRolGeneral2'));
  return localStorage.getItem('routesRolGeneral2') !== false &&
    !isLoading &&
    isAuthenticated ? (
    <List
      sx={{
        position: 'relative',
        padding: 0,
      }}
      component='div'
    >
      {routesRolGeneral.map((item) => (
        <React.Fragment key={item.id}>
          {item.type === 'group' && (
            <NavVerticalGroup item={item} level={0} router={router} />
          )}

          {item.type === 'collapse' && (
            <VerticalCollapse item={item} level={0} router={router} />
          )}

          {item.type === 'item' && (
            <VerticalItem item={item} level={0} router={router} />
          )}
        </React.Fragment>
      ))}
    </List>
  ) : null;
};

export default VerticalNav;
