import React, {useEffect} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import IntlMessages from '@crema/utility/IntlMessages';
import {BiUser} from 'react-icons/bi';
import {AiOutlineLock} from 'react-icons/ai';
import {IoMdInformationCircleOutline} from 'react-icons/io';
import {IoShareSocialOutline} from 'react-icons/io5';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import DoDisturbAltIcon from '@mui/icons-material/DoDisturbAlt';
import BusinessIcon from '@mui/icons-material/Business';
import AccountTabsWrapper from './AccountTabsWrapper';
import PersonalInfo from './PersonalInfo';
import BusinessInfo from './BusinessInfo';
import UpgradeBusiness from './UpgradeBusiness';
import NewUsers from './NewUsers';
import ChangePassword from './ChangePassword';
import Information from './Information';
import Social from './Social';
import Notification from './Notification';
import BusinessCancellation from './BusinessCancellation';
import accountData from '@crema/services/db/extraPages/account';
import {AppAnimate} from '../../../@crema';
import {Fonts} from '../../../shared/constants/AppEnums';
import AppPageMeta from '../../../@crema/core/AppPageMeta';

import {useDispatch, useSelector} from 'react-redux';
import Router, {useRouter} from 'next/router';
import {isEmpty} from '../../../Utils/utils';
import {getUserData} from '../../../redux/actions/User';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
} from '../../../shared/constants/ActionTypes';
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const tabs = [
  {
    id: 0,
    icon: <BiUser />,
    name: <IntlMessages id='common.personalInfo' />,
    nameView: 'personalInfo',
    permission: ['administrator', 'viewer'],
  },
  {
    id: 1,
    icon: <BusinessIcon />,
    name: <IntlMessages id='userProfile.businessInfo' />,
    nameView: 'businessInfo',
    permission: ['administrator'],
  },
  // {
  //   id: 7,
  //   icon: <AiOutlineLock />,
  //   name: <IntlMessages id='userProfile.upgradeBusiness' />,
  //   nameView: 'upgradeBusiness',
  //   permission: ['administrator', 'viewer'],
  // },
  {
    id: 2,
    icon: <GroupAddOutlinedIcon />,
    name: <IntlMessages id='userProfile.newUsers' />,
    nameView: 'newUsers',
    permission: ['administrator'],
  },
  {
    id: 3,
    icon: <AiOutlineLock />,
    name: <IntlMessages id='common.changePassword' />,
    nameView: 'changePassword',
    permission: ['administrator', 'viewer'],
  },
  {
    id: 4,
    icon: <IoMdInformationCircleOutline />,
    name: <IntlMessages id='common.information' />,
    nameView: 'information',
    permission: [],
  },
  {
    id: 5,
    icon: <IoShareSocialOutline />,
    name: <IntlMessages id='common.social' />,
    nameView: 'social',
    permission: [],
  },
  {
    id: 6,
    icon: <NotificationsNoneIcon />,
    name: <IntlMessages id='healthCare.notification' />,
    nameView: 'notification',
    permission: [],
  },
  /* {
    id: 7,
    icon: <DoDisturbAltIcon />,
    name: <IntlMessages id='healthCare.business.cancellation' />,
    permission: ['administrator'],
  }, */
];

const Account = () => {
  const [value, setValue] = React.useState(null);
  const [typeUser, setTypeUser] = React.useState('');
  const dispatch = useDispatch();

  const {userAttributes} = useSelector(({user}) => user);
  const {dataBusinessRes} = useSelector(({general}) => general);
  const {userDataRes} = useSelector(({user}) => user);
  console.log('userDataRes', userDataRes);
  const router = useRouter();
  const {query} = router;
  console.log('query', query);
  console.log('userAttributes', userAttributes);

  useEffect(() => {
    if (!userDataRes) {
      console.log('Esto se ejecuta?');
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      dispatch({type: GET_USER_DATA, payload: undefined});
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
      if (!isEmpty(query)) {
        const selectedView = tabs.find(
          (tab) => tab.nameView === query.nameView,
        );
        setValue(selectedView.id);
      }
    }
  }, [userDataRes]);

  useEffect(() => {
    if (userAttributes) {
      let typeUser;
      if (userAttributes.profile === 'INVENTORY_BUSINESS_ADMIN') {
        typeUser = 'administrator';
      } else {
        typeUser = 'viewer';
      }
      setTypeUser(typeUser);
    }
  }, [userAttributes]);

  const onTabsChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <AppPageMeta />
      <Box
        component='h2'
        variant='h2'
        sx={{
          fontSize: 16,
          color: 'text.primary',
          fontWeight: Fonts.SEMI_BOLD,
          mb: {
            xs: 2,
            lg: 4,
          },
        }}
      >
        <IntlMessages id='sidebar.myUserData' />
      </Box>
      <AppAnimate animation='transition.slideUpIn' delay={200}>
        <AccountTabsWrapper>
          <Tabs
            className='account-tabs'
            value={value}
            onChange={onTabsChange}
            aria-label='basic tabs example'
            orientation='vertical'
          >
            {tabs.map((tab, index) => {
              if (tab.permission.includes(typeUser)) {
                return (userDataRes &&
                  !userDataRes.merchantSelected.firstPlanDefault &&
                  tab.id == 7) ||
                  (tab.id === 2 && ((
                    userDataRes 
                    &&
                    userDataRes.merchantSelected.typeMerchant !== 'PROD'
                  ) || userDataRes.merchantSelected.merchantId == '2303d20e08534377bd2c053ecf9d281c')
                    ) ? (
                  <></>
                ) : (
                  <Tab
                    className='account-tab'
                    label={tab.name}
                    icon={tab.icon}
                    key={index}
                    value={tab.id}
                    {...a11yProps(index)}
                  />
                );
              }
            })}
          </Tabs>
          <Box className='account-tabs-content'>
            {value === 0 && <PersonalInfo />}
            {value === 1 && <BusinessInfo />}
            {/* {value === 2 &&
              userDataRes &&
              userDataRes.merchantSelected.typeMerchant == 'PROD' && (
                <NewUsers />
              )} */}
            {value === 2 && <NewUsers />}
            {/* {value === 7 && <UpgradeBusiness />} */}
            {value === 3 && <ChangePassword />}
            {value === 4 && <Information />}
            {value === 5 && <Social social={accountData.member} />}
            {value === 6 && <Notification />}
            {/* {value === 7 && <BusinessCancellation />} */}
          </Box>
        </AccountTabsWrapper>
      </AppAnimate>
    </>
  );
};

export default Account;
