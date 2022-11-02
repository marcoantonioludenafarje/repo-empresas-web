import React, {useState, useEffect, useCallback, useRef} from 'react';
import {makeStyles} from '@mui/styles';
import * as yup from 'yup';
import {Form, Formik} from 'formik';
import AppPage from '../../../@crema/hoc/AppPage';
import AppPageMeta from '../../../@crema/core/AppPageMeta';

import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
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

import {updateCarrier, getCarriers} from '../../../redux/actions/Carriers';
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
  numberDocumentCarrier: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .required(<IntlMessages id='validation.required' />)
    .max(100000000000, 'Se puede ingresar como maximo 11 caracteres'),
  denominationCarrier: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  addressCarrier: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
  emailCarrier: yup
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
  extraInformationCarrier: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
});
let selectedCarrier = {};
let typeAlert = '';
const UpdateCarrier = (props) => {
  const router = useRouter();
  let {query} = router;
  console.log('query', query);
  const [typeDialog, setTypeDialog] = React.useState('');
  const [openStatus, setOpenStatus] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const [showAlert, setShowAlert] = React.useState(false);
  const [statusCarrier, setStatusCarrier] = React.useState(query.status);
  const dispatch = useDispatch();

  const toUpdateCarrier = (payload) => {
    dispatch(updateCarrier(payload));
  };

  const useForceUpdate = () => {
    const [reload, setReload] = React.useState(0); // integer state
    return () => setReload((val) => val + 1); // update the state to force render
  };
  const forceUpdate = useForceUpdate();

  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  const {getCarriersRes} = useSelector(({carriers}) => carriers);
  console.log('getCarriersRes', getCarriersRes);
  const {businessParameter} = useSelector(({general}) => general);
  console.log('businessParameter', businessParameter);
  const {updateCarrierRes} = useSelector(({carriers}) => carriers);
  console.log('updateCarrierRes', updateCarrierRes);
  const {successMessage} = useSelector(({finances}) => finances);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({finances}) => finances);
  console.log('errorMessage', errorMessage);

  if (getCarriersRes != undefined) {
    selectedCarrier = getCarriersRes.find(
      (input) => input.carrierId == query.carrierId,
    );
    console.log('selectedCarrier', selectedCarrier);
  }

  const defaultValues = {
    typeDocumentCarrier: query.carrierId.split('-')[0],
    numberDocumentCarrier: query.carrierId.split('-')[1],
    denominationCarrier: query.denominationCarrier || '',
    addressCarrier: query.addressCarrier || '',
    emailCarrier: query.emailCarrier || '',
    emailContact: query.emailContact || '',
    nameContact: query.nameContact || '',
    numberContact: query.numberContact || '',
    extraInformationCarrier: query.extraInformationCarrier || '',
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
  let newCarrierPayload = {
    request: {
      payload: {
        carrierId: query.carrierId,
        denominationCarrier: '',
        addressCarrier: '',
        nameContact: '',
        numberContact: '',
        emailContact: '',
        emailCarrier: '',
        extraInformationCarrier: '',
      },
    },
  };

  let objSelects = {
    documentType: 'RUC',
  };

  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    delete data.documentType;
    console.log('Data', data);
    console.log('objSelects', objSelects);
    newCarrierPayload.request.payload.denominationCarrier =
      data.denominationCarrier;
    newCarrierPayload.request.payload.addressCarrier = data.addressCarrier;
    newCarrierPayload.request.payload.nameContact = data.nameContact;
    newCarrierPayload.request.payload.numberContact = data.numberContact;
    newCarrierPayload.request.payload.emailContact = data.emailContact;
    newCarrierPayload.request.payload.emailCarrier = data.emailCarrier;
    newCarrierPayload.request.payload.extraInformationCarrier =
      data.extraInformationCarrier;
    toUpdateCarrier(newCarrierPayload);
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
    Router.push('/sample/carriers/table');
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
          ACTUALIZACIÓN DE TRANSPORTISTA
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
                      <Select
                        defaultValue='RUC'
                        name='typeDocumentCarrier'
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
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <AppTextField
                      disabled
                      label='Número Identificador *'
                      name='numberDocumentCarrier'
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
                      label='Nombre / Razón Social *'
                      name='denominationCarrier'
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
                      label='Dirección'
                      name='addressCarrier'
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
                      label='Correo de Empresa'
                      name='emailCarrier'
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
                      label='Información adicional'
                      multiline
                      rows={4}
                      name='extraInformationCarrier'
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
          {'Actualización de Transportisa'}
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
              Router.push('/sample/carriers/table');
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
          {'Actualización de transportista'}
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

export default UpdateCarrier;
