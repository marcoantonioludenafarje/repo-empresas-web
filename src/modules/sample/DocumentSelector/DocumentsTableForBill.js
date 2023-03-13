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
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import IntlMessages from '../../../@crema/utility/IntlMessages';

import {useHistory, BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import Router from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@mui/styles';
import PropTypes from 'prop-types';

const DocumentsTableForBill = ({arrayObjs, toDelete, typeForm, toSelect}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [moneyUnit, setMoneyUnit] = React.useState('');

  const deleteProduct = (index) => {
    console.log('Index', index);
    toDelete(index);
  };
  const selectProduct = (index) => {
    console.log('Index', index);
    toSelect(index);
  };
  const handleSelectAll = () => {
    selectAll();
  };

  const handleDeselectAll = () => {
    deselectAll();
  };
  const showType = (type) => {
    switch (type) {
      case 'quotation':
        return <IntlMessages id='document.type.quotation' />;
        break;
      case 'bill':
        return <IntlMessages id='document.type.bill' />;
        break;
      case 'referralGuide':
        return <IntlMessages id='document.type.referralGuide' />;
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
            <TableCell style={{ width: '50px' }}></TableCell>
            <TableCell>Tipo de documento</TableCell>
            <TableCell>Documento</TableCell>
            <TableCell>Fecha documento</TableCell>
            {/* <TableCell>Opciones</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {arrayObjs && typeof arrayObjs !== 'string' ? (
            arrayObjs.map((obj, index) => {
              const isSelected = obj.isSelected ? true : false;
              return (
                <TableRow
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  key={index}
                  id={index}
                >
                  <TableCell style={{ width: '50px' }}>
                    <FormControlLabel
                          sx={{m: 0}}
                          control={
                            <Checkbox
                              checked={isSelected}
                              onChange={selectProduct.bind(this, index)}
                            />
                          }
                          label={
                            ""
                          }
                        />
                  </TableCell>
                  <TableCell>{showType(obj.typeDocument)}</TableCell>
                  <TableCell>{obj.document}</TableCell>
                  <TableCell>{obj.dateDocument}</TableCell>
                  {/* <TableCell>
                    <IconButton onClick={deleteProduct.bind(this, index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell> */}
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

DocumentsTableForBill.propTypes = {
  arrayObjs: PropTypes.array.isRequired,
  toDelete: PropTypes.func.isRequired,
  typeForm: PropTypes.string,
  toSelect: PropTypes.func.isRequired,
};
export default DocumentsTableForBill;
