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
} from '@mui/material';

import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {DesktopDatePicker, DateTimePicker} from '@mui/lab';
import PropTypes from 'prop-types';
import {useIntl} from 'react-intl';

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

const AddPayment = ({sendData}) => {
  const [payDate, setPayDate] = React.useState(Date.now());
  const [expirationDate, setExpirationDate] = React.useState(Date.now());
  const [statePayment, setStatePayment] = React.useState('paid');
  const [amount, setAmount] = React.useState(0);
  const {messages} = useIntl();
  const [paymentMethod, setPaymentMethod] = React.useState('cash');
  const [tooltip, setTooltip] = React.useState(false);
  const [counter, setCounter] = React.useState(0);

  const defaultValues = {
    amount: null,
    description: '',
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
      transactionNumber: data.transactionNumber,
      amount: Number(data.amounth),
      paymentMethod: paymentMethod,
      statePayment: statePayment,
      payDate: toEpoch(payDate),
      expirationDate: toEpoch(expirationDate),
    };
    console.log('Data', data);
    console.log('newObj', newObj);
    sendData(newObj);
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

                <Grid item xs={6}>
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
                <Grid item xs={6}>
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
                        <MenuItem value='yape' style={{fontWeight: 200}}>
                          Yape
                        </MenuItem>
                        <MenuItem value='plin' style={{fontWeight: 200}}>
                          Plin
                        </MenuItem>
                        <MenuItem
                          value='bankTransfer'
                          style={{fontWeight: 200}}
                        >
                          <IntlMessages id='common.bankTransfer' />
                        </MenuItem>
                        <MenuItem value='card' style={{fontWeight: 200}}>
                          Tarjeta de crédito/débito
                        </MenuItem>
                        <MenuItem value='bankDeposit' style={{fontWeight: 200}}>
                          <IntlMessages id='common.bankDeposit' />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Tooltip>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth sx={{my: 2}}>
                    <InputLabel id='categoria-label' style={{fontWeight: 200}}>
                      Estado
                    </InputLabel>
                    <Select
                      sx={{textAlign: 'left'}}
                      defaultValue={'paid'}
                      onChange={(event) => {
                        console.log(event.target.value);
                        setStatePayment(event.target.value);
                      }}
                      name='state'
                      labelId='state-label'
                      label='Estado'
                    >
                      <MenuItem value='paid' style={{fontWeight: 200}}>
                        CANCELADO
                      </MenuItem>
                      {/* <MenuItem value='advance' style={{fontWeight: 200}}>
                        ADELANTO
                      </MenuItem> */}
                      <MenuItem value='toPaid' style={{fontWeight: 200}}>
                        EN DEUDA
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <DesktopDatePicker
                    renderInput={(params) => (
                      <TextField
                        sx={{width: 1, position: 'relative', bottom: '-8px'}}
                        {...params}
                      />
                    )}
                    required
                    sx={{my: 2}}
                    value={payDate}
                    label='Fecha de pago'
                    inputFormat='dd/MM/yyyy'
                    name='date'
                    onChange={(newValue) => {
                      setPayDate(newValue);
                      console.log('pay date', newValue);
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <DesktopDatePicker
                    renderInput={(params) => (
                      <TextField
                        sx={{width: 1, position: 'relative', bottom: '-8px'}}
                        {...params}
                      />
                    )}
                    required
                    sx={{my: 2}}
                    value={expirationDate}
                    label='Fecha de vencimiento'
                    inputFormat='dd/MM/yyyy'
                    name='date'
                    onChange={(newValue) => {
                      setExpirationDate(newValue);
                      console.log('expiration date', newValue);
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
  );
};

AddPayment.propTypes = {
  sendData: PropTypes.func.isRequired,
};

export default AddPayment;
