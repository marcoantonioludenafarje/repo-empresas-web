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
  ClickAwayListener,
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
} from '@mui/material';
import {makeStyles} from '@mui/styles';

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
} from '../../../shared/constants/ActionTypes';
import Router, {useRouter} from 'next/router';
import {format, addHours, addMinutes} from 'date-fns'; // Importamos la librería date-fns para manipulación de fechas
import {DesktopDatePicker, DateTimePicker, DateRangePicker} from '@mui/lab';
import {getFinances, deleteFinance} from '../../../redux/actions/Finances';
import {useDispatch, useSelector} from 'react-redux';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import {
  getYear,
  getActualMonth,
  translateValue,
  fixDecimals,
  convertToDateWithoutTime,
  toEpoch,
} from '../../../Utils/utils';
import MoreFiltersContableMovements from '../Filters/MoreFiltersContableMovements';

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

const ContableMovements = (props) => {
  const classes = useStyles(props);
  const theme = useTheme();
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
  const [proofOfPaymentType, setProofOfPaymentType] = React.useState('TODOS');
  const [initialTime, setInitialTime] = React.useState(Date.now());
  const [finalTime, setFinalTime] = React.useState(Date.now());
  const [totalAmount, setTotalAmount] = React.useState(0);

  const currentDate = new Date(); // Obtenemos la fecha actual
  const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0)); // Modificamos la fecha actual para que sea a las 0 horas del día
  const endOfDay = addMinutes(addHours(new Date(startOfDay), 23), 59); // Agregamos 23 horas a la fecha de inicio para obtener las 23:59 del día actual
  const [dateRange, setDateRange] = React.useState([startOfDay, endOfDay]); // Estado para el rango de fechas

  const openMenu = Boolean(anchorEl);
  const dispatch = useDispatch();
  const router = useRouter();
  const {query} = router;
  console.log('query', query);
  const {userDataRes} = useSelector(({user}) => user);

  let listFinancesPayload = {
    request: {
      payload: {
        initialTime: null,
        finalTime: null,
        movementType: null,
        merchantId: '',
        createdAt: null,
        methodToPay: '',
        searchByBill: '',
        searchByContableMovement: '',
        typeList: '',
        listReduced: true,
      },
    },
  };
  let deletePayload = {
    request: {
      payload: {
        contableMovementId: '',
        movementHeaderId: '',
        movementTypeMerchantId: '',
      },
    },
  };
  let codFinanceSelected = '';
  let selectedFinance = '';

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
  const {getFinancesRes} = useSelector(({finances}) => finances);
  const {deleteFinanceRes} = useSelector(({finances}) => finances);
  const {businessParameter} = useSelector(({general}) => general);
  const {moneyUnitBusiness} = useSelector(({general}) => general);
  const {weightBusiness} = useSelector(({general}) => general);
  const {moneySymbol} = useSelector(({general}) => general);
  const {successMessage} = useSelector(({finances}) => finances);
  const {errorMessage} = useSelector(({finances}) => finances);
  const {userAttributes} = useSelector(({user}) => user);

  const {jwtToken} = useSelector(({general}) => general);
  console.log('getFinancesRes', getFinancesRes);
  console.log('deleteFinanceRes', deleteFinanceRes);
  console.log('businessParameter', businessParameter);
  console.log('moneyUnitBusiness', moneyUnitBusiness);
  console.log('weightBusiness', weightBusiness);
  console.log('moneySymbol', moneySymbol);
  console.log('successMessage', successMessage);
  console.log('errorMessage', errorMessage);
  console.log('Quiero usar jwtToken', jwtToken);

  //APIS
  const toGetFinances = (payload) => {
    dispatch(getFinances(payload, jwtToken));
  };
  const toGetFinancesInDebt = (payload) => {
    dispatch(getFinances(payload, jwtToken));
  };
  const toDeleteFinance = (payload) => {
    dispatch(deleteFinance(payload));
  };

  useEffect(() => {
    setMonthYearStatus(true);
  }, [month || year]);
  useEffect(() => {
    if (getFinancesRes && Array.isArray(getFinancesRes)) {
      let total = 0;
      getFinancesRes.forEach((obj) => {
        total += obj.totalAmount;
      });
      setTotalAmount(total);
    }
  }, [getFinancesRes]);
  useEffect(() => {
    if (userDataRes) {
      listFinancesPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;

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

      listFinancesPayload.request.payload.initialTime = toEpoch(dateRange[0]);
      listFinancesPayload.request.payload.finalTime = toEpoch(dateRange[1]);
      listFinancesPayload.request.payload.movementType = '';
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

  const searchFinances = () => {
    dispatch({type: GET_FINANCES, payload: []});
    listFinancesPayload.request.payload.merchantId =
      userDataRes.merchantSelected.merchantId;
    listFinancesPayload.request.payload.movementType =
      proofOfPaymentType == 'TODOS' ? '' : proofOfPaymentType;
    listFinancesPayload.request.payload.initialTime = toEpoch(dateRange[0]);
    listFinancesPayload.request.payload.finalTime = toEpoch(dateRange[1]);
    toGetFinances(listFinancesPayload);
    if (monthYearStatus) {
      dispatch({type: GET_FINANCES_FOR_RESULT_STATE, payload: []});
      setMonthYearStatus(false);
    }
  };

  const searchFinancesInDebt = () => {
    let listFinancesInDebt = listFinancesPayload;

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
    setTimeout(() => {
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
    selectedFinance = getFinancesRes[codFinance];
    console.log('selectedFinance', selectedFinance);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const setDeleteState = () => {
    setOpen2(true);
    handleClose();
  };
  const confirmDelete = () => {
    deletePayload.request.payload.contableMovementId =
      selectedFinance.contableMovementId;
    deletePayload.request.payload.movementHeaderId =
      selectedFinance.movementHeaderId;
    deletePayload.request.payload.movementTypeMerchantId =
      selectedFinance.movementTypeMerchantId;
    dispatch({type: DELETE_FINANCE, payload: undefined});
    toDeleteFinance(deletePayload);
    setOpen2(false);
    /* setTimeout(() => { */
    setOpenStatus(true);
    /* }, 1000); */
  };
  const handleClose2 = () => {
    setOpen2(false);
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
    if (a.createdDate < b.createdDate) {
      return 1;
    }
    if (a.createdDate > b.createdDate) {
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
    selectedFinance = input;
    console.log('selectedFinance', selectedFinance);
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
    selectedFinance = input;
    console.log('selectedFinance', selectedFinance);
    setOpenOtherPayConcepts(false);
    setOpenPaids(true);
    if (openPaids == true && rowNumber == index) {
      setOpenPaids(false);
    }
    setRowNumber(index);
  };

  const checkOtherPayConcepts = (input, index) => {
    selectedFinance = input;
    console.log('selectedFinance', selectedFinance);
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

  const filterData = (dataFilters) => {
    console.log('dataFilters', dataFilters);
    // listPayload.request.payload.searchByDocument = buildFilter(
    //   dataFilters.typeDocument,
    //   dataFilters.nroDoc,
    //   dataFilters.typeDocumentProvider,
    //   dataFilters.nroIdentifier,
    // );
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
    listFinancesPayload.request.payload.initialTime = toEpoch(dateRange[0]);
    listFinancesPayload.request.payload.finalTime = toEpoch(dateRange[1]);
    listFinancesPayload.request.payload.movementType =
      proofOfPaymentType == 'TODOS' ? '' : proofOfPaymentType;
    listFinancesPayload.request.payload.merchantId =
      userDataRes.merchantSelected.merchantId;
    if (dataFilters.paymentMethod == 'all') {
      dataFilters.paymentMethod = '';
    }
    listFinancesPayload.request.payload.methodToPay = dataFilters.paymentMethod;
    console.log('listFinancesPayload', listFinancesPayload);
    dispatch({type: GET_FINANCES, payload: []});
    toGetFinances(listFinancesPayload);
    if (monthYearStatus) {
      dispatch({type: GET_FINANCES_FOR_RESULT_STATE, payload: []});
      setMonthYearStatus(false);
    }
    (listFinancesPayload.request.payload.searchByBill = ''),
      (listFinancesPayload.request.payload.typeDocumentProvider = '');
    listFinancesPayload.request.payload.numberDocumentProvider = '';
    listFinancesPayload.request.payload.denominationProvider = '';
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
          <InputLabel id='moneda-label' style={{fontWeight: 200}}>
            Tipo de Comprobante
          </InputLabel>
          <Select
            name='proofOfPaymentType'
            labelId='proofOfPaymentType-label'
            label='Tipo de Comprobante'
            onChange={(event) => {
              console.log(event.target.value);
              setProofOfPaymentType(event.target.value);
              if (event.target.value == 'TODOS') {
                listFinancesPayload.request.payload.movementType = null;
              } else {
                listFinancesPayload.request.payload.movementType =
                  event.target.value;
              }
            }}
            defaultValue={proofOfPaymentType}
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
        <DateRangePicker
          label='Rango de fechas'
          inputVariant='outlined'
          value={dateRange}
          inputFormat={isMobile ? 'dd/MM/yyyy' : 'dd/MM/yyyy hh:mm a'}
          onChange={(newValue) => {
            setDateRange(newValue);
            console.log('date', newValue);
            listFinancesPayload.request.payload.initialTime = toEpoch(
              newValue[0],
            );
            listFinancesPayload.request.payload.finalTime = toEpoch(
              newValue[1],
            );
            console.log('payload de busqueda', listFinancesPayload);
          }}
          renderInput={(startProps, endProps) => (
            <React.Fragment>
              <TextField {...startProps} label='Fecha de inicio' />
              <TextField {...endProps} label='Fecha de fin' />
            </React.Fragment>
          )}
        />
        {/* <DateTimePicker
          renderInput={(params) => <TextField size='small' {...params} />}
          value={initialTime}
          label='Inicio'
          inputFormat='dd/MM/yyyy hh:mm a'
          onChange={(newValue) => {
            setInitialTime(newValue);
            console.log('date', newValue);
            listFinancesPayload.request.payload.initialTime = toEpoch(newValue);
            console.log('payload de busqueda', listFinancesPayload);
          }}
        />
        <DateTimePicker
          renderInput={(params) => <TextField size='small' {...params} />}
          label='Fin'
          inputFormat='dd/MM/yyyy hh:mm a'
          value={finalTime}
          onChange={(newValue2) => {
            setFinalTime(newValue2);
            console.log('date 2', newValue2);
            listFinancesPayload.request.payload.finalTime = toEpoch(newValue2);
            console.log('payload de busqueda', listFinancesPayload);
          }}
        /> */}
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
                Número de documento
              </TableCell>
              <TableCell sx={{width: isMobile ? '7px' : '10px'}}>
                Fecha emisión de Comprobante
              </TableCell>
              <TableCell sx={{width: isMobile ? '7px' : '10px'}}>
                Fecha vencimiento de Comprobante
              </TableCell>
              <TableCell sx={{width: isMobile ? '9px' : '12px'}}>
                Estado
              </TableCell>
              <TableCell sx={{width: isMobile ? '12px' : '15px'}}>
                Medio de Pago
              </TableCell>
              <TableCell>Monto Total</TableCell>
              <TableCell>Vendedor</TableCell>
              <TableCell>Recaudador</TableCell>
              {/* <TableCell>Opciones</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {getFinancesRes && Array.isArray(getFinancesRes) ? (
              getFinancesRes.sort(compare).map((obj, index) => {
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
                        {convertToDateWithoutTime(obj.createdDate)}
                      </TableCell>
                      <TableCell>{obj.serialNumberBill}</TableCell>
                      <TableCell>{obj.billIssueDate}</TableCell>
                      <TableCell>{obj.billIssueDate}</TableCell>
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
                      {/* <TableCell>
                        <Button
                          id='basic-button'
                          aria-controls={openMenu ? 'basic-menu' : undefined}
                          aria-haspopup='true'
                          aria-expanded={openMenu ? 'true' : undefined}
                          onClick={handleClick.bind(this, index)}
                        >
                          <KeyboardArrowDownIcon />
                        </Button>
                      </TableCell> */}
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
      </TableContainer>

      <ButtonGroup
        sx={{my: 10}}
        variant='outlined'
        aria-label='outlined button group'
      >
        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/accounting/movement/register') === true ? (
          <Button
            variant='outlined'
            color='secondary'
            onClick={() => {}}
            startIcon={<GridOnOutlinedIcon />}
          >
            Exportar Resumen
          </Button>
        ) : null}

        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/accounting/movement/register') === true ? (
          <Button
            variant='outlined'
            startIcon={<GridOnOutlinedIcon />}
            onClick={() => {}}
          >
            Exportar Detalle
          </Button>
        ) : null}
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
    </Card>
  );
};

export default ContableMovements;
