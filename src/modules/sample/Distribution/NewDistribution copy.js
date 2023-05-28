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
} from '@mui/material';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AppPageMeta from '../../../@crema/core/AppPageMeta';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

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
  listRoutes,
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

const Distribution = () => {
  const {listRoute} = useSelector(({movements}) => movements);
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
    driverDocumentNumber: '',
    driverLicenseNumber: '',
    carrierPlateNumber: '',
    totalGrossWeight: '',
    numberOfPackages: '',
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

  const dispatch = useDispatch();
  const router = useRouter();
  const {query} = router;
  console.log('query', query);

  const {businessParameter} = useSelector(({general}) => general);
  console.log('businessParameter', businessParameter);
  const {getMovementsRes} = useSelector(({movements}) => movements);
  const {outputItems_pageListOutput} = useSelector(({movements}) => movements);
  console.log('outputItems_pageListOutput', outputItems_pageListOutput);
  const {successMessage} = useSelector(({movements}) => movements);
  const {generateDistributionRes} = useSelector(({movements}) => movements);
  console.log('generateDistributionRes', generateDistributionRes);
  const {errorMessage} = useSelector(({movements}) => movements);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  const {jwtToken} = useSelector(({general}) => general);

  let businessParameterPayload = {
    request: {
      payload: {
        abreParametro: null,
        codTipoparametro: null,
        merchantId: userDataRes.merchantSelected.merchantId,
      },
    },
  };
  let listRoutesPayload = {
    request: {
      payload: {
        merchantId: userDataRes.merchantSelected.merchantId,
      },
    },
  };
  let listPayload = {
    request: {
      payload: {
        businessProductCode: null,
        description: null,
        merchantId: userDataRes.merchantSelected.merchantId,
      },
    },
  };

  useEffect(() => {
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: GET_PRODUCTS, payload: undefined});
    toListRoutes(listRoutesPayload);
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
      getBusinessParameter(businessParameterPayload);
    }
    setTimeout(() => {
      setMinTutorial(true);
    }, 2000);
  }, []);

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

  useEffect(() => {
    if (listRoute) {
      const initialRoute = listRoute[0];
      setSelectedRouteId(initialRoute.routePredefinedId);
      setSelectedRoute(initialRoute);
      let deliveries = initialRoute.deliveries.map((obj) => {
        obj.products = obj.productsInfo;
        return obj;
      });
      console.log('initial deliveries', deliveries);
      setRoutes(deliveries);
    }
  }, [listRoute]);

  const toListRoutes = (payload) => {
    dispatch(listRoutes(payload));
  };
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
    setOpenStatus(true);
    setExecAll(true);
    setExecAll(false);
    console.log(`inicio ${initialDate}, final ${finalDate}`);
    console.log('final estado', status);
    console.log('final data', data);
    console.log('final routes', routes);
    setSubmitting(false);
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
          deliveries: routes.map((route) => {
            if (route !== undefined) {
              return {
                destination: route.startingAddress,
                transferStartDate: toDateAndHOurs(route.transferStartDate),
                totalGrossWeight: route.totalWeight,
                numberOfPackages: route.numberPackages,
                observationDelivery: route.observationDelivery,
                startingPointAddress: route.startingAddress,
                startingPointUbigeo: completeWithZeros(
                  route.startingPointUbigeo,
                  6,
                ),
                arrivalPointAddress: route.arrivalAddress,
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
                transferStartDate: dateWithHyphen(route.transferStartDate),
                productsInfo: route.products.map((prod) => {
                  return {
                    productId: prod.productId,
                    product: prod.product,
                    description: prod.description,
                    unitMeasure: prod.unitMeasure,
                    quantityMovement: prod.count,
                    weight: prod.weight,
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
    setSubmitting(false);
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
      (successMessage != undefined && generateDistributionRes) ||
      errorMessage != undefined
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
    const selectedRoute = listRoute.find(
      (obj) => obj.routePredefinedId == event.target.value,
    );
    let deliveries = selectedRoute.deliveries.map((obj) => {
      obj.products = obj.productsInfo;
      return obj;
    });
    console.log('selectedRoute', selectedRoute);
    setSelectedRouteId(selectedRoute.routePredefinedId);
    setSelectedRoute(selectedRoute);
    console.log('deliveries', selectedRoute.deliveries);
    setRoutes(deliveries);
    reloadPage();
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

                  <Grid item xs={12} sx={{mt: 4}}>
                    <DateTimePicker
                      renderInput={(params) => (
                        <TextField {...params} sx={{width: 1}} />
                      )}
                      label={
                        <IntlMessages id='dashboard.iinitialDateTimeTras' />
                      }
                      inputFormat='dd/MM/yyyy hh:mm a'
                      value={initialDate}
                      onChange={(newDate) => {
                        setInitialDate(newDate);
                        console.log('initial date', newDate);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sx={{my: 4}}>
                    <DateTimePicker
                      renderInput={(params) => (
                        <TextField {...params} sx={{width: 1}} />
                      )}
                      label={<IntlMessages id='dashboard.finalDateTime' />}
                      inputFormat='dd/MM/yyyy hh:mm a'
                      value={finalDate}
                      onChange={(newDate) => {
                        setFinalDate(newDate);
                        console.log('final date', newDate);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
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
                  </Grid>

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
                        {listRoute &&
                          listRoute.sort(compare).map((route, index) => {
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
            <IntlMessages id='common.deliveries' />
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

      <Box
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
