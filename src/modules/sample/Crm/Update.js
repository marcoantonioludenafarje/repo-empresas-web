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
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {red} from '@mui/material/colors';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import {makeStyles} from '@mui/styles';
import {DesktopDatePicker, DateTimePicker} from '@mui/lab';
import Router, {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {newClient, onGetClients} from '../../../redux/actions/Clients';
import {
  newCampaign,
  generateVariations,
  getCampaigns,
} from '../../../redux/actions/Campaign';
import {getAgents} from '../../../redux/actions/Agent';
import {
  createPresigned,
  createClientsPresigned,
  createImagePresigned,
  onGetBusinessParameter,
  onGetGlobalParameter,
} from '../../../redux/actions/General';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  RESET_CAMPAIGNS,
  GET_CLIENTS_PRESIGNED,
  GENERATE_VARIATIONS,
} from '../../../shared/constants/ActionTypes';
import {DataGrid} from '@mui/x-data-grid';
import {verTags} from '../../../Utils/utils';
import {useRef} from 'react';
import EditorMessage from './EditorMessage';
import IntlMessages from '@crema/utility/IntlMessages';

const validationSchema = yup.object({
  campaignName: yup.string().required('El nombre de la campaña es obligatorio'),
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
  closeButton: {
    cursor: 'pointer',
    float: 'right',
    marginTop: '5px',
    width: '20px',
  },
}));

let selectedCampaign = {};

const Update = (props) => {
  let toSubmitting;
  let changeValueField;
  let getValueField;
  const [open, setOpen] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const getCampaign = (payload) => {
    dispatch(getCampaigns(payload));
  };

  let {query} = router;
  console.log('query', query);
  const {listCampaigns, campaignsLastEvaluatedKey_pageListCampaigns} =
    useSelector(({campaigns}) => campaigns);
  console.log('Confeti los campañas', listCampaigns);

  if (listCampaigns != undefined) {
    selectedCampaign = listCampaigns.find(
      (input) => input.campaignId == query.campaignId,
    );
    console.log('CAMPAÑA SELECTA', selectedCampaign);
  }
  const inputFileRef = useRef(null);
  const resetInput = () => {
    if (inputFileRef.current) {
      inputFileRef.current.value = ''; // Restablece el valor del input a una cadena vacía
    }
  };
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
    new Date(selectedCampaign?.scheduledAt) /* Number(query.createdAt) */,
  );
  console.log("Este es el publishDate",publishDate);
  const [openDialog, setOpenDialog] = useState(false);
  const [variations, setVariations] = useState(['Variación 1']);
  const [numVariations, setNumVariations] = useState(1);
  const [textMessage, setTextMessage] = useState('');
  const [idTextMessage, setIdTextMessage] = useState(0);
  const [campaignContentVariations, setCampaignContentsVariations] = useState([
    {id: 1},
  ]);
  const [campaignContent, setCampaignContent] = useState('');

  // Function to add more variations
  const handleAddVariation = () => {
    const newVariation = `Variación ${numVariations + 1}`;
    setVariations([...variations, newVariation]);
    setNumVariations(numVariations + 1);
    const newIdVariation = campaignContentVariations.length + 1;
    setCampaignContentsVariations([
      ...campaignContentVariations,
      {id: newIdVariation},
    ]);
  };

  const [selectedJsonImages, setSelectedJsonImages] = React.useState([]);
  const [nameLastFile, setNameLastFile] = React.useState('');
  const [actualImage, setActualImage] = React.useState('');
  const [clientSelection, setClientSelection] = useState('Todos');
  const classes = useStyles(props);

  const defaultValues = {
    campaignName: query.campaignName,
    date: Date.now() + 60 * 60 * 1000,
    campaignContent: selectedCampaign.messages[0].text,
    campaignImages: selectedCampaign.messages[0].img_url,
  };
  const getClients = (payload) => {
    dispatch(onGetClients(payload));
  };

  const getAgent = (payload) => {
    dispatch(getAgents(payload));
  };
  const {userDataRes} = useSelector(({user}) => user);

  const {listVariations} = useSelector(({campaigns}) => campaigns);
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

  const {listAgents, agentsLastEvaluatedKey_pageListAgents} = useSelector(
    ({agents}) => agents,
  );
  console.log('LISTA DE AGENTES CAMPAÑA', listAgents);

  const getGlobalParameter = (payload) => {
    dispatch(onGetGlobalParameter(payload));
  };

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

  console.log('Confeti los clientes', listClients);

  useEffect(() => {
    console.log('Estamos userDataResINCampaign', userDataRes);
    if (
      userDataRes &&
      userDataRes.merchantSelected &&
      userDataRes.merchantSelected.merchantId
    ) {
      console.log('Estamos entrando al getClients');

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
      let globalParameterPayload = {
        request: {
          payload: {
            abreParametro: null,
            codTipoparametro: null,
            country: 'peru',
          },
        },
      };
      getAgent(listPayload);
      getClients(listPayload);
      getGlobalParameter(globalParameterPayload);
      // setFirstload(true);
    }
  }, [userDataRes, listadeTags]);
  useEffect(() => {
    console.log('campaña actual', selectedCampaign);
  }, [selectedCampaign]);

  useEffect(() => {
    switch (process) {
      case 'CREATE_CAMPAIGN':
        if (!loading && (successMessage || errorMessage)) {
          setOpenStatus(true);
        }

        break;
      default:
        console.log('cargando proceso,', process);
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
        denominationClient: client.denominationClient || '',
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
      console.log('CLIENTES SELECCIONADOS:', clientsDataset);
      receivers = clientsDataset.map((clientId, index) => {
        const client = listClients.find((c) => c.clientId === clientId);
        return {
          type: 'client',
          id: index,
          clientId: client.clientId,
          denominationClient: client.denominationClient || '',
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
      console.log('RASTREA IMAGEN', actualImage);
      let imagePayload = {
        request: {
          payload: {
            //name: actualImage.name.split('.').slice(0, -1).join('.'),
            key: actualImage.name.split('.').slice(0, -1).join('.'),
            action: 'putObject',
            contentType: actualImage.type,
            merchantId: userDataRes.merchantSelected.merchantId,
            path: 'campaign/' + nameSimplified,
          },
        },
      };
      console.log('newImage', imagePayload);
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

    console.log('Contenidodecamapañas', campaignContent);
    console.log('ACTUAL IMAGE', imagePresigned);
    console.log('confeti agente', getValueField('agent').value);

    const idRobot = getValueField('agent').value;
    const name = listAgents.filter((agent) => agent.robotId === idRobot);

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
              targetSummary: [...selectedTags, totaldeClientes()],
              robotId: idRobot ? idRobot : '',
              robotName: name[0].robotName ? name[0].robotName : '',
              messages: [
                {
                  order: 0,
                  type: actualImage ? 'image' : 'text', //  FATA "image"|"audio"|"video"|"document"| "text"
                  // metadata: actualImage
                  //   ? {
                  //       keyMaster: imagePresigned.keymaster || '',
                  //       nameFile: actualImage?.name || '',
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
                  text: data.campaignContent,
                  variations: variationsDataContent
                    ? variationsDataContent
                    : [''],
                },
              ],
            },
          ],
          merchantId: userDataRes.merchantSelected.merchantId,
          levelBusiness: levelEnter.level || 'BRONCE',
        },
      },
    };

    // if (campaignContents.length > 1) {
    //   campaignContents.slice(1).forEach((content, index) => {
    //     payload.request.payload.campaign[0].messages.push({
    //       order: index + 2,
    //       type: 'text',
    //       text: content.content,
    //     });
    //   });
    // }

    console.log('Payload create', payload);
    setPayloadToCreateCampaign(payload);
  };
  useEffect(() => {
    if (clientsPresigned) {
      dispatch({type: FETCH_SUCCESS, payload: ''});
      dispatch({type: FETCH_ERROR, payload: ''});
      const payload = payloadToCreateCampaign;
      console.log('Payload creates', payload);
      payload.request.payload.campaign[0].receivers.urlClients =
        clientsPresigned.keymaster;
      // Show success message
      dispatch({type: RESET_CAMPAIGNS}); //Esto de aquí está para que cuándo quiero conseguir el nuevo successMessage borré el clientes y obtenga el campañaas
      console.log('newCampaignPayload', payload);
      createCampaign(payload);
      // Reset form
      toSubmitting(false);

      setOpenStatus(true);

      dispatch({type: GET_CLIENTS_PRESIGNED, payload: undefined});
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

  const imageToBlob = (imageUrl) => {
    return fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => new File([blob], 'image.jpg', {type: 'image/jpeg'}));
  };

  const removeImagePreview = (index, setFieldValue) => {
    const updatedImages = [...previewImages];
    updatedImages.splice(index, 1);
    setPreviewImages(updatedImages);

    let newImagesJson = [...selectedJsonImages];
    newImagesJson.splice(index, 1);
    setSelectedJsonImages(newImagesJson);

    const updatedFiles = previewImages.map((image) => {
      const file = imageToBlob(image);
      return file;
    });
    setFieldValue('campaignImages', updatedFiles);
    resetInput();
  };
  const handleOpenClientsDialog = () => {
    setOpenClientsDialog(true);
  };

  const [clientsDataset, setClientsDataset] = useState([]);

  const handleCloseClientsDialog = () => {
    console.log('CLIENTES DATA CLOSE', clientsDataset);
    setClientsDataset(selectedClients);
    setOpenClientsDialog(false);
  };

  const handleCloseClientsDialogReload = () => {
    console.log('CLIENTES DATA', clientsDataset);
    if (clientsDataset.length > 0) {
      setSelectedClients(clientsDataset);
      setOpenClientsDialog(false);
    } else {
      setSelectedClients([]);
      setOpenClientsDialog(false);
    }
  };

  console.log('LISTA DE CLIENTES,', listClients);
  const [selectedClientsByTag, setSelectedClientsByTag] = useState([]);
  console.log('seleccion,', selectedClientsByTag);

  const handleTagSelect = (selectedTags) => {
    setSelectedTags(selectedTags);

    if (selectedTags.includes('ALL')) {
      console.log('CUANDO SE MARCA EL TAG ALL');
      setSelectedTagsCount(namesTags.length);
      setSelectedClientCount(listClients?.length || 0);
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
      setSelectedClientCount(listClients?.length || 0);
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
      return listClients?.length || 0;
    }
    if (clientSelection === 'Algunos') {
      return selectedClients.length;
    }
    return 0;
  };

  // Función para manejar el cambio en el checkbox del encabezado
  const handleHeaderCheckboxChange = (e) => {
    if (e.target.checked) {
      const newSelection = searchDialogResults.map((row) => row.clientId);
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
  const isAllSelected = selectedClients.length === (listClients?.length || 0);
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

  const {globalParameter} = useSelector(({general}) => general);
  console.log('globalParameter123', globalParameter);

  const [parameterLevel, setParameterLevel] = useState([]);
  useEffect(() => {
    if (globalParameter != undefined) {
      let obtainedLevels = globalParameter.find(
        (obj) => obj.abreParametro == 'LEVEL_INTERACTIONS',
      ).value;
      console.log('Levels parameter', obtainedLevels);
      setParameterLevel(obtainedLevels);
    }
  }, [globalParameter != undefined]);

  const LevelClients = (array) => {
    if (array.length === 0) {
      return {order: 1, clientsAmount: 20, level: 'BRONCE'};
    }

    // Inicializar la variable para almacenar el objeto con el mayor order
    let objetoMayorOrder = array[0];

    // Recorrer el array y encontrar el objeto con el mayor order
    for (let i = 1; i < array.length; i++) {
      if (array[i].order > objetoMayorOrder.order) {
        objetoMayorOrder = array[i];
      }
    }

    return objetoMayorOrder;
  };
  const levelEnter = LevelClients(parameterLevel);
  console.log('LEVEL ENTER', levelEnter);

  const [verification, setVerification] = useState(true);

  const verificationVariations = () => {
    let valor = totaldeClientes() / levelEnter.clientsAmount; //  6 / 5   1.2
    let mayorPosible = Math.ceil(valor); // 2
    console.log(
      'TOTAL DE DATA',
      totaldeClientes(),
      'mayorposible',
      mayorPosible,
    );

    console.log('DATA-VARIATIONS', variationsData[0], mayorPosible);
    if (mayorPosible - 1 == 1) {
      console.log('DATA-VARIATIONS', variationsData[0]);
      if (
        variationsDataContent &&
        variationsDataContent[0] !== '' &&
        variationsDataContent[0] !== undefined
      ) {
        setVerification(false);
      }
      return mayorPosible - 1;
    }
    let parametro = valor % 1 === 0 ? valor : Math.ceil(valor) - 1;
    console.log('TOTAL DE DATA', parametro);
    if (
      totaldeClientes() > levelEnter.clientsAmount &&
      parametro === variationsDataContent.length
    ) {
      // 11>5 && ===0
      console.log('VARIATONSDATA ', variationsData.length, parametro);
      if (
        variationsDataContent.filter(
          (vari) => vari !== '' && vari !== undefined,
        )
      ) {
        setVerification(false);
        console.log('TOTAL DE DATA PARA');
        return parametro;
      }
    }
    return parametro;
  };

  // State to keep track of expanded accordion
  const [expandedAccordion, setExpandedAccordion] = useState(null);

  // State to keep track of campaign content variations
  const [variationsData, setVariationsData] = useState(
    variations.map((v) => v.content),
  );

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? panel : null);
  };

  const handleVariationContentChange = (index, value) => {
    // Update the campaignContentVariations state with the latest changes
    const newData = [...variationsData];
    newData[index] = value;
    setVariationsData(newData);
  };

  const handleDeleteAccordion = (index) => {
    // Remove the accordion by updating the variations and variationsData states
    const newVariations = [...variations];
    newVariations.splice(index, 1);
    setVariations(newVariations);

    const newData = [...variationsData];
    newData.splice(index, 1);
    setVariationsData(newData);
  };

  const handleAccordionVariationsClose = () => {
    if (variationsDataContent.length === 0) {
      setVariations(['Variación 1']);
      setNumVariations(1);
      setCampaignContentsVariations([{id: 1, content: ''}]);
      setVariationsData([]);
      setOpenDialog(false);
    } else if (variationsDataContent.length > 0) {
      const nuevasVariaciones = [];
      const nuevosContenidos = [];

      for (let i = 0; i < variationsDataContent.length; i++) {
        nuevasVariaciones.push(`Variación ${i + 1}`);
        nuevosContenidos.push({id: i + 1});
      }

      setVariations(nuevasVariaciones);
      setNumVariations(variationsDataContent.length);
      setCampaignContentsVariations(nuevosContenidos);
      setVariationsData(variationsDataContent);
      setOpenDialog(false);
    }
  };

  const [variationsDataContent, setVariationsDataContent] = useState([]);

  const handleSaveVariations = (data) => {
    console.log('DATA DE VARIATIONS >>', data);
    const nonEmptyValues = data.filter((value) => value !== '');

    setVariationsDataContent(nonEmptyValues);
    //setVariationsDataContent(data);

    setOpenDialog(false);
  };

  useEffect(() => {
    console.log('DATA DE VARIATIONS<<', variationsDataContent);
  }, [variationsDataContent]);

  const [geneVariations, setGenerateVariations] = useState(null);

  const handleGenerateVariations = async () => {
    let text = getValueField('campaignContent').value;

    const payloadVariations = {
      request: {
        payload: {
          cant_variaciones: variations.length > 8 ? 8 : variations.length,
          textCampaign: text,
        },
      },
    };

    console.log('index payload', payloadVariations);
    dispatch(generateVariations(payloadVariations));
  };

  useEffect(() => {
    if (listVariations && listVariations.data) {
      setGenerateVariations(listVariations);
      if (
        listVariations.data.length < variations.length &&
        variations.length > 8
      ) {
        const diff = variations.length - listVariations.data.length;

        for (let i = 0; i < diff; i++) {
          listVariations.data.push('');
        }
      }
      const newDatatt = [];
      for (let i = 0; i < variations.length; i++) {
        newDatatt[i] = listVariations.data[i];
      }
      console.log('IA DATA <<<', newDatatt);
      setVariationsData(newDatatt);
    }
  }, [listVariations]);
  useEffect(() => {
    console.log('IA DATA >>>', geneVariations);
  }, [geneVariations]);

  const [validateVariations, setValidateVariations] = useState(false); //validación de repetición

  const sameData = () => {
    const duplicates = {};
    variationsData.forEach((item, index) => {
      console.log('item-index', item, index);
      console.log(variationsData.indexOf(item));
      if (variationsData.indexOf(item) !== index) {
        duplicates[item] = true;
      }
    });
    console.log(variationsData);
    console.log(duplicates);
    const hasTrueValue = Object.values(duplicates).some(
      (value) => value === true,
    );

    if (hasTrueValue) {
      setValidateVariations(true);
      return (
        <Box sx={{width: 1, textAlign: 'center', mt: 2, color: 'red'}}>
          <Typography sx={{fontSize: 18, fontWeight: 600}}>
            Hay variaciones repetidas
          </Typography>
        </Box>
      );
    } else {
      setValidateVariations(false);
      console.log('El objeto no tiene ninguna propiedad con valor true.');
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
          //enableReinitialize={true}
        >
          {({
            values,
            errors,
            isSubmitting,
            setFieldValue,
            setSubmitting,
            getFieldProps,
          }) => {
            toSubmitting = setSubmitting;
            changeValueField = setFieldValue;
            getValueField = getFieldProps;
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
                            ref={inputFileRef}
                            onInput={(event) =>
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
                                onClick={() => {
                                  removeImagePreview(index, setFieldValue);
                                }}
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
                  <EditorMessage
                    previewImages={previewImages}
                    getValueField={getValueField}
                    changeValueField={changeValueField}
                  />
                </Grid>

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

                <Dialog
                  open={openDialog}
                  onClose={() => setOpenDialog(false)}
                  maxWidth='md'
                  fullWidth
                >
                  <DialogTitle>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Button
                        variant='outlined'
                        onClick={handleGenerateVariations}
                        sx={{flexGrow: 0, textAlign: 'center'}}
                      >
                        ¡Necesito Ayuda!
                      </Button>
                      <CancelOutlinedIcon
                        onClick={handleAccordionVariationsClose}
                        className={classes.closeButton}
                      />
                    </Box>
                  </DialogTitle>
                  <Box sx={{width: 1, textAlign: 'center', mt: 2}}>
                    <Typography sx={{fontSize: 18, fontWeight: 600}}>
                      El proceso de generar Variaciones demora unos segundos
                    </Typography>
                    <Typography sx={{fontSize: 18, fontWeight: 600}}>
                      {`Sí demora, vuelva a darle click en "Necesito Ayuda!"`}
                    </Typography>
                  </Box>
                  {sameData()};
                  {totaldeClientes() > levelEnter.clientsAmount ? (
                    <Box
                      sx={{width: 1, textAlign: 'center', mt: 2, color: 'red'}}
                    >
                      {verification && (
                        <Typography sx={{fontSize: 18, fontWeight: 600}}>
                          Cantidad de variaciones obligatorias:
                          {verificationVariations() -
                            variationsDataContent.length}
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Typography></Typography>
                  )}
                  ;
                  <DialogContent>
                    {variations.map((variation, index) => (
                      <Accordion
                        key={index}
                        expanded={expandedAccordion === index}
                        onChange={handleAccordionChange(index)}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          {variation}
                          <Box sx={{ml: 'auto'}}>
                            <Button
                              onClick={() => handleDeleteAccordion(index)}
                            >
                              <DeleteOutlineOutlinedIcon />
                            </Button>
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid item xs={12} md={12}>
                            <TextField
                              label=''
                              variant='outlined'
                              multiline
                              rows={4}
                              value={variationsData[index]} // Use the updated variationsData
                              onChange={(e) =>
                                handleVariationContentChange(
                                  index,
                                  e.target.value,
                                )
                              }
                              sx={{width: '100%', my: 2}}
                            />
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                    <Box
                      sx={{display: 'flex', justifyContent: 'center', my: 2}}
                    >
                      <Button variant='outlined' onClick={handleAddVariation}>
                        Más
                      </Button>
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      color='primary'
                      sx={{mx: 'auto', width: '15%'}}
                      variant='contained'
                      startIcon={<SaveAltOutlinedIcon />}
                      disabled={validateVariations}
                      onClick={() => {
                        // Save the variationsData when clicking "Guardar"
                        console.log('Saving variations:', variationsData);
                        // ... (Add your saving logic here)
                        handleSaveVariations(variationsData);
                        verificationVariations();
                        setOpenDialog(false);
                      }}
                    >
                      Guardar
                    </Button>
                  </DialogActions>
                </Dialog>

                {totaldeClientes() > levelEnter.clientsAmount ? (
                  <Box
                    sx={{width: 1, textAlign: 'center', mt: 2, color: 'red'}}
                  >
                    {verification && (
                      <Typography sx={{fontSize: 18, fontWeight: 600}}>
                        Cantidad de variaciones obligatorias:
                        {verificationVariations() -
                          variationsDataContent.length}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Typography></Typography>
                )}

                <Grid item xs={12}>
                  <FormControl sx={{width: '20%', my: 2, marginLeft: '40%'}}>
                    <InputLabel id='agent-label' style={{fontWeight: 200}}>
                      Seleccionar Agente
                    </InputLabel>
                    {/* {inicializaIdentidad()} */}
                    <Select
                      name='agent'
                      labelId='agent-label'
                      label='Agent'
                      value={selectedCampaign?.robotId}
                      //onChange={handleField}
                      // onChange={(option, value) => {
                      //   setFieldValue('agent', value.props.value);
                      //   // setIdentidad(value.props.value);
                      // }}
                      onChange={(event) => {
                        const selectedRobotId = event.target.value;
                        const selectedRobot = listAgents.find(
                          (agen) => agen.robotId === selectedrobotId,
                        );
                        setFieldValue('agent', selectedRobotId);
                      }}
                    >
                      {listAgents.map((agent, index) => (
                        <MenuItem
                          key={`agent-${index}`}
                          value={agent.robotId}
                          style={{fontWeight: 200}}
                        >
                          {agent.robotName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                    form='principal-form'
                    disabled={
                      isSubmitting ||
                      (totaldeClientes() <= levelEnter.clientsAmount &&
                        totaldeClientes() > 0)
                        ? false
                        : verification
                    }
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
        <DialogTitle id='alert-dialog-title'>
          <Typography
            sx={{mx: 'auto', my: '10px', fontWeight: 600, fontSize: 25}}
          >
            {'Seleccionar Clientes'}
            <CancelOutlinedIcon
              onClick={handleCloseClientsDialog}
              className={classes.closeButton}
            />
          </Typography>
        </DialogTitle>
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
                sx={{flex: 1}}
              />

              <Grid item xs={12} md={3}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <Autocomplete
                    value={selectedTags}
                    onChange={(event, newValue) => {
                      console.log('Nuevo Tag seleccionado:', newValue);
                      handleTagSelect(newValue);
                    }}
                    disabled={
                      selectedClientCount === (listClients?.length || 0)
                    }
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
                sx={{height: '100%'}}
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
                  {searchDialogResults?.map((row) => (
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
          <Button
            color='primary'
            sx={{mr: '35%', width: '10%'}}
            variant='contained'
            startIcon={<SaveAltOutlinedIcon />}
            onClick={handleCloseClientsDialog}
          >
            Guardar
          </Button>
          <Button
            onClick={handleCloseClientsDialogReload}
            startIcon={<ArrowCircleLeftOutlinedIcon />}
            variant='outlined'
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={loading}
        // onClose={sendStatus}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        {/* <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Registro de cliente'}
        </DialogTitle> */}
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <CircularProgress disableShrink />
        </DialogContent>
        {/* <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={sendStatus}>
            Aceptar
          </Button>
        </DialogActions> */}
      </Dialog>
    </Card>
  );
};

export default Update;
