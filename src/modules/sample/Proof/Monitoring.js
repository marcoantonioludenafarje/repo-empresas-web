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
  TablePagination,
  useTheme,
  useMediaQuery,
  Typography,
  TableSortLabel,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import FindReplaceIcon from '@mui/icons-material/FindReplace';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
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
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import PageviewIcon from '@mui/icons-material/Pageview';
import {red, amber} from '@mui/material/colors';
import {exportExcelTemplateToReferralGuides} from '../../../redux/actions/General';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import MoreFiltersDocumentSunat from '../Filters/MoreFiltersDocumentSunat';

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
  convertToDate,
  convertToDateWithoutTime,
  parseTo3Decimals,
  toSimpleDate,
} from '../../../Utils/utils';
import {
  proofMonitoring,
  cancelInvoice,
  referralGuidesBatchConsult,
  cancelReferralGuide,
} from '../../../redux/actions/Movements';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_FINANCES,
  GET_MOVEMENTS,
  DELETE_FINANCE,
  GET_USER_DATA,
  GET_REFERRALGUIDE_PAGE_LISTGUIDE,
  GENERATE_EXCEL_TEMPLATE_TO_REFERRALGUIDES,
  REFERRAL_GUIDES_BATCH_CONSULT,
  CANCEL_REFERRAL_GUIDE,
  UPDATE_REFERRAL_GUIDE_ITEMS_PAGE_LIST,
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
let selectedProof = {};
//FORCE UPDATE
const useForceUpdate = () => {
  const [reload, setReload] = React.useState(0); // integer state
  return () => setReload((value) => value + 1); // update the state to force render
};
const ProofMonitoring = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const theme = useTheme();
  const forceUpdate = useForceUpdate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  //MANEJO DE FECHAS
  const toEpoch = (strDate) => {
    let someDate = new Date(strDate);
    someDate = someDate.getTime();
    return someDate;
  };
  const [openStatus, setOpenStatus] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [totalItems, setTotalItems] = React.useState([]);
  const [lastKey, setLastKey] = React.useState(null);
  const [errorDetail, setErrorDetail] = React.useState('');
  const [initialTime, setInitialTime] = React.useState(
    toEpoch(Date.now() - 89280000),
  );
  const [finalTime, setFinalTime] = React.useState(toEpoch(Date.now()));
  const [orderBy, setOrderBy] = React.useState(''); // Estado para almacenar el campo de ordenación actual
  const [order, setOrder] = React.useState('asc'); // Estado para almacenar la dirección de ordenación
  const router = useRouter();
  const {query} = router;
  console.log('query', query);
  const [loading, setLoading] = React.useState(true);
  const [proofType, setProofType] = React.useState('all');
  const [selectedMerchantId, setSelectedMerchantId] = React.useState('all');
  const [selectedAcceptedStatus, setSelectedAcceptedStatus] = React.useState('waiting');
  //API FUNCTIONS
  const toListProofMonitoringItems = (payload) => {
    dispatch(proofMonitoring(payload));
  };
  const toCancelInvoice = (payload) => {
    dispatch(cancelInvoice(payload));
  };
  const toExportExcelTemplateToReferralGuides = (payload) => {
    dispatch(exportExcelTemplateToReferralGuides(payload));
  };
  const toReferralGuidesBatchConsult = (payload) => {
    dispatch(referralGuidesBatchConsult(payload));
  };
  const toCancelReferralGuide = (payload) => {
    dispatch(cancelReferralGuide(payload));
  };

  const handleNextPage = (event) => {
    let listPayload = {
      request: {
        payload: {
          initialTime: initialTime,
          finalTime: finalTime,
          proofType: proofType,
          merchantId: selectedMerchantId,
          acceptedStatus: selectedAcceptedStatus,
        },
      },
    };
    listPayload.request.payload.LastEvaluatedKey =
      proofMonitoringLastEvaluatedKey_pageListGuide;
    console.log('listPayload111:handleNextPage:', listPayload);
    toListProofMonitoringItems(listPayload);
  };

  //GET APIS RES
  const {
    proofMonitoringItems_pageListGuide,
    proofMonitoringLastEvaluatedKey_pageListGuide,
    referralGuidesBatchConsultRes,
  } = useSelector(({movements}) => movements);
  console.log(
    'proofMonitoringItems_pageListGuide',
    proofMonitoringItems_pageListGuide,
  );
  const {successMessage} = useSelector(({movements}) => movements);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({movements}) => movements);
  console.log('errorMessage', errorMessage);
  const {businessParameter} = useSelector(({general}) => general);
  console.log('businessParameter', businessParameter);
  const {globalParameter} = useSelector(({general}) => general);
  console.log('globalParameter123', globalParameter);
  const {userDataRes} = useSelector(({user}) => user);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
    //setListFilteredGuideItems(proofMonitoringItems_pageListGuide)
  }, [proofMonitoringItems_pageListGuide]);

  // Función para manejar el clic en el encabezado de la tabla
  const handleSort = (field) => {
    if (orderBy === field) {
      // Si se hace clic en el mismo encabezado, cambiamos la dirección de ordenación
      setOrder(order === 'asc' ? 'desc' : 'asc');
      if (field !== 'totalPriceWithIgv') {
        const sortedProducts = [...proofMonitoringItems_pageListGuide].sort(
          (a, b) => {
            const descriptionA = a[`${field}`] ?? '';
            const descriptionB = b[`${field}`] ?? '';
            if (order === 'asc') {
              return descriptionA.localeCompare(descriptionB);
            } else {
              return descriptionB.localeCompare(descriptionA);
            }
          },
        );
        dispatch({
          type: GET_REFERRALGUIDE_PAGE_LISTGUIDE,
          payload: sortedProducts,
          handleSort: true,
        });
        forceUpdate();
      }
    } else {
      // Si se hace clic en un encabezado diferente, establecemos un nuevo campo de ordenación y la dirección ascendente
      setOrderBy(field);
      setOrder('asc');
      // const newListProducts = listProducts.sort((a, b) => a[`${field}`] - b[`${field}`])
      if (field !== 'totalPriceWithIgv') {
        const sortedProducts = [...proofMonitoringItems_pageListGuide].sort(
          (a, b) => {
            const descriptionA = a[`${field}`] ?? '';
            const descriptionB = b[`${field}`] ?? '';
            return descriptionB.localeCompare(descriptionA);
          },
        );
        dispatch({
          type: GET_REFERRALGUIDE_PAGE_LISTGUIDE,
          payload: sortedProducts,
          handleSort: true,
        });
        forceUpdate();
      }
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

  //BUTTONS BAR FUNCTIONS
  const searchInputs = () => {
    let listPayload = {
      request: {
        payload: {
          initialTime: initialTime,
          finalTime: finalTime,
          proofType: proofType,
          merchantId: selectedMerchantId,
          acceptedStatus: selectedAcceptedStatus,
        },
      },
    };
    listPayload.request.payload.LastEvaluatedKey = null;
    // dispatch({
    //   type: GET_REFERRALGUIDE_PAGE_LISTGUIDE,
    //   payload: {callType: 'firstTime'},
    // });
    console.log('listPayload122:searchInputs:', listPayload);
    toListProofMonitoringItems(listPayload);
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
      let listPayload = {
        request: {
          payload: {
            initialTime: initialTime,
            finalTime: finalTime,
            proofType: proofType,
            merchantId: "all",
            acceptedStatus: "waiting",
          },
        },
      };

      listPayload.request.payload.LastEvaluatedKey = null;
      console.log('listPayload133:useEffect userDataRes:', listPayload);
      toListProofMonitoringItems(listPayload);
    }
  }, [userDataRes]);

  //FUNCIONES MENU
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (codInput, event) => {
    setAnchorEl(event.currentTarget);
    selectedProof = proofMonitoringItems_pageListGuide[codInput];
    console.log('selectedProof', selectedProof);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //SELECCIÓN CALENDARIO
  const [value, setValue] = React.useState(Date.now() - 89280000);
  const [value2, setValue2] = React.useState(Date.now());

  const goToUpdate = () => {
    console.log(' factura', selectedProof);
    Router.push({pathname: '/sample/bills/get', query: selectedProof});
  };
  const compare = (a, b) => {
    if (a.serialNumber.split('-')[1] < b.serialNumber.split('-')[1]) {
      return 1;
    }
    if (a.serialNumber.split('-')[1] > b.serialNumber.split('-')[1]) {
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

  const showIconErrorStatus = (bool) => {
    if (bool) {
      return <PageviewIcon sx={{color: amber[500]}} />;
    } else {
      return <></>;
    }
  };

  const showIconStatus = (bool) => {
    switch (bool) {
      case 'waiting' || null:
        return <PendingIcon sx={{color: amber[500]}} />;
        break;
      case null:
        return <PendingIcon sx={{color: amber[500]}} />;
        break;
      case 'accepted' || true:
        return <CheckCircleIcon color='success' />;
        break;
      case true:
        return <CheckCircleIcon color='success' />;
        break;
      case 'denied' || false:
        return <CancelIcon sx={{color: red[500]}} />;
        break;
      case false:
        return <CancelIcon sx={{color: red[500]}} />;
        break;
      default:
        return null;
    }
  };
  return (
    <Card sx={{p: 4}}>
      <Stack
        sx={{m: 2}}
        direction={isMobile ? 'column' : 'row'}
        spacing={2}
        className={classes.stack}
      >
        <FormControl sx={{my: 0, width: 140}}>
            <InputLabel id='proofType-label' style={{fontWeight: 200}}>
            Tipo de Comprobante
            </InputLabel>
            <Select
            size={isMobile ? 'small' : 'medium'}
            defaultValue={proofType}
            name='proofType'
            labelId='proofType-label'
            label='Tipo de Comprobante'
            sx={{maxWidth: 140}}
            onChange={(event) => {
                setProofType(event.target.value);
            }}
            >
            <MenuItem value='all' style={{fontWeight: 200}}>
                Todos
            </MenuItem>
            <MenuItem value='RECEIPT' style={{fontWeight: 200}}>
                Boleta
            </MenuItem>
            <MenuItem value='BILL' style={{fontWeight: 200}}>
                Factura
            </MenuItem>
            <MenuItem value='REFERRAL_GUIDE' style={{fontWeight: 200}}>
                Guía de Remisión
            </MenuItem>
            <MenuItem value='CREDIT_NOTE' style={{fontWeight: 200}}>
                Nota de crédito
            </MenuItem>
            <MenuItem value='DEBIT_NOTE' style={{fontWeight: 200}}>
                Nota de débito
            </MenuItem>
            </Select>
        </FormControl>
        <FormControl sx={{my: 0, width: 140}}>
            <InputLabel id='selectedAcceptedStatus-label' style={{fontWeight: 200}}>
            Estado
            </InputLabel>
            <Select
            size={isMobile ? 'small' : 'medium'}
            defaultValue={selectedAcceptedStatus}
            name='selectedAcceptedStatus'
            labelId='selectedAcceptedStatus-label'
            label='Estado'
            sx={{maxWidth: 140}}
            onChange={(event) => {
                setSelectedAcceptedStatus(event.target.value);
            }}
            >
            <MenuItem value='waiting' style={{fontWeight: 200}}>
                En espera
            </MenuItem>
            <MenuItem value='denied' style={{fontWeight: 200}}>
                Denegado
            </MenuItem>
            </Select>
        </FormControl>
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
            //listPayload.request.payload.initialTime = toEpoch(newValue);
            //console.log('payload de busqueda', listPayload);
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
            //listPayload.request.payload.finalTime = toEpoch(newValue2);
            //console.log('payload de busqueda', listPayload);
          }}
        />
        <Button
          variant='contained'
          startIcon={<ManageSearchOutlinedIcon />}
          color='primary'
          onClick={() => searchInputs()}
        >
          Buscar
        </Button>
      </Stack>
      <span>{`Items: ${proofMonitoringItems_pageListGuide.length}`}</span>
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
              <TableCell>Negocio</TableCell>
              <TableCell>Número de serie</TableCell>
              <TableCell>Número Comprobante</TableCell>
              <TableCell>Enviado a Sunat</TableCell>
              <TableCell>Aceptado por Sunat</TableCell>
              <TableCell>Anulado?</TableCell>
              <TableCell>Error</TableCell>
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proofMonitoringItems_pageListGuide &&
            Array.isArray(proofMonitoringItems_pageListGuide) ? (
              proofMonitoringItems_pageListGuide.map((obj, index) => (
                <TableRow
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  key={index}
                >
                  <TableCell>
                    {convertToDateWithoutTime(obj.createdAt)}
                  </TableCell>
                  <TableCell>
                    {obj.merchantId}
                  </TableCell>
                  <TableCell>
                    {obj.documentIntern && obj.documentIntern.includes('-')
                      ? obj.documentIntern.split('-')[0]
                      : ''}
                  </TableCell>
                  <TableCell>
                    {obj.documentIntern && obj.documentIntern.includes('-')
                      ? obj.documentIntern.split('-')[1]
                      : ''}
                  </TableCell>
                  <TableCell align='center'>
                    {showIconStatus(obj.sendingStatus)}
                  </TableCell>
                  <TableCell align='center'>
                    {showIconStatus(obj.acceptedStatus)}
                  </TableCell>
                  <TableCell>
                    {showCanceled(obj.cancelStatus || false)}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        setOpenError(true);
                        setErrorDetail(obj.errorDetail);
                      }}
                    >
                      {showIconErrorStatus(obj.errorDetail || false)}
                    </Button>
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
        {proofMonitoringLastEvaluatedKey_pageListGuide ? (
          <Stack spacing={2}>
            <IconButton onClick={() => handleNextPage()} size='small'>
              Siguiente <ArrowForwardIosIcon fontSize='inherit' />
            </IconButton>
          </Stack>
        ) : null}
      </TableContainer>
      
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/referralGuide/seePDF') === true ? (
          <MenuItem onClick={() => window.open(selectedProof.linkPdf)}>
            <LocalAtmIcon sx={{mr: 1, my: 'auto'}} />
            Ver PDF
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/referralGuide/seeXML') === true ? (
          <MenuItem onClick={() => window.open(selectedProof.linkXml)}>
            <LocalAtmIcon sx={{mr: 1, my: 'auto'}} />
            Ver XML
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/referralGuide/seeCDR') === true ? (
          <MenuItem onClick={() => window.open(selectedProof.linkCdr)}>
            <LocalAtmIcon sx={{mr: 1, my: 'auto'}} />
            Ver CDR
          </MenuItem>
        ) : null}
        <MenuItem disabled>
          <DataSaverOffOutlinedIcon sx={{mr: 1, my: 'auto'}} />
          Consultar Estado
        </MenuItem>
      </Menu>

      <Dialog open={openError} onClose={() => setOpenError(false)}>
        <DialogTitle sx={{fontSize: '1.5em'}}>Error de guía</DialogTitle>
        <DialogContent>{errorDetail}</DialogContent>
      </Dialog>
      
    </Card>
  );
};

export default ProofMonitoring;
