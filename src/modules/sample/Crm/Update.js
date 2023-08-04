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
  TableContainer,
  TableCell,
  Table,
  TableHead,
  TableRow,
  Checkbox,
  TableBody,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import axios from 'axios';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CheckIcon from '@mui/icons-material/Check';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import {red} from '@mui/material/colors';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import {makeStyles} from '@mui/styles';
import {DesktopDatePicker, DateTimePicker} from '@mui/lab';
import Router, {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {newClient, onGetClients} from '../../../redux/actions/Clients';
import {newCampaign} from '../../../redux/actions/Campaign';
import {
  createPresigned,
  createClientsPresigned,
  createImagePresigned,
} from '../../../redux/actions/General';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  RESET_CAMPAIGNS,
  GET_CLIENTS_PRESIGNED,
} from '../../../shared/constants/ActionTypes';
import {DataGrid} from '@mui/x-data-grid';
import {verTags} from '../../../Utils/utils';
import {convertToDate} from '../../../Utils/utils';

const validationSchema = yup.object({
  campaignName: yup.string().required('El nombre de la campaña es obligatorio'),
  // date: yup
  //   .date()
  //   .typeError('Ingresa una fecha valida')
  //   .required('La fecha es obligatoria'),
  // campaignContent: yup
  //   .string()
  //   .required('El contenido de la campaña es obligatorio'),
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

const Update = (props) => {
  let toSubmitting;
  const [open, setOpen] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  let {query} = router;

  console.log('query', query);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [openClientsDialog, setOpenClientsDialog] = useState(false);
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedClientCount, setSelectedClientCount] = useState(0);
  const [payloadToCreateCampaign, setPayloadToCreateCampaign] = useState('');

  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedClientIds, setSelectedClientIds] = useState([]);
  const [selectedTagsCount, setSelectedTagsCount] = useState(0);

  const [previewImages, setPreviewImages] = useState([]);
  const [publishDate, setPublishDate] = React.useState(
    convertToDate(query.scheduledAt) /* Number(query.createdAt) */,
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [variations, setVariations] = useState(['Variación 1']);
  const [numVariations, setNumVariations] = useState(1);
  //const [message, setMessage] = useState('');

  // Function to add more variations
  const handleAddVariation = () => {
    const newVariation = `Variación ${numVariations + 1}`;
    setVariations([...variations, newVariation]);
    setNumVariations(numVariations + 1);
  };

  const [selectedJsonImages, setSelectedJsonImages] = React.useState([]);
  const [nameLastFile, setNameLastFile] = React.useState('');
  const [actualImage, setActualImage] = React.useState('');
  const [clientSelection, setClientSelection] = useState();
  const classes = useStyles(props);

  const defaultValues = {
    campaignName: query.campaignName,
    date: Date.now() + 60 * 60 * 1000,
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

  // Código de agregar acordion
  // const handleAddAccordion = () => {
  //   const newId = campaignContents.length + 1;
  //   setCampaignContents([...campaignContents, {id: newId, content: ''}]);
  // };

  const handleContentChange = (id, content) => {
    console.log('content Mensaje', content);
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

  const {businessParameter} = useSelector(({general}) => general);

  console.log('Businees: ', businessParameter);
  console.log(
    'bisnees people',
    businessParameter?.find((obj) => obj.abreParametro == 'CLIENT_TAGS').value,
  );

  const listadeTags = businessParameter?.find(
    (obj) => obj.abreParametro == 'CLIENT_TAGS',
  ).value;

  const {listClients, clientsLastEvalutedKey_pageListClients} = useSelector(
    ({clients}) => clients,
  );

  const {clientsPresigned, imagePresigned} = useSelector(
    ({general}) => general,
  );
  const createCampaign = (payload) => {
    dispatch(newCampaign(payload));
  };
  const toCreatePresigned = (payload, file) => {
    dispatch(createPresigned(payload, file));
  };
  const toCreateImagePresigned = (payload, file) => {
    dispatch(createImagePresigned(payload, file));
  };
  const toCreateClientsPresigned = (payload, file) => {
    dispatch(createClientsPresigned(payload, file));
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
  }, [userDataRes, listadeTags]);

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

  const namesTags = listadeTags?.map((tag) => tag.tagName);

  const handleData = (data, {setSubmitting}) => {
    console.log('Data crear', data);
    let nameSimplified = data.campaignName;
    nameSimplified = nameSimplified.replace(/ /g, '');
    nameSimplified = nameSimplified.toLowerCase();

    setSubmitting(true);
    let receivers = [];

    if (clientSelection === 'Todos') {
      receivers = listClients.map((client, index) => ({
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
      }));
      receivers.push({
        type: 'tag',
        tagId: 'ALL',
      });
    } else if (clientSelection === 'Algunos') {
      console.log('CLIENTES SELECCIONADOS:', selectedClients);
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
    const clientsData = {
      receivers: receivers,
    };
    // Convierte el objeto JSON a una cadena JSON
    const jsonString = JSON.stringify(clientsData, null, 2); // null, 2 para una representación más legible

    // Crea un Blob con la cadena JSON
    const clientsBlob = new Blob([jsonString], {type: 'application/json'});
    if (actualImage) {
      let imagePayload = {
        request: {
          payload: {
            key: actualImage.name.split('.').slice(0, -1).join('.'),
            action: 'putObject',
            contentType: actualImage.type,
            merchantId: userDataRes.merchantSelected.merchantId,
            path: 'campaign/' + nameSimplified,
          },
        },
      };
      toCreateImagePresigned(imagePayload, {
        image: actualImage,
        type: actualImage?.type || null,
      });
    }
    let clientsJsonPayload = {
      request: {
        payload: {
          key: 'clientsJson',
          action: 'putObject',
          contentType: 'application/json',
          name: 'clientsJson',
        },
      },
    };
    toCreateClientsPresigned(clientsJsonPayload, {
      image: clientsBlob,
      type: clientsBlob?.type || null,
    });
    const extensions = {
      'image/jpeg': 'jpeg',
      'image/jpg': 'jpg',
      'image/png': 'png',
    };

    console.log('Contenidodecamapañas', campaignContents);
    const payload = {
      request: {
        payload: {
          campaign: [
            {
              campaignName: data.campaignName,
              scheduledAt: data.date,
              receivers: {
                //type: 'client',
                urlClients: '',
              },
              robotId: 'ID_BOT_CUENTA_SOPORTE',
              messages: [
                {
                  order: 0,
                  type: actualImage ? 'image' : 'text', //  FATA "image"|"audio"|"video"|"document"| "text"
                  // metadata: selectedJsonImages[0]
                  //   ? {
                  //       keyMaster: selectedJsonImages[0]?.keyMaster || '',
                  //       nameFile: selectedJsonImages[0]?.nameFile || '',
                  //     }
                  //   : null,
                  img_url: actualImage
                    ? 'https://d2moc5ro519bc0.cloudfront.net/merchant/' +
                      userDataRes.merchantSelected.merchantId +
                      '/' +
                      'campaign/' +
                      nameSimplified +
                      '/' +
                      actualImage.name.split('.').slice(0, -1).join('.') +
                      '.' +
                      extensions[actualImage.type]
                    : '',
                  text: campaignContents[0].content,
                  variations: ['text', 'text'],
                },
              ],
            },
          ],
          merchantId: userDataRes.merchantSelected.merchantId,
          levelBusiness: 'ORO',
        },
      },
    };

    if (campaignContents.length > 1) {
      campaignContents.slice(1).forEach((content, index) => {
        payload.request.payload.campaign[0].messages.push({
          order: index + 2,
          type: 'text',
          text: content.content,
        });
      });
    }

    console.log('Payload create', payload);
    setPayloadToCreateCampaign(payload);
  };
  useEffect(() => {
    if (clientsPresigned) {
      const payload = payloadToCreateCampaign;
      payload.request.payload.campaign[0].receivers.urlClients =
        clientsPresigned.keymaster;
      setTimeout(() => {
        // Show success message
        dispatch({type: RESET_CAMPAIGNS}); //Esto de aquí está para que cuándo quiero conseguir el nuevo successMessage borré el clientes y obtenga el campañaas
        console.log('newCampaignPayload', payload);
        createCampaign(payload);

        setOpenStatus(true);

        // Reset form
        toSubmitting(false);
        dispatch({type: GET_CLIENTS_PRESIGNED, payload: undefined});
      }, 1000);
    }
  }, [clientsPresigned]);
  const showMessage = () => {
    if (successMessage != '') {
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
      setNameLastFile(file.name);
      setActualImage(file);
      return URL.createObjectURL(file);
    });
    setPreviewImages(imagePreviews);
    Array.from(event.target.files).map((file) => URL.revokeObjectURL(file));
  };

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

  const handleOpenClientsDialog = () => {
    setOpenClientsDialog(true);
  };

  const handleCloseClientsDialog = () => {
    setOpenClientsDialog(false);
  };
  console.log('LISTA DE CLIENTES,', listClients);
  const [selectedClientsByTag, setSelectedClientsByTag] = useState([]);
  console.log('seleccion,', selectedClientsByTag);

  const handleTagSelect = (selectedTags) => {
    setSelectedTags(selectedTags);

    if (selectedTags.includes('ALL')) {
      console.log('CUANDO SE MARCA EL TAG ALL');
      setSelectedTagsCount(namesTags.length);
      setSelectedClientCount(listClients.length);
      setClientSelection('Todos');
      setSelectedClientsByTag(listClients.map((client) => client.clientId));
    } else {
      console.log('CUANDO SE MARCAN TAGS');
      setSelectedTagsCount(selectedTags.length);
      console.log('Conteo', selectedTags.length);
      // Filtrar clientes basados en los tags seleccionados
      const filteredClients = listClients.filter((client) =>
        client.tags?.some((tagId) => selectedTags.includes(tagId)),
      );

      console.log('Clientes filtrados', filteredClients);
      setSelectedClientsByTag(filteredClients.map((client) => client.clientId));
      setSelectedClientCount(filteredClients.length);
      setClientSelection('Algunos');
    }
  };

  const handleClientSelectionChange = (event) => {
    const {name, checked} = event.target;

    console.log('Name', name);
    console.log('Check', checked);
    if (name === 'Todos' && checked) {
      console.log('ENTRA EN TODOS Y CHECK');
      setClientSelection('Todos');
      setSelectedClientCount(listClients.length);
      setSelectedClientIds(listClients.map((client) => client.clientId));
      setSelectedClientsByTag(listClients.map((client) => client.clientId));
    } else if (name === 'Algunos' && checked) {
      console.log('ENTRA EN ALGUNOS Y CHECK');
      setSelectedClientsByTag([]);
      setSelectedClientCount(0);
      setClientSelection('Algunos');
      setSelectedClientIds([]);
      setSelectedTags([]);
    }
  };

  const totaldeClientes = () => {
    console.log('VALOR DE TOTAL DE CLIENTES SELECT', clientSelection);
    if (clientSelection === 'Todos') {
      return listClients.length;
    }
    if (clientSelection === 'Algunos') {
      return selectedClients.length;
    }
    return 0;
  };

  // Función para manejar el cambio en el checkbox del encabezado
  const handleHeaderCheckboxChange = (e) => {
    if (e.target.checked) {
      const newSelection = listClients.map((row) => row.clientId);
      console.log('Confeti header', newSelection);
      setSelectedClients(newSelection);
    } else {
      setSelectedClients([]);
    }
  };

  // Función para verificar si un cliente está seleccionado
  const isClientSelected = (clientId) => selectedClients.includes(clientId);

  // Función para manejar el cambio en los checkboxes individuales
  const handleRowCheckboxChange = (clientId) => {
    if (isClientSelected(clientId)) {
      setSelectedClients((prevSelection) =>
        prevSelection.filter((id) => id !== clientId),
      );

      console.log('Selección >>>', selectedClients);
    } else {
      setSelectedClients((prevSelection) => [...prevSelection, clientId]);
      console.log('Selecion else >>', selectedClients);
    }
  };

  // Calcula si todos los clientes están seleccionados
  const isAllSelected = selectedClients.length === listClients.length;
  const isSomeSelected = selectedClients.length > 0 && !isAllSelected;

  const [searchDialogResults, setSearchDialogResults] = useState([]);
  const [searchDialogValue, setSearchDialogValue] = useState('');
  // Filtros en el dialog Clientes
  const searchClients = (event) => {
    console.log('Evento', event.target);
    if (searchDialogValue) {
      console.log('VALOR DEL SEARCH', searchDialogValue);
      const filteredClients = listClients.filter((client) =>
        client.denominationClient
          .toLowerCase()
          .includes(searchDialogValue.toLowerCase()),
      );
      setSearchDialogResults(filteredClients);
    } else if (selectedTags.length > 0) {
      console.log('Entra al slectedTags', selectedTags);
      const filteredClients = listClients.filter((client) => {
        let clienttags = verTags(client, businessParameter);
        let splittags = clienttags.split(' | ');
        console.log('TAGS >>>', splittags);
        let hasMatchingTag = splittags.some((tag) =>
          selectedTags.includes(tag),
        );
        console.log('TAGS >>> MATCH', hasMatchingTag);
        return hasMatchingTag;
      });
      setSearchDialogResults(filteredClients);
    } else {
      setSearchDialogResults(listClients);
    }
    console.log('LOS CLIENTES LUEGO DEL FILTRO EN TOTAL', searchDialogResults);
  };
  //BUSQUEDA
  const handleSearchValues = (e) => {
    setSearchDialogValue(e.target.value);
    if (e.key === 'Enter') {
      searchClients();
    }
  };

  useEffect(() => {
    setSearchDialogResults(listClients);
    console.log('clientes antes>>', searchDialogResults);
  }, [listClients]);

  return (
    <Card sx={{p: 4}}>
      <Box sx={{width: 1, textAlign: 'center'}}>
        <Typography
          sx={{mx: 'auto', my: '10px', fontWeight: 600, fontSize: 25}}
        >
          Clonar Campaña
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
          //enableReinitialize={true}
        >
          {({values, errors, isSubmitting, setFieldValue, setSubmitting}) => {
            toSubmitting = setSubmitting;
            return (
              <Form
                style={{textAlign: 'left', justifyContent: 'center'}}
                id='principal-form'
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
                      minDateTime={new Date(Date.now() + 59 * 60 * 1000)}
                      value={publishDate}
                      onChange={(e) => {
                        console.log('tipo', e);
                        setPublishDate(e);
                      }}
                      label='Fecha *'
                      name='date'
                      inputFormat='dd/MM/yyyy hh:mm a'
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
                    <Grid item xs={12} md={6}>
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
                            label={`Algunos (${totaldeClientes()})`}
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
                    {/* <Grid item xs={12} md={4}>
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
                          value={selectedTags}
                          onChange={(event, newValue) => {
                            console.log('Nuevo Tag seleccionado:', newValue);
                            handleTagSelect(newValue);
                          }}
                          disabled={selectedClientCount === listClients.length}
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
                          options={['ALL', ...namesTags]}
                          getOptionLabel={(option) => option}
                          disableCloseOnSelect
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant='outlined'
                              label='Selecciona Etiquetas'
                              placeholder='etiquetas...'
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
                    </Grid> */}

                    {/* Tercer Grid - Contiene el box image */}
                    <Grid item xs={12} md={6}>
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
                  <Box sx={{width: 1, textAlign: 'center', mt: 2}}>
                    <Typography sx={{fontSize: 18, fontWeight: 600}}>
                      Total de clientes: {totaldeClientes()}
                    </Typography>
                  </Box>
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
                            <TextField
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
                  {/* <Grid container item xs={12} justifyContent='center'>
                    <Button
                      variant='outlined'
                      color='primary'
                      onClick={handleAddAccordion}
                      startIcon={<AddCircleOutlineOutlinedIcon />}
                    >
                      Más
                    </Button>
                  </Grid> */}
                </Grid>
                {/* {selectedClients.length > 50 ? ( */}
                {totaldeClientes() > 1 ? (
                  <Grid container item xs={12} justifyContent='center'>
                    <Button
                      variant='outlined'
                      color='primary'
                      startIcon={<AddCircleOutlineOutlinedIcon />}
                      onClick={() => setOpenDialog(true)}
                    >
                      Generar Variación
                    </Button>
                  </Grid>
                ) : (
                  <Typography></Typography>
                )}

                <Dialog
                  open={openDialog}
                  onClose={() => setOpenDialog(false)}
                  maxWidth='md'
                  fullWidth
                >
                  <DialogTitle>
                    Variaciones
                    <IconButton
                      edge='end'
                      color='inherit'
                      onClick={() => setOpenDialog(false)}
                      aria-label='close'
                    >
                      <CancelOutlinedIcon />
                    </IconButton>
                  </DialogTitle>
                  <DialogContent>
                    {variations.map((variation, index) => (
                      <Accordion key={index}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          {variation}
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid item xs={12} md={12}>
                            <TextField
                              label='Contenido de la Campaña *'
                              variant='outlined'
                              multiline
                              rows={4}
                              value={''}
                              onChange={''}
                              sx={{width: '100%', my: 2}}
                            />
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </DialogContent>
                  <DialogActions>
                    <Button variant='outlined' onClick={handleAddVariation}>
                      Más
                    </Button>
                    <Button
                      variant='outlined'
                      onClick={() => setOpenDialog(false)}
                    >
                      Cerrar
                    </Button>
                  </DialogActions>
                </Dialog>

                {selectedClients > 50 ? (
                  <Box sx={{width: 1, textAlign: 'center', mt: 2}}>
                    <Typography sx={{fontSize: 18, fontWeight: 600}}>
                      Cantidad de variaciones: {numVariations}
                    </Typography>
                  </Box>
                ) : (
                  <Typography></Typography>
                )}

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
                    form='principal-form'
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
        maxWidth='lg'
      >
        <DialogTitle id='alert-dialog-title'>Seleccionar Clientes</DialogTitle>
        <DialogContent dividers>
          <div style={{height: 400, width: 1000}}>
            <Stack
              sx={{m: 2}}
              direction={isMobile ? 'column' : 'row'}
              spacing={2}
              className={classes.stack}
            >
              <TextField
                label='Nombre / Razón social'
                variant='outlined'
                name='nameToSearch'
                size='small'
                value={searchDialogValue}
                onChange={(e) => setSearchDialogValue(e.target.value)}
              />

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
                    value={selectedTags}
                    onChange={(event, newValue) => {
                      console.log('Nuevo Tag seleccionado:', newValue);
                      handleTagSelect(newValue);
                    }}
                    disabled={selectedClientCount === listClients.length}
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
                        label='Selecciona Etiquetas'
                        placeholder='etiquetas...'
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

              <Button
                startIcon={<ManageSearchOutlinedIcon />}
                variant='contained'
                color='primary'
                onClick={searchClients}
              >
                Buscar
              </Button>
            </Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding='checkbox'>
                      <Checkbox
                        color='primary'
                        checked={isAllSelected}
                        indeterminate={isSomeSelected}
                        onChange={handleHeaderCheckboxChange}
                      />
                    </TableCell>
                    <TableCell>Identificador</TableCell>
                    <TableCell>Nombre / Razón social</TableCell>
                    <TableCell>Contacto</TableCell>
                    <TableCell>Etiquetas</TableCell>
                    {/* Agrega más TableCell para las columnas que necesites */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchDialogResults.map((row) => (
                    <TableRow key={row.clientId}>
                      <TableCell padding='checkbox'>
                        <Checkbox
                          color='primary'
                          checked={isClientSelected(row.clientId)}
                          onChange={() => handleRowCheckboxChange(row.clientId)}
                        />
                      </TableCell>
                      <TableCell>
                        {row.clientId.split('-')[0] +
                          ' ' +
                          row.clientId.split('-')[1]}
                      </TableCell>
                      <TableCell>{row.denominationClient}</TableCell>
                      <TableCell>{row.numberContact}</TableCell>
                      <TableCell>{verTags(row, businessParameter)}</TableCell>
                      {/* Agrega más TableCell para las columnas que necesites */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </DialogContent>
        <Typography>Total seleccionados {totaldeClientes()}</Typography>
        <DialogActions>
          <Button onClick={handleCloseClientsDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default Update;
