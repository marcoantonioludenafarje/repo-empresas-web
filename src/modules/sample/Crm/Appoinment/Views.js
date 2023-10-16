import React, {useEffect} from 'react';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
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
  FormControlLabel,
  Checkbox,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Menu,
  Paper
} from '@mui/material';

import {makeStyles} from '@mui/styles';
import 'moment/locale/es';

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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
} from '../../../../shared/constants/ActionTypes';
import Router, {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {deleteAppointment, getAppointment, newAttention, updateAppointment} from 'redux/actions';
import {useState} from 'react';
import {convertToDate} from 'Utils/utils';

import {ClickAwayListener} from '@mui/base';
import {red} from '@mui/material/colors';

const localizer = momentLocalizer(moment);

const useStyles = makeStyles((theme) => ({
  btnGroup: {
    marginTop: '1.5rem',
  },
  btnSplit: {
    display: 'flex',
    justifyContent: 'center',
  },
  stack: {
    justifyContent: 'center',
    marginBottom: '10px',
  },
  menu:{
    position: 'absolute'
  }
}));

const newCamp = () => {
  console.log('Para redireccionar a nuevo cliente');
  Router.push('/sample/appointment/create');
};

const Views = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const router = useRouter();
  const DragAndDropCalendar = withDragAndDrop(Calendar);

  const toGetAppointments = (payload) => {
    dispatch(getAppointment(payload));
  };

  const toDeleteAppointments = (payload) => {
    dispatch(deleteAppointment(payload));
  };

  const toCreateAttention = (payload) =>{
    dispatch(newAttention(payload))
  }

  const {userDataRes} = useSelector(({user}) => user);
  const {listAppointments} = useSelector(({appointment}) => appointment);
  const {successMessage} = useSelector(({appointment}) => appointment);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({appointment}) => appointment);
  console.log('errorMessage', errorMessage);
  
  const toEditAppointment = (payload) => {
    dispatch(updateAppointment(payload));
  };


  const [open2, setOpen2] = useState(false);
  const [openAten, setOpenAten] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [contextMenu, setContextMenu] = React.useState(null);
  const [anchorElect, setAnchorElect] = useState(null);
  const openMenu = Boolean(anchorElect);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const handleCloseAgendaMenu = () => {
    setContextMenu(null);
  };
  const [evently, setEvenly] = useState(null);
  const [listEvents, setListEvents] = useState([]);
  console.log('Estado cita', listAppointments);

  const eventsadd = listAppointments.map((cita) => ({
    id: cita.appointmentId,
    title: cita.appointmentTitle ? cita.appointmentTitle : '',
    start: cita.scheduledStartedAt
      ? convertToDate(cita.scheduledStartedAt)
      : new Date(2023, 7, 22, 6, 0),
    end: cita.scheduledFinishedAt
      ? convertToDate(cita.scheduledFinishedAt)
      : new Date(
          new Date(2023, 7, 22, 10, 0).getTime() + cita.duration * 60000,
        ),
    desc: cita.appointmentDescription
      ? cita.appointmentDescription
      : 'description',
    clientName: cita.clientName ? cita.clientName : 'Client',
    duration: cita.duration,
    attention: cita.attention,
  }));

  function convertStringToDate(dateString) {
    const [datePart, timePart] = dateString.split(' - ');
    const [day, month, year] = datePart.split('/');
    const [hours, minutes, seconds] = timePart.split(':');
    return new Date(year, month - 1, day, hours, minutes, seconds);
  }

  const datetocalendar = eventsadd.map((cita) => ({
    ...cita,
    start: convertStringToDate(cita.start),
    end: convertStringToDate(cita.end),
  }));

  useEffect(() => {
    if (datetocalendar) {
      setListEvents(datetocalendar);
    } else {
      setListEvents([]);
    }

    console.log('estado cita xda >>', datetocalendar);
    console.log('estado cita xd >>>>>', listEvents);
  }, [listAppointments]);
  let codProdSelected = '';

  const handleClick = (cita, event) => {
    console.log("cita elegida", cita);
    console.log("cita evento", event);
    setSelectedEvent(cita);
    setAnchorElect(event.currentTarget);
    console.log("cita puesta", event.currentTarget);
  };
  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null,
    );
  };

  const handleClose = () => {
    setAnchorElect(null);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const [aux, setAux] = useState(null)

  const handleMenuItemClick = (event, action) => {
    console.log('Selected action, id:', action, event);
    switch (action) {
      case 'edit':
        Router.push({
          pathname: '/sample/appointment/edit',
          query: event,
        });
        break;
      case 'delete':
        console.log('delete, id', action, event);
        setOpen2(true);
        setAux(event)
        //toDeleteAppointments(delAppoint);
        break;
      case 'generate_attention':
        console.log('atendido, id', action, event);
        let citagenerada = listAppointments.find((cita)=> cita.appointmentId === event.id)
        // let letpayloadgene={
        //   request:{
        //     payload:{
        //       ...cita,
        //       merchantId: userDataRes.merchantSelected.merchantId,
        //     }
        //   }
        // }
        console.log("generar>>", citagenerada);
        router.push('/sample/attentions/update', { query: citagenerada.appointmentId });
        break;
      case 'attended':
        console.log('atendido, id', action, event);
        let cita = listAppointments.find((cita)=> cita.appointmentId === event.id)
        setOpen2(true);
        setAux(event)
        break;
        
      default:
        break;
    }

    handleClose();
  };

  const confirmattention = () => {
    console.log('selected attention', aux);
    let citaval = listAppointments.find((cita)=>cita.appointmentId === aux.id)
    let letpayload={
      request:{
        payload:{
          ...citaval,
          attention: 'Completed',
          merchantId: userDataRes.merchantSelected.merchantId,
        }
      }
    }
    
    console.log("edit>>", letpayload);
    toEditAppointment(letpayload)
    console.log('selected attention>>', citaval);
    let geneattention = {
      request: {
        payload: {
          merchantId: userDataRes.merchantSelected.merchantId,
          attentions:[{
            attentionTitle: citaval.appointmentTitle,
            clientId: citaval.clientId,
            clientName: citaval.clientName,
            specialistId: citaval.specialistId,
            specialistName: citaval.specialistName,
            attentionDescription: citaval.appointmentDescription,
            scheduledStartedAt: citaval.scheduledStartedAt,
            duration: citaval.duration,
            durationUnited: citaval.durationUnited,
            scheduledFinishedAt: citaval.scheduledFinishedAt,
            notifications: citaval.notifications
          }]
        },
      },
    };
    console.log("payload", geneattention);
    toCreateAttention(geneattention);
    setOpenStatus(true);
    setOpen2(false);
    setAux(null);
    router.push('/sample/attentions/table')
  };


  const confirmCancel = () => {
    console.log('selected cita', aux);;
    let delAppoint = {
      request: {
        payload: {
          appointmentId: aux.id,
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };
    console.log("payload", delAppoint);
    toDeleteAppointments(delAppoint);
    setOpenStatus(true);
    setOpen2(false);
    setAux(null)
  };

  const sendStatus = () => {
    setOpenStatus(false);
    setTimeout(() => {
      let listPayload = {
        request: {
          payload: {
            merchantId: userDataRes.merchantSelected.merchantId,
            LastEvaluatedKey: null,
          },
        },
      };
      // listPayload.request.payload.LastEvaluatedKey = null;
      // dispatch({type: GET_CLIENTS, payload: {callType: "firstTime"}});
      toGetAppointments(listPayload)

      //setListEvents(listAppointments);
      console.log("estado cita >>>>>", listEvents);
    }, 2000);
  };

  useEffect(() => {
    console.log('Estamos userDataRes', userDataRes);
    if (
      userDataRes &&
      userDataRes.merchantSelected &&
      userDataRes.merchantSelected.merchantId
    ) {
      console.log('Estamos entrando al getCitas');
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
      console.log('getlist', listPayload);
      toGetAppointments(listPayload);
      // setFirstload(true);
    }
  }, [userDataRes]);

  const [filterTitle, setFilterTitle] = useState('');
  // const filteredEvents = events.filter(event =>
  //   event.title.toLowerCase().includes(filterTitle.toLowerCase())
  // );

  const handleClickAway = () => {
    // Evita que se cierre el diálogo haciendo clic fuera del contenido
    // Puedes agregar condiciones adicionales aquí si deseas una lógica más específica.
  };
  const handleFilterNameDescription = (title) => {
    if (title === '') {
      setListEvents(datetocalendar);
    } else {
      const filteredEvents = listEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(title.toLowerCase()) ||
          event.desc.toLowerCase().includes(title.toLowerCase()),
      );
      if (filteredEvents.length > 0) {
        setListEvents(filteredEvents);
      } else {
        setListEvents([]);
      }
    }
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
            Se ha cancelado correctamente
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
            Se ha producido un error al cancelar.
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink />;
    }
  };

  const CustomMonthEvent = ({ event, onClick }) => {
    const clientWords = event.clientName.split(' ').slice(0, 2).join(' ');
    console.log("atention", event);
    const backgroundColor = event.attention==='Progress' ? 'green' : 'red';
    return (
      <Box
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          backgroundColor: backgroundColor,
          borderColor: backgroundColor,
          width: '100%'
        }}
      >
        <Typography variant="body1" gutterBottom>
          {`${event.title} - ${clientWords}`}
        </Typography>
        <Typography variant="body2">
          {moment(event.start).format('LT')} - {`Duración: ${event.duration} min`}
        </Typography>
      </Box>
    );
  };

  const CustomWeekEvent = ({event, onClick}) =>{
    const clientWords = event.clientName.split(' ').slice(0, 2).join(' ');
    const backgroundColor = event.attention==='Progress' ? 'green' : 'red';
    return (
      <Box
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          // backgroundColor: backgroundColor,
          '&:hover': {
            backgroundColor: 'transparent', 
          },
        }}
      >
        <Typography variant="body1" gutterBottom>
          {`${clientWords}`}
        </Typography>
      </Box>
    );
  }

  const CustomDayEvent = ({event, onClick}) =>{
    const clientWords = event.clientName.split(' ').slice(0, 2).join(' ');
    return (
      <Box
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'transparent', 
          },
        }}
      >
        <Typography variant="body1" gutterBottom>
        {`${event.title} - ${clientWords} - Duración: ${event.duration} min`}
        </Typography>
      </Box>
    );
  }

  const CustomAgenda = ({event}) => {
    console.log("eventos", event);
    return (
      <TableContainer component={Paper}>
        <Table
          sx={{minWidth: 650}}
          stickyHeader
          size='small'
          aria-label='sticky table'
        >
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Duración</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Descripción</TableCell> 
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            
            {console.log("evento", event)}
                <TableRow key={event.id}
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                <TableCell>{event.clientName}</TableCell>
                <TableCell>{event.duration}</TableCell>
                <TableCell>{event.title}</TableCell>
                <TableCell>{event.desc}</TableCell>
                <TableCell>
                  <Button
                    id={`agendaButton-${event.id}`}
                    onClick={(event2) => {
                      handleContextMenu(event2)
                      setSelectedEvent(event);
                    }} 
                    style={{ cursor: 'pointer' }}
                  >
                    <KeyboardArrowDownIcon />
                  </Button>
                </TableCell>
              </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Card>
      <TextField
        label='Filtrar por título'
        value={filterTitle}
        onChange={(e) => setFilterTitle(e.target.value)}
        variant='outlined'
        margin='dense'
        size='small'
      />
      <Button
        variant='contained'
        onClick={() => handleFilterNameDescription(filterTitle)}
      >
        Aplicar Filtro
      </Button>
      {
        <Calendar
          localizer={localizer}
          events={listEvents}
          onSelectEvent={handleClick}
          startAccessor='start'
          endAccessor='end'
          messages={{
            today: 'Hoy',
            previous: 'Antes',
            next: 'Después',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
            agenda: 'Agenda',
            date: 'Fecha', // Ejemplo de etiqueta personalizada
            time: 'Tiempo',
            event: 'Evento',
            noEventsInRange: 'No hay eventos en este rango.',
          }}
          //views={['month','week','day','agenda']}
          components={{
            month: {
              event: CustomMonthEvent
            },
            week:{
              event: CustomWeekEvent
            },
            day:{
              event: CustomDayEvent
            },
            agenda:{
              event: CustomAgenda
            }
          }} 
          // components={{
          //   month: {
          //     event: EventMonthViews,
          //   },
          // }}
          // className={xstyles}
          style={{
            width: '95%',
            height: '80%',
            marginTop: 20,
            marginLeft: 25,
            cursor: 'pointer',
          }}
        />
      }

      <Menu
        id='event-menu'
        anchorEl={anchorElect}
        open={openMenu || contextMenu!==null}
        onClose={contextMenu!==null ? handleCloseAgendaMenu : handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        anchorReference={contextMenu!==null ? "anchorPosition" : ""}
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => handleMenuItemClick(selectedEvent, 'generate_attention')}>
          Generar Atención
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick(selectedEvent, 'send_reminder')} disabled>
          Envíar Recordatorio
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick(selectedEvent, 'attended')}>
          Atendido
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick(selectedEvent, 'edit')}>
          Editar
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick(selectedEvent, 'delete')}>
          Eliminar
        </MenuItem>
      </Menu>

      <Dialog
        open={open2}
        onClose={handleClose2}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Atención de Cita'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <PriorityHighIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            ¿Desea generar una atención rápida?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={confirmattention}>
            Sí
          </Button>
          <Button variant='outlined' onClick={handleClose2}>
            No
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog DEtalle */}
      <Dialog
        open={openAten}
        onClose={handleClose}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Atender Cita'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <PriorityHighIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            ¿Desea eliminar realmente la cita seleccionada?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={confirmCancel}>
            Sí
          </Button>
          <Button variant='outlined' onClick={handleClose2}>
            No
          </Button>
        </DialogActions>
      </Dialog>
      {/*Respuesta */}
      <ClickAwayListener onClickAway={handleClickAway}>
        <Dialog
          open={openStatus}
          onClose={sendStatus}
          sx={{textAlign: 'center'}}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
            {'Gestión de Citas'}
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
      </ClickAwayListener>

      <ButtonGroup
        variant='outlined'
        aria-label='outlined button group'
        className={classes.btnGroup}
      >
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/appointments/register') === true ? (
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
          .includes('/inventory/exportAppointments/*') === true ? (
          <Button
            variant='outlined'
            startIcon={<GridOnOutlinedIcon />}
            onClick={''}
          >
            Exportar todo
          </Button>
        ) : null}
      </ButtonGroup>
    </Card>
  );
};

export default Views;
