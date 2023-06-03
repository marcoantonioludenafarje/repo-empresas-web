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
  TextField,
  Autocomplete,
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
} from '@mui/material';

import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import {red} from '@mui/material/colors';
import {orange} from '@mui/material/colors';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
} from '../../../shared/constants/ActionTypes';
import {getUserData} from '../../../redux/actions/User';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import AppUpperCaseTextField from '../../../@crema/core/AppFormComponents/AppUpperCaseTextField';
import SchoolIcon from '@mui/icons-material/School';
import Router, {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {newLocation} from '../../../redux/actions/Locations';
import originalUbigeos from '../../../Utils/ubigeo.json';

/* const maxLength = 100000000000; //11 chars */
const validationSchema = yup.object({
  modularCode: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  locationName: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  locationDetail: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  ubigeo: yup.string(),
  type: yup.string(),
});
const defaultValues = {
  modularCode: '',
  locationName: '',
  locationDetail: '',
  ubigeo: '',
  type: '',
};
let newLocationPayload = {
  request: {
    payload: {
      locations: [
        {
          modularCode: '',
          coordenates: '',
          locationDetail: '',
          locationName: '',
          type: '',
          ubigeo: '',
        },
      ],
      merchantId: '',
    },
  },
};
const NewLocation = () => {
  const [open, setOpen] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [minTutorial, setMinTutorial] = React.useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [ubigeo, setUbigeo] = React.useState('150101');
  const [existUbigeo, setExistUbigeo] = React.useState(true);
  const [parsedUbigeos, setParsedUbigeos] = React.useState([]);
  const [readyData, setReadyData] = React.useState(false);
  const [objUbigeo, setObjUbigeo] = React.useState({
    descripcion: 'LIMA / LIMA / LIMA',
    label: 'LIMA / LIMA / LIMA - 150101',
    ubigeo: '150101',
  });

  let objSelectsT = {
    type: 'PUNTO LLEGADA',
  };

  let objSelectsU = {
    ubigeo: '150101',
  };

  //APIS
  const toNewLocation = (payload) => {
    dispatch(newLocation(payload));
  };
  //GET_VALUES_APIS
  const {newLocationRes} = useSelector(({locations}) => locations);
  console.log('newLocationRes', newLocationRes);
  const {successMessage} = useSelector(({locations}) => locations);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({locations}) => locations);
  console.log('errorMessage', errorMessage);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);

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
    if (userDataRes) {
      newLocationPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;
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
    delete data.ubigeo;
    delete data.type;
    console.log('Data', data);
    newLocationPayload.request.payload.locations[0].modularCode =
      data.modularCode;
    newLocationPayload.request.payload.locations[0].locationName =
      data.locationName;
    newLocationPayload.request.payload.locations[0].locationDetail =
      data.locationDetail;
    newLocationPayload.request.payload.locations[0].ubigeo = objUbigeo.ubigeo;
    newLocationPayload.request.payload.locations[0].type = objSelectsT.type;
    newLocationPayload.request.payload.locations[0].coordenates = {
      lat: {S: ''},
      long: {S: ''},
    };
    toNewLocation(newLocationPayload);
    setSubmitting(false);
    setOpenStatus(true);
  };

  const registerSuccess = () => {
    return (
      successMessage != undefined &&
      newLocationRes != undefined && // TO DO
      !('error' in newLocationRes)
    );
  };

  const registerError = () => {
    return (
      (successMessage != undefined &&
        newLocationRes &&
        'error' in newLocationRes) ||
      errorMessage != undefined
    );
  };

  const showMessage = () => {
    if (registerSuccess()) {
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
            Se ha registrado la información <br />
            correctamente
          </DialogContentText>
        </>
      );
    } else if (registerError()) {
      return (
        <>
          <CancelOutlinedIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            Se ha producido un error al registrar.
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink />;
    }
  };

  const sendStatus = () => {
    if (registerSuccess()) {
      Router.push('/sample/locations/table');
      setOpenStatus(false);
    } else if (registerError()) {
      setOpenStatus(false);
    } else {
      setOpenStatus(false);
    }
  };

  const handleField = (event) => {
    console.log('evento', event);
    objSelectsT[event.target.name] = event.target.value;
    console.log('ocjSelects', objSelectsT);
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
      objSelectsU.ubigeo = ubigeos[0].ubigeo.toString();
      setExistUbigeo(true);
      setReadyData(true);
    }
  }, [readyData]);

  return (
    <Card sx={{p: 4}}>
      <Box sx={{width: 1, textAlign: 'center'}}>
        <Typography
          sx={{mx: 'auto', my: '10px', fontWeight: 600, fontSize: 25}}
        >
          REGISTRO DE LOCACIÓN
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
                  <Grid item xs={8} sm={12}>
                    <AppUpperCaseTextField
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
                  <Grid item xs={8} sm={12}>
                    <AppUpperCaseTextField
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
                  <Grid item xs={8} sm={12}>
                    <AppUpperCaseTextField
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

                  <Grid item xs={8} sm={12}>
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
                  <Grid item xs={8} sm={12}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel id='type-label' style={{fontWeight: 200}}>
                        Tipo
                      </InputLabel>
                      <Select
                        defaultValue={objSelectsT.type}
                        name='type'
                        labelId='type-label'
                        label='Tipo'
                        onChange={handleField}
                      >
                        <MenuItem
                          value='PUNTO LLEGADA'
                          style={{fontWeight: 200}}
                        >
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
                        onClick={() =>
                          window.open('https://youtu.be/e-MjZrUNQzY/')
                        }
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
                          window.open('https://youtu.be/e-MjZrUNQzY/')
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
          {'Registro de Locaciones'}
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
          {'Registro de Locación'}
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

export default NewLocation;
