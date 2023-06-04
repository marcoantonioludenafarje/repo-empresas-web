import React from 'react';
import {useThemeContext} from '../../../../utility/AppContextProvider/ThemeContextProvider';
import PropTypes from 'prop-types';
import {alpha, Box} from '@mui/material';
import Logo from '../../../../../assets/icon/bannerTuNexoInventarios.svg';
import Logo2 from '../../../../../assets/icon/tunexoLogo.svg';
import LogoText from '../../../../../assets/icon/logo_text.svg';
import {useRouter} from 'next/router';

import {useMediaQuery} from '@mui/material';

const AppLogo = () => {
  const {theme} = useThemeContext();
  const history = useRouter();

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

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
      {isMobile ? (
        <Box
          sx={{
            mt: 1,
            '& svg': {
              height: 50,
              width: 55,
            },
          }}
          onClick={() => history.replace('/sample/home')}
        >
          <Logo2 />
        </Box>
      ) : (
        <Box
          sx={{
            mt: 1,
            '& svg': {
              height: 70,
              width: 150,
            },
          }}
          onClick={() => history.replace('/sample/home')}
        >
          <Logo />
        </Box>
      )}
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

export default AppLogo;
AppLogo.propTypes = {
  color: PropTypes.string,
};
