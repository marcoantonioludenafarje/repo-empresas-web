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
  FilledInput,
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
import InputAdornment from '@mui/material/InputAdornment';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import SchoolIcon from '@mui/icons-material/School';
import {orange} from '@mui/material/colors';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloseIcon from '@mui/icons-material/Close';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import {red} from '@mui/material/colors';

import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {
  onGetBusinessParameter,
  onGetGlobalParameter,
} from '../../../redux/actions/General';
import {
  addMovement,
  getMovements,
  getOutputItems_pageListOutput,
} from '../../../redux/actions/Movements';
import Router, {useRouter} from 'next/router';

import {ClickAwayListener} from '@mui/base';
import {getLocations} from 'redux/actions';
import {DesktopDatePicker, DateTimePicker} from '@mui/lab';
/* import SelectedProducts from './SelectedProducts';
import AddProductForm from './AddProductForm'; */
import SelectedProducts from '../AddExisingProduct/SelectedProducts';
import AddExisingProduct from '../AddExisingProduct';
import AddClientForm from '../ClientSelection/AddClientForm';
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
  GET_MOVEMENTS,
  ADD_MOVEMENT,
  ACTUAL_DATE,
} from '../../../shared/constants/ActionTypes';

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
  clientId: yup.string().typeError(<IntlMessages id='validation.string' />),
  totalField: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .test(
      'maxDigitsAfterDecimal',
      'El número puede contener como máximo 3 decimales',
      (number) => /^\d+(\.\d{1,3})?$/.test(number),
    ),
  outputObservation: yup
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
let selectedClient = {};
let typeAlert = '';
let total = 0;

const NewOutput = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const forceUpdate = useForceUpdate();

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
    dispatch(getOutputItems_pageListOutput(payload));
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
  const [addIgv, setAddIgv] = React.useState(false);
  const [igvDefault, setIgvDefault] = React.useState(0);
  const [isIgvChecked, setIsIgvChecked] = React.useState(false);
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
  const [exchangeRate, setExchangeRate] = React.useState('');
  const [typeDocument, settypeDocument] = React.useState('sales');
  const [hasBill, setHasBill] = React.useState([]);
  const [openClientComprobation, setOpenClientComprobation] =
    React.useState(false);
  const [isClientValidated, setIsClientValidated] = React.useState(false);

  const [minTutorial, setMinTutorial] = React.useState(false);
  const [selectedStartingLocation, setSelectedStartingLocation] =
    React.useState('');
  const [selectedStartingLocationId, setSelectedStartingLocationId] =
    React.useState('ND');
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
  const {outputItems_pageListOutput} = useSelector(({movements}) => movements);
  console.log('outputItems_pageListOutput', outputItems_pageListOutput);
  const {listProducts} = useSelector(({products}) => products);
  console.log('listProducts', listProducts);
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
  const {getRolUserRes} = useSelector(({general}) => general);
  console.log('Esto es getRolUserRes', getRolUserRes);
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
    dispatch({type: ADD_MOVEMENT, payload: []});
    let businessParameterPayload = {
      request: {
        payload: {
          abreParametro: null,
          codTipoparametro: null,
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };
    getBusinessParameter(businessParameterPayload);
    getGlobalParameter(globalParameterPayload);
    selectedProducts = [];
    selectedClient = {};
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
    console.log('Este es el getLocationRes', getStartingLocationsRes);
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
    clientId: '',
    status: '',
    initialDate: Date.now(),
    outputObservation: '',
  };
  const actualValues = {
    documentIntern: '',
    serie: '',
    totalField: 0,
    equivalentTotal: '',
    status: 'requested',
    type: 'sales',
    clientId: '',
    initialDate: '',
    money_unit: moneyToConvert,
  };

  console.log('Valores default peso', weight_unit, 'moneda', moneyUnit);
  console.log('userDataRes', userDataRes);

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
    if (event.target.value !== 'ND') {
      const selectedLocation = getStartingLocationsRes.find(
        (obj) => obj.locationId == event.target.value,
      );

      setSelectedStartingLocationId(event.target.value);
      setSelectedStartingLocation(selectedLocation);
    } else {
      setSelectedStartingLocationId(event.target.value);
      setSelectedStartingLocation('');
    }
  };
  const getNewProduct = (product) => {
    console.log('nuevo producto', product);
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
  const getClient = (client) => {
    console.log('Estoy en el getClient');
    selectedClient = client;
    console.log('Cliente seleccionado', client);
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
    total -= Number(selectedProducts[index].subtotal);
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

  const editProduct = (index) => {
    console.log('Llega a edit', index);
    console.log('llega', selectedProducts);
    console.log('llega lista', listProducts);
    let productox = listProducts.find(
      (producto) =>
        producto.businessProductCode ===
        selectedProducts[0].businessProductCode,
    );
    console.log('llega pro', productox);
  };

  const buildNewDoc = (clientId, document) => {
    console.log('Documentos', clientId, document);
    if (document && clientId) {
      return `${clientId}-${document}`;
    } else {
      return '';
    }
  };

  const getDate = (date) => {
    if (typeof date === 'string') {
      return convertToDate(toEpoch(date));
    } else {
      return convertToDate(date);
    }
  };

  const getCarrier = (obj) => {
    if (obj.nameCarrier) {
      return {denominationCarrier: obj.nameCarrier};
    }
  };

  const handleData = (data, client) => {
    let localIsClientValidated = isClientValidated;
    if (Object.keys(selectedClient).length != 0) {
      setIsClientValidated(true);
      localIsClientValidated = true;
    } else {
      setOpenClientComprobation(true);
      setFormikSubmitting(false);
    }

    if (localIsClientValidated || client == 'enabled') {
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
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
        // if (
        //   (typeDocument == 'sales' && selectedClient.clientId) ||
        //   (typeDocument != 'sales' && !selectedClient.clientId)
        // ) {

        let localDocumentIntern = '';
        let localClientId = '';
        if (Object.keys(selectedClient).length != 0) {
          localDocumentIntern =
            typeDocument == 'sales'
              ? buildNewDoc(
                  selectedClient.clientId.split('-')[1],
                  cleanDocuments.length !== 0
                    ? cleanDocuments[0].serialDocument
                    : null,
                )
              : '';
          localClientId =
            typeDocument == 'sales' ? selectedClient.clientId : '';
        }
        finalPayload = {
          request: {
            payload: {
              header: {
                movementType: 'OUTPUT',
                documentIntern: localDocumentIntern,
                clientId: localClientId,
                providerId: null,
                merchantId: userDataRes.merchantSelected.merchantId,
                quoteId: null,
                facturaId: null,
                issueDate: toSimpleDate(dateRegister),
                unitMeasureMoney: moneyToConvert,
                igv: typeDocument == 'sales' ? addIgv : false,
                finalTotalPrice: Number(getValueField('totalField').value),
                isGeneratedByTunexo: generateBill,
                status: status,
                movementSubType: typeDocument,
                startingLocation: selectedStartingLocation,
                documentsMovement: cleanDocuments,
                editTotal: editTotal,
                observation: getValueField('outputObservation').value,
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
        getAddMovement(finalPayload);
        console.log('Data formulario principal', finalPayload);
        /* selectedProducts = [];
          selectedClient = {};
          total = 0; */
        setTimeout(() => {
          setOpenStatus(true);
        }, 1000);
        // } else {
        //   if (typeDocument == 'sales') {
        //     typeAlert = 'client';
        //     setShowAlert(true);
        //   }
        //   if (typeDocument != 'sales') {
        //     typeAlert = '';
        //     setShowAlert(true);
        //   }
        // }
      } else {
        typeAlert = 'product';
        setShowAlert(true);
      }
      //setSubmitting(false);
      setFormikSubmitting(false);
    }
  };

  const handleClickAway = () => {
    // Evita que se cierre el diálogo haciendo clic fuera del contenido
    // Puedes agregar condiciones adicionales aquí si deseas una lógica más específica.
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

  const showMessage = () => {
    if (
      successMessage != undefined &&
      addMovementRes != undefined &&
      !('error' in addMovementRes)
    ) {
      return (
        <>
          <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
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
          </DialogContent>
          <DialogActions sx={{justifyContent: 'center'}}>
            <Button variant='outlined' onClick={sendStatus}>
              Aceptar
            </Button>
          </DialogActions>
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
          <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
            <CancelOutlinedIcon
              sx={{fontSize: '6em', mx: 2, color: red[500]}}
            />
            <DialogContentText
              sx={{fontSize: '1.2em', m: 'auto'}}
              id='alert-dialog-description'
            >
              Se ha producido un error al registrar. <br />
              {addMovementRes !== undefined && 'error' in addMovementRes
                ? addMovementRes.error
                : null}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{justifyContent: 'center'}}>
            <Button variant='outlined' onClick={() => setOpenStatus(false)}>
              Aceptar
            </Button>
          </DialogActions>
        </>
      );
    } else {
      return <CircularProgress disableShrink sx={{mx: 'auto', my: '20px'}} />;
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
    console.log('isBill', isBill);
    dispatch({type: ACTUAL_DATE, payload: Date.now()});
    if (
      newMovementRes !== undefined &&
      !('error' in newMovementRes) &&
      !(isBill.includes('bill') && isBill.includes('referralGuide')) &&
      typeDocument === 'sales'
    ) {
      let listPayload = {
        request: {
          payload: {
            initialTime: Date.now() - 2678400000,
            finalTime: Date.now() + 28400000,
            businessProductCode: null,
            movementType: 'OUTPUT',
            merchantId: userDataRes.merchantSelected.merchantId,
          },
        },
      };

      //dispatch({type: GET_MOVEMENTS, payload: []});
      console.log('Este es el listPayload NewOutput', listPayload);
      toGetMovements(listPayload);
      if (
        localStorage
          .getItem('pathsBack')
          .includes(
            '/facturacion/accounting/movement/register?path=/receiptOfOutput/*',
          ) ||
        localStorage
          .getItem('pathsBack')
          .includes(
            '/facturacion/accounting/movement/register?path=/referralGuideOfOutput/*',
          ) ||
        localStorage
          .getItem('pathsBack')
          .includes(
            '/facturacion/accounting/movement/register?path=/billOfOutput/*',
          ) ||
        localStorage
          .getItem('pathsBack')
          .includes(
            '/facturacion/accounting/movement/register?path=/incomeOfOutput/*',
          )
      )
        setShowForms(true);
      else Router.push('/sample/outputs/table');
    } else {
      Router.push('/sample/outputs/table');
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
    settypeDocument(event.target.value);
    actualValues.type = event.target.value;
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
    console.log('Evento edit total', editTotal);
    console.log('Evento show', showInfo);
  };
  const handleBill = (event, isInputChecked) => {
    setGenerateBill(isInputChecked);
    console.log('Evento de generar factura', isInputChecked);
  };
  const handleGuide = (event, isInputChecked) => {
    setGuide(isInputChecked);
    console.log('Evento de generar guía', isInputChecked);
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

  function validationClientType(documentType) {
    let validation = false;

    if (selectedClient.clientId) {
      let client = selectedClient.clientId.split('-');
      let clientDocumentType = client[0];
      let clientNumberDocument = client[1];

      if (
        (!clientDocumentType || clientDocumentType != 'RUC') &&
        documentType == 'receipt'
      ) {
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
    } else if (documentType == 'receipt') {
      validation = true;
    }

    console.log('selectedOutput1', selectedClient);
    return validation;
  }

  const typeClient = userDataRes.merchantSelected.typeClient;

  return (
    <Card sx={{p: 4}}>
      <Box sx={{width: 1, textAlign: 'center'}}>
        <Typography
          sx={{mx: 'auto', my: '10px', fontWeight: 600, fontSize: 25}}
        >
          REGISTRO DE SALIDA
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
                  <Grid item xs={6}>
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
                  <Grid item xs={6}>
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
                  <Grid item xs={6}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel id='status-label' style={{fontWeight: 200}}>
                        Tipo de salida
                      </InputLabel>
                      <Select
                        name='inputType'
                        labelId='inputType-label'
                        label='Tipo de salida'
                        defaultValue='sales'
                        onChange={handleType}
                        /* value={typeDocument} */
                      >
                        <MenuItem value='sales' style={{fontWeight: 200}}>
                          <IntlMessages id='movements.type.sales' />
                        </MenuItem>
                        <MenuItem value='sampling' style={{fontWeight: 200}}>
                          <IntlMessages id='movements.type.sampling' />
                        </MenuItem>
                        <MenuItem value='expired' style={{fontWeight: 200}}>
                          <IntlMessages id='movements.type.expired' />
                        </MenuItem>
                        <MenuItem value='otherUses' style={{fontWeight: 200}}>
                          <IntlMessages id='movements.type.otherUses' />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
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
                    <Grid item xs={6}>
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
                  {typeClient != 'PN' && typeDocument == 'sales' ? (
                    <Grid
                      item
                      xs={4}
                      sx={{display: 'flex', alignItems: 'center', px: 2}}
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
                  {typeDocument == 'sales' ? (
                    <Grid item xs={12} sm={12}>
                      <Button
                        sx={{width: 1}}
                        variant='outlined'
                        onClick={handleClickOpen.bind(this, 'client')}
                      >
                        Selecciona un cliente
                      </Button>
                    </Grid>
                  ) : (
                    <></>
                  )}
                  {typeDocument == 'sales' ? (
                    <Grid item xs={12} sx={{textAlign: 'center'}}>
                      <Typography sx={{mx: 'auto', my: '10px'}}>
                        {selectedClient.denominationClient}
                      </Typography>
                    </Grid>
                  ) : (
                    <></>
                  )}
                </Grid>

                {getStartingLocationsRes &&
                getStartingLocationsRes.length > 0 ? (
                  <Grid
                    container
                    spacing={2}
                    sx={{maxWidth: 500, width: 'auto', margin: 'auto'}}
                  >
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel
                        id='startingLocation-label'
                        style={{fontWeight: 200}}
                      >
                        <IntlMessages id='common.startingLocation' />
                      </InputLabel>
                      <Select
                        name='startingLocation'
                        labelId='route-label'
                        label={<IntlMessages id='common.startingLocation' />}
                        onChange={(event) => selectStartingLocation(event)}
                        value={selectedStartingLocationId}
                        MenuProps={{PaperProps: {style: {maxHeight: 200}}}}
                        disabled={
                          selectedProducts && selectedProducts.length > 0
                        }
                      >
                        <MenuItem value={'ND'} style={{fontWeight: 200}}>
                          No Designado
                        </MenuItem>
                        {getStartingLocationsRes.map((location, index) => {
                          if (
                            !userDataRes.locations ||
                            !(userDataRes.locations.length > 0) ||
                            userDataRes.locations.includes(location.modularCode)
                          ) {
                            return (
                              <MenuItem
                                value={location.locationId}
                                key={index}
                                style={{fontWeight: 200}}
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

                <Grid
                  container
                  spacing={2}
                  sx={{maxWidth: 500, margin: 'auto'}}
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
                    //toEdit={editProduct}
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
                    {typeAlert == 'client'
                      ? 'Por favor selecciona un cliente.'
                      : null}
                  </Alert>
                </Collapse>

                <Divider sx={{m: 2}} />
                <Grid item sx={{maxWidth: 500, width: 'auto', margin: 'auto'}}>
                  <AppTextField
                    label='Observaciones'
                    name='outputObservation'
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
                          window.open('https://youtu.be/XTUGcMq_Iaw/')
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

        <ClickAwayListener onClickAway={handleClickAway}>
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
                  <AddExisingProduct type='output' sendData={getNewProduct} />
                </DialogContent>
              </>
            ) : (
              <></>
            )}
            {typeDialog == 'client' ? (
              <>
                <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
                  {'Búsqueda de clientes'}
                  <CancelOutlinedIcon
                    onClick={setOpen.bind(this, false)}
                    className={classes.closeButton}
                  />
                </DialogTitle>
                <DialogContent>
                  <AddClientForm sendData={getClient} />
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
        </ClickAwayListener>

        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={openStatus}
            onClose={sendStatus}
            sx={{textAlign: 'center'}}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
              {'Registro de Salida'}
            </DialogTitle>
            {showMessage()}
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
          {'Registro de salida'}
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
              /* selectedProducts = [];
              selectedClient = {};
              typeAlert = '';
              total = 0; */
              Router.push('/sample/outputs/table');
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
        open={openClientComprobation}
        onClose={() => setOpenClientComprobation(false)}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Cliente No Identificado'}
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
              setIsClientValidated(true);
              handleData({data1: 'a'}, 'enabled');
            }}
          >
            Sí
          </Button>
          <Button
            variant='outlined'
            onClick={() => {
              setOpenClientComprobation(false);
            }}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showForms}
        onClose={() => Router.push('/sample/outputs/table')}
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
            {outputItems_pageListOutput.length !== 0 ? (
              <>
                {validationClientType('referralGuide') &&
                !hasBill.includes('referralGuide') &&
                localStorage
                  .getItem('pathsBack')
                  .includes(
                    '/facturacion/accounting/movement/register?path=/referralGuideOfOutput/*',
                  ) ? (
                  <Button
                    color='primary'
                    sx={{width: 1, px: 7, my: 2}}
                    variant='contained'
                    onClick={() => {
                      Router.push({
                        pathname: '/sample/referral-guide/get',
                        query: outputItems_pageListOutput.find(
                          (obj) =>
                            obj.movementHeaderId ==
                            addMovementRes.movementHeaderId,
                        ),
                      });
                    }}
                  >
                    Generar Guía de remisión
                  </Button>
                ) : null}
                {validationClientType('receipt') &&
                !hasBill.includes('bill') &&
                localStorage
                  .getItem('pathsBack')
                  .includes(
                    '/facturacion/accounting/movement/register?path=/receiptOfOutput/*',
                  ) ? (
                  <Button
                    color='primary'
                    sx={{width: 1, px: 7, my: 2}}
                    variant='contained'
                    onClick={() => {
                      Router.push({
                        pathname: '/sample/receipts/get',
                        query: outputItems_pageListOutput.find(
                          (obj) =>
                            obj.movementHeaderId ==
                            addMovementRes.movementHeaderId,
                        ),
                      });
                    }}
                  >
                    Generar Boleta De Venta
                  </Button>
                ) : null}
                {validationClientType('bill') &&
                !hasBill.includes('bill') &&
                localStorage
                  .getItem('pathsBack')
                  .includes(
                    '/facturacion/accounting/movement/register?path=/billOfOutput/*',
                  ) ? (
                  <Button
                    color='primary'
                    sx={{width: 1, px: 7, my: 2}}
                    variant='contained'
                    onClick={() => {
                      Router.push({
                        pathname: '/sample/bills/get',
                        query: outputItems_pageListOutput.find(
                          (obj) =>
                            obj.movementHeaderId ==
                            addMovementRes.movementHeaderId,
                        ),
                      });
                    }}
                  >
                    Generar Factura
                  </Button>
                ) : null}
                {hasBill.includes('bill') &&
                localStorage
                  .getItem('pathsBack')
                  .includes(
                    '/facturacion/accounting/movement/register?path=/incomeOfOutput/*',
                  ) ? (
                  <Button
                    color='primary'
                    sx={{width: 1, px: 7, my: 2}}
                    variant='contained'
                    onClick={() => {
                      Router.push({
                        pathname: '/sample/finances/new-earning',
                        query: outputItems_pageListOutput.find(
                          (obj) =>
                            obj.movementHeaderId ==
                            addMovementRes.movementHeaderId,
                        ),
                      });
                    }}
                  >
                    Generar Ingreso
                  </Button>
                ) : null}
                <Button
                  color='primary'
                  sx={{width: 1, px: 7, my: 2}}
                  variant='outlined'
                  onClick={() => Router.push('/sample/outputs/table')}
                  // onClick={() => {
                  //   Router.push({
                  //     pathname: '/sample/outputs/table',
                  //     query: {
                  //       operationBack: true
                  //     },
                  //   });
                  // }}
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

export default NewOutput;
