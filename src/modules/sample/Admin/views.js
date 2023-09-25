import React, {useEffect, useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  CircularProgress,
  Menu,
  TextField,
  Select,
  ButtonGroup,
  Stack,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import {makeStyles} from '@mui/styles';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import CachedIcon from '@mui/icons-material/Cached';
import QrCodeIcon from '@mui/icons-material/QrCode';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ErrorIcon from '@mui/icons-material/Error';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import UnarchiveOutlinedIcon from '@mui/icons-material/UnarchiveOutlined';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ArrowCircleUpOutlinedIcon from '@mui/icons-material/ArrowCircleUpOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import MoveUpIcon from '@mui/icons-material/MoveUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import HandymanIcon from '@mui/icons-material/Handyman';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloseIcon from '@mui/icons-material/Close';
import {
  getListBusiness,
  ableBusiness,
  extendSuscriptionBusiness,
} from '../../../redux/actions/Admin';
import {convertToDate, convertToDateWithoutTime} from '../../../Utils/utils';
import {useDispatch, useSelector} from 'react-redux';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
} from '../../../shared/constants/ActionTypes';
import Router from 'next/router';
import {red} from '@mui/material/colors';
import ExtendExpirationForm from './extend';

const useStyles = makeStyles((theme) => ({
  btnGroup: {
    marginTop: '2rem',
  },
  btnSplit: {
    display: 'flex',
    justifyContent: 'center',
  },
  stack: {
    justifyContent: 'center',
    marginBottom: '10px',
  },
}));

let selectedBusiness = {};
let deletePayload = {
  request: {
    payload: {
      robotId: '',
    },
  },
};

export default function Views(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [openStatus, setOpenStatus] = useState(false);
  const [extendExpiration, setExtendExpiration] = React.useState(false);
  const [dateExpiration, setDateExpiration] = React.useState('');

  const [reload, setReload] = React.useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filteredBusiness, setFilteredBusiness] = useState([]);
  const [open, setOpen] = useState(false);
  const [openStatus2, setOpenStatus2] = useState(false);

  let popUp = false;

  const onGetListBusiness = (payload) => {
    dispatch(getListBusiness(payload));
  };

  const onExtendSuscriptionBusiness = (payload) => {
    dispatch(extendSuscriptionBusiness(payload));
  };

  const reloadPage = () => {
    setReload(!reload);
  };
  const {userDataRes} = useSelector(({user}) => user);

  const {listBusinessRes, successMessage, errorMessage} = useSelector(
    ({admin}) => admin,
  );

  console.log('confeti', listBusinessRes);

  useEffect(() => {
    console.log('Estamos userDataRes', userDataRes);
    if (
      userDataRes &&
      userDataRes.merchantSelected &&
      userDataRes.merchantSelected.merchantId
    ) {
      console.log('Estamos entrando al getBusiness');
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      //dispatch({type: GET_CLIENTS, payload: undefined});
      let listPayload = {
        request: {
          payload: {
            merchantId: userDataRes.merchantSelected.merchantId,
            LastEvaluatedKey: null,
          },
        },
      };
      onGetListBusiness(listPayload);
      // setFirstload(true);
    }
  }, [userDataRes, reload]);
  useEffect(() => {
    if (listBusinessRes && listBusinessRes.length > 0) {
      setFilteredBusiness(listBusinessRes);
    }
  }, [listBusinessRes]);

  const filterData = (dataFilters) => {
    console.log('prueba2', dataFilters);
    let listPayload = {
      request: {
        payload: {
          merchantId: selectedBusiness.merchantId,
          plans: selectedBusiness.plans,
          extendExpiration: dataFilters,
        },
      },
    };
    console.log('prueba22', listPayload);
    onExtendSuscriptionBusiness(listPayload);
    setExtendExpiration(false);
    setOpenStatus(true);
  };

  let codProdSelected = '';
  const [anchorEl, setAnchorEl] = React.useState(null);

  /* let anchorEl = null; */
  const openMenu = Boolean(anchorEl);
  const handleClick = (codPro, event) => {
    console.log('evento', event);
    console.log('index del map', codPro);
    setAnchorEl(event.currentTarget);
    codProdSelected = codPro;
    selectedBusiness =
      filteredBusiness[codPro]; /* .find((obj) => obj.client == codPro); */
    console.log('Select Agente', selectedBusiness);
  };

  const handleClose = () => {
    // MENU
    setAnchorEl(null);
  };

  const handleClose2 = () => {
    // DIALOG
    setOpen(false);
  };

  const setActive = () => {
    setOpen(true);
    handleClose();
  };

  const goToProduct = () => {
    //usuario

    console.log('selectedBusiness', selectedBusiness);
    Router.push({
      pathname: '/sample/admin/productive',
      query: selectedBusiness,
    });
  };
  const goToSunat = () => {
    Router.push({
      pathname: '/sample/admin/sunat',
      query: selectedBusiness,
    });
  };

  const goToExpiration = () => {
    console.log('selectedBusiness', selectedBusiness);
    setExtendExpiration(true);
    setDateExpiration(
      selectedBusiness.plans.find((obj) => obj.active == true).finishAt > 0
        ? selectedBusiness.plans.find((obj) => obj.active == true).finishAt
        : Date.now(),
    );
    handleClose();
  };

  const searchBusiness = (searchValue) => {
    console.log('negocio >>', searchValue);
    if (!searchValue) {
      setFilteredBusiness(listBusinessRes);
    } else {
      const filtered = listBusinessRes.filter((business) => {
        console.log('negocio', business.denominationMerchant);
        const merchantName = business.denominationMerchant;
        return (
          merchantName &&
          merchantName.toLowerCase().includes(searchValue.toLowerCase())
        );
      });
      console.log('negocio >>>>', filtered);
      setFilteredBusiness(filtered);
    }
  };

  const handleActive = () => {
    console.log('select user', selectedBusiness);

    let val;

    if (selectedBusiness.indactivo === 'S') {
      val = 'N';
    }
    if (selectedBusiness.indactivo === 'N') {
      val = 'S';
    }
    const payload = {
      request: {
        payload: {
          merchantId: selectedBusiness.merchantId,
          //userId: selectedBusiness.userId,
          indactivo: val,
        },
      },
    };

    dispatch(ableBusiness(payload));
    console.log('payload >>', payload);

    setOpenStatus2(true);
    setOpen(false);
  };

  const sendStatus = () => {
    setOpenStatus(false);
    setOpenStatus2(false);
    setTimeout(() => {
      let listPayload = {
        request: {
          payload: {
            merchantId: userDataRes.merchantSelected.merchantId,
            LastEvaluatedKey: null,
          },
        },
      };
      onGetListBusiness(listPayload);
    }, 2000);
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
            Se ha actualizado correctamente
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
            Se ha producido un error al actualizar.
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink />;
    }
  };

  return (
    <Card sx={{p: 4}}>
      <Stack
        sx={{m: 2}}
        direction={isMobile ? 'column' : 'row'}
        spacing={2}
        className={classes.stack}
      >
        <TextField
          label='Nombre del Negocio'
          variant='outlined'
          name='nameToSearch'
          size='small'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Button startIcon={<FilterAltOutlinedIcon />} variant='outlined'>
          Más filtros
        </Button>
        <Button
          startIcon={<ManageSearchOutlinedIcon />}
          variant='contained'
          color='primary'
          onClick={() => searchBusiness(searchValue)}
        >
          Buscar
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{maxHeight: 440}}>
        <Table
          sx={{minWidth: 650}}
          stickyHeader
          size='small'
          aria-label='sticky table'
        >
          <TableHead>
            <TableRow>
              <TableCell>Razón social</TableCell>
              <TableCell>Usuario admin</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Vencimiento Suscripción</TableCell>
              <TableCell>Integrada a SUNAT?</TableCell>
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBusiness?.map((row, index) => {
              return (
                <TableRow
                  key={index}
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <TableCell
                    component='th'
                    scope='row'
                    style={{maxWidth: '200px', wordWrap: 'break-word'}}
                  >
                    {row.denominationMerchant}
                  </TableCell>
                  <TableCell
                    style={{maxWidth: '200px', wordWrap: 'break-word'}}
                  >
                    {row.emailAdminUserId}
                  </TableCell>
                  <TableCell
                    style={{maxWidth: '200px', wordWrap: 'break-word'}}
                  >
                    {row.indactivo == 'S' ? 'SÍ' : 'NO'}
                  </TableCell>
                  <TableCell
                    style={{maxWidth: '200px', wordWrap: 'break-word'}}
                  >
                    {row.typeMerchant}
                  </TableCell>
                  <TableCell
                    style={{maxWidth: '200px', wordWrap: 'break-word'}}
                  >
                    {row.plans.length > 0
                      ? row.plans[row.plans.length - 1].type
                      : ''}
                  </TableCell>
                  <TableCell
                    style={{maxWidth: '200px', wordWrap: 'break-word'}}
                  >
                    {row.plans.length &&
                    row.plans.find((obj) => obj.active == true).finishAt > 0
                      ? convertToDateWithoutTime(
                          row.plans.find((obj) => obj.active == true).finishAt,
                        )
                      : ''}
                  </TableCell>
                  <TableCell
                    style={{maxWidth: '200px', wordWrap: 'break-word'}}
                  >
                    {row.isBillingEnabled ? 'SÍ' : 'NO'}
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
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <ButtonGroup
        variant='outlined'
        aria-label='outlined button group'
        className={classes.btnGroup}
      >
        {!popUp ? <></> : <CircularProgress disableShrink sx={{m: '10px'}} />}
      </ButtonGroup>

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
          .includes('/business/admin/productive') === true && selectedBusiness.typeMerchant === 'UAT' ? (
          <MenuItem onClick={goToProduct}>
            <MoveUpIcon sx={{mr: 1, my: 'auto'}} />
            Dar Alta a productivo
          </MenuItem>
        ) : null}
        {localStorage.getItem('pathsBack').includes('/business/admin/sunat') ===
        true  && selectedBusiness.typeMerchant === 'PROD' ? (
          <MenuItem onClick={goToSunat}>
            <HandymanIcon sx={{mr: 1, my: 'auto'}} />
            Activar SUNAT
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/business/admin/expiration') === true && selectedBusiness.typeMerchant === 'PROD' ? (
          <MenuItem onClick={goToExpiration}>
            <MoreTimeIcon sx={{mr: 1, my: 'auto'}} />
            Ampliar fecha suscripción
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/business/admin/enabled') === true &&
        selectedBusiness.indactivo === 'N' ? (
          <MenuItem onClick={setActive}>
            <ThumbUpOffAltIcon sx={{mr: 1, my: 'auto'}} />
            Habilitar Negocio
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/business/admin/disabled') === true &&
        selectedBusiness.indactivo === 'S' ? (
          <MenuItem onClick={setActive}>
            <ThumbDownOffAltIcon sx={{mr: 1, my: 'auto'}} />
            Deshabilitar Negocio
          </MenuItem>
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
          {selectedBusiness.indactivo === 'S'
            ? 'Deshabilitar negocio?'
            : 'Habilitar negocio?'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <PriorityHighIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            {selectedBusiness.indactivo === 'S'
              ? 'Desea deshabilitar los accesos al negocio y sus usuarios?'
              : 'Desea habilitar los accesos al negocio y sus usuarios?'}
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
        open={openStatus2}
        onClose={sendStatus}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {selectedBusiness.indactivo === 'S'
            ? 'Deshabilitar negocio?'
            : 'Habilitar negocio'}
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
        open={openStatus}
        onClose={sendStatus}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Ampliar Fecha Suscripción'}
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
        open={extendExpiration}
        onClose={() => setExtendExpiration(false)}
        maxWidth='sm'
        fullWidth
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          <IconButton
            aria-label='close'
            onClick={() => setExtendExpiration(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          {'Ampliar Fecha Suscripción'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <DialogContentText
            sx={{fontSize: '1.2em'}}
            id='alert-dialog-description'
          >
            <ExtendExpirationForm sendData={filterData} ds={dateExpiration} />
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}></DialogActions>
      </Dialog>
    </Card>
  );
}
