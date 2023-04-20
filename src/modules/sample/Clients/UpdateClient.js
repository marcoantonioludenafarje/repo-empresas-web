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
} from '../../../Utils/utils';

import {updateClient, onGetClients} from '../../../redux/actions/Clients';
import {FETCH_SUCCESS} from '../../../shared/constants/ActionTypes';

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
  numberDocumentClient: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .required(<IntlMessages id='validation.required' />)
    .max(100000000000, 'Se puede ingresar como maximo 11 caracteres'),
  denominationClient: yup
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
  nameContact: yup.string().typeError(<IntlMessages id='validation.string' />),
  numberContact: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .max(1000000000, 'Se puede ingresar como maximo 11 caracteres'),
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

  const {listClients} = useSelector(({clients}) => clients);
  console.log('listClients', listClients);
  const {businessParameter} = useSelector(({general}) => general);
  console.log('businessParameter', businessParameter);
  const {updateClientRes} = useSelector(({clients}) => clients);
  console.log('updateClientRes', updateClientRes);
  const {successMessage} = useSelector(({finances}) => finances);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({finances}) => finances);
  console.log('errorMessage', errorMessage);

  if (listClients != undefined) {
    selectedClient = listClients.find(
      (input) => input.clientId == query.clientId,
    );
    console.log('selectedClient', selectedClient);
  }

  const defaultValues = {
    typeDocumentClient: query.clientId.split('-')[0],
    numberDocumentClient: query.clientId.split('-')[1],
    denominationClient: query.denominationClient || '',
    addressClient: query.addressClient || '',
    emailClient: query.emailClient || '',
    emailContact: query.emailContact || '',
    nameContact: query.nameContact || '',
    numberContact: query.numberContact || '',
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
  let newClientPayload = {
    request: {
      payload: {
        clientId: query.clientId,
        denominationClient: '',
        addressClient: '',
        nameContact: '',
        numberContact: '',
        emailContact: '',
        emailClient: '',
        extraInformationClient: '',
      },
    },
  };

  let objSelects = {
    documentType: '',
  };

  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    delete data.documentType;
    console.log('Data', data);
    console.log('objSelects', objSelects);
    newClientPayload.request.payload.denominationClient =
      data.denominationClient;
    newClientPayload.request.payload.addressClient = data.addressClient;
    newClientPayload.request.payload.emailClient = data.emailClient;
    newClientPayload.request.payload.numberContact = data.numberContact;
    if (isRUC) {
      newClientPayload.request.payload.emailContact = data.emailContact;
      newClientPayload.request.payload.nameContact = data.nameContact;
    } else {
      newClientPayload.request.payload.emailContact = data.emailClient;
      newClientPayload.request.payload.nameContact = data.denominationClient;
    }
    newClientPayload.request.payload.extraInformationClient =
      data.extraInformationClient;
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
            Se ha actualizado la información <br />
            correctamente
          </DialogContentText>
        </>
      );
    } else if (errorMessage != undefined) {
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
    setOpenStatus(false);
    Router.push('/sample/clients/table');
  };

  const handleField = (event) => {
    console.log('evento', event);
    objSelects[event.target.name] = event.target.value;
    console.log('objSelects', objSelects);
    setRUC(objSelects.documentType == 'RUC' ? true : false);
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
          {({isSubmitting, setFieldValue}) => {
            return (
              <Form
                style={{textAlign: 'left', justifyContent: 'center'}}
                noValidate
                autoComplete='on'
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
                      {inicializaIdentidad()}
                      <Select
                        defaultValue={query.clientId.split('-')[0]}
                        name='typeDocumentClient'
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
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <AppTextField
                      disabled
                      label='Número Identificador *'
                      name='numberDocumentClient'
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
                      label='Nombre / Razón Social *'
                      name='denominationClient'
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
                  {isRUC ? (
                    <>
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
                    </>
                  ) : null}
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
