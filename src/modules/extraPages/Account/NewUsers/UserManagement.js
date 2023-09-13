import React, {useEffect, useRef, useState} from 'react';
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
  FormControl,
  Select,
  InputLabel,
} from '@mui/material';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {
  changeRol,
  listUser,
  updateActive,
  listRol,
} from '../../../../redux/actions/User';

import {red} from '@mui/material/colors';
import {convertToDateWithoutTime} from '../../../../Utils/utils';

let selectUser = {};

const UserManagement = ({data}) => {
  const {listUserRes, successMessage, errorMessage} = useSelector(
    ({user}) => user,
  );
  const {userDataRes} = useSelector(({user}) => user);
  const {listRolRes} = useSelector(({user}) => user);
  const dispatch = useDispatch();

  console.log('DATA', data);

  const toListUser = (payload) => {
    dispatch(listUser(payload));
  };
  const toListRol = (payload) => {
    dispatch(listRol(payload));
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [disable, setDisable] = useState(false);
  const [open, setOpen] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [openChangeRol, setOpenChangeRol] = useState(false);

  const openMenu = Boolean(anchorEl);
  let codProdSelected = '';
  const handleClick = (codPro, event) => {
    setDisable(false);
    console.log('evento', event);
    console.log('index del map', codPro);
    setAnchorEl(event.currentTarget);
    codProdSelected = codPro;
    selectUser = listUserRes[codProdSelected];
    console.log(
      'confeti',
      selectUser,
    ); /* .find((obj) => obj.client == codPro); */
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (listRolRes) {
      console.log('listRolRes desde useeffect', listRolRes);
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
    let listUserPayload = {
      request: {
        payload: {
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };
    toListUser(listUserPayload);
    console.log('listUserRes: ', listUserRes);
  }, []);
  useEffect(() => {
    if (listUserRes) {
      console.log('listUserRes desde management', listUserRes);
    }
  }, [listUserRes]);

  const handleClose2 = () => {
    setOpen(false);
  };

  const setActive = () => {
    setOpen(true);
    handleClose();
  };

  const setChangeRol = () => {
    setOpenChangeRol(true);
    handleClose();
  };

  const handleClose3 = () => {
    setOpenChangeRol(false);
  };

  const handleActive = () => {
    console.log('select user', selectUser);

    let val;

    if (selectUser.indactivo === 'S') {
      val = 'N';
    }
    if (selectUser.indactivo === 'N') {
      val = 'S';
    }
    const payload = {
      request: {
        payload: {
          userId: selectUser.userId,
          indactivo: val,
        },
      },
    };

    dispatch(updateActive(payload));
    console.log('payload >>', payload);

    setOpenStatus(true);
    setOpen(false);
  };

  const handleChangeRol = () => {
    const payload = {
      request: {
        payload: {
          useriD: selectUser.userId,
          rol: data.rol,
          roles: [data.rol],
        },
      },
    };

    dispatch(changeRol(payload));
    setOpenStatus(true);
    setOpen(false);
  };

  const sendStatus = () => {
    setOpenStatus(false);
    setTimeout(() => {
      let listUserPayload = {
        request: {
          payload: {
            merchantId: userDataRes.merchantSelected.merchantId,
          },
        },
      };
      toListUser(listUserPayload);
    }, 2000);

    console.log('listUserRes: ', listUserRes);
  };

  const showMessage = () => {
    if (successMessage != undefined) {
      return (
        <>
          <CheckCircleOutlineOutlinedIcon
            color='success'
            sx={{fontSize: '6em', mx: 2}}
          />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            La operación se hizo correctamente
          </DialogContentText>
        </>
      );
    } else if (errorMessage) {
      return (
        <>
          <CancelOutlinedIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            Se ha producido un error.
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink />;
    }
  };

  return (
    <TableContainer component={Paper} sx={{maxHeight: 450}}>
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
            <TableCell>
              <IntlMessages id='common.active' />
            </TableCell>
            <TableCell>
              <IntlMessages id='common.options' />
            </TableCell>
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
                  <TableCell>{obj.indactivo == 'S' ? 'SÍ' : 'NO'}</TableCell>
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
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/robot/update') === true &&
        selectUser.indactivo === 'N' ? (
          <MenuItem onClick={setActive}>Habilitar Usuario</MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/robot/enable') === true &&
        selectUser.indactivo === 'S' ? (
          <MenuItem onClick={setActive}>Deshabilitar Usuario</MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/robot/delete') === true ? (
          <MenuItem onClick={setChangeRol}>Cambio de Perfil</MenuItem>
        ) : null}
      </Menu>
      <Dialog
        open={open}
        onClose={handleClose2}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {selectUser.indactivo === 'S'
            ? 'Deshabilitar usuario?'
            : 'Habilitar usuario?'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <PriorityHighIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            {selectUser.indactivo === 'S'
              ? 'Desea deshabilitar los accesos del usuario?'
              : 'Desea habilitar los accesos del usuario?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={handleActive}>
            Sí
          </Button>
          <Button variant='outlined' onClick={handleClose2}>
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openStatus}
        onClose={sendStatus}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {selectUser.indactivo === 'S'
            ? 'Deshabilitar usuario?'
            : 'Habilitar usuario?'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          {showMessage()}
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={sendStatus}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openChangeRol}
        onClose={handleClose3}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Cambio de Rol'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <FormControl fullWidth sx={{my: 0}}>
            {/* <InputLabel id='profileType-label' style={{fontWeight: 200}}>
              <IntlMessages id='common.business.profileType' />
            </InputLabel> */}
            <Select
              // value={profileType}
              name='profileType'
              labelId='profileType-label'
              displayEmpty
              label={<IntlMessages id='common.business.profileType' />}
              // onChange={handleFieldRol}
            >
              {/* {listRolRes && typeof listRolRes !== 'string' ? (
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
              )} */}
              <MenuItem>ADMIN_PREMIUM</MenuItem>
              <MenuItem>SUPERVISOR</MenuItem>
              <MenuItem>CONTADOR</MenuItem>
              <MenuItem>SOLO_CONSULTAS</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={handleChangeRol}>
            Cambiar
          </Button>
          <Button variant='outlined' onClick={handleClose3}>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

export default UserManagement;
UserManagement.propTypes = {
  data: PropTypes.array,
};
