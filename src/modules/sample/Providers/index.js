import React, {useEffect} from 'react';
const XLSX = require('xlsx');
import {
  FormControl,
  InputLabel,
  Select,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
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
  IconButton,
} from '@mui/material';

import {normalizeConfig} from 'next/dist/server/config-shared';
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
import {exportExcelTemplateToProviders} from '../../../redux/actions/General';

import {makeStyles} from '@mui/styles';
import {useHistory, BrowserRouter, Route, Switch, Link} from 'react-router-dom';

import Router from 'next/router';
import {
  onGetProviders,
  deleteProvider,
  updateProvider,
} from '../../../redux/actions/Providers';
import {useDispatch, useSelector} from 'react-redux';
import {
  toEpoch,
  convertToDate,
  parseTo3Decimals,
  toSimpleDate,
} from '../../../Utils/utils';
import {getUserData} from '../../../redux/actions/User';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
  GET_PROVIDERS,
  GENERATE_EXCEL_TEMPLATE_TO_PROVIDERS,
} from '../../../shared/constants/ActionTypes';
let selectedProvider = {};
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
      providerId: '',
    },
  },
};

const ProviderTable = (arrayObjs, props) => {
  const classes = useStyles(props);
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isNotMobile = useMediaQuery(theme.breakpoints.up('lg'));
  const [firstload, setFirstload] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [reload, setReload] = React.useState(0); // integer state
  const [openStatus, setOpenStatus] = React.useState(false);
  const [downloadExcel, setDownloadExcel] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [typeDocumentProvider, setTypeDocumentProvider] = React.useState('');
  const [numberDocumentProvider, setNumberDocumentProvider] =
    React.useState('');
  const [denominationProvider, setDenominationProvider] = React.useState('');
  let popUp = false;
  let codProdSelected = '';
  const [loading, setLoading] = React.useState(true);
  const {excelTemplateGeneratedToProvidersRes} = useSelector(
    ({general}) => general,
  );

  //API FUNCTIONSupdateMovement
  const getProviders = (payload) => {
    dispatch(onGetProviders(payload));
  };
  const toDeleteProvider = (payload) => {
    dispatch(deleteProvider(payload));
  };
  const toExportExcelTemplateToProviders = (payload) => {
    dispatch(exportExcelTemplateToProviders(payload));
  };

  const useForceUpdate = () => {
    return () => setReload((value) => value + 1); // update the state to force render
  };

  const handleNextPage = (event) => {
    //console.log('Llamando al  handleNextPage', handleNextPage);
    let listPayload = {
      request: {
        payload: {
          typeDocumentProvider: '',
          numberDocumentProvider: '',
          denominationProvider: '',
          merchantId: userDataRes.merchantSelected.merchantId,
          LastEvaluatedKey: providersLastEvalutedKey_pageListProviders,
        },
      },
    };
    console.log('listPayload111:handleNextPage:', listPayload);
    getProviders(listPayload);
    // setPage(page+1);
  };

  //GET APIS RES
  const {listProviders, providersLastEvalutedKey_pageListProviders} =
    useSelector(({providers}) => providers);
  console.log('providers123', listProviders);
  const {deleteProviderRes} = useSelector(({providers}) => providers);
  console.log('deleteProviderRes', deleteProviderRes);
  const {successMessage} = useSelector(({providers}) => providers);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({providers}) => providers);
  console.log('errorMessage', errorMessage);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);

  useEffect(() => {
    //dispatch({type: GET_PROVIDERS, payload: {callType: 'firstTime'}});

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

  useEffect(() => {
    if (
      userDataRes &&
      userDataRes.merchantSelected &&
      userDataRes.merchantSelected.merchantId
    ) {
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      //dispatch({type: GET_PROVIDERS, payload: undefined});
      let listPayload = {
        request: {
          payload: {
            typeDocumentProvider: '',
            numberDocumentProvider: '',
            denominationProvider: '',
            merchantId: userDataRes.merchantSelected.merchantId,
            LastEvaluatedKey: null,
          },
        },
      };
      //dispatch({type: GET_PROVIDERS, payload: {callType: 'firstTime'}});
      getProviders(listPayload);
      //setFirstload(false);
    }
  }, [userDataRes]);
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
        //listPayload.request.payload.numberDocumentProvider = '';
      } else {
        //listPayload.request.payload.numberDocumentProvider = event.target.value;
      }
    }
    if (event.target.name == 'nameToSearch') {
      if (event.target.value == '') {
        //listPayload.request.payload.denominationProvider = '';
        setDenominationProvider('');
      } else {
        //listPayload.request.payload.denominationProvider =
        //  event.target.value.toUpperCase();
        setDenominationProvider(event.target.value);
      }
    }
  };

  //BUTTONS BAR FUNCTIONS
  const searchProviders = () => {
    let listPayload = {
      request: {
        payload: {
          typeDocumentProvider: typeDocumentProvider,
          numberDocumentProvider: numberDocumentProvider,
          denominationProvider: denominationProvider,
          merchantId: userDataRes.merchantSelected.merchantId,
          LastEvaluatedKey: null,
        },
      },
    };
    //dispatch({type: GET_PROVIDERS, payload: {callType: 'firstTime'}});
    getProviders(listPayload);
  };
  const newProvider = () => {
    console.log('Para redireccionar a nuevo proveedor');
    Router.push('/sample/providers/new');
  };

  const cleaneList = () => {
    let listResult = [];
    listProviders.map((obj) => {
      let parsedId = obj.providerId.split('-');
      obj['type'] = parsedId[0];
      obj['nroDocument'] = parsedId[1];
      obj.updatedAt = convertToDate(obj.updatedAt || obj.updatedDate);
      //ESTOS CAMPOS DEBEN TENER EL MISMO NOMBRE, TANTO ARRIBA COMO ABAJO
      listResult.push(
        (({
          type,
          nroDocument,
          denominationProvider,
          nameContact,
          updatedAt,
        }) => ({
          type,
          nroDocument,
          denominationProvider,
          nameContact,
          updatedAt,
        }))(obj),
      );
    });
    return listResult;
  };

  const exportToExcel = () => {
    let listPayload = {
      request: {
        payload: {
          typeDocumentProvider: '',
          numberDocumentProvider: '',
          denominationProvider: '',
          merchantId: userDataRes.merchantSelected.merchantId,
          LastEvaluatedKey: null,
        },
      },
    };
    //const excelPayload = listPayload;

    console.log('excelPayload', excelPayload);
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: GENERATE_EXCEL_TEMPLATE_TO_PROVIDERS, payload: undefined});
    toExportExcelTemplateToProviders(listPayload);
    setDownloadExcel(true);
  };

  useEffect(() => {
    console.log(
      'excelTemplateGeneratedToProvidersRes',
      excelTemplateGeneratedToProvidersRes,
    );
    if (excelTemplateGeneratedToProvidersRes && downloadExcel) {
      setDownloadExcel(false);
      const byteCharacters = atob(excelTemplateGeneratedToProvidersRes);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Providers.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [excelTemplateGeneratedToProvidersRes, downloadExcel]);

  //FUNCIONES MENU
  const [anchorEl, setAnchorEl] = React.useState(null);
  /* let anchorEl = null; */
  const openMenu = Boolean(anchorEl);
  const handleClick = (codPro, event) => {
    console.log('evento', event);
    console.log('index del map', codPro);
    setAnchorEl(event.currentTarget);
    codProdSelected = codPro;
    selectedProvider =
      listProviders[codPro]; /* .find((obj) => obj.provider == codPro); */
    console.log('selectedProvider', selectedProvider);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const goToUpdate = () => {
    console.log('Actualizando', selectedProvider);
    Router.push({
      pathname: '/sample/providers/update',
      query: selectedProvider,
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
      let listPayload = {
        request: {
          payload: {
            typeDocumentProvider: '',
            numberDocumentProvider: '',
            denominationProvider: '',
            merchantId: userDataRes.merchantSelected.merchantId,
            LastEvaluatedKey: null,
          },
        },
      };
      //listPayload.request.payload.LastEvaluatedKey = null;
      //dispatch({type: GET_PROVIDERS, payload: {callType: 'firstTime'}});
      getProviders(listPayload);
    }, 2000);
  };

  const setDeleteState = () => {
    setOpen2(true);
    handleClose();
  };

  const confirmDelete = () => {
    deletePayload.request.payload.providerId = selectedProvider.providerId;
    toDeleteProvider(deletePayload);
    setOpen2(false);
    setOpenStatus(true);
  };

  const onChangeHandler = (e) => {
    Router.push('/sample/providers/bulk-load');
  };

  const handleClose2 = () => {
    setOpen2(false);
  };
  console.log('ESTOY AQUI');
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
            name='typeDocumentProvider'
            size='small'
            labelId='documentType-label'
            label='Identificador'
            sx={{maxWidth: 140}}
            onChange={(event) => {
              console.log(event.target.value);
              setTypeDocumentProvider(event.target.value);
              // listPayload.request.payload.typeDocumentProvider =
              //   event.target.value;
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
            <MenuItem value='foreignerscard' style={{fontWeight: 200}}>
              CE
            </MenuItem>
          </Select>
        </FormControl>
        <TextField
          label='Nro Identificador'
          variant='outlined'
          name='numberDocumentProvider'
          size='small'
          onChange={(event) => {
            console.log(event.target.value);
            setNumberDocumentProvider(event.target.value);
            // listPayload.request.payload.numberDocumentProvider =
            //   event.target.value;
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
          onClick={searchProviders}
        >
          Buscar
        </Button>
      </Stack>
      <span>{`Items: ${listProviders.length}`}</span>
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
            {listProviders && Array.isArray(listProviders) ? (
              listProviders.map((obj, index) => {
                let parsedId = obj.providerId.split('-');
                return (
                  <TableRow
                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    key={index}
                  >
                    <TableCell>{parsedId[0]}</TableCell>
                    <TableCell>{parsedId[1]}</TableCell>
                    <TableCell>{obj.denominationProvider}</TableCell>
                    <TableCell>{obj.nameContact}</TableCell>
                    {isNotMobile ? (
                      <TableCell>
                        {convertToDate(obj.updatedAt || obj.updatedDate)}
                      </TableCell>
                    ) : null}
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
              <CircularProgress
                disableShrink
                sx={{m: '10px', position: 'relative'}}
              />
            )}
          </TableBody>
        </Table>
        {providersLastEvalutedKey_pageListProviders ? (
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
          .includes('/inventory/providers/register') === true ? (
          <Button
            variant='outlined'
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={newProvider}
          >
            Nuevo
          </Button>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/exportProviders/*') === true ? (
          <Button
            variant='outlined'
            startIcon={<GridOnOutlinedIcon />}
            onClick={exportToExcel}
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
          .includes('/inventory/providers/update') === true ? (
          <MenuItem onClick={goToUpdate}>
            <CachedIcon sx={{mr: 1, my: 'auto'}} />
            Actualizar
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/providers/delete') === true ? (
          <MenuItem onClick={setDeleteState}>
            <DeleteOutlineOutlinedIcon sx={{mr: 1, my: 'auto'}} />
            Eliminar
          </MenuItem>
        ) : null}
      </Menu>
    </Card>
  );
};

export default ProviderTable;
