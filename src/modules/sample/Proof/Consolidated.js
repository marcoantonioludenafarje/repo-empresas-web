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
  Autocomplete,
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import DataSaverOffOutlinedIcon from '@mui/icons-material/DataSaverOffOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import PageviewIcon from '@mui/icons-material/Pageview';
import {red, amber} from '@mui/material/colors';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import {DateTimePicker} from '@mui/lab';

import Router, {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {getUserData} from '../../../redux/actions/User';
import {getListBusiness} from '../../../redux/actions/Admin';
import {convertToDateWithoutTime, translateValue} from '../../../Utils/utils';
import {
  proofMonitoring,
  exportExcelTemplateToConsolidated,
} from '../../../redux/actions/Movements';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
  PROOF_MONITORING,
  GENERATE_EXCEL_TEMPLATE_TO_CONSOLIDATED,
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
const ProofsOfPaymentConsolidation = (props) => {
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
  const [openError, setOpenError] = React.useState(false);
  const [errorDetail, setErrorDetail] = React.useState('');
  const [initialTime, setInitialTime] = React.useState(
    toEpoch(Date.now() - 89280000 * 4),
  );
  const [finalTime, setFinalTime] = React.useState(toEpoch(Date.now()));
  const [orderBy, setOrderBy] = React.useState(''); // Estado para almacenar el campo de ordenación actual
  const [order, setOrder] = React.useState('asc'); // Estado para almacenar la dirección de ordenación

  const [downloadExcel, setDownloadExcel] = React.useState(false);
  const router = useRouter();
  const {query} = router;
  console.log('query', query);
  const [loading, setLoading] = React.useState(true);
  const toExportExcelTemplateToConsolidated = (payload) => {
    dispatch(exportExcelTemplateToConsolidated(payload));
  };
  //API FUNCTIONS
  const toListProofMonitoringItems = (payload) => {
    dispatch(proofMonitoring(payload));
  };

  const handleNextPage = (event) => {
    let listPayload = {
      request: {
        payload: {
          initialTime: initialTime,
          finalTime: finalTime,
          serviceType: 'proofsOfPaymentConsolidation',
          merchantId: userDataRes.merchantSelected.merchantId,
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

  const {moneySymbol} = useSelector(({general}) => general);
  const {
    successMessage,
    errorMessage,
    excelTemplateGeneratedToConsolidatedRes,
  } = useSelector(({movements}) => movements);
  console.log('successMessage', successMessage);
  console.log('errorMessage', errorMessage);
  console.log(
    'excelTemplateGeneratedToConsolidatedRes',
    excelTemplateGeneratedToConsolidatedRes,
  );
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
          type: PROOF_MONITORING,
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
          type: PROOF_MONITORING,
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
          serviceType: 'proofsOfPaymentConsolidation',
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };
    listPayload.request.payload.LastEvaluatedKey = null;
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
            serviceType: 'proofsOfPaymentConsolidation',
            merchantId: userDataRes.merchantSelected.merchantId,
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
  const [value, setValue] = React.useState(Date.now() - 89280000 * 4);
  const [value2, setValue2] = React.useState(Date.now());
  const compare = (a, b) => {
    if (a.serialNumber.split('-')[1] < b.serialNumber.split('-')[1]) {
      return 1;
    }
    if (a.serialNumber.split('-')[1] > b.serialNumber.split('-')[1]) {
      return -1;
    }
    return 0;
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

  useEffect(() => {
    if (excelTemplateGeneratedToConsolidatedRes && downloadExcel) {
      setDownloadExcel(false);
      const byteCharacters = atob(excelTemplateGeneratedToConsolidatedRes);
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
      link.setAttribute('download', 'Consolidated.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [excelTemplateGeneratedToConsolidatedRes, downloadExcel]);
  const exportToExcel = () => {
    let listPayload = {
      request: {
        payload: {
          initialTime: initialTime,
          finalTime: finalTime,
          serviceType: 'consolidated',
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };
    const excelPayload = listPayload;

    console.log('excelPayload', excelPayload);
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({
      type: GENERATE_EXCEL_TEMPLATE_TO_CONSOLIDATED,
      payload: undefined,
    });
    toExportExcelTemplateToConsolidated(excelPayload);
    setDownloadExcel(true);
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
        <DateTimePicker
          renderInput={(params) => (
            <TextField size={isMobile ? 'small' : 'medium'} {...params} />
          )}
          value={value}
          label='Inicio'
          size={isMobile ? 'small' : 'medium'}
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
          renderInput={(params) => (
            <TextField size={isMobile ? 'small' : 'medium'} {...params} />
          )}
          label='Fin'
          size={isMobile ? 'small' : 'medium'}
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
          size='small'
          variant='contained'
          startIcon={<ManageSearchOutlinedIcon />}
          color='primary'
          onClick={() => searchInputs()}
        >
          Buscar
        </Button>
      </Stack>
      <span>{`Items: ${
        proofMonitoringItems_pageListGuide
          ? proofMonitoringItems_pageListGuide.length
          : 0
      }`}</span>
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
              <TableCell>Tipo Comprobante</TableCell>
              <TableCell>Número de serie</TableCell>
              <TableCell>Número Comprobante</TableCell>
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
              <TableCell>Subtotal</TableCell>
              <TableCell>IGV</TableCell>
              <TableCell>Importe total</TableCell>
              <TableCell>Forma de pago</TableCell>
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
                  <TableCell>{obj.issueDate}</TableCell>
                  <TableCell>
                    {translateValue(
                      'DOCUMENTTYPE',
                      obj.movementType.toUpperCase(),
                    )}
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
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    {obj.totalPriceWithIgv
                      ? `${moneySymbol} ${obj.totalPriceWithIgv.toFixed(2)} `
                      : ''}
                  </TableCell>
                  <TableCell>{showPaymentMethod(obj.paymentMethod)}</TableCell>
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
          .includes('/facturacion/proofMonitoring/seePDF') === true ? (
          <MenuItem onClick={() => window.open(selectedProof.linkPdf)}>
            <LocalAtmIcon sx={{mr: 1, my: 'auto'}} />
            Ver PDF
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/proofMonitoring/seeXML') === true ? (
          <MenuItem onClick={() => window.open(selectedProof.linkXml)}>
            <LocalAtmIcon sx={{mr: 1, my: 'auto'}} />
            Ver XML
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/proofMonitoring/seeCDR') === true ? (
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

export default ProofsOfPaymentConsolidation;
