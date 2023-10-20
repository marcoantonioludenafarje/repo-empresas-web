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
  TableSortLabel,
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import IntlMessages from '../../../@crema/utility/IntlMessages';

import {ClickAwayListener} from '@mui/base';
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
import {exportExcelTemplateToNotes} from '../../../redux/actions/General';
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
  convertToDateWithoutTime,
  strDateToDateObject_ES,
  translateValue,
} from '../../../Utils/utils';
import AddReasonForm from './AddReasonForm';
import {
  getNoteItems_pageListNote,
  cancelInvoice,
} from '../../../redux/actions/Movements';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_MOVEMENTS,
  GET_USER_DATA,
  GET_NOTE_PAGE_LISTGUIDE,
  GENERATE_EXCEL_TEMPLATE_TO_NOTES,
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
      numberCreditNote: '',
      serial: '',
      reason: '',
    },
  },
};
let codProdSelected = '';
let selectedCreditNote = {};
//FORCE UPDATE
const useForceUpdate = () => {
  const [reload, setReload] = React.useState(0); // integer state
  return () => setReload((value) => value + 1); // update the state to force render
};
const CreditNotesTable = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const forceUpdate = useForceUpdate();
  //MANEJO DE FECHAS
  const toEpoch = (strDate) => {
    let someDate = new Date(strDate);
    someDate = someDate.getTime();
    return someDate;
  };
  const [reload, setReload] = React.useState(0);
  const [confirmCancel, setConfirmCancel] = React.useState(false);
  const [moneyUnit, setMoneyUnit] = React.useState('');
  const [openForm, setOpenForm] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [downloadExcel, setDownloadExcel] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [initialTime, setInitialTime] = React.useState(
    toEpoch(Date.now() - 89280000),
  );
  const [finalTime, setFinalTime] = React.useState(toEpoch(Date.now()));

  const [orderBy, setOrderBy] = React.useState(''); // Estado para almacenar el campo de ordenación actual
  const [order, setOrder] = React.useState('asc'); // Estado para almacenar la dirección de ordenación
  const router = useRouter();
  const {query} = router;
  const {excelTemplateGeneratedToNotesRes} = useSelector(
    ({general}) => general,
  );
  const [moreFilters, setMoreFilters] = React.useState(false);
  const documentSunat = 'credit_Note';
  const {moneySymbol} = useSelector(({general}) => general);

  //API FUNCTIONS
  const toGetMovements = (payload) => {
    dispatch(getNoteItems_pageListNote(payload));
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
  const toExportExcelTemplateToNotes = (payload) => {
    dispatch(exportExcelTemplateToNotes(payload));
  };

  const handleNextPage = (event) => {
    //console.log('Llamando al  handleNextPage', handleNextPage);
    let listPayload = {
      request: {
        payload: {
          initialTime: initialTime,
          finalTime: finalTime,
          businessProductCode: null,
          movementType: 'CREDIT_NOTE',
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };
    listPayload.request.payload.LastEvaluatedKey =
      noteLastEvalutedKey_pageListNote;
    console.log('listPayload111:handleNextPage:', listPayload);
    toGetMovements(listPayload);
    // setPage(page+1);
  };

  //GET APIS RES
  const {noteItems_pageListNote, noteLastEvalutedKey_pageListNote} =
    useSelector(({movements}) => movements);
  console.log('noteItems_pageListNote', noteItems_pageListNote);
  const {dataBusinessRes} = useSelector(({general}) => general);
  console.log('dataBusinessRes', dataBusinessRes);
  let listToUse = noteItems_pageListNote;
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

  /* let money_unit; */
  let weight_unit;
  let exchangeRate;

  useEffect(() => {
    //dispatch({type: GET_NOTE_PAGE_LISTGUIDE, payload: {callType: 'firstTime'}});
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
      //dispatch({type: GET_MOVEMENTS, payload: undefined});

      let listPayload = {
        request: {
          payload: {
            initialTime: initialTime,
            finalTime: finalTime,
            businessProductCode: null,
            movementType: 'CREDIT_NOTE',
            merchantId: userDataRes.merchantSelected.merchantId,
          },
        },
      };
      cancelInvoicePayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;
      businessParameterPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;

      if (Object.keys(query).length !== 0) {
        console.log('Query con datos', query);
        listPayload.request.payload.movementHeaderId = query.noteId;
      }

      listPayload.request.payload.LastEvaluatedKey = null;
      toGetMovements(listPayload);
      getBusinessParameter(businessParameterPayload);
      getGlobalParameter(globalParameterPayload);
    }
  }, [userDataRes]);
  useEffect(() => {
    if (businessParameter !== undefined) {
      weight_unit = businessParameter.find(
        (obj) => obj.abreParametro == 'DEFAULT_WEIGHT_UNIT',
      ).value;
      let money_unit = businessParameter.find(
        (obj) => obj.abreParametro == 'DEFAULT_MONEY_UNIT',
      ).value;
      setMoneyUnit(money_unit);
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

  console.log('Valores default peso', weight_unit, 'moneda', moneyUnit);

  // Función para manejar el clic en el encabezado de la tabla
  const handleSort = (field) => {
    if (orderBy === field) {
      // Si se hace clic en el mismo encabezado, cambiamos la dirección de ordenación
      setOrder(order === 'asc' ? 'desc' : 'asc');
      const sortedProducts = [...noteItems_pageListNote].sort((a, b) => {
        const descriptionA = a[`${field}`] ?? '';
        const descriptionB = b[`${field}`] ?? '';
        if (order === 'asc') {
          return descriptionA.localeCompare(descriptionB);
        } else {
          return descriptionB.localeCompare(descriptionA);
        }
      });
      dispatch({
        type: GET_NOTE_PAGE_LISTGUIDE,
        payload: sortedProducts,
        handleSort: true,
      });
      forceUpdate();
    } else {
      // Si se hace clic en un encabezado diferente, establecemos un nuevo campo de ordenación y la dirección ascendente
      setOrderBy(field);
      setOrder('asc');
      // const newListProducts = listProducts.sort((a, b) => a[`${field}`] - b[`${field}`])
      const sortedProducts = [...noteItems_pageListNote].sort((a, b) => {
        const descriptionA = a[`${field}`] ?? '';
        const descriptionB = b[`${field}`] ?? '';
        return descriptionB.localeCompare(descriptionA);
      });
      dispatch({
        type: GET_NOTE_PAGE_LISTGUIDE,
        payload: sortedProducts,
        handleSort: true,
      });
      forceUpdate();
    }
  };
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
    let listPayload = {
      request: {
        payload: {
          initialTime: initialTime,
          finalTime: finalTime,
          businessProductCode: null,
          movementType: 'CREDIT_NOTE',
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };
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
    //dispatch({type: GET_NOTE_PAGE_LISTGUIDE, payload: {callType: 'firstTime'}});
    toGetMovements(listPayload);
    (listPayload.request.payload.searchByDocument = ''),
      (listPayload.request.payload.typeDocumentClient = '');
    listPayload.request.payload.numberDocumentClient = '';
    listPayload.request.payload.denominationClient = '';
    setMoreFilters(false);
  };

  //BUTTONS BAR FUNCTIONS
  const searchInputs = () => {
    let listPayload = {
      request: {
        payload: {
          initialTime: initialTime,
          finalTime: finalTime,
          businessProductCode: null,
          movementType: 'CREDIT_NOTE',
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };
    listPayload.request.payload.LastEvaluatedKey = null;
    listPayload.request.payload.outputId = null;
    //dispatch({type: GET_NOTE_PAGE_LISTGUIDE, payload: {callType: 'firstTime'}});
    toGetMovements(listPayload);
  };

  //FUNCIONES MENU
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (codInput, event) => {
    setAnchorEl(event.currentTarget);
    codProdSelected = codInput;
    selectedCreditNote = noteItems_pageListNote[codInput];
    console.log('selectedCreditNote', selectedCreditNote);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //SELECCIÓN CALENDARIO
  const [value, setValue] = React.useState(Date.now() - 89280000);
  const [value2, setValue2] = React.useState(Date.now());

  const goToUpdate = () => {
    console.log(' factura', selectedCreditNote);
    Router.push({
      pathname: '/sample/creditNotes/get',
      query: selectedCreditNote,
    });
  };

  const exportToExcel = () => {
    let listPayload = {
      request: {
        payload: {
          initialTime: initialTime,
          finalTime: finalTime,
          businessProductCode: null,
          movementType: 'CREDIT_NOTE',
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };
    const excelPayload = listPayload;

    console.log('excelPayload', excelPayload);
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: GENERATE_EXCEL_TEMPLATE_TO_NOTES, payload: undefined});
    toExportExcelTemplateToNotes(excelPayload);
    setDownloadExcel(true);
  };

  useEffect(() => {
    if (excelTemplateGeneratedToNotesRes && downloadExcel) {
      setDownloadExcel(false);
      const byteCharacters = atob(excelTemplateGeneratedToNotesRes);
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
      link.setAttribute('download', 'Notes.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [excelTemplateGeneratedToNotesRes, downloadExcel]);

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
      return (
        <CircularProgress
          disableShrink
          sx={{m: '10px', position: 'relative'}}
        />
      );
    }
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
  const showPaymentMethod = (type) => {
    switch (type) {
      case 'DEBIT_NOTE':
        return <IntlMessages id='payment.method.debit' />;
        break;
      case 'CREDIT_NOTE':
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

  const cancelCreditNote = (reason) => {
    console.log('Razón', reason);
    cancelInvoicePayload.request.payload.reason = reason;
    cancelInvoicePayload.request.payload.serial =
      selectedCreditNote.serialNumber.split('-')[0] ||
      selectedCreditNote.documentIntern.split('-')[0];
    cancelInvoicePayload.request.payload.numberCreditNote =
      selectedCreditNote.serialNumber.split('-')[1] ||
      selectedCreditNote.documentIntern.split('-')[0];
    console.log('payload anular factura', cancelInvoicePayload);
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: GET_MOVEMENTS, payload: []});
    toCancelInvoice(cancelInvoicePayload);
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
            const epochValue = toEpoch(newValue);
            setInitialTime(epochValue);
            // listPayload.request.payload.initialTime = toEpoch(newValue);
            // console.log('payload de busqueda', listPayload);
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
            const epochValue = toEpoch(newValue2);
            setFinalTime(epochValue);
            // listPayload.request.payload.finalTime = toEpoch(newValue2);
            // console.log('payload de busqueda', listPayload);
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
      <span>{`Items: ${noteItems_pageListNote.length}`}</span>
      <TableContainer component={Paper} sx={{maxHeight: 440}}>
        <Table
          sx={{minWidth: 650}}
          stickyHeader
          size='small'
          aria-label='simple table'
        >
          <TableHead>
            <TableRow>
              <TableCell>Fecha registro</TableCell>
              <TableCell>Fecha emisión</TableCell>
              <TableCell>Número serie</TableCell>
              <TableCell>Número factura</TableCell>
              <TableCell>Identificador Receptor</TableCell>
              <TableCell>Nombre Receptor</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'observation'}
                  direction={orderBy === 'observation' ? order : 'asc'}
                  onClick={() => handleSort('observation')}
                >
                  Observación
                </TableSortLabel>
              </TableCell>
              {/* <TableCell>Subtotal</TableCell> */}
              {/* <TableCell>Inafecta</TableCell>
              <TableCell>Exonerada</TableCell>
              <TableCell>Gravada</TableCell> */}
              <TableCell>IGV</TableCell>
              <TableCell>Importe total</TableCell>
              <TableCell>Forma de pago</TableCell>
              <TableCell>Aceptado por Sunat</TableCell>
              <TableCell>Anulado?</TableCell>
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {noteItems_pageListNote && Array.isArray(noteItems_pageListNote) ? (
              noteItems_pageListNote.sort(compare).map((obj, index) => (
                <TableRow
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  key={index}
                >
                  <TableCell>
                    {convertToDateWithoutTime(obj.createdAt)}
                  </TableCell>
                  <TableCell>
                    {strDateToDateObject_ES(obj.issueDate)}
                  </TableCell>
                  <TableCell>
                    {obj.serialNumber && obj.serialNumber.includes('-')
                      ? obj.serialNumber.split('-')[0]
                      : null}
                    {/* {obj.serialNumber &&
                    typeof obj.serialNumber === 'string' &&
                    obj.serialNumber.length !== 0
                      ? obj.serialNumber.split('-')[0]
                      : Array.isArray(obj.documentIntern)
                      ? obj.documentIntern.split('-')[0]
                      : null} */}
                  </TableCell>
                  <TableCell>
                    {obj.serialNumber && obj.serialNumber.includes('-')
                      ? obj.serialNumber.split('-')[1]
                      : null}
                    {/* {obj.serialNumber &&
                    typeof obj.serialNumber === 'string' &&
                    obj.serialNumber.length !== 0
                      ? obj.serialNumber.split('-')[1]
                      : Array.isArray(obj.documentIntern)
                      ? obj.documentIntern.split('-')[1]
                      : null} */}
                  </TableCell>
                  <TableCell>
                    {obj.clientId
                      ? `${obj.clientId.split('-')[0]} - ${
                          obj.clientId.split('-')[1]
                        }`
                      : ''}
                  </TableCell>
                  <TableCell>
                    {obj.clientId
                      ? obj.denominationClient
                      : 'Cliente No Definido'}
                  </TableCell>
                  <TableCell>{obj.observation}</TableCell>
                  {/* <TableCell>
                    {obj.totalPriceWithoutIgv
                      ? `${moneySymbol} ${obj.totalPriceWithoutIgv.toFixed(2)} `
                      : ''}
                  </TableCell>
                  <TableCell>
                    {obj.totalPriceWithoutIgv && obj.totalPriceWithIgv
                      ? `${moneySymbol} ${Number(
                          obj.totalPriceWithIgv.toFixed(2) -
                            obj.totalPriceWithoutIgv.toFixed(2),
                        ).toFixed(2)} `
                      : ''}
                  </TableCell> */}
                  {/* <TableCell>{obj.totalTaxFree ? `${moneySymbol} ${obj.totalTaxFree.toFixed(2)} ` : `${moneySymbol} 0` }</TableCell>
                  <TableCell>{obj.totalTaxExempt ? `${moneySymbol} ${obj.totalTaxExempt.toFixed(2)} ` : `${moneySymbol} 0`}</TableCell>
                  <TableCell>{obj.totalTaxed ? `${moneySymbol} ${obj.totalTaxed.toFixed(2)} ` : `${moneySymbol} 0`}</TableCell> */}
                  <TableCell>
                    {obj.totalIgv
                      ? `${moneySymbol} ${obj.totalIgv.toFixed(2)} `
                      : `${moneySymbol} 0`}
                  </TableCell>
                  <TableCell>
                    {obj.totalPriceWithIgv
                      ? `${moneySymbol}  ${obj.totalPriceWithIgv.toFixed(2)}`
                      : ''}
                  </TableCell>
                  <TableCell>{showPaymentMethod(obj.movementType)}</TableCell>
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
        {noteLastEvalutedKey_pageListNote ? (
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
          .includes('/inventory/exportCreditDebitNotes/*') === true ? (
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
          {'Anulación de factura'}
        </DialogTitle>
        {/* <DialogTitle sx={{color: 'red'}} id='alert-dialog-title'>
          {`MUY IMPORTANTE:
            Si la Comunicación de Baja es rechazada se deberá emitir una Nota de Crédito para anular el comprobante que no se pudo anular usando esta opción.
            Las comunicaciones de baja de las Boletas de Venta o notas asociadas son enviadas a la SUNAT o al OSE luego de que el comprobantes asociado sea aceptada. Esto ocurre normalmente al día siguiente. Si la Boleta de Venta o nota es rechazada la comunicación de baja no tiene ningún efecto.`}
        </DialogTitle> */}
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
          {'Razón para anular factura'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <AddReasonForm sendData={cancelCreditNote} />
        </DialogContent>
      </Dialog>

      <ClickAwayListener onClickAway={handleClickAway}>
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
      </ClickAwayListener>
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
        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/creditDebitNote/seePDF') === true ? (
          <MenuItem onClick={() => window.open(selectedCreditNote.linkPdf)}>
            <LocalAtmIcon sx={{mr: 1, my: 'auto'}} />
            Ver PDF
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/creditDebitNote/seeXML') === true ? (
          <MenuItem onClick={() => window.open(selectedCreditNote.linkXml)}>
            <LocalAtmIcon sx={{mr: 1, my: 'auto'}} />
            Ver XML
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/creditDebitNote/seeCDR') === true ? (
          <MenuItem onClick={() => window.open(selectedCreditNote.linkCdr)}>
            <LocalAtmIcon sx={{mr: 1, my: 'auto'}} />
            Ver CDR
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/creditDebitNote/consult') &&
        !selectedCreditNote.cancelStatus ? (
          <MenuItem
            onClick={() => {
              setConfirmCancel(true), setAnchorEl(null);
            }}
          >
            <DoDisturbAltIcon sx={{mr: 1, my: 'auto'}} />
            Anular
          </MenuItem>
        ) : null}
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

export default CreditNotesTable;
