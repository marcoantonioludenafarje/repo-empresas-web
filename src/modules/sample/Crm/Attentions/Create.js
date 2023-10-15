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
  TextField,
} from '@mui/material';
import {DateTimePicker} from '@mui/lab';
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
import {newAppointment} from 'redux/actions';
import {getSpecialists} from 'redux/actions/Specialist';

import {ClickAwayListener} from '@mui/base';
import AddClientForm from '../../ClientSelection/AddClientForm';
import {useState} from 'react';

/* const maxLength = 100000000000; //11 chars */
const validationSchema = yup.object({
  /* documentType: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />)
    .max(maxLength, 'Se puede ingresar como maximo 10 caracteres'), */
  title: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  description: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  duration: yup
    .number()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
});
const defaultValues = {
  title: '',
  description: '',
  duration: 0,
};
let newAppointmentPayload = {
  request: {
    payload: {
      appointments: [
        {
          clientId: '',
          clientName: '',
          specialistId: '',
          specialistName: '',
          appointmentTitle: '',
          appointmentDescription: '',
          duration: '',
          durationUnited: '',
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
const Create = (props) => {
  let changeValueField;
  let getValueField;
  let isFormikSubmitting;
  let setFormikSubmitting;
  const classes = useStyles(props);
  const [open, setOpen] = React.useState(false);
  const [openDialogClient, setOpenDialogClient] = React.useState(false);
  const [typeDialog, setTypeDialog] = React.useState('');
  const [showAlert, setShowAlert] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [notifyClientByEmail, setNotifyClientByEmail] = React.useState(false);
  const [notifyClientByWsp, setNotifyClientByWsp] =
    React.useState(false);
  const [countryCode, setCountryCode] = React.useState('+51');
  const [selectedClient, setSelectedClient] = React.useState('');

  const [recordingClientByWsp, setRecordingClientByWsp] =
    React.useState(false);

  const [publishDate, setPublishDate] = React.useState(
    Date.now() + 60 * 60 * 1000 /* Number(query.createdAt) */,
  );
  const [timelord, setTimelord] = useState(0);

  const [finalDate, setFinalDate] = useState(publishDate);

  const dispatch = useDispatch();
  const router = useRouter();

  //APIS
  const toNewAppointment = (payload) => {
    dispatch(newAppointment(payload));
  };
  const toGetSpecialist = (payload) => {
    dispatch(getSpecialists(payload));
  };
  //GET_VALUES_APIS
  const state = useSelector((state) => state);
  console.log('estado', state);
  const {successMessage} = useSelector(({appointment}) => appointment);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({appointment}) => appointment);
  console.log('errorMessage', errorMessage);
  const {userDataRes} = useSelector(({user}) => user);
  const {businessParameter, globalParameter} = useSelector(
    ({general}) => general,
  );
  console.log("parametro negocio", businessParameter);
  const {listSpecialists} = useSelector(({specialists}) => specialists);
  console.log('confeti especialistas', listSpecialists);

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
  }, []);

  useEffect(() => {
    if (userDataRes) {
      newAppointmentPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;
    }
  }, [userDataRes]);

  useEffect(() => {
    console.log('Estamos userDataResINCampaign', userDataRes);
    if (
      userDataRes &&
      userDataRes.merchantSelected &&
      userDataRes.merchantSelected.merchantId
    ) {
      console.log('Estamos entrando al getClients');
      dispatch({type: FETCH_SUCCESS, payload: ''});
      dispatch({type: FETCH_ERROR, payload: ''});
      //dispatch({type: GET_CLIENTS, payload: undefined});
      let listPayload = {
        request: {
          payload: {
            typeDocumentClient: '',
            numberDocumentClient: '',
            denominationClient: '',
            merchantId: userDataRes.merchantSelected.merchantId,
            LastEvaluatedKey: null,
          },
        },
      };
      let globalParameterPayload = {
        request: {
          payload: {
            abreParametro: null,
            codTipoparametro: null,
            country: 'peru',
          },
        },
      };
      toGetSpecialist(listPayload);
      // setFirstload(true);
    }
  }, [userDataRes]);

  const cancel = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //let durationXD = getValueField('duration').value

  const handleDatas = (data, {setSubmitting}) => {
    setSubmitting(true);
    console.log(
      'CONFETI DATA',
      data,
      publishDate.getTime(),
      finalDate.getTime(),
    );
    console.log('objSelects DATA', getValueField('specialist').value);
    console.log('objClients DATA', selectedClient);
    console.log(
      'objtrue',
      notifyClientByEmail,
      notifyClientByWsp,
      recordingClientByWsp,
    );

    let specialistF = listSpecialists.filter(
      (specialist) =>
        specialist.specialistId === getValueField('specialist').value,
    );
    const durationInMilliseconds = parseInt(data.duration) * 60000; // Convert duration to milliseconds
    const calculatedFinalDate = new Date(publishDate + durationInMilliseconds);

    let email;
    if (notifyClientByEmail) {
      email = getValueField('clientEmail').value;
    } else {
      email = null;
    }
    let wsp;
    if (notifyClientByWsp) {
      wsp = getValueField('numberContact').value;
    } else {
      wsp = null;
    }

    let starter = publishDate.getTime();
    let end = finalDate.getTime();

    newAppointmentPayload.request.payload.appointments = [
      {
        clientId: selectedClient.clientId,
        clientName: selectedClient.denominationClient,
        specialistId: specialistF[0].specialistId
          ? specialistF[0].specialistId
          : '',
        specialistName: specialistF[0].specialistName
          ? specialistF[0].specialistName
          : '',
        appointmentDescription: data.description,
        appointmentTitle: data.title,
        scheduledStartedAt: starter,
        scheduledFinishedAt: end,
        duration: data.duration,
        durationUnited: 'Min',
        notifications: {
          email: email,
          wsp: wsp,
          checkEmailNotify: notifyClientByEmail,
          checkWspNotify: notifyClientByWsp,
          checkWspReminder: recordingClientByWsp,
        },
      },
    ];

    console.log('objfinaly', newAppointmentPayload);

    dispatch({type: FETCH_SUCCESS, payload: ''});
    dispatch({type: FETCH_ERROR, payload: ''});
    toNewAppointment(newAppointmentPayload);
    setSubmitting(false);
    setOpenStatus(true);
  };

  const handleClickAway = () => {
    // Evita que se cierre el diálogo haciendo clic fuera del contenido
    // Puedes agregar condiciones adicionales aquí si deseas una lógica más específica.
  };
  const showMessage = () => {
    if (successMessage != '') {
      console.log('MENSAJE DE VALIDEZ', successMessage);
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
            {/* Se ha registrado la información <br />
            correctamente */}
            {successMessage}
          </DialogContentText>
        </>
      );
    } else if (errorMessage) {
      console.log('MENSAJE DE ERROR', errorMessage);
      return (
        <>
          <CancelOutlinedIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            {errorMessage}
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink />;
    }
  };
  const sendStatus = () => {
    console.log('Esto es el momento');
    setOpenStatus(false);
    Router.push('/sample/appointment/views');
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

    setSelectedClient(client);
    console.log('Cliente seleccionado', client);
    //forceUpdate();
    setOpen(false);
  };


  return (
    <Card sx={{p: 4, mx: 'auto'}}>
      <Box sx={{width: 1, textAlign: 'center'}}>
        <Typography
          sx={{mx: 'auto', my: '10px', fontWeight: 600, fontSize: 25}}
        >
          NUEVA ATENCIÓN
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
          onSubmit={handleDatas}
        >
          {({isSubmitting, setFieldValue, getFieldProps, setSubmitting}) => {
            changeValueField = setFieldValue;
            getValueField = getFieldProps;
            setFormikSubmitting = setSubmitting;
            isFormikSubmitting = isSubmitting;

            const durationInMilliseconds =
              parseInt(getValueField('duration').value) * 60000;
            console.log('data', getValueField('date').value);
            //const calculatedFinalDate = new Date(publishDate.getTime() + durationInMilliseconds);

            return (
              <Form
                style={{textAlign: 'left', justifyContent: 'center'}}
                noValidate
                autoComplete='on'
                id='principal-form'
                /* onChange={handleActualData} */
              >
                <Grid container sx={{width: 500, margin: 'auto'}}>
                  <Grid item xs={12} sm={12} sx={{px: 1, mt: 2}}>
                    <AppTextField
                      label='Título *'
                      name='title'
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
                    <Button
                      sx={{width: 1}}
                      variant='outlined'
                      onClick={handleClickOpen.bind(this, 'client')}
                    >
                      Añadir Cliente
                    </Button>
                  </Grid>
                  <Grid sx={{px: 1, mt: 2}} xs={12}>
                    <Typography sx={{mx: 'auto', my: '10px'}}>
                      Cliente:{' '}
                      {selectedClient && selectedClient.denominationClient
                        ? selectedClient.denominationClient
                        : 'No Definido'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel
                        id='specialist-label'
                        style={{fontWeight: 200}}
                      >
                        Especialista
                      </InputLabel>
                      <Select
                        name='specialist'
                        labelId='specialist-label'
                        label='Especialista'
                        onChange={(option, value) => {
                          setFieldValue('specialist', value.props.value);
                          // setIdentidad(value.props.value);
                        }}
                      >
                        {listSpecialists.map((specialist, index) => (
                          <MenuItem
                            key={`specialist-${index}`}
                            value={specialist.specialistId}
                            style={{fontWeight: 200}}
                          >
                            {specialist.specialistName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <AppTextField
                      label='Descripción *'
                      name='description'
                      variant='outlined'
                      multiline
                      rows={4}
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          height: '150px',
                          fontSize: 14,
                          textAlign: 'start',
                        },
                        my: 2,
                        mx: 0,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <DateTimePicker
                      minDateTime={new Date(Date.now() + 59 * 60 * 1000)}
                      value={publishDate}
                      onChange={(e) => {
                        console.log('tipo', e);
                        setPublishDate(e);
                        const updatedFinalDate = new Date(
                          e.getTime() + getValueField('duration').value * 60000,
                        );
                        console.log('final fecha>>', updatedFinalDate);
                        setFinalDate(updatedFinalDate);
                      }}
                      label='Fecha hora de Inicio *'
                      name='date'
                      inputFormat='dd/MM/yyyy hh:mm a'
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          sx={{width: '100%', my: 2}}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <AppTextField
                      label='Duración escriba en minutos*'
                      name='duration'
                      variant='outlined'
                      type='number'
                      onInput={(e) => {
                        // console.log('timelord', e.target.value);
                        // console.log('timelord pub', publishDate);
                        // console.log('timelord publish', publishDate.getTime());
                        // console.log('timelord time en mili', e.target.value * 60 * 1000);
                        // console.log('timelord suma', new Date(publishDate.getTime() + e.target.value * 60 * 1000));
                        
                        const filldate = new Date(publishDate.getTime() + e.target.value * 60 * 1000)
                        console.log("timelord >>>", filldate);
                        setFinalDate(filldate);
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
                  <Grid item xs={12} sm={12}>
                    <DateTimePicker
                      minDateTime={new Date(Date.now() + 59 * 60 * 1000)}
                      value={finalDate}
                      label='Fecha hora de Final *'
                      name='dateFinal'
                      inputFormat='dd/MM/yyyy hh:mm a'
                      readOnly
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          sx={{width: '100%', my: 2}}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
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
                    <Grid item xs={12} sm={12}>
                      <AppTextField
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
                  <Grid item xs={12} sm={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={notifyClientByWsp}
                          onChange={(e) =>
                            setNotifyClientByWsp(e.target.checked)
                          }
                          name='notifyClientByWsp'
                          color='primary'
                        />
                      }
                      label='Notificar a cliente por Wsp'
                    />
                  </Grid>
                  {notifyClientByWsp && (
                    <Grid item xs={2} md={2}>
                      <TextField
                        disabled
                        defaultValue={'+51'}
                        label={<IntlMessages id='common.cellphoneCountryCod' />}
                        variant='filled'
                        sx={{
                          my: 2,
                          mx: 0,
                        }}
                        color='success'
                        focused
                      />
                    </Grid>
                  )}
                  {notifyClientByWsp && (
                    <Grid item xs={10}>
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
                    disabled={isSubmitting}
                    form='principal-form'
                    startIcon={<SaveAltOutlinedIcon />}
                  >
                    Finalizar
                  </Button>

                  <Button
                    sx={{mx: 'auto', width: '40%', py: 2}}
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
      </Box>

      <Dialog
        open={openDialogClient}
        onClose={handleCloseDialogClient}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='xl'
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
            <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
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
          {'Registro de Citas'}
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
              Router.push('/sample/appointment/views');
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
            {'Registro de Cita'}
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

export default Create;
