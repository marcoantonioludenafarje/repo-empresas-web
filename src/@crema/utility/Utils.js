import moment from 'moment';
import {authRole} from '../../shared/constants/AppConst';
// import API from '@aws-amplify/api';
import axios from 'axios';

// import axios from "axios";

// export default instance;
export const createRoutes = (routeConfigs) => {
  let allRoutes = [];
  routeConfigs.forEach((config) => {
    allRoutes = [...allRoutes, ...setRoutes(config)];
  });
  return allRoutes;
};

export const setRoutes = (config) => {
  let routes = [...config.routes];
  if (config.auth) {
    routes = routes.map((route) => {
      const auth = route.auth
        ? [...config.auth, ...route.auth]
        : [...config.auth];
      return {...route, auth};
    });
  }

  return [...routes];
};

export const getBreakPointsValue = (valueSet, breakpoint) => {
  if (typeof valueSet === 'number') return valueSet;
  switch (breakpoint) {
    case 'xs':
      return valueSet.xs;
    case 'sm':
      return valueSet.sm || valueSet.xs;
    case 'md':
      return valueSet.md || valueSet.sm || valueSet.xs;
    case 'lg':
      return valueSet.lg || valueSet.md || valueSet.sm || valueSet.xs;
    default:
      return (
        valueSet.xl || valueSet.lg || valueSet.md || valueSet.sm || valueSet.xs
      );
  }
};

export const getFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const multiPropsFilter = (products, filters, stringKey = 'title') => {
  const filterKeys = Object.keys(filters);
  return products.filter((product) => {
    return filterKeys.every((key) => {
      if (!filters[key].length) return true;
      // Loops again if product[key] is an array (for material attribute).
      if (Array.isArray(product[key])) {
        return product[key].some((keyEle) => filters[key].includes(keyEle));
      }
      console.log('key', key, filters[key], product[key]);
      if (key === stringKey) {
        return product[key].toLowerCase().includes(filters[key].toLowerCase());
      }
      return filters[key].includes(product[key]);
    });
  });
};

export const getCustomDateTime = (
  value = 0,
  unit = 'days',
  format = 'YYYY-MM-DD',
) => {
  if (value === 0) {
    return moment().format(format);
  } else {
    return moment().add(value, unit).format(format);
  }
};

export const timeFromNow = (date) => {
  const timestamp = moment(date).format('X');
  const newDate = moment.unix(timestamp);
  return moment(newDate).fromNow();
};

export const checkPermission = (routeAuth, userRole) => {
  if (routeAuth === null || routeAuth === undefined) {
    return true;
  }

  if (userRole && Array.isArray(userRole)) {
    return routeAuth.some((r) => userRole.indexOf(r) >= 0);
  }

  if (routeAuth.length === 0) {
    return !userRole || userRole.length === 0;
  }
  if (userRole && Array.isArray(userRole) && Array.isArray(routeAuth)) {
    return routeAuth.some((r) => userRole.indexOf(r) >= 0);
  }
  return routeAuth.indexOf(userRole) >= 0;
};

export const generateUniqueID = () => {
  return `v1-${Date.now()}-${Math.floor(Math.random() * (9e12 - 1)) + 1e12}`;
};

export const getUserFromAuth0 = (user) => {
  if (user) {
    return {
      id: 1,
      uid: user.sub,
      displayName: user.name,
      email: user.email,
      photoURL: user.picture,
      role: authRole.user,
    };
  }
  return user;
};

export const getUserFromFirebase = (user) => {
  console.log('user: ', user);
  if (user) {
    return {
      id: 1,
      uid: user.uid,
      displayName: user.displayName ? user.displayName : 'Crema User',
      email: user.email,
      photoURL: user.photoURL,
      role: user.role_cognito,
    };
  }
  return user;
};
export const getUserFromAWS = (user) => {
  if (user) {
    let cosas = {
      id: 1,
      uid: user.username,
      displayName: user.attributes.name ? user.attributes.name : 'Crema User',
      email: user.attributes.email,
      photoURL: user.photoURL,
      role: user.role_cognito,
    };
    return cosas;
  }
  return user;
};

export const getUserFromJwtAuth = (user) => {
  if (user) {
    return {
      id: 1,
      uid: user._id,
      displayName: user.name,
      email: user.email,
      photoURL: user.avatar,
      role: authRole.user,
    };
  }
  return user;
};
export const request = (method, path, payload) => {
  console.log('Ahora axios');
  switch (method) {
    case 'post':
      // code block
      return axios[method](
        `${process.env.REACT_APP_ENDPOINT_GATEWAY_URL}${path}`,
        payload,
        {
          headers: {
            Authorization: localStorage.getItem('jwt'),
            'Content-type': 'application/json',
          },
        },
      );
      break;
    case 'get':
      return axios[method](
        `${process.env.REACT_APP_ENDPOINT_GATEWAY_URL}${path}`,
        {
          headers: {
            Authorization: localStorage.getItem('jwt'),
            'Content-type': 'application/json',
            merchantid: payload.body.merchantId,
            locations: payload.body.locations || "",
          },
        },
      );
      // code block
      break;
    default:
    // code block
  }

  // return API[method](api,path , {
  //   body: payload,
  //   headers: {
  //     authorization: "allow",
  //     "Content-type": "application/json",
  //     // localStorage.getItem("jwt")
  //   },
  // })
};
export const request3 = (method, path, payload) => {
  console.log('Ahora axios');
  switch (method) {
    case 'post':
      // code block
      return axios[method](
        `${process.env.REACT_APP_ENDPOINT_GATEWAY_URL}${path}`,
        payload,
        {
          headers: {
            Authorization: localStorage.getItem('jwt'),
            'Content-type': 'application/json',
            merchantId: payload.body.merchantId,
          },
        },
      );
      break;
    case 'get':
      return axios[method](
        `${process.env.REACT_APP_ENDPOINT_GATEWAY_URL}${path}`,
        {
          headers: {
            Authorization: localStorage.getItem('jwt'),
            'Content-type': 'application/json',
            merchantId: payload.body.merchantId,
          },
        },
      );
      // code block
      break;
    default:
    // code block
  }

  // return API[method](api,path , {
  //   body: payload,
  //   headers: {
  //     authorization: "allow",
  //     "Content-type": "application/json",
  //     // localStorage.getItem("jwt")
  //   },
  // })
};

export const request2 = (method, path, payload) => {
  console.log('Ahora axios');
  return axios[method](
    `https://hkqbuc22u9.execute-api.us-east-1.amazonaws.com/DEV${path}`,
    payload,
    {
      headers: {
        'Content-type': 'application/json',
      },
    },
  );
  // return API[method](api,path , {
  //   body: payload,
  //   headers: {
  //     authorization: "allow",
  //     "Content-type": "application/json",
  //     // localStorage.getItem("jwt")
  //   },
  // })
};


export const requestSendCredentials = (method, path, payload) => {
  console.log('Ahora axios');
  return axios[method](
    `https://6pt7tlbid2tbm7vnigku3glkwq0qrbrt.lambda-url.us-east-1.on.aws/`,
    payload,
    {
      headers: {
        'Content-type': 'application/json',
      },
    },
  );
};

export const sunatValidateRequest = (type, nro) => {
  console.log('Ahora axios validate SUNAT');
  return axios['get'](
    `https://dniruc.apisperu.com/api/v1/${type}/${nro}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFjYWVkcmljQGdtYWlsLmNvbSJ9.zJfG6QfvGG1A9oNFneACJkqWcmwRhP0yslJmgQS32Go`,
    {
      headers: {
        'Content-type': 'application/json',
      },
    },
  );
};
