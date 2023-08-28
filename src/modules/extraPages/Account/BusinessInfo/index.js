import React, {useState, useEffect, useCallback, useRef} from 'react';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {Formik} from 'formik';
import * as yup from 'yup';
import BusinessInfoForm from './BusinessInfoForm';
import PropTypes from 'prop-types';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  CircularProgress,
} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {red} from '@mui/material/colors';
import {
  GET_PRESIGNED,
  GET_USER_DATA,
  FETCH_SUCCESS,
  FETCH_ERROR,
  UPDATE_DATA_BUSINESS,
} from '../../../../shared/constants/ActionTypes';
import {getUserData} from '../../../../redux/actions/User';
import {updateDataBusiness} from '../../../../redux/actions/General';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import Router, {useRouter} from 'next/router';
import update from 'pages/sample/carriers/update';
const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
const validationSchema = yup.object({
  companyName: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  documentNumber: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .integer(<IntlMessages id='validation.number.integer' />)
    .required(<IntlMessages id='validation.required' />),
  direction: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  passwordCertified: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
});
const BusinessInfo = () => {
  const {user} = useAuthUser();
  console.log('datos user', user);
  const dispatch = useDispatch();
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  const {generalSuccess} = useSelector(({general}) => general);
  console.log('generalSuccess', generalSuccess);
  const {generalError} = useSelector(({general}) => general);
  console.log('generalError', generalError);
  const {updateBusinessRes} = useSelector(({general}) => general);
  console.log('updateBusinessRes', updateBusinessRes);
  const [selectedJsonImages, setSelectedJsonImages] = React.useState(
    userDataRes ? [userDataRes.merchantSelected.logoImage] : [],
  );
  const [certified, setCertified] = React.useState(
    userDataRes ? userDataRes.merchantSelected.billingCertified : '',
  );
  console.log('userAttributes', userAttributes);
  const [docType, setDocType] = React.useState(
    userAttributes['custom:businessDocumentType'],
  );
  const [businessLine, setBusinessLine] = React.useState(
    userDataRes ? userDataRes.merchantSelected.businessLine : '',
  );
  const [principalClient, setPrincipalClient] = React.useState(
    userDataRes ? userDataRes.merchantSelected.typeClient : '',
  );
  const [ubigeo, setUbigeo] = React.useState(
    userDataRes ? userDataRes.merchantSelected.ubigeo : '',
  );
  const [passwordCertified, setPasswordCertified] = React.useState(
    userDataRes ? userDataRes.merchantSelected.passwordCertified : '',
  );

  const [open, setOpen] = React.useState(false);

  const toUpdateDataBusiness = (payload) => {
    dispatch(updateDataBusiness(payload));
  };
  useEffect(() => {
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
    dispatch({
      type: GET_PRESIGNED,
      payload: undefined,
    });
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
  }, []);

  const getDocumentType = (type, value) => {
    console.log('tipo desde index', value);
    if (type == 'documentType') {
      setDocType(value);
    } else if (type == 'businessLine') {
      setBusinessLine(value);
    } else if (type == 'principalClient') {
      setPrincipalClient(value);
    }
  };
  const getLogo = (value) => {
    console.log('logo desde index', value);
    setSelectedJsonImages(value);
  };
  const getUbigeo = (value) => {
    console.log('ubigeo desde index', value);
    setUbigeo(value);
  };
  const getCertified = (value) => {
    console.log('certified desde index', value);
    setCertified(value);
  };
  const handleClose = () => {
    setOpen(false);
    Router.push('/sample/home');
  };

  const showMessage = () => {
    console.log('que es updateBusinessRes', updateBusinessRes);
    if (
      generalSuccess !== undefined &&
      updateBusinessRes !== undefined &&
      !('error' in updateBusinessRes)
    ) {
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
    } else if (
      updateBusinessRes !== undefined &&
      (generalError !== undefined || 'error' in updateBusinessRes)
    ) {
      return (
        <>
          <CancelOutlinedIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            Se ha producido un error al registrar.
            <br /> Mensaje de negocio
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink />;
    }
  };
  return userDataRes ? (
    <Box
      sx={{
        position: 'relative',
        maxWidth: 550,
      }}
    >
      <Formik
        validateOnBlur={true}
        initialValues={{
          companyName: userDataRes.merchantSelected.denominationMerchant,
          documentNumber: userDataRes.merchantSelected.numberDocumentMerchant,
          direction: userDataRes.merchantSelected.addressMerchant,
          documentType:
            docType /* userAttributes['custom:businessDocumentType'] */,
          eMerchantSlugName: userDataRes.merchantSelected.ecommerceMerchantSlug,
          extraInformationForPdf: userDataRes.merchantSelected.extraInformationForPdf,
          principalClient: userDataRes.merchantSelected.typeClient,
          businessLine: userDataRes.merchantSelected.businessLine,
          facebook: userDataRes.merchantSelected.facebookUrl,
          instagram: userDataRes.merchantSelected.instagramUrl,
          twitter: userDataRes.merchantSelected.twitterUrl,
          youtube: userDataRes.merchantSelected.youtubeUrl,
          comercialName: userDataRes.merchantSelected.comercialName
            ? userDataRes.merchantSelected.comercialName
            : '',
          passwordCertified: userDataRes.merchantSelected.passwordCertified
            ? userDataRes.merchantSelected.passwordCertified
            : '',
        }}
        validationSchema={validationSchema}
        onSubmit={(data, {setSubmitting}) => {
          setSubmitting(true);
          console.log('payload actualizarInfo: ', {
            request: {
              payload: {
                merchantId: userDataRes.merchantSelected.merchantId,
                denominationMerchant: data.companyName,
                typeDocumentMerchant: docType,
                numberDocumentMerchant: data.documentNumber,
                addressMerchant: data.direction,
                ecommerceMerchantSlug: data.eMerchantSlugName,
                businessLine: businessLine,
                principalClient: principalClient,
                facebookUrl: data.facebook,
                twitterUrl: data.twitter,
                instagramUrl: data.instagram,
                youtubeUrl: data.youtube,
                extraInformationForPdf: data.extraInformationForPdf,
                logo: selectedJsonImages[0],
                comercialName: data.comercialName,
                digitalCertified: certified,
                ubigeo: ubigeo,
                passwordCertified: data.passwordCertified,
              },
            },
          });
          // TODO Api Call here to save user info
          dispatch({
            type: GET_PRESIGNED,
            payload: undefined,
          });
          toUpdateDataBusiness({
            request: {
              payload: {
                merchantId: userDataRes.merchantSelected.merchantId,
                denominationMerchant: data.companyName,
                typeDocumentMerchant: docType,
                numberDocumentMerchant: data.documentNumber,
                addressMerchant: data.direction,
                ecommerceMerchantSlug: data.eMerchantSlugName,
                extraInformationForPdf: data.extraInformationForPdf,
                principalClient: principalClient,
                businessLine: businessLine,
                facebookUrl: data.facebook,
                twitterUrl: data.twitter,
                instagramUrl: data.instagram,
                youtubeUrl: data.youtube,
                logo: selectedJsonImages[0],
                comercialName: data.comercialName,
                digitalCertified: certified,
                ubigeo: ubigeo,
                passwordCertified: data.passwordCertified,
              },
            },
          });
          setSubmitting(false);
          setOpen(true);
        }}
      >
        {({values, setFieldValue}) => {
          return (
            <BusinessInfoForm
              values={values}
              setFieldValue={setFieldValue}
              moveData={getDocumentType}
              moveLogo={getLogo}
              moveCertified={getCertified}
              logoImage={
                userDataRes.merchantSelected.logoImage
                  ? [userDataRes.merchantSelected.logoImage]
                  : []
              }
              billingCertified={
                userDataRes.merchantSelected.digitalCertified
                  ? userDataRes.merchantSelected.digitalCertified
                  : ''
              }
              isBilling={userDataRes.merchantSelected.isBillingEnabled}
              baseUbigeo={userDataRes.merchantSelected.ubigeo}
              moveUbigeo={getUbigeo}
            />
          );
        }}
      </Formik>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Actualización del Negocio'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          {showMessage()}
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={handleClose}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  ) : null;
};

export default BusinessInfo;

BusinessInfo.propTypes = {
  setFieldValue: PropTypes.func,
  values: PropTypes.string,
};
