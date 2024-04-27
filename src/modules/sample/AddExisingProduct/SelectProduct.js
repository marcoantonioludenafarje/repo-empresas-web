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
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import WarehouseIcon from '@mui/icons-material/Warehouse';
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

  const [openWarehouse, setOpenWarehouse] = React.useState(false);
  const [fast, setFast] = React.useState({});
  const {listProducts} = useSelector(({products}) => products);
  console.log('products123', listProducts);
  const {businessParameter} = useSelector(({general}) => general);
  console.log('businessParameter', businessParameter);
  const {userAttributes} = useSelector(({user}) => user);
  console.log('userAttributes', userAttributes);
  const {userDataRes} = useSelector(({user}) => user);
  console.log('userDataRes', userDataRes);
  const {getStartingLocationsRes} = useSelector(({locations}) => locations);

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

  const handleWarehouseClick = (product, index) => {
    console.log('index', index);
    console.log('product del map', product);
    setOpenWarehouse(true);
    setFast(product);
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
            <TableCell>Stock</TableCell>
            <TableCell>Costo sugerido</TableCell>
            <TableCell>Valor de venta sugerido</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listProducts && Array.isArray(listProducts) ? (
            listProducts.map((obj, index) => {
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
                  <TableCell>
                    <Badge
                      badgeContent={obj.stock}
                      color='primary'
                      anchorOrigin={{
                        vertical: 'left',
                        horizontal: 'right',
                      }}
                    >
                      <Button
                        id='basic-button'
                        aria-controls={openWarehouse ? true : undefined}
                        aria-haspopup='true'
                        aria-expanded={openWarehouse ? true : undefined}
                        onClick={(event) => {
                          handleWarehouseClick(obj, index);
                          event.stopPropagation();
                        }}
                      >
                        <WarehouseIcon />
                      </Button>
                    </Badge>
                  </TableCell>
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
      <Dialog
        open={openWarehouse}
        onClose={() => setOpenWarehouse(false)}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {fast.description}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <TableContainer component={Paper} sx={{maxHeight: 440}}>
            <Table sx={{minWidth: 650}} stickyHeader aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Cantidad</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fast.locations && Array.isArray(fast.locations)
                  ? fast.locations.map((obj, index) => {
                      const locationName = getStartingLocationsRes.find(
                        (objL) => objL.modularCode == obj.modularCode,
                      ).locationName;
                      return (
                        <TableRow
                          sx={{'&:last-child td, &:last-child th': {border: 0}}}
                          key={obj.modularCode}
                        >
                          <TableCell>{obj.modularCode.split('-')[0]}</TableCell>
                          <TableCell>{locationName}</TableCell>
                          <TableCell>{obj.stock}</TableCell>
                        </TableRow>
                      );
                    })
                  : null}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={() => setOpenWarehouse(false)}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

SelectProduct.propTypes = {
  fcData: PropTypes.func.isRequired,
  search: PropTypes.bool,
};

export default SelectProduct;
