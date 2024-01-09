import React, {useEffect} from 'react';
import {makeStyles} from '@mui/styles';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import {
  Button,
  IconButton,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  Collapse,
  Alert,
  DialogTitle,
  Typography,
  Snackbar
} from '@mui/material';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import MuiAlert from '@mui/material/Alert';
const Alert2 = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import CachedIcon from '@mui/icons-material/Cached';
import {useDispatch, useSelector} from 'react-redux';
import {onGetProducts} from '../../../redux/actions/Products';
import SelectProduct from './SelectProduct';
import PropTypes from 'prop-types';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';

const defaultValues = {
  productSearch: '',
  priceProduct: '',
  count: '',
  unitMeasure: '',
};
const actualValues = {
  productSearch: '',
  priceProduct: '',
  count: '',
  subTotal: '',
  unitMeasure: '',
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
    .positive(<IntlMessages id='validation.positive' />)
    .test(
      'maxDigitsAfterDecimal',
      'El número puede contener como máximo 10 decimales',
      (number) => /^\d+(\.\d{1,10})?$/.test(number),
    ),
  count: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .positive(<IntlMessages id='validation.positive' />)
    .required(<IntlMessages id='validation.required' />)
    .integer(<IntlMessages id='validation.number.integer' />),
});

/* let selectedProduct = {}; */

const AddExistingProduct = ({sendData, type}) => {
  const dispatch = useDispatch();
  let changeValueField;
  console.log('funcion recibida', sendData);
  // let typeAlert = 'faltaProduct';
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);

  //FUNCIONES DIALOG
  const [open, setOpen] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [typeElement, setTypeElement] = React.useState('NIU');
  const [selectedProduct, setSelectedProduct] = React.useState({});
  const [proSearch, setProSearch] = React.useState();
  const [nameChanged, setNameChanged] = React.useState(false);
  const [basicUrl, setBasicUrl] = React.useState(null);
  const [typeAlert, setTypeAlert] = React.useState('faltaProduct');
  const [openAddedProduct, setOpenAddedProduct] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseAddedProduct = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAddedProduct(false);
  };

  useEffect(() => {
    /* selectedProduct = {}; */

    let domain = new URL(window.location.href);
    setBasicUrl(domain.origin);
  }, []);

  const handleClickOpen = () => {
    setShowAlert(false);
    let listProductsPayload = {
      request: {
        payload: {
          businessProductCode: null,
          description: null,
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };

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
    setSelectedProduct(obj);
    console.log('Producto seleccionado', obj);
    changeValueField('priceProduct', obj.sellPriceUnit);
    changeValueField('productSearch', obj.description);
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
      // typeAlert = 'maxCount';
      setTypeAlert('maxCount');
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
          product: selectedProduct.product,
          description: selectedProduct.description,
          unitMeasure: typeElement,
          customCodeProduct: selectedProduct.customCodeProduct
            ? selectedProduct.customCodeProduct
            : '',
          locations: selectedProduct.locations || null,
          count: Number(data.count),
          priceProduct: Number(data.priceProduct),
          subtotal: Number(
            Number(data.count) * Number(data.priceProduct).toFixed(3),
          ),
          businessProductCode: selectedProduct.businessProductCode,
        });
        actualValues.productSearch = '';
        actualValues.priceProduct = '';
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
                <Grid container spacing={2} sx={{width: 500, margin: 'auto'}}>
                  <Grid item xs={12}>
                    <Button
                      variant='outlined'
                      endIcon={<ManageSearchIcon />}
                      sx={{width: 1}}
                      onClick={handleClickOpen}
                    >
                      Selecciona un producto
                    </Button>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography sx={{fontWeight: '400'}}>
                      {`PRODUCTO SELECCIONADO: ${
                        selectedProduct.description
                          ? selectedProduct.description
                          : ''
                      }`}
                    </Typography>
                    {/* <AppTextField
                      label='Producto seleccionado'
                      name='selectedProduct'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                      }}
                    /> */}
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

                <Dialog
                  open={open}
                  onClose={handleClose}
                  maxWidth='lg'
                  sx={{textAlign: 'center'}}
                  aria-labelledby='alert-dialog-title'
                  aria-describedby='alert-dialog-description'
                >
                  <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
                    <div>{`Listado de Producto`}</div>
                    <Button
                      sx={{mx: 'auto', mx: 1, my: 1, py: 3}}
                      variant='outlined'
                      startIcon={<CachedIcon sx={{m: 1, my: 'auto'}} />}
                      onClick={() => handleClickOpen()}
                    >
                      {'Actualizar'}
                    </Button>
                    <Button
                      sx={{mx: 'auto', py: 3, mx: 1, my: 1}}
                      variant='outlined'
                      startIcon={<ArrowCircleLeftOutlinedIcon />}
                      onClick={() =>
                        window.open(`${basicUrl}/sample/products/new`)
                      }
                    >
                      Agregar nuevo Produco
                    </Button>
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

AddExistingProduct.propTypes = {
  sendData: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default AddExistingProduct;
