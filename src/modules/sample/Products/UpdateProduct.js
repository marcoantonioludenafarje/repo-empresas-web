import React, {useState, useEffect, useCallback, useRef} from 'react';
import {makeStyles} from '@mui/styles';
import * as yup from 'yup';
import {Form, Formik} from 'formik';
import AppPage from '../../../@crema/hoc/AppPage';
import AppPageMeta from '../../../@crema/core/AppPageMeta';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SchoolIcon from '@mui/icons-material/School';
import {Fonts} from '../../../shared/constants/AppEnums';

import {orange} from '@mui/material/colors';

import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import AppUpperCaseTextField from '../../../@crema/core/AppFormComponents/AppUpperCaseTextField';

import {
  Button,
  ButtonGroup,
  Select,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  TextField,
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
  ImageList,
  FormGroup,
  FormControlLabel,
  Switch,
  ImageListItem,
  ImageListItemBar,
  FormLabel,
  Checkbox,
} from '@mui/material';

import {ClickAwayListener} from '@mui/base';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import {red} from '@mui/material/colors';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
  GET_PRESIGNED,
  UPDATE_PRODUCT,
} from '../../../shared/constants/ActionTypes';
import {getUserData} from '../../../redux/actions/User';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {
  onGetBusinessParameter,
  createPresigned,
} from '../../../redux/actions/General';
import {
  updateProduct,
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
const maxLength = 11111111111111111111; //20 caracteres

const validationSchema = yup.object({
  businessProductCode: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  description: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  alias: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  customCodeProduct: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .integer(<IntlMessages id='validation.number.integer' />)
    .max(maxLength, <IntlMessages id='validation.maxLength' />),
  costPriceUnit: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .required(<IntlMessages id='validation.required' />)
    .test(
      'maxDigitsAfterDecimal',
      'El número puede contener como máximo 10 decimales',
      (number) => /^\d+(\.\d{1,10})?$/.test(number),
    ),
  referecialPriceSell: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .required(<IntlMessages id='validation.required' />)
    .test(
      'maxDigitsAfterDecimal',
      'El número puede contener como máximo 10 decimales',
      (number) => /^\d+(\.\d{1,10})?$/.test(number),
    ),
  weight: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .required(<IntlMessages id='validation.required' />)
    .max(maxLength, <IntlMessages id='validation.maxLength' />)
    .test(
      'maxDigitsAfterDecimal',
      'El número puede contener como máximo 3 decimales',
      (number) => /^\d+(\.\d{1,3})?$/.test(number),
    ),
  sumQuantity: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .required(<IntlMessages id='validation.required' />)
    .max(maxLength, <IntlMessages id='validation.maxLength' />)
    .test(
      'maxDigitsAfterDecimal',
      'El número puede contener como máximo 3 decimales',
      (number) => /^\d+(\.\d{1,3})?$/.test(number),
    ),
  initialStock: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .required(<IntlMessages id='validation.required' />)
    .integer(<IntlMessages id='validation.number.integer' />)
    .max(maxLength, <IntlMessages id='validation.maxLength' />),
});

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

const toBase64 = (file) => {
  console.log('toBase64 file', file);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
const useForceUpdate = () => {
  const [reload, setReload] = React.useState(0); // integer state
  return () => setReload((value) => value + 1); // update the state to force render
};
let selectedProducts = [];
let originalProduct = {};

let objSelects = {
  category: '',
  typeProduct: 'rawMaterial',
  unitMeasure: 'NIU',
  secondaryUnitMeasure: 'ML',
  sumQuantity: 0,
  unitMeasureWeight: null,
  unitMeasureMoney: null,
  tags: {},
};

const UpdateProduct = (props) => {
  let changeValue;
  const router = useRouter();
  const {query} = router; //query es el objeto seleccionado
  console.log('query', query);
  const classes = useStyles(props);
  const history = useHistory();
  const dispatch = useDispatch();
  const forceUpdate = useForceUpdate();
  let errorToRegister = false;
  const [lengthProducts, setLengthProducts] = React.useState(0);
  const [showAlert, setShowAlert] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState({
    description: query.category,
    productCategoryId: query.categoryId,
  });
  const [selectedNonJsonCategory, setSelectedNonJsonCategory] = React.useState(
    query.category,
  );
  let categoryJson = {
    description: query.category,
    productCategoryId: query.categoryId,
  };
  const [typeProduct, setTypeProduct] = React.useState(query.typeProduct);
  const [openSelect, setOpenSelect] = React.useState(false);
  const prevSelectedCategoryRef = useRef();
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [typeAlert, setTypeAlert] = React.useState(false);
  const [minTutorial, setMinTutorial] = React.useState(false);
  const [selectedFilters, setSelectedFilters] = React.useState(
    originalProduct.tags || {},
  );
  const [publish, setPublish] = React.useState(true);
  const [sectionEcommerce, setSectionEcommerce] = React.useState(false);
  const [selectedImages, setSelectedImages] = React.useState([]);
  const [selectedJsonImages, setSelectedJsonImages] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [typeIcon, setTypeIcon] = React.useState('2');
  const [secondaryUnitMeasure, setSecondaryUnitMeasure] = React.useState(
    query.secondaryUnitMeasure || 'ML',
  );
  const [isStockNeeded, setIsStockNeeded] = React.useState(
    query.isStockNeeded == 'false' ? false : true,
  );
  console.log('abcd', query.isStockNeeded);
  console.log('abcde', isStockNeeded);
  console.log('abcdf', query.isStockNeeded == 'false');
  useEffect(() => {
    prevSelectedCategoryRef.current = selectedCategory;
  });
  const prevSelectedCategory = prevSelectedCategoryRef.current;
  /* let typeAlert = 'faltaProduct'; */

  //APIS FUNCTIONS
  const getBusinessParameter = (payload) => {
    dispatch(onGetBusinessParameter(payload));
  };
  const toCreatePresigned = (payload, file) => {
    dispatch(createPresigned(payload, file));
  };
  const toUpdateProduct = (payload) => {
    dispatch(updateProduct(payload));
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
  const {updateProductRes} = useSelector(({products}) => products);
  console.log('updateProduct', updateProductRes);
  // const {getCategoriesRes} = useSelector(({products}) => products);
  // console.log('getCategoriesRes', getCategoriesRes);
  const {successMessage} = useSelector(({products}) => products);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({products}) => products);
  console.log('errorMessage', errorMessage);
  const {listProducts, allProductsRes} = useSelector(({products}) => products);
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
  let ecommerce_params;
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
  let defaultValues = {
    businessProductCode: query.businessProductCode,
    description: query.description,
    alias: query.alias,
    customCodeProduct: query.customCodeProduct,
    referecialPriceSell: Number(query.sellPriceUnit),
    costPriceUnit: Number(query.costPriceUnit),
    secondaryUnitMeasure: query.secondaryUnitMeasure || 'ML',
    sumQuantity: Number(query.sumQuantity || 0),
    weight: Number(query.weight),
    category: {
      description: query.category,
      productCategoryId: query.categoryId,
    },
    typeProduct: query.typeProduct,
    initialStock: Number(query.initialStock),
    merchantId: userDataRes.merchantSelected.merchantId,
    imgKey: null,
    title: query.title,
    commercialDescription: query.commercialDescription,
    selectedFilters: originalProduct.tags,
    isStockNeeded: query.isStockNeeded ? query.isStockNeeded : false,
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
    } else {
      if (userDataRes.merchantSelected.isEcommerceEnabled == true) {
        setSectionEcommerce(true);
      }
    }
    dispatch({
      type: GET_PRESIGNED,
      payload: undefined,
    });
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    objSelects.unitMeasure = query.unitMeasure;
    setTimeout(() => {
      setMinTutorial(true);
      setTypeIcon('1');

      changeValue('category', {
        description: query.category,
        productCategoryId: query.categoryId,
      });
    }, 2000);
  }, []);
  useEffect(() => {
    if (presigned) {
      console.log('useEffect presigned', presigned);
      let actualSelectedJsonImages = selectedJsonImages;
      const newJsonImages = {
        keyMaster: presigned.keymaster,
        nameFile: imagePayload.request.payload.name || presigned.name,
      };
      console.log('newJsonImages', newJsonImages);
      actualSelectedJsonImages.push(newJsonImages);
      console.log('actualSelectedJsonImages', actualSelectedJsonImages);
      setSelectedJsonImages(actualSelectedJsonImages);
    }
  }, [presigned]);
  useEffect(() => {
    if (userDataRes) {
      defaultValues.merchantId = userDataRes.merchantSelected.merchantId;
      if (
        userDataRes.merchantSelected.plans.find(
          (element) => element.active == true,
        ).description == 'eCommerce'
      ) {
        setSectionEcommerce(true);
      }
      getProducts(listPayload);
      getBusinessParameter(parameterPayload);
      toGetCategories(getCategoriesPayload);
      selectedProducts = [];
    }
  }, [userDataRes]);
  useEffect(() => {
    if (businessParameter) {
      // let filters = {};
      // ecommerce_params.map((filter) => {
      //   filters[filter.featureName] = [];
      // });
      // console.log('selectedFilters', selectedFilters);

      let categoriesProductParameter = businessParameter.find(
        (obj) => obj.abreParametro == 'DEFAULT_CATEGORIES_PRODUCTS',
      ).value;
      console.log('categoriesProductParameter', categoriesProductParameter);
      setCategories(categoriesProductParameter);
    }
  }, [businessParameter]);
  if (businessParameter != undefined) {
    weight_unit = businessParameter.find(
      (obj) => obj.abreParametro == 'DEFAULT_WEIGHT_UNIT',
    ).value;
    objSelects.unitMeasureWeight = weight_unit;
    money_unit = businessParameter.find(
      (obj) => obj.abreParametro == 'DEFAULT_MONEY_UNIT',
    ).value;
    ecommerce_params = businessParameter.find(
      (obj) => obj.abreParametro == 'ECOMMERCE_PRODUCT_PARAMETERS',
    ).tags;
    objSelects.category = {
      description: query.category,
      productCategoryId: query.categoryId,
    };
    objSelects.unitMeasureMoney = money_unit;
  }
  useEffect(() => {
    // if (categories !== undefined && categories.length >= 1) {
    //   let defaultCategory = categories.find((obj) => obj.default == true);
    //   console.log('defaultCategory', defaultCategory);
    //   setSelectedCategory(defaultCategory);
    //   console.log('selectedCategory', selectedCategory);
    // } else {
    //   setSelectedCategory('noCategory');
    // }
  }, [categories]);

  useEffect(() => {
    if (allProductsRes != undefined) {
      originalProduct = allProductsRes.find(
        (obj) => obj.productId == query.productId,
      );
      console.log('originalProduct', originalProduct);
      originalProduct.inputsProduct.map((obj) => {
        let subProduct = allProductsRes.find(
          (prod) => obj.productId == prod.productId,
        );
        selectedProducts.push({
          product: subProduct.product,
          productId: subProduct.productId,
          description: subProduct.description,
          count: obj.quantity,
          priceUnit: obj.priceUnit,
          businessProductCode: obj.businessProductCode,
        });
      });

      console.log('selectedProducts', selectedProducts);
    }
  }, [allProductsRes != undefined]);
  useEffect(() => {
    console.log('CUAL ES EL originalProduct', originalProduct);
    if (originalProduct && originalProduct.active) {
      if (originalProduct.images) {
        originalProduct.images = originalProduct.images.map((image) => {
          image.isSaved = true;
          return image;
        });
        setSelectedImages(originalProduct.images);
        setSelectedJsonImages(originalProduct.images);
        console.log('selectedImages', selectedImages);
      }

      console.log('selectedImages de original', originalProduct.images);

      console.log('selectedFilters de original', originalProduct.tags);
      setSelectedFilters(originalProduct.tags);

      console.log('selectedFilters', selectedFilters);
    }
  }, [originalProduct]);
  /* useEffect(() => {
    if (getCategoriesRes != undefined) {
      let defaultId = getCategoriesRes.payload.find(
        (obj) => obj.default == true,
      ).productCategoryId;
      setSelectedCategory(defaultId);
      console.log('selectedCategory', selectedCategory);
    }
  }, [getCategoriesRes != undefined]); */

  useEffect(() => {
    if (
      categories != undefined &&
      selectedCategory &&
      prevSelectedCategory !== selectedCategory
    ) {
      console.log('selectedCategory responsivo', selectedCategory);
    }
  }, [categories != undefined && selectedCategory, selectedCategory]);

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
  const handleFieldSum = (event) => {
    console.log('evento', event);
    objSelects[event.target.name] = event.target.value;
    setSecondaryUnitMeasure(event.target.value);
    console.log('ocjSelects', objSelects);
  };
  const handleFieldCategory = (event) => {
    console.log('evento', event);
    //setSelectedCategory(event.target.value);
    setSelectedNonJsonCategory(event.target.value);
    console.log('ocjSelects', objSelects);
    setSelectedCategory(
      categories.find((element) => element.description == event.target.value),
    );
    Object.keys(objSelects).map((key) => {
      if (key == event.target.name) {
        objSelects[key] = event.target.value;
      }
    });
    console.log('objSelects', objSelects);
  };
  const handleFieldFilter = (event) => {
    console.log('evento', event);
    let newSelectedFilters = selectedFilters;
    newSelectedFilters[event.target.name][0] = event.target.value;
    if (event.target.value == 'noFilters') {
      newSelectedFilters[event.target.name] = [];
    }
    setSelectedFilters(newSelectedFilters);
    console.log('selectedFilters actualizados', selectedFilters);
  };
  const handleFieldFilter2 = (event) => {
    console.log('event.target.value', event.target.value);
    console.log('event.target.name', event.target.name);
    console.log('event.target.checked', event.target.checked);
    if (event.target.checked) {
      setSelectedFilters({
        ...selectedFilters,
        [event.target.name]: selectedFilters[event.target.name].concat([
          Number(event.target.value),
        ]),
      });
    } else {
      // const index = selectedFilters[event.target.name].indexOf(Number(event.target.value));
      const newFilters = selectedFilters;
      newFilters[event.target.name] = newFilters[event.target.name].filter(
        (item) => item !== Number(event.target.value),
      );
      setSelectedFilters({
        ...selectedFilters,
        [event.target.name]: newFilters[event.target.name],
      });
    }
  };
  const handlePublicChange = (event) => {
    console.log('Switch cambio', event);
    setPublish(event.target.checked);
  };
  const getImage = (event) => {
    console.log('Archivo recogido ', event.target.files[0]);
    selectedFile = event.target.files[0];
    // const [file] = imgInp.files;
    // imagePayload.request.payload.contentType = file.type;
    // imagePayload.request.payload.name = file.name;
    // if (file) {
    //   // preview.src = URL.createObjectURL(file);
    //   console.log('Cuál es el imagePayload', imagePayload);
    //   toCreatePresigned(imagePayload, {
    //     image: file,
    //     type: file?.type || null,
    //   });
    // } else {
    //   event = null;
    //   console.log('no se selecciono un archivo');
    // }
    if (event.target.files) {
      const fileArray = Array.from(event.target.files).map((file) => {
        imagePayload.request.payload.contentType = file.type;
        imagePayload.request.payload.name = file.name;
        toCreatePresigned(imagePayload, {
          image: file,
          type: file?.type || null,
        });
        return URL.createObjectURL(file);
      });
      console.log('este es el fileArray', fileArray);
      // setSelectedImages((prevImages)=>prevImages.concat(fileArray))

      setSelectedImages(selectedImages.concat(fileArray));
      console.log('Esto es selectedImages', selectedImages);
      Array.from(event.target.files).map((file) => URL.revokeObjectURL(file));
    }
  };

  const deleteImage = (index, itemSelected) => {
    console.log('delete la imagen de index: ', index);
    // setSelectedImages(selectedImages.splice(index,1))
    setSelectedImages((oldState) =>
      oldState.filter((item) => item !== itemSelected),
    );
    let newImagesJson = selectedJsonImages;
    delete newImagesJson[index];
    setSelectedJsonImages(newImagesJson);
    setTimeout(() => {
      console.log('Imagenes luego de eliminar ', selectedImages);
      console.log('Imagenes luego de eliminar 2', selectedJsonImages);
    }, 2000);
  };

  const cancel = () => {
    setOpen2(true);
  };

  const handleClose = () => {
    setOpen(false);
    Router.push('/sample/products/table');
  };
  const handleData = (data, {setSubmitting}) => {
    setShowAlert(false);
    setSubmitting(true);
    /* if (selectedFile) { */ //PARA LA TOMA DE IMAGEN
    delete data.category;
    delete data.typeProduct;
    console.log('data', {...data, ...objSelects});
    console.log('Data recibida', {...data, ...objSelects});
    let upProdPayload = {...data, productId: query.productId, ...objSelects};
    console.log('data', upProdPayload);
    let goodStockComplexProducts = allCountsRigth(data.initialStock);
    if (
      (goodStockComplexProducts &&
        //selectedProducts.length !== 0 &&
        typeProduct != 'rawMaterial') ||
      typeProduct == 'rawMaterial'
    ) {
      console.log('Todo correcto');
      let cleanProducts = [];
      if (typeProduct != 'rawMaterial') {
        selectedProducts.map((obj) => {
          cleanProducts.push({
            productId: obj.productId,
            quantity: obj.count,
            priceUnit: obj.priceUnit,
            description: obj.description,
            alias: obj.alias,
            weight: obj.weight,
            unitMeasure: obj.unitMeasure,
            customCodeProduct: obj.customCodeProduct || '',
            businessProductCode: obj.businessProductCode,
            secondaryUnitMeasure: obj.secondaryUnitMeasure || '',
            sumQuantity: obj.sumQuantity || 0,
          });
        });
      }
      console.log(cleanProducts);
      dispatch({
        type: GET_PRESIGNED,
        payload: undefined,
      });
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      dispatch({type: UPDATE_PRODUCT, payload: undefined});
      const finalPayload = {
        request: {
          payload: {
            businessProductCode: data.businessProductCode,
            description: data.description,
            alias: data.alias,
            costPriceUnit: Number(data.costPriceUnit),
            sellPriceUnit: Number(data.referecialPriceSell),
            weight: Number(data.weight),
            secondaryUnitMeasure: secondaryUnitMeasure,
            sumQuantity: Number(data.sumQuantity),
            initialStock: parseInt(Number(data.initialStock)),
            imgKey: null,
            customCodeProduct: data.customCodeProduct,
            title: data.title,
            commercialDescription: data.commercialDescription,
            unitMeasureWeight: weight_unit,
            unitMeasureMoney: money_unit,
            category: selectedCategory,
            tags: selectedFilters,
            typeProduct: typeProduct,
            imgKeys: selectedJsonImages,
            unitMeasure: objSelects.unitMeasure,
            unitsToProduce: 1,
            merchantId: userDataRes.merchantSelected.merchantId,
            inputsProduct: cleanProducts,
            inputsProductHistory: originalProduct.inputsProductHistory,
            publish: publish,
            isStockNeeded: isStockNeeded,
          },
        },
      };
      console.log('finalPayload', finalPayload);
      toUpdateProduct(finalPayload);
      console.log('resultado de la actualizacion', updateProductRes);
      setOpen(true);
    } else {
      /*if (selectedProducts.length === 0) {
        setTypeAlert('faltaProduct');
      } else */ if (!goodStockComplexProducts) {
        setTypeAlert('maxStock');
        setShowAlert(true);
      } else {
        setTypeAlert('');
      }
    }
    setSubmitting(false);
  };

  const handleClickAway = () => {
    // Evita que se cierre el diálogo haciendo clic fuera del contenido
    // Puedes agregar condiciones adicionales aquí si deseas una lógica más específica.
  };
  const showMessage = () => {
    if (successMessage != undefined) {
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
            Se ha actualizado la información <br />
            correctamente
          </DialogContentText>
        </>
      );
    } else if (errorMessage) {
      return (
        <>
          <CancelOutlinedIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            Se ha producido un error al actualizar.
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
    product['priceUnit'] = product['costPriceUnit'];
    product['count'] = Number(product['count']);
    delete product.costPriceUnit;
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
      let checkProduct = allProductsRes.find(
        (prod) => obj.productId == prod.productId,
      );
      if (Number(obj.count) * Number(countProducts) > checkProduct.stock) {
        status = false;
      }
    });
    console.log('subProducts', selectedProducts);
    console.log('estado de cuentas', status);
    return status;
  };
  const changeIcon = () => {
    setTypeIcon('2');
  };
  const changeIcon2 = () => {
    setTypeIcon('1');
  };
  const iconSelected = () => {
    if (typeIcon == '1') {
      return (
        <>
          <SchoolIcon fontSize='inherit' />
        </>
      );
    } else if (typeIcon == '2') {
      return <>VER TUTORIAL</>;
    }
  };

  const handleStock = (event, isInputChecked) => {
    setIsStockNeeded(isInputChecked);
  };

  return (
    <Card sx={{p: 4}}>
      <Box sx={{width: 1, textAlign: 'center'}}>
        <Typography
          sx={{mx: 'auto', my: '10px', fontWeight: 600, fontSize: 25}}
        >
          {`Actualizar ${
            query.typeProduct == 'service' ? 'Servicio' : 'Producto'
          }`}
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
          {({isSubmitting, setFieldValue}) => {
            changeValue = setFieldValue;
            return (
              <Form style={{textAlign: 'left'}} noValidate autoComplete='on'>
                <Grid
                  container
                  spacing={2}
                  sx={{width: '100%', mx: 'auto', mb: 4}}
                  maxWidth={500}
                >
                  <Grid item xs={12}>
                    <AppUpperCaseTextField
                      label='Código *'
                      disabled
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
                    <AppUpperCaseTextField
                      label='Descripción *'
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

                  {query.unitMeasure !== 'ZZ' ? (
                    <>
                      <Grid item xs={12}>
                        <AppUpperCaseTextField
                          label='Alias *'
                          name='alias'
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
                          label='Código aduanero (opcional)'
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
                    </>
                  ) : null}

                  {/* <Grid item xs={12}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel
                        id='categoria-label'
                        style={{fontWeight: 200}}
                      >
                        Categoría
                      </InputLabel>
                      <Select
                        //defaultValue={prevSelectedCategory}
                        defaultValue="Perecible"
                        value={selectedCategory}
                        name='category'
                        labelId='categoria-label'
                        label='Categoría'
                        onChange={handleFieldCategory}
                      >
                        {categories &&
                        Array.isArray(categories) &&
                        categories.length >= 1
                          ? categories.map((obj, index) => {
                              return (
                                <MenuItem
                                  key={index}
                                  value={obj}
                                  style={{fontWeight: 200}}
                                >
                                  {obj.description}
                                </MenuItem>
                              );
                            })
                          : null}
                      </Select>
                    </FormControl>
                  </Grid> */}
                  <Grid item xs={12}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel
                        id='categoria-label'
                        style={{fontWeight: 200}}
                      >
                        Categoría *
                      </InputLabel>
                      <Select
                        //defaultValue={prevSelectedCategory}
                        defaultValue={query.category}
                        value={selectedNonJsonCategory}
                        name='category'
                        labelId='categoria-label'
                        label='Categoría'
                        onChange={handleFieldCategory}
                      >
                        {categories &&
                        Array.isArray(categories) &&
                        categories.length >= 1
                          ? categories.map((obj, index) => {
                              return (
                                <MenuItem
                                  key={index}
                                  value={obj.description}
                                  style={{fontWeight: 200}}
                                >
                                  {obj.description}
                                </MenuItem>
                              );
                            })
                          : null}
                      </Select>
                    </FormControl>
                  </Grid>
                  {query.unitMeasure !== 'ZZ' ? (
                    <>
                      <Grid item xs={12}>
                        <AppTextField
                          label={`Peso (${weight_unit}) *`}
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
                        <FormControl fullWidth sx={{my: 2}}>
                          <InputLabel
                            id='secondaryUnitMeasure-label'
                            style={{fontWeight: 200}}
                          >
                            Unidad de Empaque
                          </InputLabel>
                          <Select
                            defaultValue='ML'
                            name='secondaryUnitMeasure'
                            labelId='secondaryUnitMeasure-label'
                            label='Unidad de Empaque'
                            onChange={handleFieldSum}
                          >
                            <MenuItem value='BX' style={{fontWeight: 200}}>
                              <IntlMessages id='product.secondaryUnitMeasure.bx' />
                            </MenuItem>
                            <MenuItem value='PK' style={{fontWeight: 200}}>
                              <IntlMessages id='product.secondaryUnitMeasure.pk' />
                            </MenuItem>
                            <MenuItem value='SA' style={{fontWeight: 200}}>
                              <IntlMessages id='product.secondaryUnitMeasure.sa' />
                            </MenuItem>
                            <MenuItem value='BG' style={{fontWeight: 200}}>
                              <IntlMessages id='product.secondaryUnitMeasure.bg' />
                            </MenuItem>
                            <MenuItem value='DZN' style={{fontWeight: 200}}>
                              <IntlMessages id='product.secondaryUnitMeasure.dzn' />
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <AppTextField
                          label={`Cantidad x Empaque (${secondaryUnitMeasure})`}
                          name='sumQuantity'
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
                    </>
                  ) : null}
                  <Grid item xs={12}>
                    <AppTextField
                      label={`Precio costo sugerido (${money_unit}) *`}
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
                  <Grid item xs={12}>
                    <AppTextField
                      label={`Precio venta sugerido (${money_unit}) *`}
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
                  {query.unitMeasure !== 'ZZ' ? (
                    <>
                      <Grid
                        item
                        xs={12}
                        sx={{display: 'flex', alignItems: 'center', px: 2}}
                      >
                        <FormControlLabel
                          checked={isStockNeeded}
                          control={<Checkbox onChange={handleStock} />}
                          label='Necesita Stock?'
                        />
                        {isStockNeeded}
                      </Grid>
                      <Grid item xs={12}>
                        <AppTextField
                          disabled
                          label='Stock inicial *'
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
                            defaultValue={query.typeProduct}
                            name='typeProduct'
                            labelId='typeProduct-label'
                            label='Tipo de producto'
                            disabled
                            onChange={handleFieldType}
                          >
                            <MenuItem
                              value='rawMaterial'
                              style={{fontWeight: 200}}
                            >
                              <IntlMessages id='product.type.rawMaterial' />
                            </MenuItem>
                            <MenuItem
                              value='intermediateProduct'
                              style={{fontWeight: 200}}
                            >
                              <IntlMessages id='product.type.intermediateProduct' />
                            </MenuItem>
                            <MenuItem
                              value='endProduct'
                              style={{fontWeight: 200}}
                            >
                              <IntlMessages id='product.type.endProduct' />
                            </MenuItem>
                          </Select>
                        </FormControl>
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
                            {typeAlert == 'noImage' ? (
                              'Selecciona una cantidad menor al stock existente.'
                            ) : (
                              <></>
                            )}
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
                          </Alert>
                        </Collapse>
                      </Grid>
                    </>
                  ) : null}
                  {sectionEcommerce === true ? (
                    <>
                      <Grid item xs={12} md={12}>
                        <FormGroup
                          sx={{
                            ml: 2,
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={publish}
                                onChange={handlePublicChange}
                              />
                            }
                            label='Mantener Público en Ecommerce'
                          />
                        </FormGroup>
                      </Grid>

                      {publish && (
                        <>
                          <Typography
                            component='h3'
                            sx={{
                              fontSize: 12,
                              fontWeight: Fonts.BOLD,
                              ml: {xs: 3, lg: 4},
                            }}
                          >
                            Sección Ecommerce (opcional)
                          </Typography>
                          <Grid item xs={12}>
                            <AppTextField
                              label='Título del Producto de forma pública'
                              name='title'
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
                              label='Descripción de forma pública'
                              name='commercialDescription'
                              multiline
                              rows={4}
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
                          {ecommerce_params &&
                          Array.isArray(ecommerce_params) &&
                          ecommerce_params.length >= 1 ? (
                            ecommerce_params.map((obj, index) => {
                              return (
                                <Grid key={index} item xs={12}>
                                  {/* <FormControl fullWidth sx={{my: 2}}>
                                    <InputLabel
                                      id='categoria-label'
                                      style={{fontWeight: 200}}
                                    >
                                      {obj.featureName}
                                    </InputLabel>
                                    <Select
                                      key={'SelectFilter' + index}
                                      value={selectedFilters[obj.featureName]}
                                      name={obj.featureName}
                                      labelId={obj.featureName + '-label'}
                                      label={obj.featureName}
                                      onChange={handleFieldFilter}
                                    >
                                      {obj.values &&
                                      Array.isArray(obj.values) &&
                                      obj.values.length >= 1 ? (
                                        obj.values.map((obj, index) => {
                                          return (
                                            <MenuItem
                                              key={index + 1}
                                              value={index + 1}
                                              style={{fontWeight: 200}}
                                            >
                                              {obj.name}
                                            </MenuItem>
                                          );
                                        })
                                      ) : (
                                        <MenuItem
                                          key={1}
                                          value={'noFilters'}
                                          style={{fontWeight: 200}}
                                        >
                                          <IntlMessages id='common.undefinedFilter' />
                                        </MenuItem>
                                      )}
                                      <MenuItem
                                        key={0}
                                        value={'noFilters'}
                                        style={{fontWeight: 200}}
                                      >
                                        <IntlMessages id='common.undefinedFilter' />
                                      </MenuItem>
                                    </Select>
                                  </FormControl> */}
                                  <FormControl
                                    sx={{m: 3}}
                                    component='fieldset'
                                    variant='standard'
                                  >
                                    <FormLabel sx={{ml: -3}} component='legend'>
                                      {obj.featureName}
                                    </FormLabel>
                                    <FormGroup>
                                      {obj.values &&
                                      Array.isArray(obj.values) &&
                                      obj.values.length >= 1 ? (
                                        obj.values.map((objV, index) => {
                                          return (
                                            <FormControlLabel
                                              key={`featureOption-${index}`}
                                              control={
                                                <Checkbox
                                                  value={Number(index) + 1}
                                                  checked={
                                                    selectedFilters[
                                                      obj.featureName
                                                    ]
                                                      ? selectedFilters[
                                                          obj.featureName
                                                        ].includes(
                                                          Number(index) + 1,
                                                        )
                                                      : false
                                                  }
                                                  onChange={handleFieldFilter2}
                                                  name={obj.featureName}
                                                />
                                              }
                                              label={objV.name}
                                            />
                                          );
                                        })
                                      ) : (
                                        <></>
                                      )}
                                    </FormGroup>
                                    {/* <FormHelperText>Be careful</FormHelperText> */}
                                  </FormControl>
                                </Grid>
                              );
                            })
                          ) : (
                            <></>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <></>
                  )}

                  {/* IMPORTANTE NO BORRAR */}
                  <Grid item xs={12} md={12}>
                    <Button
                      variant='contained'
                      color='secondary'
                      component='label'
                    >
                      Subir imagen
                      <input
                        type='file'
                        hidden
                        multiple
                        onChange={getImage}
                        id='imgInp'
                        name='imgInp'
                        accept='.png, .jpeg, .jpg'
                      />
                    </Button>
                  </Grid>
                  {/* <Box className={classes.imgPreview} sx={{my: 1, p: 4}}>
                  <img id='preview' className={classes.img} src=''></img>
                </Box> */}
                  {/* {selectedImages ? (
                  selectedImages.map((photo) => {
                    return (
                      <Grid item xs={12}  md={4}>
                        <Box className={classes.imgPreview} sx={{my: 1, p: 4}}>
                        <Badge className={classes.img} color="secondary" badgeContent=" ">
                            <img className={classes.img} src={photo} key={photo}></img>
                        </Badge>

                        </Box>
                      </Grid>
                    )
                  })
                ) : (
                  <></>
                )} */}
                  {selectedImages.length > 0 ? (
                    <ImageList
                      sx={{
                        width: 500,
                        height: 450,
                        // Promote the list into its own layer in Chrome. This costs memory, but helps keeping high FPS.
                        transform: 'translateZ(0)',
                        my: 1,
                        p: 4,
                      }}
                      rowHeight={200}
                      gap={1}
                    >
                      {selectedImages.map((item, index) => {
                        const cols = item.featured ? 2 : 1;
                        const rows = item.featured ? 2 : 1;

                        return (
                          <ImageListItem key={item} cols={cols} rows={rows}>
                            <img
                              className={classes.img}
                              src={item.src ? item.src : item}
                              key={item}
                            ></img>
                            <ImageListItemBar
                              sx={{
                                background:
                                  'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                                  'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                              }}
                              // title={"Prueba"}
                              position='top'
                              actionIcon={
                                <IconButton
                                  sx={{color: 'white'}}
                                  aria-label={`star prueba`}
                                  onClick={() => {
                                    deleteImage(index, item);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              }
                              actionPosition='left'
                            />
                          </ImageListItem>
                        );
                      })}
                    </ImageList>
                  ) : (
                    <></>
                  )}
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
                  {/* <Button
                  sx={{mx: 'auto', width: 1 / 2}}
                  variant='outlined'
                  size='large'
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
                        onMouseOver={() => changeIcon()}
                        onMouseLeave={() => changeIcon2()}
                        onClick={() =>
                          window.open('https://youtu.be/bjjUFNapWiY/')
                        }
                      >
                        {iconSelected()}
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
                        {iconSelected()}
                      </IconButton>
                    </Box>
                  </Box>
                )}
              </Form>
            );
          }}
        </Formik>

        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={open}
            onClose={handleClose}
            sx={{textAlign: 'center'}}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
              {'Actualización de Producto'}
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
        </ClickAwayListener>
      </Box>

      <Dialog
        open={open2}
        onClose={handleClose2}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Actualización de producto'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <PriorityHighIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            Desea cancelar esta operación?. <br /> Se perderá la información
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

export default UpdateProduct;
