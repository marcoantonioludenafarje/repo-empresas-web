import React, {useState, useEffect, useCallback, useRef} from 'react';
import {makeStyles} from '@mui/styles';
import * as yup from 'yup';
import {Form, Formik} from 'formik';
import AppPage from '../../../@crema/hoc/AppPage';
import AppPageMeta from '../../../@crema/core/AppPageMeta';

import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';

import {
  Button,
  ButtonGroup,
  Box,
  IconButton,
  Collapse,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from '@mui/material';

import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import {red} from '@mui/material/colors';

import {DesktopDatePicker, DateTimePicker} from '@mui/lab';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {produceProduct} from '../../../redux/actions/Products';
import Router, {useRouter} from 'next/router';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import PropTypes from 'prop-types';
import {
  toEpoch,
  convertToDateWithoutTime,
  fixDecimals,
} from '../../../Utils/utils';
import {
  FETCH_ERROR,
  FETCH_SUCCESS,
  PRODUCE_PRODUCT,
} from '../../../shared/constants/ActionTypes';

const validationSchema = yup.object({
  count: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .integer(<IntlMessages id='validation.number.integer' />),
});

const defaultValues = {
  count: null,
};

let producePayload = {
  request: {
    payload: {
      productId: '',
      quantityToProduce: null,
      merchantId: '',
      finalTotalPrice: null,
      dateMovement: null,
    },
  },
};

const objectsAreEqual = (a, b) => {
  // Comprobar si los dos valores son objetos
  if (typeof a === 'object' && typeof b === 'object') {
    // Comprobar si los objetos tienen las mismas propiedades
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) {
      return false;
    }
    // Comparar el valor de cada propiedad de forma recursiva
    for (const key of aKeys) {
      if (!objectsAreEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  // Comparar los valores directamente
  return a === b;
};

const AddFinishedProduct = ({product, listProducts, closeAddProd}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [amount, setAmount] = React.useState(0);
  const [registerDate, setRegisterDate] = React.useState(Date.now());
  const [openStatus, setOpenStatus] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [stockProducts, setStockProducts] = React.useState([]);

  useEffect(() => {
    setStockProducts(
      product.inputsProduct.map((obj) => {
        let ogProduct;
        ogProduct = listProducts.find(
          (objProd) => obj.productId == objProd.productId,
        );
        return ogProduct;
      }),
    );
    console.log('stockProducts', stockProducts);
  }, []);

  console.log('Producto', product);

  const toProduceProduct = (payload) => {
    dispatch(produceProduct(payload));
  };

  const {produceProductRes} = useSelector(({products}) => products);
  console.log('produceProductRes', produceProductRes);
  const {successMessage} = useSelector(({products}) => products);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({products}) => products);
  console.log('errorMessage', errorMessage);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  producePayload.request.payload.merchantId =
    userDataRes.merchantSelected.merchantId;

  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    dispatch({type: PRODUCE_PRODUCT, payload: []});
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    let goodStock = true;
    product.inputsProduct.forEach((obj) => {
      let actualProduct;
      actualProduct = stockProducts.find(
        (ogProd) => ogProd.productId == obj.productId,
      );
      if (actualProduct.stock < obj.quantity * amount) {
        goodStock = false;
      }
    });
    if (goodStock) {
      console.log('data', data);
      producePayload.request.payload.quantityToProduce = data.count;
      producePayload.request.payload.productId = product.productId;
      /* producePayload.request.payload.finalTotalPrice = ; */
      producePayload.request.payload.dateMovement = toEpoch(registerDate);
      toProduceProduct(producePayload);
      setShowAlert(false);
      setOpenStatus(true);
    } else {
      setShowAlert(true);
    }
    setSubmitting(false);
  };
  const sendStatus = () => {
    setOpenStatus(false);
    // Router.push('/sample/clients/table');
    closeAddProd();
  };
  const handleClose = () => {
    setOpen(false);
    Router.push('/sample/products/table');
  };

  const showMessage = () => {
    if (
      successMessage != undefined &&
      produceProductRes !== undefined &&
      (!(
        typeof tuVariable === 'object' &&
        tuVariable !== null &&
        'error' in produceProductRes
      ) ||
        objectsAreEqual(produceProductRes.error, {}))
    ) {
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
              Se ha registrado la información <br />
              correctamente
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{justifyContent: 'center'}}>
            <Button variant='outlined' onClick={sendStatus}>
              Aceptar
            </Button>
          </DialogActions>
        </>
      );
    } else if (
      (successMessage != undefined &&
        produceProductRes &&
        'error' in produceProductRes &&
        !objectsAreEqual(produceProductRes.error, {})) ||
        errorMessage
    ) {
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
              Se ha producido un error al registrar. <br />
              {produceProductRes !== undefined && 'error' in produceProductRes
                ? produceProductRes.error
                : null}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{justifyContent: 'center'}}>
            <Button variant='outlined' onClick={() => setOpenStatus(false)}>
              Aceptar
            </Button>
          </DialogActions>
        </>
      );
    } else {
      return <CircularProgress disableShrink sx={{mx: 'auto', my: '20px'}} />;
    }
  };
  const GetDescription = (productId, attribute) => {
    return listProducts.length > 0
      ? listProducts.filter((item) => item.productId == productId)[0][attribute]
      : '';
  };
  const capture = (event) => {
    console.log('event.target.name', event.target.name);
    if (event.target.name == 'count') {
      // setProSearch(event.target.value);
      setAmount(event.target.value);
    }

    // setAmount(value);
  };

  return stockProducts.length > 0 ? (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        mb: 5,
        mx: 'auto',
      }}
    >
      <AppPageMeta />
      <Formik
        validateOnChange={true}
        validationSchema={validationSchema}
        initialValues={{...defaultValues}}
        onSubmit={handleData}
      >
        {({isSubmitting}) => (
          <Form
            style={{textAlign: 'left'}}
            noValidate
            autoComplete='on'
            onChange={capture}
          >
            <Grid container spacing={1} sx={{width: 500, mx: 'auto', mb: 3}}>
              <Grid item xs={12}>
                <AppTextField
                  label='Código'
                  defaultValue={product.product}
                  disabled
                  name='code'
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
              <Grid item xs={12}>
                <AppTextField
                  label='Descripción'
                  name='description'
                  disabled
                  defaultValue={product.description}
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
              <Grid item xs={12}>
                <AppTextField
                  label='Cantidad a crear'
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
              {/* <Grid item xs={12}>
              <AppTextField
                  label='Total'
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
              </Grid> */}
              <Grid item xs={12} sx={{textAlign: 'center', m: 2}}>
                <DateTimePicker
                  renderInput={(params) => (
                    <TextField size='small' {...params} />
                  )}
                  fullwidth
                  label='Fecha de regostro'
                  inputFormat='dd/MM/yyyy hh:mm a'
                  value={registerDate}
                  onChange={(newVal) => {
                    setRegisterDate(newVal);
                  }}
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <TableContainer component={Paper} sx={{width: '90%'}}>
                <Table size='small' aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{width: '10px'}}>Código</TableCell>
                      <TableCell sx={{width: '10px'}}>Descripción</TableCell>
                      <TableCell sx={{width: '10px'}}>Proporcion</TableCell>
                      <TableCell sx={{width: '10px'}}>
                        Cantidad necesaria para producir
                      </TableCell>
                      <TableCell sx={{width: '10px'}}>
                        Stock Disponible
                      </TableCell>
                      {/* <TableCell sx={{width: '10px'}}>Subtotal</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {product.inputsProduct &&
                    typeof product.inputsProduct !== 'string' ? (
                      product.inputsProduct.map((obj, index) => {
                        const productSelected = stockProducts.find(
                          (element) => element.productId == obj.productId,
                        );

                        return (
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': {border: 0},
                            }}
                            key={index}
                            id={index}
                          >
                            <TableCell sx={{width: '10px'}}>
                              {GetDescription(obj.productId, 'product')}
                            </TableCell>
                            <TableCell sx={{width: '10px'}}>
                              {GetDescription(obj.productId, 'description')}
                            </TableCell>
                            <TableCell sx={{width: '10px'}}>
                              {obj.quantity}
                            </TableCell>
                            <TableCell
                              style={{
                                color:
                                  obj.quantity * amount > productSelected.stock
                                    ? 'red'
                                    : 'inherit',
                              }}
                              sx={{width: '10px'}}
                            >
                              {obj.quantity * amount}
                            </TableCell>
                            <TableCell sx={{width: '10px'}}>
                              {productSelected.stock}
                            </TableCell>
                            {/* <TableCell sx={{width: '10px'}}>
                              {fixDecimals(
                                obj.quantity * amount * obj.priceUnit,
                              )}
                            </TableCell> */}
                          </TableRow>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Grid item xs={12}>
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
                  No se cuenta con stock disponible en los insumos.
                </Alert>
              </Collapse>
            </Grid>
            <ButtonGroup
              orientation='vertical'
              variant='outlined'
              sx={{width: 1, my: 3}}
              aria-label='outlined button group'
            >
              <Button
                color='primary'
                type='submit'
                sx={{mx: 'auto', width: '50%', py: 3}}
                variant='contained'
                size='medium'
                disabled={isSubmitting}
                startIcon={<SaveAltOutlinedIcon />}
              >
                Finalizar
              </Button>
              <Button
                sx={{mx: 'auto', width: '50%', py: 3}}
                variant='outlined'
                size='medium'
                startIcon={<ArrowCircleLeftOutlinedIcon />}
                /* onClick={cancel} */
              >
                Cancelar
              </Button>
              {/* <Button
                  sx={{mx: 'auto', width: '80%', py: 3}}
                  variant='outlined'
                  size='medium'
                  startIcon={<SaveAltOutlinedIcon />}
                >
                  Guardar y registrar nuevo
                </Button> */}
            </ButtonGroup>
          </Form>
        )}
      </Formik>
      <Dialog
        open={openStatus}
        onClose={sendStatus}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Producción'}
        </DialogTitle>
        {showMessage()}
      </Dialog>
    </Box>
  ) : null;
};
AddFinishedProduct.propTypes = {
  product: PropTypes.object.isRequired,
  listProducts: PropTypes.array.isRequired,
  closeAddProd: PropTypes.func.isRequired,
};

export default AddFinishedProduct;
