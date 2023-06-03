import React from 'react';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import PropTypes from 'prop-types';
import {Box, ListItem, Typography, Badge} from '@mui/material';
import {Fonts} from '../../../shared/constants/AppEnums';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import {justDate, justTime} from '../../../Utils/utils';
import {useRouter} from 'next/router';
import red from '@mui/material/colors/red';
import green from '@mui/material/colors/green';
import cyan from '@mui/material/colors/cyan';
import {render} from 'react-dom';
import {
  GET_NOTIFICATIONS,
} from '../../../shared/constants/ActionTypes';
import {updateNotificationToSeen, updateOneOfTheListNotification} from '../../../redux/actions/Notifications';
import {useDispatch, useSelector} from 'react-redux';
import {
  convertToDate,
} from '../../../Utils/utils';
const NotificationItem = (props) => {
  const {item, closeNotifications} = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const goToOutput = (url) => {
    const urlToSimplify = url;
    const urlObject = new URL(urlToSimplify);
    const relativeURL = urlObject.pathname + urlObject.search;
    router.push(relativeURL);
  };
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
  //API FUNCTIONS
  const toUpdateNotificationToSeen = (payload, list) => {
    dispatch(updateNotificationToSeen(payload, list));
  };
  const toUpdateOneOfTheListNotification = (payload) => {
    dispatch(updateOneOfTheListNotification(payload));
  };
  const {userDataRes} = useSelector(({user}) => user);
  const {getNotificationsRes} = useSelector(({notifications}) => notifications);
  /*const convertToDate = (miliseconds) => {
    const fecha = new Date(miliseconds);
    const fecha_actual = `${fecha.getDate()}/${
      fecha.getMonth() < 10 ? `0${fecha.getMonth()}` : fecha.getMonth()
    }/${fecha.getFullYear()} - ${fecha.getHours()}:${fecha.getMinutes()}:${
      fecha.getSeconds() < 10 ? `0${fecha.getSeconds()}` : fecha.getSeconds()
    }`;
    return fecha_actual;
  };*/
  return (
    <ListItem
      sx={{
        padding: '8px 20px',
        mt: '2px',
        cursor: item.url ? 'pointer' : 'default',
        transition: 'box-shadow 0.3s',
        boxShadow: 'none',
        ':hover': {
          boxShadow: item.url ? '0px 0 0 5px rgba(0, 0, 0, 0.7)' : 'none',
        },
        position: 'relative',
        backgroundColor: item.seenBy ? 'transparent' : 'lightblue',
      }}
      className='item-hover'
      onClick={() => {
        const payloadToUpdate = {
          request: {
            payload: {
              notificationId: item.notificationId,
              userId: userDataRes.userId
            }
          }
        }
        closeNotifications();
        
        if(!item.seenBy || !item.seenBy.some(item => item == userDataRes.userId)){
          toUpdateNotificationToSeen(payloadToUpdate)
          //toUpdateOneOfTheListNotification(payloadToUpdate)
        }
        if(item.url){
          goToOutput(item.url)
        }
      }}
    >
      <Box
        sx={{
          fontSize: 14,
          color: (theme) => theme.palette.text.secondary,
          //backgroundColor: cyan[500],
        }}
      >
        {(!item.seenBy || !item.seenBy.some( item => item == userDataRes.userId)) && (
          <Badge
            color='primary' // Color azul para el Badge
            variant='dot' // Mostrar un punto en lugar de un número en el Badge
            sx={{
              position: 'absolute',
              top: '15%',
              right: '10px',
              transform: 'translateY(-50%)',
              width: '10px', // Ajustar el ancho del punto
              height: '10px', // Ajustar la altura del punto
              borderRadius: '50%', // Dar forma circular al punto
            }}
          />
        )}
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
          {item.userCreatedMetadata
            ? `Por: ${item.userCreatedMetadata.nombreCompleto}`
            : null}
        </Typography>
      </Box>
    </ListItem>
  );
};
export default NotificationItem;

NotificationItem.propTypes = {
  item: PropTypes.object.isRequired,
};
