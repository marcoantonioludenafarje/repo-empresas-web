import React, {useEffect} from 'react';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import AddClientForm from '../ClientSelection/AddClientForm';

import {ClickAwayListener} from '@mui/base';
import {makeStyles} from '@mui/styles';
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
  FormControlLabel,
  Checkbox,
  TextField,
} from '@mui/material';
import {DateTimePicker} from '@mui/lab';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import AppUpperCaseTextField from '../../../@crema/core/AppFormComponents/AppUpperCaseTextField';
import {red} from '@mui/material/colors';
import {orange} from '@mui/material/colors';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
  GET_BUSINESS_PLANS,
} from '../../../shared/constants/ActionTypes';
import {getUserData} from '../../../redux/actions/User';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import Router, {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {onGetBusinessPlans} from '../../../redux/actions/General';

import {useState} from 'react';
import {activeSunat, upgradeProductive} from 'redux/actions';

/* const maxLength = 100000000000; //11 chars */
const validationSchema = yup.object({
  /* documentType: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />)
    .max(maxLength, 'Se puede ingresar como maximo 10 caracteres'), */
  businessName: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
});
const defaultValues = {
  businessName: '',
  //planeSelect: ''
};
let altaProd = {
  request: {
    payload: {
      dataproductive: {
        planDaysDesired: 30,
        planDesired: '',
        planDesiredId: '',
      },
      merchantId: '',
    },
  },
};

const toEpoch = (strDate) => {
  let someDate = new Date(strDate);
  someDate = someDate.getTime();
  return someDate;
};

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
  },
  btnGroup: {
    marginTop: '1em',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  btn: {
    margin: '3px 0',
    width: '260px',
  },
  noSub: {
    textDecoration: 'none',
  },
  field: {
    marginTop: '10px',
  },
  imgPreview: {
    display: 'flex',
    justifyContent: 'center',
  },
  img: {
    width: '80%',
  },
  fixPosition: {
    position: 'relative',
    bottom: '-8px',
  },
  searchIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonAddProduct: {},
  closeButton: {
    cursor: 'pointer',
    float: 'right',
    marginTop: '5px',
    width: '20px',
  },
}));
const Productive = (props) => {
  let changeValueField;
  let getValueField;
  let isFormikSubmitting;
  let setFormikSubmitting;
  const classes = useStyles(props);
  const [open, setOpen] = React.useState(false);
  const [openDialogClient, setOpenDialogClient] = React.useState(false);
  const [typeDialog, setTypeDialog] = React.useState('');
  const [showAlert, setShowAlert] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  React.useState(false);

  const [planes, setPlanes] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();

  let {query} = router;
  console.log('business', query);
  const [dateExpiration, setDateExpiration] = React.useState(Date.now()+1000*60*60*24*30);
  const [dateExpirationForm, setDateExpirationForm] = React.useState(
    toEpoch(Date.now()+1000*60*60*24*30),
  );

  defaultValues.businessName = query.denominationMerchant;

  //GET_VALUES_APIS
  const state = useSelector((state) => state);
  console.log('estado', state);
  const {successMessage} = useSelector(({appointment}) => appointment);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({appointment}) => appointment);
  console.log('errorMessage', errorMessage);
  const {userDataRes} = useSelector(({user}) => user);
  const {getBusinessPlansRes} = useSelector(({general}) => general);

  console.log('PLAN >>>', getBusinessPlansRes);

  const onUpgradeProd = (payload) => {
    console.log('objfin >>', payload);
    dispatch(upgradeProductive(payload));
    console.log('objlast');
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
  }, []);

  useEffect(() => {
    if (!getBusinessPlansRes) {
      console.log('Planes de negocio');

      dispatch({type: GET_BUSINESS_PLANS, payload: undefined});
      const toGetBusinessPlans = (payload) => {
        dispatch(onGetBusinessPlans(payload));
      };
      let getBusinessPlansPayload = {
        request: {
          payload: {},
        },
      };

      toGetBusinessPlans(getBusinessPlansPayload);
    }
    setPlanes(getBusinessPlansRes);
  }, []);

  useEffect(() => {
    console.log('Estamos userDataResINCampaign', userDataRes);
    if (
      userDataRes &&
      userDataRes.merchantSelected &&
      userDataRes.merchantSelected.merchantId
    ) {
      console.log('Estamos entrando al getClients');
      dispatch({type: FETCH_SUCCESS, payload: ''});
      dispatch({type: FETCH_ERROR, payload: ''});
    }
  }, [userDataRes]);

  const cancel = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickAway = () => {
    // Evita que se cierre el diálogo haciendo clic fuera del contenido
    // Puedes agregar condiciones adicionales aquí si deseas una lógica más específica.
  };
  const handleDatas = (data, {setSubmitting}) => {
    setSubmitting(true);
    console.log('CONFETI DATA', data);

    console.log('pla <<<<<<<<<<<<<<<  ', getValueField('planeSelect').value);
    let idplan = getValueField('planeSelect').value;
    console.log('pla <<<<<<<<<<<<<<<<<<<<xd  ', idplan);

    let plan = planes.filter((pl) => {
      console.log('plan pl', pl);
      return pl.subscriptionPlanId === idplan;
    });

    console.log('plan >>> xd', plan);

    altaProd.request = {
      payload: {
        dataproductive: {
          planDaysDesired: Math.ceil((dateExpiration - Date.now())/(1000*60*60*24)),
          planDesired: plan[0].description,
          planDesiredId: plan[0].subscriptionPlanId,
          roleDesiredId: plan[0].templateRolId,
        },
        merchantId: query.merchantId,
      },
    };

    console.log('objfinaly', altaProd);

    dispatch({type: FETCH_SUCCESS, payload: ''});
    dispatch({type: FETCH_ERROR, payload: ''});
    onUpgradeProd(altaProd);

    setSubmitting(false);
    setOpenStatus(true);
  };

  const compare = (a, b) => {
    if (a.description > b.description) {
      return 1;
    }
    if (a.description < b.description) {
      return -1;
    }
    return 0;
  };

  const showMessage = () => {
    if (successMessage != '') {
      console.log('MENSAJE DE VALIDEZ', successMessage);
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
      console.log('MENSAJE DE ERROR', errorMessage);
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
    console.log('Esto es el momento');
    setOpenStatus(false);
    Router.push('/sample/admin/table');
  };

  const handleCloseDialogClient = () => {
    setOpenDialogClient(false);
  };

  const handleClickOpen = (type) => {
    setOpenDialogClient(true);
    setTypeDialog(type);
    setShowAlert(false);
  };

  const getClient = (client) => {
    console.log('Estoy en el getClient');

    setSelectedClient(client);
    console.log('Cliente seleccionado', client);
    //forceUpdate();
    setOpen(false);
  };

  return (
    <Card sx={{p: 4}}>
      <Box sx={{width: 1, textAlign: 'center'}}>
        <Typography
          sx={{mx: 'auto', my: '10px', fontWeight: 600, fontSize: 25}}
        >
          Dar Alta Productivo
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
          onSubmit={handleDatas}
        >
          {({isSubmitting, setFieldValue, getFieldProps, setSubmitting}) => {
            changeValueField = setFieldValue;
            getValueField = getFieldProps;
            setFormikSubmitting = setSubmitting;
            isFormikSubmitting = isSubmitting;

            const durationInMilliseconds =
              parseInt(getValueField('duration').value) * 60000;
            console.log('data', getValueField('date').value);
            //const calculatedFinalDate = new Date(publishDate.getTime() + durationInMilliseconds);

            return (
              <Form
                style={{textAlign: 'left', justifyContent: 'center'}}
                noValidate
                autoComplete='on'
                id='principal-form'
                /* onChange={handleActualData} */
              >
                <Grid container spacing={2} sx={{width: 500, margin: 'auto'}}>
                  <Grid item xs={8} sm={12}>
                    <AppTextField
                      label='Razón Social del Negocio *'
                      name='businessName'
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
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel id='plan-label' style={{fontWeight: 200}}>
                        Seleccione el plan
                      </InputLabel>
                      <Select
                        name='planeSelect'
                        labelId='plan-label'
                        label='Seleccione el plan *'
                        onChange={(option, value) => {
                          setFieldValue('planeSelect', value.props.value);
                          // setIdentidad(value.props.value);
                        }}
                      >
                        {getBusinessPlansRes?.sort(compare).map((plans, index) => {
                          setPlanes(getBusinessPlansRes);
                          return (
                            <MenuItem
                              key={`plans-${index}`}
                              value={plans.subscriptionPlanId}
                              style={{fontWeight: 200}}
                            >
                              {plans.description}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={8} sm={12}>
                    <Grid item xs={12}>
                      <FormControl fullWidth sx={{my: 2}}>
                        <DateTimePicker
                          renderInput={(params) => (
                            <TextField size='small' {...params} />
                          )}
                          value={dateExpirationForm}
                          required
                          label='Fecha Expiración Suscripción'
                          inputFormat='dd/MM/yyyy hh:mm a'
                          minDate={Date.now()}
                          onChange={(newValue) => {
                            console.log('new valie', newValue);
                            setDateExpiration(toEpoch(newValue));
                            setDateExpirationForm(newValue);
                          }}
                        />
                      </FormControl>
                    </Grid>
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
                    form='principal-form'
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
          {'Dar alta a Producción'}
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
              Router.push('/sample/admin/table');
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
            {'Alta a Productivo'}
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
    </Card>
  );
};

export default Productive;
