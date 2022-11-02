import React, {useEffect} from 'react';
import {useIntl} from 'react-intl';
import IntlMessages from '../../../@crema/utility/IntlMessages';

import {blue, green, red} from '@mui/material/colors';
import * as yup from 'yup';
import {Formik} from 'formik';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Collapse,
  Button,
  IconButton,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import Router, {useRouter} from 'next/router';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import Typography from '@mui/material/Typography';

import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import Grid from '@mui/material/Grid';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import PropTypes from 'prop-types';
import {
  getActualMonth,
  getYear,
  translateValue,
  fixDecimals,
} from '../../../Utils/utils';
// import {showStatus} from '../../../Utils/utilsFinances';
import {shallowEqual} from 'react-redux';

import AppGridContainer from '../../../@crema/core/AppGridContainer';
import {Form} from 'formik';
import {Fonts} from '../../../shared/constants/AppEnums';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import {useDispatch, useSelector} from 'react-redux';
import {newRequest} from '../../../redux/actions/Requests';
import {
  FETCH_ERROR,
  FETCH_SUCCESS,
  NEW_REQUEST,
  GET_BUSINESS_PLANS,
} from '../../../shared/constants/ActionTypes';
import {
  generatePresigned,
  uploadFile,
} from '../../../redux/actions/FileExplorer';
import {onGetBusinessPlans} from '../../../redux/actions/General';
const validationSchema = yup.object({
  promotionalCode: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
  comment: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
});
let typeForm = '';
let fileToUpload;
let urlToUpload;
let loadThis = '';
let toUpload = false;
const NewRequest = ({data, subType}) => {
  const [rowNumber, setRowNumber] = React.useState(0);
  const [rowNumber2, setRowNumber2] = React.useState(0);
  const [openDetails, setOpenDetails] = React.useState(false);
  const [openDocuments, setOpenDocuments] = React.useState(false);
  const [requestTypeSelected, setRequestTypeSelected] = React.useState(subType);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [base64, setBase64] = React.useState('');

  const [typeFile, setTypeFile] = React.useState('');
  const [nameFile, setNameFile] = React.useState('');
  const {successMessage} = useSelector(({user}) => user);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({user}) => user);
  console.log('errorMessage', errorMessage);

  const dispatch = useDispatch();

  const [planSelected, setPlanSelected] = React.useState('');
  const {jwtToken} = useSelector(({general}) => general);

  //APIS
  //
  const {newRequestRes} = useSelector(({requests}) => requests);
  console.log('newRequestRes', newRequestRes);
  const {userDataRes} = useSelector(({user}) => user);
  console.log('userDataRes', userDataRes);
  const {getPresignedRes} = useSelector(({fileExplorer}) => fileExplorer);
  console.log('getPresignedRes', getPresignedRes);
  const {getBusinessPlansRes} = useSelector(({general}) => general);
  console.log('getBusinessPlansRes', getBusinessPlansRes);
  const {uploadFileRes} = useSelector(({fileExplorer}) => fileExplorer);
  console.log('uploadFileRes', uploadFileRes);

  const toGeneratePresigned = (payload) => {
    dispatch(generatePresigned(payload));
  };
  const toUploadFile = (url, data) => {
    dispatch(uploadFile(url, data));
  };
  const toNewRequest = (payload) => {
    dispatch(newRequest(payload));
  };
  const initialValues = {
    subType: 'planActivation',
    planSelected: '',
    promotionalCode: '',
    comment: '',
    fileAttached: '',
  };

  useEffect(() => {
    console.log('Data de NewRequest', data);
    console.log('El tipo de solicitud: ', subType);
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
    filterData();
  }, []);
  const filterData = () => {
    setRequestTypeSelected(subType);
  };
  const registerSuccess = () => {
    console.log('A punto de ser exitoso?');
    return successMessage != undefined && newRequestRes != undefined;
  };
  const registerError = () => {
    console.log('A punto de ser fallido?');
    return (
      (newRequestRes && successMessage != undefined) ||
      errorMessage != undefined
    );
  };
  const sendStatus = () => {
    if (registerSuccess()) {
      setOpenStatus(false);
    } else if (registerError()) {
      setOpenStatus(false);
    } else {
      setOpenStatus(false);
    }
  };

  const showMessage = () => {
    if (registerSuccess()) {
      console.log('Request exitoso?');
      return (
        <>
          <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
            <CheckCircleOutlineOutlinedIcon
              color='success'
              sx={{fontSize: '6em', mx: 2}}
            />
            <DialogContentText
              sx={{fontSize: '1.2em', m: 'auto'}}
              id='alert-dialog-description'
            >
              Solicitud enviada.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{justifyContent: 'center'}}>
            <Button variant='outlined' onClick={sendStatus}>
              Aceptar
            </Button>
          </DialogActions>
        </>
      );
    } else if (registerError()) {
      console.log('Request fallido?');
      return (
        <>
          <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
            <CancelOutlinedIcon
              sx={{fontSize: '6em', mx: 2, color: red[500]}}
            />
            <DialogContentText
              sx={{fontSize: '1.2em', m: 'auto'}}
              id='alert-dialog-description'
            >
              Se ha producido un error al enviar. <br />
              {/* {registerError() ? registerUserRes : null} */}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{justifyContent: 'center'}}>
            <Button variant='outlined' onClick={() => setOpenStatus(false)}>
              Aceptar
            </Button>
          </DialogActions>
        </>
      );
    } else {
      return <CircularProgress disableShrink sx={{mx: 'auto', my: '20px'}} />;
    }
  };
  const {messages} = useIntl();

  const handleField = (event) => {
    console.log('evento', event);
    console.log('valor', event.target.value);
    if (event.target.name == 'requestTypeSelected') {
      setRequestTypeSelected(event.target.value);
    } else if (event.target.name == 'planSelected') {
      setPlanSelected(event.target.value);
    }
  };
  const uploadNewFile = (event) => {
    if (event.target.value !== '') {
      typeForm = 'newFile';
      console.log('archivo', event.target.files[0]);
      fileToUpload = event.target.files[0];
      let generatePresignedPayload = {
        request: {
          payload: {
            key: '',
            path: '',
            action: 'putObject',
            merchantId: userDataRes.merchantSelected.merchantId,
            contentType: '',
          },
        },
      };
      console.log('fileToUpload', fileToUpload);
      console.log(
        'nombre de archivo',
        fileToUpload.name.split('.').slice(0, -1).join('.'),
      );
      generatePresignedPayload.request.payload.key = fileToUpload.name
        .split('.')
        .slice(0, -1)
        .join('.');
      generatePresignedPayload.request.payload.path = actualPath;
      generatePresignedPayload.request.payload.contentType = fileToUpload.type;
      toGeneratePresigned(generatePresignedPayload);
      toUpload = true;
      loadThis = 'uploadFile';
      /* setOpenStatus(true); */
    } else {
      event = null;
      console.log('no se selecciono un archivo');
    }
  };
  const onLoad = (fileString) => {
    console.log('llega aquí?');
    setBase64(fileString);
  };
  const getBase64 = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      onLoad(reader.result);
    };
  };
  const uploadNewFile2 = (event) => {
    if (event.target.value !== '') {
      console.log('archivo', event.target.files[0]);
      fileToUpload = event.target.files[0];
      getBase64(fileToUpload);
      console.log('fileToUpload', fileToUpload);
      console.log(
        'nombre de archivo',
        fileToUpload.name.split('.').slice(0, -1).join('.'),
      );
      // generatePresignedPayload.request.payload.key = fileToUpload.name
      //   .split('.')
      //   .slice(0, -1)
      //   .join('.');
      // generatePresignedPayload.request.payload.path = actualPath;
      setTypeFile(fileToUpload.type);
      setNameFile(fileToUpload.name);

      /* setOpenStatus(true); */
    } else {
      event = null;
      console.log('no se selecciono un archivo');
    }
  };
  const cancel = () => {
    setRequestTypeSelected('');
    setPlanSelected('');
  };
  if (getPresignedRes != undefined) {
    urlToUpload = getPresignedRes.response.payload.presignedS3Url;
    console.log('urlToUpload', urlToUpload);
  }
  if (urlToUpload && fileToUpload && toUpload) {
    toUploadFile(getPresignedRes.response.payload.presignedS3Url, fileToUpload);
    toUpload = false;
  }
  if (
    uploadFileRes &&
    uploadFileRes.status != undefined &&
    loadThis == 'uploadFile'
  ) {
    console.log('estado de la subida', uploadFileRes.status);
    console.log('Todo correcto al subir el archivo');
    loadThis = '';
  }
  return (
    <Box sx={{width: 1}}>
      <Formik
        validateOnBlur={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(data, {setSubmitting}) => {
          setSubmitting(true);
          console.log('data: ', {...data});
          dispatch({type: FETCH_SUCCESS, payload: undefined});
          dispatch({type: FETCH_ERROR, payload: undefined});
          dispatch({type: NEW_REQUEST, payload: undefined});
          // TODO Api Call here to save user info
          let payloadNewRequest = {
            request: {
              payload: {
                subType: requestTypeSelected,
                planSelected: planSelected,
                promotionCode: data.promotionalCode,
                comment: data.comment,
                merchantId: userDataRes.merchantSelected.merchantId,
                merchantMasterId: userDataRes.merchantMasterId,
                userId: userDataRes.userId,
                userFullname: userDataRes.nombreCompleto,
                base64Files: base64,
                typeFile: typeFile,
                nameFile: nameFile,
                type: 'Request',
              },
            },
          };

          toNewRequest(payloadNewRequest);
          setOpenStatus(true);
          setSubmitting(false);
        }}
      >
        {({values, setFieldValue}) => {
          return (
            <Form noValidate autoComplete='off'>
              <Typography
                component='h3'
                sx={{
                  fontSize: 16,
                  fontWeight: Fonts.BOLD,
                  mb: {xs: 3, lg: 4},
                }}
              >
                <IntlMessages id='common.newRequest' />
              </Typography>

              <AppGridContainer spacing={4}>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{my: 2}}>
                    <InputLabel
                      id='requestTypeSelected-label'
                      style={{fontWeight: 200}}
                    >
                      <IntlMessages id='common.request.type' />
                    </InputLabel>
                    <Select
                      name='requestTypeSelected'
                      labelId='requestTypeSelected-label'
                      label={<IntlMessages id='common.request.type' />}
                      displayEmpty
                      onChange={handleField}
                      value={requestTypeSelected}
                    >
                      <MenuItem
                        value='planActivation'
                        style={{fontWeight: 200}}
                      >
                        Activación de Plan
                      </MenuItem>
                      <MenuItem value='planMigration' style={{fontWeight: 200}}>
                        Migración de Plan
                      </MenuItem>
                      <MenuItem value='planExtension' style={{fontWeight: 200}}>
                        Extensión de Plan
                      </MenuItem>
                      <MenuItem
                        value='invoiceDocumentAmpliation'
                        style={{fontWeight: 200}}
                      >
                        Ampliación de Documentos SUNAT
                      </MenuItem>
                      <MenuItem value='others' style={{fontWeight: 200}}>
                        Otros
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{my: 2}}>
                    <InputLabel
                      id='planSelected-label'
                      style={{fontWeight: 200}}
                    >
                      <IntlMessages id='common.request.planSelected' />
                    </InputLabel>
                    <Select
                      name='planSelected'
                      labelId='planSelected-label'
                      label={<IntlMessages id='common.request.planSelected' />}
                      displayEmpty
                      onChange={handleField}
                      value={planSelected}
                    >
                      {getBusinessPlansRes &&
                      Array.isArray(getBusinessPlansRes) &&
                      getBusinessPlansRes.length >= 1 ? (
                        getBusinessPlansRes.map((obj, index) => {
                          return (
                            <MenuItem
                              key={index}
                              value={obj.subscriptionPlanId}
                              style={{fontWeight: 200}}
                            >
                              {obj.description}
                            </MenuItem>
                          );
                        })
                      ) : (
                        <MenuItem value='plan1' style={{fontWeight: 200}}>
                          PYME
                        </MenuItem>
                      )}

                      <MenuItem value='plan2' style={{fontWeight: 200}}>
                        No aplica
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12}>
                  <AppTextField
                    name='promotionalCode'
                    fullWidth
                    label={<IntlMessages id='common.promotionCode' />}
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <AppTextField
                    name='comment'
                    fullWidth
                    label={<IntlMessages id='common.comment' />}
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <Button
                    variant='contained'
                    color='secondary'
                    component='label'
                  >
                    Adjuntar comprobante de pago
                    <input
                      type='file'
                      hidden
                      onChange={uploadNewFile2}
                      id='newFile'
                      name='newfile'
                    />
                  </Button>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Button
                      sx={{
                        position: 'relative',
                        minWidth: 100,
                      }}
                      color='primary'
                      variant='contained'
                      type='submit'
                    >
                      {/* <IntlMessages id='common.saveChanges' /> */}
                      Registrar
                    </Button>
                    <Button
                      sx={{
                        position: 'relative',
                        minWidth: 100,
                        ml: 2.5,
                      }}
                      color='primary'
                      variant='outlined'
                      onClick={cancel}
                    >
                      <IntlMessages id='common.cancel' />
                    </Button>
                  </Box>
                </Grid>
              </AppGridContainer>
            </Form>
          );
        }}
      </Formik>

      <Dialog
        open={openStatus}
        onClose={sendStatus}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Registro de Solicitud'}
        </DialogTitle>
        {showMessage()}
      </Dialog>
    </Box>
  );
};

NewRequest.propTypes = {
  data: PropTypes.array.isRequired,
  subType: PropTypes.string,
};

export default NewRequest;
