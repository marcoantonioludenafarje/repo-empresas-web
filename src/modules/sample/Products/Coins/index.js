import React from 'react';
import Grid from '@mui/material/Grid';
import CoinStats from './CoinStats';
import PropTypes from 'prop-types';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import Box from '@mui/material/Box';
import {Fonts} from '../../../../shared/constants/AppEnums';

const Coins = ({coinsData}) => {
  return (
    <Box>
      <Box
        component='h2'
        sx={{
          color: 'text.primary',
          textTransform: 'uppercase',
          fontSize: 16,
          mb: {xs: 4, sm: 4, xl: 6},
          fontWeight: Fonts.BOLD,
        }}
      >
        {/* <IntlMessages id='dashboard.coins' /> */}
      </Box>
      <Grid container spacing={{xs: 4, md: 8}}>
        <Grid item xs={12} sm={6}>
          <CoinStats
            icon={'/assets/images/bitcoin.svg'}
            bgColor='#9E49E6'
            data={coinsData.ingress}
            heading={<IntlMessages id='dashboard.ingress' />}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <CoinStats
            icon={'/assets/images/etherium.svg'}
            bgColor='#0A8FDC'
            data={coinsData.egress}
            heading={<IntlMessages id='dashboard.egress' />}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Coins;

Coins.defaultProps = {
  coinsData: {
    bitcoin: {
      price: '',
      increment: null,
    },
    etherium: {
      price: '',
      increment: null,
    },
    liteCoin: {
      price: '',
      increment: null,
    },
    ripple: {
      price: '',
      increment: null,
    },
  },
};

Coins.propTypes = {
  coinsData: PropTypes.object,
};
