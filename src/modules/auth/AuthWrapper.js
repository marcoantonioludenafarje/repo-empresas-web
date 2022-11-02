import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import {Typography} from '@mui/material';
import {Fonts} from '../../shared/constants/AppEnums';
import AppPageMeta from '../../@crema/core/AppPageMeta';

const AuthWrapper = ({children}) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          minHeight: {xs: 320, sm: 450},
          width: '100%',
          /* overflow: 'scroll', */
          position: 'relative',
          display: 'flex',
        }}
      >
        <Box
          sx={{
            width: {xs: '100%', sm: '100%', lg: '100%'},
            padding: {xs: 5, lg: 10},
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <AppPageMeta />
          {children}
        </Box>
        {/* <Box
          sx={{
            width: {xs: '100%', sm: '50%', lg: '50%'},
            position: 'relative',
            padding: {xs: 5, lg: 10},
            display: {xs: 'none', sm: 'flex'},
            alignItems: {sm: 'center'},
            justifyContent: {sm: 'center'},
            flexDirection: {sm: 'column'},
            backgroundColor: (theme) => theme.palette.grey[900],
            color: (theme) => theme.palette.common.white,
            fontSize: 14,
          }}
        >
          <Box
            sx={{
              maxWidth: 320,
            }}
          >
            <Typography
              component='h2'
              sx={{
                fontWeight: Fonts.BOLD,
                fontSize: 30,
                mb: 4,
              }}
            >
              Bienvenido!
            </Typography>
            <Typography>
              Somos TuNexo. Tu aliado para la gestión de inventario de tus productos
            </Typography>
          </Box>
        </Box> */}
      </Card>
    </Box>
  );
};

export default AuthWrapper;

AuthWrapper.propTypes = {
  children: PropTypes.node,
};
