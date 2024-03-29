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
  IconButton,
  MenuItem,
  Menu,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IntlMessages from '../../../@crema/utility/IntlMessages';

import {useHistory, BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import Router from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@mui/styles';
import PropTypes from 'prop-types';

const DocumentsTable = ({arrayObjs, toDelete, typeForm}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [moneyUnit, setMoneyUnit] = React.useState('');

  const deleteProduct = (index) => {
    console.log('Index', index);
    toDelete(index);
  };

  const showType = (type) => {
    switch (type) {
      case 'creditNote':
        return <IntlMessages id='document.type.creditNote' />;
        break;
      case 'debitNote':
        return <IntlMessages id='document.type.debitNote' />;
        break;
      default:
        return null;
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}} size='small' aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Tipo de documento</TableCell>
            <TableCell>Documento</TableCell>
            <TableCell>Fecha documento</TableCell>
            <TableCell>IGV</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Opciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {arrayObjs && typeof arrayObjs !== 'string' ? (
            arrayObjs.map((obj, index) => {
              return (
                <TableRow
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  key={index}
                  id={index}
                >
                  <TableCell>{showType(obj.typeDocument)}</TableCell>
                  <TableCell>{obj.serialDocument}</TableCell>
                  <TableCell>{obj.issueDate}</TableCell>
                  <TableCell>{obj.totalIgv}</TableCell>
                  <TableCell>{obj.totalAmount}</TableCell>
                  <TableCell>
                    <IconButton onClick={deleteProduct.bind(this, index)}>
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

DocumentsTable.propTypes = {
  arrayObjs: PropTypes.array.isRequired,
  toDelete: PropTypes.func.isRequired,
  typeForm: PropTypes.string,
};
export default DocumentsTable;
