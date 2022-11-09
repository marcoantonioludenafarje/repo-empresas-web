import React, {useEffect} from 'react';
import Typography from '@mui/material/Typography';
import AppPageMeta from '../../../@crema/core/AppPageMeta';
import {useIntl} from 'react-intl';

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
  IconButton,
  MenuItem,
  Menu,
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
  Collapse,
} from '@mui/material';
import {makeStyles} from '@mui/styles';

import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CachedIcon from '@mui/icons-material/Cached';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import CancelIcon from '@mui/icons-material/Cancel';
import {red} from '@mui/material/colors';
import {DateTimePicker} from '@mui/lab';
import IntlMessages from '../../../@crema/utility/IntlMessages';

import Router, {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {
  onGetBusinessParameter,
  onGetGlobalParameter,
} from '../../../redux/actions/General';
import {getMovements, deleteMovement} from '../../../redux/actions/Movements';
import {getUserData} from '../../../redux/actions/User';

import {
  toEpoch,
  convertToDateWithoutTime,
  translateValue,
  showSubtypeMovement,
} from '../../../Utils/utils';
const XLSX = require('xlsx');
import {
  GET_FINANCES,
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_MOVEMENTS,
  GET_USER_DATA,
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
let listFinancesPayload = {
  request: {
    payload: {
      initialTime: null,
      finalTime: null,
      movementType: 'EXPENSE',
      merchantId: '',
      timestampMovement: null,
      monthMovement: null,
      yearMovement: null,
      searchByBill: '',
      searchByContableMovement: null,
    },
  },
};
let deletePayload = {
  request: {
    payload: {
      movementType: 'INPUT',
      movementTypeMerchantId: '',
      timestampMovement: null,
      movementHeaderId: '',
      folderMovement: '',
      contableMovementId: '',
    },
  },
};
let listPayload = {
  request: {
    payload: {
      initialTime: toEpoch(Date.now() - 2678400000),
      finalTime: toEpoch(Date.now()),
      businessProductCode: null,
      movementType: 'INPUT',
      merchantId: '',
      timestampMovement: null,
      searchByDocument: null,
      movementHeaderId: null,
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
let codProdSelected = '';
let selectedInput = {};
let redirect = false;

const InputsTable = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  let popUp = false;
  const [reload, setReload] = React.useState(0);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [moreFilters, setMoreFilters] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [openDetails, setOpenDetails] = React.useState(false);
  const [openDocuments, setOpenDocuments] = React.useState(false);
  const [rowNumber, setRowNumber] = React.useState(0);
  const router = useRouter();
  const {query} = router;
  console.log('query', query);

  //API FUNCTIONS
  const toGetMovements = (payload) => {
    dispatch(getMovements(payload));
  };
  const toDeleteMovement = (payload) => {
    dispatch(deleteMovement(payload));
  };
  const getBusinessParameter = (payload) => {
    dispatch(onGetBusinessParameter(payload));
  };
  const getGlobalParameter = (payload) => {
    dispatch(onGetGlobalParameter(payload));
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
  const {getFinancesRes} = useSelector(({finances}) => finances);
  console.log('getFinancesRes', getFinancesRes);
  const {businessParameter} = useSelector(({general}) => general);
  console.log('businessParameter', businessParameter);
  const {globalParameter} = useSelector(({general}) => general);
  console.log('globalParameter123', globalParameter);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
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

      listPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;
      businessParameterPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;
      listFinancesPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;

      if (Object.keys(query).length !== 0) {
        console.log('Query con datos', query);
        listPayload.request.payload.movementHeaderId = query.movementHeaderId;
      }
      toGetMovements(listPayload);
      if (Object.keys(query).length !== 0) {
        listPayload.request.payload.movementHeaderId = null;
      }
      getBusinessParameter(businessParameterPayload);
      getGlobalParameter(globalParameterPayload);
    }
  }, [userDataRes]);
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
    listPayload.request.payload.denominationProvider = '';
    listPayload.request.payload.searchByDocument = '';
    listPayload.request.payload.typeDocumentProvider = '';
    listPayload.request.payload.numberDocumentProvider = '';

    toGetMovements(listPayload);
  };
  const newInput = () => {
    Router.push('/sample/inputs/new');
  };

  const cleanList = () => {
    let listResult = [];
    getMovementsRes.map((obj) => {
      //ESTOS CAMPOS DEBEN TENER EL MISMO NOMBRE, TANTO ARRIBA COMO ABAJO
      obj.createdDate = convertToDateWithoutTime(obj.createdDate);
      listResult.push(
        (({
          createdDate,
          documentIntern,
          providerName,
          descriptionProducts,
          totalPrice,
        }) => ({
          createdDate,
          documentIntern,
          providerName,
          descriptionProducts,
          totalPrice,
        }))(obj),
      );
    });
    return listResult;
  };
  const headersExcel = [
    'Fecha registrada',
    'Documento',
    'Proveedor',
    'Detalle productos',
    `Precio total (${money_unit})`,
  ];
  const exportDoc = () => {
    var ws = XLSX.utils.json_to_sheet(cleanList());
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inputs');
    XLSX.utils.sheet_add_aoa(ws, [headersExcel], {origin: 'A1'});
    XLSX.writeFile(wb, 'Inputs.xlsx');
  };

  //BUSQUEDA
  const handleSearchValues = (event) => {
    console.log('Evento', event);
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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (codInput, event) => {
    setAnchorEl(event.currentTarget);
    codProdSelected = codInput;
    selectedInput = findOutput(codInput);
    console.log('selectedInput', selectedInput);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const goToUpdate = () => {
    console.log('Actualizando', selectedInput);
    Router.push({
      pathname: '/sample/inputs/update',
      query: selectedInput,
    });
  };
  const confirmDelete = () => {
    deletePayload.request.payload.movementTypeMerchantId =
      selectedInput.movementTypeMerchantId;
    deletePayload.request.payload.timestampMovement =
      selectedInput.timestampMovement;
    deletePayload.request.payload.movementHeaderId =
      selectedInput.movementHeaderId;
    deletePayload.request.payload.contableMovementId =
      selectedInput.contableMovementId ? selectedInput.contableMovementId : '';
    deletePayload.request.payload.folderMovement = selectedInput.folderMovement
      ? selectedInput.folderMovement
      : '';
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

  //SELECCIÓN CALENDARIO
  const [value, setValue] = React.useState(Date.now() - 2678400000);
  const [value2, setValue2] = React.useState(Date.now());
  //MANEJO DE FECHAS
  const toEpoch = (strDate) => {
    let someDate = new Date(strDate);
    someDate = someDate.getTime();
    return someDate;
  };

  const sendStatus = () => {
    setOpenStatus(false);
    setTimeout(() => {
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
    //     path: selectedInput.folderMovement,
    //   },
    // });
    const data = {
      goDirectory: true,
      path: selectedInput.folderMovement,
    };
    localStorage.setItem('redirectUrl', JSON.stringify(data));
    window.open('/sample/explorer');
  };

  const doFinance = () => {
    Router.push({
      pathname: '/sample/finances/new-expense',
      query: selectedInput,
    });
  };

  const findOutput = (outputId) => {
    return getMovementsRes.find((obj) => obj.movementHeaderId == outputId);
  };
  const showExpense = (codInput) => {
    codProdSelected = codInput;
    selectedInput = findOutput(codInput);
    Router.push({
      pathname: '/sample/finances/table',
      query: {contableMovementId: selectedInput.contableMovementId},
    });
  };
  const generateExpense = (codInput) => {
    codProdSelected = codInput;
    selectedInput = findOutput(codInput);
    console.log('selectedInput', selectedInput);
    Router.push({
      pathname: '/sample/finances/new-expense',
      query: selectedInput,
    });
  };

  useEffect(() => {
    let expense = {};
    if (
      getFinancesRes !== undefined &&
      getFinancesRes.length &&
      redirect == true
    ) {
      /* income = getFinancesRes.find(
        (income) => income.financeId == selectedInput.incomeId,
      ); */
      expense = getFinancesRes[0];
      Router.push({
        pathname: '/sample/finances/update-expense',
        query: expense,
      });
      redirect = false;
    }
  }, [getFinancesRes]);

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

  const showStatus = (status) => {
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
  };

  const showIgv = (igv) => {
    switch (true) {
      case !isNaN(igv) && igv >= 0:
        return `${igv * 100}%`;
        break;
      case isNaN(igv) && igv == true:
        return '18%';
        break;
      case isNaN(igv) && igv == false:
        return '0%';
        break;
      case igv == undefined:
        return '0%';
        break;
      default:
        console.log('Un igv fallido 😢', igv);
        return null;
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

  const showIconStatus = (isSale, existExpense, obj, index, mintype, cod) => {
    if (isSale == 'buys') {
      if (existExpense) {
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
      } else {
        return (
          <Button
            variant='secondary'
            sx={{fontSize: '1em'}}
            onClick={() => generateExpense(obj.movementHeaderId)}
          >
            No Generado
          </Button>
        );
      }
    } else {
      return 'No aplica';
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
    listPayload.request.payload.typeDocumentProvider =
      dataFilters.typeIdentifier;
    listPayload.request.payload.numberDocumentProvider =
      dataFilters.nroIdentifier;
    listPayload.request.payload.denominationProvider =
      dataFilters.searchByDenominationProvider.replace(/ /g, '').toLowerCase();
    console.log('listPayload', listPayload);
    dispatch({type: GET_MOVEMENTS, payload: undefined});
    toGetMovements(listPayload);
    (listPayload.request.payload.searchByDocument = ''),
      (listFinancesPayload.request.payload.typeDocumentProvider = '');
    listFinancesPayload.request.payload.numberDocumentProvider = '';
    listFinancesPayload.request.payload.denominationProvider = '';
    setMoreFilters(false);
  };

  const checkDocuments = (input, index) => {
    selectedInput = input;
    console.log('selectedInput', selectedInput);
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
  const goToDocument = (doc) => {};

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
        <Button
          onClick={() => setMoreFilters(true)}
          variant='outlined'
          startIcon={<FilterAltOutlinedIcon />}
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
              <TableCell>Proveedor</TableCell>
              <TableCell>Detalle productos</TableCell>
              <TableCell>Detalle documentos</TableCell>
              <TableCell>Egreso relacionado</TableCell>
              <TableCell>Precio total sin IGV</TableCell>
              <TableCell>Precio total con IGV</TableCell>
              <TableCell>Porcentaje IGV</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getMovementsRes && Array.isArray(getMovementsRes) ? (
              getMovementsRes
                .sort(compare)
                /* .filter(filterData) */
                .map((obj, index) => {
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
                          {convertToDateWithoutTime(obj.timestampMovement)}
                        </TableCell>
                        <TableCell>
                          {convertToDateWithoutTime(obj.updatedDate)}
                        </TableCell>
                        <TableCell>
                          {showSubtypeMovement(obj.movementSubType)}
                        </TableCell>
                        <TableCell>
                          {obj.provider
                            ? obj.provider.denomination
                            : obj.providerName}
                        </TableCell>
                        <TableCell
                          sx={{
                            display: style,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px',
                          }}
                        >
                          {obj.descriptionProducts}
                          {obj.descriptionProductsInfo &&
                          Array.isArray(obj.descriptionProductsInfo) ? (
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
                          {showIconStatus(
                            obj.movementSubType,
                            obj.existExpense,
                            obj,
                            index,
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
                            ? `${obj.totalPriceWithIgv.toFixed(
                                3,
                              )} ${money_unit}`
                            : ''}
                        </TableCell>
                        <TableCell>{showIgv(obj.igv)}</TableCell>
                        <TableCell>{showStatus(obj.status)}</TableCell>
                        <TableCell>
                          <Button
                            id='basic-button'
                            aria-controls={openMenu ? 'basic-menu' : undefined}
                            aria-haspopup='true'
                            aria-expanded={openMenu ? 'true' : undefined}
                            onClick={handleClick.bind(
                              this,
                              obj.movementHeaderId,
                            )}
                          >
                            <KeyboardArrowDownIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
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
                                          <TableRow
                                            key={index}
                                            /* onClick={() =>
                                              goToDocument(subProduct)
                                            } */
                                          >
                                            <TableCell>
                                              {subProduct.product}
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
                      <TableRow>
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
                                          <TableRow key={index}>
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

      <ButtonGroup
        variant='outlined'
        aria-label='outlined button group'
        className={classes.btnGroup}
      >
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/movementProducts/register?path=/input/*') ===
        true ? (
          <Button
            variant='outlined'
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={newInput}
          >
            Nuevo
          </Button>
        ) : null}

        {!popUp ? (
          <>
            <Button
              variant='outlined'
              startIcon={<GridOnOutlinedIcon />}
              onClick={exportDoc}
            >
              Exportar todo
            </Button>
          </>
        ) : (
          <></>
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
          {'Eliminar entrada'}
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
          {'Eliminar entrada'}
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
          .includes('/inventory/movementProducts/update?path=/input/*') ===
        true ? (
          <MenuItem onClick={goToUpdate}>
            <CachedIcon sx={{mr: 1, my: 'auto'}} />
            Actualizar
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/movementProducts/delete?path=/input/*') ===
        true ? (
          <MenuItem onClick={setDeleteState}>
            <DeleteOutlineOutlinedIcon sx={{mr: 1, my: 'auto'}} />
            Eliminar
          </MenuItem>
        ) : null}
        <MenuItem disabled onClick={goToMoves}>
          <GridOnOutlinedIcon sx={{mr: 1, my: 'auto'}} />
          Exportar
        </MenuItem>
        {localStorage
          .getItem('pathsBack')
          .includes('/utility/listObjectsPathMerchant?path=/entradas/*') ===
        true ? (
          <MenuItem onClick={goToFile}>
            <FolderOpenIcon sx={{mr: 1, my: 'auto'}} />
            Archivos
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes(
            '/facturacion/accounting/movement/register?path=/outcomeOfInput/*',
          ) &&
        !selectedInput.existExpense &&
        selectedInput.existBill &&
        selectedInput.movementSubType == 'buys' ? (
          <MenuItem onClick={doFinance}>
            <LogoutIcon sx={{mr: 1, my: 'auto'}} />
            Generar egreso
          </MenuItem>
        ) : (
          <></>
        )}
      </Menu>
    </Card>
  );
};

export default InputsTable;
