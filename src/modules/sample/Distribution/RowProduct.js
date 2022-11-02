import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ButtonGroup,
  Button,
  IconButton,
  MenuItem,
  Menu,
  MenuList,
  ClickAwayListener,
  Popper,
  Grow,
  Stack,
  TextField,
  Card,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Collapse,
  Typography,
  Divider,
  Grid,
} from '@mui/material';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppPageMeta from '../../../@crema/core/AppPageMeta';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import TransformIcon from '@mui/icons-material/Transform';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PropTypes from 'prop-types';

import {Form, Formik} from 'formik';
import * as yup from 'yup';

const RowProduct = ({key}) => {
  const validationSchema = yup.object({
    count: yup
      .number()
      .typeError(<IntlMessages id='validation.number' />)
      .integer(<IntlMessages id='validation.number.integer' />)
      .required(<IntlMessages id='validation.required' />),
  });

  const defaultValues = {
    count: 0,
  };

  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    console.log('data', data);
    setSubmitting(false);
  };

  return (
    <Formik
      validateOnChange={true}
      validationSchema={validationSchema}
      initialValues={{...defaultValues}}
      onSubmit={handleData}
    >
      {({isSubmitting}) => {
        return (
          <Form
            style={{textAlign: 'left', justifyContent: 'center'}}
            noValidate
            autoComplete='on'
          >
            <TableRow
              sx={{
                '&:last-child td, &:last-child th': {border: 0},
              }}
            >
              <TableCell>
                <Button
                  variant='text'
                  href='#contained-buttons'
                  sx={{color: 'black', fontWeight: '400'}}
                >
                  <IntlMessages id='sidebar.ecommerce.selectProduct' />
                </Button>
              </TableCell>
              <TableCell>
                <AppTextField
                  label={<IntlMessages id='common.amount' />}
                  name='count'
                  variant='outlined'
                  sx={{
                    width: '100%',
                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },
                  }}
                />
              </TableCell>
              <TableCell align='center'>
                <IconButton aria-label='delete'>
                  <TransformIcon />
                </IconButton>
              </TableCell>
              <TableCell align='center'>
                <IconButton
                  onClick={() => setDataProducts(dataProducts.splice(index, 1))}
                  aria-label='delete'
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </Form>
        );
      }}
    </Formik>
  );
};

export default RowProduct;

RowProduct.propTypes = {
  key: PropTypes.number,
};
