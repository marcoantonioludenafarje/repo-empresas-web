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
} from '@mui/material';
import {
  onGetBusinessParameter,
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
} from '../../../shared/constants/ActionTypes';
import {getUserData} from '../../../redux/actions/User';
import {useState} from 'react';
import CheckIcon from '@mui/icons-material/Check';
import EditorMessage from '../Crm/EditorMessage';

const validationSchema = yup.object({
  givenName: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required('Es un campo obligatorio'),
  campaignContent: yup
    .string()
    .required('El contenido de la campaña es obligatorio'),
  extraInformationClient: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required('Es un campo obligatorio'),
});
const defaultValues = {
  givenName: '',
  campaignContent: '',
  extraInformationClient: '',
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
  let toSubmitting;
  let changeValueField;
  let getValueField;
  const [open, setOpen] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [minTutorial, setMinTutorial] = React.useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [AgentSelected, setAgentSelected] = React.useState([]);
  const [reload, setReload] = React.useState(0); // integer state
  const classes = useStyles(props);
  const [campaignContent, setCampaignContent] = useState('');
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

  const {listAgents} = useSelector(({agents}) => agents);

  console.log('listAgents', listAgents);
  const agentsParsed = listAgents.filter((agent) => agent.active == true);
  const agentParsedFinally = agentsParsed.map((agent) => {
    return {label: agent.robotName};
  });
  console.log('agentsParsed', agentParsedFinally);
  //APIS
  const toNewAgent = (payload) => {
    dispatch(newAgent(payload));
  };
  const [dateRegister, setDateRegister] = React.useState(Date.now());
  //GET_VALUES_APIS
  const {newAgentRes, successMessage, errorMessage, process, loading} =
    useSelector(({agents}) => agents);
  console.log('newAgentRes', newAgentRes);

  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);

  const getBusinessParameter = (payload) => {
    dispatch(onGetBusinessParameter(payload));
  };

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
    }
  }, [userDataRes]);

  useEffect(() => {
    switch (process) {
      case 'CREATE_AGENT':
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

  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    //delete data.documentType;
    console.log('Data', data);
    console.log('objSelects', objSelects);

    let extraTrama;
    extraTrama = {
      robotName: data.givenName,
    };

    let newAgentPayload = {
      request: {
        payload: {
          robots: [
            {
              description: data.extraInformationClient,
              ...extraTrama,
            },
          ],
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };

    toNewAgent(newAgentPayload);
    console.log('newAgentPayload', newAgentPayload);
    setSubmitting(false);
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
            {/* Se ha registrado la información <br />
            correctamente */}
            {successMessage}
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
      Router.push('/sample/agents/table');
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
          {({
            values,
            errors,
            isSubmitting,
            setSubmitting,
            setFieldValue,
            getFieldProps,
          }) => {
            toSubmitting = setSubmitting;
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
                  }
                }}
              >
                <Grid container spacing={2} sx={{width: 700, margin: 'auto'}}>
                  <>
                    <Grid item xs={12}>
                      <AppUpperCaseTextField
                        label='Nombre'
                        name='givenName'
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
                          id='combo-box-demo'
                          options={[
                            {label: 'CANCELACION CITA'},
                            {label: 'CREACION CITA'},
                            {label: 'CREACION ATENCION'},
                          ]}
                          renderInput={(params) => (
                            <TextField {...params} label='Tipo de evento' />
                          )}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <AppUpperCaseTextField
                        label='Periodicidad'
                        name='notificationName'
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
                  <EditorMessage
                    getValueField={getValueField}
                    changeValueField={changeValueField}
                  />
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
          {'Registro del Agente'}
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
          {'Registro del agente'}
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
