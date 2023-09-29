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
import {onGetClients} from '../../../redux/actions/Clients';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@mui/styles';
import PropTypes from 'prop-types';
import {dateWithHyphen} from '../../../Utils/utils';

const SelectClient = ({fcData}) => {
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

  const {listClients} = useSelector(({clients}) => clients);
  console.log('clients123', listClients);

  //FUNCIONES MENU
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const sendData = (obj) => {
    /* console.log('Objeto', obj);
    console.log('Funcion', props.fcData); */
    fcData(obj);
  };

  const saludar = () => {
    console.log('Hola');
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
          </TableRow>
        </TableHead>
        <TableBody>
          {listClients && typeof listClients !== 'string' ? (
            listClients.map((obj) => {
              let parsedId = obj.clientId.split('-');
              return (
                <TableRow
                  sx={{
                    '&:last-child td, &:last-child th': {border: 0},
                    cursor: 'pointer',
                  }}
                  key={obj.clientId}
                  id={obj.clientId}
                  hover
                  onClick={() => {
                    sendData(obj);
                  }}
                >
                  <TableCell>{parsedId[0]}</TableCell>
                  <TableCell>{parsedId[1]}</TableCell>
                  <TableCell>{obj.denominationClient}</TableCell>
                  <TableCell>
                    {dateWithHyphen(obj.updatedAt || obj.updatedDate)}
                  </TableCell>
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

SelectClient.propTypes = {
  fcData: PropTypes.func.isRequired,
};

export default SelectClient;
