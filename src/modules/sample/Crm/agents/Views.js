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
import IntlMessages from '../../../../@crema/utility/IntlMessages';
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
import {getAgents, deleteAgents} from '../../../../redux/actions/Agent';
import {convertToDate} from '../../../../Utils/utils';
import {useDispatch, useSelector} from 'react-redux';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
} from '../../../../shared/constants/ActionTypes';
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

let selectedAgent = {};
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

  const [searchValue, setSearchValue] = useState('');
  const [filteredAgents, setFilteredAgents] = useState([]);

  let popUp = false;

  const getAgent = (payload) => {
    dispatch(getAgents(payload));
  };

  const deleteAgent = (payload) => {
    dispatch(deleteAgents(payload));
  };

  const cancelQR = () => {
    setopenQRPop(true);
  };

  const reset = () => {
    setopenErrorQR(false);
    setopenLimitQR(false);
    setopenQRSuccess(false);
  };
  const openErrorQRPop = () => {
    setopenErrorQR(true);
    setopenLimitQR(false);
    setopenQRSuccess(false);
  };

  const openLimitQRPop = () => {
    setopenErrorQR(false);
    setopenQRSuccess(false);
    setopenLimitQR(true);
  };

  const openQRSuccessPop = () => {
    setopenErrorQR(false);
    setopenQRSuccess(true);
    setopenLimitQR(false);
  };

  const handleCloseQR2 = () => {
    setopenQRPop(false);
  };

  const {userDataRes} = useSelector(({user}) => user);

  const {
    listAgents,
    agentsLastEvaluatedKey_pageListAgents,
    onChangeQRAgentRes,
  } = useSelector(({agents}) => agents);

  console.log('confeti los agentes', listAgents);

  useEffect(() => {
    if (onChangeQRAgentRes && onChangeQRAgentRes.urlQR) {
      console.log('onChangeQRAgentRes', onChangeQRAgentRes);
      if (onChangeQRAgentRes.urlQR != imgQR) {
        setimgQR(onChangeQRAgentRes.urlQR);
      }
      if (onChangeQRAgentRes.type == 'failureAgentQR') {
        setopenLimitQR(true);
        setopenQRSuccess(false);
        setopenErrorQR(false);
      } else if (onChangeQRAgentRes.type == 'successAgentQR') {
        setopenQRSuccess(true);
        setopenErrorQR(false);
        setopenLimitQR(false);
      } else {
        setopenQRSuccess(false);
        setopenErrorQR(false);
        setopenLimitQR(false); //Quitar en caso de que Marco decida que el stop sea un tipo
      }
    }
  }, [onChangeQRAgentRes]);

  const showMessage = () => {
    console.log('Mensaje QR');
  };

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
            typeDocumentClient: '',
            numberDocumentClient: '',
            denominationClient: '',
            merchantId: userDataRes.merchantSelected.merchantId,
            LastEvaluatedKey: null,
          },
        },
      };
      getAgent(listPayload);
      // setFirstload(true);
    }
  }, [userDataRes]);

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
    selectedAgent =
      listAgents[codPro]; /* .find((obj) => obj.client == codPro); */
    console.log('Select Agente', selectedAgent);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseQR = () => {
    setAnchorElQR(null);
  };
  const goToUpdate = () => {
    console.log('Actualizando', selectedAgent);
    Router.push({
      pathname: '/sample/agents/update',
      query: selectedAgent,
    });
  };
  const goToEnable = () => {
    console.log('Activar Agente', selectedAgent);
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
    console.log('selected agente', selectedAgent);
    console.log('id de selected', selectedAgent.robotId);
    deletePayload.request.payload.robotId = selectedAgent.robotId;
    console.log('deletePayload', deletePayload);
    deleteAgent(deletePayload);
    setOpen2(false);
    setOpenStatus(true);
  };

  const newAgent = () => {
    console.log('Para redireccionar a nuevo cliente');
    Router.push('/sample/agents/create');
  };

  // Paso 2: Función para filtrar las campañas por el nombre de la campaña
  const filterAgents = (searchText) => {
    if (!searchText) {
      setFilteredAgents(listAgents); // Si el valor del TextField está vacío, mostrar todas las campañas.
    } else {
      const filtered = listAgents.filter((agent) =>
        agent.robotName.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredAgents(filtered);
    }
  };

  const buscarAgente = () => {
    console.log('prueba boton ');
  };

  useEffect(() => {
    filterAgents(searchValue);
  }, [searchValue, listAgents]);

  return (
    <Card sx={{p: 4}}>
      <Stack
        sx={{m: 2}}
        direction={isMobile ? 'column' : 'row'}
        spacing={2}
        className={classes.stack}
      >
        <TextField
          label='Nombre del agente'
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
          // onClick={/*buscarAgente()*/}
        >
          Buscar
        </Button>
      </Stack>
      <span>{`Items: ${listAgents ? listAgents.length : 'Cargando...'}`}</span>
      <TableContainer component={Paper} sx={{maxHeight: 440}}>
        <Table
          sx={{minWidth: 650}}
          stickyHeader
          size='small'
          aria-label='sticky table'
        >
          <TableHead>
            <TableRow>
              <TableCell>Fecha de creación</TableCell>
              <TableCell>Nombre del agente</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAgents?.map((row, index) => (
              <TableRow
                key={index}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
              >
                <TableCell>{convertToDate(row.createdAt)}</TableCell>
                <TableCell
                  component='th'
                  scope='row'
                  style={{maxWidth: '200px', wordWrap: 'break-word'}}
                >
                  {row.robotName}
                </TableCell>
                <TableCell style={{maxWidth: '200px', wordWrap: 'break-word'}}>
                  {row.description}
                </TableCell>
                <TableCell>
                  {row.status == 'OFF' ? (
                    <IntlMessages id='common.disableAgent' />
                  ) : (
                    <IntlMessages id='common.enableAgent' />
                  )}
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
            ))}
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
          .includes('/inventory/robot/register') === true ? (
          <Button
            variant='outlined'
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={newAgent}
          >
            Nuevo
          </Button>
        ) : null}

        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/exportAgent/*') === true ? (
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
        open={open2}
        onClose={handleClose2}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Eliminar agente'}
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

      <Dialog
        open={openQRPop}
        onClose={handleCloseQR2}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'ACTIVAR AGENTE WHATSAPP'}
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* <div sx={{display:'flex', flexDirection:'row',justifyContent:'space-around',alignItems:'center', gap:'10px'}}>
        <Button variant='contained'  onClick={openLimitQRPop}>
            Error    
        </Button>
        <Button  variant='contained'  onClick={openQRSuccessPop}>
            Exito QR   
        </Button>
        <Button  variant='contained'  onClick={reset}>
            Reiniciar   
        </Button>
        </div> */}
          {openErrorQR == false &&
          openLimitQR == false &&
          openQRSuccess == false ? (
            <img
              src={onChangeQRAgentRes?.urlQR}
              alt='ImagenQR'
              width='400'
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : null}
          {openLimitQR === true ? (
            <>
              <DialogContentText
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}
              >
                <ErrorIcon color='error' sx={{fontSize: '4em', mx: 2}} />
                <p>Lo siento, se ha excedido el limite de intentos </p>
              </DialogContentText>
              <Button variant='contained' startIcon={<QrCodeIcon />}>
                Generar QR
              </Button>
            </>
          ) : null}
          {openQRSuccess === true ? (
            <>
              <DialogContentText
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}
              >
                <CheckCircleSharpIcon
                  color='success'
                  sx={{fontSize: '4em', mx: 2}}
                />
                <p> Felicidades, se ha activado correctamente </p>
              </DialogContentText>
            </>
          ) : null}

          {/* <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            ¿Desea eliminar realmente la información seleccionada?
          </DialogContentText> */}
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button
            variant='outlined'
            startIcon={<SaveAltIcon />}
            sx={{width: '100%'}}
            onClick={handleCloseQR2}
          >
            Finalizar
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
          .includes('/inventory/robot/update') === true ? (
          <MenuItem onClick={goToUpdate}>
            <CachedIcon sx={{mr: 1, my: 'auto'}} />
            Actualizar
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/robot/enable') === true ? (
          <MenuItem onClick={setEnableState}>
            <ArrowCircleUpOutlinedIcon sx={{mr: 1, my: 'auto'}} />
            Activar
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/robot/delete') === true ? (
          <MenuItem onClick={setDeleteState}>
            <DeleteOutlineOutlinedIcon sx={{mr: 1, my: 'auto'}} />
            Eliminar
          </MenuItem>
        ) : null}
      </Menu>
    </Card>
  );
}
