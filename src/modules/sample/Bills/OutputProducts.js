import React, {useEffect} from 'react';
import {useIntl} from 'react-intl';

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
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';

import DeleteIcon from '@mui/icons-material/Delete';

let listPayload = {
  request: {
    payload: {
      businessProductCode: null,
      description: null,
      merchantId: 'KX824',
    },
  },
};

const OutputProducts = ({data, toDelete, valueWithIGV, igvEnabled}) => {
  //FUNCIONES MENU
  const {userAttributes} = useSelector(({user}) => user);

  const {userDataRes} = useSelector(({user}) => user);
  listPayload.request.payload.merchantId =
    userDataRes.merchantSelected.merchantId;

  const deleteProduct = (index) => {
    console.log('Index', index);
    toDelete(index);
  };
  console.log ('data',data);
  console.log ('toDelete',toDelete);
  console.log ('valueWithIGV',valueWithIGV);
  console.log ('igvEnabled',igvEnabled);

  if (data && typeof data !== 'string' ) {
    data.map((obj, index) => {
      if (igvEnabled){
        obj.taxCode = 1000;
        obj.igvCode = 10;
      }
        
      else {
        obj.taxCode = 9998;
        obj.igvCode = 30;
      }
        
    });
  }

  const {messages} = useIntl();
  const showTypeIGV = (type) => {  
    switch (type) {
      case 1000:
        return messages['finance.typeIGV.gravado'];
        break;
      case 9997:
        return messages['finance.typeIGV.exonerado'];
        break;
      case 9998:
        return messages['finance.typeIGV.inafecto'];
        break;
      default:
        return null;
    }
  }; 

  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Unidad</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Valor unitario</TableCell>
            {igvEnabled ? <TableCell>Valor con IGV</TableCell> : null}
            <TableCell>Subtotal</TableCell>
            {igvEnabled ? <TableCell>Subtotal con IGV</TableCell> : null}
            <TableCell>Tipo IGV</TableCell>
            <TableCell>Opciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data && typeof data !== 'string' ? (
            data.map((obj, index) => {
              return (
                <TableRow
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  key={index}
                  id={index}
                >
                  <TableCell>{obj.businessProductCode}</TableCell>
                  <TableCell>{obj.description}</TableCell>
                  <TableCell>{obj.unitMeasure}</TableCell>
                  <TableCell>{obj.quantityMovement}</TableCell>
                  <TableCell>{obj.priceBusinessMoneyWithIgv}</TableCell>
                  {igvEnabled ? (
                    <TableCell>
                      {valueWithIGV(obj.priceBusinessMoneyWithIgv)}
                    </TableCell>
                  ) : null}
                  <TableCell>{obj.subtotal}</TableCell>
                  {igvEnabled ? (
                    <TableCell>{valueWithIGV(obj.subtotal)}</TableCell>
                  ) : null}
                  <TableCell>{showTypeIGV(obj.taxCode)}</TableCell>
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

OutputProducts.propTypes = {
  data: PropTypes.array.isRequired,
  toDelete: PropTypes.func.isRequired,
  valueWithIGV: PropTypes.func.isRequired,
  igvEnabled: PropTypes.bool,
};
export default OutputProducts;
