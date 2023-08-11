import React, {useEffect} from 'react';
import {Form, Formik} from 'formik';
import * as yup from 'yup';

import {makeStyles} from '@mui/styles';
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
  FormControlLabel,
  Checkbox,
} from '@mui/material';

import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import AppUpperCaseTextField from '../../../../@crema/core/AppFormComponents/AppUpperCaseTextField';
import {red} from '@mui/material/colors';
import {orange} from '@mui/material/colors';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
} from '../../../../shared/constants/ActionTypes';
import {getUserData} from '../../../../redux/actions/User';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import AppTextField from '../../../../@crema/core/AppFormComponents/AppTextField';
import SchoolIcon from '@mui/icons-material/School';
import Router, {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {newDriver} from '../../../../redux/actions/Drivers';

import AddClientForm from '../../ClientSelection/AddClientForm';

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
    .integer(<IntlMessages id='validation.number.integer' />)
    .max(100000000000, 'Se puede ingresar como maximo 11 caracteres'),
  firstName: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  lastName: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  license: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
});
const defaultValues = {
  nroDocument: '',
  firstName: '',
  lastName: '',
  license: '',
};
let newDriverPayload = {
  request: {
    payload: {
      drivers: [
        {
          typeDocumentDriver: '',
          numberDocumentDriver: '',
          firstName: '',
          lastName: '',
          fullName: '',
          license: '',
        },
      ],
      merchantId: '',
    },
  },
};

const useStyles = makeStyles((theme) => ({
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
  closeButton: {
    cursor: 'pointer',
    float: 'right',
    marginTop: '5px',
    width: '20px',
  },
}));
const Createappoinment = (props) => {
  const classes = useStyles(props);
  const [open, setOpen] = React.useState(false);
  const [openDialogClient, setOpenDialogClient] = React.useState(false);
  const [typeDialog, setTypeDialog] = React.useState('');
  const [showAlert, setShowAlert] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [minTutorial, setMinTutorial] = React.useState(false);
  const [notifyClientByEmail, setNotifyClientByEmail] = React.useState(false);
  const [notifyClientByWhatsapp, setNotifyClientByWhatsapp] =
    React.useState(false);
  const [countryCode, setCountryCode] = React.useState('+51');
  const [selectedClient, setSelectedClient] = React.useState([])

  const [recordingClientByWhatsapp, setRecordingClientByWhatsapp] =
    React.useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  let objSelects = {
    documentType: 'DNI',
  };

  //APIS
  const toNewDriver = (payload) => {
    dispatch(newDriver(payload));
  };
  //GET_VALUES_APIS
  const {newDriverRes} = useSelector(({drivers}) => drivers);
  console.log('newDriverRes', newDriverRes);
  const {successMessage} = useSelector(({drivers}) => drivers);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({drivers}) => drivers);
  console.log('errorMessage', errorMessage);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);

  useEffect(() => {
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
      newDriverPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;
    }
  }, [userDataRes]);

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
    newDriverPayload.request.payload.drivers[0].typeDocumentDriver =
      objSelects.documentType;
    newDriverPayload.request.payload.drivers[0].numberDocumentDriver =
      data.nroDocument;
    newDriverPayload.request.payload.drivers[0].firstName = data.firstName;
    newDriverPayload.request.payload.drivers[0].lastName = data.lastName;
    newDriverPayload.request.payload.drivers[0].fullName =
      data.firstName + ' ' + data.lastName;
    newDriverPayload.request.payload.drivers[0].license = data.license;
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    toNewDriver(newDriverPayload);
    setSubmitting(false);
    setOpenStatus(true);
  };

  const registerSuccess = () => {
    return (
      successMessage != undefined &&
      newDriverRes != undefined && // TO DO
      !('error' in newDriverRes)
    );
  };

  const registerError = () => {
    return (
      (successMessage != undefined &&
        newDriverRes &&
        'error' in newDriverRes) ||
      errorMessage
    );
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
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink />;
    }
  };

  const sendStatus = () => {
    if (registerSuccess()) {
      Router.push('/sample/drivers/table');
      setOpenStatus(false);
    } else if (registerError()) {
      setOpenStatus(false);
    } else {
      setOpenStatus(false);
    }
  };

  const handleField = (event) => {
    console.log('evento', event);
    objSelects[event.target.name] = event.target.value;
    console.log('ocjSelects', objSelects);
  };

  const handleCloseDialogClient = () => {
    setOpenDialogClient(false);
  };

  const handleClickOpen = (type) => {
    setOpenDialogClient(true);
    setTypeDialog(type);
    setShowAlert(false);
  };

  const getClient = (client) => {
    console.log('Estoy en el getClient');
    if (client.typeDocumentClient == 'RUC') {
      let serieParameter = businessParameter.find(
        (obj) => obj.abreParametro == 'SERIES_BILL',
      );
      setSerial(serieParameter.metadata ? serieParameter.metadata : '');
      setProofOfPaymentType('bill');
    } else {
      setSerial('S');
      setProofOfPaymentType('ticket');
    }
    setSelectedClient(client);
    console.log('Cliente seleccionado', client);
    forceUpdate();
    setOpen(false);
  };

  return (
    <Card sx={{p: 4}}>
      <Box sx={{width: 1, textAlign: 'center'}}>
        <Typography
          sx={{mx: 'auto', my: '10px', fontWeight: 600, fontSize: 25}}
        >
          NUEVA CITA
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
            return (
              <Form
                style={{textAlign: 'left', justifyContent: 'center'}}
                noValidate
                autoComplete='on'
                /* onChange={handleActualData} */
              >
                <Grid container spacing={2} sx={{width: 500, margin: 'auto'}}>
                  <Grid item xs={8} sm={12}>
                    <AppTextField
                      label='Título *'
                      name='nroDocument'
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
                  <Grid item xs={8} sm={12}>
                    <Button
                      sx={{width: 1}}
                      variant='outlined'
                      onClick={handleClickOpen.bind(this, 'client')}
                    >
                      Añadir Cliente
                    </Button>
                  </Grid>
                  <Grid item xs={8} sm={12}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel
                        id='documentType-label'
                        style={{fontWeight: 200}}
                      >
                        Especialista
                      </InputLabel>
                      <Select
                        name='documentType'
                        labelId='documentType-label'
                        label='Identificador'
                        onChange={handleField}
                      >
                        <MenuItem value='DNI' style={{fontWeight: 200}}>
                          Doctor caso de la vida real
                        </MenuItem>
                        <MenuItem value='CE' style={{fontWeight: 200}}>
                          Doctor House
                        </MenuItem>
                        <MenuItem value='CE' style={{fontWeight: 200}}>
                          Doctor Sin licencia XD
                        </MenuItem>
                        <MenuItem value='CE' style={{fontWeight: 200}}>
                          Doctor Ateo
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={8} sm={12}>
                    <AppUpperCaseTextField
                      label='Descripción *'
                      name='lastName'
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
                  <Grid item xs={8} sm={12}>
                    <AppUpperCaseTextField
                      label='Fecha/Hora Inicio *'
                      name='license'
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
                  <Grid item xs={8} sm={12}>
                    <AppUpperCaseTextField
                      label='Duración *'
                      name='license'
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
                  <Grid item xs={8} sm={12}>
                    <AppUpperCaseTextField
                      label='Fecha/Hora Fin *'
                      name='license'
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
                  <Grid item xs={8} sm={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={notifyClientByEmail}
                          onChange={(e) =>
                            setNotifyClientByEmail(e.target.checked)
                          }
                          name='notifyClientByEmail'
                          color='primary'
                        />
                      }
                      label='Notificar a cliente por correo'
                    />
                  </Grid>
                  {notifyClientByEmail && (
                    <Grid item xs={8} sm={12}>
                      <AppUpperCaseTextField
                        label='Correo de cliente'
                        name='clientEmail'
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
                  )}
                  <Grid item xs={8} sm={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={notifyClientByWhatsapp}
                          onChange={(e) =>
                            setNotifyClientByWhatsapp(e.target.checked)
                          }
                          name='notifyClientByWhatsapp'
                          color='primary'
                        />
                      }
                      label='Notificar a cliente por Whatsapp'
                    />
                  </Grid>
                  {notifyClientByWhatsapp && (
                    <Grid container spacing={2}>
                      <Grid item xs={2}>
                        <AppUpperCaseTextField
                          label='+51'
                          name='countryCode'
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
                      <Grid item xs={10} sm={12}>
                        <AppUpperCaseTextField
                          label='Número de cliente'
                          name='clientWhatsapp'
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
                  )}
                  <Grid item xs={8} sm={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={recordingClientByWhatsapp}
                          onChange={(e) =>
                            setRecordingClientByWhatsapp(e.target.checked)
                          }
                          name='recordingClientByWhatsapp'
                          color='primary'
                        />
                      }
                      label='Recordatorio a cliente por Whatsapp'
                    />
                  </Grid>
                  {recordingClientByWhatsapp && (
                    <Grid item xs={8} sm={12}>
                      <AppUpperCaseTextField
                        label='Horas antes'
                        name='clientHours'
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
                  )}
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
                    disabled={true}
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
                          window.open('https://youtu.be/e-MjZrUNQzY/')
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
                          window.open('https://youtu.be/e-MjZrUNQzY/')
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
        open={openDialogClient}
        onClose={handleCloseDialogClient}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        {typeDialog == 'client' ? (
          <>
            <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
              {'Búsqueda de clientes'}
              <CancelOutlinedIcon
                onClick={setOpenDialogClient.bind(this, false)}
                className={classes.closeButton}
              />
            </DialogTitle>
            <DialogContent>
              <AddClientForm sendData={getClient} />
            </DialogContent>
          </>
        ) : (
          <></>
        )}
      </Dialog>

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Registro de Conductores'}
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
              Router.push('/sample/drivers/table');
            }}
          >
            Sí
          </Button>
          <Button variant='outlined' onClick={handleClose}>
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openStatus}
        onClose={sendStatus}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Registro de Conductor'}
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
    </Card>
  );
};

export default Createappoinment;
