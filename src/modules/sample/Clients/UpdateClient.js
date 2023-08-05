import React, {useState, useEffect, useCallback, useRef} from 'react';
import {makeStyles} from '@mui/styles';
import * as yup from 'yup';
import {Form, Formik} from 'formik';
import AppPage from '../../../@crema/hoc/AppPage';
import AppPageMeta from '../../../@crema/core/AppPageMeta';

import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import AppLowerCaseTextField from '../../../@crema/core/AppFormComponents/AppLowerCaseTextField';
import AppUpperCaseTextField from '../../../@crema/core/AppFormComponents/AppUpperCaseTextField';

console.log('Al menos aquí 1?');

import {
  Checkbox,
  FormControlLabel,
  Button,
  ButtonGroup,
  Select,
  Box,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Card,
  IconButton,
  Collapse,
  Alert,
  Dialog,
  Grid,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Typography,
  Divider,
  Autocomplete,
} from '@mui/material';

import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloseIcon from '@mui/icons-material/Close';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import {red} from '@mui/material/colors';

import {
  onGetBusinessParameter,
  onGetGlobalParameter,
} from '../../../redux/actions/General';
import {useDispatch, useSelector} from 'react-redux';
import Router, {useRouter} from 'next/router';
import {DesktopDatePicker, DateTimePicker} from '@mui/lab';
import {width} from '@mui/system';

import {
  getActualMonth,
  getYear,
  toEpoch,
  simpleDateToDateObj,
  convertToDateWithoutTime,
  verTags,
} from '../../../Utils/utils';

import {updateClient, onGetClients} from '../../../redux/actions/Clients';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
} from '../../../shared/constants/ActionTypes';
import CheckIcon from '@mui/icons-material/Check';

const useStyles = makeStyles((theme) => ({
  closeButton: {
    cursor: 'pointer',
    float: 'right',
    marginTop: '5px',
    width: '20px',
  },
}));

const maxLengthNumber = 111111111111; //11 caracteres
const validationSchema = yup.object({
  /* name: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />)
      .required(<IntlMessages id='validation.required' />),
    nroDocument: yup
      .number()
      .typeError(<IntlMessages id='validation.number' />)
      .required(<IntlMessages id='validation.required' />)
      .integer(<IntlMessages id='validation.number.integer' />)
      .max(maxLengthNumber, 'Solo puedes ecribir 11 carácteres como máximo'), */
  // numberDocumentClient: yup
  //   .number()
  //   .typeError(<IntlMessages id='validation.number' />)
  //   .required(<IntlMessages id='validation.required' />)
  //   .max(100000000000, 'Se puede ingresar como maximo 11 caracteres'),
  // denominationClient: yup
  //   .string()
  //   .typeError(<IntlMessages id='validation.string' />)
  //   .required(<IntlMessages id='validation.required' />),

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
let selectedClient = {};
let typeAlert = '';
const UpdateClient = (props) => {
  const router = useRouter();
  let {query} = router;
  console.log('query', query);
  const [typeDialog, setTypeDialog] = React.useState('');
  const [openStatus, setOpenStatus] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const [showAlert, setShowAlert] = React.useState(false);
  const [statusClient, setStatusClient] = React.useState(query.status);
  const dispatch = useDispatch();
  const [isRUC, setRUC] = React.useState(false);
  const [identidad, setIdentidad] = React.useState('');
  const [birthDay, setBirthDay] = React.useState(
    query.birthDay ? query.birthDay : new Date(),
  );

  const [tagsClientDefault, setTagsClientDefault] = React.useState(query.tags);
  const [listTags, setListTags] = React.useState([]);
  const [tagSelected, setTagSelected] = React.useState(tagsClientDefault);
  const [reload, setReload] = React.useState(0); // integer state
  const toUpdateClient = (payload) => {
    dispatch(updateClient(payload));
  };

  const useForceUpdate = () => {
    const [reload, setReload] = React.useState(0); // integer state
    return () => setReload((val) => val + 1); // update the state to force render
  };
  const forceUpdate = useForceUpdate();

  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  const [tagsClient, setTagsClient] = React.useState([]);
  // const {listClients} = useSelector(({clients}) => clients);
  // console.log('listClients', listClients);
  const {businessParameter} = useSelector(({general}) => general);
  console.log('businessParameter', businessParameter);
  const {
    listClients,
    updateClientRes,
    successMessage,
    errorMessage,
    process,
    loading,
  } = useSelector(({clients}) => clients);
  console.log('updateClientRes', updateClientRes);
  // const {successMessage} = useSelector(({finances}) => finances);
  // console.log('successMessage', successMessage);
  // const {errorMessage} = useSelector(({finances}) => finances);
  // console.log('errorMessage', errorMessage);

  useEffect(() => {
    switch (process) {
      case 'UPDATE_CLIENT':
        if (!loading && (successMessage || errorMessage)) {
          setOpenStatus(true);
        }

        break;
      default:
        console.log('Esto esta cool');
    }
  }, [loading]);

  useEffect(() => {
    if (
      userDataRes &&
      userDataRes.merchantSelected &&
      businessParameter &&
      listTags.length == 0
    ) {
      let listTags1 = businessParameter.find(
        (obj) => obj.abreParametro == 'CLIENT_TAGS',
      ).value;
      console.log('listTags1', listTags1);

      listTags1.forEach((item) => {
        listTags.push([item.tagName, item.id, true]);
      });
      console.log('listTags este es:', listTags);
    }
  }, [userDataRes]);

  if (listClients != undefined) {
    selectedClient = listClients.find(
      (input) => input.clientId == query.clientId,
    );
    console.log('selectedClient', selectedClient);
  }

  let defaultValues = {
    documentType: query.clientId.split('-')[0],
    nroDocument: query.clientId.split('-')[1],
    givenName: query.givenName || '',
    lastName: query.lastName || '',
    secondLastName: query.secondLastName || '',
    birthDay: query.birthDay || '',
    name: query.denominationClient || '',
    addressClient: query.addressClient || '',
    emailClient: query.emailClient || '',
    emailContact: query.emailContact || '',
    nameContact: query.nameContact || '',
    numberContact: query.numberContact || '',
    numberCountryCode: '51',
    extraInformationClient: query.extraInformationClient || '',
  };
  let businessParameterPayload = {
    request: {
      payload: {
        abreParametro: null,
        codTipoparametro: null,
        merchantId: userDataRes.merchantSelected.merchantId,
      },
    },
  };

  let objSelects = {
    documentType: '',
  };

  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);

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
        nameContact:
          data.givenName + ' ' + data.lastName + ' ' + data.secondLastName,
      };
    }

    let newClientPayload = {
      request: {
        payload: {
          clientId: query.clientId,
          typeDocumentClient: data.documentType,
          numberDocumentClient: data.nroDocument,
          denominationClient: data.name,
          addressClient: data.addressClient,
          emailClient: data.emailClient,
          numberContact: data.numberContact,
          numberCountryCode: '51',
          extraInformationClient: data.extraInformationClient,
          ...extraTrama,

          // merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };

    if (tagSelected.length > 0) {
      let listTagsSelected = [];
      tagSelected.forEach((item) => {
        listTagsSelected.push(item[1]);
      });
      newClientPayload.request.payload.tags = listTagsSelected;
    }

    console.log('updateClientPayload', newClientPayload);
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    toUpdateClient(newClientPayload);
    setSubmitting(false);
    setOpenStatus(true);
  };

  const cancel = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleClickOpen = (type) => {
    setOpen(true);
    setTypeDialog(type);
    setShowAlert(false);
  };

  const handlerTags = (event, values) => {
    console.log('Cambiando tags');
    console.log('evento tag', event);
    console.log('values tag', values);
    console.log('tag seleccionado', event.target.attributes.value);
    setTagSelected(values);
    reloadPage();
  };

  const reloadPage = () => {
    setReload(!reload);
  };

  const showMessage = () => {
    if (successMessage) {
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
            Se ha actualizado la información <br />
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
            Se ha producido un error al actualizar.
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink />;
    }
  };

  const sendStatus = () => {
    setTimeout(() => {
      setOpenStatus(false);
      Router.push('/sample/clients/table');
    }, 2000);
  };

  const handleField = (event) => {
    console.log('evento', event);
    objSelects[event.target.name] = event.target.value;
    console.log('objSelects', objSelects);
    setRUC(objSelects.documentType == 'RUC' ? true : false);
  };
  const formatSentence = (phrase) => {
    let firstSentence = phrase
      .trim()
      .split(' ')
      .filter((ele) => ele !== '')
      .join(' ');

    return (
      firstSentence.charAt(0).toUpperCase() +
      firstSentence.slice(1).toUpperCase()
    );
  };

  const inicializaIdentidad = () => {
    if (!identidad) {
      setIdentidad(query.clientId.split('-')[0]);
      setRUC(query.clientId.split('-')[0] == 'RUC' ? true : false);
    }
    return '';
  };

  return (
    <Card sx={{p: 4}}>
      <Box sx={{width: 1, textAlign: 'center'}}>
        <Typography
          sx={{mx: 'auto', my: '10px', fontWeight: 600, fontSize: 25}}
        >
          ACTUALIZACIÓN DE CLIENTE
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
          {({values, isSubmitting, setFieldValue}) => {
            return (
              <Form
                style={{textAlign: 'left', justifyContent: 'center'}}
                noValidate
                autoComplete='on'
                onChange={(value) => {
                  console.log('Los values', values);
                  if (
                    ['givenName', 'lastName', 'secondLastName'].includes(
                      value.target.name,
                    ) &&
                    values.documentType == 'DNI'
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

                /* onChange={handleActualData} */
              >
                <Grid container spacing={2} sx={{width: 500, margin: 'auto'}}>
                  <Grid item xs={12}>
                    <FormControl disabled fullWidth sx={{my: 2}}>
                      <InputLabel
                        id='categoria-label'
                        style={{fontWeight: 200}}
                      >
                        Identificador
                      </InputLabel>
                      {/* {inicializaIdentidad()} */}
                      <Select
                        defaultValue={query.clientId.split('-')[0]}
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
                  <Grid item xs={12}>
                    <AppTextField
                      disabled
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
                      <Grid item xs={2} md={2}>
                        <TextField
                          disabled
                          defaultValue={'+51'}
                          label={
                            <IntlMessages id='common.cellphoneCountryCod' />
                          }
                          variant='filled'
                          sx={{
                            my: 2,
                            mx: 0,
                          }}
                          color='success'
                          focused
                        />
                      </Grid>
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
                      <Autocomplete
                        sx={{
                          m: 1,
                          width: '100%', // Establece el ancho al 100% por defecto
                          [(theme) => theme.breakpoints.down('sm')]: {
                            width: '80%', // Ancho del 80% en pantallas pequeñas
                          },
                          [(theme) => theme.breakpoints.up('md')]: {
                            width: 500, // Ancho fijo de 500px en pantallas medianas y grandes
                          },
                        }}
                        multiple
                        options={listTags.filter((option) => option[2] == true)}
                        getOptionLabel={(option) => option[0]}
                        onChange={handlerTags}
                        disableCloseOnSelect
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant='outlined'
                            label='Etiqueta'
                            placeholder='Etiqueta'
                          />
                        )}
                        renderOption={(props, option, {selected}) => (
                          <MenuItem
                            {...props}
                            key={option[1]}
                            value={option}
                            sx={{justifyContent: 'space-between'}}
                          >
                            {option[0]}
                            {selected ? <CheckIcon color='info' /> : null}
                          </MenuItem>
                        )}
                      />
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
                      <Grid item xs={2} md={2}>
                        <TextField
                          disabled
                          defaultValue={'+51'}
                          label={
                            <IntlMessages id='common.cellphoneCountryCod' />
                          }
                          variant='filled'
                          sx={{
                            my: 2,
                            mx: 0,
                          }}
                          color='success'
                          focused
                        />
                      </Grid>
                      <Grid item xs={10}>
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
                      <Autocomplete
                        sx={{
                          m: 1,
                          width: '100%', // Establece el ancho al 100% por defecto
                          [(theme) => theme.breakpoints.down('sm')]: {
                            width: '80%', // Ancho del 80% en pantallas pequeñas
                          },
                          [(theme) => theme.breakpoints.up('md')]: {
                            width: 500, // Ancho fijo de 500px en pantallas medianas y grandes
                          },
                        }}
                        multiple
                        options={listTags.filter((option) => option[2] == true)}
                        getOptionLabel={(option) => option[0]}
                        onChange={handlerTags}
                        disableCloseOnSelect
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant='outlined'
                            label='Etiqueta'
                            placeholder='Etiqueta'
                          />
                        )}
                        renderOption={(props, option, {selected}) => (
                          <MenuItem
                            {...props}
                            key={option[1]}
                            value={option}
                            sx={{justifyContent: 'space-between'}}
                          >
                            {option[0]}
                            {selected ? <CheckIcon color='info' /> : null}
                          </MenuItem>
                        )}
                      />
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
              </Form>
            );
          }}
        </Formik>
      </Box>

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

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Actualización de Cliente'}
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
          {'Actualización de cliente'}
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

export default UpdateClient;
