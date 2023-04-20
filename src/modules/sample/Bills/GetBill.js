import React, {useEffect, useRef} from 'react';
import {makeStyles} from '@mui/styles';
import AppPageMeta from '../../../@crema/core/AppPageMeta';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import {
  Divider,
  Button,
  ButtonGroup,
  Select,
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
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';

import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloseIcon from '@mui/icons-material/Close';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import {red} from '@mui/material/colors';
import {orange} from '@mui/material/colors';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {getUserData} from '../../../redux/actions/User';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {
  onGetBusinessParameter,
  onGetGlobalParameter,
} from '../../../redux/actions/General';
import {addInvoice, getMovements} from '../../../redux/actions/Movements';
import Router, {useRouter} from 'next/router';
import OutputProducts from './OutputProducts';
import {DesktopDatePicker, DateTimePicker} from '@mui/lab';
import {
  isObjEmpty,
  specialFormatToSunat,
  fixDecimals,
  dateWithHyphen,
} from '../../../Utils/utils';
import AddProductForm from './AddProductForm';
import AddDocumentForm from '../DocumentSelector/AddDocumentForm';
import DocumentsTableForBill from '../DocumentSelector/DocumentsTableForBill';
import {
  FETCH_ERROR,
  FETCH_SUCCESS,
  ADD_INVOICE,
  GET_BUSINESS_PARAMETER,
  GET_MOVEMENTS,
  GET_USER_DATA,
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
  guide: yup.string().typeError(<IntlMessages id='validation.string' />),
  observation: yup.string().typeError(<IntlMessages id='validation.string' />),
  clientEmail: yup
    .string()
    .email(<IntlMessages id='validation.emailFormat' />)
    .required(<IntlMessages id='validation.required' />),
});

//FORCE UPDATE
const useForceUpdate = () => {
  const [reload, setReload] = React.useState(0); // integer state
  return () => setReload((value) => value + 1); // update the state to force render
};

const objectsAreEqual = (a, b) => {
  // Comprobar si los dos valores son objetos
  if (typeof a === 'object' && typeof b === 'object') {
    // Comprobar si los objetos tienen las mismas propiedades
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) {
      return false;
    }
    // Comparar el valor de cada propiedad de forma recursiva
    for (const key of aKeys) {
      if (!objectsAreEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  // Comparar los valores directamente
  return a === b;
};

let selectedProducts = [];
let selectedOutput;
let listDocuments = [];
let selectedClient = {};
let typeAlert = '';
let total = 0;

const NewOutput = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const forceUpdate = useForceUpdate();
  const router = useRouter();
  const {query} = router;
  console.log('query', query);

  //APIS FUNCTIONS
  const getBusinessParameter = (payload) => {
    dispatch(onGetBusinessParameter(payload));
  };
  const getGlobalParameter = (payload) => {
    dispatch(onGetGlobalParameter(payload));
  };
  const getAddInvoice = (payload) => {
    dispatch(addInvoice(payload));
  };
  const toGetMovements = (payload) => {
    dispatch(getMovements(payload));
  };

  //VARIABLES DE PARAMETROS
  let money_unit;
  let weight_unit;
  let changeValueField;
  let objSelects = {};

  /* const [exchangeRate, setExchangeRate] = React.useState(); */
  const [igvDefault, setIgvDefault] = React.useState(0);
  const [addIgv, setAddIgv] = React.useState(false);
  const [sendEmail, setSendEmail] = React.useState(true);
  const [typeDialog, setTypeDialog] = React.useState('');
  const [openStatus, setOpenStatus] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [moneyUnit, setMoneyUnit] = React.useState('');
  const [exchangeRate, setExchangeRate] = React.useState('');
  const prevExchangeRateRef = useRef();
  const [showForms, setShowForms] = React.useState(false);
  const [serial, setSerial] = React.useState('');
  const [paymentWay, setPaymentWay] = React.useState('credit');
  const [paymentMethod, setPaymentMethod] = React.useState('cash');
  const [expirationDate, setExpirationDate] = React.useState(Date.now() + 1 * 24 * 60 * 60 * 1000);
  const [minTutorial, setMinTutorial] = React.useState(false);
  const [earningGeneration, setEarningGeneration] = React.useState(true);
  useEffect(() => {
    prevExchangeRateRef.current = exchangeRate;
  });
  const prevExchangeRate = prevExchangeRateRef.current;

  const [moneyToConvert, setMoneyToConvert] = React.useState(
    query.exchangeRate,
  );
  const prevMoneyToConvertRef = useRef();
  useEffect(() => {
    prevMoneyToConvertRef.current = moneyToConvert;
  });
  const prevMoneyToConvert = prevMoneyToConvertRef.current;

  //RESULTADOS DE LLAMADAS A APIS
  const {getMovementsRes} = useSelector(({movements}) => movements);
  console.log('getMovementsRes', getMovementsRes);
  const {listProducts} = useSelector(({products}) => products);
  console.log('listProducts', listProducts);
  const {businessParameter} = useSelector(({general}) => general);
  console.log('businessParameter', businessParameter);
  const {globalParameter} = useSelector(({general}) => general);
  console.log('globalParameter123', globalParameter);
  const {addInvoiceRes} = useSelector(({movements}) => movements);
  console.log('addInvoiceRes', addInvoiceRes);
  const {successMessage} = useSelector(({movements}) => movements);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({movements}) => movements);
  console.log('errorMessage', errorMessage);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);

  useEffect(() => {
    selectedOutput = {loaded: false};
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: GET_BUSINESS_PARAMETER, payload: undefined});
    getBusinessParameter(businessParameterPayload);
    if (getMovementsRes !== undefined) {
      selectedOutput = getMovementsRes.find(
        (input) => input.movementHeaderId == query.movementHeaderId,
      );
      console.log('selectedOutput', selectedOutput);
      console.log(
        'selectedOutput.documentsMovement',
        selectedOutput.documentsMovement,
      );
      let filteredDocuments = selectedOutput.documentsMovement.filter(
        (obj) => obj.typeDocument === 'referralGuide',
      );
      listDocuments = filteredDocuments.map((obj) => {
        return {
          dateDocument: obj.issueDate,
          document: obj.serialDocument,
          typeDocument: obj.typeDocument,
          isSelected: true,
        };
      });
      console.log('listDocuments', listDocuments);
    }
    setTimeout(() => {
      setMinTutorial(true);
    }, 2000);
  }, []);

  //----------------------

  useEffect(() => {
    if (businessParameter) {
      let serieParameter = businessParameter.find(
        (obj) => obj.abreParametro == 'SERIES_BILL',
      );

      let igvDefault = businessParameter.find(
        (obj) => obj.abreParametro == 'IGV',
      ).value;
      setIgvDefault(igvDefault);
      console.log('serieParameter', serieParameter);
      console.log('serieParameter.metadata', serieParameter.metadata);
      setSerial(serieParameter.metadata ? serieParameter.metadata : '');
    }
  }, [businessParameter]);

  //------------------------

  useEffect(() => {
    /* setAddIgv(Number(query.igv) > 0 || query.igv == 'true'); */
    if (selectedOutput) {
      selectedProducts = isObjEmpty(query)
        ? []
        : selectedOutput.descriptionProductsInfo;
      total = selectedOutput.totalPriceWithoutIgv
        ? selectedOutput.totalPriceWithoutIgv
        : selectedOutput.totalPriceWithIgv;
      selectedClient = {clientId: query.clientId, clientName: query.clientName};
      selectedOutput.loaded = true;
    }
  }, [selectedOutput]);

  useEffect(() => {
    if (
      selectedOutput &&
      typeof selectedOutput === 'object' &&
      selectedOutput.loaded == true
    ) {
      changeValueField('receiver', `${query.clientId.split('-')[1]} - ${
        selectedOutput.client.denomination
      }`)
      changeValueField('clientEmail', selectedOutput.client.email)
      selectedProducts = selectedOutput.descriptionProductsInfo;
      selectedProducts.map((obj) => {
        obj['subtotal'] = Number(
          (obj.quantityMovement * obj.priceBusinessMoneyWithIgv).toFixed(3),
        );
      });
      console.log('selectedProducts', selectedProducts);
    }
  }, [selectedOutput]);

  //SETEANDO PARAMETROS
  useEffect(() => {
    if (businessParameter) {
      weight_unit = businessParameter.find(
        (obj) => obj.abreParametro == 'DEFAULT_WEIGHT_UNIT',
      ).value;
    }
  }, [businessParameter]);

  /* if (businessParameter != undefined) {
    weight_unit = businessParameter.find(
      (obj) => obj.abreParametro == 'DEFAULT_WEIGHT_UNIT',
    ).value;
  } */

  useEffect(() => {
    if (prevExchangeRate !== exchangeRate && Object.keys(query).length !== 0) {
      console.log('exchangerate cambiaso', exchangeRate);
      changeValueField('totalField', Number(total));
      console.log('Cambiando los totales');
      changeValueField(
        'totalFieldIgv',
        query.igv && fixDecimals(query.igv) > 0
          ? fixDecimals(total + fixDecimals(total * fixDecimals(query.igv)))
          : fixDecimals(total),
      );
    }
  }, [exchangeRate]);

  useEffect(() => {
    if (businessParameter != undefined) {
      let obtainedMoneyUnit = businessParameter.find(
        (obj) => obj.abreParametro == 'DEFAULT_MONEY_UNIT',
      ).value;
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

  const defaultValues = {
    nroBill: 'Autogenerado' /* query.documentIntern */,
    /* guide: '', */
    receiver: `${query.clientId.split('-')[1]} - ${
      query.clientName ||
      selectedOutput.clientName /* query.clientId.split('-')[2] */
    }`,
    issueDate: Date.now(),
    wayToPay: Date.now(),
    methodToPay: 'Efectivo',
    totalField: Number(query.totalPriceWithoutIgv),
    totalFieldIgv: fixDecimals(query.totalPriceWithIgv),
    money_unit: money_unit,
    clientEmail: query.clientEmail,
  };
  const actualValues = {
    nroBill: '',
    guide: '',
    issueDate: '',
    wayToPay: '',
    methodToPay: '',
    receiver: '',
    totalField: '',
    totalFieldIgv: '',
    money_unit: '',
  };
  let listPayload = {
    request: {
      payload: {
        initialTime: null,
        finalTime: null,
        businessProductCode: null,
        movementType: 'OUTPUT',
        merchantId: userDataRes.merchantSelected.merchantId,
      },
    },
  };
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
  console.log('Valores default peso', weight_unit, 'moneda', money_unit);

  const cancel = () => {
    Router.push('/sample/bills/table');
  };

  //CALENDARIO
  const [value, setValue] = React.useState(
    Date.now() /* Number(query.createdAt) */,
  );
  const [value2, setValue2] = React.useState(
    query.deletedAt ? query.deletedAt : Date.now(),
  );

  //FUNCIONES DIALOG
  const [open, setOpen] = React.useState(false);
  const [openReferralGuides, setOpenReferralGuides] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseReferralGuides = () => {
    setOpenReferralGuides(false);
  };
  const handleClickOpen = (type) => {
    setOpen(true);
    setTypeDialog(type);
    setShowAlert(false);
  };

  const handleClickOpenReferralGuides = (type) => {
    setOpenReferralGuides(true);
    setShowAlert(false);
  };

  const valueWithIGV = (value) => {
    const IGV = igvDefault;
    const precioConIGV =( value * (1 + IGV)).toFixed(10);
    return precioConIGV;
  }

  const showListDocumentsSelected = () => {
    const total = listDocuments.reduce((count, element) => {
      if (element.isSelected) {
        return count + 1;
      } else {
        return count;
      }
    }, 0);
    return total > 1
      ? `Hay ${total} guías de remisión asignadas`
      : total > 0
      ? `Hay ${total} guía de remisión asignada`
      : `No hay guías de remisión asignadas`;
  };

  const removeProduct = (index) => {
    /* total -= Number(selectedProducts[index].subtotal); */
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
    changeValueField('totalField', Number(total.toFixed(3)));
    changeValueField(
      'totalFieldIgv',
      query.igv && Number(query.igv) > 0
        ? Number((total + total * Number(query.igv)).toFixed(3))
        : total,
    );
    forceUpdate();
  };

  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: ADD_INVOICE, payload: undefined});
    console.log('listDocuments', listDocuments);
    let parsedDocuments = listDocuments
      .filter((obj) => obj.isSelected)
      .map((obj) => ({
        issueDate: obj.dateDocument,
        serialDocument: obj.document,
      }));
    console.log('parsedDocuments', parsedDocuments);
    let finalPayload;
    try {
      finalPayload = {
        request: {
          payload: {
            merchantId: userDataRes.merchantSelected.merchantId,
            denominationMerchant:
              userDataRes.merchantSelected.denominationMerchant,
            typePDF: userDataRes.merchantSelected.typeMerchant,
            folderMovement: query.folderMovement,
            movementTypeMerchantId: query.movementTypeMerchantId,
            contableMovementId: query.contableMovementId || '',
            movementHeaderId: query.movementHeaderId,
            createdAt: Number(query.createdAt),
            clientId: query.clientId,
            totalPriceWithIgv: Number(data.totalFieldIgv.toFixed(3)), //
            issueDate: specialFormatToSunat(),
            serial: serial,
            documentIntern: query.documentIntern,
            clientEmail: data.clientEmail,
            /* numberBill: 3, */
            automaticSendSunat: /* sendSunat */ true,
            automaticSendClient: /* sendClient */ true,
            referralGuide: data.guide ? true : false,
            creditSale: paymentWay == "credit",
            methodToPay: methodToPay,
            earningGeneration: earningGeneration,
            referralGuideSerial: data.guide ? data.guide : '',
            dueDate: dateWithHyphen(expirationDate),
            observation: data.observation ? data.observation : '',
            igv: Number(query.igv),
            productsInfo: selectedProducts.map((obj) => {
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
            referralGuides: parsedDocuments,
            sendEmail: sendEmail
          },
        },
      };
      console.log('getAddInvoice payload', finalPayload);
      getAddInvoice(finalPayload);
      setOpenStatus(true);
    } catch (error) {
      console.log('Este es el error al generar el payload', error);
      throw new Error('Algo pasa al crear el payload facturar');
    }
    console.log('finalPayload', finalPayload);
    setSubmitting(false);
  };

  const handleActualData = (event) => {
    console.log('evento onchange', event);
    Object.keys(actualValues).map((key) => {
      if (key == event.target.name) {
        actualValues[key] = event.target.value;
      }
    });
    console.log('actualValues', actualValues);
  };
  const handleMoney = (event) => {
    console.log('evento onchange', event);
    setMoneyToConvert(event.target.value);
    Object.keys(actualValues).map((key) => {
      if (key == event.target.name) {
        actualValues[key] = event.target.value;
      }
    });
    console.log('actualValues', actualValues);
  };

  const registerSuccess = () => {
    return (
      successMessage != undefined &&
      addInvoiceRes != undefined &&
      (!('error' in addInvoiceRes) || objectsAreEqual(addInvoiceRes.error, {}))
    );
  };
  const registerError = () => {
    return (
      (successMessage != undefined &&
        addInvoiceRes &&
        'error' in addInvoiceRes &&
        !objectsAreEqual(addInvoiceRes.error, {})) ||
      errorMessage != undefined
    );
  };

  const showMessage = () => {
    if (registerSuccess()) {
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
    } else if (registerError()) {
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
              {addInvoiceRes !== undefined && 'error' in addInvoiceRes
                ? addInvoiceRes.error
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
    if (registerSuccess()) {
      setShowForms(true);
      dispatch({type: GET_MOVEMENTS, payload: []});
      toGetMovements(listPayload);
      setOpenStatus(false);
    } else if (registerError()) {
      setOpenStatus(false);
    } else {
      setOpenStatus(false);
    }
  };

  const handleIGV = (event, isInputChecked) => {
    /* setAddIgv(isInputChecked); */
    console.log('Evento de IGV cbx', isInputChecked);
  };
  const handleSendEmail = (event, isInputChecked) => {
    setSendEmail(isInputChecked);
    console.log('Evento de IGV cbx', isInputChecked);
  };
  const handleEarningGeneration = (event, isInputChecked) => {
    setEarningGeneration(isInputChecked);
    console.log('Evento de earningGeneration', isInputChecked);
  };

  const getNewProduct = (product) => {
    console.log('ver ahora nuevo producto', product);
    product.subtotal = Number(product.subtotal);
    console.log('ver ahora selectedProducts', selectedProducts);
    if (selectedProducts && selectedProducts.length >= 1) {
      selectedProducts.map((obj, index) => {
        console.log('obj', obj);
        if (
          obj.product == product.product &&
          obj.description == product.description &&
          obj.customCodeProduct == product.customCodeProduct
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
    console.log('total de las salidas', total);
    changeValueField('totalField', Number(total.toFixed(3)));
    console.log('query', query);
    changeValueField(
      'totalFieldIgv',
      query.igv && Number(query.igv) > 0
        ? Number((total + total * Number(query.igv)).toFixed(3))
        : total,
    );
    console.log('total de los productos', total);
    forceUpdate();
  };

  const closeDelete = () => {
    setShowDelete(false);
  };

  const getDocument = (document) => {
    console.log('Documento seleccionado', document);
    document.dateDocument = document.dateDocument.replaceAll('/', '-');
    listDocuments.push(document);
    forceUpdate();
  };
  const removeDocument = (index) => {
    listDocuments.splice(index, 1);
    forceUpdate();
  };
  const selectDocument = (index) => {
    console.log('index document', index);
    console.log('index document listDocument', listDocuments);
    listDocuments[index].isSelected = !listDocuments[index].isSelected;
    forceUpdate();
  };
  const selectAll = () => {
    listDocuments = listDocuments.map((obj) => {
      return {...obj, isSelected: true};
    });
    forceUpdate();
  };
  const deselectAll = () => {
    listDocuments = listDocuments.map((obj) => {
      return {...obj, isSelected: false};
    });
    forceUpdate();
  };

  return (
    <Card sx={{p: 4}}>
      <Box sx={{width: 1, textAlign: 'center'}}>
        <Typography
          sx={{mx: 'auto', my: '10px', fontWeight: 600, fontSize: 25}}
        >
          GENERAR FACTURA
        </Typography>
      </Box>
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
          validateOnChange={false}
          validationSchema={validationSchema}
          initialValues={{...defaultValues}}
          onSubmit={handleData}
        >
          {({isSubmitting, setFieldValue}) => {
            changeValueField = setFieldValue;
            return (
              <Form
                style={{textAlign: 'left'}}
                noValidate
                autoComplete='on'
                /* onChange={handleActualData} */
              >
                <Grid container spacing={2} sx={{maxWidth: 500, mx: 'auto', mb: 4, px: 2}}>
                  <Grid item xs={6} sm={6}>
                    <AppTextField
                      label='Nro Factura'
                      name='nroBill'
                      disabled
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                        mx: 0,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel id='moneda-label' style={{fontWeight: 200}}>
                        Moneda
                      </InputLabel>
                      <Select
                        defaultValue={moneyToConvert}
                        name='money_unit'
                        labelId='moneda-label'
                        label='Moneda'
                        onChange={handleMoney}
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

                  <Grid item xs={6} sm={6}>
                    <DateTimePicker
                      renderInput={(params) => (
                        <TextField
                          className={classes.fixPosition}
                          {...params}
                        />
                      )}
                      required
                      value={value}
                      label='Fecha de emisión'
                      inputFormat='dd/MM/yyyy hh:mm a'
                      name='issueDate'
                      minDate={new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)} // establece la fecha mínima en dos días a partir de la actual
                      maxDate={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)}
                      onChange={(newValue) => {
                        setValue(newValue);
                        console.log('date', newValue);
                      }}
                    />
                  </Grid>

                  <Grid item xs={6} sm={6}>
                    <DateTimePicker
                      renderInput={(params) => (
                        <TextField
                          className={classes.fixPosition}
                          {...params}
                        />
                      )}
                      required
                      value={expirationDate}
                      label='Fecha de vencimiento'
                      inputFormat='dd/MM/yyyy hh:mm a'
                      minDate={new Date(value + 1 * 24 * 60 * 60 * 1000)}
                      name='issueDate'
                      onChange={(newValue) => {
                        setExpirationDate(newValue);
                        console.log('date', newValue);
                      }}
                    />
                  </Grid>

                  <Grid item xs={6} sm={4} sx={{mt: 3}}>
                    <AppTextField
                      label={`Total ${moneyUnit} sin IGV`}
                      name='totalField'
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
                  <Grid item xs={6} sm={4} sx={{mt: 3}}>
                    <AppTextField
                      label={`Total ${moneyUnit} con IGV`}
                      name='totalFieldIgv'
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

                  <Grid
                    item
                    xs={4}
                    sx={{display: 'flex', alignItems: 'center'}}
                  >
                    <FormControlLabel
                      label='IGV'
                      disabled
                      control={
                        <Checkbox
                          onChange={handleIGV}
                          defaultChecked={
                            Number(query.igv) > 0 || query.igv == 'true'
                          }
                        />
                      }
                    />
                    {igvDefault}
                  </Grid>
                  {/* <Grid item xs={4}>
                    <AppTextField
                      label={`T.C. - ${exchangeRate}`}
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
                  <Grid item xs={12}>
                    <AppTextField
                      label='Receptor'
                      name='receiver'
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

                  {/* <Grid item xs={4}>
                    <AppTextField
                      label='Guía de remisión'
                      name='guide'
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
                  <Grid item xs={6}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel id='wayToPay-label' style={{fontWeight: 200}}>
                        Forma de pago
                      </InputLabel>
                      <Select
                        value={paymentWay}
                        name='wayToPay'
                        labelId='wayToPay-label'
                        label='Forma de pago'
                        onChange={
                          /* handleActualData */ (event) => {
                            setPaymentWay(event.target.value);
                          }
                        }
                      >
                        <MenuItem value='credit' style={{fontWeight: 200}}>
                          Credito
                        </MenuItem>
                        <MenuItem value='debit' style={{fontWeight: 200}}>
                          Al contado
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel id='methodToPay-label' style={{fontWeight: 200}}>
                        Medio de pago
                      </InputLabel>
                      <Select
                        value={paymentMethod}
                        name='methodToPay'
                        labelId='methodToPay-label'
                        label='Medio de pago'
                        onChange={
                          /* handleActualData */ (event) => {
                            setPaymentMethod(event.target.value);
                          }
                        }
                      >
                        <MenuItem value='cash' style={{fontWeight: 200}}>
                          Efectivo
                        </MenuItem>
                        <MenuItem value='yape' style={{fontWeight: 200}}>
                          Yape
                        </MenuItem>
                        <MenuItem value='plin' style={{fontWeight: 200}}>
                          Plin
                        </MenuItem>
                        <MenuItem value='bankTransfer' style={{fontWeight: 200}}>
                          Transferencia Bancaria
                        </MenuItem>
                        <MenuItem value='card' style={{fontWeight: 200}}>
                          Tarjeta de crédito/débito
                        </MenuItem>
                        <MenuItem value='bankDeposit' style={{fontWeight: 200}}>
                          <IntlMessages id='common.bankDeposit' />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl disabled fullWidth sx={{my: 2}}>
                      <InputLabel id='quota-label' style={{fontWeight: 200}}>
                        Nro de cuotas
                      </InputLabel>
                      <Select
                        defaultValue='1'
                        name='quota'
                        labelId='quota-label'
                        label='Moneda'
                        onChange={handleActualData}
                      >
                        {Array(12)
                          .fill(0)
                          .map((val, index) => {
                            index++;
                            return (
                              <MenuItem
                                key={index}
                                value={index}
                                style={{fontWeight: 200}}
                              >
                                {index}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sx={{display: 'flex', alignItems: 'center'}}
                  >
                    <FormControlLabel
                      label='Generar Ingreso contable'
                      control={
                        <Checkbox
                          onChange={handleEarningGeneration}
                          defaultChecked={true}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography align='center'>
                      {showListDocumentsSelected()} de un total de{' '}
                      {listDocuments.length}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      sx={{width: 1}}
                      variant='outlined'
                      onClick={() =>
                        handleClickOpenReferralGuides('referralGuides')
                      }
                    >
                      Ver guías de remisión asignadas
                    </Button>
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{width: 500, margin: 'auto'}}>
                  {/* <Grid item xs={4}>
                    <DateTimePicker
                      renderInput={(params) => (
                        <TextField
                          className={classes.fixPosition}
                          {...params}
                        />
                      )}
                      required
                      label='Fecha de vencimiento'
                      inputFormat='dd/MM/yyyy hh:mm a'
                      name='dueDate'
                      value={value2}
                      onChange={(newValue) => {
                        setValue2(newValue);
                        console.log('date', newValue);
                      }}
                    />
                  </Grid> */}
                  <Grid item xs={6} sm={8} sx={{mt: 2}}>
                    <AppTextField
                      label='Correo de cliente'
                      name='clientEmail'
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
                  <Grid
                    item
                    xs={3}
                    sx={{display: 'flex', alignItems: 'center', px: 1, mt: 2}}
                  >
                    <FormControlLabel
                      label='Enviar Correo'
                      control={
                        <Checkbox
                          onChange={handleSendEmail}
                          defaultChecked={true}
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={8} sm={12} sx={{mt: 2}}>
                    <AppTextField
                      label='Observación'
                      name='observation'
                      variant='outlined'
                      multiline
                      rows={4}
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                      }}
                    />
                  </Grid>
                  <Grid item xs={8} sm={12} sx={{mt: 2}}>
                    <Button
                      sx={{width: 1}}
                      variant='outlined'
                      onClick={handleClickOpen.bind(this, 'product')}
                    >
                      Añade productos
                    </Button>
                  </Grid>
                </Grid>

                <Divider sx={{my: 3}} />
                <OutputProducts
                  data={selectedProducts}
                  valueWithIGV={valueWithIGV}
                  toDelete={removeProduct}
                ></OutputProducts>
                <Divider sx={{my: 3}} />

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
                          window.open('https://youtu.be/iYy11yw1Zr4')
                        }
                      >
                        <YouTubeIcon fontSize='inherit' />
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
                        onClick={() =>
                          window.open('https://youtu.be/iYy11yw1Zr4')
                        }
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
          open={openStatus}
          onClose={sendStatus}
          sx={{textAlign: 'center'}}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
            {'Registro de Factura'}
          </DialogTitle>
          {showMessage()}
        </Dialog>
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
          {typeAlert == 'client' ? 'Por favor selecciona un cliente.' : null}
        </Alert>
      </Collapse>
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
              <AddProductForm type='input' sendData={getNewProduct} />
            </DialogContent>
          </>
        ) : null}
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
              <AddDocumentForm
                sendData={getDocument}
                acceptedType={['referralGuide']}
              />
            </DialogContent>
          </>
        ) : null}
      </Dialog>
      <Dialog
        open={openReferralGuides}
        onClose={handleCloseReferralGuides}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Guías de remisión'}
          <CancelOutlinedIcon
            onClick={setOpenReferralGuides.bind(this, false)}
            className={classes.closeButton}
          />
        </DialogTitle>
        <DialogContent>
          <Box sx={{my: 5}}>
            <Grid container spacing={2} sx={{width: 500, margin: 'auto'}}>
              <Grid item xs={12}>
                <Button
                  sx={{width: 1}}
                  variant='outlined'
                  onClick={() => handleClickOpen('document')}
                >
                  Añadir guía de remisión
                </Button>
              </Grid>
            </Grid>
            <Button onClick={selectAll}>Seleccionar todo</Button>
            <Button onClick={deselectAll}>Deseleccionar todo</Button>
            <DocumentsTableForBill
              arrayObjs={listDocuments}
              toDelete={removeDocument}
              toSelect={selectDocument}
            />
          </Box>
        </DialogContent>
      </Dialog>
      <Dialog
        open={showDelete}
        onClose={closeDelete}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Generar factura'}
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
              setShowDelete(false);
              Router.push('/sample/outputs/table');
            }}
          >
            Sí
          </Button>
          <Button variant='outlined' onClick={closeDelete}>
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
            {getMovementsRes.length !== 0 ? (
              <>
                <Button
                  color='primary'
                  sx={{width: 1, px: 7, my: 2}}
                  variant='contained'
                  onClick={() => {
                    Router.push({
                      pathname: '/sample/finances/new-earning',
                      query: getMovementsRes.find(
                        (obj) =>
                          obj.movementHeaderId ==
                          selectedOutput.movementHeaderId,
                      ),
                    });
                  }}
                >
                  Generar Ingreso
                </Button>
                <Button
                  color='primary'
                  sx={{width: 1, px: 7, my: 2}}
                  variant='outlined'
                  onClick={() => Router.push('/sample/outputs/table')}
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
