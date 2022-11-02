import React, {useState} from 'react';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import ReactCodeInput from 'react-code-input';
import {fetchError} from '../../redux/actions';
import {useIntl} from 'react-intl';
import {Fonts} from '../../shared/constants/AppEnums';
import PropTypes from 'prop-types';
import AppTextField from '../../@crema/core/AppFormComponents/AppTextField';
import IntlMessages from '../../@crema/utility/IntlMessages';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AppInfoView from '../../@crema/core/AppInfoView';
import AuthWrapper from './AuthWrapper';
import AppLogo from '../../@crema/core/AppLayout/components/AppLogo';
import Router, {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {useAuthMethod} from '../../@crema/utility/AuthHooks';

const validationSchema = yup.object({
  verificationCode: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .required(<IntlMessages id='validation.required' />)
    /* .length(6, <IntlMessages id='validation.maxLength' />) */
    .test(
      'len',
      <IntlMessages id='validation.lengthVerificationCode' />,
      (val) => val !== undefined && val.toString().length === 6,
    ),
  newPassword: yup
    .string()
    .required(<IntlMessages id='validation.enterNewPassword' />),
  confirmPassword: yup
    .string()
    .required(<IntlMessages id='validation.reTypePassword' />),
});

const ResetPasswordAwsCognito = (props) => {
  console.log('Datos pasados', props);
  const dispatch = useDispatch();
  const {forgotPasswordSubmit} = useAuthMethod();

  const {emailToSendCode} = useSelector(({user}) => user);
  console.log('emailToSendCode', emailToSendCode);

  const [pin, setPin] = useState('');

  const {messages} = useIntl();

  return (
    <AuthWrapper>
      <Box sx={{width: '100%'}}>
        <Box
          sx={{
            mb: 5,
            display: 'flex',
            alignItems: 'center',
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
          <IntlMessages id='common.resetPassword' />
        </Typography>

        <Formik
          validateOnChange={true}
          initialValues={{
            verificationCode: '',
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(data, {setErrors, resetForm, setSubmitting}) => {
            setSubmitting(true);
            console.log('Data', data);
            if (data.verificationCode.length !== 6) {
              dispatch(fetchError(messages['validation.pinLength']));
            } else if (data.newPassword !== data.confirmPassword) {
              setErrors({
                confirmPassword: (
                  <IntlMessages id='validation.passwordMisMatch' />
                ),
              });
            } else {
              console.log('todo correcto', {
                emailToSendCode: emailToSendCode,
                'data.verificationCode': data.verificationCode,
                'data.newPassword': data.newPassword,
              });
              forgotPasswordSubmit(
                emailToSendCode,
                data.verificationCode,
                data.newPassword,
              );
              resetForm();
            }
            setSubmitting(false);
          }}
        >
          {({isSubmitting}) => (
            <Form noValidate autoComplete='off'>
              <Box
                sx={{
                  mb: 6,
                  fontSize: {xs: 16, sm: 18},
                }}
              >
                <Typography>
                  <IntlMessages id='common.verificationMessage1' />{' '}
                  <Typography sx={{fontWeight: '600'}}>
                    <IntlMessages id='common.phoneNumber' />{' '}
                  </Typography>
                  <IntlMessages id='common.verificationMessage2' />
                  {` ${emailToSendCode}`}
                </Typography>
              </Box>
              <Box
                sx={{
                  mb: {xs: 4, lg: 6},
                }}
              >
                {/* <ReactCodeInput
                  type='password'
                  value={pin}
                  fields={6}
                  onChange={(value) => setPin(value)}
                /> */}
                <AppTextField
                  name='verificationCode'
                  label={<IntlMessages id='common.vereficationCode6Chars' />}
                  sx={{
                    width: '100%',
                  }}
                  variant='outlined'
                />
              </Box>

              <Box
                sx={{
                  mb: {xs: 4, lg: 6},
                }}
              >
                <AppTextField
                  name='newPassword'
                  label={<IntlMessages id='common.newPassword' />}
                  sx={{
                    width: '100%',
                  }}
                  variant='outlined'
                  type='password'
                />
              </Box>

              <Box
                sx={{
                  mb: {xs: 4, lg: 6},
                }}
              >
                <AppTextField
                  name='confirmPassword'
                  label={<IntlMessages id='common.retypePassword' />}
                  sx={{
                    width: '100%',
                  }}
                  variant='outlined'
                  type='password'
                />
              </Box>

              <Button
                variant='contained'
                disabled={isSubmitting}
                color='primary'
                type='submit'
                sx={{
                  fontWeight: Fonts.REGULAR,
                  textTransform: 'capitalize',
                  fontSize: 16,
                  minWidth: 160,
                }}
              >
                <IntlMessages id='common.resetMyPassword' />
              </Button>
            </Form>
          )}
        </Formik>
        <AppInfoView />
      </Box>
    </AuthWrapper>
  );
};

export default ResetPasswordAwsCognito;

ResetPasswordAwsCognito.propTypes = {
  location: PropTypes.object,
};
