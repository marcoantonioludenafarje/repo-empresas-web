const XLSX = require('xlsx');
import React, {useEffect} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ButtonGroup,
  Button,
  MenuItem,
  Menu,
  Stack,
  TextField,
  CircularProgress,
  IconButton,
  Box,
  Collapse,
  useTheme,
  useMediaQuery,
  TableSortLabel,
} from '@mui/material';
import {
  getYear,
  getActualMonth,
  translateValue,
  fixDecimals,
  convertToDateWithoutTime,
} from '../../../Utils/utils';

import {ClickAwayListener} from '@mui/base';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CachedIcon from '@mui/icons-material/Cached';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import {red} from '@mui/material/colors';

import { normalizeConfig } from 'next/dist/server/config-shared';
import {makeStyles} from '@mui/styles';
import {useHistory} from 'react-router-dom';
import IntlMessages from '../../../@crema/utility/IntlMessages';

import Router from 'next/router';
import {
  onGetBusinessParameter,
  onGetGlobalParameter,
} from '../../../redux/actions/General';
import {
  onGetProducts,
  deleteProduct,
  getAllProducts,
} from '../../../redux/actions/Products';
import AddFinishedProduct from './AddFinishedProduct';
import {useDispatch, useSelector} from 'react-redux';
import {
  GET_PRODUCTS,
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
  GET_MOVEMENTS,
  ALL_PRODUCTS,
} from '../../../shared/constants/ActionTypes';
import {getUserData} from '../../../redux/actions/User';
import {getShopProducts} from '../../../redux/actions/User';

let selectedProduct = {};
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
}));

// let listPayload = {
//   request: {
//     payload: {
//       businessProductCode: null,
//       description: null,
//       merchantId: '',
//     },
//   },
// };
let deletePayload = {
  request: {
    payload: {
      productId: null,
      businessProductCode: null,
      merchantId: '',
    },
  },
};

let businessParameterPayload = {
  request: {
    payload: {
      abreParametro: null,
      codTipoparametro: null,
      merchantId: '',
    },
  },
};
let globalParameterPayload = {
  request: {
    payload: {
      abreParametro: null,
      codTipoparametro: null,
      country: 'peru',
    },
  },
};
//FORCE UPDATE
const useForceUpdate = () => {
  const [reload, setReload] = React.useState(0); // integer state
  return () => setReload((value) => value + 1); // update the state to force render
};
const ProductTable = (arrayObjs, props) => {
  const classes = useStyles(props);
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();
  const forceUpdate = useForceUpdate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isNotMobile = useMediaQuery(theme.breakpoints.up('lg'));
  const [firstload, setFirstload] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [reload, setReload] = React.useState(0); // integer state
  const [openStatus, setOpenStatus] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [openLimit, setOpenLimit] = React.useState(false);
  const [showAddProd, setShowAddProd] = React.useState(false);
  const [fast, setFast] = React.useState({});
  const [openDetails, setOpenDetails] = React.useState(false);
  const [rowNumber, setRowNumber] = React.useState(0);
  const [descriptionProduct, setDescriptionProduct] = React.useState('');
  const [businessProductCode, setBusinessProductCode] = React.useState('');
  let popUp = false;
  let codProdSelected = '';

  //API FUNCTIONSupdateMovement
  const toGetAllProducts = (payload) => {
    dispatch(getAllProducts(payload));
  };
  const toDeleteProduct = (payload) => {
    dispatch(deleteProduct(payload));
  };
  const getBusinessParameter = (payload) => {
    dispatch(onGetBusinessParameter(payload));
  };
  const getGlobalParameter = (payload) => {
    dispatch(onGetGlobalParameter(payload));
  };
  const getProducts = (payload) => {
    dispatch(onGetProducts(payload));
  };

  let money_unit;
  let weight_unit;
  let exchangeRate;

  //GET APIS RES
  const {listProducts} = useSelector(({products}) => products);
  console.log('products', listProducts);
  const {deleteProductRes} = useSelector(({products}) => products);
  console.log('deleteProductRes', deleteProductRes);
  const {businessParameter} = useSelector(({general}) => general);
  console.log('businessParameter', businessParameter);
  const {globalParameter} = useSelector(({general}) => general);
  console.log('globalParameter123', globalParameter);
  const {successMessage} = useSelector(({products}) => products);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({products}) => products);
  console.log('errorMessage', errorMessage);
  const {userAttributes} = useSelector(({user}) => user);
  console.log('userAttributes', userAttributes);
  const {userDataRes} = useSelector(({user}) => user);
  console.log('userDataRes', userDataRes);
  const {allProductsRes, productsLastEvaluatedKey_pageListProducts} =
    useSelector(({products}) => products);
  console.log('allProductsRes', allProductsRes);

  const [orderBy, setOrderBy] = React.useState(''); // Estado para almacenar el campo de ordenación actual
  const [order, setOrder] = React.useState('asc'); // Estado para almacenar la dirección de ordenación

  const handleNextPage = (event) => {
    //console.log('Llamando al  handleNextPage', handleNextPage);
    let listPayload = {
      request: {
        payload: {
          businessProductCode: '',
          description: '',
          merchantId: userDataRes.merchantSelected.merchantId,
          LastEvaluatedKey: productsLastEvaluatedKey_pageListProducts,
        },
      },
    };
    // listPayload.request.payload.LastEvaluatedKey = productsLastEvaluatedKey_pageListProducts;
    console.log('listPayload111:handleNextPage:', listPayload);
    toGetAllProducts(listPayload);
    // setPage(page+1);
  };

  // Función para manejar el clic en el encabezado de la tabla
  const handleSort = (field, type) => {
    let sortedProducts;

    if (orderBy === field) {
      // Si se hace clic en el mismo encabezado, cambiamos la dirección de ordenación
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(field);
      setOrder('asc');
    }

    sortedProducts = [...allProductsRes].sort((a, b) => {
      let descriptionA = null;
      if (type == 'number' || type == 'date')
        descriptionA =
          (a[`${field}`] ? Number(a[`${field}`].toString()) : 0) ?? 0;
      else descriptionA = (a[`${field}`] ? a[`${field}`].toString() : '') ?? '';

      let descriptionB = null;
      if (type == 'number' || type == 'date')
        descriptionB =
          (b[`${field}`] ? Number(b[`${field}`].toString()) : 0) ?? 0;
      else descriptionB = (b[`${field}`] ? b[`${field}`].toString() : '') ?? '';

      console.log('descriptionA', descriptionA);
      console.log('descriptionB', descriptionB);

      if (order === 'asc') {
        if (type == 'number' || type == 'date')
          return descriptionA - descriptionB;
        else return descriptionA.localeCompare(descriptionB);
      } else {
        if (type == 'number' || type == 'date')
          return descriptionB - descriptionA;
        else return descriptionB.localeCompare(descriptionA);
      }
    });

    dispatch({
      type: ALL_PRODUCTS,
      payload: sortedProducts,
      handleSort: true,
    });
    forceUpdate();
  };
  useEffect(() => {
    if (allProductsRes) {
      forceUpdate();
    }
  }, [allProductsRes]);
  console.log('token en product', localStorage.getItem('jwt'));
  console.log('pathsBack en product', localStorage.getItem('pathsBack'));
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
      //dispatch({type: GET_PRODUCTS, payload: undefined});
      let listPayload = {
        request: {
          payload: {
            businessProductCode: '',
            productSearch: '',
            description: '',
            merchantId: userDataRes.merchantSelected.merchantId,
            LastEvaluatedKey: null,
          },
        },
      };
      // listPayload.request.payload.merchantId =
      //   userDataRes.merchantSelected.merchantId;
      deletePayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;
      businessParameterPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;

      toGetAllProducts(listPayload);
      getBusinessParameter(businessParameterPayload);
      getGlobalParameter(globalParameterPayload);
      setFirstload(false);
    }
  }, [userDataRes]);
  if (
    businessParameter &&
    businessParameter != undefined &&
    businessParameter.length > 1
  ) {
    weight_unit = businessParameter.find(
      (obj) => obj.abreParametro == 'DEFAULT_WEIGHT_UNIT',
    ).value;
    money_unit = businessParameter.find(
      (obj) => obj.abreParametro == 'DEFAULT_MONEY_UNIT',
    ).value;
  }
  if (globalParameter != undefined) {
    console.log('Parametros globales', globalParameter);
    exchangeRate = globalParameter.find(
      (obj) => obj.abreParametro == 'ExchangeRate_USD_PEN',
    ).value;
    console.log('exchangerate', exchangeRate);
  }
  console.log('Valores default peso', weight_unit, 'moneda', money_unit);

  //OPCIONES SPLIT BUTTON
  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  //MILISEGUNDOS A TIEMPO
  const agregarCeroSiEsNecesario = (valor) => {
    if (valor < 10) {
      return '0' + valor;
    } else {
      return '' + valor;
    }
  };
  const milisegundosAMinutosYSegundos = (milisegundos) => {
    const minutos = parseInt(milisegundos / 1000 / 60);
    milisegundos -= minutos * 60 * 1000;
    const segundos = milisegundos / 1000;
    return `${agregarCeroSiEsNecesario(minutos)}:${agregarCeroSiEsNecesario(
      segundos.toFixed(1),
    )}`;
  };

  //BUSQUEDA
  const handleSearchValues = (event) => {
    if (event.target.name == 'codeToSearch') {
      if (event.target.value == '') {
        //listPayload.request.payload.businessProductCode = null;
        setBusinessProductCode(null);
      } else {
        //listPayload.request.payload.businessProductCode = event.target.value;
        event.target.value = event.target.value.toUpperCase();
        setBusinessProductCode(event.target.value.toString());
      }
    }
    if (event.target.name == 'descToSearch') {
      if (event.target.value == '') {
        setDescriptionProduct(null);
        //listPayload.request.payload.description = null;
      } else {
        setDescriptionProduct(event.target.value);
        //listPayload.request.payload.description = event.target.value;
      }
    }
  };

  //BUTTONS BAR FUNCTIONS
  const searchProducts = () => {
    let listPayload = {
      request: {
        payload: {
          businessProductCode: '',
          productSearch: businessProductCode,
          description: descriptionProduct,
          merchantId: userDataRes.merchantSelected.merchantId,
          LastEvaluatedKey: null,
        },
      },
    };
    toGetAllProducts(listPayload);
  };
  // const goApiGofast = () => {

  //   const toGetShopProducts = (payload) => {
  //     dispatch(getShopProducts(payload));
  //   };
  //   let getShopProductsPayload = {
  //       "request": {
  //           "payload": {
  //               "idTienda": 3
  //           }
  //       }
  //   };

  //   toGetShopProducts(getShopProductsPayload);
  // };
  const newProduct = () => {
    console.log(
      'Número de productos actual: ',
      businessParameter.find(
        (obj) => obj.abreParametro == 'CURRENT_COUNT_MOVEMENT',
      ).catalogNumberProducts,
    );
    console.log(
      'Número de productos límite: ',
      userDataRes.merchantSelected.plans.find((obj) => obj.active == true)
        .limits.catalogNumberProducts,
    );
    if (
      businessParameter.find(
        (obj) => obj.abreParametro == 'CURRENT_COUNT_MOVEMENT',
      ).catalogNumberProducts <=
      userDataRes.merchantSelected.plans.find((obj) => obj.active == true)
        .limits.catalogNumberProducts
    ) {
      Router.push('/sample/products/new');
    } else {
      setOpenLimit(true);
    }
  };

  const cleanList = () => {
    let listResult = [];
    allProductsRes.map((obj) => {
      obj.typeProduct1 = showTypeText(obj.typeProduct);
      obj.businessProductCode1 = '' || obj.businessProductCode;

      let dosificacion = '';
      for (let i = 0; i < obj.inputsProduct.length; i++) {
        dosificacion +=
          obj.inputsProduct[i].description +
          ' - ' +
          obj.inputsProduct[i].quantity +
          ' | ';
      }
      dosificacion = dosificacion.replace(/\s*\|\s*$/, '');
      obj.dosificacion = dosificacion;

      //ESTOS CAMPOS DEBEN TENER EL MISMO NOMBRE, TANTO ARRIBA COMO ABAJO
      listResult.push(
        (({
          businessProductCode1,
          description,
          alias,
          customCodeProduct,
          category,
          weight,
          costPriceUnit,
          priceBusinessMoneyWithIgv,
          initialStock,
          typeProduct1,
          dosificacion,
        }) => ({
          businessProductCode1,
          description,
          alias,
          customCodeProduct,
          category,
          weight,
          costPriceUnit,
          priceBusinessMoneyWithIgv,
          initialStock,
          typeProduct1,
          dosificacion,
        }))(obj),
      );
    });
    return listResult;
  };
  const headersExcel = [
    'Código',
    'Descripción',
    'Alias',
    'Cod Aduanero',
    'Categoría',
    `Peso (${weight_unit})`,
    'Precio costo sugerido',
    'Precio venta sugerido',
    'Stock inicial',
    'Tipo',
    'Prod. relacionados',
  ];
  const exportDoc = () => {
    var ws = XLSX.utils.json_to_sheet(cleanList());
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.utils.sheet_add_aoa(ws, [headersExcel], {origin: 'A1'});
    XLSX.writeFile(wb, 'Products.xlsx');
  };

  //FUNCIONES MENU
  const [anchorEl, setAnchorEl] = React.useState(null);
  /* let anchorEl = null; */
  const openMenu = Boolean(anchorEl);
  const handleClick = (codClient, event) => {
    console.log('evento', event);
    console.log('index del map', codClient);
    setAnchorEl(event.currentTarget);
    codProdSelected = codClient;
    selectedProduct = allProductsRes[codClient];
    console.log('selectedProduct', selectedProduct);
    setFast(selectedProduct);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const goToUpdate = () => {
    console.log('Actualizando', selectedProduct);
    Router.push({
      pathname: '/sample/products/update',
      query: selectedProduct,
    });
  };

  const handleClickAway = () => {
    // Evita que se cierre el diálogo haciendo clic fuera del contenido
    // Puedes agregar condiciones adicionales aquí si deseas una lógica más específica.
  };
  const showMessage = () => {
    if (successMessage != undefined) {
      return (
        <>
          <CheckCircleOutlineOutlinedIcon
            color='success'
            sx={{fontSize: '6em', mx: 2}}
          />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            Se ha eliminado la información correctamente.
          </DialogContentText>
        </>
      );
    } else if (errorMessage) {
      return (
        <>
          <CancelOutlinedIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            Se ha producido un error al eliminar.
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink />;
    }
  };

  const sendStatus = () => {
    setOpenStatus(false);
    setTimeout(() => {
      let listPayload = {
        request: {
          payload: {
            businessProductCode: '',
            productSearch: '',
            description: '',
            merchantId: userDataRes.merchantSelected.merchantId,
            LastEvaluatedKey: null,
          },
        },
      };
      getAllProducts(listPayload);
    }, 1000);
  };

  const setDeleteState = () => {
    setOpen2(true);
    handleClose();
  };
  const confirmDelete = () => {
    deletePayload.request.payload.productId = selectedProduct.productId;
    deletePayload.request.payload.merchantId = selectedProduct.merchantId;
    deletePayload.request.payload.businessProductCode = selectedProduct.product;
    toDeleteProduct(deletePayload);
    setOpen2(false);
    setOpenStatus(true);
  };
  const goToMoves = () => {
    console.log('Llendo a movimientos');
  };

  const goToFile = () => {
    // Router.push({
    //   pathname: '/sample/explorer',
    //   query: {
    //     goDirectory: true,
    //     path: 'productos/' + selectedProduct.product.toString(),
    //   },
    // });
    const data = {
      goDirectory: true,
      path: 'productos/' + selectedProduct.product.toString(),
    };
    localStorage.setItem('redirectUrl', JSON.stringify(data));
    window.open('/sample/explorer');
  };

  const diaSemana = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];
  const mesAnyo = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const handleClose2 = () => {
    setOpen2(false);
  };
  const closeAddProd = () => {
    setShowAddProd(false);
  };
  const closeLimit = () => {
    setOpenLimit(false);
  };
  const onChangeHandler = (e) => {
    Router.push('/sample/products/bulk-load');
  };

  const keys_to_keep = [
    'businessProductCode',
    'description',
    'unitMeasure',
    'costPriceUnit',
    'weight',
    'category',
    'imgKey',
    'initialStock',
    'unitMeasureWeight',
    'unitMeasureMoney',
  ];
  const redux = (array) =>
    array.map((o) =>
      keys_to_keep.reduce((acc, curr) => {
        acc[curr] = o[curr];
        return acc;
      }, {}),
    );

  const parsedArray = (array) => {
    let newArray = [];
    array.map((obj) => {
      newArray.push({
        businessProductCode: obj.product,
        description: obj.description,
        unitMeasure: obj.unitMeasure,
        costPriceUnit: obj.costPriceUnit,
        weight: obj.weight,
        category: obj.category,
        imgKey: null,
        initialStock: obj.stock,
      });
    });
    return newArray;
  };

  const showType = (type) => {
    if (type == 'rawMaterial')
      return <IntlMessages id='product.type.rawMaterial' />;
    if (type == 'intermediateProduct')
      return <IntlMessages id='product.type.intermediateProduct' />;
    if (type == 'endProduct')
      return <IntlMessages id='product.type.endProduct' />;
    if (type == 'service') return <IntlMessages id='product.type.service' />;
  };

  const showTypeText = (type) => {
    if (type == 'rawMaterial') return 'Insumo';
    if (type == 'intermediateProduct') return 'Producto intermedio';
    if (type == 'endProduct') return 'Producto terminado';
    if (type == 'service') return 'Servicio';
  };

  const goToMovementsDetail = (product) => {
    console.log('|', product);
    Router.push({
      pathname: '/sample/products/table-movement',
      query: {
        description: selectedProduct.description,
        productId: selectedProduct.productId,
        product: selectedProduct.product,
        typeProduct: selectedProduct.typeProduct,
      },
    });
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

  return (
    <>
      <Stack
        sx={{m: 2}}
        direction={isMobile ? 'column' : 'row'}
        spacing={2}
        className={classes.stack}
      >
        <TextField
          label='Código'
          variant='outlined'
          name='codeToSearch'
          size='small'
          onChange={handleSearchValues}
        />
        <TextField
          label='Descripción'
          variant='outlined'
          name='descToSearch'
          size='small'
          onChange={handleSearchValues}
        />

        <Button
          startIcon={<FilterAltOutlinedIcon />}
          variant='outlined'
          // onClick={goApiGofast}
        >
          Más filtros
        </Button>
        <Button
          startIcon={<ManageSearchOutlinedIcon />}
          variant='contained'
          color='primary'
          onClick={searchProducts}
        >
          Buscar
        </Button>
      </Stack>
      <span>{`Items: ${allProductsRes.length}`}</span>
      <TableContainer component={Paper} sx={{maxHeight: 440}}>
        <Table
          sx={{minWidth: 650}}
          stickyHeader
          size='small'
          aria-label='sticky table'
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'businessProductCode'}
                  direction={orderBy === 'businessProductCode' ? order : 'asc'}
                  onClick={() => handleSort('businessProductCode')}
                >
                  Código
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'typeProduct'}
                  direction={orderBy === 'typeProduct' ? order : 'asc'}
                  onClick={() => handleSort('typeProduct')}
                >
                  Tipo
                </TableSortLabel>
              </TableCell>
              {/* <TableCell>
                <TableSortLabel
                  active={orderBy === 'unitMeasure'}
                  direction={orderBy === 'unitMeasure' ? order : 'asc'}
                  onClick={() => handleSort('unitMeasure')}
                >
                  Prod&Serv
                </TableSortLabel>
              </TableCell> */}
              {isNotMobile ? (
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'description'}
                  direction={orderBy === 'description' ? order : 'asc'}
                  onClick={() => handleSort('description')}
                >
                  Descripción
                </TableSortLabel>
              </TableCell>
              ) : null}
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'alias'}
                  direction={orderBy === 'alias' ? order : 'asc'}
                  onClick={() => handleSort('alias')}
                >
                  Alias
                </TableSortLabel>
              </TableCell>
              {isNotMobile ? (
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'weight'}
                  direction={orderBy === 'weight' ? order : 'asc'}
                  onClick={() => handleSort('weight', 'number')}
                >
                  Peso
                </TableSortLabel>
              </TableCell>
              ) : null}
              {isNotMobile ? (
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'costPriceUnit'}
                  direction={orderBy === 'costPriceUnit' ? order : 'asc'}
                  onClick={() => handleSort('costPriceUnit', 'number')}
                >
                  Precio costo sugerido
                </TableSortLabel>
              </TableCell>
              ) : null}
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'sellPriceUnit'}
                  direction={orderBy === 'sellPriceUnit' ? order : 'asc'}
                  onClick={() => handleSort('sellPriceUnit', 'number')}
                >
                  Precio venta sugerido
                </TableSortLabel>
              </TableCell>
              {isNotMobile ? (
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'initialStock'}
                  direction={orderBy === 'initialStock' ? order : 'asc'}
                  onClick={() => handleSort('initialStock', 'number')}
                >
                  Stock inicial
                </TableSortLabel>
              </TableCell>
              ) : null}
              {isNotMobile ? (
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'createdAt'}
                  direction={orderBy === 'createdAt' ? order : 'asc'}
                  onClick={() => handleSort('createdAt', 'date')}
                >
                  Fecha registrada
                </TableSortLabel>
              </TableCell>
              ) : null}
              {isNotMobile ? (
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'updatedAt'}
                  direction={orderBy === 'updatedAt' ? order : 'asc'}
                  onClick={() => handleSort('updatedAt', 'date')}
                >
                  Última actualización
                </TableSortLabel>
              </TableCell>
              ) : null}
              <TableCell align="center"  sx={{px: isNotMobile ? normalizeConfig : 0, width: isNotMobile ? normalizeConfig : "16px"}}>{isNotMobile ? "Opciones" : "#"}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allProductsRes && Array.isArray(allProductsRes) ? (
              allProductsRes.map((obj, index) => {
                const style = obj.typeProduct != 'rawMaterial' ? 'flex' : null;
                return (
                  <>
                    <TableRow
                      sx={{'&:last-child td, &:last-child th': {border: 0}}}
                      key={index}
                    >
                      <TableCell>{obj.businessProductCode}</TableCell>
                      <TableCell>{showType(obj.typeProduct)}</TableCell>
                      {/* <TableCell>{obj.unitMeasure == 'ZZ' ? 'SERVICIO' : 'PRODUCTO'}</TableCell> */}
                      <TableCell
                        hover
                        sx={{
                          display: style,
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        {obj.description}
                        {obj.typeProduct == 'endProduct' ||
                        obj.typeProduct == 'intermediateProduct' ? (
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
                        ) : (
                          <></>
                        )}
                      </TableCell>
                      {isNotMobile ? (
                      <TableCell>{`${obj.alias ? obj.alias : ''}`}</TableCell>
                      ) : null}
                      {isNotMobile ? (
                      <TableCell>{`${obj.weight} ${weight_unit}`}</TableCell>
                      ) : null}
                      {isNotMobile ? (
                      <TableCell>{`${obj.costPriceUnit.toFixed(
                        3,
                      )} ${money_unit}`}</TableCell>
                      ) : null}
                      <TableCell>{`${obj.priceBusinessMoneyWithIgv.toFixed(
                        3,
                      )} ${money_unit}`}</TableCell>
                      {isNotMobile ? (
                      <TableCell>{obj.initialStock}</TableCell>
                      ) : null}
                      {isNotMobile ? (
                      <TableCell>
                        {convertToDateWithoutTime(obj.createdAt)}
                      </TableCell>
                      ) : null}
                      {isNotMobile ? (
                      <TableCell>
                        {convertToDateWithoutTime(
                          obj.updatedAt || obj.updatedDate,
                        )}
                      </TableCell>
                      ) : null}
                      <TableCell  sx={{px: isNotMobile ? normalizeConfig : 0, width: isNotMobile ? normalizeConfig : "16px"}}>
                        <Button
                          sx={{px: isNotMobile ? normalizeConfig : 0, minWidth: isNotMobile ? normalizeConfig : "16px"}}
                          id='basic-button'
                          aria-controls={openMenu ? 'basic-menu' : undefined}
                          aria-haspopup='true'
                          aria-expanded={openMenu ? 'true' : undefined}
                          onClick={handleClick.bind(this, index)}
                        >
                          <KeyboardArrowDownIcon />
                        </Button>
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
                                {obj.inputsProduct.map((subProduct, index) => {
                                  return (
                                    <TableRow key={index}>
                                      <TableCell>
                                        {subProduct.businessProductCode != null
                                          ? subProduct.businessProductCode
                                          : subProduct.productId
                                              .replace(/^(0+)/g, '')
                                              .split('-')[0]}
                                      </TableCell>
                                      <TableCell>
                                        {subProduct.description}
                                      </TableCell>
                                      <TableCell>
                                        {subProduct.quantity}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
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
              <CircularProgress disableShrink sx={{m: '10px'}} />
            )}
          </TableBody>
        </Table>
        {productsLastEvaluatedKey_pageListProducts ? (
          <Stack spacing={2}>
            <IconButton onClick={() => handleNextPage()} size='small'>
              Siguiente <ArrowForwardIosIcon fontSize='inherit' />
            </IconButton>
          </Stack>
        ) : null}
      </TableContainer>
      <ButtonGroup
        variant='outlined'
        aria-label='outlined button group'
        className={classes.btnGroup}
      >
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/products/register') === true ? (
          <Button
            variant='outlined'
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={newProduct}
          >
            Nuevo
          </Button>
        ) : null}

        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/exportProducts/*') === true ? (
          <Button
            variant='outlined'
            startIcon={<GridOnOutlinedIcon />}
            onClick={exportDoc}
          >
            Exportar todo
          </Button>
        ) : null}

        {!popUp ? (
          <>
            <Button
              variant='outlined'
              startIcon={<FileUploadOutlinedIcon />}
              component='label'
              onClick={onChangeHandler}
              disabled
            >
              Carga Masiva
              {/* <input
                type='file'
                hidden
                id='file'
                name='file'
                accept='.xlsx, .csv'
              /> */}
            </Button>
          </>
        ) : (
          <CircularProgress disableShrink sx={{m: '10px'}} />
        )}
      </ButtonGroup>

      <ClickAwayListener onClickAway={handleClickAway}>
        <Dialog
          open={openStatus}
          onClose={sendStatus}
          sx={{textAlign: 'center'}}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
            {'Eliminar Producto'}
          </DialogTitle>
          <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
            {showMessage()}
          </DialogContent>
          <DialogActions sx={{justifyContent: 'center'}}>
            <Button variant='outlined' onClick={sendStatus}>
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      </ClickAwayListener>
      <Dialog
        open={open2}
        onClose={handleClose2}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Eliminar producto'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <PriorityHighIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            ¿Desea eliminar realmente la información seleccionada?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={confirmDelete}>
            Sí
          </Button>
          <Button variant='outlined' onClick={handleClose2}>
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openLimit}
        onClose={closeLimit}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'LÍMITE DE REGISTROS'}
          <CancelOutlinedIcon
            onClick={closeLimit}
            sx={{
              cursor: 'pointer',
              float: 'right',
              marginTop: '5px',
              width: '20px',
            }}
          />
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <PriorityHighIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            Se alcanzó el límite de registros de productos. Si desea ampliar el
            límite, solicite migrar a un nuevo plan.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={closeLimit}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showAddProd}
        onClose={closeAddProd}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'GENERAR PRODUCCIÓN'}
          <CancelOutlinedIcon
            onClick={closeAddProd}
            sx={{
              cursor: 'pointer',
              float: 'right',
              marginTop: '5px',
              width: '20px',
            }}
          />
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <AddFinishedProduct
            product={fast}
            listProducts={allProductsRes}
            closeAddProd={closeAddProd}
          />
        </DialogContent>
      </Dialog>
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/products/update') === true ? (
          <MenuItem onClick={goToUpdate}>
            <CachedIcon sx={{mr: 1, my: 'auto'}} />
            Actualizar
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/products/delete') === true ? (
          <MenuItem disabled onClick={setDeleteState}>
            <DeleteOutlineOutlinedIcon sx={{mr: 1, my: 'auto'}} />
            Eliminar
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/movementProducts/list') === true ? (
          <MenuItem disabled onClick={goToMoves}>
            <CompareArrowsOutlinedIcon sx={{mr: 1, my: 'auto'}} />
            Movimientos
          </MenuItem>
        ) : null}

        {localStorage
          .getItem('pathsBack')
          .includes('/utility/listObjectsPathMerchant') === true ? (
          <MenuItem onClick={goToFile}>
            <FolderOpenIcon sx={{mr: 1, my: 'auto'}} />
            Archivos
          </MenuItem>
        ) : null}

        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/movementProducts/list?path=/tracking/*') ===
        true ? (
          <MenuItem onClick={() => goToMovementsDetail()}>
            <LeaderboardIcon sx={{mr: 1, my: 'auto'}} />
            Tracking
          </MenuItem>
        ) : null}

        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/products/produce') &&
        selectedProduct.typeProduct != 'rawMaterial' ? (
          <MenuItem onClick={setShowAddProd.bind(this, true)}>
            <AddCircleOutlineOutlinedIcon sx={{mr: 1, my: 'auto'}} />
            Crear producto <br />
            terminado
          </MenuItem>
        ) : null}
      </Menu>
    </>
  );
};

export default ProductTable;
