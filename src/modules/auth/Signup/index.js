import React from 'react';
import AuthWrapper from '../AuthWrapper';
import SignupAwsCognito from './SignupAwsCognito';
import AppLogo from '../../../@crema/core/AppLayout/components/AppLogo';

import IconButton from '@mui/material/IconButton';
import RequestIcon from '../../../assets/icon/requestIcon.svg';
import {
  Button,
  Card,
  Box,
  Typography,
  Grid,
  Link,
  Divider,
  ButtonGroup,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

const Signup = () => {
  return (
    <AuthWrapper>
      <Box sx={{width: '100%', maxHeight: '90%', overflowY: 'scroll'}}>
        <Box sx={{mb: {xs: 6, xl: 8}}}>
          <Box
            sx={{
              mb: 5,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <AppLogo />
            <Link
              sx={{
                ml: 5,
                '& svg': {
                  height: 35,
                  width: 35,
                },
              }}
              onClick={() => window.open('https://youtu.be/Ht__dbZOBJ0/')}
            >
              Ver Tutorial
              {/* <RequestIcon /> */}
            </Link>
          </Box>
        </Box>

        <SignupAwsCognito />
      </Box>
    </AuthWrapper>
  );
};

export default Signup;
