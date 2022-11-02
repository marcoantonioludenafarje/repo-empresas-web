import React, {Component} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';

const StockTable = ({data}) => {
  console.log('Data', data);

  const showStatus = (val) => {
    switch (true) {
      case val <= 100:
        return (
          <Typography sx={{color: 'error.light', fontWeight: '500'}}>
            Malo
          </Typography>
        );
        break;
      case val <= 250:
        return (
          <Typography sx={{color: '#edd900', fontWeight: '500'}}>
            Aceptable
          </Typography>
        );
        break;
      case val > 250:
        return (
          <Typography sx={{color: 'success.main', fontWeight: '500'}}>
            Excelente
          </Typography>
        );
        break;
    }
  };
  return (
    <TableContainer component={Paper} sx={{maxHeight: 270}}>
      <Table stickyHeader size='small' aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Producto</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data && typeof data !== 'string' ? (
            data.map((obj, index) => (
              <TableRow
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                key={index}
              >
                <TableCell>{obj.name}</TableCell>
                <TableCell>{obj.value}</TableCell>
                <TableCell>{showStatus(obj.value)}</TableCell>
              </TableRow>
            ))
          ) : (
            <></>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

StockTable.propTypes = {
  data: PropTypes.array,
};

export default StockTable;
