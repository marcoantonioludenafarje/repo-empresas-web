import React, {useEffect, useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  CircularProgress,
  Menu,
  TextField,
  Select,
  ButtonGroup,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import DehazeIcon from '@mui/icons-material/Dehaze';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockSharpIcon from '@mui/icons-material/BlockSharp';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import {getCampaigns, deleteCampaigns} from '../../../redux/actions/Campaign';
import {convertToDate} from '../../../Utils/utils';
import {useDispatch, useSelector} from 'react-redux';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
} from '../../../shared/constants/ActionTypes';
import Router from 'next/router';
import {red} from '@mui/material/colors';
import axios from 'axios';
import IntlMessages from '@crema/utility/IntlMessages';

function createData(name, fecha, containt, receipt) {
  return {name, fecha, containt, receipt};
}

const useStyles = makeStyles((theme) => ({
  btnGroup: {
    marginTop: '2rem',
  },
  btnSplit: {
    display: 'flex',
    justifyContent: 'center',
  },
  stack: {
    justifyContent: 'center',
    marginBottom: '10px',
  },
}));

let selectedCampaign = {};
let deletePayload = {
  request: {
    payload: {
      campaignId: '',
    },
  },
};

export default function Views(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [open2, setOpen2] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);

  const [searchValue, setSearchValue] = useState('');
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);

  let popUp = false;

  const getCampaign = (payload) => {
    dispatch(getCampaigns(payload));
  };

  const deleteCampaign = (payload) => {
    dispatch(deleteCampaigns(payload));
  };

  const {userDataRes} = useSelector(({user}) => user);

  const {successMessage} = useSelector(({clients}) => clients);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({clients}) => clients);
  console.log('errorMessage', errorMessage);

  const {listCampaigns, campaignsLastEvaluatedKey_pageListCampaigns} =
    useSelector(({campaigns}) => campaigns);

  console.log('confeti las campañas', listCampaigns);

  useEffect(() => {
    console.log('Estamos userDataRes', userDataRes);
    if (
      userDataRes &&
      userDataRes.merchantSelected &&
      userDataRes.merchantSelected.merchantId
    ) {
      console.log('Estamos entrando al getCampañas');
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
      getCampaign(listPayload);
      // setFirstload(true);
    }
  }, [userDataRes]);

  let codProdSelected = '';
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [cancelDisabled, setCancelDisabled] = useState(false);
  /* let anchorEl = null; */
  const openMenu = Boolean(anchorEl);
  const handleClick = (codPro, event) => {
    console.log('evento', event);
    console.log('index del map', codPro);
    setAnchorEl(event.currentTarget);
    codProdSelected = codPro;
    selectedCampaign =
      listCampaigns[codPro]; /* .find((obj) => obj.client == codPro); */
    console.log('Select Campaña', selectedCampaign);
    if (
      selectedCampaign.processes &&
      selectedCampaign.processes[0] &&
      !selectedCampaign.processes[0].active
    ) {
      console.log('Select Campaña >', !selectedCampaign.processes[0].active);
      setCancelDisabled(true);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const goToUpdate = () => {
    console.log('Actualizando', selectedCampaign);
    Router.push({
      pathname: '/sample/crm/update',
      query: selectedCampaign,
    });
  };
  const handleClose2 = () => {
    setOpen2(false);
  };

  const setDeleteState = () => {
    setOpen2(true);
    handleClose();
  };
  const confirmDelete = () => {
    console.log('selected camapaña', selectedCampaign);
    console.log('id de selected', selectedCampaign.campaignId);
    deletePayload.request.payload.campaignId = selectedCampaign.campaignId;
    console.log('deletePayload', deletePayload);
    deleteCampaign(deletePayload);
    setOpenStatus(true);
    setOpen2(false);
  };

  const newCamp = () => {
    console.log('Para redireccionar a nuevo cliente');
    Router.push('/sample/crm/create');
  };

  // Paso 2: Función para filtrar las campañas por el nombre de la campaña
  const filterCampaigns = (searchText) => {
    if (!searchText) {
      setFilteredCampaigns(listCampaigns); // Si el valor del TextField está vacío, mostrar todas las campañas.
    } else {
      const filtered = listCampaigns.filter((campaign) =>
        campaign.campaignName.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredCampaigns(filtered);
    }
  };

  useEffect(() => {
    // Update filteredCampaigns when listCampaigns changes
    setFilteredCampaigns(listCampaigns);
  }, [listCampaigns, filteredCampaigns]);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectCampaign, setSelectCampaign] = useState(null);

  // Función para abrir el diálogo y guardar la información de la campaña seleccionada
  const handleClickOpenDialog = (campaign) => {
    setOpenDialog(true);
    setSelectCampaign(campaign);
  };

  const [dialogDetalleOpen, setDialogDetalleOpen] = useState(false);

  const [receiversCloud, setReceiversCloud] = useState([]);

  const handleVerDetalleClick = (url) => {
    console.log('LA URL', url);

    axios
      .get(url)
      .then((response) => {
        // Aquí tienes los datos obtenidos de la URL en response.data.
        console.log('Datos obtenidos:', response.data);

        const arregloFiltrado = response.data.receivers.filter(
          (objeto) => objeto.type !== 'tag',
        );
        setReceiversCloud(arregloFiltrado);
        // Finalmente, abre el diálogo.
        setDialogDetalleOpen(true);
      })
      .catch((error) => {
        // Si ocurre un error durante la llamada a la URL, puedes manejarlo aquí.
        console.error('Error al obtener datos:', error);
      });

    console.log('ReceiversCloud', receiversCloud);
  };

  const showMessage = () => {
    if (successMessage != '') {
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
            Se ha eliminado correctamente
          </DialogContentText>
        </>
      );
    } else if (errorMessage) {
      return (
        <>
          <CancelOutlinedIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            Se ha producido un error al eliminar.
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink />;
    }
  };

  const sendStatus = () => {
    setOpenStatus(false);
    setTimeout(() => {
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
      // listPayload.request.payload.LastEvaluatedKey = null;
      // dispatch({type: GET_CLIENTS, payload: {callType: "firstTime"}});
      getCampaign(listPayload);
    }, 2000);
  };

  return (
    <Card sx={{p: 4}}>
      <Stack
        sx={{m: 2}}
        direction={isMobile ? 'column' : 'row'}
        spacing={2}
        className={classes.stack}
      >
        <TextField
          label='Nombre de campaña'
          variant='outlined'
          name='nameToSearch'
          size='small'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Button startIcon={<FilterAltOutlinedIcon />} variant='outlined'>
          Más filtros
        </Button>
        <Button
          startIcon={<ManageSearchOutlinedIcon />}
          variant='contained'
          color='primary'
          onClick={() => filterCampaigns(searchValue)}
        >
          Buscar
        </Button>
      </Stack>
      <span>{`Items: ${
        filteredCampaigns ? filteredCampaigns.length : 'Cargando...'
      }`}</span>
      <TableContainer component={Paper} sx={{maxHeight: 440}}>
        <Table
          sx={{minWidth: 650}}
          stickyHeader
          size='small'
          aria-label='sticky table'
        >
          <TableHead>
            <TableRow>
              <TableCell>Fecha de creación</TableCell>
              <TableCell>Nombre de la campaña</TableCell>
              <TableCell>Contenido</TableCell>
              <TableCell>Fecha/Hora de envío</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>Total de receptores</TableCell>
              <TableCell>Plan de ejecución</TableCell>
              <TableCell>Activo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCampaigns?.map((row, index) => (
              <TableRow
                key={index}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
              >
                <TableCell>{convertToDate(row.createdAt)}</TableCell>
                <TableCell
                  component='th'
                  scope='row'
                  style={{maxWidth: '200px', wordWrap: 'break-word'}}
                >
                  {row.campaignName}
                </TableCell>
                <TableCell style={{maxWidth: '200px', wordWrap: 'break-word'}}>
                  {row.messages
                    .map((text) => text.text)
                    .join(' | ')
                    .slice(0, 300)}
                  {row.messages
                    .map((text) => {
                      // console.log('Tamaño', text.text.length);
                      return text.text;
                    })
                    .join(' | ').length > 300 && '...'}
                </TableCell>
                <TableCell>{convertToDate(row.scheduledAt)}</TableCell>
                <TableCell>
                  {row.messages[0].img_url ? (
                    <img
                      src={row.messages[0].img_url}
                      alt='Imagen'
                      width='100'
                      onError={(e) => {
                        e.target.style.display = 'none'; // Ocultar la etiqueta img en caso de error
                      }}
                    />
                  ) : null}
                </TableCell>
                <TableCell>
                  {Array.isArray(row.targetSummary)
                    ? row.targetSummary.find((item) => typeof item === 'number')
                    : row.targetSummary}
                </TableCell>
                <TableCell>
                  <Button
                    id='plan-button'
                    onClick={() => handleClickOpenDialog(row)}
                  >
                    <DehazeIcon />
                  </Button>
                </TableCell>
                <TableCell>
                  {row.processes && row.processes.length > 0 ? (
                    row.processes[0].active ? (
                      <CheckCircleOutlineOutlinedIcon
                        color='success'
                        sx={{fontSize: '2em', mx: 2}}
                      />
                    ) : (
                      <CancelOutlinedIcon
                        sx={{fontSize: '2em', mx: 2, color: red[500]}}
                      />
                    )
                  ) : row.active ? (
                    <CheckCircleOutlineOutlinedIcon
                      color='success'
                      sx={{fontSize: '2em', mx: 2}}
                    />
                  ) : (
                    <CancelOutlinedIcon
                      sx={{fontSize: '2em', mx: 2, color: red[500]}}
                    />
                  )}
                </TableCell>
                <TableCell>
                  {row.status == 'PENDING' ? (
                    <IntlMessages id='sidebar.sample.crm.pending' />
                  ) : (
                    <IntlMessages id='sidebar.sample.crm.finalized' />
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    id='basic-button'
                    aria-controls={openMenu ? 'basic-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={openMenu ? 'true' : undefined}
                    onClick={handleClick.bind(this, index)}
                  >
                    <KeyboardArrowDownIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ButtonGroup
        variant='outlined'
        aria-label='outlined button group'
        className={classes.btnGroup}
      >
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/campaigns/register') === true ? (
          <Button
            variant='outlined'
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={newCamp}
          >
            Nuevo
          </Button>
        ) : null}

        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/exportClients/*') === true ? (
          <Button
            variant='outlined'
            startIcon={<GridOnOutlinedIcon />}
            onClick={''}
          >
            Exportar todo
          </Button>
        ) : null}

        {!popUp ? <></> : <CircularProgress disableShrink sx={{m: '10px'}} />}
      </ButtonGroup>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          Información de la campaña
        </DialogTitle>
        <DialogContent>
          {/* Mostrar la información de la campaña seleccionada en el diálogo */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Orden</TableCell>
                <TableCell>Fecha/Hora</TableCell>
                <TableCell>Receptores</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>
                  {convertToDate(selectCampaign?.scheduledAt)}
                </TableCell>
                <TableCell>
                  {selectCampaign?.urlTargetClients ? (
                    <a
                      href='#'
                      onClick={() =>
                        handleVerDetalleClick(selectCampaign.urlTargetClients)
                      }
                    >
                      Ver Detalle
                    </a>
                  ) : (
                    'Ver Detalle'
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={() => setOpenDialog(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open2}
        onClose={handleClose2}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Eliminar campaña'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <PriorityHighIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            ¿Desea cancelar realmente la camapaña seleccionada?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={confirmDelete}>
            Sí
          </Button>
          <Button variant='outlined' onClick={handleClose2}>
            No
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog DEtalle */}

      {/*Respuesta */}
      <Dialog
        open={openStatus}
        onClose={sendStatus}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Eliminar Cliente'}
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
        open={dialogDetalleOpen}
        onClose={() => setDialogDetalleOpen(false)}
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='detail-dialog-title'>
          {'Detalle de Clientes'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          {/* Mostrar la información de la campaña seleccionada en el diálogo */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Orden</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido Paterno</TableCell>
                <TableCell>Apellido Materno</TableCell>
                <TableCell>Cumpleaños</TableCell>
                <TableCell>Número de Contacto</TableCell>
                <TableCell>Correo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {receiversCloud.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id ? row.id + 1 : 1}</TableCell>
                  <TableCell>{row.givenName}</TableCell>
                  <TableCell>{row.lastName}</TableCell>
                  <TableCell>{row.secondLastName}</TableCell>
                  <TableCell>{row.birthDay}</TableCell>
                  <TableCell>
                    {row.numberCountryCode + '-' + row.numberContact}
                  </TableCell>
                  <TableCell>{row.emailContact}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button
            variant='outlined'
            onClick={() => setDialogDetalleOpen(false)}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/campaigns/update') === true ? (
          <MenuItem onClick={goToUpdate}>
            <CachedIcon sx={{mr: 1, my: 'auto'}} />
            Clonar
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/campaigns/cancel') === true ? (
          <MenuItem onClick={setDeleteState} disabled={cancelDisabled}>
            <DeleteOutlineOutlinedIcon sx={{mr: 1, my: 'auto'}} />
            Cancelar
          </MenuItem>
        ) : null}
      </Menu>
    </Card>
  );
}
