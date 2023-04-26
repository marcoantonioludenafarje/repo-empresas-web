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
  IconButton,
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
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import IntlMessages from '../../../@crema/utility/IntlMessages';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
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
import {
  excelTemplateGeneratedToReceiptsRes,
  exportExcelTemplateToReceipts,
} from '../../../redux/actions/General';
import CloseIcon from '@mui/icons-material/Close';
import MoreFiltersDocumentSunat from '../Filters/MoreFiltersDocumentSunat';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {
  DesktopDatePicker,
  DateTimePicker,
  MobileDateTimePicker,
} from '@mui/lab';
import {CalendarPicker} from '@mui/lab';
import {getUserData} from '../../../redux/actions/User';

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
import {
  getReceiptItems_pageListReceipt,
  cancelInvoice,
} from '../../../redux/actions/Movements';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_MOVEMENTS,
  GET_USER_DATA,
  GET_RECEIPT_PAGE_LISTGUIDE,
  GENERATE_EXCEL_TEMPLATE_TO_RECEIPTS,
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
      movementType: 'RECEIPT',
      merchantId: '',
      createdAt: null,
      searchByReceipt: '',
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
let cancelReceiptPayload = {
  request: {
    payload: {
      movementHeaderId: '',
      merchantId: '',
      numberReceipt: '',
      serial: '',
      reason: '',
      outputId: '',
    },
  },
};
let codProdSelected = '';
let selectedReceipt = {};

const ReceiptsTable = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [reload, setReload] = React.useState(0);
  const [confirmCancel, setConfirmCancel] = React.useState(false);
  const [openForm, setOpenForm] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [downloadExcel, setDownloadExcel] = React.useState(false);
  const router = useRouter();
  const {query} = router;
  console.log('query', query);
  const [loading, setLoading] = React.useState(true);
  const {excelTemplateGeneratedToReceiptsRes} = useSelector(
    ({general}) => general,
  );
  const [moreFilters, setMoreFilters] = React.useState(false);
  const documentSunat = 'receipt';

  //API FUNCTIONS
  const toGetMovements = (payload) => {
    dispatch(getReceiptItems_pageListReceipt(payload));
  };
  const getBusinessParameter = (payload) => {
    dispatch(onGetBusinessParameter(payload));
  };
  const getGlobalParameter = (payload) => {
    dispatch(onGetGlobalParameter(payload));
  };
  const toCancelReceipt = (payload) => {
    dispatch(cancelReceipt(payload));
  };
  const toExportExcelTemplateToReceipts = (payload) => {
    dispatch(exportExcelTemplateToReceipts(payload));
  };

  const useForceUpdate = () => {
    return () => setReload((value) => value + 1); // update the state to force render
  };

  const handleNextPage = (event) => {
    //console.log('Llamando al  handleNextPage', handleNextPage);
    listPayload.request.payload.LastEvaluatedKey =
      receiptLastEvalutedKey_pageListReceipt;
    console.log('listPayload111:handleNextPage:', listPayload);
    toGetMovements(listPayload);
    // setPage(page+1);
  };

  //GET APIS RES
  const {receiptItems_pageListReceipt, receiptLastEvalutedKey_pageListReceipt} =
    useSelector(({movements}) => movements);
  console.log('receiptItems_pageListReceipt', receiptItems_pageListReceipt);
  const {dataBusinessRes} = useSelector(({general}) => general);
  console.log('dataBusinessRes', dataBusinessRes);
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

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [receiptItems_pageListReceipt]);

  let money_unit;
  let weight_unit;
  let exchangeRate;

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

  const buildFilter = (typeDoc, numberDoc) => {
    let nroDoc = numberDoc.length !== 0 ? numberDoc : null;
    if (typeDoc !== 'anyone' && numberDoc.length !== 0) {
      return `${typeDoc}||${numberDoc}`;
    } else if (typeDoc !== 'anyone' && numberDoc.length === 0) {
      return typeDoc;
    } else {
      return nroDoc;
    }
  };
  const filterData = (dataFilters) => {
    console.log('dataFilters', dataFilters);
    listPayload.request.payload.searchByDocument = buildFilter(
      dataFilters.typeDocument,
      dataFilters.nroDoc,
    );
    if (dataFilters.typeIdentifier == 'TODOS') {
      dataFilters.typeIdentifier = '';
    }
    listPayload.request.payload.typeDocumentClient = dataFilters.typeIdentifier;
    listPayload.request.payload.numberDocumentClient =
      dataFilters.nroIdentifier;
    listPayload.request.payload.denominationClient =
      dataFilters.searchByDenominationProvider.replace(/ /g, '').toUpperCase();
    console.log('listPayload', listPayload);
    dispatch({
      type: GET_RECEIPT_PAGE_LISTGUIDE,
      payload: {callType: 'firstTime'},
    });
    toGetMovements(listPayload);
    (listPayload.request.payload.searchByDocument = ''),
      (listPayload.request.payload.typeDocumentClient = '');
    listPayload.request.payload.numberDocumentClient = '';
    listPayload.request.payload.denominationClient = '';
    setMoreFilters(false);
  };

  //BUTTONS BAR FUNCTIONS
  const searchInputs = () => {
    listPayload.request.payload.LastEvaluatedKey = null;
    listPayload.request.payload.outputId = null;
    dispatch({
      type: GET_RECEIPT_PAGE_LISTGUIDE,
      payload: {callType: 'firstTime'},
    });
    toGetMovements(listPayload);
  };
  useEffect(() => {
    dispatch({
      type: GET_RECEIPT_PAGE_LISTGUIDE,
      payload: {callType: 'firstTime'},
    });

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

      listPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;
      cancelReceiptPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;
      businessParameterPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;

      if (Object.keys(query).length !== 0) {
        console.log('Query con datos', query);
        listPayload.request.payload.movementHeaderId = query.receiptId;
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
    selectedReceipt = receiptItems_pageListReceipt[codInput];
    console.log('selectedReceipt', selectedReceipt);
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

  const goToUpdate = () => {
    console.log(' boleta', selectedReceipt);
    Router.push({pathname: '/sample/receipts/get', query: selectedReceipt});
  };

  const exportToExcel = () => {
    const excelPayload = listPayload;

    console.log('excelPayload', excelPayload);
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: GENERATE_EXCEL_TEMPLATE_TO_RECEIPTS, payload: undefined});
    toExportExcelTemplateToReceipts(excelPayload);
    setDownloadExcel(true);
  };

  useEffect(() => {
    if (excelTemplateGeneratedToReceiptsRes && downloadExcel) {
      setDownloadExcel(false);
      const byteCharacters = atob(excelTemplateGeneratedToReceiptsRes);
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
      link.setAttribute('download', 'Receipts.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [excelTemplateGeneratedToReceiptsRes, downloadExcel]);

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

  const cancelReceipt = (reason) => {
    console.log('Razón', reason);
    cancelReceiptPayload.request.payload.reason = reason;
    cancelReceiptPayload.request.payload.serial =
      selectedReceipt.serialNumber.split('-')[0];
    cancelReceiptPayload.request.payload.numberReceipt =
      selectedReceipt.serialNumber.split('-')[1];
    cancelReceiptPayload.request.payload.movementHeaderId =
      selectedReceipt.movementHeaderId;
    cancelReceiptPayload.request.payload.outputId = selectedReceipt.outputId;
    console.log('payload anular boleta', cancelReceiptPayload);
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: GET_MOVEMENTS, payload: []});
    toCancelReceipt(cancelReceiptPayload);
    setTimeout(() => {
      toGetMovements(listPayload);
    }, 2000);
    setOpenStatus(true);
    setOpenForm(false);
  };

  return (
    <Card sx={{p: 4}}>
      <Stack
        sx={{m: 2}}
        direction={isMobile ? 'column' : 'row'}
        spacing={2}
        className={classes.stack}
      >
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
        <Button
          onClick={() => setMoreFilters(true)}
          startIcon={<FilterAltOutlinedIcon />}
          variant='outlined'
        >
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
      <span>{`Items: ${receiptItems_pageListReceipt.length}`}</span>
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
              <TableCell>Número de boleta</TableCell>
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
            {receiptItems_pageListReceipt &&
            Array.isArray(receiptItems_pageListReceipt) ? (
              receiptItems_pageListReceipt.sort(compare).map((obj, index) => (
                <TableRow
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  key={index}
                >
                  <TableCell>
                    {convertToDateWithoutTime(obj.createdAt)}
                  </TableCell>
                  <TableCell>
                    {obj.serialNumber && obj.serialNumber.includes('-')
                      ? obj.serialNumber.split('-')[0]
                      : ''}
                  </TableCell>
                  <TableCell>
                    {obj.serialNumber && obj.serialNumber.includes('-')
                      ? obj.serialNumber.split('-')[1]
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
        {receiptLastEvalutedKey_pageListReceipt ? (
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
          .includes('/inventory/exportReceipts/*') === true ? (
          <Button
            variant='outlined'
            startIcon={<GridOnOutlinedIcon />}
            onClick={exportToExcel}
          >
            Exportar todo
          </Button>
        ) : null}
      </ButtonGroup>

      <Dialog
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Anulación de boleta'}
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
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Razón para anular boleta'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <AddReasonForm sendData={cancelReceipt} />
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
          {'Anulación de boleta'}
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
        {/* <MenuItem disabled>
          <DataSaverOffOutlinedIcon sx={{mr: 1, my: 'auto'}} />
          Reenviar
        </MenuItem> */}
        <MenuItem onClick={() => window.open(selectedReceipt.linkPdf)}>
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
                pathname: '/sample/notes/registerForReceipt',
                query: {
                  idReceipt: selectedReceipt.movementHeaderId,
                  movementId: selectedReceipt.outputId,
                  nroReceipt: selectedReceipt.serialNumber,
                  igv: selectedReceipt.igv,
                  typeDocumentRelated: 'receipt',
                },
              })
            }
          >
            <ReceiptOutlinedIcon sx={{mr: 1, my: 'auto'}} />
            Generar nota
          </MenuItem>
        ) : null}
        {/* <MenuItem
          disabled={!dataBusinessRes.isReceiptingEnabled}
          onClick={() =>
            Router.push({
              pathname: '/sample/credit-notes/get',
              query: {
                idReceipt: selectedReceipt.movementHeaderId,
                movementId: selectedReceipt.outputId,
                nroReceipt: selectedReceipt.serialNumberReceipt,
              },
            })
          }
        >
          <ReceiptOutlinedIcon sx={{mr: 1, my: 'auto'}} />
          Generar nota
        </MenuItem>
        {!selectedReceipt.cancelStatus ? (
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

      <Dialog
        open={moreFilters}
        onClose={() => setMoreFilters(false)}
        maxWidth='sm'
        fullWidth
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          <IconButton
            aria-label='close'
            onClick={() => setMoreFilters(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          {'Más filtros'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <DialogContentText
            sx={{fontSize: '1.2em'}}
            id='alert-dialog-description'
          >
            <MoreFiltersDocumentSunat
              sendData={filterData}
              ds={documentSunat}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}></DialogActions>
      </Dialog>
    </Card>
  );
};

export default ReceiptsTable;
