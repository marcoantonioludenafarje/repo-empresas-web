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

const ProfitTable = ({data}) => {
  console.log('Data', data);

  /* const showStatus = (val) => {
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
  }; */
  return (
    <TableContainer component={Paper} sx={{maxHeight: 270}}>
      <Table stickyHeader size='small' aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Mes del año</TableCell>
            <TableCell>Ingresos</TableCell>
            <TableCell>Egresos</TableCell>
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
                <TableCell>{obj.gain}</TableCell>
                <TableCell>{obj.lost}</TableCell>
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

ProfitTable.propTypes = {
  data: PropTypes.array,
};

export default ProfitTable;
