import React, {useState, useEffect, useCallback, useRef} from 'react';
import {makeStyles} from '@mui/styles';
import * as yup from 'yup';
import {Form, Formik} from 'formik';
import AppPage from '../../../@crema/hoc/AppPage';
import AppPageMeta from '../../../@crema/core/AppPageMeta';

import {ClickAwayListener} from '@mui/base';
import YouTubeIcon from '@mui/icons-material/YouTube';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import AppUpperCaseTextField from '../../../@crema/core/AppFormComponents/AppUpperCaseTextField';
import SchoolIcon from '@mui/icons-material/School';
import {translateValue} from '../../../Utils/utils';
import {
  Button,
  ButtonGroup,
  Select,
  Box,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Card,
  IconButton,
  Collapse,
  Alert,
  Dialog,
  Grid,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Typography,
  Divider,
  Tooltip,
} from '@mui/material';
import AddPayment from './AddPayment';
import AddOtherPayConcept from './AddOtherPayConcept';

import {orange} from '@mui/material/colors';
import PaymentsTable from './PaymentsTable';
import OtherPayConceptsTable from './OtherPayConceptsTable';

import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import {red} from '@mui/material/colors';

import {onGetBusinessParameter} from '../../../redux/actions/General';
import {useDispatch, useSelector} from 'react-redux';
import Router, {useRouter} from 'next/router';
import {DesktopDatePicker, DateTimePicker} from '@mui/lab';
import {width} from '@mui/system';

import AddClientForm from '../ClientSelection/AddClientForm';
import {addFinance} from '../../../redux/actions/Finances';
import {
  convertToDateWithoutTime,
  isObjEmpty,
  toEpoch,
  simpleDateToDateObj,
} from '../../../Utils/utils';
import {getMovements} from '../../../redux/actions/Movements';
import {
  FETCH_SUCCESS,
  GET_FINANCES,
  FETCH_ERROR,
  ADD_FINANCE,
} from '../../../shared/constants/ActionTypes';
import {useIntl} from 'react-intl';

import DocumentsTableForFinance from '../DocumentSelector/DocumentsTableForFinance';
import AddDocumentFormForFinance from '../DocumentSelector/AddDocumentFormForFinance';
const useStyles = makeStyles((theme) => ({
  closeButton: {
    cursor: 'pointer',
    float: 'right',
    marginTop: '5px',
    width: '20px',
  },
}));

const maxLengthNumber = 111111111111; //11 caracteres
const validationSchema = yup.object({
  nroBill: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  saleDetail: yup
    .string()
    .required(<IntlMessages id='validation.required' />)
    .typeError(<IntlMessages id='validation.string' />),
  saleObservation: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
  totalAmount: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .test(
      'maxDigitsAfterDecimal',
      'El número puede contener como máximo 3 decimales',
      (number) => /^\d+(\.\d{1,3})?$/.test(number),
    )
    .required(<IntlMessages id='validation.required' />),
  totalNet: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .test(
      'maxDigitsAfterDecimal',
      'El número puede contener como máximo 3 decimales',
      (number) => /^\d+(\.\d{1,3})?$/.test(number),
    )
    .required(<IntlMessages id='validation.required' />),
  totalIgv: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .test(
      'maxDigitsAfterDecimal',
      'El número puede contener como máximo 3 decimales',
      (number) => /^\d+(\.\d{1,3})?$/.test(number),
    )
    .required(<IntlMessages id='validation.required' />),
});
let listPayments = [];
let listOtherPayConcepts = [];
let typeAlert = '';
let selectedOutput = {};
const NewEarning = (props) => {
  //VARIABLES DE PARAMETROS
  let changeValueField;
  let getValueField;
  let isFormikSubmitting;
  let setFormikSubmitting;

  const router = useRouter();
  const {query} = router;
  const {messages} = useIntl();
  console.log('query', query);
  const [typeDialog, setTypeDialog] = React.useState('');
  const [selectedClient, setSelectedClient] = React.useState({});
  const [openStatus, setOpenStatus] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [showPayments, setShowPayments] = React.useState(/* false */ true);
  const [showOtherPayConcepts, setShowOtherPayConcepts] = React.useState(
    /* false */ true,
  );
  const [moneyUnit, setMoneyUnit] = React.useState('');
  const [showAlert, setShowAlert] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState('cash');
  const [conceptAction, setConceptAction] = React.useState('add');
  const [statusEarning, setStatusEarning] = React.useState('paid');
  const [listDocuments, setListDocuments] = React.useState([]);
  const [purchaseType, setPurchaseType] = React.useState('cash');
  const [tooltip, setTooltip] = React.useState(false);
  const [totalAmount, setTotalAmount] = React.useState(0);
  const [totalAmountWithConcepts, setTotalAmountWithConcepts] =
    React.useState(0);
  const [totalAmountOfConcepts, setTotalAmountOfConcepts] = React.useState(0);
  const [minTutorial, setMinTutorial] = React.useState(false);
  const [typeIcon, setTypeIcon] = React.useState('2');
  const [proofOfPaymentType, setProofOfPaymentType] = React.useState('bill');
  const dispatch = useDispatch();
  const {getMovementsRes} = useSelector(({movements}) => movements);
  console.log('getMovementsRes', getMovementsRes);
  const {outputItems_pageListOutput} = useSelector(({movements}) => movements);
  console.log('outputItems_pageListOutput', outputItems_pageListOutput);
  const [openClientComprobation, setOpenClientComprobation] =
    React.useState(false);
  const [isClientValidated, setIsClientValidated] = React.useState(false);

  useEffect(() => {
    getBusinessParameter(businessParameterPayload);
    listPayments = [];
    console.log('query', query);
    console.log('query1', isObjEmpty(query));
    setSelectedClient(
      isObjEmpty(query)
        ? {}
        : {
            clientId: query.clientId,
            denominationClient:
              query.clientName ||
              selectedOutput.clientName ||
              query.denominationClient,
          },
    );
    listOtherPayConcepts = [];
    console.log('selectedClient', selectedClient);
    setTimeout(() => {
      // setMinTutorial(true);
      setTypeIcon('1');
    }, 4000);
  }, []);
  if (!isObjEmpty(query) && outputItems_pageListOutput != undefined) {
    selectedOutput = outputItems_pageListOutput.find(
      (output) => output.movementHeaderId == query.movementHeaderId,
    );
    console.log('selectedOutput', selectedOutput);
  }
  const classes = useStyles(props);
  const [value, setValue] = React.useState(Date.now());
  const parseToGoodDate = (date) => {
    if (isNaN(date)) {
      return toEpoch(simpleDateToDateObj(date));
    } else {
      return Number(date);
    }
  };

  const bill =
    selectedOutput && selectedOutput.documentsMovement !== undefined
      ? selectedOutput.documentsMovement.find(
          (obj) => obj.typeDocument == 'bill',
        )
      : {issueDate: '', serialDocument: '', typeDocument: ''};
  console.log('El bill', bill);
  const [value2, setValue2] = React.useState(
    isObjEmpty(query) || bill == undefined || bill.issueDate == undefined
      ? Date.now()
      : parseToGoodDate(bill.issueDate),
  );
  const [proofOfPaymentDueDate, setProofOfPaymentDueDate] = React.useState(
    isObjEmpty(query) || bill == undefined || bill.dueDate == undefined
      ? Date.now()
      : parseToGoodDate(bill.dueDate),
  );

  const [proofTransactionDate, setProofTransactionDate] = React.useState(
    Date.now(),
  );

  const changeIcon = () => {
    setTypeIcon('2');
  };
  const changeIcon2 = () => {
    setTypeIcon('1');
  };
  const iconSelected = () => {
    if (typeIcon == '1') {
      return (
        <>
          <SchoolIcon fontSize='inherit' />
        </>
      );
    } else if (typeIcon == '2') {
      return <>VER TUTORIAL</>;
    }
  };
  const toAddFinance = (payload, jwtToken) => {
    dispatch(addFinance(payload, jwtToken));
  };
  const getBusinessParameter = (payload) => {
    dispatch(onGetBusinessParameter(payload));
  };
  const toGetMovements = (payload) => {
    dispatch(getMovements(payload));
  };

  const useForceUpdate = () => {
    const [reload, setReload] = React.useState(0); // integer state
    return () => setReload((val) => val + 1); // update the state to force render
  };
  const forceUpdate = useForceUpdate();

  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  const {businessParameter} = useSelector(({general}) => general);
  console.log('businessParameter', businessParameter);
  const {addFinanceRes} = useSelector(({finances}) => finances);
  console.log('addFinanceRes', addFinanceRes);
  const {successMessage} = useSelector(({finances}) => finances);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({finances}) => finances);
  console.log('errorMessage', errorMessage);
  const {jwtToken} = useSelector(({general}) => general);

  useEffect(() => {
    if (businessParameter != undefined) {
      let obtainedMoneyUnit = businessParameter.find(
        (obj) => obj.abreParametro == 'DEFAULT_MONEY_UNIT',
      ).value;
      setMoneyUnit(obtainedMoneyUnit);
      console.log('moneyUnit', moneyUnit);
    }
  }, [businessParameter != undefined]);

  useEffect(() => {
    const documentsMovement =
      selectedOutput && selectedOutput.documentsMovement !== undefined
        ? selectedOutput.documentsMovement
        : [];
    console.log('Documents Movement', documentsMovement);
    setListDocuments(documentsMovement);
  }, [selectedOutput]);
  const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const getActualMonth = () => {
    let d = new Date();
    let name = month[d.getMonth()];
    return name;
  };

  const getYear = () => {
    return new Date().getFullYear();
  };

  const defaultValues = {
    nroDocument: '',
    name: '',
    nroBill:
      isObjEmpty(query) || bill == undefined || bill.serialDocument == undefined
        ? ''
        : bill.serialDocument,
    saleDetail: '',
    saleObservation: '',
    totalAmount: isObjEmpty(query) ? null : Number(query.totalPriceWithIgv),
    totalAmountWithConcepts: isObjEmpty(query)
      ? 0
      : Number(query.totalAmountWithConcepts),
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
  let anotherValues = {
    registerDate: Number.isInteger(value) ? value : toEpoch(value),
    billDate: Number.isInteger(value2) ? value : toEpoch(value2),
    state: 'paid',
    conceptAction: 'add',
  };
  let newFinancePayload = {
    request: {
      payload: {
        merchantId: userDataRes.merchantSelected.merchantId,
        movements: [
          {
            /* createdAt: null, */
            monthMovement: getActualMonth(),
            yearMovement: getYear(),
            movementType: 'INCOME',
            providerId: '',
            numberDocumentProvider: '',
            typeDocumentProvider: 'RUC',
            denominationProvider: '',
            proofIssueDate: '',
            proofDueDate: '',
            proofTransactionDate: '',
            serialNumberBill: '',
            description: '',
            unitMeasureMoney: moneyUnit,
            totalAmount: null,
            status: '',
            purchaseType: '',
            payments: [],
            otherPayConcepts: [],
            observation: '',
            movementHeaderId: '',
          },
        ],
      },
    },
  };

  const handleData = (data, client) => {
    let localIsClientValidated = isClientValidated;
    if (
      Object.keys(selectedClient).length != 0 &&
      selectedClient.clientId.length != 0
    ) {
      setIsClientValidated(true);
      localIsClientValidated = true;
    } else {
      setOpenClientComprobation(true);
      setFormikSubmitting(false);
    }

    console.log('selectedClient:', selectedClient);

    if (localIsClientValidated || client == 'enabled') {
      // if (listPayments.length > 0) {
      setFormikSubmitting(true);

      if (Object.keys(selectedClient).length == 0) selectedClient.clientId = '';

      console.log('Data', data);
      console.log('anotherValues', anotherValues);
      newFinancePayload.request.payload.movements[0].outputUserCreated =
        selectedOutput.userCreated;
      newFinancePayload.request.payload.movements[0].outputUserCreatedMetadata =
        selectedOutput.userCreatedMetadata;
      newFinancePayload.request.payload.movements[0].proofOfPaymentUserCreated =
        selectedOutput.proofOfPaymentUserCreated || '';
      newFinancePayload.request.payload.movements[0].proofOfPaymentUserCreatedMetadata =
        selectedOutput.proofOfPaymentUserCreatedMetadata || '';
      (newFinancePayload.request.payload.movements[0].contableMovements =
        selectedOutput.contableMovements || []),
        (newFinancePayload.request.payload.movements[0].numberDocumentProvider =
          selectedClient.clientId.length != 0
            ? selectedClient.clientId.split('-')[1]
            : '');
      newFinancePayload.request.payload.movements[0].denominationProvider =
        selectedClient.clientId.length != 0
          ? selectedClient.denominationClient
          : '';
      newFinancePayload.request.payload.movements[0].providerId =
        selectedClient.clientId;
      newFinancePayload.request.payload.movements[0].typeDocumentProvider =
        selectedClient.clientId.length != 0
          ? selectedClient.clientId.split('-')[0]
          : '';
      newFinancePayload.request.payload.movements[0].proofIssueDate =
        convertToDateWithoutTime(value2);
      newFinancePayload.request.payload.movements[0].proofDueDate =
        convertToDateWithoutTime(proofOfPaymentDueDate);
      newFinancePayload.request.payload.movements[0].proofTransactionDate =
        convertToDateWithoutTime(proofTransactionDate);
      newFinancePayload.request.payload.movements[0].serialNumberBill =
        getValueField('nroBill').value; //data.nroBill;
      newFinancePayload.request.payload.movements[0].description =
        getValueField('saleDetail').value; //data.saleDetail;
      newFinancePayload.request.payload.movements[0].observation =
        getValueField('saleObservation').value; //data.saleObservation;
      newFinancePayload.request.payload.movements[0].totalAmount = Number(
        getValueField('totalAmount').value, //data.totalAmount,
      );
      newFinancePayload.request.payload.movements[0].totalNet = Number(
        getValueField('totalNet').value, //data.totalAmount,
      );
      newFinancePayload.request.payload.movements[0].totalIgv = Number(
        getValueField('totalIgv').value, //data.totalAmount,
      );
      newFinancePayload.request.payload.movements[0].documentsMovement =
        listDocuments;
      newFinancePayload.request.payload.movements[0].status = statusEarning;
      newFinancePayload.request.payload.movements[0].movementHeaderId =
        !isObjEmpty(query) && query.movementHeaderId
          ? query.movementHeaderId
          : null;
      /* if (!showPayments) {
          newFinancePayload.request.payload.movements[0].payments = [];
        } else { */
      newFinancePayload.request.payload.movements[0].payments = [];
      newFinancePayload.request.payload.movements[0].otherPayConcepts = [];
      newFinancePayload.request.payload.movements[0].methodToPay =
        paymentMethod;
      newFinancePayload.request.payload.movements[0].transactionNumber =
        getValueField('transactionNumber').value; //data.transactionNumber,
      newFinancePayload.request.payload.movements[0].purchaseType =
        purchaseType;
      (newFinancePayload.request.payload.movements[0].userCreated =
        userDataRes.userId),
        (newFinancePayload.request.payload.movements[0].userCreatedMetadata = {
          nombreCompleto: userDataRes.nombreCompleto,
          email: userDataRes.email,
        });
      newFinancePayload.request.payload.movements[0].proofOfPaymentType =
        proofOfPaymentType;
      listPayments.map((obj, index) => {
        newFinancePayload.request.payload.movements[0].payments.push({
          descriptionPayment: obj.description,
          transactionNumber: obj.transactionNumber,
          paymentMethod: obj.paymentMethod,
          payDate: convertToDateWithoutTime(obj.payDate),
          expirationDate: convertToDateWithoutTime(obj.expirationDate),
          numInstallment: index + 1,
          amount: obj.amount,
          statusPayment: obj.statePayment,
        });
      });
      listOtherPayConcepts.map((obj, index) => {
        newFinancePayload.request.payload.movements[0].otherPayConcepts.push({
          descriptionPayment: obj.description,
          transactionNumber: obj.transactionNumber,
          paymentMethod: obj.paymentMethod,
          conceptAction: obj.conceptAction,
          commentPayment: obj.commentPayment,
          payDate: convertToDateWithoutTime(obj.payDate),
          expirationDate: convertToDateWithoutTime(obj.expirationDate),
          numInstallment: index + 1,
          amount: obj.amount,
          statusPayment: obj.statePayment,
        });
      });
      /* } */
      console.log('newFinancePayload', newFinancePayload);
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      dispatch({type: ADD_FINANCE, payload: undefined});
      toAddFinance(newFinancePayload, jwtToken);
      setTimeout(() => {
        setOpenStatus(true);
      }, 1000);
      // } else {
      //   typeAlert = 'faltaPayment';
      //   setShowAlert(true);
      // }
      setFormikSubmitting(false);
    } /*else {
      typeAlert = 'client';
      setShowAlert(true);
    }*/
    /* } else {
      typeAlert = 'faltaPayment';
      setShowAlert(true);
    } */
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleClickOpen = (type) => {
    setOpen(true);
    setTypeDialog(type);
    setShowAlert(false);
  };

  const addPayment = (payment) => {
    console.log('Payment', payment);
    listPayments.push(payment);
    console.log('listPayments', listPayments);
    forceUpdate();
  };

  const addOtherPayConcept = (otherPayConcept) => {
    listOtherPayConcepts.push(otherPayConcept);
    let totalOtherPayConcepts = 0;
    listOtherPayConcepts.forEach((obj) => {
      if (obj.conceptAction == 'add') {
        console.log('Hola x2', obj.amount);
        totalOtherPayConcepts = totalOtherPayConcepts + obj.amount;
      } else {
        totalOtherPayConcepts = totalOtherPayConcepts - obj.amount;
      }
    });
    const newTotalOtherPayConcepts = totalAmount + totalOtherPayConcepts;
    setTotalAmountOfConcepts(totalOtherPayConcepts);
    changeValueField('totalAmountWithConcepts', newTotalOtherPayConcepts);
    forceUpdate();
  };

  const registerSuccess = () => {
    return (
      successMessage != undefined &&
      addFinanceRes != undefined &&
      !('error' in addFinanceRes)
    );
  };
  const registerError = () => {
    return (
      (successMessage != undefined &&
        addFinanceRes &&
        'error' in addFinanceRes) ||
      errorMessage
    );
  };
  const sendStatus = () => {
    if (registerSuccess()) {
      Router.push('/sample/contableMovements');
      setOpenStatus(false);
    } else if (registerError()) {
      setOpenStatus(false);
    } else {
      setOpenStatus(false);
    }
  };
  const handleClickAway = () => {
    // Evita que se cierre el diálogo haciendo clic fuera del contenido
    // Puedes agregar condiciones adicionales aquí si deseas una lógica más específica.
  };
  const showMessage = () => {
    if (registerSuccess()) {
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
    } else if (registerError()) {
      return (
        <>
          <CancelOutlinedIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            Se ha producido un error al registrar. <br />
            {addFinanceRes !== undefined && 'error' in addFinanceRes
              ? addFinanceRes.error
              : null}
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink sx={{mx: 'auto', my: '20px'}} />;
    }
  };

  /* const sendStatus = () => {
    setOpenStatus(false);
    Router.push('/sample/finances/table');
  }; */

  const cancel = () => {
    /* Router.push('/sample/inputs/table'); */
    setOpen2(true);
  };

  const getClient = (client) => {
    setSelectedClient(client);
    console.log('Cliente seleccionado', client);
    setOpen(false);
  };

  const getDocument = (document) => {
    console.log('Documento seleccionado', document);
    let newListDocuments = listDocuments;
    newListDocuments.push(document);
    setListDocuments(newListDocuments);
    forceUpdate();
  };
  const removeDocument = (index) => {
    let newListDocuments = listDocuments;
    newListDocuments.splice(index, 1);
    setListDocuments(newListDocuments);
    forceUpdate();
  };

  const removePayment = (index) => {
    console.log('index', index);
    listPayments.splice(index, 1);
    console.log('Listado de pagos', listPayments.length);
    forceUpdate();
  };

  const removeOtherPayConcept = (index) => {
    console.log('index', index);
    listOtherPayConcepts.splice(index, 1);
    console.log(
      'Listado de otros conceptos de pago',
      listOtherPayConcepts.length,
    );
    forceUpdate();
  };

  const handleChange = (event) => {
    if (event.target.name == 'totalAmount') {
      const ActualTotalAmount = Number(event.target.value);
      const newTotalOtherPayConcepts =
        ActualTotalAmount + totalAmountOfConcepts;
      setTotalAmountWithConcepts(newTotalOtherPayConcepts);
      setTotalAmount(ActualTotalAmount);
      changeValueField('totalAmountWithConcepts', newTotalOtherPayConcepts);
      // if (paymentMethod == 'cash' && event.target.value > 2000) {
      //   setPaymentMethod('debit');
      // }
    }
    // if (event.target.name == 'totalAmount') {
    //   setTotalAmountWithConcepts(event.target.value);
    // }
  };

  return (
    <Card sx={{p: 4}}>
      <Box sx={{width: 1, textAlign: 'center'}}>
        <Typography
          sx={{mx: 'auto', my: '10px', fontWeight: 600, fontSize: 25}}
        >
          REGISTRO DE INGRESO
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
                style={{textAlign: 'center', marginTop: 4}}
                noValidate
                autoComplete='on'
                onChange={handleChange}
              >
                <Grid
                  container
                  spacing={2}
                  sx={{maxWidth: 500, width: 'auto', margin: 'auto'}}
                >
                  <Grid item xs={12} sx={{mt: 4}}>
                    <Button
                      sx={{width: 1}}
                      variant='outlined'
                      onClick={handleClickOpen.bind(this, 'client')}
                    >
                      Selecciona un cliente
                    </Button>
                  </Grid>
                  <Grid item xs={12} sx={{textAlign: 'center'}}>
                    <Typography
                      sx={{
                        mx: 'auto',
                      }}
                    >
                      {selectedClient.denominationClient}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel
                        id='proofOfPaymentType-label'
                        style={{fontWeight: 200}}
                      >
                        Tipo de Comprobante
                      </InputLabel>
                      <Select
                        sx={{textAlign: 'left'}}
                        value={proofOfPaymentType}
                        onChange={(event) => {
                          console.log(
                            'Tipo de comprobante de pago',
                            event.target.value,
                          );
                          setProofOfPaymentType(event.target.value);
                        }}
                        name='proofOfPaymentType'
                        labelId='proofOfPaymentType-label'
                        label='Tipo de Comprobante'
                      >
                        <MenuItem value='bill' style={{fontWeight: 200}}>
                          {messages['finance.proofOfPayment.type.bill']}
                        </MenuItem>
                        <MenuItem value='receipt' style={{fontWeight: 200}}>
                          {messages['finance.proofOfPayment.type.receipt']}
                        </MenuItem>
                        <MenuItem value='ticket' style={{fontWeight: 200}}>
                          {messages['finance.proofOfPayment.type.ticket']}
                        </MenuItem>
                        <MenuItem
                          value='paymentOrder'
                          style={{fontWeight: 200}}
                        >
                          {messages['finance.proofOfPayment.type.paymentOrder']}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <AppUpperCaseTextField
                      label={
                        proofOfPaymentType
                          ? translateValue(
                              'PROOFOFPAYMENTNUMBER',
                              proofOfPaymentType.toUpperCase(),
                            )
                          : null
                      }
                      name='nroBill'
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
                  <Grid item xs={12}>
                    <DesktopDatePicker
                      renderInput={(params) => (
                        <TextField
                          sx={{
                            my: 2,
                            width: '100%',
                            position: 'relative',
                            bottom: '-8px',
                          }}
                          {...params}
                        />
                      )}
                      required
                      sx={{my: 2}}
                      value={value2}
                      label={
                        proofOfPaymentType
                          ? translateValue(
                              'PROOFOFPAYMENTDATE',
                              proofOfPaymentType.toUpperCase(),
                            )
                          : null
                      }
                      /* maxDate={new Date()} */
                      inputFormat='dd/MM/yyyy'
                      name='initialDate'
                      onChange={(newValue) => {
                        setValue2(newValue);
                        console.log('date', newValue);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <DesktopDatePicker
                      renderInput={(params) => (
                        <TextField
                          sx={{
                            my: 2,
                            width: '100%',
                            position: 'relative',
                            bottom: '-8px',
                          }}
                          {...params}
                        />
                      )}
                      required
                      sx={{my: 2}}
                      value={proofOfPaymentDueDate}
                      label={
                        proofOfPaymentType
                          ? translateValue(
                              'PROOFOFPAYMENTDUEDATE',
                              proofOfPaymentType.toUpperCase(),
                            )
                          : null
                      }
                      inputFormat='dd/MM/yyyy'
                      name='proofOfPaymentDueDate'
                      onChange={(newValue) => {
                        setProofOfPaymentDueDate(newValue);
                        console.log('proofOfPaymentDueDate', newValue);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <DesktopDatePicker
                      renderInput={(params) => (
                        <TextField
                          sx={{
                            my: 2,
                            width: '100%',
                            position: 'relative',
                            bottom: '-8px',
                          }}
                          {...params}
                        />
                      )}
                      required
                      sx={{my: 2}}
                      value={proofTransactionDate}
                      label={
                        proofOfPaymentType
                          ? translateValue(
                              'COLLECTIONTRANSACTIONDATE',
                              proofOfPaymentType.toUpperCase(),
                            )
                          : 'Fecha de pago del movimiento'
                      }
                      inputFormat='dd/MM/yyyy'
                      name='proofTransactionDate'
                      onChange={(newValue) => {
                        setProofTransactionDate(newValue);
                        console.log('proofTransactionDate', newValue);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <AppTextField
                      label='Detalle de venta'
                      name='saleDetail'
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

                  <Grid item xs={12}>
                    <AppTextField
                      label='Observaciones'
                      name='saleObservation'
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
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel
                        id='purchaseType-label'
                        style={{fontWeight: 200}}
                      >
                        Tipo de compra
                      </InputLabel>
                      <Select
                        sx={{textAlign: 'left'}}
                        value={purchaseType}
                        onChange={(event) => {
                          console.log('tipo de compra', event.target.value);
                          setPurchaseType(event.target.value);
                        }}
                        name='purchaseType'
                        labelId='purchaseType-label'
                        label='Tipo de compra'
                      >
                        <MenuItem value='cash' style={{fontWeight: 200}}>
                          {messages['finance.purchase.type.cash']}
                        </MenuItem>
                        <MenuItem value='credit' style={{fontWeight: 200}}>
                          {messages['finance.purchase.type.credit']}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth sx={{my: 2}}>
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
                        <MenuItem value='bankDeposit' style={{fontWeight: 200}}>
                          <IntlMessages id='common.bankDeposit' />
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
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
                        my: 2,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <AppTextField
                      label={
                        proofOfPaymentType
                          ? translateValue(
                              'PROOFOFPAYMENTTOTALNET',
                              proofOfPaymentType.toUpperCase(),
                            )
                          : null
                      }
                      name='totalNet'
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
                  <Grid item xs={12}>
                    <AppTextField
                      label={
                        proofOfPaymentType
                          ? translateValue(
                              'PROOFOFPAYMENTTOTALIGV',
                              proofOfPaymentType.toUpperCase(),
                            )
                          : null
                      }
                      name='totalIgv'
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
                  <Grid item xs={12}>
                    <AppTextField
                      label={
                        proofOfPaymentType
                          ? translateValue(
                              'PROOFOFPAYMENTTOTALAMOUNT',
                              proofOfPaymentType.toUpperCase(),
                            )
                          : null
                      }
                      name='totalAmount'
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

                  <Grid item xs={showPayments ? 8 : 12}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel
                        id='categoria-label'
                        style={{fontWeight: 200}}
                      >
                        {proofOfPaymentType
                          ? translateValue(
                              'PROOFOFPAYMENTPAYSTATUS',
                              proofOfPaymentType.toUpperCase(),
                            )
                          : null}
                      </InputLabel>
                      <Select
                        sx={{textAlign: 'left'}}
                        value={statusEarning}
                        onChange={(event) => {
                          //console.log('evento', event.target.value);
                          anotherValues.state = event.target.value;
                          setStatusEarning(event.target.value);
                          /* if (event.target.value == 'advance') {
                          setShowPayments(true);
                        } else {
                          setShowPayments(false);
                        } */
                        }}
                        name='state'
                        labelId='state-label'
                        label='Estado de Cobro de Factura'
                      >
                        <MenuItem value='paid' style={{fontWeight: 200}}>
                          COBRADO
                        </MenuItem>
                        <MenuItem value='advance' style={{fontWeight: 200}}>
                          ADELANTO
                        </MenuItem>
                        <MenuItem value='toPaid' style={{fontWeight: 200}}>
                          POR COBRAR
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={showPayments ? 4 : 12}>
                    {showPayments ? (
                      <Button
                        sx={{width: 1, my: 2, p: 3}}
                        size='large'
                        variant='outlined'
                        onClick={handleClickOpen.bind(this, 'payments')}
                      >
                        Añadir pago
                      </Button>
                    ) : (
                      <></>
                    )}
                  </Grid>
                </Grid>

                {showPayments ? (
                  <PaymentsTable
                    toDelete={removePayment}
                    arrayObjs={listPayments}
                  />
                ) : (
                  <></>
                )}
                <Grid
                  container
                  spacing={2}
                  sx={{maxWidth: 500, width: 'auto', margin: 'auto'}}
                >
                  <Grid item xs={6}>
                    <AppTextField
                      label='Monto a Cobrar/Pagar'
                      name='totalAmountWithConcepts'
                      variant='outlined'
                      disabled
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                      }}
                    />
                  </Grid>
                  <Grid item xs={showOtherPayConcepts ? 6 : 6}>
                    {showOtherPayConcepts ? (
                      <Button
                        sx={{width: 1, my: 2, p: 3}}
                        size='large'
                        variant='outlined'
                        onClick={handleClickOpen.bind(this, 'otherPayConcepts')}
                      >
                        Añadir Otros Conceptos
                      </Button>
                    ) : (
                      <></>
                    )}
                  </Grid>
                </Grid>

                {showOtherPayConcepts ? (
                  <OtherPayConceptsTable
                    toDelete={removeOtherPayConcept}
                    arrayObjs={listOtherPayConcepts}
                  />
                ) : (
                  <></>
                )}

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
                    {/* {typeAlert == 'faltaPayment'
                    ? 'Por favor ingrese al menos un pago.'
                    : null} */}
                    {typeAlert == 'client'
                      ? 'Por favor selecciona un cliente.'
                      : null}
                  </Alert>
                </Collapse>

                <Grid
                  container
                  spacing={2}
                  sx={{maxWidth: 500, width: 'auto', margin: 'auto'}}
                >
                  <Grid item xs={12}>
                    <Button
                      sx={{width: 1}}
                      variant='outlined'
                      onClick={handleClickOpen.bind(this, 'document')}
                    >
                      Añade comprobantes secundarios
                    </Button>
                  </Grid>

                  <Grid item xs={12} sx={{my: 5}}>
                    <DocumentsTableForFinance
                      arrayObjs={listDocuments}
                      toDelete={removeDocument}
                    />
                  </Grid>
                </Grid>

                <ButtonGroup
                  orientation='vertical'
                  variant='outlined'
                  sx={{width: 1, my: 4}}
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
                      onMouseOver={() => changeIcon()}
                      onMouseLeave={() => changeIcon2()}
                      onClick={() =>
                        window.open('https://youtu.be/U1Bnwa1G_ts/')
                      }
                    >
                      {iconSelected()}
                    </IconButton>
                  </Box>
                </Box>
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
              {'Registro de Ingreso'}
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
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth='sm'
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        {typeDialog == 'payments' ? (
          <>
            <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
              {'Añadir pago'}
              <IconButton
                aria-label='close'
                onClick={handleClose}
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
            <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
              <AddPayment sendData={addPayment} />
            </DialogContent>
          </>
        ) : (
          <></>
        )}
        {typeDialog == 'otherPayConcepts' ? (
          <>
            <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
              {'Añadir otro concepto de pago'}
              <IconButton
                aria-label='close'
                onClick={handleClose}
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
            <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
              <AddOtherPayConcept sendData={addOtherPayConcept} />
            </DialogContent>
          </>
        ) : (
          <></>
        )}
        {typeDialog == 'client' ? (
          <>
            <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
              {'Selecciona un cliente'}
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
              <AddDocumentFormForFinance sendData={getDocument} />
            </DialogContent>
          </>
        ) : (
          <></>
        )}
      </Dialog>

      <Dialog
        open={open2}
        onClose={handleClose2}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Registro de Ingreso'}
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
              setSelectedClient({});
              typeAlert = '';
              Router.push('/sample/contableMovements');
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
    </Card>
  );
};

export default NewEarning;
