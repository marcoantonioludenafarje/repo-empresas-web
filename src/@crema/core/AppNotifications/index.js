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
import {useDispatch, useSelector} from 'react-redux';

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
  const forceUpdate = useForceUpdate();
  //GET APIS RES
  const {getNotificationsRes} = useSelector(({notifications}) => notifications);
  const {userDataRes} = useSelector(({user}) => user);

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
                  userDataRes
                    ? getNotificationsRes.filter((item) => {
                        return !(
                          item.seenBy &&
                          item.seenBy.length &&
                          item.seenBy.some((item) => item == userDataRes.userId)
                        );
                      }).length
                    : 0
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
