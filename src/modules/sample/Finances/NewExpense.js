import React, {useState, useEffect, useCallback, useRef} from 'react';
import {makeStyles} from '@mui/styles';
import * as yup from 'yup';
import {Form, Formik, isEmptyArray} from 'formik';
import AppPage from '../../../@crema/hoc/AppPage';
import AppPageMeta from '../../../@crema/core/AppPageMeta';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SchoolIcon from '@mui/icons-material/School';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import AppUpperCaseTextField from '../../../@crema/core/AppFormComponents/AppUpperCaseTextField';

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

import AddProviderForm from '../ProviderSelection/AddProviderForm';
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
  FETCH_ERROR,
  ADD_FINANCE,
  GET_FINANCES,
} from '../../../shared/constants/ActionTypes';
import {useIntl} from 'react-intl';

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
  buyObservation: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
  totalAmounth: yup
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
let selectedProvider = {};
let selectedInput = {};

const NewExpense = (props) => {
  //VARIABLES DE PARAMETROS
  let changeValueField;
  let getValueField;
  let isFormikSubmitting;
  let setFormikSubmitting;

  const router = useRouter();
  const {query} = router;
  const {messages} = useIntl();
  console.log('query', query);
  const {getMovementsRes} = useSelector(({movements}) => movements);
  console.log('getMovementsRes', getMovementsRes);
  const {inputItems_pageListInput} = useSelector(({movements}) => movements);
  console.log('inputItems_pageListInput', inputItems_pageListInput);
  const [totalAmountWithConcepts, setTotalAmountWithConcepts] =
    React.useState(0);
  const [totalAmountOfConcepts, setTotalAmountOfConcepts] = React.useState(0);
  const [minTutorial, setMinTutorial] = React.useState(false);
  const [isProviderValidated, setIsProviderValidated] = React.useState(false);
  const [openProviderComprobation, setOpenProviderComprobation] =
    React.useState(false);

  useEffect(() => {
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: ADD_FINANCE, payload: undefined});
    listPayments = [];
    listOtherPayConcepts = [];

    getBusinessParameter(businessParameterPayload);
    console.log('query', query);
    selectedProvider = isObjEmpty(query)
      ? {}
      : {
          providerId: query.providerId,
          denominationProvider:
            query.providerName ||
            selectedInput.providerName ||
            query.denominationProvider,
        };
    console.log('selectedProvider', selectedProvider);
    setTimeout(() => {
      setMinTutorial(true);
    }, 2000);
  }, []);

  if (!isObjEmpty(query) && inputItems_pageListInput != undefined) {
    selectedInput = inputItems_pageListInput.find(
      (input) => input.movementHeaderId == query.movementHeaderId,
    );
    console.log('selectedInput', selectedInput);
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
    selectedInput && selectedInput.documentsMovement !== undefined
      ? selectedInput.documentsMovement.find(
          (obj) => obj.typeDocument == 'bill',
        )
      : {issueDate: '', serialDocument: '', typeDocument: ''};
  console.log('El bill', bill);
  const [value2, setValue2] = React.useState(
    isObjEmpty(query) || bill == undefined || bill.issueDate == undefined
      ? Date.now()
      : parseToGoodDate(bill.issueDate),
  );
  const [typeDialog, setTypeDialog] = React.useState('');
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

  const [statusExpense, setStatusExpense] = React.useState('paid');
  const [purchaseType, setPurchaseType] = React.useState('cash');
  const [tooltip, setTooltip] = React.useState(false);
  const [totalAmount, setTotalAmount] = React.useState(0);
  const dispatch = useDispatch();

  const toAddFinance = (payload) => {
    dispatch(addFinance(payload));
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

  useEffect(() => {
    if (businessParameter != undefined) {
      let obtainedMoneyUnit = businessParameter.find(
        (obj) => obj.abreParametro == 'DEFAULT_MONEY_UNIT',
      ).value;
      setMoneyUnit(obtainedMoneyUnit);
      console.log('moneyUnit', moneyUnit);
    }
  }, [businessParameter != undefined]);

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
    buyObservation: '',
    saleObservation: '',

    totalAmounth: isObjEmpty(query) ? null : Number(query.totalPriceWithIgv),
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
    regsiterDate: Number.isInteger(value) ? value : toEpoch(value),
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
            movementType: 'EXPENSE',
            providerId: '',
            numberDocumentProvider: '',
            typeDocumentProvider: 'RUC',
            denominationProvider: '',
            billIssueDate: '',
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

  const handleData = (data, provider) => {
    let localIsProviderValidated = isProviderValidated;
    if (
      Object.keys(selectedProvider).length != 0 &&
      selectedProvider.providerId.length != 0
    ) {
      setIsProviderValidated(true);
      localIsProviderValidated = true;
    } else {
      setOpenProviderComprobation(true);
      setFormikSubmitting(false);
    }

    console.log('selectedProvider:', selectedProvider);

    if (localIsProviderValidated || provider == 'enabled') {
      setFormikSubmitting(true);

      if (Object.keys(selectedProvider).length == 0)
        selectedProvider.providerId = '';

      console.log('selectedProvider1:', selectedProvider);

      //if (selectedProvider.providerId) {
      // if (listPayments.length > 0) {
      console.log('Data', data);
      console.log('anotherValues', anotherValues);
      newFinancePayload.request.payload.movements[0].numberDocumentProvider =
        selectedProvider.providerId.length != 0
          ? selectedProvider.providerId.split('-')[1]
          : '';
      newFinancePayload.request.payload.movements[0].denominationProvider =
        selectedProvider.providerId.length != 0
          ? selectedProvider.denominationProvider
          : '';
      newFinancePayload.request.payload.movements[0].providerId =
        selectedProvider.providerId;
      newFinancePayload.request.payload.movements[0].typeDocumentProvider =
        selectedProvider.providerId.length != 0
          ? selectedProvider.providerId.split('-')[0]
          : '';
      newFinancePayload.request.payload.movements[0].billIssueDate =
        convertToDateWithoutTime(value2);
      newFinancePayload.request.payload.movements[0].serialNumberBill =
        getValueField('nroBill').value; //data.nroBill;
      newFinancePayload.request.payload.movements[0].description =
        getValueField('saleDetail').value; //data.saleDetail;
      newFinancePayload.request.payload.movements[0].observation =
        getValueField('buyObservation').value; //data.buyObservation;
      newFinancePayload.request.payload.movements[0].totalAmount = Number(
        getValueField('totalAmounth').value, //data.totalAmounth,
      );
      newFinancePayload.request.payload.movements[0].status = statusExpense;
      newFinancePayload.request.payload.movements[0].movementHeaderId =
        !isObjEmpty(query) && query.movementHeaderId
          ? query.movementHeaderId
          : null;
      newFinancePayload.request.payload.movements[0].payments = [];
      newFinancePayload.request.payload.movements[0].otherPayConcepts = [];
      newFinancePayload.request.payload.movements[0].purchaseType =
        purchaseType;
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
      toAddFinance(newFinancePayload);
      setTimeout(() => {
        setOpenStatus(true);
      }, 1000);
      // } else {
      //   typeAlert = 'faltaPayment';
      //   setShowAlert(true);
      // }
      setFormikSubmitting(false);
    } /*else {
      typeAlert = 'provider';
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
    console.log('otherPayConcept', otherPayConcept);
    listOtherPayConcepts.push(otherPayConcept);
    console.log('listOtherPayConcepts', listOtherPayConcepts);
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
      Router.push('/sample/finances/table');
      setOpenStatus(false);
    } else if (registerError()) {
      setOpenStatus(false);
    } else {
      setOpenStatus(false);
    }
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
            <IntlMessages id='message.register.data.error' />
            <br />
            {addFinanceRes && 'error' in addFinanceRes
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

  const getProvider = (provider) => {
    selectedProvider = provider;
    console.log('Proveedor seleccionado', provider);
    setOpen(false);
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
    if (event.target.name == 'totalAmounth') {
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
    // if (event.target.name == 'totalAmounth') {
    //   setTotalAmountWithConcepts(event.target.value);
    // }
  };

  return (
    <Card sx={{p: 4}}>
      <Box sx={{width: 1, textAlign: 'center'}}>
        <Typography
          sx={{mx: 'auto', my: '10px', fontWeight: 600, fontSize: 25}}
        >
          REGISTRO DE EGRESO
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
                      onClick={handleClickOpen.bind(this, 'provider')}
                    >
                      Selecciona un proveedor
                    </Button>
                  </Grid>
                  <Grid item xs={12} sx={{textAlign: 'center'}}>
                    <Typography
                      sx={{
                        mx: 'auto',
                      }}
                    >
                      {selectedProvider.denominationProvider}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <AppUpperCaseTextField
                      label='Número de factura'
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
                      label='Fecha de factura'
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
                    <AppTextField
                      label='Detalle de compra'
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
                      name='buyObservation'
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

                  <Grid item xs={12}>
                    <AppTextField
                      label='Monto Factura(con igv)'
                      name='totalAmounth'
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
                        Estado de Cobro de Factura
                      </InputLabel>
                      <Select
                        sx={{textAlign: 'left'}}
                        value={statusExpense}
                        onChange={(event) => {
                          //console.log('evento', event.target.value);
                          anotherValues.state = event.target.value;
                          setStatusExpense(event.target.value);
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
                          CANCELADO
                        </MenuItem>
                        <MenuItem value='advance' style={{fontWeight: 200}}>
                          ADELANTO
                        </MenuItem>
                        <MenuItem value='toPaid' style={{fontWeight: 200}}>
                          EN DEUDA
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
                    arrayObjs={listPayments}
                    toDelete={removePayment}
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
                    {typeAlert == 'provider'
                      ? 'Por favor selecciona un proveedor.'
                      : null}
                  </Alert>
                </Collapse>
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
                          window.open('https://youtu.be/U1Bnwa1G_ts/')
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
                        onClick={() =>
                          window.open('https://youtu.be/U1Bnwa1G_ts')
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
            {'Registro de Egreso'}
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
        {typeDialog == 'provider' ? (
          <>
            <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
              {'Selecciona un proveedor'}
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
      </Dialog>

      <Dialog
        open={open2}
        onClose={handleClose2}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Registro de Egreso'}
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
              selectedProvider = {};
              typeAlert = '';
              Router.push('/sample/finances/table');
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
    </Card>
  );
};

export default NewExpense;
