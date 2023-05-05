import React, {useEffect, useState, useLayoutEffect} from 'react';
import AppPageMeta from '../../../@crema/core/AppPageMeta';
import {red, green} from '@mui/material/colors';
const XLSX = require('xlsx');
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ButtonGroup,
  Button,
  Stack,
  TextField,
  Card,
  Box,
  CircularProgress,
  Grid,
  alpha,
  Typography,
  IconButton,
  Collapse,
} from '@mui/material';
import {makeStyles} from '@mui/styles';

import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import * as yup from 'yup';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {DesktopDatePicker, DateTimePicker} from '@mui/lab';
import {CalendarPicker} from '@mui/lab';

import {useDispatch, useSelector} from 'react-redux';
import {
  getInventoryProducts,
  getMovements,
} from '../../../redux/actions/Movements';
import {Form, Formik} from 'formik';
import Router, {useRouter} from 'next/router';
import GainLost from '../Graphics/Profit/GainLost';
import ProductVsStock from '../Graphics/StatusStock/ProductVsStock';
// import Bitcoin from './Bitcoin';
import {getInformationGrouped, translateValue} from '../../../Utils/utils';
import {Fonts} from '../../../shared/constants/AppEnums';
import TotalBalance from './TotalBalance';
import Coins from './Coins';
import {justDate, justTime} from '../../../Utils/utils';
//ESTILOS
const useStyles = makeStyles((theme) => ({
  btnGroup: {
    marginTop: '2rem',
  },
  btnSplit: {
    display: 'flex',
    justifyContent: 'center',
  },
  stack: {
    justifyContent: 'center',
    marginBottom: '10px',
  },
  datePicker: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
import {GET_MOVEMENTS} from '../../../shared/constants/ActionTypes';
let listPayload = {
  request: {
    payload: {
      initialTime: null,
      finalTime: null,
      businessProductCode: null,
      movementType: null,
      merchantId: '',
    },
  },
};

// const profit = [
//   {name: 'Enero', gain: 30000, lost: 400},
//   {name: 'Febrero', gain: 5000, lost: 2500},
//   {name: 'Marzo', gain: 25000, lost: 3200},
//   {name: 'Abril', gain: 20000, lost: 10000},
//   {name: 'Mayo', gain: 10000, lost: 15000},
//   {name: 'Junio', gain: 17000, lost: 10000},
//   {name: 'Julio', gain: 25000, lost: 2500},
//   {name: 'Agosto', gain: 5000, lost: 6000},
//   {name: 'Septiembre', gain: 600, lost: 60},
//   {name: 'Octubre', gain: 10000, lost: 2000},
//   {name: 'Noviembre', gain: 600, lost: 180},
//   {name: 'Diciembre', gain: 10000, lost: 20000},
// ];
const validationSchema = yup.object({
  date1: yup
    .date()
    .typeError(<IntlMessages id='validation.date' />)
    .required(<IntlMessages id='validation.required' />),
  date1: yup
    .date()
    .typeError(<IntlMessages id='validation.date' />)
    .required(<IntlMessages id='validation.required' />),
});

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

const ProductMovementTable = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const [width, height] = useWindowSize();
  const [rowNumber, setRowNumber] = React.useState(0);
  console.log('dimensiones', width, 'y', height);

  const [coinGraphData, setCoinGraphData] = useState({
    ingress: {
      yearlyData: [],
      monthlyData: [],
      weeklyData: [],
      dailyData: [],
      info: {
        mediaPricing: 0,
        lastVariation: 0,
      },
    },
    egress: {
      yearlyData: [],
      monthlyData: [],
      weeklyData: [],
      dailyData: [],
      info: {
        mediaPricing: 0,
        lastVariation: 0,
      },
    },
  });
  const [business, setBusiness] = React.useState({
    productId: '',
    description: '',
  });
  // const [loading, setLoading] = React.useState(true);
  let popUp = false;
  const router = useRouter();
  const {query} = router;
  console.log('query', query);
  //API FUNCTIONS
  const toGetMovementsProducts = (payload) => {
    dispatch(getMovements(payload));
  };
  const convertToDate = (miliseconds) => {
    const fecha = new Date(miliseconds);
    const fecha_actual = `${fecha.getDate()}/${
      fecha.getMonth() < 9 ? `0${fecha.getMonth() + 1}` : fecha.getMonth() + 1
    }/${fecha.getFullYear()} - ${fecha.getHours()}:${
      fecha.getMinutes() < 10 ? `0${fecha.getMinutes()}` : fecha.getMinutes()
    }:${fecha.getSeconds()}`;
    return fecha_actual;
  };

  const convertToDatePretty = (miliseconds) => {
    const fecha = new Date(miliseconds);
    const fecha_actual = `${
      fecha.getMonth() + 1
    }/${fecha.getDate()}/${fecha.getFullYear()}`;
    return fecha_actual;
  };

  const statusObject = (obj, exist, type, mintype, cod) => {
    if (obj.movementSubType == 'sales') {
      if (exist) {
        if (mintype) {
          return (
            <Button
              variant='secondary'
              sx={{fontSize: '1em'}}
              /* disabled={type == 'referralGuide'} */
              onClick={() => showObject(obj.movementHeaderId, type)}
            >
              {`${mintype} - ${cod}`}
            </Button>
          );
        } else {
          if (
            type != 'ticket' &&
            obj.documentsMovement &&
            obj.documentsMovement.length > 0
          ) {
            let serialDocumentObj = obj.documentsMovement.filter(
              (item) => item.typeDocument === type,
            );
            let serialDocument =
              serialDocumentObj &&
              serialDocumentObj.length > 0 &&
              type != 'referralGuide'
                ? serialDocumentObj[0].serialDocument
                : 'Generado';

            if (
              serialDocumentObj &&
              serialDocumentObj.length > 0 &&
              type == 'referralGuide'
            )
              serialDocument =
                serialDocumentObj.length == 1
                  ? serialDocumentObj[0].serialDocument
                  : 'Varias';

            return (
              <Button
                variant='secondary'
                sx={{fontSize: '1em'}}
                /* disabled={type == 'referralGuide'} */
                onClick={() => showObject(obj.movementHeaderId, type)}
              >
                {serialDocument}
              </Button>
            );
          } else if (type == 'ticket') {
            return (
              <Button
                variant='secondary'
                sx={{fontSize: '1em'}}
                /* disabled={type == 'referralGuide'} */
                onClick={() => {
                  window.open(obj.existSellTicket);
                }}
              >
                NRO. {obj.codMovement.split('-')[1]}
              </Button>
            );
          } else {
            return (
              <Button
                variant='secondary'
                sx={{fontSize: '1em'}}
                /* disabled={type == 'referralGuide'} */
                onClick={() => showObject(obj.movementHeaderId, type)}
              >
                Generado
              </Button>
            );
          }
        }
      } else {
        return (
          <Button
            variant='secondary'
            sx={{fontSize: '1em'}}
            onClick={() => generateObject(obj.movementHeaderId, type)}
          >
            No Generado
          </Button>
        );
      }
    } else {
      return 'No aplica';
    }
  };

  //GET APIS RES
  const {loading} = useSelector(({common}) => common);
  const {getMovementsRes} = useSelector(({movements}) => movements);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  console.log('getMovementsRes123', getMovementsRes);
  useEffect(() => {
    // toGetInventoryProducts(listPayload);
    if (query && query !== {} && query.productId) {
      // setLoading(true)
      listPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;
      listPayload.request.payload.businessProductCode = query.product;
      dispatch({type: GET_MOVEMENTS, payload: undefined});

      console.log('ejecutando123', query.productId);
      console.log('ejecutando123', query.productId);
      console.log('description123', query.description);

      setBusiness({
        productId: query.productId,
        description: query.description,
        product: query.product,
      });
      toGetMovementsProducts(listPayload);
      // setActualPath(query.path);
      /* console.log('Tengo miedo csm', getMovementsRes.originalMovements.length); */
      // if(getMovementsRes.length >0){
      //   let aux = getMovementsRes.map(item=>{
      //     return {
      //       name: convertToDatePretty(item.timestampMovement),
      //       gain: item.movementType == 'INPUT' ? item.quantity : 0,
      //       lost: item.movementType == 'OUTPUT' ? item.quantity : 0
      //     }
      //   })

      //   let auxPurchases = getMovementsRes.filter(item=>item.movementType == 'INPUT')
      //     .map(item=>{
      //       return {
      //         name: convertToDatePretty(item.timestampMovement) ,
      //         value: item.priceUnit
      //       }
      //     })

      //   let auxSales = getMovementsRes.filter(item=>item.movementType != 'INPUT')
      //   .map(item=>{
      //     return {
      //       name: convertToDatePretty(item.timestampMovement) ,
      //       value: item.priceUnit
      //     }
      //   })
      //   setProfit(aux)
      //   setPurchases(auxPurchases)
      //   setSales(auxSales)

      //   // setCoinGraphData()
      //   console.log("Tengo mello",getMovementsRes )
      //   let auxInformationGroup =getInformationGrouped(getMovementsRes)
      //   console.log("Esto es cool", auxInformationGroup)
      //   setCoinGraphData(auxInformationGroup);
      //   setStockHistory(auxInformationGroup.stockResult)
      // }
    }
  }, []);
  useEffect(() => {
    console.log('El loading en pleno cambio', loading);
    if (
      !loading &&
      getMovementsRes &&
      getMovementsRes.originalMovements &&
      getMovementsRes.originalMovements.length > 0
    ) {
      console.log('getMovementsRes1000', getMovementsRes.originalMovements);

      let aux = getMovementsRes.originalMovements.map((item) => {
        return {
          name: convertToDatePretty(item.timestampMovement),
          gain: item.movementType == 'INPUT' ? item.quantity : 0,
          lost: item.movementType == 'OUTPUT' ? item.quantity : 0,
        };
      });

      let auxPurchases = getMovementsRes.originalMovements
        .filter((item) => item.movementType == 'INPUT')
        .map((item) => {
          return {
            name: convertToDatePretty(item.timestampMovement),
            value: item.priceUnit,
          };
        });

      let auxSales = getMovementsRes.originalMovements
        .filter((item) => item.movementType != 'INPUT')
        .map((item) => {
          return {
            name: convertToDatePretty(item.timestampMovement),
            value: item.priceUnit,
          };
        });
      setProfit(aux);
      setPurchases(auxPurchases);
      setSales(auxSales);

      // setCoinGraphData()
      console.log('Tengo mello', getMovementsRes.originalMovements);
      let auxInformationGroup = getInformationGrouped(
        getMovementsRes.originalMovements,
      );
      console.log('Esto es cool', auxInformationGroup);

      setCoinGraphData(auxInformationGroup);
      setStockHistory(auxInformationGroup.stockResult);
      setTotalBalanceData({
        coins: [
          {id: 1, name: 'Stock actual', value: auxInformationGroup.stock},
          {
            id: 2,
            name: 'Precio Promedio Compra',
            value: `${translateValue('COINS', 'PEN')} ${
              auxInformationGroup.ingress.info.mediaPricing
            }`,
          },
          {
            id: 3,
            name: 'Precio promedio Venta',
            value: `${translateValue('COINS', 'PEN')} ${
              auxInformationGroup.egress.info.mediaPricing
            }`,
          },
        ],
        productDescription: business.description,
      });
      setCoinsData({
        egress: {
          maxPrice: `${translateValue('COINS', 'PEN')} ${
            auxInformationGroup.egress.info.max
          }`,
          minPrice: `${translateValue('COINS', 'PEN')} ${
            auxInformationGroup.egress.info.min
          }`,
        },
        ingress: {
          maxPrice: `${translateValue('COINS', 'PEN')} ${
            auxInformationGroup.ingress.info.max
          }`,
          minPrice: `${translateValue('COINS', 'PEN')} ${
            auxInformationGroup.ingress.info.min
          }`,
        },
      });
    }
  }, [loading, getMovementsRes]);
  //BUTTONS BAR FUNCTIONS
  const searchProducts = () => {
    // toGetInventoryProducts(listPayload);
    toGetMovementsProducts(listPayload);
  };
  const newProduct = () => {
    Router.push('/sample/products/new');
  };
  //GET APIS RES
  const {listProducts} = useSelector(({products}) => products);
  console.log('products123', listProducts);

  //BUSQUEDA
  const handleSearchValues = (event) => {
    console.log('Evento', event);
    if (event.target.name == 'codeToSearch') {
      if (event.target.value == '') {
        listPayload.request.payload.businessProductCode = null;
      } else {
        listPayload.request.payload.businessProductCode = event.target.value;
      }
    }
    if (event.target.name == 'descToSearch') {
      if (event.target.value == '') {
        listPayload.request.payload.description = null;
      } else {
        listPayload.request.payload.description = event.target.value;
      }
    }
  };

  //FUNCIONES MENU
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [profit, setProfit] = React.useState([]);
  const [purchases, setPurchases] = React.useState([]);
  const [stockHistory, setStockHistory] = React.useState([]);
  const [sales, setSales] = React.useState([]);
  const [openDetails, setOpenDetails] = React.useState(false);
  const [totalBalanceData, setTotalBalanceData] = React.useState({
    values: [],
    productDescription: '',
    coin: '',
  });
  const [coinsData, setCoinsData] = React.useState({
    coin: '',
    ingress: {
      maxPrice: 0,
      minPrice: 0,
    },
    egress: {
      maxPrice: 0,
      minPrice: 0,
    },
  });

  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const goToUpdate = (obj) => {
    console.log('Actualizando', obj);
    /* Router.push({
      pathname: '/sample/products/update',
      query: obj,
    }); */
  };
  const setDeleteState = () => {
    console.log('Borrando producto :(');
  };
  const goToMoves = () => {
    console.log('Llendo a movimientos');
  };

  //SELECCIÓN CALENDARIO
  const [value, setValue] = React.useState(null);
  const [value2, setValue2] = React.useState(null);
  //MANEJO DE FECHAS
  const toEpoch = (strDate) => {
    let someDate = new Date(strDate);
    someDate = someDate.getTime();
    return someDate;
  };

  const defaultValues = {
    date1: '',
    date2: '',
  };

  const cleanList = () => {
    let listResult = [];
    getInventoryProductsRes.map((obj) => {
      //ESTOS CAMPOS DEBEN TENER EL MISMO NOMBRE, TANTO ARRIBA COMO ABAJO
      listResult.push(
        (({product, description, numInputs, numOutputs, stock}) => ({
          product,
          description,
          numInputs,
          numOutputs,
          stock,
        }))(obj),
      );
    });
    return listResult;
  };
  const headersExcel = [
    'Código',
    'Descripción',
    'Nro entradas',
    'Nro salidas',
    'Stock',
  ];
  const exportDoc = () => {
    var ws = XLSX.utils.json_to_sheet(cleanList());
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory');
    XLSX.utils.sheet_add_aoa(ws, [headersExcel], {origin: 'A1'});
    XLSX.writeFile(wb, 'Inventory.xlsx');
  };
  const showPartialStock = (partialStock, movementType) => {
    switch (movementType) {
      case 'INPUT':
        return (
          <Box sx={{display: 'flex'}}>
            {partialStock ? partialStock : 0}
            <ArrowCircleUpIcon
              fontSize='small'
              sx={{ml: 1, color: green[500]}}
            />
          </Box>
        );
      case 'OUTPUT':
        return (
          <Box sx={{display: 'flex'}}>
            {partialStock ? partialStock : 0}
            <ArrowCircleDownIcon
              fontSize='small'
              sx={{ml: 1, color: red[500]}}
            />
          </Box>
        );
      default:
        return null;
    }
  };
  return getMovementsRes ? (
    <Grid container spacing={2} sx={{p: 2}}>
      <Grid item xs={width > 780 ? 12 : 12} sx={{width: '100%'}}>
        <TotalBalance totalBalanceData={totalBalanceData} />
      </Grid>
      <Grid item xs={width > 780 ? 12 : 12} sx={{width: '100%'}}>
        <Coins coinsData={coinsData} />
      </Grid>

      <Grid item xs={width > 780 ? 12 : 12} sx={{width: '100%'}}>
        <Card sx={{p: 4}}>
          <Box sx={{width: 1, mb: '10px'}}>
            <Typography sx={{ml: '10px', fontWeight: 500, fontSize: 18}}>
              Histórico Movimientos
            </Typography>
          </Box>
          <TableContainer component={Paper} sx={{maxHeight: 440}}>
            <Table sx={{minWidth: 650}} stickyHeader aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha Registro</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>SubTipo</TableCell>
                  <TableCell>Precio unitario</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Stock parcial</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getMovementsRes.originalMovements &&
                Array.isArray(getMovementsRes.originalMovements) ? (
                  getMovementsRes.originalMovements.map((obj) => (
                    <TableRow
                      sx={{'&:last-child td, &:last-child th': {border: 0}}}
                      key={obj.product}
                    >
                      <TableCell>
                        {convertToDate(obj.timestampMovement)}
                      </TableCell>
                      {/* tipo */}
                      <TableCell>
                        {/* {translateValue('CONTABLE_MOVEMENTS', obj.movementType)} */}
                        {statusObject(obj, obj.movementType, 'input')}
                      </TableCell>
                      <TableCell>
                        {translateValue('MOVEMENT_TYPES', obj.movementSubType)}
                      </TableCell>
                      <TableCell>{obj.priceUnit}</TableCell>
                      <TableCell>{obj.quantity}</TableCell>
                      <TableCell>
                        {showPartialStock(obj.partialStock, obj.movementType)}
                      </TableCell>
                      {/* <TableCell>{obj.numOutputs}</TableCell>
                    <TableCell>{obj.stock}</TableCell> */}
                    </TableRow>
                  ))
                ) : (
                  <CircularProgress disableShrink sx={{m: '10px'}} />
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <ButtonGroup
            variant='outlined'
            aria-label='outlined button group'
            className={classes.btnGroup}
          >
            <Button
              startIcon={<GridOnOutlinedIcon sx={{mr: 1, my: 'auto'}} />}
              onClick={exportDoc}
              variant='outlined'
              disabled
            >
              Exportar todo
            </Button>
          </ButtonGroup>
        </Card>
      </Grid>

      {query.typeProduct !== 'rawMaterial' ? (
        <Grid item xs={width > 780 ? 12 : 12} sx={{width: '100%'}}>
          <Card sx={{p: 4}}>
            <Box sx={{width: 1, mb: '10px'}}>
              <Typography sx={{ml: '10px', fontWeight: 500, fontSize: 18}}>
                Histórico Receta
              </Typography>
            </Box>
            <TableContainer component={Paper} sx={{maxHeight: 440}}>
              <Table
                sx={{minWidth: 650}}
                stickyHeader
                aria-label='simple table'
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Hora</TableCell>
                    <TableCell align='right'>Mostrar detalle</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getMovementsRes.inputsProductHistory &&
                  Array.isArray(getMovementsRes.inputsProductHistory) ? (
                    getMovementsRes.inputsProductHistory.map((obj, index) => (
                      <>
                        <TableRow
                          sx={{'&:last-child td, &:last-child th': {border: 0}}}
                          key={index}
                        >
                          <TableCell sx={{py: 0}}>
                            {justDate(obj.dateHistory)}
                          </TableCell>
                          <TableCell sx={{py: 0}}>
                            {justTime(obj.dateHistory)}
                          </TableCell>
                          <TableCell
                            hover
                            align='right'
                            sx={{
                              py: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <IconButton
                              onClick={() => {
                                setOpenDetails(false);
                                setOpenDetails(true);
                                if (openDetails == true && rowNumber == index) {
                                  setOpenDetails(false);
                                }
                                setRowNumber(index);
                              }}
                              size='small'
                            >
                              <FormatListBulletedIcon fontSize='small' />
                            </IconButton>
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell
                            style={{paddingBottom: 0, paddingTop: 0}}
                            colSpan={6}
                          >
                            <Collapse
                              in={openDetails && index == rowNumber}
                              timeout='auto'
                              unmountOnExit
                            >
                              <Box sx={{margin: 0}}>
                                <Table size='small' aria-label='purchases'>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Código</TableCell>
                                      <TableCell>Descripcion</TableCell>
                                      <TableCell>Cantidad</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {obj.inputsProduct.map(
                                      (subProduct, index) => {
                                        return (
                                          <TableRow key={index}>
                                            <TableCell>
                                              {subProduct.product}
                                            </TableCell>
                                            <TableCell>
                                              {subProduct.description}
                                            </TableCell>
                                            <TableCell>
                                              {subProduct.quantity}
                                            </TableCell>
                                          </TableRow>
                                        );
                                      },
                                    )}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </>
                    ))
                  ) : (
                    <CircularProgress disableShrink sx={{m: '10px'}} />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      ) : null}

      <Grid item xs={width > 780 ? 8 : 12} sx={{width: '50%'}}>
        <Card sx={{p: 4}}>
          <ProductVsStock data={stockHistory} linex={'Stock'} />
        </Card>
      </Grid>

      {/* <Grid item xs={width > 780 ? 4 : 12} sx={{width: '50%'}}>
        <Card sx={{p: 4}}>
          <Bitcoin graphData={coinGraphData} />
        </Card>
      </Grid> */}
    </Grid>
  ) : (
    <></>
  );
};

export default ProductMovementTable;
