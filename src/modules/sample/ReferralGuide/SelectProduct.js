import React, {useEffect} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  ButtonGroup,
  Button,
  MenuItem,
  Menu,
  IconButton,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

import {useHistory, BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import Router from 'next/router';
import {onGetProducts, deleteProduct} from '../../../redux/actions/Products';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@mui/styles';
import PropTypes from 'prop-types';

const SelectProduct = ({fcData}) => {
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

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [moneyUnit, setMoneyUnit] = React.useState('');

  const {listProducts} = useSelector(({products}) => products);
  console.log('products123', listProducts);
  const {businessParameter} = useSelector(({general}) => general);
  console.log('businessParameter', businessParameter);

  const sendData = (obj) => {
    fcData(obj);
  };

  const parseTo3Decimals = (number) => {
    let newValue = number + Number.EPSILON;
    newValue = Math.round(newValue * 1000) / 1000;
    return newValue;
  };

  useEffect(() => {
    if (businessParameter != undefined) {
      let obtainedMoneyUnit = businessParameter.find(
        (obj) => obj.abreParametro == 'DEFAULT_MONEY_UNIT',
      ).value;
      setMoneyUnit(obtainedMoneyUnit);
      console.log('moneyUnit desde selectProducts', moneyUnit);
    }
  }, [businessParameter != undefined]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Peso</TableCell>
            <TableCell>Precio compra sugerido</TableCell>
            <TableCell>Precio venta sugerido</TableCell>
            {/* <TableCell></TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {listProducts && typeof listProducts !== 'string' ? (
            listProducts.map((obj) => {
              return (
                <TableRow
                  sx={{
                    '&:last-child td, &:last-child th': {border: 0},
                    cursor: 'pointer',
                  }}
                  key={obj.product}
                  id={obj.product}
                  hover
                  onClick={() => {
                    sendData(obj);
                  }}
                >
                  <TableCell>{obj.product}</TableCell>
                  <TableCell>{obj.description}</TableCell>
                  <TableCell>{obj.stock}</TableCell>
                  <TableCell>{obj.weight}</TableCell>
                  <TableCell>
                    {`${parseTo3Decimals(Number(obj.costPriceUnit)).toFixed(
                      3,
                    )} ${moneyUnit}`}
                  </TableCell>
                  <TableCell>
                    {`${parseTo3Decimals(
                      Number(obj.priceBusinessMoneyWithIgv),
                    ).toFixed(3)} ${moneyUnit}`}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <CircularProgress disableShrink />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

SelectProduct.propTypes = {
  fcData: PropTypes.func.isRequired,
};

export default SelectProduct;
