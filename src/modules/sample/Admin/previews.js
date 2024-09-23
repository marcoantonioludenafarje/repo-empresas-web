import React, {useEffect, useRef} from 'react';
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
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
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
import {getListBusiness} from '../../../redux/actions/Admin';
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
  previsualizeReferralGuide,
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
import {Preview} from '@mui/icons-material';
import {useState} from 'react';
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
const Previews = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const theme = useTheme();
  const forceUpdate = useForceUpdate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  let canvasRef = useRef(null);
  //MANEJO DE FECHAS
  const toEpoch = (strDate) => {
    let someDate = new Date(strDate);
    someDate = someDate.getTime();
    return someDate;
  };

  const [scale, setScale] = React.useState(1.0);
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
  const [listProdBusiness, setListProdBusiness] = React.useState([]);
  const [selectedProdBusiness, setSelectedProdBusiness] = React.useState({});
  const [weightFields, setWeightFields] = React.useState(false);
  const [pdfScale, setPdfScale] = React.useState('100');
  const [selectedAcceptedStatus, setSelectedAcceptedStatus] =
    React.useState('waiting');
  const [urlPdf, setUrlPdf] = React.useState('');
  //API FUNCTIONS
  const toListProofMonitoringItems = (payload) => {
    dispatch(proofMonitoring(payload));
  };
  const toCancelInvoice = (payload, jwtToken) => {
    dispatch(cancelInvoice(payload, jwtToken));
  };
  const toExportExcelTemplateToReferralGuides = (payload) => {
    dispatch(exportExcelTemplateToReferralGuides(payload));
  };
  const toReferralGuidesBatchConsult = (payload, jwtToken) => {
    dispatch(referralGuidesBatchConsult(payload, jwtToken));
  };
  const toCancelReferralGuide = (payload, jwtToken) => {
    dispatch(cancelReferralGuide(payload, jwtToken));
  };
  const onGetListBusiness = (payload) => {
    dispatch(getListBusiness(payload));
  };

  //PREVISUALIZE
  const toPrevisualizeReferralGuide = (payload, jwtToken) => {
    dispatch(previsualizeReferralGuide(payload, jwtToken));
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
  const {listBusinessRes} = useSelector(({admin}) => admin);
  const {previsualizeReferralGuideRes} = useSelector(
    ({movements}) => movements,
  );
  const {jwtToken} = useSelector(({general}) => general);
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
          merchantId:
            listProdBusiness.length > 0
              ? selectedProdBusiness.merchantId
              : userDataRes.merchantSelected.merchantId,
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
            merchantId:
              listProdBusiness.length > 0
                ? selectedProdBusiness.merchantId
                : userDataRes.merchantSelected.merchantId,
            acceptedStatus: 'waiting',
          },
        },
      };

      listPayload.request.payload.LastEvaluatedKey = null;
      console.log('listPayload133:useEffect userDataRes:', listPayload);
      toListProofMonitoringItems(listPayload);
      if (
        userDataRes.merchantSelected.merchantId ==
        'cb1b5aff10ca4a548afae5b1f959e286'
      ) {
        let listBusinessPayload = {
          request: {
            payload: {
              merchantId: userDataRes.merchantSelected.merchantId,
              LastEvaluatedKey: null,
            },
          },
        };
        onGetListBusiness(listBusinessPayload);
      }
    }
  }, [userDataRes]);
  useEffect(() => {
    if (listBusinessRes && listBusinessRes.length > 0) {
      let newListProdBusiness = listBusinessRes
        .filter((obj) => obj.typeMerchant == 'PROD')
        .map((obj) => {
          obj.label = obj.denominationMerchant;
          return obj;
        });
      newListProdBusiness.push({
        merchantId: 'all',
        label: 'TODOS',
        denominationMerchant: 'TODOS',
      });
      setListProdBusiness(newListProdBusiness);
      console.log('newListProdBusiness', newListProdBusiness);
      setSelectedProdBusiness({
        merchantId: 'all',
        label: 'TODOS',
        denominationMerchant: 'TODOS',
      });
      console.log('negocio', selectedProdBusiness);
    }
  }, [listBusinessRes]);

  const [viewBoleta, setViewBoleta] = useState(false);
  const [viewFactura, setViewFactura] = useState(false);
  const [viewGuide, setViewGuide] = useState(false);
  const [viewCreditNote, setViewCreditNote] = useState(false);
  const [viewDebitNote, setViewDebitNote] = useState(false);

  const handleBoletaClick = () => {
    setViewGuide(false);
    setViewCreditNote(false);
    setViewDebitNote(false);
    setViewFactura(false);
    setViewBoleta(true);
  };
  const handleFacturaClick = () => {
    setViewGuide(false);
    setViewBoleta(false);
    setViewCreditNote(false);
    setViewDebitNote(false);
    setViewFactura(true);
  };
  const handleGuiaRemisionClick = () => {
    setViewBoleta(false);
    setViewCreditNote(false);
    setViewDebitNote(false);
    setViewFactura(false);
    setViewGuide(true);

    //alert("XD guia")
  };
  const handleNotaCreditoClick = () => {
    setViewGuide(false);
    setViewBoleta(false);
    setViewDebitNote(false);
    setViewFactura(false);
    setViewCreditNote(true);
  };
  const handleNotaDebitoClick = () => {
    setViewGuide(false);
    setViewBoleta(false);
    setViewCreditNote(false);
    setViewFactura(false);
    setViewDebitNote(true);
  };
  useEffect(() => {
    if (previsualizeReferralGuideRes && previsualizeReferralGuideRes.url) {
      setUrlPdf(previsualizeReferralGuideRes.url);
    }
  }, [previsualizeReferralGuideRes]);
  const [openPrevisualizer, setOpenPrevisualizer] = React.useState(false);
  const handleClosePrevisualizer = () => {
    setOpenPrevisualizer(false);
  };
  const handleClickOpenPrevisualizer = () => {
    console.log('negocio', selectedProdBusiness);
    setOpenPrevisualizer(true);
    setUrlPdf('');
    let previsualizePayload = {
      request: {
        payload: {
          merchantId: userDataRes.merchantSelected.merchantId,
          deliveryDistributionId: '',
          movementTypeMerchantId: '',
          movementHeaderId: '',
          contableMovementId: '',
          createdAt: 1691335785110,
          clientId:
            'RUC-20606168978-digisolutionssrl-cb1b5aff10ca4a548afae5b1f959e286',
          client: {
            denomination: 'DIGISOLUTIONS SRL',
            address: 'SERGIO BERNALES CON VICTOR ALZAMORA',
            email: 'acaedric@gmail.com',
          },
          issueDate: '04-09-2023',
          serial: 'T001',
          automaticSendSunat: true,
          automaticSendClient: true,
          reasonForTransfer: 'sale',
          totalGrossWeight: 22078.6,
          addressee: '',
          type: '',
          reasonDescription: '',
          numberOfPackages: 1,
          typeOfTransport: 'privateTransportation',
          transferStartDate: '04-09-2023',
          carrierDocumentType: 'RUC',
          carrierDocumentNumber: '20606168978',
          carrierDenomination: 'DIGISOLUTIONS SRL',
          carrierId:
            'RUC-20606168978-digisolutionssrl-cb1b5aff10ca4a548afae5b1f959e286',
          carrierPlateNumber: 'KDS-465',
          driverDocumentType: 'dni',
          driverDocumentNumber: '00829280',
          driverLicenseNumber: 'Q00829280',
          driverDenomination: 'MARCO ANTONIO',
          driverLastName: 'LUDEÑA TERRONES',
          startingPointUbigeo: '010701',
          startingPointAddress:
            'II EE, 16221 LEONCIO PRADO, NIVEL PRIMARIA, COLLICATE S/N',
          startingSunatCode: '',
          arrivalPointUbigeo: '010705',
          arrivalPointAddress:
            'II EE, 16260 JOSE ANTONIO ENCINAS FRANCO, NIVEL PRIMARIA, DUELAC',
          arrivalSunatCode: '',
          observation: '',
          productsInfo: [
            {
              product: '1',
              quantityMovement: '1100',
              weight: 0.214,
              customCodeProduct: '',
              description: 'ACEITE VEGETAL X 0.200 L, MARCA DEL CIELO',
              unitMeasure: 'NIU',
              businessProductCode: '1',
            },
            {
              product: '5',
              quantityMovement: 680,
              weight: 0.24,
              customCodeProduct: '',
              description:
                'HOJUELAS DE QUINUA X 0.240 KG, MARCA CAXAS SUPERFOODSSUPERFOODS X 240G',
              unitMeasure: 'NIU',
              businessProductCode: '5',
            },
            {
              product: '9',
              quantityMovement: 2450,
              weight: 0.425,
              customCodeProduct: '',
              description:
                'CONSERVA DE PESCADO EN AGUA Y SAL X 0.425 KG, MARCA CASALI',
              unitMeasure: 'NIU',
              businessProductCode: '9',
            },
            {
              product: '3',
              quantityMovement: 54090,
              weight: 0.25,
              customCodeProduct: '',
              description:
                "AZUCAR RUBIA X 0.250 KG, MARCA  JIKEL'S - DULCE CAÑAVERAL\nKG",
              unitMeasure: 'NIU',
              businessProductCode: '3',
            },
            {
              product: '2',
              quantityMovement: 28465,
              weight: 0.25,
              customCodeProduct: '',
              description: 'ARROZ X 0.250 KG, MARCA RIO BRANCO',
              unitMeasure: 'NIU',
              businessProductCode: '2',
            },
          ],
          documentsMovement: [],
          typePDF: 'PROD',
          folderMovement: 'salidas/RUC-20606168978/73',
          denominationMerchant: 'DIGISOLUTIONS SRL',
          weightFields: weightFields,
          pdfScale: pdfScale,
        },
      },
    };
    console.log('previsualizePayload', previsualizePayload);
    toPrevisualizeReferralGuide(previsualizePayload, jwtToken);
  };
  const handleZoomIn = () => {
    setScale((prevScale) => prevScale + 0.1);
  };

  const handleZoomOut = () => {
    setScale((prevScale) => prevScale - 0.1);
  };

  const handleResetZoom = () => {
    setScale(1.0);
  };

  return (
    <Card sx={{p: 4}}>
      {listProdBusiness ? (
        <Autocomplete
          disablePortal
          id='combo-box-demo'
          value={selectedProdBusiness}
          isOptionEqualToValue={(option, value) =>
            option.merchantId === value.merchantId
          }
          onChange={(event, value) => {
            if (typeof value === 'object' && value != null && value !== '') {
              setSelectedProdBusiness(value);
            }
          }}
          options={listProdBusiness}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Negocio'
              onChange={(event) => {
                console.log('event field', event.target.value);
                if (event.target.value === '') {
                  console.log('si se cambia a null');
                }
              }}
            />
          )}
        />
      ) : null}
      <span>{`Items: ${
        proofMonitoringItems_pageListGuide
          ? proofMonitoringItems_pageListGuide.length
          : 0
      }`}</span>

      {selectedProdBusiness.merchantId !== 'all' ? (
        <Box display='flex' justifyContent='center' mt={2}>
          <Stack direction='row' spacing={2}>
            <Button variant='contained' onClick={handleBoletaClick}>
              Boleta
            </Button>
            <Button variant='contained' onClick={handleFacturaClick}>
              Factura
            </Button>
            <Button variant='contained' onClick={handleClickOpenPrevisualizer}>
              Guía de Remisión
            </Button>
            <Button variant='contained' onClick={handleNotaCreditoClick}>
              Nota de Crédito
            </Button>
            <Button variant='contained' onClick={handleNotaDebitoClick}>
              Nota de Débito
            </Button>
          </Stack>
        </Box>
      ) : null}
      {viewGuide ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            mb: 5,
          }}
        >
          <Button
            sx={{width: 1}}
            color='secondary'
            variant='outlined'
            onClick={() => handleClickOpenPrevisualizer()}
          >
            Previsualizar PDF
          </Button>
        </Box>
      ) : null}

      <Dialog
        open={openPrevisualizer}
        onClose={handleClosePrevisualizer}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'GUÍA DE REMISIÓN PDF'}
          <CancelOutlinedIcon
            onClick={setOpenPrevisualizer.bind(this, false)}
            className={classes.closeButton}
          />
        </DialogTitle>
        <DialogContent>
          <Button
            color='primary'
            sx={{width: 1}}
            variant='outlined'
            onClick={() => window.open(urlPdf)}
          >
            Redirigir
          </Button>
          {urlPdf ? (
            <Box sx={{width: 1, textAlign: 'center'}}>
              <canvas ref={canvasRef} style={{height: '100vh'}} />
            </Box>
          ) : (
            <CircularProgress size={16} />
          )}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '1rem',
            }}
          >
            <IconButton onClick={handleZoomIn}>
              <ZoomInIcon />
            </IconButton>
            <IconButton onClick={handleZoomOut}>
              <ZoomOutIcon />
            </IconButton>
            <IconButton onClick={handleResetZoom}>
              <ZoomOutMapIcon />
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Previews;
