import React, {useEffect} from 'react';
import * as yup from 'yup';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  Box,
  IconButton,
  CircularProgress,
  Collapse,
  Button,
  ButtonGroup,
  MenuItem,
  Menu,
  Stack,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  TextField,
  useMediaQuery,
} from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import {makeStyles} from '@mui/styles';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CachedIcon from '@mui/icons-material/Cached';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  LIST_ROUTE,
  SET_DELIVERIES_SIMPLE,
  SET_DELIVERIES_IN_ROUTE_PREDEFINED_____PAGE_LIST_PREDEFINED_ROUTES,
} from '../../../shared/constants/ActionTypes';
import Router, {useRouter} from 'next/router';
import {
  getChildRoutes,
  listNewRoutes,
  listPredefinedRoutes_____PageListPredefinedRoutes,
  getPredefinedRoute_____PageListPredefinedRoutes,
  deletePredefinedRoute
} from '../../../redux/actions/Movements';
import {useDispatch, useSelector} from 'react-redux';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import {getYear, justDate, justTime} from '../../../Utils/utils';
import AppLoader from '@crema/core/AppLoader';
import {red} from '@mui/material/colors';
// let listRoutesPayload = {
//   request: {
//     payload: {
//       merchantId: '',
//     },
//   },
// };

let getChildRoutesPayload = {
  request: {
    payload: {
      deliveryFatherId: '',
    },
  },
};

let codFinanceSelected = '';
let selectedRoute = '';
let selectedDelivery = {};

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
  fixPosition: {
    position: 'relative',
    bottom: '-8px',
  },
  searchIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonAddProduct: {},
  closeButton: {
    cursor: 'pointer',
    float: 'right',
    marginTop: '5px',
    width: '20px',
  },
  detailRoutes:{
    maxWidth:'90vw'
  },
  stack: {
    justifyContent: 'center',
    marginBottom: '10px',
  }
}));

const useStylesByDialog=makeStyles((theme)=>({
  div:{
    maxWidth:'90vw'
  }
}));

let deletePayload = {
  request: {
    payload: {
      routePredefinedId: '',
    },
  },
};
const PredefinedRoutes = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open2, setOpen2] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [resultState, setResultState] = React.useState(false);
  const [openRoutes, setOpenRoutes] = React.useState(false);
  const [openProducts, setOpenProducts] = React.useState(false);
  const [rowNumber, setRowNumber] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [rowNumber2, setRowNumber2] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const openMenu = Boolean(anchorEl);
  const dispatch = useDispatch();
  const [reload, setReload] = React.useState(true);
  const router = useRouter();
  const {query} = router;
  console.log('query', query);
  
  const {
    predefinedRoutes_PageListPredefinedRoutes,
    lastEvaluatedKeys_PageListPredefinedRoutes,
    selectedRoute_PageListPredefinedRoutes,
  } = useSelector(({movements}) => movements);
  // console.log('listRoute', listRoute);
  const [listRouteBySelectedRoutes,setListRouteBySelectedRoutes]=React.useState(selectedRoute_PageListPredefinedRoutes);
  console.log("Este es el listado que se renderiza RoutesPredefined",predefinedRoutes_PageListPredefinedRoutes);
  console.log("Este es el selectedRouted",selectedRoute_PageListPredefinedRoutes)
  console.log("Este es el listROutes",listRouteBySelectedRoutes)
  const {deliveries} = useSelector(({movements}) => movements);
  const [valueObservationInput,setValueObservationInput]=React.useState('');
  const {successMessage} = useSelector(({movements}) => movements);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({movements}) => movements);
  console.log('errorMessage', errorMessage);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  // listRoutesPayload.request.payload.merchantId =
  //   userDataRes.merchantSelected.merchantId;
  useEffect(()=>{
    console.log("Alterando el valor de nuestro arreglo de puntos de rutas....");
    setListRouteBySelectedRoutes(selectedRoute_PageListPredefinedRoutes);
  },[selectedRoute_PageListPredefinedRoutes])
  const [page, setPage] = React.useState(1);
 
  const deleteRoutePredefined = (payload) => {
    dispatch(deletePredefinedRoute(payload));
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const reloadPage = () => {
    setReload(!reload);
  };
  //APIS
  const toListRoutes = (payload) => {
    dispatch(listPredefinedRoutes_____PageListPredefinedRoutes(payload));
  };

  const toGetChildRoutes = (payload) => {
    dispatch(getChildRoutes(payload));
  };

  const toGetPredefinedRoute = (payload) => {
    dispatch(getPredefinedRoute_____PageListPredefinedRoutes(payload));
  };

  const handleNextPage = (event) => {
    console.log('Llamando al  handleNextPage', handleNextPage);
    // listRoutesPayload.request.payload.LastEvaluatedKey = LastEvaluatedKey;
    let payload = {
      merchantId: userDataRes.merchantSelected.merchantId,
      LastEvaluatedKey: lastEvaluatedKeys_PageListPredefinedRoutes,
    };
    dispatch(listPredefinedRoutes_____PageListPredefinedRoutes(payload));
    // setPage(page+1);
  };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [predefinedRoutes_PageListPredefinedRoutes]);

  useEffect(() => {
    console.log('El deliveries 111', deliveries);
    if (deliveries && deliveries.length > 0) {
      console.log('El deliveries', deliveries);
      setOpenRoutes(true);
    }
  }, [deliveries]);

  useEffect(() => {
    console.log('Reseteando todo');
    if (userDataRes && userDataRes.merchantSelected) {
      let payload = {
        merchantId: userDataRes.merchantSelected.merchantId,
        LastEvaluatedKey: lastEvaluatedKeys_PageListPredefinedRoutes,
      };
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      dispatch({type: LIST_ROUTE, payload: undefined});
      toListRoutes(payload);
    }
  }, []);


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
            Se ha eliminado correctamente
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
            Se ha producido un error al eliminar.
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink />;
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

  const checkRoutes = (input, index) => {
    selectedRoute = input;
    console.log('selectedRoute', selectedRoute);
    setOpenRoutes(false);
    setRowNumber(index);
    // if (openRoutes == true && rowNumber == index) {
    //   setOpenRoutes(false);
    // }
    if (
      selectedRoute.deliveries.length == 0 &&
      selectedRoute.routesChildId &&
      selectedRoute.routesChildId.length > 0
    ) {
      console.log('Se va a traer todos los selectedRoutes');
      getChildRoutesPayload.request.payload.deliveryFatherId =
        selectedRoute.routePredefinedId;

      toGetChildRoutes(getChildRoutesPayload);
    } else {
      dispatch({
        type: SET_DELIVERIES_SIMPLE,
        payload: obj.deliveries,
      });

      // setOpenRoutes(true);
    }
  };


  const handleSearchValues = (event) => {
    if (event.target.name == 'codeToSearch') {
      if (event.target.value == '') {
        setValueObservationInput(null);
        setListRouteBySelectedRoutes(selectedRoute_PageListPredefinedRoutes);
      } else {
        event.target.value = event.target.value.toLowerCase();
        setValueObservationInput(event.target.value);
      }
    }
  };

  const searchValuesInForm=()=>{
      if (valueObservationInput == null) {
        console.log("Aqui estan todas las rutas",selectedRoute_PageListPredefinedRoutes);
        setListRouteBySelectedRoutes(selectedRoute_PageListPredefinedRoutes);
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
        setListRouteBySelectedRoutes(newData);
      }
  }

  const sendStatus = () => {
    setOpenStatus(false);
      console.log('Reseteando todo');
    if (userDataRes && userDataRes.merchantSelected) {
      let payload = {
        merchantId: userDataRes.merchantSelected.merchantId,
        LastEvaluatedKey: lastEvaluatedKeys_PageListPredefinedRoutes,
      };

      toListRoutes(payload);
    }

  };

  const confirmDelete = () => {
    console.log('selected Route Predefined', selectedRoute);
    console.log('id de selected', selectedRoute.routePredefinedId);
    deletePayload.request.payload.routePredefinedId = selectedRoute.routePredefinedId;
    console.log('deletePayload', deletePayload);
    deleteRoutePredefined(deletePayload);
    setOpen2(false);
    setOpenStatus(true);
    let payload = {
      merchantId: userDataRes.merchantSelected.merchantId,
      LastEvaluatedKey: lastEvaluatedKeys_PageListPredefinedRoutes,
    };
    dispatch(listPredefinedRoutes_____PageListPredefinedRoutes(payload));
    //reloadPage();
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

  const newRoute = () => {
    Router.push('/sample/distribution/create-routes');
  };

  const downloadOriginalFile = (path, merchant) => {
    console.log('Descargar original');
    window.open(
      `https://d2moc5ro519bc0.cloudfront.net/merchant/${merchant}/${path}`,
    );
  };

  const downloadTranslatedFile = () => {
    console.log('Descargar archivo traducido');
  };

  const goToUpdate = () => {
    console.log('En mantenimiento');
    Router.push({
      pathname: '/sample/distribution/update-routes',
      query: {routeId: selectedRoute.routePredefinedId},
    });
  };

  const findRoute = (routeId) => {
    return predefinedRoutes_PageListPredefinedRoutes.find(
      (obj) => obj.routePredefinedId == routeId,
    );
  };

  const setDeleteState = () => {
    setOpen2(true);
    handleClose();
  };

  const handleClick = (routeId, event) => {
    console.log('event.currentTarget', event.currentTarget);
    console.log('event', event);
    setAnchorEl(event.currentTarget);
    selectedRoute = findRoute(routeId);
    console.log('selectedfindRoute', selectedRoute);
  };

  const [open, setOpen] = React.useState(false);
  const [typeDialog, setTypeDialog] = React.useState('');
  const [showAlert, setShowAlert] = React.useState(false);
  const classes = useStyles();
  const classesDialog=useStylesByDialog();
  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = (type) => {
    console.log('Veamos el total', selectedRoute);
    console.log('El type', type);
    let routePredefinedId = selectedRoute.routePredefinedId;
    console.log('EY que tal', userDataRes.merchantSelected.merchantId);
    dispatch({
      type: SET_DELIVERIES_IN_ROUTE_PREDEFINED_____PAGE_LIST_PREDEFINED_ROUTES,
      payload: null,
    });

    toGetPredefinedRoute({
      routePredefinedId,
      merchantId: userDataRes.merchantSelected.merchantId,
    });

    console.log("Verificando servicio child deliveries Routes",selectedRoute_PageListPredefinedRoutes);
    setOpen(true);
    // toGetPredefinedRoute()
    setTypeDialog(type);
    // setShowAlert(false);
  };

  return (
    <>
      {loading ? (
        <AppLoader />
      ) : (
        <Card sx={{p: 4}}>
          <TableContainer component={Paper} sx={{maxHeight: 440}}>
            <Table stickyHeader size='small' sx={{ maxWidth: '90vw' }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha de creación</TableCell>
                  <TableCell>Nombre de ruta</TableCell>
                  <TableCell>Cantidad puntos de entrega</TableCell>
                  {/* <TableCell>Entregas</TableCell> */}
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {predefinedRoutes_PageListPredefinedRoutes &&
                Array.isArray(predefinedRoutes_PageListPredefinedRoutes) ? (
                  predefinedRoutes_PageListPredefinedRoutes
                    .sort(compare)
                    .map((obj, index) => {
                      const routes = obj.deliveries;
                      return (
                        <>
                          <TableRow
                            sx={{
                              '&:last-child td, &:last-child th': {border: 0},
                            }}
                            key={`route${index}`}
                          >
                            <TableCell>{`${justDate(obj.createdAt)} ${justTime(
                              obj.createdAt,
                            )}`}</TableCell>
                            <TableCell>{obj.routeName}</TableCell>
                            <TableCell>
                              {obj.routesChildId && obj.routesChildId.length > 0
                                ? obj.cantDeliveries
                                : routes.length}
                            </TableCell>
                            {/* <TableCell>

                          <IconButton
                            onClick={() => checkRoutes(obj, index)}
                            size='small'
                          >
                            <FormatListBulletedIcon fontSize='small' />
                          </IconButton>
                 
                      </TableCell> */}
                            <TableCell>
                              <Button
                                id='basic-button'
                                aria-controls={
                                  openMenu ? 'basic-menu' : undefined
                                }
                                aria-haspopup='true'
                                aria-expanded={openMenu ? 'true' : undefined}
                                onClick={handleClick.bind(
                                  this,
                                  obj.routePredefinedId,
                                )}
                              >
                                <KeyboardArrowDownIcon />
                              </Button>
                            </TableCell>
                          </TableRow>
                        </>
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

            {lastEvaluatedKeys_PageListPredefinedRoutes ? (
              <Stack spacing={2}>
                <IconButton onClick={() => handleNextPage()} size='small'>
                  <ArrowForwardIosIcon fontSize='inherit' />
                </IconButton>
              </Stack>
            ) : null}
          </TableContainer>

          <ButtonGroup
            variant='outlined'
            aria-label='outlined button group'
            sx={{mt: 4}}
          >
            <Button
              variant='outlined'
              startIcon={<AddCircleOutlineOutlinedIcon />}
              onClick={newRoute}
            >
              <IntlMessages id='common.new2' />
            </Button>
          </ButtonGroup>
        
          <Dialog
        open={openStatus}
        onClose={sendStatus}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Eliminar ruta'}
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
        open={open2}
        onClose={handleClose2}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Eliminar Especialista'}
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
          <Button variant='outlined' onClick={confirmDelete}>
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
            <MenuItem onClick={handleClickOpen.bind(this, 'detailRoute')}>
              <CachedIcon sx={{mr: 1, my: 'auto'}} />
              Ver detalle
            </MenuItem>

            <MenuItem onClick={goToUpdate}>
              <CachedIcon sx={{mr: 1, my: 'auto'}} />
              Actualizar en mantenimiento
            </MenuItem>
            <MenuItem
              disabled={!selectedRoute.originalExcel}
              onClick={() =>
                downloadOriginalFile(
                  selectedRoute.originalExcel,
                  selectedRoute.merchantId,
                )
              }
            >
              <CachedIcon sx={{mr: 1, my: 'auto'}} />
              Descargar original
            </MenuItem>

            <MenuItem onClick={downloadTranslatedFile}>
              <CachedIcon sx={{mr: 1, my: 'auto'}} />
              Descargar archivo de rutas
            </MenuItem>

            <MenuItem onClick={setDeleteState}>
            <DeleteOutlineOutlinedIcon sx={{mr: 1, my: 'auto'}} />
            Eliminar ruta
          </MenuItem>
          </Menu>

          <Dialog
            open={open}
            onClose={handleClose}
            sx={{textAlign: 'center'}}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
            fullWidth
            maxWidth='x1'
          >
            {typeDialog == 'detailRoute' ? (
              
              <>
                <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
                  {`Rutas(${
                    selectedRoute_PageListPredefinedRoutes
                      ? selectedRoute_PageListPredefinedRoutes.cantDeliveries
                      : ''
                  } puntos)`}
                  {/* { selectedRoute_PageListPredefinedRoutes && selectedRoute_PageListPredefinedRoutes.deliveries
                   && selectedRoute_PageListPredefinedRoutes.deliveries.length >0  ? 
                  `Rutas (${selectedRoute_PageListPredefinedRoutes.deliveries.length} puntos)` : `Rutas (Cargando ... ${selectedRoute_PageListPredefinedRoutes.deliveries.length} puntos)`} */}
                  <CancelOutlinedIcon
                    onClick={setOpen.bind(this, false)}
                    className={classes.closeButton}
                  />
                </DialogTitle>

                
                <DialogContent >
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
                  <Table size='small' aria-label='purchases' >
                    <TableHead sx={{backgroundColor: '#ededed'}}>
                      <TableRow>
                        <TableCell>Dirección de punto de partida</TableCell>
                        <TableCell>Ubigeo de punto de partida</TableCell>
                        <TableCell>Dirección de punto de llegada</TableCell>
                        <TableCell>Ubigeo de punto de llegada</TableCell>
                        <TableCell>Documento de conductor</TableCell>
                        <TableCell>Nombre de conductor</TableCell>
                        <TableCell>Apellidos de conductor</TableCell>
                        <TableCell>Licencia de conductor</TableCell>
                        <TableCell>Placa</TableCell>
                        <TableCell>Productos</TableCell>
                        <TableCell>Observaciones</TableCell>
                        <TableCell>Peso total</TableCell>
                        <TableCell>Número de paquetes</TableCell>
                        <TableCell>Motivo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listRouteBySelectedRoutes &&
                      listRouteBySelectedRoutes.deliveries.length >
                        0
                        ? listRouteBySelectedRoutes.deliveries.map(
                            (route, index2) => {
                              const products = route.productsInfo;
                              return (
                                <>
                                  <TableRow key={index2}>
                                    <TableCell>
                                      {route.arrivalPointAddress}
                                    </TableCell>
                                    <TableCell>
                                      {route.arrivalPointUbigeo}
                                    </TableCell>
                                    <TableCell>
                                      {route.startingPointAddress}
                                    </TableCell>
                                    <TableCell>
                                      {route.startingPointUbigeo}
                                    </TableCell>
                                    <TableCell>
                                      {route.driverDocumentType &&
                                      route.driverDocumentNumber
                                        ? `${route.driverDocumentType.toUpperCase()} - ${
                                            route.driverDocumentNumber
                                          }`
                                        : null}
                                    </TableCell>
                                    <TableCell>
                                      {route.driverDenomination}
                                    </TableCell>
                                    <TableCell>
                                      {route.driverLastName}
                                    </TableCell>
                                    <TableCell>
                                      {route.driverLicenseNumber}
                                    </TableCell>
                                    <TableCell>
                                      {route.carrierPlateNumber}
                                    </TableCell>
                                    <TableCell>
                                      {products && products.length !== 0 ? (
                                        <IconButton
                                          onClick={() =>
                                            checkProducts(route, index2)
                                          }
                                          size='small'
                                        >
                                          <FormatListBulletedIcon fontSize='small' />
                                        </IconButton>
                                      ) : null}
                                    </TableCell>
                                    <TableCell>
                                      {route.observationDelivery}
                                    </TableCell>
                                    <TableCell>
                                      {Number.parseFloat(
                                        route.totalGrossWeight,
                                      ).toFixed(3)}
                                    </TableCell>
                                    <TableCell>
                                      {route.numberOfPackages}
                                    </TableCell>
                                    <TableCell>
                                      {route.reasonForTransfer?route.reasonForTransfer:"venta"}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow key={`sub-${index2}`}>
                                    <TableCell sx={{p: 0}} colSpan={10}>
                                      <Collapse
                                        in={
                                          openProducts && index2 === rowNumber2
                                        }
                                        timeout='auto'
                                        unmountOnExit
                                      >
                                        <Box sx={{margin: 0}}>
                                          <Table
                                            size='small'
                                            aria-label='purchases'
                                          >
                                            <TableHead
                                              sx={{
                                                backgroundColor: '#ededed',
                                              }}
                                            >
                                              <TableRow>
                                                <TableCell>Código</TableCell>
                                                <TableCell>
                                                  Descripción
                                                </TableCell>
                                                <TableCell>Cantidad</TableCell>
                                              </TableRow>
                                            </TableHead>
                                            <TableBody>
                                              {products && products.length !== 0
                                                ? products.map(
                                                    (product, index3) => {
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
                                                            {
                                                              product.description
                                                            }
                                                          </TableCell>
                                                          <TableCell>
                                                            {
                                                              product.quantityMovement
                                                            }
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
                            },
                          )
                        : null}
                    </TableBody>
                  </Table>
                </DialogContent>
                
              </>
              
            ) : null}

          </Dialog>
        </Card>
      )}
    </>
  );
};

export default PredefinedRoutes;
