import {Box, Typography} from '@mui/material';
import PropTypes from 'prop-types';

const CustomWeekEvent = ({event, onClick}) => {
  const clientWords = event.clientName.split(' ').slice(0, 2).join(' ');
  const backgroundColor = event.attention === 'Progress' ? 'green' : 'red';
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
      <Typography variant='body1' gutterBottom>
        {`${clientWords}`}
      </Typography>
    </Box>
  );
};

CustomWeekEvent.propTypes = {
  event: PropTypes.object,
  onClick: PropTypes.func,
};

export default CustomWeekEvent;
