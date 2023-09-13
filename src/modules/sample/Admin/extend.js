import React from 'react';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import {Button, ButtonGroup, TextField, Grid, FormControl} from '@mui/material';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import PropTypes from 'prop-types';
import {DateTimePicker} from '@mui/lab';

const validationSchema = yup.object({});

const defaultValues = {
  dateExpiration: '',
};

const toEpoch = (strDate) => {
  let someDate = new Date(strDate);
  someDate = someDate.getTime();
  return someDate;
};

const extend = ({sendData, ds}) => {
  const [dateExpiration, setDateExpiration] = React.useState(ds);
  const [dateExpirationForm, setDateExpirationForm] = React.useState(
    toEpoch(ds),
  );
  let changeValueField;

  console.log('info inicial', ds);

  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    let filters = {
      ...data,
      dateExpiration: dateExpiration,
    };
    console.log('info desde + filtros', filters);
    sendData(dateExpiration);
    setSubmitting(false);
  };

  return (
    <Formik
      validateOnChange={true}
      validationSchema={validationSchema}
      initialValues={{...defaultValues}}
      onSubmit={handleData}
    >
      {({isSubmitting, setFieldValue}) => {
        changeValueField = setFieldValue;
        return (
          <Form
            style={{textAlign: 'left', justifyContent: 'center'}}
            noValidate
            autoComplete='on'
          >
            <Grid container spacing={2} sx={{width: 1}}>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{my: 2}}>
                  <DateTimePicker
                    renderInput={(params) => (
                      <TextField size='small' {...params} />
                    )}
                    value={dateExpirationForm}
                    required
                    label='Fecha Expiración Suscripción'
                    inputFormat='dd/MM/yyyy hh:mm a'
                    minDate={Date.now()}
                    onChange={(newValue) => {
                      console.log('new valie', newValue);
                      setDateExpiration(toEpoch(newValue));
                      setDateExpirationForm(newValue);
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <ButtonGroup
              orientation='vertical'
              variant='outlined'
              sx={{width: 1, my: '10px'}}
              aria-label='outlined button group'
            >
              <Button
                color='primary'
                sx={{mx: 'auto', width: '50%', py: 3}}
                type='submit'
                variant='contained'
                disabled={isSubmitting}
                startIcon={<FilterAltIcon />}
              >
                Actualizar
              </Button>
            </ButtonGroup>
          </Form>
        );
      }}
    </Formik>
  );
};

extend.propTypes = {
  sendData: PropTypes.func.isRequired,
  ds: PropTypes.number,
};

export default extend;
