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
  Stack,
  TextField,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Typography,
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import IntlMessages from '../../../@crema/utility/IntlMessages';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
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
import {getUserData} from '../../../redux/actions/User';
import {exportExcelTemplateToBills} from '../../../redux/actions/General';

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
import {
  toEpoch,
  convertToDateWithoutTime,
  translateValue,
} from '../../../Utils/utils';
import AddReasonForm from '../ReasonForm/AddReasonForm';
import {getBillItems_pageListBill, cancelInvoice} from '../../../redux/actions/Movements';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_MOVEMENTS,
  CANCEL_INVOICE,
  GET_USER_DATA,
  GET_BILL_PAGE_LISTGUIDE,
  GENERATE_EXCEL_TEMPLATE_TO_BILLS,
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
      initialTime: toEpoch(Date.now() - 89280000),
      finalTime: toEpoch(Date.now()),
      businessProductCode: null,
      movementType: 'BILL',
      merchantId: '',
      createdAt: null,
      searchByBill: '',
      movementHeaderId: '',
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
      movementHeaderId: '',
      merchantId: '',
      numberBill: '',
      serial: '',
      reason: '',
      outputId: '',
    },
  },
};
let codProdSelected = '';
let selectedBill = {};

const BillsTable = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const [reload, setReload] = React.useState(0);
  const [confirmCancel, setConfirmCancel] = React.useState(false);
  const [openForm, setOpenForm] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [downloadExcel, setDownloadExcel] = React.useState(false);
  const router = useRouter();
  const {query} = router;
  console.log('query', query);
  const [loading, setLoading] = React.useState(true);
  const {excelTemplateGeneratedToBillsRes} = useSelector(
    ({general}) => general,
  );
  //API FUNCTIONS
  const toGetMovements = (payload) => {
    dispatch(getBillItems_pageListBill(payload));
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
  const toExportExcelTemplateToBills = (payload) => {
    dispatch(exportExcelTemplateToBills(payload));
  };

  const useForceUpdate = () => {
    return () => setReload((value) => value + 1); // update the state to force render
  };

  const handleNextPage = (event) => {
    //console.log('Llamando al  handleNextPage', handleNextPage);    
    listPayload.request.payload.LastEvaluatedKey = billLastEvalutedKey_pageListBill;
    console.log('listPayload111:handleNextPage:',listPayload)
    toGetMovements(listPayload);
    // setPage(page+1);
  };

  let money_unit;
  let weight_unit;
  let exchangeRate;

  //GET APIS RES
  const {billItems_pageListBill, billLastEvalutedKey_pageListBill} = useSelector(({movements}) => movements);
  //const {getMovementsRes} = useSelector(({movements}) => movements);
  const {dataBusinessRes} = useSelector(({general}) => general);
  console.log('dataBusinessRes', dataBusinessRes);
  let listToUse = billItems_pageListBill;
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
  const {cancelInvoiceRes} = useSelector(({movements}) => movements);
  console.log('cancelInvoiceRes', cancelInvoiceRes);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [billItems_pageListBill]);

  useEffect(() => {
    if (!userDataRes) {
      console.log('Esto se ejecuta notificaciones?');

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
    if (businessParameter !== undefined) {
      weight_unit = businessParameter.find(
        (obj) => obj.abreParametro == 'DEFAULT_WEIGHT_UNIT',
      ).value;
      money_unit = businessParameter.find(
        (obj) => obj.abreParametro == 'DEFAULT_MONEY_UNIT',
      ).value;
    }
  }, [businessParameter]);
  useEffect(() => {
    if (globalParameter) {
      console.log('Parametros globales', globalParameter);
      exchangeRate = globalParameter.find(
        (obj) => obj.abreParametro == 'ExchangeRate_USD_PEN',
      ).value;
      console.log('exchangerate', exchangeRate);
    }
  }, [globalParameter]);

  console.log('Valores default peso', weight_unit, 'moneda', money_unit);

  //BUTTONS BAR FUNCTIONS
  const searchInputs = () => {
    listPayload.request.payload.LastEvaluatedKey = null;
    listPayload.request.payload.outputId = null;
    dispatch({type: GET_BILL_PAGE_LISTGUIDE, payload: {callType: "firstTime"}});
    toGetMovements(listPayload);
  };

  useEffect(() => {
    dispatch({type: GET_BILL_PAGE_LISTGUIDE, payload: {callType: "firstTime"}});
    
    if (userDataRes) {
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      dispatch({type: GET_MOVEMENTS, payload: undefined});

      listPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;
      cancelInvoicePayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;
      businessParameterPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;

      if (Object.keys(query).length !== 0) {
        console.log('Query con datos', query);
        listPayload.request.payload.movementHeaderId = query.billId;
      }
      listPayload.request.payload.LastEvaluatedKey = null;
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
    selectedBill = billItems_pageListBill[codInput];
    console.log('selectedBIll', selectedBill);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //SELECCIÓN CALENDARIO
  const [value, setValue] = React.useState(Date.now() - 89280000);
  const [value2, setValue2] = React.useState(Date.now());
  //MANEJO DE FECHAS
  const toEpoch = (strDate) => {
    let someDate = new Date(strDate);
    someDate = someDate.getTime();
    return someDate;
  };

  const registerSuccess = () => {
    return (
      successMessage != undefined &&
      cancelInvoiceRes != undefined &&
      !('error' in cancelInvoiceRes)
    );
  };
  const registerError = () => {
    return (
      (successMessage != undefined && cancelInvoiceRes) ||
      errorMessage != undefined
    );
  };
  const sendStatus = () => {
    if (registerSuccess()) {
      setOpenStatus(false);
      toGetMovements(listPayload);
    } else if (registerError()) {
      setOpenStatus(false);
    } else {
      setOpenStatus(false);
    }
  };

  const exportToExcel = () => {
    const excelPayload = listPayload;

    console.log('excelPayload', excelPayload);
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: GENERATE_EXCEL_TEMPLATE_TO_BILLS, payload: undefined});
    toExportExcelTemplateToBills(excelPayload);
    setDownloadExcel(true);
  };

  useEffect(() => {
    if (excelTemplateGeneratedToBillsRes && downloadExcel) {
      setDownloadExcel(false);
      const byteCharacters = atob(excelTemplateGeneratedToBillsRes);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Bills.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [excelTemplateGeneratedToBillsRes, downloadExcel]);

  const showMessage = () => {
    if (registerSuccess()) {
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
    } else if (registerError()) {
      return (
        <>
          <CancelOutlinedIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            Se ha producido un error al tratar de eliminar.
            <br />
            {cancelInvoiceRes && 'error' in cancelInvoiceRes
              ? cancelInvoiceRes.error
              : null}
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
      case 'accepted':
        return <CheckCircleIcon color='success' />;
        break;
      case true:
        return <CheckCircleIcon color='success' />;
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
  const showCanceled = (bool) => {
    if (bool) {
      return (
        <Typography sx={{color: 'error.light', fontWeight: '500'}}>
          <IntlMessages sx={{color: 'red'}} id='common.yes' />
        </Typography>
      );
    } else {
      return <></>;
    }
  };

  const setDeleteState = () => {
    setOpen2(true);
    handleClose();
  };

  const cancelBill = (reason) => {
    console.log('Razón', reason);
    cancelInvoicePayload.request.payload.reason = reason;
    cancelInvoicePayload.request.payload.serial =
      selectedBill.serialNumberBill.split('-')[0];
    cancelInvoicePayload.request.payload.numberBill =
      selectedBill.serialNumberBill.split('-')[1];
    cancelInvoicePayload.request.payload.movementHeaderId =
      selectedBill.movementHeaderId;
    cancelInvoicePayload.request.payload.outputId = selectedBill.outputId;
    console.log('payload anular factura', cancelInvoicePayload);
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: CANCEL_INVOICE, payload: undefined});
    toCancelInvoice(cancelInvoicePayload);
    setOpenStatus(true);
    setOpenForm(false);
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
      <span>{`Items: ${billItems_pageListBill.length}`}</span>
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
              <TableCell>Número de factura</TableCell>
              <TableCell>Receptor</TableCell>
              <TableCell>Observación</TableCell>
              <TableCell>Importe total</TableCell>
              <TableCell>Forma de pago</TableCell>
              <TableCell>Aceptado por Sunat</TableCell>
              <TableCell>Anulado?</TableCell>
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {billItems_pageListBill && Array.isArray(billItems_pageListBill) ? (
              billItems_pageListBill.sort(compare).map((obj, index) => (
                <TableRow
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  key={index}
                >
                  <TableCell>
                    {convertToDateWithoutTime(obj.createdAt)}
                  </TableCell>
                  <TableCell>
                    {obj.serialNumberBill && obj.serialNumberBill.includes('-') 
                      ? obj.serialNumberBill.split('-')[0] 
                      : ''}
                  </TableCell>
                  <TableCell>
                    {obj.serialNumberBill && obj.serialNumberBill.includes('-')
                      ? obj.serialNumberBill.split('-')[1]
                      : ''}
                  </TableCell>
                  <TableCell>{obj.denominationClient}</TableCell>
                  <TableCell>{obj.observation}</TableCell>
                  <TableCell>
                    {obj.totalPriceWithIgv
                      ? `${obj.totalPriceWithIgv.toFixed(2)} `
                      : ''}
                  </TableCell>
                  <TableCell>{showPaymentMethod(obj.paymentMethod)}</TableCell>
                  <TableCell align='center'>
                    {showIconStatus(obj.acceptedStatus)}
                  </TableCell>
                  <TableCell align='center'>
                    {showCanceled(obj.cancelStatus)}
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
        {billLastEvalutedKey_pageListBill ? (
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
        <Button variant='outlined' startIcon={<GridOnOutlinedIcon />}>
          Exportar todo
        </Button>
      </ButtonGroup>

      <Dialog
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Anulación de factura'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <PriorityHighIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            ¿Desea anular realmente el documento?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button
            variant='outlined'
            onClick={() => {
              setConfirmCancel(false);
              setOpenForm(true);
            }}
          >
            Sí
          </Button>
          <Button variant='outlined' onClick={() => setConfirmCancel(false)}>
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        fullWidth
        maxWidth='xs'
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Razón para anular factura'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <AddReasonForm sendData={cancelBill} />
        </DialogContent>
      </Dialog>

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
          <Button variant='outlined' onClick={() => sendStatus(false)}>
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
        <MenuItem disabled>
          <DataSaverOffOutlinedIcon sx={{mr: 1, my: 'auto'}} />
          Reenviar
        </MenuItem>
        <MenuItem onClick={() => window.open(selectedBill.linkPdf)}>
          <LocalAtmIcon sx={{mr: 1, my: 'auto'}} />
          Ver PDF
        </MenuItem>
        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/creditNote/register') === true ? (
          <MenuItem
            disabled={
              userDataRes
                ? !userDataRes.merchantSelected.isBillingEnabled
                : false
            }
            onClick={() =>
              Router.push({
                pathname: '/sample/notes/get',
                query: {
                  idBill: selectedBill.movementHeaderId,
                  movementId: selectedBill.outputId,
                  nroBill: selectedBill.serialNumberBill,
                },
              })
            }
          >
            <ReceiptOutlinedIcon sx={{mr: 1, my: 'auto'}} />
            Generar nota
          </MenuItem>
        ) : null}

        {/*  {!selectedBill.cancelStatus &&
        localStorage
          .getItem('pathsBack')
          .includes('/facturacion/bill/cancel') ? (
          <MenuItem
            onClick={() => {
              setConfirmCancel(true), setAnchorEl(null);
            }}
          >
            <DoDisturbAltIcon sx={{mr: 1, my: 'auto'}} />
            Anular
          </MenuItem>
        ) : null} */}
      </Menu>
    </Card>
  );
};

export default BillsTable;
