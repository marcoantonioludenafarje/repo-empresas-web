import React from 'react';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {Formik} from 'formik';
import * as yup from 'yup';
import UpgradeBusinessForm from './UpgradeBusinessForm';
import {blue, green, red} from '@mui/material/colors';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  GET_DATA_BUSINESS,
  UPGRADE_TO_NEW_PLAN,
} from '../../../../shared/constants/ActionTypes';
import {
  getDataBusiness,
  onGetBusinessParameter,
  upgradeToNewPlan,
} from '../../../../redux/actions/General';
const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
const validationSchema = yup.object({
  serieDocumenteBilling: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
  serieBackDocumenteBilling: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
  serieDocumenteReceipt: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
  serieBackDocumenteReceipt: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
  serieDocumenteReferralGuide: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
  serieBackDocumenteReferralGuide: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
});
const UpgradeBusiness = () => {
  const [openStatus, setOpenStatus] = React.useState(false);
  const {user} = useAuthUser();
  console.log('datos user', user);
  const {userAttributes} = useSelector(({user}) => user);
  console.log('userAttributes', userAttributes);
  const {upgradeToNewPlanRes} = useSelector(({general}) => general);
  console.log('registerUserRes', upgradeToNewPlanRes);
  const {successMessage} = useSelector(({user}) => user);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({user}) => user);
  console.log('errorMessage', errorMessage);
  const [docType, setDocType] = React.useState(
    userAttributes['custom:businessDocumentType'],
  );

  const toUpgradeToNewPlan = (payload) => {
    dispatch(upgradeToNewPlan(payload));
  };

  const getDocumentType = (value) => {
    console.log('tipo desde index', value);
    setDocType(value);
  };

  const dispatch = useDispatch();

  const {dataBusinessRes} = useSelector(({general}) => general);
  console.log('dataBusinessRes', dataBusinessRes);
  const {userDataRes} = useSelector(({user}) => user);
  console.log('userDataRes', userDataRes);
  const initialValues = {
    planDesired: userDataRes.merchantSelected.planDesired,
    planDesiredId: userDataRes.merchantSelected.planDesiredId,
    documentType: docType /* userAttributes['custom:businessDocumentType'] */,
    serieDocumenteBilling: '',
    serieBackDocumenteBilling: '',
    serieDocumenteReceipt: '',
    serieBackDocumenteReceipt: '',
    serieDocumenteReferralGuide: '',
    serieBackDocumenteReferralGuide: '',
  };
  const registerSuccess = () => {
    return (
      successMessage != undefined &&
      upgradeToNewPlanRes != undefined &&
      !('error' in upgradeToNewPlanRes)
    );
  };

  const registerError = () => {
    return (
      (upgradeToNewPlanRes && successMessage != undefined) ||
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
              Se ha dado de alta, cierre sesión <br />y vuelva a ingresar.
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
              Se ha producido un error al dar de alta. <br />
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
  return (
    <Box
      sx={{
        position: 'relative',
        maxWidth: 550,
      }}
    >
      <Formik
        validateOnChange={false}
        validateOnBlur={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(data, {setSubmitting}) => {
          setSubmitting(true);
          console.log('data: ', {...data, documentType: docType});
          // TODO Api Call here to save user info
          dispatch({type: FETCH_SUCCESS, payload: undefined});
          dispatch({type: FETCH_ERROR, payload: undefined});
          dispatch({type: UPGRADE_TO_NEW_PLAN, payload: undefined});
          toUpgradeToNewPlan({
            request: {
              payload: {
                merchantId: userDataRes.merchantSelected.merchantId,
                planDesiredId: userDataRes.merchantSelected.planDesiredId,
                promotionCodeId: userDataRes.merchantSelected.promotionCodeId,
                serieDocumenteBilling: data.serieDocumenteBilling,
                serieBackDocumenteBilling: data.serieBackDocumenteBilling,
                serieDocumenteReceipt: data.serieDocumenteReceipt,
                serieBackDocumenteReceipt: data.serieBackDocumenteReceipt,
                serieDocumenteReferralGuide: data.serieDocumenteReferralGuide,
                serieBackDocumenteReferralGuide:
                  data.serieBackDocumenteReferralGuide,
                merchantMasterId: userDataRes.merchantMasterId,
              },
            },
          });
          setOpenStatus(true);
          setSubmitting(false);
        }}
      >
        {({values, setFieldValue}) => {
          return (
            <UpgradeBusinessForm
              values={values}
              setFieldValue={setFieldValue}
              moveData={getDocumentType}
            />
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
          {'Alta de facturación'}
        </DialogTitle>
        {showMessage()}
      </Dialog>
    </Box>
  );
};

export default UpgradeBusiness;

UpgradeBusiness.propTypes = {
  setFieldValue: PropTypes.func,
  values: PropTypes.string,
};
