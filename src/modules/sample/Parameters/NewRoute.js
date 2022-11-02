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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import CategoryCard from './CategoryCard';
import AppInfoView from '../../../@crema/core/AppInfoView';
import {useDispatch, useSelector} from 'react-redux';
import {generatePredefinedRoute} from '../../../redux/actions/Movements';
import {onGetProducts} from '../../../redux/actions/Products';
import {getCarriers} from '../../../redux/actions/Carriers';
import {red} from '@mui/material/colors';

import {getUserData} from '../../../redux/actions/User';
import {completeWithZeros} from '../../../Utils/utils';
import {
  onGetBusinessParameter,
  updateAllBusinessParameter,
} from '../../../redux/actions/General';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_PRODUCTS,
  GET_USER_DATA,
  GET_CARRIERS,
  GENERATE_ROUTE,
  UPDATE_ALL_BUSINESS_PARAMETER,
} from '../../../shared/constants/ActionTypes';

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
    products: [],
  };
  const emptyCategory = {
    categories: [],
  };
  const dispatch = useDispatch();
  const [routes, setRoutes] = React.useState([]);
  const [filters, setFilters] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [reload, setReload] = React.useState(false);
  const [execAll, setExecAll] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [minTutorial, setMinTutorial] = React.useState(false);
  const [defaultMoney, setDefaultMoney] = React.useState('s');
  const [defaultWeight, setDefaultWeight] = React.useState('s');
  const [defaultIgvActivation, setDefaultIgvActivation] = React.useState(0);
  const [defaultPriceRange, setDefaultPriceRange] = React.useState([
    0, 1000000000,
  ]);
  const {listProducts} = useSelector(({products}) => products);
  console.log('products', listProducts);
  const {businessParameter} = useSelector(({general}) => general);
  console.log('globalParameter123', businessParameter);
  const {userAttributes} = useSelector(({user}) => user);
  console.log('userAttributes', userAttributes);
  const {userDataRes} = useSelector(({user}) => user);
  console.log('userDataRes', userDataRes);
  const {generateRouteRes} = useSelector(({movements}) => movements);
  console.log('generateRouteRes', generateRouteRes);
  const {updateAllBusinessParameterRes} = useSelector(({general}) => general);
  console.log('updateAllBusinessParameterRes', updateAllBusinessParameterRes);
  const {generalSuccess} = useSelector(({general}) => general);
  console.log('generalSuccess', generalSuccess);
  const {generalError} = useSelector(({general}) => general);
  console.log('generalError', generalError);
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
  const getBusinessParameter = (payload) => {
    dispatch(onGetBusinessParameter(payload));
  };
  const updateParameters = (payload) => {
    dispatch(updateAllBusinessParameter(payload));
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
  let defaultValues = {
    routeName: '',
    defaultMinPrice: 0,
    defaultMaxPrice: 1000,
    defaultWeight: 'LB',
    defaultMoney: 'USD',
    defaultIgvActivation: 0,
  };
  useEffect(() => {
    if (
      userDataRes &&
      (businessParameter == undefined || businessParameter == [])
    ) {
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
    }
  }, [userDataRes]);
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
      setCategories(categoriesProductParameter);
      changeValue('defaultWeight', defaultWeightParameter);
      changeValue('defaultMoney', defaultMoneyParameter);
      changeValue('defaultIgvActivation', Number(defaultIgvParameter));
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
    }
  }, []);

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
    setFilters();
    setCategories();
    // const finalPayload = {
    //   request: {
    //     payload: {
    //       userActor: userAttributes['sub'],
    //       merchantId: userDataRes.merchantSelected.merchantId,
    //       routeName: data.routeName,
    //       deliveries: routes.map((obj) => {
    //         if (obj !== undefined) {
    //           return {
    //             carrierDocumentType: obj.carrierDocumentType,
    //             carrierDocumentNumber: obj.carrierDocumentNumber,
    //             carrierDenomination: obj.carrierDenomination,
    //             totalGrossWeight: obj.totalWeight,
    //             numberOfPackages: obj.numberPackages,
    //             observationDelivery: obj.observationDelivery,
    //             startingPointAddress: obj.startingAddress,
    //             startingPointUbigeo: completeWithZeros(
    //               obj.startingPointUbigeo,
    //               6,
    //             ),
    //             arrivalPointAddress: obj.arrivalAddress,
    //             arrivalPointUbigeo: completeWithZeros(
    //               obj.arrivalPointUbigeo,
    //               6,
    //             ),
    //             driverDenomination: obj.driverName,
    //             driverDocumentType: obj.driverDocumentType,
    //             driverDocumentNumber: obj.driverDocumentNumber,
    //             driverId: '',
    //             carrierPlateNumber: obj.plate,
    //             productsInfo: obj.products.map((prod) => {
    //               return {
    //                 productId: prod.productId,
    //                 product: prod.product,
    //                 description: prod.description,
    //                 unitMeasure: prod.unitMeasure,
    //                 quantityMovement: prod.count,
    //               };
    //             }),
    //           };
    //         }
    //       }),
    //     },
    //   },
    // };
    // console.log('finalPayload', finalPayload);
    // dispatch({type: FETCH_SUCCESS, payload: undefined});
    // dispatch({type: FETCH_ERROR, payload: undefined});
    // dispatch({type: GENERATE_ROUTE, payload: undefined});
    // generateRoute(finalPayload);
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
    const finalPayload = {
      request: {
        payload: {
          merchantId: userDataRes.merchantSelected.merchantId,
          defaultMoneyValue: defaultMoney2.value,
          defaultMoneyMetadata2: defaultMoney2.metadata2,
          defaultMoneyMetadata4: defaultMoney2.metadata4,
          defaultWeightValue: defaultWeight,
          defaultIgvValue: defaultIgvActivation,
          price: defaultPriceRange,
          filters: filters,
          categories: categories,
        },
      },
    };
    console.log('finalPayload', finalPayload);
    // dispatch({type: FETCH_SUCCESS, payload: undefined});
    // dispatch({type: FETCH_ERROR, payload: undefined});
    // dispatch({type: UPDATE_ALL_BUSINESS_PARAMETER, payload: undefined});
    // updateParameters(finalPayload);
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

  const reloadPage = () => {
    setReload(!reload);
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
  const showMessage = () => {
    if (registerSuccess()) {
      console.log('Fue exitoso?');
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
      console.log('No Fue exitoso?');
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
              {updateAllBusinessParameterRes &&
              'error' in updateAllBusinessParameterRes
                ? updateAllBusinessParameterRes.error
                : null}
            </DialogContentText>
          </DialogContent>
        </>
      );
    } else {
      return <CircularProgress disableShrink sx={{mx: 'auto', my: '20px'}} />;
    }
  };
  const handleChange = (event) => {
    if (event.target.name == 'defaultIgvActivation') {
      setDefaultIgvActivation(event.target.value);
      console.log('Es el activation IGV: ', event.target.value);
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
                <Grid item xs={12} md={12}>
                  <AppTextField
                    name='defaultIgvActivation'
                    value={defaultIgvActivation}
                    fullWidth
                    label={'IGV'}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <InputLabel id='price' style={{fontWeight: 800}}>
                    Precio
                  </InputLabel>
                </Grid>
                <Grid item xs={6} md={3}>
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
          <IconButton
            onClick={() => {
              console.log('filters', filters);
              let newFilters = filters;
              newFilters.pop();
              setFilters(newFilters);
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
          mb: 5,
          border: '1px solid grey',
          borderRadius: '10px',
          width: '95  %',
        }}
      >
        {filters &&
          filters.map((filter, index) => (
            <DeliveryCard
              key={index}
              order={index}
              execFunctions={execAll}
              newValuesData={setFilterIndex}
              initialValues={filter}
            />
          ))}
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
            <IntlMessages id='common.productCategories' />
          </Typography>
          <IconButton
            onClick={() => {
              console.log('categories', categories);
              let newCategories = categories;
              newCategories.push(emptyCategory);
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
            <CategoryCard
              key={index}
              order={index}
              execFunctions={execAll}
              newValuesData={setCategoryIndex}
              initialValues={category}
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
          {<IntlMessages id='message.update.configurationParameters' />}
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
