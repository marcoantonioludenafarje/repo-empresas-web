import React from 'react';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import {
  Divider,
  Button,
  ButtonGroup,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Grid,
  Typography,
} from '@mui/material';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import AppUpperCaseTextField from '../../../@crema/core/AppFormComponents/AppUpperCaseTextField';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import PropTypes from 'prop-types';

const validationSchema = yup.object({
  nroDoc: yup.string().typeError(<IntlMessages id='validation.string' />),
  nroIdentifier: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
});

const defaultValues = {
  nroDoc: '',
  nroIdentifier: '',
  searchByDenominationProvider: '',
};

const formats = {
  quotation: '52',
  bill: 'FFF1-13',
  referralGuide: 'TTT1-18',
  credit_Note: 'FFF1-21',
  debit_Note: 'FFF1-16',
  receipt: 'BBB1-2',
  anyone: '',
  sellticket: '12',
};
const typeDocs = [
  {name: 'quotation', message: <IntlMessages id='document.type.quotation' />},
  {name: 'bill', message: <IntlMessages id='document.type.bill' />},
  {
    name: 'referralGuide',
    message: <IntlMessages id='document.type.referralGuide' />,
  },
  {name: 'credit_Note', message: <IntlMessages id='document.type.creditNote' />},
  {name: 'debit_Note', message: <IntlMessages id='document.type.debitNote' />},
  {name: 'receipt', message: <IntlMessages id='document.type.receipt' />},
  {name: 'anyone', message: <IntlMessages id='document.type.anyone' />},
  {name: 'sellticket', message: <IntlMessages id='document.type.sellticket' />},
];

const MoreFiltersDocumentSunat = ({sendData, ds}) => {
  console.log('info inicial', ds);
  const [typeDocument, setTypeDocument] = React.useState(ds);
  const [docType, setDocType] = React.useState(ds);
  const [typeIdentifier, setTypeIdentifier] = React.useState('TODOS');

  let changeValueField;
  const isNoteDocument = ( ds=='credit_Note' || ds=='debit_Note' ? true : false );

  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    let filters = {
      ...data,
      typeDocument: typeDocument,
      typeIdentifier: typeIdentifier,
    };
    console.log('info desde + filtros', filters);
    sendData(filters);
    setSubmitting(false);
  };

  return (
    <Formik
      validateOnChange={true}
      validationSchema={validationSchema}
      initialValues={{...defaultValues}}
      onSubmit={handleData}
    >
      {({isSubmitting, setFieldValue}) => {
        changeValueField = setFieldValue;
        return (
          <Form
            style={{textAlign: 'left', justifyContent: 'center'}}
            noValidate
            autoComplete='on'
          >
            <Grid
              container
              spacing={2}
              sx={{maxWidth: 500, width: 'auto', margin: 'auto'}}
            >
              <Grid item xs={6}></Grid>
              <Grid item xs={6}>
                <Typography sx={{color: 'aaa'}}>
                  Formato de documento: {formats[docType]}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth sx={{my: 0}}>
                  <InputLabel id='moneda-label' style={{fontWeight: 200}}>
                    Tipo de documento Sunat
                  </InputLabel>

                  {!isNoteDocument ?  (
                    <Select
                      name='documentType'
                      labelId='documentType-label'
                      label='Tipo de documento Sunat'
                      value={typeDocument}
                      disabled
                    >  
                      <MenuItem value='bill' style={{fontWeight: 200}}>
                        <IntlMessages id='document.type.bill' />
                      </MenuItem>
                      <MenuItem value='receipt' style={{fontWeight: 200}}>
                        <IntlMessages id='document.type.receipt' />
                      </MenuItem>
                      <MenuItem value='sellticket' style={{fontWeight: 200}}>
                        <IntlMessages id='document.type.sellticket' />
                      </MenuItem>
                      <MenuItem value='referralGuide' style={{fontWeight: 200}}>
                        <IntlMessages id='document.type.referralGuide' />
                      </MenuItem>
                      <MenuItem value='credit_Note' style={{fontWeight: 200}}>
                        <IntlMessages id='document.type.creditNote' />
                      </MenuItem>
                      <MenuItem value='debit_Note' style={{fontWeight: 200}}>
                        <IntlMessages id='document.type.debitNote' />
                      </MenuItem>
                    </Select>
                 ) : 
                  <Select
                     name='documentType'
                     labelId='documentType-label'
                     label='Tipo de documento Sunat'
                     value={typeDocument}
                     onChange={(event) => {
                       console.log('event.target.value', event.target.value);
                       setDocType(event.target.value);
                       setTypeDocument(event.target.value);
                     }}
                   > 
                     <MenuItem value='credit_Note' style={{fontWeight: 200}}>
                       <IntlMessages id='document.type.creditNote' />
                     </MenuItem>
                     <MenuItem value='debi_N_ote' style={{fontWeight: 200}}>
                       <IntlMessages id='document.type.debitNote' />
                     </MenuItem>
                   </Select>
                 }
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <AppUpperCaseTextField
                  label={`Número de documento`}
                  name='nroDoc'
                  variant='outlined'
                  placeholder={formats[docType]}
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                    my: 0,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth sx={{my: 2}}>
                  <InputLabel id='categoria-label' style={{fontWeight: 200}}>
                    Identificador
                  </InputLabel>
                  <Select
                    defaultValue='TODOS'
                    name='typeDocumentProvider'
                    labelId='identifierType-label'
                    label='Identificador'
                    onChange={(event) => {
                      console.log('event.target.value', event.target.value);
                      setTypeIdentifier(event.target.value);
                    }}
                    value={typeIdentifier}
                  >
                    <MenuItem value='TODOS' style={{fontWeight: 200}}>
                      TODOS
                    </MenuItem>
                    <MenuItem value='RUC' style={{fontWeight: 200}}>
                      RUC
                    </MenuItem>
                    <MenuItem value='DNI' style={{fontWeight: 200}}>
                      DNI
                    </MenuItem>
                    <MenuItem value='foreignerscard' style={{fontWeight: 200}}>
                      CE
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <AppTextField
                  label={`Número Identificador`}
                  name='nroIdentifier'
                  variant='outlined'
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                    my: 2,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <AppUpperCaseTextField
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                    my: 2,
                  }}
                  label={`Nombre / Razón social`}
                  variant='outlined'
                  name='searchByDenominationProvider'
                  size='small'
                />
              </Grid>
            </Grid>

            <ButtonGroup
              orientation='vertical'
              variant='outlined'
              sx={{width: 1, my: '10px'}}
              aria-label='outlined button group'
            >
              <Button
                color='primary'
                sx={{mx: 'auto', width: '50%', py: 3}}
                type='submit'
                variant='contained'
                disabled={isSubmitting}
                startIcon={<FilterAltIcon />}
              >
                Filtrar
              </Button>
            </ButtonGroup>
          </Form>
        );
      }}
    </Formik>
  );
};

MoreFiltersDocumentSunat.propTypes = {
  sendData: PropTypes.func.isRequired,
};

export default MoreFiltersDocumentSunat;
