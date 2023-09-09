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
  getListBusiness,
  ableBusiness
} from '../../../redux/actions/Admin'
import {convertToDate} from '../../../Utils/utils';
import {useDispatch, useSelector} from 'react-redux';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
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


  const [reload, setReload] = React.useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filteredSpecialists, setFilteredSpecialists] = useState([]);
  const {successMessage} = useSelector(({specialists}) => specialists);
  const {errorMessage} = useSelector(({specialists}) => specialists);

  let popUp = false;

  const onGetListBusiness = (payload) => {
    dispatch(getListBusiness(payload));
  };

  const reloadPage = () => {
    setReload(!reload);
  };
  const {userDataRes} = useSelector(({user}) => user);

  // const {listBusiness, agentsLastEvaluatedKey_pageListAgents} = useSelector(
  //   ({admin}) => specialists,
  // );
  const pruebaRedux = useSelector((state)=>state)

  const {listBusinessRes} = useSelector(({admin})=> admin);

  console.log('confeti los especialistas', listBusinessRes);

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
      listBusinessRes[codPro]; /* .find((obj) => obj.client == codPro); */
    console.log('Select Agente', selectedBusiness);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const goToProduct = () => {
    //usuario
    Router.push({
      pathname: '/sample/admin/productive',
    });
  };
  const goToSunat = () => {
    Router.push({
      pathname: '/sample/admin/sunat',
    });
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
    //getSpecialist(listPayload);
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
      //getSpecialist(listPayload);
    }, 2000);
  };

  const listClients = [
    {
      id: 1,
      social: 'Empresa nueva',
      user: 'Usuario nuevo',
      state: 'Activo',
      type: 'UAT',
      plan: 'plan',
      sunat: 'No',
    },
  ];

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
              <TableCell>Integrada a SUNAT?</TableCell>
              <TableCell>Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listBusinessRes?.map((row, index) => {
              console.log('listSpecialists:-->', listBusinessRes);
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
                    {row.indactivo=='S'?'SÍ':'NO'}
                  </TableCell>
                  <TableCell
                    style={{maxWidth: '200px', wordWrap: 'break-word'}}
                  >
                    {row.typeMerchant}
                  </TableCell>
                  <TableCell
                    style={{maxWidth: '200px', wordWrap: 'break-word'}}
                  >
                    {row.plans.length > 0 ? row.plans[row.plans.length - 1].type : ''}
                  </TableCell>
                  <TableCell
                    style={{maxWidth: '200px', wordWrap: 'break-word'}}
                  >
                    {row.isBillingEnabled?'SÍ':'NO'}
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
          .includes('/business/admin/productive') === true ? (
          <MenuItem onClick={goToProduct}>
            <CachedIcon sx={{mr: 1, my: 'auto'}} />
            Dar Alta a productivo
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/business/admin/sunat') === true ? (
          <MenuItem onClick={goToSunat}>
            <DeleteOutlineOutlinedIcon sx={{mr: 1, my: 'auto'}} />
            Activar SUNAT
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/business/admin/enabled') === true ? (
          <MenuItem>
            <CachedIcon sx={{mr: 1, my: 'auto'}} />
            Habilitar Negocio
          </MenuItem>
        ) : null}
        {localStorage
          .getItem('pathsBack')
          .includes('/business/admin/disabled') === true ? (
          <MenuItem>
            <DeleteOutlineOutlinedIcon sx={{mr: 1, my: 'auto'}} />
            Deshabilitar Negocio
          </MenuItem>
        ) : null}
      </Menu>
    </Card>
  );
}
