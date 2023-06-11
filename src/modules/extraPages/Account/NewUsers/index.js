import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import IntlMessages from '@crema/utility/IntlMessages';
import {Fonts} from '../../../../shared/constants/AppEnums';
import NewUserForm from './NewUserForm';
import UserManagement from './UserManagement';
import {Formik} from 'formik';
import * as yup from 'yup';

import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {red} from '@mui/material/colors';

import {useDispatch, useSelector} from 'react-redux';
import {registerUser} from '../../../../redux/actions/User';
import {
  FETCH_ERROR,
  FETCH_SUCCESS,
  REGISTER_USER,
} from '../../../../shared/constants/ActionTypes';
import {listUser} from '../../../../redux/actions/User';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
});
let uniqueRol = {};

//FORCE UPDATE
const useForceUpdate = () => {
  const [reload, setReload] = React.useState(0); // integer state
  return () => setReload((value) => value + 1); // update the state to force render
};

const NewUsers = () => {
  const [profile, setProfile] = React.useState('administrator');
  const [openStatus, setOpenStatus] = React.useState(false);
  const dispatch = useDispatch();

  const {listUserRes} = useSelector(({user}) => user);

  const {registerUserRes} = useSelector(({user}) => user);
  console.log('registerUserRes', registerUserRes);
  const {userDataRes} = useSelector(({user}) => user);
  console.log('userDataRes', userDataRes);
  const {successMessage} = useSelector(({user}) => user);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({user}) => user);
  console.log('errorMessage', errorMessage);

  const getProfileType = (value) => {
    console.log('tipo desde index', value);
    setProfile(value);
    console.log('Este es el profile?', profile);
  };

  const toRegisterUser = (payload) => {
    dispatch(registerUser(payload));
  };

  const toListUser = (payload) => {
    dispatch(listUser(payload));
  };

  const registerSuccess = () => {
    return (
      successMessage != undefined &&
      registerUserRes != undefined &&
      !('error' in registerUserRes)
    );
  };

  const registerError = () => {
    return (registerUserRes && successMessage != undefined) || errorMessage;
  };

  /*const sendStatus = () => {
    if (registerSuccess()) {
      setOpenStatus(false);
    } else if (registerError()) {
      setOpenStatus(false);
    } else {
      setOpenStatus(false);
    }
  };*/

  const sendStatus = () => {
    setTimeout(() => {
      setOpenStatus(false);
    }, 2000);
    let listUserPayload = {
      request: {
        payload: {
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };
    toListUser(listUserPayload);
  };

  const showMessage = () => {
    if (successMessage != undefined && registerUserRes != undefined) {
      if (registerSuccess()) {
        return (
          <>
            <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
              <CheckCircleOutlineOutlinedIcon
                color='success'
                sx={{fontSize: '6em', mx: 2}}
              />
              <DialogContentText
                sx={{fontSize: '1.2em', m: 'auto'}}
                id='alert-dialog-description'
              >
                Se ha registrado la información <br />
                correctamente
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{justifyContent: 'center'}}>
              <Button variant='outlined' onClick={sendStatus}>
                Aceptar
              </Button>
            </DialogActions>
          </>
        );
      } else if (registerError()) {
        return (
          <>
            <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
              <CancelOutlinedIcon
                sx={{fontSize: '6em', mx: 2, color: red[500]}}
              />
              <DialogContentText
                sx={{fontSize: '1.2em', m: 'auto'}}
                id='alert-dialog-description'
              >
                Se ha producido un error al registrar. <br />
                {/* {registerError() ? registerUserRes : null} */}
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{justifyContent: 'center'}}>
              <Button variant='outlined' onClick={() => setOpenStatus(false)}>
                Aceptar
              </Button>
            </DialogActions>
          </>
        );
      } else {
        return <CircularProgress disableShrink sx={{mx: 'auto', my: '20px'}} />;
      }
    } else {
      return <CircularProgress disableShrink sx={{mx: 'auto', my: '20px'}} />;
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        maxWidth: 550,
      }}
    >
      <Typography
        component='h3'
        sx={{
          fontSize: 16,
          fontWeight: Fonts.BOLD,
          mb: {xs: 3, lg: 5},
        }}
      >
        <IntlMessages id='userProfile.newUsers' />
      </Typography>
      <Formik
        validateOnChange={false}
        validateOnBlur={true}
        initialValues={{
          email: '',
          profile: profile,
        }}
        validationSchema={validationSchema}
        onSubmit={(data, {setSubmitting}) => {
          delete data.profile;
          setSubmitting(true);
          console.log('data: ', {...data, profileType: profile});
          dispatch({type: FETCH_SUCCESS, payload: undefined});
          dispatch({type: FETCH_ERROR, payload: undefined});
          dispatch({type: REGISTER_USER, payload: undefined});
          toRegisterUser({
            request: {
              payload: {
                email: data.email,
                rolUser: profile,
                roles: [profile],
                merchantId: userDataRes.merchantSelected.merchantId,
                merchantMasterId: userDataRes.merchantMasterId,
                lastName: '',
                name: '',
                product: 'INVENTORY',
                businessCountry: JSON.parse(localStorage.getItem('payload'))[
                  'custom:businessCountry'
                ],
                businessDirection: JSON.parse(localStorage.getItem('payload'))[
                  'custom:businessDirection'
                ],
                businessDocumentNum: JSON.parse(
                  localStorage.getItem('payload'),
                )['custom:businessDocumentNum'],
                businessSocialReason: JSON.parse(
                  localStorage.getItem('payload'),
                )['custom:businessSocialReason'],
                businessDocumentType: JSON.parse(
                  localStorage.getItem('payload'),
                )['custom:businessDocumentType'],
                promotionCode: JSON.parse(localStorage.getItem('payload'))[
                  'custom:promotionCode'
                ],
                appfrontend: 'WEB',
              },
            },
          });
          setOpenStatus(true);
          setSubmitting(false);
        }}
      >
        {({values, setFieldValue}) => {
          return (
            <Box sx={{my: 5}}>
              <NewUserForm values={values} moveData={getProfileType} />
            </Box>
          );
        }}
      </Formik>
      <UserManagement data={[]} />

      <Dialog
        open={openStatus}
        onClose={sendStatus}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Alta de usuario'}
        </DialogTitle>
        {showMessage()}
      </Dialog>
    </Box>
  );
};

export default NewUsers;
