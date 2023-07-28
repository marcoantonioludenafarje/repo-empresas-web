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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  Box,
  FormControl,
  InputLabel,
  Autocomplete,
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
  FormControlLabel,
  Divider,
  Typography,
  IconButton,
  TextField,
  Switch,
  TableContainer,
  TableCell,
  Table,
  TableHead,
  TableRow,
  Checkbox,
  TableBody,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloseIcon from '@mui/icons-material/Close';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import {red} from '@mui/material/colors';

import {DataGrid} from '@mui/x-data-grid';
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
} from '../../../Utils/utils';

import {updateClient, onGetClients} from '../../../redux/actions/Clients';
import {} from '../../../redux/actions/Campaign';
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

  const [listTags, setListTags] = React.useState([]);
  const [tagSelected, setTagSelected] = React.useState([]);
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

      listTags1.forEach((item) => {
        listTags.push([item.tagName, item.id, true]);
      });
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
          Crear Campaña
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
          initialValues={defaultValues}
          onSubmit={handleData}
          //enableReinitialize={true}
        >
          {({values, errors, isSubmitting, setFieldValue, setSubmitting}) => {
            toSubmitting = setSubmitting;
            return (
              <Form
                style={{textAlign: 'left', justifyContent: 'center'}}
                id='principal-form'
                noValidate
                autoComplete='on'
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <AppTextField
                      label='Nombre de la Campaña *'
                      name='campaignName'
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
                  <Grid item xs={12} md={6}>
                    <DateTimePicker
                      minDateTime={new Date(Date.now() + 59 * 60 * 1000)}
                      value={publishDate}
                      onChange={(e) => {
                        console.log('tipo', e);
                        setPublishDate(e);
                      }}
                      label='Fecha *'
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
                  <Grid container spacing={2}>
                    {/* Primer Grid - Contiene el Clientes Box */}
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          my: 2,
                        }}
                      >
                        <Box
                          sx={{
                            border: '1px solid #ccc',
                            padding: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={clientSelection === 'Todos'}
                                onChange={handleClientSelectionChange}
                                name='Todos'
                              />
                            }
                            label='Todos'
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={clientSelection === 'Algunos'}
                                onChange={handleClientSelectionChange}
                                name='Algunos'
                              />
                            }
                            label={`Algunos (${totaldeClientes()})`}
                          />
                          {clientSelection === 'Algunos' && (
                            <Button
                              variant='outlined'
                              onClick={() => setOpenClientsDialog(true)}
                            >
                              Clientes
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Grid>

                    {/* Segundo Grid - Contiene el componente Autocomplete */}
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'column',
                          mt: 2,
                        }}
                      >
                        <Autocomplete
                          value={selectedTags}
                          onChange={(event, newValue) => {
                            console.log('Nuevo Tag seleccionado:', newValue);
                            handleTagSelect(newValue);
                          }}
                          disabled={selectedClientCount === listClients.length}
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
                          options={['ALL', ...namesTags]}
                          getOptionLabel={(option) => option}
                          disableCloseOnSelect
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant='outlined'
                              label='Selecciona Etiquetas'
                              placeholder='etiquetas...'
                            />
                          )}
                          renderOption={(props, option, {selected}) => (
                            <MenuItem
                              {...props}
                              key={option}
                              value={option}
                              sx={{justifyContent: 'space-between'}}
                            >
                              {option}
                              {selected ? <CheckIcon color='info' /> : null}
                            </MenuItem>
                          )}
                        />
                      </Box>
                    </Grid>

                    {/* Tercer Grid - Contiene el box image */}
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'column',
                          mt: 2,
                        }}
                      >
                        <Button
                          variant='contained'
                          color='secondary'
                          component='label'
                          sx={{mb: 1}}
                        >
                          Subir Imagen
                          <input
                            type='file'
                            hidden
                            onChange={(event) =>
                              handleImageChange(event, setFieldValue)
                            }
                            accept='.png, .jpeg, .jpg'
                            multiple
                          />
                        </Button>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                          }}
                        >
                          {previewImages.map((image, index) => (
                            <Box
                              key={index}
                              sx={{
                                position: 'relative',
                                mx: 1,
                                my: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <img
                                src={image}
                                alt='Preview'
                                style={{
                                  width: 100,
                                  height: 100,
                                  objectFit: 'cover',
                                  borderRadius: '8px',
                                }}
                              />
                              <IconButton
                                sx={{
                                  position: 'absolute',
                                  top: 0,
                                  right: 0,
                                  p: '2px',
                                }}
                                onClick={() =>
                                  removeImagePreview(index, setFieldValue)
                                }
                              >
                                <CancelOutlinedIcon fontSize='small' />
                              </IconButton>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                  <Box sx={{width: 1, textAlign: 'center', mt: 2}}>
                    <Typography sx={{fontSize: 18, fontWeight: 600}}>
                      Total de clientes: {totaldeClientes()}
                    </Typography>
                  </Box>
                  {campaignContents.map((contentData) => (
                    <Grid item xs={12} md={12} key={contentData.id}>
                      <Accordion
                        expanded={expanded === contentData.id}
                        onChange={handleAccordionChange(contentData.id)}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Mensaje N. {contentData.id}
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid item xs={12} md={12}>
                            <TextField
                              label='Contenido de la Campaña *'
                              name={`campaignContent${contentData.id}`}
                              variant='outlined'
                              multiline
                              rows={4}
                              value={contentData.content}
                              onChange={(event) =>
                                handleContentChange(
                                  contentData.id,
                                  event.target.value,
                                )
                              }
                              sx={{width: '100%', my: 2}}
                            />
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  ))}

                  {/* Botón "Más" para agregar un nuevo acordeón */}
                  {/* <Grid container item xs={12} justifyContent='center'>
                  <Button
                    variant='outlined'
                    color='primary'
                    onClick={handleAddAccordion}
                    startIcon={<AddCircleOutlineOutlinedIcon />}
                  >
                    Más
                  </Button>
                </Grid> */}
                </Grid>
                <Grid container item xs={12} justifyContent='center'>
                  <Button
                    variant='outlined'
                    color='primary'
                    startIcon={<AddCircleOutlineOutlinedIcon />}
                    onClick={() => setOpenDialog(true)}
                  >
                    Generar Variación
                  </Button>
                </Grid>

                <Dialog
                  open={openDialog}
                  onClose={() => setOpenDialog(false)}
                  maxWidth='md'
                  fullWidth
                >
                  <DialogTitle>
                    Variaciones
                    <IconButton
                      edge='end'
                      color='inherit'
                      onClick={() => setOpenDialog(false)}
                      aria-label='close'
                    >
                      <CancelOutlinedIcon />
                    </IconButton>
                  </DialogTitle>
                  <DialogContent>
                    {variations.map((variation, index) => (
                      <Accordion key={index}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          {variation}
                        </AccordionSummary>
                        <AccordionDetails>
                          {/* Additional content for each variation */}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </DialogContent>
                  <DialogActions>
                    <Button variant='outlined' onClick={handleAddVariation}>
                      Más
                    </Button>
                    <Button
                      variant='outlined'
                      onClick={() => setOpenDialog(false)}
                    >
                      Cerrar
                    </Button>
                  </DialogActions>
                </Dialog>

                <Box sx={{width: 1, textAlign: 'center', mt: 2}}>
                  <Typography sx={{fontSize: 18, fontWeight: 600}}>
                    Cantidad de variaciones: {numVariations}
                  </Typography>
                </Box>

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
                    form='principal-form'
                    disabled={isSubmitting}
                    startIcon={<SaveAltOutlinedIcon />}
                  >
                    Finalizar
                  </Button>
                  <Button
                    sx={{mx: 'auto', width: '40%', py: 2}}
                    variant='outlined'
                    startIcon={<ArrowCircleLeftOutlinedIcon />}
                    onClick={handleCancel}
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
        open={open}
        onClose={handleClose}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Cancelar Creación de Campaña'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <PriorityHighIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            ¿Estás seguro de que quieres cancelar la creación de la campaña?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button
            variant='outlined'
            onClick={() => {
              setOpen(false);
              Router.push('/sample/crm/views');
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
          {'Creación de Campaña'}
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
        open={openClientsDialog}
        onClose={() => setOpenClientsDialog(false)}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Seleccionar Clientes</DialogTitle>
        <DialogContent dividers>
          <div style={{height: 400, width: '700px'}}>
            <DataGrid
              rows={rows}
              columns={columns}
              checkboxSelection
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              onSelectionModelChange={(newSelection) => {
                console.log('Nueva selecc client', newSelection);
                setSelectedClientsByTag(newSelection);
                console.log(
                  'tamaño selecc client',
                  selectedClientsByTag.length,
                );
                setSelectedClientCount(selectedClientsByTag.length);
                setSelectedClients(newSelection);
              }}
              selectionModel={selectedClientsByTag}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClientsDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default UpdateClient;
