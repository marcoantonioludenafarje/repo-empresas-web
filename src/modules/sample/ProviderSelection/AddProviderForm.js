import React, {useEffect} from 'react';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import {
  Divider,
  Button,
  IconButton,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  Collapse,
  Alert,
  DialogTitle,
} from '@mui/material';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import AppUpperCaseTextField from '../../../@crema/core/AppFormComponents/AppUpperCaseTextField';

import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';

import {useDispatch, useSelector} from 'react-redux';
import {onGetProviders} from '../../../redux/actions/Providers';

import SelectProvider from './SelectProvider';
import PropTypes from 'prop-types';

const maxLength = 11111111111111111111; //20 caracteres
const validationSchema = yup.object({
  providerId: yup.string().typeError(<IntlMessages id='validation.string' />),
});
const defaultValues = {
  providerId: '',
};
const actualValues = {
  providerId: '',
};

let selectedProvider = {};

const AddProductForm = ({sendData}) => {
  const useStyles = {
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
  };
  /* const classes = useStyles(props); */
  const dispatch = useDispatch();
  let changeValueField;
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  console.log('funcion recibida', sendData);

  let listProvidersPayload = {
    request: {
      payload: {
        typeDocumentProvider: '',
        numberDocumentProvider: '',
        denominationProvider: '',
        merchantId: userDataRes.merchantSelected.merchantId,
        flagBusqDoc: true,
      },
    },
  };

  //FUNCIONES DIALOG
  const [open, setOpen] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setShowAlert(false);
    if (actualValues.providerSearch != '') {
      listProvidersPayload.request.payload.denominationProvider =
        actualValues.providerId;
      getProviders(listProvidersPayload);
    } else {
      listProvidersPayload.request.payload.description = null;
      getProviders(listProvidersPayload);
    }
    setOpen(true);
  };

  const sendProvider = (obj) => {
    selectedProvider = obj;
    changeValueField('providerId', obj.denominationProvider);
    console.log('Producto seleccionado', selectedProvider);
    setOpen(false);
  };

  //APIS FUNCTIONS
  const getProviders = (payload) => {
    dispatch(onGetProviders(payload));
  };

  /* useEffect(() => {
    getProviders(listProvidersPayload);
  }, []); */

  const handleValues = (event) => {
    console.log('evento', event.target);
    Object.keys(actualValues).map((key) => {
      if (key == event.target.name) {
        actualValues[key] = event.target.value;
      }
      if (event.target.name == 'productSearch') {
        setProSearch(event.target.value);
      }
    });
    console.log('actualValues', actualValues);
  };

  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    setShowAlert(false);
    if (selectedProvider.providerId) {
      console.log('Data de formulario', data);
      console.log('Data recibida', selectedProvider);
      sendData(selectedProvider);
      selectedProvider = {};
    } else {
      console.log('Porfavor selecciona un proveedor');
      setShowAlert(true);
    }
    setSubmitting(false);
  };

  return (
    <>
      <Formik
        validateOnChange={true}
        validationSchema={validationSchema}
        initialValues={{...defaultValues}}
        onSubmit={handleData}
      >
        {({isSubmitting, setFieldValue}) => {
          changeValueField = setFieldValue;
          return (
            <>
              <Form
                style={{textAlign: 'left', justifyContent: 'center'}}
                noValidate
                autoComplete='on'
                onChange={handleValues}
              >
                <Grid container spacing={2} sx={{width: 500, margin: 'auto'}}>
                  <Grid item xs={11}>
                    <AppUpperCaseTextField
                      label='Ingrese nombre del proveedor o documento de identidad'
                      name='providerId'
                      htmlFor='filled-adornment-password'
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
                  <Grid item xs={1} style={useStyles.searchIcon}>
                    <IconButton
                      aria-label='search'
                      onClick={handleClickOpen}
                      sx={{top: -10}}
                    >
                      <ManageSearchIcon />
                    </IconButton>
                  </Grid>

                  <Grid
                    sx={{
                      justifyContent: 'center',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                    item
                    xs={12}
                  >
                    <Button
                      color='primary'
                      type='submit'
                      variant='contained'
                      size='large'
                      sx={{width: 1 / 3}}
                      disabled={isSubmitting}
                    >
                      Seleccionar
                    </Button>
                  </Grid>
                </Grid>

                <Dialog
                  open={open}
                  onClose={handleClose}
                  maxWidth='lg'
                  sx={{textAlign: 'center'}}
                  aria-labelledby='alert-dialog-title'
                  aria-describedby='alert-dialog-description'
                >
                  <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
                    {'Selecciona un proveedor'}
                  </DialogTitle>
                  <DialogContent
                    sx={{display: 'flex', justifyContent: 'center'}}
                  >
                    <SelectProvider fcData={sendProvider} />
                  </DialogContent>
                </Dialog>
              </Form>
            </>
          );
        }}
      </Formik>
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
          Por favor selecciona un proveedor.
        </Alert>
      </Collapse>
    </>
  );
};

AddProductForm.propTypes = {
  sendData: PropTypes.func.isRequired,
};

export default AddProductForm;
