import React from 'react';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import PropTypes from 'prop-types';
import {Box, ListItem, Typography} from '@mui/material';
import {Fonts} from '../../../shared/constants/AppEnums';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

import red from '@mui/material/colors/red';
import green from '@mui/material/colors/green';
import cyan from '@mui/material/colors/cyan';
import {render} from 'react-dom';
const NotificationItem = (props) => {
  const {item} = props;
  console.log('Qué item es?', item);
  const renderSwitch = (item) => {
    switch (item.typeIcon.toLowerCase()) {
      case 'success':
        return <CheckCircleRoundedIcon style={{color: green[500]}} />;
      case 'info':
        return <InfoRoundedIcon style={{color: cyan[500]}} />;
      case 'alert':
        return <ErrorRoundedIcon style={{color: red[500]}} />;
      default:
        return <InfoRoundedIcon />;
    }
  };
  return (
    <ListItem
      sx={{
        padding: '8px 20px',
      }}
      className='item-hover'
    >
      <ListItemAvatar
        sx={{
          minWidth: 0,
          mr: 4,
        }}
      >
        {/* <Avatar
          sx={{
            width: 48,
            height: 48,
          }}
          alt='Remy Sharp'
          src={item.image}
        /> */}

        {/* {getNotificationsRes ? (
            getNotificationsRes.length
          ) : null} */}
        {renderSwitch(item)}
      </ListItemAvatar>
      <Box
        sx={{
          fontSize: 14,
          color: (theme) => theme.palette.text.secondary,
        }}
      >
        <Typography>
          <Box
            component='span'
            sx={{
              fontSize: 14,
              fontWeight: Fonts.MEDIUM,
              mb: 0.5,
              color: (theme) => theme.palette.text.primary,
              mr: 1,
              display: 'inline-block',
            }}
          >
            {item.title}:
          </Box>
          {item.message}
        </Typography>
      </Box>
    </ListItem>
  );
};

export default NotificationItem;

NotificationItem.propTypes = {
  item: PropTypes.object.isRequired,
};
