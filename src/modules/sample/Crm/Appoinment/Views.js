import React, {useEffect} from 'react';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {Card, ButtonGroup, Button} from '@mui/material';

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
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
} from '../../../../shared/constants/ActionTypes';

import {useDispatch, useSelector} from 'react-redux';

const localizer = momentLocalizer(moment);

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

const newCamp = () => {
  console.log('Para redireccionar a nuevo cliente');
  Router.push('/sample/appointment/create');
};

const events = [
  {
    title: 'Evento 1',
    start: new Date(2023, 7, 15, 10, 0), // Año, mes (0-11), día, hora, minutos
    end: new Date(2023, 7, 15, 12, 0),
  },
  {
    title: 'Evento 2',
    start: new Date(2023, 7, 16, 14, 0),
    end: new Date(2023, 7, 16, 16, 0),
  },
  // Agrega más eventos aquí
];

const Views = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();

  const {userDataRes} = useSelector(({user}) => user);

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
      //getCampaign(listPayload);
      // setFirstload(true);
    }
  }, [userDataRes]);

  let popUp = false;
  return (
    <Card>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor='start'
        endAccessor='end'
        messages={{
          today: 'Hoy',
          next: 'Después',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
          date: 'Fecha', // Ejemplo de etiqueta personalizada
        }}
        style={{margin: 20}}
      />
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
    </Card>
  );
};

export default Views;
