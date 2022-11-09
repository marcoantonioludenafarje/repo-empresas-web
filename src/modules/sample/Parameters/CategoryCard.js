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

const CategoryCard = ({
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
  const emptyProduct = {};
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
  const [selectedCategory, setSelectedCategory] =
    React.useState('noCategories');
  const counts = {};

  const {getCarriersRes} = useSelector(({carriers}) => carriers);
  const {jwtToken} = useSelector(({general}) => general);
  const {listProducts} = useSelector(({products}) => products);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);

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

      changeValue('observationDelivery', initialValues.description);
      setSelectedCategory(initialValues);
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
              value: prod.quantityMovement || prod.count,
              rowId: internalCounter,
            });
            internalCounter += 1;
          })
        : null;
      setProductsList(newProds);
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
  }, [initialValues, listProducts]);

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
      console.log('nueva ruta', newRoute);
      newValuesData(order, newOption);
    }
    setSubmitting(false);
  };
  const submitSetSubmitting = (data, setSubmitting) => {
    setSubmitting(true);
    console.log('setSubmitting', setSubmitting);
    console.log('data', {...data, products: productsList});
    // let newOption = {
    //   filterName: data.observationDelivery,
    //   options: productsList,
    // };
    let newOption = data;
    console.log('Nueva opción', newOption);
    newValuesData(order, selectedCategory);
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
    if (event.target.name.includes('observationDelivery')) {
      let updateCategory = selectedCategory;
      updateCategory.description = event.target.value;
      setSelectedCategory(updateCategory);
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
        rowId: internCounter,
        count: prod.quantity,
        value: prod.quantity,
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
      changeValue(`count${prod.rowId}`, prod.count);
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
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
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
              <AppTextField
                label='Nombre de la categoría'
                name='observationDelivery'
                variant='outlined'
                multiline
                sx={{
                  width: '100%',
                  '& .MuiInputBase-input': {
                    fontSize: 14,
                  },
                }}
              />
            </Form>
          );
        }}
      </Formik>
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
    </Box>
  );
};

export default CategoryCard;

CategoryCard.propTypes = {
  newValuesData: PropTypes.func.isRequired,
  execFunctions: PropTypes.bool.isRequired,
  order: PropTypes.number.isRequired,
  initialValues: PropTypes.object,
  useReferralGuide: PropTypes.bool,
};
