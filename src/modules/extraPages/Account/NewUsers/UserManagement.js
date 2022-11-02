import React, {useEffect, useRef} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  ButtonGroup,
  Button,
  MenuItem,
  Menu,
  Stack,
  TextField,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Typography,
} from '@mui/material';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {listUser} from '../../../../redux/actions/User';

import {convertToDateWithoutTime} from '../../../../Utils/utils';

const UserManagement = ({data}) => {
  const {listUserRes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  const dispatch = useDispatch();

  const toListUser = (payload) => {
    dispatch(listUser(payload));
  };

  useEffect(() => {
    let listUserPayload = {
      request: {
        payload: {
          merchantId: userDataRes.merchantMasterId,
        },
      },
    };
    toListUser(listUserPayload);
    console.log('listUserRes: ', listUserRes);
  }, []);
  useEffect(() => {
    if (listUserRes) {
      console.log('listUserRes desde useeffect', listUserRes);
    }
  }, [listUserRes]);

  return (
    <TableContainer component={Paper} sx={{maxHeight: 440}}>
      <Table stickyHeader size='small' aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>
              <IntlMessages id='sidebar.apps.mail' />
            </TableCell>
            <TableCell>
              <IntlMessages id='common.oneName' />
            </TableCell>
            <TableCell>
              <IntlMessages id='common.profile' />
            </TableCell>
            <TableCell>
              <IntlMessages id='common.dateRegistered' />
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* {data && Array.isArray(data) ? (
            data.map((obj, index) => (
              <TableRow
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                key={index}
              >
                <TableCell>{obj.email}</TableCell>
                <TableCell>{obj.name}</TableCell>
                <TableCell>{obj.profile}</TableCell>
                <TableCell>{obj.status}</TableCell>
                <TableCell>
                  <IconButton>
                    <ForwardToInboxIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton aria-label='delete'>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <CircularProgress disableShrink sx={{m: '10px'}} />
          )} */}
          {
            listUserRes && Array.isArray(listUserRes) ? (
              listUserRes.map((obj, index) => (
                <TableRow
                  key={index}
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <TableCell>{obj.email ? obj.email : ''}</TableCell>
                  <TableCell>
                    {obj.nombreCompleto ? obj.nombreCompleto : ''}
                  </TableCell>
                  <TableCell>{obj.profile ? obj.profile : ''}</TableCell>
                  <TableCell align='center'>
                    {convertToDateWithoutTime(obj.fecCreacion)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <CircularProgress disableShrink sx={{m: '10px'}} />
            ) /* getMovementsRes && Array.isArray(getMovementsRes) ? (
            getMovementsRes.sort(compare).map((obj, index) => (
              <TableRow
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                key={index}
              >
                <TableCell>
                  {convertToDateWithoutTime(obj.timestampMovement)}
                </TableCell>
                <TableCell>
                  {obj.serialNumberBill
                    ? obj.serialNumberBill.split('-')[0]
                    : ''}
                </TableCell>
                <TableCell>
                  {obj.serialNumberBill
                    ? obj.serialNumberBill.split('-')[1]
                    : ''}
                </TableCell>
                <TableCell>{obj.denominationClient}</TableCell>
                <TableCell>{obj.observation}</TableCell>
                <TableCell>
                  {obj.totalPriceWithIgv
                    ? `${obj.totalPriceWithIgv.toFixed(2)} `
                    : ''}
                </TableCell>
                <TableCell>{showPaymentMethod(obj.paymentMethod)}</TableCell>
                <TableCell align='center'>
                  {showIconStatus(obj.acceptedStatus)}
                </TableCell>
                <TableCell align='center'>
                  {showCanceled(obj.cancelStatus)}
                </TableCell>
                <TableCell>
                  <Button
                    id='basic-button'
                    aria-controls={openMenu ? 'basic-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={openMenu ? 'true' : undefined}
                    onClick={handleClick.bind(this, index)}
                  >
                    <KeyboardArrowDownIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <CircularProgress disableShrink sx={{m: '10px'}} />
          ) */
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserManagement;
UserManagement.propTypes = {
  data: PropTypes.array,
};
