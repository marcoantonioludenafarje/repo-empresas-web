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
  Autocomplete,
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

import {updateLocation, getLocations} from '../../../redux/actions/Locations';
import {FETCH_SUCCESS} from '../../../shared/constants/ActionTypes';
import originalUbigeos from '../../../Utils/ubigeo.json';

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
    modularCode: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />)
      .required(<IntlMessages id='validation.required' />),
    locatioName: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />)
      .required(<IntlMessages id='validation.required' />),
    locationDetail: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />)
      .required(<IntlMessages id='validation.required' />),
    ubigeo: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />)
      .required(<IntlMessages id='validation.required' />),
    type: yup
      .string()
      .typeError(<IntlMessages id='validation.string' />)
      .required(<IntlMessages id='validation.required' />),

});
let selectedLocation = {};
let typeAlert = '';
const UpdateLocation = (props) => {
  const router = useRouter();
  let {query} = router;
  console.log('query', query);
  const [typeDialog, setTypeDialog] = React.useState('');
  const [openStatus, setOpenStatus] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [ubigeo, setUbigeo] = React.useState('150101');
  const [existUbigeo, setExistUbigeo] = React.useState(true);
  const [parsedUbigeos, setParsedUbigeos] = React.useState([]);
  const [readyData, setReadyData] = React.useState(false);
  const [objUbigeo, setObjUbigeo] = React.useState({
    descripcion: 'LIMA / LIMA / LIMA',
    label: 'LIMA / LIMA / LIMA - 150101',
    ubigeo: '150101',
  });

  const [showAlert, setShowAlert] = React.useState(false);
  const [statusLocation, setStatusLocation] = React.useState(query.status);
  const dispatch = useDispatch();

  const toUpdateLocation = (payload) => {
    dispatch(updateLocation(payload));
  };

  const useForceUpdate = () => {
    const [reload, setReload] = React.useState(0); // integer state
    return () => setReload((val) => val + 1); // update the state to force render
  };
  const forceUpdate = useForceUpdate();

  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  const {getLocationsRes} = useSelector(({locations}) => locations);
  console.log('getLocationsRes', getLocationsRes);
  const {businessParameter} = useSelector(({general}) => general);
  console.log('businessParameter', businessParameter);
  const {updateLocationRes} = useSelector(({locations}) => locations);
  console.log('updateLocationRes', updateLocationRes);
  const {successMessage} = useSelector(({finances}) => finances);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({finances}) => finances);
  console.log('errorMessage', errorMessage);

  if (getLocationsRes != undefined) {
    selectedLocation = getLocationsRes.find(
      (input) => input.locationId == query.locationId,
    );
    console.log('selectedLocation', selectedLocation);
  }

  const defaultValues = {
    modularCode: query.modularCode || '',
    locationName: query.locationName || '',
    locationDetail: query.locationDetail || '',
    ubigeo: query.ubigeo || '',
    type: query.type || '',
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
  let newLocationPayload = {
    request: {
      payload: {
        locationId: query.locationId,
        modularCode: '',
        coordenates: '',
        locationDetail: '',
        locationName: '',
        type: '',
        ubigeo: '',
      },
    },
  };

  let objSelects = {
    type: ['PUNTO LLEGADA','PUNTO PARTIDA'],
  };

  let objSelectsU = {
    ubigeo: '150101',
  };

  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    delete data.ubigeo;
    delete data.type;
    console.log('Data', data);
    console.log('objSelects', objSelects);
    newLocationPayload.request.payload.modularCode =
      data.modularCode;
    newLocationPayload.request.payload.locationName =
      data.locationName;
    newLocationPayload.request.payload.locationDetail =
      data.locationDetail;
    newLocationPayload.request.payload.ubigeo =
      objUbigeo.ubigeo;
    newLocationPayload.request.payload.type =
      objSelectsT.type;
    newLocationPayload.request.payload.coordenates =
      {"lat":{"S":""},"long":{"S":""}};;

    toUpdateLocation(newLocationPayload);
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
    Router.push('/sample/locations/table');
  };

  const handleField = (event) => {
    console.log('evento', event);
    objSelects[event.target.name] = event.target.value;
    console.log('ocjSelects', objSelects);
  };

  useEffect(() => {
    const ubigeos = originalUbigeos.map((obj, index) => {
      return {
        label: `${obj.descripcion} - ${obj.ubigeo}`,
        ...obj,
      };
    });
    
    setParsedUbigeos(ubigeos);
      if (readyData) {
        setObjUbigeo(ubigeos[0]);
        setUbigeo(ubigeos[0].ubigeo.toString());
        objSelectU.ubigeo = ubigeos[0].ubigeo.toString();
        setExistUbigeo(true);
        setReadyData(true);
      }
  }, [readyData]);

  useEffect(() => {
    const ubi = parsedUbigeos.find(o => o.ubigeo == query.ubigeo);
    if (ubi){
      setObjUbigeo(ubi);
      setUbigeo(query.ubigeo.toString());
    }    
  }, [parsedUbigeos]);

  return (
    <Card sx={{p: 4}}>
      <Box sx={{width: 1, textAlign: 'center'}}>
        <Typography
          sx={{mx: 'auto', my: '10px', fontWeight: 600, fontSize: 25}}
        >
          ACTUALIZACIÓN DE LOCALIZACIÓN
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
                    <AppTextField disabled
                      label='Código *'
                      name='modularCode'
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
                      label='Nombre *'
                      name='locationName'
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
                      label='Dirección *'
                      name='locationDetail'
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
                    <Autocomplete
                      disablePortal
                      id='ubigeo'
                      value={objUbigeo}
                      isOptionEqualToValue={(option, value) =>
                        option.ubigeo === value.ubigeo.toString()
                      }
                      getOptionLabel={(option) => option.label || ''}
                      onChange={(option, value) => {
                        if (
                          typeof value === 'object' &&
                          value != null &&
                          value !== ''
                        ) {
                          console.log('objeto ubigeo', value);
                          setObjUbigeo(value);
                          setUbigeo(value.ubigeo.toString());
                          objSelectsU.ubigeo = value.ubigeo.toString();
                          setExistUbigeo(true);
                        } else {
                          setExistUbigeo(false);
                        }
                        console.log('ubigeo, punto de partida', value);
                      }}
                      options={parsedUbigeos}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={<IntlMessages id='ubigeo.signUp' />}
                          onChange={(event) => {
                            console.log('event field', event.target.value);
                            if (event.target.value === '') {
                              console.log('si se cambia a null');
                              setExistUbigeo(false);
                            }
                          }}
                        />
                      )}
                    />                    
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel
                        id='type-label'
                        style={{fontWeight: 200}}
                      >
                        Tipo
                      </InputLabel>
                      <Select
                        defaultValue={query.type}
                        name='type'
                        labelId='type-label'
                        label='Tipo'
                        onChange={handleField}
                      >
                        <MenuItem value='PUNTO LLEGADA' style={{fontWeight: 200}}>
                          PUNTO LLEGADA
                        </MenuItem>
                        <MenuItem
                          value='PUNTO PARTIDA'
                          style={{fontWeight: 200}}
                        >
                          PUNTO PARTIDA
                        </MenuItem>
                      </Select>
                    </FormControl>
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
          {'Actualización de Localización'}
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
              Router.push('/sample/locations/table');
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
          {'Actualización de localización'}
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

export default UpdateLocation;