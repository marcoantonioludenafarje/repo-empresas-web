import React from 'react';
import {alpha, Box, Button, Typography} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import AppGridContainer from '../../../../@crema/core/AppGridContainer';
import Grid from '@mui/material/Grid';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {
  CustomizerItemWrapper,
  StyledToggleButton,
} from '../../../../@crema/core/AppThemeSetting/index.style';

import clsx from 'clsx';
import {FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {useDropzone} from 'react-dropzone';
import {Form} from 'formik';
import PropTypes from 'prop-types';
import AppTextField from '../../../../@crema/core/AppFormComponents/AppTextField';
import EditIcon from '@mui/icons-material/Edit';
import {styled} from '@mui/material/styles';
import {Fonts} from '../../../../shared/constants/AppEnums';

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

const BusinessInfoForm = ({values, setFieldValue, moveData}) => {
  console.log('valores', values);
  const [typeDocument, setTypeDocument] = React.useState(values.documentType);

  console.log('Valores', values);
  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setFieldValue('photoURL', URL.createObjectURL(acceptedFiles[0]));
    },
  });

  const handleField = (event) => {
    console.log('evento', event);
    console.log('valor', event.target.value);
    if (event.target.name == 'documentType') {
      setTypeDocument(event.target.value);
    }
    moveData(event.target.value);
  };

  return (
    <Form noValidate autoComplete='off'>
      <Typography
        component='h3'
        sx={{
          fontSize: 16,
          fontWeight: Fonts.BOLD,
          mb: {xs: 3, lg: 4},
        }}
      >
        <IntlMessages id='common.businessInfo' />
      </Typography>

      <AppGridContainer spacing={4}>
        <Grid item xs={12} md={12}>
          <AppTextField
            name='companyName'
            fullWidth
            label={<IntlMessages id='common.companyName' />}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth sx={{my: 2}}>
            <InputLabel id='documentType-label' style={{fontWeight: 200}}>
              <IntlMessages id='common.busines.documentType' />
            </InputLabel>
            <Select
              name='documentType'
              labelId='documentType-label'
              label={<IntlMessages id='common.busines.documentType' />}
              displayEmpty
              onChange={handleField}
              value={typeDocument}
            >
              <MenuItem value='RUC' style={{fontWeight: 200}}>
                RUC
              </MenuItem>
              <MenuItem value='DNI' style={{fontWeight: 200}}>
                DNI
              </MenuItem>
              <MenuItem value='CE' style={{fontWeight: 200}}>
                CE
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={12}>
          <AppTextField
            name='documentNumber'
            disabled
            fullWidth
            label={<IntlMessages id='common.busines.documentNumber' />}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <AppTextField
            name='direction'
            fullWidth
            label={<IntlMessages id='common.busines.direction' />}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <AppTextField
            name='eMerchantSlugName'
            disabled
            fullWidth
            label={<IntlMessages id='common.slug' />}
          />
        </Grid>
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
  );
};

export default BusinessInfoForm;
BusinessInfoForm.propTypes = {
  setFieldValue: PropTypes.func,
  moveData: PropTypes.func,
  values: PropTypes.object,
};
