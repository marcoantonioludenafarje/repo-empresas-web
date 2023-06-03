import React, {useEffect, useRef} from 'react';
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

import AppLoader from '../../../@crema/core/AppLoader';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';

import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';

import AddProductForm from '../Bills/AddProductForm';
import OutputProducts from '../Bills/OutputProducts';
import DocumentsTable from '../DocumentSelector/DocumentsTable';
import AddDocumentForm from '../DocumentSelector/AddDocumentForm';
import AddClientForm from '../ClientSelection/AddClientForm';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import {DateTimePicker} from '@mui/lab';
import {dateWithHyphen, translateValue} from '../../../Utils/utils';
import {useDispatch, useSelector} from 'react-redux';
import Router, {useRouter} from 'next/router';
import {
  getMovements,
  getOutputItems_pageListOutput,
  addCreditNote,
} from '../../../redux/actions/Movements';
import {red} from '@mui/material/colors';
import {orange} from '@mui/material/colors';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
  GET_MOVEMENTS,
  ADD_CREDIT_NOTE,
  FETCH_SUCCESS,
  FETCH_ERROR,
} from '../../../shared/constants/ActionTypes';
import {ArrowRightAltTwoTone} from '@mui/icons-material';

let listDocuments = [];
let selectedProducts = [];
let total = 0;
let creditNoteTypes = [
  {typeNote: 'credit', name: 'operationCancellation'},
  {typeNote: 'credit', name: 'cancellationDueToErrorInTheRuc'},
  {typeNote: 'credit', name: 'correctionForErrorInTheDescription'},
  {typeNote: 'credit', name: 'overallDiscount'},
  {typeNote: 'credit', name: 'discountPerItem'},
  {typeNote: 'credit', name: 'totalRefund'},
  {typeNote: 'credit', name: 'returnPerItem'},
  {typeNote: 'credit', name: 'bonus'},
  {typeNote: 'credit', name: 'decreaseInValue'},
  {typeNote: 'credit', name: 'otherConcepts'},
  {typeNote: 'credit', name: 'adjustmentsOfCreditNoteAffectedByIVAP'},
  {typeNote: 'credit', name: 'exportOperationsAdjustmentsOfCreditNote'},
  {typeNote: 'credit', name: 'adjusmentsOfAmountsAndOrPaymentDates'},
  {typeNote: 'debit', name: 'increaseInValue'},
  {typeNote: 'debit', name: 'interestForLatePayment'},
  {typeNote: 'debit', name: 'penalties'},
  {typeNote: 'debit', name: 'adjustmentsOfDebitNoteAffectedByIVAP'},
  {typeNote: 'debit', name: 'exportOperationsAdjustmentsOfDebitNote'},
];

const useForceUpdate = () => {
  const [reload, setReload] = React.useState(0); // integer state
  return () => setReload((value) => value + 1); // update the state to force render
};

let listOutputsPayload = {
  request: {
    payload: {
      initialTime: null,
      finalTime: null,
      businessProductCode: null,
      movementType: 'OUTPUT',
      merchantId: '',
    },
  },
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

const GetCreditNote = () => {
  const [issueDate, setIssueDate] = React.useState(Date.now());
  const [addIgv, setAddIgv] = React.useState(false);
  const [showDialog, setShowDialog] = React.useState(false);
  const [typeDialog, setTypeDialog] = React.useState('');
  const [moneyUnit, setMoneyUnit] = React.useState('');
  const [moneyToConvert, setMoneyToConvert] = React.useState('');
  const [selectedReceipt, setSelectedReceipt] = React.useState({});
  const [selectedClient, setSelectedClient] = React.useState({});
  const [selectedOutput, setSelectedOutput] = React.useState({});
  const [exchangeRate, setExchangeRate] = React.useState('');
  const [creditNote, setCreditNote] = React.useState(true);
  const [subTypeNote, setSubTypeNote] = React.useState(creditNoteTypes[0].name);
  const [showAlert, setShowAlert] = React.useState(false);
  const [typeAlert, setTypeAlert] = React.useState('');
  const [openDialog, setOpenDialog] = React.useState(false);
  const [typeResult, setTypeResult] = React.useState('');
  const [expirationDate, setExpirationDate] = React.useState(Date.now());
  const [minTutorial, setMinTutorial] = React.useState(false);
  const [typeDocumentRelated, setTypeDocumentRelated] =
    React.useState('receipt');

  const [igvDefault, setIgvDefault] = React.useState(0);
  const prevMoneyToConvertRef = useRef();
  useEffect(() => {
    prevMoneyToConvertRef.current = moneyToConvert;
  });
  const prevMoneyToConvert = prevMoneyToConvertRef.current;

  const dispatch = useDispatch();
  const router = useRouter();
  const {query} = router;
  const forceUpdate = useForceUpdate();
  let changeValueField;

  const {getMovementsRes} = useSelector(({movements}) => movements);
  console.log('getMovementsRes', getMovementsRes);
  const {outputItems_pageListOutput} = useSelector(({movements}) => movements);
  console.log('outputItems_pageListOutput', outputItems_pageListOutput);
  const {receiptItems_pageListReceipt, receiptLastEvalutedKey_pageListReceipt} =
    useSelector(({movements}) => movements);
  console.log('receiptItems_pageListReceipt', receiptItems_pageListReceipt);
  const {addCreditNoteRes} = useSelector(({movements}) => movements);
  console.log('addCreditNoteRes', addCreditNoteRes);
  const {businessParameter} = useSelector(({general}) => general);
  console.log('businessParameter', businessParameter);
  const {globalParameter} = useSelector(({general}) => general);
  console.log('globalParameter123', globalParameter);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  const {successMessage} = useSelector(({movements}) => movements);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({movements}) => movements);
  console.log('errorMessage', errorMessage);
  console.log('userAttributes', userAttributes);

  listOutputsPayload.request.payload.merchantId =
    userDataRes.merchantSelected.merchantId;
  listOutputsPayload.request.payload.initialTime = 919242684000;
  listOutputsPayload.request.payload.finalTime = 11112109884000;

  const toGetMovements = (payload) => {
    dispatch(getOutputItems_pageListOutput(payload));
  };
  const toAddCreditNote = (payload) => {
    dispatch(addCreditNote(payload));
  };

  useEffect(() => {
    listDocuments = [];
    changeValueField('nroReceipt', query.nroReceipt);
    setTypeDocumentRelated(query.typeDocumentRelated);
    setTimeout(() => {
      setMinTutorial(true);
    }, 2000);
  }, []);

  useEffect(() => {
    if (businessParameter) {
      let igvDefault = businessParameter.find(
        (obj) => obj.abreParametro == 'IGV',
      ).value;
      setIgvDefault(igvDefault);
      let obtainedMoneyUnit = businessParameter.find(
        (obj) => obj.abreParametro == 'DEFAULT_MONEY_UNIT',
      ).value;
      setMoneyUnit(obtainedMoneyUnit);
      setMoneyToConvert(obtainedMoneyUnit);
      console.log('moneyUnit', obtainedMoneyUnit);
    }
  }, [businessParameter]);

  useEffect(() => {
    if (globalParameter && moneyUnit) {
      let obtainedExchangeRate = globalParameter.find(
        (obj) =>
          obj.abreParametro == `ExchangeRate_${moneyToConvert}_${moneyUnit}`,
      ).value;
      setExchangeRate(obtainedExchangeRate);
      console.log('exchangeRate', exchangeRate);
    }
  }, [globalParameter, moneyUnit]);

  useEffect(() => {
    if (globalParameter && moneyUnit && prevMoneyToConvert !== moneyToConvert) {
      let obtainedExchangeRate = globalParameter.find(
        (obj) =>
          obj.abreParametro == `ExchangeRate_${moneyToConvert}_${moneyUnit}`,
      ).value;
      setExchangeRate(obtainedExchangeRate);
      console.log('exchangeRate', exchangeRate);
    }
  }, [globalParameter, moneyUnit, moneyToConvert]);

  useEffect(() => {
    if (
      selectedReceipt &&
      selectedReceipt.referralGuides &&
      Object.keys(selectedReceipt.referralGuides).length > 0
    ) {
      console.log(
        'selectedReceipt.referralGuides',
        selectedReceipt.referralGuides,
      );
      selectedReceipt.referralGuides.map((obj) => {
        listDocuments.push({
          dateDocument: obj.issueDate.split('-').join('/'),
          document: obj.serialDocument,
          typeDocument: 'referralGuide',
        });
      });
      console.log('listDocuments', listDocuments);
    }
    if (selectedReceipt) {
      setSelectedClient({
        denominationClient: selectedReceipt.denominationClient,
        clientId: selectedReceipt.clientId,
        emailClient: selectedReceipt.clientEmail
          ? selectedReceipt.clientEmail
          : '',
      });
    }
  }, [selectedReceipt]);

  useEffect(() => {
    if (
      receiptItems_pageListReceipt &&
      Array.isArray(receiptItems_pageListReceipt) &&
      receiptItems_pageListReceipt[0].movementType == 'RECEIPT'
    ) {
      let receipt = receiptItems_pageListReceipt.find(
        (obj) => obj.movementHeaderId == query.idReceipt,
      );
      setSelectedReceipt(receipt);
      console.log('Receipt seleccionado', receipt);
      if (receipt.productsInfo) {
        selectedProducts = receipt.productsInfo.map((obj) => {
          let count = Number(obj.cantidad || obj.count || obj.quantityMovement);
          let price = Number(
            obj.precio_unitario ||
              obj.priceProduct ||
              obj.priceBusinessMoneyWithIgv,
          );
          return {
            product: obj.codigo || obj.product,
            description: obj.descripcion || obj.description,
            unitMeasure: obj.unidad_de_medida || obj.unitMeasure,
            quantityMovement: count,
            taxCode: obj.taxCode || '',
            igvCode: obj.igvCode || '',
            priceBusinessMoneyWithIgv: price,
            subtotal: obj.subtotal || Number((price * count).toFixed(3)),
          };
        });
      }
      console.log('selectedProducts', selectedProducts);
      total =
        receipt.totalPriceWithoutIgv && receipt.totalPriceWithoutIgv.length > 0
          ? receipt.totalPriceWithoutIgv
          : 0;
      if (receipt && Object.keys(receipt).length !== 0) {
        changeValueField(
          'totalField',
          Number(receipt.totalPriceWithoutIgv.toFixed(2)),
          /*  && receipt.totalPriceWithoutIgv !== ''
            ? receipt.totalPriceWithoutIgv
            : 0, */
        );
        changeValueField(
          'totalFieldIgv',
          Number(receipt.totalPriceWithIgv.toFixed(2)),
        );
      }
      dispatch({type: GET_MOVEMENTS, payload: undefined});
      toGetMovements(listOutputsPayload);
      forceUpdate();
    }
    if (
      outputItems_pageListOutput &&
      outputItems_pageListOutput.length > 0 &&
      outputItems_pageListOutput[0].movementType == 'OUTPUT'
    ) {
      console.log(
        'outputItems_pageListOutput de salidas',
        outputItems_pageListOutput,
      );
      console.log('query.movementId', query.movementId);
      let output = outputItems_pageListOutput.find(
        (obj) => obj.movementHeaderId == query.movementId,
      );
      console.log('output desde nota de credito', output);
      setSelectedOutput(output);
    }
  }, [receiptItems_pageListReceipt]);

  useEffect(() => {
    if (
      outputItems_pageListOutput &&
      outputItems_pageListOutput.length > 0 &&
      outputItems_pageListOutput[0].movementType == 'OUTPUT'
    ) {
      console.log(
        'outputItems_pageListOutput de salidas',
        outputItems_pageListOutput,
      );
      console.log('query.movementId', query.movementId);
      let output = outputItems_pageListOutput.find(
        (obj) => obj.movementHeaderId == query.movementId,
      );
      console.log('output desde nota de credito', output);
      setSelectedOutput(output);
    }
  }, [outputItems_pageListOutput]);

  /* useEffect(() => {
    if (Object.keys(selectedReceipt).length !== 0 && getMovementsRes) {
      changeValueField(
        'totalField',
        selectedReceipt.totalPriceWithoutIgv &&
          selectedReceipt.totalPriceWithoutIgv !== ''
          ? selectedReceipt.totalPriceWithoutIgv
          : 0,
      );
      changeValueField('totalFieldIgv', selectedReceipt.totalPriceWithIgv);
    }
  }, [getMovementsRes && selectedReceipt]); */
  /* useEffect(() => {
    if (selectedOutput) {
      listDocuments = selectedOutput.documentsMovement.map((obj) => {
        return {
          dateDocument: obj.issueDate,
          document: obj.serialDocument,
          typeDocument: obj.typeDocument,
        };
      });
      console.log('listDocuments ', listDocuments);
      forceUpdate();
    }
  }, [selectedOutput]); */

  console.log('query', query);

  const validationSchema = yup.object({
    nroReceipt: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />)
      .required(<IntlMessages id='validation.required' />),
    totalField: yup
      .number()
      .typeError(<IntlMessages id='validation.number' />)
      .test(
        'maxDigitsAfterDecimal',
        'El número puede contener como máximo 3 decimales',
        (number) => /^\d+(\.\d{1,3})?$/.test(number),
      )
      .required(<IntlMessages id='validation.required' />),
    totalFieldIgv: yup
      .number()
      .typeError(<IntlMessages id='validation.number' />)
      .test(
        'maxDigitsAfterDecimal',
        'El número puede contener como máximo 3 decimales',
        (number) => /^\d+(\.\d{1,3})?$/.test(number),
      )
      .required(<IntlMessages id='validation.required' />),
    observation: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />),
  });

  const handleIGV = (event, isInputChecked) => {
    setAddIgv(isInputChecked);
    console.log('Evento de pagado cbx', isInputChecked);
  };
  const valueWithIGV = (value) => {
    const IGV = igvDefault;
    const precioConIGV = (value * (1 + IGV)).toFixed(10);
    return precioConIGV;
  };
  const defaultValues = {
    nroReceipt: '',
    totalField: selectedReceipt.totalPriceWithoutIgv,
    totalFieldIgv: selectedReceipt.totalPriceWithIgv,
    observation: '',
  };

  const getCarrier = (obj) => {
    if (obj.nameCarrier) {
      return {denominationCarrier: obj.nameCarrier};
    }
  };

  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    console.log('data', data);
    if (Object.keys(selectedClient).length !== 0 && subTypeNote) {
      let cleanDocuments = [];
      listDocuments.map((obj) => {
        cleanDocuments.push({
          issueDate: obj.dateDocument,
          serialDocument: obj.document,
        });
      });
      let cleanProducts = [];
      selectedProducts.map((obj) => {
        cleanProducts.push({
          product: obj.product,
          quantityMovement: obj.quantityMovement,
          priceBusinessMoneyWithIgv: obj.priceBusinessMoneyWithIgv,
          customCodeProduct: obj.customCodeProduct ? obj.customCodeProduct : '',
          description: obj.description,
          unitMeasure: obj.unitMeasure,
          taxCode: obj.taxCode || '',
          igvCode: obj.igvCode || '',
        });
      });
      console.log('cleanProducts', cleanProducts);
      let finalPayload = {
        request: {
          payload: {
            merchantId: userDataRes.merchantSelected.merchantId,
            denominationMerchant:
              userDataRes.merchantSelected.denominationMerchant,
            movementTypeMerchantId: selectedReceipt.movementTypeMerchantId,
            movementHeaderId: selectedReceipt.movementHeaderId,
            createdAt: selectedReceipt.createdAt,
            contableMovementId: selectedOutput.contableMovementId || '',
            clientId: selectedClient.clientId,
            clientEmail: selectedClient.emailClient,
            totalPriceWithIgv: data.totalFieldIgv,
            issueDate: dateWithHyphen(issueDate),
            serial: data.nroReceipt.split('-')[0],
            documentIntern: '',
            automaticSendSunat: true,
            automaticSendClient: true,
            creditSale: false,
            previousTotalPriceWithIgv: selectedReceipt.totalPriceWithIgv,
            previousTotalPriceWithoutIgv: selectedReceipt.totalPriceWithoutIgv,
            dueDate: dateWithHyphen(expirationDate),
            observation: data.observation,
            igv: selectedReceipt.igv,
            productsInfo: cleanProducts,
            documentsMovement: selectedOutput.documentsMovement
              ? selectedOutput.documentsMovement
              : [],
            referralGuides: cleanDocuments,
            typeDocumentRelated: query.typeDocumentRelated,
            serialDocumentRelated: data.nroReceipt.split('-')[0],
            numberDocumentRelated: data.nroReceipt.split('-')[1],
            typeNote: subTypeNote,
            movementType: creditNote ? 'CREDIT_NOTE' : 'DEBIT_NOTE',
            outputId: selectedReceipt.outputId,
            typePDF: userDataRes.merchantSelected.typeMerchant,
            folderMovement: selectedOutput.folderMovement,
          },
        },
      };
      console.log('finalPayload', finalPayload);
      dispatch({type: ADD_CREDIT_NOTE, payload: undefined});
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      toAddCreditNote(finalPayload);
      setTypeResult('statusResult');
      setOpenDialog(true);
    } else {
      setShowAlert(true);
      if (Object.keys(selectedClient).length === 0) {
        setTypeAlert('client');
      }
      if (!subTypeNote) {
        setTypeAlert('typeNote');
      }
    }
    setSubmitting(false);
  };

  const cancel = () => {
    setTypeResult('confirmCancel');
    setOpenDialog(true);
  };

  const getClient = (client) => {
    setSelectedClient(client);
    console.log('Cliente seleccionado', client);
    setShowDialog(false);
  };

  const getDocument = (document) => {
    console.log('Documento seleccionado', document);
    listDocuments.push(document);
    console.log('listDocuments', listDocuments);
    forceUpdate();
  };
  const removeDocument = (index) => {
    listDocuments.splice(index, 1);
    console.log('listDocuments', listDocuments);
    forceUpdate();
  };
  /* const setSubtypeDefault = () => {
    creditNoteTypes.find((obj) => {
      let resul = false;
      if (creditNote) {
        resul = obj.typeNote == 'credit';
      } else {
        resul = obj.typeNote == 'debit';
      }
      if (resul) {
        setSubTypeNote(obj.name);
        console.log('subTypeNote', obj.name);
      }
      return resul;
    });
  }; */

  const getNewProduct = (product) => {
    console.log('ver ahora nuevo producto', product);
    product.subtotal = Number(product.subtotal);
    console.log('ver ahora selectedProducts', selectedProducts);
    if (selectedProducts && selectedProducts.length >= 1) {
      selectedProducts.map((obj, index) => {
        console.log('obj', obj);
        if (
          obj.product == product.product &&
          obj.description == product.description
        ) {
          console.log('selectedProducts 1', selectedProducts);
          selectedProducts.splice(index, 1);
          console.log('selectedProducts 2', selectedProducts);
        }
      });
    }
    product.priceProduct = product.priceBusinessMoneyWithIgv;
    product.count = product.quantityMovement;
    selectedProducts.push(product);
    let calculatedtotal = 0;
    selectedProducts.map((obj) => {
      calculatedtotal += obj.subtotal;
    });
    if (selectedReceipt.totalPriceWithIgv < calculatedtotal) {
      setCreditNote(false);
      let newValue = creditNoteTypes.find(
        (obj) => obj.typeNote == 'debit',
      ).name;
      setSubTypeNote(newValue);
    } else {
      setCreditNote(true);
      setSubTypeNote(creditNoteTypes[0].name);
    }
    total = Number(calculatedtotal.toFixed(3));
    console.log('total de las salidas', total);
    console.log('Productos seleccionados', selectedProducts);
    changeValueField('totalField', Number(total.toFixed(2)));
    changeValueField(
      'totalFieldIgv',
      query.igv && Number(query.igv) > 0
        ? Number((total + total * Number(query.igv)).toFixed(2))
        : Number(total.toFixed(2)),
    );
    console.log('total de los productos', total);
    forceUpdate();
  };
  const removeProduct = (index) => {
    selectedProducts.splice(index, 1);
    if (selectedProducts.length == 0) {
      total = 0;
      setCreditNote(true);
      setSubTypeNote(creditNoteTypes[0].name);
    } else {
      let calculatedtotal = 0;
      selectedProducts.map((obj) => {
        calculatedtotal += obj.subtotal;
      });
      total = calculatedtotal;
      if (selectedReceipt.totalPriceWithIgv < calculatedtotal) {
        setCreditNote(false);
        let newValue = creditNoteTypes.find(
          (obj) => obj.typeNote == 'debit',
        ).name;
        setSubTypeNote(newValue);
      } else {
        setCreditNote(true);
        setSubTypeNote(creditNoteTypes[0].name);
      }
    }
    changeValueField('totalField', Number(total.toFixed(2)));
    changeValueField(
      'totalFieldIgv',
      query.igv && Number(query.igv) > 0
        ? Number((total + total * Number(query.igv)).toFixed(2))
        : total,
    );
    forceUpdate();
  };

  const setSubType = (event) => {
    console.log('evento onchange', event);
    setSubTypeNote(event.target.value);
    console.log('subTypeNote', subTypeNote);
  };

  const showCancelMessage = () => {
    return (
      <>
        <PriorityHighIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
        <DialogContentText
          sx={{fontSize: '1.2em', m: 'auto'}}
          id='alert-dialog-description'
        >
          Desea cancelar esta operación?. <br /> Se perderá la información
          ingresada
        </DialogContentText>
      </>
    );
  };

  const closeDialog = () => {
    if (typeResult === 'statusResult') {
      if (
        !(selectedOutput.existReceipt && selectedOutput.existReferralGuide) &&
        addCreditNoteRes !== undefined &&
        !('error' in addCreditNoteRes)
      ) {
        dispatch({type: GET_MOVEMENTS, payload: undefined});
        /* toGetMovements(listPayload); */
        Router.push('/sample/receipts/table');
      } else {
        Router.push('/sample/receipts/table');
      }
    }
    setOpenDialog(false);
  };

  const showMessage = () => {
    if (
      successMessage != undefined &&
      addCreditNoteRes !== undefined &&
      (!('error' in addCreditNoteRes) ||
        objectsAreEqual(addCreditNoteRes.error, {}))
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
            <Button variant='outlined' onClick={closeDialog}>
              Aceptar
            </Button>
          </DialogActions>
        </>
      );
    } else if (
      (successMessage != undefined &&
        addCreditNoteRes &&
        'error' in addCreditNoteRes &&
        !objectsAreEqual(addCreditNoteRes.error, {})) ||
      errorMessage != undefined
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
              {addCreditNoteRes !== undefined && 'error' in addCreditNoteRes
                ? addCreditNoteRes.error
                : null}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{justifyContent: 'center'}}>
            <Button variant='outlined' onClick={() => setOpenDialog(false)}>
              Aceptar
            </Button>
          </DialogActions>
        </>
      );
    } else {
      return <CircularProgress disableShrink sx={{mx: 'auto', my: '20px'}} />;
    }
  };

  return (
    <Card sx={{p: 4}}>
      <Box sx={{width: 1, textAlign: 'center'}}>
        <Typography
          sx={{mx: 'auto', my: '10px', fontWeight: 600, fontSize: 25}}
        >
          GENERAR NOTA
        </Typography>
      </Box>
      <Divider sx={{my: 3}} />
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          mb: 5,
          mx: 'auto',
        }}
      >
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
                /* onChange={handleActualData} */
              >
                {outputItems_pageListOutput &&
                Array.isArray(outputItems_pageListOutput) &&
                outputItems_pageListOutput.length > 0 ? (
                  <>
                    <Grid
                      container
                      spacing={2}
                      sx={{width: 500, margin: 'auto'}}
                    >
                      <Grid item xs={6}>
                        <AppTextField
                          label={
                            typeDocumentRelated == 'bill'
                              ? 'Número Factura a modificar'
                              : 'Número Boleta a modificar'
                          }
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
                      <Grid item xs={6}>
                        <FormControl fullWidth sx={{my: 2}}>
                          <InputLabel
                            id='moneda-label'
                            style={{fontWeight: 200}}
                          >
                            Moneda
                          </InputLabel>
                          <Select
                            defaultValue={moneyToConvert}
                            name='money_unit'
                            labelId='moneda-label'
                            label='Moneda'
                            value={moneyToConvert}
                            onChange={(event) => {
                              console.log(
                                'moneda a elegir',
                                event.target.value,
                              );
                              setMoneyToConvert(event.target.value);
                            }}
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
                        <DateTimePicker
                          renderInput={(params) => (
                            <TextField
                              sx={{position: 'relative', bottom: '-8px'}}
                              {...params}
                            />
                          )}
                          required
                          value={issueDate}
                          label='Fecha de emisión'
                          disabled
                          inputFormat='dd/MM/yyyy hh:mm a'
                          name='issueDate'
                          onChange={(newValue) => {
                            setIssueDate(newValue);
                            console.log('date', newValue);
                          }}
                        />
                      </Grid>

                      <Grid item xs={6} sx={{mb: 2}}>
                        <DateTimePicker
                          renderInput={(params) => (
                            <TextField
                              sx={{position: 'relative', bottom: '-8px'}}
                              {...params}
                            />
                          )}
                          required
                          value={expirationDate}
                          label='Fecha de vencimiento'
                          inputFormat='dd/MM/yyyy hh:mm a'
                          name='issueDate'
                          onChange={(newValue) => {
                            setExpirationDate(newValue);
                            console.log('date', newValue);
                          }}
                        />
                      </Grid>

                      <Grid item xs={6}>
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
                      <Grid item xs={6}>
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
                      {/* <Grid
                    item
                    xs={4}
                    sx={{display: 'flex', alignItems: 'center'}}
                  >
                    <FormControlLabel
                      label='IGV'
                      control={<Checkbox onChange={handleIGV} />}
                    />
                  </Grid> */}

                      <Grid item xs={8}>
                        <Button
                          sx={{width: 1}}
                          variant='outlined'
                          onClick={() => {
                            setShowDialog(true);
                            setTypeDialog('client');
                          }}
                        >
                          Selecciona un cliente
                        </Button>
                      </Grid>
                      <Grid item xs={4} sx={{textAlign: 'center'}}>
                        <Typography sx={{mx: 'auto', my: '10px'}}>
                          {selectedClient.denominationClient}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          sx={{width: 1}}
                          variant='outlined'
                          onClick={() => {
                            setShowDialog(true);
                            setTypeDialog('product');
                          }}
                        >
                          Añade productos
                        </Button>
                      </Grid>
                    </Grid>

                    <OutputProducts
                      data={selectedProducts}
                      toDelete={removeProduct}
                      valueWithIGV={valueWithIGV}
                      igvEnabled={Number(query.igv) > 0 || query.igv == 'true'}
                    ></OutputProducts>
                    <Divider sx={{my: 3}} />

                    <Grid
                      container
                      spacing={2}
                      sx={{width: 500, margin: 'auto'}}
                    >
                      {/*   <Grid item xs={12}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel id='typeNote-label' style={{fontWeight: 200}}>
                        {`Tipo de nota de ${creditNote ? 'crédito' : 'débito'}`}
                      </InputLabel>
                      <Select
                        name='typeNote'
                        labelId='typeNote-label'
                        label='Tipo de nota de crédito'
                        onChange={setSubType}
                        value={subTypeNote}
                        displayEmpty
                      >
                        {creditNoteTypes.map((obj, index) => {
                          let show =
                            (creditNote && obj.typeNote == 'credit') ||
                            (!creditNote && obj.typeNote == 'debit');
                          if (show) {
                            return (
                              <MenuItem
                                value={obj.name}
                                key={index}
                                style={{fontWeight: 200}}
                              >
                                {translateValue('SUBTYPENOTE', obj.name)}
                              </MenuItem>
                            );
                          } else {
                            return null;
                          }
                        })}
                      </Select>
                    </FormControl>
                  </Grid> */}
                      {creditNote ? (
                        <Grid item xs={12}>
                          <FormControl fullWidth sx={{my: 2}}>
                            <InputLabel
                              id='typeNote-label'
                              style={{fontWeight: 200}}
                            >
                              Tipo de nota de crédito
                            </InputLabel>
                            <Select
                              name='typeNote'
                              labelId='typeNote-label'
                              label='Tipo de nota de crébito'
                              value={subTypeNote}
                              onChange={setSubType}
                              displayEmpty
                            >
                              {creditNoteTypes.map((obj, index) => {
                                if (obj.typeNote == 'credit') {
                                  return (
                                    <MenuItem
                                      value={obj.name}
                                      key={index}
                                      style={{fontWeight: 200}}
                                    >
                                      {translateValue('SUBTYPENOTE', obj.name)}
                                    </MenuItem>
                                  );
                                }
                              })}
                            </Select>
                          </FormControl>
                        </Grid>
                      ) : null}
                      {!creditNote ? (
                        <Grid item xs={12}>
                          <FormControl fullWidth sx={{my: 2}}>
                            <InputLabel
                              id='typeNote-label'
                              style={{fontWeight: 200}}
                            >
                              Tipo de nota de débito
                            </InputLabel>
                            <Select
                              name='typeNote'
                              labelId='typeNote-label'
                              label='Tipo de nota de débito'
                              value={subTypeNote}
                              onChange={setSubType}
                              displayEmpty
                            >
                              {creditNoteTypes.map((obj, index) => {
                                if (obj.typeNote == 'debit') {
                                  return (
                                    <MenuItem
                                      value={obj.name}
                                      key={index}
                                      style={{fontWeight: 200}}
                                    >
                                      {translateValue('SUBTYPENOTE', obj.name)}
                                    </MenuItem>
                                  );
                                }
                              })}
                            </Select>
                          </FormControl>
                        </Grid>
                      ) : null}
                      <Grid item xs={12}>
                        <Button
                          sx={{width: 1}}
                          variant='outlined'
                          onClick={() => {
                            setShowDialog(true);
                            setTypeDialog('document');
                          }}
                        >
                          Añadir guía de remisión
                        </Button>
                      </Grid>
                    </Grid>

                    <Box sx={{my: 5}}>
                      <DocumentsTable
                        arrayObjs={listDocuments}
                        toDelete={removeDocument}
                      />
                    </Box>

                    <Grid
                      container
                      spacing={2}
                      sx={{width: 500, margin: 'auto'}}
                    >
                      <Grid item xs={12}>
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
                      <Grid item xs={12}>
                        <Typography sx={{mx: 'auto', my: '10px'}}>
                          {`Se generara una nota de ${
                            creditNote ? 'crédito' : 'débito'
                          }`}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Divider sx={{my: 3}} />

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
                        {typeAlert == 'client'
                          ? 'Por favor selecciona un cliente.'
                          : null}
                        {typeAlert == 'typeNote'
                          ? 'Por favor selecciona un tipo de nota.'
                          : null}
                      </Alert>
                    </Collapse>

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
                              window.open('https://youtu.be/amxeIBPB48Q')
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
                              window.open('https://www.youtube.com/')
                            }
                          >
                            VER TUTORIAL
                          </IconButton>
                        </Box>
                      </Box>
                    )}
                  </>
                ) : (
                  <AppLoader />
                )}
              </Form>
            );
          }}
        </Formik>
      </Box>

      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        {typeDialog == 'client' ? (
          <>
            <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
              {'Selecciona un cliente'}
              <CancelOutlinedIcon
                onClick={() => setShowDialog(false)}
                sx={{
                  cursor: 'pointer',
                  float: 'right',
                  marginTop: '5px',
                  width: '20px',
                }}
              />
            </DialogTitle>
            <DialogContent>
              <AddClientForm sendData={getClient} />
            </DialogContent>
          </>
        ) : null}
        {typeDialog == 'document' ? (
          <>
            <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
              {'Ingresa los datos de documento'}
              <CancelOutlinedIcon
                onClick={() => setShowDialog(false)}
                sx={{
                  cursor: 'pointer',
                  float: 'right',
                  marginTop: '5px',
                  width: '20px',
                }}
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
        {typeDialog == 'product' ? (
          <>
            <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
              {'Selecciona un producto'}
              <CancelOutlinedIcon
                onClick={() => setShowDialog(false)}
                sx={{
                  cursor: 'pointer',
                  float: 'right',
                  marginTop: '5px',
                  width: '20px',
                }}
              />
            </DialogTitle>
            <DialogContent>
              <AddProductForm type='input' sendData={getNewProduct} />
            </DialogContent>
          </>
        ) : null}
      </Dialog>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='xl'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          <Box sx={{mx: 10}}>
            {typeResult == 'statusResult'
              ? `Registro de Nota de ${creditNote ? 'crédito' : 'débito'}`
              : null}
          </Box>
          <IconButton
            aria-label='close'
            onClick={closeDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {typeResult == 'statusResult' ? (
          showMessage()
        ) : (
          <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
            {typeResult == 'confirmCancel' ? showCancelMessage() : null}
          </DialogContent>
        )}

        <DialogActions sx={{justifyContent: 'center'}}>
          {typeResult == 'confirmCancel' ? (
            <>
              <Button
                variant='outlined'
                onClick={() => {
                  Router.push('/sample/receipts/table');
                }}
              >
                Sí
              </Button>
              <Button variant='outlined' onClick={() => setOpenDialog(false)}>
                No
              </Button>
            </>
          ) : null}
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default GetCreditNote;
