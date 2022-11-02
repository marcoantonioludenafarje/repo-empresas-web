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
  CircularProgress,
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import IntlMessages from '../../../@crema/utility/IntlMessages';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import DataSaverOffOutlinedIcon from '@mui/icons-material/DataSaverOffOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
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
import {getUserData} from '../../../redux/actions/User';

import {
  toEpoch,
  convertToDate,
  convertToDateWithoutTime,
  parseTo3Decimals,
  toSimpleDate,
} from '../../../Utils/utils';
import {getMovements, cancelInvoice} from '../../../redux/actions/Movements';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_FINANCES,
  GET_MOVEMENTS,
  DELETE_FINANCE,
  GET_USER_DATA,
} from '../../../shared/constants/ActionTypes';
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
let merchantIdLocal = '';
let listPayload = {
  request: {
    payload: {
      initialTime: null,
      finalTime: null,
      businessProductCode: null,
      movementType: 'REFERRAL_GUIDE',
      merchantId: '',
      timestampMovement: null,
      searchByBill: null,
      movementHeaderId: null,
      outputId: null,
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
let cancelInvoicePayload = {
  request: {
    payload: {
      merchantId: '',
      numberReferralGuide: '',
      serial: '',
      reason: '',
    },
  },
};
let codProdSelected = '';
let selectedReferralGuide = {};

const ReferralGuidesTable = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const [reload, setReload] = React.useState(0);
  const [confirmCancel, setConfirmCancel] = React.useState(false);
  const [openForm, setOpenForm] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const router = useRouter();
  const {query} = router;
  console.log('query', query);

  //API FUNCTIONS
  const toGetMovements = (payload) => {
    dispatch(getMovements(payload));
  };
  const getBusinessParameter = (payload) => {
    dispatch(onGetBusinessParameter(payload));
  };
  const getGlobalParameter = (payload) => {
    dispatch(onGetGlobalParameter(payload));
  };
  const toCancelInvoice = (payload) => {
    dispatch(cancelInvoice(payload));
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
      dispatch({type: GET_MOVEMENTS, payload: undefined});
      dispatch({type: GET_FINANCES, payload: undefined});

      listPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;
      cancelInvoicePayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;
      businessParameterPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;

      if (Object.keys(query).length !== 0) {
        console.log('Query con datos', query);
        listPayload.request.payload.outputId = query.movementHeaderId;
      }
      toGetMovements(listPayload);
      if (Object.keys(query).length !== 0) {
        listPayload.request.payload.movementHeaderId = null;
      }
      getBusinessParameter(businessParameterPayload);
      getGlobalParameter(globalParameterPayload);
    }
  }, [userDataRes]);

  //FUNCIONES MENU
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (codInput, event) => {
    setAnchorEl(event.currentTarget);
    codProdSelected = codInput;
    selectedReferralGuide = getMovementsRes[codInput];
    console.log('selectedReferralGuide', selectedReferralGuide);
  };
  const handleClose = () => {
    setAnchorEl(null);
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

  const goToUpdate = () => {
    console.log(' factura', selectedReferralGuide);
    Router.push({pathname: '/sample/bills/get', query: selectedReferralGuide});
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
    } else if (errorMessage != undefined) {
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
      return (
        <CircularProgress
          disableShrink
          sx={{m: '10px', position: 'relative'}}
        />
      );
    }
  };

  const compare = (a, b) => {
    if (a.createdDate < b.createdDate) {
      return 1;
    }
    if (a.createdDate > b.createdDate) {
      return -1;
    }
    return 0;
  };
  const showPaymentMethod = (type) => {
    switch (type) {
      case 'CASH':
        return <IntlMessages id='payment.method.debit' />;
        break;
      case 'CREDIT':
        return <IntlMessages id='payment.method.credit' />;
        break;
      default:
        return null;
    }
  };
  const showIconStatus = (bool) => {
    switch (bool) {
      case true:
        return <CheckCircleIcon color='success' />;
        break;
      case false:
        return <CancelIcon sx={{color: red[500]}} />;
        break;
      default:
        return null;
    }
  };

  const setDeleteState = () => {
    setOpen2(true);
    handleClose();
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
          onClick={() => searchInputs()}
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
              <TableCell>Fecha de emisión</TableCell>
              <TableCell>Número de serie</TableCell>
              <TableCell>Número de guía de remisión</TableCell>
              <TableCell>Motivo</TableCell>
              <TableCell>Receptor</TableCell>
              <TableCell>Observación</TableCell>
              <TableCell>Enviado a Sunat</TableCell>
              <TableCell>Aceptado por Sunat</TableCell>
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getMovementsRes &&
            Array.isArray(getMovementsRes) &&
            getMovementsRes[0] &&
            getMovementsRes[0].movementType == 'REFERRAL_GUIDE' ? (
              getMovementsRes.sort(compare).map((obj, index) => (
                <TableRow
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  key={index}
                >
                  <TableCell>
                    {convertToDateWithoutTime(obj.timestampMovement)}
                  </TableCell>
                  <TableCell>{`${obj.documentIntern.split('-')[0]}`}</TableCell>
                  <TableCell>{`${obj.documentIntern.split('-')[1]}`}</TableCell>
                  <TableCell>{obj.reasonForTransfer || ''} </TableCell>
                  <TableCell>
                    {`${obj.clientId.split('-')[1]}` +
                      ' ' +
                      obj.denominationClient}
                  </TableCell>
                  <TableCell>{obj.observation || ''} </TableCell>
                  <TableCell align='center'>
                    {showIconStatus(obj.sendingStatus)}
                  </TableCell>
                  <TableCell align='center'>
                    {showIconStatus(obj.acceptedStatus)}
                  </TableCell>
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
        <Button variant='outlined' startIcon={<GridOnOutlinedIcon />}>
          Exportar todo
        </Button>
      </ButtonGroup>

      <Dialog
        open={openStatus}
        onClose={() => setOpenStatus(false)}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Anulación de factura'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          {showMessage()}
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={() => setOpenStatus(false)}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => window.open(selectedReferralGuide.linkPdf)}>
          <LocalAtmIcon sx={{mr: 1, my: 'auto'}} />
          Ver PDF
        </MenuItem>
        <MenuItem disabled>
          <DataSaverOffOutlinedIcon sx={{mr: 1, my: 'auto'}} />
          Consultar Estado
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default ReferralGuidesTable;
