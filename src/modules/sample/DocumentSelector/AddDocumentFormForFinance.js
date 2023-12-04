import React, {useEffect} from 'react';
import {makeStyles} from '@mui/styles';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import {
  Divider,
  Button,
  ButtonGroup,
  Select,
  TextField,
  AlertTitle,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Card,
  IconButton,
  Grid,
  FilledInput,
  Dialog,
  DialogActions,
  Stack,
  DialogContent,
  Collapse,
  Alert,
  DialogContentText,
  DialogTitle,
  useTheme,
  useMediaQuery,
  Snackbar
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import AppUpperCaseTextField from '../../../@crema/core/AppFormComponents/AppUpperCaseTextField';
import MuiAlert from '@mui/material/Alert';
const Alert2 = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;});
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';

import {useDispatch, useSelector} from 'react-redux';
import {DesktopDatePicker, DateTimePicker} from '@mui/lab';
import PropTypes from 'prop-types';
import {toSimpleDate} from '../../../Utils/utils';

const useStyles = makeStyles((theme) => ({
  fixPosition: {
    position: 'relative',
    bottom: '-8px',
  },
}));

const maxLength = 11111111111111111111; //20 caracteres
const validationSchema2 = yup.object({
  documentIntern: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />)
    .max(maxLength, <IntlMessages id='validation.maxLength' />),
});

const defaultValues = {
  documentIntern: '',
};

const formats = {
  quotation: '52',
  bill: 'FFF1-13',
  referralGuide: 'TTT1-18',
};

let selectedDocument = {};

const AddDocumentForm = ({sendData, acceptedType}, props) => {
  /* let objSelects = {
    billType: 'quotation',
  }; */
  const classes = useStyles(props);
  const dispatch = useDispatch();
  let changeValueField;
  console.log('funcion recibida', sendData);
  let typeAlert = 'faltaProduct';

  //FUNCIONES DIALOG
  const [open, setOpen] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [isRefGuide, setIsRefGuide] = React.useState(false);
  const [openAddedDocument, setOpenAddedDocument] = React.useState(false);
  const [billType, setBillType] = React.useState(
    !acceptedType ? 'creditNote' : acceptedType[0],
  );
  const [dateRegister, setDateRegister] = React.useState(Date.now());
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseAddedDocument = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAddedDocument(false);
  };


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  useEffect(() => {
    if (acceptedType) {
      setIsRefGuide(acceptedType.includes('referralGuide'));
    }
  }, []);

  const validationSchema = React.useMemo(
    () =>
      yup.object({
        documentIntern: yup
          .string()
          .typeError(<IntlMessages id='validation.string' />)
          .required(<IntlMessages id='validation.required' />)
          .max(maxLength, <IntlMessages id='validation.maxLength' />),
        totalAmount: yup
          .number()
          .typeError(<IntlMessages id='validation.number' />)
          .test(
            'maxDigitsAfterDecimal',
            'El número puede contener como máximo 3 decimales',
            (number) => /^\d+(\.\d{1,3})?$/.test(number),
          )
          .required(<IntlMessages id='validation.required' />),
        totalIgv: yup
          .number()
          .typeError(<IntlMessages id='validation.number' />)
          .test(
            'maxDigitsAfterDecimal',
            'El número puede contener como máximo 3 decimales',
            (number) => /^\d+(\.\d{1,3})?$/.test(number),
          )
          .required(<IntlMessages id='validation.required' />),
      }),
    [isRefGuide],
  );

  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    setShowAlert(false);
    console.log('data', data);
    sendData({
      serialDocument: data.documentIntern,
      totalIgv: Number(data.totalIgv),
      totalAmount: Number(data.totalAmount),
      typeDocument: billType,
      issueDate: toSimpleDate(dateRegister),
      isSelected: true,
    });
    setOpenAddedDocument(true);
    setSubmitting(false);
  };

  const handleBillType = (event) => {
    console.log('Valores de Tipo de factura', event);
    setBillType(event.target.value);
    setIsRefGuide(event.target.value == 'referralGuide');
  };

  return (
    <>
      <Formik
        validateOnChange={true}
        validationSchema={validationSchema}
        initialValues={{...defaultValues}}
        onSubmit={handleData}
      >
        {({isSubmitting, setFieldValue}) => {
          changeValueField = setFieldValue;
          return (
            <>
              <Form
                style={{textAlign: 'left', justifyContent: 'center'}}
                noValidate
                autoComplete='on'
              >
                <Grid
                  container
                  spacing={2}
                  sx={{margin: 'auto'}}
                  justifyContent='center'
                >
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel id='status-label' style={{fontWeight: 200}}>
                        Tipo de documento
                      </InputLabel>
                      <Select
                        name='billType'
                        labelId='billType-label'
                        label='Tipo de documento'
                        defaultValue={
                          !acceptedType ? 'creditNote' : acceptedType[0]
                        }
                        onChange={handleBillType}
                        /* value={moneyToConvert} */
                      >
                        {!acceptedType ||
                        acceptedType.includes('creditNote') ? (
                          <MenuItem
                            value='creditNote'
                            style={{fontWeight: 200}}
                          >
                            <IntlMessages id='document.type.creditNote' />
                          </MenuItem>
                        ) : null}
                        {!acceptedType || acceptedType.includes('debitNote') ? (
                          <MenuItem value='debitNote' style={{fontWeight: 200}}>
                            <IntlMessages id='document.type.debitNote' />
                          </MenuItem>
                        ) : null}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <AppUpperCaseTextField
                      label='Número de documento'
                      name='documentIntern'
                      variant='outlined'
                      placeholder={formats[billType]}
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: isMobile ? 0 : 2,
                        mx: 0,
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    sx={{
                      mb: isMobile ? 2 : 0,
                    }}
                  >
                    <DesktopDatePicker
                      renderInput={(params) => (
                        <TextField
                          className={classes.fixPosition}
                          {...params}
                        />
                      )}
                      required
                      value={dateRegister}
                      label='Fecha documento'
                      inputFormat='dd/MM/yyyy'
                      name='initialDate'
                      onChange={(newValue) => {
                        setDateRegister(newValue);
                        console.log('date', newValue);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <AppTextField
                      label='Total IGV'
                      name='totalIgv'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: isMobile ? 0 : 2,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <AppTextField
                      label='Monto Total'
                      name='totalAmount'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: isMobile ? 0 : 2,
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      color='primary'
                      type='submit'
                      variant='contained'
                      size='large'
                      sx={{my: '12px', width: 1}}
                      disabled={isSubmitting}
                      endIcon={<AddCircleOutlineIcon />}
                    >
                      Añadir
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            </>
          );
        }}
      </Formik>
      <Snackbar
        open={openAddedDocument}
        autoHideDuration={4000}
        onClose={handleCloseAddedDocument}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
      >
        <Alert2>Producto añadido correctamente!</Alert2>
      </Snackbar>
      <Collapse in={showAlert}>
        <Alert
          severity='error'
          action={
            <IconButton
              aria-label='close'
              color='inherit'
              size='small'
              onClick={() => {
                setShowAlert(false);
              }}
            >
              <CloseIcon fontSize='inherit' />
            </IconButton>
          }
          sx={{mb: 2}}
        >
          {typeAlert == 'maxCount' ? (
            'Por favor selecciona una cantidad menor al stock existente.'
          ) : (
            <></>
          )}
          {typeAlert == 'faltaProduct' ? (
            'Por favor selecciona un producto.'
          ) : (
            <></>
          )}
        </Alert>
      </Collapse>
    </>
  );
};

AddDocumentForm.propTypes = {
  sendData: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  acceptedType: PropTypes.array,
};

export default AddDocumentForm;
