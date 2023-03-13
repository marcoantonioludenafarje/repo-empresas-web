import React, {useEffect} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Grid,
} from '@mui/material';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import PropTypes from 'prop-types';

import SearchIcon from '@mui/icons-material/Search';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import {onGetProducts, deleteProduct} from '../../../redux/actions/Products';
import {useDispatch, useSelector} from 'react-redux';
import {
  FETCH_ERROR,
  FETCH_SUCCESS,
  GET_PRODUCTS,
} from '../../../shared/constants/ActionTypes';

const SelectProduct = ({fcData, search}) => {
  const dispatch = useDispatch();

  let changeValueField;

  const validationSchema = yup.object({
    guide: yup.string().typeError(<IntlMessages id='validation.string' />),
    observation: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />),
  });
  const defaultValues = {
    productName: '',
  };

  let listProductsPayload = {
    request: {
      payload: {
        businessProductCode: null,
        description: null,
        merchantId: '',
      },
    },
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [moneyUnit, setMoneyUnit] = React.useState('');

  const {listProducts} = useSelector(({products}) => products);
  console.log('products123', listProducts);
  const {businessParameter} = useSelector(({general}) => general);
  console.log('businessParameter', businessParameter);
  const {userAttributes} = useSelector(({user}) => user);
  console.log('userAttributes', userAttributes);
  const {userDataRes} = useSelector(({user}) => user);
  console.log('userDataRes', userDataRes);
  listProductsPayload.request.payload.merchantId =
    userDataRes.merchantSelected.merchantId;

  useEffect(() => {
    if (search) {
      dispatch({type: GET_PRODUCTS, payload: undefined});
      getProducts(listProductsPayload);
    }
  }, []);

  const getProducts = (payload) => {
    dispatch(onGetProducts(payload));
  };

  const sendData = (obj) => {
    fcData(obj);
  };

  const parseTo3Decimals = (number) => {
    let newValue = number + Number.EPSILON;
    newValue = Math.round(newValue * 1000) / 1000;
    return newValue;
  };

  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: GET_PRODUCTS, payload: undefined});
    listProductsPayload.request.payload.description = data.productName;
    console.log('nombre de producto', data);
    getProducts(listProductsPayload);
    setSubmitting(false);
  };

  useEffect(() => {
    if (businessParameter != undefined) {
      let obtainedMoneyUnit = businessParameter.find(
        (obj) => obj.abreParametro == 'DEFAULT_MONEY_UNIT',
      ).value;
      setMoneyUnit(obtainedMoneyUnit);
      console.log('moneyUnit desde selectProducts', moneyUnit);
    }
  }, [businessParameter != undefined]);

  return (
    <TableContainer component={Paper}>
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
              <Grid container spacing={2} sx={{width: 500, margin: 'auto'}}>
                <Grid item xs={9}>
                  <AppTextField
                    label='Busca un producto'
                    placeholder='Nombre de producto'
                    name='productName'
                    htmlFor='filled-adornment-password'
                    variant='outlined'
                    onChange={() => {
                      setProductNameVal(true);
                    }}
                    sx={{
                      width: '100%',
                      '& .MuiInputBase-input': {
                        fontSize: 14,
                      },
                      my: 2,
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Button
                    color='primary'
                    type='submit'
                    variant='contained'
                    size='large'
                    sx={{my: '12px', width: 1}}
                    disabled={isSubmitting}
                    endIcon={<SearchIcon />}
                  >
                    Buscar
                  </Button>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>

      <Table sx={{minWidth: 650}} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Precio compra sugerido</TableCell>
            <TableCell>Precio venta sugerido</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listProducts && Array.isArray(listProducts) ? (
            listProducts.map((obj) => {
              return (
                <TableRow
                  sx={{
                    '&:last-child td, &:last-child th': {border: 0},
                    cursor: 'pointer',
                  }}
                  key={obj.product}
                  id={obj.product}
                  hover
                  onClick={() => {
                    sendData(obj);
                  }}
                >
                  <TableCell>{obj.businessProductCode}</TableCell>
                  <TableCell>{obj.description}</TableCell>
                  <TableCell>{obj.stock}</TableCell>
                  <TableCell>
                    {`${parseTo3Decimals(Number(obj.costPriceUnit)).toFixed(
                      3,
                    )} ${moneyUnit}`}
                  </TableCell>
                  <TableCell>
                    {`${parseTo3Decimals(
                      Number(obj.priceBusinessMoneyWithIgv),
                    ).toFixed(3)} ${moneyUnit}`}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <CircularProgress
              disableShrink
              sx={{m: '10px', position: 'relative'}}
            />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

SelectProduct.propTypes = {
  fcData: PropTypes.func.isRequired,
  search: PropTypes.bool,
};

export default SelectProduct;
