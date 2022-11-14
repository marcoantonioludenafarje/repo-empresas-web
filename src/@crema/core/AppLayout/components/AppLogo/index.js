import React from 'react';
import {useThemeContext} from '../../../../utility/AppContextProvider/ThemeContextProvider';
import PropTypes from 'prop-types';
import {alpha, Box} from '@mui/material';
import Logo from '../../../../../assets/icon/bannerTuNexoInventarios.svg';
import LogoText from '../../../../../assets/icon/logo_text.svg';
import {useRouter} from 'next/router';

const AppLogo = () => {
  const {theme} = useThemeContext();

  const history = useRouter();
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
