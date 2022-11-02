import React, {useEffect} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ButtonGroup,
  Button,
  MenuItem,
  Menu,
  IconButton,
  CircularProgress,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

import {useHistory, BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import Router from 'next/router';
import {onGetProviders} from '../../../redux/actions/Providers';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@mui/styles';
import PropTypes from 'prop-types';
import {
  toEpoch,
  convertToDate,
  parseTo3Decimals,
  toSimpleDate,
} from '../../../Utils/utils';

const SelectProvider = ({fcData}) => {
  const useStyles = {
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
  };

  const {listProviders} = useSelector(({providers}) => providers);
  console.log('providers123', listProviders);

  const newProduct = () => {
    Router.push('/sample/products/new');
  };

  //FUNCIONES MENU
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const goToUpdate = (info) => {
    console.log('Actualizando', info);
  };
  const setDeleteState = () => {
    console.log('Borrando producto :(');
  };

  const sendData = (obj) => {
    /* console.log('Objeto', obj);
    console.log('Funcion', props.fcData); */
    fcData(obj);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Identificador</TableCell>
            <TableCell>Nro Identificador</TableCell>
            <TableCell>Nombre/Razón Social</TableCell>
            <TableCell>Ultima actualización</TableCell>
            {/* <TableCell></TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {listProviders && typeof listProviders !== 'string' ? (
            listProviders.map((obj) => {
              let parsedId = obj.providerId.split('-');
              return (
                <TableRow
                  sx={{
                    '&:last-child td, &:last-child th': {border: 0},
                    cursor: 'pointer',
                  }}
                  key={obj.providerId}
                  id={obj.providerId}
                  hover
                  onClick={() => {
                    sendData(obj);
                  }}
                >
                  <TableCell>{parsedId[0]}</TableCell>
                  <TableCell>{parsedId[1]}</TableCell>
                  <TableCell>{obj.denominationProvider}</TableCell>
                  <TableCell>{convertToDate(obj.updatedDate)}</TableCell>
                  {/* <TableCell>
                    <IconButton
                      onClick={() => {
                        sendData(obj);
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </TableCell> */}
                </TableRow>
              );
            })
          ) : (
            <CircularProgress disableShrink sx={{m: '10px'}} />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

SelectProvider.propTypes = {
  fcData: PropTypes.func.isRequired,
};

export default SelectProvider;
