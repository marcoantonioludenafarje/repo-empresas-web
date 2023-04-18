import React, {useEffect} from 'react';
import AppPageMeta from '../../../@crema/core/AppPageMeta';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import {useIntl} from 'react-intl';

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
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import Backdrop from "@mui/material/Backdrop";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import InputIcon from '@mui/icons-material/Input';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
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
  toEpoch,
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
  GET_USER_DATA,
  GET_ROL_USER,
  GENERATE_SELL_TICKET
} from '../../../shared/constants/ActionTypes';
import MoreFilters from '../Filters/MoreFilters';

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
/* let listFinancesPayload = {
  request: {
    payload: {
      initialTime: null,
      finalTime: null,
      movementType: 'INCOME',
      merchantId: '',
      createdAt: null,
      monthMovement: null,
      yearMovement: null,
      searchByBill: '',
      searchByContableMovement: null,
    },
  },
}; */
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
let listPayload = {
  request: {
    payload: {
      initialTime: toEpoch(Date.now() - 2678400000),
      finalTime: toEpoch(Date.now()),
      businessProductCode: null,
      movementType: 'OUTPUT',
      merchantId: '',
      createdAt: null,
      searchByDocument: null,
      movementHeaderId: null,
      outputId: null,
      userCreated: null,
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
const defaultValues = {
  date1: '',
  date2: '',
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

let codProdSelected = '';
let selectedOutput = {};
let redirect = false;

const OutputsTable = (props) => {
  //Dependencias
  const classes = useStyles(props);
  const dispatch = useDispatch();
  let popUp = false;
  const router = useRouter();
  const {query} = router;
  console.log('query', query);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  //UseStates
  const [openStatus, setOpenStatus] = React.useState(false);
  const [eliminated, setEliminated] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  // const [open3, setOpen3] = React.useState(false);
  const [openDetails, setOpenDetails] = React.useState(false);
  const [openDocuments, setOpenDocuments] = React.useState(false);
  const [rowNumber, setRowNumber] = React.useState(0);
  const [moreFilters, setMoreFilters] = React.useState(false);
  //MENU ANCHOR
  const [anchorEl, setAnchorEl] = React.useState(null);
  //FECHAS
  //SELECCIÓN CALENDARIO
  const [value, setValue] = React.useState(Date.now() - 2678400000);
  const [value2, setValue2] = React.useState(Date.now());
  const [typeClient, setTypeClient]= React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  // setOpen3(query.operationBack)
  //API FUNCTIONS
  const getBusinessParameter = (payload) => {
    dispatch(onGetBusinessParameter(payload));
  };
  const getGlobalParameter = (payload) => {
    dispatch(onGetGlobalParameter(payload));
  };
  const toGetMovements = (payload) => {
    dispatch(getMovements(payload));
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

  //GET APIS RES
  const {businessParameter} = useSelector(({general}) => general);
  console.log('globalParameter123', businessParameter);
  const {dataBusinessRes} = useSelector(({general}) => general);
  console.log('dataBusinessRes', dataBusinessRes);
  const {globalParameter} = useSelector(({general}) => general);
  console.log('globalParameter123', globalParameter);
  const {getMovementsRes} = useSelector(({movements}) => movements);
  console.log('getMovementsRes', getMovementsRes);
  const {successMessage} = useSelector(({movements}) => movements);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({movements}) => movements);
  console.log('errorMessage', errorMessage);
  const {getFinancesRes} = useSelector(({finances}) => finances);
  console.log('getFinancesRes', getFinancesRes);
  const {generateInvoiceRes} = useSelector(({movements}) => movements);
  console.log('generateInvoiceRes', generateInvoiceRes);
  const {actualDateRes} = useSelector(({general}) => general);
  console.log('actualDateRes', actualDateRes);
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
    dispatch({type: GENERATE_SELL_TICKET, payload: undefined});
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
    if (userDataRes && userDataRes.merchantSelected) {
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      dispatch({type: GET_MOVEMENTS, payload: undefined});

      listPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;
      businessParameterPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;

      if (Object.keys(query).length !== 0) {
        console.log('Query con datos', query);
        listPayload.request.payload.movementHeaderId = query.movementHeaderId;
      }

      (searchPrivilege("outputsTable") ? listPayload.request.payload.userCreated = null : listPayload.request.payload.userCreated = userDataRes.userId);
      console.log("toGetMovements [userDataRes] ",listPayload)
      toGetMovements(listPayload);
      if (Object.keys(query).length !== 0) {
        listPayload.request.payload.movementHeaderId = null;
      }
      getBusinessParameter(businessParameterPayload);
      getGlobalParameter(globalParameterPayload);
      console.log("userDataRes1234", userDataRes)
      console.log("userDataRes.merchantSelected.typeClien", userDataRes.merchantSelected.typeClient)
      
      setTypeClient(userDataRes.merchantSelected.typeClient ? userDataRes.merchantSelected.typeClient  : 'PJ')
    }
  }, [userDataRes]);
  useEffect(() => {
    setValue2(Date.now());
    listPayload.request.payload.finalTime = toEpoch(Date.now());
    console.log('Se ejecuta esto?');
    if (userDataRes) {
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      listPayload.request.payload.finalTime = toEpoch(Date.now());
      listPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;
      if (Object.keys(query).length !== 0) {
        console.log('Query con datos', query);
        listPayload.request.payload.movementHeaderId = query.movementHeaderId;
      }
      (searchPrivilege("outputsTable") ? listPayload.request.payload.userCreated = null : listPayload.request.payload.userCreated = userDataRes.userId);
      console.log("toGetMovements [actualDateRes] ",listPayload)
      toGetMovements(listPayload);
      if (Object.keys(query).length !== 0) {
        listPayload.request.payload.movementHeaderId = null;
      }
    }
  }, [actualDateRes]);

  useEffect(() => {
    if (generateSellTicketRes) {
      console.log('Se manda al ticket de venta', generateSellTicketRes);
      // const link = document.createElement('a');
      // link.href = generateSellTicketRes.enlace_del_pdf;
      // link.target = `${generateSellTicketRes.enlace_del_pdf}`;
      // link.click();
      setIsLoading(false);
      toGetMovements(listPayload);
      window.open(`${generateSellTicketRes.enlace_del_pdf}`);
    }
  }, [generateSellTicketRes]);

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
  const searchOutputs = () => {
    listPayload.request.payload.denominationClient = '';
    listPayload.request.payload.searchByDocument = '';
    listPayload.request.payload.typeDocumentClient = '';
    listPayload.request.payload.numberDocumentClient = '';
    (searchPrivilege("outputsTable") ? listPayload.request.payload.userCreated = null : listPayload.request.payload.userCreated = userDataRes.userId);
    console.log("toGetMovements [searchOutputs] ",listPayload)
    toGetMovements(listPayload);
  };
  const newOutput = () => {
    Router.push('/sample/outputs/new');
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
  const handleClick = (codOutput, event) => {
    setAnchorEl(event.currentTarget);
    codProdSelected = codOutput;
    selectedOutput = findOutput(codOutput);
    console.log('selectedOutput', selectedOutput);
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
  const confirmDelete = () => {
    console.log('Eliminando salida :(');
    deletePayload.request.payload.movementTypeMerchantId =
      selectedOutput.movementTypeMerchantId;
    deletePayload.request.payload.createdAt =
      selectedOutput.createdAt;
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

    dispatch({type: GET_MOVEMENTS, payload: undefined});
    toDeleteMovement(deletePayload);
    setOpen2(false);
    setTimeout(() => {
      setOpenStatus(true);
    }, 1000);
  };
  const setDeleteState = () => {
    setOpen2(true);
    handleClose();
  };
  const goToMoves = () => {
    console.log('Llendo a movimientos');
  };

  //MANEJO DE FECHAS
  const toEpoch = (strDate) => {
    let someDate = new Date(strDate);
    someDate = someDate.getTime();
    return someDate;
  };

  const sendStatus = () => {
    setOpenStatus(false);
    setTimeout(() => {
      (searchPrivilege("outputsTable") ? listPayload.request.payload.userCreated = null : listPayload.request.payload.userCreated = userDataRes.userId);
      console.log("toGetMovements [sendStatus] ",listPayload)
      toGetMovements(listPayload);
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

  const cleanList = () => {
    let listResult = [];
    getMovementsRes.map((obj) => {
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
      obj.clientdenomination = (obj.client 
        ? obj.numberDocumentClient + " - " 
        : '') + 
        (obj.client
        ? obj.client.denomination
        : obj.clientName);
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

      console.log ("statusObject",obj)
      obj.receipt1 = statusTextObject(obj, obj.existReceipt, 'receipt')
      obj.ticket1 = statusTextObject(obj, (obj.existSellTicket ? true : false), 'ticket')
      obj.referralGuide1 = statusTextObject(obj, obj.existReferralGuide, 'referralGuide');
      obj.bill1 = statusTextObject(obj, obj.existBill, 'bill');
      obj.income1 = statusTextObject(obj, obj.existIncome, 'income');
      console.log ("statusObject1",obj)

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
  const getSellTicket = () => {
    handleClose();
    let finalPayload = {
      request: {
        payload: {
          merchantId: userDataRes.merchantSelected.merchantId,
          denominationMerchant:
            userDataRes.merchantSelected.denominationMerchant,
          typePDF: userDataRes.merchantSelected.typeMerchant,
          folderMovement: selectedOutput.folderMovement,
          movementTypeMerchantId: selectedOutput.movementTypeMerchantId,
          contableMovementId: selectedOutput.contableMovementId || '',
          movementHeaderId: selectedOutput.movementHeaderId,
          createdAt: Number(selectedOutput.createdAt),
          clientId: selectedOutput.clientId,
          totalPriceWithIgv: Number(selectedOutput.totalPriceWithIgv.toFixed(3)), //
          issueDate: specialFormatToSunat(),
          serial: 'V001',
          documentIntern: selectedOutput.documentIntern,
          clientEmail: selectedOutput.clientEmail,
          numberSellTicket: selectedOutput.codMovement.split("-")[1],
          automaticSendSunat: /* sendSunat */ true,
          automaticSendClient: /* sendClient */ true,
          referralGuide: false,
          creditSale: false,
          referralGuideSerial: '',
          dueDate: dateWithHyphen(Date.now() + 1 * 24 * 60 * 60 * 1000),
          observation: '',
          igv: Number(selectedOutput.igv),
          productsInfo: selectedOutput.descriptionProductsInfo.map((obj) => {
            console.log(
              'facturabusinessProductCode',
              obj.businessProductCode,
            );
            return {
              product: obj.product,
              quantityMovement: Number(obj.quantityMovement),
              priceBusinessMoneyWithIgv: Number(
                obj.priceBusinessMoneyWithIgv,
              ),
              customCodeProduct: obj.customCodeProduct,
              description: obj.description,
              unitMeasure: obj.unitMeasure,
              businessProductCode: obj.businessProductCode,
            };
          }),
          documentsMovement: selectedOutput.documentsMovement,
          referralGuides: [],
        },
      },
    };
    console.log('getSellTicket payload', finalPayload);
    toGenerateSellTicket(finalPayload);
    setIsLoading(true);
  };
  const getReferralGuide = () => {
    console.log('Selected Output', selectedOutput);
    Router.push({
      pathname: '/sample/referral-guide/get',
      query: selectedOutput,
    });
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
    if (a.createdDate < b.createdDate) {
      return 1;
    }
    if (a.createdDate > b.createdDate) {
      return -1;
    }
    return 0;
  };
  const handleClose2 = () => {
    setOpen2(false);
  };

  const goToFile = () => {
    // Router.push({
    //   pathname: '/sample/explorer',
    //   query: {
    //     goDirectory: true,
    //     path: selectedOutput.folderMovement,
    //   },
    // });
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

  const findOutput = (outputId) => {
    return getMovementsRes.find((obj) => obj.movementHeaderId == outputId);
  };
  const showObject = (codOutput, type) => {
    codProdSelected = codOutput;
    selectedOutput = findOutput(codOutput);
    if (type == 'income') {
      Router.push({
        pathname: '/sample/finances/table',
        query: {contableMovementId: selectedOutput.contableMovementId},
      });
    } else if (type == 'bill') {
      Router.push({
        pathname: '/sample/bills/table',
        query: {billId: selectedOutput.billId},
      });
    } else if (type == 'referralGuide') {
      Router.push({
        pathname: '/sample/referral-guide/table',
        query: {movementHeaderId: selectedOutput.movementHeaderId},
      });
    } else if (type == 'receipt') {
      Router.push({
        pathname: '/sample/receipts/table',
        query: {referralGuideId: selectedOutput.receiptId},
      });
    } else {
      return null;
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
      /* income = getFinancesRes.find(
        (income) => income.financeId == selectedOutput.incomeId,
      ); */
      income = getFinancesRes[0];
      Router.push({
        pathname: '/sample/finances/update-earning',
        query: income,
      });
      redirect = false;
    }
  }, [getFinancesRes]);

  // useEffect(() => {
  //   setValue2(Date.now());
  //   listPayload.request.payload.finalTime = toEpoch(newValue2);
  //   setOpen3(false)
  // }, [open3]);
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
          return (
              `${mintype} - ${cod}`
          );
        } else {
          if (type != 'ticket' && obj.documentsMovement && obj.documentsMovement.length>0) {
            let serialDocumentObj = obj.documentsMovement.filter( item => item.typeDocument === type);
            let serialDocument = serialDocumentObj && serialDocumentObj.length>0 && type != 'referralGuide' ? serialDocumentObj[0].serialDocument : "Generado";
            
            if (serialDocumentObj && serialDocumentObj.length>0 && type == 'referralGuide')
              serialDocument = serialDocumentObj.length==1 ? serialDocumentObj[0].serialDocument : "Varias";

            return serialDocument;

          } else if (type == 'ticket') {
            return 'Ver'
            
          } else {
            return 'Generado'
          }
        }
      } else {
        return 'No generado';
      }
    } else {
      return 'No aplica';
    }
  };

  const statusObject = (obj, exist, type, mintype, cod) => {
    if (obj.movementSubType == 'sales') {
      if (exist) {
        if (mintype) {
          return (
            <Button
              variant='secondary'
              sx={{fontSize: '1em'}}
              /* disabled={type == 'referralGuide'} */
              onClick={() => showObject(obj.movementHeaderId, type)}
            >
              {`${mintype} - ${cod}`}
            </Button>
          );
        } else {
          if (type != 'ticket' && obj.documentsMovement && obj.documentsMovement.length>0) {
            let serialDocumentObj = obj.documentsMovement.filter( item => item.typeDocument === type);
            let serialDocument = serialDocumentObj && serialDocumentObj.length>0 && type != 'referralGuide' ? serialDocumentObj[0].serialDocument : "Generado";
            
            if (serialDocumentObj && serialDocumentObj.length>0 && type == 'referralGuide')
              serialDocument = serialDocumentObj.length==1 ? serialDocumentObj[0].serialDocument : "Varias";

            return (
              <Button
                variant='secondary'
                sx={{fontSize: '1em'}}
                /* disabled={type == 'referralGuide'} */
                onClick={() => showObject(obj.movementHeaderId, type)}
              >
                {serialDocument}
              </Button>
            );

          } else if (type == 'ticket') {
            return (
              <Button
                variant='secondary'
                sx={{fontSize: '1em'}}
                /* disabled={type == 'referralGuide'} */
                onClick={() => {window.open(obj.existSellTicket)}}
              >
                NRO. {obj.codMovement.split('-')[1]}
              </Button>
            );
            
          } else {
            return (
              <Button
                variant='secondary'
                sx={{fontSize: '1em'}}
                /* disabled={type == 'referralGuide'} */
                onClick={() => showObject(obj.movementHeaderId, type)}
              >
                Generado
              </Button>
            );
          }
        }
      } else {
        return (
          <Button
            variant='secondary'
            sx={{fontSize: '1em'}}
            onClick={() => generateObject(obj.movementHeaderId, type)}
          >
            No Generado
          </Button>
        );
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
    setOpenDetails(false);
    setOpenDetails(true);
    if (openDetails == true && rowNumber == index) {
      setOpenDetails(false);
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
          query: {movementHeaderId: doc.referralGuideId},
        });
      }
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
    dispatch({type: GET_MOVEMENTS, payload: undefined});
    (searchPrivilege("outputsTable") ? listPayload.request.payload.userCreated = null : listPayload.request.payload.userCreated = userDataRes.userId);
    console.log("toGetMovements [filterData] ",listPayload)
    toGetMovements(listPayload);
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
          if (objSubModules.idFront == opcion && objSubModules.typeAccess == 'RESTRICTED'){
            access = false;
          }            
        }
      }
      console.log('submodule fin: ', access);

    return access;
  }

  function validationClientType(selectedOutput1, documentType) {
    let validation = false;

    if(selectedOutput1 && selectedOutput1.clientId) {

      let client = selectedOutput1.clientId.split('-');
      let clientDocumentType = client [0];
      let clientNumberDocument = client [1];

      if (clientDocumentType != "RUC" && documentType == "receipt") {
        validation = true;
      } else if (clientDocumentType == "RUC" && (documentType == "referralGuide" || documentType == "distribution")) {
        validation = true;
      } else if (clientDocumentType == "RUC" && clientNumberDocument.charAt(0) == '1' && (documentType == "receipt" || documentType == "bill")) {
        validation = true;
      } else if (clientDocumentType == "RUC" && clientNumberDocument.charAt(0) == '2' && documentType == "bill") {
        validation = true;
      }
    }
    
    console.log("selectedOutput1",selectedOutput1)
    return validation;
  }


  return  typeClient ? (
    <Card sx={{p: 4}}>
      <Stack sx={{
        m: 2,
      }} 
      direction={isMobile ? 'column' : 'row'} spacing={2} className={classes.stack}>
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
          onClick={searchOutputs}
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
              <TableCell>Codigo</TableCell>
              <TableCell>Fecha registrada</TableCell>
              <TableCell>Última actualización</TableCell>
              <TableCell>Tipo de movimiento</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Detalle productos</TableCell>
              <TableCell>Detalle documentos</TableCell>
              <TableCell>Boleta Venta relacionada</TableCell>
              {typeClient == 'PN' ?
                <TableCell>Ticket Venta relacionada</TableCell>
                : null}
              <TableCell>Guía de remisión relacionada</TableCell>
              <TableCell>Factura relacionada</TableCell>
              <TableCell>Ingreso relacionado</TableCell>
              <TableCell>Precio total sin IGV</TableCell>
              <TableCell>Precio total con IGV</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Creado por</TableCell>
              <TableCell>Modificado por</TableCell>
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getMovementsRes && Array.isArray(getMovementsRes) ? (
              getMovementsRes.sort(compare).map((obj, index) => {
                const style =
                  obj.descriptionProductsInfo &&
                  obj.descriptionProductsInfo.length != 0
                    ? 'flex'
                    : null;
                return (
                  <>
                    <TableRow
                      sx={{'&:last-child td, &:last-child th': {border: 0}}}
                      key={index}
                    >
                      <TableCell>{`${showMinType(obj.movementType)} - ${
                        obj.codMovement ? obj.codMovement.split('-')[1] : ''
                      }`}</TableCell>
                      <TableCell>
                        {convertToDateWithoutTime(obj.createdAt)}
                      </TableCell>
                      <TableCell>
                        {convertToDateWithoutTime(obj.updatedDate)}
                      </TableCell>
                      <TableCell>
                        {showSubtypeMovement(obj.movementSubType)}
                      </TableCell>
                      <TableCell>
                        {(obj.client 
                          ? obj.numberDocumentClient + " - " 
                          : '') + 
                          (obj.client ? obj.client.denomination : obj.clientName)}
                      </TableCell>
                      <TableCell
                        sx={{
                          display: style,
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px',
                        }}
                      >
                        {/* {obj.descriptionProductsInfo
                          ? obj.descriptionProducts
                          : ''} */}
                        {obj.descriptionProductsInfo &&
                        obj.descriptionProductsInfo.length != 0 ? (
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
                        {obj.documentsMovement &&
                        obj.documentsMovement.length != 0 ? (
                          <IconButton
                            onClick={() => checkDocuments(obj, index)}
                            size='small'
                          >
                            <FormatListBulletedIcon fontSize='small' />
                          </IconButton>
                        ) : (
                          <></>
                        )}
                      </TableCell>
                      <TableCell align='center'>
                        {statusObject(obj, obj.existReceipt, 'receipt')}
                      </TableCell>
                      {typeClient == 'PN' ?
                        <TableCell align='center'>
                          {statusObject(obj, (obj.existSellTicket ? true : false), 'ticket')}
                        </TableCell>
                        : null }
                      <TableCell align='center'>
                        {statusObject(
                          obj,
                          obj.existReferralGuide,
                          'referralGuide',
                        )}
                      </TableCell>
                      <TableCell align='center'>
                        {statusObject(obj, obj.existBill, 'bill')}
                      </TableCell>
                      <TableCell align='center'>
                        {statusObject(
                          obj,
                          obj.existIncome,
                          'income',
                          obj.codContableMovementRelated
                            ? showMinTypeRelated(
                                obj.codContableMovementRelated.split('-')[0],
                              )
                            : '',
                          obj.codContableMovementRelated
                            ? obj.codContableMovementRelated.split('-')[1]
                            : '',
                        )}
                      </TableCell>
                      <TableCell>
                        {obj.totalPrice
                          ? `${obj.totalPrice.toFixed(3)} ${money_unit}`
                          : ''}
                      </TableCell>
                      <TableCell>
                        {obj.totalPriceWithIgv
                          ? `${obj.totalPriceWithIgv.toFixed(3)} ${money_unit}`
                          : ''}
                      </TableCell>
                      <TableCell>{showStatus(obj.status)}</TableCell>
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
                          onClick={handleClick.bind(this, obj.movementHeaderId)}
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
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {obj.descriptionProductsInfo !== undefined &&
                                obj.descriptionProductsInfo.length !== 0 ? (
                                  obj.descriptionProductsInfo.map(
                                    (subProduct, index) => {
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
                                        </TableRow>
                                      );
                                    },
                                  )
                                ) : (
                                  <></>
                                )}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                    <TableRow key={`doc-${index}`}>
                      <TableCell
                        style={{paddingBottom: 0, paddingTop: 0}}
                        colSpan={6}
                      >
                        <Collapse
                          in={openDocuments && index == rowNumber}
                          timeout='auto'
                          unmountOnExit
                        >
                          <Box sx={{margin: 0}}>
                            <Table size='small' aria-label='purchases'>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Fecha de documento</TableCell>
                                  <TableCell>Número de documento</TableCell>
                                  <TableCell>Tipo de documento</TableCell>
                                  <TableCell>Anulado?</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {obj.documentsMovement !== undefined &&
                                obj.documentsMovement.length !== 0 ? (
                                  obj.documentsMovement.map(
                                    (subDocument, index) => {
                                      return (
                                        <TableRow
                                          key={index}
                                          sx={{cursor: 'pointer'}}
                                          hover
                                          onClick={() =>
                                            goToDocument(subDocument)
                                          }
                                        >
                                          <TableCell>
                                            {subDocument.issueDate}
                                          </TableCell>
                                          <TableCell>
                                            {subDocument.serialDocument}
                                          </TableCell>
                                          <TableCell>
                                            {translateValue(
                                              'DOCUMENTTYPE',
                                              subDocument.typeDocument.toUpperCase(),
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            {showCanceled(
                                              subDocument.cancelStatus,
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    },
                                  )
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
      </TableContainer>
      {isLoading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
          .includes('/inventory/exportOutputs/*') ===
          true && !popUp ? (
            <Button
              variant='outlined'
              startIcon={<GridOnOutlinedIcon />}
              onClick={exportDoc}
            >
              Exportar todo
            </Button>
        ) : null}

        {!popUp ? (
          <></> 
        ) : (
          <CircularProgress disableShrink sx={{m: '10px'}} />
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
        true ? (
          <MenuItem onClick={goToUpdate}>
            <CachedIcon sx={{mr: 1, my: 'auto'}} />
            Actualizar
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
          .includes('/inventory/movementProducts/list?path=/output/*') ===
        true ? (
          <MenuItem disabled onClick={goToMoves}>
            <PictureAsPdfIcon sx={{mr: 1, my: 'auto'}} />
            Exportar
          </MenuItem>
        ) : null}

        {typeClient == 'PN' && localStorage
          .getItem('pathsBack')
          .includes(
            '/facturacion/accounting/movement/register?path=/sellticketOfOutput/*',
          ) &&
        selectedOutput.movementSubType == 'sales' &&
        !selectedOutput.existSellTicket ? (
          <MenuItem onClick={getSellTicket}>
            <ReceiptLongIcon sx={{mr: 1, my: 'auto'}} />
            Generar Ticket
          </MenuItem>
        ) : null}

        {validationClientType(selectedOutput,'receipt') && localStorage
          .getItem('pathsBack')
          .includes(
            '/facturacion/accounting/movement/register?path=/receiptOfOutput/*',
          ) &&
        selectedOutput.movementSubType == 'sales' &&
        !selectedOutput.existReceipt ? (
          <MenuItem onClick={getReceipt}>
            <ReceiptLongIcon sx={{mr: 1, my: 'auto'}} />
            Generar Boleta Venta
          </MenuItem>
        ) : null}
        
        {validationClientType(selectedOutput,'referralGuide') && localStorage
          .getItem('pathsBack')
          .includes(
            '/facturacion/accounting/movement/register?path=/referralGuideOfOutput/*',
          ) && selectedOutput.movementSubType == 'sales' ? (
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

        {validationClientType(selectedOutput,'bill') && localStorage
          .getItem('pathsBack')
          .includes(
            '/facturacion/accounting/movement/register?path=/billOfOutput/*',
          ) &&
        selectedOutput.movementSubType == 'sales' &&
        !selectedOutput.existBill ? (
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
        selectedOutput.existBill &&
        !selectedOutput.existIncome &&
        selectedOutput.movementSubType == 'sales' ? (
          <MenuItem onClick={doFinance}>
            <InputIcon sx={{mr: 1, my: 'auto'}} />
            Generar ingreso
          </MenuItem>
        ) : null}

        {validationClientType(selectedOutput,'distribution') && localStorage
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
    </Card>
  ) : null 
};

export default OutputsTable;
