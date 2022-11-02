import React from 'react';
import Button from '@mui/material/Button';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import Link from 'next/link';
import Router, {useRouter} from 'next/router';
import AppInfoView from '@crema/core/AppInfoView';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IntlMessages from '@crema/utility/IntlMessages';
import AppTextField from '@crema/core/AppFormComponents/AppTextField';
import {Fonts} from '../../../shared/constants/AppEnums';
import AuthWrapper from '../AuthWrapper';
import AppLogo from '../../../@crema/core/AppLayout/components/AppLogo';
import {
  Dialog,
  DialogContentText,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {useAuthMethod, useAuthUser} from '../../../@crema/utility/AuthHooks';

import {useDispatch, useSelector} from 'react-redux';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {red} from '@mui/material/colors';

const validationSchema = yup.object({
  email: yup
    .string()
    .email(<IntlMessages id='validation.emailFormat' />)
    .required(<IntlMessages id='validation.emailRequired' />),
});

const ForgetPasswordJwtAuth = () => {
  const history = useRouter();
  const [openStatus, setOpenStatus] = React.useState(false);
  const [emailUser, setEmailUser] = React.useState('');
  const {forgotPassword} = useAuthMethod();

  const {generalSuccess} = useSelector(({general}) => general);
  console.log('generalSuccess', generalSuccess);
  const {generalError} = useSelector(({general}) => general);
  console.log('generalError', generalError);
  const {verificationCodeRes} = useSelector(({general}) => general);
  console.log('verificationCodeRes', verificationCodeRes);

  const onGoToResetPassword = () => {
    /* history.push('/reset-password', {tab: 'jwtAuth', state: emailUser}); */
    Router.push(
      {
        pathname: '/reset-password',
        tab: 'jwtAuth',
        query: {email: emailUser},
      },
      '/reset-password',
    );
  };
  const registerSuccess = () => {
    /* return (
      generalSuccess != undefined &&
      verificationCodeRes != undefined &&
      !('error' in verificationCodeRes)
    ); */
    return true;
  };
  const registerError = () => {
    return (
      (generalSuccess != undefined &&
        verificationCodeRes &&
        'error' in verificationCodeRes) ||
      generalError != undefined
    );
  };
  const showMessage = () => {
    if (registerSuccess()) {
      return (
        <>
          <CheckCircleOutlineOutlinedIcon
            color='success'
            sx={{fontSize: '6em', mx: 2}}
          />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            Se envió el código correctamente
          </DialogContentText>
        </>
      );
    } else if (registerError()) {
      return (
        <>
          <CancelOutlinedIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            Se ha producido un error al enviar el código.
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink />;
    }
  };

  const sendStatus = (data) => {
    if (registerSuccess()) {
      setOpenStatus(false);
      console.log('Data', data);
      onGoToResetPassword();
    } else if (registerError()) {
      setOpenStatus(false);
    } else {
      setOpenStatus(false);
    }
  };

  return (
    <AuthWrapper>
      <Box sx={{width: '100%'}}>
        <Box sx={{mb: {xs: 8, xl: 10}}}>
          <Box
            sx={{
              mb: 5,
              display: 'flex',
              alignItems: 'center',
              '& .logo': {
                height: 40,
              },
            }}
          >
            <AppLogo />
          </Box>
          <Typography
            variant='h2'
            component='h2'
            sx={{
              mb: 1.5,
              color: (theme) => theme.palette.text.primary,
              fontWeight: Fonts.SEMI_BOLD,
              fontSize: {xs: 14, xl: 16},
            }}
          >
            <IntlMessages id='common.forgetPassword' />
          </Typography>
        </Box>

        <Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
          <Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
            <Formik
              validateOnChange={true}
              initialValues={{
                email: '',
              }}
              validationSchema={validationSchema}
              onSubmit={(data, {setSubmitting, resetForm}) => {
                setSubmitting(true);
                console.log('Funcionando', data);
                /* setEmailUser(data.email); */
                forgotPassword(data.email);
                /* setOpenStatus(true); */
                setSubmitting(false);
                resetForm();
              }}
            >
              {({isSubmitting}) => (
                <Form style={{textAlign: 'left'}}>
                  <Box sx={{mb: {xs: 5, lg: 8}}}>
                    <AppTextField
                      placeholder='Email'
                      name='email'
                      label={<IntlMessages id='common.emailAddress' />}
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                      }}
                      variant='outlined'
                    />
                  </Box>

                  <div>
                    <Button
                      variant='contained'
                      color='primary'
                      disabled={isSubmitting}
                      sx={{
                        fontWeight: Fonts.REGULAR,
                        textTransform: 'capitalize',
                        fontSize: 16,
                        minWidth: 160,
                      }}
                      type='submit'
                    >
                      <IntlMessages id='common.vereficationCode' />
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
            <Typography
              sx={{
                pt: 3,
                fontSize: 15,
                color: 'grey.500',
              }}
            >
              <span style={{marginRight: 4}}>
                <IntlMessages id='common.alreadyHavePassword' />
              </span>
              <Box
                component='span'
                sx={{
                  fontWeight: Fonts.MEDIUM,
                  '& a': {
                    color: (theme) => theme.palette.primary.main,
                    textDecoration: 'none',
                  },
                }}
              >
                <Link href='/signin'>
                  <a>
                    <IntlMessages id='common.signIn' />
                  </a>
                </Link>
              </Box>
            </Typography>
          </Box>

          <AppInfoView />
        </Box>
      </Box>

      <Dialog
        open={openStatus}
        onClose={sendStatus}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Registro de Entrada'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          {showMessage()}
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          {registerSuccess() || registerError() ? (
            <Button variant='outlined' onClick={sendStatus}>
              Aceptar
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    </AuthWrapper>
  );
};

export default ForgetPasswordJwtAuth;
