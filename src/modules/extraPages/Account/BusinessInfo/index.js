import React from 'react';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {Formik} from 'formik';
import * as yup from 'yup';
import BusinessInfoForm from './BusinessInfoForm';
import PropTypes from 'prop-types';
import {Box} from '@mui/material';
import {useSelector} from 'react-redux';
import IntlMessages from '../../../../@crema/utility/IntlMessages';

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
});
const BusinessInfo = () => {
  const {user} = useAuthUser();
  console.log('datos user', user);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  console.log('userAttributes', userAttributes);
  const [docType, setDocType] = React.useState(
    userAttributes['custom:businessDocumentType'],
  );

  const initialValues = {
    companyName: userAttributes['custom:businessSocialReason'],
    documentNumber: userAttributes['custom:businessDocumentNum'],
    direction: userAttributes['custom:businessDirection'],
    documentType: docType /* userAttributes['custom:businessDocumentType'] */,
    eMerchantSlugName: userDataRes.merchantSelected.ecommerceMerchantSlug
  };

  const getDocumentType = (value) => {
    console.log('tipo desde index', value);
    setDocType(value);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        maxWidth: 550,
      }}
    >
      <Formik
        validateOnBlur={true}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(data, {setSubmitting}) => {
          setSubmitting(true);
          console.log('data: ', {...data, documentType: docType});
          // TODO Api Call here to save user info
          setSubmitting(false);
        }}
      >
        {({values, setFieldValue}) => {
          return (
            <BusinessInfoForm
              values={values}
              setFieldValue={setFieldValue}
              moveData={getDocumentType}
            />
          );
        }}
      </Formik>
    </Box>
  );
};

export default BusinessInfo;

BusinessInfo.propTypes = {
  setFieldValue: PropTypes.func,
  values: PropTypes.string,
};
