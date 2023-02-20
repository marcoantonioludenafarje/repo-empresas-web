import React, {useEffect} from 'react';
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
  MenuItem,
  Menu,
} from '@mui/material';

import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DataSaverOffOutlinedIcon from '@mui/icons-material/DataSaverOffOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {red} from '@mui/material/colors';
import {getUserData} from '../../../redux/actions/User';

import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  LIST_ROUTE,
  GET_USER_DATA,
  ROUTE_TO_REFERRAL_GUIDE,
} from '../../../shared/constants/ActionTypes';
import Router, {useRouter} from 'next/router';
import {listDistributions} from '../../../redux/actions/Movements';
import {useDispatch, useSelector} from 'react-redux';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import {getYear, justDate, showSubtypeMovement} from '../../../Utils/utils';

let listDistributionsPayload = {
  request: {
    payload: {
      merchantId: '',
    },
  },
};
let codFinanceSelected = '';
let selectedDistribution = '';
let selectedRoute = '';

const FinancesTable = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open2, setOpen2] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [resultState, setResultState] = React.useState(false);
  const [openRoutes, setOpenRoutes] = React.useState(false);
  const [openProducts, setOpenProducts] = React.useState(false);
  const [rowNumber, setRowNumber] = React.useState(0);
  const [rowNumber2, setRowNumber2] = React.useState(0);
  const openMenu = Boolean(anchorEl);
  const dispatch = useDispatch();
  const router = useRouter();
  const {query} = router;
  console.log('query', query);

  const {listDistribution} = useSelector(({movements}) => movements);
  console.log('listDistribution', listDistribution);
  const {successMessage} = useSelector(({movements}) => movements);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({movements}) => movements);
  console.log('errorMessage', errorMessage);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);

  //APIS
  const toListDistributions = (payload) => {
    dispatch(listDistributions(payload));
  };
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
  useEffect(() => {
    if (userDataRes) {
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      dispatch({type: LIST_ROUTE, payload: undefined});

      listDistributionsPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;

      toListDistributions(listDistributionsPayload);
    }
  }, [userDataRes]);

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
    selectedDistribution = input;
    console.log('selectedDistribution', selectedDistribution);
    setOpenRoutes(false);
    setOpenRoutes(true);
    if (openRoutes == true && rowNumber == index) {
      setOpenRoutes(false);
    }
    setRowNumber(index);
  };

  const checkProducts = (delivery, index) => {
    selectedRoute = delivery;
    console.log('selectedRoute', selectedRoute);
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

  const handleClick = (route, event) => {
    setAnchorEl(event.currentTarget);
    selectedRoute = route;
    console.log('selectedRoute', selectedRoute);
  };

  const getReferralGuide = () => {
    console.log('Selected distribution', selectedDistribution);
    console.log('Selected route', selectedRoute);
    dispatch({
      type: ROUTE_TO_REFERRAL_GUIDE,
      payload: {
        ...selectedRoute,
        reasonForTransfer: selectedDistribution.reasonForTransfer,
        typeOfTransport: selectedDistribution.typeOfTransport,
        observation: selectedDistribution.observation,
        deliveries: selectedDistribution.deliveries.map((delivery, index) => ({
          ...delivery,
          localRouteId: index,
        })),
        deliveryDistributionId: selectedDistribution.deliveryDistributionId,
      },
    });
    Router.push({
      pathname: '/sample/referral-guide/get',
      query: {
        movementHeaderId: selectedDistribution.movementHeaderId,
        useLocaleRoute: true,
      },
    });
  };
  const showObject = (codOutput, type) => {
    // if (type == 'income') {
    //   Router.push({
    //     pathname: '/sample/finances/table',
    //     query: {contableMovementId: selectedOutput.contableMovementId},
    //   });
    // } else if (type == 'bill') {
    //   Router.push({
    //     pathname: '/sample/bills/table',
    //     query: {billId: selectedOutput.billId},
    //   });
    // } else

    if (type == 'referralGuide') {
      console.log('Esta es la id de la guia', codOutput);
      Router.push({
        pathname: '/sample/referral-guide/table',
        query: {referralGuideId: codOutput},
      });
    } else {
      return null;
    }
  };
  const showIconStatus = (bool, obj) => {
    switch (bool) {
      case true:
        return (
          <Button
            variant='secondary'
            sx={{fontSize: '1em'}}
            /* disabled={type == 'referralGuide'} */
            onClick={() =>
              showObject(obj.referralGuideMovementHeaderId, 'referralGuide')
            }
          >
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

  return (
    <Card sx={{p: 4}}>
      <TableContainer component={Paper} sx={{maxHeight: 440}}>
        <Table stickyHeader size='small' aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Fecha de creación</TableCell>
              <TableCell>Nombre de ruta</TableCell>
              <TableCell>Razón para transferir</TableCell>
              <TableCell>Observación</TableCell>
              <TableCell>Entregas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listDistribution && Array.isArray(listDistribution) ? (
              listDistribution.sort(compare).map((obj, index) => {
                const routes = obj.deliveries;
                return (
                  <>
                    <TableRow
                      sx={{'&:last-child td, &:last-child th': {border: 0}}}
                      key={`route${index}`}
                    >
                      <TableCell>{justDate(obj.createdAt)}</TableCell>
                      <TableCell>{obj.routeName}</TableCell>
                      <TableCell>
                        {showSubtypeMovement(obj.reasonForTransfer)}
                      </TableCell>
                      <TableCell>{obj.observation}</TableCell>
                      <TableCell>
                        {routes.length !== 0 ? (
                          <IconButton
                            onClick={() => checkRoutes(obj, index)}
                            size='small'
                          >
                            <FormatListBulletedIcon fontSize='small' />
                          </IconButton>
                        ) : null}
                      </TableCell>
                    </TableRow>
                    <TableRow key={`doc-${index}`}>
                      <TableCell sx={{p: 0}} colSpan={5}>
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
                                    Dirección de punto de llegada
                                  </TableCell>
                                  <TableCell>
                                    Ubigeo de punto de llegada
                                  </TableCell>
                                  <TableCell>Documento de conductor</TableCell>
                                  <TableCell>Nombre de conductor</TableCell>
                                  <TableCell>Apellidos de conductor</TableCell>
                                  <TableCell>Licencia de conductor</TableCell>
                                  <TableCell>Placa del vehículo</TableCell>
                                  <TableCell>Productos</TableCell>
                                  <TableCell>Observaciones</TableCell>
                                  <TableCell>Peso total</TableCell>
                                  <TableCell>Número de paquetes</TableCell>
                                  <TableCell>
                                    Guía de Remisión Generada
                                  </TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {routes && routes.length !== 0
                                  ? routes.map((route, index2) => {
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
                                              {products &&
                                              products.length !== 0 ? (
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
                                              {route.totalGrossWeight.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                              {route.numberOfPackages}
                                            </TableCell>
                                            <TableCell align='center'>
                                              {showIconStatus(
                                                route.generateReferralGuide,
                                                route,
                                              )}
                                            </TableCell>
                                            <TableCell>
                                              <Button
                                                id='basic-button'
                                                aria-controls={
                                                  openMenu
                                                    ? 'basic-menu'
                                                    : undefined
                                                }
                                                aria-haspopup='true'
                                                aria-expanded={
                                                  openMenu ? 'true' : undefined
                                                }
                                                onClick={handleClick.bind(
                                                  this,
                                                  {
                                                    ...route,
                                                    localRouteId: index2,
                                                  },
                                                )}
                                              >
                                                <KeyboardArrowDownIcon />
                                              </Button>
                                            </TableCell>
                                          </TableRow>
                                          <TableRow key={`sub-${index2}`}>
                                            <TableCell sx={{p: 0}} colSpan={10}>
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
                                                                    {
                                                                      product.product
                                                                    }
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
      </TableContainer>

      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={openMenu}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {!selectedRoute.generateReferralGuide ? (
          <MenuItem onClick={getReferralGuide}>
            <EditLocationOutlinedIcon sx={{mr: 1, my: 'auto'}} />
            <IntlMessages id='message.generate.referralGuide' />
          </MenuItem>
        ) : null}
      </Menu>
    </Card>
  );
};

export default FinancesTable;
