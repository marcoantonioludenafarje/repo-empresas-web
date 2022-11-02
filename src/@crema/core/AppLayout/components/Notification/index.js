import React from 'react';
import {useThemeContext} from '../../../../utility/AppContextProvider/ThemeContextProvider';
import PropTypes from 'prop-types';
import {alpha, Box} from '@mui/material';
import Logo from '../../../../../assets/icon/bannerTuNexoInventarios.svg';
import LogoText from '../../../../../assets/icon/logo_text.svg';
import CloseIcon from '@mui/icons-material/Close';

import MenuIcon from '@mui/icons-material/Close';

import IconButton from '@mui/material/IconButton';
const Notification = () => {
  const {theme} = useThemeContext();

  return (
    <Box
      sx={
        {
          /* height: {xs: 56, sm: 70},
        padding: 2.5,
        display: 'flex',
        flexDirection: 'row',
        cursor: 'pointer',
        alignItems: 'center',
        justifyContent: 'center',
        '& svg': {
          height: {xs: 30, sm: 40},
        }, */
        }
      }
      className='app-logo'
    >
      {/* <Box
        sx={{
          mt: 1,
          '& svg': {
            height: 70,
            width: 150,
          },
        }}
      >
        <Logo />
      </Box> */}

      <IconButton
        sx={{
          color: 'text.secondary',
        }}
        edge='start'
        className='menu-btn'
        color='inherit'
        aria-label='open drawer'
        onClick={() => dispatch(toggleNavCollapsed())}
        size='large'
      >
        <MenuIcon
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* <Box
        sx={{
          mt: 1,
          '& svg': {
            height: {xs: 25, sm: 30},
          },
        }}
      >
        <LogoText fill={alpha(theme.palette.text.primary, 0.8)} />
      </Box> */}
    </Box>
  );
};

export default Notification;
Notification.propTypes = {
  color: PropTypes.string,
};
