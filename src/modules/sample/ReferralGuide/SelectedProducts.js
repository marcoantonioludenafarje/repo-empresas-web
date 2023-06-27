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
  TextField,
  FormControl,
  Select,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import {useHistory, BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import Router from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@mui/styles';
import PropTypes from 'prop-types';

import unitMeasureOptions from '../../../Utils/unitMeasureOptions.json';
let listPayload = {
  request: {
    payload: {
      businessProductCode: null,
      description: null,
      merchantId: '',
    },
  },
};

const SelectedProducts = ({
  arrayObjs,
  toDelete,
  toChangeUnitMeasure,
  toChangeQuantity,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [moneyUnit, setMoneyUnit] = React.useState('');

  const {businessParameter} = useSelector(({general}) => general);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  listPayload.request.payload.merchantId =
    userDataRes.merchantSelected.merchantId;

  const changeUnitMeasure = (index, unitMeasure) => {
    console.log('Index', index);
    toChangeUnitMeasure(index, unitMeasure);
  };
  const changeQuantity = (index, unitMeasure) => {
    console.log('Index', index);
    toChangeQuantity(index, unitMeasure);
  };
  useEffect(() => {
    if (businessParameter != undefined) {
      let obtainedMoneyUnit = businessParameter.find(
        (obj) => obj.abreParametro == 'DEFAULT_MONEY_UNIT',
      ).value;
      setMoneyUnit(obtainedMoneyUnit);
      console.log('moneyUnit desde selectedProducts', moneyUnit);
    }
  }, [businessParameter]);

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
            <TableCell>Unidad</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Peso</TableCell>
            <TableCell></TableCell>
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
                  <TableCell>
                    {obj.businessProductCode != null
                      ? obj.businessProductCode
                      : obj.product}
                  </TableCell>
                  <TableCell>{obj.description}</TableCell>
                  <TableCell>
                    <FormControl variant='standard' sx={{m: 1, minWidth: 120}}>
                      <Select
                        labelId='demo-simple-select-standard-label-unitMeasure'
                        id={`unitMeasure${index}`}
                        value={obj.unitMeasure}
                        defaultValue={obj.unitMeasure}
                        onChange={(event) => {
                          changeUnitMeasure(index, event.target.value);
                        }}
                      >
                        {unitMeasureOptions.map((option, indexOption) => (
                          <MenuItem
                            key={`unitMeasureItem-${indexOption}`}
                            value={option.value}
                            style={{fontWeight: 200}}
                          >
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <TextField
                      name='count'
                      variant='standard'
                      defaultValue={obj.quantityMovement}
                      onChange={(event) => {
                        console.log('Cambiando cantidad');
                        changeQuantity(index, event.target.value);
                      }}
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                      }}
                    />
                  </TableCell>
                  <TableCell>{obj.weight}</TableCell>
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
  toChangeUnitMeasure: PropTypes.func,
  toChangeQuantity: PropTypes.func,
};
export default SelectedProducts;
