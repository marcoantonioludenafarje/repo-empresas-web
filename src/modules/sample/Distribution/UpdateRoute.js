import React, {useEffect} from 'react';
import {
  Card,
  Table,
  TableCell,
  TableRow,
  Box,
  TableHead,
  Button,
  Dialog,
  Menu,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Select,
  Collapse,
  Typography,
  TableBody,
  Divider,
  Fade,
  InputLabel,
  useTheme,
  Paper,
  Grid,
  Stack,
  Modal,
  MenuItem,
  TextField,
  FormControl,
  IconButton,
  ButtonGroup,
  TableContainer,
  useMediaQuery,
} from '@mui/material';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppPageMeta from '../../../@crema/core/AppPageMeta';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import Router, {useRouter} from 'next/router';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DeliveryCard from './DeliveryCard';
import AppInfoView from '../../../@crema/core/AppInfoView';
import {useDispatch, useSelector} from 'react-redux';
import {ClickAwayListener} from '@mui/base';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import {updatePredefinedRoute,getPredefinedRoute_____PageListPredefinedRoutes,getChildRoutes} from '../../../redux/actions/Movements';
import {onGetProducts} from '../../../redux/actions/Products';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import EditRouteDeliveryModal from './editRouteDeliveryModal';
import ModificRouteDeliveryModal from './modificRouteDeliveryModal';
import {getCarriers} from '../../../redux/actions/Carriers';
import CloseIcon from '@mui/icons-material/Close';
import CachedIcon from '@mui/icons-material/Cached';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import {red} from '@mui/material/colors';
import {completeWithZeros} from '../../../Utils/utils';
import {makeStyles} from '@mui/styles';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_PRODUCTS,
  GET_CARRIERS,
  LIST_ROUTE,
  GENERATE_ROUTE,
  SET_DELIVERIES_IN_ROUTE_PREDEFINED_____PAGE_LIST_PREDEFINED_ROUTES,
} from '../../../shared/constants/ActionTypes';


let getChildRoutesPayload = {
  request: {
    payload: {
      deliveryFatherId: '',
    },
  },
};
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stack: {
    justifyContent: 'center',
    marginBottom: '10px',
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
let selectedRoute = '';
let selectedDelivery = {};
let selectedSummaryRow = {};
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
    totalGrossWeight: 0,
    numberOfPackages: 'Vacío',
    totalWeight: 0,
    products: [],
  };
  const dispatch = useDispatch();
  const [routesReady, setRoutesReady] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const classes = useStyles(props);
  const theme = useTheme();
  const [execAll, setExecAll] = React.useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openStatus, setOpenStatus] = React.useState(false);
  const [openProducts, setOpenProducts] = React.useState(false);
  let changeValueField;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const {query} = router;
  console.log('query', query);
  const [openDelivery, setOpenDelivery] = React.useState(false);
  const {listProducts} = useSelector(({products}) => products);
  console.log('products', listProducts);
  const {userAttributes} = useSelector(({user}) => user);
  console.log('userAttributes', userAttributes);
  const {userDataRes} = useSelector(({user}) => user);
  console.log('userDataRes', userDataRes);
  const {updateRouteRes} = useSelector(({movements}) => movements);
  console.log('updateRouteRes', updateRouteRes);
  const {listRoute} = useSelector(({movements}) => movements);
  console.log('listRoute', listRoute);
  const {successMessage} = useSelector(({movements}) => movements);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({movements}) => movements);
  console.log('errorMessage', errorMessage);
  const {jwtToken} = useSelector(({general}) => general);
  const {deliveries} = useSelector(({movements}) => movements);
  const {
    predefinedRoutes_PageListPredefinedRoutes,
    selectedRoute_PageListPredefinedRoutes
  } = useSelector(({movements}) => movements);
  console.log("Este es el predefinedRoutes del comienzo",predefinedRoutes_PageListPredefinedRoutes);
  console.log("Este es el selectedRoutes",selectedRoute_PageListPredefinedRoutes)
  const [routes, setRoutes] = React.useState([]);
  
  
  
  const [summaryType, setSummaryType] = React.useState('driver');
  const [nombreAgrupador, setNombreAgrupador] = React.useState('');
  const [valueObservationInput,setValueObservationInput]=React.useState('');
  const [routesSummary, setRoutesSummary] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openSummary, setOpenSummary] = React.useState(false);
  const [summaryRowNumber, setSummaryRowNumber] = React.useState(0);
  const [cantidadAgrupacion, setCantidadAgrupacion] = React.useState('');
  const [openSummaryProducts, setOpenSummaryProducts] = React.useState(false);
  const [productsSummary, setProductsSummary] = React.useState([]);
  const openMenu = Boolean(anchorEl);
  const [openSummaryPoints, setOpenSummaryPoints] = React.useState(false);
  const [selectedDeliveryState, setSelectedDeliveryState] = React.useState({});
  const [rowNumber2, setRowNumber2] = React.useState(0);
  const [open2, setOpen2] = React.useState(false);
  console.log("Este es el routes variable guardar",routes);
  listPayload.request.payload.merchantId =
  userDataRes.merchantSelected.merchantId;
console.log('Ver en donde esta el error',listPayload);
  const toGetCarriers = (payload, token) => {
    dispatch(getCarriers(payload, token));
  };
  const updateRoute = (payload) => {
    dispatch(updatePredefinedRoute(payload));
  };
  const getProducts = (payload) => {
    dispatch(onGetProducts(payload));
  };

  const toGetPredefinedRoute = (payload) => {
    dispatch(getPredefinedRoute_____PageListPredefinedRoutes(payload));
  };

  const sendStatus2 = () => {
    if (openDelivery) {
      setOpenDelivery(false);
    } else {
      setOpenDelivery(true);
    }
  };

  function swapRowsUp() {
    let newRoutes = routes;
    const temp = newRoutes[rowNumber2];
    newRoutes[rowNumber2] = newRoutes[rowNumber2 - 1];
    newRoutes[rowNumber2 - 1] = temp;
    setRoutes(newRoutes);
    reloadPage();
  }
 
  const handleSearchValues = (event) => {
    if (event.target.name == 'codeToSearch') {
      if (event.target.value == '') {
        setValueObservationInput(null);
        setRoutes(selectedRoute_PageListPredefinedRoutes.deliveries);
      } else {
        event.target.value = event.target.value.toLowerCase();
        setValueObservationInput(event.target.value);
      }
    }
  };

  const searchValuesInForm=()=>{
      if (valueObservationInput == null) {
        console.log("Aqui estan todas las rutas",selectedRoute_PageListPredefinedRoutes);
        setRoutes(selectedRoute_PageListPredefinedRoutes.deliveries);
      } else {
        console.log("Aqui estan todas las rutas",selectedRoute_PageListPredefinedRoutes);
        let newRoutes=[];
        console.log("Buscando Observacion que contengan",valueObservationInput);
        console.log("Este es el selectedRoute predefinido del search",selectedRoute_PageListPredefinedRoutes.deliveries)
        for(let delivery of selectedRoute_PageListPredefinedRoutes.deliveries){
          if(delivery.observationDelivery?.toLowerCase().includes(valueObservationInput)){
            newRoutes.push(delivery);
          }
        }
        let {deliveries,...otherFields}=selectedRoute_PageListPredefinedRoutes;
        let newData={
          ...otherFields,
          deliveries:newRoutes
        }
        setRoutes(newRoutes);
      }
  }


  const checkSummaryProducts = (row, index) => {
    selectedSummaryRow = row;
    console.log('selectedSummaryRow', selectedSummaryRow);
    setOpenSummaryProducts(false);
    setOpenSummaryProducts(true);
    if (openSummaryProducts == true && summaryRowNumber == index) {
      setOpenSummaryProducts(false);
    }
    setSummaryRowNumber(index);
  };

  const handleClick = (route, event) => {
    setAnchorEl(event.currentTarget);
    setRowNumber2(route.localRouteId);
    selectedRoute = route;
    setSelectedDeliveryState(selectedRoute);
    console.log('selectedRoute', selectedRoute);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

console.log("Fase previa al abismo");
useEffect(() => {
  dispatch({type: FETCH_SUCCESS, payload: undefined});
  dispatch({type: FETCH_ERROR, payload: undefined});
  dispatch({type: GET_PRODUCTS, payload: undefined});
  console.log("Todo apunta a que el error es despues de esta linea");
  dispatch({type: GET_CARRIERS, payload: undefined});
  dispatch({type: LIST_ROUTE, payload: undefined});
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
  console.log('Esto se ejcuta??, is very important xd')
  toGetCarriers(listCarriersPayload, jwtToken);
  toGetPredefinedRoute({
    routePredefinedId: query.routeId,
    merchantId: userDataRes.merchantSelected.merchantId,
  });
}, [predefinedRoutes_PageListPredefinedRoutes]);



useEffect(() => {
  if (selectedRoute_PageListPredefinedRoutes && selectedRoute_PageListPredefinedRoutes.deliveries && selectedRoute_PageListPredefinedRoutes.deliveries.length > 0) {
    console.log("Este es el listRoute", predefinedRoutes_PageListPredefinedRoutes);
    console.log("Verificar el id del route", query.routeId);

    console.log('selectedRoute', selectedRoute);
    console.log("Verificando servicio child deliveries Routes", selectedRoute_PageListPredefinedRoutes);
    if(selectedRoute_PageListPredefinedRoutes.routePredefinedId==query.routeId){
      setRoutes(selectedRoute_PageListPredefinedRoutes.deliveries);
      changeValueField('routeName', selectedRoute_PageListPredefinedRoutes.routeName);
      setRoutesReady(true);
    }
  }
}, [selectedRoute_PageListPredefinedRoutes]);


  const handleClose = () => {
    console.log('se está ejecutando?');
    setOpenDelivery(false);
    console.log('openDelivery', openDelivery);
  };

  const setRouteIndex = (index, obj) => {
    let changedRoutes = routes;
    changedRoutes[index] = obj;
    setRoutes(changedRoutes);
    console.log('changedRoutes', changedRoutes);
    console.log('routes', routes);
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

  const cancel = () => {
    setOpen2(true);
  };

  


  const updateDelivery2 = (newDelivery) => {
    handleClose();
    console.log('newDelivery', newDelivery);
    console.log("Este es el selectedDelivery",selectedDeliveryState["ORDEN ENTREGA"]);
    console.log("Este es el selectedRouted junto al delivery",routes)
    const updatedDeliveries = routes.map((route) => {
      if (route['ORDEN ENTREGA'] === selectedDeliveryState['ORDEN ENTREGA']) {
        return {
          ...newDelivery,
        };
      }
      return route;
    });
    routes=updatedDeliveries;
    setRoutes(updatedDeliveries);
  };

  function swapRowsDown() {
    let newRoutes = routes;
    const temp = newRoutes[rowNumber2];
    newRoutes[rowNumber2] = newRoutes[rowNumber2 + 1];
    newRoutes[rowNumber2 + 1] = temp;
    routes=newRoutes;
    setRoutes(newRoutes);
    reloadPage();
  }
  const deleteRoute = () => {
    let newRoutes = routes.filter((item, index) => index !== rowNumber2);
    routes=newRoutes;
    setRoutes(newRoutes);
    reloadPage();
  };

  const checkSummaryPoints = (row, index) => {
    selectedSummaryRow = row;
    console.log('selectedSummaryRow', selectedSummaryRow);
    setOpenSummaryPoints(false);
    setOpenSummaryPoints(true);
    if (openSummaryPoints == true && summaryRowNumber == index) {
      setOpenSummaryPoints(false);
    }
    setSummaryRowNumber(index);
  };

  const validationSchema = yup.object({
    routeName: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />)
      .required(<IntlMessages id='validation.required' />),
  });
  const defaultValues = {
    routeName: '',
  };
  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    setExecAll(true);
    setExecAll(false);
    console.log('data final', {...data, routes: routes});
    const finalPayload = {
      request: {
        payload: {
          userActor: userAttributes['sub'],
          routePredefinedId: query.routeId,
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
                startingPointUbigeo: completeWithZeros(
                  obj.startingPointUbigeo,
                  6,
                ),
                arrivalPointAddress: obj.arrivalAddress,
                arrivalPointUbigeo: completeWithZeros(
                  obj.arrivalPointUbigeo,
                  6,
                ),
                driverDenomination: obj.driverName,
                driverLastName: obj.driverLastName,
                driverLicenseNumber: obj.driverLicenseNumber,
                driverDocumentType: obj.driverDocumentType,
                driverDocumentNumber: obj.driverDocumentNumber,
                driverId: '',
                carrierPlateNumber: obj.plate,
                productsInfo: obj.products.map((prod) => {
                  return {
                    productId: prod.productId,
                    product: prod.product,
                    description: prod.description,
                    unitMeasure: prod.unitMeasure,
                    quantityMovement: prod.count,
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
    //dispatch({type: FETCH_SUCCESS, payload: undefined});
    //dispatch({type: FETCH_ERROR, payload: undefined});
   //dispatch({type: GENERATE_ROUTE, payload: undefined});
    updateRoute(finalPayload);
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
      updateRouteRes != undefined &&
      !('error' in updateRouteRes)
    );
  };
  const registerError = () => {
    return (successMessage != undefined && updateRouteRes) || errorMessage;
  };
  const sendStatus = () => {
    if (registerSuccess()) {
      Router.push('/sample/distribution/table');
      setOpenStatus(false);
    } else if (registerError()) {
      setOpenStatus(false);
    } else {
      setOpenStatus(false);
    }
  };

  const handleClickAway = () => {
    // Evita que se cierre el diálogo haciendo clic fuera del contenido
    // Puedes agregar condiciones adicionales aquí si deseas una lógica más específica.
  };

  const acumularProductos = (entregas) => {
    const acumulador = {};
    console.log("Estas son las entregas",entregas);
    entregas.forEach((entrega) => {
      entrega.productsInfo.forEach((producto) => {
        const productoKey = producto.product;

        if (!acumulador[productoKey]) {
          acumulador[productoKey] = {
            product: producto.product,
            count: producto.count,
            description: producto.description,
            weight: producto.weight,
            unitMeasure: producto.unitMeasure,
          };
        } else {
          acumulador[productoKey].count += producto.count;
        }
      });
    });

    return Object.values(acumulador);
  };


  const acumularProductosPorConductor = (entregas) => {
    const acumulador = {};
    console.log("Estas son las entregas",entregas);
    entregas.forEach((entrega) => {
      const conductorKey = `${entrega.driverDocumentType}_${entrega.driverDocumentNumber}`;

      if (!acumulador[conductorKey]) {
        acumulador[conductorKey] = {
          driverDocumentType: entrega.driverDocumentType,
          driverDocumentNumber: entrega.driverDocumentNumber,
          driverName: entrega.driverDenomination,
          driverLastName: entrega.driverLastName,
          plate: entrega.carrierPlateNumber,
          points: [
            {
              arrivalPointUbigeo: entrega.arrivalPointUbigeo,
              arrivalAddress: entrega.arrivalPointAddress,
              arrivalInternalCode: entrega.arrivalInternalCode,
              startingInternalCode: entrega.startingInternalCode,
              startingAddress: entrega.startingPointAddress,
              startingPointUbigeo: entrega.startingPointUbigeo,
            },
          ],
          products: [],
        };
      }

      entrega.productsInfo.forEach((producto) => {
        const conductorProducto = acumulador[conductorKey].products.find(
          (item) => item.product === producto.product,
        );

        if (conductorProducto) {
          conductorProducto.count += producto.count;
        } else {
          acumulador[conductorKey].products.push({
            product: producto.product,
            count: producto.count,
            description: producto.description,
            weight: producto.weight,
            unitMeasure: producto.unitMeasure,
          });
        }
      });

      const conductorPuntos = acumulador[conductorKey].points.find(
        (item) =>
          item.arrivalInternalCode === entrega.arrivalInternalCode &&
          item.startingInternalCode === entrega.startingInternalCode,
      );

      if (!conductorPuntos) {
        acumulador[conductorKey].points.push({
          arrivalPointUbigeo: entrega.arrivalPointUbigeo,
          arrivalAddress: entrega.arrivalPonitAddress,
          arrivalInternalCode: entrega.arrivalInternalCode,
          startingInternalCode: entrega.startingInternalCode,
          startingAddress: entrega.startingPointAddress,
          startingPointUbigeo: entrega.startingPointUbigeo,
        });
      }
    });

    return Object.values(acumulador);
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
              <IntlMessages id='message.update.data.success' />
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
              <IntlMessages id='message.update.data.error' />
              <br />
              {updateRouteRes && 'error' in updateRouteRes
                ? updateRouteRes.error
                : null}
            </DialogContentText>
          </DialogContent>
        </>
      );
    } else {
      return <CircularProgress disableShrink sx={{mx: 'auto', my: '20px'}} />;
    }
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
          <IntlMessages id='sidebar.sample.update.predefinedRoutes' />
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
            changeValueField = setFieldValue;
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
        sx={{m: 2}}
        direction={isMobile ? 'column' : 'row'}
        spacing={2}
        className={classes.stack}
      >
        <TextField
          label='Observación'
          variant='outlined'
          name='codeToSearch'
          size='small'
          onChange={handleSearchValues}
        />
        <Button
          startIcon={<ManageSearchOutlinedIcon />}
          variant='contained'
          color='primary'
          onClick={searchValuesInForm}
        >
          Buscar
        </Button>
      </Stack>

          
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
              {routes && Array.isArray(routes) && routes.length > 0
                ? routes.map((route, index2) => {
                    const products = route.productsInfo;
                    console.log('routes de newRoute', routes);
                    return (
                      <>
                        <TableRow key={index2}>
                          <TableCell>{index2 + 1}</TableCell>
                          <TableCell>{route.startingPointAddress}</TableCell>
                          <TableCell>{route.startingPointUbigeo}</TableCell>
                          <TableCell>{route.startingInternalCode}</TableCell>
                          <TableCell>{route.arrivalPointAddress}</TableCell>
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
                          <TableCell>{route.driverDenomination}</TableCell>
                          <TableCell>{route.driverLastName}</TableCell>
                          <TableCell>{route.driverLicenseNumber}</TableCell>
                          <TableCell>{route.carrierPlateNumber}</TableCell>
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
                            {route.totalGrossWeight
                              ? Number.parseFloat(route.totalGrossWeight).toFixed(3)
                              : 0}
                          </TableCell>
                          <TableCell>{route.numberOfPackages}</TableCell>
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
      
        <Stack
        sx={{m: 2, justifyContent: 'center', marginBottom: '10px'}}
        direction={isSmallScreen ? 'column' : 'row'}
        spacing={2}
      >
        <Button
          color='secondary'
          variant='outlined'
          onClick={() => {
            const productosPorConductor = acumularProductosPorConductor(routes);
            const productosResumen = acumularProductos(routes);
            console.log('routesSummary', productosPorConductor);
            console.log('productsSummary', productosResumen);
            setRoutesSummary(productosPorConductor);
            setProductsSummary(productosResumen);
            setOpenSummary(true);
          }}
        >
          Ver Resumen
        </Button>
      </Stack>
      
      
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
      
      <Dialog
        open={openSummary}
        onClose={() => setOpenSummary(false)}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle
          sx={{
            fontSize: '1.5em',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack
            sx={{m: 2, justifyContent: 'center', marginBottom: '10px'}}
            direction={isSmallScreen ? 'column' : 'row'}
            spacing={2}
          >
            <FormControl sx={{my: 0, mx: 'auto', width: 160}}>
              <InputLabel id='summary-label' style={{fontWeight: 200}}>
                Tipo Resumen
              </InputLabel>
              <Select
                name='summary'
                labelId='summary-label'
                label='Tipo Resumen'
                onChange={(event) => {
                  console.log(event.target.value);
                  setSummaryType(event.target.value);
                }}
                value={summaryType}
              >
                <MenuItem value='driver' style={{fontWeight: 200}}>
                  Chofer
                </MenuItem>
                <MenuItem value='all' style={{fontWeight: 200}}>
                  Todo
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              label='Nombre de Agrupador'
              value={nombreAgrupador}
              onChange={(e) => setNombreAgrupador(e.target.value)}
              variant='outlined'
            />
            <TextField
              label='Cantidad de Agrupación'
              value={cantidadAgrupacion}
              onChange={(e) => setCantidadAgrupacion(e.target.value)}
              variant='outlined'
            />
          </Stack>

          <IconButton
            edge='end'
            onClick={() => setOpenSummary(false)}
            aria-label='close'
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        {summaryType == 'driver' ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Chofer</TableCell>
                <TableCell>Placa</TableCell>
                <TableCell>Productos</TableCell>
                <TableCell>Puntos de Partida - Llegada</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {routesSummary.map((fila, indexSummary) => {
                const summaryProducts = fila.products;
                const summaryPoints = fila.points;
                return (
                  <>
                    <TableRow key={indexSummary}>
                      <TableCell>
                        {fila.driverName + ' ' + fila.driverLastName}
                      </TableCell>
                      <TableCell>{fila.plate}</TableCell>
                      <TableCell>
                        {fila.products && fila.products.length !== 0 ? (
                          <IconButton
                            onClick={() =>
                              checkSummaryProducts(fila, indexSummary)
                            }
                            size='small'
                          >
                            <FormatListBulletedIcon fontSize='small' />
                          </IconButton>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => checkSummaryPoints(fila, indexSummary)}
                          size='small'
                        >
                          <FormatListBulletedIcon fontSize='small' />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow key={`sub-${indexSummary}`}>
                      <TableCell sx={{p: 0}} colSpan={10}>
                        <Collapse
                          in={
                            openSummaryProducts &&
                            indexSummary === summaryRowNumber
                          }
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
                                {summaryProducts && summaryProducts.length !== 0
                                  ? summaryProducts.map(
                                      (product, indexSummaryProducts) => {
                                        return (
                                          <TableRow
                                            key={`${indexSummaryProducts}-${indexSummaryProducts}`}
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
                                      },
                                    )
                                  : null}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                    <TableRow key={`sub-${indexSummary}-2`}>
                      <TableCell sx={{p: 0}} colSpan={10}>
                        <Collapse
                          in={
                            openSummaryPoints &&
                            indexSummary === summaryRowNumber
                          }
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
                                  <TableCell>Punto Partida</TableCell>
                                  <TableCell>Direccion Partida</TableCell>
                                  <TableCell>Punto Llegada</TableCell>
                                  <TableCell>Direccion Llegada</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {summaryPoints && summaryPoints.length !== 0
                                  ? summaryPoints.map(
                                      (point, indexSummaryPoints) => {
                                        return (
                                          <TableRow
                                            key={`${indexSummaryPoints}-${indexSummaryPoints}`}
                                          >
                                            <TableCell>
                                              {point.startingInternalCode}
                                            </TableCell>
                                            <TableCell>
                                              {point.startingAddress}
                                            </TableCell>
                                            <TableCell>
                                              {point.arrivalInternalCode}
                                            </TableCell>
                                            <TableCell>
                                              {point.arrivalAddress}
                                            </TableCell>
                                          </TableRow>
                                        );
                                      },
                                    )
                                  : null}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
            </TableBody>
          </Table>
        ) : null}
        {summaryType == 'all' ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Descripcion</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Peso</TableCell>
                <TableCell>Peso Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productsSummary.map((fila, indexSummary) => {
                return (
                  <>
                    <TableRow key={indexSummary}>
                      <TableCell>{fila.product}</TableCell>
                      <TableCell>{fila.description}</TableCell>
                      <TableCell>{fila.count}</TableCell>
                      <TableCell>{fila.weight}</TableCell>
                      <TableCell>{fila.count * fila.weight}</TableCell>
                    </TableRow>
                  </>
                );
              })}
            </TableBody>
          </Table>
        ) : null}
      </Dialog>
      
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={openDelivery}
        onClose={handleClose}
        closeAfterTransition
        className={classes.modal}
      >
        <Fade in={openDelivery}>
          <Box className={classes.paper}>
            <Typography id='transition-modal-title' variant='h2' component='h2'>
              Editar Entrega
            </Typography>

            <ModificRouteDeliveryModal
              selectedDeliveryState={selectedDeliveryState}
              editFunction={updateDelivery2}
            />
          </Box>
        </Fade>
      </Modal>
      
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
            {<IntlMessages id='message.register.newRoute' />}
          </DialogTitle>
          {showMessage()}
          <DialogActions sx={{justifyContent: 'center'}}>
            <Button variant='outlined' onClick={sendStatus}>
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      </ClickAwayListener>

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

    </Card>
  );
};

export default Distribution;
