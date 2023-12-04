import React, {useEffect, useRef} from 'react';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import {
  Button,
  Select,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Grid,
  Tooltip,
  Snackbar
} from '@mui/material';

import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {DesktopDatePicker, DateTimePicker} from '@mui/lab';
import PropTypes from 'prop-types';
import {useIntl} from 'react-intl';
import MuiAlert from '@mui/material/Alert';
const Alert2 = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;});
const validationSchema = yup.object({
  description: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  transactionNumber: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  amounth: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .required(<IntlMessages id='validation.required' />)
    .positive(<IntlMessages id='validation.positive' />)
    .test(
      'maxDigitsAfterDecimal',
      'El número puede contener como máximo 3 decimales',
      (number) => /^\d+(\.\d{1,3})?$/.test(number),
    ),
});

const AddOtherPayConcept = ({sendData}) => {
  const [payDate, setPayDate] = React.useState(Date.now());
  const [expirationDate, setExpirationDate] = React.useState(Date.now());
  const [statePayment, setStatePayment] = React.useState('paid');
  const [amount, setAmount] = React.useState(0);
  const {messages} = useIntl();
  const [paymentMethod, setPaymentMethod] = React.useState('cash');
  const [conceptAction, setConceptAction] = React.useState('add');
  const [tooltip, setTooltip] = React.useState(false);
  const [counter, setCounter] = React.useState(0);
  const [openAddedPayment, setOpenAddedPayment] = React.useState(false);

  const handleCloseAddedPayment = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAddedPayment(false);
  };


  const defaultValues = {
    amount: null,
    description: '',
    conceptAction: 'add',
  };

  useEffect(() => {
    if (counter == 0 && amount > 2000) {
      setTooltip(true);
      setCounter(1);
    }
  }, [amount]);

  const toEpoch = (strDate) => {
    let someDate = new Date(strDate);
    someDate = someDate.getTime();
    return someDate;
  };

  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    const newObj = {
      description: data.description,
      commentPayment: data.commentPayment,
      transactionNumber: data.transactionNumber,
      amount: Number(data.amounth),
      paymentMethod: paymentMethod,
      conceptAction: conceptAction,
      statePayment: statePayment,
      payDate: toEpoch(payDate),
      expirationDate: toEpoch(expirationDate),
    };
    console.log('Data', data);
    console.log('newObj', newObj);
    sendData(newObj);
    setOpenAddedPayment(true);
    setSubmitting(false);
  };

  const handleChange = (event) => {
    if (event.target.name == 'amounth') {
      setAmount(event.target.value);
      /* if (paymentMethod == 'cash' && event.target.value > 2000) {
        setPaymentMethod('debit');
      } */
    }
  };

  return (
  <>
  
    <Formik
      validateOnChange={true}
      validationSchema={validationSchema}
      initialValues={{...defaultValues}}
      onSubmit={handleData}
    >
      {({isSubmitting, setFieldValue}) => {
        return (
          <>
            <Form
              style={{
                textAlign: 'left',
                justifyContent: 'center',
              }}
              noValidate
              autoComplete='on'
              onChange={handleChange}
            >
              <Grid
                container
                spacing={2}
                sx={{width: 500, margin: 'auto', justifyContent: 'center'}}
              >
                <Grid item xs={12}>
                  <AppTextField
                    label='Descripción'
                    name='description'
                    htmlFor='filled-adornment-password'
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

                <Grid item xs={4}>
                  <AppTextField
                    label='Nro de operación'
                    name='transactionNumber'
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
                <Grid item xs={4}>
                  <AppTextField
                    label='Monto'
                    name='amounth'
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
                <Grid item xs={4}>
                  <FormControl fullWidth sx={{my: 2}}>
                    <InputLabel
                      id='conceptAction-label'
                      style={{fontWeight: 200}}
                    >
                      Acción
                    </InputLabel>
                    <Select
                      sx={{textAlign: 'left'}}
                      defaultValue={'add'}
                      onChange={(event) => {
                        console.log(event.target.value);
                        setConceptAction(event.target.value);
                      }}
                      name='conceptAction'
                      labelId='conceptAction-label'
                      label='Acción'
                    >
                      <MenuItem value='subtract' style={{fontWeight: 200}}>
                        RESTAR
                      </MenuItem>
                      <MenuItem value='add' style={{fontWeight: 200}}>
                        SUMAR
                      </MenuItem>
                      <MenuItem value='neutral' style={{fontWeight: 200}}>
                        NEUTRA
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <Tooltip
                    title={messages['message.greaterThan.need.debit'].replace(
                      '{1}',
                      2000,
                    )}
                    open={amount > 2000 ? tooltip : false}
                    placement='top'
                  >
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel
                        id='paymentMethod-label'
                        style={{fontWeight: 200}}
                      >
                        <IntlMessages id='payment.method' />
                      </InputLabel>
                      <Select
                        sx={{textAlign: 'left'}}
                        value={paymentMethod}
                        onClick={() => setTooltip(false)}
                        onChange={(event) => {
                          setPaymentMethod(event.target.value);
                          console.log('paymentMethod', event.target.value);
                        }}
                        onMouseEnter={() => setTooltip(true)}
                        onMouseLeave={() => setTooltip(false)}
                        name='paymentMethod'
                        labelId='paymentMethod-label'
                        label={<IntlMessages id='payment.method' />}
                      >
                        <MenuItem value='cash' style={{fontWeight: 200}}>
                          <IntlMessages id='common.cash' />
                        </MenuItem>
                        <MenuItem
                          value='bankTransfer'
                          style={{fontWeight: 200}}
                        >
                          <IntlMessages id='common.bankTransfer' />
                        </MenuItem>
                        <MenuItem value='bankDeposit' style={{fontWeight: 200}}>
                          <IntlMessages id='common.bankDeposit' />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Tooltip>
                </Grid>

                <Grid item xs={12}>
                  <AppTextField
                    label='Comentario'
                    name='commentPayment'
                    htmlFor='filled-adornment-password'
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
                <Grid item xs={4}>
                  <Button
                    color='primary'
                    type='submit'
                    variant='contained'
                    size='large'
                    sx={{my: '12px', width: 1}}
                    disabled={isSubmitting}
                    endIcon={<AddCircleOutlineIcon />}
                  >
                    Añadir
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </>
        );
      }}
    </Formik>
    <Snackbar
        open={openAddedPayment}
        autoHideDuration={4000}
        onClose={handleCloseAddedPayment}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
      >
        <Alert2>Producto añadido correctamente!</Alert2>
      </Snackbar>
    </> 
  );
};

AddOtherPayConcept.propTypes = {
  sendData: PropTypes.func.isRequired,
};

export default AddOtherPayConcept;
