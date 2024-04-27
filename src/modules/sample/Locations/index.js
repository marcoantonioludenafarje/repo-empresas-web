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
  Autocomplete,
  Grid,
  useTheme,
  useMediaQuery,
  TableSortLabel,
  IconButton,
} from '@mui/material';

import {SET_JWT_TOKEN} from '../../../shared/constants/ActionTypes';
import AppUpperCaseTextField from '../../../@crema/core/AppFormComponents/AppUpperCaseTextField';
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

import {makeStyles} from '@mui/styles';
import {useHistory, BrowserRouter, Route, Switch, Link} from 'react-router-dom';

import Router from 'next/router';
import {
  getLocations,
  deleteLocation,
  updateLocation,
} from '../../../redux/actions/Locations';
import {getUserData} from '../../../redux/actions/User';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
  GET_LOCATIONS,
} from '../../../shared/constants/ActionTypes';
import {useDispatch, useSelector} from 'react-redux';
import {
  toEpoch,
  convertToDate,
  parseTo3Decimals,
  toSimpleDate,
} from '../../../Utils/utils';
import originalUbigeos from '../../../Utils/ubigeo.json';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import {normalizeConfig} from 'next/dist/server/config-shared';

import {ClickAwayListener} from '@mui/base';
let selectedLocation = {};
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
      locationId: '',
    },
  },
};

let objSelectsU = {
  ubigeo: '150101',
};

//FORCE UPDATE
const useForceUpdate = () => {
  const [reload, setReload] = React.useState(0); // integer state
  return () => setReload((value) => value + 1); // update the state to force render
};
const LocationTable = (arrayObjs, props) => {
  const classes = useStyles(props);
  const history = useHistory();
  const dispatch = useDispatch();
  const [firstload, setFirstload] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const forceUpdate = useForceUpdate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isNotMobile = useMediaQuery(theme.breakpoints.up('lg'));
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [reload, setReload] = React.useState(0); // integer state
  const [openStatus, setOpenStatus] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [ubigeo, setUbigeo] = React.useState('');
  const [locationName, setLocationName] = React.useState('');
  const [locationCode, setLocationCode] = React.useState('');
  const [type, setType] = React.useState('');
  const [existUbigeo, setExistUbigeo] = React.useState(true);
  const [parsedUbigeos, setParsedUbigeos] = React.useState([]);
  const [readyData, setReadyData] = React.useState(false);
  const [objUbigeo, setObjUbigeo] = React.useState({
    descripcion: 'Todos',
    label: 'Todos',
    ubigeo: '',
  });
  const [orderBy, setOrderBy] = React.useState(''); // Estado para almacenar el campo de ordenación actual
  const [order, setOrder] = React.useState('asc'); // Estado para almacenar la dirección de ordenación

  let popUp = false;
  let codProdSelected = '';

  //API FUNCTIONSupdateMovement
  const toGetLocations = (payload, jwtToken) => {
    dispatch(getLocations(payload, jwtToken));
  };
  const toDeleteLocation = (payload) => {
    dispatch(deleteLocation(payload));
  };

  //GET APIS RES
  const {getLocationsRes, locationsLastEvaluatedKey_pageListLocations} =
    useSelector(({locations}) => locations);
  console.log('Locations123', getLocationsRes);
  const {deleteLocationRes} = useSelector(({locations}) => locations);
  console.log('deleteLocationRes', deleteLocationRes);
  const {successMessage} = useSelector(({locations}) => locations);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({locations}) => locations);
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
            locationName: '',
            type: '',
            ubigeo: '',
            merchantId: '',
            modularCode: '',
            LastEvaluatedKey: null,
            needItems: true,
          },
        },
      };
      listPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;

      toGetLocations(listPayload, jwtToken);
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
          locationName: locationName,
          type: type == 'TODOS' ? '' : type,
          ubigeo: ubigeo,
          merchantId: userDataRes.merchantSelected.merchantId,
          modularCode: locationCode,
          LastEvaluatedKey: locationsLastEvaluatedKey_pageListLocations,
          needItems: true,
        },
      },
    };
    // listPayload.request.payload.LastEvaluatedKey = productsLastEvaluatedKey_pageListProducts;
    console.log('listPayload111:handleNextPage:', listPayload);
    toGetLocations(listPayload);
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

    sortedProducts = [...allProductsRes].sort((a, b) => {
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
      type: GET_LOCATIONS,
      payload: sortedProducts,
      handleSort: true,
    });
    forceUpdate();
  };

  //BUSQUEDA
  const handleSearchValues = (event) => {
    console.log('Evento', event);
    let listPayload = {
      request: {
        payload: {
          locationName: locationName,
          type: type,
          ubigeo: ubigeo,
          merchantId: userDataRes.merchantSelected.merchantId,
          modularCode: locationCode,
          LastEvaluatedKey: null,
          needItems: true,
        },
      },
    };
    if (event.target.name == 'codeToSearch') {
      console.log('codeToSearch:' + event.target.value);
      if (event.target.value == '') {
        listPayload.request.payload.modularCode = '';
      } else {
        listPayload.request.payload.modularCode = event.target.value;
      }
    }
    if (event.target.name == 'nameToSearch') {
      console.log('nameToSearch:' + event.target.value);
      if (event.target.value == '') {
        listPayload.request.payload.locationName = '';
      } else {
        listPayload.request.payload.locationName = event.target.value;
      }
    }
    if (event.target.name == 'typeToSearch') {
      if (event.target.value == '') {
        listPayload.request.payload.type = '';
      } else {
        listPayload.request.payload.type = event.target.value;
      }
    }
    if (event.target.name == 'ubigeoToSearch') {
      console.log(
        'ubigeoToSearch:' + event.target.value + ':' + objUbigeo.ubigeo,
      );
      if (event.target.value == '') {
        listPayload.request.payload.ubigeo = '';
      } else {
        listPayload.request.payload.ubigeo = objUbigeo.ubigeo;
      }
    }
  };

  //BUTTONS BAR FUNCTIONS
  const searchLocations = () => {
    let listPayload = {
      request: {
        payload: {
          locationName: locationName,
          type: type == 'TODOS' ? '' : type,
          ubigeo: ubigeo,
          merchantId: userDataRes.merchantSelected.merchantId,
          modularCode: locationCode,
          LastEvaluatedKey: null,
          needItems: true,
        },
      },
    };
    console.log('Buscando con este payload', listPayload);
    toGetLocations(listPayload, jwtToken);
  };
  const newLocation = () => {
    console.log('Para redireccionar a nuevo locación');
    Router.push('/sample/locations/new');
  };

  const cleaneList = () => {
    let listResult = [];
    getLocationsRes.map((obj) => {
      obj.updatedAt = convertToDate(obj.updatedAt || obj.updatedDate);
      //ESTOS CAMPOS DEBEN TENER EL MISMO NOMBRE, TANTO ARRIBA COMO ABAJO
      listResult.push(
        (({
          modularCode,
          locationName,
          locationDetail,
          ubigeo,
          type,
          updatedAt,
        }) => ({
          modularCode,
          locationName,
          locationDetail,
          ubigeo,
          type,
          updatedAt,
        }))(obj),
      );
    });
    return listResult;
  };
  const headersExcel = [
    'Código',
    'Nombre',
    'Dirección',
    'Ubicación',
    'Tipo',
    'Última actualización',
  ];
  const exportDoc = () => {
    var ws = XLSX.utils.json_to_sheet(cleaneList());
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Locations');
    XLSX.utils.sheet_add_aoa(ws, [headersExcel], {origin: 'A1'});
    XLSX.writeFile(wb, 'Locations.xlsx');
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
    selectedLocation =
      getLocationsRes[codPro]; /* .find((obj) => obj.carrier == codPro); */
    console.log('selectedLocation', selectedLocation);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const goToUpdate = () => {
    console.log('Actualizando', selectedLocation);
    Router.push({
      pathname: '/sample/locations/update',
      query: selectedLocation,
    });
  };

  const handleClickAway = () => {
    // Evita que se cierre el diálogo haciendo clic fuera del contenido
    // Puedes agregar condiciones adicionales aquí si deseas una lógica más específica.
  };
  const showMessage = () => {
    if (
      successMessage != undefined &&
      deleteLocationRes &&
      !deleteLocationRes.error
    ) {
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
    } else if (
      (deleteLocationRes && deleteLocationRes.error) ||
      errorMessage != undefined
    ) {
      return (
        <>
          <CancelOutlinedIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            {deleteLocationRes.error} {errorMessage}
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
      let listPayload = {
        request: {
          payload: {
            locationName: '',
            type: '',
            ubigeo: '',
            merchantId: userDataRes.merchantSelected.merchantId,
            modularCode: '',
            LastEvaluatedKey: null,
            needItems: true,
          },
        },
      };
      toGetLocations(listPayload, jwtToken);
    }, 2000);
  };

  const setDeleteState = () => {
    setOpen2(true);
    handleClose();
  };

  const confirmDelete = () => {
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    deletePayload.request.payload.locationId = selectedLocation.locationId;
    deletePayload.request.payload.locationName =
      selectedLocation.modularCode + '-' + selectedLocation.locationName;
    deletePayload.request.payload.type = selectedLocation.type;
    deletePayload.request.payload.merchantId = selectedLocation.merchantId;
    toDeleteLocation(deletePayload);
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

  const setLabelUbigeo = (ubi) => {
    const resultUbigeo = originalUbigeos.find((o) => o.ubigeo == ubi);
    if (!resultUbigeo) {
      ubi = 'Ubigeo no encontrado';
    } else {
      ubi = resultUbigeo.descripcion + ' - ' + resultUbigeo.ubigeo;
    }
    return ubi;
  };

  useEffect(() => {
    const ubigeos = originalUbigeos.map((obj, index) => {
      return {
        label: `${obj.descripcion} - ${obj.ubigeo}`,
        ...obj,
      };
    });

    ubigeos.push({
      descripcion: 'Todos',
      label: 'Todos',
      ubigeo: '',
    });

    setParsedUbigeos(ubigeos);
    if (readyData) {
      setObjUbigeo(ubigeos[ubigeos.length - 1]);
      setUbigeo(ubigeos[ubigeos.length - 1].ubigeo.toString());
      objSelectsU.ubigeo = ubigeos[ubigeos.length - 1].ubigeo.toString();
      setExistUbigeo(true);
      setReadyData(true);
    }
  }, [readyData]);

  return (
    <Card sx={{p: 4}}>
      <Stack
        sx={{m: 2}}
        direction={isMobile ? 'column' : 'row'}
        spacing={2}
        className={classes.stack}
      >
        <TextField
          label='Codigo'
          variant='outlined'
          name='codeToSearch'
          size='big'
          value={locationCode}
          onChange={(event) => {
            console.log('Este es el event del code', event.target.value);
            //listPayload.request.payload.locationName = event.target.value;
            setLocationCode(event.target.value.toUpperCase());
          }}
        />
        <TextField
          label='Nombre'
          variant='outlined'
          name='nameToSearch'
          size='big'
          onChange={(event) => {
            console.log(event.target.value);
            //listPayload.request.payload.locationName = event.target.value;
            setLocationName(event.target.value);
          }}
        />
        <FormControl sx={{my: 0, width: 140}}>
          <InputLabel id='type-label' style={{fontWeight: 200}}>
            Tipo
          </InputLabel>
          <Select
            defaultValue=''
            name='typeToSearch'
            labelId='type-label'
            label='Tipo'
            onChange={(event) => {
              console.log(event.target.value);
              //listPayload.request.payload.type = event.target.value;
              setType(event.target.value);
            }}
          >
            <MenuItem value='TODOS' style={{fontWeight: 200}}>
              Todos
            </MenuItem>
            <MenuItem value='PUNTO LLEGADA' style={{fontWeight: 200}}>
              PUNTO LLEGADA
            </MenuItem>
            <MenuItem value='PUNTO PARTIDA' style={{fontWeight: 200}}>
              PUNTO PARTIDA
            </MenuItem>
          </Select>
        </FormControl>
        <Grid xs={6} sx={{my: 0, maxWidth: 350}}>
          <Autocomplete
            disablePortal
            id='ubigeoToSearch'
            value={objUbigeo}
            isOptionEqualToValue={(option, value) =>
              option.ubigeo === value.ubigeo.toString()
            }
            getOptionLabel={(option) => option.label || ''}
            onChange={(option, value) => {
              if (typeof value === 'object' && value != null && value !== '') {
                console.log('objeto ubigeo', value);
                setObjUbigeo(value);
                setUbigeo(value.ubigeo.toString());
                objSelectsU.ubigeo = value.ubigeo.toString();
                //listPayload.request.payload.ubigeo = objSelectsU.ubigeo;
                setExistUbigeo(true);
              } else {
                setExistUbigeo(false);
              }
              console.log('ubigeo, punto de partida', value);
            }}
            options={parsedUbigeos}
            renderInput={(params) => (
              <TextField
                {...params}
                label={<IntlMessages id='ubigeo.signUp' />}
                onChange={(event) => {
                  console.log('event field', event.target.value);
                  if (event.target.value === '') {
                    console.log('si se cambia a null');
                    setExistUbigeo(false);
                  }
                }}
              />
            )}
          />
        </Grid>
        {/* <Button startIcon={<FilterAltOutlinedIcon />} variant='outlined'>
          Más filtros
        </Button> */}
        <Button
          startIcon={isNotMobile ? <ManageSearchOutlinedIcon /> : null}
          variant='contained'
          color='primary'
          onClick={searchLocations}
        >
          Buscar
        </Button>
      </Stack>
      <span>{`Items: ${getLocationsRes.length}`}</span>
      <TableContainer component={Paper} sx={{maxHeight: 440}}>
        <Table
          sx={{minWidth: 650}}
          stickyHeader
          size='small'
          aria-label='sticky table'
        >
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Tipo</TableCell>
              {isNotMobile ? <TableCell>Última actualización</TableCell> : null}
              <TableCell
                align='center'
                sx={{
                  px: isNotMobile ? normalizeConfig : 0,
                  width: isNotMobile ? normalizeConfig : '16px',
                }}
              >
                {isNotMobile ? 'Opciones' : '#'}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getLocationsRes &&
            // && getCarriersRes.length > 0
            Array.isArray(getLocationsRes) ? (
              getLocationsRes.sort(compare).map((obj, index) => {
                return (
                  <TableRow
                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    key={index}
                  >
                    <TableCell>{obj.modularCode}</TableCell>
                    <TableCell>{obj.locationName}</TableCell>
                    <TableCell>{obj.locationDetail}</TableCell>
                    <TableCell>{setLabelUbigeo(obj.ubigeo)}</TableCell>
                    <TableCell>{obj.type}</TableCell>
                    {isNotMobile ? (
                      <TableCell>
                        {convertToDate(obj.updatedAt || obj.updatedDate)}
                      </TableCell>
                    ) : null}
                    {/* <TableCell>{obj.priceWithoutIgv.toFixed(2)}</TableCell>
                    <TableCell>{obj.stock}</TableCell>
                    <TableCell>{obj.costPriceUnit.toFixed(2)}</TableCell> */}
                    <TableCell
                      sx={{
                        px: isNotMobile ? normalizeConfig : 0,
                        width: isNotMobile ? normalizeConfig : '16px',
                      }}
                    >
                      <Button
                        sx={{
                          px: isNotMobile ? normalizeConfig : 0,
                          minWidth: isNotMobile ? normalizeConfig : '16px',
                        }}
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
        {locationsLastEvaluatedKey_pageListLocations ? (
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
          .includes('/facturacion/locations/register') === true ? (
          <Button
            variant='outlined'
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={newLocation}
          >
            Nuevo
          </Button>
        ) : null}

        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/exportLocations/*') === true ? (
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
            {'Eliminar localización'}
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
          {'Eliminar localización'}
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
          .includes('/facturacion/locations/update') === true ? (
          <MenuItem onClick={goToUpdate}>
            <CachedIcon sx={{mr: 1, my: 'auto'}} />
            Actualizar
          </MenuItem>
        ) : null}

        {localStorage
          .getItem('pathsBack')
          .includes('/facturacion/locations/delete') === true ? (
          <MenuItem onClick={setDeleteState}>
            <DeleteOutlineOutlinedIcon sx={{mr: 1, my: 'auto'}} />
            Eliminar
          </MenuItem>
        ) : null}
      </Menu>
    </Card>
  );
};

export default LocationTable;
