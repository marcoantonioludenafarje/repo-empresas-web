import React, {useEffect} from 'react';
import {
  alpha,
  Box,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {blue, green, red} from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import AppGridContainer from '../../../../@crema/core/AppGridContainer';
import {useDispatch, useSelector} from 'react-redux';
import Grid from '@mui/material/Grid';
import {FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {useDropzone} from 'react-dropzone';
import {Form} from 'formik';
import PropTypes from 'prop-types';
import AppTextField from '../../../../@crema/core/AppFormComponents/AppTextField';
import EditIcon from '@mui/icons-material/Edit';
import {styled} from '@mui/material/styles';
import {Fonts} from '../../../../shared/constants/AppEnums';
import {onGetBusinessPlan} from '../../../../redux/actions/General';
import {
  FETCH_ERROR,
  FETCH_SUCCESS,
  GET_BUSINESS_PLAN,
} from '../../../../shared/constants/ActionTypes';
const AvatarViewWrapper = styled('div')(({theme}) => {
  return {
    position: 'relative',
    cursor: 'pointer',
    '& .edit-icon': {
      position: 'absolute',
      bottom: 0,
      right: 0,
      zIndex: 1,
      border: `solid 2px ${theme.palette.background.paper}`,
      backgroundColor: alpha(theme.palette.primary.main, 0.7),
      color: theme.palette.primary.contrastText,
      borderRadius: '50%',
      width: 26,
      height: 26,
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.4s ease',
      cursor: 'pointer',
      '& .MuiSvgIcon-root': {
        fontSize: 16,
      },
    },
    '&.dropzone': {
      outline: 0,
      '&:hover .edit-icon, &:focus .edit-icon': {
        display: 'flex',
      },
    },
  };
});

const UpgradeBusinessForm = ({values, setFieldValue, moveData}) => {
  console.log('valores', values);
  const dispatch = useDispatch();
  const [typeDocument, setTypeDocument] = React.useState(values.documentType);
  const {getBusinessPlanRes} = useSelector(({general}) => general);
  console.log('getBusinessPlanRes', getBusinessPlanRes);
  const {userDataRes} = useSelector(({user}) => user);
  console.log('userDataRes', userDataRes);
  console.log('Valores', values);
  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setFieldValue('photoURL', URL.createObjectURL(acceptedFiles[0]));
    },
  });

  useEffect(() => {
    if (!getBusinessPlanRes) {
      console.log('Plan de negocio');

      const toGetBusinessPlan = (payload) => {
        dispatch(onGetBusinessPlan(payload));
      };
      let getBusinessPlanPayload = {
        request: {
          payload: {
            subscriptionPlanId: userDataRes.merchantSelected.planDesiredId,
          },
        },
      };

      toGetBusinessPlan(getBusinessPlanPayload);
    }
  }, []);

  const handleField = (event) => {
    console.log('evento', event);
    console.log('valor', event.target.value);
    setTypeDocument(event.target.value);
    moveData(event.target.value);
  };

  return getBusinessPlanRes ? (
    <>
      <Form noValidate autoComplete='off'>
        <Typography
          component='h3'
          sx={{
            fontSize: 16,
            fontWeight: Fonts.BOLD,
            mb: {xs: 3, lg: 4},
          }}
        >
          <IntlMessages id='userProfile.upgradeBusiness' />
        </Typography>
        <AppGridContainer spacing={4}>
          <Grid item xs={12} md={12}>
            <FormControlLabel
              control={<Checkbox />}
              label='Declaro bajo mi responsabilidad haber dado de alta y mantenerme activo en la SUNAT para efectos de la generación de facturación electrónica'
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography
              component='h3'
              sx={{
                fontSize: 16,
              }}
            >
              <IntlMessages id='userProfile.planDesired' />
            </Typography>
          </Grid>
          <Grid item xs={3} md={3}>
            <AppTextField
              name='planDesired'
              disabled
              fullWidth
              label={getBusinessPlanRes[0].description}
            />
          </Grid>
          {getBusinessPlanRes &&
          !getBusinessPlanRes[0].modules
            .find((module) => module?.moduleName === 'Ecommerce') ? (
            <></>
          ) : (
            <>
              <Grid item xs={6} md={6}>
                <Typography
                  component='h3'
                  sx={{
                    fontSize: 16,
                  }}
                >
                  <IntlMessages id='common.eMerchantSlugName' />
                </Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <AppTextField
                  name='eMerchantSlugName'
                  fullWidth
                  label={<IntlMessages id='common.slug' />}
                />
              </Grid>
            </>
          )}
          {getBusinessPlanRes &&
          !getBusinessPlanRes[0].modules
            .find((module) => module?.moduleName === 'Finance')
            .submodule.find(
              (subModule) => subModule?.submoduleId === 'BILLS',
            ) ? (
            <></>
          ) : (
            <>
              <Grid item xs={6} md={6}>
                <Typography
                  component='h3'
                  sx={{
                    fontSize: 16,
                  }}
                >
                  <IntlMessages id='common.eBilling' />
                </Typography>
              </Grid>
              <Grid item xs={3} md={3}>
                <AppTextField
                  name='serieDocumenteBilling'
                  fullWidth
                  label={<IntlMessages id='common.serieDocument' />}
                />
              </Grid>
              <Grid item xs={3} md={3}>
                <AppTextField
                  name='serieBackDocumenteBilling'
                  fullWidth
                  label={<IntlMessages id='common.serieBackDocument' />}
                />
              </Grid>
            </>
          )}
          {getBusinessPlanRes &&
          !getBusinessPlanRes[0].modules
            .find((module) => module?.moduleName === 'Finance')
            .submodule.find(
              (subModule) => subModule?.submoduleId === 'RECEIPTS',
            ) ? (
            <></>
          ) : (
            <>
              <Grid item xs={6} md={6}>
                <Typography
                  component='h3'
                  sx={{
                    fontSize: 16,
                  }}
                >
                  <IntlMessages id='common.eReceipt' />
                </Typography>
              </Grid>
              <Grid item xs={3} md={3}>
                <AppTextField
                  name='serieDocumenteReceipt'
                  fullWidth
                  label={<IntlMessages id='common.serieDocument' />}
                />
              </Grid>
              <Grid item xs={3} md={3}>
                <AppTextField
                  name='serieBackDocumenteReceipt'
                  fullWidth
                  label={<IntlMessages id='common.serieBackDocument' />}
                />
              </Grid>
            </>
          )}

          {getBusinessPlanRes &&
          !getBusinessPlanRes[0].modules
            .find((module) => module?.moduleName === 'Finance')
            .submodule.find(
              (subModule) => subModule?.submoduleId === 'REFERRAL GUIDES',
            ) ? (
            <></>
          ) : (
            <>
              <Grid item xs={6} md={6}>
                <Typography
                  component='h3'
                  sx={{
                    fontSize: 16,
                  }}
                >
                  <IntlMessages id='common.eReferralGuide' />
                </Typography>
              </Grid>
              <Grid item xs={3} md={3}>
                <AppTextField
                  name='serieDocumenteReferralGuide'
                  fullWidth
                  label={<IntlMessages id='common.serieDocument' />}
                />
              </Grid>
              <Grid item xs={3} md={3}>
                <AppTextField
                  name='serieBackDocumenteReferralGuide'
                  fullWidth
                  label={<IntlMessages id='common.serieBackDocument' />}
                />
              </Grid>
            </>
          )}

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
                <IntlMessages id='common.saveChanges' />
              </Button>
              <Button
                sx={{
                  position: 'relative',
                  minWidth: 100,
                  ml: 2.5,
                }}
                color='primary'
                variant='outlined'
                type='cancel'
              >
                <IntlMessages id='common.cancel' />
              </Button>
            </Box>
          </Grid>
        </AppGridContainer>
      </Form>
    </>
  ) : (
    <></>
  );
};

export default UpgradeBusinessForm;
UpgradeBusinessForm.propTypes = {
  setFieldValue: PropTypes.func,
  moveData: PropTypes.func,
  values: PropTypes.object,
};
