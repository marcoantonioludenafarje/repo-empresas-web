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
import { useState } from 'react';
const VerticalNav = () => {
  const router = useRouter();
  const {user, isLoading, isAuthenticated} = useAuthUser();
  const {getRolUserRes} = useSelector(({general}) => general);

  const [routesRolGeneral, setRoutesRolGeneral]=useState([])

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
  
    if(rolesRoutesConfig[user.role[0]] && rolesRoutesConfig[user.role[0]].length >0 &&
       getRolUserRes && getRolUserRes.merchantSelected ){
      if ( getRolUserRes.merchantSelected.firstPlanDefault ||
        getRolUserRes.merchantSelected.upgradeToNewPlan  ){
          console.log("Las cositas", rolesRoutesConfig[user.role[0]])
          let cositas = rolesRoutesConfig[user.role[0]].map(item=>{
            if(item.children && item.children.length >0){
              
              return {...item, children:item.children.map(
                elem =>({...elem,urlRedirect: "/sample/planRegistration", isProtected:true }))}
            }else{
              return {...item,urlRedirect:"/sample/planRegistration", isProtected:true,}
            }
          
          })
          console.log("Entro aca papu yeah", cositas)
          setRoutesRolGeneral(cositas)

        }else{
          console.log("Ya volvio a las rutas normales")
          setRoutesRolGeneral(rolesRoutesConfig[user.role[0]])
        }



    }


    
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
    // routesRolGeneral = localStorage.getItem('routesRolGeneral2');
    // localStorage.setItem('routesAndPrivileges', true);
  }, [rolesRoutesConfig, getRolUserRes]);


  return  (!isLoading && isAuthenticated && routesRolGeneral && routesRolGeneral.length >0 )? (
    <List
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
