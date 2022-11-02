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
import SelectedProducts from './SelectedProducts';
import SelectProduct from './SelectProduct';
import PropTypes from 'prop-types';
import {
  FETCH_SUCCESS,
  GET_FINANCES,
  FETCH_ERROR,
  GET_PRODUCTS,
} from '../../../shared/constants/ActionTypes';

const defaultValues = {
  productSearch: '',
  stock: '',
  count: '',
  unitPrice: '',
};
const actualValues = {
  productSearch: '',
  stock: '',
  count: '',
  unitPrice: '',
  subTotal: '',
};

const maxLength = 11111111111111111111; //20 caracteres
const validationSchema = yup.object({
  productSearch: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
  stock: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .required(<IntlMessages id='validation.selectProduct' />)
    .positive(<IntlMessages id='validation.positive' />),
  count: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .positive(<IntlMessages id='validation.positive' />)
    .required(<IntlMessages id='validation.required' />)
    .integer(<IntlMessages id='validation.number.integer' />),
  unitPrice: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .positive(<IntlMessages id='validation.positive' />)
    .required(<IntlMessages id='validation.required' />),
});

let selectedProduct = {};

const AddProductForm = ({sendData, type}) => {
  useEffect(() => {
    dispatch({type: GET_PRODUCTS, payload: undefined});
  }, []);

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

  useEffect(() => {
    selectedProduct = {};
  }, []);

  /* const classes = useStyles(props); */
  const dispatch = useDispatch();
  const prodcutSearch = '';
  let changeValueField;
  console.log('funcion recibida', sendData);

  let listProductsPayload = {
    request: {
      payload: {
        businessProductCode: null,
        description: null,
        merchantId: 'KX824',
      },
    },
  };

  //FUNCIONES DIALOG
  const [open, setOpen] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [typeAlert, setTypeAlert] = React.useState('');
  const [proSearch, setProSearch] = React.useState();
  const handleClose = () => {
    setOpen(false);
  };
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  listProductsPayload.request.payload.merchantId =
    userDataRes.merchantSelected.merchantId;

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
    changeValueField('stock', selectedProduct.stock);
    changeValueField('productSearch', selectedProduct.description);
    changeValueField('unitPrice', selectedProduct.sellPriceUnit);
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
    if (Object.keys(selectedProduct).length === 0) {
      console.log(
        'porfavor selecciona un numero menor o igual al total de productos',
      );
      setTypeAlert('faltaProduct');
      setShowAlert(true);
    } else if (selectedProduct.stock < data.count) {
      console.log('Porfavor selecciona un producto');
      setTypeAlert('maxCount');
      setShowAlert(true);
    } else {
      console.log('Final obj', {data, selectedProduct});
      let finalObj = {
        ...data,
        product: selectedProduct.product,
        description: selectedProduct.description,
        referencialPriceProduct: data.unitPrice,
        subtotal: Number(data.unitPrice) * Number(data.count),
      };
      console.log('Data recibida', finalObj);
      sendData(finalObj);
      /* setProSearch(''); */
      actualValues.productSearch = '';
      actualValues.stock = '';
      actualValues.count = '';
      actualValues.subTotal = '';
    }
    setSubmitting(false);
  };

  const showMessage = () => {
    if (typeAlert == 'maxCount') {
      return 'Por favor selecciona una cantidad menor al stock existente.';
    }
    if (typeAlert == 'faltaProduct') {
      ('Por favor selecciona un producto.');
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
                  sx={{width: 500, margin: 'auto'}}
                  justifyContent='center'
                >
                  <Grid item xs={11}>
                    <AppTextField
                      label='Producto a buscar'
                      name='productSearch'
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
                    {/* <Button onClick={vaciar}>Vaciar</Button> */}
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
                      name='unitPrice'
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
                    <AppTextField
                      label='Stock'
                      name='stock'
                      disabled
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
          {showMessage()}
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
