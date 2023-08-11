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
  FormControlLabel,
  Checkbox,
  useMediaQuery,
  useTheme,
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
import {GET_PRODUCTS} from '../../../shared/constants/ActionTypes';
import unitMeasureOptions from '../../../Utils/unitMeasureOptions.json';

const defaultValues = {
  productSearch: '',
  productPrice: '',
  subtotalWithoutIgv: '',
  productIgv: '',
  subtotalWithIgv: '',
  count: 1,
  unitMeasure: '',
  taxCode: '',
};
const actualValues = {
  productSearch: '',
  productPrice: '',
  subtotalWithoutIgv: '',
  productIgv: '',
  subtotalWithIgv: '',
  count: '',
  subTotal: '',
  unitMeasure: '',
  taxCode: '',
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
const validationSchema = yup.object({
  productSearch: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  productPrice: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .required(<IntlMessages id='validation.required' />)
    .positive(<IntlMessages id='validation.positive' />)
    .test(
      'ten-decimals',
      <IntlMessages id='validation.tenDecimals' />,
      (value) => {
        // Verificar si el valor tiene dos o menos decimales
        if (typeof value === 'number') {
          return /^-?\d+(\.\d{1,10})?$/.test(value.toString());
        }
        return true; // Permitir otros tipos de entrada sin verificar
      },
    ),
  count: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .positive(<IntlMessages id='validation.positive' />)
    .required(<IntlMessages id='validation.required' />),
  subtotalWithIgv: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .positive(<IntlMessages id='validation.positive' />)
    .test(
      'two-decimals',
      <IntlMessages id='validation.twoDecimals' />,
      (value) => {
        // Verificar si el valor tiene dos o menos decimales
        if (typeof value === 'number') {
          return /^-?\d+(\.\d{1,2})?$/.test(value.toString());
        }
        return true; // Permitir otros tipos de entrada sin verificar
      },
    ),
  subtotalWithoutIgv: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .positive(<IntlMessages id='validation.positive' />)
    .test(
      'two-decimals',
      <IntlMessages id='validation.twoDecimals' />,
      (value) => {
        // Verificar si el valor tiene dos o menos decimales
        if (typeof value === 'number') {
          return /^-?\d+(\.\d{1,2})?$/.test(value.toString());
        }
        return true; // Permitir otros tipos de entrada sin verificar
      },
    ),
});

const AddProductForm = ({sendData, type, igvEnabled, igvDefault}) => {
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const prodcutSearch = '';
  let changeValueField;
  let getValueField;
  console.log('funcion recibida', sendData);
  console.log('igv recibida', igvEnabled);

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
  const [selectedProduct, setSelectedProduct] = React.useState([]);
  const [typeAlert, setTypeAlert] = React.useState('faltaProduct');
  const [showAlert, setShowAlert] = React.useState(false);
  const [typeElement, setTypeElement] = React.useState(
    userDataRes.merchantSelected.businessLine == 'services' ? 'ZZ' : 'NIU',
  );
  const [typeTaxCode, setTypeTaxCode] = React.useState(
    igvEnabled ? '1000' : '9998',
  );
  const [proSearch, setProSearch] = React.useState();
  const [nameChanged, setNameChanged] = React.useState(false);
  const [stockChange, setStockChange] = React.useState(
    false,
  );
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
    let newSelectedProduct = obj;
    console.log('Producto seleccionado', newSelectedProduct);
    setTypeElement(obj.unitMeasure);
    if (
      obj.unitMeasure == 'ZZ' ||
      (newSelectedProduct && newSelectedProduct.isStockNeeded === false)
    ) {
      setStockChange(false);
    } else {
      setStockChange(true);
    }
    changeValueField('productPrice', newSelectedProduct.sellPriceUnit);
    changeValueField(
      'subtotalWithoutIgv',
      Number(
        newSelectedProduct.sellPriceUnit * getValueField('count').value,
      ).toFixed(2),
    );
    changeValueField(
      'productIgv',
      Number(
        typeTaxCode == 1000
          ? newSelectedProduct.sellPriceUnit *
              getValueField('count').value *
              igvDefault
          : 0,
      ).toFixed(2),
    );
    changeValueField(
      'subtotalWithIgv',
      Number(
        typeTaxCode == 1000
          ? newSelectedProduct.sellPriceUnit *
              getValueField('count').value *
              (1 + igvDefault)
          : newSelectedProduct.sellPriceUnit * getValueField('count').value,
      ).toFixed(2),
    );

    changeValueField('productSearch', newSelectedProduct.description);
    setSelectedProduct(newSelectedProduct);
    setOpen(false);
  };

  //APIS FUNCTIONS
  const getProducts = (payload) => {
    dispatch(onGetProducts(payload));
  };

  const handleValues = (event) => {
    console.log('evento', event.target);
    Object.keys(actualValues).map((key) => {
      if (
        key == event.target.name &&
        (key == 'productPrice' || key == 'count')
      ) {
        actualValues[key] = Number(event.target.value);
        let productQuantity = getValueField('count').value;
        let actualProductPrice = getValueField('productPrice').value;
        if (event.target.name == 'productPrice') {
          actualProductPrice = Number(event.target.value);
        } else if (event.target.name == 'count') {
          productQuantity = Number(event.target.value);
        }
        changeValueField(
          'subtotalWithoutIgv',
          Number(actualProductPrice * productQuantity).toFixed(2),
        );
        changeValueField(
          'productIgv',
          Number(
            typeTaxCode == 1000
              ? actualProductPrice * productQuantity * igvDefault
              : 0,
          ).toFixed(2),
        );
        changeValueField(
          'subtotalWithIgv',
          Number(
            typeTaxCode == 1000
              ? actualProductPrice * productQuantity * (1 + igvDefault)
              : actualProductPrice * productQuantity,
          ).toFixed(2),
        );
      } else if (
        key == event.target.name &&
        (key == 'subtotalWithoutIgv' || key == 'subtotalWithIgv')
      ) {
        actualValues[key] = Number(event.target.value);
        let productQuantity = getValueField('count').value;
        let actualProductPrice = getValueField('productPrice').value;
        let actualSubtotalWithoutIgv =
          getValueField('subtotalWithoutIgv').value;
        let actualProductIgv = getValueField('productIgv').value;
        let actualSubtotalWithIgv = getValueField('subtotalWithIgv').value;
        if (event.target.name == 'subtotalWithoutIgv') {
          actualSubtotalWithoutIgv = Number(event.target.value);

          changeValueField(
            'productPrice',
            Number(actualSubtotalWithoutIgv / productQuantity).toFixed(10),
          );
          changeValueField(
            'productIgv',
            Number(
              typeTaxCode == 1000 ? actualSubtotalWithoutIgv * igvDefault : 0,
            ).toFixed(2),
          );
          changeValueField(
            'subtotalWithIgv',
            Number(
              typeTaxCode == 1000
                ? Number(actualSubtotalWithoutIgv / productQuantity).toFixed(
                    10,
                  ) *
                    productQuantity *
                    (1 + igvDefault)
                : Number(actualSubtotalWithoutIgv / productQuantity).toFixed(
                    10,
                  ) * productQuantity,
            ).toFixed(2),
          );
        } else if (event.target.name == 'subtotalWithIgv') {
          actualSubtotalWithIgv = Number(event.target.value);
          changeValueField(
            'productPrice',
            Number(
              typeTaxCode == 1000
                ? actualSubtotalWithIgv / (1 + igvDefault) / productQuantity
                : actualSubtotalWithIgv / productQuantity,
            ).toFixed(10),
          );
          changeValueField(
            'subtotalWithoutIgv',
            Number(
              typeTaxCode == 1000
                ? actualSubtotalWithIgv / (1 + igvDefault)
                : actualSubtotalWithIgv,
            ).toFixed(2),
          );
          changeValueField(
            'productIgv',
            Number(
              typeTaxCode == 1000
                ? (actualSubtotalWithIgv * igvDefault) / (1 + igvDefault)
                : 0,
            ).toFixed(2),
          );
        }
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
    let newSelectedProduct = selectedProduct;
    if (newSelectedProduct.stock < data.count && stockChange) {
      console.log('porfavor selecciona un numero menor al total de productos');
      setTypeAlert('maxCount');
      setShowAlert(true);
    } else {
      let requiredKeys = ['product', 'description', 'costPriceUnit'];
      let objCorrect = true;
      requiredKeys.map((key, index) => {
        if (!(key in newSelectedProduct)) {
          objCorrect = false;
        }
      });
      delete newSelectedProduct['referencialPriceProduct'];
      if (true) {
        // console.log("addProductForm", {
        //   product:
        //     data.productSearch === selectedProduct.description
        //       ? selectedProduct.product
        //       : '',
        //   description: data.productSearch,
        //   unitMeasure: typeElement,
        //   customCodeProduct:
        //     selectedProduct.customCodeProduct !== undefined
        //       ? selectedProduct.customCodeProduct
        //       : '',
        //   quantityMovement: Number(data.count),
        //   priceBusinessMoneyWithIgv: Number(data.productPrice),
        //   subtotal: Number(
        //     Number(data.count) * Number(data.productPrice),
        //   ).toFixed(3),
        //   businessProductCode: selectedProduct.businessProductCode,
        //   taxCode: Number(typeTaxCode),
        //   igvCode: Number(SelectIgvCode(typeTaxCode)),
        // })
        sendData({
          product:
            data.productSearch === newSelectedProduct.description
              ? newSelectedProduct.product
              : '',
          description: data.productSearch,
          unitMeasure: typeElement,
          customCodeProduct:
            newSelectedProduct.customCodeProduct !== undefined
              ? newSelectedProduct.customCodeProduct
              : '',
          quantityMovement: Number(data.count),
          unitPrice: Number(data.productPrice),
          subtotal: Number(
            Number(data.count) * Number(data.productPrice),
          ).toFixed(3),
          businessProductCode: newSelectedProduct.businessProductCode,
          taxCode: Number(typeTaxCode),
          stockChange: stockChange,
        });
        actualValues.productSearch = '';
        actualValues.subtotalWithoutIgv = '';
        actualValues.productIgv = '';
        actualValues.subtotalWithIgv = '';
        actualValues.productPrice = '';
        actualValues.count = '';
        actualValues.subTotal = '';
        setOpenAddedProduct(true);
      } else {
        console.log('Porfavor selecciona un producto');
        setTypeAlert('faltaProduct');
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
      setTypeTaxCode(1000);
    } else {
      setTypeTaxCode(9998);
    }
  };

  const handleTypeElement = (event) => {
    setTypeElement(event.target.value);
    if (
      event.target.value == 'ZZ' ||
      (selectedProduct && selectedProduct.isStockNeeded === false)
    ) {
      setStockChange(false);
    } else {
      setStockChange(true);
    }
  };

  const handleStockChange = (event, isInputChecked) => {
    setStockChange(isInputChecked);
  };
  const handleTypeElement1 = (event) => {
    setTypeTaxCode(event.target.value);
    let productQuantity = getValueField('count').value;
    let actualProductPrice = getValueField('productPrice').value;
    changeValueField(
      'subtotalWithoutIgv',
      Number(actualProductPrice * productQuantity).toFixed(2),
    );
    changeValueField(
      'productIgv',
      Number(
        event.target.value == 1000
          ? actualProductPrice * productQuantity * igvDefault
          : 0,
      ).toFixed(2),
    );
    changeValueField(
      'subtotalWithIgv',
      Number(
        event.target.value == 1000
          ? actualProductPrice * productQuantity * (1 + igvDefault)
          : actualProductPrice * productQuantity,
      ).toFixed(2),
    );
  };

  return (
    <>
      <Formik
        validateOnChange={true}
        validationSchema={validationSchema}
        initialValues={{...defaultValues}}
        onSubmit={handleData}
      >
        {({isSubmitting, setFieldValue, getFieldProps}) => {
          changeValueField = setFieldValue;
          getValueField = getFieldProps;
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
                  sx={{margin: 'auto', justifyContent: 'center'}}
                >
                  <Grid item xs={isMobile ? 12 : 8}>
                    <AppTextField
                      label='Nombre'
                      name='productSearch'
                      htmlFor='filled-adornment-password'
                      variant='outlined'
                      onChange={(event) => {
                        setNameChanged(true);
                        let finalStockChange = false;
                        if(selectedProduct && selectedProduct.description == event.target.value && selectedProduct.isStockNeeded){
                          finalStockChange = true;
                        }
                        setStockChange(finalStockChange)
                        
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
                  <Grid item xs={isMobile ? 9 : 3}>
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
                  <Grid item xs={isMobile ? 3 : 1} style={useStyles.searchIcon}>
                    <IconButton
                      aria-label='search'
                      edge='end'
                      size='large'
                      onClick={handleClickOpen}
                      sx={{top: 0}}
                    >
                      <ManageSearchIcon color='primary' />
                    </IconButton>
                  </Grid>

                  <Grid item xs={isMobile ? 12 : 4}>
                    <AppTextField
                      label='Precio sin IGV'
                      name='productPrice'
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
                  <Grid item xs={isMobile ? 12 : 4}>
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
                  <Grid item xs={isMobile ? 6 : 4}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel id='taxCode-label'>Tipo IGV</InputLabel>
                      <Select
                        name='taxCode'
                        label='Tipo IGV'
                        labelId='taxCode-label'
                        onChange={handleTypeElement1}
                        //defaultValue={'9998'}
                        value={typeTaxCode}
                        disabled={!igvEnabled}
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
                  <Grid item xs={isMobile ? 6 : 4}>
                    <AppTextField
                      label='Monto sin IGV'
                      name='subtotalWithoutIgv'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                          fontWeight: 'bold',
                        },
                        my: 2,
                      }}
                    />
                  </Grid>
                  <Grid item xs={isMobile ? 6 : 4}>
                    <AppTextField
                      label='Igv total'
                      disabled
                      name='productIgv'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                          fontWeight: 'bold',
                        },
                        my: 2,
                      }}
                    />
                  </Grid>
                  <Grid item xs={isMobile ? 6 : 4}>
                    <AppTextField
                      label='Monto con Igv'
                      name='subtotalWithIgv'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                          fontWeight: 'bold',
                        },
                        my: 2,
                      }}
                    />
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    sx={{margin: 'auto', justifyContent: 'center'}}
                  >
                    <Grid item xs={4}>
                      <FormControlLabel
                        label='Disminuir Stock'
                        disabled={
                          typeElement == 'ZZ' ||
                          (selectedProduct &&
                            selectedProduct.isStockNeeded === false)
                        }
                        checked={stockChange}
                        control={<Checkbox onChange={handleStockChange} />}
                      />
                    </Grid>
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
  igvEnabled: PropTypes.bool,
  igvDefault: PropTypes.number,
};

export default AddProductForm;
