import React, {useEffect, useRef} from 'react';
import {makeStyles} from '@mui/styles';
import AppPageMeta from '../../../@crema/core/AppPageMeta';
import {Form, Formik} from 'formik';
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
import {updateMovement, getMovements} from '../../../redux/actions/Movements';
import Router, {useRouter} from 'next/router';

import {DesktopDatePicker, DateTimePicker} from '@mui/lab';
/* import SelectedProducts from './SelectedProducts';
import AddProductForm from './AddProductForm'; */
import SelectedProducts from '../AddExisingProduct/SelectedProducts';
import AddExisingProduct from '../AddExisingProduct';

import AddProviderForm from '../ProviderSelection/AddProviderForm';
import {
  toEpoch,
  convertToDate,
  parseTo3Decimals,
  toSimpleDate,
} from '../../../Utils/utils';
import DocumentsTable from '../DocumentSelector/DocumentsTable';
import AddDocumentForm from '../DocumentSelector/AddDocumentForm';

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
let selectedProviderJSON = {};
let typeAlert = '';
let total = 0;

const UpdateInput = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const forceUpdate = useForceUpdate();
  const router = useRouter();
  const {query} = router;
  console.log('query', query);
  //APIS FUNCTIONS
  const toGetMovements = (payload) => {
    dispatch(getMovements(payload));
  };
  const getBusinessParameter = (payload) => {
    dispatch(onGetBusinessParameter(payload));
  };
  const getGlobalParameter = (payload) => {
    dispatch(onGetGlobalParameter(payload));
  };
  const getUpdateMovement = (payload) => {
    dispatch(updateMovement(payload));
  };

  //VARIABLES DE PARAMETROS
  let selectedInput = {};
  let money_unit;
  let weight_unit;
  let changeValueField;
  let objSelects = {};

  const [addIgv, setAddIgv] = React.useState(false);
  const [typeDialog, setTypeDialog] = React.useState('');
  const [openStatus, setOpenStatus] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [showInfo, setShowInfo] = React.useState(
    Number(query.totalCalculatedPrice) != Number(query.totalPriceWithoutIgv),
  );
  const [dateRegister, setDateRegister] = React.useState(Date.now());
  const [showDelete, setShowDelete] = React.useState(false);
  const [value, setValue] = React.useState(
    convertToDate(selectedInput.createdAt),
  );
  const [open, setOpen] = React.useState(false);
  const [moneyUnit, setMoneyUnit] = React.useState(query.exchangeRate);
  const [editTotal, setEditTotal] = React.useState(
    Number(query.totalCalculatedPrice) != Number(query.totalPriceWithoutIgv),
  );
  const [generateBill, setGenerateBill] = React.useState(false);
  const [status, setStatus] = React.useState(query.status);
  const [guide, setGuide] = React.useState(false);
  const [percentageIgv, setPercentageIgv] = React.useState(null);
  const [exchangeRate, setExchangeRate] = React.useState('');
  const prevExchangeRateRef = useRef();
  const [typeDocument, settypeDocument] = React.useState(query.movementSubType);

  useEffect(() => {
    listDocuments = [];
    toGetMovements(listPayload);
    getBusinessParameter(businessParameterPayload);
    getGlobalParameter(globalParameterPayload);
    setAddIgv(Number(query.igv) > 0 || query.igv == 'true');
    /* setEditTotal(
      ,
    ); */
    selectedProducts = selectedInput.descriptionProductsInfo;
    selectedProviderJSON = selectedInput.provider;
    selectedProvider['denominationProvider'] = query.providerName;
    selectedProvider['providerId'] = query.providerId;
    console.log('selectedProvider', selectedProvider);
    total = selectedInput.totalPriceWithoutIgv
      ? selectedInput.totalPriceWithoutIgv
      : selectedInput.totalPriceWithIgv;
    selectedProducts.map((obj) => {
      obj['priceProduct'] = obj['priceBusinessMoneyWithIgv'];
      obj['count'] = obj['quantityMovement'];
      obj['subtotal'] = obj['priceProduct'] * obj['count'];
    });
  }, []);

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
  const {businessParameter} = useSelector(({general}) => general);
  console.log('businessParameter', businessParameter);
  const {globalParameter} = useSelector(({general}) => general);
  console.log('globalParameter123', globalParameter);
  const {successMessage} = useSelector(({movements}) => movements);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({movements}) => movements);
  console.log('errorMessage', errorMessage);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);

  if (getMovementsRes != undefined) {
    selectedInput = getMovementsRes.find(
      (input) => input.movementHeaderId == query.movementHeaderId,
    );
    console.log('selectedInput', selectedInput);
    console.log('total', total);
  }

  //SETEANDO PARAMETROS
  if (businessParameter != undefined) {
    weight_unit = businessParameter.find(
      (obj) => obj.abreParametro == 'DEFAULT_WEIGHT_UNIT',
    ).value;
  }
  /* useEffect(() => {
    if (businessParameter != undefined) {
      let obtainedMoneyUnit = businessParameter.find(
        (obj) => obj.abreParametro == 'DEFAULT_MONEY_UNIT',
      ).value;
      setMoneyUnit(obtainedMoneyUnit);
      setMoneyToConvert(obtainedMoneyUnit);
      console.log('moneyUnit', moneyUnit);
    }
  }, [businessParameter != undefined]); */
  useEffect(() => {
    if (
      selectedInput &&
      Object.keys(selectedInput).length !== 0 &&
      Array.isArray(selectedInput.documentsMovement)
    ) {
      selectedInput.documentsMovement.map((obj) => {
        obj.document = obj.serialDocument;
        obj.dateDocument = obj.issueDate;
        listDocuments.push(obj);
      });
    }
  }, [
    selectedInput &&
      Object.keys(selectedInput).length !== 0 &&
      Array.isArray(selectedInput.documentsMovement),
  ]);
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
      changeValueField('totalField', Number(total));
      changeValueField(
        'equivalentTotal',
        parseTo3Decimals(total * exchangeRate).toFixed(3),
      );
      changeValueField('totalFieldIgv', (total * 1.18).toFixed(3));
    }
  }, [exchangeRate]);

  const defaultValues = {
    documentIntern: query.documentIntern,
    serie: '',
    totalField: selectedInput.totalPriceWithIgv,
    equivalentTotal: selectedInput.totalPriceWithIgv * exchangeRate,
    providerId: query.providerId,
    status: query.status,
    initialDate: toSimpleDate(selectedInput.createdAt),
    inputObservation: selectedInput.observation,
  };
  const actualValues = {
    documentIntern: '',
    serie: '',
    totalField: '',
    equivalentTotal: '',
    status: query.status,
    type: query.movementSubType,
    providerId: '',
    initialDate: '',
    money_unit: moneyToConvert,
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
  let listPayload = {
    request: {
      payload: {
        initialTime: null,
        finalTime: null,
        businessProductCode: null,
        movementType: 'INPUT',
        merchantId: userDataRes.merchantSelected.merchantId,
      },
    },
  };

  console.log('Valores default peso', weight_unit, 'moneda', moneyUnit);

  const handleField = (event) => {
    console.log('evento', event);
    objSelects[event.target.name] = event.target.value;
    console.log('ocjSelects', objSelects);
  };

  const cancel = () => {
    setShowDelete(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = (type) => {
    setOpen(true);
    setTypeDialog(type);
    setShowAlert(false);
  };

  const getNewProduct = (input) => {
    console.log('obteniendo nuevo producto para lista', input);
    if (selectedProducts && selectedProducts.length >= 1) {
      selectedProducts.map((obj, index) => {
        console.log('obj', obj);
        if (obj.product == input.product) {
          console.log('selectedProducts 1', selectedProducts);
          selectedProducts.splice(index, 1);
          console.log('selectedProducts 2', selectedProducts);
        }
      });
    }
    selectedProducts.push(input);
    let calculatedtotal = 0;
    selectedProducts.map((obj) => {
      calculatedtotal += obj.subtotal;
    });
    total = calculatedtotal;
    /* total += Number(input.subtotal); */
    console.log('total de las entradas', total);
    changeValueField('totalField', parseTo3Decimals(total).toFixed(3));
    changeValueField(
      'equivalentTotal',
      parseTo3Decimals(total * exchangeRate).toFixed(3),
    );
    changeValueField('totalFieldIgv', (total * 1.18).toFixed(3));
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
    /* total -= Number(selectedProducts[index].subtotal); */
    selectedProducts.splice(index, 1);
    console.log('cantidad de productos', selectedProducts.length);
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
    changeValueField('totalFieldIgv', (total * 1.18).toFixed(3));
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

  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    let finalPayload;
    let cleanDocuments = [];

    listDocuments.map((obj) => {
      obj.serialDocument = obj.document;
      obj.issueDate = obj.dateDocument;
      cleanDocuments.push(obj);
    });
    console.log('selectedProducts', selectedProducts);
    if (selectedProducts.length > 0) {
      if (selectedProvider.providerId) {
        finalPayload = {
          request: {
            payload: {
              header: {
                /* movementType: 'INPUT', */
                documentIntern: buildNewDoc(
                  selectedProvider.providerId.split('-')[1],
                  cleanDocuments.length !== 0
                    ? cleanDocuments[0].serialDocument
                    : null,
                ),
                clientId: null,
                providerId: selectedProvider.providerId,
                provider: typeDocument == 'buys' ? selectedProviderJSON : '',
                merchantId: userDataRes.merchantSelected.merchantId,
                /* quoteId: null,
                facturaId: null, */
                createdAt: parseInt(query.createdAt),
                issueDate: toSimpleDate(dateRegister),
                unitMeasureMoney: moneyToConvert,
                igv: addIgv,
                finalTotalPrice: Number(data.totalField),
                isGeneratedByTunexo: generateBill,
                status: status,
                movementSubType: typeDocument,
                documentsMovement: cleanDocuments,
                movementTypeMerchantId: query.movementTypeMerchantId,
                movementHeaderId: query.movementHeaderId,
                editTotal: editTotal,
                folderMovement: query.folderMovement,
                contableMovementId: query.contableMovementId,
                observation: data.inputObservation,
                userUpdated: userDataRes.userId,
                userUpdatedMetadata: {
                  nombreCompleto: userDataRes.nombreCompleto,
                  email: userDataRes.email,
                },
              },
              products: selectedProducts.map((obj) => {
                return {
                  businessProductCode:
                    obj.businessProductCode != null
                      ? obj.businessProductCode
                      : obj.product, //obj.businessProductCode,
                  quantity: Number(obj.count),
                  priceUnit: Number(obj.priceProduct),
                };
              }),
            },
          },
        };
        console.log('finalPayload', finalPayload);
        getUpdateMovement(finalPayload);
        console.log('Data formulario principal', finalPayload);
        selectedProducts = [];
        selectedProvider = {};
        total = 0;
        setTimeout(() => {
          setOpenStatus(true);
        }, 1000);
      } else {
        typeAlert = 'provider';
        setShowAlert(true);
      }
    } else {
      typeAlert = 'product';
      setShowAlert(true);
    }
    setSubmitting(false);
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
      changeValueField('totalFieldIgv', (event.target.value * 1.18).toFixed(3));
    }
    console.log('actualValues', actualValues);
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
            Se ha actualizado la información <br />
            correctamente
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
            Se ha producido un error al actualizar.
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink />;
    }
  };

  const sendStatus = () => {
    setOpenStatus(false);
    Router.push('/sample/inputs/table');
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

  const closeDelete = () => {
    setShowDelete(false);
  };

  const handleIGV = (event, isInputChecked) => {
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
          ACTUALIZACIÓN DE ENTRADA
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
          {({isSubmitting, setFieldValue}) => {
            changeValueField = setFieldValue;
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
                  {/* <Grid item xs={4}>
                    <AppTextField
                      label='Nro Documento'
                      name='documentIntern'
                      variant='outlined'
                      disabled
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                        mx: 0,
                      }}
                    />
                  </Grid> */}
                  <Grid item xs={4}>
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
                  <Grid item xs={4}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel id='status-label' style={{fontWeight: 200}}>
                        Estado
                      </InputLabel>
                      <Select
                        name='status'
                        labelId='status-label'
                        label='Estado'
                        defaultValue={query.status}
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
                  <Grid item xs={4}>
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

                  <Grid item xs={4}>
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
                    <Grid item xs={4}>
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
                      control={
                        <Checkbox
                          onChange={handleEdit}
                          defaultChecked={editTotal}
                        />
                      }
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
                        label='IGV'
                        control={
                          <Checkbox
                            onChange={handleIGV}
                            defaultChecked={
                              Number(query.igv) > 0 || query.igv == 'true'
                            }
                          />
                        }
                      />
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
                      typeForm={'updateInput'}
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
                  <Grid item xs={8}>
                    <Button
                      sx={{width: 1}}
                      variant='outlined'
                      disabled
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

                <Divider sx={{m: 2}} />

                <Grid container spacing={2} sx={{width: 500, margin: 'auto'}}>
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
                  <Button
                    sx={{mx: 'auto', width: '50%', py: 3}}
                    variant='outlined'
                    startIcon={<ArrowCircleLeftOutlinedIcon />}
                    onClick={cancel}
                  >
                    Cancelar
                  </Button>
                </ButtonGroup>
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
        <Dialog
          open={openStatus}
          onClose={sendStatus}
          sx={{textAlign: 'center'}}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
            {'Actualización Entrada'}
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
      </Box>

      <Dialog
        open={showDelete}
        onClose={closeDelete}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Actualización entrada'}
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
              selectedProducts = [];
              selectedProvider = {};
              typeAlert = '';
              total = 0;
              Router.push('/sample/inputs/table');
            }}
          >
            Sí
          </Button>
          <Button variant='outlined' onClick={closeDelete}>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default UpdateInput;
