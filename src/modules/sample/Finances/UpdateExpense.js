import React, {useState, useEffect, useCallback, useRef} from 'react';
import {makeStyles} from '@mui/styles';
import * as yup from 'yup';
import {Form, Formik} from 'formik';
import AppPage from '../../../@crema/hoc/AppPage';
import AppPageMeta from '../../../@crema/core/AppPageMeta';

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
} from '@mui/material';
import AddPayment from './AddPayment';
import AddOtherPayConcept from './AddOtherPayConcept';

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

import {
  getActualMonth,
  getYear,
  toEpoch,
  simpleDateToDateObj,
  convertToDateWithoutTime,
  isObjEmpty,
  translateValue,
} from '../../../Utils/utils';
import AddProviderForm from '../ProviderSelection/AddProviderForm';
import {onGetProviders} from '../../../redux/actions/Providers';
import {updateFinance} from '../../../redux/actions/Finances';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  UPDATE_FINANCE,
  GET_PROVIDERS,
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
let selectedExpense = {};
let listPayments = [];
let listOtherPayConcepts = [];
let typeAlert = '';
let changeValueField;

const UpdateExpense = (props) => {
  const router = useRouter();
  const {query} = router;
  console.log('query', query);
  const {messages} = useIntl();
  const classes = useStyles(props);
  const parseToGoodDate = (date) => {
    if (isNaN(date)) {
      return toEpoch(simpleDateToDateObj(date));
    } else {
      return Number(date);
    }
  };
  const [value2, setValue2] = React.useState(Date.now());
  const [typeDialog, setTypeDialog] = React.useState('');
  const [openStatus, setOpenStatus] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [selectedProvider, setSelectedProvider] = React.useState({});
  const [moneyUnit, setMoneyUnit] = React.useState(query.exchangeRate);
  const [showAlert, setShowAlert] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState(
    query.methodToPay || 'cash',
  );
  const [statusExpense, setStatusExpense] = React.useState(query.status);
  const [proofOfPaymentType, setProofOfPaymentType] = React.useState(
    query.proofOfPaymentType,
  );
  const [purchaseType, setPurchaseType] = React.useState(
    query.purchaseType ? query.purchaseType : 'cash',
  );
  const [tooltip, setTooltip] = React.useState(false);
  const [totalAmount, setTotalAmount] = React.useState(
    Number(query.totalAmount) || 0,
  );
  const [showOtherPayConcepts, setShowOtherPayConcepts] = React.useState(
    /* false */ true,
  );
  const [totalAmountWithConcepts, setTotalAmountWithConcepts] = React.useState(
    Number(query.totalAmountWithConcepts) || 0,
  );
  const [totalAmountOfConcepts, setTotalAmountOfConcepts] = React.useState(
    Number(query.totalAmountOfAddConcepts) -
      Number(query.totalAmountOfSubtractConcepts) || 0,
  );

  const dispatch = useDispatch();

  const toUpdateFinance = (payload) => {
    dispatch(updateFinance(payload));
  };
  const getBusinessParameter = (payload) => {
    dispatch(onGetBusinessParameter(payload));
  };
  const getProviders = (payload) => {
    dispatch(onGetProviders(payload));
  };

  const useForceUpdate = () => {
    const [reload, setReload] = React.useState(0); // integer state
    return () => setReload((val) => val + 1); // update the state to force render
  };
  const forceUpdate = useForceUpdate();

  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  const {allFinancesRes} = useSelector(({finances}) => finances);
  console.log('allFinancesRes', allFinancesRes);
  const {businessParameter} = useSelector(({general}) => general);
  console.log('businessParameter', businessParameter);
  const {updateFinanceRes} = useSelector(({finances}) => finances);
  console.log('updateFinanceRes', updateFinanceRes);
  const {successMessage} = useSelector(({finances}) => finances);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({finances}) => finances);
  console.log('errorMessage', errorMessage);
  const {listProviders} = useSelector(({providers}) => providers);
  console.log('providers123', listProviders);

  useEffect(() => {
    if (query.billIssueDate) {
      if (typeof query.billIssueDate === 'string') {
        setValue2(toEpoch(simpleDateToDateObj(query.billIssueDate)));
      } else {
        setValue2(Number(query.billIssueDate));
      }
    }
  }, [query]);

  useEffect(() => {
    if (allFinancesRes) {
      selectedExpense = allFinancesRes.find(
        (input) => input.contableMovementId == query.contableMovementId,
      );
      console.log('selectedExpense', selectedExpense);
    }
  }, [allFinancesRes]);

  /* if (getFinancesRes != undefined) {
    selectedExpense = getFinancesRes.find(
      (input) => input.movementHeaderId == query.movementHeaderId,
    );
    console.log('selectedExpense', selectedExpense);
  } */

  useEffect(() => {
    setSelectedProvider({});
    getBusinessParameter(businessParameterPayload);
    //dispatch({type: GET_PROVIDERS, payload: undefined});
    let listProvidersPayload = {
      request: {
        payload: {
          typeDocumentProvider: '',
          numberDocumentProvider: '',
          denominationProvider: '',
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };
    listProvidersPayload.request.payload.LastEvaluatedKey = null;
    getProviders(listProvidersPayload);
    listPayments = [];
    selectedExpense.payments.map((obj) => {
      listPayments.push({
        transactionNumber: obj.transactionNumber ? obj.transactionNumber : '',
        payDate: obj.payDate
          ? toEpoch(
              simpleDateToDateObj(
                obj.payDate ? obj.payDate : obj.issueDate ? obj.issueDate : '',
              ),
            )
          : '',
        expirationDate: obj.expirationDate
          ? toEpoch(simpleDateToDateObj(obj.expirationDate))
          : '',
        paymentMethod: obj.paymentMethod ? obj.paymentMethod : '',
        description: obj.descriptionPayment
          ? obj.descriptionPayment
          : obj.description,
        amount: obj.amount,
        statePayment: obj.statusPayment,
      });
    });

    listOtherPayConcepts = [];
    if (selectedExpense.otherPayConcepts) {
      selectedExpense.otherPayConcepts.map((obj) => {
        listOtherPayConcepts.push({
          transactionNumber: obj.transactionNumber ? obj.transactionNumber : '',
          payDate: obj.payDate
            ? toEpoch(
                simpleDateToDateObj(
                  obj.payDate
                    ? obj.payDate
                    : obj.issueDate
                    ? obj.issueDate
                    : '',
                ),
              )
            : '',
          conceptAction: obj.conceptAction ? obj.conceptAction : '',
          commentPayment: obj.commentPayment ? obj.commentPayment : '',
          expirationDate: obj.expirationDate
            ? toEpoch(simpleDateToDateObj(obj.expirationDate))
            : '',
          paymentMethod: obj.paymentMethod ? obj.paymentMethod : '',
          description: obj.descriptionPayment
            ? obj.descriptionPayment
            : obj.description,
          amount: obj.amount,
          statePayment: obj.statusPayment,
        });
      });
    }
  }, []);

  useEffect(() => {
    if (listProviders && listProviders.length > 0) {
      console.log('query.providerId', query.providerId);
      console.log('listProviders', listProviders);
      if (query.providerId) {
        let provider = listProviders.find(
          (input) => input.providerId === query.providerId,
        );
        setSelectedProvider(provider);
        console.log('provider', provider);
        changeValueField('providerName', provider.denominationProvider);
      }
    }
  }, [listProviders]);

  const defaultValues = {
    providerName: '',
    nroDocument: '',
    name: '',
    nroBill: query.serialNumberBill,
    transactionNumber: query.transactionNumber,
    saleDetail: query.description,
    buyObservation: query.observation,
    totalAmounth: Number(query.totalAmount),
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
    billDate: Number.isInteger(value2) ? value2 : toEpoch(value2),
    state: query.status,
  };
  let newFinancePayload = {
    request: {
      payload: {
        merchantId: userDataRes.merchantSelected.merchantId,
        movementType: 'EXPENSE',
        movementTypeMerchantId: `EXPENSE-${userDataRes.merchantSelected.merchantId}`,
        contableMovementId: query.contableMovementId,
        createdAt: null,
        monthMovement: getActualMonth(),
        yearMovement: getYear(),
        providerId: '',
        numberDocumentProvider: '',
        typeDocumentProvider: 'RUC',
        denominationProvider: '',
        billIssueDate: '',
        serialNumberBill: '',
        description: '',
        unitMeasureMoney: moneyUnit,
        totalAmount: Number(query.totalAmount) || null,
        status: '',
        purchaseType: '',
        movementHeaderId: '',
        payments: [],
        folderMovement: '',
        otherPayConcepts: [],
      },
    },
  };

  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    // if (selectedProvider.providerId) {
    // if (listPayments.length > 0) {
    console.log('Data', data);
    console.log('anotherValues', anotherValues);
    newFinancePayload.request.payload.createdAt = anotherValues.regsiterDate;
    newFinancePayload.request.payload.numberDocumentProvider =
      selectedProvider.providerId
        ? selectedProvider.providerId.split('-')[1]
        : '';
    newFinancePayload.request.payload.denominationProvider =
      selectedProvider.denominationProvider
        ? selectedProvider.denominationProvider
        : '';
    newFinancePayload.request.payload.providerId = selectedProvider.providerId
      ? selectedProvider.providerId
      : '';
    newFinancePayload.request.payload.typeDocumentProvider =
      selectedProvider.providerId
        ? selectedProvider.providerId.split('-')[0]
        : '';
    newFinancePayload.request.payload.billIssueDate =
      convertToDateWithoutTime(value2);
    newFinancePayload.request.payload.serialNumberBill = data.nroBill;
    newFinancePayload.request.payload.description = data.saleDetail;
    newFinancePayload.request.payload.observation = data.buyObservation;
    newFinancePayload.request.payload.totalAmount = Number(data.totalAmounth);
    newFinancePayload.request.payload.status = statusExpense;
    newFinancePayload.request.payload.folderMovement = query.folderMovement;
    newFinancePayload.request.payload.movementHeaderId =
      !isObjEmpty(query) && query.movementHeaderId
        ? query.movementHeaderId
        : null;
    newFinancePayload.request.payload.payments = [];
    newFinancePayload.request.payload.otherPayConcepts = [];
    newFinancePayload.request.payload.methodToPay = paymentMethod;
    newFinancePayload.request.payload.transactionNumber =
      data.transactionNumber; //data.transactionNumber,
    newFinancePayload.request.payload.purchaseType = purchaseType;
    (newFinancePayload.request.payload.userCreated = userDataRes.userId),
      (newFinancePayload.request.payload.userCreatedMetadata = {
        nombreCompleto: userDataRes.nombreCompleto,
        email: userDataRes.email,
      });
    newFinancePayload.request.payload.proofOfPaymentType = proofOfPaymentType;
    listPayments.map((obj, index) => {
      newFinancePayload.request.payload.payments.push({
        descriptionPayment: obj.description,
        transactionNumber: obj.transactionNumber,
        paymentMethod: obj.paymentMethod,
        payDate: convertToDateWithoutTime(obj.payDate),
        expirationDate: convertToDateWithoutTime(obj.expirationDate),
        amount: obj.amount,
        statusPayment: obj.statePayment,
      });
    });
    listOtherPayConcepts.map((obj, index) => {
      newFinancePayload.request.payload.otherPayConcepts.push({
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
    dispatch({type: UPDATE_FINANCE, payload: undefined});
    toUpdateFinance(newFinancePayload);
    setOpenStatus(true);
    // } else {
    //   typeAlert = 'faltaPayment';
    //   setShowAlert(true);
    // }
    // } else {
    //   typeAlert = 'provider';
    //   setShowAlert(true);
    // }
    /* } else {
      typeAlert = 'faltaPayment';
      setShowAlert(true);
    } */
    setSubmitting(false);
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
    let totalOtherPayConcepts = 0;
    listOtherPayConcepts.forEach((obj) => {
      if (obj.conceptAction == 'add') {
        console.log('Hola x2', obj.amount);
        totalOtherPayConcepts = totalOtherPayConcepts + obj.amount;
      } else {
        totalOtherPayConcepts = totalOtherPayConcepts - obj.amount;
      }
    });
    const newTotalOtherPayConcepts =
      Number(totalAmount) + totalOtherPayConcepts;
    setTotalAmountOfConcepts(totalOtherPayConcepts);
    changeValueField('totalAmountWithConcepts', newTotalOtherPayConcepts);
    console.log('listOtherPayConcepts', listOtherPayConcepts);
    forceUpdate();
  };

  const registerSuccess = () => {
    return (
      successMessage != undefined &&
      updateFinanceRes != undefined &&
      !('error' in updateFinanceRes)
    );
  };
  const registerError = () => {
    return (successMessage != undefined && updateFinanceRes) || errorMessage;
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
            Se ha producido un error al registrar.
            <br />
            {updateFinanceRes !== undefined && 'error' in updateFinanceRes
              ? updateFinanceRes.error
              : null}
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink />;
    }
  };

  const cancel = () => {
    setOpen2(true);
  };

  const getProvider = (provider) => {
    setSelectedProvider(provider);
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
          ACTUALIZACIÓN DE EGRESO
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
                  <Grid item xs={12}>
                    <AppTextField
                      label='Proveedor'
                      name='providerName'
                      variant='outlined'
                      disabled
                      focused
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
                    <FormControl disabled fullWidth sx={{my: 2}}>
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
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <AppUpperCaseTextField
                      label={
                        query.proofOfPaymentType
                          ? translateValue(
                              'PROOFOFPAYMENTNUMBER',
                              query.proofOfPaymentType.toUpperCase(),
                            )
                          : 'Número de comprobante'
                      }
                      disabled={query.serialNumberBill ? true : false}
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
                          : 'Fecha de Comprobante'
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
                              'PROOFOFPAYMENTTOTALAMOUNT',
                              proofOfPaymentType.toUpperCase(),
                            )
                          : 'Monto comprobante (con igv)'
                      }
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
                  <Grid item xs={12}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel
                        id='categoria-label'
                        style={{fontWeight: 200}}
                      >
                        Estado
                      </InputLabel>
                      <Select
                        sx={{textAlign: 'left'}}
                        value={statusExpense}
                        onChange={(event) => {
                          anotherValues.state = event.target.value;
                          setStatusExpense(event.target.value);
                        }}
                        name='state'
                        labelId='state-label'
                        label='Estado'
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
                  <Grid item xs={12}>
                    <Button
                      sx={{width: 1, my: 2, p: 3}}
                      size='large'
                      variant='outlined'
                      onClick={handleClickOpen.bind(this, 'payments')}
                    >
                      Añadir pago
                    </Button>
                  </Grid>
                </Grid>
                <PaymentsTable
                  arrayObjs={listPayments}
                  toDelete={removePayment}
                />
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
            {'Actualización de Egreso'}
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
          {'Actualización de Egreso'}
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
              setSelectedProvider({});
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
    </Card>
  );
};

export default UpdateExpense;
