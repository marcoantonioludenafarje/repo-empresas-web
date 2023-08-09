import React, {useEffect} from 'react';
import AppPageMeta from '../../../@crema/core/AppPageMeta';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {makeStyles} from '@mui/styles';

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import {red} from '@mui/material/colors';

import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {
  DesktopDatePicker,
  DateTimePicker,
  MobileDateTimePicker,
} from '@mui/lab';
import {CalendarPicker} from '@mui/lab';

import Router, {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {
  onGetBusinessParameter,
  onGetGlobalParameter,
} from '../../../redux/actions/General';
import {getMovements, deleteMovement} from '../../../redux/actions/Movements';
import {
  toEpoch,
  convertToDate,
  parseTo3Decimals,
  toSimpleDate,
} from '../../../Utils/utils';
const XLSX = require('xlsx');

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
}));
let deletePayload = {
  request: {
    payload: {
      movementType: 'INPUT',
      movementTypeMerchantId: '',
      timestampMovement: null,
      movementHeaderId: '',
    },
  },
};
let listPayload = {
  request: {
    payload: {
      initialTime: null,
      finalTime: null,
      businessProductCode: null,
      movementType: 'INPUT',
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
let codProdSelected = '';
let selectedInput = {};

const InputsTable = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  let popUp = false;
  const [reload, setReload] = React.useState(0);
  const [openStatus, setOpenStatus] = React.useState(false);

  //API FUNCTIONS
  const toGetMovements = (payload) => {
    dispatch(getMovements(payload));
  };
  const toDeleteMovement = (payload) => {
    dispatch(deleteMovement(payload));
  };
  const getBusinessParameter = (payload) => {
    dispatch(onGetBusinessParameter(payload));
  };
  const getGlobalParameter = (payload) => {
    dispatch(onGetGlobalParameter(payload));
  };

  const useForceUpdate = () => {
    return () => setReload((value) => value + 1); // update the state to force render
  };

  let money_unit;
  let weight_unit;
  let exchangeRate;

  //GET APIS RES
  const {getMovementsRes} = useSelector(({movements}) => movements);
  console.log('getMovementsRes', getMovementsRes);
  let listToUse = getMovementsRes;
  const {successMessage} = useSelector(({movements}) => movements);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({movements}) => movements);
  console.log('errorMessage', errorMessage);
  const {businessParameter} = useSelector(({general}) => general);
  console.log('businessParameter', businessParameter);
  const {globalParameter} = useSelector(({general}) => general);
  console.log('globalParameter123', globalParameter);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);

  listPayload.request.payload.merchantId =
    userDataRes.merchantSelected.merchantId;
  businessParameterPayload.request.payload.merchantId =
    userDataRes.merchantSelected.merchantId;

  if (businessParameter != undefined) {
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

  //BUTTONS BAR FUNCTIONS
  const searchInputs = () => {
    toGetMovements(listPayload);
  };
  const newProduct = () => {
    Router.push('/sample/inputs/new');
  };

  const cleanList = () => {
    let listResult = [];
    getMovementsRes.map((obj) => {
      //ESTOS CAMPOS DEBEN TENER EL MISMO NOMBRE, TANTO ARRIBA COMO ABAJO
      obj.createdAt = convertToDate(obj.createdAt);
      listResult.push(
        (({
          createdAt,
          documentIntern,
          providerName,
          descriptionProducts,
          totalQuantity,
          totalPriceWithIgv,
        }) => ({
          createdAt,
          documentIntern,
          providerName,
          descriptionProducts,
          totalQuantity,
          totalPriceWithIgv,
        }))(obj),
      );
    });
    return listResult;
  };
  const headersExcel = [
    'Fecha registrada',
    'Documento',
    'Proveedor',
    'Detalle productos',
    'Cantidad',
    'Precio total',
    '',
  ];
  const exportDoc = () => {
    var ws = XLSX.utils.json_to_sheet(cleanList());
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inputs');
    XLSX.utils.sheet_add_aoa(ws, [headersExcel], {origin: 'A1'});
    XLSX.writeFile(wb, 'Inputs.xlsx');
  };

  useEffect(() => {
    toGetMovements(listPayload);
    getBusinessParameter(businessParameterPayload);
    getGlobalParameter(globalParameterPayload);
  }, []);

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
  const handleClick = (codInput, event) => {
    setAnchorEl(event.currentTarget);
    codProdSelected = codInput;
    selectedInput = getMovementsRes[codInput];
    console.log('selectedProduct', selectedInput);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const goToUpdate = () => {
    console.log('Actualizando', selectedInput);
    Router.push({
      pathname: '/sample/inputs/update',
      query: selectedInput,
    });
  };
  const setDeleteState = () => {
    deletePayload.request.payload.movementTypeMerchantId =
      selectedInput.movementTypeMerchantId;
    deletePayload.request.payload.timestampMovement =
      selectedInput.timestampMovement;
    deletePayload.request.payload.movementHeaderId =
      selectedInput.movementHeaderId;
    toDeleteMovement(deletePayload);
    handleClose();
    setTimeout(() => {
      setOpenStatus(true);
    }, 1000);
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

  const sendStatus = () => {
    setOpenStatus(false);
    setTimeout(() => {
      toGetMovements(listPayload);
    }, 2200);
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
            Se elimino correctamente.
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
            Se ha producido un error al tratar de eliminar.
          </DialogContentText>
        </>
      );
    } else {
      return <></>;
    }
  };

  return (
    <Card sx={{p: 4}}>
      <Stack sx={{m: 2}} direction='row' spacing={2} className={classes.stack}>
        <DateTimePicker
          renderInput={(params) => <TextField size='small' {...params} />}
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
          renderInput={(params) => <TextField size='small' {...params} />}
          label='Fin'
          inputFormat='dd/MM/yyyy hh:mm a'
          value={value2}
          onChange={(newValue2) => {
            setValue2(newValue2);
            console.log('date 2', newValue2);
            listPayload.request.payload.finalTime = toEpoch(newValue2);
            console.log('payload de busqueda', listPayload);
          }}
        />
        <Button variant='outlined' startIcon={<FilterAltOutlinedIcon />}>
          Más filtros
        </Button>
        <Button
          variant='contained'
          startIcon={<ManageSearchOutlinedIcon />}
          color='primary'
          onClick={searchInputs}
        >
          Buscar
        </Button>
      </Stack>
      <TableContainer component={Paper} sx={{maxHeight: 440}}>
        <Table
          sx={{minWidth: 650}}
          stickyHeader
          size='small'
          aria-label='simple table'
        >
          <TableHead>
            <TableRow>
              <TableCell>Fecha registrada</TableCell>
              <TableCell>Documento</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Detalle productos</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio total</TableCell>
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getMovementsRes && typeof getMovementsRes !== 'string' ? (
              getMovementsRes.map((obj, index) => (
                <TableRow
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  key={index}
                >
                  <TableCell>{convertToDate(obj.timestampMovement)}</TableCell>
                  <TableCell>{obj.documentIntern}</TableCell>
                  <TableCell>{obj.providerName}</TableCell>
                  <TableCell>{obj.descriptionProducts}</TableCell>
                  <TableCell>{obj.totalQuantity}</TableCell>
                  <TableCell>{`${obj.totalPrice.toFixed(
                    2,
                  )} ${money_unit}`}</TableCell>
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
                    <Menu
                      id='basic-menu'
                      anchorEl={anchorEl}
                      open={openMenu}
                      onClose={handleClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                      elevation={1}
                    >
                      <MenuItem onClick={goToUpdate}>
                        <CachedIcon sx={{mr: 1, my: 'auto'}} />
                        Actualizar
                      </MenuItem>
                      <MenuItem onClick={setDeleteState}>
                        <DeleteOutlineOutlinedIcon sx={{mr: 1, my: 'auto'}} />
                        Eliminar
                      </MenuItem>
                      <MenuItem onClick={goToMoves}>
                        <GridOnOutlinedIcon sx={{mr: 1, my: 'auto'}} />
                        Exportar
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <></>
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
          variant='outlined'
          startIcon={<AddCircleOutlineOutlinedIcon />}
          onClick={newProduct}
        >
          Nuevo
        </Button>
        {!popUp ? (
          <>
            <Button
              variant='outlined'
              startIcon={<GridOnOutlinedIcon />}
              onClick={exportDoc}
            >
              Exportar todo
            </Button>
          </>
        ) : (
          <></>
        )}
      </ButtonGroup>
      <Dialog
        open={openStatus}
        onClose={sendStatus}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Registro de Producto'}
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
    </Card>
  );
};

export default InputsTable;
