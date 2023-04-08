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
import {onGetClients} from '../../../redux/actions/Clients';

import SelectClient from './SelectClient';
import PropTypes from 'prop-types';
import {GET_CLIENTS} from '../../../shared/constants/ActionTypes';

import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import CachedIcon from '@mui/icons-material/Cached';
const maxLength = 11111111111111111111; //20 caracteres
const validationSchema = yup.object({
  clientId: yup.string().typeError(<IntlMessages id='validation.string' />),
});
const defaultValues = {
  clientId: '',
};
const actualValues = {
  clientId: '',
};

let selectedClient = {};

const AddClientForm = ({sendData}) => {
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
  console.log('funcion recibida', sendData);

  //FUNCIONES DIALOG
  const [open, setOpen] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  const [basicUrl, setBasicUrl] = React.useState('');





  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setShowAlert(false);
    let listClientsPayload = {
      request: {
        payload: {
          typeDocumentClient: '',
          numberDocumentClient: '',
          denominationClient: '',
          merchantId: userDataRes.merchantSelected.merchantId,
          flagBusqDoc: true,
        },
      },
    };
    //dispatch({type: GET_CLIENTS, payload: undefined});
    listClientsPayload.request.payload.LastEvaluatedKey = null;
    dispatch({type: GET_CLIENTS, payload: {callType: "firstTime"}});
    if (actualValues.clientSearch != '') {
      listClientsPayload.request.payload.denominationClient =
        actualValues.clientId;
      getClients(listClientsPayload);
    } else {
      listClientsPayload.request.payload.description = null;
      getClients(listClientsPayload);
    }
    setOpen(true);
  };

  const sendClient = (obj) => {
    selectedClient = obj;
    changeValueField('clientId', obj.denominationClient);
    console.log('Producto seleccionado', selectedClient);
    setOpen(false);
  };

  //APIS FUNCTIONS
  const getClients = (payload) => {
    dispatch(onGetClients(payload));
  };

  /* useEffect(() => {
    getClients(listClientsPayload);
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
    if (selectedClient.clientId) {
      console.log('Data de formulario', data);
      console.log('Data recibida', selectedClient);
      sendData(selectedClient);
      selectedClient = {};
    } else {
      console.log('Porfavor busque y seleccione un cliente');
      setShowAlert(true);
    }
    setSubmitting(false);
  };


  useEffect(() => {
    let domain = (new URL(window.location.href));
    setBasicUrl(domain.origin)
  }, []);


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
                      label='Ingrese nombre del cliente o documento de identidad'
                      name='clientId'
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
                    <div>{`Listado de Clientes`}</div>
                    <Button
                    sx={{mx: 'auto', mx: 1 , my: 1 ,py: 3}}
                    variant='outlined'
                    startIcon={<CachedIcon sx={{m: 1 , my: 'auto'}} />}
                    onClick={() => handleClickOpen()}
                    >
                    {'Actualizar'}  
                    </Button>
                    <Button
                    sx={{mx: 'auto',py: 3 , mx: 1,  my: 1 }}
                    variant='outlined'
                    startIcon={<ArrowCircleLeftOutlinedIcon />}
                    onClick={() => window.open(`${basicUrl}/sample/clients/new`)}
                    >
                     Agregar nuevo Cliente
                    </Button>

                  </DialogTitle>
                  <DialogContent
                    sx={{display: 'flex', justifyContent: 'center'}}
                  >
                    <SelectClient fcData={sendClient} />
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
          Por favor selecciona un cliente.
        </Alert>
      </Collapse>
    </>
  );
};

AddClientForm.propTypes = {
  sendData: PropTypes.func.isRequired,
};

export default AddClientForm;
