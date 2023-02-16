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
} from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import CachedIcon from '@mui/icons-material/Cached';

import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  LIST_ROUTE,
} from '../../../shared/constants/ActionTypes';
import Router, {useRouter} from 'next/router';
import {listRoutes} from '../../../redux/actions/Movements';
import {useDispatch, useSelector} from 'react-redux';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import {getYear, justDate} from '../../../Utils/utils';

let listRoutesPayload = {
  request: {
    payload: {
      merchantId: '',
    },
  },
};
let codFinanceSelected = '';
let selectedRoute = '';
let selectedDelivery = {};

const PredefinedRoutes = () => {
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

  const {listRoute} = useSelector(({movements}) => movements);
  console.log('listRoute', listRoute);
  const {successMessage} = useSelector(({movements}) => movements);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({movements}) => movements);
  console.log('errorMessage', errorMessage);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  listRoutesPayload.request.payload.merchantId =
    userDataRes.merchantSelected.merchantId;

  //APIS
  const toListRoutes = (payload) => {
    dispatch(listRoutes(payload));
  };

  useEffect(() => {
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
    setOpenRoutes(true);
    if (openRoutes == true && rowNumber == index) {
      setOpenRoutes(false);
    }
    setRowNumber(index);
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

  const goToUpdate = () => {
    Router.push({
      pathname: '/sample/distribution/update-routes',
      query: {routeId: selectedRoute.routePredefinedId},
    });
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

  return (
    <Card sx={{p: 4}}>
      <TableContainer component={Paper} sx={{maxHeight: 440}}>
        <Table stickyHeader size='small' aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Fecha de creación</TableCell>
              <TableCell>Nombre de ruta</TableCell>
              <TableCell>Entregas</TableCell>
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
                      <TableCell>{justDate(obj.createdAt)}</TableCell>
                      <TableCell>{obj.routeName}</TableCell>
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
                      <TableCell>
                        <Button
                          id='basic-button'
                          aria-controls={openMenu ? 'basic-menu' : undefined}
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
                                    Dirección de punto de llegada
                                  </TableCell>
                                  <TableCell>
                                    Ubigeo de punto de llegada
                                  </TableCell>
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
                                              {route.totalGrossWeight}
                                            </TableCell>
                                            <TableCell>
                                              {route.numberOfPackages}
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
        <MenuItem onClick={goToUpdate}>
          <CachedIcon sx={{mr: 1, my: 'auto'}} />
          Actualizar
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default PredefinedRoutes;
