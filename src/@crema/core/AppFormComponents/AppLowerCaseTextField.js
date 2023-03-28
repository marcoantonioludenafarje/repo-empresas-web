import React from 'react';
import {useField} from 'formik';
import TextField from '@mui/material/TextField';

const AppLowerCaseTextField = (props) => {
  const [field, meta, helpers] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';

  const handleChange = (event) => {
    helpers.setValue(event.target.value.toLowerCase());
  };

  return (
    <TextField
      {...props}
      {...field}
      helperText={errorText}
      error={!!errorText}
      onChange={handleChange}
    />
  );
};

export default AppLowerCaseTextField;
