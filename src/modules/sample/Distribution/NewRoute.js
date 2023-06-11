import React, {useEffect} from 'react';
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
  ButtonGroup,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Menu,
  MenuItem,
  TextField,
  Fade,
  Modal,
  Backdrop,
  useMediaQuery,
  useTheme,
  Alert,
} from '@mui/material';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppPageMeta from '../../../@crema/core/AppPageMeta';
import {orange} from '@mui/material/colors';
import YouTubeIcon from '@mui/icons-material/YouTube';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import EditRouteDeliveryModal from './editRouteDeliveryModal';
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DataSaverOffOutlinedIcon from '@mui/icons-material/DataSaverOffOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CachedIcon from '@mui/icons-material/Cached';
import CloseIcon from '@mui/icons-material/Close';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

import {makeStyles} from '@mui/styles';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import Router, {useRouter} from 'next/router';
import DeliveryCard from './DeliveryCard';
import AppInfoView from '../../../@crema/core/AppInfoView';
import {useDispatch, useSelector} from 'react-redux';
import {generatePredefinedRoute} from '../../../redux/actions/Movements';
import {onGetProducts} from '../../../redux/actions/Products';
import {getCarriers} from '../../../redux/actions/Carriers';
import {exportExcelTemplateToGenerateRoute} from '../../../redux/actions/General';
import {red} from '@mui/material/colors';
import {completeWithZeros} from '../../../Utils/utils';
import SchoolIcon from '@mui/icons-material/School';
const Excel = require('exceljs');
const XLSX = require('xlsx');
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_PRODUCTS,
  GET_CARRIERS,
  GENERATE_ROUTE,
  GENERATE_EXCEL_TEMPLATE_TO_ROUTES,
} from '../../../shared/constants/ActionTypes';
import {Download} from '@mui/icons-material';
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: '90%',
    height: '80vh',
    overflowY: 'scroll',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: '94%',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      width: '85%',
    },
    [theme.breakpoints.between('lg', 'xl')]: {
      width: '80%',
    },
  },
}));

let selectedDelivery = {};
let selectedDistribution = '';
let selectedRoute = '';
let typeAlert = '';
let msjError = '';
const Distribution = (props) => {
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
    empty: true,
    carrierDocumentType: 'Vacío',
    carrierDocumentNumber: 'Vacío',
    carrierDenomination: 'Vacío',
    startingPointUbigeo: 'Vacío',
    arrivalPointUbigeo: 'Vacío',
    startingPointAddress: 'Vacío',
    arrivalPointAddress: 'Vacío',
    driverDenomination: 'Vacío',
    driverLastName: 'Vacío',
    driverDocumentType: 'Vacío',
    driverDocumentNumber: 'Vacío',
    driverLicenseNumber: 'Vacío',
    carrierPlateNumber: 'Vacío',
    totalGrossWeight: 'Vacío',
    numberOfPackages: 'Vacío',
    totalWeight: 0,
    products: [],
  };
  const dispatch = useDispatch();
  const classes = useStyles(props);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [routes, setRoutes] = React.useState([]);
  const [reload, setReload] = React.useState(false);
  const [execAll, setExecAll] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [minTutorial, setMinTutorial] = React.useState(false);
  const [downloadExcel, setDownloadExcel] = React.useState(false);
  const {listProducts} = useSelector(({products}) => products);

  const [deliveriesData, setDeliveriesData] = React.useState([]);
  const [driversData, setDriversData] = React.useState([]);
  const [excelOrCsv, setExcelOrCsv] = React.useState('');
  const [excelOrCsvName, setExcelOrCsvName] = React.useState('');
  const [showAlert, setShowAlert] = React.useState(false);
  const [excelBase64, setExcelBase64] = React.useState('');

  const [openProducts, setOpenProducts] = React.useState(false);
  const [rowNumber, setRowNumber] = React.useState(0);
  const [rowNumber2, setRowNumber2] = React.useState(0);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDelivery, setOpenDelivery] = React.useState(false);
  const [selectedDeliveryState, setSelectedDeliveryState] = React.useState({});
  const openMenu = Boolean(anchorEl);
  const router = useRouter();
  const {query} = router;
  const [open2, setOpen2] = React.useState(false);

  console.log('products', listProducts);
  const {userAttributes} = useSelector(({user}) => user);
  console.log('userAttributes', userAttributes);
  const {userDataRes} = useSelector(({user}) => user);
  console.log('userDataRes', userDataRes);
  const {generateRouteRes} = useSelector(({movements}) => movements);
  console.log('generateRouteRes', generateRouteRes);
  const {successMessage} = useSelector(({movements}) => movements);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({movements}) => movements);
  console.log('errorMessage', errorMessage);
  const {jwtToken} = useSelector(({general}) => general);
  const {excelTemplateGeneratedToRouteRes} = useSelector(
    ({general}) => general,
  );

  listPayload.request.payload.merchantId =
    userDataRes.merchantSelected.merchantId;

  const toGetCarriers = (payload, token) => {
    dispatch(getCarriers(payload, token));
  };
  const generateRoute = (payload) => {
    dispatch(generatePredefinedRoute(payload));
  };
  const getProducts = (payload) => {
    dispatch(onGetProducts(payload));
  };
  const toExportExcelTemplateToGenerateRoute = (payload) => {
    dispatch(exportExcelTemplateToGenerateRoute(payload));
  };

  useEffect(() => {
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: GET_PRODUCTS, payload: undefined});
    getProducts(listPayload);
    let listCarriersPayload = {
      request: {
        payload: {
          typeDocumentCarrier: '',
          numberDocumentCarrier: '',
          denominationCarrier: '',
          merchantId: userDataRes.merchantSelected.merchantId,
          LastEvaluatedKey: null,
          needItems: true,
        },
      },
    };
    toGetCarriers(listCarriersPayload, jwtToken);
    setTimeout(() => {
      setMinTutorial(true);
    }, 2000);
  }, []);

  const setRouteIndex = (index, obj) => {
    let changedRoutes = routes;
    changedRoutes[index] = obj;
    setRoutes(changedRoutes);
    console.log('changedRoutes', changedRoutes);
    console.log('routes', routes);
  };

  const validationSchema = yup.object({
    routeName: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />)
      .required(<IntlMessages id='validation.required' />),
  });
  const validationSchema2 = yup.object({
    observationDelivery: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />)
      .required(<IntlMessages id='validation.required' />),
  });
  const defaultValues = {
    routeName: '',
  };
  const defaultValues2 = {
    observationDelivery: 'XD',
  };
  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    setExecAll(true);
    setExecAll(false);
    console.log('data final', {...data, routes: routes});
    setRoutes();
    const finalPayload = {
      request: {
        payload: {
          userActor: userAttributes['sub'],
          excel: excelBase64 ? excelBase64 : '',
          merchantId: userDataRes.merchantSelected.merchantId,
          routeName: data.routeName,
          deliveries: routes.map((obj) => {
            if (obj !== undefined) {
              return {
                carrierDocumentType: obj.carrierDocumentType,
                carrierDocumentNumber: obj.carrierDocumentNumber,
                carrierDenomination: obj.carrierDenomination,
                totalGrossWeight: obj.totalWeight,
                numberOfPackages: obj.numberPackages,
                observationDelivery: obj.observationDelivery,
                startingPointAddress: obj.startingAddress,
                startingInternalCode: obj.startingInternalCode || '',
                startingPointUbigeo: completeWithZeros(
                  obj.startingPointUbigeo,
                  6,
                ),
                arrivalPointAddress: obj.arrivalAddress,
                arrivalInternalCode: obj.arrivalInternalCode || '',
                arrivalPointUbigeo: completeWithZeros(
                  obj.arrivalPointUbigeo,
                  6,
                ),
                driverDenomination: obj.driverName,
                driverLastName: obj.driverLastName,
                driverDocumentType: obj.driverDocumentType,
                driverDocumentNumber: obj.driverDocumentNumber,
                driverId: '',
                driverLicenseNumber: obj.driverLicenseNumber,
                carrierPlateNumber: obj.plate,
                productsInfo: obj.products.map((prod) => {
                  return {
                    ...prod,
                    quantityMovement: prod.count,
                  };
                }),
              };
            }
          }),
        },
      },
    };
    console.log('finalPayload NewRoute', finalPayload);
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: GENERATE_ROUTE, payload: undefined});
    generateRoute(finalPayload);
    setOpenStatus(true);
    setSubmitting(false);
  };

  const setFunction = (index, func) => {
    let changedRoutes = routes;
    changedRoutes[index].submit = func;
    console.log('function', changedRoutes[index].submit);
    setRoutes(changedRoutes);
  };

  const reloadPage = () => {
    setReload(!reload);
  };

  const registerSuccess = () => {
    return (
      successMessage != undefined &&
      generateRouteRes != undefined &&
      !('error' in generateRouteRes)
    );
  };
  const registerError = () => {
    return (
      (successMessage != undefined && generateRouteRes) ||
      errorMessage
    );
  };
  const sendStatus = () => {
    if (registerSuccess()) {
      Router.push('/sample/distribution/predefined-routes');
      setOpenStatus(false);
    } else if (registerError()) {
      setOpenStatus(false);
    } else {
      setOpenStatus(false);
    }
  };
  const showMessage = () => {
    if (registerSuccess()) {
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
              <IntlMessages id='message.register.data.success' />
            </DialogContentText>
          </DialogContent>
        </>
      );
    } else if (registerError()) {
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
              <IntlMessages id='message.register.data.error' />
              <br />
              {generateRouteRes && 'error' in generateRouteRes
                ? generateRouteRes.error
                : null}
            </DialogContentText>
          </DialogContent>
        </>
      );
    } else {
      return <CircularProgress disableShrink sx={{mx: 'auto', my: '20px'}} />;
    }
  };
  const handleFile = (event) => {
    console.log('evento', event);
    setExcelOrCsvName(
      event.target.files[0].name.split('.').slice(0, -1).join('.'),
    );
    setExcelOrCsv(event);
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

  function formatData(
    deliveries,
    originalPoints,
    arrivalPoints,
    drivers,
    carriers,
    products,
  ) {
    return deliveries.map((item) => {
      const {'PUNTO PARTIDA': originalPoint} = item;
      const {'PUNTO LLEGADA': arrivalPoint} = item;
      const {CHOFER: driver} = item;
      const {'EMPRESA TRANSPORTISTA': carrier} = item;

      const matchOriginal = originalPoints.find(
        (d) => d.COD_INTERNO == originalPoint,
      );
      if (!matchOriginal) {
        msjError =
          msjError +
          "Validación de PUNTO DE PARTIDA: El código del punto '" +
          originalPoint +
          "' no existe, debe de coincidir con algún código de punto listado en la pestaña PUNTOS DE PARTIDA.  ";
      }

      const matchArrival = arrivalPoints.find(
        (d) => d.COD_INTERNO == arrivalPoint,
      );
      if (!matchArrival) {
        msjError =
          msjError +
          "Validación de PUNTO DE LLEGADA: El código del punto '" +
          arrivalPoint +
          "' no existe, debe de coincidir con algún código de punto listado en la pestaña PUNTOS DE LLEGADA.  ";
      }

      const matchDriver = drivers.find(
        (d) => d['NRO IDENTIFICADOR'] == driver.split('-')[2].trim(),
      );
      if (!matchDriver) {
        msjError =
          msjError +
          "Validación de CHOFER: El chofer '" +
          driver +
          "' no existe, debe de coincidir con algún chofer listado en la pestaña CHOFERES.  ";
      }

      const matchCarrier = carriers.find(
        (d) => d['NRO IDENTIFICADOR'] == carrier.split('-')[1].trim(),
      );
      if (!matchCarrier) {
        msjError =
          msjError +
          "Validación de EMPRESA TRANSPORTISTA: La empresa '" +
          carrier +
          "' no existe, debe de coincidir con alguna empresa listado en la pestaña EMPRESA TRANSPORTISTA.  ";
      }

      let existeError = false;
      let productsSelected = item['PRODUCTOS'].split('|').map((product) => {
        let tempprod = product.split('-');
        if (tempprod.length != 2) {
          msjError =
            msjError +
            "Validación de PRODUCTOS: Error con el producto: '" +
            tempprod +
            "' Debe de tener la estructura: PRODUCTO - CANTIDAD.  ";
          existeError = true;
          return;
        } else {
          return {
            alias: product.split('-')[0].trim(),
            quantity: parseInt(product.split('-')[1].trim()),
          };
        }
      });

      let totalWeight = 0;
      let productsInfo = [];
      console.log('productsSelected::', productsSelected);
      if (productsSelected.length > 0 && !existeError) {
        productsSelected.forEach((product) => {
          let productInfo = products.find((item2) => {
            // if (
            //   item2['DESCRIPCION'].includes('-') ||
            //   item2['DESCRIPCION'].includes('|')
            // ) {
            //   msjError = msjError + "Validación de PRODUCTO: Error con el producto: '"+item2['DESCRIPCION']+"' tiene el símbolo | o el - en su descripción, debe de retirarlos.  ";
            //   return;
            // }
            if (
              item2['ALIAS'].trim().replace(/ /g, '').toUpperCase() ===
              product.alias.trim().replace(/ /g, '').toUpperCase()
            ) {
              return true;
            }
          });
          console.log('productInfo::', productInfo);
          if (productInfo) {
            console.log('productInfo12::', productInfo);
            if (productInfo['DOSIFICACION']) {
              console.log('productInfo', productInfo);
              productInfo['DOSIFICACION'].split('|').forEach((inputProduct) => {
                let productInfo2 = products.find(
                  (item3) =>
                    item3['DESCRIPCION']
                      .trim()
                      .replace(/ /g, '')
                      .toUpperCase() ===
                    inputProduct
                      .split('-')[0]
                      .trim()
                      .replace(/ /g, '')
                      .toUpperCase(),
                );
                if (productInfo2) {
                  let existingProduct = productsInfo.find(
                    (p) => p.product === productInfo2['CODIGO'],
                  );
                  if (existingProduct) {
                    existingProduct.count +=
                      parseInt(inputProduct.split('-')[1].trim()) *
                      product.quantity;
                  } else {
                    productsInfo.push({
                      productId: `${productInfo2['CODIGO'].padStart(32, '0')}-${
                        userDataRes.merchantSelected.merchantId
                      }`,
                      product: productInfo2['CODIGO'],
                      description: productInfo2['DESCRIPCION'].trim(),
                      unitMeasure: productInfo2['UNIDAD DE MEDIDA'],
                      typeProduct:
                        productInfo['TIPO PRODUCTO'] === 'Producto intermedio'
                          ? 'intermediateProduct'
                          : productInfo['TIPO PRODUCTO'] === 'Producto final'
                          ? 'endProduct'
                          : productInfo['TIPO PRODUCTO'] === 'Insumo'
                          ? 'rawMaterial'
                          : null,
                      count:
                        parseInt(inputProduct.split('-')[1].trim()) *
                        product.quantity,
                      weight: productInfo2['PESO (Kg)'],
                    });
                  }
                  totalWeight +=
                    parseInt(inputProduct.split('-')[1].trim()) *
                    product.quantity *
                    Number(productInfo2['PESO (Kg)']);
                }
              });
            } else {
              if (productInfo) {
                let existingProduct = productsInfo.find(
                  (p) => p.product === productInfo['CODIGO'],
                );
                if (existingProduct) {
                  existingProduct.count += product.quantity;
                } else {
                  productsInfo.push({
                    productId: `${productInfo['CODIGO'].padStart(32, '0')}-${
                      userDataRes.merchantSelected.merchantId
                    }`,
                    product: productInfo['CODIGO'],
                    description: productInfo['DESCRIPCION'].trim(),
                    unitMeasure: productInfo['UNIDAD DE MEDIDA'],
                    typeProduct:
                      productInfo['TIPO PRODUCTO'] === 'Producto intermedio'
                        ? 'intermediateProduct'
                        : productInfo['TIPO PRODUCTO'] === 'Producto final'
                        ? 'endProduct'
                        : productInfo['TIPO PRODUCTO'] === 'Insumo'
                        ? 'rawMaterial'
                        : null,
                    count: product.quantity,
                    weight: productInfo['PESO (Kg)'],
                  });
                }
                totalWeight +=
                  product.quantity * Number(productInfo['PESO (Kg)']);
              }
            }
          } else {
            msjError =
              msjError +
              "Validación de PRODUCTO: El producto: '" +
              product.product +
              "' no existe, debe de coincidir con algun producto listado en la pestaña PRODUCTOS.  ";
            return;
          }
        });
      } else {
        //msjError = msjError + "Validación de PRODUCTOS: No existe producto ingreso, debe de contener por lo menos uno";
        return;
      }

      if (msjError) {
        return;
      } else {
        return {
          ...item,
          startingPointUbigeo: matchOriginal['UBIGEO'],
          startingAddress: matchOriginal['DIRECCION EXACTA'],
          startingInternalCode: matchOriginal['COD_INTERNO'],
          arrivalPointUbigeo: matchArrival['UBIGEO'],
          arrivalAddress: matchArrival['DIRECCION EXACTA'],
          arrivalInternalCode: matchArrival['COD_INTERNO'],
          driverDocumentNumber: matchDriver['NRO IDENTIFICADOR'],
          driverName: matchDriver['NOMBRES'],
          driverLastName: matchDriver['APELLIDOS'],
          driverDocumentType: matchDriver['IDENTIFICADOR'].toLowerCase(),
          driverId: '',
          driverLicenseNumber: matchDriver['LICENCIA'].toUpperCase(),
          plate: item['PLACA'].trim(),
          carrierDenomination: matchCarrier['NOMBRE/RAZON SOCIAL'],
          carrierDocumentType: matchCarrier['IDENTIFICADOR'],
          carrierDocumentNumber: matchCarrier['NRO IDENTIFICADOR'],
          products: productsInfo,
          numberPackages: '1',
          totalWeight: totalWeight,
          observationDelivery: item['OBSERVACION'],
          generateReferralGuide:
            item['DESEA GENERAR GUIA REMISION?'] == 'SI' ? true : false,
          transferStartDate: 1676155434735,
        };
      }
    });
  }
  const onLoad = (fileString, name, type) => {
    console.log('llega aquí?');
    setExcelBase64({
      base64: fileString,
      name: name,
      type: type,
    });
  };
  const getBase64 = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      onLoad(reader.result, file.name, file.type);
    };
  };
  const onChangeHandler = (event) => {
    console.log('entramos al onchange', excelOrCsv);
    if (excelOrCsv && excelOrCsv.target.files) {
      getBase64(excelOrCsv.target.files[0]);
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

        const routesSheet = wb.Sheets['ENTREGAS DE LA RUTA'];
        const routesData = XLSX.utils.sheet_to_json(routesSheet, {header: 1});
        const routesDataV2 = processData(routesData);

        const arrivalPointsSheet = wb.Sheets['PUNTOS DE LLEGADA'];
        const arrivalPointsData = XLSX.utils.sheet_to_json(arrivalPointsSheet, {
          header: 1,
        });
        const arrivalPointsDataV2 = processData(arrivalPointsData);

        const originalPointsSheet = wb.Sheets['PUNTOS DE PARTIDA'];
        const originalPointsData = XLSX.utils.sheet_to_json(
          originalPointsSheet,
          {header: 1},
        );
        const originalPointsDataV2 = processData(originalPointsData);

        const driversSheet = wb.Sheets['CHOFERES'];
        const driversData = XLSX.utils.sheet_to_json(driversSheet, {header: 1});
        const driversDataV2 = processData(driversData);

        const carriersSheet = wb.Sheets['EMPRESA TRANSPORTISTA'];
        const carriersData = XLSX.utils.sheet_to_json(carriersSheet, {
          header: 1,
        });
        const carriersDataV2 = processData(carriersData);

        console.log('productsDataV2', productsDataV2);
        console.log('routesDataV2', routesDataV2);
        console.log('carriersDataV2', carriersDataV2);
        console.log('driversDataV2', driversDataV2);
        console.log('originalPointsDataV2', originalPointsDataV2);
        console.log('arrivalPointsDataV2', arrivalPointsDataV2);
        msjError = '';

        let existAlias = true;
        productsDataV2.forEach((ele1) => {
          console.log('El ele1', ele1);
          console.log('El String(ele1[', String(ele1['ALIAS']));

          if (
            !(
              ele1['ALIAS'] &&
              String(ele1['ALIAS']) !== 'null' &&
              String(ele1['ALIAS']).length > 0
            )
          ) {
            existAlias = false;
          }
        });
        if (!existAlias) {
          msjError =
            'Validaciones de Carga de Rutas: Los productos deben de contener el campo ALIAS . Puedes actualizarlos en Configuraciones';
          setShowAlert(true);
        } else {
          if (
            productsDataV2.length > 0 &&
            routesDataV2.length > 0 &&
            carriersDataV2.length > 0 &&
            driversDataV2.length > 0 &&
            originalPointsDataV2.length > 0 &&
            arrivalPointsDataV2.length > 0
          ) {
            const deliveriesFinished = formatData(
              routesDataV2,
              originalPointsDataV2,
              arrivalPointsDataV2,
              driversDataV2,
              carriersDataV2,
              productsDataV2,
            );
            if (msjError == '') {
              setDriversData(driversData);
              setDeliveriesData(deliveriesFinished);
              setRoutes(deliveriesFinished);
            } else {
              setShowAlert(true);
            }
          } else {
            msjError =
              'Validaciones de Carga de Rutas: Verifique las hojas del Excel. Debe de haber información en todas las hojas como ENTREGAS DE RUTA, PRODUCTOS, PUNTOS DE LLEGADA, PUNTOS DE PARTIDA, CHOFERES Y EMPRESA TRANSPORTISTA';
            setShowAlert(true);
          }
        }
      };
      reader.readAsBinaryString(excelOrCsv.target.files[0]);
    } else {
      msjError =
        'Validaciones de Carga de Rutas: Archivo no existe, verifique que lo haya cargado';
      setShowAlert(true);
    }
  };
  useEffect(() => {
    console.log('deliveriesData', deliveriesData);
    console.log('driversData', driversData);
  }, [deliveriesData, driversData]);
  useEffect(() => {
    console.log('selectedDeliveryState', selectedDeliveryState);
  }, [selectedDeliveryState]);
  const checkProducts = (delivery, index) => {
    selectedDelivery = delivery;
    console.log('selectedDelivery', selectedDelivery);
    setOpenProducts(false);
    setOpenProducts(true);
    if (openProducts == true && rowNumber2 == index) {
      setOpenProducts(false);
    }
    setRowNumber2(index);
  };
  const showIconStatus = (bool, obj) => {
    switch (bool) {
      case true:
        return (
          <Button variant='secondary' sx={{fontSize: '1em'}}>
            <CheckCircleIcon color='success' />
          </Button>
        );
        break;
      case false:
        return <CancelIcon sx={{color: red[500]}} />;
        break;
      default:
        return null;
    }
  };
  const handleClick = (route, event) => {
    setAnchorEl(event.currentTarget);
    setRowNumber2(route.localRouteId);
    selectedRoute = route;
    setSelectedDeliveryState(selectedRoute);
    console.log('selectedRoute', selectedRoute);
  };
  const sendStatus2 = () => {
    if (openDelivery) {
      setOpenDelivery(false);
    } else {
      setOpenDelivery(true);
    }
  };
  const handleClose = () => {
    console.log('se está ejecutando?');
    setOpenDelivery(false);
    console.log('openDelivery', openDelivery);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };
  const cancel = () => {
    setOpen2(true);
  };

  const updateDelivery = (event) => {
    event.preventDefault();
    handleClose();
    const updatedDeliveries = routes.map((route) => {
      if (route['ORDEN ENTREGA'] === selectedDeliveryState['ORDEN ENTREGA']) {
        return {
          ...route,
          observationDelivery: event.target.observationDelivery.value,
        };
      }
      return route;
    });
    setRoutes(updatedDeliveries);
  };

  const updateDelivery2 = (newDelivery) => {
    handleClose();
    console.log('newDelivery', newDelivery);
    const updatedDeliveries = routes.map((route) => {
      if (route['ORDEN ENTREGA'] === selectedDeliveryState['ORDEN ENTREGA']) {
        return {
          ...newDelivery,
        };
      }
      return route;
    });
    setRoutes(updatedDeliveries);
  };
  function swapRowsUp() {
    let newRoutes = routes;
    const temp = newRoutes[rowNumber2];
    newRoutes[rowNumber2] = newRoutes[rowNumber2 - 1];
    newRoutes[rowNumber2 - 1] = temp;
    setRoutes(newRoutes);
    reloadPage();
  }
  function swapRowsDown() {
    let newRoutes = routes;
    const temp = newRoutes[rowNumber2];
    newRoutes[rowNumber2] = newRoutes[rowNumber2 + 1];
    newRoutes[rowNumber2 + 1] = temp;
    setRoutes(newRoutes);
    reloadPage();
  }
  const deleteRoute = () => {
    let newRoutes = routes.filter((item, index) => index !== rowNumber2);
    setRoutes(newRoutes);
    reloadPage();
  };
  const exportToExcel = () => {
    const excelPayload = {
      request: {
        payload: {
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };
    console.log('excelPayload', excelPayload);
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: GENERATE_EXCEL_TEMPLATE_TO_ROUTES, payload: undefined});
    toExportExcelTemplateToGenerateRoute(excelPayload);
    setDownloadExcel(true);
  };

  useEffect(() => {
    if (excelTemplateGeneratedToRouteRes && downloadExcel) {
      setDownloadExcel(false);
      const byteCharacters = atob(excelTemplateGeneratedToRouteRes);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'createRouteTemplate.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [excelTemplateGeneratedToRouteRes, downloadExcel]);

  const handleExport = () => {
    exportToExcel(products, deliveries);
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
          <IntlMessages id='sidebar.sample.new.predefinedRoutes' />
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
          {({isSubmitting}) => {
            return (
              <Form
                id='principal-form'
                style={{textAlign: 'left', justifyContent: 'center'}}
                noValidate
                autoComplete='on'
              >
                <Grid
                  container
                  spacing={2}
                  sx={{maxWidth: 500, width: 'auto', margin: 'auto'}}
                >
                  <Grid item xs={12}>
                    <AppTextField
                      label={`Nombre de la ruta predefinida`}
                      name='routeName'
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
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Box>
      <Stack
        sx={{m: 2, justifyContent: 'center', marginBottom: '10px'}}
        direction={isSmallScreen ? 'column' : 'row'}
        spacing={2}
      >
        <Button
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
        <Button
          startIcon={<FileDownloadOutlinedIcon />}
          variant='outlined'
          color='secondary'
          onClick={exportToExcel}
        >
          Descargar Plantilla
        </Button>
      </Stack>
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
          {msjError}
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
            <IntlMessages id='common.deliveries' />
          </Typography>
          <IconButton
            onClick={() => {
              console.log('rutas', routes);
              let newRoutes = routes;
              newRoutes.push(emptyRoute);
              setRoutes(newRoutes);
              reloadPage();
            }}
            aria-label='delete'
            size='large'
          >
            <AddIcon fontSize='inherit' />
          </IconButton>
          <IconButton
            onClick={() => {
              console.log('rutas', routes);
              let newRoutes = routes;
              newRoutes.pop();
              setRoutes(newRoutes);
              reloadPage();
            }}
            aria-label='delete'
            size='large'
          >
            <RemoveIcon fontSize='inherit' />
          </IconButton>
        </Stack>
      </Box>

      <Box sx={{margin: 0}}>
        <TableContainer component={Paper} sx={{maxHeight: 440}}>
          <Table stickyHeader size='small' aria-label='purchases'>
            <TableHead sx={{backgroundColor: '#ededed'}}>
              <TableRow>
                <TableCell>Nro</TableCell>
                <TableCell>Dirección de punto de partida</TableCell>
                <TableCell>Ubigeo de punto de partida</TableCell>
                <TableCell>CodInterno de punto de partida</TableCell>
                <TableCell>Dirección de punto de llegada</TableCell>
                <TableCell>Ubigeo de punto de llegada</TableCell>
                <TableCell>CodInterno de punto de llegada</TableCell>
                <TableCell>Empresa Transportista</TableCell>
                <TableCell>Documento de conductor</TableCell>
                <TableCell>Nombre de conductor</TableCell>
                <TableCell>Apellidos de conductor</TableCell>
                <TableCell>Licencia de conductor</TableCell>
                <TableCell>Placa del vehículo</TableCell>
                <TableCell>Productos</TableCell>
                <TableCell>Observaciones</TableCell>
                <TableCell>Peso total</TableCell>
                <TableCell>Número de paquetes</TableCell>
                {/* <TableCell>
                  Guía de Remisión Generada
                </TableCell> */}
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {routes && routes.length !== 0
                ? routes.map((route, index2) => {
                    const products = route.products;
                    return (
                      <>
                        <TableRow key={index2}>
                          <TableCell>{index2 + 1}</TableCell>
                          <TableCell>{route.startingAddress}</TableCell>
                          <TableCell>{route.startingPointUbigeo}</TableCell>
                          <TableCell>{route.startingInternalCode}</TableCell>
                          <TableCell>{route.arrivalAddress}</TableCell>
                          <TableCell>{route.arrivalPointUbigeo}</TableCell>
                          <TableCell>{route.arrivalInternalCode}</TableCell>
                          <TableCell>{route.carrierDenomination}</TableCell>
                          <TableCell>
                            {route.driverDocumentType &&
                            route.driverDocumentNumber
                              ? `${route.driverDocumentType.toUpperCase()} - ${
                                  route.driverDocumentNumber
                                }`
                              : null}
                          </TableCell>
                          <TableCell>{route.driverName}</TableCell>
                          <TableCell>{route.driverLastName}</TableCell>
                          <TableCell>{route.driverLicenseNumber}</TableCell>
                          <TableCell>{route.plate}</TableCell>
                          <TableCell>
                            {products && products.length !== 0 ? (
                              <IconButton
                                onClick={() => checkProducts(route, index2)}
                                size='small'
                              >
                                <FormatListBulletedIcon fontSize='small' />
                              </IconButton>
                            ) : null}
                          </TableCell>
                          <TableCell>{route.observationDelivery}</TableCell>
                          <TableCell>
                            {route.totalWeight
                              ? Number.parseFloat(route.totalWeight).toFixed(3)
                              : 0}
                          </TableCell>
                          <TableCell>{route.numberPackages}</TableCell>
                          {/* <TableCell align='center'>
                          {showIconStatus(
                            route.generateReferralGuide,
                            route
                          )}
                        </TableCell> */}
                          <TableCell>
                            <Button
                              id='basic-button'
                              aria-controls={
                                openMenu ? 'basic-menu' : undefined
                              }
                              aria-haspopup='true'
                              aria-expanded={openMenu ? 'true' : undefined}
                              onClick={handleClick.bind(this, {
                                ...route,
                                localRouteId: index2,
                              })}
                            >
                              <KeyboardArrowDownIcon />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow key={`sub-${index2}`}>
                          <TableCell sx={{p: 0}} colSpan={10}>
                            <Collapse
                              in={openProducts && index2 === rowNumber2}
                              timeout='auto'
                              unmountOnExit
                            >
                              <Box sx={{margin: 0}}>
                                <Table size='small' aria-label='purchases'>
                                  <TableHead
                                    sx={{
                                      backgroundColor: '#ededed',
                                    }}
                                  >
                                    <TableRow>
                                      <TableCell>Código</TableCell>
                                      <TableCell>Descripción</TableCell>
                                      <TableCell>Cantidad</TableCell>
                                      <TableCell>Peso Unitario</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {products && products.length !== 0
                                      ? products.map((product, index3) => {
                                          return (
                                            <TableRow
                                              key={`${index3}-${index3}`}
                                            >
                                              <TableCell>
                                                {product.businessProductCode !=
                                                null
                                                  ? product.businessProductCode
                                                  : product.product}
                                              </TableCell>
                                              <TableCell>
                                                {product.description}
                                              </TableCell>
                                              <TableCell>
                                                {product.count}
                                              </TableCell>
                                              <TableCell>
                                                {product.weight}
                                              </TableCell>
                                            </TableRow>
                                          );
                                        })
                                      : null}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })
                : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* <Box
        sx={{
          m: 'auto',
          border: '1px solid grey',
          borderRadius: '10px',
          width: '95  %',
        }}
      >
        {routes &&
          routes.map((route, index) => (
            <DeliveryCard
              key={index}
              order={index}
              execFunctions={execAll}
              newValuesData={setRouteIndex}
              initialValues={route}
            />
          ))}
      </Box> */}

      <ButtonGroup
        orientation='vertical'
        variant='outlined'
        sx={{width: 1, my: 3}}
        aria-label='outlined button group'
      >
        <Button
          color='primary'
          sx={{mx: 'auto', width: '50%', py: 3}}
          type='submit'
          form='principal-form'
          variant='contained'
          startIcon={<SaveAltOutlinedIcon />}
        >
          Finalizar
        </Button>
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
              onClick={() => window.open('https://www.youtube.com/')}
            >
              <SchoolIcon fontSize='inherit' />
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
              VER TUTORIAL
            </IconButton>
          </Box>
        </Box>
      )}

      {/* <Dialog
        open={openDelivery}
        onClose={sendStatus2}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        {selectedDeliveryState ? (
          <Box>
            <DeliveryCard
              key={rowNumber2}
              order={rowNumber2}
              execFunctions={execAll}
              newValuesData={setRouteIndex}
              initialValues={selectedDeliveryState}
              isFromUpdate={true}
            />
          </Box>
        ) : null}
      </Dialog> */}

      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={openDelivery}
        onClose={handleClose}
        closeAfterTransition
        // BackdropComponent={Backdrop}
        // BackdropProps={{
        //   classes: {
        //     root: classes.backdrop
        //   },
        //   timeout: 500,
        // }}
        className={classes.modal}
      >
        <Fade in={openDelivery}>
          <Box className={classes.paper}>
            <Typography id='transition-modal-title' variant='h2' component='h2'>
              Editar Entrega
            </Typography>

            <EditRouteDeliveryModal
              selectedDeliveryState={selectedDeliveryState}
              editFunction={updateDelivery2}
            />
          </Box>
        </Fade>
      </Modal>
      <Dialog
        open={openStatus}
        onClose={sendStatus}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {<IntlMessages id='message.register.newRoute' />}
        </DialogTitle>
        {showMessage()}
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={sendStatus}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open2}
        onClose={handleClose2}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Registro de rutas'}
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
              Router.push('/sample/distribution/predefined-routes');
            }}
          >
            Sí
          </Button>
          <Button variant='outlined' onClick={handleClose2}>
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={openMenu}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={sendStatus2}>
          <CachedIcon sx={{mr: 1, my: 'auto'}} />
          Actualizar
        </MenuItem>
        <MenuItem disabled={!(rowNumber2 != 0)} onClick={swapRowsUp}>
          <ArrowUpwardOutlinedIcon sx={{mr: 1, my: 'auto'}} />
          Subir
        </MenuItem>
        <MenuItem
          disabled={routes ? !(rowNumber2 != routes.length - 1) : false}
          onClick={swapRowsDown}
        >
          <ArrowDownwardOutlinedIcon sx={{mr: 1, my: 'auto'}} />
          Bajar
        </MenuItem>
        <MenuItem onClick={deleteRoute}>
          <DeleteOutlinedIcon sx={{mr: 1, my: 'auto'}} />
          Eliminar
        </MenuItem>
      </Menu>
      {/* <AppInfoView /> */}
    </Card>
  );
};

export default Distribution;
