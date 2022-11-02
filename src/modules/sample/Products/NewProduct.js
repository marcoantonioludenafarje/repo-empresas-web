import React, {useState, useEffect, useCallback, useRef} from 'react';
import {makeStyles} from '@mui/styles';
import * as yup from 'yup';
import {Form, Formik} from 'formik';
import AppPage from '../../../@crema/hoc/AppPage';
import AppPageMeta from '../../../@crema/core/AppPageMeta';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {orange} from '@mui/material/colors';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
} from '../../../shared/constants/ActionTypes';
import {getUserData} from '../../../redux/actions/User';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';

import {
  Button,
  ButtonGroup,
  Select,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Card,
  IconButton,
  Collapse,
  Alert,
  Dialog,
  Divider,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Typography,
  Grid,
} from '@mui/material';

import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import {red} from '@mui/material/colors';

import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {
  onGetBusinessParameter,
  createPresigned,
} from '../../../redux/actions/General';
import {
  addProduct,
  getCategories,
  onGetProducts,
} from '../../../redux/actions/Products';
import Router, {useRouter} from 'next/router';
import SubProducts from './SubProducts';
import AddProductForm from './AddProductForm';

const useStyles = makeStyles((theme) => ({
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
  closeButton: {
    cursor: 'pointer',
    float: 'right',
    marginTop: '5px',
    width: '20px',
  },
}));
const maxLengthNumber = 11111111111111111111; //20 caracteres

const validationSchema = yup.object({
  businessProductCode: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  description: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  customCodeProduct: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .integer(<IntlMessages id='validation.number.integer' />)
    .max(maxLengthNumber, <IntlMessages id='validation.maxLength' />),
  costPriceUnit: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .required(<IntlMessages id='validation.required' />)
    .test(
      'maxDigitsAfterDecimal',
      'El número puede contener como máximo 3 decimales',
      (number) => /^\d+(\.\d{1,3})?$/.test(number),
    ),
  referecialPriceSell: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .required(<IntlMessages id='validation.required' />)
    .test(
      'maxDigitsAfterDecimal',
      'El número puede contener como máximo 3 decimales',
      (number) => /^\d+(\.\d{1,3})?$/.test(number),
    ),
  weight: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .required(<IntlMessages id='validation.required' />)
    .max(maxLengthNumber, <IntlMessages id='validation.maxLength' />)
    .test(
      'maxDigitsAfterDecimal',
      'El número puede contener como máximo 3 decimales',
      (number) => /^\d+(\.\d{1,3})?$/.test(number),
    ),
  initialStock: yup
    .number()
    // .moreThan(0)
    .typeError(<IntlMessages id='validation.number' />)
    .required(<IntlMessages id='validation.required' />)
    .integer(<IntlMessages id='validation.number.integer' />)
    .max(maxLengthNumber, <IntlMessages id='validation.maxLength' />),
});

const defaultValues = {
  businessProductCode: '',
  description: '',
  customCodeProduct: '',
  costPriceUnit: undefined,
  referecialPriceSell: undefined,
  weight: undefined,
  category: '',
  typeProduct: '',
  initialStock: undefined,
  merchantId: '',
  imgKey: null,
};

function getBase64(file, cb) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    cb(reader.result);
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
}
const useForceUpdate = () => {
  const [reload, setReload] = React.useState(0); // integer state
  return () => setReload((value) => value + 1); // update the state to force render
};
let selectedProducts = [];

let objSelects = {
  category: '',
  typeProduct: 'rawMaterial',
  unitMeasure: 'NIU',
  unitMeasureWeight: null,
  unitMeasureMoney: null,
};

const NewProduct = (props) => {
  const classes = useStyles(props);
  const history = useHistory();
  const dispatch = useDispatch();
  const forceUpdate = useForceUpdate();
  const router = useRouter();
  let errorToRegister = false;
  const [lengthProducts, setLengthProducts] = React.useState(0);
  const [showAlert, setShowAlert] = React.useState(false);
  const [selectedCategory, setSelectedCategory] =
    React.useState('noCategories');
  const [typeProduct, setTypeProduct] = React.useState('rawMaterial');
  const [openSelect, setOpenSelect] = React.useState(false);
  const prevSelectedCategoryRef = useRef();
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [typeAlert, setTypeAlert] = React.useState(false);
  const [minTutorial, setMinTutorial] = React.useState(false);
  useEffect(() => {
    prevSelectedCategoryRef.current = selectedCategory;
  });
  const prevSelectedCategory = prevSelectedCategoryRef.current;
  /* let typeAlert = ''; */

  //APIS FUNCTIONS
  const getBusinessParameter = (payload) => {
    dispatch(onGetBusinessParameter(payload));
  };
  const toCreatePresigned = (payload) => {
    dispatch(createPresigned(payload));
  };
  const toAddProduct = (payload) => {
    dispatch(addProduct(payload));
  };
  const toGetCategories = (payload) => {
    dispatch(getCategories(payload));
  };
  const getProducts = (payload) => {
    dispatch(onGetProducts(payload));
  };

  //API RESPONSES
  const {businessParameter} = useSelector(({general}) => general);
  console.log('globalParameter123', businessParameter);
  const {presigned} = useSelector(({general}) => general);
  console.log('createPresigned', presigned);
  const {addProductResponse} = useSelector(({products}) => products);
  console.log('addProductResponse', addProductResponse);
  const {getCategoriesRes} = useSelector(({products}) => products);
  console.log('getCategoriesRes', getCategoriesRes);
  const {successMessage} = useSelector(({products}) => products);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({products}) => products);
  console.log('errorMessage', errorMessage);
  const {listProducts} = useSelector(({products}) => products);
  console.log('products123', listProducts);
  const {generalSuccess} = useSelector(({general}) => general);
  console.log('generalSuccess', generalSuccess);
  const {generalError} = useSelector(({products}) => products);
  console.log('generalError', generalError);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);

  //GET_GLOBAL_PARAMETER
  let money_unit;
  let weight_unit;
  let imgBase64;
  let selectedFile;

  let listPayload = {
    request: {
      payload: {
        businessProductCode: null,
        description: null,
        merchantId: userDataRes.merchantSelected.merchantId,
      },
    },
  };
  let parameterPayload = {
    request: {
      payload: {
        abreParametro: null,
        codTipoparametro: null,
        merchantId: userDataRes.merchantSelected.merchantId,
      },
    },
  };
  let imagePayload = {
    request: {
      payload: {
        key: 'general',
        action: 'putObject',
        contentType: '',
      },
    },
  };
  let getCategoriesPayload = {
    request: {
      payload: {
        denominationProductCategory: '',
        merchantId: userDataRes.merchantSelected.merchantId,
      },
    },
  };
  useEffect(() => {
    if (!userDataRes) {
      console.log('Esto se ejecuta?');

      dispatch({type: GET_USER_DATA, payload: undefined});
      const toGetUserData = (payload) => {
        dispatch(getUserData(payload));
      };
      let getUserDataPayload = {
        request: {
          payload: {
            userId: JSON.parse(localStorage.getItem('payload')).sub,
          },
        },
      };

      toGetUserData(getUserDataPayload);
    }
    setTimeout(() => {
      setMinTutorial(true);
    }, 2000);
  }, []);

  useEffect(() => {
    if (userDataRes) {
      defaultValues.merchantId = userDataRes.merchantSelected.merchantId;

      getProducts(listPayload);
      getBusinessParameter(parameterPayload);
      toGetCategories(getCategoriesPayload);
      selectedProducts = [];
    }
  }, [userDataRes]);

  if (businessParameter != undefined) {
    weight_unit = businessParameter.find(
      (obj) => obj.abreParametro == 'DEFAULT_WEIGHT_UNIT',
    ).value;
    objSelects.unitMeasureWeight = weight_unit;
    money_unit = businessParameter.find(
      (obj) => obj.abreParametro == 'DEFAULT_MONEY_UNIT',
    ).value;
    objSelects.unitMeasureMoney = money_unit;
  }

  useEffect(() => {
    if (getCategoriesRes !== undefined && getCategoriesRes.length >= 1) {
      let defaultId = getCategoriesRes.find(
        (obj) => obj.default == true,
      ).productCategoryId;
      console.log('defaultId', defaultId);
      setSelectedCategory(defaultId);
      console.log('selectedCategory', selectedCategory);
    } else {
      setSelectedCategory('noCategory');
    }
  }, [getCategoriesRes]);

  useEffect(() => {
    if (
      getCategoriesRes != undefined &&
      selectedCategory &&
      prevSelectedCategory !== selectedCategory
    ) {
      console.log('selectedCategory responsivo', selectedCategory);
    }
  }, [getCategoriesRes != undefined && selectedCategory, selectedCategory]);

  console.log('Valores default peso', weight_unit, 'moneda', money_unit);

  const handleFieldProduct = (event) => {
    console.log('evento', event);
    objSelects[event.target.name] = event.target.value;
    console.log('ocjSelects', objSelects);
  };
  const handleFieldType = (event) => {
    console.log('evento', event);
    objSelects[event.target.name] = event.target.value;
    setTypeProduct(event.target.value);
    console.log('ocjSelects', objSelects);
  };
  const handleFieldCategory = (event) => {
    console.log('evento', event);
    setSelectedCategory(event.target.value);
    console.log('ocjSelects', objSelects);
    Object.keys(objSelects).map((key) => {
      if (key == event.target.name) {
        objSelects[key] = event.target.value;
      }
    });
    console.log('objSelects', objSelects);
  };

  const getImage = (event) => {
    console.log('Archivo recogido ', event.target.files[0]);
    selectedFile = event.target.files[0];
    const [file] = imgInp.files;
    imagePayload.request.payload.contentType = file.type;
    if (file) {
      preview.src = URL.createObjectURL(file);
      getBase64(file, (result) => {
        console.log('Resultado en base 64', result);
        imgBase64 = result;
        toCreatePresigned(imagePayload);
      });
    } else {
      preview.src = '';
      imgBase64 = '';
      imagePayload.request.payload.contentType = '';
    }
  };

  const cancel = () => {
    setOpen2(true);
  };

  const handleClose = () => {
    setOpen(false);
    Router.push('/sample/products/table');
  };
  const handleData = (data, {setSubmitting}) => {
    console.log(
      'Número de productos actual: ',
      businessParameter.find(
        (obj) => obj.abreParametro == 'CURRENT_COUNT_MOVEMENT',
      ).catalogNumberProducts,
    );
    console.log(
      'Número de productos límite: ',
      userDataRes.merchantSelected.plans.find((obj) => obj.active == true)
        .limits.catalogNumberProducts,
    );
    if (
      businessParameter.find(
        (obj) => obj.abreParametro == 'CURRENT_COUNT_MOVEMENT',
      ).catalogNumberProducts <=
      userDataRes.merchantSelected.plans.find((obj) => obj.active == true)
        .limits.catalogNumberProducts
    ) {
      setShowAlert(false);
      setSubmitting(true);
      /* if (selectedFile) { */ //PARA LA TOMA DE IMAGEN
      delete data.category;
      delete data.typeProduct;
      console.log('data', {...data, ...objSelects});
      console.log(
        'resultado del registro antes del registro',
        addProductResponse,
      );
      console.log('Data recibida', {...data, ...objSelects});
      console.log('selectedProducts', selectedProducts);
      let goodStockComplexProducts = allCountsRigth(data.initialStock);
      console.log('goodStockComplexProducts', goodStockComplexProducts);
      console.log('selectedProducts.length', selectedProducts.length);
      console.log('typeProduct', typeProduct);
      if (
        (goodStockComplexProducts &&
          selectedProducts.length > 0 &&
          typeProduct != 'rawMaterial') ||
        typeProduct == 'rawMaterial'
      ) {
        console.log('Todo correcto');
        let cleanProducts = [];
        if (typeProduct != 'rawMaterial') {
          selectedProducts.map((obj, index) => {
            console.log('Producto', index, obj);
            cleanProducts.push({
              productId: obj.productId,
              quantity: obj.count,
              priceUnit: obj.costPriceUnit,
              description: obj.description,
              weight: obj.weight,
              unitMeasure: obj.unitMeasure,
              customCodeProduct: obj.customCodeProduct || '',
            });
          });
        }
        console.log(cleanProducts);
        /* console.log('finalPayload', { */
        toAddProduct({
          request: {
            payload: {
              products: [
                {
                  businessProductCode: data.businessProductCode,
                  description: data.description,
                  costPriceUnit: Number(data.costPriceUnit),
                  sellPriceUnit: Number(data.referecialPriceSell),
                  weight: Number(data.weight),
                  initialStock: parseInt(Number(data.initialStock)),
                  imgKey: null,
                  customCodeProduct: data.customCodeProduct,
                  unitMeasureWeight: weight_unit,
                  unitMeasureMoney: money_unit,
                  category: selectedCategory,
                  typeProduct: objSelects.typeProduct,
                  unitMeasure: objSelects.unitMeasure,
                  unitsToProduce: 1,
                  inputsProduct: cleanProducts,
                },
              ],
              merchantId: userDataRes.merchantSelected.merchantId,
            },
          },
        });
        console.log('resultado del registro', addProductResponse);
        setOpen(true);
      } else {
        if (selectedProducts.length === 0) {
          setTypeAlert('faltaProduct');
        } else if (!goodStockComplexProducts) {
          setTypeAlert('maxStock');
        } else {
          setTypeAlert('');
        }
        setShowAlert(true);
      }
      /* } else {
        console.log('NoImagen');
        typeAlert = 'noImage';
      } */
      setSubmitting(false);
    } else {
      setTypeAlert('limitCatalog');
      setShowAlert(true);
    }
  };

  const showMessage = () => {
    if (
      successMessage != undefined &&
      addProductResponse !== undefined &&
      !('error' in addProductResponse)
    ) {
      return (
        <>
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
        </>
      );
    } else if (
      (successMessage != undefined &&
        addProductResponse &&
        'error' in addProductResponse) ||
      errorMessage != undefined
    ) {
      return (
        <>
          <CancelOutlinedIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            Se ha producido un error al registrar.
            <br /> Mensaje de negocio
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink />;
    }
  };

  const handleClose2 = () => {
    setOpen2(false);
  };
  const handleClickOpen = () => {
    setOpenSelect(true);
    setShowAlert(false);
  };
  const closeSelect = () => {
    listPayload.request.payload.businessProductCode = null;
    listPayload.request.payload.description = null;
    getProducts(listPayload);
    setOpenSelect(false);
  };
  const getNewProduct = (product) => {
    console.log('nuevo producto', product);

    if (selectedProducts && selectedProducts.length >= 1) {
      selectedProducts.map((obj, index) => {
        console.log('obj', obj);
        if (obj.product == product.product) {
          console.log('selectedProducts 1', selectedProducts);
          selectedProducts.splice(index, 1);
          console.log('selectedProducts 2', selectedProducts);
        }
      });
    }
    selectedProducts.push(product);
    forceUpdate();
  };
  const removeProduct = (index) => {
    console.log('index', index);
    selectedProducts.splice(index, 1);
    forceUpdate();
  };

  const allCountsRigth = (countProducts) => {
    let status = true;
    selectedProducts.map((obj) => {
      let checkProduct = listProducts.find(
        (prod) => obj.productId == prod.productId,
      );
      if (Number(obj.count) * Number(countProducts) > checkProduct.stock) {
        status = false;
      }
    });
    console.log('estado de cuentas', status);
    return status;
  };

  return (
    <Card sx={{p: 4}}>
      <Box sx={{width: 1, textAlign: 'center'}}>
        <Typography
          sx={{mx: 'auto', my: '10px', fontWeight: 600, fontSize: 25}}
        >
          Nuevo Producto
        </Typography>
      </Box>
      <Divider sx={{mt: 2, mb: 4}} />
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
            <Form style={{textAlign: 'left'}} noValidate autoComplete='on'>
              <Grid container spacing={2} sx={{width: 500, mx: 'auto', mb: 4}}>
                <Grid item xs={12}>
                  <AppTextField
                    label='Código'
                    name='businessProductCode'
                    variant='outlined'
                    onChange={handleFieldProduct}
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
                    label='Código aduanero'
                    name='customCodeProduct'
                    variant='outlined'
                    sx={{
                      width: '100%',
                      '& .MuiInputBase-input': {
                        fontSize: 14,
                      },
                      my: 2,
                    }}
                  />
                  <Typography
                    sx={{
                      mx: 2,
                      mb: 3,
                      cursor: 'pointer',
                      color: '#5194c4',
                      textDecoration: 'underline',
                    }}
                    onClick={() =>
                      window.open(
                        'https://colombiacompra.gov.co/clasificador-de-bienes-y-Servicios',
                      )
                    }
                  >
                    Consúltalo aquí
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{my: 2}}>
                    <InputLabel id='categoria-label' style={{fontWeight: 200}}>
                      Categoría
                    </InputLabel>
                    <Select
                      value={selectedCategory}
                      name='category'
                      labelId='categoria-label'
                      label='Categoría'
                      onChange={handleFieldCategory}
                    >
                      {getCategoriesRes &&
                      Array.isArray(getCategoriesRes) &&
                      getCategoriesRes.length >= 1 ? (
                        getCategoriesRes.map((obj, index) => {
                          return (
                            <MenuItem
                              key={index}
                              value={obj.productCategoryId}
                              style={{fontWeight: 200}}
                            >
                              {obj.description}
                            </MenuItem>
                          );
                        })
                      ) : (
                        <MenuItem
                          key={0}
                          value={'noCategories'}
                          style={{fontWeight: 200}}
                        >
                          <IntlMessages id='common.noCategories' />
                        </MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <AppTextField
                    label={`Peso (${weight_unit})`}
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
                <Grid item xs={12}>
                  <AppTextField
                    label={`Precio costo sugerido (${money_unit})`}
                    name='costPriceUnit'
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
                {/* <Typography variant='caption' display='block' gutterBottom>
                Solo se registran hasta 3 decimales
              </Typography> */}
                <Grid item xs={12}>
                  <AppTextField
                    label={`Precio venta sugerido (${money_unit})`}
                    name='referecialPriceSell'
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
                    label='Stock inicial'
                    name='initialStock'
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
                  <FormControl fullWidth sx={{my: 2}}>
                    <InputLabel
                      id='typeProduct-label'
                      style={{fontWeight: 200}}
                    >
                      Tipo de producto
                    </InputLabel>
                    <Select
                      defaultValue='rawMaterial'
                      name='typeProduct'
                      labelId='typeProduct-label'
                      label='Tipo de producto'
                      onChange={handleFieldType}
                    >
                      <MenuItem value='rawMaterial' style={{fontWeight: 200}}>
                        <IntlMessages id='product.type.rawMaterial' />
                      </MenuItem>
                      <MenuItem
                        value='intermediateProduct'
                        style={{fontWeight: 200}}
                      >
                        <IntlMessages id='product.type.intermediateProduct' />
                      </MenuItem>
                      <MenuItem value='endProduct' style={{fontWeight: 200}}>
                        <IntlMessages id='product.type.endProduct' />
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              {typeProduct != 'rawMaterial' ? (
                <Box sx={{textAlign: 'center'}}>
                  <Button
                    sx={{width: 1 / 2, mb: 4}}
                    variant='outlined'
                    onClick={handleClickOpen}
                  >
                    Añade productos
                  </Button>
                  <SubProducts
                    arrayObjs={selectedProducts}
                    toDelete={removeProduct}
                  />
                </Box>
              ) : (
                <></>
              )}
              {/* IMPORTANTE NO BORRAR */}
              {/* <Button
                sx={{width: '100%'}}
                variant='contained'
                component='label'
              >
                Subir imagen
                <input
                  type='file'
                  hidden
                  onChange={getImage}
                  id='imgInp'
                  name='imgInp'
                  accept='.png, .jpeg, .jpg'
                />
              </Button>

              <Box className={classes.imgPreview} sx={{my: 1, p: 4}}>
                <img id='preview' className={classes.img} src=''></img>
              </Box> */}

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
                  {typeAlert == 'faltaProduct' ? (
                    'Selecciona un producto.'
                  ) : (
                    <></>
                  )}
                  {typeAlert == 'maxStock' ? (
                    'No puedes sobrepasar el stock.'
                  ) : (
                    <></>
                  )}
                  {typeAlert == 'limitCatalog' ? (
                    'Se alcanzó el límite de registros de productos.'
                  ) : (
                    <></>
                  )}
                </Alert>
              </Collapse>
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
                {/* <Button
                  sx={{mx: 'auto', width: '80%', py: 3}}
                  variant='outlined'
                  size='medium'
                  startIcon={<SaveAltOutlinedIcon />}
                >
                  Guardar y registrar nuevo
                </Button> */}
                <Button
                  sx={{mx: 'auto', width: '50%', py: 3}}
                  variant='outlined'
                  size='medium'
                  startIcon={<ArrowCircleLeftOutlinedIcon />}
                  onClick={cancel}
                >
                  Cancelar
                </Button>
              </ButtonGroup>
              {minTutorial ? (
                <Box
                  sx={{
                    position: 'fixed',
                    right: 0,
                    top: {xs: 325, xl: 305},
                    zIndex: 1110,
                  }}
                  className='customizerOption'
                >
                  <Box
                    sx={{
                      borderRadius: '30px 0 0 30px',
                      mb: 1,
                      backgroundColor: orange[500],
                      '&:hover': {
                        backgroundColor: orange[700],
                      },
                      '& button': {
                        borderRadius: '30px 0 0 30px',

                        '&:focus': {
                          borderRadius: '30px 0 0 30px',
                        },
                      },
                    }}
                  >
                    <IconButton
                      sx={{
                        mt: 1,
                        '& svg': {
                          height: 35,
                          width: 35,
                        },
                        color: 'white',
                        pr: 5,
                      }}
                      edge='end'
                      color='inherit'
                      aria-label='open drawer'
                      onClick={() =>
                        window.open('https://youtu.be/bjjUFNapWiY/')
                      }
                    >
                      <YouTubeIcon fontSize='inherit' />
                    </IconButton>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    position: 'fixed',
                    right: 0,
                    top: {xs: 325, xl: 305},
                    zIndex: 1110,
                  }}
                  className='customizerOption'
                >
                  <Box
                    sx={{
                      borderRadius: '30px 0 0 30px',
                      mb: 1,
                      backgroundColor: orange[500],
                      '&:hover': {
                        backgroundColor: orange[700],
                      },
                      '& button': {
                        borderRadius: '30px 0 0 30px',

                        '&:focus': {
                          borderRadius: '30px 0 0 30px',
                        },
                      },
                    }}
                  >
                    <IconButton
                      sx={{
                        mt: 1,
                        '& svg': {
                          height: 35,
                          width: 35,
                        },
                        color: 'white',
                      }}
                      edge='end'
                      color='inherit'
                      aria-label='open drawer'
                      onClick={() =>
                        window.open('https://youtu.be/bjjUFNapWiY/')
                      }
                    >
                      VER TUTORIAL
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Form>
          )}
        </Formik>
        <Dialog
          open={open}
          onClose={handleClose}
          sx={{textAlign: 'center'}}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
            {'Registro de Producto'}
          </DialogTitle>
          <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
            {showMessage()}
          </DialogContent>
          <DialogActions sx={{justifyContent: 'center'}}>
            <Button variant='outlined' onClick={handleClose}>
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Dialog
        open={open2}
        onClose={handleClose2}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Registro de producto'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <PriorityHighIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            Desea cancelar esta operación?. <br /> Se perderá lala información
            ingresada
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button
            variant='outlined'
            onClick={() => {
              setOpen2(false);
              Router.push('/sample/products/table');
            }}
          >
            Sí
          </Button>
          <Button variant='outlined' onClick={handleClose2}>
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openSelect}
        onClose={closeSelect}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        {/* {typeDialog == 'product' ? (
          <> */}
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Selecciona los productos'}
          <CancelOutlinedIcon
            onClick={closeSelect}
            className={classes.closeButton}
          />
        </DialogTitle>
        <DialogContent>
          <AddProductForm type='input' sendData={getNewProduct} />
        </DialogContent>
        {/* </>
        ) : (
          <></>
        )} */}
      </Dialog>
    </Card>
  );
};

export default NewProduct;
