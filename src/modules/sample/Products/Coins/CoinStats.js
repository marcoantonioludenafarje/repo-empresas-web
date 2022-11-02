import React from 'react';
import Avatar from '@mui/material/Avatar';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import {green, red} from '@mui/material/colors';
import {Fonts} from '../../../../shared/constants/AppEnums';
import AppCard from '../../../../@crema/core/AppCard';

const CoinStats = (props) => {
  const {icon, bgColor, data, heading} = props;

  return (
    <AppCard
      sxStyle={{
        borderRadius: (theme) =>
          theme.components.MuiCard.styleOverrides.root.borderRadius / 4,
      }}
      className='card-hover'
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Avatar
          sx={{
            p: 3,
            fontSize: {xs: 30, md: 48},
            height: {xs: 46, md: 50, xl: 60},
            width: {xs: 46, md: 50, xl: 60},
            backgroundColor: bgColor,
          }}
        >
          <img alt='' src={icon} />
        </Avatar>

        <Box
          sx={{
            position: 'relative',
            ml: 4,
          }}
        >
          <Box
            component='p'
            sx={{
              fontSize: 14,
              color: 'text.secondary',
              mb: 2,
            }}
          >
            {heading}
          </Box>
          <Box
            component='h3'
            sx={{
              display: 'inline-block',
              fontWeight: Fonts.MEDIUM,
              fontSize: 17,
              mr: 3,
            }}
          >
            Max: {data.maxPrice}
          </Box>
          <Box
            component='h3'
            sx={{
              display: 'inline-block',
              fontWeight: Fonts.MEDIUM,
              fontSize: 17,
              mr: 3,
            }}
          >
            Min: {data.minPrice}
          </Box>
        </Box>
      </Box>
    </AppCard>
  );
};

export default CoinStats;

CoinStats.defaultProps = {
  bgColor: '',
  data: {
    price: '',
    increment: null,
  },
};

CoinStats.propTypes = {
  icon: PropTypes.string,
  bgColor: PropTypes.string,
  data: PropTypes.object,
  heading: PropTypes.any.isRequired,
};
