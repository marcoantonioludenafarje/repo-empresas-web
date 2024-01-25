import React, {useEffect} from 'react';
import AppPageMeta from '../../../@crema/core/AppPageMeta';
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
  MenuItem,
  Menu,
  MenuList,
  ClickAwayListener,
  Popper,
  Grow,
  Stack,
  TextField,
  Card,
  Box,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Badge,
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

import Router from 'next/router';
import * as yup from 'yup';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {DesktopDatePicker, DateTimePicker} from '@mui/lab';
import {CalendarPicker} from '@mui/lab';
import {getUserData} from '../../../redux/actions/User';

import {useDispatch, useSelector} from 'react-redux';
import {getInventoryProducts} from '../../../redux/actions/Movements';
import {Form, Formik} from 'formik';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
  GET_INVENTORY_PRODUCTS,
} from '../../../shared/constants/ActionTypes';
let selectedProduct = {};

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

let listPayload = {
  request: {
    payload: {
      initialTime: null,
      finalTime: null,
      businessProductCode: null,
      movementType: null,
      merchantId: '',
      createdAt: null,
    },
  },
};

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

const InventoryTable = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  let popUp = false;
  let codProdSelected = '';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [openWarehouse, setOpenWarehouse] = React.useState(false);
  const [fast, setFast] = React.useState({});

  //API FUNCTIONS
  const toGetInventoryProducts = (payload) => {
    dispatch(getInventoryProducts(payload));
  };

  //GET APIS RES
  const {getInventoryProductsRes} = useSelector(({movements}) => movements);
  console.log('getInventoryProductsRes', getInventoryProductsRes);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);

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
      dispatch({type: GET_INVENTORY_PRODUCTS, payload: undefined});

      listPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;

      toGetInventoryProducts(listPayload);
    }
  }, [userDataRes]);

  //BUTTONS BAR FUNCTIONS
  const searchProducts = () => {
    listPayload.request.payload.merchantId =
      userDataRes.merchantSelected.merchantId;

    toGetInventoryProducts(listPayload);
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
  const openMenu = Boolean(anchorEl);

  const handleClick = (codClient, event) => {
    console.log('evento', event);
    console.log('index del map', codClient);
    setAnchorEl(event.currentTarget);
    codProdSelected = codClient;
    selectedProduct = getInventoryProductsRes[codClient];
    console.log('selectedProduct', selectedProduct);
    setFast(selectedProduct);
  };
  const handleWarehouseClick = (product, event) => {
    console.log('evento', event);
    console.log('index del map', product);
    setOpenWarehouse(true);
    codProdSelected = product;
    selectedProduct = getInventoryProductsRes[product];
    console.log('selectedProduct', selectedProduct);
    setFast(selectedProduct);
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

  //FUNCION TRACKING
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

  return (
    <Card sx={{p: 4}}>
      <Formik
        validateOnChange={true}
        validationSchema={validationSchema}
        initialValues={defaultValues}
        onSubmit={(data, {setSubmitting}) => {
          setSubmitting(true);
          console.log('Data recibida', {...data});
          setSubmitting(false);
        }}
      >
        {({isSubmitting}) => (
          <Stack
            sx={{m: 2}}
            direction={isMobile ? 'column' : 'row'}
            spacing={2}
            className={classes.stack}
          >
            <DateTimePicker
              renderInput={(params) => (
                <TextField
                  /* className={classes.datePicker} */ size='small'
                  {...params}
                />
              )}
              value={value}
              label='Inicio'
              inputFormat='dd/MM/yyyy hh:mm a'
              onChange={(newValue) => {
                setValue(newValue);
                console.log('date', newValue);
                listPayload.request.payload.initialTime = toEpoch(newValue);
                console.log('payload de busqueda', listPayload);
              }}
            />
            <DateTimePicker
              renderInput={(params) => (
                <TextField
                  /* className={classes.datePicker} */ size='small'
                  {...params}
                />
              )}
              inputFormat='dd/MM/yyyy hh:mm a'
              label='Fin'
              value={value2}
              onChange={(newValue2) => {
                setValue2(newValue2);
                console.log('date 2', newValue2);
                listPayload.request.payload.finalTime = toEpoch(newValue2);
                console.log('payload de busqueda', listPayload);
              }}
            />
            <Button
              startIcon={<FilterAltOutlinedIcon />}
              size='small'
              variant='outlined'
            >
              Más filtros
            </Button>
            <Button
              startIcon={<ManageSearchOutlinedIcon />}
              variant='contained'
              size='small'
              color='primary'
              onClick={searchProducts}
            >
              Buscar
            </Button>
          </Stack>
        )}
      </Formik>

      <TableContainer component={Paper} sx={{maxHeight: 440}}>
        <Table sx={{minWidth: 650}} stickyHeader aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Entradas/Salidas</TableCell>
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getInventoryProductsRes &&
            // && getInventoryProductsRes.length > 0
            Array.isArray(getInventoryProductsRes) ? (
              getInventoryProductsRes.map((obj, index) => (
                <TableRow
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  key={obj.product}
                >
                  <TableCell>
                    {obj.businessProductCode || obj.product}
                  </TableCell>
                  <TableCell>{obj.description}</TableCell>
                  <TableCell>
                    <Badge 
                      badgeContent={obj.stock} 
                      color="primary" 
                      anchorOrigin={{
                        vertical: 'left',
                        horizontal: 'right',
                      }}
                    >
                      <Button
                        id='basic-button'
                        aria-controls={openWarehouse ? true : undefined}
                        aria-haspopup='true'
                        aria-expanded={openWarehouse ? true : undefined}
                        onClick={handleWarehouseClick.bind(this, index)}
                      >
                        <WarehouseIcon />
                      </Button>
                    </Badge>
                  </TableCell>
                  <TableCell>{`${obj.numOutputs} / ${obj.numInputs}`}</TableCell>
                  <TableCell>
                    <Button
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
        >
          Exportar todo
        </Button>
      </ButtonGroup>
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
          .includes('/inventory/movementProducts/list?path=/tracking/*') ===
        true ? (
          <MenuItem onClick={() => goToMovementsDetail()}>
            <LeaderboardIcon sx={{mr: 1, my: 'auto'}} />
            Tracking
          </MenuItem>
        ) : null}
      </Menu>
      <Dialog
          open={openWarehouse}
          onClose={()=>setOpenWarehouse(false)}
          sx={{textAlign: 'center'}}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
            {fast.description}
          </DialogTitle>
          <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
            <TableContainer component={Paper} sx={{maxHeight: 440}}>
              <Table sx={{minWidth: 650}} stickyHeader aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell>Código</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Cantidad</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fast.locations &&
                  Array.isArray(fast.locations) ? (
                    fast.locations.map((obj, index) => (
                      <TableRow
                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        key={obj.locationName}
                      >
                        <TableCell>
                          {obj.locationName.split("-")[0]}
                        </TableCell>
                        <TableCell>{obj.locationName.split("-")[1]}</TableCell>
                        <TableCell>{obj.stock}</TableCell>
                      </TableRow>
                    ))
                  ) : null}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions sx={{justifyContent: 'center'}}>
            <Button variant='outlined' onClick={()=>setOpenWarehouse(false)}>
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
    </Card>
  );
};

export default InventoryTable;
