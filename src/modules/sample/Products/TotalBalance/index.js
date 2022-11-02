import React from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {alpha, Box} from '@mui/material';
import CoinsInfo from './CoinsInfo';
import {Fonts} from '../../../../shared/constants/AppEnums';
import AppCard from '../../../../@crema/core/AppCard';

const TotalBalance = ({totalBalanceData}) => {
  return (
    <Box>
      {/* <Box
        component='h2'
        sx={{
          color: 'text.primary',
          fontSize: 16,
          textTransform: 'uppercase',
          mb: {xs: 4, sm: 4, xl: 6},
          fontWeight: Fonts.BOLD,
        }}
      >
        <IntlMessages id='dashboard.totalBalance' />
      </Box> */}
      <AppCard sxStyle={{}}>
        <Box
          sx={{
            mb: {xs: 3, md: 6, xl: 8},
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              position: 'relative',
            }}
          >
            <Box
              component='h3'
              sx={{
                fontWeight: Fonts.MEDIUM,
                fontSize: 20,
              }}
            >
              {totalBalanceData.productDescription}
            </Box>
            {/* <Box
              component='p'
              sx={{
                color: 'text.secondary',
                fontSize: 14,
                whiteSpace: 'nowrap',
                mb: 1,
              }}
            >
              <IntlMessages id='dashboard.avlBalance' />
            </Box> */}
          </Box>
        </Box>

        <Box
          sx={{
            pt: {md: 2, lg: 3},
          }}
        >
          <CoinsInfo coins={totalBalanceData.coins} />
        </Box>
      </AppCard>
    </Box>
  );
};

export default TotalBalance;

TotalBalance.defaultProps = {
  totalBalanceData: {
    balance: '',
    coins: [],
  },
};

TotalBalance.propTypes = {
  totalBalanceData: PropTypes.object,
};
