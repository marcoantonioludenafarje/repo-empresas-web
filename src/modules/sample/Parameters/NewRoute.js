import React, {useEffect} from 'react';
import {v4 as uuidv4} from 'uuid';
import {
  Card,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Collapse,
  Typography,
  Divider,
  Grid,
  Stack,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ButtonGroup,
  FormControlLabel,
  FormGroup,
  Switch,
  Alert,
  Paper,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  TableHead,
  Table,
} from '@mui/material';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppPageMeta from '../../../@crema/core/AppPageMeta';
import {orange} from '@mui/material/colors';
import YouTubeIcon from '@mui/icons-material/YouTube';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import Router, {useRouter} from 'next/router';
import FilterCard from './FilterCard';
import CategoryCard from './CategoryCard';
import AppInfoView from '../../../@crema/core/AppInfoView';
import {useDispatch, useSelector} from 'react-redux';
import {generatePredefinedRoute} from '../../../redux/actions/Movements';
import {onGetProducts, deleteProduct} from '../../../redux/actions/Products';
import {getCarriers} from '../../../redux/actions/Carriers';
import {blue, green, red} from '@mui/material/colors';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import {getUserData} from '../../../redux/actions/User';
import {completeWithZeros} from '../../../Utils/utils';
import {
  onGetBusinessParameter,
  updateAllBusinessParameter,
  updateCatalogs,
} from '../../../redux/actions/General';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_PRODUCTS,
  GET_USER_DATA,
  GET_CARRIERS,
  GENERATE_ROUTE,
  UPDATE_ALL_BUSINESS_PARAMETER,
  UPDATE_CATALOGS,
} from '../../../shared/constants/ActionTypes';

const XLSX = require('xlsx');

const Distribution = () => {
  let changeValue;
  let listPayload = {
    request: {
      payload: {
        businessProductCode: null,
        description: null,
        merchantId: '',
      },
    },
  };
  const emptyRoute = {
    destination: '',
    address: '',
    driver: '',
    plate: '',
    products: [],
  };
  const emptyFilter = {
    featureName: '',
    values: [],
  };
  const emptyCategory = {
    active: true,
    default: false,
    description: '',
    productCategoryId: '',
  };
  const dispatch = useDispatch();
  const [typeAlert, setTypeAlert] = React.useState(
    'existProductsWithThisCategory',
  );
  const [routes, setRoutes] = React.useState([]);
  const [filters, setFilters] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [reload, setReload] = React.useState(false);
  const [execAll, setExecAll] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [openDeleteStatus, setOpenDeleteStatus] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [minTutorial, setMinTutorial] = React.useState(false);
  const [defaultMoney, setDefaultMoney] = React.useState('PEN');
  const [defaultWeight, setDefaultWeight] = React.useState('KG');
  const [defaultIgvActivation, setDefaultIgvActivation] = React.useState(0);
  const [defaultProductsPayDetail, setDefaultProductsPayDetail] =
    React.useState('');
  const [defaultPriceRange, setDefaultPriceRange] = React.useState([0, 1000]);
  const [sectionEcommerce, setSectionEcommerce] = React.useState(false);
  const [publish, setPublish] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [typeIcon, setTypeIcon] = React.useState('2');
  const [productsSelected, setProductsSelected] = React.useState([]);
  const [moneyUnit, setMoneyUnit] = React.useState('');
  const [selectedProduct, setSelectedProduct] = React.useState({});
  const [listProductsState, setListProductsState] = React.useState({});
  const {listProducts} = useSelector(({products}) => products);
  console.log('listProducts', listProducts);
  const {businessParameter} = useSelector(({general}) => general);
  console.log('globalParameter123', businessParameter);
  const {userAttributes} = useSelector(({user}) => user);
  console.log('userAttributes', userAttributes);
  const {userDataRes} = useSelector(({user}) => user);
  console.log('userDataRes', userDataRes);
  const {generateRouteRes} = useSelector(({movements}) => movements);
  console.log('generateRouteRes', generateRouteRes);
  const {updateCatalogsRes} = useSelector(({general}) => general);
  console.log('updateCatalogsRes', updateCatalogsRes);
  const {updateAllBusinessParameterRes} = useSelector(({general}) => general);
  console.log('updateAllBusinessParameterRes', updateAllBusinessParameterRes);
  const {generalSuccess} = useSelector(({general}) => general);
  console.log('generalSuccess', generalSuccess);
  const {generalError} = useSelector(({general}) => general);
  console.log('generalError', generalError);
  const {jwtToken} = useSelector(({general}) => general);
  const {successMessage} = useSelector(({products}) => products);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({products}) => products);
  console.log('errorMessage', errorMessage);
  const [excelOrCsv, setExcelOrCsv] = React.useState('');
  const [excelOrCsvName, setExcelOrCsvName] = React.useState('');

  let deletePayload = {
    request: {
      payload: {
        productId: null,
        businessProductCode: null,
        merchantId: '',
      },
    },
  };
  const getBusinessParameter = (payload) => {
    dispatch(onGetBusinessParameter(payload));
  };
  const updateParameters = (payload) => {
    dispatch(updateAllBusinessParameter(payload));
  };
  const getProducts = (payload) => {
    dispatch(onGetProducts(payload));
  };
  const toDeleteProduct = (payload) => {
    dispatch(deleteProduct(payload));
  };

  const toUpdateCatalogs = (payload) => {
    dispatch(updateCatalogs(payload));
  };

  const processData = (data) => {
    const keys = data[0];
    const datav2 = data
      .slice(1)
      .filter((row) => row[0] !== undefined && row[0] !== null)
      .map((row) =>
        keys.reduce((obj, key, i) => {
          obj[key] = row[i];
          return obj;
        }, {}),
      );
    return datav2;
  };

  const onChangeHandler = (event) => {
    if (excelOrCsv.target.files) {
      const reader = new FileReader();
      reader.onload = (excelOrCsv) => {
        const bstr = excelOrCsv.target.result;
        const wb = XLSX.read(bstr, {type: 'binary'});
        console.log('wb', wb);

        const productsSheet = wb.Sheets['PRODUCTOS'];
        const productsData = XLSX.utils.sheet_to_json(productsSheet, {
          header: 1,
        });
        const productsDataV2 = processData(productsData);

        const clientsSheet = wb.Sheets['CLIENTES'];
        const clientsData = XLSX.utils.sheet_to_json(clientsSheet, {header: 1});
        const clientsDataV2 = processData(clientsData);

        const deliveryPointsSheet = wb.Sheets['PUNTOS_ENTREGA'];
        const deliveryPointsData = XLSX.utils.sheet_to_json(
          deliveryPointsSheet,
          {
            header: 1,
          },
        );
        const deliveryPointsDataV2 = processData(deliveryPointsData);

        const driversSheet = wb.Sheets['CHOFERES'];
        const driversData = XLSX.utils.sheet_to_json(driversSheet, {header: 1});
        const driversDataV2 = processData(driversData);

        const carriersSheet = wb.Sheets['EMPRESA TRANSPORTISTA'];
        const carriersData = XLSX.utils.sheet_to_json(carriersSheet, {
          header: 1,
        });
        const carriersDataV2 = processData(carriersData);

        const providersSheet = wb.Sheets['PROVEEDORES'];
        const providersData = XLSX.utils.sheet_to_json(providersSheet, {
          header: 1,
        });
        const providersData2 = processData(providersData);

        console.log('productsDataV2', productsDataV2);
        console.log('routesDataV2', clientsDataV2);

        const payloadCatalogs = {
          request: {
            payload: {
              merchantId: userDataRes.merchantSelected.merchantId,
              data: {
                products: productsDataV2,
                clients: clientsDataV2,
                providers: providersData2,
                carriers: carriersDataV2,
                drivers: driversDataV2,
                deliveryPoints: deliveryPointsDataV2,
              },
            },
          },
        };
        console.log('payloadCatalogs', payloadCatalogs);
        dispatch({type: FETCH_SUCCESS, payload: undefined});
        dispatch({type: FETCH_ERROR, payload: undefined});
        dispatch({type: UPDATE_CATALOGS, payload: undefined});
        toUpdateCatalogs(payloadCatalogs);
      };
      reader.readAsBinaryString(excelOrCsv.target.files[0]);
    }
  };

  let defaultValues = {
    routeName: '',
    defaultMinPrice: 0,
    defaultMaxPrice: 1000,
    defaultWeight: 'KG',
    defaultMoney: 'PEN',
    defaultIgvActivation: 0,
    defaultProductsPayDetail: '',
  };
  useEffect(() => {
    if (userDataRes) {
      let parameterPayload = {
        request: {
          payload: {
            abreParametro: null,
            codTipoparametro: null,
            merchantId: userDataRes.merchantSelected.merchantId,
          },
        },
      };
      getBusinessParameter(parameterPayload);
      if (
        userDataRes.merchantSelected.plans.find(
          (element) => element.active == true,
        ).description == 'eCommerce'
      ) {
        setSectionEcommerce(true);
        setPublish(true);
      }
      if (userDataRes.merchantSelected.isEcommerceEnabled) {
        setPublish(true);
      }
      let listPayload = {
        request: {
          payload: {
            businessProductCode: null,
            description: null,
            merchantId: userDataRes.merchantSelected.merchantId,
          },
        },
      };
      console.log('listProducts1', listProducts);
      if (!listProducts || listProducts.length === 0) {
        getProducts(listPayload);
      }
    }
    if (userDataRes) {
      deletePayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;
      listPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;
      console.log('listProducts2', listProducts);
      if (!listProducts || listProducts.length === 0) {
        getProducts(listPayload);
      }
    }
  }, [userDataRes]);
  useEffect(() => {
    if (listProducts) {
      setListProductsState(listProducts);
      // console.log("cual es listProducts", listProducts);
      // console.log("cual es productsSelected", productsSelected);
      // const newProductsSelected = listProducts.filter(x => productsSelected.includes(x))
      // setProductsSelected(newProductsSelected)
    }
  }, [listProducts]);
  useEffect(() => {
    if (businessParameter !== undefined && businessParameter.length >= 1) {
      let ecommerceProductParameter = businessParameter.find(
        (obj) => obj.abreParametro == 'ECOMMERCE_PRODUCT_PARAMETERS',
      );
      let categoriesProductParameter = businessParameter.find(
        (obj) => obj.abreParametro == 'DEFAULT_CATEGORIES_PRODUCTS',
      ).value;
      let defaultIgvParameter = businessParameter.find(
        (obj) => obj.abreParametro == 'IGV',
      ).value;
      let defaultMoneyParameter = businessParameter.find(
        (obj) => obj.abreParametro == 'DEFAULT_MONEY_UNIT',
      ).value;
      let defaultWeightParameter = businessParameter.find(
        (obj) => obj.abreParametro == 'DEFAULT_WEIGHT_UNIT',
      ).value;
      let obtainedMoneyUnit = businessParameter.find(
        (obj) => obj.abreParametro == 'DEFAULT_MONEY_UNIT',
      ).value;
      console.log('moneyUnit desde selectProducts', moneyUnit);
      console.log('categoriesProductParameter', categoriesProductParameter);
      console.log(
        'ecommerceTagsProductParameter',
        ecommerceProductParameter.tags,
      );
      console.log(
        'ecommercePriceProductParameter',
        ecommerceProductParameter.price,
      );
      console.log('defaultIgvParameter', defaultIgvParameter);
      console.log('defaultMoneyParameter', defaultMoneyParameter);
      console.log('defaultWeightParameter', defaultWeightParameter);

      setFilters(ecommerceProductParameter.tags);
      setDefaultPriceRange([
        Number(ecommerceProductParameter.price.min),
        Number(ecommerceProductParameter.price.max),
      ]);
      setDefaultMoney(defaultMoneyParameter);
      setDefaultWeight(defaultWeightParameter);
      setDefaultIgvActivation(Number(defaultIgvParameter));
      setDefaultProductsPayDetail(
        ecommerceProductParameter.defaultProductsPayDetail,
      );
      setCategories(categoriesProductParameter);
      setMoneyUnit(obtainedMoneyUnit);
      changeValue('defaultWeight', defaultWeightParameter);
      changeValue('defaultMoney', defaultMoneyParameter);
      changeValue('defaultIgvActivation', Number(defaultIgvParameter));
      changeValue(
        'defaultProductsPayDetail',
        ecommerceProductParameter.defaultProductsPayDetail,
      );
      changeValue(
        'defaultMinPrice',
        Number(ecommerceProductParameter.price.min),
      );
      changeValue(
        'defaultMaxPrice',
        Number(ecommerceProductParameter.price.max),
      );
      console.log('categories', categories);
      console.log('defaultPriceRange hay', defaultPriceRange);
    }
  }, [businessParameter]);

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
        setPublish(true);
      }
      deletePayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;
      if (userDataRes.merchantSelected.isEcommerceEnabled) {
        setPublish(true);
      }
      listPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;
      console.log('listProducts3', listProducts);
      if (!listProducts || listProducts.length === 0) {
        getProducts(listPayload);
      }
    }

    setTimeout(() => {
      setMinTutorial(true);
      setTypeIcon('1');
    }, 2000);
  }, []);
  const handlePublicChange = (event) => {
    console.log('Switch ecommerce cambio', event);
    setPublish(event.target.checked);
  };
  const setRouteIndex = (index, obj) => {
    let changedRoutes = routes;
    changedRoutes[index] = obj;
    setRoutes(changedRoutes);
    console.log('changedRoutes', changedRoutes);
    console.log('routes', routes);
  };
  const setFilterIndex = (index, obj) => {
    console.log('obj: ', obj);
    let changedFilters = filters;
    changedFilters[index] = obj;
    setFilters(changedFilters);
    console.log('changedFilters', changedFilters);
    console.log('filters', filters);
  };
  const deleteFilter = (filterName, order) => {
    console.log('filterName: ', filterName);
    console.log('filters', filters);
    console.log('order en newRoute', order);
    let productsWithThisFilter = listProductsState.filter((element) => {
      let response = false;
      Object.entries(element.tags).forEach(([key, value]) => {
        if (filters[filters.length - 1].featureName === key) {
          console.log(value);
          response = true;
        }
      });
      return response;
    });
    console.log(
      'Longitud productos con el filtro',
      productsWithThisFilter.length,
    );
    if (productsWithThisFilter.length > 0) {
      setTypeAlert('existProductsWithThisFilter');
      setProductsSelected(productsWithThisFilter);
      setShowAlert(true);
    } else {
      console.log('Llego aquí?', filterName);
      let newFilters = filters;
      // newFilters = newFilters.filter(
      //   (element) =>(element.featureName !== filterName
      // ));;
      newFilters.splice(order, 1);
      console.log('nuevosFiltros', newFilters);
      setFilters(newFilters);
      reloadPage();
    }
  };
  const setCategoryIndex = (index, obj) => {
    console.log('obj: ', obj);
    let changedCategories = categories;
    changedCategories[index] = obj;
    setCategories(changedCategories);
    console.log('changedCategories', changedCategories);
    console.log('categories', categories);
  };

  const validationSchema = yup.object({
    // routeName: yup
    //   .string()
    //   .typeError(<IntlMessages id='validation.string' />)
    //   .required(<IntlMessages id='validation.required' />),
  });
  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    setExecAll(true);
    setExecAll(false);
    console.log('data final', {...data, filters: filters});
    // setFilters();
    // setCategories();

    console.log('sacarlo', defaultMoney);
    let defaultMoney2;
    if (defaultMoney == 'PEN') {
      defaultMoney2 = {
        value: 'PEN',
        metadata2: 'S/',
        metadata4: 'SOLES',
      };
    } else if (defaultMoney == 'USD') {
      defaultMoney2 = {
        value: 'USD',
        metadata2: '$/',
        metadata4: 'DOLLARS',
      };
    } else if (defaultMoney == 'EUR') {
      defaultMoney2 = {
        value: 'EUR',
        metadata2: '€/',
        metadata4: 'EUROS',
      };
    }
    let finalCategories = categories;

    if (finalCategories.length >= 1) {
      finalCategories[0].default = true;
    }

    const finalPayload = {
      request: {
        payload: {
          merchantId: userDataRes
            ? userDataRes.merchantSelected.merchantId
            : null,
          defaultMoneyValue: defaultMoney2.value,
          defaultMoneyMetadata2: defaultMoney2.metadata2,
          defaultMoneyMetadata4: defaultMoney2.metadata4,
          defaultWeightValue: defaultWeight,
          defaultIgvValue: defaultIgvActivation,
          defaultProductsPayDetail: defaultProductsPayDetail || '',
          price: defaultPriceRange,
          filters: publish ? filters : [],
          categories: finalCategories,
          isEcommerceEnabled: publish,
        },
      },
    };
    console.log('finalPayload', finalPayload);
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({
      type: GET_USER_DATA,
      payload: {
        ...userDataRes,
        merchantSelected: {
          ...userDataRes.merchantSelected,
          isEcommerceEnabled: publish,
        },
      },
    });
    dispatch({type: UPDATE_ALL_BUSINESS_PARAMETER, payload: undefined});
    updateParameters(finalPayload);
    setOpenStatus(true);
    setSubmitting(false);
  };
  const handleField = (event) => {
    console.log('evento', event);
    console.log('valor', event.target.value);
    if (event.target.name == 'documentType') {
      setTypeDocument(event.target.value);
    }
    if (event.target.name == 'defaultMoney') {
      setDefaultMoney(event.target.value);
    }
    if (event.target.name == 'defaultWeight') {
      setDefaultWeight(event.target.value);
    }
    if (event.target.name == 'defaultIgvActivation') {
      setDefaultIgvActivation(event.target.value);
      console.log('Es el activation IGV: ', event.target.value);
    }
    if (event.target.name == 'defaultProductsPayDetail') {
      setDefaultProductsPayDetail(event.target.value);
      console.log('Es defaultProductsPayDetail: ', event.target.value);
    }
    if (event.target.name == 'defaultMinPrice') {
      let priceRange = defaultPriceRange;
      priceRange[0] = event.target.value;
      setDefaultPriceRange(priceRange);
      console.log('Es precio mínimo: ', event.target.value);
    }
    if (event.target.name == 'defaultMaxPrice') {
      let priceRange = defaultPriceRange;
      priceRange[1] = event.target.value;
      setDefaultPriceRange(priceRange);
      console.log('Es precio máximo: ', event.target.value);
    }
  };
  const setFunction = (index, func) => {
    let changedRoutes = routes;
    changedRoutes[index].submit = func;
    console.log('function', changedRoutes[index].submit);
    setRoutes(changedRoutes);
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
          <YouTubeIcon fontSize='inherit' />
        </>
      );
    } else if (typeIcon == '2') {
      return <>VER TUTORIAL</>;
    }
  };
  const reloadPage = () => {
    setReload(!reload);
  };
  const parseTo3Decimals = (number) => {
    let newValue = number + Number.EPSILON;
    newValue = Math.round(newValue * 1000) / 1000;
    return newValue;
  };
  const registerSuccess = () => {
    console.log('Registro Exitoso?', generalSuccess);
    console.log('El res de updateParameters', updateAllBusinessParameterRes);
    return (
      generalSuccess != undefined &&
      updateAllBusinessParameterRes != undefined &&
      !('error' in updateAllBusinessParameterRes)
    );
  };
  const registerError = () => {
    console.log('Registro Erróneo?', generalSuccess);
    console.log('El res de updateParameters', updateAllBusinessParameterRes);
    return (
      (generalSuccess != undefined && updateAllBusinessParameterRes) ||
      generalError != undefined
    );
  };
  const sendStatus = () => {
    if (registerSuccess()) {
      Router.push('/sample/home');
      setOpenStatus(false);
    } else if (registerError()) {
      setOpenStatus(false);
    } else {
      setOpenStatus(false);
    }
  };
  const sendAlert = () => {
    setOpenAlert(false);
  };
  const showMessage = () => {
    if (registerSuccess()) {
      console.log('Fue exitoso?');
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
            <IntlMessages id='message.register.data.success' />
          </DialogContentText>
        </>
      );
    } else if (registerError()) {
      console.log('No Fue exitoso?');
      return (
        <>
          <CancelOutlinedIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            <IntlMessages id='message.register.data.error' />
            <br />
            {updateAllBusinessParameterRes &&
            'error' in updateAllBusinessParameterRes
              ? updateAllBusinessParameterRes.error
              : null}
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink sx={{mx: 'auto', my: '20px'}} />;
    }
  };
  const showMessageDelete = () => {
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
            Se ha eliminado la información correctamente.
          </DialogContentText>
        </>
      );
    } else if (errorMessage != undefined) {
      return (
        <>
          <CancelOutlinedIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            Se ha producido un error al eliminar.
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink />;
    }
  };
  const setDeleteState = () => {
    setOpenDelete(true);
  };
  const handleClose2 = () => {
    setOpenDelete(false);
  };

  const handleFile = (event) => {
    console.log('evento', event);
    setExcelOrCsvName(
      event.target.files[0].name.split('.').slice(0, -1).join('.'),
    );
    setExcelOrCsv(event);
  };

  const confirmDelete = (obj) => {
    deletePayload.request.payload.merchantId = obj.merchantId;
    deletePayload.request.payload.productId = obj.productId;
    deletePayload.request.payload.businessProductCode = obj.product;
    toDeleteProduct(deletePayload);
    setOpenDelete(false);
    setOpenDeleteStatus(true);
  };
  const sendDeleteStatus = () => {
    setOpenDeleteStatus(false);
    setOpenDelete(false);
    setOpenAlert(false);
    setShowAlert(false);
    setTimeout(() => {
      listPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;
      getProducts(listPayload);
    }, 200);
  };
  const goToUpdate = (obj) => {
    console.log('Actualizando', obj);
    Router.push({
      pathname: '/sample/products/update',
      query: obj,
    });
  };
  const handleChange = (event) => {
    if (event.target.name == 'defaultIgvActivation') {
      setDefaultIgvActivation(event.target.value);
      console.log('Es el activation IGV: ', event.target.value);
    }
    if (event.target.name == 'defaultProductsPayDetail') {
      setDefaultProductsPayDetail(event.target.value);
      console.log('Es el setDefaultProductsPayDetail: ', event.target.value);
    }
    if (event.target.name == 'defaultMinPrice') {
      let priceRange = defaultPriceRange;
      priceRange[0] = event.target.value;
      setDefaultPriceRange(priceRange);
      console.log('Es precio mínimo: ', event.target.value);
    }
    if (event.target.name == 'defaultMaxPrice') {
      let priceRange = defaultPriceRange;
      priceRange[1] = event.target.value;
      setDefaultPriceRange(priceRange);
      console.log('Es precio máximo: ', event.target.value);
    }
    // if (event.target.name == 'totalAmounth') {
    //   setTotalAmountWithConcepts(event.target.value);
    // }
  };
  return (
    <Card sx={{p: 4}}>
      <Box sx={{width: 1, textAlign: 'center'}}>
        <Typography
          sx={{
            mx: 'auto',
            my: '10px',
            fontWeight: 600,
            fontSize: 25,
            textTransform: 'uppercase',
          }}
        >
          <IntlMessages id='sidebar.sample.update.parameters' />
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
        <Formik
          validateOnChange={true}
          validationSchema={validationSchema}
          initialValues={{...defaultValues}}
          onSubmit={handleData}
        >
          {({isSubmitting, setFieldValue}) => {
            changeValue = setFieldValue;
            return (
              <Form
                id='principal-form'
                style={{textAlign: 'left', justifyContent: 'center'}}
                noValidate
                autoComplete='on'
                onChange={handleChange}
              >
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{my: 2}}>
                    <InputLabel
                      id='defaultMoney-label'
                      style={{fontWeight: 200}}
                    >
                      <IntlMessages id='common.busines.defaultMoney' />
                    </InputLabel>
                    <Select
                      name='defaultMoney'
                      labelId='defaultMoney-label'
                      label={<IntlMessages id='common.busines.defaultMoney' />}
                      displayEmpty
                      onChange={handleField}
                      value={defaultMoney}
                    >
                      <MenuItem value='PEN' style={{fontWeight: 200}}>
                        Sol peruano
                      </MenuItem>
                      <MenuItem value='USD' style={{fontWeight: 200}}>
                        Dólar estadounidense
                      </MenuItem>
                      <MenuItem value='EUR' style={{fontWeight: 200}}>
                        Euro
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{my: 2}}>
                    <InputLabel
                      id='defaultWeight-label'
                      style={{fontWeight: 200}}
                    >
                      <IntlMessages id='common.busines.defaultWeight' />
                    </InputLabel>
                    <Select
                      name='defaultWeight'
                      labelId='defaultWeight-label'
                      label={<IntlMessages id='common.busines.defaultWeight' />}
                      displayEmpty
                      onChange={handleField}
                      value={defaultWeight}
                    >
                      <MenuItem value='KG' style={{fontWeight: 200}}>
                        Kilogramo
                      </MenuItem>
                      <MenuItem value='LB' style={{fontWeight: 200}}>
                        Libra
                      </MenuItem>
                      <MenuItem value='T' style={{fontWeight: 200}}>
                        Tonelada
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid sx={{mb: 3, my: 2}} item xs={12} md={12}>
                  <AppTextField
                    name='defaultIgvActivation'
                    value={defaultIgvActivation}
                    fullWidth
                    label={'IGV'}
                  />
                </Grid>
                {publish && (
                  <>
                    <Grid sx={{mb: 3, my: 2}} item xs={12} md={12}>
                      <AppTextField
                        name='defaultProductsPayDetail'
                        value={defaultProductsPayDetail}
                        fullWidth
                        multiline
                        label={'Detalle de Pago de Productos'}
                      />
                    </Grid>
                    <Grid sx={{mb: 3}} item xs={12} md={12}>
                      <InputLabel id='price' style={{fontWeight: 800}}>
                        Precio
                      </InputLabel>
                    </Grid>
                    <Grid sx={{mb: 2}} item xs={6} md={3}>
                      <AppTextField
                        name='defaultMinPrice'
                        value={defaultPriceRange[0]}
                        fullWidth
                        label={'Mínimo'}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <AppTextField
                        name='defaultMaxPrice'
                        variant='outlined'
                        value={defaultPriceRange[1]}
                        fullWidth
                        label={'Máximo'}
                      />
                    </Grid>
                  </>
                )}
              </Form>
            );
          }}
        </Formik>
      </Box>
      {publish && (
        <>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              mb: 5,
            }}
          >
            <Stack
              direction='row'
              divider={<Divider orientation='vertical' flexItem />}
              spacing={2}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: 20,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <IntlMessages id='common.productTags' />
              </Typography>
              <IconButton
                onClick={() => {
                  console.log('filters', filters);
                  let newFilters = filters;
                  newFilters.push(emptyFilter);
                  setFilters(newFilters);
                  reloadPage();
                }}
                aria-label='delete'
                size='large'
              >
                <AddIcon fontSize='inherit' />
              </IconButton>
              {/* <IconButton
                onClick={() => {
                  console.log('filters', filters);
                  let productsWithThisFilter = listProductsState.filter(
                    (element) => {
                        let response = false;
                        Object.entries(element.tags).forEach(([key, value]) => {
                          if(filters[filters.length - 1].featureName === key){
                            console.log(value)
                            response = true;
                          }
                        })
                        return response
                      },
                  );
                  if (productsWithThisFilter.length > 0) {
                    setTypeAlert("existProductsWithThisFilter");
                    setProductsSelected(productsWithThisFilter);
                    setShowAlert(true);
                  } else {
                    let newFilters = filters;
                    newFilters.pop();
                    setFilters(newFilters);
                    reloadPage();
                  }
                }}
                aria-label='delete'
                size='large'
              >
                <RemoveIcon fontSize='inherit' />
              </IconButton> */}
            </Stack>
          </Box>

          <Box
            sx={{
              m: 'auto',
              mb: 5,
              border: '1px solid grey',
              borderRadius: '10px',
              width: '95  %',
            }}
          >
            {filters &&
              filters.map((filter, index) => (
                <>
                  <FilterCard
                    key={index}
                    order={index}
                    execFunctions={execAll}
                    newValuesData={setFilterIndex}
                    initialValues={filter}
                    deleteFilter={deleteFilter}
                  />
                  <Divider sx={{my: 0}} />
                  <ButtonGroup
                    orientation='vertical'
                    sx={{width: 1}}
                    aria-label='outlined button group'
                  >
                    <Button
                      color='primary'
                      sx={{mx: 'auto', my: 2, py: 1}}
                      form='principal-form'
                      variant='contained'
                      onClick={() => {
                        console.log('filters', filters);
                        let newFilters = filters;
                        newFilters.splice(index + 1, 0, emptyFilter);
                        setFilters(newFilters);
                        reloadPage();
                      }}
                    >
                      Añadir Nuevo Filtro
                    </Button>
                  </ButtonGroup>
                </>
              ))}
          </Box>
        </>
      )}

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          mb: 5,
        }}
      >
        <Stack
          direction='row'
          divider={<Divider orientation='vertical' flexItem />}
          spacing={2}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 20,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <IntlMessages id='common.productCategories' />
          </Typography>
          <IconButton
            onClick={() => {
              console.log('categories', categories);
              let newCategories = categories;
              let newEmptyCategory = emptyCategory;
              newEmptyCategory.productCategoryId = uuidv4();
              newEmptyCategory.description = '';
              if (newCategories.length == 0) {
                newEmptyCategory.default = true;
              }
              newCategories.push(newEmptyCategory);
              setCategories(newCategories);
              reloadPage();
            }}
            aria-label='delete'
            size='large'
          >
            <AddIcon fontSize='inherit' />
          </IconButton>
          <IconButton
            onClick={() => {
              console.log('categories', categories);
              let newCategories = categories;
              newCategories.pop();
              setCategories(newCategories);
              reloadPage();
            }}
            aria-label='delete'
            size='large'
          >
            <RemoveIcon fontSize='inherit' />
          </IconButton>
        </Stack>
      </Box>
      <Box
        sx={{
          m: 'auto',
          border: '1px solid grey',
          borderRadius: '10px',
          width: '95  %',
        }}
      >
        {categories &&
          categories.map((category, index) => (
            <>
              <Card key={index} sx={{p: 2}}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CategoryCard
                    key={index}
                    order={index}
                    execFunctions={execAll}
                    newValuesData={setCategoryIndex}
                    initialValues={category}
                  />

                  <IconButton
                    onClick={() => {
                      const productsWithThisCategory = listProductsState.filter(
                        (element) =>
                          element.category == category.description ||
                          element.categoryId == category.productCategoryId,
                      );
                      console.log(
                        'productsWithThisCategory',
                        productsWithThisCategory,
                      );
                      if (productsWithThisCategory.length > 0) {
                        setTypeAlert('existProductsWithThisCategory');
                        setProductsSelected(productsWithThisCategory);
                        setShowAlert(true);
                      } else {
                        console.log('categories', categories);
                        let newCategories = categories;
                        newCategories = newCategories.filter(
                          (item) =>
                            item.productCategoryId !==
                            category.productCategoryId,
                        );
                        setCategories(newCategories);
                        reloadPage();
                      }
                    }}
                    aria-label='delete'
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            </>
          ))}
      </Box>
      <Collapse in={showAlert}>
        <Alert
          severity='error'
          action={
            <>
              <IconButton
                aria-label='close'
                color='inherit'
                size='small'
                onClick={() => {
                  setOpenAlert(true);
                }}
              >
                <Button color='primary' variant='contained' sx={{p: '4px'}}>
                  Productos
                </Button>
              </IconButton>
              <IconButton
                aria-label='close'
                color='inherit'
                size='small'
                onClick={() => {
                  setShowAlert(false);
                }}
                sx={{height: '100%'}}
              >
                <Button
                  color='secondary'
                  variant='contained'
                  sx={{p: '9px', height: '100%'}}
                >
                  <CloseIcon fontSize='inherit' />
                </Button>
                {/* <CloseIcon fontSize='inherit' /> */}
              </IconButton>
            </>
          }
          sx={{mb: 1, pt: 0, alignItems: 'center', height: '100%'}}
        >
          {typeAlert == 'existProductsWithThisCategory' ? (
            <IntlMessages id='alert.configurationParameters.existProductsWithThisCategory' />
          ) : (
            <></>
          )}
          {typeAlert == 'existProductsWithThisFilter' ? (
            <IntlMessages id='alert.configurationParameters.existProductsWithThisFilter' />
          ) : (
            <></>
          )}
        </Alert>
      </Collapse>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          mb: 5,
        }}
      >
        <FormGroup
          sx={{
            ml: 2,
          }}
        >
          <FormControlLabel
            control={<Switch checked={publish} onChange={handlePublicChange} />}
            label='Dejar público Ecommerce'
          />
        </FormGroup>
      </Box>

      {/* <Button
        variant='outlined'
        component='label'
        endIcon={!excelOrCsvName ? <FileUploadOutlinedIcon /> : null}
      >
        {excelOrCsvName || 'Subir archivo'}
        <input
          type='file'
          hidden
          onChange={handleFile}
          on
          id='imgInp'
          name='imgInp'
          accept='.xlsx, .csv'
        />
      </Button>
      <Button
        startIcon={<SettingsIcon />}
        variant='contained'
        color='primary'
        onClick={onChangeHandler}
      >
        Procesar
      </Button>
      {(updateCatalogsRes && generalSuccess && !updateCatalogsRes.error) ? (
        <>
          <CheckCircleOutlineOutlinedIcon
            color='success'
            sx={{ fontSize: '1.5em', mx: 2 }}
          />
        </>
      ) : (
        <>
        </>
      )}
      {((updateCatalogsRes && updateCatalogsRes.error) || generalError) ? (
        <>
          <CancelOutlinedIcon
            sx={{ fontSize: '1.5em', mx: 2, color: red[500] }}
          />
          {updateCatalogsRes ? updateCatalogsRes.error : "Hubo un error durante el proceso"}
        </>
      ) : (
        <>
        </>
      )} */}

      <ButtonGroup
        orientation='vertical'
        variant='outlined'
        sx={{width: 1}}
        aria-label='outlined button group'
      >
        <Button
          color='primary'
          sx={{mx: 'auto', my: 6, width: '50%', py: 3}}
          type='submit'
          form='principal-form'
          variant='contained'
          startIcon={<SaveAltOutlinedIcon />}
        >
          Finalizar
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
              onClick={() => window.open('https://www.youtube.com/')}
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
              onClick={() => window.open('https://www.youtube.com/')}
            >
              {iconSelected()}
            </IconButton>
          </Box>
        </Box>
      )}
      <Dialog
        open={openStatus}
        onClose={sendStatus}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {<IntlMessages id='message.update.configurationParameters' />}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          {showMessage()}
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={sendStatus}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openAlert}
        onClose={sendAlert}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {<IntlMessages id='message.alert.configurationParameters' />}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <>
            <TableContainer component={Paper}>
              <Table sx={{minWidth: 650}} aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Precio compra sugerido</TableCell>
                    <TableCell>Precio venta sugerido</TableCell>
                    {localStorage
                      .getItem('pathsBack')
                      .includes('/inventory/products/update') === true ? (
                      <TableCell>Editar</TableCell>
                    ) : null}
                    {localStorage
                      .getItem('pathsBack')
                      .includes('/inventory/products/delete') === true ? (
                      <TableCell>Eliminar</TableCell>
                    ) : null}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productsSelected && Array.isArray(productsSelected) ? (
                    productsSelected.map((obj) => {
                      return (
                        <TableRow
                          sx={{
                            '&:last-child td, &:last-child th': {border: 0},
                            cursor: 'pointer',
                          }}
                          key={obj.product}
                          id={obj.product}
                          hover
                          onClick={() => {}}
                        >
                          <TableCell>{obj.product}</TableCell>
                          <TableCell>{obj.description}</TableCell>
                          <TableCell>{obj.stock}</TableCell>
                          <TableCell>
                            {`${parseTo3Decimals(
                              Number(obj.costPriceUnit),
                            ).toFixed(3)} ${moneyUnit}`}
                          </TableCell>
                          <TableCell>
                            {`${parseTo3Decimals(
                              Number(obj.priceBusinessMoneyWithIgv),
                            ).toFixed(3)} ${moneyUnit}`}
                          </TableCell>
                          {localStorage
                            .getItem('pathsBack')
                            .includes('/inventory/products/update') === true ? (
                            <TableCell>
                              <IconButton
                                onClick={() => {
                                  goToUpdate(obj);
                                }}
                                size='small'
                              >
                                <BorderColorOutlinedIcon fontSize='small' />
                              </IconButton>
                            </TableCell>
                          ) : null}
                          {localStorage
                            .getItem('pathsBack')
                            .includes('/inventory/products/delete') === true ? (
                            <TableCell>
                              <IconButton
                                disabled
                                onClick={() => {
                                  setSelectedProduct(obj);
                                  setDeleteState();
                                }}
                                size='small'
                              >
                                <DeleteOutlineOutlinedIcon fontSize='small' />
                              </IconButton>
                            </TableCell>
                          ) : null}
                        </TableRow>
                      );
                    })
                  ) : (
                    <CircularProgress
                      disableShrink
                      sx={{m: '10px', position: 'relative'}}
                    />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={sendAlert}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDelete}
        onClose={handleClose2}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Eliminar producto'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <PriorityHighIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            ¿Desea eliminar realmente la información seleccionada?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button
            variant='outlined'
            onClick={() => {
              confirmDelete(selectedProduct);
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
        open={openDeleteStatus}
        onClose={sendDeleteStatus}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Eliminar Producto'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          {showMessageDelete()}
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={sendDeleteStatus}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
      {/* <AppInfoView /> */}
    </Card>
  );
};

export default Distribution;
