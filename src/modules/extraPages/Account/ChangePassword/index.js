import React from 'react';
import {Box, Typography} from '@mui/material';
import IntlMessages from '@crema/utility/IntlMessages';
import {Fonts} from '../../../../shared/constants/AppEnums';
import ChangePasswordForm from './ChangePasswordForm';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useAuthMethod} from '../../../../@crema/utility/AuthHooks';
import {useDispatch, useSelector} from 'react-redux';
import AppInfoView from '@crema/core/AppInfoView';

const validationSchema = yup.object({
  oldPassword: yup
    .string()
    .required(<IntlMessages id='common.passwordNoProvided' />)
    .min(8, <IntlMessages id='common.passwordShort' />)
    .matches(/[a-zA-Z]/, <IntlMessages id='common.passwordOnlyLetters' />),
  newPassword: yup
    .string()
    .required(<IntlMessages id='common.passwordNoProvided' />)
    .min(8, <IntlMessages id='common.passwordShort' />)
    .matches(/[a-zA-Z]/, <IntlMessages id='common.passwordOnlyLetters' />),
  retypeNewPassword: yup
    .string()
    .oneOf(
      [yup.ref('newPassword'), null],
      <IntlMessages id='common.passwordMustMatch' />,
    ),
});

const ChangePassword = () => {
  const {changePassword} = useAuthMethod();
  const dispatch = useDispatch();

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
        <IntlMessages id='common.changePassword' />
      </Typography>
      <Formik
        validateOnChange={false}
        validateOnBlur={true}
        initialValues={{
          oldPassword: '',
          newPassword: '',
          retypeNewPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(data, {setSubmitting}) => {
          setSubmitting(true);
          console.log('data: ', data);
          changePassword(data.oldPassword, data.newPassword);

          setSubmitting(false);
        }}
      >
        <ChangePasswordForm />
      </Formik>
      <AppInfoView />
    </Box>
  );
};

export default ChangePassword;
