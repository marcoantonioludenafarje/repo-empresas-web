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
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

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
  const [editedCount, setEditedCount] = React.useState(null);
  const [editedIndex, setEditedIndex] = React.useState(null);
  const [editedSubtotals, setEditedSubtotals] = React.useState([]);

  
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
    console.log("NUEVO TRASH", number);
    let newValue = number + Number.EPSILON;
    newValue = Math.round(newValue * 1000) / 1000;
    return newValue;
  };
  const parseTo3editDecimals = (number, count) => {        
      console.log("NUEVO CONTEO", number, count);
      let newValue = (number * count) + Number.EPSILON;
      console.log("NUEVO VAL", newValue);
      newValue = Math.round(newValue * 1000) / 1000;
      console.log("NUEVO VALOR", newValue, number, count);
      return newValue;
  };


  const deleteProduct = (index) => {
    console.log('Index', index);
    toDelete(index);
  };

  const editProduct = (index) =>{
    console.log('Index edit', index);
    //toEdit(index);
    setEditedIndex(index);
    setEditedCount(arrayObjs[index].count);
    setEditedSubtotals(arrayObjs.map(obj => obj.subtotal));
    console.log("index edit index", editedIndex);
    console.log("index edit count", editedCount);
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}} size='small' aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Precio venta sugerido</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Subtotal</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {arrayObjs && typeof arrayObjs !== 'string' ? (
            arrayObjs.map((obj, index) => {
              return (
                // <TableRow
                //   sx={{'&:last-child td, &:last-child th': {border: 0}}}
                //   key={index}
                //   id={index}
                // >
                //   <TableCell>
                //     {obj.businessProductCode != null
                //       ? obj.businessProductCode
                //       : obj.product}
                //   </TableCell>
                //   <TableCell>{obj.description}</TableCell>
                //   <TableCell>
                //     {`${parseTo3Decimals(Number(obj.priceProduct)).toFixed(
                //       3,
                //     )} ${moneyUnit}`}
                //   </TableCell>
                //   <TableCell>{obj.count}</TableCell>
                //   <TableCell>
                //     {`${parseTo3Decimals(obj.subtotal).toFixed(
                //       3,
                //     )} ${moneyUnit}`}
                //   </TableCell>
                //   <TableCell>
                //     <IconButton onClick={deleteProduct.bind(this, index)}>
                //       <DeleteIcon />
                //     </IconButton>
                //   </TableCell>
                //   <TableCell>
                //     <IconButton onClick={editProduct.bind(this, index)}>
                //       <EditIcon />
                //     </IconButton>
                //   </TableCell>
                // </TableRow>
                <TableRow
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  key={index}
                  id={index}
                >
                  <TableCell>
                    {obj.businessProductCode != null
                      ? obj.businessProductCode
                      : obj.product}
                  </TableCell>
                  <TableCell>{obj.description}</TableCell>
                  <TableCell>
                    {`${parseTo3Decimals(Number(obj.priceProduct)).toFixed(
                      3,
                    )} ${moneyUnit}`}
                  </TableCell>
                  {editedIndex === index ? (
                    <>
                      <TableCell>
                        <TextField
                          type="number"
                          value={editedCount}
                          onChange={(e) => {
                            setEditedCount(e.target.value);
                            const updatedSubtotals = [...editedSubtotals];
                            updatedSubtotals[index] = parseTo3editDecimals(obj.priceProduct, e.target.value);
                            setEditedSubtotals(updatedSubtotals);
                          }}
                          variant="outlined" // Puedes personalizar esto según tus preferencias
                        />
                      </TableCell>
                      <TableCell>
                     {`${parseTo3editDecimals(obj.subtotal).toFixed(
                       3,
                     )} ${moneyUnit}`}
                   </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            // Aquí debes guardar la cantidad editada en tu objeto o hacer lo que necesites con ella.
                            // Por ejemplo, actualizando el objeto en el estado.
                            arrayObjs[index].count = parseFloat(editedCount);
                            setEditedIndex(null);
                            setEditedCount(null);
                          }}
                        >
                          Guardar
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => {
                            setEditedIndex(null);
                            setEditedCount(null);
                          }}
                        >
                          Cancelar
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{obj.count}</TableCell>
                      <TableCell>
                      { editedSubtotals[index] ? `${parseTo3editDecimals(editedSubtotals[index], 1).toFixed(3)} ${moneyUnit}`: `${parseTo3Decimals(obj.subtotal).toFixed(
                       3,
                     )} ${moneyUnit}`}
                   </TableCell>
                      <TableCell>
                        <IconButton onClick={deleteProduct.bind(this, index)}>
                          <DeleteIcon />
                        </IconButton>
                        <IconButton onClick={() => editProduct(index)}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </>
                  )}
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
