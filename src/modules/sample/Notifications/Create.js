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
  TextField,
  Autocomplete,
  OutlinedInput,
} from '@mui/material';
import {v4 as uuidv4} from 'uuid';

import {
  onGetBusinessParameter,
  onGetGlobalParameter,
  updateAllBusinessParameter,
} from '../../../redux/actions/General';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import {red} from '@mui/material/colors';
import {orange} from '@mui/material/colors';
import SchoolIcon from '@mui/icons-material/School';
import YouTubeIcon from '@mui/icons-material/YouTube';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import AppLowerCaseTextField from '../../../@crema/core/AppFormComponents/AppLowerCaseTextField';
import AppUpperCaseTextField from '../../../@crema/core/AppFormComponents/AppUpperCaseTextField';
import {makeStyles} from '@mui/styles';
import {DesktopDatePicker, DateTimePicker} from '@mui/lab';
import Router, {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {newAgent} from '../../../redux/actions/Agent';
import {getAgents} from '../../../redux/actions/Agent';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
  UPDATE_NOTIFICATION_BUSINESS_PARAMETER,
} from '../../../shared/constants/ActionTypes';
import {updateNotificationBusinessParameter} from '../../../redux/actions/General';
import {getUserData} from '../../../redux/actions/User';
import {useState} from 'react';
import CheckIcon from '@mui/icons-material/Check';
import EditorMessage from '../Crm/EditorMessage';
import {verTiposEventos} from 'Utils/utils';

const validationSchema = yup.object({
  notificationName: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required('Es un campo obligatorio'),
  campaignContent: yup
    .string()
    .required('El contenido del mensaje es obligatorio'),
  periodicityDescription: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required('Es un campo obligatorio'),
  tipoEvento: yup.string().required('Campo requerido'),
  agentName: yup.string().required('Campo requerido'),
  channelNotification: yup.string().required('Campo requerido'),
  durationNotification: yup.string().required('Campo requerido'),
  unitNotification: yup.string().required('Campo requerido'),
});
const defaultValues = {
  notificationName: '',
  campaignContent: '',
  channelNotification: '',
  periodicityDescription: '',
  durationNotification: '',
  unitNotification: '',
  tipoEvento: '',
  agentName: '',
};

const useStyles = makeStyles((theme) => ({
  fixPosition: {
    position: 'relative',
    bottom: '-8px',
  },
}));

const formatSentence = (phrase) => {
  let firstSentence = phrase
    .trim()
    .split(' ')
    .filter((ele) => ele !== '')
    .join(' ');

  return (
    firstSentence.charAt(0).toUpperCase() + firstSentence.slice(1).toUpperCase()
  );
};

const NewClient = (props) => {
  let changeValueField;
  let getValueField;
  const {businessParameter} = useSelector(({general}) => general);
  const {globalParameter} = useSelector(({general}) => general);
  const tipoEventosNotificaciones = verTiposEventos(businessParameter);
  const [open, setOpen] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [minTutorial, setMinTutorial] = React.useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [AgentSelected, setAgentSelected] = React.useState([]);
  const [ChannelSelected, setChannelSelected] = React.useState([]);
  const [reload, setReload] = React.useState(0); // integer state
  const classes = useStyles(props);
  const [campaignContent, setCampaignContent] = useState('');
  const [selectedNotification, setSelectedNotification] = useState('');
  const [selectedUnit, setSelectedUnit] = React.useState('');
  const [selectedDuration, setSelectedDuration] = React.useState('');
  const [selectedNotificationName, setSelectedNotificationName] =
    React.useState('');
  const [listTypeEventNotification, setListTypeEventNotification] =
    React.useState(verTiposEventos(globalParameter)[0]);
  const [listFilteredTypeNotification, setListFilteredTypeNotification] =
    React.useState([]);
  const updateNotificationParameter = (payload) => {
    dispatch(updateNotificationBusinessParameter(payload));
  };
  let objSelects = {
    documentType: '',
  };

  const handlerAgents = (event, values) => {
    console.log('Cambiando Agents');
    console.log('evento tag', event);
    console.log('values tag', values);
    console.log('Agent seleccionado', event.target.attributes.value);
    setAgentSelected(values);
    reloadPage();
  };
  const handlerChannel = (event, values) => {
    console.log('Cambiando Agents');
    console.log('evento tag', event);
    console.log('values tag', values);
    console.log('Agent seleccionado', event.target.attributes.value);
    changeValueField('channelNotification', values.label);
    setChannelSelected(values.label);
    reloadPage();
  };
  const {listAgents} = useSelector(({agents}) => agents);

  console.log('listAgents', listAgents);
  const agentsParsed = listAgents.filter((agent) => agent.active == true);
  const agentParsedFinally = agentsParsed.map((agent) => {
    return {...agent, label: agent.robotName};
  });

  console.log('agentsParsed', agentParsedFinally);
  const listChannel = [{label: 'WHATSAPP'}, {label: 'EMAIL'}, {label: 'SMS'}];
  //APIS
  const toNewAgent = (payload) => {
    dispatch(newAgent(payload));
  };

  useEffect(() => {
    if (businessParameter) {
      let list = listTypeEventNotification;
      console.log('Este es el arreglo de notificaciones:', list);
      list = list.filter((obj) => {
        return obj.eventName && obj.eventName != '';
      });
      list = list.map((obj) => {
        return {...obj, label: obj.eventName};
      });
      console.log('Este es el arreglo de notificaciones:V2', list);
      setListFilteredTypeNotification(list);
    }
  }, []);
  useEffect(() => {
    changeValueField('tipoEvento', selectedNotification);
    changeValueField('notificationName', selectedNotificationName);
    changeValueField(
      'periodicityDescription',
      selectedNotification.description,
    );
    changeValueField('channelNotification', ChannelSelected.label);
    console.log(
      'Este es el evento seleccionado',
      getValueField('tipoEvento').value,
    );
    if (
      getValueField('tipoEvento').value != '' &&
      getValueField('tipoEvento').value.eventType == 'SCHEDULED' &&
      getValueField('channelNotification').value &&
      getValueField('channelNotification').value != ''
    ) {
      console.log(
        'Este es el CANAL seleccionado',
        getValueField('channelNotification').value,
      );
      changeValueField(
        'unitNotification',
        getValueField('tipoEvento').value[
          getValueField('channelNotification').value
        ].periodicityAction.unit,
      );
      changeValueField(
        'durationNotification',
        getValueField('tipoEvento').value[
          getValueField('channelNotification').value
        ].periodicityAction.time,
      );
    }
    changeValueField('agentName', AgentSelected);
  }, [selectedNotification]);
  const handleFieldNotification = (event) => {
    console.log('evento tipoNotificion', event);
    changeValueField('tipoEvento', event.target.value);
    setSelectedNotification(event.target.value);
    console.log('ocjSelects', objSelects);
    Object.keys(objSelects).map((key) => {
      if (key == event.target.name) {
        objSelects[key] = event.target.value;
      }
    });
    console.log('objSelects', objSelects);
  };
  const handleFieldDurationUnit = (event) => {
    console.log('evento duracion', event);
    changeValueField('unitNotification', event.target.value);
    setSelectedUnit(event.target.value);
    console.log('ocjSelects', objSelects);
    Object.keys(objSelects).map((key) => {
      if (key == event.target.name) {
        objSelects[key] = event.target.value;
      }
    });
    console.log('objSelects', objSelects);
  };
  const handleFielNameNotification = (event) => {
    console.log('evento nombre notificacion', event);
    setSelectedNotificationName(event.target.value);
    console.log('ocjSelects', objSelects);
    Object.keys(objSelects).map((key) => {
      if (key == event.target.name) {
        objSelects[key] = event.target.value;
      }
    });
    console.log('objSelects', objSelects);
  };
  const handleFieldDuration = (event) => {
    console.log('evento duracion notificacion', event);
    changeValueField('durationNotification', event.target.value);
    setSelectedDuration(event.target.value);
    console.log('ocjSelects', objSelects);
    Object.keys(objSelects).map((key) => {
      if (key == event.target.name) {
        objSelects[key] = event.target.value;
      }
    });
    console.log('objSelects', objSelects);
  };
  useEffect(() => {
    if (
      listFilteredTypeNotification !== undefined &&
      listFilteredTypeNotification.length >= 1
    ) {
      let defaultNotification = listFilteredTypeNotification.find(
        (obj) => obj.active == true,
      );
      setSelectedNotification(defaultNotification);
    } else {
      setSelectedNotification('');
    }
  }, [listTypeEventNotification]);
  const [dateRegister, setDateRegister] = React.useState(Date.now());
  //GET_VALUES_APIS
  const {
    updateNotificationBusinessParameterRes,
    successMessage,
    errorMessage,
    process,
    loading,
  } = useSelector(({general}) => general);
  console.log(
    'POSIBLE ERROR AQUI',
    updateNotificationBusinessParameterRes,
    successMessage,
    errorMessage,
    process,
    loading,
  );
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);

  const getBusinessParameter = (payload) => {
    dispatch(onGetBusinessParameter(payload));
  };

  useEffect(() => {
    console.log('Estamos userDataRes', userDataRes);
    if (
      userDataRes &&
      userDataRes.merchantSelected &&
      userDataRes.merchantSelected.merchantId
    ) {
      console.log('Estamos entrando al getAgentes');
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
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
      getAgent(listPayload);
      // setFirstload(true);
      setTimeout(() => {
        setMinTutorial(true);
      }, 2000);
    }
  }, [userDataRes]);

  useEffect(() => {
    switch (process) {
      case 'UPDATE_NOTIFICATION_BUSINESS_PARAMETER':
        if (!loading && (successMessage || errorMessage)) {
          setOpenStatus(true);
        }

        break;
      default:
        console.log('Esto esta cool');
    }
  }, [loading]);

  useEffect(() => {
    if (userDataRes && userDataRes.merchantSelected) {
      console.log(
        'userDataRes.merchantSelected12',
        userDataRes.merchantSelected,
      );
    }
  }, [userDataRes]);
  const cancel = () => {
    setOpen(true);
  };

  const getAgent = (payload) => {
    dispatch(getAgents(payload));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleData = (data /*, {setSubmitting}*/) => {
    //setSubmitting(true);
    //delete data.documentType;
    console.log('Data', data);
    console.log('objSelects', objSelects);

    console.log('estos son los campos:', {
      selectedNotification,
      selectedUnit,
      selectedDuration,
      AgentSelected,
      selectedNotificationName,
      ChannelSelected,
      template: getValueField('campaignContent').value,
    });
    let tramaNotification = selectedNotification;
    let uuidNotification = uuidv4();
    tramaNotification.channelSelected = ChannelSelected;
    tramaNotification.eventId = uuidNotification;
    tramaNotification.createdAt = Date.now();
    if (tramaNotification.eventType != 'SCHEDULED') {
      tramaNotification.notificationName = selectedNotificationName;
      tramaNotification.agentName = AgentSelected.robotName;
      tramaNotification.agentId = AgentSelected.robotId;
      if (ChannelSelected == 'WHATSAPP') {
        tramaNotification.notificationsChannel.WHATSAPP.template =
          getValueField('campaignContent').value;
      } else if (ChannelSelected == 'EMAIL') {
        tramaNotification.notificationsChannel.EMAIL.template =
          getValueField('campaignContent').value;
      } else {
        tramaNotification.notificationsChannel.SMS.template =
          getValueField('campaignContent').value;
      }
    } else {
      tramaNotification.notificationName = selectedNotificationName;
      tramaNotification.agentName = AgentSelected.robotName;
      tramaNotification.agentId = AgentSelected.robotId;
      if (ChannelSelected == 'WHATSAPP') {
        tramaNotification.notificationsChannel.WHATSAPP.template =
          getValueField('campaignContent').value;
        tramaNotification.notificationsChannel.WHATSAPP.periodicityAction.time =
          selectedDuration;
        tramaNotification.notificationsChannel.WHATSAPP.periodicityAction.unit =
          selectedUnit;
      } else if (ChannelSelected == 'EMAIL') {
        tramaNotification.notificationsChannel.EMAIL.template =
          getValueField('campaignContent').value;
      } else {
        tramaNotification.notificationsChannel.SMS.template =
          getValueField('campaignContent').value;
      }
    }
    let tramaGlobal = tipoEventosNotificaciones[1];
    console.log('TRAMA GLOBAL', tramaGlobal);
    let tramaBusiness = tipoEventosNotificaciones[2];
    console.log('llaves', Object.keys(tramaGlobal));
    let llavesGlobal = Object.keys(tramaGlobal);
    llavesGlobal.forEach((llave) => {
      if (tramaGlobal[llave].eventType == tramaNotification.eventType) {
        tramaGlobal[llave][uuidNotification] = tramaNotification;
      }
    });
    console.log('TRAMA GLOBAL MODIFICADA', tramaGlobal);
    console.log('tramaBusiness', tramaBusiness);
    let {value, ...otherTramaBusiness} = tramaBusiness;
    let nupdateNotificationPayload = {
      request: {
        payload: {
          ...otherTramaBusiness,
          value: tramaGlobal,
        },
      },
    };

    /*toNewAgent(newAgentPayload);*/
    // dispatch({type: UPDATE_NOTIFICATION_BUSINESS_PARAMETER, payload: undefined});
    updateNotificationParameter(nupdateNotificationPayload);
    console.log('nupdateNotificationPayload', nupdateNotificationPayload);
    setOpenStatus(true);
    //setSubmitting(false);
  };

  const showMessage = () => {
    if (updateNotificationBusinessParameterRes != undefined) {
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
            {<p>Se ha registrado la notificación correctamente</p>}
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
            {errorMessage}
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink />;
    }
  };

  const sendStatus = () => {
    setTimeout(() => {
      console.log('Esto es el momento');
      setOpenStatus(false);
      Router.push('/sample/notifications/table');
    }, 2000);
  };

  const reloadPage = () => {
    setReload(!reload);
  };

  return (
    <Card sx={{p: 4}}>
      <Box sx={{width: 1, textAlign: 'center'}}>
        <Typography
          sx={{mx: 'auto', my: '10px', fontWeight: 600, fontSize: 25}}
        >
          Crear Notificación
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
          //enableReinitialize={true}
        >
          {({values, errors, isSubmitting, setFieldValue, getFieldProps}) => {
            changeValueField = setFieldValue;
            getValueField = getFieldProps;
            return (
              <Form
                style={{textAlign: 'left', justifyContent: 'center'}}
                noValidate
                autoComplete='on'
                /* onChange={handleActualData} */
                onChange={(value) => {
                  console.log('Los values', values);
                  if (['notificationName'].includes(value.target.name)) {
                    console.log('Aca es value', value);
                    console.log('Esto es el nuevo name', value.target.name);
                    console.log('Esto es el nuevo value', value.target.value);
                    let notificationName = formatSentence(
                      value.target.name == 'notificationName'
                        ? value.target.value
                        : values['notificationName'],
                    );
                  } else if (
                    ['periodicityDescription'].includes(value.target.name)
                  ) {
                    console.log('Aca es value', value);
                    console.log('Esto es el nuevo name', value.target.name);
                    console.log('Esto es el nuevo value', value.target.value);
                    let periodicityDescription = formatSentence(
                      value.target.name == 'periodicityDescription'
                        ? value.target.value
                        : values['periodicityDescription'],
                    );
                  } else if (['tipoEvento'].includes(value.target.name)) {
                    console.log('Aca es value', value);
                    console.log('Esto es el nuevo name', value.target.name);
                    console.log('Esto es el nuevo value', value.target.value);
                    let tipoEvento = formatSentence(
                      value.target.name == 'tipoEvento'
                        ? value.target.value
                        : values['tipoEvento'],
                    );
                  } else if (
                    ['durationNotification'].includes(value.target.name)
                  ) {
                    console.log('Aca es value', value);
                    console.log('Esto es el nuevo name', value.target.name);
                    console.log('Esto es el nuevo value', value.target.value);
                    let durationNotification = formatSentence(
                      value.target.name == 'durationNotification'
                        ? value.target.value
                        : values['durationNotification'],
                    );
                  } else if (['unitNotification'].includes(value.target.name)) {
                    console.log('Aca es value', value);
                    console.log('Esto es el nuevo name', value.target.name);
                    console.log('Esto es el nuevo value', value.target.value);
                    let unitNotification = formatSentence(
                      value.target.name == 'unitNotification'
                        ? value.target.value
                        : values['unitNotification'],
                    );
                  } else if (['agentName'].includes(value.target.name)) {
                    console.log('Aca es value', value);
                    console.log('Esto es el nuevo name', value.target.name);
                    console.log('Esto es el nuevo value', value.target.value);
                    let agentName = formatSentence(
                      value.target.name == 'agentName'
                        ? value.target.value
                        : values['agentName'],
                    );
                  }
                }}
              >
                <Grid container spacing={2} sx={{width: 700, margin: 'auto'}}>
                  <>
                    <Grid item xs={12}>
                      <AppUpperCaseTextField
                        label='Nombre'
                        name='notificationName'
                        variant='outlined'
                        onInput={handleFielNameNotification}
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
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          width: '100%', // Establece el ancho al 100% por defecto
                          [(theme) => theme.breakpoints.down('sm')]: {
                            width: '80%', // Ancho del 80% en pantallas pequeñas
                          },
                          [(theme) => theme.breakpoints.up('md')]: {
                            width: 500, // Ancho fijo de 500px en pantallas medianas y grandes
                          },
                        }}
                      >
                        <FormControl fullWidth>
                          <InputLabel
                            id='evento-label'
                            style={{fontWeight: 200}}
                          >
                            Tipo Evento
                          </InputLabel>
                          <Select
                            value={selectedNotification}
                            name='tipoEvento'
                            labelId='evento-label'
                            label='Tipo Evento'
                            onChange={handleFieldNotification}
                            getOptionLabel={(option) => option.eventType}
                          >
                            {listFilteredTypeNotification &&
                            Array.isArray(listFilteredTypeNotification) &&
                            listFilteredTypeNotification.length >= 1
                              ? listFilteredTypeNotification.map(
                                  (obj, index) => {
                                    return (
                                      <MenuItem
                                        key={`eventype-${index}`}
                                        value={obj}
                                        style={{fontWeight: 200}}
                                      >
                                        {obj.label}
                                      </MenuItem>
                                    );
                                  },
                                )
                              : null}
                          </Select>
                        </FormControl>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <Autocomplete
                          sx={{
                            width: '100%', // Establece el ancho al 100% por defecto
                            [(theme) => theme.breakpoints.down('sm')]: {
                              width: '80%', // Ancho del 80% en pantallas pequeñas
                            },
                            [(theme) => theme.breakpoints.up('md')]: {
                              width: 500, // Ancho fijo de 500px en pantallas medianas y grandes
                            },
                          }}
                          disablePortal
                          name='channelNotification'
                          id='combo-box-demo'
                          options={listChannel}
                          onChange={handlerChannel}
                          renderInput={(params) => (
                            <TextField {...params} label='Canal' />
                          )}
                        />
                      </Box>
                    </Grid>

                    {selectedNotification != '' &&
                    ChannelSelected != '' &&
                    selectedNotification.eventType == 'SCHEDULED' ? (
                      <>
                        <Grid item xs={12}>
                          <AppUpperCaseTextField
                            label='Periodicidad'
                            name='periodicityDescription'
                            disabled
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
                        <Grid item xs={6}>
                          <TextField
                            label='Duracion'
                            name='durationNotification'
                            variant='outlined'
                            inputProps={{min: 1}}
                            type='number'
                            onInput={handleFieldDuration}
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
                        <Grid item xs={6}>
                          <FormControl fullWidth sx={{my: 2}}>
                            <InputLabel
                              id='documentType-label'
                              style={{fontWeight: 200}}
                            >
                              Unidad
                            </InputLabel>
                            <Select
                              name='unitNotification'
                              labelId='documentType-label'
                              label='Unidad'
                              onChange={handleFieldDurationUnit}
                              defaultValue={
                                getValueField('unitNotification').value
                              }
                            >
                              <MenuItem value='horas' style={{fontWeight: 200}}>
                                horas
                              </MenuItem>
                              <MenuItem value='días' style={{fontWeight: 200}}>
                                días
                              </MenuItem>
                              <MenuItem
                                value='semanas'
                                style={{fontWeight: 200}}
                              >
                                semanas
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </>
                    ) : null}

                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <Autocomplete
                          sx={{
                            width: '100%', // Establece el ancho al 100% por defecto
                            [(theme) => theme.breakpoints.down('sm')]: {
                              width: '80%', // Ancho del 80% en pantallas pequeñas
                            },
                            [(theme) => theme.breakpoints.up('md')]: {
                              width: 500, // Ancho fijo de 500px en pantallas medianas y grandes
                            },
                          }}
                          disablePortal
                          name='agentName'
                          id='combo-box-demo'
                          options={agentParsedFinally}
                          onChange={handlerAgents}
                          renderInput={(params) => (
                            <TextField {...params} label='Agente' />
                          )}
                        />
                      </Box>
                    </Grid>
                  </>
                  {selectedNotification != '' && ChannelSelected != '' ? (
                    <EditorMessage
                      getValueField={getValueField}
                      changeValueField={changeValueField}
                    />
                  ) : null}
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
                    onClick={handleData}
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
                        onClick={() => window.open('https://www.youtube.com/')}
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
                          window.open('https://youtu.be/iX3W9QVorFo/')
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
          {'Registro de la Notificación'}
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
              Router.push('/sample/notifications/table');
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
          {'Registro de la Notificación'}
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

      <Dialog
        open={loading}
        // onClose={sendStatus}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        {/* <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Registro de cliente'}
        </DialogTitle> */}
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <CircularProgress disableShrink />
        </DialogContent>
        {/* <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={sendStatus}>
            Aceptar
          </Button>
        </DialogActions> */}
      </Dialog>
    </Card>
  );
};

export default NewClient;
