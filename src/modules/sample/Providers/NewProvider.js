import React, {useEffect} from 'react';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import {
  Card,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Divider,
  Typography,
  IconButton,
  Collapse,
  Alert,
} from '@mui/material';

import {ClickAwayListener} from '@mui/base';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import {red} from '@mui/material/colors';
import {orange} from '@mui/material/colors';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SchoolIcon from '@mui/icons-material/School';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
  VALIDATE_SUNAT,
} from '../../../shared/constants/ActionTypes';
import {getUserData} from '../../../redux/actions/User';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import AppLowerCaseTextField from '../../../@crema/core/AppFormComponents/AppLowerCaseTextField';
import AppUpperCaseTextField from '../../../@crema/core/AppFormComponents/AppUpperCaseTextField';

import Router, {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {newProvider} from '../../../redux/actions/Providers';
import {validateSUNAT} from '../../../redux/actions/General';

/* const maxLength = 100000000000; //11 chars */
const validationSchema = yup.object({
  /* documentType: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />)
    .max(maxLength, 'Se puede ingresar como maximo 10 caracteres'), */
  nroDocument: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .required(<IntlMessages id='validation.required' />)
    .max(100000000000, 'Se puede ingresar como maximo 11 caracteres'),
  name: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  addressProvider: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
  emailProvider: yup
    .string()
    .typeError(<IntlMessages id='validation.number' />)
    .email('Formato de correo invalido'),
  emailContact: yup
    .string()
    .typeError(<IntlMessages id='validation.number' />)
    .email('Formato de correo invalido'),
  nameContact: yup.string().typeError(<IntlMessages id='validation.string' />),
  numberContact: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .max(1000000000, 'Se puede ingresar como maximo 11 caracteres'),
  extraInformationProvider: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
});
const defaultValues = {
  nroDocument: '',
  name: '',
  addressProvider: '',
  emailProvider: '',
  emailContact: '',
  nameContact: '',
  numberContact: '',
  extraInformationProvider: '',
};
let newProviderPayload = {
  request: {
    payload: {
      providers: [
        {
          typeDocumentProvider: '',
          numberDocumentProvider: '',
          denominationProvider: '',
          addressProvider: '',
          nameContact: '',
          emailProvider: '',
          numberContact: '',
          emailContact: '',
          extraInformationProvider: '',
        },
      ],
      merchantId: '',
    },
  },
};
const NewProvider = () => {
  let getValueField;
  let changeValueField;
  const [open, setOpen] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [minTutorial, setMinTutorial] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [typeAlert, setTypeAlert] = React.useState('');
  const [severityAlert, setSeverityAlert] = React.useState('warning');
  const [messageAlert, setMessageAlert] = React.useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  let objSelects = {
    documentType: 'RUC',
  };

  //APIS
  const toNewProvider = (payload) => {
    dispatch(newProvider(payload));
  };
  const toValidateSunat = (payload) => {
    dispatch(validateSUNAT(payload));
  };
  //GET_VALUES_APIS
  const {newProviderRes} = useSelector(({providers}) => providers);
  console.log('newProviderRes', newProviderRes);
  const {successMessage} = useSelector(({providers}) => providers);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({providers}) => providers);
  console.log('errorMessage', errorMessage);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  const {validateSunatRes} = useSelector(({general}) => general);
  console.log('validateSunatRes', validateSunatRes);
  useEffect(() => {
    dispatch({type: VALIDATE_SUNAT, payload: undefined});
    if (!userDataRes) {
      console.log('Esto se ejecuta?');

      dispatch({type: GET_USER_DATA, payload: undefined});
      const toGetUserData = (payload) => {
        dispatch(getUserData(payload));
      };
      let getUserDataPayload = {
        request: {
          payload: {
            userId: JSON.parse(localStorage.getItem('payload')).sub,
          },
        },
      };

      toGetUserData(getUserDataPayload);
    }
    setTimeout(() => {
      setMinTutorial(true);
    }, 2000);
  }, []);

  useEffect(() => {
    if (userDataRes) {
      newProviderPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;
    }
  }, [userDataRes]);

  useEffect(() => {
    if (validateSunatRes && getValueField) {
      if (validateSunatRes.message) {
        setShowAlert(true);
        setTypeAlert('validateSUNAT');
        setMessageAlert(validateSunatRes.message);
      } else {
        if (objSelects['documentType'] == 'DNI') {
          changeValueField('givenName', validateSunatRes.nombres);
          changeValueField('lastName', validateSunatRes.apellidoPaterno);
          changeValueField('secondLastName', validateSunatRes.apellidoMaterno);
          let completeName = `${validateSunatRes.nombres} ${validateSunatRes.apellidoPaterno} ${validateSunatRes.apellidoMaterno}`;
          changeValueField('name', completeName);
          setShowAlert(false);
        } else if (objSelects['documentType'] == 'RUC') {
          changeValueField('name', validateSunatRes.razonSocial);
          changeValueField('addressClient', validateSunatRes.direccion);
          setShowAlert(true);
          setTypeAlert('validateSUNAT');
          if (
            validateSunatRes.condicion == 'HABIDO' &&
            validateSunatRes.estado == 'ACTIVO'
          ) {
            setSeverityAlert('success');
          }
          setMessageAlert(
            `Condición: ${validateSunatRes.condicion}, Estado: ${validateSunatRes.estado}`,
          );
        }
      }
    }
  }, [validateSunatRes]);
  const cancel = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    delete data.documentType;
    console.log('Data', data);
    console.log('objSelects', objSelects);
    newProviderPayload.request.payload.providers[0].typeDocumentProvider =
      objSelects.documentType;
    newProviderPayload.request.payload.providers[0].numberDocumentProvider =
      data.nroDocument;
    newProviderPayload.request.payload.providers[0].denominationProvider =
      data.name;
    newProviderPayload.request.payload.providers[0].addressProvider =
      data.addressProvider;
    newProviderPayload.request.payload.providers[0].emailProvider =
      data.emailProvider;
    newProviderPayload.request.payload.providers[0].nameContact =
      data.nameContact;
    newProviderPayload.request.payload.providers[0].numberContact =
      data.numberContact;
    newProviderPayload.request.payload.providers[0].emailContact =
      data.emailContact;
    newProviderPayload.request.payload.providers[0].extraInformationProvider =
      data.extraInformationProvider;
    toNewProvider(newProviderPayload);
    setSubmitting(false);
    setOpenStatus(true);
  };

  const handleClickAway = () => {
    // Evita que se cierre el diálogo haciendo clic fuera del contenido
    // Puedes agregar condiciones adicionales aquí si deseas una lógica más específica.
  };
  const showMessage = () => {
    if (successMessage != undefined) {
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
    } else if (errorMessage) {
      return (
        <>
          <CancelOutlinedIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            Se ha producido un error al registrar.
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink />;
    }
  };

  const sendStatus = () => {
    setOpenStatus(false);
    Router.push('/sample/providers/table');
  };

  const handleField = (event) => {
    console.log('evento', event);
    objSelects[event.target.name] = event.target.value;
    console.log('ocjSelects', objSelects);
  };

  return (
    <Card sx={{p: 4}}>
      <Box sx={{width: 1, textAlign: 'center'}}>
        <Typography
          sx={{mx: 'auto', my: '10px', fontWeight: 600, fontSize: 25}}
        >
          REGISTRO DE PROVEEDOR
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
          {({isSubmitting, setFieldValue, getFieldProps}) => {
            getValueField = getFieldProps;
            changeValueField = setFieldValue;
            return (
              <Form
                style={{textAlign: 'left', justifyContent: 'center'}}
                noValidate
                autoComplete='on'
                /* onChange={handleActualData} */
              >
                <Grid
                  container
                  spacing={2}
                  sx={{width: '100%', margin: 'auto'}}
                  maxWidth={500}
                >
                  <Grid item xs={12} sm={12}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel
                        id='categoria-label'
                        style={{fontWeight: 200}}
                      >
                        Identificador
                      </InputLabel>
                      <Select
                        defaultValue='RUC'
                        name='documentType'
                        labelId='documentType-label'
                        label='Identificador'
                        onChange={handleField}
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
                        <MenuItem value='PAS' style={{fontWeight: 200}}>
                          PAS
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <AppTextField
                      label='Número Identificador *'
                      name='nroDocument'
                      variant='outlined'
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() => {
                              console.log(
                                'nroDocument',
                                getValueField('nroDocument').value,
                              );
                              toValidateSunat({
                                type: objSelects['documentType'].toLowerCase(),
                                nro: getValueField('nroDocument').value,
                              });
                            }}
                          >
                            <SearchIcon />
                          </IconButton>
                        ),
                      }}
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                        mx: 0,
                      }}
                    />
                  </Grid>
                  <Collapse in={showAlert}>
                    <Alert
                      severity='info'
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
                      {typeAlert == 'validateSUNAT' ? messageAlert : null}
                    </Alert>
                  </Collapse>
                  <Grid item xs={12} sm={12}>
                    <AppUpperCaseTextField
                      label='Nombre / Razón Social *'
                      name='name'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                        mx: 0,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <AppUpperCaseTextField
                      label='Dirección'
                      name='addressProvider'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                        mx: 0,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <AppLowerCaseTextField
                      label='Correo de Empresa'
                      name='emailProvider'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                        mx: 0,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <AppUpperCaseTextField
                      label='Nombre de contacto'
                      name='nameContact'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                        mx: 0,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <AppTextField
                      label='Telefono fijo o celular de contacto'
                      name='numberContact'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                        mx: 0,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <AppLowerCaseTextField
                      label='Correo de contacto'
                      name='emailContact'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                        mx: 0,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <AppTextField
                      label='Información adicional'
                      multiline
                      rows={4}
                      name='extraInformationProvider'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                        mx: 0,
                      }}
                    />
                  </Grid>
                </Grid>

                <ButtonGroup
                  orientation='vertical'
                  variant='outlined'
                  sx={{width: 1, py: 3}}
                  aria-label='outlined button group'
                >
                  <Button
                    color='primary'
                    sx={{mx: 'auto', width: '40%', py: 2}}
                    type='submit'
                    variant='contained'
                    disabled={isSubmitting}
                    startIcon={<SaveAltOutlinedIcon />}
                  >
                    Finalizar
                  </Button>
                  {/* <Button
                    sx={{mx: 'auto', width: '40%', py: 2}}
                    variant='outlined'
                    startIcon={<SaveAltOutlinedIcon />}
                  >
                    Guardar y registrar nuevo
                  </Button> */}
                  <Button
                    sx={{mx: 'auto', width: '40%', py: 2}}
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
                          window.open('https://youtu.be/rh8-Gy7UmTs/')
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
                          window.open('https://youtu.be/rh8-Gy7UmTs/')
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
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Registro de Proveedor'}
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
              setOpen(false);
              Router.push('/sample/providers/table');
            }}
          >
            Sí
          </Button>
          <Button variant='outlined' onClick={handleClose}>
            No
          </Button>
        </DialogActions>
      </Dialog>

      <ClickAwayListener onClickAway={handleClickAway}>
        <Dialog
          open={openStatus}
          onClose={sendStatus}
          sx={{textAlign: 'center'}}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
            {'Registro de proveedor'}
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
    </Card>
  );
};

export default NewProvider;
