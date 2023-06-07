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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';

import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DataSaverOffOutlinedIcon from '@mui/icons-material/DataSaverOffOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CancelIcon from '@mui/icons-material/Cancel';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PendingIcon from '@mui/icons-material/Pending';
import {red, amber} from '@mui/material/colors';
import {getUserData} from '../../../redux/actions/User';
import CachedIcon from '@mui/icons-material/Cached';

import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  LIST_ROUTE,
  GET_USER_DATA,
  ROUTE_TO_REFERRAL_GUIDE,
} from '../../../shared/constants/ActionTypes';
import Router, {useRouter} from 'next/router';
import {
  listDistributions,
  getDistribution,
  getOneDistribution,
} from '../../../redux/actions/Movements';
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

  const [distributionSelected, setDistributionSelected] = React.useState(null);
  const [indexDistributionSelected, setIndexDistributionSelected] =
    React.useState(null);

  const [typeDialog, setTypeDialog] = React.useState('');
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
      if(query.id){
        toGetOneDistribution({
          deliveryDistributionId: query.id,
          //indexDistributionSelected: indexDistributionSelected,
          merchantId: userDataRes.merchantSelected.merchantId,
        });
      } else {
        listDistributionsPayload.request.payload.merchantId =
          userDataRes.merchantSelected.merchantId;
  
        toListDistributions(listDistributionsPayload);
      }
    }
  }, [userDataRes,query]);

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
    if (openProducts == true && rowNumber2 == index) {
      console.log('Va a cerrar el openProducts');
      setOpenProducts(false);
    } else {
      console.log('Va a abrir el openProducts');
      setRowNumber2(index);
      setOpenProducts(true);
    }
  };

  const newRoute = () => {
    Router.push('/sample/distribution/create-routes');
  };

  const handleClick = (routex, event) => {
    setAnchorEl(event.currentTarget);
    // selectedRoute = route;
    // console.log('selectedRoute', selectedRoute);
  };

  const handleClickOpen = (type) => {
    console.log('Este es el type', type);
    if (type == 'viewDetail') {
      setTypeDialog(type);
      if (
        listDistribution[indexDistributionSelected] &&
        listDistribution[indexDistributionSelected].deliveries.length == 0
      ) {
        console.log('Obtendra el listDistribution');
        toGetDistribution({
          deliveryDistributionId: distributionSelected,
          indexDistributionSelected: indexDistributionSelected,
          merchantId: userDataRes.merchantSelected.merchantId,
        });
      } else {
        console.log('Se reutilizara el metodo');
      }
      setOpen(true);
    }
    // console.log('Veamos el total', selectedRoute);
    // let routePredefinedId = selectedRoute.routePredefinedId;
    // console.log('EY que tal', userDataRes.merchantSelected.merchantId);
    // toListNewRoutes({
    //   routePredefinedId,
    //   merchantId: userDataRes.merchantSelected.merchantId,
    // });

    // setOpen(true);
    // toListNewRoutes()
    // setTypeDialog(type);
    // setShowAlert(false);
  };

  const toGetDistribution = (payload) => {
    dispatch(getDistribution(payload));
  };

  const toGetOneDistribution = (payload) => {
    dispatch(getOneDistribution(payload))
  }
  const handleClickFather = (deliveryDistributionId, index, event) => {
    setAnchorEl(event.currentTarget);
    setDistributionSelected(deliveryDistributionId);
    setIndexDistributionSelected(index);
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
      case 'waiting':
        return <PendingIcon sx={{color: amber[500]}} />;
        break;
      case null:
        return <PendingIcon sx={{color: amber[500]}} />;
        break;
      case 'accepted':
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
      case 'denied':
        return <CancelIcon sx={{color: red[500]}} />;
        break;
      case false:
        return <CancelIcon sx={{color: red[500]}} />;
        break;
      default:
        return null;
    }
  };

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card sx={{p: 4}}>
      <TableContainer component={Paper} sx={{maxHeight: 440}}>
        <Table stickyHeader size='small' aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Fecha de creación</TableCell>
              <TableCell>Nombre de ruta</TableCell>
              <TableCell>Cant.Puntos</TableCell>
              <TableCell>Razón para transferir</TableCell>
              <TableCell>Observación</TableCell>
              {/* <TableCell>Entregas</TableCell> */}
              <TableCell></TableCell>
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
                      <TableCell>{obj.cantDeliveries}</TableCell>
                      <TableCell>
                        {showSubtypeMovement(obj.reasonForTransfer)}
                      </TableCell>
                      <TableCell>{obj.observation}</TableCell>
                      {/* <TableCell>
                        {routes.length !== 0 ? (
                          <IconButton
                            onClick={() => checkRoutes(obj, index)}
                            size='small'
                          >
                            <FormatListBulletedIcon fontSize='small' />
                          </IconButton>
                        ) : null}
                      </TableCell> */}
                      <TableCell>
                        <Button
                          id='basic-button'
                          aria-controls={openMenu ? 'basic-menu' : undefined}
                          aria-haspopup='true'
                          aria-expanded={openMenu ? 'true' : undefined}
                          onClick={handleClickFather.bind(
                            this,
                            obj.deliveryDistributionId,
                            index,
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
        <MenuItem onClick={handleClickOpen.bind(this, 'viewDetail')}>
          <CachedIcon sx={{mr: 1, my: 'auto'}} />
          Ver detalle
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
        {typeDialog == 'viewDetail' ? (
          <>
            <DialogTitle sx={{fontSize: '1.5em', display: 'flex', alignItems: 'center' }} id='alert-dialog-title'>
              <Button variant="contained" color="primary" >
                <ArrowForwardIcon />
                <div style={{ marginLeft: '5px' }}>GUÍAS</div>
              </Button>
              <div style={{ margin: '0 auto' }}>Puntos de entrega</div>
            </DialogTitle>
            <DialogContent>
              <TableContainer component={Paper} sx={{maxHeight: 440}}>
                <Table stickyHeader size='small' aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Serie-Número</TableCell>
                      <TableCell>Estado Guía Sunat</TableCell>
                      <TableCell>Dirección de punto de partida</TableCell>
                      <TableCell>Ubigeo de punto de partida</TableCell>
                      <TableCell>CodInterno de punto de partida</TableCell>
                      <TableCell>Dirección de punto de llegada</TableCell>
                      <TableCell>Ubigeo de punto de llegada</TableCell>
                      <TableCell>CodInterno de punto de llegada</TableCell>
                      <TableCell>Documento de conductor</TableCell>
                      <TableCell>Nombre de conductor</TableCell>
                      <TableCell>Apellidos de conductor</TableCell>
                      <TableCell>Licencia de conductor</TableCell>
                      <TableCell>Placa del vehículo</TableCell>
                      <TableCell>Productos</TableCell>
                      <TableCell>Observaciones</TableCell>
                      <TableCell>Peso total</TableCell>
                      <TableCell>Número de paquetes</TableCell>

                      {/* <TableCell></TableCell> */}
                    </TableRow>
                  </TableHead>
                  {/* {JSON.stringify(listDistribution[indexDistributionSelected].deliveries)} */}
                  <TableBody>
                    {listDistribution[indexDistributionSelected] &&
                    listDistribution[indexDistributionSelected].deliveries
                      .length > 0 ? (
                      listDistribution[
                        indexDistributionSelected
                      ].deliveries.map((deliveryItem, index) => {
                        const products = deliveryItem.productsInfo;
                        return (
                          <>
                            <TableRow
                              sx={{
                                '&:last-child td, &:last-child th': {border: 0},
                              }}
                              key={`points-located-${index}`}
                            >
                              {/* <TableCell>{deliveryItem.serialNumber}</TableCell> */}
                              <TableCell>{deliveryItem.serialNumber}</TableCell>
                              <TableCell align='center'>
                                {showIconStatus(
                                  deliveryItem.generateReferralGuide,
                                  deliveryItem,
                                )}
                              </TableCell>
                              <TableCell>
                                {deliveryItem.arrivalPointAddress}
                              </TableCell>
                              <TableCell>
                                {deliveryItem.arrivalPointUbigeo}
                              </TableCell>
                              <TableCell>
                                {deliveryItem.arrivalInternalCode || ''}
                              </TableCell>
                              <TableCell>
                                {deliveryItem.startingPointAddress}
                              </TableCell>
                              <TableCell>
                                {deliveryItem.startingPointUbigeo}
                              </TableCell>
                              <TableCell>
                                {deliveryItem.startingInternalCode || ''}
                              </TableCell>
                              <TableCell>
                                {deliveryItem.driverDocumentType &&
                                deliveryItem.driverDocumentNumber
                                  ? `${deliveryItem.driverDocumentType.toUpperCase()} - ${
                                      deliveryItem.driverDocumentNumber
                                    }`
                                  : null}
                              </TableCell>
                              <TableCell>
                                {deliveryItem.driverDenomination}
                              </TableCell>
                              <TableCell>
                                {deliveryItem.driverLastName}
                              </TableCell>
                              <TableCell>
                                {deliveryItem.driverLicenseNumber}
                              </TableCell>
                              <TableCell>
                                {deliveryItem.carrierPlateNumber}
                              </TableCell>
                              <TableCell>
                                {products && products.length !== 0 ? (
                                  <IconButton
                                    onClick={() =>
                                      checkProducts(deliveryItem, index)
                                    }
                                    size='small'
                                  >
                                    <FormatListBulletedIcon fontSize='small' />
                                  </IconButton>
                                ) : null}
                              </TableCell>
                              <TableCell>
                                {deliveryItem.observationDelivery}
                              </TableCell>
                              <TableCell>
                                {Number.parseFloat(
                                  deliveryItem.totalGrossWeight,
                                ).toFixed(3)}
                              </TableCell>
                              <TableCell>
                                {deliveryItem.numberOfPackages}
                              </TableCell>
                            </TableRow>

                            <TableRow key={`sub-${index}`}>
                              <TableCell sx={{p: 0}} colSpan={10}>
                                <Collapse
                                  in={openProducts && index === rowNumber2}
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
                                                    {product.quantityMovement}
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
                    ) : (
                      <CircularProgress
                        disableShrink
                        sx={{m: '10px', position: 'relative'}}
                      />
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
          </>
        ) : null}
      </Dialog>
    </Card>
  );
};

export default FinancesTable;
