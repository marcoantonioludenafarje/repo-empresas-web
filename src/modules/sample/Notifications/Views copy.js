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
import IntlMessages from '../../../@crema/utility/IntlMessages';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import CachedIcon from '@mui/icons-material/Cached';
import QrCodeIcon from '@mui/icons-material/QrCode';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ErrorIcon from '@mui/icons-material/Error';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import UnarchiveOutlinedIcon from '@mui/icons-material/UnarchiveOutlined';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ArrowCircleUpOutlinedIcon from '@mui/icons-material/ArrowCircleUpOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
// import {getNotifications, deleteNotifications} from '../../../redux/actions/Notification';
import {convertToDate} from '../../../Utils/utils';
import {useDispatch, useSelector} from 'react-redux';
import {updateNotificationBusinessParameter} from '../../../redux/actions/General';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
} from '../../../shared/constants/ActionTypes';
import Router from 'next/router';
import {red} from '@mui/material/colors';
import {verNotificaciones} from '../../../Utils/utils';
import {verTiposEventos} from '../../../Utils/utils';
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

let selectedNotification = {};
let deletePayload = {
  request: {
    payload: {
      notificationId: '',
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

  const [openQRPop, setopenQRPop] = React.useState(false);
  const [openQR, setopenQR] = React.useState(false);

  const [searchValue, setSearchValue] = useState('');
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const {businessParameter} = useSelector(({general}) => general);
  const [nelem, setNelem] = React.useState(0);
  const [listNotifications, setListNotifications] = React.useState("");
  const [listValidNotification, setListValidNotification] = React.useState([]);
  const [reload, setReload] = React.useState(0);
  console.log('businessParameter ', businessParameter);
  let popUp = false;

  //   const getNotification = (payload) => {
  //     dispatch(getNotifications(payload));
  //   };

  //   const deleteNotification = (payload) => {
  //     dispatch(deleteNotifications(payload));
  //   };

  const handleCloseQR2 = () => {
    setopenQRPop(false);
  };

  const reloadPage = () => {
    setReload(!reload);
  };

  const updateNotificationParameter = (payload) => {
    dispatch(updateNotificationBusinessParameter(payload));
  };
  const {userDataRes} = useSelector(({user}) => user);

  /*  const {
    listNotifications,
    agentsLastEvaluatedKey_pageListAgents,
  } = useSelector(({notifications}) => notifications);*/

  console.log('confeti los agentes', listNotifications[0]);

  const showMessage = () => {
    console.log('Mensaje QR');
  };
  useEffect(() => {

    if (!listNotifications || listNotifications.length === 0) {
      return;
    }
    if (listNotifications && listNotifications.length > 0) {
      let cont = 0;
      let listNotificacionModific = [];
      for (let item of listNotifications[0]) {
        if (Object.keys(item).length !== 0) {
          console.log(
            'Estre es el item',
            Object.keys(item).map((key) => console.log(item[key])),
          );
          const uuidPattern =
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
          let validNotification = Object.keys(item)
            .filter(
              (key) => typeof item[key] === 'object' && uuidPattern.test(key),
            )
            .map((key) => item[key]);
          if (validNotification.length > 0) {
            listNotificacionModific.push(validNotification);
          }
          console.log('Validation Notification', Object.keys(item));
          console.log('Validation Notification', validNotification);

          cont += Object.keys(item).filter(
            (key) => typeof item[key] === 'object' && uuidPattern.test(key),
          ).length;
        }
      }
      setNelem(cont);
      console.log('Este es el valid', listNotificacionModific);
      setListValidNotification(listNotificacionModific);
    }
  }, [listNotifications, reload]);

  useEffect(() => {
    if(businessParameter && businessParameter.length > 0){
      setListNotifications(verTiposEventos(businessParameter));
    }
  }, [businessParameter]);

  let codProdSelected = '';
  const [anchorEl, setAnchorEl] = React.useState(null);

  /* let anchorEl = null; */
  const openMenu = Boolean(anchorEl);
  console.log('ESTE ES EL OPENMENU', openMenu);
  const handleClick = (codPro, id, event, rowIndex) => {
    console.log('evento', event);
    console.log('index del map', codPro);
    console.log('ESTE ES EL ID', id);
    console.log('ESTE ES EL ROWINDEX', rowIndex);
    console.log('Este es el listNotificationsValid', listValidNotification);
    setAnchorEl(rowIndex.currentTarget);
    codProdSelected = codPro;
    selectedNotification = listValidNotification[id].filter((notification) => {
      return notification.eventId == codPro;
    });
    console.log('selectedNotification', selectedNotification);
    //listNotifications[codPro]; /* .find((obj) => obj.client == codPro); */
    console.log('Select Agente', selectedNotification);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const goToUpdate = () => {
    console.log('Actualizando', selectedNotification[0]);
    Router.push({
      pathname: '/sample/notifications/update',
      query: selectedNotification[0],
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
    console.log('selected agente', selectedNotification);
    console.log('id de selected', selectedNotification[0].eventId);
    deletePayload.request.payload.notificationId =
      selectedNotification.notificationId;
    console.log('deletePayload', deletePayload);
    //deleteNotification(deletePayload);
    let listUpdateNotifications = listNotifications[2];
    let listObjectNotification = listNotifications[1];
    console.log('LISTUPDATE COMPLETE', listUpdateNotifications);
    console.log('LIST OBJECTNOTIFICATION', listObjectNotification);
    let llavesGlobal = Object.keys(listObjectNotification);
    console.log('LLAVES GLOBALES', llavesGlobal);
    llavesGlobal.forEach((llave) => {
      console.log(
        'Este es el primer nivel',
        listObjectNotification[llave][selectedNotification[0].eventId],
      );
      if (
        listObjectNotification[llave][selectedNotification[0].eventId] ==
        selectedNotification[0]
      ) {
        console.log('id', selectedNotification[0].eventId);
        console.log(
          'LIST OBJECT NOTIFICATION',
          listObjectNotification[llave][selectedNotification[0].eventId],
        );
        delete listObjectNotification[llave][
          selectedNotification[0].eventId.toString()
        ];
      }
    });
    console.log('EL OBJECT NOTIFICATION MODIFICADO', listObjectNotification);
    let {value, ...otherTramaBusiness} = listUpdateNotifications;
    let nupdateNotificationPayload = {
      request: {
        payload: {
          ...otherTramaBusiness,
          value: listObjectNotification,
        },
      },
    };

    updateNotificationParameter(nupdateNotificationPayload);
    setOpen2(false);
    setOpenStatus(true);
    reloadPage();
  };

  const newNotification = () => {
    console.log('Para redireccionar a nueva notificacion');
    Router.push('/sample/notifications/create');
  };

  // Paso 2: Función para filtrar las campañas por el nombre de la campaña
  const filterNotifications = (searchText) => {};

  useEffect(() => {
    filterNotifications(searchValue);
  }, [searchValue]);

  return (
    <Card sx={{p: 4}}>
      <Stack
        sx={{m: 2}}
        direction={isMobile ? 'column' : 'row'}
        spacing={2}
        className={classes.stack}
      >
        <TextField
          label='Nombre notificación'
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
          // onClick={/*buscarAgente()*/}
        >
          Buscar
        </Button>
      </Stack>
      <span>{`Items: ${nelem != 0 ? nelem : 'Cargando...'}`}</span>
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
              <TableCell>Nombre</TableCell>
              <TableCell>Tipo de evento</TableCell>
              <TableCell>Canal</TableCell>
              <TableCell>Mensaje</TableCell>
              <TableCell>Periodicidad</TableCell>
              <TableCell>Agente</TableCell>
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listValidNotification.flatMap((component, index) =>
              component.map((row, rowIndex) => {
                let selectedChannel = row.channelSelected;
                console.log('ESTE ES EL VALID', listValidNotification);
                console.log('Este es el row', row, selectedChannel);
                return (
                  <TableRow
                    key={`${index}-${rowIndex}`}
                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  >
                    <TableCell>{convertToDate(row.createdAt)}</TableCell>
                    <TableCell
                      component='th'
                      scope='row'
                      style={{maxWidth: '200px', wordWrap: 'break-word'}}
                    >
                      {row.notificationName}
                    </TableCell>
                    <TableCell
                      style={{maxWidth: '200px', wordWrap: 'break-word'}}
                    >
                      {row.eventType}
                    </TableCell>
                    <TableCell
                      style={{maxWidth: '200px', wordWrap: 'break-word'}}
                    >
                      {row.channelSelected}
                    </TableCell>
                    <TableCell
                      style={{maxWidth: '200px', wordWrap: 'break-word'}}
                    >
                      {row.notificationsChannel[selectedChannel]?.template}
                    </TableCell>
                    <TableCell
                      style={{maxWidth: '200px', wordWrap: 'break-word'}}
                    >
                      {row.eventType === 'SCHEDULED'
                        ? `${row.notificationsChannel[selectedChannel]?.periodicityAction.time} ${row.notificationsChannel[selectedChannel]?.periodicityAction.unit}`
                        : null}
                    </TableCell>
                    <TableCell
                      style={{maxWidth: '200px', wordWrap: 'break-word'}}
                    >
                      {row.agentName}
                    </TableCell>
                    <TableCell>
                      <Button
                        id='basic-button'
                        aria-controls={openMenu ? 'basic-menu' : undefined}
                        aria-haspopup='true'
                        aria-expanded={openMenu ? 'true' : undefined}
                        onClick={handleClick.bind(
                          this,
                          row.eventId,
                          index,
                          rowIndex,
                        )}
                      >
                        <KeyboardArrowDownIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              }),
            )}
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
          .includes('/inventory/robot/register') === true ? (
          <Button
            variant='outlined'
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={newNotification}
          >
            Nuevo
          </Button>
        ) : null}

        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/exportRobots/*') === true ? (
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
        open={open2}
        onClose={handleClose2}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Eliminar agente'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <PriorityHighIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            ¿Desea eliminar realmente la información seleccionada?
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
          .includes('/inventory/robot/update') === true ? (
          <MenuItem onClick={goToUpdate}>
            <CachedIcon sx={{mr: 1, my: 'auto'}} />
            Actualizar
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/robot/delete') === true ? (
          <MenuItem onClick={setDeleteState}>
            <DeleteOutlineOutlinedIcon sx={{mr: 1, my: 'auto'}} />
            Eliminar
          </MenuItem>
        ) : null}
      </Menu>
    </Card>
  );
}
