import React, {useEffect} from 'react';
const XLSX = require('xlsx');
import {
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ButtonGroup,
  Button,
  MenuItem,
  Menu,
  Card,
  Stack,
  TextField,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import {SET_JWT_TOKEN} from '../../../shared/constants/ActionTypes';

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import {red} from '@mui/material/colors';

import {makeStyles} from '@mui/styles';
import {useHistory, BrowserRouter, Route, Switch, Link} from 'react-router-dom';

import Router from 'next/router';
import {
  getCarriers,
  deleteCarrier,
  updateCarrier,
} from '../../../redux/actions/Carriers';
import {getUserData} from '../../../redux/actions/User';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
  GET_CARRIERS,
} from '../../../shared/constants/ActionTypes';
import {useDispatch, useSelector} from 'react-redux';
import {
  toEpoch,
  convertToDate,
  parseTo3Decimals,
  toSimpleDate,
} from '../../../Utils/utils';

let selectedCarrier = {};
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

let listPayload = {
  request: {
    payload: {
      typeDocumentCarrier: '',
      numberDocumentCarrier: '',
      denominationCarrier: '',
      merchantId: '',
    },
  },
};
let deletePayload = {
  request: {
    payload: {
      carrierId: '',
    },
  },
};

const CarrierTable = (arrayObjs, props) => {
  const classes = useStyles(props);
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [firstload, setFirstload] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [reload, setReload] = React.useState(0); // integer state
  const [openStatus, setOpenStatus] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  let popUp = false;
  let codProdSelected = '';

  //API FUNCTIONSupdateMovement
  const toGetCarriers = (payload, jwtToken) => {
    dispatch(getCarriers(payload, jwtToken));
  };
  const toDeleteCarrier = (payload) => {
    dispatch(deleteCarrier(payload));
  };

  const useForceUpdate = () => {
    return () => setReload((value) => value + 1); // update the state to force render
  };

  //GET APIS RES
  const {getCarriersRes} = useSelector(({carriers}) => carriers);
  console.log('Carriers123', getCarriersRes);
  const {deleteCarrierRes} = useSelector(({carriers}) => carriers);
  console.log('deleteCarrierRes', deleteCarrierRes);
  const {successMessage} = useSelector(({carriers}) => carriers);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({carriers}) => carriers);
  console.log('errorMessage', errorMessage);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);

  const {jwtToken} = useSelector(({general}) => general);
  console.log('Quiero usar jwtToken', jwtToken);

  useEffect(() => {
    if (userDataRes) {
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      dispatch({type: GET_CARRIERS, payload: undefined});
      console.log('Esto por que no funciona');
      listPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;

      toGetCarriers(listPayload, jwtToken);
      setFirstload(false);
    }
  }, [userDataRes]);

  useEffect(() => {
    if (!userDataRes) {
      console.log('Esto se ejecuta?');

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
  //OPCIONES SPLIT BUTTON
  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  //MILISEGUNDOS A TIEMPO
  const agregarCeroSiEsNecesario = (valor) => {
    if (valor < 10) {
      return '0' + valor;
    } else {
      return '' + valor;
    }
  };
  const milisegundosAMinutosYSegundos = (milisegundos) => {
    const minutos = parseInt(milisegundos / 1000 / 60);
    milisegundos -= minutos * 60 * 1000;
    const segundos = milisegundos / 1000;
    return `${agregarCeroSiEsNecesario(minutos)}:${agregarCeroSiEsNecesario(
      segundos.toFixed(1),
    )}`;
  };

  //BUSQUEDA
  const handleSearchValues = (event) => {
    console.log('Evento', event);
    if (event.target.name == 'docToSearch') {
      if (event.target.value == '') {
        listPayload.request.payload.numberDocumentCarrier = '';
      } else {
        listPayload.request.payload.numberDocumentCarrier = event.target.value;
      }
    }
    if (event.target.name == 'nameToSearch') {
      if (event.target.value == '') {
        listPayload.request.payload.denominationCarrier = '';
      } else {
        listPayload.request.payload.denominationCarrier = event.target.value;
      }
    }
  };

  //BUTTONS BAR FUNCTIONS
  const searchCarriers = () => {
    toGetCarriers(listPayload, jwtToken);
  };
  const newCarrier = () => {
    console.log('Para redireccionar a nuevo proveedor');
    Router.push('/sample/carriers/new');
  };

  const cleaneList = () => {
    let listResult = [];
    getCarriersRes.map((obj) => {
      let parsedId = obj.carrierId.split('-');
      obj['type'] = parsedId[0];
      obj['nroDocument'] = parsedId[1];
      obj.updatedDate = convertToDate(obj.updatedDate);
      //ESTOS CAMPOS DEBEN TENER EL MISMO NOMBRE, TANTO ARRIBA COMO ABAJO
      listResult.push(
        (({
          type,
          nroDocument,
          denominationCarrier,
          nameContact,
          updatedDate,
        }) => ({
          type,
          nroDocument,
          denominationCarrier,
          nameContact,
          updatedDate,
        }))(obj),
      );
    });
    return listResult;
  };
  const headersExcel = [
    'Tipo',
    'Número Documento',
    'Nombre / Razón social',
    'Nombre contacto',
    'Última actualización',
  ];
  const exportDoc = () => {
    var ws = XLSX.utils.json_to_sheet(cleaneList());
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Carriers');
    XLSX.utils.sheet_add_aoa(ws, [headersExcel], {origin: 'A1'});
    XLSX.writeFile(wb, 'Carriers.xlsx');
  };

  //FUNCIONES MENU
  const [anchorEl, setAnchorEl] = React.useState(null);
  /* let anchorEl = null; */
  const openMenu = Boolean(anchorEl);
  const handleClick = (codPro, event) => {
    console.log('evento', event);
    console.log('index del map', codPro);
    setAnchorEl(event.currentTarget);
    codProdSelected = codPro;
    selectedCarrier =
      getCarriersRes[codPro]; /* .find((obj) => obj.carrier == codPro); */
    console.log('selectedCarrier', selectedCarrier);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const goToUpdate = () => {
    console.log('Actualizando', selectedCarrier);
    Router.push({
      pathname: '/sample/carriers/update',
      query: selectedCarrier,
    });
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
    } else if (errorMessage != undefined) {
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
    setOpenStatus(false);
    setTimeout(() => {
      toGetCarriers(listPayload, jwtToken);
    }, 2000);
  };

  const setDeleteState = () => {
    setOpen2(true);
    handleClose();
  };

  const confirmDelete = () => {
    deletePayload.request.payload.carrierId = selectedCarrier.carrierId;
    toDeleteCarrier(deletePayload);
    setOpen2(false);
    setOpenStatus(true);
  };

  const onChangeHandler = (e) => {
    Router.push('/sample/carriers/bulk-load');
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const compare = (a, b) => {
    if (a.createdDate < b.createdDate) {
      return 1;
    }
    if (a.createdDate > b.createdDate) {
      return -1;
    }
    return 0;
  };

  return (
    <Card sx={{p: 4}}>
      <Stack
        sx={{m: 2}}
        direction={isMobile ? 'column' : 'row'}
        spacing={2}
        className={classes.stack}
      >
        <FormControl sx={{my: 0, width: 140}}>
          <InputLabel id='categoria-label' style={{fontWeight: 200}}>
            Identificador
          </InputLabel>
          <Select
            defaultValue=''
            name='typeDocumentCarrier'
            labelId='documentType-label'
            label='Identificador'
            sx={{maxWidth: 140}}
            onChange={(event) => {
              console.log(event.target.value);
              listPayload.request.payload.typeDocumentCarrier =
                event.target.value;
            }}
          >
            <MenuItem value='' style={{fontWeight: 200}}>
              Todos
            </MenuItem>
            <MenuItem value='RUC' style={{fontWeight: 200}}>
              RUC
            </MenuItem>
            <MenuItem value='DNI' style={{fontWeight: 200}}>
              DNI
            </MenuItem>
            <MenuItem value='CE' style={{fontWeight: 200}}>
              CE
            </MenuItem>
          </Select>
        </FormControl>
        <TextField
          label='Nro Identificador'
          variant='outlined'
          name='numberDocumentCarrier'
          size='small'
          onChange={(event) => {
            console.log(event.target.value);
            listPayload.request.payload.numberDocumentCarrier =
              event.target.value;
          }}
        />
        <TextField
          label='Nombre / Razón social'
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
          onClick={searchCarriers}
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
              <TableCell>Identificador</TableCell>
              <TableCell>Número Identificador</TableCell>
              <TableCell>Nombre / Razón social</TableCell>
              <TableCell>Nombre Contacto</TableCell>
              <TableCell>Última actualización</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getCarriersRes &&
            // && getCarriersRes.length > 0
            Array.isArray(getCarriersRes) ? (
              getCarriersRes.sort(compare).map((obj, index) => {
                let parsedId = obj.carrierId.split('-');
                return (
                  <TableRow
                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    key={index}
                  >
                    <TableCell>{parsedId[0]}</TableCell>
                    <TableCell>{parsedId[1]}</TableCell>
                    <TableCell>{obj.denominationCarrier}</TableCell>
                    <TableCell>{obj.nameContact}</TableCell>
                    <TableCell>{convertToDate(obj.updatedDate)}</TableCell>
                    {/* <TableCell>{obj.priceWithoutIgv.toFixed(2)}</TableCell>
                    <TableCell>{obj.stock}</TableCell>
                    <TableCell>{obj.costPriceUnit.toFixed(2)}</TableCell> */}
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
              })
            ) : (
              <CircularProgress disableShrink sx={{m: '10px'}} />
            )}
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
          .includes('/facturacion/carriers/register') === true ? (
          <Button
            variant='outlined'
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={newCarrier}
          >
            Nuevo
          </Button>
        ) : null}

        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/exportCarriers/*') === true ? (
          <Button
            variant='outlined'
            startIcon={<GridOnOutlinedIcon />}
            onClick={exportDoc}
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
          {'Eliminar proveedor'}
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
          {'Eliminar proveedor'}
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
          .includes('/facturacion/carriers/update') === true ? (
          <MenuItem onClick={goToUpdate}>
            <CachedIcon sx={{mr: 1, my: 'auto'}} />
            Actualizar
          </MenuItem>
        ) : null}

        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/carriers/delete') === true ? (
          <MenuItem onClick={setDeleteState}>
            <DeleteOutlineOutlinedIcon sx={{mr: 1, my: 'auto'}} />
            Eliminar
          </MenuItem>
        ) : null}
      </Menu>
    </Card>
  );
};

export default CarrierTable;
