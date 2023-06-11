import React, {useEffect, useRef} from 'react';
import {
  Button,
  Card,
  Box,
  Typography,
  Grid,
  Divider,
  ButtonGroup,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';

import {cancellCompleteBusiness} from '../../../../redux/actions/General';

import AppTextField from '../../../../@crema/core/AppFormComponents/AppTextField';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import {translateValue} from '../../../../Utils/utils';
import {useDispatch, useSelector} from 'react-redux';

import {useIntl} from 'react-intl';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  CANCEL_COMPLETE_BUSINESS,
} from '../../../../shared/constants/ActionTypes';

const BusinessCancellation = () => {
  const dispatch = useDispatch();
  const fontSize = 15;
  const {messages} = useIntl();
  const [openStatus, setOpenStatus] = React.useState(false);

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

  const {cancelCompleteBusinessRes} = useSelector(({general}) => general);
  console.log('cancelCompleteBusinessRes', cancelCompleteBusinessRes);
  const {successMessage} = useSelector(({movements}) => movements);
  const {errorMessage} = useSelector(({movements}) => movements);

  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: CANCEL_COMPLETE_BUSINESS, payload: undefined});
    console.log('data', data);
    setOpenStatus(true);
    setSubmitting(false);
  };

  const cancelBusiness = (payload) => {
    dispatch(cancellCompleteBusiness(payload));
  };

  const registerSuccess = () => {
    return (
      successMessage != undefined &&
      cancelCompleteBusinessRes != undefined &&
      !('error' in cancelCompleteBusinessRes)
    );
  };
  const registerError = () => {
    return (
      (successMessage != undefined && cancelCompleteBusinessRes) || errorMessage
    );
  };
  const sendStatus = () => {
    if (registerSuccess()) {
      Router.push('/sample/distribution/table');
      setOpenStatus(false);
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
              <IntlMessages id='message.register.data.success' />
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
              <IntlMessages id='message.register.data.error' />
              <br />
              {cancelCompleteBusinessRes && 'error' in cancelCompleteBusinessRes
                ? cancelCompleteBusinessRes.error
                : null}
            </DialogContentText>
          </DialogContent>
        </>
      );
    } else {
      return <CircularProgress disableShrink sx={{mx: 'auto', my: '20px'}} />;
    }
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
          {messages['message.cancell.business,users']}
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
                        fontSize: fontSize,
                      }}
                    >
                      {messages['message.delete.allbusiness']}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <a href='#'>
                      <Typography
                        sx={{
                          textAlign: 'center',
                          mx: 'auto',
                          fontSize: fontSize,
                        }}
                      >
                        {messages['common.termConditions']}
                      </Typography>
                    </a>
                  </Grid>

                  <Grid item xs={12}>
                    <AppTextField
                      label={messages['common.confirm.password']}
                      name='password'
                      type='password'
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
          {messages['message.send.activation.request,definitive']}
        </Button>
      </ButtonGroup>
    </Card>
  );
};

export default BusinessCancellation;
