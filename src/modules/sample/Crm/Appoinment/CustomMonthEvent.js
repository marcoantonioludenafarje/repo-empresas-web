import {Box, Typography} from '@mui/material';
import PropTypes from 'prop-types';
import moment from 'moment';

const CustomMonthEvent = ({event, onClick}) => {
  const clientWords = event.clientName.split(' ').slice(0, 2).join(' ');
  console.log('atention', event);
  const backgroundColor = event.attention === 'Progress' ? 'green' : 'red';
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        backgroundColor: backgroundColor,
        borderColor: backgroundColor,
        width: '100%',
      }}
    >
      <Typography variant='body1' gutterBottom>
        {`${event.title} - ${clientWords}`}
      </Typography>
      <Typography variant='body2'>
        {moment(event.start).format('LT')} - {`Duración: ${event.duration} min`}
      </Typography>
    </Box>
  );
};

CustomMonthEvent.propTypes = {
  event: PropTypes.object,
  onClick: PropTypes.func,
};

export default CustomMonthEvent;
