import {authRole} from '../../../shared/constants/AppConst';

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
  if (user) {
    return {
      id: 1,
      uid: user.uid,
      displayName: user.displayName ? user.displayName : 'Crema User',
      email: user.email,
      photoURL: user.photoURL ? user.photoURL : '/assets/images/avatar/A11.jpg',
      role: authRole.user,
    };
  }
  return user;
};
export const getUserFromAWS = (user) => {
  if (user) {
    let nena = {
      id: 1,
      uid: user.username,
      displayName: 'Sadid Gavidia',
      email: user.attributes.email,
      photoURL: user.photoURL,
      role: ['APP_CLIENT'],
    };
    /* console.log("Ahora vamos", nena) */
    return nena;
  }
  return user;
};

export const getUserFromJwtAuth = (user) => {
  if (user) {
    let nena = {
      id: 1,
      uid: user._id,
      displayName: user.name,
      email: user.email,
      photoURL: user.avatar,
      role: authRole.user,
    };
    /* console.log("Ahora vamos", nena) */
    return nena;
  }
  return user;
};
