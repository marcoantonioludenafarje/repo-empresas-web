import React, {useEffect, useRef} from 'react';
import originalUbigeos from '../../../Utils/ubigeo.json';
import {fixDecimals, isEmpty, dateWithHyphen} from '../../../Utils/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  MenuItem,
  TextField,
  Card,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Collapse,
  Typography,
  Grid,
  Autocomplete,
  Alert,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppPageMeta from '../../../@crema/core/AppPageMeta';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import TransformIcon from '@mui/icons-material/Transform';
import DeleteIcon from '@mui/icons-material/Delete';
import AddExisingProduct from '../AddExisingProduct';
import SelectProduct from '../AddExisingProduct/SelectProduct';
import AddIcon from '@mui/icons-material/Add';
import {useIntl} from 'react-intl';

import {Form, Formik, useFormikContext} from 'formik';
import * as yup from 'yup';
import {DesktopDatePicker, DateTimePicker} from '@mui/lab';

import PropTypes from 'prop-types';
import {getCarriers} from '../../../redux/actions/Carriers';
import {useDispatch, useSelector} from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import SelectCarrier from '../ReferralGuide/SelectCarrier';
import {FETCH_ERROR} from '../../../shared/constants/ActionTypes';
import {loadingButtonClasses} from '@mui/lab';

const DeliveryCard = ({
  order,
  newValuesData,
  execFunctions,
  initialValues,
  useReferralGuide,
}) => {
  let changeValue;
  let valuesForm;
  const {messages} = useIntl();
  const dispatch = useDispatch();
  const formRef = useRef();
  const emptyProduct = {
    description: '',
    count: 0,
    weight: 0,
    productId: null,
    inputProduct: false,
    invalidate: false,
  };
  const [counter, setCounter] = React.useState(1);
  const [dateStartTransfer, setDateStartTransfer] = React.useState(Date.now());
  const [typeDocument, setTypeDocument] = React.useState('DNI');
  const [productsList, setProductsList] = React.useState([]);
  const [selectedCarrier, setSelectedCarrier] = React.useState({});
  const [existCarrier, setExistCarrier] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [parsedUbigeos, setParsedUbigeos] = React.useState([]);
  const [ubigeoStartingPoint, setUbigeoStartingPoint] = React.useState(0);
  const [existStartingUbigeo, setExistStartingUbigeo] = React.useState(true);
  const [startingObjUbigeo, setStartingObjUbigeo] = React.useState({});
  const [ubigeoArrivalPoint, setUbigeoArrivalPoint] = React.useState(0);
  const [existArrivalUbigeo, setExistArrivalUbigeo] = React.useState(true);
  const [arrivalObjUbigeo, setArrivalObjUbigeo] = React.useState({});
  const [indexProduct, setIndexProduct] = React.useState(null);
  const [reload, setReload] = React.useState(false);
  const [openSelectProduct, setOpenSelectProduct] = React.useState(false);
  const [makeReferralGuide, setMakeReferralGuide] = React.useState(false);
  const [readyData, setReadyData] = React.useState(false);
  const counts = {};

  const {getCarriersRes} = useSelector(({carriers}) => carriers);
  const {jwtToken} = useSelector(({general}) => general);
  const {listProducts} = useSelector(({products}) => products);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);

  let listCarriersPayload = {
    request: {
      payload: {
        typeDocumentCarrier: '',
        numberDocumentCarrier: '',
        denominationCarrier: '',
        merchantId: userDataRes.merchantSelected.merchantId,
      },
    },
  };

  let defaultValues = {
    startingAddress: '',
    arrivalAddress: '',
    driverName: '',
    driverLastName: '',
    driverDocumentNumber: '',
    driverLicenseNumber: '',
    plate: '',
    totalWeight: '',
    numberPackages: 1,
    observationDelivery: '',
  };
  const reloadPage = () => {
    setReload(!reload);
  };
  const openSelectCarrier = () => {
    setOpenDialog(true);
  };
  const closeDialog = () => {
    setOpenDialog(false);
  };
  const saveCarrier = (carrier) => {
    setSelectedCarrier(carrier);
    setExistCarrier(true);
    console.log('Transportista', carrier);
    setOpenDialog(false);
  };

  useEffect(() => {
    if (!getCarriersRes) {
      toGetCarriers(listCarriersPayload, jwtToken);
    }
    setProductsList([]);
    const ubigeos = originalUbigeos.map((obj, index) => {
      return {
        label: `${obj.descripcion} - ${obj.ubigeo}`,
        ...obj,
      };
    });
    setParsedUbigeos(ubigeos);
    if (
      initialValues &&
      !('empty' in initialValues) &&
      initialValues.empty != true &&
      listProducts &&
      listProducts.length !== 0
    ) {
      console.log('initialValues', initialValues);
      let carrier = {
        carrierDocumentType: initialValues.carrierDocumentType,
        carrierDocumentNumber: initialValues.carrierDocumentNumber,
        carrierPlateNumber: initialValues.carrierPlateNumber,
        denominationCarrier: initialValues.carrierDenomination,
      };
      console.log('carrier', carrier);
      setSelectedCarrier(carrier);
      setExistCarrier(true);

      const startingObjUbigeo = ubigeos.find(
        (ubigeo) => ubigeo.ubigeo == initialValues.startingPointUbigeo,
      );
      console.log('initial starting address', startingObjUbigeo);
      setStartingObjUbigeo(startingObjUbigeo);
      setUbigeoStartingPoint(initialValues.startingPointUbigeo);
      setExistStartingUbigeo(true);

      const arrivalObjUbigeo = ubigeos.find(
        (ubigeo) => ubigeo.ubigeo == initialValues.arrivalPointUbigeo,
      );
      console.log('initial arrival address', arrivalObjUbigeo);
      setArrivalObjUbigeo(arrivalObjUbigeo);
      setUbigeoArrivalPoint(initialValues.arrivalPointUbigeo);
      setExistArrivalUbigeo(true);

      setTypeDocument(
        initialValues.driverDocumentType
          ? initialValues.driverDocumentType.toUpperCase()
          : 'DNI',
      );

      if ('transferStartDate' in initialValues) {
        setDateStartTransfer(initialValues.transferStartDate);
      }

      changeValue(
        'startingAddress',
        initialValues.startingPointAddress || initialValues.startingAddress,
      );
      changeValue(
        'arrivalAddress',
        initialValues.arrivalPointAddress || initialValues.arrivalAddress,
      );
      changeValue(
        'driverName',
        initialValues.driverDenomination || initialValues.driverName,
      );
      changeValue(
        'driverLastName',
        initialValues.driverLastName ? initialValues.driverLastName : "",
      );
      changeValue(
        'driverLicenseNumber',
        initialValues.driverLicenseNumber ? initialValues.driverLicenseNumber : "",
      );
      changeValue('driverDocumentNumber', initialValues.driverDocumentNumber);
      changeValue(
        'plate',
        initialValues.carrierPlateNumber || initialValues.plate,
      );
      changeValue(
        'totalWeight',
        Number(initialValues.totalGrossWeight || initialValues.totalWeight),
      );
      changeValue(
        'numberPackages',
        Number(initialValues.numberOfPackages || initialValues.numberPackages),
      );
      changeValue(
        'observationDelivery',
        initialValues.observationDelivery || initialValues.observationDelivery,
      );

      let newProds = [];
      let internalCounter = 1;
      let productsToSet = initialValues.products
        ? initialValues.products
        : initialValues.productsInfo;
      productsToSet
        ? productsToSet.map((prod) => {
            console.log('prod.weight', prod.weight);
            let originalProduct = getOriginalProduct(prod.productId);
            newProds.push({
              ...originalProduct,
              count: prod.quantityMovement || prod.count,
              weight: originalProduct.weight
                ? Number(originalProduct.weight)
                : 0.1,
              invalidate: false,
              inputProduct: false,
              rowId: internalCounter,
            });
            internalCounter += 1;
          })
        : null;
      setCounter(internalCounter);
      setProductsList(newProds);
      newProds.map((prod) => {
        changeValue(`count${prod.rowId}`, prod.count);
      });
      console.log('productsList', newProds);
      console.log('defaultValues cambiados', defaultValues);
      reloadPage();
      setReadyData(true);
    } else {
      setStartingObjUbigeo(ubigeos[0]);
      setUbigeoStartingPoint(ubigeos[0].ubigeo);
      setExistStartingUbigeo(true);
      setArrivalObjUbigeo(ubigeos[0]);
      setUbigeoArrivalPoint(ubigeos[0].ubigeo);
      setExistArrivalUbigeo(true);
      setProductsList([]);
      setReadyData(true);
    }
  }, [initialValues, listProducts]);

  const toGetCarriers = (payload, token) => {
    dispatch(getCarriers(payload, token));
  };

  // COMPROBAR LAS VALIDACIONES DE LAS CANTIDADES
  const validationSchema = yup.object({
    destination: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />)
      .required(<IntlMessages id='validation.required' />),
    address: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />)
      .required(<IntlMessages id='validation.required' />),
    startingAddress: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />)
      .required(<IntlMessages id='validation.required' />),
    arrivalAddress: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />)
      .required(<IntlMessages id='validation.required' />),
    driverName: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />)
      .required(<IntlMessages id='validation.required' />),
    driverLastName: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />)
      .required(<IntlMessages id='validation.required' />),
    driverLicenseNumber: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />)
      .required(<IntlMessages id='validation.required' />),
    driverDocumentNumber: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />)
      .required(<IntlMessages id='validation.required' />),
    plate: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />)
      .required(<IntlMessages id='validation.required' />),
    totalWeight: yup
      .number()
      .typeError(<IntlMessages id='validation.number' />)
      .required(<IntlMessages id='validation.required' />)
      .test(
        'maxDigitsAfterDecimal',
        'El número puede contener como máximo 3 decimales',
        (number) => /^\d+(\.\d{1,3})?$/.test(number),
      ),
    numberPackages: yup
      .number()
      .typeError(<IntlMessages id='validation.number' />)
      .required(<IntlMessages id='validation.required' />)
      .integer(<IntlMessages id='validation.number.integer' />),
    observationDelivery: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />),
  });

  useEffect(() => {
    if (execFunctions) {
      setCounter(1);
      submitSetSubmitting(
        formRef.current.values,
        formRef.current.setSubmitting,
      );
      console.log('Funcionando');
    }
  }, [execFunctions]);

  /*NO SE ESTA USANDO*/
  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    console.log('data', {...data, products: productsList});
    console.log('existArrivalUbigeo, existStartingUbigeo, existCarrier', [
      existArrivalUbigeo,
      existStartingUbigeo,
      existCarrier,
    ]);
    if (existArrivalUbigeo && existStartingUbigeo && existCarrier) {
      let newProducts = productsList;
      newProducts = newProducts.filter((prod) => prod.invalidate == false);
      let newRoute = {
        startingPointUbigeo: ubigeoStartingPoint.toString(),
        startingAddress: data.startingAddress,
        arrivalPointUbigeo: ubigeoArrivalPoint.toString(),
        arrivalAddress: data.arrivalAddress,
        driverName: data.driverName,
        driverLastName: data.driverLastName,
        driverDocumentType: typeDocument.toLowerCase(),
        driverLicenseNumber: data.driverLicenseNumber,
        driverDocumentNumber: data.driverDocumentNumber,
        plate: data.plate,
        totalWeight: data.totalWeight,
        numberPackages: data.numberPackages,
        observationDelivery: data.observationDelivery,
        products: newProducts,
      };
      console.log('nueva ruta', newRoute);
      newValuesData(order, newRoute);
    }
    setSubmitting(false);
  };
  const submitSetSubmitting = (data, setSubmitting) => {
    setSubmitting(true);
    console.log('setSubmitting', setSubmitting);
    console.log('data', {...data, products: productsList});
    console.log('selectedCarrier', selectedCarrier);
    console.log('existArrivalUbigeo, existStartingUbigeo, existCarrier', [
      existArrivalUbigeo,
      existStartingUbigeo,
      existCarrier,
    ]);
    if (existArrivalUbigeo && existStartingUbigeo && existCarrier) {
      let newProducts = productsList;
      newProducts = newProducts.filter((prod) => prod.invalidate == false);

      let newRoute = {
        carrierDocumentType:
          selectedCarrier.typeDocumentCarrier ||
          selectedCarrier.carrierDocumentType,
        carrierDocumentNumber:
          selectedCarrier.numberDocumentCarrier ||
          selectedCarrier.carrierDocumentNumber,
        carrierDenomination: selectedCarrier.denominationCarrier,

        startingPointUbigeo: ubigeoStartingPoint.toString(),
        startingAddress: data.startingAddress,
        arrivalPointUbigeo: ubigeoArrivalPoint.toString(),
        arrivalAddress: data.arrivalAddress,
        driverName: data.driverName,
        driverLastName: data.driverLastName,
        driverDocumentType: typeDocument.toLowerCase(),
        driverDocumentNumber: data.driverDocumentNumber,
        driverLicenseNumber: data.driverLicenseNumber,
        plate: data.plate,
        totalWeight: data.totalWeight,
        numberPackages: data.numberPackages,
        observationDelivery: data.observationDelivery,
        products: newProducts,
        generateReferralGuide: makeReferralGuide,
        transferStartDate: dateStartTransfer,
      };
      console.log('Nueva ruta', newRoute);
      newValuesData(order, newRoute);
    }
    setSubmitting(false);
  };

  const handleField = (event) => {
    setTypeDocument(event.target.value);
  };

  const getNewProduct = (product) => {
    console.log('nuevo producto', product);
    console.log('valuesForm', valuesForm);
    const index = productsList.findIndex((obj) => obj.rowId == product.rowId);
    const existProduct = productsList.find(
      (prod) => prod.productId == product.productId,
    );
    console.log('existProduct', existProduct);
    const alreadyExist = index != -1 || existProduct;
    if (!alreadyExist) {
      let newProds = productsList;
      console.log('lista antes', newProds);
      console.log('producto a cambiar', newProds[indexProduct]);
      newProds[indexProduct] = {
        ...newProds[indexProduct],
        ...product,
      };
      console.log('lista despues', newProds);
      setTotalWeight(newProds);
      setProductsList(newProds);
      reloadPage();
    } else {
      dispatch({
        type: FETCH_ERROR,
        payload: messages['error.repeat.product'],
      });
    }
    setOpenSelectProduct(false);
  };

  const setCountOfProduct = (rowId, count) => {
    console.log(`valores rowid: ${rowId} count: ${count}`);
    const newProds = productsList;
    console.log('lista antes', newProds);
    const foundIndex = newProds.findIndex((prod) => prod.rowId == rowId);
    const prod = newProds[foundIndex];
    prod.count = count ? fixDecimals(Number(count)) : 0;
    setTotalWeight(newProds);
    setProductsList(newProds);
    console.log('lista despues', newProds);
  };
  const setTotalWeight = (products) => {
    let totalWeight = 0;
    console.log('productos antes de sumar pesos', products);
    products.map((prod, index) => {
      if (prod.invalidate === false) {
        console.log(`peso ${index + 1}`, fixDecimals(prod.count * prod.weight));
        totalWeight += fixDecimals(prod.count * prod.weight);
      }
    });
    changeValue('totalWeight', fixDecimals(totalWeight));
  };
  const handleChange = (event) => {
    if (event.target.name.includes('count')) {
      const rowId = event.target.name.replace('count', '');
      setCountOfProduct(rowId, event.target.value);
    }
  };
  const showTotalWeight = (weight, count) => {
    if (weight && count) return fixDecimals(weight * count);
  };
  const invalidateProduct = (rowId) => {
    const newProds = productsList;
    const foundIndex = newProds.findIndex((prod) => prod.rowId == rowId);
    console.log('lista antes', newProds);
    newProds[foundIndex].invalidate = true;
    console.log('lista despues', newProds);
    setProductsList(newProds);
  };

  const addInputToProducts = (preCount, rowId, newProducts) => {
    let newProds = productsList; /* .map((obj) => (obj.invalidate = true)) */
    console.log('lista antes', newProds);
    let inputsProducts = [];
    let valToMultiply = 1;
    if (!isNaN(preCount) && preCount !== '' && preCount !== 0) {
      valToMultiply *= preCount;
    }
    console.log(`preCount ${preCount} valToMultiply ${valToMultiply}`);
    let internCounter = counter;
    newProducts.map((prod) => {
      inputsProducts.push({
        ...prod,
        rowId: internCounter,
        count: fixDecimals(valToMultiply * Number(prod.quantity)),
        weight: 'weight' in prod ? Number(prod.weight) : 0.1,
        inputProduct: true,
        invalidate: false,
        product: prod.productId.replace(/^(0+)/g, '').split('-')[0],
      });
      internCounter += 1;
    });
    setCounter(internCounter);
    console.log('inputsProducts', inputsProducts);
    newProds.push(...inputsProducts);
    console.log('lista despues', newProds);
    setProductsList(newProds);
    reloadPage();

    inputsProducts.map((prod) => {
      changeValue(`count${prod.rowId}`, fixDecimals(Number(prod.count)));
    });
    reloadPage();
  };
  const toInputs = (index, rowId, inputsProduct) => {
    const preCount = productsList.find((prod) => prod.rowId == rowId).count;
    addInputToProducts(preCount, rowId, inputsProduct);
    invalidateProduct(rowId);
    deleteDuplicate();
    reloadPage();
  };
  const deleteProduct = (rowId) => {
    let newProds = productsList;
    console.log('lista antes', newProds);
    newProds = newProds.filter((item) => item.rowId !== rowId);
    console.log('lista despues', newProds);
    setProductsList(newProds);
    setTotalWeight(newProds);
    reloadPage();
  };
  const addRow = () => {
    let newProds = productsList;
    console.log('lista antes', newProds);
    newProds.push({...emptyProduct, rowId: counter});
    console.log('lista despues', newProds);
    setCounter(counter + 1);
    setProductsList(newProds);
    reloadPage();
  };

  const deleteDuplicate = () => {
    const arr = productsList;
    let newProds = [];
    arr.map((obj, indexObj) => {
      let product = newProds.findIndex(
        (prod, indexProd) => prod.productId === obj.productId,
      );
      console.log('product', product);
      if (product == -1) {
        newProds.push(obj);
      } else {
        newProds[product].count += obj.count;
      }
      console.log(newProds);
    });
    setProductsList(newProds);
    newProds.map((newProd) => {
      changeValue(`count${newProd.rowId}`, fixDecimals(Number(newProd.count)));
    });
    setTotalWeight(newProds);
  };

  const getOriginalProduct = (productId) => {
    return listProducts.find((prod) => prod.productId == productId);
  };

  return (
    <Card sx={{p: 4}}>
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
          innerRef={formRef}
        >
          {({isSubmitting, setFieldValue, values}) => {
            changeValue = setFieldValue;
            valuesForm = values;
            return (
              <Form
                style={{textAlign: 'left', justifyContent: 'center'}}
                noValidate
                onChange={handleChange}
                autoComplete='on'
              >
                <Grid container spacing={2} sx={{width: 'auto'}}>
                  <Grid item xs={12}>
                    <Typography sx={{m: 2}}>
                      <IntlMessages id='common.deliveryData' />
                    </Typography>
                  </Grid>

                  <Grid item xs={8}>
                    <Button
                      sx={{width: 1}}
                      variant='outlined'
                      onClick={() => openSelectCarrier()}
                    >
                      <IntlMessages id='message.selectCarrier' />
                    </Button>
                  </Grid>
                  <Grid item xs={4} sx={{textAlign: 'center'}}>
                    <Typography sx={{mx: 'auto', my: '10px'}}>
                      {selectedCarrier.denominationCarrier}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{textAlign: 'center'}}>
                    <Collapse in={!existCarrier}>
                      <Alert severity='error' sx={{mb: 2}}>
                        <IntlMessages id='message.error.selectCarrier' />
                      </Alert>
                    </Collapse>
                  </Grid>

                  {startingObjUbigeo ? (
                    <>
                      <Grid item xs={8}>
                        <Autocomplete
                          disablePortal
                          id='combo-box-demo'
                          value={startingObjUbigeo}
                          isOptionEqualToValue={(option, value) =>
                            option.ubigeo === value.ubigeo
                          }
                          getOptionLabel={(option) => option.label || ''}
                          onChange={(option, value) => {
                            if (
                              typeof value === 'object' &&
                              value != null &&
                              value !== ''
                            ) {
                              console.log('objeto ubigeo', value);
                              setStartingObjUbigeo(value);
                              setUbigeoStartingPoint(value.ubigeo);
                              setExistStartingUbigeo(true);
                            } else {
                              setExistStartingUbigeo(false);
                            }
                            console.log('ubigeo, punto de partida', value);
                          }}
                          options={parsedUbigeos}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={
                                <IntlMessages id='ubigeo.startingDistrictUbigeo' />
                              }
                              onChange={(event) => {
                                console.log('event field', event.target.value);
                                if (event.target.value === '') {
                                  console.log('si se cambia a null');
                                  setExistStartingUbigeo(false);
                                }
                              }}
                            />
                          )}
                        />
                        <Collapse in={!existStartingUbigeo}>
                          <Alert severity='error' sx={{mb: 2}}>
                            <IntlMessages id='message.importantSelectStartingUbigeo' />
                          </Alert>
                        </Collapse>
                      </Grid>
                      <Grid item xs={4}>
                        <AppTextField
                          label={
                            <IntlMessages id='common.busines.startingDirection' />
                          }
                          name='startingAddress'
                          variant='outlined'
                          sx={{
                            width: '100%',
                            '& .MuiInputBase-input': {
                              fontSize: 14,
                            },
                          }}
                        />
                      </Grid>
                    </>
                  ) : null}

                  {arrivalObjUbigeo ? (
                    <>
                      <Grid item xs={8}>
                        <Autocomplete
                          disablePortal
                          id='combo-box-demo'
                          value={arrivalObjUbigeo}
                          isOptionEqualToValue={(option, value) =>
                            option.ubigeo === value.ubigeo
                          }
                          getOptionLabel={(option) => option.label || ''}
                          onChange={(event, value) => {
                            if (
                              typeof value === 'object' &&
                              value != null &&
                              value !== ''
                            ) {
                              console.log('objeto ubigeo', value);
                              setArrivalObjUbigeo(value);
                              setUbigeoArrivalPoint(value.ubigeo);
                              setExistArrivalUbigeo(true);
                            } else {
                              setExistArrivalUbigeo(false);
                            }
                            console.log('ubigeo, punto de llegada', value);
                          }}
                          options={parsedUbigeos}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={
                                <IntlMessages id='ubigeo.arrivalDistrictUbigeo' />
                              }
                              onChange={(event) => {
                                console.log('event field', event.target.value);
                                if (event.target.value === '') {
                                  console.log('si se cambia a null');
                                  setExistArrivalUbigeo(false);
                                }
                              }}
                            />
                          )}
                        />
                        <Collapse in={!existArrivalUbigeo}>
                          <Alert severity='error' sx={{mb: 2}}>
                            <IntlMessages id='message.importantSelectArrivalUbigeo' />
                          </Alert>
                        </Collapse>
                      </Grid>
                      <Grid item xs={4}>
                        <AppTextField
                          label={
                            <IntlMessages id='common.busines.arrivalDirection' />
                          }
                          name='arrivalAddress'
                          variant='outlined'
                          sx={{
                            width: '100%',
                            '& .MuiInputBase-input': {
                              fontSize: 14,
                            },
                          }}
                        />
                      </Grid>
                    </>
                  ) : null}

                  {useReferralGuide ? (
                    <>
                      <Grid item xs={6}>
                        <DateTimePicker
                          renderInput={(params) => (
                            <TextField
                              fullWidth
                              sx={{position: 'relative', bottom: '-8px'}}
                              {...params}
                            />
                          )}
                          required
                          value={dateStartTransfer}
                          label='Fecha inicio traslado'
                          inputFormat='dd/MM/yyyy hh:mm a'
                          name='dateStartTransfer'
                          onChange={(newValue) => {
                            setDateStartTransfer(newValue);
                            console.log('Nueva fecha', newValue);
                            console.log(
                              'Fecha de inicio de traslado',
                              dateStartTransfer,
                            );
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mt: '10px',
                        }}
                      >
                        <FormControlLabel
                          sx={{m: 0}}
                          control={
                            <Checkbox
                              onChange={(event, isInputChecked) =>
                                setMakeReferralGuide(isInputChecked)
                              }
                            />
                          }
                          label={
                            <IntlMessages id='message.generate.referralGuide' />
                          }
                        />
                      </Grid>
                    </>
                  ) : null}

                  <Grid item xs={12}>
                    <Typography sx={{m: 2}}>
                      <IntlMessages id='common.driver.data' />
                    </Typography>
                  </Grid>

                  <Grid item xs={3}>
                    <AppTextField
                      label={<IntlMessages id='common.busines.driver.name' />}
                      name='driverName'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <AppTextField
                      label={<IntlMessages id='common.busines.driver.lastName' />}
                      name='driverLastName'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <InputLabel
                        id='documentType-label'
                        style={{fontWeight: 200}}
                      >
                        <IntlMessages id='common.busines.documentType' />
                      </InputLabel>
                      <Select
                        name='documentType'
                        labelId='documentType-label'
                        label={
                          <IntlMessages id='common.busines.documentType' />
                        }
                        displayEmpty
                        onChange={handleField}
                        value={typeDocument}
                      >
                        <MenuItem value='RUC' style={{fontWeight: 200}}>
                          RUC
                        </MenuItem>
                        <MenuItem value='DNI' style={{fontWeight: 200}}>
                          DNI
                        </MenuItem>
                        <MenuItem value='CE' style={{fontWeight: 200}}>
                          CE
                        </MenuItem>
                        <MenuItem value='VARIOUS' style={{fontWeight: 200}}>
                          Varios
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={3}>
                    <AppTextField
                      label={
                        <IntlMessages id='common.busines.driver.document.number' />
                      }
                      name='driverDocumentNumber'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <AppTextField
                      label={<IntlMessages id='common.busines.driver.licenseNumber' />}
                      name='driverLicenseNumber'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <AppTextField
                      label={<IntlMessages id='common.busines.plate' />}
                      name='plate'
                      variant='outlined'
                      placeholder='ABC-123'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{width: 'auto', mt: 1}}>
                  <Grid item xs={12}>
                    <Typography sx={{m: 2}}>
                      <IntlMessages id='common.load.data' />
                    </Typography>
                  </Grid>

                  <Grid item xs={3}>
                    <AppTextField
                      label={<IntlMessages id='common.busines.weigth' />}
                      name='totalWeight'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <AppTextField
                      label={
                        <IntlMessages id='common.busines.packages.number' />
                      }
                      name='numberPackages'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography sx={{m: 2}}>
                      <IntlMessages id='sidebar.ecommerce.products' />
                    </Typography>
                  </Grid>

                  <TableContainer component={Paper} sx={{maxHeight: 440}}>
                    <Table stickyHeader size='small' aria-label='simple table'>
                      <TableHead>
                        <TableRow>
                          <TableCell align='center'>
                            <IntlMessages id='product.type.product' />
                          </TableCell>
                          <TableCell align='center'>
                            <IntlMessages id='common.amount' />
                          </TableCell>
                          <TableCell align='center'>
                            <IntlMessages id='common.busines.weigth' />
                          </TableCell>
                          <TableCell align='center'>
                            <IntlMessages id='common.busines.total.weigth' />
                          </TableCell>
                          <TableCell align='center'>
                            <IntlMessages id='product.type.transform.rawMaterial' />
                          </TableCell>
                          <TableCell align='center'>
                            <IntlMessages id='mailApp.remove' />
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {productsList
                          ? productsList.map((obj, index) => {
                              if (obj && obj.invalidate !== true) {
                                return (
                                  <TableRow
                                    sx={{
                                      '&:last-child td, &:last-child th': {
                                        border: 0,
                                      },
                                    }}
                                    key={index}
                                  >
                                    <TableCell>
                                      <Button
                                        variant='text'
                                        href='#contained-buttons'
                                        sx={{
                                          color: 'black',
                                          fontWeight: '400',
                                        }}
                                        disabled={obj.invalidate}
                                        onClick={() => {
                                          setIndexProduct(index);
                                          setOpenSelectProduct(true);
                                        }}
                                      >
                                        {obj.description ? (
                                          obj.description
                                        ) : (
                                          <IntlMessages id='sidebar.ecommerce.selectProduct' />
                                        )}
                                      </Button>
                                    </TableCell>
                                    <TableCell>
                                      <AppTextField
                                        label={
                                          obj.productId ? (
                                            <IntlMessages id='common.amount' />
                                          ) : (
                                            <IntlMessages id='validation.select.product' />
                                          )
                                        }
                                        name={`count${obj.rowId}`}
                                        disabled={!obj.productId}
                                        variant='outlined'
                                        sx={{
                                          my: 2,
                                          width: '100%',
                                          '& .MuiInputBase-input': {
                                            fontSize: 14,
                                          },
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell align='center'>
                                      <Typography>{obj.weight}</Typography>
                                    </TableCell>
                                    <TableCell align='center'>
                                      <Typography>
                                        {showTotalWeight(obj.weight, obj.count)}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align='center'>
                                      <IconButton
                                        aria-label='delete'
                                        disabled={
                                          obj.invalidate ||
                                          obj.typeProduct !=
                                            'intermediateProduct'
                                        }
                                        onClick={() =>
                                          toInputs(
                                            index,
                                            obj.rowId,
                                            obj.inputsProduct,
                                          )
                                        }
                                      >
                                        {obj.typeProduct ===
                                        'intermediateProduct' ? (
                                          <TransformIcon />
                                        ) : null}
                                      </IconButton>
                                    </TableCell>
                                    <TableCell align='center'>
                                      <IconButton
                                        disabled={obj.invalidate}
                                        onClick={() => deleteProduct(obj.rowId)}
                                        aria-label='delete'
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                );
                              } else {
                                return null;
                              }
                            })
                          : null}
                        <TableRow>
                          <TableCell align='center' colSpan={6}>
                            <IconButton
                              onClick={() => {
                                addRow();
                              }}
                              aria-label='delete'
                              size='large'
                            >
                              <AddIcon fontSize='inherit' />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Grid item xs={12}>
                    <AppTextField
                      label='Observación'
                      name='observationDelivery'
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
                  <Grid item xs={12}></Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Box>

      <Dialog
        open={openSelectProduct}
        onClose={() => setOpenSelectProduct(false)}
        maxWidth='lg'
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {<IntlMessages id='sidebar.ecommerce.selectProduct' />}
        </DialogTitle>
        <DialogContent sx={{justifyContent: 'center'}}>
          <SelectProduct fcData={getNewProduct} search={false} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDialog}
        onClose={closeDialog}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='xl'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          <Box sx={{mx: 10}}>Selecciona un transportista</Box>
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
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <SelectCarrier fcData={saveCarrier} />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DeliveryCard;

DeliveryCard.propTypes = {
  newValuesData: PropTypes.func.isRequired,
  execFunctions: PropTypes.bool.isRequired,
  order: PropTypes.number.isRequired,
  initialValues: PropTypes.object,
  useReferralGuide: PropTypes.bool,
};
