import {Box, Typography} from '@mui/material';
import PropTypes from 'prop-types';

const CustomDayEvent = ({event, onClick}) => {
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
      <Typography variant='body1' gutterBottom>
        {`${event.title} - ${clientWords} - Duración: ${event.duration} min`}
      </Typography>
    </Box>
  );
};

CustomDayEvent.propTypes = {
  event: PropTypes.object,
  onClick: PropTypes.func,
};

export default CustomDayEvent;
