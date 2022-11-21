import React, {useEffect} from 'react';
const XLSX = require('xlsx');
import {
  Table,
  TableBody,
  Box,
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
  Collapse,
  IconButton,
} from '@mui/material';
import Chip from '@mui/material/Chip';

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import {red} from '@mui/material/colors';

import {makeStyles} from '@mui/styles';
import {useHistory, BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import {getUserData} from '../../../redux/actions/User';

import Router from 'next/router';
import {
  onGetOrders,
  deleteOrder,
  updateOrder,
  changeStatusOrder,
} from '../../../redux/actions/Orders';
import {useDispatch, useSelector} from 'react-redux';
import {
  toEpoch,
  convertToDate,
  parseTo3Decimals,
  toSimpleDate,
} from '../../../Utils/utils';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
  GET_ORDERS,
} from '../../../shared/constants/ActionTypes';
let selectedOrder = {};
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
      typeDocumentOrder: '',
      numberDocumentOrder: '',
      denominationOrder: '',
      merchantId: '',
    },
  },
};
let deletePayload = {
  request: {
    payload: {
      orderId: '',
    },
  },
};

const OrderTable = (arrayObjs, props) => {
  const classes = useStyles(props);
  const history = useHistory();
  const dispatch = useDispatch();
  const [firstload, setFirstload] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [openDeliveryAddress, setOpenDeliveryAddress] = React.useState(false);
  const [openItems, setOpenItems] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [reload, setReload] = React.useState(0); // integer state
  const [openStatus, setOpenStatus] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [rowNumber, setRowNumber] = React.useState(0);
  let popUp = false;
  let codProdSelected = '';

  //API FUNCTIONSupdateMovement
  const getOrders = (payload) => {
    dispatch(onGetOrders(payload));
  };
  const toDeleteOrder = (payload) => {
    dispatch(deleteOrder(payload));
  };
  const toChangeStatusOrder = (payload) => {
    dispatch(changeStatusOrder(payload));
  };

  const useForceUpdate = () => {
    return () => setReload((value) => value + 1); // update the state to force render
  };

  //GET APIS RES
  const {listOrders} = useSelector(({orders}) => orders);
  console.log('orders123', listOrders);
  const {deleteProviderRes} = useSelector(({providers}) => providers);
  console.log('deleteProviderRes', deleteProviderRes);
  const {successMessage} = useSelector(({orders}) => orders);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({orders}) => orders);
  console.log('errorMessage', errorMessage);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);

  const {moneySymbol} = useSelector(({general}) => general);
  useEffect(() => {
    if (userDataRes) {
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      dispatch({type: GET_ORDERS, payload: undefined});

      listPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;

      getOrders(listPayload);
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
        listPayload.request.payload.numberDocumentOrder = '';
      } else {
        listPayload.request.payload.numberDocumentOrder = event.target.value;
      }
    }
    if (event.target.name == 'nameToSearch') {
      if (event.target.value == '') {
        listPayload.request.payload.denominationOrder = '';
      } else {
        listPayload.request.payload.denominationOrder = event.target.value;
      }
    }
  };

  const checkDeliveryAddress = (input, index) => {
    selectedOrder = input;
    console.log('selectedOrder', selectedOrder);
    setOpenDeliveryAddress(true);
    if (openDeliveryAddress == true && rowNumber == index) {
      setOpenDeliveryAddress(false);
    }
    setRowNumber(index);
  };

  const checkItems = (input, index) => {
    selectedOrder = input;
    console.log('selectedOrder', selectedOrder);
    setOpenItems(true);
    if (openItems == true && rowNumber == index) {
      setOpenItems(false);
    }
    setRowNumber(index);
  };

  const cleanList = () => {
    let listResult = [];
    listOrders.map((obj) => {
      let parsedId = obj.orderId.split('-');
      obj['type'] = parsedId[0];
      obj['nroDocument'] = parsedId[1];
      obj.updatedDate = convertToDate(obj.updatedDate);
      //ESTOS CAMPOS DEBEN TENER EL MISMO NOMBRE, TANTO ARRIBA COMO ABAJO
      listResult.push(
        (({
          type,
          nroDocument,
          denominationOrder,
          nameContact,
          updatedDate,
        }) => ({
          type,
          nroDocument,
          denominationOrder,
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
    'Nombre Contacto',
    'Ultima actualización',
  ];
  //BUTTONS BAR FUNCTIONS
  const searchOrders = () => {
    getOrders(listPayload);
  };
  const newOrder = () => {
    console.log('Para redireccionar a nuevo ordere');
    Router.push('/sample/orders/new');
  };
  const exportDoc = () => {
    var ws = XLSX.utils.json_to_sheet(cleanList());
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.utils.sheet_add_aoa(ws, [headersExcel], {origin: 'A1'});
    XLSX.writeFile(wb, 'Orders.xlsx');
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
    selectedOrder =
      listOrders[codPro]; /* .find((obj) => obj.order == codPro); */
    console.log('selectedOrder', selectedOrder);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const goToUpdate = () => {
    console.log('Actualizando', selectedOrder);
    Router.push({
      pathname: '/sample/orders/update',
      query: selectedOrder,
    });
  };

  const goToUpdateStatusToPending = () => {
    console.log('Actualizando status', selectedOrder);
    toChangeStatusOrder({
      request: {
        payload: {
          orderId: selectedOrder.orderId,
          status: 'pending',
        },
      },
    });

    setOpen2(false);
    setOpenStatus(true);
  };
  const goToUpdateStatusToDelivered = () => {
    console.log('Actualizando status', selectedOrder);
    toChangeStatusOrder({
      request: {
        payload: {
          orderId: selectedOrder.orderId,
          status: 'delivered',
        },
      },
    });

    setOpen2(false);
    setOpenStatus(true);
  };
  const goToUpdateStatusToCanceled = () => {
    console.log('Actualizando status', selectedOrder);
    toChangeStatusOrder({
      request: {
        payload: {
          orderId: selectedOrder.orderId,
          status: 'canceled',
        },
      },
    });

    setOpen2(false);
    setOpenStatus(true);
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
    } else if (errorMessage != undefined) {
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

  const sendStatus = () => {
    setOpenStatus(false);
    setTimeout(() => {
      getOrders(listPayload);
    }, 2000);
  };

  const setDeleteState = () => {
    setOpen2(true);
    handleClose();
  };

  const confirmDelete = () => {
    deletePayload.request.payload.orderId = selectedOrder.orderId;
    toDeleteOrder(deletePayload);
    setOpen2(false);
    setOpenStatus(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const onChangeHandler = (e) => {
    Router.push('/sample/orders/bulk-load');
  };
  const showIconStatus = (status) => {
    console.log('cual es el status', status);

    switch (status) {
      case 'pending':
        return <Chip label='Pendiente' color='primary' />;
      case 'delivered':
        return <Chip label='Entregado' color='success' />;
      case 'canceled':
        return <Chip label='Anulado' color='warning' />;
      default:
        return <Chip label='Pendiente' color='primary' />;
    }
  };
  const goToFile = () => {
    // Router.push({
    //   pathname: '/sample/explorer',
    //   query: {
    //     goDirectory: true,
    //     path: 'productos/' + selectedOrder.,
    //   },
    // });
    window.open(
      `https://d2moc5ro519bc0.cloudfront.net/${selectedOrder.pathFile}`,
    );
  };

  return (
    <Card sx={{p: 4}}>
      <Stack sx={{m: 2}} direction='row' spacing={2} className={classes.stack}>
        <FormControl sx={{my: 0, width: 100}}>
          <InputLabel id='categoria-label' style={{fontWeight: 200}}>
            Identificador
          </InputLabel>
          <Select
            defaultValue='RUC'
            name='typeDocumentOrder'
            labelId='documentType-label'
            label='Identificador'
            onChange={(event) => {
              console.log(event.target.value);
              listPayload.request.payload.typeDocumentOrder =
                event.target.value;
            }}
          >
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
          name='numberDocumentOrder'
          size='small'
          onChange={(event) => {
            console.log(event.target.value);
            listPayload.request.payload.numberDocumentOrder =
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
          onClick={searchOrders}
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
              {/* <TableCell>Identificador</TableCell> */}
              <TableCell>Número de Orden</TableCell>
              <TableCell>Productos</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Total IGV</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Tipo de Pago</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Última actualización</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listOrders && listOrders.length > 0 ? (
              listOrders.map((obj, index) => {
                const deliveryAddress = obj.deliveryAddress;
                const items = obj.items;
                return (
                  <>
                    <TableRow
                      sx={{'&:last-child td, &:last-child th': {border: 0}}}
                      key={index}
                    >
                      {/* <TableCell>{obj.orderId}</TableCell> */}
                      <TableCell>ORD-{obj.orderNumber}</TableCell>
                      <TableCell align='center'>
                        {obj.items ? (
                          <IconButton
                            onClick={() => checkItems(obj, index)}
                            size='small'
                          >
                            <FormatListBulletedIcon fontSize='small' />
                          </IconButton>
                        ) : (
                          <></>
                        )}
                      </TableCell>
                      <TableCell align='center'>
                        {obj.deliveryAddress ? (
                          <IconButton
                            onClick={() => checkDeliveryAddress(obj, index)}
                            size='small'
                          >
                            <FormatListBulletedIcon fontSize='small' />
                          </IconButton>
                        ) : (
                          <></>
                        )}
                      </TableCell>
                      <TableCell>{obj.totalIgv}</TableCell>
                      <TableCell>{obj.total}</TableCell>
                      <TableCell>{obj.paymentType}</TableCell>
                      <TableCell align='center'>
                        {showIconStatus(obj.status)}
                      </TableCell>
                      <TableCell>{convertToDate(obj.updatedDate)}</TableCell>
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
                    <TableRow key={`doc1-${index}`}>
                      <TableCell
                        style={{paddingBottom: 0, paddingTop: 0}}
                        colSpan={14}
                      >
                        <Collapse
                          in={openDeliveryAddress && index == rowNumber}
                          timeout='auto'
                          unmountOnExit
                        >
                          <Box sx={{margin: 0}}>
                            <Table size='small' aria-label='purchases'>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Tipo Documento</TableCell>
                                  <TableCell>Número Documento</TableCell>
                                  <TableCell>Nombre Completo</TableCell>
                                  <TableCell>Dirección de Entrega</TableCell>
                                  <TableCell>Número de contacto</TableCell>
                                  <TableCell>Correo Electrónico</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow key={index} sx={{cursor: 'pointer'}}>
                                  <TableCell>
                                    {deliveryAddress
                                      ? deliveryAddress.documentType
                                      : ''}
                                  </TableCell>
                                  <TableCell>
                                    {deliveryAddress
                                      ? deliveryAddress.nroDocument
                                      : ''}
                                  </TableCell>
                                  <TableCell>
                                    {deliveryAddress
                                      ? deliveryAddress.name
                                      : ''}
                                  </TableCell>
                                  <TableCell>
                                    {deliveryAddress
                                      ? deliveryAddress.addressProvider
                                      : ''}
                                  </TableCell>
                                  <TableCell>
                                    {deliveryAddress
                                      ? deliveryAddress.numberContact
                                      : ''}
                                  </TableCell>
                                  <TableCell>
                                    {deliveryAddress
                                      ? deliveryAddress.addressProvider
                                      : ''}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                    <TableRow key={`doc2-${index}`}>
                      <TableCell
                        style={{paddingBottom: 0, paddingTop: 0}}
                        colSpan={14}
                      >
                        <Collapse
                          in={openItems && index == rowNumber}
                          timeout='auto'
                          unmountOnExit
                        >
                          <Box sx={{margin: 0}}>
                            <Table size='small' aria-label='purchases'>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Código</TableCell>
                                  <TableCell>Título</TableCell>
                                  <TableCell>Cantidad</TableCell>
                                  <TableCell>Precio de Venta</TableCell>
                                  <TableCell>Descuento</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {items && items.length !== 0
                                  ? items.map((item, index) => {
                                      return (
                                        <TableRow
                                          key={index}
                                          sx={{cursor: 'pointer'}}
                                        >
                                          <TableCell>
                                            {
                                              item.productId
                                                .replace(/^(0+)/g, '')
                                                .split('-')[0]
                                            }
                                          </TableCell>
                                          <TableCell>{item.title}</TableCell>
                                          <TableCell>{item.quantity}</TableCell>
                                          <TableCell>{`${moneySymbol} ${item.sellPriceUnit}`}</TableCell>
                                          <TableCell>{item.discount}</TableCell>
                                        </TableRow>
                                      );
                                    })
                                  : null}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
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
          .includes('/inventory/orders/register') === true ? (
          <Button
            variant='outlined'
            startIcon={<AddCircleOutlineOutlinedIcon />}
            onClick={newOrder}
          >
            Nuevo
          </Button>
        ) : null}

        <Button
          startIcon={<GridOnOutlinedIcon />}
          onClick={exportDoc}
          variant='outlined'
        >
          Exportar todo
        </Button>
      </ButtonGroup>
      <Dialog
        open={openStatus}
        onClose={sendStatus}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Cambiar Estado de la Orden'}
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
          {'Eliminar orden'}
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
          .includes('/inventory/admin/ecommerce/order/update') === true ? (
          <MenuItem onClick={goToUpdateStatusToPending}>
            <CachedIcon sx={{mr: 1, my: 'auto'}} />
            Cambiar estado a pendiente
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/admin/ecommerce/order/update') === true ? (
          <MenuItem onClick={goToUpdateStatusToCanceled}>
            <CachedIcon sx={{mr: 1, my: 'auto'}} />
            Cambiar estado a cancelado
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/admin/ecommerce/order/update') === true ? (
          <MenuItem onClick={goToUpdateStatusToDelivered}>
            <CachedIcon sx={{mr: 1, my: 'auto'}} />
            Cambiar estado a entregado
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/inventory/admin/ecommerce/order/delete') === true ? (
          <MenuItem onClick={setDeleteState}>
            <DeleteOutlineOutlinedIcon sx={{mr: 1, my: 'auto'}} />
            Eliminar
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/utility/listObjectsPathMerchant') === true &&
        selectedOrder.paymentType == 'CVIRTUAL' ? (
          <MenuItem onClick={goToFile}>
            <ReceiptLongIcon sx={{mr: 1, my: 'auto'}} />
            Ver Comprobante
          </MenuItem>
        ) : null}
      </Menu>
    </Card>
  );
};

export default OrderTable;
