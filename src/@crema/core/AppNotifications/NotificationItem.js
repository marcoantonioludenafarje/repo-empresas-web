import React from 'react';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import PropTypes from 'prop-types';
import {Box, ListItem, Typography} from '@mui/material';
import {Fonts} from '../../../shared/constants/AppEnums';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import {justDate, justTime} from '../../../Utils/utils';

import red from '@mui/material/colors/red';
import green from '@mui/material/colors/green';
import cyan from '@mui/material/colors/cyan';
import {render} from 'react-dom';
const NotificationItem = (props) => {
  const {item} = props;
  console.log('Qué item es?', item);
  const renderSwitch = (item) => {
    switch (item.typeIcon.toLowerCase()) {
      case 'pointofsaleicon':
        return <PointOfSaleIcon style={{color: green[500]}} />;
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
  const convertToDate = (miliseconds) => {
    const fecha = new Date(miliseconds);
    const fecha_actual = `${fecha.getDate()}/${
      fecha.getMonth() < 10 ? `0${fecha.getMonth()}` : fecha.getMonth()
    }/${fecha.getFullYear()} - ${fecha.getHours()}:${fecha.getMinutes()}:${
      fecha.getSeconds() < 10 ? `0${fecha.getSeconds()}` : fecha.getSeconds()
    }`;
    return fecha_actual;
  };
  return (
    <ListItem
      sx={{
        padding: '8px 20px',
      }}
      className='item-hover'
    >
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
            {item.title}({item.numberOfProducts || 0}):
          </Box>
          {item.message}
          <ListItemAvatar
            sx={{
              padding: '5px 5px',
              minWidth: 0,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {renderSwitch(item)}
            {`${convertToDate(item.createdAt)}`}
          </ListItemAvatar>
          {item.userCreatedMetadata ? `Por: ${item.userCreatedMetadata.nombreCompleto}` : null}
        </Typography>
      </Box>
    </ListItem>
  );
};
export default NotificationItem;

NotificationItem.propTypes = {
  item: PropTypes.object.isRequired,
};
