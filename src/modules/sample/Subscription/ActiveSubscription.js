import React, {useEffect, useRef} from 'react';
import {
  Button,
  Card,
  Box,
  Typography,
  Grid,
  Divider,
  ButtonGroup,
} from '@mui/material';

import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';

import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import {translateValue} from '../../../Utils/utils';
import {useIntl} from 'react-intl';

const ActiveSubscription = () => {
  const fontSize = 15;
  const {messages} = useIntl();
  const validationSchema = yup.object({
    email: yup
      .string()
      .email(<IntlMessages id='validation.emailFormat' />)
      .required(<IntlMessages id='validation.emailRequired' />),
    accesCode: yup.string().typeError(<IntlMessages id='validation.string' />),
    /* .required(<IntlMessages id='validation.required' />) */
  });
  const defaultValues = {
    email: '',
    accesCode: '',
  };
  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    console.log('data', data);
    setSubmitting(false);
  };

  return (
    <Card sx={{p: 4}}>
      <Box sx={{width: 1, textAlign: 'center'}}>
        <Typography
          sx={{
            mx: 'auto',
            my: '10px',
            fontWeight: 600,
            fontSize: 25,
            textTransform: 'uppercase',
          }}
        >
          {messages['sidebar.sample.subscription.active']}
        </Typography>
      </Box>

      <Divider sx={{mt: 2, mb: 4}} />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          mb: 5,
          mx: 'auto',
          width: 2 / 3,
        }}
      >
        <Formik
          validateOnChange={true}
          validationSchema={validationSchema}
          initialValues={{...defaultValues}}
          onSubmit={handleData}
        >
          {({isSubmitting}) => {
            return (
              <Form
                id='principal-form'
                style={{textAlign: 'left', justifyContent: 'center'}}
                noValidate
                autoComplete='on'
              >
                <Grid
                  container
                  spacing={2}
                  sx={{maxWidth: 500, width: 'auto', margin: 'auto'}}
                >
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        textAlign: 'center',
                        mx: 'auto',
                        my: '10px',
                        fontSize: fontSize,
                        textTransform: 'uppercase',
                      }}
                    >
                      {messages['message.subscription.iwant']
                        .replace('{1}', 'S/')
                        .replace('{2}', 'xxx')}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <AppTextField
                      label={<IntlMessages id='sidebar.apps.email' />}
                      name='email'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                      }}
                    />
                  </Grid>

                  {/* <Grid item xs={12}>
                    <Typography
                      sx={{
                        textAlign: 'center',
                        mx: 'auto',
                        my: '10px',
                        fontSize: fontSize,
                        textTransform: 'uppercase',
                      }}
                    >
                      {messages['common.insert.accesCode']}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <AppTextField
                      label={<IntlMessages id='sidebar.apps.accesCode' />}
                      name='accesCode'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                      }}
                    />
                  </Grid> */}
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Box>

      <ButtonGroup
        orientation='vertical'
        variant='outlined'
        sx={{width: 1}}
        aria-label='outlined button group'
      >
        <Button
          color='primary'
          sx={{mx: 'auto', mt: 2, mb: 6, width: '50%', py: 3}}
          type='submit'
          form='principal-form'
          variant='contained'
        >
          {messages['message.send.activation.request']}
        </Button>
      </ButtonGroup>
    </Card>
  );
};

export default ActiveSubscription;
