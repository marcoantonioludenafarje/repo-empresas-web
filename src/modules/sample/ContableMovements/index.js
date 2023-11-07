import React, {useEffect} from 'react';
import {useIntl} from 'react-intl';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import {
  CustomizerItemWrapper,
  StyledToggleButton,
} from '../../../@crema/core/AppThemeSetting/index.style';
import * as yup from 'yup';
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
  Select,
  FormControlLabel,
  InputLabel,
  Popper,
  Grow,
  Stack,
  TextField,
  Card,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  FormControl,
  Collapse,
  useTheme,
  useMediaQuery,
  TableSortLabel,
} from '@mui/material';
import {makeStyles} from '@mui/styles';

import {ClickAwayListener} from '@mui/base';
import ResultState from '../Finances/ResultState';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CloseIcon from '@mui/icons-material/Close';
import {red} from '@mui/material/colors';

import {getUserData} from '../../../redux/actions/User';
import {
  GET_FINANCES,
  GET_FINANCES_FOR_RESULT_STATE,
  DELETE_FINANCE,
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_MOVEMENTS,
  GET_USER_DATA,
  EXPORT_EXCEL_MOVEMENTS_DETAILS,
  EXPORT_EXCEL_MOVEMENTS_SUMMARY,
  ALL_FINANCES,
} from '../../../shared/constants/ActionTypes';
import Router, {useRouter} from 'next/router';
import {format, addHours, addMinutes} from 'date-fns'; // Importamos la librería date-fns para manipulación de fechas
import {DesktopDatePicker, DateTimePicker, DateRangePicker} from '@mui/lab';
import {
  getFinances,
  getAllFinances,
  deleteFinance,
  exportExcelMovementsDetails,
  exportExcelMovementsSummary,
  getFinancesForResultState,
} from '../../../redux/actions/Finances';
import {useDispatch, useSelector} from 'react-redux';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import {
  getYear,
  getActualMonth,
  translateValue,
  fixDecimals,
  convertToDateWithoutTime,
  ISO8601DateToSunatDate,
  toEpoch,
  timestampToISO8601,
} from '../../../Utils/utils';
import MoreFiltersContableMovements from '../Filters/MoreFiltersContableMovements';
import {exportExcelTemplateMovementsDetails} from '../../../redux/actions/Finances';

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
const months = {
  all: 'Todos',
  January: 'Enero',
  February: 'Febrero',
  March: 'Marzo',
  April: 'Abril',
  May: 'Mayo',
  June: 'Junio',
  July: 'Julio',
  August: 'Agosto',
  September: 'Septiembre',
  October: 'Octubre',
  November: 'Noviembre',
  December: 'Diciembre',
};
//FORCE UPDATE
const useForceUpdate = () => {
  const [reload, setReload] = React.useState(0); // integer state
  return () => setReload((value) => value + 1); // update the state to force render
};
const ContableMovements = (props) => {
  const classes = useStyles(props);
  const theme = useTheme();
  const forceUpdate = useForceUpdate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [value, setValue] = React.useState(Date.now());
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open2, setOpen2] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [monthYearStatus, setMonthYearStatus] = React.useState(true);
  const [month, setMonth] = React.useState(getActualMonth().toUpperCase());
  const [year, setYear] = React.useState(getYear());
  const [openPaids, setOpenPaids] = React.useState(false);
  const [openOtherPayConcepts, setOpenOtherPayConcepts] = React.useState(false);
  const [rowNumber, setRowNumber] = React.useState(0);
  const [openDetails, setOpenDetails] = React.useState(false);
  const [openDocuments, setOpenDocuments] = React.useState(false);
  const [moreFilters, setMoreFilters] = React.useState(false);
  const [financeType, setFinanceType] = React.useState('INCOME');
  const [movementType, setMovementType] = React.useState('TODOS');
  const [dateType, setDateType] = React.useState('createdDate');
  const [initialTime, setInitialTime] = React.useState(Date.now());
  const [finalTime, setFinalTime] = React.useState(Date.now());
  const [totalAmount, setTotalAmount] = React.useState(0);
  const [downloadExcelDetails, setDownloadExcelDetails] = React.useState(false);
  const [downloadExcelSummary, setDownloadExcelSummary] = React.useState(false);
  const [lastPayload, setLastPayload] = React.useState('');
  const [resultState, setResultState] = React.useState(false);

  const [selectedFinance, setSelectedFinance] = React.useState('');
  const currentDate = new Date(); // Obtenemos la fecha actual
  const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0)); // Modificamos la fecha actual para que sea a las 0 horas del día
  const endOfDay = addMinutes(addHours(new Date(startOfDay), 23), 59); // Agregamos 23 horas a la fecha de inicio para obtener las 23:59 del día actual
  const [dateRange, setDateRange] = React.useState([startOfDay, endOfDay]); // Estado para el rango de fechas

  const [orderBy, setOrderBy] = React.useState(''); // Estado para almacenar el campo de ordenación actual
  const [order, setOrder] = React.useState('asc'); // Estado para almacenar la dirección de ordenación
  const openMenu = Boolean(anchorEl);
  const dispatch = useDispatch();
  const router = useRouter();
  const {query} = router;
  console.log('query', query);
  const {userDataRes} = useSelector(({user}) => user);

  let codFinanceSelected = '';

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
  const {
    getFinancesRes,
    allFinancesRes,
    financesLastEvaluatedKey_pageListFinances,
  } = useSelector(({finances}) => finances);
  const {getFinancesForResultStateRes} = useSelector(({finances}) => finances);
  const {deleteFinanceRes} = useSelector(({finances}) => finances);
  const {businessParameter} = useSelector(({general}) => general);
  const {moneyUnitBusiness} = useSelector(({general}) => general);
  const {weightBusiness} = useSelector(({general}) => general);
  const {moneySymbol} = useSelector(({general}) => general);
  const {successMessage} = useSelector(({finances}) => finances);
  const {errorMessage} = useSelector(({finances}) => finances);
  const {userAttributes} = useSelector(({user}) => user);
  const {exportExcelMovementsDetailsRes} = useSelector(
    ({finances}) => finances,
  );
  const {exportExcelMovementsSummaryRes} = useSelector(
    ({finances}) => finances,
  );
  var fecha_actual = new Date();
  var timestamp_utc = Math.floor(fecha_actual.getTime() / 1000);
  console.log('fecha utc', timestamp_utc);
  console.log('fecha peru', Date.now());

  const {jwtToken} = useSelector(({general}) => general);
  console.log('getFinancesRes', getFinancesRes);
  console.log('deleteFinanceRes', deleteFinanceRes);
  console.log('getFinancesForResultStateRes', getFinancesForResultStateRes);
  console.log('businessParameter', businessParameter);
  console.log('moneyUnitBusiness', moneyUnitBusiness);
  console.log('weightBusiness', weightBusiness);
  console.log('moneySymbol', moneySymbol);
  console.log('successMessage', successMessage);
  console.log('errorMessage', errorMessage);
  console.log('Quiero usar jwtToken', jwtToken);

  //APIS
  const toGetFinances = (payload) => {
    dispatch(getAllFinances(payload, jwtToken));
  };
  const toGetFinancesInDebt = (payload) => {
    dispatch(getAllFinances(payload, jwtToken));
  };
  const toDeleteFinance = (payload) => {
    dispatch(deleteFinance(payload));
  };
  const toGetFinancesForResultState = (payload) => {
    dispatch(getFinancesForResultState(payload, jwtToken));
  };
  const toGetExcelMovementsDetails = (payload) => {
    dispatch(exportExcelMovementsDetails(payload));
  };
  const toGetExcelMovementsSummary = (payload) => {
    dispatch(exportExcelMovementsSummary(payload));
  };

  useEffect(() => {
    if (exportExcelMovementsDetailsRes && downloadExcelDetails) {
      setDownloadExcelDetails(false);
      const byteCharacters = atob(exportExcelMovementsDetailsRes);
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
      link.setAttribute('download', `contableMovementsDetails.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      dispatch({type: EXPORT_EXCEL_MOVEMENTS_DETAILS, payload: undefined});
    }
  }, [exportExcelMovementsDetailsRes, downloadExcelDetails]);
  useEffect(() => {
    if (exportExcelMovementsSummaryRes && downloadExcelSummary) {
      setDownloadExcelSummary(false);
      const byteCharacters = atob(exportExcelMovementsSummaryRes);
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
      link.setAttribute('download', `contableMovementsSummary.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      dispatch({type: EXPORT_EXCEL_MOVEMENTS_SUMMARY, payload: undefined});
    }
  }, [exportExcelMovementsSummaryRes, downloadExcelSummary]);
  useEffect(() => {
    setMonthYearStatus(true);
  }, [month || year]);
  useEffect(() => {
    if (allFinancesRes && Array.isArray(allFinancesRes)) {
      let total = 0;
      allFinancesRes.forEach((obj) => {
        total += obj.totalAmount;
      });
      setTotalAmount(Number(total).toFixed(3));
    }
  }, [allFinancesRes]);
  useEffect(() => {
    if (userDataRes) {
      let listFinancesPayload = {
        request: {
          payload: {
            initialTime: null,
            finalTime: null,
            movementType: null,
            merchantId: userDataRes.merchantSelected.merchantId,
            createdAt: null,
            methodToPay: '',
            searchByBill: '',
            searchByContableMovement: '',
            typeList: '',
            listReduced: true,
          },
        },
      };

      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      dispatch({type: GET_FINANCES, payload: undefined});
      dispatch({type: GET_FINANCES_FOR_RESULT_STATE, payload: undefined});
      dispatch({type: GET_MOVEMENTS, payload: undefined});
      if (Object.keys(query).length !== 0) {
        console.log('Query con datos', query);
        listFinancesPayload.request.payload.searchByContableMovement =
          query.contableMovementId;
      }

      listFinancesPayload.request.payload.initialTime =
        dateType !== 'createdDate'
          ? timestampToISO8601(toEpoch(dateRange[0]))
          : toEpoch(dateRange[0]);
      listFinancesPayload.request.payload.finalTime =
        dateType !== 'createdDate'
          ? timestampToISO8601(toEpoch(dateRange[1]))
          : toEpoch(dateRange[1]);
      listFinancesPayload.request.payload.movementType = '';
      listFinancesPayload.request.payload.dateType = 'createdDate';
      setLastPayload(listFinancesPayload);
      toGetFinances(listFinancesPayload);
      if (monthYearStatus) {
        dispatch({type: GET_FINANCES_FOR_RESULT_STATE, payload: []});
        setMonthYearStatus(false);
      }
      if (Object.keys(query).length !== 0) {
        listFinancesPayload.request.payload.searchByContableMovement = null;
      }
    }
  }, [userDataRes]);
  const handleNextPage = (event) => {
    //console.log('Llamando al  handleNextPage', handleNextPage);
    let listFinancesPayload = {
      request: {
        payload: {
          initialTime: toEpoch(dateRange[0]),
          finalTime: toEpoch(dateRange[1]),
          movementType: movementType == 'TODOS' ? '' : movementType,
          dateType: 'createdDate',
          merchantId: userDataRes.merchantSelected.merchantId,
          createdAt: null,
          methodToPay: '',
          searchByBill: '',
          searchByContableMovement: '',
          typeList: '',
          listReduced: true,
        },
      },
    };
    listFinancesPayload.request.payload.LastEvaluatedKey =
      financesLastEvaluatedKey_pageListFinances;
    console.log('listFinancesPayload:handleNextPage:', listFinancesPayload);
    toGetFinances(listFinancesPayload);
    // setPage(page+1);
  };
  // Función para manejar el clic en el encabezado de la tabla
  const handleSort = (field) => {
    if (orderBy === field) {
      // Si se hace clic en el mismo encabezado, cambiamos la dirección de ordenación
      setOrder(order === 'asc' ? 'desc' : 'asc');
      const sortedProducts = [...allFinancesRes].sort((a, b) => {
        const descriptionA = a[`${field}`] ?? '';
        const descriptionB = b[`${field}`] ?? '';
        if (order === 'asc') {
          return descriptionA.localeCompare(descriptionB);
        } else {
          return descriptionB.localeCompare(descriptionA);
        }
      });
      dispatch({
        type: ALL_FINANCES,
        payload: sortedProducts,
        handleSort: true,
      });
      forceUpdate();
    } else {
      // Si se hace clic en un encabezado diferente, establecemos un nuevo campo de ordenación y la dirección ascendente
      setOrderBy(field);
      setOrder('asc');
      // const newListProducts = listProducts.sort((a, b) => a[`${field}`] - b[`${field}`])
      const sortedProducts = [...allFinancesRes].sort((a, b) => {
        const descriptionA = a[`${field}`] ?? '';
        const descriptionB = b[`${field}`] ?? '';
        return descriptionB.localeCompare(descriptionA);
      });
      dispatch({
        type: ALL_FINANCES,
        payload: sortedProducts,
        handleSort: true,
      });
      forceUpdate();
    }
  };
  const searchFinances = () => {
    dispatch({type: GET_FINANCES, payload: []});
    let listFinancesPayload = {
      request: {
        payload: {
          initialTime: null,
          finalTime: null,
          movementType: null,
          merchantId: userDataRes.merchantSelected.merchantId,
          createdAt: null,
          methodToPay: '',
          searchByBill: '',
          searchByContableMovement: '',
          typeList: '',
          listReduced: true,
        },
      },
    };
    listFinancesPayload.request.payload.movementType =
      movementType == 'TODOS' ? '' : movementType;
    listFinancesPayload.request.payload.dateType = dateType;
    listFinancesPayload.request.payload.initialTime =
      dateType !== 'createdDate'
        ? timestampToISO8601(toEpoch(dateRange[0]))
        : toEpoch(dateRange[0]);
    listFinancesPayload.request.payload.finalTime =
      dateType !== 'createdDate'
        ? timestampToISO8601(toEpoch(dateRange[1]))
        : toEpoch(dateRange[1]);
    setLastPayload(listFinancesPayload);
    toGetFinances(listFinancesPayload);
    if (monthYearStatus) {
      dispatch({type: GET_FINANCES_FOR_RESULT_STATE, payload: []});
      setMonthYearStatus(false);
    }
  };

  const searchFinancesInDebt = () => {
    let listFinancesPayload = {
      request: {
        payload: {
          initialTime: toEpoch(dateRange[0]),
          finalTime: toEpoch(dateRange[1]),
          movementType: movementType == 'TODOS' ? '' : movementType,
          merchantId: userDataRes.merchantSelected.merchantId,
          createdAt: null,
          methodToPay: '',
          searchByBill: '',
          searchByContableMovement: '',
          typeList: '',
          listReduced: true,
        },
      },
    };
    let listFinancesInDebt = listFinancesPayload;

    listFinancesInDebt.request.payload.dateType = dateType;
    listFinancesInDebt.request.payload.typeList = 'debt';
    dispatch({type: GET_FINANCES, payload: []});
    toGetFinancesInDebt(listFinancesInDebt);
    if (monthYearStatus) {
      dispatch({type: GET_FINANCES_FOR_RESULT_STATE, payload: []});
      setMonthYearStatus(false);
    }
    listFinancesInDebt.request.payload.typeList = '';
  };

  const sendStatus = () => {
    setOpenStatus(false);
    dispatch({type: GET_FINANCES, payload: []});
    let listFinancesPayload = {
      request: {
        payload: {
          initialTime: toEpoch(dateRange[0]),
          finalTime: toEpoch(dateRange[1]),
          dateType: dateType,
          movementType: movementType == 'TODOS' ? '' : movementType,
          merchantId: userDataRes.merchantSelected.merchantId,
          createdAt: null,
          methodToPay: '',
          searchByBill: '',
          searchByContableMovement: '',
          typeList: '',
          listReduced: true,
        },
      },
    };
    setTimeout(() => {
      setLastPayload(listFinancesPayload);
      toGetFinances(listFinancesPayload);
      if (monthYearStatus) {
        dispatch({type: GET_FINANCES_FOR_RESULT_STATE, payload: []});
        setMonthYearStatus(false);
      }
    }, 2200);
  };

  const handleClick = (codFinance, event) => {
    setAnchorEl(event.currentTarget);
    codFinanceSelected = codFinance;
    setSelectedFinance(allFinancesRes[codFinance]);
    console.log('selectedFinance', codFinanceSelected);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const setDeleteState = () => {
    setOpen2(true);
    handleClose();
  };
  const confirmDelete = () => {
    let deletePayload = {
      request: {
        payload: {
          contableMovementId: selectedFinance.contableMovementId,
          movementHeaderId: selectedFinance.movementHeaderId,
          movementTypeMerchantId: selectedFinance.movementTypeMerchantId,
        },
      },
    };
    dispatch({type: DELETE_FINANCE, payload: undefined});
    console.log('deletePayload', deletePayload);
    toDeleteFinance(deletePayload);
    setOpen2(false);
    /* setTimeout(() => { */
    setOpenStatus(true);
    /* }, 1000); */
  };
  const handleClose2 = () => {
    setOpen2(false);
  };

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
      return <CircularProgress disableShrink sx={{m: '10px'}} />;
    }
  };

  const goToFile = () => {
    // Router.push({
    //   pathname: '/sample/explorer',
    //   query: {
    //     goDirectory: true,
    //     path: selectedFinance.folderMovement,
    //   },
    // });
    const data = {
      goDirectory: true,
      path: selectedFinance.folderMovement,
    };
    localStorage.setItem('redirectUrl', JSON.stringify(data));
    window.open('/sample/explorer');
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

  const compare = (a, b) => {
    if (a.createdAt < b.createdAt) {
      return 1;
    }
    if (a.createdAt > b.createdAt) {
      return -1;
    }
    return 0;
  };

  const goToUpdate = () => {
    if (selectedFinance.movementType == 'EXPENSE') {
      Router.push({
        pathname: '/sample/finances/update-expense',
        query: selectedFinance,
      });
    }
    if (selectedFinance.movementType == 'INCOME') {
      console.log('finance seleccionado para actualizar: ', selectedFinance);
      Router.push({
        pathname: '/sample/finances/update-earning',
        query: selectedFinance,
      });
    }
  };

  const showType = (type) => {
    switch (type) {
      case 'INCOME':
        return <IntlMessages id='finance.type.income' />;
        break;
      case 'EXPENSE':
        return <IntlMessages id='finance.type.expense' />;
        break;
      default:
        return null;
    }
  };
  const {messages} = useIntl();
  const showMinType = (type) => {
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

  const showMinTypeRelated = (type) => {
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

  const showStatus = (status, typeFinance) => {
    if (typeFinance == 'INCOME') {
      switch (status) {
        case 'paid':
          return <IntlMessages id='finance.status.income.paid' />;
          break;
        case 'advance':
          return <IntlMessages id='finance.status.income.advance' />;
          break;
        case 'toPaid':
          return <IntlMessages id='finance.status.income.toPaid' />;
          break;
        default:
          return null;
      }
    } else if (typeFinance == 'EXPENSE') {
      switch (status) {
        case 'paid':
          return <IntlMessages id='finance.status.expense.paid' />;
          break;
        case 'advance':
          return <IntlMessages id='finance.status.expense.advance' />;
          break;
        case 'toPaid':
          return <IntlMessages id='finance.status.expense.toPaid' />;
          break;
        default:
          return null;
      }
    } else {
      return null;
    }
  };

  const redirect = (codMovement, type) => {
    if (type == 'expense') {
      Router.push({
        pathname: '/sample/inputs/table',
        query: {movementHeaderId: codMovement},
      });
    } else if (type == 'income') {
      Router.push({
        pathname: '/sample/outputs/table',
        query: {movementHeaderId: codMovement},
      });
    } else {
      return null;
    }
  };
  const checkDocuments = (input, index) => {
    setSelectedFinance(input);
    console.log('selectedFinance', input);
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
  const statusObject = (obj, exist, type, mintype, cod) => {
    if (exist) {
      return (
        <Button
          variant='secondary'
          sx={{fontSize: '1em'}}
          onClick={() => redirect(obj.movementHeaderId, type)}
        >
          {`${mintype} - ${cod}`}
        </Button>
      );
    } else {
      return 'No Generado';
    }
  };

  //BUSQUEDA
  const handleSearchValues = (event) => {
    let listFinancesPayload = {
      request: {
        payload: {
          initialTime: toEpoch(dateRange[0]),
          finalTime: toEpoch(dateRange[1]),
          dateType: 'createdDate',
          movementType: movementType == 'TODOS' ? '' : movementType,
          merchantId: userDataRes.merchantSelected.merchantId,
          createdAt: null,
          methodToPay: '',
          searchByBill: '',
          searchByContableMovement: '',
          typeList: '',
          listReduced: true,
        },
      },
    };
    console.log('Evento', event);
    if (event.target.name == 'searchByBill') {
      if (event.target.value == '') {
        listFinancesPayload.request.payload.searchByBill = '';
      } else {
        listFinancesPayload.request.payload.searchByBill = event.target.value;
      }
    }
    if (event.target.name == 'searchByDenominationProvider') {
      if (event.target.value == '') {
        listFinancesPayload.request.payload.denominationProvider = '';
      } else {
        listFinancesPayload.request.payload.denominationProvider =
          event.target.value;
      }
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

  const checkPaids = (input, index) => {
    setSelectedFinance(input);
    console.log('selectedFinance', input);
    setOpenOtherPayConcepts(false);
    setOpenPaids(true);
    if (openPaids == true && rowNumber == index) {
      setOpenPaids(false);
    }
    setRowNumber(index);
  };

  const checkOtherPayConcepts = (input, index) => {
    setSelectedFinance(input);
    console.log('selectedFinance', input);
    setOpenPaids(false);
    setOpenOtherPayConcepts(true);
    if (openOtherPayConcepts == true && rowNumber == index) {
      setOpenOtherPayConcepts(false);
    }
    setRowNumber(index);
  };

  const convertToDate = (miliseconds) => {
    const fecha = new Date(miliseconds);
    const fecha_actual = `${fecha.getDate()}/${
      fecha.getMonth() + 1
    }/${fecha.getFullYear()}`;
    return fecha_actual;
  };
  const getExcelMovementsSummary = () => {
    dispatch({type: EXPORT_EXCEL_MOVEMENTS_SUMMARY, payload: undefined});
    toGetExcelMovementsSummary(lastPayload);
    setDownloadExcelSummary(true);
  };
  const getExcelMovementsDetails = () => {
    dispatch({type: EXPORT_EXCEL_MOVEMENTS_DETAILS, payload: undefined});
    toGetExcelMovementsDetails(lastPayload);
    setDownloadExcelDetails(true);
  };
  const filterData = (dataFilters) => {
    let listFinancesPayload = {
      request: {
        payload: {
          initialTime: toEpoch(dateRange[0]),
          finalTime: toEpoch(dateRange[1]),
          movementType: movementType == 'TODOS' ? '' : movementType,
          merchantId: userDataRes.merchantSelected.merchantId,
          createdAt: null,
          methodToPay: '',
          searchByBill: '',
          searchByContableMovement: '',
          typeList: '',
          listReduced: true,
        },
      },
    };
    (listFinancesPayload.request.payload.searchByBill = ''),
      (listFinancesPayload.request.payload.typeDocumentProvider = '');
    listFinancesPayload.request.payload.numberDocumentProvider = '';
    listFinancesPayload.request.payload.denominationProvider = '';
    console.log('dataFilters', dataFilters);
    listFinancesPayload.request.payload.searchByBill = dataFilters.nroDoc;
    if (dataFilters.typeIdentifier == 'TODOS') {
      dataFilters.typeIdentifier = '';
    }
    listFinancesPayload.request.payload.typeDocumentProvider =
      dataFilters.typeIdentifier;
    listFinancesPayload.request.payload.numberDocumentProvider =
      dataFilters.nroIdentifier;
    listFinancesPayload.request.payload.denominationProvider =
      dataFilters.searchByDenominationProvider.replace(/ /g, '').toLowerCase();
    listFinancesPayload.request.payload.initialTime =
      dateType !== 'createdDate'
        ? timestampToISO8601(toEpoch(dateRange[0]))
        : toEpoch(dateRange[0]);
    listFinancesPayload.request.payload.finalTime =
      dateType !== 'createdDate'
        ? timestampToISO8601(toEpoch(dateRange[1]))
        : toEpoch(dateRange[1]);
    listFinancesPayload.request.payload.movementType =
      movementType == 'TODOS' ? '' : movementType;
    listFinancesPayload.request.payload.dateType = dateType;
    listFinancesPayload.request.payload.merchantId =
      userDataRes.merchantSelected.merchantId;
    if (dataFilters.paymentMethod == 'all') {
      dataFilters.paymentMethod = '';
    }
    listFinancesPayload.request.payload.methodToPay = dataFilters.paymentMethod;
    console.log('listFinancesPayload', listFinancesPayload);
    dispatch({type: GET_FINANCES, payload: []});
    setLastPayload(listFinancesPayload);
    toGetFinances(listFinancesPayload);
    if (monthYearStatus) {
      dispatch({type: GET_FINANCES_FOR_RESULT_STATE, payload: []});
      setMonthYearStatus(false);
    }
    setMoreFilters(false);
  };

  return (
    <Card sx={{p: 4}}>
      <Stack
        sx={{m: 2}}
        direction={isMobile ? 'column' : 'row'}
        spacing={2}
        className={classes.stack}
      >
        {/* <ToggleButtonGroup
          value={financeType}
          exclusive
          onChange={(event) => {
            console.log(event.target.value);
            if (event.target.value == 'TODOS') {
              listFinancesPayload.request.payload.movementType = null;
              setFinanceType('TODOS');
            } else {
              listFinancesPayload.request.payload.movementType =
                event.target.value;
              setFinanceType(event.target.value);
            }
          }}
          aria-label='text alignment'
        >
          <StyledToggleButton
            value={'INCOME'}
            className={clsx({
              active: financeType === 'INCOME',
            })}
            aria-label='left aligned'
          >
            <IntlMessages id='sidebar.sample.earnings' />
          </StyledToggleButton>

          <StyledToggleButton
            value={'EXPENSE'}
            className={clsx({
              active: financeType === 'EXPENSE',
            })}
            aria-label='centered'
          >
            <IntlMessages id='sidebar.sample.expenses' />
          </StyledToggleButton>
        </ToggleButtonGroup> */}
        <FormControl sx={{my: 0, width: 160}}>
          <InputLabel id='movementType-label' style={{fontWeight: 200}}>
            Tipo de Movimiento
          </InputLabel>
          <Select
            name='movementType'
            labelId='movementType-label'
            label='Tipo de Movimiento'
            onChange={(event) => {
              console.log(event.target.value);
              setMovementType(event.target.value);
            }}
            defaultValue={movementType}
          >
            <MenuItem value={'TODOS'} style={{fontWeight: 200}}>
              TODOS
            </MenuItem>
            <MenuItem value={'INCOME'} style={{fontWeight: 200}}>
              INGRESOS
            </MenuItem>
            <MenuItem value={'EXPENSE'} style={{fontWeight: 200}}>
              EGRESOS
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{my: 0, width: 160}}>
          <InputLabel id='dateType-label' style={{fontWeight: 200}}>
            Tipo de Fecha
          </InputLabel>
          <Select
            name='dateType'
            labelId='dateType-label'
            label='Tipo de Fecha'
            onChange={(event) => {
              console.log(event.target.value);
              setDateType(event.target.value);
            }}
            defaultValue={dateType}
          >
            <MenuItem value={'createdDate'} style={{fontWeight: 200}}>
              Fecha de Registro
            </MenuItem>
            <MenuItem value={'issueDate'} style={{fontWeight: 200}}>
              Fecha de Emisión
            </MenuItem>
            <MenuItem value={'dueDate'} style={{fontWeight: 200}}>
              Fecha de Vencimiento
            </MenuItem>
            <MenuItem value={'transactionDate'} style={{fontWeight: 200}}>
              Fecha de Cobro/Pago
            </MenuItem>
          </Select>
        </FormControl>
        <DateRangePicker
          label='Rango de fechas'
          inputVariant='outlined'
          value={dateRange}
          inputFormat={isMobile ? 'dd/MM/yyyy' : 'dd/MM/yyyy hh:mm a'}
          onChange={(newValue) => {
            const valueToEndOfTheDay = [
              newValue[0],
              addMinutes(addHours(newValue[1], 23), 59),
            ];
            setDateRange(valueToEndOfTheDay);
            console.log('date', valueToEndOfTheDay);
          }}
          renderInput={(startProps, endProps) => (
            <React.Fragment>
              <TextField {...startProps} label='Fecha de inicio' />
              <TextField {...endProps} label='Fecha de fin' />
            </React.Fragment>
          )}
        />
        <Button
          onClick={() => setMoreFilters(true)}
          startIcon={<FilterAltOutlinedIcon />}
          variant='outlined'
        >
          Más filtros
        </Button>
        <Button
          startIcon={<ManageSearchOutlinedIcon />}
          variant='contained'
          color='primary'
          onClick={searchFinances}
        >
          Buscar
        </Button>
      </Stack>
      <span>{`Items: ${allFinancesRes.length}`}</span>
      <TableContainer component={Paper} sx={{maxHeight: 440}}>
        <Table stickyHeader size='small' aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell sx={{width: isMobile ? '7px' : '10px'}}>
                Codigo
              </TableCell>
              <TableCell sx={{width: isMobile ? '7px' : '10px'}}>
                Tipo
              </TableCell>
              <TableCell sx={{width: isMobile ? '7px' : '10px'}}>
                Fecha registrada
              </TableCell>
              <TableCell sx={{width: isMobile ? '7px' : '10px'}}>
                Tipo Comprobante Principal
              </TableCell>
              <TableCell sx={{width: isMobile ? '7px' : '10px'}}>
                Número Comprobante Principal
              </TableCell>
              <TableCell sx={{width: isMobile ? '7px' : '10px'}}>
                Fecha emisión Comprobante
              </TableCell>
              <TableCell sx={{width: isMobile ? '7px' : '10px'}}>
                Fecha vencimiento Comprobante
              </TableCell>
              <TableCell sx={{width: isMobile ? '7px' : '10px'}}>
                Fecha transacción Comprobante
              </TableCell>
              <TableCell sx={{width: isMobile ? '9px' : '12px'}}>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleSort('status')}
                >
                  Estado
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{width: isMobile ? '12px' : '15px'}}>
                Medio de Pago
              </TableCell>
              <TableCell>Monto Neto</TableCell>
              <TableCell>Monto Igv</TableCell>
              <TableCell>Monto Total</TableCell>
              <TableCell>Vendedor</TableCell>
              <TableCell>Recaudador</TableCell>
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allFinancesRes && Array.isArray(allFinancesRes) ? (
              allFinancesRes.sort(compare).map((obj, index) => {
                // const paids = obj.payments.filter(
                //   (obj) => obj.statusPayment == 'paid',
                // );
                const paids = obj.payments;
                const otherPayConcepts = obj.otherPayConcepts;
                const movementType = showType(obj.movementType);

                return (
                  <>
                    <TableRow
                      sx={{'&:last-child td, &:last-child th': {border: 0}}}
                      key={index}
                    >
                      <TableCell>{`${showMinType(
                        obj.codMovement.split('-')[0],
                      )} - ${
                        obj.codMovement
                          ? obj.codMovement.split('-')[1]
                          : obj.folderMovement.split('/').slice(-1)
                      }`}</TableCell>
                      <TableCell>{showType(obj.movementType)}</TableCell>
                      <TableCell>
                        {convertToDateWithoutTime(obj.createdAt)}
                      </TableCell>
                      <TableCell>
                        {translateValue(
                          'DOCUMENTTYPE',
                          obj.proofOfPaymentType.toUpperCase(),
                        )}
                      </TableCell>
                      <TableCell>{obj.serialNumberBill}</TableCell>
                      <TableCell>
                        {obj.proofIssueDate
                          ? ISO8601DateToSunatDate(obj.proofIssueDate)
                          : obj.billIssueDate}
                      </TableCell>
                      <TableCell>
                        {obj.proofDueDate
                          ? ISO8601DateToSunatDate(obj.proofDueDate)
                          : obj.billDueDate}
                      </TableCell>
                      <TableCell>
                        {obj.proofTransactionDate
                          ? ISO8601DateToSunatDate(obj.proofTransactionDate)
                          : 'Indeterminado'}
                      </TableCell>
                      <TableCell>
                        {showStatus(obj.status, obj.movementType)}
                      </TableCell>
                      <TableCell>
                        {obj.methodToPay
                          ? translateValue(
                              'PAYMENTMETHOD',
                              obj.methodToPay.toUpperCase(),
                            )
                          : null}
                      </TableCell>
                      <TableCell>{`${moneySymbol} ${fixDecimals(
                        obj.totalNet,
                      )}`}</TableCell>
                      <TableCell>{`${moneySymbol} ${fixDecimals(
                        obj.totalIgv,
                      )}`}</TableCell>
                      <TableCell>{`${moneySymbol} ${fixDecimals(
                        obj.totalAmount,
                      )}`}</TableCell>
                      <TableCell>
                        {obj.outputUserCreatedMetadata
                          ? obj.outputUserCreatedMetadata.nombreCompleto
                          : ''}
                      </TableCell>
                      <TableCell>
                        {obj.proofOfPaymentUserCreatedMetadata
                          ? obj.proofOfPaymentUserCreatedMetadata.nombreCompleto
                          : ''}
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
                    <TableRow key={`doc2-${index}`}>
                      <TableCell
                        style={{paddingBottom: 0, paddingTop: 0}}
                        colSpan={14}
                      >
                        <Collapse
                          in={openPaids && index == rowNumber}
                          timeout='auto'
                          unmountOnExit
                        >
                          <Box sx={{margin: 0}}>
                            <Table size='small' aria-label='purchases'>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Nro</TableCell>
                                  <TableCell>Descripción</TableCell>
                                  <TableCell>Monto</TableCell>
                                  <TableCell>Método de pago</TableCell>
                                  <TableCell>Estado de pago</TableCell>
                                  <TableCell>Fecha de pago</TableCell>
                                  <TableCell>Fecha de vencimiento</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {paids && paids.length !== 0
                                  ? paids.map((paid, index) => {
                                      return (
                                        <TableRow
                                          key={index}
                                          sx={{cursor: 'pointer'}}
                                        >
                                          <TableCell>
                                            {paid.transactionNumber ||
                                              paid.numInstallment}
                                          </TableCell>
                                          <TableCell>
                                            {paid.description ||
                                              paid.descriptionPayment}
                                          </TableCell>
                                          <TableCell>{`${moneySymbol} ${paid.amount}`}</TableCell>
                                          <TableCell>
                                            {paid.paymentMethod
                                              ? translateValue(
                                                  'PAYMENTMETHOD',
                                                  paid.paymentMethod.toUpperCase(),
                                                )
                                              : null}
                                          </TableCell>
                                          <TableCell>
                                            {paid.statusPayment
                                              ? translateValue(
                                                  'PAYMENTS',
                                                  paid.statusPayment.toUpperCase(),
                                                )
                                              : null}
                                          </TableCell>
                                          <TableCell>
                                            {paid.payDate || paid.issueDate}
                                          </TableCell>
                                          <TableCell>
                                            {paid.expirationDate}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })
                                  : null}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                    <TableRow key={`doc3-${index}`}>
                      <TableCell
                        style={{paddingBottom: 0, paddingTop: 0}}
                        colSpan={14}
                      >
                        <Collapse
                          in={openOtherPayConcepts && index == rowNumber}
                          timeout='auto'
                          unmountOnExit
                        >
                          <Box sx={{margin: 0}}>
                            <Table size='small' aria-label='purchases'>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Nro</TableCell>
                                  <TableCell>Descripción</TableCell>
                                  <TableCell>Monto</TableCell>
                                  <TableCell>Acción</TableCell>
                                  <TableCell>Comentario</TableCell>
                                  <TableCell>Método de pago</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {otherPayConcepts &&
                                otherPayConcepts.length !== 0
                                  ? otherPayConcepts.map((paid, index) => {
                                      return (
                                        <TableRow
                                          key={index}
                                          sx={{cursor: 'pointer'}}
                                        >
                                          <TableCell>
                                            {paid.transactionNumber ||
                                              paid.numInstallment}
                                          </TableCell>
                                          <TableCell>
                                            {paid.description ||
                                              paid.descriptionPayment}
                                          </TableCell>
                                          <TableCell>{`${moneySymbol} ${paid.amount}`}</TableCell>
                                          <TableCell>
                                            {paid.conceptAction
                                              ? translateValue(
                                                  'CONCEPTACTION',
                                                  paid.conceptAction.toUpperCase(),
                                                )
                                              : null}
                                          </TableCell>
                                          <TableCell>
                                            {paid.commentPayment}
                                          </TableCell>
                                          <TableCell>
                                            {paid.paymentMethod
                                              ? translateValue(
                                                  'PAYMENTMETHOD',
                                                  paid.paymentMethod.toUpperCase(),
                                                )
                                              : null}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })
                                  : null}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                    <TableRow key={`doc1-${index}`}>
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
              <CircularProgress
                disableShrink
                sx={{m: '10px', position: 'relative'}}
              />
            )}
            <TableRow>
              <TableCell colSpan={8}>Total</TableCell>
              <TableCell align='left'>S/ {totalAmount}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {financesLastEvaluatedKey_pageListFinances ? (
          <Stack spacing={2}>
            <IconButton onClick={() => handleNextPage()} size='small'>
              Siguiente <ArrowForwardIosIcon fontSize='inherit' />
            </IconButton>
          </Stack>
        ) : null}
      </TableContainer>

      <ButtonGroup
        sx={{my: 10}}
        variant='outlined'
        aria-label='outlined button group'
        orientation={isMobile ? 'vertical' : 'horizontal'}
      >
        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/accounting/movement/register') === true ? (
          <Button
            variant='outlined'
            color='secondary'
            onClick={getExcelMovementsSummary}
            startIcon={<GridOnOutlinedIcon />}
          >
            Resumen Por Día
          </Button>
        ) : null}

        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/accounting/movement/register') === true ? (
          <Button
            variant='outlined'
            startIcon={<GridOnOutlinedIcon />}
            onClick={getExcelMovementsDetails}
          >
            Exportar Detalle
          </Button>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/accounting/movement/register') === true ? (
          <Button
            variant='outlined'
            onClick={() => {
              Router.push('/sample/finances/new-earning');
            }}
            startIcon={<AddCircleOutlineOutlinedIcon />}
          >
            Nuevo Ingreso
          </Button>
        ) : null}

        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/accounting/movement/register') === true ? (
          <Button
            variant='outlined'
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={() => {
              Router.push('/sample/finances/new-expense');
            }}
          >
            Nuevo Egreso
          </Button>
        ) : null}

        <Button
          disabled
          onClick={() => {
            setResultState(true);
          }}
          variant='outlined'
        >
          Estado de resultado
        </Button>
      </ButtonGroup>

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
          .includes('/facturacion/accounting/movement/update') === true ? (
          <MenuItem onClick={goToUpdate}>
            <CachedIcon sx={{mr: 1, my: 'auto'}} />
            Actualizar
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/accounting/movement/delete') === true ? (
          <MenuItem onClick={setDeleteState}>
            <DeleteOutlineOutlinedIcon sx={{mr: 1, my: 'auto'}} />
            Eliminar
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes(
            '/utility/listObjectsPathMerchant?path=/Movimientos contables/*',
          ) === true ? (
          <MenuItem onClick={goToFile}>
            <FolderOpenIcon sx={{mr: 1, my: 'auto'}} />
            Archivos
          </MenuItem>
        ) : null}
      </Menu>

      <Dialog
        open={resultState}
        onClose={() => setResultState(false)}
        fullWidth
        maxWidth='xl'
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Estado de Resultado'}
          <IconButton
            aria-label='close'
            onClick={() => setResultState(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{display: 'flex'}}>
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            <ResultState
              data={getFinancesForResultStateRes}
              principalYear={year}
              principalMonth={month}
            />
          </DialogContentText>
        </DialogContent>
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
            <MoreFiltersContableMovements sendData={filterData} />
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}></DialogActions>
      </Dialog>

      <Dialog
        open={open2}
        onClose={handleClose2}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Eliminar finanza'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <PriorityHighIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            ¿Desea eliminar realmente la información seleccionada?
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

      <ClickAwayListener onClickAway={handleClickAway}>
        <Dialog
          open={openStatus}
          onClose={sendStatus}
          sx={{textAlign: 'center'}}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
            {'Eliminar finanza'}
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
      </ClickAwayListener>
    </Card>
  );
};

export default ContableMovements;
