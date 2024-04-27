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
  Snackbar,
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import MuiAlert from '@mui/material/Alert';
const Alert2 = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});
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

import unitMeasureOptions from '../../../Utils/unitMeasureOptions.json';
const defaultValues = {
  productSearch: '',
  count: '',
  unitMeasure: '',
  weight: 0,
};
const actualValues = {
  productSearch: '',
  count: '',
  subTotal: '',
  unitMeasure: '',
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const maxLength = 11111111111111111111; //20 caracteres

let selectedProduct = {};

const AddProductForm = ({sendData, type}) => {
  const validationSchema = yup.object({
    productSearch: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />)
      .required(<IntlMessages id='validation.required' />),
    count: yup
      .number()
      .typeError(<IntlMessages id='validation.number' />)
      .positive(<IntlMessages id='validation.positive' />)
      .required(<IntlMessages id='validation.required' />),
    weight: yup
      .number()
      .typeError(<IntlMessages id='validation.number' />)
      .positive(<IntlMessages id='validation.positive' />)
      .required(<IntlMessages id='validation.required' />)
      .test(
        'maxDigitsAfterDecimal',
        'El número puede contener como máximo 3 decimales',
        (number) => /^\d+(\.\d{1,3})?$/.test(number),
      ),
  });

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
  const [proSearch, setProSearch] = React.useState();
  const [nameChanged, setNameChanged] = React.useState(false);
  const [openAddedProduct, setOpenAddedProduct] = React.useState(false);
  const handleClose = () => {
    /* selectedProduct = {}; */
    setOpen(false);
  };
  const handleCloseAddedProduct = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAddedProduct(false);
  };
  const handleClickOpen = () => {
    setShowAlert(false);
    if (actualValues.productSearch != '') {
      listProductsPayload.request.payload.description =
        actualValues.productSearch;
    } else {
      listProductsPayload.request.payload.description = null;
    }
    getProducts(listProductsPayload);
    setOpen(true);
  };

  const addProduct = (obj) => {
    selectedProduct = obj;
    console.log('Producto seleccionado', selectedProduct);
    changeValueField('productSearch', selectedProduct.description);
    changeValueField('weight', selectedProduct.weight);
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
          priceBusinessMoneyWithIgv: 0,
          weight: data.weight,
          subtotal: Number(data.count) * 0,
          businessProductCode: selectedProduct.businessProductCode,
        });
        actualValues.productSearch = '';
        actualValues.count = '';
        actualValues.subTotal = '';
        setOpenAddedProduct(true);
      } else {
        console.log('Porfavor selecciona un producto');
        typeAlert = 'faltaProduct';
        setShowAlert(true);
      }
    }
    setSubmitting(false);
  };

  const handleTypeElement = (event) => {
    setTypeElement(event.target.value);
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
                        MenuProps={MenuProps}
                      >
                        {unitMeasureOptions.map((option, indexOption) => (
                          <MenuItem
                            key={`unitMeasureItem-${indexOption}`}
                            value={option.value}
                            style={{fontWeight: 200}}
                          >
                            {option.label}
                          </MenuItem>
                        ))}
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
                    <AppTextField
                      label='Peso Unitario (kg)'
                      name='weight'
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
      <Snackbar
        open={openAddedProduct}
        autoHideDuration={4000}
        onClose={handleCloseAddedProduct}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
      >
        <Alert2>Producto añadido correctamente!</Alert2>
      </Snackbar>
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
};

export default AddProductForm;
