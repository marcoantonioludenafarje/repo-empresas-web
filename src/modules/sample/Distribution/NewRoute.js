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
import {orange} from '@mui/material/colors';
import YouTubeIcon from '@mui/icons-material/YouTube';
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
import {generatePredefinedRoute} from '../../../redux/actions/Movements';
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
    destination: '',
    address: '',
    driver: '',
    plate: '',
    products: [],
  };
  const dispatch = useDispatch();
  const [routes, setRoutes] = React.useState([]);
  const [reload, setReload] = React.useState(false);
  const [execAll, setExecAll] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [minTutorial, setMinTutorial] = React.useState(false);
  const {listProducts} = useSelector(({products}) => products);
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

  listPayload.request.payload.merchantId =
    userDataRes.merchantSelected.merchantId;
  let listCarriersPayload = {
    request: {
      payload: {
        typeDocumentCarrier: '',
        numberDocumentCarrier: '',
        denominationCarrier: '',
        merchantId: userDataRes.merchantSelected.merchantId,
      },
    },
  };

  const toGetCarriers = (payload, token) => {
    dispatch(getCarriers(payload, token));
  };
  const generateRoute = (payload) => {
    dispatch(generatePredefinedRoute(payload));
  };
  const getProducts = (payload) => {
    dispatch(onGetProducts(payload));
  };

  useEffect(() => {
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: GET_PRODUCTS, payload: undefined});
    getProducts(listPayload);
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
  const defaultValues = {
    routeName: '',
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
      errorMessage != undefined
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
        {routes &&
          routes.map((route, index) => (
            <DeliveryCard
              key={index}
              order={index}
              execFunctions={execAll}
              newValuesData={setRouteIndex}
            />
          ))}
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
              onClick={() => window.open('https://www.youtube.com/')}
            >
              VER TUTORIAL
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
          {<IntlMessages id='message.register.newRoute' />}
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
