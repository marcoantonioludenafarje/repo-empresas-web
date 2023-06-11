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
} from '@mui/material';

import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
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
import {newClient} from '../../../redux/actions/Clients';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
} from '../../../shared/constants/ActionTypes';
import {getUserData} from '../../../redux/actions/User';
import {useState} from 'react';
/* const maxLength = 100000000000; //11 chars */
const validationSchema = yup.object({
  documentType: yup.string(),
  nroDocument: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .required(<IntlMessages id='validation.required' />)
    .max(100000000000, 'Se puede ingresar como maximo 11 caracteres'),
  givenName: yup.string().when('documentType', {
    is: 'RUC',
    then: yup.string().typeError(<IntlMessages id='validation.string' />),
    otherwise: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />)
      .required('Es un campo obligatorio'),
  }),
  // .typeError(<IntlMessages id='validation.string' />)
  // .required(<IntlMessages id='validation.required' />),

  lastName: yup.string().when('documentType', {
    is: 'RUC',
    then: yup.string().typeError(<IntlMessages id='validation.string' />),
    otherwise: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />)
      .required('Es un campo obligatorio'),
  }),
  secondLastName: yup.string().when('documentType', {
    is: 'RUC',
    then: yup.string().typeError(<IntlMessages id='validation.string' />),
    otherwise: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />)
      .required('Es un campo obligatorio'),
  }),
  // .typeError(<IntlMessages id='validation.string' />)
  // .required(<IntlMessages id='validation.required' />),

  name: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),

  addressClient: yup
    .string()
    .required(<IntlMessages id='validation.required' />)
    .typeError(<IntlMessages id='validation.string' />),
  emailClient: yup
    .string()
    .typeError(<IntlMessages id='validation.number' />)
    .email('Formato de correo invalido'),
  emailContact: yup
    .string()
    .typeError(<IntlMessages id='validation.number' />)
    .email('Formato de correo invalido'),
  nameContact: yup.string().when('documentType', {
    is: 'RUC',
    then: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />)
      .required('Es un campo obligatorio'),
    otherwise: yup.string().typeError(<IntlMessages id='validation.string' />),
  }),
  numberContact: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .max(1000000000, 'Se puede ingresar como maximo 11 caracteres'),
  birthDay: yup.date(),
  // .when("documentType", {
  //   is: 'RUC',
  //   then: yup.string().typeError(<IntlMessages id='validation.date' />).required("Es un campo obligatorio"),
  //   otherwise:  yup.string().typeError(<IntlMessages id='validation.date' />)
  // }),
  extraInformationClient: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
});
const defaultValues = {
  documentType: 'RUC',
  nroDocument: '',
  givenName: '',
  lastName: '',
  secondLastName: '',
  name: '',
  addressClient: '',
  emailClient: '',
  emailContact: '',
  nameContact: '',
  numberContact: '',
  extraInformationClient: '',
  birthDay: new Date(),
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
  const [open, setOpen] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [minTutorial, setMinTutorial] = React.useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  // const [isRUC, setRUC] = React.useState(false);
  const [identidad, setIdentidad] = React.useState(null);

  const [birthDay, setBirthDay] = React.useState(new Date());

  const classes = useStyles(props);
  let objSelects = {
    documentType: '',
  };

  //APIS
  const toNewClient = (payload) => {
    dispatch(newClient(payload));
  };
  const [dateRegister, setDateRegister] = React.useState(Date.now());
  //GET_VALUES_APIS
  const {newClientRes, successMessage, errorMessage, process, loading} =
    useSelector(({clients}) => clients);
  console.log('newClientRes', newClientRes);

  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  //const [config, setConfig] = useState({default_identification: 'DNI'});
  //defaultValues.documentType = config.default_identification;
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
    switch (process) {
      case 'CREATE_NEW_CLIENT':
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
      setIdentidad(
        userDataRes.merchantSelected.typeClient == 'PN' ? 'DNI' : 'RUC',
      );

      //  setIdentidad('DNI' )
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
    //delete data.documentType;
    console.log('Data', data);
    console.log('objSelects', objSelects);

    let extraTrama;
    if (data.documentType == 'RUC') {
      extraTrama = {
        emailContact: data.emailContact,
        nameContact: data.nameContact,
      };
    } else {
      // DNI CE
      extraTrama = {
        givenName: data.givenName,
        lastName: data.lastName,
        secondLastName: data.secondLastName,
        birthDay: data.birthDay,
        emailContact: data.emailClient,
        nameContact: data.name,
      };
    }

    let newClientPayload = {
      request: {
        payload: {
          clients: [
            {
              typeDocumentClient: data.documentType,
              numberDocumentClient: data.nroDocument,
              denominationClient: data.name,
              addressClient: data.addressClient,
              emailClient: data.emailClient,
              numberContact: data.numberContact,
              extraInformationClient: data.extraInformationClient,
              ...extraTrama,
            },
          ],
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };

    // newClientPayload.request.payload.clients[0].typeDocumentClient = identidad;
    // newClientPayload.request.payload.clients[0].numberDocumentClient =
    //   data.nroDocument;
    // newClientPayload.request.payload.clients[0].denominationClient = data.name;
    // newClientPayload.request.payload.clients[0].addressClient =
    //   data.addressClient;
    // newClientPayload.request.payload.clients[0].emailClient = data.emailClient;
    // newClientPayload.request.payload.clients[0].numberContact =
    //   data.numberContact;
    // if (identidad == 'RUC') {
    //   newClientPayload.request.payload.clients[0].emailContact =
    //     data.emailContact;
    //   newClientPayload.request.payload.clients[0].nameContact =
    //     data.nameContact;
    // } else {
    //   newClientPayload.request.payload.clients[0].emailContact =
    //     data.emailClient;
    //   newClientPayload.request.payload.clients[0].nameContact = data.name;
    // }
    // newClientPayload.request.payload.clients[0].extraInformationClient =
    //   data.extraInformationClient;

    toNewClient(newClientPayload);
    console.log('newClientPayload', newClientPayload);
    setSubmitting(false);
    // setSubmitting(false);
    // setOpenStatus(true);
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
      Router.push('/sample/clients/table');
    }, 2000);
  };

  const handleField = (event, setFieldValue) => {
    console.log('Esta cambiandose el valor papu', event);
    objSelects[event.target.name] = event.target.value;
    setRUC(objSelects.documentType == 'RUC' ? true : false);
    console.log('objSelects', objSelects);
    setIdentidad(objSelects.documentType);
  };

  // const inicializaIdentidad = () => {
  //   if (!identidad) {
  //     setIdentidad(typeClient == 'PN' ? 'DNI' : 'RUC');
  //     console.log('inicializaIdentidad', identidad);
  //   }
  //   return '';
  // };

  return identidad ? (
    <Card sx={{p: 4}}>
      <Box sx={{width: 1, textAlign: 'center'}}>
        <Typography
          sx={{mx: 'auto', my: '10px', fontWeight: 600, fontSize: 25}}
        >
          REGISTRO DE CLIENTE
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
          initialValues={{...defaultValues, documentType: identidad}}
          onSubmit={handleData}
          enableReinitialize={true}
        >
          {({values, errors, isSubmitting, setFieldValue}) => {
            return (
              <Form
                style={{textAlign: 'left', justifyContent: 'center'}}
                noValidate
                autoComplete='on'
                /* onChange={handleActualData} */
                onChange={(value) => {
                  console.log('Los values', values);
                  if (
                    ['givenName', 'lastName', 'secondLastName'].includes(
                      value.target.name,
                    ) &&
                    ['DNI', 'CE', 'PAS'].includes(values.documentType)
                  ) {
                    console.log('Aca es value', value);
                    console.log('Esto es el nuevo name', value.target.name);
                    console.log('Esto es el nuevo value', value.target.value);
                    let givenName = formatSentence(
                      value.target.name == 'givenName'
                        ? value.target.value
                        : values['givenName'],
                    );
                    let lastName = formatSentence(
                      value.target.name == 'lastName'
                        ? value.target.value
                        : values['lastName'],
                    );
                    let secondLastName = formatSentence(
                      value.target.name == 'secondLastName'
                        ? value.target.value
                        : values['secondLastName'],
                    );
                    let completeName = `${givenName} ${lastName} ${secondLastName}`;
                    // setFieldValue( "givenName" , givenName );
                    // setFieldValue( "lastName" , lastName );
                    // setFieldValue( "secondLastName" , secondLastName);
                    setFieldValue('name', completeName);
                  }
                }}
              >
                {/* <div>{JSON.stringify(values)}</div>
                <div>{JSON.stringify(errors)}</div>
                 */}
                <Grid container spacing={2} sx={{width: 500, margin: 'auto'}}>
                  <Grid item xs={8} sm={12}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel
                        id='documentType-label'
                        style={{fontWeight: 200}}
                      >
                        Identificador
                      </InputLabel>
                      {/* {inicializaIdentidad()} */}
                      <Select
                        defaultValue={identidad} //{config.default_identification}
                        name='documentType'
                        labelId='documentType-label'
                        label='Identificador'
                        //onChange={handleField}
                        onChange={(option, value) => {
                          setFieldValue('documentType', value.props.value);
                          // setIdentidad(value.props.value);
                        }}
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
                  <Grid item xs={8} sm={12}>
                    <AppTextField
                      label='Número Identificador *'
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

                  {values['documentType'] == 'RUC' ? (
                    <>
                      <Grid item xs={12}>
                        <AppUpperCaseTextField
                          label='Razón Social *'
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
                      <Grid item xs={8} sm={12}>
                        <AppUpperCaseTextField
                          label='Dirección *'
                          name='addressClient'
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
                        <AppLowerCaseTextField
                          label='Correo de la empresa'
                          name='emailClient'
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
                      <Grid item xs={12}>
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

                      <Grid item xs={12}>
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
                      <Grid item xs={8} sm={12}>
                        <AppTextField
                          label='Información adicional'
                          multiline
                          rows={4}
                          name='extraInformationClient'
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
                    </>
                  ) : (
                    <>
                      <Grid item xs={12}>
                        <AppUpperCaseTextField
                          label='Nombre*'
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
                        <AppUpperCaseTextField
                          label='Apellido Paterno*'
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
                      <Grid item xs={12}>
                        <AppUpperCaseTextField
                          label='Apellido Materno*'
                          name='secondLastName'
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
                        <AppTextField
                          label='Nombre Completo *'
                          name='name'
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
                        <DesktopDatePicker
                          renderInput={(params) => (
                            <TextField
                              sx={{
                                my: 2,
                                width: '100%',
                                position: 'relative',
                                bottom: '-8px',
                              }}
                              {...params}
                            />
                          )}
                          required
                          sx={{my: 2}}
                          label='Fecha de nacimiento'
                          value={birthDay}
                          /* maxDate={new Date()} */
                          inputFormat='dd/MM/yyyy'
                          name='birthDay'
                          onChange={(newValue) => {
                            // setValue2(newValue);
                            console.log('date', newValue);
                            setFieldValue('birthDay', newValue);
                            setBirthDay(newValue);
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <AppUpperCaseTextField
                          label='Dirección *'
                          name='addressClient'
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
                        <AppLowerCaseTextField
                          label='Correo de cliente'
                          name='emailClient'
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
                        <AppTextField
                          label='Telefono fijo o celular de cliente'
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
                      <Grid item xs={12}>
                        <AppTextField
                          label='Información adicional'
                          multiline
                          rows={4}
                          name='extraInformationClient'
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
                    </>
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
          {'Registro de Cliente'}
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
              Router.push('/sample/clients/table');
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
          {'Registro de cliente'}
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
  ) : null;
};

export default NewClient;
