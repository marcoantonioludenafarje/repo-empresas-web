import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
} from '@mui/material';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const SelectCarrier = ({fcData}) => {
  const {getCarriersRes} = useSelector(({carriers}) => carriers);
  console.log('getCarriersRes', getCarriersRes);

  const sendCarrier = (obj) => {
    fcData(obj);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Tipo</TableCell>
            <TableCell>Número Documento</TableCell>
            <TableCell>Nombre/Razón Social</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {getCarriersRes && typeof getCarriersRes !== 'string' ? (
            getCarriersRes.map((obj) => {
              let parsedId = obj.carrierId.split('-');
              return (
                <TableRow
                  sx={{
                    '&:last-child td, &:last-child th': {border: 0},
                    cursor: 'pointer',
                  }}
                  key={obj.carrierId}
                  id={obj.carrierId}
                  hover
                  onClick={() => {
                    sendCarrier(obj);
                  }}
                >
                  <TableCell>{parsedId[0]}</TableCell>
                  <TableCell>{parsedId[1]}</TableCell>
                  <TableCell>{obj.denominationCarrier}</TableCell>
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

SelectCarrier.propTypes = {
  fcData: PropTypes.func.isRequired,
};

export default SelectCarrier;
