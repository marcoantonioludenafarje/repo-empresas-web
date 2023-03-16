import React, {useEffect} from 'react';
import {makeStyles} from '@mui/styles';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import {
  Divider,
  Button,
  ButtonGroup,
  Select,
  TextField,
  AlertTitle,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Card,
  IconButton,
  Grid,
  FilledInput,
  Dialog,
  DialogActions,
  Stack,
  DialogContent,
  Collapse,
  Alert,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import AppUpperCaseTextField from '../../../@crema/core/AppFormComponents/AppUpperCaseTextField';

import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';

import {useDispatch, useSelector} from 'react-redux';
import {onGetProducts} from '../../../redux/actions/Products';
import Router, {useRouter} from 'next/router';
import {red} from '@mui/material/colors';

import {DesktopDatePicker, DateTimePicker} from '@mui/lab';
import SelectedProducts from '../Inputs/SelectedProducts';
import SelectProduct from '../Inputs/SelectProduct';
import PropTypes from 'prop-types';
import {toSimpleDate} from '../../../Utils/utils';

const useStyles = makeStyles((theme) => ({
  fixPosition: {
    position: 'relative',
    bottom: '-8px',
  },
}));

const maxLength = 11111111111111111111; //20 caracteres
const validationSchema2 = yup.object({
  documentIntern: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />)
    .max(maxLength, <IntlMessages id='validation.maxLength' />),
  /* serie: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .max(maxLength, <IntlMessages id='validation.maxLength' />),
  quotation: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .max(maxLength, <IntlMessages id='validation.maxLength' />), */
});

const defaultValues = {
  documentIntern: '',
  nameCarrier: '',
};

const formats = {
  quotation: '52',
  bill: 'FFF1-13',
  referralGuide: 'TTT1-18',
};

let selectedDocument = {};

const AddDocumentForm = ({sendData, acceptedType}, props) => {
  /* let objSelects = {
    billType: 'quotation',
  }; */
  const classes = useStyles(props);
  const dispatch = useDispatch();
  let changeValueField;
  console.log('funcion recibida', sendData);
  let typeAlert = 'faltaProduct';

  //FUNCIONES DIALOG
  const [open, setOpen] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [isRefGuide, setIsRefGuide] = React.useState(false);
  const [billType, setBillType] = React.useState(
    !acceptedType ? 'quotation' : acceptedType[0],
  );
  const [dateRegister, setDateRegister] = React.useState(Date.now());
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (acceptedType) {
      setIsRefGuide(acceptedType.includes('referralGuide'));
    }
  }, []);

  const validationSchema = React.useMemo(
    () =>
      yup.object({
        documentIntern: yup
          .string()
          .typeError(<IntlMessages id='validation.string' />)
          .required(<IntlMessages id='validation.required' />)
          .max(maxLength, <IntlMessages id='validation.maxLength' />),
        nameCarrier: yup
          .string()
          .typeError(<IntlMessages id='validation.string' />),
      }),
    [isRefGuide],
  );

  const addProduct = (obj) => {
    selectedDocument = obj;
    console.log('Producto seleccionado', selectedDocument);
    changeValueField('priceProduct', selectedDocument.costPriceUnit.toFixed(3));
    changeValueField('productSearch', selectedDocument.description);
    setOpen(false);
  };

  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    setShowAlert(false);
    console.log('data', data);
    sendData({
      document: data.documentIntern,
      nameCarrier: isRefGuide ? data.nameCarrier : '',
      typeDocument: billType,
      dateDocument: toSimpleDate(dateRegister),
      isSelected: true,
    });
    setSubmitting(false);
  };

  const handleBillType = (event) => {
    console.log('Valores de Tipo de factura', event);
    setBillType(event.target.value);
    setIsRefGuide(event.target.value == 'referralGuide');
  };
  const showPlaceholder = () => {
    console.log('holaaaas', formats[billType].props.id);
    return <IntlMessages id='document.format.quotation' />;
    /* if(billType)
    quotation: <IntlMessages id='document.format.quotation' />,
  bill: <IntlMessages id='document.format.bill' />,
  referralGuide: <IntlMessages id='document.format.referralGuide' />, */
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
          changeValueField = setFieldValue;
          return (
            <>
              <Form
                style={{textAlign: 'left', justifyContent: 'center'}}
                noValidate
                autoComplete='on'
              >
                <Grid
                  container
                  spacing={2}
                  sx={{width: 500, margin: 'auto'}}
                  justifyContent='center'
                >
                  <Grid item xs={4}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel id='status-label' style={{fontWeight: 200}}>
                        Tipo de documento
                      </InputLabel>
                      <Select
                        name='billType'
                        labelId='billType-label'
                        label='Tipo de documento'
                        defaultValue={
                          !acceptedType ? 'quotation' : acceptedType[0]
                        }
                        onChange={handleBillType}
                        /* value={moneyToConvert} */
                      >
                        {!acceptedType || acceptedType.includes('quotation') ? (
                          <MenuItem value='quotation' style={{fontWeight: 200}}>
                            <IntlMessages id='document.type.quotation' />
                          </MenuItem>
                        ) : null}
                        {!acceptedType || acceptedType.includes('bill') ? (
                          <MenuItem value='bill' style={{fontWeight: 200}}>
                            <IntlMessages id='document.type.bill' />
                          </MenuItem>
                        ) : null}
                        {!acceptedType ||
                        acceptedType.includes('referralGuide') ? (
                          <MenuItem
                            value='referralGuide'
                            style={{fontWeight: 200}}
                          >
                            <IntlMessages id='document.type.referralGuide' />
                          </MenuItem>
                        ) : null}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={4}>
                    <AppUpperCaseTextField
                      label='Número de documento'
                      name='documentIntern'
                      variant='outlined'
                      placeholder={formats[billType]}
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                        mx: 0,
                      }}
                    />
                  </Grid>
                  {isRefGuide ? (
                    <Grid item xs={4}>
                      <AppTextField
                        label='Nombre de Transportista'
                        name='nameCarrier'
                        variant='outlined'
                        sx={{
                          width: '100%',
                          '& .MuiInputBase-input': {
                            fontSize: 14,
                          },
                          my: 2,
                          mx: 0,
                        }}
                      />
                    </Grid>
                  ) : null}
                  <Grid item xs={4}>
                    <DesktopDatePicker
                      renderInput={(params) => (
                        <TextField
                          className={classes.fixPosition}
                          {...params}
                        />
                      )}
                      required
                      value={dateRegister}
                      label='Fecha documento'
                      inputFormat='dd/MM/yyyy'
                      name='initialDate'
                      onChange={(newValue) => {
                        setDateRegister(newValue);
                        console.log('date', newValue);
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
      <Collapse in={showAlert}>
        <Alert
          severity='error'
          action={
            <IconButton
              aria-label='close'
              color='inherit'
              size='small'
              onClick={() => {
                setShowAlert(false);
              }}
            >
              <CloseIcon fontSize='inherit' />
            </IconButton>
          }
          sx={{mb: 2}}
        >
          {typeAlert == 'maxCount' ? (
            'Por favor selecciona una cantidad menor al stock existente.'
          ) : (
            <></>
          )}
          {typeAlert == 'faltaProduct' ? (
            'Por favor selecciona un producto.'
          ) : (
            <></>
          )}
        </Alert>
      </Collapse>
    </>
  );
};

AddDocumentForm.propTypes = {
  sendData: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  acceptedType: PropTypes.array,
};

export default AddDocumentForm;
