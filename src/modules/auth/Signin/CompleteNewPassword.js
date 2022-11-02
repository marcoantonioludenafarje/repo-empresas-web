import React from 'react';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import {useIntl} from 'react-intl';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import Box from '@mui/material/Box';
import Link from 'next/link';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AppInfoView from '../../../@crema/core/AppInfoView';
import AuthWrapper from '../AuthWrapper';
import AppLogo from '../../../@crema/core/AppLayout/components/AppLogo';
import Typography from '@mui/material/Typography';

import {useDispatch, useSelector} from 'react-redux';
import {useAuthMethod, useAuthUser} from '../../../@crema/utility/AuthHooks';
import {Fonts} from '../../../shared/constants/AppEnums';
import {AiOutlineGoogle} from 'react-icons/ai';
import {FaFacebookF} from 'react-icons/fa';
import {useRouter} from 'next/router';

const validationSchema = yup.object({
  newPassword: yup
    .string()
    .required(<IntlMessages id='common.passwordNoProvided' />)
    .min(8, <IntlMessages id='common.passwordShort' />)
    .matches(/[a-zA-Z]/, <IntlMessages id='common.passwordOnlyLetters' />),
});

const CompleteNewPassword = () => {
  const {auth} = useAuthUser();
  const {completeNewPassword} = useAuthMethod();
  const history = useRouter();

  const {user} = useSelector(({user}) => user);
  console.log('user', user);
  const {successMessage} = useSelector(({user}) => user);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({user}) => user);
  console.log('errorMessage', errorMessage);

  const {messages} = useIntl();

  return (
    <AuthWrapper>
      <Box sx={{width: '100%'}}>
        <Box sx={{mb: {xs: 6, xl: 8}}}>
          <Box
            sx={{
              mb: 5,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <AppLogo />
          </Box>
        </Box>

        <Box
          sx={{
            mb: {xs: 5, xl: 10},
            fontSize: 18,
          }}
        >
          <Typography>
            <IntlMessages id='common.insertNewPassword' />
          </Typography>
        </Box>

        <Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
          <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', mb: 5}}>
            <Formik
              validateOnChange={true}
              initialValues={{
                newPassword: '',
              }}
              validationSchema={validationSchema}
              onSubmit={(data, {setSubmitting}) => {
                setSubmitting(true);
                console.log('Data', {
                  user: user,
                  newPassword: data.newPassword,
                });
                completeNewPassword({
                  user: user,
                  newPassword: data.newPassword,
                });
                setSubmitting(false);
              }}
            >
              {({isSubmitting}) => (
                <Form style={{textAlign: 'left'}} noValidate autoComplete='off'>
                  <Box sx={{mb: {xs: 3, xl: 4}}}>
                    <AppTextField
                      type='password'
                      placeholder={messages['common.newPassword']}
                      label={<IntlMessages id='common.newPassword' />}
                      name='newPassword'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                      }}
                    />
                  </Box>

                  <div>
                    <Button
                      variant='contained'
                      color='primary'
                      type='submit'
                      disabled={isSubmitting}
                      sx={{
                        minWidth: 160,
                        fontWeight: Fonts.REGULAR,
                        fontSize: 16,
                        textTransform: 'capitalize',
                        padding: '4px 16px 8px',
                      }}
                    >
                      <IntlMessages id='common.endAction' />
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Box>

          <AppInfoView />
        </Box>
      </Box>
    </AuthWrapper>
  );
};

export default CompleteNewPassword;
