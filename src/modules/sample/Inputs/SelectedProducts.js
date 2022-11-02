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

import {useHistory, BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import Router from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@mui/styles';
import PropTypes from 'prop-types';

let listPayload = {
  request: {
    payload: {
      businessProductCode: null,
      description: null,
      merchantId: '',
    },
  },
};

const SelectedProducts = ({arrayObjs, toDelete}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [moneyUnit, setMoneyUnit] = React.useState('');
  console.log('Lista de productos', arrayObjs);

  const {businessParameter} = useSelector(({general}) => general);
  console.log('businessParameter', businessParameter);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);

  listPayload.request.payload.merchantId =
    userDataRes.merchantSelected.merchantId;

  useEffect(() => {
    if (businessParameter != undefined) {
      let obtainedMoneyUnit = businessParameter.find(
        (obj) => obj.abreParametro == 'DEFAULT_MONEY_UNIT',
      ).value;
      setMoneyUnit(obtainedMoneyUnit);
      console.log('moneyUnit desde selectedProducts', moneyUnit);
    }
  }, [businessParameter != undefined]);

  const parseTo3Decimals = (number) => {
    let newValue = number + Number.EPSILON;
    newValue = Math.round(newValue * 1000) / 1000;
    return newValue;
  };

  const deleteProduct = (index) => {
    console.log('Index', index);
    toDelete(index);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}} size='small' aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Precio compra sugerido</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Subtotal</TableCell>
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
                  <TableCell>{obj.product}</TableCell>
                  <TableCell>{obj.description}</TableCell>
                  <TableCell>
                    {`${parseTo3Decimals(Number(obj.priceProduct)).toFixed(
                      3,
                    )} ${moneyUnit}`}
                  </TableCell>
                  <TableCell>{obj.count}</TableCell>
                  <TableCell>{`${parseTo3Decimals(obj.subtotal).toFixed(
                    3,
                  )} ${moneyUnit}`}</TableCell>
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

SelectedProducts.propTypes = {
  arrayObjs: PropTypes.array.isRequired,
  toDelete: PropTypes.func.isRequired,
};
export default SelectedProducts;
