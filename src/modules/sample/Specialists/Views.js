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
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {
  getSpecialists,
  deleteSpecialists,
} from '../../../redux/actions/Specialist';
import {convertToDate} from '../../../Utils/utils';
import {useDispatch, useSelector} from 'react-redux';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
} from '../../../shared/constants/ActionTypes';
import Router from 'next/router';
import {red} from '@mui/material/colors';

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

let selectedSpecialist = {};
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

  const [open2, setOpen2] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);

  const [openErrorQR, setopenErrorQR] = React.useState(false);
  const [openLimitQR, setopenLimitQR] = React.useState(false);
  const [openQRSuccess, setopenQRSuccess] = React.useState(false);
  const [imgQR, setimgQR] = React.useState('');

  const [openQRPop, setopenQRPop] = React.useState(false);
  const [openQR, setopenQR] = React.useState(false);
  const [reload, setReload] = React.useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filteredSpecialists, setFilteredSpecialists] = useState([]);
  const {successMessage} = useSelector(({specialists}) => specialists);
  const {errorMessage} = useSelector(({specialists}) => specialists);

  let popUp = false;

  const getSpecialist = (payload) => {
    dispatch(getSpecialists(payload));
  };

  const deleteASpecialist = (payload) => {
    dispatch(deleteSpecialists(payload));
  };
  const reloadPage = () => {
    setReload(!reload);
  };
  const {userDataRes} = useSelector(({user}) => user);

  const {listSpecialists, agentsLastEvaluatedKey_pageListAgents} = useSelector(
    ({specialists}) => specialists,
  );

  console.log('confeti los especialistas', listSpecialists);

  useEffect(() => {
    console.log('Estamos userDataRes', userDataRes);
    if (
      userDataRes &&
      userDataRes.merchantSelected &&
      userDataRes.merchantSelected.merchantId
    ) {
      console.log('Estamos entrando al getAgentes');
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      //dispatch({type: GET_CLIENTS, payload: undefined});
      let listPayload = {
        request: {
          payload: {
            merchantId: userDataRes.merchantSelected.merchantId,
            nameSpecialist: searchValue,
            LastEvaluatedKey: null,
          },
        },
      };
      getSpecialist(listPayload);
      // setFirstload(true);
    }
  }, [userDataRes, reload]);

  let codProdSelected = '';
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElQR, setAnchorElQR] = React.useState(null);

  /* let anchorEl = null; */
  const openMenu = Boolean(anchorEl);
  const handleClick = (codPro, event) => {
    console.log('evento', event);
    console.log('index del map', codPro);
    setAnchorEl(event.currentTarget);
    handleCloseQR(event.currentTarget);
    codProdSelected = codPro;
    selectedSpecialist =
      listSpecialists[codPro]; /* .find((obj) => obj.client == codPro); */
    console.log('Select Agente', selectedSpecialist);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseQR = () => {
    setAnchorElQR(null);
  };
  const goToUpdate = () => {
    let userId = selectedSpecialist.user.userId;
    selectedSpecialist.user = userId;
    console.log('Actualizando', selectedSpecialist);
    Router.push({
      pathname: '/sample/specialists/update',
      query: selectedSpecialist,
    });
  };
  const goToEnable = () => {
    console.log('Activar Agente', selectedSpecialist);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };

  const setDeleteState = () => {
    setOpen2(true);
    handleClose();
  };

  const setEnableState = () => {
    setopenQRPop(true);
    setopenErrorQR(false);
    setopenLimitQR(false);
    setopenQRSuccess(false);
    handleCloseQR();
  };

  const confirmDelete = () => {
    console.log('selected agente', selectedSpecialist);
    console.log('id de selected', selectedSpecialist.specialistId);
    deletePayload.request.payload.specialistId =
      selectedSpecialist.specialistId;
    console.log('deletePayload', deletePayload);
    deleteASpecialist(deletePayload);
    setOpen2(false);
    setOpenStatus(true);
    reloadPage();
  };

  const newSpecialist = () => {
    console.log('Para redireccionar a nuevo cliente');
    Router.push('/sample/specialists/create');
  };

  // Paso 2: Función para filtrar las campañas por el nombre de la campaña
  /*const filterSpecialists = (searchText) => {
    if (!searchText) {
      setFilteredSpecialists(listSpecialists); // Si el valor del TextField está vacío, mostrar todas las campañas.
    } else {
      const filtered = listSpecialists.filter((specilist) =>
        specilist.user.email.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredSpecialists(filtered);
    }
  };*/

  /*useEffect(() => {
    filterSpecialists(searchValue);

    console.log('filteredSpecialists', filteredSpecialists);
  }, [searchValue, listSpecialists]);*/

  const searchSpecialist = () => {
    let listPayload = {
      request: {
        payload: {
          merchantId: userDataRes.merchantSelected.merchantId,
          nameSpecialist: searchValue,
          LastEvaluatedKey: null,
        },
      },
    };
    getSpecialist(listPayload);
  };

  const handleSearchValues = (event) => {
    console.log('Evento', event);
    //event.target.value=event.target.value.toUpperCase();
    setSearchValue(event.target.value);
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
            Se ha eliminado correctamente
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
            Se ha producido un error al eliminar.
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink />;
    }
  };

  const sendStatus = () => {
    console.log('sendStatus', '');
    setOpenStatus(false);
    setTimeout(() => {
      let listPayload = {
        request: {
          payload: {
            merchantId: userDataRes.merchantSelected.merchantId,
            nameSpecialist: searchValue,
            LastEvaluatedKey: null,
          },
        },
      };
      //listPayload.request.payload.LastEvaluatedKey = null;
      //dispatch({type: GET_PROVIDERS, payload: {callType: 'firstTime'}});
      getSpecialist(listPayload);
    }, 2000);
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
          label='Nombre usuario'
          variant='outlined'
          name='nameToSearch'
          size='small'
          onChange={handleSearchValues}
        />
        <Button startIcon={<FilterAltOutlinedIcon />} variant='outlined'>
          Más filtros
        </Button>
        <Button
          startIcon={<ManageSearchOutlinedIcon />}
          variant='contained'
          color='primary'
          onClick={searchSpecialist}
        >
          Buscar
        </Button>
      </Stack>
      <span>{`Items: ${
        listSpecialists ? listSpecialists.length : 'Cargando...'
      }`}</span>
      <TableContainer component={Paper} sx={{maxHeight: 440}}>
        <Table
          sx={{minWidth: 650}}
          stickyHeader
          size='small'
          aria-label='sticky table'
        >
          <TableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Puesto o Especialidad</TableCell>
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listSpecialists?.map((row, index) => {
              console.log('listSpecialists:-->', listSpecialists);
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
                    {row.user
                      ? row.user.nombreCompleto
                        ? row.user.nombreCompleto
                        : row.user.email
                      : null}
                  </TableCell>
                  <TableCell
                    style={{maxWidth: '200px', wordWrap: 'break-word'}}
                  >
                    {row.specialistName}
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
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/specialist/register') === true ? (
          <Button
            variant='outlined'
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={newSpecialist}
          >
            Nuevo
          </Button>
        ) : null}

        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/exportSpecialists/*') === true ? (
          <Button
            variant='outlined'
            startIcon={<GridOnOutlinedIcon />}
            onClick={''}
          >
            Exportar todo
          </Button>
        ) : null}

        {!popUp ? <></> : <CircularProgress disableShrink sx={{m: '10px'}} />}
      </ButtonGroup>

      <Dialog
        open={openStatus}
        onClose={sendStatus}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Eliminar especialista'}
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
        open={open2}
        onClose={handleClose2}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Eliminar Especialista'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <PriorityHighIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            ¿Desea eliminar realmente la información seleccionada?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={confirmDelete}>
            Sí
          </Button>
          <Button variant='outlined' onClick={handleClose2}>
            No
          </Button>
        </DialogActions>
      </Dialog>

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
          .includes('/inventory/specialist/update') === true ? (
          <MenuItem onClick={goToUpdate}>
            <CachedIcon sx={{mr: 1, my: 'auto'}} />
            Actualizar
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/specialist/delete') === true ? (
          <MenuItem onClick={setDeleteState}>
            <DeleteOutlineOutlinedIcon sx={{mr: 1, my: 'auto'}} />
            Eliminar
          </MenuItem>
        ) : null}
      </Menu>
    </Card>
  );
}
