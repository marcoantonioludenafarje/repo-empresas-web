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
  useMediaQuery
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import FindReplaceIcon from '@mui/icons-material/FindReplace';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
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
  toEpoch,
  convertToDate,
  convertToDateWithoutTime,
  parseTo3Decimals,
  toSimpleDate,
} from '../../../Utils/utils';
import {getReferralGuides_PageListGuide, cancelInvoice, referralGuidesBatchConsult} from '../../../redux/actions/Movements';
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
      movementType: 'REFERRAL_GUIDE',
      merchantId: '',
      createdAt: null,
      searchByBill: null,
      movementHeaderId: null,
      outputId: null,
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
      merchantId: '',
      numberReferralGuide: '',
      serial: '',
      reason: '',
    },
  },
};
let codProdSelected = '';
let selectedReferralGuide = {};

const ReferralGuidesTable = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [reload, setReload] = React.useState(0);
  const [confirmCancel, setConfirmCancel] = React.useState(false);
  const [openForm, setOpenForm] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);

  const [downloadExcel, setDownloadExcel] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [totalItems, setTotalItems] = React.useState([]);
  const [lastKey, setLastKey] = React.useState(null);
  const [errorDetail, setErrorDetail] = React.useState("");
  const router = useRouter();
  const {query} = router;
  console.log('query', query);
  const [loading, setLoading] = React.useState(true);
  const {excelTemplateGeneratedToReferralGuidesRes} = useSelector(
    ({general}) => general,
  );

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

  const useForceUpdate = () => {
    return () => setReload((value) => value + 1); // update the state to force render
  };

  const handleNextPage = (event) => {
    //console.log('Llamando al  handleNextPage', handleNextPage);    
    listPayload.request.payload.LastEvaluatedKey = referralGuideLastEvalutedKey_pageListGuide;
    console.log('listPayload111:handleNextPage:',listPayload)
    toGetMovements(listPayload);
    // setPage(page+1);
  };

  //GET APIS RES
  const {referralGuideItems_pageListGuide, referralGuideLastEvalutedKey_pageListGuide, referralGuidesBatchConsultRes} = useSelector(({movements}) => movements);
  console.log('referralGuideItems_pageListGuide', referralGuideItems_pageListGuide);
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

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
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

  //BUTTONS BAR FUNCTIONS
  const searchInputs = () => {
    listPayload.request.payload.LastEvaluatedKey = null;
    listPayload.request.payload.outputId = null;
    dispatch({type: GET_REFERRALGUIDE_PAGE_LISTGUIDE, payload: {callType: "firstTime"}});
    console.log('listPayload122:searchInputs:',listPayload)
    toGetMovements(listPayload);
  };
  useEffect(() => {
    dispatch({type: GET_REFERRALGUIDE_PAGE_LISTGUIDE, payload: {callType: "firstTime"}});

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
      dispatch({type: GET_FINANCES, payload: undefined});

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
        }
      }
      listPayload.request.payload.LastEvaluatedKey = null;
      console.log('listPayload133:useEffect userDataRes:',listPayload)
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
    selectedReferralGuide = referralGuideItems_pageListGuide[codInput];
    console.log('selectedReferralGuide', selectedReferralGuide);
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
    console.log(' factura', selectedReferralGuide);
    Router.push({pathname: '/sample/bills/get', query: selectedReferralGuide});
  };

  const exportToExcel = () => {
    const excelPayload = listPayload;

    console.log('excelPayload', excelPayload);
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: GENERATE_EXCEL_TEMPLATE_TO_REFERRALGUIDES, payload: undefined});
    toExportExcelTemplateToReferralGuides(excelPayload);
    setDownloadExcel(true);
  };

  const batchConsultReferralGuide = () => {
    if(userDataRes){
      toReferralGuidesBatchConsult({
        request: {
          payload: {
            merchantId: userDataRes.merchantSelected.merchantId
          }
        }
      });
      setIsLoading(true);
    }
  };

  useEffect(() => {
    if (referralGuidesBatchConsultRes) {
      setIsLoading(false);
      dispatch({type: GET_REFERRALGUIDE_PAGE_LISTGUIDE, payload: {callType: "firstTime"}});
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
      return (
       <PageviewIcon sx={{color: amber[500]}} />
      );
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
  }

  const CancelOptionClose = () => {
    setOpen(false);
  }

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
      <Stack sx={{m: 2}} 
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
              <TableCell>Fecha de emisión</TableCell>
              <TableCell>Número de serie</TableCell>
              <TableCell>Número de guía de remisión</TableCell>
              <TableCell>Motivo</TableCell>
              <TableCell>Receptor</TableCell>
              <TableCell>Observación</TableCell>
              <TableCell>Enviado a Sunat</TableCell>
              <TableCell>Aceptado por Sunat</TableCell>
              <TableCell>Anulado?</TableCell>
              <TableCell>Error</TableCell>
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {referralGuideItems_pageListGuide && Array.isArray(referralGuideItems_pageListGuide) ? (
              referralGuideItems_pageListGuide.map((obj, index) => (
                <TableRow
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  key={index}
                >
                  <TableCell>
                    {convertToDateWithoutTime(obj.createdAt)}
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
                  <TableCell>{obj.reasonForTransfer || ''} </TableCell>
                  <TableCell>
                    {`${obj.clientId.split('-')[1]}` +
                      ' ' +
                      obj.denominationClient}
                  </TableCell>
                  <TableCell>{obj.observation || ''} </TableCell>
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
                      onClick={() =>{
                        setOpenError(true)
                        setErrorDetail(obj.errorDetail)
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
      <ButtonGroup
        variant='outlined'
        aria-label='outlined button group'
        className={classes.btnGroup}
        orientation={isMobile ? 'vertical' : 'horizontal'}
      >
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/exportReferralGuides/*') ===
          true ? (
            <Button
              variant='outlined'
              startIcon={<GridOnOutlinedIcon />}
              onClick={exportToExcel}
            >
              Exportar todo
            </Button>
        ) : null}
        <Button
          variant='outlined'
          startIcon={<FindReplaceIcon />}
          onClick={batchConsultReferralGuide}
          disabled={isLoading}
          color="success"
        >
          Consulta Masiva de Guías en SUNAT
          {isLoading && <CircularProgress sx={{ml:2}} size={24} />}
        </Button>
      </ButtonGroup>

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

      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => window.open(selectedReferralGuide.linkPdf)}>
          <LocalAtmIcon sx={{mr: 1, my: 'auto'}} />
          Ver PDF
        </MenuItem>
        <MenuItem disabled>
          <DataSaverOffOutlinedIcon sx={{mr: 1, my: 'auto'}} />
          Consultar Estado
        </MenuItem>
        <MenuItem onClick={CancelOptionOpen}>
          Anular
        </MenuItem>
      </Menu>

      <Dialog 
        open={openError}
        onClose={() => setOpenError(false)}
      >
        <DialogTitle sx={{fontSize: '1.5em'}}>Error de guía</DialogTitle>
        <DialogContent>
          {errorDetail}
        </DialogContent>
      </Dialog>

      <Dialog open={open} onClose={CancelOptionClose}>
        <DialogTitle sx={{fontSize: '1.5em'}}>Anulación de Guías de remisión</DialogTitle>
        <DialogContent>
        La anulación legal se realiza a traves del portal de Sunat, puede seguir
        el siguiente tutorial: 
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ReferralGuidesTable;
