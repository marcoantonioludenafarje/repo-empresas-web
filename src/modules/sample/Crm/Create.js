import React, {useEffect, useState} from 'react';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import {
  Card,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Divider,
  Typography,
  IconButton,
  TextField,
} from '@mui/material';

import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import {red} from '@mui/material/colors';
import {orange} from '@mui/material/colors';
import SchoolIcon from '@mui/icons-material/School';
import YouTubeIcon from '@mui/icons-material/YouTube';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import AppLowerCaseTextField from '../../../@crema/core/AppFormComponents/AppLowerCaseTextField';
import AppUpperCaseTextField from '../../../@crema/core/AppFormComponents/AppUpperCaseTextField';
import {makeStyles} from '@mui/styles';
import {DesktopDatePicker, DateTimePicker} from '@mui/lab';
import Router, {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {newClient} from '../../../redux/actions/Clients';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
} from '../../../shared/constants/ActionTypes';
import {getUserData} from '../../../redux/actions/User';

const validationSchema = yup.object({
  campaignName: yup.string().required('El nombre de la campaña es obligatorio'),
  date: yup.date().required('La fecha es obligatoria'),
  campaignContent: yup
    .string()
    .required('El contenido de la campaña es obligatorio'),
  campaignImages: yup.array().of(yup.mixed()).nullable(),
});

const defaultValues = {
  campaignName: '',
  date: new Date(),
  campaignContent: '',
  campaignImages: null,
};

const useStyles = makeStyles((theme) => ({
  fixPosition: {
    position: 'relative',
    bottom: '-8px',
  },
}));

const Create = (props) => {
  const [open, setOpen] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  const classes = useStyles(props);

  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);

    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      // Show success message
      setOpenStatus(true);

      // Reset form
      setSubmitting(false);
    }, 2000);
  };

  const showMessage = () => {
    if (loading) {
      return <CircularProgress disableShrink />;
    } else {
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
            La campaña ha sido creada exitosamente.
          </DialogContentText>
        </>
      );
    }
  };

  const sendStatus = () => {
    setOpenStatus(false);
    Router.push('/sample/clients/table');
  };

  const handleCancel = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleImageChange = (event, setFieldValue) => {
    const files = Array.from(event.target.files);
    setFieldValue('campaignImages', files);

    const imagePreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(imagePreviews);
  };

  const removeImagePreview = (index, setFieldValue) => {
    const updatedImages = [...previewImages];
    updatedImages.splice(index, 1);
    setPreviewImages(updatedImages);

    const updatedFiles = previewImages.map((image) => {
      const file = imageToBlob(image);
      return file;
    });
    setFieldValue('campaignImages', updatedFiles);
  };

  const imageToBlob = (imageUrl) => {
    return fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => new File([blob], 'image.jpg', {type: 'image/jpeg'}));
  };

  return (
    <Card sx={{p: 4}}>
      <Box sx={{width: 1, textAlign: 'center'}}>
        <Typography
          sx={{mx: 'auto', my: '10px', fontWeight: 600, fontSize: 25}}
        >
          Crear Campaña
        </Typography>
      </Box>
      <Divider sx={{mt: 2, mb: 4}} />
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          mb: 5,
          mx: 'auto',
        }}
      >
        <Formik
          validateOnChange={true}
          validationSchema={validationSchema}
          initialValues={defaultValues}
          onSubmit={handleData}
          enableReinitialize={true}
        >
          {({values, errors, isSubmitting, setFieldValue}) => {
            return (
              <Form
                style={{textAlign: 'left', justifyContent: 'center'}}
                noValidate
                autoComplete='on'
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <AppTextField
                      label='Nombre de la Campaña *'
                      name='campaignName'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                        mx: 0,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DateTimePicker
                      label='Fecha *'
                      name='date'
                      inputFormat='dd/MM/yyyy HH:mm'
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant='outlined'
                          sx={{width: '100%', my: 2}}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <AppTextField
                      label='Contenido de la Campaña *'
                      name='campaignContent'
                      variant='outlined'
                      multiline
                      rows={4}
                      sx={{width: '100%', my: 2}}
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        mt: 2,
                      }}
                    >
                      <Button
                        variant='contained'
                        color='secondary'
                        component='label'
                        sx={{mb: 1}}
                      >
                        Subir Imagen
                        <input
                          type='file'
                          hidden
                          onChange={(event) =>
                            handleImageChange(event, setFieldValue)
                          }
                          accept='.png, .jpeg, .jpg'
                          multiple
                        />
                      </Button>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          flexWrap: 'wrap',
                        }}
                      >
                        {previewImages.map((image, index) => (
                          <Box
                            key={index}
                            sx={{
                              position: 'relative',
                              mx: 1,
                              my: 1,
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <img
                              src={image}
                              alt='Preview'
                              style={{
                                width: 100,
                                height: 100,
                                objectFit: 'cover',
                                borderRadius: '8px',
                              }}
                            />
                            <IconButton
                              sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                p: '2px',
                              }}
                              onClick={() =>
                                removeImagePreview(index, setFieldValue)
                              }
                            >
                              <CancelOutlinedIcon fontSize='small' />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                <ButtonGroup
                  orientation='vertical'
                  variant='outlined'
                  sx={{width: 1, py: 3}}
                  aria-label='outlined button group'
                >
                  <Button
                    color='primary'
                    sx={{mx: 'auto', width: '40%', py: 2}}
                    type='submit'
                    variant='contained'
                    disabled={isSubmitting}
                    startIcon={<SaveAltOutlinedIcon />}
                  >
                    Finalizar
                  </Button>
                  <Button
                    sx={{mx: 'auto', width: '40%', py: 2}}
                    variant='outlined'
                    startIcon={<ArrowCircleLeftOutlinedIcon />}
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                </ButtonGroup>
              </Form>
            );
          }}
        </Formik>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Cancelar Creación de Campaña'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <PriorityHighIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            ¿Estás seguro de que quieres cancelar la creación de la campaña?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button
            variant='outlined'
            onClick={() => {
              setOpen(false);
              Router.push('/sample/clients/table');
            }}
          >
            Sí
          </Button>
          <Button variant='outlined' onClick={handleClose}>
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openStatus}
        onClose={sendStatus}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Creación de Campaña'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          {showMessage()}
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={sendStatus}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default Create;
