import React, {useEffect, useRef} from 'react';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import AppLowerCaseTextField from '../../../@crema/core/AppFormComponents/AppLowerCaseTextField';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppInfoView from '../../../@crema/core/AppInfoView';
import {useAuthMethod, useAuthUser} from '../../../@crema/utility/AuthHooks';
import {Fonts} from '../../../shared/constants/AppEnums';
import Link from 'next/link';
import {FaFacebookF} from 'react-icons/fa';
import {AiOutlineGoogle} from 'react-icons/ai';
import originalUbigeos from '../../../Utils/ubigeo.json';
import AppGridContainer from '../../../@crema/core/AppGridContainer';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  MenuItem,
  TextField,
  Card,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Collapse,
  Typography,
  Grid,
  Autocomplete,
  Alert,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
const validationSchema = yup.object({
  email: yup
    .string()
    .email(<IntlMessages id='validation.emailFormat' />)
    .required(<IntlMessages id='validation.emailRequired' />),
  password: yup
    .string()
    .required(<IntlMessages id='validation.passwordRequired' />),
  confirmPassword: yup
    .string()
    .required(<IntlMessages id='validation.reTypePassword' />),
  name: yup.string().required(<IntlMessages id='validation.required' />),
  lastName: yup.string().required(<IntlMessages id='validation.required' />),
  cellphone: yup.number().required(<IntlMessages id='validation.cellphone' />),
  businessSocialReason: yup
    .string()
    .required(<IntlMessages id='validation.required' />),
  /* businessDocumentType: yup
    .string()
    .required(<IntlMessages id='validation.required' />), */
  businessDocumentNumber: yup
    .string()
    .required(<IntlMessages id='validation.required' />),
  businessDirection: yup
    .string()
    .required(<IntlMessages id='validation.required' />),
  promotionCode: yup.string(),
  businessNecessity: yup.string(),
  ubigeo: yup.string(),
});

const SignupAwsCognito = () => {
  const {auth} = useAuthUser();
  const {signUpCognitoUser} = useAuthMethod();
  const [ubigeo, setUbigeo] = React.useState('150101');
  const [existUbigeo, setExistUbigeo] = React.useState(true);
  const [parsedUbigeos, setParsedUbigeos] = React.useState([]);
  const [readyData, setReadyData] = React.useState(false);
  const [objUbigeo, setObjUbigeo] = React.useState({
    descripcion: 'LIMA / LIMA / LIMA',
    label: 'LIMA / LIMA / LIMA - 150101',
    ubigeo: '150101',
  });
  let anotherValues = {
    businessDocumentType: 'RUC',
  };
  const handleField = (event) => {
    console.log('evento', event);
    anotherValues[event.target.name] = event.target.value;
    console.log('anotherValues', anotherValues);
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
      anotherValues.ubigeo = ubigeos[0].ubigeo.toString();
      setExistUbigeo(true);
      setReadyData(true);
    }
  }, [readyData]);
  return (
    <Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
      <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', mb: 5}}>
        <Formik
          validateOnChange={true}
          initialValues={{
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            lastName: '',
            cellphone: '',
            businessSocialReason: '',
            /* businessDocumentType: '', */
            businessDocumentNumber: '',
            businessDirection: '',
            promotionCode: '',
            businessNecessity: '',
            ubigeo: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(data, {setSubmitting, setErrors}) => {
            setSubmitting(true);
            data.email = data.email.toLowerCase();
            data.cellphone = data.cellphone.toString();
            if (data.password !== data.confirmPassword) {
              console.log('No coincidieron', data);
              setErrors({
                confirmPassword: (
                  <IntlMessages id='validation.passwordMisMatch' />
                ),
              });
            } else {
              data.ubigeo = ubigeo;
              console.log('Data', data);
              console.log('anotherValues', anotherValues);
              console.log('todo el payload', {...anotherValues, ...data});
              signUpCognitoUser({...anotherValues, ...data});
            }
            setSubmitting(false);
          }}
        >
          {({isSubmitting}) => (
            <Form
              style={{
                textAlign: 'left',
                paddingTop: '0px',
              }}
              noValidate
              autoComplete='off'
            >
              <Typography
                component='h3'
                sx={{
                  fontSize: 16,
                  fontWeight: Fonts.BOLD,
                  mb: {xs: 3, lg: 5},
                }}
              >
                <IntlMessages id='common.userData' />
              </Typography>
              <Box sx={{mb: {xs: 4, xl: 5}}}>
                <AppLowerCaseTextField
                  label={<IntlMessages id='common.email' />}
                  name='email'
                  variant='outlined'
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                  }}
                />
              </Box>

              <Box sx={{mb: {xs: 4, xl: 5}}}>
                <AppTextField
                  label={<IntlMessages id='common.password' />}
                  name='password'
                  type='password'
                  variant='outlined'
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                  }}
                />
              </Box>

              <Box sx={{mb: {xs: 4, xl: 5}}}>
                <AppTextField
                  label={<IntlMessages id='common.retypeNewPassword' />}
                  name='confirmPassword'
                  type='password'
                  variant='outlined'
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                  }}
                />
              </Box>
              <Box sx={{mb: {xs: 4, xl: 5}}}>
                <AppTextField
                  label={<IntlMessages id='common.name' />}
                  name='name'
                  variant='outlined'
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                  }}
                />
              </Box>

              <Box sx={{mb: {xs: 4, xl: 5}}}>
                <AppTextField
                  label={<IntlMessages id='common.lastName' />}
                  name='lastName'
                  variant='outlined'
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                  }}
                />
              </Box>

              <AppGridContainer spacing={4}>
                <Grid item xs={2} md={2}>
                  <TextField
                    disabled
                    defaultValue={'+51'}
                    label={<IntlMessages id='common.cellphoneCountryCod' />}
                    variant='filled'
                    color='success'
                    focused
                  />
                </Grid>
                <Grid item xs={10} md={10}>
                  <Box sx={{mb: {xs: 4, xl: 5}}}>
                    <AppTextField
                      label={<IntlMessages id='common.cellphone' />}
                      name='cellphone'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                      }}
                    />
                  </Box>
                </Grid>
              </AppGridContainer>

              {/* <Box
                sx={{
                  mb: {xs: 3, xl: 4},
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Checkbox
                    sx={{
                      ml: -3,
                    }}
                  />
                  <Box
                    component='span'
                    sx={{
                      mr: 2,
                      color: 'grey.500',
                    }}
                  >
                    <IntlMessages id='common.iAgreeTo' />
                  </Box>
                </Box>
                <Box
                  component='span'
                  sx={{
                    color: (theme) => theme.palette.primary.main,
                    cursor: 'pointer',
                  }}
                >
                  <IntlMessages id='common.termConditions' />
                </Box>
              </Box> */}

              <Typography
                component='h3'
                sx={{
                  fontSize: 16,
                  fontWeight: Fonts.BOLD,
                  mb: {xs: 3, lg: 5},
                }}
              >
                <IntlMessages id='common.businessData' />
              </Typography>

              <Box sx={{mb: {xs: 4, xl: 5}}}>
                <AppTextField
                  label={<IntlMessages id='common.busines.socialReason' />}
                  name='businessSocialReason'
                  variant='outlined'
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                  }}
                />
              </Box>
              {/* <Box sx={{mb: {xs: 4, xl: 5}}}>
                <AppTextField
                  label={<IntlMessages id='common.busines.documentType' />}
                  name='businessDocumentType'
                  variant='outlined'
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                  }}
                />
              </Box> */}
              <Box sx={{mb: {xs: 4, xl: 5}}}>
                <FormControl fullWidth sx={{my: 2}}>
                  <InputLabel
                    id='businessDocumentType-label'
                    style={{fontWeight: 200}}
                  >
                    Tipo de documento
                  </InputLabel>
                  <Select
                    defaultValue='RUC'
                    name='businessDocumentType'
                    labelId='businessDocumentType-label'
                    label={<IntlMessages id='common.busines.documentType' />}
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
              </Box>
              <Box sx={{mb: {xs: 4, xl: 5}}}>
                <AppTextField
                  label={<IntlMessages id='common.busines.documentNumber' />}
                  name='businessDocumentNumber'
                  variant='outlined'
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                  }}
                />
              </Box>
              <Box sx={{mb: {xs: 4, xl: 5}}}>
                <AppTextField
                  label={<IntlMessages id='common.busines.direction' />}
                  name='businessDirection'
                  variant='outlined'
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                  }}
                />
              </Box>

              <Box sx={{mb: {xs: 4, xl: 5}}}>
                {/* <AppTextField
                  label={<IntlMessages id='common.business.ubigeo' />}
                  name='ubigeo'
                  variant='outlined'
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                  }}
                /> */}
                <Autocomplete
                  disablePortal
                  id='combo-box-demo'
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
                      anotherValues.ubigeo = value.ubigeo.toString();
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
              </Box>
              {/* PARTE DE CONTACTO E INFORMACION EXTRA */}
              {/* <Typography
                component='h3'
                sx={{
                  fontSize: 16,
                  fontWeight: Fonts.BOLD,
                  mb: {xs: 3, lg: 5},
                }}
              >
                <IntlMessages id='common.contactData' />
              </Typography>

              <Box sx={{mb: {xs: 4, xl: 5}}}>
                <AppTextField
                  label={<IntlMessages id='common.contact.name' />}
                  name='contactName'
                  variant='outlined'
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                  }}
                />
              </Box>
              <Box sx={{mb: {xs: 4, xl: 5}}}>
                <AppTextField
                  label={<IntlMessages id='common.contact.number' />}
                  name='contactNumber'
                  variant='outlined'
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                  }}
                />
              </Box>
              <Box sx={{mb: {xs: 4, xl: 5}}}>
                <AppTextField
                  label={<IntlMessages id='common.contact.email' />}
                  name='contactEmail'
                  variant='outlined'
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                  }}
                />
              </Box>
              <Box sx={{mb: {xs: 4, xl: 5}}}>
                <AppTextField
                  label={<IntlMessages id='common.contact.extraInfo' />}
                  name='extraInfo'
                  variant='outlined'
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                  }}
                />
              </Box> */}
              {/* <Typography
                component='h3'
                sx={{
                  fontSize: 16,
                  fontWeight: Fonts.BOLD,
                  mb: {xs: 3, lg: 5},
                }}
              >
                <IntlMessages id='common.promotionCode' />
              </Typography>
              <Box sx={{mb: {xs: 4, xl: 5}}}>
                <AppTextField
                  label={<IntlMessages id='common.code' />}
                  name='promotionCode'
                  variant='outlined'
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                  }}
                />
              </Box> */}
              <Typography
                component='h3'
                sx={{
                  fontSize: 16,
                  fontWeight: Fonts.BOLD,
                  mb: {xs: 3, lg: 5},
                }}
              >
                <IntlMessages id='common.necessity' />
              </Typography>

              <Box sx={{mb: {xs: 4, xl: 5}}}>
                <AppTextField
                  label={<IntlMessages id='common.business.necessity' />}
                  name='businessNecessity'
                  variant='outlined'
                  multiline
                  rows={4}
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                  }}
                />
              </Box>

              <div>
                <Button
                  variant='contained'
                  color='primary'
                  disabled={isSubmitting}
                  sx={{
                    minWidth: 160,
                    fontWeight: Fonts.REGULAR,
                    fontSize: 16,
                    textTransform: 'capitalize',
                    padding: '4px 16px 8px',
                  }}
                  type='submit'
                >
                  <IntlMessages id='common.signup' />
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Box>

      <Box
        sx={{
          color: 'grey.500',
          mb: {xs: 5, md: 7},
        }}
      >
        <span style={{marginRight: 4}}>
          <IntlMessages id='common.alreadyHaveAccount' />
        </span>
        <Box
          component='span'
          sx={{
            fontWeight: Fonts.MEDIUM,
            '& a': {
              color: (theme) => theme.palette.primary.main,
              textDecoration: 'none',
            },
          }}
        >
          <Link href='/signin'>
            <a>
              <IntlMessages id='common.signIn' />
            </a>
          </Link>
        </Box>
      </Box>

      {/* <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: (theme) => theme.palette.background.default,
          mx: {xs: -5, lg: -10},
          mb: {xs: -6, lg: -11},
          mt: 'auto',
          py: 2,
          px: {xs: 5, lg: 10},
        }}
      >
        <Box
          sx={{
            color: (theme) => theme.palette.text.secondary,
          }}
        >
          <IntlMessages id='auth.orSignupWith' />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <IconButton
            sx={{
              p: 2,
              '& svg': {fontSize: 18},
              color: (theme) => theme.palette.text.secondary,
            }}
            onClick={() => auth.federatedSignIn({provider: 'Google'})}
          >
            <AiOutlineGoogle />
          </IconButton>
          <IconButton
            sx={{
              p: 1.5,
              '& svg': {fontSize: 18},
              color: (theme) => theme.palette.text.secondary,
            }}
            onClick={() => auth.federatedSignIn({provider: 'Facebook'})}
          >
            <FaFacebookF />
          </IconButton>
        </Box>
      </Box> */}

      <AppInfoView />
    </Box>
  );
};

export default SignupAwsCognito;
