import React, {useEffect, useState} from 'react';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  Box,
  FormControl,
  InputLabel,
  Autocomplete,
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
  FormControlLabel,
  Divider,
  Typography,
  IconButton,
  TextField,
  Switch,
} from '@mui/material';

import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import {red} from '@mui/material/colors';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import {makeStyles} from '@mui/styles';
import {DesktopDatePicker, DateTimePicker} from '@mui/lab';
import Router, {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {newClient, onGetClients} from '../../../redux/actions/Clients';
import {newCampaign} from '../../../redux/actions/Campaign';
import {createPresigned} from '../../../redux/actions/General';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  RESET_CAMPAIGNS,
} from '../../../shared/constants/ActionTypes';
import {DataGrid} from '@mui/x-data-grid';

const validationSchema = yup.object({
  campaignName: yup.string().required('El nombre de la campaña es obligatorio'),
  date: yup
    .date()
    .typeError('Ingresa una fecha valida')
    .required('La fecha es obligatoria'),
  campaignContent: yup
    .string()
    .required('El contenido de la campaña es obligatorio'),
  campaignImages: yup
    .array()
    .of(yup.mixed().required('Requiere una imagen'))
    .nullable(),
});

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

  const [openClientsDialog, setOpenClientsDialog] = useState(false);
  const [selectedClients, setSelectedClients] = useState('Todos');
  const [selectedClientCount, setSelectedClientCount] = useState(0);

  const [previewImages, setPreviewImages] = useState([]);
  let fecha = new Date();

  const [selectedJsonImages, setSelectedJsonImages] = React.useState([]);
  const [nameLastFile, setNameLastFile] = React.useState('');
  const [clientSelection, setClientSelection] = useState();
  const classes = useStyles(props);

  const defaultValues = {
    campaignName: '',
    date: fecha.setHours(fecha.getHours() + 1),
    campaignContent: '',
    campaignImages: null,
  };

  // Estado para controlar el acordeón abierto
  const [expanded, setExpanded] = useState(1);
  const [campaignContents, setCampaignContents] = useState([
    {id: 1, content: ''}, // Primer acordeón desplegado
  ]);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleAddAccordion = () => {
    const newId = campaignContents.length + 1;
    setCampaignContents([...campaignContents, {id: newId, content: ''}]);
  };

  const handleContentChange = (id, content) => {
    const updatedContents = campaignContents.map((contentData) =>
      contentData.id === id ? {...contentData, content} : contentData,
    );
    setCampaignContents(updatedContents);
  };

  const handleClientSelection = (selectedClients) => {
    setSelectedClients(selectedClients);
  };

  const getClients = (payload) => {
    dispatch(onGetClients(payload));
  };
  const {userDataRes} = useSelector(({user}) => user);

  const {listClients, clientsLastEvalutedKey_pageListClients} = useSelector(
    ({clients}) => clients,
  );

  const {presigned} = useSelector(({general}) => general);
  const createCampaign = (payload) => {
    dispatch(newCampaign(payload));
  };
  const toCreatePresigned = (payload, file) => {
    dispatch(createPresigned(payload, file));
  };
  const {newCampaignRes, successMessage, errorMessage, process, loading} =
    useSelector(({campaigns}) => campaigns);
  console.log('Respuesta de campañas : ', errorMessage);

  console.log('Confeti los clientes', listClients);

  useEffect(() => {
    console.log('Estamos userDataResINCampaign', userDataRes);
    if (
      userDataRes &&
      userDataRes.merchantSelected &&
      userDataRes.merchantSelected.merchantId
    ) {
      console.log('Estamos entrando al getClients');
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      //dispatch({type: GET_CLIENTS, payload: undefined});
      let listPayload = {
        request: {
          payload: {
            typeDocumentClient: '',
            numberDocumentClient: '',
            denominationClient: '',
            merchantId: userDataRes.merchantSelected.merchantId,
            LastEvaluatedKey: null,
          },
        },
      };
      getClients(listPayload);
      // setFirstload(true);
    }
  }, [userDataRes]);

  useEffect(() => {
    switch (process) {
      case 'CREATE_NEW_CAMPAIGN':
        if (!loading && (successMessage || errorMessage)) {
          setOpenStatus(true);
        }

        break;
      default:
        console.log('Se supone que pasa por aquí XD');
    }
  }, [loading]);

  const namesTags = ['Navidad', 'Infantil', 'Juvenil', 'Adultez', 'Verano'];

  const handleData = (data, {setSubmitting}) => {
    console.log('Data crear', data);
    setSubmitting(true);
    let receivers = [];

    if (clientSelection === 'Todos') {
      // receivers = listClients.map((client, index) => ({
      //   type: 'client',
      //   id: index,
      //   clientId: client.clientId,
      //   nameContact: client.nameContact || "",
      //   emailContact: client.emailContact || "",
      //   numberCountryCode: client.numberCountryCode || "51",
      //   addressClient: client.addressClient || "",
      //   givenName: client.givenName || "",
      //   lastName: client.lastName || "",
      //   secondLastName: client.secondLastName || "",
      //   extraInformationClient: client.extraInformationClient || "",
      //   numberContact: client.numberContact || "",
      //   birthDay: client.birthDay || "",
      // }));
      receivers.push({
        type: 'tag',
        tagId: 'ALL',
      });
    } else if (clientSelection === 'Algunos') {
      receivers = selectedClients.map((clientId, index) => {
        const client = listClients.find((c) => c.clientId === clientId);
        return {
          type: 'client',
          id: index,
          clientId: client.clientId,
          nameContact: client.nameContact || '',
          emailContact: client.emailContact || '',
          numberCountryCode: client.numberCountryCode || '51',
          addressClient: client.addressClient || '',
          givenName: client.givenName || '',
          lastName: client.lastName || '',
          secondLastName: client.secondLastName || '',
          extraInformationClient: client.extraInformationClient || '',
          numberContact: client.numberContact || '',
          birthDay: client.birthDay || '',
        };
      });
    }
    console.log('RECEIVERS', receivers);
    const payload = {
      request: {
        payload: {
          campaign: [
            {
              campaignName: data.campaignName,
              scheduledAt: data.date,
              receivers,
              messages: [
                {
                  order: 1,
                  type: selectedJsonImages[0] ? 'image' : 'text', //  FATA "image"|"audio"|"video"|"document"| "text"
                  metadata: selectedJsonImages[0]
                    ? {
                        keyMaster: selectedJsonImages[0]?.keyMaster || '',
                        nameFile: selectedJsonImages[0]?.nameFile || '',
                      }
                    : null,
                  text: data.campaignContent,
                },
              ],
            },
          ],
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };

    setTimeout(() => {
      // Show success message

      dispatch({type: RESET_CAMPAIGNS}); //Esto de aquí está para que cuándo quiero conseguir el nuevo successMessage borré el clientes y obtenga el campañaas
      console.log('newCampaignPayload', payload);
      createCampaign(payload);

      setOpenStatus(true);

      // Reset form
      setSubmitting(false);
    }, 1000);
  };

  const showMessage = () => {
    if (successMessage !== undefined) {
      console.log('MENSAJE DE VALIDEZ', successMessage);
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
            {/* Se ha registrado la información <br />
            correctamente */}
            {successMessage}
          </DialogContentText>
        </>
      );
    } else if (errorMessage) {
      console.log('MENSAJE DE ERROR', errorMessage);
      return (
        <>
          <CancelOutlinedIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            {errorMessage}
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink />;
    }
  };

  const sendStatus = () => {
    console.log('Esto es el momento');
    setOpenStatus(false);
    Router.push('/sample/crm/views');
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

    const imagePreviews = files.map((file) => {
      let imagePayload = {
        request: {
          payload: {
            key: 'general',
            action: 'putObject',
            contentType: '',
          },
        },
      };
      imagePayload.request.payload.contentType = file.type;
      imagePayload.request.payload.name = file.name;
      setNameLastFile(file.name);
      toCreatePresigned(imagePayload, {
        image: file,
        type: file?.type || null,
      });
      return URL.createObjectURL(file);
    });
    setPreviewImages(imagePreviews);
    Array.from(event.target.files).map((file) => URL.revokeObjectURL(file));
  };
  useEffect(() => {
    if (presigned) {
      console.log('useEffect presigned', presigned);
      let actualSelectedJsonImages = selectedJsonImages;
      const newJsonImages = {
        keyMaster: presigned.keymaster,
        nameFile: nameLastFile,
      };
      console.log('newJsonImages', newJsonImages);
      actualSelectedJsonImages = [newJsonImages];
      console.log('actualSelectedJsonImages', actualSelectedJsonImages);
      setSelectedJsonImages(actualSelectedJsonImages);
    }
  }, [presigned]);
  const removeImagePreview = (index, setFieldValue) => {
    const updatedImages = [...previewImages];
    updatedImages.splice(index, 1);
    setPreviewImages(updatedImages);

    let newImagesJson = selectedJsonImages;
    delete newImagesJson[index];
    setSelectedJsonImages(newImagesJson);
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

  const handleClientSelect = (selectedClientIds) => {
    setSelectedClients(selectedClientIds);

    if (selectedClientIds.length === listClients.length) {
      setSelectedClientCount(listClients.length);
      setClientSelection('Todos');
    } else {
      setSelectedClientCount(selectedClientIds.length);
      setClientSelection('Algunos');
    }
  };

  const handleOpenClientsDialog = () => {
    setOpenClientsDialog(true);
  };

  const handleCloseClientsDialog = () => {
    setOpenClientsDialog(false);
  };

  const columns = [
    {field: 'clientId', headerName: 'ID', width: 150},
    {field: 'denominationClient', headerName: 'Cliente', width: 200},
    {field: 'numberContact', headerName: 'Contacto', width: 150},
  ];

  const rows = listClients.map((client) => ({
    id: client.clientId,
    clientId: client.clientId,
    denominationClient: client.denominationClient,
    numberContact: client.numberContact,
  }));

  const handleClientSelectionChange = (event) => {
    const {name, checked} = event.target;

    if (name === 'Todos' && checked) {
      setClientSelection('Todos');
      setSelectedClientCount(listClients.length);
    } else if (name === 'Algunos' && checked) {
      setClientSelection('Algunos');
      setSelectedClientCount(0);
    } else {
      setSelectedClientCount(listClients.length);
      setClientSelection('Todos');
    }
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
                      minDateTime={new Date()}
                      value={values.date}
                      onChange={(e) => {
                        console.log('tipo', e);
                        setFieldValue('date', e);
                      }}
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
                  <Grid container spacing={2}>
                    {/* Primer Grid - Contiene el Clientes Box */}
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          my: 2,
                        }}
                      >
                        <Box
                          sx={{
                            border: '1px solid #ccc',
                            padding: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={clientSelection === 'Todos'}
                                onChange={handleClientSelectionChange}
                                name='Todos'
                              />
                            }
                            label='Todos'
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={clientSelection === 'Algunos'}
                                onChange={handleClientSelectionChange}
                                name='Algunos'
                              />
                            }
                            label={`Algunos (${selectedClientCount})`}
                          />
                          {clientSelection === 'Algunos' && (
                            <Button
                              variant='outlined'
                              onClick={() => setOpenClientsDialog(true)}
                            >
                              Clientes
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Grid>

                    {/* Segundo Grid - Contiene el componente Autocomplete */}
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'column',
                          mt: 2,
                        }}
                      >
                        <Autocomplete
                          sx={{
                            m: 1,
                            width: '100%', // Establece el ancho al 100% por defecto
                            [(theme) => theme.breakpoints.down('sm')]: {
                              width: '80%', // Ancho del 80% en pantallas pequeñas
                            },
                            [(theme) => theme.breakpoints.up('md')]: {
                              width: 500, // Ancho fijo de 500px en pantallas medianas y grandes
                            },
                          }}
                          multiple
                          options={namesTags}
                          getOptionLabel={(option) => option}
                          disableCloseOnSelect
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant='outlined'
                              label='Selecciona los tags'
                              placeholder='tags...'
                            />
                          )}
                          renderOption={(props, option, {selected}) => (
                            <MenuItem
                              {...props}
                              key={option}
                              value={option}
                              sx={{justifyContent: 'space-between'}}
                            >
                              {option}
                              {selected ? <CheckIcon color='info' /> : null}
                            </MenuItem>
                          )}
                        />
                      </Box>
                    </Grid>

                    {/* Tercer Grid - Contiene el box image */}
                    <Grid item xs={12} md={4}>
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
                  {/*Mensaje de campaña */}
                  {/* <Grid item xs={12} md={12}>
                    <AppTextField
                      label='Contenido de la Campaña *'
                      name='campaignContent'
                      variant='outlined'
                      multiline
                      rows={4}
                      sx={{width: '100%', my: 2}}
                    />
                  </Grid> */}
                  {campaignContents.map((contentData) => (
                    <Grid item xs={12} md={12} key={contentData.id}>
                      <Accordion
                        expanded={expanded === contentData.id}
                        onChange={handleAccordionChange(contentData.id)}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          Mensaje N. {contentData.id}
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid item xs={12} md={12}>
                            <AppTextField
                              label='Contenido de la Campaña *'
                              name={`campaignContent${contentData.id}`}
                              variant='outlined'
                              multiline
                              rows={4}
                              value={contentData.content}
                              onChange={(event) =>
                                handleContentChange(
                                  contentData.id,
                                  event.target.value,
                                )
                              }
                              sx={{width: '100%', my: 2}}
                            />
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  ))}

                  {/* Botón "Más" para agregar un nuevo acordeón */}
                  <Grid container item xs={12} justifyContent='center'>
                    <Button
                      variant='outlined'
                      color='primary'
                      onClick={handleAddAccordion}
                      startIcon={<AddCircleOutlineOutlinedIcon />}
                    >
                      Más
                    </Button>
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
              Router.push('/sample/crm/views');
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

      <Dialog
        open={openClientsDialog}
        onClose={() => setOpenClientsDialog(false)}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Seleccionar Clientes</DialogTitle>
        <DialogContent dividers>
          <div style={{height: 400, width: '560px'}}>
            <DataGrid
              rows={rows}
              columns={columns}
              checkboxSelection
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              onSelectionModelChange={handleClientSelect}
              selectionModel={selectedClients}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClientsDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default Create;
