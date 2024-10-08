import React, {useEffect, useRef} from 'react';
import {makeStyles} from '@mui/styles';
import AppPageMeta from '../../../@crema/core/AppPageMeta';
import {Form, Formik, isInputEvent} from 'formik';
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
  ToggleButtonGroup,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  CustomizerItemWrapper,
  StyledToggleButton,
} from '../../../@crema/core/AppThemeSetting/index.style';
import clsx from 'clsx';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AddClientForm from '../ClientSelection/AddClientForm';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import SchoolIcon from '@mui/icons-material/School';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloseIcon from '@mui/icons-material/Close';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import {red} from '@mui/material/colors';
import {orange} from '@mui/material/colors';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {
  onGetBusinessParameter,
  onGetGlobalParameter,
} from '../../../redux/actions/General';
import {
  addReceipt,
  getMovements,
  getOutputItems_pageListOutput,
} from '../../../redux/actions/Movements';
import {newSale} from '../../../redux/actions/Sales';
import Router, {useRouter} from 'next/router';
import ProductsList from './ProductsList';
import {DesktopDatePicker, DateTimePicker} from '@mui/lab';
import {
  isObjEmpty,
  specialFormatToSunat,
  fixDecimals,
} from '../../../Utils/utils';
import AddProductForm from './AddProductForm';
import AddDocumentForm from '../DocumentSelector/AddDocumentForm';
import {
  FETCH_ERROR,
  FETCH_SUCCESS,
  NEW_SALE,
  GET_BUSINESS_PARAMETER,
  LIST_SALES,
} from '../../../shared/constants/ActionTypes';

import {ClickAwayListener} from '@mui/base';
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
});

//FORCE UPDATE
const useForceUpdate = () => {
  const [reload, setReload] = React.useState(0); // integer state
  return () => setReload((value) => value + 1); // update the state to force render
};

//let selectedProducts = [];
let listDocuments = [];
let typeAlert = '';
let total = 0;

const NewSale = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const forceUpdate = useForceUpdate();
  const router = useRouter();
  const {query} = router;
  console.log('query', query);

  const theme = useTheme();
  const isNotMobile = useMediaQuery(theme.breakpoints.up('lg'));
  //APIS FUNCTIONS
  const getAddSale = (payload, jwtToken) => {
    dispatch(newSale(payload, jwtToken));
  };
  const toGetMovements = (payload) => {
    dispatch(getOutputItems_pageListOutput(payload));
  };

  //VARIABLES DE PARAMETROS
  let money_unit;
  let weight_unit;
  let changeValueField;
  let getValueField;
  let isFormikSubmitting;
  let setFormikSubmitting;
  const [proofOfPaymentType, setProofOfPaymentType] = React.useState('ticket');
  const [igvDefault, setIgvDefault] = React.useState(0);
  const [sendEmail, setSendEmail] = React.useState(true);
  const [sendWsp, setSendWsp] = React.useState(true);
  const [wspNumber, setWspNumber] = React.useState('');
  const [isIgvChecked, setIsIgvChecked] = React.useState(false);
  const [typeDialog, setTypeDialog] = React.useState('');
  const [openStatus, setOpenStatus] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [selectedProducts, setSelectedProducts] = React.useState([]);
  const [moneyUnit, setMoneyUnit] = React.useState('');
  const [editTotal, setEditTotal] = React.useState(false);
  const [exchangeRate, setExchangeRate] = React.useState('');
  const prevExchangeRateRef = useRef();
  const [serial, setSerial] = React.useState('');
  const [registerType, setRegisterType] = React.useState('onlySale');
  const [minTutorial, setMinTutorial] = React.useState(false);
  const [reload, setReload] = React.useState(0); // integer state
  const [earningGeneration, setEarningGeneration] = React.useState(
    query.earningGeneration ? true : false,
  );
  const [proofOfPaymentGeneration, setProofOfPaymentGeneration] =
    React.useState(query.proofOfPaymentGeneration ? true : false);
  const [paymentWay, setPaymentWay] = React.useState('credit');
  const [selectedClient, setSelectedClient] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState('cash');

  const [openClientComprobation, setOpenClientComprobation] =
    React.useState(false);
  const [isClientValidated, setIsClientValidated] = React.useState(false);

  //CALENDARIO
  const [value, setValue] = React.useState(Date.now());
  const [value2, setValue2] = React.useState(
    query.deletedAt ? query.deletedAt : Date.now(),
  );

  //FUNCIONES DIALOG
  const [open, setOpen] = React.useState(false);
  const [moneyToConvert, setMoneyToConvert] = React.useState('');

  //RESULTADOS DE LLAMADAS A APIS

  const {listProducts} = useSelector(({products}) => products);
  console.log('listProducts', listProducts);
  const {businessParameter} = useSelector(({general}) => general);
  console.log('businessParameter', businessParameter);
  const {globalParameter} = useSelector(({general}) => general);
  console.log('globalParameter123', globalParameter);
  const {addReceiptRes} = useSelector(({movements}) => movements);
  console.log('addReceiptRes', addReceiptRes);
  const {successMessage} = useSelector(({movements}) => movements);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({movements}) => movements);
  console.log('errorMessage', errorMessage);
  const {userDataRes} = useSelector(({user}) => user);
  const {newSaleRes} = useSelector(({sale}) => sale);
  const {jwtToken} = useSelector(({general}) => general);

  let defaultValues = {
    nroReceipt: 'Autogenerado' /* query.documentIntern */,
    /* guide: '', */
    receiver: '',
    issueDate: Date.now(),
    wayToPay: Date.now(),
    methodToPay: 'Efectivo',
    totalField: 0,
    totalFieldIgv: 0,
    money_unit: money_unit,
    clientEmail: '',
    transactionNumber: '',
  };
  const actualValues = {
    nroReceipt: '',
    guide: '',
    issueDate: '',
    wayToPay: '',
    methodToPay: '',
    receiver: '',
    totalField: '',
    totalFieldIgv: '',
    money_unit: '',
  };
  useEffect(() => {
    prevExchangeRateRef.current = exchangeRate;
  });
  const prevExchangeRate = prevExchangeRateRef.current;

  const prevMoneyToConvertRef = useRef();

  useEffect(() => {
    prevMoneyToConvertRef.current = moneyToConvert;
  });
  const prevMoneyToConvert = prevMoneyToConvertRef.current;

  useEffect(() => {
    if (userDataRes) {
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});

      if (
        userDataRes.merchantSelected.typeClient == 'PN' ||
        userDataRes.merchantSelected.paymentWay == 'debit'
      ) {
        setPaymentWay('debit');
      }
      setTimeout(() => {
        setMinTutorial(true);
      }, 2000);
    }
  }, [userDataRes]);

  useEffect(() => {
    if (businessParameter != undefined) {
      let serieParameter = businessParameter.find(
        (obj) => obj.abreParametro == 'SERIES_RECEIPT',
      );
      console.log('serieParameter', serieParameter);
      console.log('serieParameter.metadata', serieParameter.metadata);
      setSerial(serieParameter.metadata ? serieParameter.metadata : '');
    }
  }, [businessParameter]);

  useEffect(() => {
    console.log('selectedProducts change', selectedProducts);
  }, [selectedProducts]);

  useEffect(() => {
    if (businessParameter) {
      let obtainedMoneyUnit = businessParameter.find(
        (obj) => obj.abreParametro == 'DEFAULT_MONEY_UNIT',
      ).value;
      let igvDefault = businessParameter.find(
        (obj) => obj.abreParametro == 'IGV',
      ).value;
      setIgvDefault(igvDefault);
      setIsIgvChecked(Number(igvDefault) > 0 ? true : false);
      setMoneyUnit(obtainedMoneyUnit);
      setMoneyToConvert(obtainedMoneyUnit);
      reloadPage();
      console.log('moneyUnit', moneyUnit);
    }
  }, [businessParameter]);
  useEffect(() => {
    if (newSaleRes && newSaleRes.enlace_del_pdf) {
      //setIsLoading(false);
      window.open(`${newSaleRes.enlace_del_pdf}`);
    }
  }, [newSaleRes]);
  useEffect(() => {
    if (globalParameter != undefined && moneyUnit) {
      let obtainedExchangeRate = globalParameter.find(
        (obj) =>
          obj.abreParametro == `ExchangeRate_${moneyToConvert}_${moneyUnit}`,
      ).value;
      setExchangeRate(obtainedExchangeRate);
      console.log('exchangeRate', exchangeRate);
    }
  }, [globalParameter && moneyUnit]);
  useEffect(() => {
    if (globalParameter && moneyUnit && prevMoneyToConvert !== moneyToConvert) {
      let obtainedExchangeRate = globalParameter.find(
        (obj) =>
          obj.abreParametro == `ExchangeRate_${moneyToConvert}_${moneyUnit}`,
      ).value;
      setExchangeRate(obtainedExchangeRate);
      console.log('exchangeRate', exchangeRate);
    }
  }, [globalParameter && moneyUnit, moneyToConvert]);

  //SETEANDO PARAMETROS
  if (businessParameter != undefined) {
    weight_unit = businessParameter.find(
      (obj) => obj.abreParametro == 'DEFAULT_WEIGHT_UNIT',
    ).value;
  }

  console.log('Valores default peso', weight_unit, 'moneda', money_unit);

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

  const handleIGV = (event, isInputChecked) => {
    if (isInputChecked) {
      let totalWithIgv = 0;
      if (selectedProducts.length == 0) {
        total = 0;
      } else {
        let calculatedtotal = 0;
        selectedProducts = selectedProducts.map((obj) => {
          obj.taxCode = 1000;
          calculatedtotal += obj.subtotal;
          totalWithIgv +=
            obj.taxCode == 1000 && Number(igvDefault) > 0 && isInputChecked
              ? Number((obj.subtotal * (1 + igvDefault)).toFixed(2))
              : obj.subtotal;
          return obj;
        });
        setSelectedProducts(newSelectedProducts);
        total = calculatedtotal;
      }
      changeValueField('totalField', Number(total.toFixed(2)));
      changeValueField('totalFieldIgv', Number(totalWithIgv.toFixed(2)));
      forceUpdate();
    } else {
      let totalWithIgv = 0;
      if (selectedProducts.length == 0) {
        total = 0;
      } else {
        let calculatedtotal = 0;
        selectedProducts = selectedProducts.map((obj) => {
          obj.taxCode = 9998;
          calculatedtotal += obj.subtotal;
          totalWithIgv +=
            obj.taxCode == 1000 && Number(igvDefault) > 0 && isInputChecked
              ? Number((obj.subtotal * (1 + igvDefault)).toFixed(2))
              : obj.subtotal;
          return obj;
        });
        setSelectedProducts(newSelectedProducts);
        total = calculatedtotal;
      }
      changeValueField('totalField', Number(total.toFixed(2)));
      changeValueField('totalFieldIgv', Number(totalWithIgv.toFixed(2)));
      forceUpdate();
    }
    setIsIgvChecked(isInputChecked);
    console.log('Evento de IGV cbx', isInputChecked);
  };

  const handleSendEmail = (event, isInputChecked) => {
    setSendEmail(isInputChecked);
    console.log('Evento de IGV cbx', isInputChecked);
  };
  const handleSendWsp = (event, isInputChecked) => {
    setSendWsp(isInputChecked);
    console.log('Activar Mensaje de Wsp', isInputChecked);
  };
  const handleEarningGeneration = (event, isInputChecked) => {
    setEarningGeneration(isInputChecked);
    console.log('Evento de earningGeneration', isInputChecked);
  };
  const handleProofOfPaymentGeneration = (event, isInputChecked) => {
    setProofOfPaymentGeneration(isInputChecked);
    console.log('Evento de proofOfPaymentGeneration', isInputChecked);
  };
  const valueWithIGV = (value) => {
    const IGV = igvDefault;
    const precioConIGV = (value * (1 + IGV)).toFixed(10);
    return precioConIGV;
  };
  const removeProduct = (index) => {
    let newSelectedProducts = selectedProducts;
    newSelectedProducts.splice(index, 1);
    let totalWithIgv = 0;
    if (newSelectedProducts.length == 0) {
      total = 0;
    } else {
      let calculatedtotal = 0;
      newSelectedProducts.forEach((obj) => {
        calculatedtotal += obj.subtotal;
        totalWithIgv +=
          obj.taxCode == 1000 && Number(igvDefault) > 0 && isIgvChecked
            ? Number((obj.subtotal * (1 + igvDefault)).toFixed(2))
            : obj.subtotal;
      });
      total = calculatedtotal;
    }
    setSelectedProducts(newSelectedProducts);

    changeValueField('totalField', Number(total.toFixed(2)));
    changeValueField('totalFieldIgv', Number(totalWithIgv.toFixed(2)));
    forceUpdate();
  };
  const changeTaxCode = (index, taxCode) => {
    console.log('selectedProducts wtf', selectedProducts);
    console.log('selectedProducts index', index);

    console.log('selectedProducts product', selectedProducts[index]);
    console.log('selectedProducts taxCode', taxCode);
    const subTotalWithPreviousTaxCode =
      selectedProducts[index].taxCode == 1000 &&
      Number(igvDefault) > 0 &&
      isIgvChecked
        ? Number(
            (selectedProducts[index].subtotal * (1 + igvDefault)).toFixed(2),
          )
        : Number(selectedProducts[index].subtotal);
    const subTotalWithNextTaxCode =
      taxCode == 1000 && Number(igvDefault) > 0 && isIgvChecked
        ? Number(
            (selectedProducts[index].subtotal * (1 + igvDefault)).toFixed(2),
          )
        : Number(selectedProducts[index].subtotal);
    let calculatedtotalIgv =
      getValueField('totalFieldIgv').value -
      subTotalWithPreviousTaxCode +
      subTotalWithNextTaxCode;

    let actualProduct = {
      ...selectedProducts[index],
      taxCode: taxCode,
    };
    console.log('selectedProducts product 2', actualProduct);
    const newSelectedProducts = selectedProducts.map((obj, i) => {
      if (i == index) {
        return actualProduct;
      } else {
        return obj;
      }
    });
    setSelectedProducts(newSelectedProducts);

    changeValueField('totalFieldIgv', Number(calculatedtotalIgv.toFixed(2)));
    forceUpdate();
  };
  const changeUnitMeasure = (index, unitMeasure) => {
    console.log('selectedProducts product', selectedProducts[index]);
    console.log('selectedProducts unitMeasure', unitMeasure);
    let newSelectedProducts = selectedProducts;
    newSelectedProducts[index].unitMeasure = unitMeasure;
    setSelectedProducts(newSelectedProducts);

    forceUpdate();
  };
  const changeQuantity = (index, quantity) => {
    console.log('selectedProducts product', selectedProducts[index]);
    console.log('selectedProducts quantity', quantity);
    const subTotalWithPreviousQuantity =
      selectedProducts[index].taxCode == 1000 &&
      Number(igvDefault) > 0 &&
      isIgvChecked
        ? Number(
            (selectedProducts[index].subtotal * (1 + igvDefault)).toFixed(2),
          )
        : Number(selectedProducts[index].subtotal);
    const subTotalWithNextQuantity =
      selectedProducts[index].taxCode == 1000 &&
      Number(igvDefault) > 0 &&
      isIgvChecked
        ? Number(
            (
              quantity *
              selectedProducts[index].unitPrice *
              (1 + igvDefault)
            ).toFixed(2),
          )
        : Number(quantity * selectedProducts[index].unitPrice);

    let calculatedTotal =
      getValueField('totalField').value +
      (quantity - selectedProducts[index].quantityMovement) *
        selectedProducts[index].unitPrice;
    let newSelectedProducts = selectedProducts;
    newSelectedProducts[index].quantityMovement = quantity;
    newSelectedProducts[index].subtotal =
      quantity * newSelectedProducts[index].unitPrice;

    setSelectedProducts(newSelectedProducts);
    let calculatedtotalIgv =
      getValueField('totalFieldIgv').value -
      subTotalWithPreviousQuantity +
      subTotalWithNextQuantity;
    total = Number(calculatedTotal.toFixed(2));
    changeValueField('totalField', Number(calculatedTotal.toFixed(2)));
    changeValueField('totalFieldIgv', Number(calculatedtotalIgv.toFixed(2)));
    forceUpdate();
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
      dispatch({type: NEW_SALE, payload: undefined});
      console.log('listDocuments', listDocuments);
      let parsedDocuments = listDocuments.map((obj) => {
        return {
          issueDate: obj.dateDocument,
          serialDocument: obj.document,
        };
      });
      console.log('parsedDocuments', parsedDocuments);
      let finalPayload;
      const listTypeIgvCode = {
        1000: 10,
        9997: 20,
        9998: 30,
      };
      // Validar si hay al menos un producto
      if (selectedProducts && selectedProducts.length >= 1) {
        setFormikSubmitting(true);
        try {
          finalPayload = {
            request: {
              payload: {
                merchantId: userDataRes.merchantSelected.merchantId,
                contableMovementId: query.contableMovementId || '',
                contableMovements: [],
                exchangeRate: exchangeRate,
                moneyUnit: moneyToConvert,
                clientId:
                  selectedClient && selectedClient.clientId
                    ? selectedClient.clientId
                    : '',
                client: {
                  id: selectedClient.clientId || '',
                  denomination:
                    selectedClient.denominationClient || 'Cliente No Definido',
                  address: selectedClient.addressClient || '',
                  email: selectedClient.emailClient || '',
                  type: selectedClient.typeDocumentClient || '',
                },
                totalPriceWithIgv: Number(
                  getValueField('totalFieldIgv').value.toFixed(2),
                ),
                issueDate: specialFormatToSunat(value),
                outputGeneration: true,
                serial: serial,
                documentIntern: '',
                documentsMovement: [],
                clientEmail: getValueField('clientEmail').value,
                sendWsp: sendWsp,
                wspNumber: getValueField('wspNumber').value,
                transactionNumber:
                  getValueField('transactionNumber').value || '',
                /* numberBill: 3, */
                automaticSendSunat: true,
                automaticSendClient: true,
                referralGuide: getValueField('referralGuide').value
                  ? true
                  : false,
                creditSale: paymentWay == 'credit',
                methodToPay: paymentMethod,
                earningGeneration: earningGeneration,
                proofOfPaymentGeneration: proofOfPaymentGeneration,
                referralGuideSerial: getValueField('referralGuide').value
                  ? getValueField('referralGuide').value
                  : '',
                dueDate: specialFormatToSunat(value + 1 * 24 * 60 * 60 * 1000),
                observation: getValueField('observation').value
                  ? getValueField('observation').value
                  : '',
                igv: isIgvChecked ? Number(igvDefault) : 0,
                productsInfo: selectedProducts.map((obj) => {
                  return {
                    product: obj.product,
                    quantityMovement: Number(obj.quantityMovement),
                    unitPrice: Number(obj.unitPrice),
                    stockChange: obj.stockChange,
                    category: obj.category || '',
                    customCodeProduct: obj.customCodeProduct,
                    description: obj.description,
                    unitMeasure: obj.unitMeasure,
                    businessProductCode: obj.businessProductCode,
                    taxCode: obj.taxCode,
                    igvCode: listTypeIgvCode[`${obj.taxCode}`],
                  };
                }),
                proofOfPaymentType: proofOfPaymentType,
                referralGuides: parsedDocuments,
                typePDF: userDataRes.merchantSelected.typeMerchant,
                denominationMerchant:
                  userDataRes.merchantSelected.denominationMerchant,
                sendEmail: sendEmail,
                userCreated: userDataRes.userId,
                userCreatedMetadata: {
                  nombreCompleto: userDataRes.nombreCompleto,
                  email: userDataRes.email,
                },
              },
            },
          };
        } catch (error) {
          console.log('Este es el error al generar el payload', error);
          throw new Error('Algo pasa al crear el payload de Venta');
        }
        console.log('finalPayload', finalPayload);
        getAddSale(finalPayload, jwtToken);
        console.log('Data formulario principal', finalPayload);
        setOpenStatus(true);
        setFormikSubmitting(false);
      } else {
        typeAlert = 'product';
        setShowAlert(true);
        setFormikSubmitting(false);
      }
    }
  };

  const registerSuccess = () => {
    return (
      successMessage != undefined &&
      newSaleRes != undefined &&
      !('error' in newSaleRes)
    );
  };

  const registerError = () => {
    return (
      (successMessage != undefined &&
        newSaleRes !== undefined &&
        'error' in newSaleRes) ||
      errorMessage
    );
  };

  const handleClickAway = () => {
    // Evita que se cierre el diálogo haciendo clic fuera del contenido
    // Puedes agregar condiciones adicionales aquí si deseas una lógica más específica.
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
              {newSaleRes !== undefined && 'error' in newSaleRes
                ? newSaleRes.error
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
      dispatch({type: NEW_SALE, payload: undefined});
      setOpenStatus(false);
      Router.push('/sample/sales/table');
    } else if (registerError()) {
      setOpenStatus(false);
    } else {
      setOpenStatus(false);
    }
  };

  const getNewProduct = (product) => {
    console.log('ver ahora nuevo producto', product);
    product.subtotal = Number(product.subtotal);
    console.log('ver ahora selectedProducts', selectedProducts);
    let newSelectedProducts = selectedProducts;
    if (newSelectedProducts && newSelectedProducts.length >= 1) {
      newSelectedProducts.forEach((obj, index) => {
        console.log('obj', obj);
        if (
          obj.product == product.product &&
          obj.description == product.description &&
          obj.customCodeProduct == product.customCodeProduct
        ) {
          console.log('selectedProducts 1', newSelectedProducts);
          newSelectedProducts.splice(index, 1);
          console.log('selectedProducts 2', newSelectedProducts);
        }
      });
    }
    newSelectedProducts.push(product);
    let totalWithIgv = 0;
    let calculatedtotal = 0;
    newSelectedProducts.forEach((obj) => {
      calculatedtotal += Number(obj.subtotal);
      totalWithIgv +=
        obj.taxCode == 1000 && Number(igvDefault) > 0 && isIgvChecked
          ? Number((Number(obj.subtotal) * (1 + igvDefault)).toFixed(2))
          : Number(obj.subtotal);
    });
    setSelectedProducts(newSelectedProducts);
    total = Number(calculatedtotal.toFixed(2));
    changeValueField('totalField', Number(calculatedtotal.toFixed(2)));
    changeValueField('totalFieldIgv', Number(totalWithIgv.toFixed(2)));
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
  const getClient = (client) => {
    console.log('Estoy en el getClient');
    if (client.typeDocumentClient == 'RUC') {
      let serieParameter = businessParameter.find(
        (obj) => obj.abreParametro == 'SERIES_BILL',
      );
      setSerial(serieParameter.metadata ? serieParameter.metadata : '');
      setProofOfPaymentType('bill');
    } else {
      setSerial('S');
      setProofOfPaymentType('ticket');
    }
    setSelectedClient(client);
    console.log('Cliente seleccionado', client);
    forceUpdate();
    setOpen(false);
  };

  const reloadPage = () => {
    setReload(!reload);
  };
  return (
    <Card sx={{p: 4}}>
      <Box sx={{width: 1, textAlign: 'center'}}>
        <Typography
          sx={{mx: 'auto', my: '10px', fontWeight: 600, fontSize: 25}}
        >
          GENERAR VENTA
        </Typography>
      </Box>
      <Box sx={{width: 1, textAlign: 'center'}}>
        <ToggleButtonGroup
          value={registerType}
          exclusive
          onChange={(event) => {
            console.log(event.target.value);
            setRegisterType(event.target.value);
            if (event.target.value == 'onlySale') {
              setEarningGeneration(false);
              setProofOfPaymentGeneration(false);
            } else if (event.target.value == 'saleWithProofOfPayment') {
              setEarningGeneration(true);
              setProofOfPaymentGeneration(true);
            }

            forceUpdate();
          }}
          aria-label='text alignment'
        >
          <StyledToggleButton
            value={'onlySale'}
            className={clsx({
              active: registerType === 'onlySale',
            })}
            aria-label='left aligned'
          >
            <IntlMessages id='movements.type.sales.typeRegister.onlySale' />
          </StyledToggleButton>

          <StyledToggleButton
            value={'saleWithProofOfPayment'}
            className={clsx({
              active: registerType === 'saleWithProofOfPayment',
            })}
            aria-label='centered'
          >
            <IntlMessages id='movements.type.sales.typeRegister.saleWithProofOfPayment' />
          </StyledToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box>
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
                noValidate
                autoComplete='on'
                /* onChange={handleActualData} */
              >
                <Grid container sx={{maxWidth: 500, margin: 'auto'}}>
                  <Grid sx={{px: 1, mt: 2}} xs={12}>
                    <Button
                      sx={{width: 1}}
                      variant='outlined'
                      onClick={handleClickOpen.bind(this, 'client')}
                    >
                      Cliente:{' '}
                      {selectedClient && selectedClient.denominationClient
                        ? selectedClient.denominationClient
                        : 'No Definido'}
                    </Button>
                  </Grid>
                  {/* <Grid sx={{px: 1, mt: 2}} xs={11}>
                    <Typography sx={{mx: 'auto', my: '10px'}}>
                      Cliente:{' '}
                      {selectedClient && selectedClient.denominationClient
                        ? selectedClient.denominationClient
                        : 'No Definido'}
                    </Typography>
                  </Grid> */}
                  {selectedClient && selectedClient.denominationClient ? (
                    <Grid sx={{px: 1, mt: 2}} xs={1}>
                      <IconButton
                        sx={{width: 1}}
                        onClick={() => {
                          setSerial('S');
                          setProofOfPaymentType('ticket');
                          setSelectedClient('Cliente No Definido');
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  ) : null}
                  {/* <Grid xs={12} sx={{px: 1, mt: 2}}>
                    <AppTextField
                      label='Cliente'
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
                  </Grid> */}
                </Grid>

                <Grid
                  container
                  spacing={2}
                  sx={{maxWidth: 500, mx: 'auto', mb: 4, mt: 4}}
                >
                  {registerType == 'saleWithProofOfPayment' ? (
                    <>
                      {isNotMobile ? (
                        <Grid xs={6} sm={4} sx={{px: 1, mt: 2}}>
                          <AppTextField
                            label='Nro Venta'
                            name='nroReceipt'
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
                      ) : null}
                      <Grid xs={6} sm={4} sx={{px: 1, mt: 2}}>
                        <DateTimePicker
                          renderInput={(params) => (
                            <TextField
                              className={classes.fixPosition}
                              {...params}
                            />
                          )}
                          required
                          value={value}
                          //disabled
                          label='Fecha de emisión'
                          inputFormat='dd/MM/yyyy'
                          name='issueDate'
                          minDate={
                            new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                          } // establece la fecha mínima en dos días a partir de la actual
                          maxDate={
                            new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
                          }
                          onChange={(newValue) => {
                            setValue(newValue);
                            console.log('date1', newValue);
                          }}
                        />
                      </Grid>
                    </>
                  ) : null}

                  <Grid xs={6} sm={4} sx={{px: 1, mt: 2}}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel id='moneda-label' style={{fontWeight: 200}}>
                        Moneda
                      </InputLabel>
                      <Select
                        value={moneyToConvert}
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
                  {registerType == 'saleWithProofOfPayment' && isNotMobile ? (
                    <Grid xs={6} sm={4} sx={{px: 1, mt: 2}}>
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
                  ) : null}
                  <Grid xs={6} sm={4} sx={{px: 1, mt: 2}}>
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
                    xs={6}
                    sm={4}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      px: 1,
                      mt: 2,
                      mr: 0,
                    }}
                  >
                    <FormControlLabel
                      label='IGV'
                      disabled={Number(igvDefault) > 0 ? false : true}
                      checked={isIgvChecked}
                      sx={{mr: 1}}
                      control={<Checkbox onChange={handleIGV} />}
                    />
                    {igvDefault}
                  </Grid>
                  <Grid xs={12} sx={{px: 1, mt: 2, my: 2}}>
                    <Button
                      sx={{width: 1}}
                      variant='outlined'
                      onClick={handleClickOpen.bind(this, 'product')}
                    >
                      Añade productos
                    </Button>
                  </Grid>
                </Grid>

                {selectedProducts && selectedProducts.length > 0 ? (
                  <>
                    <Divider sx={{my: 3}} />
                    <ProductsList
                      data={selectedProducts}
                      valueWithIGV={valueWithIGV}
                      toDelete={removeProduct}
                      toChangeTaxCode={changeTaxCode}
                      toChangeUnitMeasure={changeUnitMeasure}
                      toChangeQuantity={changeQuantity}
                      igvEnabled={
                        Number(igvDefault) > 0 && isIgvChecked ? true : false
                      }
                    ></ProductsList>
                  </>
                ) : null}

                <Divider sx={{my: 3}} />
                {registerType == 'saleWithProofOfPayment' ? (
                  <Grid
                    container
                    spacing={2}
                    sx={{maxWidth: 500, mx: 'auto', mb: 4, mt: 4}}
                  >
                    <Grid sx={{px: 1, mt: 2}} xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel
                          id='methodToPay-label'
                          style={{fontWeight: 200}}
                        >
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
                          <MenuItem
                            value='bankTransfer'
                            style={{fontWeight: 200}}
                          >
                            Transferencia Bancaria
                          </MenuItem>
                          <MenuItem value='card' style={{fontWeight: 200}}>
                            Tarjeta de crédito/débito
                          </MenuItem>
                          <MenuItem
                            value='bankDeposit'
                            style={{fontWeight: 200}}
                          >
                            <IntlMessages id='common.bankDeposit' />
                          </MenuItem>
                          <MenuItem value='giftCard' style={{fontWeight: 200}}>
                            GiftCard
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid xs={12} sm={6} sx={{px: 1, mt: 2}}>
                      <AppTextField
                        label='Número de transacción'
                        disabled={paymentMethod == 'cash'}
                        name='transactionNumber'
                        variant='outlined'
                        sx={{
                          width: '100%',
                          '& .MuiInputBase-input': {
                            fontSize: 14,
                          },
                        }}
                      />
                    </Grid>
                    <Grid xs={6} sx={{px: 1, mt: 4}}>
                      <FormControl fullWidth>
                        <InputLabel
                          id='wayToPay-label'
                          style={{fontWeight: 200}}
                        >
                          Forma de pago
                        </InputLabel>
                        <Select
                          value={paymentWay}
                          name='wayToPay'
                          labelId='wayToPay-label'
                          label='Forma de pago'
                          onChange={(event) => {
                            setPaymentWay(event.target.value);
                          }}
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
                    {paymentWay == 'credit' ? (
                      <Grid xs={6} sx={{pl: 2, mt: 4}}>
                        <FormControl fullWidth>
                          <InputLabel
                            id='quota-label'
                            style={{fontWeight: 200}}
                          >
                            Nro de cuotas
                          </InputLabel>
                          <Select
                            defaultValue='1'
                            name='quota'
                            labelId='quota-label'
                            label='Nro de cuotas'
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
                    ) : null}
                    <Grid sx={{px: 1}} xs={8}>
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
                    {/* {isNotMobile ? (
                    <>
                    
                    <Grid sx={{px: 1}} xs={8}>
                      <AppTextField
                        label='Número telefónico'
                        name='wspNumber'
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
                      xs={3}
                      sx={{display: 'flex', alignItems: 'center', px: 1, mt: 2}}
                    >
                      <FormControlLabel
                        label='Enviar Mensaje Interno'
                        control={
                          <Checkbox
                            onChange={handleSendWsp}
                            defaultChecked={true}
                          />
                        }
                      />
                    </Grid>
                    </>
                    ) : null} */}
                    <Grid sx={{px: 1, mt: 2}} xs={12}>
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
                    <Grid
                      xs={12}
                      sx={{display: 'flex', alignItems: 'center', px: 1, mt: 2}}
                    >
                      <FormControlLabel
                        label='Generar Ingreso contable'
                        control={
                          <Checkbox
                            onChange={handleEarningGeneration}
                            checked={earningGeneration}
                          />
                        }
                      />
                    </Grid>
                    <Grid xs={6} sx={{px: 1, mt: 2}}>
                      <FormControlLabel
                        label='Generar Comprobante'
                        control={
                          <Checkbox
                            onChange={handleProofOfPaymentGeneration}
                            checked={proofOfPaymentGeneration}
                          />
                        }
                      />
                    </Grid>
                    <Grid xs={6} sx={{px: 1, mt: 2}}>
                      <FormControl fullWidth sx={{my: 2}}>
                        <InputLabel
                          id='proofOfPaymentType-label'
                          style={{fontWeight: 200}}
                        >
                          Tipo de Comprobante
                        </InputLabel>
                        <Select
                          value={proofOfPaymentType}
                          name='proofOfPaymentType'
                          labelId='proofOfPaymentType-label'
                          label='Tipo de comprobante'
                          onChange={(event) => {
                            if (event.target.value == 'bill') {
                              let serieParameter = businessParameter.find(
                                (obj) => obj.abreParametro == 'SERIES_BILL',
                              );
                              setSerial(
                                serieParameter.metadata
                                  ? serieParameter.metadata
                                  : '',
                              );
                            }
                            if (event.target.value == 'receipt') {
                              let serieParameter = businessParameter.find(
                                (obj) => obj.abreParametro == 'SERIES_RECEIPT',
                              );
                              setSerial(
                                serieParameter.metadata
                                  ? serieParameter.metadata
                                  : '',
                              );
                            }
                            if (event.target.value == 'ticket') {
                              setSerial('S');
                            }
                            setProofOfPaymentType(event.target.value);
                          }}
                        >
                          {selectedClient &&
                          selectedClient.typeDocumentClient == 'RUC' ? (
                            <MenuItem value='bill' style={{fontWeight: 200}}>
                              Factura
                            </MenuItem>
                          ) : null}
                          {!(
                            selectedClient &&
                            selectedClient.typeDocumentClient == 'RUC'
                          ) ? (
                            <MenuItem value='ticket' style={{fontWeight: 200}}>
                              Ticket
                            </MenuItem>
                          ) : null}
                          {!(
                            selectedClient &&
                            selectedClient.typeDocumentClient == 'RUC'
                          ) ? (
                            <MenuItem value='receipt' style={{fontWeight: 200}}>
                              Boleta
                            </MenuItem>
                          ) : null}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                ) : null}
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
                        onClick={() => window.open('https://www.youtube.com/')}
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
            open={openStatus}
            onClose={sendStatus}
            sx={{textAlign: 'center'}}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
              {'Registro de Venta'}
            </DialogTitle>
            {showMessage()}
          </Dialog>
        </ClickAwayListener>
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
              <AddProductForm
                type='sale'
                igvDefault={Number(igvDefault)}
                sendData={getNewProduct}
                igvEnabled={
                  Number(igvDefault) > 0 && isIgvChecked ? true : false
                }
              />
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
      </Dialog>
      <Dialog
        open={showDelete}
        onClose={closeDelete}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Generar Venta'}
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
              Router.push('/sample/sales/table');
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
    </Card>
  );
};

export default NewSale;
