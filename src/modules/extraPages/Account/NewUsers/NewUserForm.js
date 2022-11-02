import React, {useEffect, useRef} from 'react';
import {Box, Button} from '@mui/material';
import AppGridContainer from '../../../../@crema/core/AppGridContainer';
import Grid from '@mui/material/Grid';
import AppTextField from '../../../../@crema/core/AppFormComponents/AppTextField';
import {FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import PropTypes from 'prop-types';

import IntlMessages from '../../../../@crema/utility/IntlMessages';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import {Visibility, VisibilityOff} from '@mui/icons-material';
import {listRol} from '../../../../redux/actions/User';
import {useDispatch, useSelector} from 'react-redux';

import {Form} from 'formik';
import {
  FETCH_ERROR,
  FETCH_SUCCESS,
  LIST_ROL,
} from '../../../../shared/constants/ActionTypes';

let objSelects = {
  rol: '',
  rolId: '',
};

const NewUserForm = ({values, moveData}) => {
  console.log('values', values);
  const [profileType, setProfileType] = React.useState(values.profile);
  const dispatch = useDispatch();
  const handleField = (event) => {
    setProfileType(event.target.value);
    moveData(event.target.value);
  };
  const prevProfileTypeRef = useRef();
  useEffect(() => {
    prevProfileTypeRef.current = profileType;
  });
  const prevProfileType = prevProfileTypeRef.current;
  const {listRolRes} = useSelector(({user}) => user);
  console.log('listRolRes al inicio', listRolRes);
  const {userDataRes} = useSelector(({user}) => user);
  console.log('userDataRes al inicio', userDataRes);
  const toListRol = (payload) => {
    dispatch(listRol(payload));
  };

  useEffect(() => {
    if (listRolRes) {
      let defaultId = listRolRes.find((obj) => obj.default == true).rolId;
      setProfileType(defaultId);
      console.log('profileType', profileType);
    }
  }, [listRolRes]);

  useEffect(() => {
    let listRolPayload = {
      request: {
        payload: {
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };
    toListRol(listRolPayload);
  }, []);
  useEffect(() => {
    if (
      listRolRes != undefined &&
      profileType &&
      prevProfileType !== profileType
    ) {
      console.log('profileType responsivo', profileType);
      moveData(profileType);
    }
  }, [listRolRes != undefined && profileType, profileType]);
  // useEffect(() => {
  //   if (JSON.parse(localStorage.getItem("payload"))) {
  //     let listRolPayload = {
  //       request: {
  //         payload: {
  //           merchantId: JSON.parse(localStorage.getItem("payload"))['custom:businessId']
  //         },
  //       },
  //     };
  //     console.log("listRolPayload123", listRolPayload)

  //     toListRol(listRolPayload);
  //   }
  // }, [JSON.parse(localStorage.getItem("payload"))]);

  useEffect(() => {
    if (listRolRes) {
      console.log('listRolRes desde useeffect', listRolRes);
    }
  }, [listRolRes]);
  const handleFieldRol = (event) => {
    console.log('evento', event);
    setProfileType(event.target.value);
    console.log('objSelects', objSelects);
    Object.keys(objSelects).map((key) => {
      if (key == event.target.name) {
        objSelects[key] = event.target.value;
      }
    });
  };
  return (
    <Form autoComplete='off'>
      <AppGridContainer spacing={4}>
        <Grid item xs={5} md={5}>
          <AppTextField
            name='email'
            fullWidth
            label={<IntlMessages id='common.email' />}
          />
        </Grid>

        <Grid item xs={5} md={5}>
          <FormControl fullWidth sx={{my: 0}}>
            <InputLabel id='profileType-label' style={{fontWeight: 200}}>
              <IntlMessages id='common.busines.profileType' />
            </InputLabel>
            <Select
              value={profileType}
              name='profileType'
              labelId='profileType-label'
              displayEmpty
              label={<IntlMessages id='common.busines.profileType' />}
              onChange={handleFieldRol}
            >
              {listRolRes && typeof listRolRes !== 'string' ? (
                listRolRes.map((obj, index) => {
                  objSelects.rol = obj.description;
                  objSelects.rolId = obj.rolId;
                  return (
                    <MenuItem
                      key={index}
                      value={obj.rolId}
                      style={{fontWeight: 200}}
                    >
                      {obj.description}
                    </MenuItem>
                  );
                })
              ) : (
                <></>
              )}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={2} md={2}>
          <Button
            sx={{
              position: 'relative',
              bottom: -5,
              minWidth: 100,
            }}
            color='primary'
            variant='contained'
            type='submit'
          >
            <IntlMessages id='common.add' />
          </Button>
        </Grid>
      </AppGridContainer>
    </Form>
  );
};

NewUserForm.propTypes = {
  values: PropTypes.object,
  moveData: PropTypes.func.isRequired,
  rol: PropTypes.object,
};

export default NewUserForm;
