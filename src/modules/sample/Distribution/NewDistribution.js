import React, {useEffect, Component} from 'react';
import {
  Card,
  Box,
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
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Stack,
  IconButton,
  Button,
  ButtonGroup,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Fade,
  Backdrop,
  useMediaQuery,
  useTheme,
  Modal,
  Menu,
} from '@mui/material';
import {ClickAwayListener} from '@mui/base';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppPageMeta from '../../../@crema/core/AppPageMeta';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import EditDistributionDeliveryModal from './editDistributionDeliveryModal';
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DataSaverOffOutlinedIcon from '@mui/icons-material/DataSaverOffOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CachedIcon from '@mui/icons-material/Cached';
import SettingsIcon from '@mui/icons-material/Settings';

import {makeStyles} from '@mui/styles';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import DeliveryCard from './DeliveryCard';
import {DateTimePicker} from '@mui/lab';
import Router, {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import AppInfoView from '../../../@crema/core/AppInfoView';
import {
  toDateAndHOurs,
  dateWithHyphen,
  completeWithZeros,
} from '../../../Utils/utils';
import {onGetBusinessParameter} from '../../../redux/actions/General';
import {onGetProducts} from '../../../redux/actions/Products';
import {getCarriers} from '../../../redux/actions/Carriers';
import {
  generateDistribution,
  getChildRoutes,
  listPredefinedRoutes_____PageNewDistribution,
  registerNewDistribution_____PageNewDistribution,
  getPredefinedRoute_____PageNewDistribution,
} from '../../../redux/actions/Movements';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GENERATE_DISTRIBUTION,
  GET_PRODUCTS,
  GET_CARRIERS,
} from '../../../shared/constants/ActionTypes';
import {red} from '@mui/material/colors';
import {orange} from '@mui/material/colors';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {maxHeight} from '@mui/system';
import SchoolIcon from '@mui/icons-material/School';
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

const Distribution = (props) => {
  const {
    outputItems_pageListOutput,
    predefinedRoutes_PageNewDistribution,
    successMessage,
    generateDistributionRes,
    errorMessage,
    deliveries,
    LastEvaluatedKeyChildRoute,
    selectedRoute_PageNewDistribution,
  } = useSelector(({movements}) => movements);

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
    totalGrossWeight: 0,
    numberOfPackages: 'Vacío',
    totalWeight: 0,
    products: [],
  };
  const [initialDate, setInitialDate] = React.useState(new Date());
  const [finalDate, setFinalDate] = React.useState(new Date());
  const [selectedRouteId, setSelectedRouteId] = React.useState('');
  const [selectedRoute, setSelectedRoute] = React.useState({});
  const [status, setStatus] = React.useState('started');
  const [routes, setRoutes] = React.useState([]);
  const [execAll, setExecAll] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [selectedOutput, setSelectedOutput] = React.useState({});
  const [serial, setSerial] = React.useState('');
  const [transportModeVal, setTransportModeVal] = React.useState(
    'privateTransportation',
  );
  const [minTutorial, setMinTutorial] = React.useState(false);

  const [deliveriesData, setDeliveriesData] = React.useState([]);
  const [driversData, setDriversData] = React.useState([]);
  const [excelOrCsv, setExcelOrCsv] = React.useState('');
  const [excelOrCsvName, setExcelOrCsvName] = React.useState('');

  const [openProducts, setOpenProducts] = React.useState(false);
  const [rowNumber, setRowNumber] = React.useState(0);
  const [rowNumber2, setRowNumber2] = React.useState(0);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDelivery, setOpenDelivery] = React.useState(false);
  const [selectedDeliveryState, setSelectedDeliveryState] = React.useState({});

  const openMenu = Boolean(anchorEl);
  const dispatch = useDispatch();
  const classes = useStyles(props);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const {query} = router;
  console.log('query', query);

  const {businessParameter} = useSelector(({general}) => general);
  console.log('businessParameter', businessParameter);

  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  const {jwtToken} = useSelector(({general}) => general);

  const toGetChildRoutes = (payload) => {
    dispatch(getChildRoutes(payload));
  };

  const toListPredefinedRoutes = () => {
    dispatch(
      listPredefinedRoutes_____PageNewDistribution({
        merchantId: userDataRes.merchantSelected.merchantId,
      }),
    );
  };

  const toGetPredefinedRoute = () => {
    dispatch(
      getPredefinedRoute_____PageNewDistribution({
        merchantId: userDataRes.merchantSelected.merchantId,
        routePredefinedId: selectedRoute.routePredefinedId,
      }),
    );
  };

  const toRegisterNewDistribution = (payload) => {
    dispatch(registerNewDistribution_____PageNewDistribution(payload));
  };

  useEffect(() => {
    console.log('Se selecciono en un selectedRoute', selectedRoute);
    if (selectedRoute && selectedRoute.deliveries) {
      if (
        selectedRoute.routesChildId &&
        selectedRoute.routesChildId.length > 0 &&
        selectedRoute.deliveries.length == 0
      ) {
        console.log('LLamara la primera condicional');
        // getChildRoutesPayload.request.payload.deliveryFatherId =
        //   initialRoute.routePredefinedId;

        setRoutes([]);
        // toGetChildRoutes(getChildRoutesPayload);
        toGetPredefinedRoute();

        // Ahora chekaremos la sgte casuistica simple
      } else if (selectedRoute && selectedRoute.deliveries.length > 0) {
        console.log('Finalmente entro a setear los routes');
        let deliveries = selectedRoute.deliveries.map((obj) => {
          obj.products = obj.productsInfo;
          obj.totalWeight = obj.totalGrossWeight;
          obj.numberPackages = obj.numberOfPackages;
          obj.startingAddress = obj.startingPointAddress;
          obj.arrivalAddress = obj.arrivalPointAddress;
          obj.driverName = obj.driverDenomination;
          obj.plate = obj.carrierPlateNumber;
          obj.transferStartDate = dateWithHyphen(Date.now());
          obj.generateReferralGuide = true;
          return obj;
        });
        console.log('initial deliveries', deliveries);
        setRoutes(deliveries);
      }
    }
  }, [selectedRoute]);

  useEffect(() => {
    console.log('Aca vienen los deliveries', deliveries);
    if (deliveries && deliveries.length > 0) {
      console.log('Entro a setear ahora', deliveries);

      let newDeliveries = deliveries.map((obj) => {
        obj.products = obj.productsInfo;
        obj.totalWeight = obj.totalGrossWeight;
        obj.numberPackages = obj.numberOfPackages;
        obj.startingAddress = obj.startingPointAddress;
        obj.arrivalAddress = obj.arrivalPointAddress;
        obj.driverName = obj.driverDenomination;
        obj.plate = obj.carrierPlateNumber;
        obj.transferStartDate = dateWithHyphen(Date.now());
        obj.generateReferralGuide = true;
        return obj;
      });
      console.log('initial newDeliveries', newDeliveries);

      setRoutes(newDeliveries);
    }
  }, [deliveries]);

  useEffect(() => {
    console.log('userDataRes12000', userDataRes);
    if (userDataRes && userDataRes.merchantSelected) {
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      dispatch({type: GET_PRODUCTS, payload: undefined});
      // topredefinedRoutes_PageNewDistributions(predefinedRoutes_PageNewDistributionsPayload);
      toListPredefinedRoutes();
      let listPayload = {
        request: {
          payload: {
            businessProductCode: null,
            description: null,
            merchantId: userDataRes.merchantSelected.merchantId,
          },
        },
      };

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
      let foundOutput = outputItems_pageListOutput.find(
        (output) => output.movementHeaderId === query.movementHeaderId,
      );
      console.log('selectedOutput', selectedOutput);
      setSelectedOutput(foundOutput);
      if (!businessParameter) {
        let businessParameterPayload = {
          request: {
            payload: {
              abreParametro: null,
              codTipoparametro: null,
              merchantId: userDataRes.merchantSelected.merchantId,
            },
          },
        };
        getBusinessParameter(businessParameterPayload);
      }
      setTimeout(() => {
        setMinTutorial(true);
      }, 2000);
    }
  }, [userDataRes]);

  useEffect(() => {
    if (businessParameter != undefined) {
      let serieParameter = businessParameter.find(
        (obj) => obj.abreParametro == 'SERIES_REFERRAL_GUIDE',
      );
      console.log('serieParameter', serieParameter);
      console.log('serieParameter.metadata', serieParameter.metadata);
      setSerial(serieParameter.metadata ? serieParameter.metadata : '');
    }
  }, [businessParameter]);

  const getBusinessParameter = (payload) => {
    dispatch(onGetBusinessParameter(payload));
  };
  const toGenerateDistribution = (payload) => {
    dispatch(generateDistribution(payload));
  };
  const getProducts = (payload) => {
    dispatch(onGetProducts(payload));
  };
  const toGetCarriers = (payload, token) => {
    dispatch(getCarriers(payload, token));
  };

  const validationSchema = yup.object({
    observation: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />),
  });
  const defaultValues = {
    observation: '',
  };
  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: GENERATE_DISTRIBUTION, payload: undefined});
    setExecAll(true);
    setExecAll(false);
    console.log(`inicio ${initialDate}, final ${finalDate}`);
    console.log('final estado', status);
    console.log('final data', data);
    console.log('final routes', routes);
    const finalPayload = {
      request: {
        payload: {
          userActor: userAttributes['sub'],
          merchantId: userDataRes.merchantSelected.merchantId,
          denominationMerchant:
            userDataRes.merchantSelected.denominationMerchant,
          routeName: selectedRoute.routeName,
          typePDF: userDataRes.merchantSelected.typeMerchant,
          folderMovement: selectedOutput.folderMovement,
          movementTypeMerchantId: selectedOutput.movementTypeMerchantId,
          contableMovementId: selectedOutput.contableMovementId || '',
          movementHeaderId: selectedOutput.movementHeaderId,
          createdAt: selectedOutput.createdAt,
          clientId: selectedOutput.clientId,
          issueDate: dateWithHyphen(new Date()),
          serial: serial,
          documentsMovement: selectedOutput.documentsMovement,
          startingDate: toDateAndHOurs(initialDate),
          arrivalDate: toDateAndHOurs(finalDate),
          reasonForTransfer: 'sale',
          routerId: selectedRoute.routePredefinedId,
          typeOfTransport: transportModeVal,
          observation: data.observation,
          deliveries: routes.map((route, index) => {
            if (route !== undefined) {
              return {
                destination: route.startingAddress,
                localRouteId: index,
                //transferStartDate: toDateAndHOurs(route.transferStartDate),
                totalGrossWeight: route.totalWeight,
                numberOfPackages: route.numberPackages,
                observationDelivery: route.observationDelivery,
                reasonForTransfer: route.reasonForTransfer || "sale",
                startingPointAddress: route.startingAddress,
                startingInternalCode: route.startingInternalCode || '',
                startingPointUbigeo: completeWithZeros(
                  route.startingPointUbigeo,
                  6,
                ),
                arrivalPointAddress: route.arrivalAddress,
                arrivalInternalCode: route.arrivalInternalCode || '',
                arrivalPointUbigeo: completeWithZeros(
                  route.arrivalPointUbigeo,
                  6,
                ),
                carrierDocumentType: route.carrierDocumentType,
                carrierDocumentNumber: route.carrierDocumentNumber,
                carrierDenomination: route.carrierDenomination,
                driverDenomination: route.driverName,
                driverLastName: route.driverLastName,
                driverDocumentType: route.driverDocumentType,
                driverDocumentNumber: route.driverDocumentNumber,
                driverLicenseNumber: route.driverLicenseNumber,
                driverId: '',
                carrierPlateNumber: route.plate,
                generateReferralGuide: route.generateReferralGuide,
                transferStartDate:
                  typeof route.transferStartDate == 'number'
                    ? dateWithHyphen(route.transferStartDate)
                    : route.transferStartDate,
                productsInfo: route.products.map((prod) => {
                  return {
                    productId: prod.productId,
                    product: prod.product,
                    description: prod.description,
                    unitMeasure: prod.unitMeasure,
                    quantityMovement: prod.count,
                    weight: prod.weight,
                    businessProductCode: prod.businessProductCode,
                  };
                }),
              };
            }
          }),
        },
      },
    };
    console.log('finalPayload', finalPayload);
    toGenerateDistribution(finalPayload);
    setOpenStatus(true);
    setTimeout(() => {
      setSubmitting(false);
    }, 2000);
  };

  const setRouteIndex = (index, obj) => {
    let changedRoutes = routes;
    changedRoutes[index] = obj;
    setRoutes(changedRoutes);
    console.log('changedRoutes', changedRoutes);
    console.log('routes', routes);
  };

  const reloadPage = () => {
    setReload(!reload);
  };

  const registerSuccess = () => {
    return (
      successMessage != undefined &&
      generateDistributionRes != undefined &&
      !('error' in generateDistributionRes)
    );
  };
  const registerError = () => {
    return (
      (successMessage != undefined && generateDistributionRes) || errorMessage
    );
  };
  const sendStatus = () => {
    if (registerSuccess()) {
      Router.push('/sample/distribution/distributions');
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
              {generateDistributionRes && 'error' in generateDistributionRes
                ? generateDistributionRes.error
                : null}
            </DialogContentText>
          </DialogContent>
        </>
      );
    } else {
      return <CircularProgress disableShrink sx={{mx: 'auto', my: '20px'}} />;
    }
  };

  const compare = (a, b) => {
    if (a.createdAt < b.createdAt) {
      return 1;
    }
    if (a.createdAt > b.createdAt) {
      return -1;
    }
    return 0;
  };

  const selectRoute = (event) => {
    console.log('Id ruta', event.target.value);
    console.log('selectedRoutePredefined', selectedRoute);
    const selectedNewRoute = predefinedRoutes_PageNewDistribution.find(
      (obj) => obj.routePredefinedId == event.target.value,
    );

    setSelectedRouteId(event.target.value);
    setSelectedRoute(selectedNewRoute);
  };

  const onChangeInitialDate = (event) => {
    const fecha = new Date(initialDate);
    const timestamp = fecha.getTime();
    console.log('newDeliveries', timestamp);
    const newDeliveries = routes.map((delivery) => {
      console.log('holi madafaca');
      delivery.transferStartDate = dateWithHyphen(timestamp);
      delivery.transferTimeStampDate=timestamp
      return delivery;
    });
    setRoutes(newDeliveries);
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
  const handleClick = (route, event) => {
    setAnchorEl(event.currentTarget);
    setRowNumber2(route.localRouteId);
    setSelectedDeliveryState(route);
    console.log('selectedRoute', route);
  };
  const sendStatus2 = () => {
    if (openDelivery) {
      setOpenDelivery(false);
    } else {
      setOpenDelivery(true);
    }
  };
  const handleClickAway = () => {
    // Evita que se cierre el diálogo haciendo clic fuera del contenido
    // Puedes agregar condiciones adicionales aquí si deseas una lógica más específica.
  };
  const handleClose = () => {
    console.log('se está ejecutando?');
    setOpenDelivery(false);
    console.log('openDelivery', openDelivery);
  };
  const updateDelivery2 = (newDelivery, index2) => {
    handleClose();
    console.log('newDelivery', newDelivery);
    const updatedDeliveries = routes.map((route, index) => {
      if (index === index2) {
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

  useEffect(() => {
    console.log(
      'Este es el predefinedRoutes_PageNewDistribution 1234',
      predefinedRoutes_PageNewDistribution,
    );
    console.log(
      'Este es el selectedRoute_PageNewDistribution',
      selectedRoute_PageNewDistribution,
    );
    // Si es que no existe el selectedRoute entonces seleccionamos
    // por defecto el predefinedRoutes_PageNewDistribution
    if (
      predefinedRoutes_PageNewDistribution &&
      predefinedRoutes_PageNewDistribution.length > 0 &&
      !selectedRoute.routePredefinedId
    ) {
      const initialRoute = predefinedRoutes_PageNewDistribution[0];
      setSelectedRouteId(initialRoute.routePredefinedId);
      setSelectedRoute(initialRoute);
    } else if (
      predefinedRoutes_PageNewDistribution &&
      predefinedRoutes_PageNewDistribution.length > 0 &&
      selectedRoute_PageNewDistribution &&
      selectedRoute_PageNewDistribution.routePredefinedId
    ) {
      console.log('Entro por aca selectedRoute_PageNewDistribution');
      // let itemModified =  predefinedRoutes_PageNewDistribution.filter(ele => ele.routePredefinedId == selectedRoute.routePredefinedId )
      // if(itemModified.length>0 && itemModified[0].deliveries.length>0){
      setSelectedRouteId(selectedRoute_PageNewDistribution.routePredefinedId);
      setSelectedRoute(selectedRoute_PageNewDistribution);

      // }
    }
  }, [predefinedRoutes_PageNewDistribution, selectedRoute_PageNewDistribution]);

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
          <IntlMessages id='sidebar.sample.newDistribution' />
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
            const arrFolderMovement = query.folderMovement.split('/');
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
                      label={<IntlMessages id='eCommerce.sale.related' />}
                      name='saleRelated'
                      variant='outlined'
                      disabled
                      defaultValue={arrFolderMovement[2]}
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                      }}
                    />
                  </Grid>

                  {/* <Grid item xs={7}>
                    <Typography sx={{px: 2}}>
                      <IntlMessages id='product.type.breakfast.primary' />
                    </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    100
                  </Grid>

                  <Grid item xs={7}>
                    <Typography sx={{px: 2}}>
                      <IntlMessages id='product.type.breakfast.secondary' />
                    </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    70
                  </Grid> */}

                  <Grid item xs={8} sx={{mt: 4}}>
                    <DateTimePicker
                      renderInput={(params) => (
                        <TextField {...params} sx={{width: 1}} />
                      )}
                      label={
                        <IntlMessages id='dashboard.initialDateTimeTras' />
                      }
                      inputFormat='dd/MM/yyyy hh:mm a'
                      value={initialDate}
                      onChange={(newDate) => {
                        setInitialDate(newDate);
                        console.log('initial date', newDate);
                      }}
                    />
                  </Grid>

                  <Grid item xs={4} sx={{mt: 4}}>
                    <Button
                      startIcon={<SettingsIcon />}
                      variant='contained'
                      color='primary'
                      onClick={onChangeInitialDate}
                    >
                      Procesar
                    </Button>
                  </Grid>

                  <Grid item xs={12} sx={{my: 4}}>
                    <DateTimePicker
                      renderInput={(params) => (
                        <TextField {...params} sx={{width: 1}} />
                      )}
                      label={<IntlMessages id='dashboard.finalDateTime' />}
                      inputFormat='dd/MM/yyyy hh:mm a'
                      value={finalDate}
                      minDateTime={new Date()}
                      onChange={(newDate) => {
                        setFinalDate(newDate);
                        console.log('final date', newDate);
                      }}
                    />
                  </Grid>

                  {/* <Grid item xs={12}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel
                        id='transportMode-label'
                        style={{fontWeight: 200}}
                      >
                        Modalidad de transporte
                      </InputLabel>
                      <Select
                        sx={{textAlign: 'left'}}
                        onChange={(event) => {
                          setTransportModeVal(event.target.value);
                          console.log('modo de transporte', event.target.value);
                        }}
                        name='transportMode'
                        labelId='transportMode-label'
                        label='Modalidad de transporte'
                        value={transportModeVal}
                      >
                        <MenuItem
                          value='privateTransportation'
                          style={{fontWeight: 200}}
                        >
                          Transporte privado
                        </MenuItem>
                        <MenuItem
                          value='publicTransportation'
                          style={{fontWeight: 200}}
                        >
                          Transporte público
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid> */}

                  <Grid item xs={8}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel id='route-label' style={{fontWeight: 200}}>
                        <IntlMessages id='sidebar.sample.route' />
                      </InputLabel>
                      <Select
                        name='route'
                        labelId='route-label'
                        label={<IntlMessages id='sidebar.sample.route' />}
                        onChange={(event) => selectRoute(event)}
                        value={selectedRouteId}
                        MenuProps={{PaperProps: {style: {maxHeight: 200}}}}
                      >
                        {predefinedRoutes_PageNewDistribution &&
                          predefinedRoutes_PageNewDistribution
                            .sort(compare)
                            .map((route, index) => {
                              return (
                                <MenuItem
                                  value={route.routePredefinedId}
                                  key={index}
                                  style={{fontWeight: 200}}
                                >
                                  {route.routeName}
                                </MenuItem>
                              );
                            })}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={4}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel id='status-label' style={{fontWeight: 200}}>
                        <IntlMessages id='common.status' />
                      </InputLabel>
                      <Select
                        name='status'
                        labelId='status-label'
                        label={<IntlMessages id='common.status' />}
                        onChange={(e) => setStatus(e.target.value)}
                        value={status}
                      >
                        <MenuItem value='started' style={{fontWeight: 200}}>
                          <IntlMessages id='common.status.started' />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <AppTextField
                      label='Observación'
                      name='observation'
                      variant='outlined'
                      multiline
                      rows={4}
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
            <IntlMessages id='common.deliveries' />{' '}
            {selectedRoute && routes.length > 0
              ? `(${routes.length}) puntos`
              : `(Cargando ${selectedRoute.cantDeliveries} puntos)`}
          </Typography>
          <IconButton
            onClick={() => {
              let newRoutes = routes;
              console.log('deliveries antes', newRoutes);
              newRoutes.push(emptyRoute);
              setRoutes(newRoutes);
              console.log('deliveries despues', newRoutes);
              reloadPage();
            }}
            aria-label='delete'
            size='large'
          >
            <AddIcon fontSize='inherit' />
          </IconButton>
          <IconButton
            onClick={() => {
              let newRoutes = routes;
              console.log('deliveries antes', newRoutes);
              newRoutes.pop();
              setRoutes(newRoutes);
              console.log('deliveries despues', newRoutes);
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
                <TableCell>Fecha de Entrega</TableCell>
                <TableCell>Generar Guía de Remisión?</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {routes && routes.length !== 0
                ? routes.map((route, index2) => {
                  console.log("Este es el routes que se renderiza",routes);
                    const products = route.products;
                    return (
                      <>
                        <TableRow key={index2}>
                          <TableCell>{index2 + 1}</TableCell>
                          <TableCell>
                            {route.startingAddress ||
                              route.startingPointAddress}
                          </TableCell>
                          <TableCell>{route.startingPointUbigeo}</TableCell>
                          <TableCell>{route.startingInternalCode}</TableCell>
                          <TableCell>
                            {route.arrivalAddress || route.arrivalPointAddress}
                          </TableCell>
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
                          <TableCell>
                            {route.driverName || route.driverDenomination}
                          </TableCell>
                          <TableCell>{route.driverLastName}</TableCell>
                          <TableCell>{route.driverLicenseNumber}</TableCell>
                          <TableCell>
                            {route.plate || route.carrierPlateNumber}
                          </TableCell>
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
                              : route.totalGrossWeight
                              ? Number.parseFloat(
                                  route.totalGrossWeight,
                                ).toFixed(3)
                              : 0}
                          </TableCell>
                          <TableCell>
                            {route.numberPackages || route.numberOfPackages}
                          </TableCell>
                          <TableCell align='center'>
                            {route.transferStartDate}
                          </TableCell>
                          <TableCell align='center'>
                            {showIconStatus(route.generateReferralGuide, route)}
                          </TableCell>
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
                                                {product.product}
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
        {console.log('Lista de rutas', routes)}
        {routes &&
          routes.map((route, index) => {
            return (
              <DeliveryCard
                key={index}
                order={index}
                execFunctions={execAll}
                newValuesData={setRouteIndex}
                initialValues={route}
                useReferralGuide={true}
              />
            );
          })}
      </Box> */}

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

      <ClickAwayListener onClickAway={handleClickAway}>
        <Dialog
          open={openStatus}
          onClose={sendStatus}
          sx={{textAlign: 'center'}}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
          disableEscapeKeyDown
        >
          <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
            {<IntlMessages id='message.register.newDistribution' />}
          </DialogTitle>
          {showMessage()}
          <DialogActions sx={{justifyContent: 'center'}}>
            <Button variant='outlined' onClick={sendStatus}>
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      </ClickAwayListener>

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

            <EditDistributionDeliveryModal
              selectedDeliveryState={selectedDeliveryState}
              editFunction={updateDelivery2}
            />
          </Box>
        </Fade>
      </Modal>
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
