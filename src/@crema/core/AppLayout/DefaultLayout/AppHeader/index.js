import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import AppLngSwitcher from '@crema/core/AppLngSwitcher';
import Box from '@mui/material/Box';
import AppSearchBar from '@crema/core/AppSearchBar';
import Hidden from '@mui/material/Hidden';
import IconButton from '@mui/material/IconButton';

import IntlMessages from '../../../../../@crema/utility/IntlMessages';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Link,
  Button,
  IconMenu,
  Badge,
} from '@mui/material';
import {toggleNavCollapsed} from '../../../../../redux/actions';
import MenuIcon from '@mui/icons-material/Menu';
import AppMessages from '../../../AppMessages';
import AppNotifications from '../../../AppNotifications';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationAddOutlinedIcon from '@mui/icons-material/NotificationAddOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AppTooltip from '../../../AppTooltip';
import {alpha} from '@mui/material/styles';
import AppLogo from '../../components/AppLogo';
import Notification from '../../components/Notification';
import {useIntl} from 'react-intl';
import ActiveSubscription from '../../../../../modules/sample/Subscription/ActiveSubscription';

import NewRequest from '../../../../../modules/sample/Request/NewRequest';
import RequestIcon from '../../../../../assets/icon/requestIcon.svg';
import NotificationEmpty from '../../../../../assets/icon/notificationEmpty.svg';
import NotificationNonEmpty from '../../../../../assets/icon/notificationNonEmpty.svg';

import {useDispatch, useSelector} from 'react-redux';
const AppHeader = () => {
  const {messages} = useIntl();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [newRequestState, setNewRequestState] = React.useState(false);
  const [requestType, setRequestType] = React.useState('');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  let getActiveNotifications = [];
  const handleClose = () => {
    setAnchorEl(null);
  };
  const dispatch = useDispatch();
  const {userDataRes} = useSelector(({user}) => user);

  const sendNewRequest = () => {
    setNewRequestState(true);
  };
  return (
    <AppBar
      position='relative'
      color='inherit'
      sx={{
        boxShadow: 'none',
        borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
        backgroundColor: 'background.paper',
        width: {
          xs: '100%',
        },
      }}
      className='app-bar'
    >
      <Toolbar
        sx={{
          boxSizing: 'border-box',
          minHeight: {xs: 56, sm: 70},
          paddingLeft: {xs: 5},
          paddingRight: {xs: 5, md: 7.5, xl: 12.5},
        }}
      >
        <AppLogo />

        <Box display='flex' flexGrow={1}>
          {/* whatever is on the left side */}
          <Hidden lgUp>
            <IconButton
              sx={{color: 'text.secondary'}}
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
          </Hidden>

          <Link
            sx={{
              ml: 5,
              position: 'relative',
              bottom: -15,
              '& svg': {
                height: 35,
                width: 35,
              },
            }}
            onClick={() => window.open('https://www.youtube.com/')}
          >
            Ver Tutorial
            {/* <RequestIcon /> */}
          </Link>
        </Box>
        {/* whatever is on the right side */}
        <Hidden smDown>
          {JSON.parse(localStorage.getItem('payload')).profile ==
            'INVENTORY_BUSINESS_ADMIN' &&
          userDataRes &&
          userDataRes.merchantSelected.isEcommerceEnabled == true ? (
            <Button
              sx={{
                position: 'relative',
                bottom: -5,
                minWidth: 100,
              }}
              color='secondary'
              variant='contained'
              onClick={() => window.open(`https://dev.ecommerce.tunexo.pe/negocio/${userDataRes.merchantSelected.ecommerceMerchantSlug}`)}
            >
              <IntlMessages id='common.eCommerceBusiness' />
            </Button>
          ) : null}
        </Hidden>
        <IconButton
          sx={{
            mt: 1,
            '& svg': {
              height: 35,
              width: 35,
            },
            color: 'text.secondary',
          }}
          edge='end'
          color='inherit'
          aria-label='open drawer'
          onClick={() => {
            setRequestType('');
            sendNewRequest();
          }}
        >
          <RequestIcon />
        </IconButton>
        <Box sx={{ml: 4}}>
          <Hidden smDown>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                marginLeft: -2,
                marginRight: -2,
              }}
            >
              <Box
                sx={{
                  px: 1.85,
                }}
              >
                <AppNotifications />
              </Box>
              {/* <Box
                sx={{
                  px: 1.85,
                }}
              >
                <AppMessages />
              </Box> */}
            </Box>
          </Hidden>

          <Hidden smUp>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                marginLeft: -2,
                marginRight: -2,
              }}
            >
              <Box
                sx={{
                  px: 1.85,
                }}
              >
                <AppTooltip title='More'>
                  <IconButton
                    sx={{
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      color: (theme) => theme.palette.text.secondary,
                      backgroundColor: (theme) =>
                        theme.palette.background.default,
                      border: 1,
                      borderColor: 'transparent',
                      '&:hover, &:focus': {
                        color: (theme) => theme.palette.text.primary,
                        backgroundColor: (theme) =>
                          alpha(theme.palette.background.default, 0.9),
                        borderColor: (theme) =>
                          alpha(theme.palette.text.secondary, 0.25),
                      },
                    }}
                    onClick={handleClick}
                    size='large'
                  >
                    <MoreVertIcon />
                  </IconButton>
                </AppTooltip>
              </Box>
            </Box>
          </Hidden>
          <Menu
            id='simple-menu'
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem>
              <AppNotifications isMenu />
            </MenuItem>
            {/* <MenuItem>
              <AppMessages isMenu />
            </MenuItem> */}
            <MenuItem>Setting</MenuItem>
          </Menu>
        </Box>
        {/* <IconButton
          sx={{
            mt: 3,
            '& svg': {
              height: 35,
              width: 35,
            },
          }}
          aria-label='open drawer'
          onClick={() => dispatch(toggleNavCollapsed())}
        >
          {getActiveNotifications.length > 0 ? (
            <NotificationNonEmpty />
          ) : (
            <NotificationEmpty />
          )}
        </IconButton> */}
        <Hidden smDown>
          {JSON.parse(localStorage.getItem('payload')).profile ==
            'INVENTORY_BUSINESS_ADMIN' &&
          userDataRes &&
          userDataRes.merchantSelected.firstPlanDefault == true ? (
            <Button
              sx={{
                position: 'relative',
                bottom: -5,
                minWidth: 100,
              }}
              color='primary'
              variant='contained'
              onClick={() => {
                setRequestType('planActivation');
                sendNewRequest();
              }}
            >
              <IntlMessages id='common.activePlan' />
            </Button>
          ) : null}
        </Hidden>

        {/* <Button
          onClick={() => setOpenStatus(true)}
          sx={{mx: 4}}
          variant='outlined'
          color='error'
        >
          {messages['sidebar.sample.subscription.active']}
        </Button> */}
        {/* <AppSearchBar iconPosition='right' placeholder='Search…' /> */}
        <Box
          sx={{
            flexGrow: 0.1,
          }}
        />
        <AppLngSwitcher iconOnly={true} tooltipPosition='bottom' />
      </Toolbar>

      <Dialog
        open={openStatus}
        onClose={() => setOpenStatus(false)}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <ActiveSubscription />
      </Dialog>

      <Dialog
        open={newRequestState}
        onClose={() => {
          setRequestType('');
          setNewRequestState(false);
        }}
        fullWidth
        maxWidth='x1'
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          <IconButton
            aria-label='close'
            onClick={() => setNewRequestState(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{display: 'flex'}}>
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            <NewRequest
              data={{
                yearMovement: '2022',
                monthMovement: 'MAY',
                merchantId: 'a9b1b2165ef740c9b4fcfd16c3f478ad',
                subType: 'planActivation',
              }}
              subType={requestType}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </AppBar>
  );
};
export default AppHeader;
