import {Button, Stack} from '@mui/material';

import IntlMessages from '../../../@crema/utility/IntlMessages';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import PropTypes from 'prop-types';

const validationSchema = yup.object({
  reason: yup.string().typeError(<IntlMessages id='validation.string' />),
});
const defaultValues = {
  reason: '',
};

const AddReasonForm = ({sendData}) => {
  const sendReason = (data, {setSubmitting}) => {
    setSubmitting(true);
    sendData(data.reason);
    setSubmitting(false);
  };

  return (
    <Formik
      validateOnChange={true}
      validationSchema={validationSchema}
      initialValues={{...defaultValues}}
      onSubmit={sendReason}
    >
      {({isSubmitting}) => {
        return (
          <>
            <Form
              style={{textAlign: 'left', justifyContent: 'center'}}
              noValidate
              autoComplete='on'
            >
              <Stack sx={{m: 2}} direction='row' spacing={2}>
                <AppTextField
                  label='Razón'
                  name='reason'
                  htmlFor='filled-adornment-password'
                  variant='outlined'
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                    my: 2,
                  }}
                />
                <Button
                  color='primary'
                  type='submit'
                  variant='contained'
                  size='small'
                  sx={{height: 50, top: '8px'}}
                  disabled={isSubmitting}
                >
                  Anular
                </Button>
              </Stack>
            </Form>
          </>
        );
      }}
    </Formik>
  );
};

AddReasonForm.propTypes = {
  sendData: PropTypes.func.isRequired,
};

export default AddReasonForm;
