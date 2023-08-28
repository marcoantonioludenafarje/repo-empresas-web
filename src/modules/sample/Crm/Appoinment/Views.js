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
  Menu,
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
import {getAppointment} from 'redux/actions';
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

  const {userDataRes} = useSelector(({user}) => user);
  const {listAppointments} = useSelector(({appointment}) => appointment);

  const [anchorElect, setAnchorElect] = useState(null);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [evently, setEvenly] = useState(null);
  const [listEvents, setListEvents] = useState(null);
  console.log('Estado cita', listAppointments);

  const eventsadd = listAppointments.map((cita) => ({
    id: cita.appointmentId,
    title: cita.appointmentDescription ? cita.appointmentDescription : '',
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
    setListEvents(datetocalendar);
    console.log('estado cita>>', datetocalendar);
  }, [listAppointments]);

  // const events = [
  //   {
  //     id: 1,
  //     title: 'Evento',
  //     start: new Date(2023, 7, 18, 14, 0),
  //     end: new Date(2023, 7, 18, 20, 0),
  //     desc: 'Una pequeña descripción',
  //     clientName: 'GREEN PRUEBA',
  //     duration: 60
  //   },
  //   {
  //     id: 2,
  //     title: 'Evento 3',
  //     start: new Date(2023, 7, 24, 14, 0),
  //     end: new Date(2023, 7, 24, 20, 0),
  //     desc: 'Una pequeña descripción',
  //     clientName: 'DARK MAGICIAN',
  //     duration: 30
  //   },
  //   {
  //     id: 3,
  //     title: 'Evento DARKEST',
  //     start: new Date(2023, 7, 15, 10, 0), // Año, mes (0-11), día, hora, minutos
  //     end: new Date(2023, 7, 15, 10, 45),
  //     desc: 'Una pequeña descripción',
  //     clientName: 'ACERTIJO',
  //     duration: 45
  //   },
  //   {
  //     id: 2163545641,
  //     title: 'Evento DARK',
  //     start: new Date(2023, 7, 15, 8, 0), // Año, mes (0-11), día, hora, minutos
  //     end: new Date(2023, 7, 15, 8, 45),
  //     desc: 'Una pequeña descripción',
  //     clientName: 'ACERTIJO',
  //     duration: 45
  //   },
  //   // Agrega más eventos aquí
  // ];

  const handleClick = (event, eventEl) => {
    setSelectedEvent(event);
    setAnchorElect(eventEl);
  };

  const handleClose = () => {
    setAnchorElect(null);
  };

  const handleMenuItemClick = (action, event) => {
    // Implement logic here based on the selected action (e.g., edit, delete, etc.)
    // You can use the selectedEvent to identify and perform actions on the event
    console.log('Selected action:', action, event);
    switch (action) {
      case 'edit':
        Router.push({
          pathname: '/sample/appointment/edit',
          query: event,
        });
        break;
      case 'delete':
        console.log('delete', action, event);
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
      {listEvents?.length ? (
        <Calendar
          localizer={localizer}
          events={listEvents.map((event) => ({
            ...event,
            title: (
              <Box sx={{position: 'relative'}}>
                <Typography variant='subtitle1'>{event.title}</Typography>
                <Button
                  aria-controls='event-menu'
                  aria-haspopup='true'
                  onClick={(e) => handleClick(event, e.currentTarget)}
                  sx={{position: 'absolute', top: 0, right: 0}}
                >
                  <ArrowCircleLeftOutlinedIcon />
                </Button>
                <Typography variant='body2'>{event.clientName}</Typography>
                <Typography variant='body2'>
                  Inicio: {moment(event.start).format('HH:mm')}
                </Typography>
                <Typography variant='body2'>
                  Duración: {event.duration} minutos
                </Typography>
                <Menu
                  id='event-menu'
                  anchorEl={anchorElect}
                  open={Boolean(anchorElect)}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={() => handleMenuItemClick('generate_attention')}
                  >
                    Generar Atención
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick('send_reminder')}
                  >
                    Envíar Recordatorio
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick('attended')}>
                    Atendido
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick('edit', event)}>
                    Editar
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleMenuItemClick('delete', event)}
                  >
                    Eliminar
                  </MenuItem>
                </Menu>
              </Box>
            ),
          }))}
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
          // components={{
          //   month: {
          //     event: EventMonthViews,
          //   },
          // }}
          style={{width: '95%', height: '80%', marginTop: 20, marginLeft: 25}}
        />
      ) : null}

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
      </ButtonGroup>
    </Card>
  );
};

export default Views;
