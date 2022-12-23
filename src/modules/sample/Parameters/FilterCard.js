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
import RemoveIcon from '@mui/icons-material/Remove';
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

const FilterCard = ({
  order,
  newValuesData,
  execFunctions,
  initialValues,
  useReferralGuide,
  deleteFilter
}) => {
  let changeValue;
  let valuesForm;
  const {messages} = useIntl();
  const dispatch = useDispatch();
  const formRef = useRef();
  const emptyProduct = {};
  const [counter, setCounter] = React.useState(1);
  const [productsList, setProductsList] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [ubigeoStartingPoint, setUbigeoStartingPoint] = React.useState(0);
  const [existStartingUbigeo, setExistStartingUbigeo] = React.useState(true);
  const [ubigeoArrivalPoint, setUbigeoArrivalPoint] = React.useState(0);
  const [existArrivalUbigeo, setExistArrivalUbigeo] = React.useState(true);
  const [indexProduct, setIndexProduct] = React.useState(null);
  const [reload, setReload] = React.useState(false);
  const [openSelectProduct, setOpenSelectProduct] = React.useState(false);
  const [readyData, setReadyData] = React.useState(false);
  const counts = {};

  let defaultValues = {
    startingAddress: '',
    arrivalAddress: '',
    driverName: '',
    driverDocumentNumber: '',
    plate: '',
    totalWeight: '',
    numberPackages: 1,
    observationDelivery: '',
  };
  const reloadPage = () => {
    setReload(!reload);
  };
  const closeDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    setProductsList([]);

    if (initialValues && initialValues.empty != true) {
      console.log('initialValues', initialValues);

      changeValue(
        'observationDelivery',
        initialValues.featureName || initialValues.featureName,
      );

      let newProds = [];
      let internalCounter = 1;
      let productsToSet = initialValues.values
        ? initialValues.values
        : initialValues.values;
      productsToSet
        ? productsToSet.map((prod) => {
            newProds.push({
              count: prod.name,
              value: prod.name,
              rowId: internalCounter,
            });
            internalCounter += 1;
          })
        : null;
      setProductsList(newProds);
      if(newProds.length > 0){
        const [lastOption] = newProds.slice(-1);
        setCounter(lastOption.rowId+1);
      }
      newProds.map((prod) => {
        changeValue(`count${prod.rowId}`, prod.count);
      });
      console.log('productsList', newProds);
      console.log('defaultValues cambiados', defaultValues);
      reloadPage();
      setReadyData(true);
    } else {
      setProductsList([]);
      setReadyData(true);
    }
  }, [initialValues]);

  // COMPROBAR LAS VALIDACIONES DE LAS CANTIDADES
  const validationSchema = yup.object({
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
    if (existArrivalUbigeo && existStartingUbigeo && existCarrier) {
      let newProducts = productsList;
      newProducts = newProducts.filter((prod) => prod.invalidate == false);
      let newRoute = {
        startingPointUbigeo: ubigeoStartingPoint.toString(),
        startingAddress: data.startingAddress,
        arrivalPointUbigeo: ubigeoArrivalPoint.toString(),
        arrivalAddress: data.arrivalAddress,
        driverName: data.driverName,
        driverDocumentType: typeDocument.toLowerCase(),
        driverDocumentNumber: data.driverDocumentNumber,
        plate: data.plate,
        totalWeight: data.totalWeight,
        numberPackages: data.numberPackages,
        observationDelivery: data.observationDelivery,
        products: newProducts,
      };
      let newOption = {
        products: newProducts,
      };
      console.log('Nueva ruta 1', newRoute);
      newValuesData(order, newOption);
    }
    setSubmitting(false);
  };
  const submitSetSubmitting = (data, setSubmitting) => {
    setSubmitting(true);
    console.log('setSubmitting', setSubmitting);
    console.log('data', {...data, products: productsList});
    let newOption = {
      filterName: data.observationDelivery,
      options: productsList,
    };
    console.log('Nueva ruta 2', newOption);
    newValuesData(order, newOption);
    setSubmitting(false);
  };
  const deleteFilterCard = (dataFilter, order) => {
    console.log('dataFilter', dataFilter);
    console.log('order', order)
    deleteFilter(dataFilter.observationDelivery, order);
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
    prod.count = count ? count : 0;
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
  const deleteProduct = (rowId) => {
    let newProds = productsList;
    console.log('rowId', rowId)
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
  const assignFilter = () => {
    setCounter(1);
    let newOption = {
      filterName: formRef.current.values,
      options: productsList,
    };
    console.log('Nueva ruta 2', newOption);
    newValuesData(order, newOption);
    console.log('Funcionando');
  };

  return (
    <Card sx={{p: 4, mb: 1}}>
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
                  <Grid item xs={11}>
                    <AppTextField
                      label='Nombre del Filtro'
                      name='observationDelivery'
                      variant='outlined'
                      onChange={()=>assignFilter()}
                      multiline
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                      }}
                    />
                  </Grid>
                  <Grid item xs={1}>
                  <IconButton
                    onClick={() => deleteFilterCard(formRef.current.values, order)}
                    aria-label='delete'
                    size='large'
                  >
                    <DeleteIcon fontSize='inherit' />
                  </IconButton>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography sx={{m: 2}}>
                      <IntlMessages id='common.options' />
                    </Typography>
                  </Grid>

                  <TableContainer component={Paper} sx={{maxHeight: 440}}>
                    <Table stickyHeader size='small' aria-label='simple table'>
                      <TableHead>
                        <TableRow>
                          <TableCell align='center'>
                            <IntlMessages id='common.option' />
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
                                      <AppTextField
                                        label='Nombre de opción'
                                        name={`count${obj.rowId}`}
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
    </Card>
  );
};

export default FilterCard;

FilterCard.propTypes = {
  newValuesData: PropTypes.func.isRequired,
  execFunctions: PropTypes.bool.isRequired,
  order: PropTypes.number.isRequired,
  initialValues: PropTypes.object,
  useReferralGuide: PropTypes.bool,
  deleteFilter: PropTypes.func.isRequired,
};
