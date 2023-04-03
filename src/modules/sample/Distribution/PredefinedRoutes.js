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
} from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {makeStyles} from '@mui/styles';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import CachedIcon from '@mui/icons-material/Cached';

import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  LIST_ROUTE,
  SET_DELIVERIES_SIMPLE,
} from '../../../shared/constants/ActionTypes';
import Router, {useRouter} from 'next/router';
import {
  listRoutes,
  getChildRoutes,
  listNewRoutes,
} from '../../../redux/actions/Movements';
import {useDispatch, useSelector} from 'react-redux';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import {getYear, justDate, justTime} from '../../../Utils/utils';
import AppLoader from '@crema/core/AppLoader';

let listRoutesPayload = {
  request: {
    payload: {
      merchantId: '',
    },
  },
};

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
}));

const PredefinedRoutes = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open2, setOpen2] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [resultState, setResultState] = React.useState(false);
  const [openRoutes, setOpenRoutes] = React.useState(false);
  const [openProducts, setOpenProducts] = React.useState(false);
  const [rowNumber, setRowNumber] = React.useState(0);
  const [rowNumber2, setRowNumber2] = React.useState(0);

  const [loading, setLoading] = React.useState(true);

  const openMenu = Boolean(anchorEl);
  const dispatch = useDispatch();
  const router = useRouter();
  const {query} = router;
  console.log('query', query);

  const {listRoute, LastEvaluatedKey} = useSelector(({movements}) => movements);
  console.log('listRoute', listRoute);

  const {deliveries, LastEvaluatedKeyChildRoute} = useSelector(
    ({movements}) => movements,
  );

  const {successMessage} = useSelector(({movements}) => movements);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({movements}) => movements);
  console.log('errorMessage', errorMessage);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  listRoutesPayload.request.payload.merchantId =
    userDataRes.merchantSelected.merchantId;

  const [page, setPage] = React.useState(1);

  //APIS
  const toListRoutes = (payload) => {
    dispatch(listRoutes(payload));
  };

  const toGetChildRoutes = (payload) => {
    dispatch(getChildRoutes(payload));
  };

  const toListNewRoutes = (payload) => {
    dispatch(listNewRoutes(payload));
  };

  const handleNextPage = (event) => {
    console.log('Llamando al  handleNextPage', handleNextPage);
    listRoutesPayload.request.payload.LastEvaluatedKey = LastEvaluatedKey;
    dispatch(listRoutes(listRoutesPayload));
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
  }, [listRoute]);

  useEffect(() => {
    console.log('El deliveries 111', deliveries);
    if (deliveries && deliveries.length > 0) {
      console.log('El deliveries', deliveries);
      setOpenRoutes(true);
    }
  }, [deliveries]);

  useEffect(() => {
    console.log('Reseteando todo');
    listRoutesPayload.request.payload.LastEvaluatedKey = null;

    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: LIST_ROUTE, payload: undefined});
    toListRoutes(listRoutesPayload);
  }, []);

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
    window.open(`https://d2moc5ro519bc0.cloudfront.net/merchant/${merchant}/${path}`);
  };

  const downloadTranslatedFile = () => {
    console.log('Descargar archivo traducido');
  };

  const goToUpdate = () => {
    console.log('En mantenimiento');
    // Router.push({
    //   pathname: '/sample/distribution/update-routes',
    //   query: {routeId: selectedRoute.routePredefinedId},
    // });
  };

  const findRoute = (routeId) => {
    return listRoute.find((obj) => obj.routePredefinedId == routeId);
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
  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = (type) => {
    console.log('Veamos el total', selectedRoute);
    let routePredefinedId = selectedRoute.routePredefinedId;
    console.log('EY que tal', userDataRes.merchantSelected.merchantId);
    toListNewRoutes({
      routePredefinedId,
      merchantId: userDataRes.merchantSelected.merchantId,
    });

    // setOpen(true);
    // toListNewRoutes()
    // setTypeDialog(type);
    // setShowAlert(false);
  };

  return (
    <>
      {loading ? (
        <AppLoader />
      ) : (
        <Card sx={{p: 4}}>
          <TableContainer component={Paper} sx={{maxHeight: 440}}>
            <Table stickyHeader size='small' aria-label='simple table'>
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
                {listRoute && Array.isArray(listRoute) ? (
                  listRoute.sort(compare).map((obj, index) => {
                    const routes = obj.deliveries;
                    return (
                      <>
                        <TableRow
                          sx={{'&:last-child td, &:last-child th': {border: 0}}}
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
                        <TableRow key={`doc-${index}`}>
                          <TableCell sx={{p: 0}} colSpan={4}>
                            <Collapse
                              in={openRoutes && index === rowNumber}
                              timeout='auto'
                              unmountOnExit
                            >
                              <Box sx={{margin: 0}}>
                                <Table size='small' aria-label='purchases'>
                                  <TableHead sx={{backgroundColor: '#ededed'}}>
                                    <TableRow>
                                      <TableCell>
                                        Dirección de punto de partida
                                      </TableCell>
                                      <TableCell>
                                        Ubigeo de punto de partida
                                      </TableCell>
                                      <TableCell>
                                        CodInterno de punto de partida
                                      </TableCell>
                                      <TableCell>
                                        Dirección de punto de llegada
                                      </TableCell>
                                      <TableCell>
                                        Ubigeo de punto de llegada
                                      </TableCell>
                                      <TableCell>
                                        CodInterno de punto de llegada
                                      </TableCell>
                                      <TableCell>
                                        Documento de conductor
                                      </TableCell>
                                      <TableCell>Nombre de conductor</TableCell>
                                      <TableCell>
                                        Apellidos de conductor
                                      </TableCell>
                                      <TableCell>
                                        Licencia de conductor
                                      </TableCell>
                                      <TableCell>Placa</TableCell>
                                      <TableCell>Productos</TableCell>
                                      <TableCell>Observaciones</TableCell>
                                      <TableCell>Peso total</TableCell>
                                      <TableCell>Número de paquetes</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {openRoutes &&
                                    deliveries &&
                                    deliveries.length !== 0
                                      ? deliveries.map((route, index2) => {
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
                                                  {route.arrivalInternalCode || ""}
                                                </TableCell>
                                                <TableCell>
                                                  {route.startingPointAddress}
                                                </TableCell>
                                                <TableCell>
                                                  {route.startingPointUbigeo}
                                                </TableCell>
                                                <TableCell>
                                                  {route.startingInternalCode || ""}
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
                                                  {products &&
                                                  products.length !== 0 ? (
                                                    <IconButton
                                                      onClick={() =>
                                                        checkProducts(
                                                          route,
                                                          index2,
                                                        )
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
                                              </TableRow>
                                              <TableRow key={`sub-${index2}`}>
                                                <TableCell
                                                  sx={{p: 0}}
                                                  colSpan={10}
                                                >
                                                  <Collapse
                                                    in={
                                                      openProducts &&
                                                      index2 === rowNumber2
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
                                                            backgroundColor:
                                                              '#ededed',
                                                          }}
                                                        >
                                                          <TableRow>
                                                            <TableCell>
                                                              Código
                                                            </TableCell>
                                                            <TableCell>
                                                              Descripción
                                                            </TableCell>
                                                            <TableCell>
                                                              Cantidad
                                                            </TableCell>
                                                          </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                          {products &&
                                                          products.length !== 0
                                                            ? products.map(
                                                                (
                                                                  product,
                                                                  index3,
                                                                ) => {
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
                ) : (
                  <CircularProgress
                    disableShrink
                    sx={{m: '10px', position: 'relative'}}
                  />
                )}
              </TableBody>
            </Table>

            {LastEvaluatedKey ? (
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

          <Menu
            id='basic-menu'
            anchorEl={anchorEl}
            open={openMenu}
            onClose={() => setAnchorEl(null)}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleClickOpen.bind('detailRoute')}>
              <CachedIcon sx={{mr: 1, my: 'auto'}} />
              Ver detalle
            </MenuItem>

            <MenuItem onClick={goToUpdate}>
              <CachedIcon sx={{mr: 1, my: 'auto'}} />
              Actualizar en mantenimiento
            </MenuItem>
            <MenuItem disabled={!selectedRoute.originalExcel} onClick={() => downloadOriginalFile(selectedRoute.originalExcel, selectedRoute.merchantId)}>
              <CachedIcon sx={{mr: 1, my: 'auto'}} />
              Descargar original
            </MenuItem>

            <MenuItem onClick={downloadTranslatedFile}>
              <CachedIcon sx={{mr: 1, my: 'auto'}} />
              Descargar archivo de rutas
            </MenuItem>
          </Menu>

          <Dialog
            open={open}
            onClose={handleClose}
            sx={{textAlign: 'center'}}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            {typeDialog == 'detailRoute' ? (
              <>
                <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
                  {'Rutas'}
                  <CancelOutlinedIcon
                    onClick={setOpen.bind(this, false)}
                    className={classes.closeButton}
                  />
                </DialogTitle>
                <DialogContent>
                  <span>Aca deberia de aparecer la info que necesito</span>
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
