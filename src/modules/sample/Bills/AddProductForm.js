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

import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';

import {useDispatch, useSelector} from 'react-redux';
import {onGetProducts} from '../../../redux/actions/Products';
import Router, {useRouter} from 'next/router';
import {red} from '@mui/material/colors';

import {DesktopDatePicker, DateTimePicker} from '@mui/lab';
import SelectProduct from './SelectProduct';
import PropTypes from 'prop-types';
import {GET_PRODUCTS} from '../../../shared/constants/ActionTypes';

const defaultValues = {
  productSearch: '',
  priceProduct: '',
  count: '',
  unitMeasure: '',
  taxCode: '',
  igvCode: '',
};
const actualValues = {
  productSearch: '',
  priceProduct: '',
  count: '',
  subTotal: '',
  unitMeasure: '',
  taxCode: '',
  igvCode: '',
};

const maxLength = 11111111111111111111; //20 caracteres
const validationSchema = yup.object({
  productSearch: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  priceProduct: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .required(<IntlMessages id='validation.required' />)
    .positive(<IntlMessages id='validation.positive' />),
  count: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .positive(<IntlMessages id='validation.positive' />)
    .required(<IntlMessages id='validation.required' />),
});

let selectedProduct = {};

const AddProductForm = ({sendData, type, igvEnabled}) => {
  const useStyles = {
    container: {
      textAlign: 'center',
    },
    btnGroup: {
      marginTop: '1em',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    btn: {
      margin: '3px 0',
      width: '260px',
    },
    noSub: {
      textDecoration: 'none',
    },
    field: {
      marginTop: '10px',
    },
    imgPreview: {
      display: 'flex',
      justifyContent: 'center',
    },
    img: {
      width: '80%',
    },
    fixPosition: {
      position: 'relative',
      bottom: '-8px',
    },
    searchIcon: {
      display: 'flex',
      alignItems: 'center',
    },
    buttonAddProduct: {},
  };
  /* const classes = useStyles(props); */
  const dispatch = useDispatch();
  const prodcutSearch = '';
  let changeValueField;
  console.log('funcion recibida', sendData);
  console.log('igv recibida', igvEnabled);
  let typeAlert = 'faltaProduct';
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  let listProductsPayload = {
    request: {
      payload: {
        businessProductCode: null,
        description: null,
        merchantId: userDataRes.merchantSelected.merchantId,
      },
    },
  };

  //FUNCIONES DIALOG
  const [open, setOpen] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [typeElement, setTypeElement] = React.useState('NIU');
  const [typeElement1, setTypeElement1] = React.useState('1000');
  const [proSearch, setProSearch] = React.useState();
  const [nameChanged, setNameChanged] = React.useState(false);
  const handleClose = () => {
    /* selectedProduct = {}; */
    setOpen(false);
  };

  const handleClickOpen = () => {
    setShowAlert(false);
    if (actualValues.productSearch != '') {
      listProductsPayload.request.payload.description =
        actualValues.productSearch;
    } else {
      listProductsPayload.request.payload.description = null;
    }
    dispatch({type: GET_PRODUCTS, payload: undefined});
    getProducts(listProductsPayload);
    setOpen(true);
  };

  const addProduct = (obj) => {
    selectedProduct = obj;
    console.log('Producto seleccionado', selectedProduct);
    changeValueField('priceProduct', selectedProduct.sellPriceUnit);
    changeValueField('productSearch', selectedProduct.description);
    setOpen(false);
  };

  //APIS FUNCTIONS
  const getProducts = (payload) => {
    dispatch(onGetProducts(payload));
  };

  const handleValues = (event) => {
    console.log('evento', event.target);
    Object.keys(actualValues).map((key) => {
      if (key == event.target.name) {
        actualValues[key] = event.target.value;
      }
      if (event.target.name == 'productSearch') {
        setProSearch(event.target.value);
      }
    });
    console.log('actualValues', actualValues);
  };

  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    setShowAlert(false);
    if (selectedProduct.stock < data.count && type == 'output') {
      console.log('porfavor selecciona un numero menor al total de productos');
      typeAlert = 'maxCount';
      setShowAlert(true);
    } else {
      let requiredKeys = ['product', 'description', 'costPriceUnit'];
      let objCorrect = true;
      requiredKeys.map((key, index) => {
        if (!(key in selectedProduct)) {
          objCorrect = false;
        }
      });
      delete selectedProduct['referencialPriceProduct'];
      if (true) {
        sendData({
          product:
            data.productSearch === selectedProduct.description
              ? selectedProduct.product
              : '',
          description: data.productSearch,
          unitMeasure: typeElement,
          customCodeProduct:
            selectedProduct.customCodeProduct !== undefined
              ? selectedProduct.customCodeProduct
              : '',
          quantityMovement: Number(data.count),
          priceBusinessMoneyWithIgv: Number(data.priceProduct),
          subtotal: Number(
            Number(data.count) * Number(data.priceProduct),
          ).toFixed(3),
          businessProductCode: selectedProduct.businessProductCode,
          taxCode: typeElement1,
          igvCode: SelectIgvCode(typeElement1),

        });
        actualValues.productSearch = '';
        actualValues.priceProduct = '';
        actualValues.count = '';
        actualValues.subTotal = '';
      } else {
        console.log('Porfavor selecciona un producto');
        typeAlert = 'faltaProduct';
        setShowAlert(true);
      }
    }
    setSubmitting(false);
  };

  const SelectIgvCode = (taxCode) => {  
    switch (taxCode) {
      case 1000:
        return 10;
        break;
      case 9997:
        return 20;
        break;
      case 9998:
        return 30;
        break;
      default:
        return null;
    }
  }; 

  const setDefaultTypeElement1 = () => {  
    if (igvEnabled) {
      setTypeElement1(1000);
    } else {
      setTypeElement1(9998);
    }
  }; 

  const handleTypeElement = (event) => {
    setTypeElement(event.target.value);
  };
  const handleTypeElement1 = (event) => {
    setTypeElement1(event.target.value);
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
                onChange={handleValues}
              >
                <Grid
                  container
                  spacing={2}
                  sx={{width: 500, margin: 'auto', justifyContent: 'center'}}
                >
                  <Grid item xs={8}>
                    <AppTextField
                      label='Nombre'
                      name='productSearch'
                      htmlFor='filled-adornment-password'
                      variant='outlined'
                      onChange={() => {
                        setNameChanged(true);
                      }}
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                      }}
                    />
                    {/* <Button onClick={vaciar}>Vaciar</Button> */}
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel id='unitMeasure-label'>Unidad</InputLabel>
                      <Select
                        name='unitMeasure'
                        label='Unidad'
                        labelId='unitMeasure-label'
                        onChange={handleTypeElement}
                        defaultValue='NIU'
                        value={typeElement}
                      >
                        <MenuItem value='NIU' style={{fontWeight: 200}}>
                          Producto
                        </MenuItem>
                        <MenuItem value='ZZ' style={{fontWeight: 200}}>
                          Servicio
                        </MenuItem>
                        <MenuItem value='KGM' style={{fontWeight: 200}}>
                          KGM
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={1} style={useStyles.searchIcon}>
                    <IconButton
                      aria-label='search'
                      onClick={handleClickOpen}
                      sx={{top: -10}}
                    >
                      <ManageSearchIcon />
                    </IconButton>
                  </Grid>

                  <Grid item xs={4}>
                    <AppTextField
                      label='Precio venta sugerido'
                      name='priceProduct'
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
                      label='Cantidad'
                      name='count'
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
                      <InputLabel id='taxCode-label'>Tipo IGV</InputLabel>
                      <Select
                        name='taxCode'
                        label='Tipo IGV'
                        labelId='taxCode-label'
                        onChange={handleTypeElement1}
                        defaultValue={setDefaultTypeElement1}
                        value={typeElement1}
                        disabled={true}
                      >
                        <MenuItem value='1000' style={{fontWeight: 200}}>
                          Gravado
                        </MenuItem>
                        <MenuItem value='9998' style={{fontWeight: 200}}>
                          Inafecto
                        </MenuItem>
                        <MenuItem value='9997' style={{fontWeight: 200}}>
                          Exonerado
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      color='primary'
                      type='submit'
                      variant='contained'
                      size='large'
                      sx={{my: '12px', width: 1}}
                      disabled={isSubmitting}
                      style={useStyles.buttonAddProduct}
                      endIcon={<AddCircleOutlineIcon />}
                    >
                      Añadir
                    </Button>
                  </Grid>
                </Grid>

                <Dialog
                  open={open}
                  onClose={handleClose}
                  maxWidth='lg'
                  sx={{textAlign: 'center'}}
                  aria-labelledby='alert-dialog-title'
                  aria-describedby='alert-dialog-description'
                >
                  <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
                    {'Selecciona un producto'}
                  </DialogTitle>
                  <DialogContent
                    sx={{display: 'flex', justifyContent: 'center'}}
                  >
                    <SelectProduct fcData={addProduct} />
                  </DialogContent>
                  <DialogActions sx={{justifyContent: 'center'}}>
                    <Button onClick={handleClose}>Aceptar</Button>
                  </DialogActions>
                </Dialog>
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

AddProductForm.propTypes = {
  sendData: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  //igvEnabled: PropTypes.func.isNot
};

export default AddProductForm;
