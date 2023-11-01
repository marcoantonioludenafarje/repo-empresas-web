import {
    TextField,
    Button,
    Stack,
} from '@mui/material';
import React, {useEffect, useRef} from 'react';

import {DesktopDatePicker} from '@mui/lab';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import {
    convertToDateWithoutTime,
} from '../../../Utils/utils'
const validationSchema = yup.object({
    //reason: yup.string().typeError(<IntlMessages id='validation.string' />),
});
const defaultValues = {
    //reason: '',
};

const TransactionRegisterForm = ({ sendData }) => {
    const sendReason = (data, { setSubmitting }) => {
        setSubmitting(true);
        sendData(convertToDateWithoutTime(proofTransactionDate));
        setSubmitting(false);
    };
    const [proofTransactionDate, setProofTransactionDate] = React.useState(
        Date.now()
      );
    return (
        <Formik
            validateOnChange={true}
            validationSchema={validationSchema}
            initialValues={{ ...defaultValues }}
            onSubmit={sendReason}
        >
            {({ isSubmitting }) => {
                return (
                    <>
                        <Form
                            style={{ textAlign: 'left', justifyContent: 'center' }}
                            noValidate
                            autoComplete='on'
                        >
                            <Stack sx={{ m: 2 }} direction='row' spacing={2}>
                                <DesktopDatePicker
                                    renderInput={(params) => (
                                        <TextField
                                            sx={{
                                                my: 2,
                                                width: '100%',
                                                position: 'relative',
                                                bottom: '-8px',
                                            }}
                                            {...params}
                                        />
                                    )}
                                    required
                                    sx={{ my: 2 }}
                                    value={proofTransactionDate}
                                    label="Fecha de pago del movimiento"
                                    inputFormat='dd/MM/yyyy'
                                    name='proofTransactionDate'
                                    onChange={(newValue) => {
                                        setProofTransactionDate(newValue);
                                        console.log('proofTransactionDate', newValue);
                                    }}
                                />
                                <Button
                                    color='primary'
                                    type='submit'
                                    variant='contained'
                                    size='small'
                                    sx={{ height: 50, top: '8px' }}
                                    disabled={isSubmitting}
                                >
                                    Finalizar
                                </Button>
                            </Stack>
                        </Form>
                    </>
                );
            }}
        </Formik>
    );
};

TransactionRegisterForm.propTypes = {
    sendData: PropTypes.func.isRequired,
};

export default TransactionRegisterForm;
