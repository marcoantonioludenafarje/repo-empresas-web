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
} from '@mui/material';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppPageMeta from '../../../@crema/core/AppPageMeta';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import {Form, Formik} from 'formik';
import * as yup from 'yup';
import Router, {useRouter} from 'next/router';
import DeliveryCard from './DeliveryCard';
import AppInfoView from '../../../@crema/core/AppInfoView';
import {useDispatch, useSelector} from 'react-redux';
import {updatePredefinedRoute} from '../../../redux/actions/Movements';
import {onGetProducts} from '../../../redux/actions/Products';
import {getCarriers} from '../../../redux/actions/Carriers';
import {red} from '@mui/material/colors';
import {completeWithZeros} from '../../../Utils/utils';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_PRODUCTS,
  GET_CARRIERS,
  GENERATE_ROUTE,
} from '../../../shared/constants/ActionTypes';

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
    driverDocumentNumber: '',
    carrierPlateNumber: '',
    totalGrossWeight: '',
    numberOfPackages: '',
    observationDelivery: '',
    products: [],
  };
  const dispatch = useDispatch();
  const [routes, setRoutes] = React.useState([]);
  const [routesReady, setRoutesReady] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [execAll, setExecAll] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);

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

  listPayload.request.payload.merchantId =
    userDataRes.merchantSelected.merchantId;

  const toGetCarriers = (payload, token) => {
    dispatch(getCarriers(payload, token));
  };
  const updateRoute = (payload) => {
    dispatch(updatePredefinedRoute(payload));
  };
  const getProducts = (payload) => {
    dispatch(onGetProducts(payload));
  };

  useEffect(() => {
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: GET_PRODUCTS, payload: undefined});
    dispatch({type: GET_CARRIERS, payload: undefined});
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
  }, []);

  useEffect(() => {
    if (listRoute) {
      let selectedRoute = listRoute.find(
        (route) => route.routePredefinedId == query.routeId,
      );
      console.log('selectedRoute', selectedRoute);
      setRoutes(selectedRoute.deliveries);
      changeValueField('routeName', selectedRoute.routeName);
    }
    setRoutesReady(true);
  }, [listRoute]);

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
    return (
      (successMessage != undefined && updateRouteRes) ||
      errorMessage
    );
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

      <Box
        sx={{
          m: 'auto',
          border: '1px solid grey',
          borderRadius: '10px',
          width: '95  %',
        }}
      >
        {routes
          ? routes.map((route, index) => (
              <DeliveryCard
                key={index}
                order={index}
                execFunctions={execAll}
                newValuesData={setRouteIndex}
                initialValues={route}
              />
            ))
          : null}
      </Box>

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
