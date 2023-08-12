import React, {useEffect} from 'react';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import {useIntl} from 'react-intl';

import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import AppLoader from '../../../@crema/core/AppLoader';
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
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
  Grid,
  Select,
  FormControl,
  FormControlLabel,
  InputLabel,
  Checkbox,
  TableSortLabel,
} from '@mui/material';
import {makeStyles} from '@mui/styles';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Backdrop from '@mui/material/Backdrop';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import InputIcon from '@mui/icons-material/Input';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CachedIcon from '@mui/icons-material/Cached';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import MapIcon from '@mui/icons-material/Map';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import SearchIcon from '@mui/icons-material/Search';
import {DesktopDatePicker, DateTimePicker} from '@mui/lab';
import {CalendarPicker} from '@mui/lab';

import {useDispatch, useSelector} from 'react-redux';
import {red} from '@mui/material/colors';
import {getUserData} from '../../../redux/actions/User';

import {
  getMovements,
  getOutputItems_pageListOutput,
  deleteMovement,
  generateInvoice,
  generateSellTicket,
} from '../../../redux/actions/Movements';
import {
  onGetBusinessParameter,
  onGetGlobalParameter,
} from '../../../redux/actions/General';
import {Form, Formik} from 'formik';
import Router, {useRouter} from 'next/router';
import {
  convertToDateWithoutTime,
  translateValue,
  showSubtypeMovement,
  specialFormatToSunat,
  dateWithHyphen,
} from '../../../Utils/utils';

const XLSX = require('xlsx');
import {
  GET_FINANCES,
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_MOVEMENTS,
  DELETE_MOVEMENT,
  GET_USER_DATA,
  GET_ROL_USER,
  GENERATE_SELL_TICKET,
  GET_OUTPUT_PAGE_LISTGUIDE,
  LIST_SALES,
} from '../../../shared/constants/ActionTypes';
import MoreFilters from '../Filters/MoreFilters';
import {listSales} from '../../../redux/actions/Sales';

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
      movementType: 'OUTPUT',
      movementTypeMerchantId: '',
      createdAt: null,
      movementHeaderId: '',
      folderMovement: '',
      contableMovementId: '',
      userUpdated: '',
      userUpdatedMetadata: {
        nombreCompleto: '',
        email: '',
      },
    },
  },
};

let invoicePayload = {
  request: {
    payload: {
      merchantId: '',
      movementTypeMerchantId: '',
      createdAt: '',
      clientId: '',
      totalPriceWithIgv: '',
      issueDate: '',
      exchangeRate: '',
      documentIntern: '',
      numberBill: '',
      automaticSendSunat: true,
      automaticSendClient: true,
      formatPdf: 'A4',
      referralGuide: true,
      creditSale: true,
    },
  },
};

const validationSchema = yup.object({
  transactionNumber: yup.string(),
});

let codProdSelected = '';
let selectedOutput = {};
let redirect = false;
//FORCE UPDATE
const useForceUpdate = () => {
  const [reload, setReload] = React.useState(0); // integer state
  return () => setReload((value) => value + 1); // update the state to force render
};

const SalesTable = (props) => {
  //Dependencias
  const classes = useStyles(props);
  const dispatch = useDispatch();
  let popUp = false;
  const router = useRouter();
  const {query} = router;
  console.log('query', query);
  const theme = useTheme();
  const forceUpdate = useForceUpdate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  //MANEJO DE FECHAS
  const toEpoch = (strDate) => {
    let someDate = new Date(strDate);
    someDate = someDate.getTime();
    return someDate;
  };

  let changeValueField;
  //UseStates
  const [openStatus, setOpenStatus] = React.useState(false);
  const [selectedSale, setSelectedSale] = React.useState('');
  const [ticketResponseDialog, setTicketResponseDialog] = React.useState(false);
  const [proofOfPaymentType, setProofOfPaymentType] = React.useState('all');
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [openSendEmail, setOpenSendEmail] = React.useState(false);
  const [openSendWhatsapp, setOpenSendWhatsapp] = React.useState(false);
  const [open2valida, setOpen2valida] = React.useState(false);
  // const [open3, setOpen3] = React.useState(false);
  const [openDetails, setOpenDetails] = React.useState(false);
  const [openDocuments, setOpenDocuments] = React.useState(false);
  const [openContableMovements, setOpenContableMovements] =
    React.useState(false);
  const [rowNumber, setRowNumber] = React.useState(0);
  const [moreFilters, setMoreFilters] = React.useState(false);
  const [sellTicketDialog, setSellTicketDialog] = React.useState(false);
  const [earningGeneration, setEarningGeneration] = React.useState(true);
  const [paymentMethod, setPaymentMethod] = React.useState('cash');
  const {moneySymbol} = useSelector(({general}) => general);
  //MENU ANCHOR
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [openDelivery, setOpenDelivery] = React.useState(false);
  const [deliverySelected, setDeliverySelected] = React.useState(false);
  //FECHAS
  //SELECCIÓN CALENDARIO
  const [initialTimeValue, setInitialTimeValue] = React.useState(
    Date.now() - 2678400000,
  );
  const [finalTimeValue, setFinalTimeValue] = React.useState(Date.now());
  const [typeClient, setTypeClient] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [saleIgvDefault, setSaleIgvDefault] = React.useState(0);
  const [initialTime, setInitialTime] = React.useState(
    toEpoch(Date.now() - 2678400000),
  );
  const [finalTime, setFinalTime] = React.useState(toEpoch(Date.now()));

  const [orderBy, setOrderBy] = React.useState(''); // Estado para almacenar el campo de ordenación actual
  const [order, setOrder] = React.useState('asc'); // Estado para almacenar la dirección de ordenación
  // setOpen3(query.operationBack)
  //API FUNCTIONS
  const toGetMovements = (payload) => {
    dispatch(getOutputItems_pageListOutput(payload));
  };
  const toListSales = (payload) => {
    dispatch(listSales(payload));
  };
  const toDeleteMovement = (payload) => {
    dispatch(deleteMovement(payload));
  };
  const toGenerateInvoice = (payload) => {
    dispatch(generateInvoice(payload));
  };
  const toGenerateSellTicket = (payload) => {
    dispatch(generateSellTicket(payload));
  };
  let money_unit;
  let weight_unit;
  let exchangeRate;
  const defaultValues = {
    transactionNumber: '',
  };

  //GET APIS RES
  const {businessParameter} = useSelector(({general}) => general);
  console.log('globalParameter123', businessParameter);
  const {dataBusinessRes} = useSelector(({general}) => general);
  console.log('dataBusinessRes', dataBusinessRes);
  const {globalParameter} = useSelector(({general}) => general);
  console.log('globalParameter123', globalParameter);
  const {
    getMovementsRes,
    outputItems_pageListOutput,
    outputLastEvaluatedKey_pageListOutput,
  } = useSelector(({movements}) => movements);
  const {listSalesRes, salesLastEvaluatedKey_pageListSales} = useSelector(
    ({sale}) => sale,
  );
  console.log('getMovementsRes', getMovementsRes);
  console.log('outputItems_pageListOutput', outputItems_pageListOutput);
  console.log(
    'salesLastEvaluatedKey_pageListSales',
    salesLastEvaluatedKey_pageListSales,
  );
  console.log('listSalesRes', listSalesRes);
  const {deleteMovementRes} = useSelector(({movements}) => movements);
  console.log('deleteMovementRes', deleteMovementRes);
  const {successMessage} = useSelector(({movements}) => movements);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({movements}) => movements);
  console.log('errorMessage', errorMessage);
  const {getFinancesRes} = useSelector(({finances}) => finances);
  console.log('getFinancesRes', getFinancesRes);
  const {generateInvoiceRes} = useSelector(({movements}) => movements);
  console.log('generateInvoiceRes', generateInvoiceRes);
  const {generateSellTicketRes} = useSelector(({movements}) => movements);
  console.log('generateSellTicketRes', generateSellTicketRes);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  //GET APIS RES
  const {listProducts} = useSelector(({products}) => products);
  console.log('products123', listProducts);
  const {getRolUserRes} = useSelector(({general}) => general);
  console.log('Esto es getRolUserRes', getRolUserRes);

  useEffect(() => {
    if (userDataRes && userDataRes.merchantSelected && getRolUserRes) {
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      let listPayload = {
        request: {
          payload: {
            initialTime: initialTime,
            finalTime: finalTime,
            merchantId: userDataRes.merchantSelected.merchantId,
            createdAt: null,
            userCreated: null,
          },
        },
      };
      if (Object.keys(query).length !== 0) {
        console.log('Query con datos', query);
        if (query.movementHeaderId)
          listPayload.request.payload.movementHeaderId = query.movementHeaderId;
        if (query.movementDetailId) {
          listPayload.request.payload.movementDetailId = query.movementDetailId;
          listPayload.request.payload.movementTypeMerchantId =
            query.movementTypeMerchantId;
          listPayload.request.payload.initialTime = Number(query.createdAt);
        }
      }
      listPayload.request.payload.LastEvaluatedKey = null;
      searchPrivilege('outputsTable')
        ? (listPayload.request.payload.userCreated = null)
        : (listPayload.request.payload.userCreated = userDataRes.userId);
      console.log('toListSales [userDataRes] ', listPayload);

      listPayload.request.payload.needItems = true;
      toListSales(listPayload);
      if (Object.keys(query).length !== 0) {
        listPayload.request.payload.movementHeaderId = null;
        listPayload.request.payload.movementDetailId = null;
        listPayload.request.payload.movementTypeMerchantId = null;
        listPayload.request.payload.initialTime = null;
      }
      console.log('userDataRes1234', userDataRes);
      console.log(
        'userDataRes.merchantSelected.typeClien',
        userDataRes.merchantSelected.typeClient,
      );

      setTypeClient(
        userDataRes.merchantSelected.typeClient
          ? userDataRes.merchantSelected.typeClient
          : 'PJ',
      );
    }
  }, [userDataRes, getRolUserRes, query]);

  useEffect(() => {
    if (generateSellTicketRes) {
      let listPayload = {
        request: {
          payload: {
            initialTime: toEpoch(Date.now() - 2678400000),
            finalTime: toEpoch(Date.now()),
            businessProductCode: null,
            movementType: 'OUTPUT',
            merchantId: userDataRes.merchantSelected.merchantId,
            createdAt: null,
            searchByDocument: null,
            movementHeaderId: null,
            outputId: null,
            userCreated: null,
          },
        },
      };
      console.log('Se manda al ticket de venta', generateSellTicketRes);
      setIsLoading(false);

      listPayload.request.payload.needItems = true;
      toListSales(listPayload);
      window.open(`${generateSellTicketRes.enlace_del_pdf}`);
    }
  }, [generateSellTicketRes]);
  useEffect(() => {
    if (businessParameter && businessParameter.length > 0) {
      let igvDefault = businessParameter.find(
        (obj) => obj.abreParametro == 'IGV',
      ).value;
      setSaleIgvDefault(igvDefault);
    }
  }, [businessParameter]);
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

  const handleNextPage = (event) => {
    //console.log('Llamando al  handleNextPage', handleNextPage);
    let listPayload = {
      request: {
        payload: {
          initialTime: initialTime,
          finalTime: finalTime,
          businessProductCode: null,
          movementType: 'OUTPUT',
          merchantId: userDataRes.merchantSelected.merchantId,
          createdAt: null,
          searchByDocument: null,
          movementHeaderId: null,
          outputId: null,
          userCreated: null,
        },
      },
    };
    listPayload.request.payload.LastEvaluatedKey =
      salesLastEvaluatedKey_pageListSales || null;

    listPayload.request.payload.needItems = true;
    console.log('listPayload111:handleNextPage:', listPayload);
    toListSales(listPayload);
    // setPage(page+1);
  };

  //Cerrar, abrir distribucion
  const handleToggle = (id) => {
    setOpenDelivery(true);
    if (openDelivery && deliverySelected == id) {
      setOpenDelivery(false);
    }
    setDeliverySelected(id);
  };

  // Función para manejar el clic en el encabezado de la tabla
  const handleSort = (field) => {
    if (orderBy === field) {
      // Si se hace clic en el mismo encabezado, cambiamos la dirección de ordenación
      setOrder(order === 'asc' ? 'desc' : 'asc');
      if (field !== 'totalPriceWithIgv') {
        const sortedProducts = [...listSalesRes].sort((a, b) => {
          const descriptionA = a[`${field}`] ?? '';
          const descriptionB = b[`${field}`] ?? '';
          if (order === 'asc') {
            return descriptionA.localeCompare(descriptionB);
          } else {
            return descriptionB.localeCompare(descriptionA);
          }
        });
        dispatch({
          type: GET_OUTPUT_PAGE_LISTGUIDE,
          payload: sortedProducts,
          handleSort: true,
        });
        forceUpdate();
      }
    } else {
      // Si se hace clic en un encabezado diferente, establecemos un nuevo campo de ordenación y la dirección ascendente
      setOrderBy(field);
      setOrder('asc');
      if (field !== 'totalPriceWithIgv') {
        const sortedProducts = [...listSalesRes].sort((a, b) => {
          const descriptionA = a[`${field}`] ?? '';
          const descriptionB = b[`${field}`] ?? '';
          return descriptionB.localeCompare(descriptionA);
        });
        dispatch({
          type: GET_OUTPUT_PAGE_LISTGUIDE,
          payload: sortedProducts,
          handleSort: true,
        });
        forceUpdate();
      }
    }
  };

  //BUTTONS BAR FUNCTIONS
  const searchOutputs = () => {
    let listPayload = {
      request: {
        payload: {
          initialTime: initialTime,
          finalTime: finalTime,
          businessProductCode: null,
          movementType: 'OUTPUT',
          merchantId: userDataRes.merchantSelected.merchantId,
          createdAt: null,
          searchByDocument: null,
          movementHeaderId: null,
          outputId: null,
          userCreated: null,
        },
      },
    };
    listPayload.request.payload.denominationClient = '';
    listPayload.request.payload.searchByDocument = '';
    listPayload.request.payload.typeDocumentClient = '';
    listPayload.request.payload.numberDocumentClient = '';
    listPayload.request.payload.LastEvaluatedKey =
      salesLastEvaluatedKey_pageListSales || null;
    searchPrivilege('outputsTable')
      ? (listPayload.request.payload.userCreated = null)
      : (listPayload.request.payload.userCreated = userDataRes.userId);
    console.log('toListSales [searchOutputs] ', listPayload);

    listPayload.request.payload.needItems = true;
    toListSales(listPayload);
  };
  const newOutput = () => {
    Router.push('/sample/sales/new');
  };

  //BUSQUEDA
  const handleSearchValues = (event) => {
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
  const openMenu = Boolean(anchorEl);
  const handleClick = (cod, event) => {
    setAnchorEl(event.currentTarget);
    const sale = findSale(cod);
    setSelectedSale(sale);
    console.log('selectedSale', sale);
    //forceUpdate();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const goToUpdate = () => {
    console.log('Actualizando', selectedOutput);
    Router.push({
      pathname: '/sample/outputs/update',
      query: {...selectedOutput},
    });
  };
  const goToGenerateTicket = () => {
    console.log('Abriendo generar ticket', selectedSale);
    Router.push({
      pathname: '/sample/sales/newProofOfPayment',
      query: {
        ...selectedSale,
        registerType: 'saleWithProofOfPayment',
        earningGeneration: true,
        proofOfPaymentType: 'ticket',
        proofOfPaymentGeneration: true,
      },
    });
  };
  const goToGenerateReceipt = () => {
    console.log('Abriendo generar receipt', selectedSale);
    Router.push({
      pathname: '/sample/sales/newProofOfPayment',
      query: {
        ...selectedSale,
        registerType: 'saleWithProofOfPayment',
        earningGeneration: true,
        proofOfPaymentType: 'receipt',
        proofOfPaymentGeneration: true,
      },
    });
  };
  const goToGenerateBill = () => {
    console.log('Abriendo generar bill', selectedSale);
    Router.push({
      pathname: '/sample/sales/newProofOfPayment',
      query: {
        ...selectedSale,
        registerType: 'saleWithProofOfPayment',
        earningGeneration: true,
        proofOfPaymentType: 'bill',
        proofOfPaymentGeneration: true,
      },
    });
  };
  const confirmDelete = () => {
    console.log('Eliminando salida :(');
    deletePayload.request.payload.movementTypeMerchantId =
      selectedOutput.movementTypeMerchantId;
    deletePayload.request.payload.createdAt = selectedOutput.createdAt;
    deletePayload.request.payload.movementHeaderId =
      selectedOutput.movementHeaderId;
    deletePayload.request.payload.contableMovementId =
      selectedOutput.contableMovementId
        ? selectedOutput.contableMovementId
        : '';
    deletePayload.request.payload.folderMovement = selectedOutput.folderMovement
      ? selectedOutput.folderMovement
      : '';
    deletePayload.request.payload.userUpdated = userDataRes.userId;
    deletePayload.request.payload.userUpdatedMetadata.nombreCompleto =
      userDataRes.nombreCompleto;
    deletePayload.request.payload.userUpdatedMetadata.email = userDataRes.email;

    toDeleteMovement(deletePayload);
    setOpen2(false);
    setTimeout(() => {
      setOpenStatus(true);
    }, 1000);
  };
  const setDeleteState = () => {
    console.log('setDeleteState', selectedOutput);
    if (
      !selectedOutput.existBill &&
      !selectedOutput.existIncome &&
      !selectedOutput.existReceipt &&
      !selectedOutput.existReferralGuide
    )
      setOpen2(true);
    else setOpen2valida(true);
    handleClose();
  };
  const goToMoves = () => {
    console.log('Llendo a movimientos');
  };

  const sendStatus = () => {
    let listPayload = {
      request: {
        payload: {
          initialTime: toEpoch(Date.now() - 2678400000),
          finalTime: toEpoch(Date.now()),
          businessProductCode: null,
          movementType: 'OUTPUT',
          merchantId: userDataRes.merchantSelected.merchantId,
          createdAt: null,
          searchByDocument: null,
          movementHeaderId: null,
          outputId: null,
          userCreated: null,
        },
      },
    };
    setOpenStatus(false);
    setTimeout(() => {
      searchPrivilege('outputsTable')
        ? (listPayload.request.payload.userCreated = null)
        : (listPayload.request.payload.userCreated = userDataRes.userId);
      console.log('toListSales [sendStatus] ', listPayload);
      listPayload.request.payload.LastEvaluatedKey =
        salesLastEvaluatedKey_pageListSales || null;

      listPayload.request.payload.needItems = true;
      toListSales(listPayload);
    }, 2200);
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

  const toTimestamp = (strDate) => {
    let datum = Date.parse(strDate);
    console.log('timestamp', datum / 1000);
    return datum / 1000;
  };
  const handleEarningGeneration = (event, isInputChecked) => {
    setEarningGeneration(isInputChecked);
    console.log('Evento de earningGeneration', isInputChecked);
  };
  const cleanList = () => {
    let listResult = [];
    listSalesRes.map((obj) => {
      //ESTOS CAMPOS DEBEN TENER EL MISMO NOMBRE, TANTO ARRIBA COMO ABAJO
      obj.codigo1 =
        showMinType(obj.movementType) +
        '-' +
        (obj.codMovement ? obj.codMovement.split('-')[1] : '');
      obj.createdAt = convertToDateWithoutTime(obj.createdAt);
      obj.updatedDate = convertToDateWithoutTime(obj.updatedDate);
      obj.movementSubType = `${showSubtypeMovement(obj.movementSubType, 'x')}`
        ? `${showSubtypeMovement(obj.movementSubType, 'x')}`
        : '';
      obj.clientdenomination =
        (obj.client ? obj.numberDocumentClient + ' - ' : '') +
        (obj.client ? obj.client.denomination : obj.clientName);
      obj.totalPrice1 = obj.totalPrice ? Number(obj.totalPrice.toFixed(3)) : '';
      obj.totalPriceWithIgv1 = obj.totalPriceWithIgv
        ? Number(obj.totalPriceWithIgv.toFixed(3))
        : '';
      obj.status1 = `${showStatus(obj.status, 'x')}`
        ? `${showStatus(obj.status, 'x')}`
        : '';
      obj.userCreatedMetadata1 = obj.userCreatedMetadata
        ? obj.userCreatedMetadata.nombreCompleto
        : '';
      obj.userUpdatedMetadata1 = obj.userUpdatedMetadata
        ? obj.userUpdatedMetadata.nombreCompleto
        : '';

      console.log('statusObject', obj);
      obj.receipt1 = statusTextObject(obj, obj.existReceipt, 'receipt');
      obj.ticket1 = statusTextObject(
        obj,
        obj.existSellTicket ? true : false,
        'ticket',
      );
      obj.referralGuide1 = statusTextObject(
        obj,
        obj.existReferralGuide,
        'referralGuide',
      );
      obj.bill1 = statusTextObject(obj, obj.existBill, 'bill');
      obj.income1 = statusTextObject(obj, obj.existIncome, 'income');

      // Crear la cadena de texto para productos
      let productsText = '';

      obj.descriptionProductsInfo.forEach((producto, index) => {
        const igv = producto.productIgv || 0.18;
        const subtotal = Number(
          (
            producto.quantityMovement *
            producto.priceBusinessMoneyWithIgv *
            (1 + igv)
          ).toFixed(2),
        );

        const productText = `Descripción: ${producto.description}| Cantidad: ${producto.quantityMovement}| Subtotal: ${subtotal}| Categoría: ${producto.category}`;

        if (index > 0) {
          productsText += '~';
        }

        productsText += productText;
      });

      obj.descriptionProducts = productsText;

      console.log('statusObject1', obj);

      listResult.push(
        (({
          codigo1,
          createdAt,
          updatedDate,
          movementSubType,
          clientdenomination,
          descriptionProducts,
          receipt1,
          ticket1,
          referralGuide1,
          bill1,
          income1,
          totalPrice1,
          totalPriceWithIgv1,
          status1,
          userCreatedMetadata1,
          userUpdatedMetadata1,
        }) => ({
          codigo1,
          createdAt,
          updatedDate,
          movementSubType,
          clientdenomination,
          descriptionProducts,
          receipt1,
          ticket1,
          referralGuide1,
          bill1,
          income1,
          totalPrice1,
          totalPriceWithIgv1,
          status1,
          userCreatedMetadata1,
          userUpdatedMetadata1,
        }))(obj),
      );
    });
    return listResult;
  };
  const headersExcel = [
    'Codigo',
    'Fecha registrada',
    'Ultima actualización',
    'Tipo de movimiento',
    'Cliente',
    'Detalle productos',
    'Boleta relacionada',
    'Ticket relacionada',
    'Guía relacionada',
    'Factura relacionada',
    'Ingreso relacionado',
    `Precio total ${money_unit} sin IGV`,
    `Precio total ${money_unit} con IGV`,
    'Estado',
    'Creado por',
    'Modificado por',
  ];
  const exportDoc = () => {
    var ws = XLSX.utils.json_to_sheet(cleanList());
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Outputs');
    XLSX.utils.sheet_add_aoa(ws, [headersExcel], {origin: 'A1'});
    XLSX.writeFile(wb, 'Outputs.xlsx');
  };

  const getDateParsed = () => {
    let date = new Date();
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getInvoice = () => {
    console.log('Selected Output', selectedOutput);
    Router.push(
      {
        pathname: '/sample/bills/get',
        query: selectedOutput,
      },
      '/sample/bills/get',
    );
  };
  const getReceipt = () => {
    console.log('Selected Output', selectedOutput);
    Router.push({
      pathname: '/sample/receipts/get',
      query: selectedOutput,
    });
  };
  const registerSuccess = () => {
    return (
      successMessage != undefined &&
      generateSellTicketRes != undefined &&
      !('error' in generateSellTicketRes)
    );
  };
  const registerError = () => {
    return (
      (successMessage != undefined && generateSellTicketRes) || errorMessage
    );
  };
  const showMessageTicketRegistration = () => {
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
            Se ha registrado la información <br />
            correctamente
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
            Se ha producido un error al registrar. <br />
            {generateSellTicketRes !== undefined &&
            'error' in generateSellTicketRes
              ? generateSellTicketRes.error
              : null}
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink />;
    }
  };
  const getReferralGuide = () => {
    console.log('Selected Output', selectedOutput);
    Router.push({
      pathname: '/sample/referral-guide/get',
      query: selectedOutput,
    });
  };

  const showMessage = () => {
    if (
      successMessage &&
      deleteMovementRes &&
      !('error' in deleteMovementRes)
    ) {
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
    } else if (
      (successMessage && deleteMovementRes && 'error' in deleteMovementRes) ||
      (typeof errorMessage === 'object' &&
        errorMessage &&
        !Array.isArray(errorMessage) &&
        errorMessage.error)
    ) {
      return (
        <>
          <CancelOutlinedIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            <IntlMessages id='message.register.data.error' />
            <br />
            {deleteMovementRes && 'error' in deleteMovementRes
              ? deleteMovementRes.error
              : null}
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink sx={{m: '10px'}} />;
    }
  };

  const {messages} = useIntl();
  const showMinType = (type) => {
    switch (type) {
      case 'INPUT':
        return messages['transaction.type.input.acronym'];

        break;
      case 'OUTPUT':
        return messages['transaction.type.output.acronym'];
        break;
      default:
        return null;
    }
  };

  const showMinTypeRelated = (type) => {
    switch (type) {
      case 'INCOME':
        return messages['transaction.type.income.acronym'];

        break;
      case 'EXPENSE':
        return messages['transaction.type.expense.acronym'];
        break;
      default:
        return null;
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
  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleClose2valida = () => {
    setOpen2valida(false);
  };

  const goToFile = () => {
    const data = {
      goDirectory: true,
      path: selectedOutput.folderMovement,
    };
    localStorage.setItem('redirectUrl', JSON.stringify(data));
    window.open('/sample/explorer');
  };

  const doFinance = () => {
    Router.push({
      pathname: '/sample/finances/new-earning',
      query: selectedOutput,
    });
  };
  const doDistribution = () => {
    Router.push({
      pathname: '/sample/distribution/new-distribution',
      query: selectedOutput,
    });
  };

  const findSale = (id) => {
    return listSalesRes.find((obj) => obj.saleId == id);
  };
  const showObject = (id, type) => {
    if (id) {
      if (type == 'income') {
        window.open(
          `/sample/finances/table?contableMovementId=${id}`,
          '_blank',
        );
      } else if (type == 'bill') {
        Router.push({
          pathname: '/sample/bills/table',
          query: {billId: id},
        });
      } else if (type == 'referralGuide') {
        Router.push({
          pathname: '/sample/referral-guide/table',
          query: {movementHeaderId: id},
        });
      } else if (type == 'receipt') {
        window.open(`/sample/receipts/table?receiptId=${id}`, '_blank');
      } else if (type == 'ticket') {
        window.open(id);
      } else if (type == 'output') {
        Router.push({
          pathname: '/sample/output/table',
          query: {movementHeaderId: id},
        });
      } else {
        return null;
      }
    }
  };
  const generateObject = (codOutput, type) => {
    codProdSelected = codOutput;
    selectedOutput = findOutput(codOutput);
    console.log('selectedOutput', selectedOutput);
    if (type == 'income') {
      Router.push({
        pathname: '/sample/finances/new-earning',
        query: selectedOutput,
      });
    } else if (type == 'bill') {
      Router.push({
        pathname: '/sample/bills/get',
        query: selectedOutput,
      });
    } else if (type == 'referralGuide') {
      Router.push({
        pathname: '/sample/referral-guide/get',
        query: selectedOutput,
      });
    } else {
      return null;
    }
  };

  useEffect(() => {
    let income = {};
    if (
      getFinancesRes !== undefined &&
      getFinancesRes.length &&
      redirect == true
    ) {
      income = getFinancesRes[0];
      Router.push({
        pathname: '/sample/finances/update-earning',
        query: income,
      });
      redirect = false;
    }
  }, [getFinancesRes]);

  const showStatus = (status, text) => {
    if (!text) {
      switch (status) {
        case 'requested':
          return <IntlMessages id='movements.status.requested' />;
          break;
        case 'complete':
          return <IntlMessages id='movements.status.complete' />;
          break;
        default:
          return null;
      }
    } else {
      switch (status) {
        case 'requested':
          return 'Solicitado';
          break;
        case 'complete':
          return 'Completado';
          break;
        default:
          return null;
      }
    }
  };

  const statusTextObject = (obj, exist, type, mintype, cod) => {
    if (obj.movementSubType == 'Ventas') {
      if (exist) {
        if (mintype) {
          return `${mintype} - ${cod}`;
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

            return serialDocument;
          } else if (type == 'ticket') {
            return 'Ver';
          } else {
            return 'Generado';
          }
        }
      } else {
        return 'No generado';
      }
    } else {
      return 'No aplica';
    }
  };

  const checkDocuments = (input, index) => {
    selectedOutput = input;
    console.log('selectedOutput', selectedOutput);
    if (openDetails == true) {
      setOpenDetails(false);
    }
    if (openContableMovements == true) {
      setOpenContableMovements(false);
    }
    setOpenDocuments(false);
    setOpenDocuments(true);
    if (openDocuments == true && rowNumber == index) {
      setOpenDocuments(false);
    }
    setRowNumber(index);
  };
  const checkProductsInfo = (index) => {
    if (openDocuments == true) {
      setOpenDocuments(false);
    }
    if (openContableMovements == true) {
      setOpenContableMovements(false);
    }
    setOpenDetails(false);
    setOpenDetails(true);
    if (openDetails == true && rowNumber == index) {
      setOpenDetails(false);
    }
    setRowNumber(index);
  };
  const checkContableMovementsInfo = (index) => {
    if (openDocuments == true) {
      setOpenDocuments(false);
    }
    if (openDetails == true) {
      setOpenDetails(false);
    }
    setOpenContableMovements(false);
    setOpenContableMovements(true);
    if (openContableMovements == true && rowNumber == index) {
      setOpenContableMovements(false);
    }
    setRowNumber(index);
  };
  const goToDocument = (doc) => {
    if (doc.typeDocument == 'bill') {
      if (doc.billId) {
        Router.push({
          pathname: '/sample/bills/table',
          query: {billId: doc.billId},
        });
      }
    } else if (doc.typeDocument == 'referralGuide') {
      if (doc.referralGuideId) {
        Router.push({
          pathname: '/sample/referral-guide/table',
          query: {referralGuideId: doc.referralGuideId},
        });
      }
    } else if (doc.typeDocument == 'receipt') {
      if (doc.receiptId) {
        Router.push({
          pathname: '/sample/receipts/table',
          query: {receiptId: doc.receiptId},
        });
      }
    } else {
      return null;
    }
  };
  const goToDistribution = (id) => {
    window.open(`/sample/distribution/distributions?id=${id}`, '_blank');
  };

  const goToMovements = (contableMovement) => {
    console.log('1', '');
    if (contableMovement.contableMovementId) {
      console.log('4', '');
      Router.push({
        pathname: '/sample/finances/table',
        query: {contableMovementId: contableMovement.contableMovementId},
      });
    } else {
      return null;
    }
  };

  const buildFilter = (typeDoc, numberDoc) => {
    let nroDoc = numberDoc.length !== 0 ? numberDoc : null;
    if (typeDoc !== 'anyone' && numberDoc.length !== 0) {
      return `${typeDoc}_${numberDoc}`;
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
          movementType: 'OUTPUT',
          merchantId: userDataRes.merchantSelected.merchantId,
          createdAt: null,
          searchByDocument: null,
          movementHeaderId: null,
          outputId: null,
          userCreated: null,
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
      dataFilters.searchByDenominationProvider.replace(/ /g, '').toLowerCase();
    console.log('listPayload', listPayload);
    searchPrivilege('outputsTable')
      ? (listPayload.request.payload.userCreated = null)
      : (listPayload.request.payload.userCreated = userDataRes.userId);
    console.log('toListSales [filterData] ', listPayload);
    listPayload.request.payload.LastEvaluatedKey = null;

    listPayload.request.payload.needItems = true;
    toListSales(listPayload);
    (listPayload.request.payload.searchByDocument = ''),
      (listPayload.request.payload.typeDocumentClient = '');
    listPayload.request.payload.numberDocumentClient = '';
    listPayload.request.payload.denominationClient = '';
    setMoreFilters(false);
  };

  function searchPrivilege(opcion) {
    let access = true;

    if (getRolUserRes)
      for (let objModules of getRolUserRes.modules) {
        for (let objSubModules of objModules.submodule) {
          if (
            objSubModules.idFront == opcion &&
            objSubModules.typeAccess == 'RESTRICTED'
          ) {
            access = false;
          }
        }
      }
    console.log('submodule fin: ', access);

    return access;
  }

  function validationClientType(selectedOutput1, documentType) {
    let validation = false;

    if (selectedOutput1 && selectedOutput1.clientId) {
      let client = selectedOutput1.clientId.split('-');
      let clientDocumentType = client[0];
      let clientNumberDocument = client[1];

      if (clientDocumentType != 'RUC' && documentType == 'receipt') {
        validation = true;
      } else if (
        clientDocumentType == 'RUC' &&
        (documentType == 'referralGuide' || documentType == 'distribution')
      ) {
        validation = true;
      } else if (
        clientDocumentType == 'RUC' &&
        clientNumberDocument.charAt(0) == '1' &&
        (documentType == 'receipt' || documentType == 'bill')
      ) {
        validation = true;
      } else if (
        clientDocumentType == 'RUC' &&
        clientNumberDocument.charAt(0) == '2' &&
        documentType == 'bill'
      ) {
        validation = true;
      }
    }
    if (documentType == 'receipt' && !selectedOutput1.clientId) {
      validation = true;
    }
    console.log('selectedOutput1', selectedOutput1);
    return validation;
  }

  function showSubtotal(saleProducts) {
    let saleSubtotal = 0;

    saleProducts.forEach((obj) => {
      saleSubtotal += obj.unitPrice * obj.quantityMovement;
    });
    return Number(saleSubtotal).toFixed(2);
  }
  function showTotalIgv(saleProducts) {
    let saleTotalIgv = 0;
    saleProducts.forEach((obj) => {
      if (obj.taxCode == 1000) {
        saleTotalIgv += obj.unitPrice * obj.quantityMovement * saleIgvDefault;
      }
    });
    return Number(saleTotalIgv).toFixed(2);
  }
  const sendSaleByMail = (data) => {
    console.log("enviando correo de la venta por correo")
  };
  const sendSaleByWhatsapp = (data) => {
    console.log("enviando correo de la venta por whatsapp")
  };
  return typeClient ? (
    <Card sx={{p: 4}}>
      <Stack
        sx={{
          m: 2,
        }}
        direction={isMobile ? 'column' : 'row'}
        spacing={2}
        className={classes.stack}
      >
        <FormControl sx={{my: 0, width: 140}}>
          <InputLabel id='proofOfPaymentType-label' style={{fontWeight: 200}}>
            Tipo de Comprobante
          </InputLabel>
          <Select
            size={isMobile ? 'small' : 'medium'}
            defaultValue={proofOfPaymentType}
            name='proofOfPaymentType'
            labelId='proofOfPaymentType-label'
            label='Tipo de Comprobante'
            sx={{maxWidth: 140}}
            onChange={(event) => {
              setProofOfPaymentType(event.target.value);
            }}
          >
            <MenuItem value='all' style={{fontWeight: 200}}>
              Todos
            </MenuItem>
            <MenuItem value='receipt' style={{fontWeight: 200}}>
              Boleta
            </MenuItem>
            <MenuItem value='bill' style={{fontWeight: 200}}>
              Factura
            </MenuItem>
            <MenuItem value='ticket' style={{fontWeight: 200}}>
              Ticket
            </MenuItem>
          </Select>
        </FormControl>
        <DateTimePicker
          renderInput={(params) => <TextField {...params} />}
          value={initialTimeValue}
          label='Inicio'
          size={isMobile ? 'small' : 'medium'}
          inputFormat='dd/MM/yyyy hh:mm a'
          onChange={(newValue) => {
            setInitialTimeValue(newValue);
            console.log('date', newValue);
            const epochValue = toEpoch(newValue);
            setInitialTime(epochValue);
          }}
        />
        <DateTimePicker
          renderInput={(params) => <TextField {...params} />}
          label='Fin'
          size={isMobile ? 'small' : 'medium'}
          inputFormat='dd/MM/yyyy hh:mm a'
          value={finalTimeValue}
          onChange={(newValue2) => {
            setFinalTimeValue(newValue2);
            const epochValue = toEpoch(newValue2);
            setFinalTime(epochValue);
          }}
        />
        <Button
          size='small'
          onClick={() => setMoreFilters(true)}
          startIcon={<FilterAltOutlinedIcon />}
          variant='outlined'
        >
          Más filtros
        </Button>
        <Button
          size='small'
          variant='contained'
          startIcon={<ManageSearchOutlinedIcon />}
          color='primary'
          onClick={searchOutputs}
        >
          Buscar
        </Button>
      </Stack>
      <span>{`Items: ${listSalesRes.length}`}</span>
      <TableContainer component={Paper} sx={{maxHeight: 440}}>
        <Table
          sx={{minWidth: 650}}
          stickyHeader
          size='small'
          aria-label='simple table'
        >
          <TableHead>
            <TableRow>
              <TableCell>Codigo</TableCell>
              <TableCell>Fecha registrada</TableCell>
              <TableCell>Última actualización</TableCell>
              <TableCell>Tipo Documento</TableCell>
              <TableCell>Numero Documento</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'denominationClient'}
                  direction={orderBy === 'denominationClient' ? order : 'asc'}
                  onClick={() => handleSort('denominationClient')}
                >
                  Cliente
                </TableSortLabel>
              </TableCell>
              <TableCell>Productos</TableCell>
              <TableCell>Subtotal</TableCell>
              <TableCell>IGV</TableCell>
              <TableCell>Precio Total</TableCell>
              <TableCell>Ingreso</TableCell>
              <TableCell>Salida</TableCell>
              <TableCell>Aceptado Sunat</TableCell>
              <TableCell>Creado por</TableCell>
              <TableCell>Modificado por</TableCell>
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listSalesRes &&
            Array.isArray(listSalesRes) &&
            listSalesRes.length >= 0 ? (
              listSalesRes.sort(compare).map((obj, index) => {
                const style =
                  obj.descriptionProductsInfo &&
                  obj.descriptionProductsInfo.length != 0
                    ? 'flex'
                    : null;
                let groupedDocuments = [];
                if (obj.documentsMovement && obj.documentsMovement.length > 0) {
                  groupedDocuments = obj.documentsMovement.reduce(
                    (result, document) => {
                      const deliveryDistributionId =
                        document.deliveryDistributionId;
                      const routeName = document.routeName;
                      const existingGroup = result.find(
                        (group) =>
                          group.distribution === deliveryDistributionId,
                      );

                      if (existingGroup) {
                        existingGroup.items.push(document);
                      } else {
                        const emptyGroup = result.find(
                          (group) => group.distribution === '',
                        );
                        if (emptyGroup && !deliveryDistributionId) {
                          emptyGroup.items.push(document);
                        } else {
                          result.push({
                            distribution: deliveryDistributionId || '',
                            routeName: routeName || '',
                            items: [document],
                          });
                        }
                      }

                      return result;
                    },
                    [],
                  );

                  // Ordenar los elementos por distribución (los que no tienen distribución estarán primero)
                  groupedDocuments.sort((a, b) => {
                    if (!a.distribution && b.distribution) {
                      return -1; // a viene antes que b
                    } else if (a.distribution && !b.distribution) {
                      return 1; // b viene antes que a
                    } else {
                      return 0; // no hay diferencia de orden
                    }
                  });
                }
                return (
                  <>
                    <TableRow
                      sx={{'&:last-child td, &:last-child th': {border: 0}}}
                      key={index}
                    >
                      <TableCell
                        sx={{
                          color:
                            obj.proofOfPaymentId &&
                            obj.contableMovement.contableMovementId
                              ? 'inherit'
                              : 'rgba(198, 50, 91, 1)',
                          fontWeight: 'bold',
                        }}
                      >
                        {obj.codMovement}
                      </TableCell>
                      <TableCell>
                        {convertToDateWithoutTime(obj.createdAt)}
                      </TableCell>
                      <TableCell>
                        {convertToDateWithoutTime(obj.updatedAt)}
                      </TableCell>
                      <TableCell>
                        {obj.proofOfPaymentType ? (
                          <IntlMessages
                            id={`document.type.${obj.proofOfPaymentType}`}
                          />
                        ) : (
                          ''
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant='secondary'
                          sx={{fontSize: '1em'}}
                          onClick={() =>
                            showObject(
                              obj.proofOfPaymentType !== 'ticket'
                                ? obj.proofOfPaymentId
                                : obj.proofOfPaymentPdf,
                              obj.proofOfPaymentType,
                            )
                          }
                        >
                          {obj.proofOfPaymentNumber}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {(obj.clientId
                          ? obj.numberDocumentClient + ' - '
                          : '') +
                          (obj.client
                            ? obj.client.denomination
                            : obj.clientName)}
                      </TableCell>
                      <TableCell align='center'>
                        {obj.products && obj.products.length != 0 ? (
                          <IconButton
                            onClick={() => checkProductsInfo(index)}
                            size='small'
                          >
                            <FormatListBulletedIcon fontSize='small' />
                          </IconButton>
                        ) : (
                          <></>
                        )}
                      </TableCell>
                      <TableCell align='center'>
                        {obj.totalIgv
                          ? obj.totalPriceWithIgv - obj.totalIgv
                          : showSubtotal(obj.products)}
                      </TableCell>
                      <TableCell>
                        {obj.totalIgv
                          ? Number(obj.totalIgv).toFixed(2)
                          : showTotalIgv(obj.products)}
                      </TableCell>
                      <TableCell>{obj.totalPriceWithIgv}</TableCell>
                      <TableCell>
                        <Button
                          variant='secondary'
                          sx={{fontSize: '1em'}}
                          onClick={() =>
                            showObject(
                              obj.contableMovement.contableMovementId,
                              'income',
                            )
                          }
                        >
                          {obj.contableMovement.contableMovementId
                            ? `${showMinTypeRelated('INCOME')}-${
                                obj.contableMovement.codMovement.split('-')[1]
                              }`
                            : ''}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant='secondary'
                          sx={{fontSize: '1em'}}
                          onClick={() =>
                            obj.output
                              ? showObject(obj.output.outputId, 'output')
                              : null
                          }
                        >
                          {obj.output ? obj.output.codMovement : 'No Generado'}
                        </Button>
                      </TableCell>
                      <TableCell>Aceptado Sunat</TableCell>
                      <TableCell>
                        {obj.userCreatedMetadata
                          ? obj.userCreatedMetadata.nombreCompleto
                          : ''}
                      </TableCell>
                      <TableCell>
                        {obj.userUpdatedMetadata
                          ? obj.userUpdatedMetadata.nombreCompleto
                          : ''}
                      </TableCell>
                      <TableCell>
                        <Button
                          id='basic-button'
                          aria-controls={openMenu ? 'basic-menu' : undefined}
                          aria-haspopup='true'
                          aria-expanded={openMenu ? 'true' : undefined}
                          onClick={handleClick.bind(this, obj.saleId)}
                        >
                          <KeyboardArrowDownIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow key={`prod-${index}`}>
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
                                  <TableCell>Precio sin Igv</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {obj.products !== undefined &&
                                obj.products.length !== 0 ? (
                                  obj.products.map((subProduct, index) => {
                                    return (
                                      <TableRow key={index}>
                                        <TableCell>
                                          {subProduct.businessProductCode !=
                                          null
                                            ? subProduct.businessProductCode
                                            : subProduct.product}
                                        </TableCell>
                                        <TableCell>
                                          {subProduct.description}
                                        </TableCell>
                                        <TableCell>
                                          {subProduct.quantityMovement}
                                        </TableCell>
                                        <TableCell>
                                          {subProduct.unitPrice}
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })
                                ) : (
                                  <></>
                                )}
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
        {salesLastEvaluatedKey_pageListSales ? (
          <Stack spacing={2}>
            <IconButton onClick={() => handleNextPage()} size='small'>
              Siguiente <ArrowForwardIosIcon fontSize='inherit' />
            </IconButton>
          </Stack>
        ) : null}
      </TableContainer>
      {isLoading ? (
        <Backdrop
          sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
          open={isLoading}
        >
          <AppLoader />
          {/* <CircularProgress color="inherit" /> */}
        </Backdrop>
      ) : (
        <></>
      )}
      <ButtonGroup
        variant='outlined'
        aria-label='outlined button group'
        className={classes.btnGroup}
      >
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/movementProducts/register?path=/output/*') ===
          true && !popUp ? (
          <Button
            variant='outlined'
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={newOutput}
          >
            Nuevo
          </Button>
        ) : null}

        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/exportOutputs/*') === true && !popUp ? (
          <Button
            variant='outlined'
            startIcon={<GridOnOutlinedIcon />}
            onClick={exportDoc}
          >
            Exportar todo
          </Button>
        ) : null}

        {!popUp ? <></> : <CircularProgress disableShrink sx={{m: '10px'}} />}
      </ButtonGroup>
      <Dialog
        open={openStatus}
        onClose={sendStatus}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Eliminar salida'}
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

      <Dialog
        open={open2}
        onClose={handleClose2}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Eliminar salida'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <PriorityHighIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            ¿Desea eliminar realmente la información seleccionada? Se eliminaran
            los datos relacionados.
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
        open={open2valida}
        onClose={handleClose2valida}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Eliminar salida'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <PriorityHighIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            No es posible eliminar la salida dado que tiene documentos y/o
            ingresos activos relacionados
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={handleClose2valida}>
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
          .includes('/inventory/movementProducts/update?path=/output/*') ===
          true && selectedSale.proofOfPaymentPdf ? (
          <MenuItem
            onClick={() =>
              showObject(
                selectedSale.proofOfPaymentType !== 'ticket'
                  ? selectedSale.proofOfPaymentId
                  : selectedSale.proofOfPaymentPdf,
                selectedSale.proofOfPaymentType,
              )
            }
          >
            <PictureAsPdfIcon sx={{mr: 1, my: 'auto'}} />
            Ver PDF
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/movementProducts/update?path=/output/*') ===
          true && selectedSale.proofOfPaymentPdf ? (
          <MenuItem
            onClick={() => {

              setOpenSendEmail(true)
              }
            }
          >
            <PictureAsPdfIcon sx={{mr: 1, my: 'auto'}} />
            Enviar Correo
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/movementProducts/update?path=/output/*') ===
          true && selectedSale.proofOfPaymentPdf ? (
          <MenuItem
            onClick={() => {
              setOpenSendWhatsapp(true)
              }
            }
          >
            <PictureAsPdfIcon sx={{mr: 1, my: 'auto'}} />
            Enviar Whatsapp
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/movementProducts/update?path=/output/*') ===
        true ? (
          <MenuItem disabled onClick={goToUpdate}>
            <CachedIcon sx={{mr: 1, my: 'auto'}} />
            Actualizar
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/movementProducts/update?path=/output/*') ===
          true &&
        selectedSale &&
        (!selectedSale.client.id ||
          selectedSale.client.id.split('-')[0] !== 'RUC') &&
        !selectedSale.proofOfPaymentType ? (
          <MenuItem onClick={goToGenerateTicket}>
            <ReceiptLongIcon sx={{mr: 1, my: 'auto'}} />
            Generar Ticket
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/movementProducts/update?path=/output/*') ===
          true &&
        selectedSale &&
        (!selectedSale.client.id ||
          selectedSale.client.id.split('-')[0] !== 'RUC') &&
        !selectedSale.proofOfPaymentType ? (
          <MenuItem onClick={goToGenerateReceipt}>
            <ReceiptLongIcon sx={{mr: 1, my: 'auto'}} />
            Generar Boleta
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/movementProducts/update?path=/output/*') ===
          true &&
        selectedSale &&
        !(
          !selectedSale.client.id ||
          selectedSale.client.id.split('-')[0] !== 'RUC'
        ) &&
        !selectedSale.proofOfPaymentType ? (
          <MenuItem onClick={goToGenerateBill}>
            <ReceiptLongIcon sx={{mr: 1, my: 'auto'}} />
            Generar Factura
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/movementProducts/delete?path=/output/*') ===
        true ? (
          <MenuItem onClick={setDeleteState}>
            <DeleteOutlineOutlinedIcon sx={{mr: 1, my: 'auto'}} />
            Eliminar
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes(
            '/facturacion/accounting/movement/register?path=/sellticketOfOutput/*',
          ) && selectedOutput.movementSubType == 'sales' ? (
          <MenuItem
            onClick={() => {
              setEarningGeneration(
                selectedOutput.contableMovementId ? false : true,
              );
              setSellTicketDialog(true);
            }}
          >
            <ReceiptLongIcon sx={{mr: 1, my: 'auto'}} />
            Generar Ticket
          </MenuItem>
        ) : null}

        {validationClientType(selectedOutput, 'receipt') &&
        localStorage
          .getItem('pathsBack')
          .includes(
            '/facturacion/accounting/movement/register?path=/receiptOfOutput/*',
          ) &&
        selectedOutput.movementSubType == 'sales' ? (
          <MenuItem onClick={getReceipt}>
            <ReceiptLongIcon sx={{mr: 1, my: 'auto'}} />
            Generar Boleta Venta
          </MenuItem>
        ) : null}

        {validationClientType(selectedOutput, 'referralGuide') &&
        localStorage
          .getItem('pathsBack')
          .includes(
            '/facturacion/accounting/movement/register?path=/referralGuideOfOutput/*',
          ) &&
        selectedOutput.movementSubType == 'sales' ? (
          <MenuItem
            disabled={
              userDataRes.merchantSelected &&
              !userDataRes.merchantSelected.isBillingEnabled
            }
            onClick={getReferralGuide}
          >
            <EditLocationOutlinedIcon sx={{mr: 1, my: 'auto'}} />
            Generar Guía <br />
            de remisión
          </MenuItem>
        ) : null}

        {validationClientType(selectedOutput, 'bill') &&
        localStorage
          .getItem('pathsBack')
          .includes(
            '/facturacion/accounting/movement/register?path=/billOfOutput/*',
          ) &&
        selectedOutput.movementSubType == 'sales' ? (
          // && !selectedOutput.existBill &&
          // !selectedOutput.existReceipt &&
          // !selectedOutput.existSellTicket
          <MenuItem
            disabled={
              userDataRes.merchantSelected &&
              !userDataRes.merchantSelected.isBillingEnabled
            }
            onClick={getInvoice}
          >
            <LocalAtmIcon sx={{mr: 1, my: 'auto'}} />
            Generar Factura
          </MenuItem>
        ) : null}

        {localStorage
          .getItem('pathsBack')
          .includes(
            '/facturacion/accounting/movement/register?path=/incomeOfOutput/*',
          ) &&
        // (selectedOutput.existBill ||
        //   selectedOutput.existReceipt ||
        //   selectedOutput.existSellTicket) &&
        // !selectedOutput.existIncome &&
        selectedOutput.movementSubType == 'sales' ? (
          <MenuItem onClick={doFinance}>
            <InputIcon sx={{mr: 1, my: 'auto'}} />
            Generar ingreso
          </MenuItem>
        ) : null}

        {validationClientType(selectedOutput, 'distribution') &&
        localStorage
          .getItem('pathsBack')
          .includes('/facturacion/deliveryDistribution/register') === true ? (
          <MenuItem
            disabled={selectedOutput.movementSubType !== 'sales'}
            onClick={doDistribution}
          >
            <MapIcon sx={{mr: 1, my: 'auto'}} />
            Generar distribución
          </MenuItem>
        ) : null}

        {localStorage
          .getItem('pathsBack')
          .includes('/utility/listObjectsPathMerchant?path=/salidas/*') ===
        true ? (
          <MenuItem onClick={goToFile}>
            <FolderOpenIcon sx={{mr: 1, my: 'auto'}} />
            Archivos
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
            <MoreFilters sendData={filterData} />
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}></DialogActions>
      </Dialog>

      <Dialog
        open={openSendEmail}
        onClose={() => setOpenSendEmail(false)}
        maxWidth='sm'
        fullWidth
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          <IconButton
            aria-label='close'
            onClick={() => setOpenSendEmail(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          {'Envío de Venta por Correo'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
            <Formik
             // validateOnChange={false}
              validationSchema={yup.object({
                receiverEmail: yup.string(),
              })}
              initialValues={ {
                receiverEmail: '',
              }}
              onSubmit={sendSaleByMail}
            >
              {({isSubmitting, setFieldValue}) => {
                //changeValueField = setFieldValue;
                return (
                  <Form
                    style={{textAlign: 'left', justifyContent: 'center'}}
                    noValidate
                    autoComplete='on'
                  >
                    <Grid container spacing={2} sx={{width: 1}}>
                      <Grid item xs={12}>
                        <AppTextField
                          label='Correo Del Receptor'
                          name='receiverEmail'
                          variant='outlined'
                          sx={{
                            width: '100%',
                            '& .MuiInputBase-input': {
                              fontSize: 14,
                            },
                            my: 2,
                          }}
                        />
                      </Grid>
                    </Grid>

                    <ButtonGroup
                      orientation='vertical'
                      variant='outlined'
                      sx={{width: 1, my: '10px'}}
                      aria-label='outlined button group'
                    >
                      <Button
                        color='primary'
                        sx={{mx: 'auto', width: '50%', py: 3}}
                        type='submit'
                        variant='contained'
                        disabled={isSubmitting}
                      >
                        Enviar
                      </Button>
                    </ButtonGroup>
                  </Form>
                );
              }}
            </Formik>
        </DialogContent>
      </Dialog>



      <Dialog
        open={openSendWhatsapp}
        onClose={() => setOpenSendWhatsapp(false)}
        maxWidth='sm'
        fullWidth
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          <IconButton
            aria-label='close'
            onClick={() => setOpenSendWhatsapp(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          {'Envío de Venta por Whatsapp'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
            <Formik
             // validateOnChange={false}
              validationSchema={yup.object({
                receiverWhatsapp: yup.number().typeError(<IntlMessages id='validation.number' />),
              })}
              initialValues={ {
                receiverWhatsapp: '',
              }}
              onSubmit={sendSaleByWhatsapp}
            >
              {({isSubmitting, setFieldValue}) => {
                //changeValueField = setFieldValue;
                return (
                  <Form
                    style={{textAlign: 'left', justifyContent: 'center'}}
                    noValidate
                    autoComplete='on'
                  >
                    <Grid container spacing={2} sx={{width: 1}}>
                      <Grid item xs={12}>
                        <AppTextField
                          label='Número de Whatsapp'
                          name='receiverWhatsapp'
                          variant='outlined'
                          sx={{
                            width: '100%',
                            '& .MuiInputBase-input': {
                              fontSize: 14,
                            },
                            my: 2,
                          }}
                        />
                      </Grid>
                    </Grid>

                    <ButtonGroup
                      orientation='vertical'
                      variant='outlined'
                      sx={{width: 1, my: '10px'}}
                      aria-label='outlined button group'
                    >
                      <Button
                        color='primary'
                        sx={{mx: 'auto', width: '50%', py: 3}}
                        type='submit'
                        variant='contained'
                        disabled={isSubmitting}
                      >
                        Enviar
                      </Button>
                    </ButtonGroup>
                  </Form>
                );
              }}
            </Formik>
        </DialogContent>
      </Dialog>

      <Dialog
        open={ticketResponseDialog}
        onClose={() => setTicketResponseDialog(false)}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Registro de Ticket'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          {showMessageTicketRegistration()}
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button
            variant='outlined'
            onClick={() => {
              dispatch({type: GENERATE_SELL_TICKET, payload: undefined});
              setTicketResponseDialog(false);
            }}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  ) : null;
};

export default SalesTable;
