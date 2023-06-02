import React, {useEffect} from 'react';
import notification from '@crema/services/db/notifications';
import {IconButton} from '@mui/material';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import AppScrollbar from '@crema/core/AppScrollbar';
import IntlMessages from '@crema/utility/IntlMessages';
import NotificationItem from './NotificationItem';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// import Router, {useRouter} from 'next/router';
// import {
//   FETCH_SUCCESS,
//   FETCH_ERROR,
//   GET_NOTIFICATIONS,
// } from '../../../shared/constants/ActionTypes';
// import {
//   getNotifications,
// } from '../../../redux/actions/Notifications';
// import {useDispatch, useSelector} from 'react-redux';
// let listNotificationsPayload = {
//   request: {
//     payload: {
//       merchantId: "234c700def184fa0b5db9e8adc78ad61",
//     },
//   },
// };

const AppNotificationContent = ({onClose, sxStyle, data}) => {
  // const dispatch = useDispatch();
  // const router = useRouter();
  // const {query} = router;
  // //API FUNCTIONS
  // const toGetNotifications = (payload) => {
  //   dispatch(getNotifications(payload));
  // };
  // //GET APIS RES
  // const {getNotificationsRes} = useSelector(({notifications}) => notifications);
  // console.log('getNotificationsRes', getNotificationsRes);
  // useEffect(() => {
  //   dispatch({type: GET_NOTIFICATIONS, payload: undefined});
  //   // if (Object.keys(query).length !== 0) {
  //   //   console.log('Query con datos', query);
  //   //   listPayload.request.payload.notificationId = query.notificationId;
  //   // }
  //   toGetNotifications(listNotificationsPayload);
  // }, []);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: 280,
        height: '100%',
        ...sxStyle,
      }}
    >
      <Box
        sx={{
          padding: '5px 20px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: 1,
          borderBottomColor: (theme) => theme.palette.divider,
          minHeight: {xs: 56, sm: 70},
        }}
      >
        <Typography component='h3' variant='h3'>
          <IntlMessages id='common.notifications' />:{' '}
          {data ? data.length : null}
        </Typography>
        <IconButton
          sx={{
            height: 40,
            width: 40,
            marginLeft: 'auto',
            color: 'text.secondary',
          }}
          onClick={onClose}
          size='large'
        >
          <CancelOutlinedIcon />
        </IconButton>
      </Box>
      <AppScrollbar
        sx={{
          height: {xs: 'calc(100% - 96px)', sm: 'calc(100% - 110px)'},
        }}
      >
        {data && data.length !== 0 ? (
          <List sx={{py: 0, mt: '2px'}}>
            {data
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((item, index) => (
                <NotificationItem key={index} item={item} />
              ))}
          </List>
        ) : null}
      </AppScrollbar>
      <Button
        sx={{
          borderRadius: 0,
          width: '100%',
          textTransform: 'capitalize',
          marginTop: 'auto',
          height: 40,
        }}
        variant='contained'
        color='primary'
      >
        <IntlMessages id='common.viewAll' />
      </Button>
    </Box>
  );
};

export default AppNotificationContent;

AppNotificationContent.propTypes = {
  onClose: PropTypes.func,
  sxStyle: PropTypes.object,
  data: PropTypes.array,
};
