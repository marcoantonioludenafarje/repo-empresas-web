import React, {useEffect} from 'react';
const XLSX = require('xlsx');
import {
  Table,
  TableBody,
  FormControl,
  Select,
  InputLabel,
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
  IconButton,
  Grid,
  Box,
  Autocomplete,
} from '@mui/material';

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
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CloseIcon from '@mui/icons-material/Close';
import {red} from '@mui/material/colors';
import {exportExcelTemplateToClients} from '../../../redux/actions/General';
import CheckIcon from '@mui/icons-material/Check';
import {makeStyles} from '@mui/styles';
import {useHistory, BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import {getUserData} from '../../../redux/actions/User';

import {ClickAwayListener} from '@mui/base';
import Router from 'next/router';
import {
  onGetClients,
  deleteClient,
  updateClient,
} from '../../../redux/actions/Clients';
import {useDispatch, useSelector} from 'react-redux';
import {
  toEpoch,
  convertToDate,
  parseTo3Decimals,
  toSimpleDate,
  verTags,
} from '../../../Utils/utils';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
  GET_CLIENTS,
  GENERATE_EXCEL_TEMPLATE_TO_CLIENTS,
} from '../../../shared/constants/ActionTypes';
let selectedClient = {};
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
import {normalizeConfig} from 'next/dist/server/config-shared';

// let listPayload = {
//   request: {
//     payload: {
//       typeDocumentClient: '',
//       numberDocumentClient: '',
//       denominationClient: '',
//       merchantId: '',
//     },
//   },
// };
let deletePayload = {
  request: {
    payload: {
      clientId: '',
    },
  },
};

const ClientTable = (arrayObjs, props) => {
  const classes = useStyles(props);
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isNotMobile = useMediaQuery(theme.breakpoints.up('lg'));
  const [firstload, setFirstload] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [reload, setReload] = React.useState(0); // integer state
  const [openStatus, setOpenStatus] = React.useState(false);
  const [downloadExcel, setDownloadExcel] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [typeDocumentClient, setTypeDocumentClient] = React.useState('');
  const [numberDocumentClient, setNumberDocumentClient] = React.useState('');
  const [denominationClient, setDenominationClient] = React.useState('');
  const [listTags, setListTags] = React.useState([]);
  const [tagSelected, setTagSelected] = React.useState([]);

  let popUp = false;
  let codProdSelected = '';
  const [loading, setLoading] = React.useState(true);
  const {excelTemplateGeneratedToClientsRes} = useSelector(
    ({general}) => general,
  );
  const {businessParameter} = useSelector(({general}) => general);

  //API FUNCTIONSupdateMovement
  const getClients = (payload) => {
    dispatch(onGetClients(payload));
  };
  const toDeleteClient = (payload) => {
    dispatch(deleteClient(payload));
  };
  const toExportExcelTemplateToClients = (payload) => {
    dispatch(exportExcelTemplateToClients(payload));
  };

  const useForceUpdate = () => {
    return () => setReload((value) => value + 1); // update the state to force render
  };

  //GET APIS RES
  const {listClients, clientsLastEvalutedKey_pageListClients} = useSelector(
    ({clients}) => clients,
  );
  console.log('clients123', listClients);
  const {deleteProviderRes} = useSelector(({providers}) => providers);
  console.log('deleteProviderRes', deleteProviderRes);
  const {successMessage} = useSelector(({clients}) => clients);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({clients}) => clients);
  console.log('errorMessage', errorMessage);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);

  const handleNextPage = (event) => {
    //console.log('Llamando al  handleNextPage', handleNextPage);
    let listPayload = {
      request: {
        payload: {
          typeDocumentClient: '',
          numberDocumentClient: '',
          denominationClient: '',
          merchantId: userDataRes.merchantSelected.merchantId,
          LastEvaluatedKey: clientsLastEvalutedKey_pageListClients,
        },
      },
    };
    // listPayload.request.payload.LastEvaluatedKey = clientsLastEvalutedKey_pageListClients;
    console.log('listPayload111:handleNextPage:', listPayload);
    getClients(listPayload);
    // setPage(page+1);
  };

  useEffect(() => {
    console.log('Estamos userDataRes', userDataRes);
    if (
      userDataRes &&
      userDataRes.merchantSelected &&
      userDataRes.merchantSelected.merchantId
    ) {
      if (businessParameter && listTags.length == 0) {
        let listTags1 = businessParameter.find(
          (obj) => obj.abreParametro == 'CLIENT_TAGS',
        ).value;

        listTags1.forEach((item) => {
          listTags.push([item.tagName, item.id, true]);
        });
      }

      console.log('Estamos entrando al getClients');
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
      getClients(listPayload);
      // setFirstload(true);
    }
  }, [userDataRes, listTags]);
  useEffect(() => {
    // dispatch({type: GET_CLIENTS, payload: {callType: "firstTime"}});

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
      // listPayload.request.payload.typeDocumentClient = '';
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
    let listPayload = {
      request: {
        payload: {
          typeDocumentClient: '',
          numberDocumentClient: '',
          denominationClient: '',
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };

    if (event.target.name == 'docToSearch') {
      if (event.target.value == '') {
        listPayload.request.payload.numberDocumentClient = '';
      } else {
        listPayload.request.payload.numberDocumentClient = event.target.value;
      }
    }
    if (event.target.name == 'nameToSearch') {
      if (event.target.value == '') {
        listPayload.request.payload.denominationClient = '';
        setDenominationClient('');
      } else {
        listPayload.request.payload.denominationClient =
          event.target.value.toUpperCase();
        setDenominationClient(event.target.value);
      }
    }
  };

  //BUTTONS BAR FUNCTIONS
  const searchClients = () => {
    let listPayload = {
      request: {
        payload: {
          typeDocumentClient: typeDocumentClient,
          numberDocumentClient: numberDocumentClient,
          denominationClient: denominationClient,
          merchantId: userDataRes.merchantSelected.merchantId,
          LastEvaluatedKey: null,
        },
      },
    };
    //listPayload.request.payload.LastEvaluatedKey = null;
    // dispatch({type: GET_CLIENTS, payload: {callType: "firstTime"}});
    if (tagSelected.length > 0) {
      let listTagsSelected = [];
      tagSelected.forEach((item) => {
        listTagsSelected.push(item[1]);
      });
      listPayload.request.payload.tags = listTagsSelected;
    }
    getClients(listPayload);
  };
  const newClient = () => {
    console.log('Para redireccionar a nuevo cliente');
    Router.push('/sample/clients/new');
  };

  const cleanList = () => {
    let listResult = [];
    listClients.map((obj) => {
      let parsedId = obj.clientId.split('-');
      obj['type'] = parsedId[0];
      obj['nroDocument'] = parsedId[1];
      obj.updatedAt = convertToDate(obj.updatedAt || obj.updatedDate);
      //ESTOS CAMPOS DEBEN TENER EL MISMO NOMBRE, TANTO ARRIBA COMO ABAJO
      listResult.push(
        (({type, nroDocument, denominationClient, nameContact, updatedAt}) => ({
          type,
          nroDocument,
          denominationClient,
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
          typeDocumentClient: '',
          numberDocumentClient: '',
          denominationClient: '',
          merchantId: userDataRes.merchantSelected.merchantId,
          LastEvaluatedKey: null,
        },
      },
    };

    // console.log('excelPayload', excelPayload);
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: GENERATE_EXCEL_TEMPLATE_TO_CLIENTS, payload: undefined});
    toExportExcelTemplateToClients(listPayload);
    setDownloadExcel(true);
  };

  useEffect(() => {
    if (excelTemplateGeneratedToClientsRes && downloadExcel) {
      setDownloadExcel(false);
      const byteCharacters = atob(excelTemplateGeneratedToClientsRes);
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
      link.setAttribute('download', 'Clients.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [excelTemplateGeneratedToClientsRes, downloadExcel]);

  //FUNCIONES MENU
  const [anchorEl, setAnchorEl] = React.useState(null);
  /* let anchorEl = null; */
  const openMenu = Boolean(anchorEl);
  const handleClick = (codPro, event) => {
    console.log('evento', event);
    console.log('index del map', codPro);
    setAnchorEl(event.currentTarget);
    codProdSelected = codPro;
    selectedClient =
      listClients[codPro]; /* .find((obj) => obj.client == codPro); */
    console.log('selectedClient', selectedClient);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const goToUpdate = () => {
    console.log('Actualizando', selectedClient);

    Router.push({
      pathname: '/sample/clients/update',
      query: selectedClient,
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
      // listPayload.request.payload.LastEvaluatedKey = null;
      // dispatch({type: GET_CLIENTS, payload: {callType: "firstTime"}});
      getClients(listPayload);
    }, 2000);
  };

  const setDeleteState = () => {
    setOpen2(true);
    handleClose();
  };

  const confirmDelete = () => {
    deletePayload.request.payload.clientId = selectedClient.clientId;
    console.log('deletePayload', deletePayload);
    toDeleteClient(deletePayload);
    setOpen2(false);
    setOpenStatus(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const onChangeHandler = (e) => {
    Router.push('/sample/clients/bulk-load');
  };

  const handlerTags = (event, values) => {
    console.log('Cambiando tags');
    console.log('evento tag', event);
    console.log('values tag', values);
    console.log('tag seleccionado', event.target.attributes.value);
    setTagSelected(values);
    reloadPage();
  };

  const reloadPage = () => {
    setReload(!reload);
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
            name='typeDocumentClient'
            labelId='documentType-label'
            label='Identificador'
            size='small'
            sx={{maxWidth: 140}}
            onChange={(event) => {
              console.log('Está pasando por aquí?', event.target.value);
              setTypeDocumentClient(event.target.value);
              // listPayload.request.payload.typeDocumentClient =
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
            <MenuItem value='CE' style={{fontWeight: 200}}>
              CE
            </MenuItem>
          </Select>
        </FormControl>
        <TextField
          label='Nro Identificador'
          variant='outlined'
          name='numberDocumentClient'
          size='small'
          onChange={(event) => {
            console.log(event.target.value);
            setNumberDocumentClient(event.target.value);
            // listPayload.request.payload.numberDocumentClient =
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

        <Grid item xs={12} md={3}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Autocomplete
              sx={{
                width: '100%', // Establece el ancho al 100% por defecto
                [(theme) => theme.breakpoints.down('sm')]: {
                  width: '80%', // Ancho del 80% en pantallas pequeñas
                },
                [(theme) => theme.breakpoints.up('md')]: {
                  width: 500, // Ancho fijo de 500px en pantallas medianas y grandes
                },
              }}
              multiple
              options={listTags.filter((option) => option[2] == true)}
              getOptionLabel={(option) => option[0]}
              onChange={handlerTags}
              disableCloseOnSelect
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant='outlined'
                  label='Etiqueta'
                  placeholder='Etiqueta'
                  size='small'
                />
              )}
              renderOption={(props, option, {selected}) => (
                <MenuItem
                  {...props}
                  key={option[1]}
                  value={option}
                  sx={{justifyContent: 'space-between'}}
                >
                  {option[0]}
                  {selected ? <CheckIcon color='info' /> : null}
                </MenuItem>
              )}
            />
          </Box>
        </Grid>

        <Button
          startIcon={isNotMobile ? <ManageSearchOutlinedIcon /> : null}
          variant='contained'
          color='primary'
          onClick={searchClients}
        >
          Buscar
        </Button>
      </Stack>
      <span>{`Items: ${listClients?.length || 0}`}</span>
      <TableContainer component={Paper} sx={{maxHeight: 440}}>
        <Table
          sx={{minWidth: 650}}
          stickyHeader
          size='small'
          aria-label='sticky table'
        >
          <TableHead>
            <TableRow>
              {isNotMobile ? (
                <>
                  <TableCell>Identificador</TableCell>
                  <TableCell>Número Identificador</TableCell>
                </>
              ) : (
                <TableCell>Identificador-Número</TableCell>
              )}
              <TableCell>Nombre / Razón social</TableCell>
              {isNotMobile ? <TableCell>Teléfono</TableCell> : null}
              {isNotMobile ? <TableCell>Nombre Contacto</TableCell> : null}
              <TableCell>Etiquetas</TableCell>
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
            {listClients && Array.isArray(listClients) ? (
              //  &&
              //  listClients.length > 0
              listClients.map((obj, index) => {
                let parsedId = obj.clientId.split('-');
                return (
                  <TableRow
                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    key={index}
                  >
                    {isNotMobile ? (
                      <>
                        <TableCell>{parsedId[0]}</TableCell>
                        <TableCell>{parsedId[1]}</TableCell>
                      </>
                    ) : (
                      <TableCell>
                        {parsedId[0]}-{parsedId[1]}
                      </TableCell>
                    )}
                    <TableCell>{obj.denominationClient}</TableCell>
                    {isNotMobile && obj.numberContact ? (
                      <TableCell>
                        {' '}
                        {obj.numberCountryCode ? obj.numberCountryCode : ''}
                        {obj.numberContact ? obj.numberContact : ''}{' '}
                      </TableCell>
                    ) : (
                      ''
                    )}
                    {isNotMobile ? (
                      <TableCell>{obj.nameContact}</TableCell>
                    ) : null}
                    <TableCell>{verTags(obj, businessParameter)}</TableCell>
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
              <CircularProgress disableShrink sx={{m: '10px'}} />
            )}
          </TableBody>
        </Table>
        {clientsLastEvalutedKey_pageListClients ? (
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
          .includes('/inventory/clients/register') === true ? (
          <Button
            variant='outlined'
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={newClient}
          >
            Nuevo
          </Button>
        ) : null}

        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/exportClients/*') === true ? (
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
      <ClickAwayListener onClickAway={handleClickAway}>
        <Dialog
          open={openStatus}
          onClose={sendStatus}
          sx={{textAlign: 'center'}}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
            {'Eliminar Cliente'}
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
          {'Eliminar cliente'}
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
          .includes('/inventory/clients/update') === true ? (
          <MenuItem onClick={goToUpdate}>
            <CachedIcon sx={{mr: 1, my: 'auto'}} />
            Actualizar
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/clients/delete') === true ? (
          <MenuItem onClick={setDeleteState}>
            <DeleteOutlineOutlinedIcon sx={{mr: 1, my: 'auto'}} />
            Eliminar
          </MenuItem>
        ) : null}
      </Menu>
    </Card>
  );
};

export default ClientTable;
