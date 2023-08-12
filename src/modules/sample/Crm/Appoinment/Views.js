import React from 'react';
import {momentLocalizer, Views} from 'react-big-calendar';
//import events from '../events';
import moment from 'moment';
import {StyledCalendar} from '../calandar.style';



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

let allViews = Object.keys(Views).map((k) => Views[k]);

const ColoredDateCellWrapper = ({children}) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: 'lightblue',
    },
  });
const localizer = momentLocalizer(moment);
const BasicCalendar = () => {
  return (
    <StyledCalendar
      events={events}
      views={allViews}
      step={60}
      showMultiDayTimes
      defaultDate={new Date(2019, 10, 1)}
      components={{
        timeSlotWrapper: ColoredDateCellWrapper,
      }}
      localizer={localizer}
    />
  );
};

export default BasicCalendar;