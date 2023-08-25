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
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Collapse,
  Typography,
  TableBody,
  Divider,
  Grid,
  Stack,
  IconButton,
  ButtonGroup,
  TableContainer,
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
import {updatePredefinedRoute,getPredefinedRoute_____PageListPredefinedRoutes,getChildRoutes} from '../../../redux/actions/Movements';
import {onGetProducts} from '../../../redux/actions/Products';
import {getCarriers} from '../../../redux/actions/Carriers';
import {red} from '@mui/material/colors';
import {completeWithZeros} from '../../../Utils/utils';
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
let selectedRoute = '';

const Distribution = () => {
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
    carrierDocumentType: '',
    carrierDocumentNumber: '',
    carrierDenomination: '',
    carrierDenomination: '',
    startingPointUbigeo: '',
    arrivalPointUbigeo: '',
    startingPointUbigeo: '',
    arrivalPointUbigeo: '',
    startingPointAddress: '',
    arrivalPointAddress: '',
    driverDenomination: '',
    driverLastName: '',
    driverLicenseNumber: '',
    driverDocumentNumber: '',
    carrierPlateNumber: '',
    totalGrossWeight: '',
    numberOfPackages: '',
    observationDelivery: '',
    products: [],
  };
  const dispatch = useDispatch();
  const [routesReady, setRoutesReady] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [execAll, setExecAll] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [openProducts, setOpenProducts] = React.useState(false);
  let changeValueField;
  const router = useRouter();
  const {query} = router;
  console.log('query', query);

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
  const [routes, setRoutes] = React.useState(selectedRoute_PageListPredefinedRoutes);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const [selectedDeliveryState, setSelectedDeliveryState] = React.useState({});
  const [rowNumber2, setRowNumber2] = React.useState(0);
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


  const handleClick = (route, event) => {
    setAnchorEl(event.currentTarget);
    setRowNumber2(route.localRouteId);
    selectedRoute = route;
    setSelectedDeliveryState(selectedRoute);
    console.log('selectedRoute', selectedRoute);
  };

console.log("Fase previa al abismo");
  useEffect(() => {
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: GET_PRODUCTS, payload: undefined});
    console.log("Todo apunta a que el error es despues de esta linea");
    dispatch({type: GET_CARRIERS, payload: undefined});
    //dispatch({type: LIST_ROUTE, payload: undefined});
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
  }, [predefinedRoutes_PageListPredefinedRoutes]);

  useEffect(() => {
    if (predefinedRoutes_PageListPredefinedRoutes.length>0) {
      console.log("Este es el listRoute",predefinedRoutes_PageListPredefinedRoutes);
      let selectedRoute = predefinedRoutes_PageListPredefinedRoutes.find(
        (route) => route.routePredefinedId == query.routeId,
      );
      let routePredefinedId=selectedRoute.routePredefinedId;
      dispatch({
        type: SET_DELIVERIES_IN_ROUTE_PREDEFINED_____PAGE_LIST_PREDEFINED_ROUTES,
        payload: null,
      });
      toGetPredefinedRoute({
        routePredefinedId,
        merchantId: userDataRes.merchantSelected.merchantId,
      });
      console.log('selectedRoute', selectedRoute);
      console.log("Verificando servicio child deliveries Routes",selectedRoute_PageListPredefinedRoutes);
      setRoutes(selectedRoute_PageListPredefinedRoutes);
      changeValueField('routeName', selectedRoute.routeName);
    }
    setRoutesReady(true);
  }, [predefinedRoutes_PageListPredefinedRoutes]);

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
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: GENERATE_ROUTE, payload: undefined});
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

      {/* <Box
        sx={{
          m: 'auto',
          border: '1px solid grey',
          borderRadius: '10px',
          width: '95  %',
        }}
      >
        {(selectedRoute_PageListPredefinedRoutes!=null && selectedRoute_PageListPredefinedRoutes!=undefined && 
        selectedRoute_PageListPredefinedRoutes.deliveries.length>0)
          ? selectedRoute_PageListPredefinedRoutes.deliveries.map((route, index) => (
              <DeliveryCard
                key={index}
                order={index}
                execFunctions={execAll}
                newValuesData={setRouteIndex}
                initialValues={route}
              />
            ))
          : null}
      </Box> */}
      <TableContainer style={{ overflowX: 'auto', overflowY: 'auto', maxHeight:'30rem' }}>
      <Table size='small' aria-label='purchases'>
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
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedRoute_PageListPredefinedRoutes &&
                      selectedRoute_PageListPredefinedRoutes.deliveries.length > 0
                        ? selectedRoute_PageListPredefinedRoutes.deliveries.map(
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
         </TableContainer>                     
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

      <Dialog
        open={openStatus}
        onClose={sendStatus}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {<IntlMessages id='message.update.newRoute' />}
        </DialogTitle>
        {showMessage()}
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={sendStatus}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
      <AppInfoView />
    </Card>
  );
};

export default Distribution;
