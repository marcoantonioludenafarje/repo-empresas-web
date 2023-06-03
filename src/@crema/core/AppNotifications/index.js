import React, {useState} from 'react';
import {useEffect} from 'react';
import {IconButton, Badge} from '@mui/material';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppNotificationContent from './AppNotificationContent';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AppTooltip from '../AppTooltip';
import {alpha} from '@mui/material/styles';
import NotificationEmpty from '../../../assets/icon/notificationEmpty.svg';
import NotificationNonEmpty from '../../../assets/icon/notificationNonEmpty.svg';
import Router, {useRouter} from 'next/router';
import {getUserData} from '../../../redux/actions/User';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
  GET_NOTIFICATIONS,
} from '../../../shared/constants/ActionTypes';
import {getNotifications} from '../../../redux/actions/Notifications';
import {useDispatch, useSelector} from 'react-redux';
let listNotificationsPayload = {
  request: {
    payload: {
      merchantMasterId: '',
    },
  },
};
//FORCE UPDATE
const useForceUpdate = () => {
  const [reload, setReload] = React.useState(0); // integer state
  return () => setReload((value) => value + 1); // update the state to force render
};
const AppNotifications = ({
  drawerPosition,
  tooltipPosition,
  isMenu,
  sxNotificationContentStyle,
}) => {
  const [showNotification, setShowNotification] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  //API FUNCTIONS
  const toGetNotifications = (payload) => {
    dispatch(getNotifications(payload));
  };
  const forceUpdate = useForceUpdate();
  //GET APIS RES
  const {getNotificationsRes} = useSelector(({notifications}) => notifications);
  console.log('getNotificationsRes', getNotificationsRes);
  let getActiveNotifications;
  const {userDataRes} = useSelector(({user}) => user);

  useEffect(() => {
    if (!userDataRes) {
      console.log('Esto se ejecuta notificaciones?');

      const toGetUserData = (payload) => {
        dispatch(getUserData(payload));
      };
      let getUserDataPayload = {
        request: {
          payload: {
            userId: JSON.parse(localStorage.getItem('payload')).sub,
          },
        },
      };

      toGetUserData(getUserDataPayload);
    }
  }, []);
  useEffect(() => {
    if (userDataRes) {
      dispatch({type: GET_NOTIFICATIONS, payload: undefined});
      // if (Object.keys(query).length !== 0) {
      //   console.log('Query con datos', query);
      //   listPayload.request.payload.notificationId = query.notificationId;
      // }
      listNotificationsPayload.request.payload.merchantId =
        userDataRes.merchantMasterId;
      listNotificationsPayload.request.payload.userId = userDataRes.userId;
      toGetNotifications(listNotificationsPayload);
      getActiveNotifications = getNotificationsRes;
    }
  }, [userDataRes]);

  useEffect(()=>{
    forceUpdate()
  },[getNotificationsRes])
  // A modificar
  //Esto se debe de mejorar añadiendo un index para merchantMasterId, por mientras es así

  return (
    <>
      {isMenu ? (
        <></>
      ) : (
        <AppTooltip title='Notification' placement={tooltipPosition}>
          <IconButton
            className='icon-btn'
            sx={{
              mt: 3,
              '& svg': {
                height: 35,
                width: 35,
              },
              color: (theme) => theme.palette.text.secondary,
              border: 1,
              borderColor: 'transparent',
            }}
            onClick={() => setShowNotification(true)}
            size='large'
          >
            {getNotificationsRes && getNotificationsRes.length > 0 ? (
              <Badge
                badgeContent={
                  getNotificationsRes.filter((item) => {
                    console.log('notification in AppNotifications', item);
                    return !(item.seenBy && item.seenBy.length);
                  }).length
                }
                color='primary'
                overlap='circular'
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                sx={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  mt: 3,
                  '& svg': {
                    height: 35,
                    width: 35,
                  },
                  color: (theme) => theme.palette.text.secondary,
                  border: 1,
                  borderColor: 'transparent',
                }}
              ></Badge>
            ) : (
              <></>
            )}
            <NotificationEmpty />
          </IconButton>
        </AppTooltip>
      )}

      <Drawer
        anchor={drawerPosition}
        open={showNotification}
        onClose={() => setShowNotification(false)}
      >
        <AppNotificationContent
          sxStyle={sxNotificationContentStyle}
          data={getNotificationsRes}
          onClose={() => setShowNotification(false)}
        />
      </Drawer>
    </>
  );
};

export default AppNotifications;

AppNotifications.defaultProps = {
  drawerPosition: 'right',
  tooltipPosition: 'bottom',
};

AppNotifications.propTypes = {
  drawerPosition: PropTypes.string,
  tooltipPosition: PropTypes.string,
  isMenu: PropTypes.bool,
  sxNotificationContentStyle: PropTypes.object,
};
