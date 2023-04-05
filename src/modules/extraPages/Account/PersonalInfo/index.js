import React, {useEffect} from 'react';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {Formik} from 'formik';
import * as yup from 'yup';
import {red} from '@mui/material/colors';

import PersonalInfoForm from './PersonalInfoForm';
import PropTypes from 'prop-types';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
} from '@mui/material';

import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

import {useDispatch, useSelector} from 'react-redux';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {updateUser} from '../../../../redux/actions/User';
import AppInfoView from '../../../../@crema/core/AppInfoView';
import {getUserData} from '../../../../redux/actions/User';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  UPDATE_USER,
  GET_USER_DATA,
} from '../../../../shared/constants/ActionTypes';

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
const validationSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  name: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  lastName: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  cellphone: yup
    .string()
    .test(
      'CellphoneFOrmat',
      <IntlMessages id='validation.cellphone' />,
      (number) => phoneRegExp.test(number),
    )
    .required(<IntlMessages id='validation.required' />),
});
const PersonalInfo = () => {
  const [openStatus, setOpenStatus] = React.useState(false);
  const [showForm, setShowForm] = React.useState(true);
  const dispatch = useDispatch();
  const {user} = useAuthUser();
  console.log('datos user', user);

  const {successMessage} = useSelector(({user}) => user);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({user}) => user);
  console.log('errorMessage', errorMessage);
  const {userAttributes} = useSelector(({user}) => user);
  console.log('userAttributes', userAttributes);
  const {updateUserRes} = useSelector(({user}) => user);
  console.log('updateUserRes', updateUserRes);
  const {userDataRes} = useSelector(({user}) => user);
  console.log('userDataRes', userDataRes);

  const getUserDataPayload = {
    request: {
      payload: {
        userId: user.uid,
      },
    },
  };

  const toUpdateUser = (payload) => {
    dispatch(updateUser(payload));
  };
  const toGetUserData = (payload) => {
    dispatch(getUserData(payload));
  };

  const initialValues = {
    displayName: userDataRes
      ? `${userDataRes.nombres} ${userDataRes.apellidoPat}`
      : '',
    email: userDataRes ? userDataRes.email : '',
    name: userDataRes ? userDataRes.nombres : '',
    lastName: userDataRes ? userDataRes.apellidoPat : '',
    cellphone: userDataRes && userDataRes.cellphone ? userDataRes.cellphone.replace('+51', '') : '',
  };

  useEffect(() => {
    if (userDataRes && !showForm) {
      setShowForm(true);
    }
  }, [userDataRes]);

  const reloadPage = () => {
    setShowForm(false);
    setShowForm(true);
  };

  const registerSuccess = () => {
    return (
      successMessage != undefined &&
      updateUserRes != undefined &&
      !('error' in updateUserRes)
    );
  };
  const registerError = () => {
    return (
      (successMessage != undefined && updateUserRes) ||
      errorMessage != undefined
    );
  };
  const sendStatus = () => {
    if (registerSuccess()) {
      setOpenStatus(false);
      dispatch({type: GET_USER_DATA, payload: undefined});
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      toGetUserData(getUserDataPayload);
      setShowForm(false);
    } else if (registerError()) {
      setOpenStatus(false);
    } else {
      setOpenStatus(false);
    }
  };
  const showMessage = () => {
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
              <IntlMessages id='message.update.data.success' />
            </DialogContentText>
          </DialogContent>
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
              <IntlMessages id='message.update.data.error' />
              <br />
              {updateUserRes && 'error' in updateUserRes
                ? updateUserRes.error
                : null}
            </DialogContentText>
          </DialogContent>
        </>
      );
    } else {
      return <CircularProgress disableShrink sx={{mx: 'auto', my: '20px'}} />;
    }
  };

  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    setOpenStatus(true);
    data.cellphone = data.cellphone.replace(/\s/g, '');
    console.log('data: ', data);
    dispatch({type: UPDATE_USER, payload: undefined});
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    let finalPayload = {
      request: {
        payload: {
          userId: user.uid,
          nombres: data.name,
          apellidos: data.lastName,
          cellphone: '+51' + data.cellphone,
        },
      },
    };
    console.log('finalPayload: ', finalPayload);
    toUpdateUser(finalPayload);
    setSubmitting(false);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        maxWidth: 550,
      }}
    >
      {showForm ? (
        <Formik
          validateOnBlur={true}
          initialValues={{
            ...initialValues,
            /* ...user, */
            photoURL: user.photoURL
              ? user.photoURL
              : '/assets/images/placeholder.jpg',
          }}
          validationSchema={validationSchema}
          onSubmit={handleData}
        >
          {({values, setFieldValue}) => {
            return (
              <PersonalInfoForm values={values} setFieldValue={setFieldValue} />
            );
          }}
        </Formik>
      ) : null}

      <Dialog
        open={openStatus}
        onClose={sendStatus}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {<IntlMessages id='message.update.user' />}
        </DialogTitle>
        {showMessage()}
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={sendStatus}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
      <AppInfoView />
    </Box>
  );
};

export default PersonalInfo;

PersonalInfo.propTypes = {
  setFieldValue: PropTypes.func,
  values: PropTypes.string,
};
