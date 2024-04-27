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
  useTheme,
  useMediaQuery,
  CircularProgress,
  TableSortLabel,
  IconButton,
} from '@mui/material';

import {SET_JWT_TOKEN} from '../../../shared/constants/ActionTypes';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
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

import {ClickAwayListener} from '@mui/base';
import {makeStyles} from '@mui/styles';
import {useHistory, BrowserRouter, Route, Switch, Link} from 'react-router-dom';

import Router from 'next/router';
import {
  getDrivers,
  deleteDriver,
  updateDriver,
} from '../../../redux/actions/Drivers';
import {getUserData} from '../../../redux/actions/User';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
  GET_DRIVERS,
} from '../../../shared/constants/ActionTypes';
import {useDispatch, useSelector} from 'react-redux';
import {
  toEpoch,
  convertToDate,
  parseTo3Decimals,
  toSimpleDate,
} from '../../../Utils/utils';

let selectedDriver = {};
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

let deletePayload = {
  request: {
    payload: {
      driverId: '',
    },
  },
};

//FORCE UPDATE
const useForceUpdate = () => {
  const [reload, setReload] = React.useState(0); // integer state
  return () => setReload((value) => value + 1); // update the state to force render
};
const DriverTable = (arrayObjs, props) => {
  const classes = useStyles(props);
  const history = useHistory();
  const dispatch = useDispatch();
  const [firstload, setFirstload] = React.useState(true);
  const theme = useTheme();
  const forceUpdate = useForceUpdate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [reload, setReload] = React.useState(0); // integer state
  const [openStatus, setOpenStatus] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [numberDocumentDriver, setNumberDocumentDriver] = React.useState('');
  const [nameToSearch, setNameToSearch] = React.useState('');
  const [typeDocumentDriver, setTypeDocumentDriver] = React.useState('');
  const [orderBy, setOrderBy] = React.useState(''); // Estado para almacenar el campo de ordenación actual
  const [order, setOrder] = React.useState('asc'); // Estado para almacenar la dirección de ordenación

  let popUp = false;
  let codProdSelected = '';

  //API FUNCTIONSupdateMovement
  const toGetDrivers = (payload, jwtToken) => {
    dispatch(getDrivers(payload, jwtToken));
  };
  const toDeleteDriver = (payload) => {
    dispatch(deleteDriver(payload));
  };

  //GET APIS RES
  const {getDriversRes, driversLastEvaluatedKey_pageListDrivers} = useSelector(
    ({drivers}) => drivers,
  );
  console.log('Drivers123', getDriversRes);
  const {deleteDriverRes} = useSelector(({drivers}) => drivers);
  console.log('deleteDriverRes', deleteDriverRes);
  const {successMessage} = useSelector(({drivers}) => drivers);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({drivers}) => drivers);
  console.log('errorMessage', errorMessage);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);

  const {jwtToken} = useSelector(({general}) => general);
  console.log('Quiero usar jwtToken', jwtToken);

  useEffect(() => {
    if (userDataRes) {
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      console.log('Esto por que no funciona');
      let listPayload = {
        request: {
          payload: {
            typeDocumentDriver: '',
            numberDocumentDriver: '',
            fullName: '',
            merchantId: userDataRes.merchantSelected.merchantId,
            LastEvaluatedKey: driversLastEvaluatedKey_pageListDrivers,
            needItems: true,
          },
        },
      };

      toGetDrivers(listPayload, jwtToken);
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

  const handleNextPage = (event) => {
    //console.log('Llamando al  handleNextPage', handleNextPage);
    let listPayload = {
      request: {
        payload: {
          typeDocumentDriver: typeDocumentDriver,
          numberDocumentDriver: numberDocumentDriver,
          fullName: nameToSearch,
          merchantId: userDataRes.merchantSelected.merchantId,
          LastEvaluatedKey: driversLastEvaluatedKey_pageListDrivers,
          needItems: true,
        },
      },
    };
    // listPayload.request.payload.LastEvaluatedKey = productsLastEvaluatedKey_pageListProducts;
    console.log('listPayload111:handleNextPage:', listPayload);
    toGetDrivers(listPayload);
    // setPage(page+1);
  };

  // Función para manejar el clic en el encabezado de la tabla
  const handleSort = (field, type) => {
    let sortedProducts;

    if (orderBy === field) {
      // Si se hace clic en el mismo encabezado, cambiamos la dirección de ordenación
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(field);
      setOrder('asc');
    }

    sortedProducts = [...getDriversRes].sort((a, b) => {
      let descriptionA = null;
      if (type == 'number' || type == 'date')
        descriptionA =
          (a[`${field}`] ? Number(a[`${field}`].toString()) : 0) ?? 0;
      else descriptionA = (a[`${field}`] ? a[`${field}`].toString() : '') ?? '';

      let descriptionB = null;
      if (type == 'number' || type == 'date')
        descriptionB =
          (b[`${field}`] ? Number(b[`${field}`].toString()) : 0) ?? 0;
      else descriptionB = (b[`${field}`] ? b[`${field}`].toString() : '') ?? '';

      console.log('descriptionA', descriptionA);
      console.log('descriptionB', descriptionB);

      if (order === 'asc') {
        if (type == 'number' || type == 'date')
          return descriptionA - descriptionB;
        else return descriptionA.localeCompare(descriptionB);
      } else {
        if (type == 'number' || type == 'date')
          return descriptionB - descriptionA;
        else return descriptionB.localeCompare(descriptionA);
      }
    });

    dispatch({
      type: GET_DRIVERS,
      payload: sortedProducts,
      handleSort: true,
    });
    forceUpdate();
  };

  //BUSQUEDA
  const handleSearchValues = (event) => {
    console.log('Evento', event);
    if (event.target.name == 'typeDocumentDriver') {
      if (event.target.value == 'TODOS') {
        setTypeDocumentDriver('');
      } else {
        setTypeDocumentDriver(event.target.value);
      }
    }
    if (event.target.name == 'numberDocumentDriver') {
      // if (event.target.value == '') {
      //   listPayload.request.payload.numberDocumentDriver = '';
      // } else {
      //   listPayload.request.payload.numberDocumentDriver = event.target.value;
      // }
      setNumberDocumentDriver(event.target.value);
    }
    if (event.target.name == 'nameToSearch') {
      // if (event.target.value == '') {
      //   listPayload.request.payload.fullName = '';
      // } else {
      //   listPayload.request.payload.fullName = event.target.value;
      // }
      setNameToSearch(event.target.value);
    }
  };

  //BUTTONS BAR FUNCTIONS
  const searchDrivers = () => {
    let listPayload = {
      request: {
        payload: {
          typeDocumentDriver: typeDocumentDriver,
          numberDocumentDriver: numberDocumentDriver,
          fullName: nameToSearch,
          merchantId: userDataRes.merchantSelected.merchantId,
          LastEvaluatedKey: null,
          needItems: true,
        },
      },
    };
    toGetDrivers(listPayload, jwtToken);
  };
  const newDriver = () => {
    console.log('Para redireccionar a nuevo conductor');
    Router.push('/sample/drivers/new');
  };

  const cleaneList = () => {
    let listResult = [];
    getDriversRes.map((obj) => {
      let parsedId = obj.driverId.split('-');
      obj['type'] = parsedId[0];
      obj['nroDocument'] = parsedId[1];
      obj.updatedAt = convertToDate(obj.updatedAt || obj.updatedDate);
      //ESTOS CAMPOS DEBEN TENER EL MISMO NOMBRE, TANTO ARRIBA COMO ABAJO
      listResult.push(
        (({type, nroDocument, fullName, license, updatedAt}) => ({
          type,
          nroDocument,
          fullName,
          license,
          updatedAt,
        }))(obj),
      );
    });
    return listResult;
  };
  const headersExcel = [
    'Tipo',
    'Número Documento',
    'Nombre Completo',
    'Licencia',
    'Última actualización',
  ];
  const exportDoc = () => {
    var ws = XLSX.utils.json_to_sheet(cleaneList());
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Drivers');
    XLSX.utils.sheet_add_aoa(ws, [headersExcel], {origin: 'A1'});
    XLSX.writeFile(wb, 'Drivers.xlsx');
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
    selectedDriver =
      getDriversRes[codPro]; /* .find((obj) => obj.carrier == codPro); */
    console.log('selectedDriver', selectedDriver);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const goToUpdate = () => {
    console.log('Actualizando', selectedDriver);
    Router.push({
      pathname: '/sample/drivers/update',
      query: selectedDriver,
    });
  };

  const handleClickAway = () => {
    // Evita que se cierre el diálogo haciendo clic fuera del contenido
    // Puedes agregar condiciones adicionales aquí si deseas una lógica más específica.
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
    setOpenStatus(false);
    setTimeout(() => {
      toGetDrivers(listPayload, jwtToken);
    }, 2000);
  };

  const setDeleteState = () => {
    setOpen2(true);
    handleClose();
  };

  const confirmDelete = () => {
    deletePayload.request.payload.driverId = selectedDriver.driverId;
    toDeleteDriver(deletePayload);
    setOpen2(false);
    setOpenStatus(true);
  };

  const onChangeHandler = (e) => {
    Router.push('/sample/drivers/bulk-load');
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const compare = (a, b) => {
    if (a.createdAt < b.createdAt) {
      return 1;
    }
    if (a.createdAt > b.createdAt) {
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
          <InputLabel
            id='categoria-label'
            style={{fontWeight: 200}}
            sx={{mt: -2}}
          >
            Identificador
          </InputLabel>
          <Select
            defaultValue=''
            name='typeDocumentDriver'
            labelId='documentType-label'
            size='small'
            label='Identificador'
            sx={{maxWidth: 140}}
            onChange={handleSearchValues}
          >
            <MenuItem value='TODOS' style={{fontWeight: 200}}>
              Todos
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
          name='numberDocumentDriver'
          size='small'
          onChange={handleSearchValues}
        />
        <TextField
          label='Nombre Completo'
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
          onClick={searchDrivers}
        >
          Buscar
        </Button>
      </Stack>
      <span>{`Items: ${getDriversRes.length}`}</span>
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
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'fullName'}
                  direction={orderBy === 'fullName' ? order : 'asc'}
                  onClick={() => handleSort('fullName')}
                >
                  Nombre Conductor
                </TableSortLabel>
              </TableCell>
              <TableCell>Licencia</TableCell>
              <TableCell>Última actualización</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getDriversRes &&
            // && getCarriersRes.length > 0
            Array.isArray(getDriversRes) ? (
              getDriversRes.sort(compare).map((obj, index) => {
                let parsedId = obj.driverId.split('-');
                return (
                  <TableRow
                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    key={index}
                  >
                    <TableCell>{parsedId[0]}</TableCell>
                    <TableCell>{parsedId[1]}</TableCell>
                    <TableCell>{obj.fullName}</TableCell>
                    <TableCell>{obj.license}</TableCell>
                    <TableCell>
                      {convertToDate(obj.updatedAt || obj.updatedDate)}
                    </TableCell>
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
        {driversLastEvaluatedKey_pageListDrivers ? (
          <Stack spacing={2}>
            <IconButton onClick={() => handleNextPage()} size='small'>
              Siguiente <ArrowForwardIosIcon fontSize='inherit' />
            </IconButton>
          </Stack>
        ) : null}
      </TableContainer>
      <ButtonGroup
        variant='outlined'
        aria-label='outlined button group'
        className={classes.btnGroup}
      >
        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/drivers/register') === true ? (
          <Button
            variant='outlined'
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={newDriver}
          >
            Nuevo
          </Button>
        ) : null}

        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/exportDrivers/*') === true ? (
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

      <ClickAwayListener onClickAway={handleClickAway}>
        <Dialog
          open={openStatus}
          onClose={sendStatus}
          sx={{textAlign: 'center'}}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
            {'Eliminar conductor'}
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
      </ClickAwayListener>
      <Dialog
        open={open2}
        onClose={handleClose2}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Eliminar conductor'}
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
          .includes('/facturacion/drivers/update') === true ? (
          <MenuItem onClick={goToUpdate}>
            <CachedIcon sx={{mr: 1, my: 'auto'}} />
            Actualizar
          </MenuItem>
        ) : null}

        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/drivers/delete') === true ? (
          <MenuItem onClick={setDeleteState}>
            <DeleteOutlineOutlinedIcon sx={{mr: 1, my: 'auto'}} />
            Eliminar
          </MenuItem>
        ) : null}
      </Menu>
    </Card>
  );
};

export default DriverTable;
