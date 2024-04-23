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
  strDateToDateObject_ES,
  parseTo3Decimals,
  toSimpleDate,
  translateValue,
} from '../../../Utils/utils';
import {
  getReferralGuides_PageListGuide,
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

import { normalizeConfig } from 'next/dist/server/config-shared';
import BatchConsultCountdown from './batchConsultCountdown';
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
      numberReferralGuide: '',
      serial: '',
      reason: '',
    },
  },
};
let codProdSelected = '';
let selectedReferralGuide = {};
//FORCE UPDATE
const useForceUpdate = () => {
  const [reload, setReload] = React.useState(0); // integer state
  return () => setReload((value) => value + 1); // update the state to force render
};
const ReferralGuidesTable = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const theme = useTheme();
  const forceUpdate = useForceUpdate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isNotMobile = useMediaQuery(theme.breakpoints.up('lg'));
  //MANEJO DE FECHAS
  const toEpoch = (strDate) => {
    let someDate = new Date(strDate);
    someDate = someDate.getTime();
    return someDate;
  };
  const [reload, setReload] = React.useState(0);
  const [confirmCancel, setConfirmCancel] = React.useState(false);
  const [openForm, setOpenForm] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [valueObservationInput, setValueObservationInput] = React.useState('');
  const [downloadExcel, setDownloadExcel] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [totalItems, setTotalItems] = React.useState([]);
  const [lastKey, setLastKey] = React.useState(null);
  const [errorDetail, setErrorDetail] = React.useState('');
  const [initialTime, setInitialTime] = React.useState(
    toEpoch(Date.now() - 89280000 * 3),
  );
  const [finalTime, setFinalTime] = React.useState(toEpoch(Date.now()));
  const [batchConsultIsActive, setBatchConsultIsActive] = React.useState(false);
  const [countdown, setCountdown] = React.useState('');
  const [orderBy, setOrderBy] = React.useState(''); // Estado para almacenar el campo de ordenación actual
  const [order, setOrder] = React.useState('asc'); // Estado para almacenar la dirección de ordenación
  const router = useRouter();
  const {query} = router;
  console.log('query', query);
  const [loading, setLoading] = React.useState(true);
  const {excelTemplateGeneratedToReferralGuidesRes} = useSelector(
    ({general}) => general,
  );
  const [moreFilters, setMoreFilters] = React.useState(false);
  const documentSunat = 'referralGuide';

  const [valueObservation, setValueObservation] = React.useState('');
  const [selectedLocations, setSelectedLocations] = React.useState([]);
  const [selectedLocation, setSelectedLocation] = React.useState("TODOS");
  //API FUNCTIONS
  const toGetMovements = (payload) => {
    dispatch(getReferralGuides_PageListGuide(payload));
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
    setLoading(true);
    //console.log('Llamando al  handleNextPage', handleNextPage);
    let listPayload = {
      request: {
        payload: {
          initialTime: initialTime,
          finalTime: finalTime,
          businessProductCode: null,
          movementType: 'REFERRAL_GUIDE',
          merchantId: userDataRes.merchantSelected.merchantId,
          createdAt: null,
          observation: valueObservation,
          searchByBill: null,
          movementHeaderId: query.referralGuideId || '',
          outputId: query.movementHeaderId || '',
          deliveryDistributionId: query.deliveryDistributionId || '',
          locations: selectedLocations,
        },
      },
    };
    listPayload.request.payload.LastEvaluatedKey =
      referralGuideLastEvalutedKey_pageListGuide;
    console.log('listPayload111:handleNextPage:', listPayload);
    toGetMovements(listPayload);
    // setPage(page+1);
  };

  //GET APIS RES
  const {
    referralGuideItems_pageListGuide,
    referralGuideLastEvalutedKey_pageListGuide,
    referralGuidesBatchConsultRes,
  } = useSelector(({movements}) => movements);
  console.log(
    'referralGuideItems_pageListGuide',
    referralGuideItems_pageListGuide,
  );

  let listToUse = referralGuideItems_pageListGuide;
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
  const {getStartingLocationsRes} = useSelector(({locations}) => locations);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
    //setListFilteredGuideItems(referralGuideItems_pageListGuide)
  }, [referralGuideItems_pageListGuide]);

  let money_unit;
  let weight_unit;
  let exchangeRate;

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

  // Función para manejar el clic en el encabezado de la tabla
  const handleSort = (field) => {
    if (orderBy === field) {
      // Si se hace clic en el mismo encabezado, cambiamos la dirección de ordenación
      setOrder(order === 'asc' ? 'desc' : 'asc');
      if (field !== 'totalPriceWithIgv') {
        const sortedProducts = [...referralGuideItems_pageListGuide].sort(
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
        const sortedProducts = [...referralGuideItems_pageListGuide].sort(
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
  const filterData = (dataFilters) => {
    setLoading(true);
    console.log('dataFilters', dataFilters);
    let listPayload = {
      request: {
        payload: {
          initialTime: initialTime,
          finalTime: finalTime,
          businessProductCode: null,
          movementType: 'REFERRAL_GUIDE',
          merchantId: userDataRes.merchantSelected.merchantId,
          createdAt: null,
          observation: valueObservation,
          searchByBill: null,
          movementHeaderId: null,
          outputId: null,
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
    // dispatch({
    //   type: GET_REFERRALGUIDE_PAGE_LISTGUIDE,
    //   payload: {callType: 'firstTime'},
    // });
    toGetMovements(listPayload);
    (listPayload.request.payload.searchByDocument = ''),
      (listPayload.request.payload.typeDocumentClient = '');
    listPayload.request.payload.numberDocumentClient = '';
    listPayload.request.payload.denominationClient = '';
    setMoreFilters(false);
  };

  const cancelReferralGuideFunction = (id) => {
    const cancelReferralGuidePayload = {
      request: {
        payload: {
          movementHeaderId: id,
        },
      },
    };
    console.log('payload anular factura', cancelReferralGuidePayload);
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: CANCEL_REFERRAL_GUIDE, payload: undefined});
    toCancelReferralGuide(cancelReferralGuidePayload);
    setOpenStatus(true);
  };

  const handleSearchValues = (event) => {
    if (event.target.name == 'codeToSearch') {
      // if (event.target.value == '') {
      //   console.log("Aqui estan todas las rutas",listFilteredGuideItems);
      //   setListFilteredGuideItems(referralGuideItems_pageListGuide);
      // } else {
      //   console.log("Aqui estan todas las rutas",referralGuideItems_pageListGuide);
      //   let newRoutes=[];
      //   event.target.value=event.target.value.toLowerCase();
      //   console.log("Buscando Observacion que contengan",event.target.value);
      //   for(let guideReference of referralGuideItems_pageListGuide){
      //     if(guideReference.observation?.toLowerCase().includes(event.target.value)){
      //       newRoutes.push(guideReference);
      //     }
      //   }
      //  }
      setValueObservation(event.target.value);
    }
  };

  //BUTTONS BAR FUNCTIONS
  const searchInputs = () => {
    setLoading(true);
    let listPayload = {
      request: {
        payload: {
          initialTime: initialTime,
          finalTime: finalTime,
          businessProductCode: null,
          movementType: 'REFERRAL_GUIDE',
          merchantId: userDataRes.merchantSelected.merchantId,
          observation: valueObservation,
          createdAt: null,
          searchByBill: null,
          movementHeaderId: null,
          outputId: null,
          locations: selectedLocations,
        },
      },
    };
    listPayload.request.payload.LastEvaluatedKey = null;
    listPayload.request.payload.outputId = null;
    // dispatch({
    //   type: GET_REFERRALGUIDE_PAGE_LISTGUIDE,
    //   payload: {callType: 'firstTime'},
    // });
    console.log('listPayload122:searchInputs:', listPayload);
    toGetMovements(listPayload);
  };
  useEffect(() => {
    // dispatch({
    //   type: GET_REFERRALGUIDE_PAGE_LISTGUIDE,
    //   payload: {callType: 'firstTime'},
    // });

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
      setLoading(true);
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      //dispatch({type: GET_MOVEMENTS, payload: undefined});
      dispatch({type: GET_FINANCES, payload: undefined});
      let listPayload = {
        request: {
          payload: {
            initialTime: initialTime,
            finalTime: finalTime,
            businessProductCode: null,
            movementType: 'REFERRAL_GUIDE',
            merchantId: userDataRes.merchantSelected.merchantId,
            observation: valueObservation,
            createdAt: null,
            searchByBill: null,
            movementHeaderId: null,
            outputId: null,
            locations: userDataRes.locations,
          },
        },
      };
      listPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;
      cancelInvoicePayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;
      businessParameterPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;

      if (Object.keys(query).length !== 0) {
        console.log('Query con datos', query);
        if (query.movementHeaderId) {
          listPayload.request.payload.outputId = query.movementHeaderId;
        } else if (query.referralGuideId) {
          listPayload.request.payload.movementHeaderId = query.referralGuideId;
        } else if (query.deliveryDistributionId) {
          listPayload.request.payload.deliveryDistributionId =
            query.deliveryDistributionId;
        }
      }
      listPayload.request.payload.LastEvaluatedKey = null;
      console.log('listPayload133:useEffect userDataRes:', listPayload);
      setSelectedLocations(userDataRes.locations)
      toGetMovements(listPayload);
      if (Object.keys(query).length !== 0) {
        listPayload.request.payload.movementHeaderId = null;
      }
      getBusinessParameter(businessParameterPayload);
      getGlobalParameter(globalParameterPayload);
    }
  }, [userDataRes, query]);

  //FUNCIONES MENU
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (codInput, event) => {
    setAnchorEl(event.currentTarget);
    codProdSelected = codInput;
    selectedReferralGuide = referralGuideItems_pageListGuide[codInput];
    console.log('selectedReferralGuide', selectedReferralGuide);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //SELECCIÓN CALENDARIO
  const [value, setValue] = React.useState(Date.now() - 89280000 * 3);
  const [value2, setValue2] = React.useState(Date.now());

  const goToUpdate = () => {
    console.log(' factura', selectedReferralGuide);
    Router.push({pathname: '/sample/bills/get', query: selectedReferralGuide});
  };
  const newReferralGuide = () => {
    Router.push({
      pathname: '/sample/referral-guide/get',
      query: {},
    });
  };
  const exportToExcel = () => {
    let listPayload = {
      request: {
        payload: {
          initialTime: initialTime,
          finalTime: finalTime,
          businessProductCode: null,
          movementType: 'REFERRAL_GUIDE',
          merchantId: userDataRes.merchantSelected.merchantId,
          createdAt: null,
          searchByBill: null,
          movementHeaderId: null,
          outputId: null,
          observation: valueObservation,
        },
      },
    };
    const excelPayload = listPayload;

    console.log('excelPayload', excelPayload);
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({
      type: GENERATE_EXCEL_TEMPLATE_TO_REFERRALGUIDES,
      payload: undefined,
    });
    toExportExcelTemplateToReferralGuides(excelPayload);
    setDownloadExcel(true);
  };

  const batchConsultReferralGuide = () => {
    if (userDataRes) {
      toReferralGuidesBatchConsult({
        request: {
          payload: {
            merchantId: userDataRes.merchantSelected.merchantId,
          },
        },
      });
      setIsLoading(true);
    }
  };
  useEffect(() => {
    if (referralGuidesBatchConsultRes) {
      setIsLoading(false);
      // dispatch({
      //   type: GET_REFERRALGUIDE_PAGE_LISTGUIDE,
      //   payload: {callType: 'firstTime'},
      // });
      let listPayload = {
        request: {
          payload: {
            initialTime: toEpoch(Date.now() - 89280000 * 3),
            finalTime: toEpoch(Date.now()),
            businessProductCode: null,
            movementType: 'REFERRAL_GUIDE',
            merchantId: userDataRes.merchantSelected.merchantId,
            createdAt: null,
            observation: valueObservation,
            searchByBill: null,
            movementHeaderId: null,
            outputId: null,
            locations: selectedLocations,
          },
        },
      };
      toGetMovements(listPayload);
      dispatch({type: REFERRAL_GUIDES_BATCH_CONSULT, payload: undefined});
    }
  }, [referralGuidesBatchConsultRes]);
  useEffect(() => {
    if (excelTemplateGeneratedToReferralGuidesRes && downloadExcel) {
      setDownloadExcel(false);
      const byteCharacters = atob(excelTemplateGeneratedToReferralGuidesRes);
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
      link.setAttribute('download', 'ReferralGuides.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [excelTemplateGeneratedToReferralGuidesRes, downloadExcel]);

  const updateCancelReferralGuideList = () => {
    if (successMessage != undefined) {
      const newListItems = referralGuideItems_pageListGuide.map((obj) => {
        if (obj.movementHeaderId == selectedReferralGuide.movementHeaderId) {
          obj.cancelStatus = true;
        }
        return obj;
      });
      dispatch({
        type: UPDATE_REFERRAL_GUIDE_ITEMS_PAGE_LIST,
        payload: newListItems,
      });
    }
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
            Se anuló correctamente.
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
            Se ha producido un error al tratar de anular.
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
  const renderTimer = (countdown) => {
    const remainingTime = Math.floor(countdown);
    if (remainingTime === 0) {
      return (
        <>
          <FindReplaceIcon />
          <Typography ml={1}>
            <FindReplaceIcon /> Consulta Masiva SUNAT en progreso
          </Typography>
        </>
      );
    }

    return (
      <>
        <FindReplaceIcon />
        <Typography ml={1}>
          Consulta Masiva SUNAT en {remainingTime} segundos restantes
        </Typography>
      </>
    );
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

  const setDeleteState = () => {
    setOpen2(true);
    handleClose();
  };

  /*const handleChangePage = (event, newPage) => {
    setPage(newPage);
    toGetMovements({
      request: {
        payload: {
          initialTime: null,
          finalTime: null,
          businessProductCode: null,
          movementType: 'REFERRAL_GUIDE',
          merchantId: '',
          createdAt: null,
          searchByBill: null,
          movementHeaderId: null,
          outputId: null,
          lastEvaluatedKey: getMovementsRes[newPage - 1]?.lastKey || '',
        },
      },
    });
  };*/

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const CancelOptionOpen = () => {
    setOpen(true);
  };

  const CancelOptionClose = () => {
    setOpen(false);
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const listPayload = {
  //       request: {
  //         payload: {
  //           initialTime: null,
  //           finalTime: null,
  //           businessProductCode: null,
  //           movementType: "REFERRAL_GUIDE",
  //           merchantId: "",
  //           createdAt: null,
  //           searchByBill: null,
  //           movementHeaderId: null,
  //           outputId: null,
  //           lastEvaluatedKey: lastKey || ""
  //         }
  //       }
  //     };

  //     const { data, lastEvaluatedKey } = getMovementsRes;
  //     setLastKey(lastEvaluatedKey);
  //   };

  //   fetchData();
  // }, [lastKey]);
  return (
    <Card sx={{p: 4}}>
      <Stack
        sx={{m: 2}}
        direction={isMobile ? 'column' : 'row'}
        spacing={2}
        className={classes.stack}
      >
        {userDataRes && getStartingLocationsRes && userDataRes.locations && userDataRes.locations.length > 0 ? (
          <FormControl sx={{my: 0, width: 160}}>
            <InputLabel id='selectedLocation-label' style={{fontWeight: 200}}>
              Almacén
            </InputLabel>
            <Select
              name='selectedLocation'
              labelId='selectedLocation-label'
              label='Almacén'
              onChange={(event) => {
                console.log(event.target.value);
                setSelectedLocation(event.target.value)
                if(event.target.value == "TODOS"){
                  let allLocations = userDataRes.locations
                  setSelectedLocations(allLocations)
                } else {
                  setSelectedLocations([event.target.value])
                }
              }}
              defaultValue={selectedLocation}
            >
              <MenuItem value={'TODOS'} style={{fontWeight: 200}}>
                TODOS
              </MenuItem>
              {userDataRes.locations.map((actualLocation, index) => {
                const locationName = getStartingLocationsRes.find(obj => obj.modularCode == actualLocation).locationName
                return (
                  <MenuItem key={`locationItem-${index}`} value={actualLocation} style={{fontWeight: 200}}>
                    {locationName}
                  </MenuItem>)
              })}
            </Select>
          </FormControl>
        ) : null}
        <TextField
          label='Observación'
          variant='outlined'
          name='codeToSearch'
          size='small'
          onChange={handleSearchValues}
        />
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
          onClick={() => searchInputs()}
        >
          Buscar
        </Button>
      </Stack>
      <span>{`Items: ${referralGuideItems_pageListGuide.length}`}</span>
      <TableContainer component={Paper} sx={{maxHeight: 440}}>
        <Table
          sx={{minWidth: 650}}
          stickyHeader
          size='small'
          aria-label='simple table'
        >
          <TableHead>
            <TableRow>
              {isNotMobile ? (
              <TableCell>Fecha de registro</TableCell>
              ) : null}
              <TableCell>Fecha de emisión</TableCell>
              {isNotMobile ? (
              <>
              <TableCell>Número de serie</TableCell>
              <TableCell>Número de guía de remisión</TableCell>
              </>
              ) : (
                <TableCell>Serie-Número</TableCell>
              )}
              <TableCell>Motivo</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'denominationClient'}
                  direction={orderBy === 'denominationClient' ? order : 'asc'}
                  onClick={() => handleSort('denominationClient')}
                >
                  Receptor
                </TableSortLabel>
              </TableCell>
              {isNotMobile ? (
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'observation'}
                  direction={orderBy === 'observation' ? order : 'asc'}
                  onClick={() => handleSort('observation')}
                >
                  Observación
                </TableSortLabel>
              </TableCell>
              ) : null}
              {isNotMobile ? (
              <TableCell>Enviado a Sunat</TableCell>
              ) : null}
              <TableCell>Aceptado por Sunat</TableCell>
              {isNotMobile ? (
              <TableCell>Anulado?</TableCell>
              ) : null}
              {isNotMobile ? (
              <TableCell>Error</TableCell>
              ) : null}
              <TableCell align="center"  sx={{px: isNotMobile ? normalizeConfig : 0, width: isNotMobile ? normalizeConfig : "16px"}}>{isNotMobile ? "Opciones" : "#"}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {referralGuideItems_pageListGuide &&
            Array.isArray(referralGuideItems_pageListGuide) ? (
              referralGuideItems_pageListGuide.map((obj, index) => (
                <TableRow
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  key={index}
                >
                  {isNotMobile ? (
                  <TableCell>
                    {convertToDateWithoutTime(obj.createdAt)}
                  </TableCell>
                  ) : null}
                  <TableCell>
                    {obj.issueDate
                      ? strDateToDateObject_ES(obj.issueDate)
                      : convertToDateWithoutTime(obj.createdAt)}
                  </TableCell>
                  {isNotMobile ? (
                  <>
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
                  </>
                  ) : (
                    <TableCell>{obj.documentIntern && obj.documentIntern.includes('-')
                    ? obj.documentIntern.split('-')[0]
                    : ''}-{obj.documentIntern && obj.documentIntern.includes('-')
                    ? obj.documentIntern.split('-')[1]
                    : ''}</TableCell>
                  )}
                  <TableCell>{obj.reasonForTransfer ? translateValue("REASON_FOR_TRANSFER",(obj.reasonForTransfer).toUpperCase()) : ''} </TableCell>
                  <TableCell>
                    {`${obj.clientId.split('-')[1]}` +
                      ' ' +
                      obj.denominationClient}
                  </TableCell>
                  {isNotMobile ? (
                  <TableCell>{obj.observation || ''} </TableCell>
                  ) : null}
                  {isNotMobile ? (
                  <TableCell align='center'>
                    {showIconStatus(obj.sendingStatus)}
                  </TableCell>
                  ) : null}
                  <TableCell align='center'>
                    {showIconStatus(obj.acceptedStatus)}
                  </TableCell>
                  {isNotMobile ? (
                  <TableCell>
                    {showCanceled(obj.cancelStatus || false)}
                  </TableCell>
                  ) : null}
                  {isNotMobile ? (
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
              ))
            ) : (
              <CircularProgress disableShrink sx={{m: '10px'}} />
            )}
          </TableBody>
        </Table>
        { loading ? (
          <CircularProgress disableShrink sx={{m: '10px'}} />
        ): null}
        { successMessage && !loading && referralGuideItems_pageListGuide && referralGuideItems_pageListGuide.length == 0 ? (
        <span>{`No se han encontrado resultados`}</span>
        ) : null}
        {referralGuideLastEvalutedKey_pageListGuide ? (
          <Stack spacing={2}>
            <IconButton onClick={() => handleNextPage()} size='small'>
              Siguiente <ArrowForwardIosIcon fontSize='inherit' />
            </IconButton>
          </Stack>
        ) : null}
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={getMovementsRes ? getMovementsRes.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
      <Stack
        sx={{mt: 2}}
        direction={isMobile ? 'column' : 'row'}
        className={classes.stack}
      >
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/exportReferralGuides/*') === true ? (
          <Button
            variant='outlined'
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={newReferralGuide}
          >
            Nuevo
          </Button>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/exportReferralGuides/*') === true ? (
          <Button
            variant='outlined'
            startIcon={<GridOnOutlinedIcon />}
            onClick={exportToExcel}
          >
            Exportar todo
          </Button>
        ) : null}
        
        <BatchConsultCountdown loading={isLoading}/>
      </Stack>
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
          <Button
            variant='outlined'
            onClick={() => {
              setOpenStatus(false);
              updateCancelReferralGuideList();
            }}
          >
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
        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/referralGuide/seePDF') === true ? (
          <MenuItem onClick={() => window.open(selectedReferralGuide.linkPdf)}>
            <LocalAtmIcon sx={{mr: 1, my: 'auto'}} />
            Ver PDF
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/referralGuide/seeXML') === true ? (
          <MenuItem onClick={() => window.open(selectedReferralGuide.linkXml)}>
            <LocalAtmIcon sx={{mr: 1, my: 'auto'}} />
            Ver XML
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/referralGuide/seeCDR') === true ? (
          <MenuItem onClick={() => window.open(selectedReferralGuide.linkCdr)}>
            <LocalAtmIcon sx={{mr: 1, my: 'auto'}} />
            Ver CDR
          </MenuItem>
        ) : null}
        <MenuItem disabled>
          <DataSaverOffOutlinedIcon sx={{mr: 1, my: 'auto'}} />
          Consultar Estado
        </MenuItem>
        <MenuItem
          onClick={CancelOptionOpen}
          disabled={selectedReferralGuide.cancelStatus}
        >
          Anular
        </MenuItem>
      </Menu>

      <Dialog open={openError} onClose={() => setOpenError(false)}>
        <DialogTitle sx={{fontSize: '1.5em'}}>Error de guía</DialogTitle>
        <DialogContent>{errorDetail}</DialogContent>
      </Dialog>

      <Dialog open={open} onClose={CancelOptionClose}>
        <DialogTitle sx={{fontSize: '1.5em'}}>
          Anulación de Guías de remisión
        </DialogTitle>
        <DialogContent>
          La anulación legal de una factura se debe realizar a través del portal
          de Sunat. Para ayudar en este proceso, le proporcionamos un tutorial
          que puede seguir fácilmente:
          <br />
          Además, en nuestro sistema, también puede optar por marcar la factura
          como anulada para mantener su registro interno actualizado.
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button
            variant='outlined'
            onClick={() => {
              setOpen(false);
              cancelReferralGuideFunction(
                selectedReferralGuide.movementHeaderId,
              );
            }}
          >
            Anular internamente
          </Button>
        </DialogActions>
      </Dialog>

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

export default ReferralGuidesTable;
