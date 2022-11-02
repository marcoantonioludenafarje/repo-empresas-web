import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import {translateValue} from '../../../Utils/utils';

const OtherPayConceptsTable = ({arrayObjs, toDelete}) => {
  const convertToDate = (miliseconds) => {
    const fecha = new Date(miliseconds);
    const fecha_actual = `${fecha.getDate()}/${
      fecha.getMonth() + 1
    }/${fecha.getFullYear()}`;
    return fecha_actual;
  };

  const deletePayment = (index) => {
    console.log('Index', index);
    toDelete(index);
  };

  return (
    <TableContainer component={Paper} sx={{maxHeight: 440}}>
      <Table sx={{minWidth: 650}} stickyHeader aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Nro</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Monto</TableCell>
            <TableCell>Acción</TableCell>
            <TableCell>Método de pago</TableCell>
            <TableCell>Comentario</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {arrayObjs && typeof arrayObjs !== 'string' ? (
            arrayObjs.map((obj, index) => {
              return (
                <TableRow
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  size='medium'
                  key={index}
                  id={index}
                >
                  <TableCell>{obj.transactionNumber}</TableCell>
                  <TableCell>{obj.description}</TableCell>
                  <TableCell>{obj.amount}</TableCell>
                  <TableCell>
                    {obj.conceptAction
                      ? translateValue(
                          'CONCEPTACTION',
                          obj.conceptAction.toUpperCase(),
                        )
                      : null}
                  </TableCell>
                  <TableCell>
                    {obj.paymentMethod
                      ? translateValue(
                          'PAYMENTMETHOD',
                          obj.paymentMethod.toUpperCase(),
                        )
                      : null}
                  </TableCell>
                  <TableCell>{obj.commentPayment}</TableCell>
                  <TableCell>
                    <IconButton onClick={deletePayment.bind(this, index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <></>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

OtherPayConceptsTable.propTypes = {
  arrayObjs: PropTypes.array.isRequired,
  toDelete: PropTypes.func.isRequired,
};
export default OtherPayConceptsTable;
