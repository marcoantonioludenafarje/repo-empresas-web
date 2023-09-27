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

import {ClickAwayListener} from '@mui/base';
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

const UpdateNotification = (props) => {
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
  let listFilteredTypeNotification = [];
  let {query} = router;
  console.log('query', query);
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
    changeValueField('agentName', values);
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

  /**/
  if (businessParameter) {
    let list = tipoEventosNotificaciones[0];
    console.log('Este es el arreglo de notificaciones:', list);
    let listNotificacionModific = [];
    for (let item of list) {
      if (Object.keys(item).length !== 0) {
        console.log(
          'Estre es el item',
          Object.keys(item).map((key) => console.log(item[key])),
        );
        const uuidPattern =
          /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
        let validNotification = Object.keys(item)
          .filter(
            (key) =>
              typeof item[key] === 'object' &&
              uuidPattern.test(key) &&
              key == query.eventId,
          )
          .map((key) => item[key]);
        if (validNotification.length > 0) {
          listNotificacionModific.push(validNotification);
        }
        console.log('Validation Notification', Object.keys(item));
        console.log('Validation Notification', validNotification);
      }
    }
    /*********************************************************/
    console.log('LIST MODIFIC', listNotificacionModific[0][0]);
    listFilteredTypeNotification.push(listNotificacionModific[0][0]);
  }
  /**/
  console.log('FILTRADO UPP', listFilteredTypeNotification);
  console.log('listAgents', listAgents);
  const agentsParsed = listAgents.filter((agent) => agent.active == true);
  let defaultAgent = agentsParsed.filter(
    (agent) => agent.robotId == listFilteredTypeNotification[0].agentId,
  );
  defaultAgent = defaultAgent.map((agent) => {
    return {...agent, label: agent.robotName};
  });
  const agentParsedFinally = agentsParsed.map((agent) => {
    return {...agent, label: agent.robotName};
  });
  console.log('DEFAULTAGENT', defaultAgent);
  console.log('agentsParsed', agentParsedFinally);
  //APIS
  const toNewAgent = (payload) => {
    dispatch(newAgent(payload));
  };

  useEffect(() => {
    if (businessParameter) {
      let list = tipoEventosNotificaciones[0];
      console.log('Este es el arreglo de notificaciones:', list);
      let listNotificacionModific = [];
      for (let item of list) {
        if (Object.keys(item).length !== 0) {
          console.log(
            'Estre es el item',
            Object.keys(item).map((key) => console.log(item[key])),
          );
          const uuidPattern =
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
          let validNotification = Object.keys(item)
            .filter(
              (key) =>
                typeof item[key] === 'object' &&
                uuidPattern.test(key) &&
                key == query.eventId,
            )
            .map((key) => item[key]);
          if (validNotification.length > 0) {
            listNotificacionModific.push(validNotification);
          }
          console.log('Validation Notification', Object.keys(item));
          console.log('Validation Notification', validNotification);
        }
      }
      /*********************************************************/
      console.log('LIST MODIFIC', listNotificacionModific[0][0]);
      listFilteredTypeNotification.push(listNotificacionModific[0][0]);
      setSelectedNotification(listFilteredTypeNotification);
    }
  }, []);

  //console.log("LIST NOTIFICATION FILTERED",listFilteredTypeNotification);
  console.log('LIST NOTIFICATION FILTERED', selectedNotification);
  console.log('LIST TYPE NOTIFICATION', selectedNotification);
  const defaultValues = {
    notificationName: listFilteredTypeNotification[0].notificationName || '',
    campaignContent:
      listFilteredTypeNotification[0].notificationsChannel[
        listFilteredTypeNotification[0].channelSelected
      ].template || '',
    channelNotification: listFilteredTypeNotification[0].channelSelected || '',
    periodicityDescription: listFilteredTypeNotification[0].description || '',
    durationNotification:
      listFilteredTypeNotification[0].notificationsChannel[
        listFilteredTypeNotification[0].channelSelected
      ].periodicityAction.time || '',
    unitNotification:
      listFilteredTypeNotification[0].notificationsChannel[
        listFilteredTypeNotification[0].channelSelected
      ].periodicityAction.unit || '',
    tipoEvento: listFilteredTypeNotification[0] || '',
    agentName: defaultAgent[0] || '',
    tipoEventoNombre: listFilteredTypeNotification[0].eventName,
  };
  useEffect(() => {
    if (selectedNotification && selectedNotification != '') {
      console.log(
        'ESTAMOS DENTRO DEL USEEFFECT NOTIFICATION SELECTED',
        selectedNotification,
      );
      changeValueField('tipoEvento', selectedNotification);
      changeValueField(
        'notificationName',
        selectedNotification.notificationName,
      );
      changeValueField(
        'periodicityDescription',
        selectedNotification.description,
      );
      changeValueField(
        'channelNotification',
        selectedNotification.channelNotification,
      );
      console.log(
        'Este es el evento seleccionado',
        getValueField('tipoEvento').value,
      );
      if (
        listFilteredTypeNotification[0] != '' &&
        listFilteredTypeNotification[0].eventType == 'SCHEDULED' &&
        getValueField('channelNotification').value &&
        getValueField('channelNotification').value != ''
      ) {
        changeValueField(
          'unitNotification',
          listFilteredTypeNotification[0].notificationsChannel[
            listFilteredTypeNotification[0].channelSelected
          ].periodicityAction.unit,
        );
        changeValueField(
          'durationNotification',
          listFilteredTypeNotification[0].notificationsChannel[
            listFilteredTypeNotification[0].channelSelected
          ].periodicityAction.time,
        );
      }
      changeValueField('agentName', AgentSelected);
    }
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
    let agentSelected;
    if (AgentSelected.length == 0) {
      agentSelected = defaultAgent[0];
    }
    let tramaNotification = selectedNotification;
    tramaNotification.updatedAt = Date.now();
    if (tramaNotification.eventType != 'SCHEDULED') {
      tramaNotification.notificationName = selectedNotificationName
        ? selectedNotificationName
        : listFilteredTypeNotification[0].notificationName;
      tramaNotification.agentName = AgentSelected.robotName
        ? AgentSelected.robotName
        : agentSelected.robotName;
      tramaNotification.agentId = AgentSelected.robotId
        ? AgentSelected.robotId
        : agentSelected.robotId;
      if (tramaNotification.channelSelected == 'WHATSAPP') {
        tramaNotification.notificationsChannel.WHATSAPP.template =
          getValueField('campaignContent').value;
      } else if (tramaNotification.channelSelected == 'EMAIL') {
        tramaNotification.notificationsChannel.EMAIL.template =
          getValueField('campaignContent').value;
      } else {
        tramaNotification.notificationsChannel.SMS.template =
          getValueField('campaignContent').value;
      }
    } else {
      tramaNotification.notificationName = selectedNotificationName
        ? selectedNotificationName
        : listFilteredTypeNotification[0].notificationName;
      tramaNotification.agentName = AgentSelected.robotName
        ? AgentSelected.robotName
        : agentSelected.robotName;
      tramaNotification.agentId = AgentSelected.robotId
        ? AgentSelected.robotId
        : agentSelected.robotId;
      if (tramaNotification.channelSelected == 'WHATSAPP') {
        tramaNotification.notificationsChannel.WHATSAPP.template =
          getValueField('campaignContent').value;
        tramaNotification.notificationsChannel.WHATSAPP.periodicityAction.time =
          selectedDuration != ''
            ? selectedDuration
            : selectedNotification.notificationsChannel[
                selectedNotification.channelSelected
              ].periodicityAction.time;
        tramaNotification.notificationsChannel.WHATSAPP.periodicityAction.unit =
          selectedUnit != ''
            ? selectedUnit
            : selectedNotification.notificationsChannel[
                selectedNotification.channelSelected
              ].periodicityAction.unit;
      } else if (tramaNotification.channelSelected == 'EMAIL') {
        tramaNotification.notificationsChannel.EMAIL.template =
          getValueField('campaignContent').value;
        tramaNotification.notificationsChannel.EMAIL.periodicityAction.time =
          selectedDuration != ''
            ? selectedDuration
            : selectedNotification.notificationsChannel[
                selectedNotification.channelSelected
              ].periodicityAction.time;
        tramaNotification.notificationsChannel.EMAIL.periodicityAction.unit =
          selectedUnit != ''
            ? selectedUnit
            : selectedNotification.notificationsChannel[
                selectedNotification.channelSelected
              ].periodicityAction.unit;
      } else {
        tramaNotification.notificationsChannel.SMS.template =
          getValueField('campaignContent').value;
        tramaNotification.notificationsChannel.SMS.periodicityAction.time =
          selectedDuration != ''
            ? selectedDuration
            : selectedNotification.notificationsChannel[
                selectedNotification.channelSelected
              ].periodicityAction.time;
        tramaNotification.notificationsChannel.SMS.periodicityAction.unit =
          selectedUnit != ''
            ? selectedUnit
            : selectedNotification.notificationsChannel[
                selectedNotification.channelSelected
              ].periodicityAction.unit;
      }
    }
    console.log('TRAMA NOTIFICACION', tramaNotification);
    let tramaGlobal = tipoEventosNotificaciones[1];
    console.log('TRAMA GLOBAL', tramaGlobal);
    let tramaBusiness = tipoEventosNotificaciones[2];
    console.log('llaves', Object.keys(tramaGlobal));
    let llavesGlobal = Object.keys(tramaGlobal);
    llavesGlobal.forEach((llave) => {
      if (
        tramaGlobal[llave][selectedNotification.eventId] == selectedNotification
      ) {
        tramaGlobal[llave][listFilteredTypeNotification[0].eventId] =
          tramaNotification;
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
    // setSubmitting(false);
  };

  const handleClickAway = () => {
    // Evita que se cierre el diálogo haciendo clic fuera del contenido
    // Puedes agregar condiciones adicionales aquí si deseas una lógica más específica.
  };
  const showMessage = () => {
    console.log(
      'Revisando estados de respuesta:success-errorMessage',
      successMessage,
      errorMessage,
    );
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
            {<p>Se ha actualizado la información correctamente</p>}
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
          Actualizar Notificación
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
                      <AppUpperCaseTextField
                        label='Tipo Evento'
                        name='tipoEventoNombre'
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

                    <Grid item xs={12}>
                      <AppUpperCaseTextField
                        label='Canal'
                        name='channelNotification'
                        variant='outlined'
                        disabled
                        onInput={handlerChannel}
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

                    {selectedNotification != '' &&
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
                            defaultValue={listFilteredTypeNotification[0].notificationsChannel[
                              listFilteredTypeNotification[0].channelSelected
                            ].periodicityAction.time.toString()}
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
                              onInput={handleFieldDurationUnit}
                              defaultValue={
                                selectedNotification.notificationsChannel[
                                  selectedNotification.channelSelected
                                ].periodicityAction.unit
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
                          defaultValue={
                            listFilteredTypeNotification[0].agentName
                          }
                          onChange={handlerAgents}
                          renderInput={(params) => (
                            <TextField {...params} label='Agente' />
                          )}
                        />
                      </Box>
                    </Grid>
                  </>
                  {selectedNotification != '' ? (
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
          {'Actualizacion de la Notificación'}
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

      <ClickAwayListener onClickAway={handleClickAway}>
        <Dialog
          open={openStatus}
          onClose={sendStatus}
          sx={{textAlign: 'center'}}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
            {'Actualizacion de la Notificación'}
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

export default UpdateNotification;
