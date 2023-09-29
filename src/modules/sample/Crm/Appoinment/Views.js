import React, {useEffect} from 'react';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
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
import {deleteAppointment, getAppointment} from 'redux/actions';
import {useState} from 'react';
import {convertToDate} from 'Utils/utils';


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

  const toGetAppointments = (payload) => {
    dispatch(getAppointment(payload));
  };

  const toDeleteAppointments = (payload) => {
    dispatch(deleteAppointment(payload));
  };

  const {userDataRes} = useSelector(({user}) => user);
  const {listAppointments} = useSelector(({appointment}) => appointment);

  const [anchorElect, setAnchorElect] = useState(null);
  const openMenu = Boolean(anchorElect);
  const [selectedEvent, setSelectedEvent] = useState(null);
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

    console.log('estado cita>>', datetocalendar);
    console.log('estado cita >>>>>', listEvents);
  }, [listAppointments]);
  let codProdSelected = '';

  const handleClick = (cita, event) => {
    console.log("cita elegida", cita);
    console.log("cita evento", event);
    setSelectedEvent(cita);
    setAnchorElect(event.currentTarget);
    console.log("cita puesta", anchorElect);
  };
  
  const handleClose = () => {
    setAnchorElect(null);
  };

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
        let delAppoint = {
          request: {
            payload: {
              appointmentId: event,
              merchantId: userDataRes.merchantSelected.merchantId,
            },
          },
        };
        console.log('delete >>', delAppoint);
        toDeleteAppointments(delAppoint);
        break;
      default:
        break;
    }

    handleClose();
  };

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
      console.log('getlist', listPayload);
      toGetAppointments(listPayload);
      // setFirstload(true);
    }
  }, [userDataRes]);

  const [filterTitle, setFilterTitle] = useState('');
  // const filteredEvents = events.filter(event =>
  //   event.title.toLowerCase().includes(filterTitle.toLowerCase())
  // );

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

  const CustomMonthEvent = ({ event, onClick }) => {
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
                    id='basic-button'
                    aria-controls={openMenu ? 'basic-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={openMenu ? 'true' : undefined}
                    onClick={handleClick.bind(event , event)}
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
        open={openMenu}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        //className={classes.menu}
        //style={{ marginLeft: '100px' }}
      >
        <MenuItem onClick={() => handleMenuItemClick(selectedEvent, 'generate_attention')}>
          Generar Atención
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick(selectedEvent, 'send_reminder')}>
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
