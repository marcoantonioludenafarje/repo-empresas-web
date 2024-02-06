import React, {useEffect, useRef} from 'react';
import {makeStyles} from '@mui/styles';
import AppPageMeta from '../../../@crema/core/AppPageMeta';
import {Form, Formik} from 'formik';
import YouTubeIcon from '@mui/icons-material/YouTube';
import * as yup from 'yup';
import {
  Divider,
  Button,
  Checkbox,
  ButtonGroup,
  Select,
  FormControlLabel,
  TextField,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Card,
  IconButton,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Collapse,
  Alert,
  Typography,
  CircularProgress,
} from '@mui/material';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import SchoolIcon from '@mui/icons-material/School';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloseIcon from '@mui/icons-material/Close';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import {red} from '@mui/material/colors';

import {useDispatch, useSelector} from 'react-redux';
import {
  onGetBusinessParameter,
  onGetGlobalParameter,
} from '../../../redux/actions/General';
import {
  addMovement,
  getMovements,
  getInputItems_pageListInput,
  cancelInvoice,
} from '../../../redux/actions/Movements';
import Router, {useRouter} from 'next/router';

import {orange} from '@mui/material/colors';
import {DesktopDatePicker, DateTimePicker} from '@mui/lab';
import SelectedProducts from '../AddExisingProduct/SelectedProducts';
import AddExisingProduct from '../AddExisingProduct';
import AddProductForm from './AddProductForm';
import AddProviderForm from '../ProviderSelection/AddProviderForm';
import {
  toEpoch,
  convertToDate,
  parseTo3Decimals,
  toSimpleDate,
} from '../../../Utils/utils';
import DocumentsTable from '../DocumentSelector/DocumentsTable';
import AddDocumentForm from '../DocumentSelector/AddDocumentForm';
import {
  FETCH_ERROR,
  FETCH_SUCCESS,
  RES_ADD_MOVEMENT,
  ADD_MOVEMENT,
  GET_MOVEMENTS,
  ACTUAL_DATE,
} from '../../../shared/constants/ActionTypes';

import {ClickAwayListener} from '@mui/base';
import { getLocations } from 'redux/actions';
const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
  },
  btnGroup: {
    marginTop: '1em',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  btn: {
    margin: '3px 0',
    width: '260px',
  },
  noSub: {
    textDecoration: 'none',
  },
  field: {
    marginTop: '10px',
  },
  imgPreview: {
    display: 'flex',
    justifyContent: 'center',
  },
  img: {
    width: '80%',
  },
  fixPosition: {
    position: 'relative',
    bottom: '-8px',
  },
  searchIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonAddProduct: {},
  closeButton: {
    cursor: 'pointer',
    float: 'right',
    marginTop: '5px',
    width: '20px',
  },
}));

const maxLength = 11111111111111111111; //20 caracteres
const validationSchema = yup.object({
  documentIntern: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    /* .required(<IntlMessages id='validation.required' />) */
    .max(maxLength, <IntlMessages id='validation.maxLength' />),
  serie: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .max(maxLength, <IntlMessages id='validation.maxLength' />),
  quotation: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .max(maxLength, <IntlMessages id='validation.maxLength' />),
  providerId: yup.string().typeError(<IntlMessages id='validation.string' />),
  totalField: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .test(
      'maxDigitsAfterDecimal',
      'El número puede contener como máximo 3 decimales',
      (number) => /^\d+(\.\d{1,3})?$/.test(number),
    ),
  inputObservation: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
});

//FORCE UPDATE
const useForceUpdate = () => {
  const [reload, setReload] = React.useState(0); // integer state
  return () => setReload((value) => value + 1); // update the state to force render
};

let selectedProducts = [];
let listDocuments = [];
let selectedProvider = {};
let typeAlert = '';
let total = 0;

const NewInput = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const forceUpdate = useForceUpdate();
  const router = useRouter();
  //APIS FUNCTIONS
  const getBusinessParameter = (payload) => {
    dispatch(onGetBusinessParameter(payload));
  };
  const getGlobalParameter = (payload) => {
    dispatch(onGetGlobalParameter(payload));
  };
  const getAddMovement = (payload) => {
    dispatch(addMovement(payload));
  };
  const toGetMovements = (payload) => {
    dispatch(getInputItems_pageListInput(payload));
  };
  const toGetStartingLocations = (payload) => {
    dispatch(getLocations(payload));
  };


  //VARIABLES DE PARAMETROS
  let weight_unit;
  let changeValueField;
  let getValueField;
  let isFormikSubmitting;
  let setFormikSubmitting;
  const [igvDefault, setIgvDefault] = React.useState(0);
  const [isIgvChecked, setIsIgvChecked] = React.useState(false);
  const [addIgv, setAddIgv] = React.useState(false);
  const [typeDialog, setTypeDialog] = React.useState('');
  const [openStatus, setOpenStatus] = React.useState(false);
  const [showForms, setShowForms] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [showInfo, setShowInfo] = React.useState(false);
  const [dateRegister, setDateRegister] = React.useState(Date.now());
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [moneyUnit, setMoneyUnit] = React.useState('');
  const [editTotal, setEditTotal] = React.useState(false);
  const [generateBill, setGenerateBill] = React.useState(false);
  const [status, setStatus] = React.useState('requested');
  const [guide, setGuide] = React.useState(false);
  const [percentageIgv, setPercentageIgv] = React.useState(null);
  const [selectedStartingLocation, setSelectedStartingLocation] = React.useState("");
  const [selectedStartingLocationId, setSelectedStartingLocationId] = React.useState('ND');
  const [typeDocument, settypeDocument] = React.useState('buys');
  const [exchangeRate, setExchangeRate] = React.useState('');
  const [hasBill, setHasBill] = React.useState([]);
  const [isProviderValidated, setIsProviderValidated] = React.useState(false);
  const [openProviderComprobation, setOpenProviderComprobation] =
    React.useState(false);

  const [minTutorial, setMinTutorial] = React.useState(false);
  const prevExchangeRateRef = useRef();
  useEffect(() => {
    prevExchangeRateRef.current = exchangeRate;
  });
  const prevExchangeRate = prevExchangeRateRef.current;

  const [moneyToConvert, setMoneyToConvert] = React.useState('');
  const prevMoneyToConvertRef = useRef();
  useEffect(() => {
    prevMoneyToConvertRef.current = moneyToConvert;
  });
  const prevMoneyToConvert = prevMoneyToConvertRef.current;

  //RESULTADOS DE LLAMADAS A APIS
  const {getMovementsRes} = useSelector(({movements}) => movements);
  console.log('getMovementsRes', getMovementsRes);
  const {inputItems_pageListInput} = useSelector(({movements}) => movements);
  console.log('inputItems_pageListInput', inputItems_pageListInput);
  const {businessParameter} = useSelector(({general}) => general);
  console.log('businessParameter', businessParameter);
  const {globalParameter} = useSelector(({general}) => general);
  console.log('globalParameter123', globalParameter);
  const {addMovementRes} = useSelector(({movements}) => movements);
  console.log('addMovementRes', addMovementRes);
  const {newMovementRes} = useSelector(({movements}) => movements);
  console.log('newMovementRes', newMovementRes);
  const {successMessage} = useSelector(({movements}) => movements);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({movements}) => movements);
  console.log('errorMessage', errorMessage);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  const {jwtToken} = useSelector(({general}) => general);
  const {getStartingLocationsRes} = useSelector(({locations}) => locations);

  console.log('Quiero usar jwtToken', jwtToken);
  
  let businessParameterPayload = {
    request: {
      payload: {
        abreParametro: null,
        codTipoparametro: null,
        merchantId: userDataRes.merchantSelected.merchantId,
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
  useEffect(() => {
    dispatch({type: RES_ADD_MOVEMENT, payload: []});
    getBusinessParameter(businessParameterPayload);
    getGlobalParameter(globalParameterPayload);
    selectedProducts = [];
    selectedProvider = {};
    listDocuments = [];
    typeAlert = '';
    total = 0;
  }, []);
  useEffect(() => {
    if (businessParameter != undefined) {
      let obtainedMoneyUnit = businessParameter.find(
        (obj) => obj.abreParametro == 'DEFAULT_MONEY_UNIT',
      ).value;
      let igvInitialDefault = businessParameter.find(
        (obj) => obj.abreParametro == 'IGV',
      ).value;
      setIgvDefault(igvInitialDefault);
      setAddIgv(Number(igvInitialDefault) > 0 ? true : false);
      setIsIgvChecked(Number(igvInitialDefault) > 0 ? true : false);
      setMoneyUnit(obtainedMoneyUnit);
      setMoneyToConvert(obtainedMoneyUnit);
      console.log('moneyUnit', moneyUnit);
    }
  }, [businessParameter != undefined]);

  useEffect(() => {
    if (globalParameter != undefined && moneyUnit) {
      let obtainedExchangeRate = globalParameter.find(
        (obj) =>
          obj.abreParametro == `ExchangeRate_${moneyToConvert}_${moneyUnit}`,
      ).value;
      setExchangeRate(obtainedExchangeRate);
      console.log('exchangeRate', exchangeRate);
    }
  }, [globalParameter != undefined && moneyUnit]);

  useEffect(() => {
    if (
      globalParameter != undefined &&
      moneyUnit &&
      prevMoneyToConvert !== moneyToConvert
    ) {
      let obtainedExchangeRate = globalParameter.find(
        (obj) =>
          obj.abreParametro == `ExchangeRate_${moneyToConvert}_${moneyUnit}`,
      ).value;
      setExchangeRate(obtainedExchangeRate);
      console.log('exchangeRate', exchangeRate);
    }
  }, [globalParameter != undefined && moneyUnit, moneyToConvert]);

  useEffect(() => {
    if (prevExchangeRate !== exchangeRate) {
      console.log('exchangerate cambiaso', exchangeRate);
      changeValueField('totalField', parseTo3Decimals(total).toFixed(3));
      changeValueField(
        'equivalentTotal',
        parseTo3Decimals(total * exchangeRate).toFixed(3),
      );
      changeValueField(
        'totalFieldIgv',
        (total * (1 + Number(igvDefault))).toFixed(3),
      );
    }
    setTimeout(() => {
      setMinTutorial(true);
    }, 2000);
  }, [exchangeRate]);
  useEffect(() => {
    console.log(
      'Este es el getLocationRes',
      getStartingLocationsRes,
    );
    // if (
    //   getStartingLocationsRes &&
    //   getStartingLocationsRes.length > 0 &&
    //   !selectedStartingLocation.locationId
    // ) {
    //   const initialLocation = getStartingLocationsRes[0];
    //   setSelectedStartingLocationId(initialLocation.locationId);
    //   setSelectedStartingLocation(initialLocation);
    // }
  }, [getStartingLocationsRes]);
  //SETEANDO PARAMETROS
  if (businessParameter != undefined) {
    weight_unit = businessParameter.find(
      (obj) => obj.abreParametro == 'DEFAULT_WEIGHT_UNIT',
    ).value;
  }
  const defaultValues = {
    documentIntern: '',
    serie: '',
    totalField: 0,
    equivalentTotal: '',
    providerId: '',
    status: '',
    initialDate: Date.now(),
    inputObservation: '',
  };
  const actualValues = {
    documentIntern: '',
    serie: '',
    totalField: 0,
    equivalentTotal: '',
    status: 'requested',
    type: 'buys',
    providerId: '',
    initialDate: '',
    money_unit: moneyToConvert,
  };

  console.log('Valores default peso', weight_unit, 'moneda', moneyUnit);

  const cancel = () => {
    setOpen2(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = (type) => {
    setOpen(true);
    setTypeDialog(type);
    setShowAlert(false);
  };
  const selectStartingLocation = (event) => {
    console.log('Id Location', event.target.value);
    if(event.target.value !== "ND"){
      const selectedLocation = getStartingLocationsRes.find(
        (obj) => obj.locationId == event.target.value,
      );
  
      setSelectedStartingLocationId(event.target.value);
      setSelectedStartingLocation(selectedLocation);
    } else {
      setSelectedStartingLocationId(event.target.value);
      setSelectedStartingLocation("");
    }
  };
  const getNewProduct = (product) => {
    console.log('nuevo producto1', product);
    if (selectedProducts && selectedProducts.length >= 1) {
      selectedProducts.map((obj, index) => {
        console.log('obj', obj);
        if (
          (obj.businessProductCode || obj.product) ==
          (product.businessProductCode || product.product)
        ) {
          console.log('selectedProducts 1', selectedProducts);
          selectedProducts.splice(index, 1);
          console.log('selectedProducts 2', selectedProducts);
        }
      });
    }
    selectedProducts.push(product);
    let calculatedtotal = 0;
    selectedProducts.map((obj) => {
      calculatedtotal += obj.subtotal;
    });
    total = calculatedtotal;
    /* total += Number(product.subtotal); */
    console.log('total de los productos', total);
    changeValueField('totalField', parseTo3Decimals(total).toFixed(3));
    changeValueField(
      'equivalentTotal',
      parseTo3Decimals(total * exchangeRate).toFixed(3),
    );
    changeValueField(
      'totalFieldIgv',
      (total * (1 + Number(igvDefault))).toFixed(3),
    );
  };
  const getProvider = (provider) => {
    selectedProvider = provider;
    console.log('Proveedor seleccionado', provider);
    setOpen(false);
  };
  const getDocument = (document) => {
    console.log('Documento seleccionado', document);
    listDocuments.push(document);
    forceUpdate();
  };
  const removeDocument = (index) => {
    listDocuments.splice(index, 1);
    forceUpdate();
  };

  const removeProduct = (index) => {
    console.log('index', index);
    selectedProducts.splice(index, 1);
    if (selectedProducts.length == 0) {
      total = 0;
    } else {
      let calculatedtotal = 0;
      selectedProducts.map((obj) => {
        calculatedtotal += obj.subtotal;
      });
      total = calculatedtotal;
    }
    /* total -= Number(selectedProducts[index].subtotal); */
    changeValueField('totalField', parseTo3Decimals(total).toFixed(3));
    changeValueField(
      'equivalentTotal',
      parseTo3Decimals(total * exchangeRate).toFixed(3),
    );
    changeValueField(
      'totalFieldIgv',
      (total * (1 + Number(igvDefault))).toFixed(3),
    );
    forceUpdate();
  };

  const buildNewDoc = (providerId, document) => {
    console.log('Documentos', providerId, document);
    if (document && providerId) {
      return `${providerId}-${document}`;
    } else {
      return '';
    }
  };

  const getCarrier = (obj) => {
    if (obj.nameCarrier) {
      return {denominationCarrier: obj.nameCarrier};
    }
  };

  const handleData = (data, provider) => {
    let localIsProviderValidated = isProviderValidated;
    if (Object.keys(selectedProvider).length != 0) {
      setIsProviderValidated(true);
      localIsProviderValidated = true;
    } else {
      setOpenProviderComprobation(true);
      setFormikSubmitting(false);
    }

    if (localIsProviderValidated || provider == 'enabled') {
      dispatch({type: FETCH_SUCCESS, payload: []});
      dispatch({type: FETCH_ERROR, payload: []});
      dispatch({type: ADD_MOVEMENT, payload: []});
      //setSubmitting(true);
      setFormikSubmitting(true);
      let finalPayload;
      let cleanDocuments = [];
      listDocuments.map((obj) => {
        cleanDocuments.push({
          typeDocument: obj.typeDocument,
          serialDocument: obj.document,
          issueDate: obj.dateDocument,
          ...getCarrier(obj),
        });
      });
      if (selectedProducts.length > 0) {
        let localDocumentIntern = '';
        let localProviderId = '';
        if (Object.keys(selectedProvider).length != 0) {
          localDocumentIntern = buildNewDoc(
            selectedProvider.providerId.split('-')[1],
            cleanDocuments.length !== 0
              ? cleanDocuments[0].serialDocument
              : null,
          );
          localProviderId = selectedProvider.providerId;
        }

        //if (selectedProvider.providerId*/) {
        finalPayload = {
          request: {
            payload: {
              header: {
                movementType: 'INPUT',
                documentIntern: localDocumentIntern,
                clientId: null,
                providerId: localProviderId,
                merchantId: userDataRes.merchantSelected.merchantId,
                quoteId: null,
                facturaId: null,
                issueDate: toSimpleDate(dateRegister),
                unitMeasureMoney: moneyToConvert,
                igv: addIgv,
                finalTotalPrice: Number(getValueField('totalField').value), //Number(data.totalField),
                isGeneratedByTunexo: generateBill,
                status: status,
                movementSubType: typeDocument,
                startingLocation: selectedStartingLocation,
                documentsMovement: cleanDocuments,
                editTotal: editTotal,
                observation: getValueField('inputObservation').value, //data.inputObservation,
                userCreated: userDataRes.userId,
                userCreatedMetadata: {
                  nombreCompleto: userDataRes.nombreCompleto,
                  email: userDataRes.email,
                },
              },
              products: selectedProducts.map((obj) => {
                return {
                  businessProductCode: obj.businessProductCode,
                  quantity: Number(obj.count),
                  priceUnit: Number(obj.priceProduct),
                  locations: obj.locations,
                  preStock: obj.preStock,
                  finalBalanceCost: obj.finalBalanceCost,
                };
              }),
            },
          },
        };
        console.log('finalPayload', finalPayload);
        /*dispatch({type: FETCH_SUCCESS, payload: undefined});
          dispatch({type: FETCH_ERROR, payload: undefined});
          dispatch({type: ADD_MOVEMENT, payload: []});*/
        getAddMovement(finalPayload);
        console.log('Data formulario principal', finalPayload);
        /*selectedProducts = [];
          selectedProvider = {};
          total = 0;*/
        setTimeout(() => {
          setOpenStatus(true);
        }, 1000);
        /*} else {
          typeAlert = 'provider';
          setShowAlert(true);
        }*/
      } else {
        typeAlert = 'product';
        setShowAlert(true);
      }
      //setSubmitting(false);
      setFormikSubmitting(false);
    }
  };

  const handleActualData = (event) => {
    console.log('evento onchange', event);
    Object.keys(actualValues).map((key) => {
      if (key == event.target.name) {
        actualValues[key] = event.target.value;
      }
    });
    if (event.target.name == 'totalField') {
      changeValueField(
        'equivalentTotal',
        parseTo3Decimals(event.target.value * exchangeRate).toFixed(3),
      );
      changeValueField(
        'totalFieldIgv',
        (event.target.value * (1 + Number(igvDefault))).toFixed(3),
      );
    }
    console.log('actualValues', actualValues);
  };

  const handleClickAway = () => {
    // Evita que se cierre el diálogo haciendo clic fuera del contenido
    // Puedes agregar condiciones adicionales aquí si deseas una lógica más específica.
  };
  const showMessage = () => {
    if (
      successMessage != undefined &&
      addMovementRes != undefined &&
      !('error' in addMovementRes)
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
            Se ha registrado la información <br />
            correctamente
          </DialogContentText>
        </>
      );
    } else if (
      (successMessage != undefined &&
        addMovementRes &&
        'error' in addMovementRes) ||
      errorMessage
    ) {
      return (
        <>
          <CancelOutlinedIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            Se ha producido un error al registrar.
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink />;
    }
  };

  const sendStatus = () => {
    let isBill = [];
    listDocuments.some((obj) => {
      if (obj.typeDocument === 'bill') {
        isBill.push('bill');
      }
      if (obj.typeDocument === 'referralGuide') {
        isBill.push('referralGuide');
      }
    });
    setHasBill(isBill);
    listDocuments = [];
    dispatch({type: ACTUAL_DATE, payload: Date.now()});
    if (
      newMovementRes !== undefined &&
      successMessage !== undefined &&
      !(isBill.includes('bill') && isBill.includes('referralGuide')) &&
      typeDocument === 'buys'
    ) {
      let listPayload = {
        request: {
          payload: {
            initialTime: Date.now() - 2678400000,
            finalTime: Date.now(),
            businessProductCode: null,
            movementType: 'INPUT',
            merchantId: userDataRes.merchantSelected.merchantId,
          },
        },
      };
      //dispatch({type: GET_MOVEMENTS, payload: []});
      toGetMovements(listPayload);
      setShowForms(true);
    } else {
      Router.push('/sample/inputs/table');
    }
    setOpenStatus(false);
  };

  const handleSelectValues = (event) => {
    console.log('evento onchange', event);
    setMoneyToConvert(event.target.value);
    console.log('moneyToConvert', moneyToConvert);
    Object.keys(actualValues).map((key) => {
      if (key == event.target.name) {
        actualValues[key] = event.target.value;
      }
    });
    console.log('actualValues', actualValues);
  };

  const handleStatus = (event) => {
    console.log('actualValues', actualValues);
    console.log('evento onchange', event);
    setStatus(event.target.value);
    actualValues.status = event.target.value;
    console.log('actualValues', actualValues);
  };
  const handleType = (event) => {
    console.log('actualValues', actualValues);
    console.log('evento onchange', event);
    actualValues.type = event.target.value;
    settypeDocument(event.target.value);
    console.log('actualValues', actualValues);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleIGV = (event, isInputChecked) => {
    setIsIgvChecked(isInputChecked);
    setAddIgv(isInputChecked);
    console.log('Evento de IGV cbx', isInputChecked);
  };
  const handleEdit = (event, isInputChecked) => {
    setShowInfo(isInputChecked);
    setEditTotal(isInputChecked);
    console.log('Evento de edicion total', isInputChecked);
  };
  const handleBill = (event, isInputChecked) => {
    setGenerateBill(isInputChecked);
    console.log('Evento de generar factura', isInputChecked);
  };
  const handleGuide = (event, isInputChecked) => {
    setGuide(isInputChecked);
    console.log('Evento de generar guía', isInputChecked);
  };

  const typeClient = userDataRes.merchantSelected.typeClient;

  return (
    <Card sx={{p: 4}}>
      <Box sx={{width: 1, textAlign: 'center'}}>
        <Typography
          sx={{mx: 'auto', my: '10px', fontWeight: 600, fontSize: 25}}
        >
          REGISTRO DE ENTRADA
        </Typography>
      </Box>
      <Divider sx={{mt: 2, mb: 4}} />
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          mb: 5,
          mx: 'auto',
        }}
      >
        <AppPageMeta />

        <Formik
          validateOnChange={true}
          validationSchema={validationSchema}
          initialValues={{...defaultValues}}
          onSubmit={handleData}
        >
          {({isSubmitting, setFieldValue, getFieldProps, setSubmitting}) => {
            changeValueField = setFieldValue;
            getValueField = getFieldProps;
            setFormikSubmitting = setSubmitting;
            isFormikSubmitting = isSubmitting;
            return (
              <Form
                style={{textAlign: 'left', justifyContent: 'center'}}
                noValidate
                autoComplete='on'
                onChange={handleActualData}
              >
                <Grid
                  container
                  spacing={2}
                  sx={{maxWidth: 500, width: 'auto', margin: 'auto'}}
                >
                  <Grid item xs={6} sm={4}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel id='moneda-label' style={{fontWeight: 200}}>
                        Moneda
                      </InputLabel>
                      <Select
                        name='money_unit'
                        labelId='moneda-label'
                        label='Moneda'
                        onChange={handleSelectValues}
                        value={moneyToConvert}
                      >
                        <MenuItem value='USD' style={{fontWeight: 200}}>
                          Dólares
                        </MenuItem>
                        <MenuItem value='PEN' style={{fontWeight: 200}}>
                          Soles
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel id='status-label' style={{fontWeight: 200}}>
                        Estado
                      </InputLabel>
                      <Select
                        name='status'
                        labelId='status-label'
                        label='Estado'
                        defaultValue='requested'
                        onChange={handleStatus}
                        /* value={moneyToConvert} */
                      >
                        <MenuItem value='requested' style={{fontWeight: 200}}>
                          <IntlMessages id='movements.status.requested' />
                        </MenuItem>
                        <MenuItem value='complete' style={{fontWeight: 200}}>
                          <IntlMessages id='movements.status.complete' />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel id='status-label' style={{fontWeight: 200}}>
                        Tipo de entrada
                      </InputLabel>
                      <Select
                        name='inputType'
                        labelId='inputType-label'
                        label='Tipo de entrada'
                        defaultValue='buys'
                        onChange={handleType}
                        /* value={moneyToConvert} */
                      >
                        <MenuItem value='buys' style={{fontWeight: 200}}>
                          <IntlMessages id='movements.type.buys' />
                        </MenuItem>
                        {/* <MenuItem
                          value='internalUses'
                          style={{fontWeight: 200}}
                        >
                          <IntlMessages id='movements.type.internalUses' />
                        </MenuItem> */}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={6} sm={4}>
                    <AppTextField
                      label={`Total ${moneyUnit} sin IGV`}
                      name='totalField'
                      disabled={!editTotal}
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
                  {addIgv ? (
                    <Grid item xs={6} sm={4}>
                      <AppTextField
                        label={`Total ${moneyUnit} con IGV`}
                        name='totalFieldIgv'
                        defaultValue={0}
                        disabled
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
                  ) : (
                    <></>
                  )}
                  {/* <Grid item xs={4}>
                    <AppTextField
                      label={`Total equivalente ${moneyToConvert}`}
                      name='equivalentTotal'
                      disabled
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                      }}
                    />
                  </Grid> */}
                  {/* <Grid item xs={4}>
                    <AppTextField
                      label={`T.C.: ${exchangeRate}`}
                      name='change'
                      disabled
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                      }}
                    />
                  </Grid> */}
                  <Grid
                    item
                    xs={4}
                    sx={{display: 'flex', alignItems: 'center', px: 2}}
                  >
                    <FormControlLabel
                      control={<Checkbox onChange={handleEdit} />}
                      label='Editar total'
                    />
                  </Grid>
                  {typeClient != 'PN' ? (
                    <Grid
                      item
                      xs={4}
                      sx={{display: 'flex', alignItems: 'center'}}
                    >
                      <FormControlLabel
                        disabled={Number(igvDefault) > 0 ? false : true}
                        checked={isIgvChecked}
                        control={<Checkbox onChange={handleIGV} />}
                        label='IGV'
                      />
                      {igvDefault}
                    </Grid>
                  ) : (
                    <></>
                  )}

                  {/* <Grid
                    item
                    xs={4}
                    sx={{display: 'flex', alignItems: 'center'}}
                  >
                    <FormControlLabel
                      control={<Checkbox onChange={handleBill} />}
                      label='Generar factura'
                    />
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sx={{display: 'flex', alignItems: 'center'}}
                  >
                    <FormControlLabel
                      control={<Checkbox onChange={handleGuide} />}
                      label='Generar guía de remisión'
                    />
                  </Grid> */}

                  <Grid xs={12}>
                    <Collapse in={showInfo}>
                      <Alert
                        severity='info'
                        action={
                          <IconButton
                            aria-label='close'
                            color='inherit'
                            size='small'
                            onClick={() => {
                              setShowInfo(false);
                            }}
                          >
                            <CloseIcon fontSize='inherit' />
                          </IconButton>
                        }
                        sx={{mb: 2}}
                      >
                        Ahora puedes editar el precio total.
                      </Alert>
                    </Collapse>
                  </Grid>

                  {typeClient != 'PN' ? (
                    <Grid item xs={12}>
                      <Button
                        sx={{width: 1}}
                        variant='outlined'
                        onClick={handleClickOpen.bind(this, 'document')}
                      >
                        Añade documentos
                      </Button>
                    </Grid>
                  ) : (
                    <></>
                  )}
                </Grid>

                {typeClient != 'PN' ? (
                  <Box sx={{my: 5}}>
                    <DocumentsTable
                      arrayObjs={listDocuments}
                      toDelete={removeDocument}
                    />
                  </Box>
                ) : (
                  <></>
                )}

                <Grid
                  container
                  spacing={2}
                  sx={{maxWidth: 500, width: 'auto', margin: 'auto'}}
                >
                  <Grid item xs={12} sm={12}>
                    <Button
                      sx={{width: 1}}
                      variant='outlined'
                      onClick={handleClickOpen.bind(this, 'provider')}
                    >
                      Selecciona un Proveedor
                    </Button>
                  </Grid>
                  <Grid item xs={4} sx={{textAlign: 'center'}}>
                    <Typography sx={{mx: 'auto', my: '10px'}}>
                      {selectedProvider.denominationProvider}
                    </Typography>
                  </Grid>
                </Grid>
                {getStartingLocationsRes && getStartingLocationsRes.length > 0 ? (
                  <Grid
                    container
                    spacing={2}
                    sx={{ maxWidth: 500, width: 'auto', margin: 'auto' }}
                  >
                    <FormControl fullWidth sx={{ my: 2 }}>
                      <InputLabel id='startingLocation-label' style={{ fontWeight: 200 }}>
                        <IntlMessages id='common.startingLocation' />
                      </InputLabel>
                      <Select
                        name='startingLocation'
                        labelId='route-label'
                        label={<IntlMessages id='common.startingLocation' />}
                        onChange={(event) => selectStartingLocation(event)}
                        value={selectedStartingLocationId}
                        MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
                        disabled={selectedProducts && selectedProducts.length > 0}
                      >
                        <MenuItem
                          value={"ND"}
                          style={{ fontWeight: 200 }}
                        >
                          No Designado
                        </MenuItem>
                        {getStartingLocationsRes.map((location, index) => {
                          if(!(userDataRes.locations) || !(userDataRes.locations.length > 0) || userDataRes.locations.includes(location.modularCode)){
                            return (
                              <MenuItem
                                value={location.locationId}
                                key={index}
                                style={{ fontWeight: 200 }}
                              >
                                {location.locationName}
                              </MenuItem>
                            );
                          } 
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                ) : null}
                <Divider sx={{m: 2}} />
                {/* <Grid item xs={6} sm={6}> */}

                <Grid
                  item
                  xs={12}
                  container
                  spacing={2}
                  sx={{width: 500, margin: 'auto'}}
                >
                  <Button
                    sx={{width: 1}}
                    variant='outlined'
                    onClick={handleClickOpen.bind(this, 'product')}
                  >
                    Añade productos
                  </Button>
                </Grid>
                <Box sx={{my: 5}}>
                  <SelectedProducts
                    arrayObjs={selectedProducts}
                    toDelete={removeProduct}
                  />
                </Box>
                <Collapse in={showAlert}>
                  <Alert
                    severity='error'
                    action={
                      <IconButton
                        aria-label='close'
                        color='inherit'
                        size='small'
                        onClick={() => {
                          setShowAlert(false);
                        }}
                      >
                        <CloseIcon fontSize='inherit' />
                      </IconButton>
                    }
                    sx={{mb: 2}}
                  >
                    {typeAlert == 'product'
                      ? 'Por favor selecciona al menos un producto.'
                      : null}
                    {typeAlert == 'provider'
                      ? 'Por favor selecciona un proveedor.'
                      : null}
                  </Alert>
                </Collapse>

                <Divider sx={{m: 2}} />
                <Grid item sx={{maxWidth: 500, width: 'auto', margin: 'auto'}}>
                  <AppTextField
                    label='Observaciones'
                    name='inputObservation'
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

                <ButtonGroup
                  orientation='vertical'
                  variant='outlined'
                  sx={{width: 1}}
                  aria-label='outlined button group'
                >
                  <Button
                    color='primary'
                    sx={{mx: 'auto', width: '50%', py: 3}}
                    type='submit'
                    variant='contained'
                    disabled={isSubmitting}
                    startIcon={<SaveAltOutlinedIcon />}
                  >
                    Finalizar
                  </Button>
                  {/* <Button
                    sx={{mx: 'auto', width: '50%', py: 3}}
                    variant='outlined'
                    startIcon={<SaveAltOutlinedIcon />}
                  >
                    Guardar y registrar nuevo
                  </Button> */}
                  <Button
                    sx={{mx: 'auto', width: '50%', py: 3}}
                    variant='outlined'
                    startIcon={<ArrowCircleLeftOutlinedIcon />}
                    onClick={cancel}
                  >
                    Cancelar
                  </Button>
                </ButtonGroup>
                {minTutorial ? (
                  <Box
                    sx={{
                      position: 'fixed',
                      right: 0,
                      top: {xs: 325, xl: 305},
                      zIndex: 1110,
                    }}
                    className='customizerOption'
                  >
                    <Box
                      sx={{
                        borderRadius: '30px 0 0 30px',
                        mb: 1,
                        backgroundColor: orange[500],
                        '&:hover': {
                          backgroundColor: orange[700],
                        },
                        '& button': {
                          borderRadius: '30px 0 0 30px',

                          '&:focus': {
                            borderRadius: '30px 0 0 30px',
                          },
                        },
                      }}
                    >
                      <IconButton
                        sx={{
                          mt: 1,
                          '& svg': {
                            height: 35,
                            width: 35,
                          },
                          color: 'white',
                          pr: 5,
                        }}
                        edge='end'
                        color='inherit'
                        aria-label='open drawer'
                        onClick={() =>
                          window.open('https://youtu.be/OFpQzZAeATw/')
                        }
                      >
                        <SchoolIcon fontSize='inherit' />
                      </IconButton>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      position: 'fixed',
                      right: 0,
                      top: {xs: 325, xl: 305},
                      zIndex: 1110,
                    }}
                    className='customizerOption'
                  >
                    <Box
                      sx={{
                        borderRadius: '30px 0 0 30px',
                        mb: 1,
                        backgroundColor: orange[500],
                        '&:hover': {
                          backgroundColor: orange[700],
                        },
                        '& button': {
                          borderRadius: '30px 0 0 30px',

                          '&:focus': {
                            borderRadius: '30px 0 0 30px',
                          },
                        },
                      }}
                    >
                      <IconButton
                        sx={{
                          mt: 1,
                          '& svg': {
                            height: 35,
                            width: 35,
                          },
                          color: 'white',
                        }}
                        edge='end'
                        color='inherit'
                        aria-label='open drawer'
                        onClick={() => window.open('https://www.youtube.com/')}
                      >
                        VER TUTORIAL
                      </IconButton>
                    </Box>
                  </Box>
                )}
              </Form>
            );
          }}
        </Formik>

        <Dialog
          open={open}
          onClose={handleClose}
          sx={{textAlign: 'center'}}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          {typeDialog == 'product' ? (
            <>
              <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
                {'Selecciona los productos'}
                <CancelOutlinedIcon
                  onClick={setOpen.bind(this, false)}
                  className={classes.closeButton}
                />
              </DialogTitle>
              <DialogContent>
                {/* <AddProductForm type='input' sendData={getNewProduct} /> */}
                <AddExisingProduct type='input' sendData={getNewProduct} />
              </DialogContent>
            </>
          ) : (
            <></>
          )}
          {typeDialog == 'provider' ? (
            <>
              <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
                {'Búsqueda de proveedores'}
                <CancelOutlinedIcon
                  onClick={setOpen.bind(this, false)}
                  className={classes.closeButton}
                />
              </DialogTitle>
              <DialogContent>
                <AddProviderForm sendData={getProvider} />
              </DialogContent>
            </>
          ) : (
            <></>
          )}
          {typeDialog == 'document' ? (
            <>
              <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
                {'Ingresa los datos de documento'}
                <CancelOutlinedIcon
                  onClick={setOpen.bind(this, false)}
                  className={classes.closeButton}
                />
              </DialogTitle>
              <DialogContent>
                <AddDocumentForm sendData={getDocument} />
              </DialogContent>
            </>
          ) : (
            <></>
          )}
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
              {'Registro de Entrada'}
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
      </Box>

      <Dialog
        open={open2}
        onClose={handleClose2}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Registro de entrada'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <PriorityHighIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            Desea cancelar esta operación?. <br /> Se perderá la información
            ingresada
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button
            variant='outlined'
            onClick={() => {
              setOpen2(false);
              selectedProducts = [];
              selectedProvider = {};
              typeAlert = '';
              total = 0;
              Router.push('/sample/inputs/table');
            }}
          >
            Sí
          </Button>
          <Button variant='outlined' onClick={handleClose2}>
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openProviderComprobation}
        onClose={() => setOpenProviderComprobation(false)}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Proveedor No Identificado'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <PriorityHighIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            ¿Desea continuar con el registro?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button
            disabled={isFormikSubmitting}
            variant='outlined'
            onClick={() => {
              setFormikSubmitting(true);
              setIsProviderValidated(true);
              handleData({data1: 'a'}, 'enabled');
            }}
          >
            Sí
          </Button>
          <Button
            variant='outlined'
            onClick={() => {
              setOpenProviderComprobation(false);
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showForms}
        onClose={() => Router.push('/sample/inputs/table')}
        sx={{textAlign: 'center'}}
        fullWidth
        maxWidth='xs'
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            {inputItems_pageListInput.length !== 0 ? (
              <>
                {hasBill &&
                localStorage
                  .getItem('pathsBack')
                  .includes(
                    '/facturacion/accounting/movement/register?path=/outcomeOfInput/*',
                  ) ? (
                  <Button
                    color='primary'
                    sx={{width: 1, px: 7, my: 2}}
                    variant='contained'
                    onClick={() => {
                      Router.push({
                        pathname: '/sample/finances/new-expense',
                        query: inputItems_pageListInput.find(
                          (obj) =>
                            obj.movementHeaderId ==
                            addMovementRes.movementHeaderId,
                        ),
                      });
                    }}
                  >
                    Generar Egreso
                  </Button>
                ) : null}
                <Button
                  color='primary'
                  sx={{width: 1, px: 7, my: 2}}
                  variant='outlined'
                  onClick={() => Router.push('/sample/inputs/table')}
                >
                  Ir a Listado
                </Button>
              </>
            ) : (
              <CircularProgress />
            )}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default NewInput;
