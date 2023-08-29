import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  TextField,
} from '@mui/material';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const SelectDriver = ({fcData}) => {
  const {getDriversRes} = useSelector(({drivers}) => drivers);
  console.log('getDriversRes', getDriversRes);
  const [searchFullNameTerm, setSearchFullNameTerm] = React.useState('');
  const sendDriver = (obj) => {
    fcData(obj);
  };

  return (
    <TableContainer component={Paper}>
      <TextField
        value={searchFullNameTerm}
        label='Buscar por nombre'
        onChange={(event) => {
          console.log('fullName field', event.target.value);
          setSearchFullNameTerm(event.target.value);
        }}
      />
      <Table sx={{minWidth: 650}} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Identificador</TableCell>
            <TableCell>Número Ident.</TableCell>
            <TableCell>Nombre Completo</TableCell>
            <TableCell>Licencia</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {getDriversRes && typeof getDriversRes !== 'string' ? (
            getDriversRes
              .filter((obj) =>
                obj.fullName
                  .toLowerCase()
                  .includes(searchFullNameTerm.toLowerCase()),
              )
              .sort((b, a) => {
                if (a.fullName > b.fullName) {
                  return -1;
                }
                if (a.fullName < b.fullName) {
                  return 1;
                }
                return 0;
              })
              .map((obj) => {
                let parsedId = obj.driverId.split('-');
                return (
                  <TableRow
                    sx={{
                      '&:last-child td, &:last-child th': {border: 0},
                      cursor: 'pointer',
                    }}
                    key={obj.driverId}
                    id={obj.driverId}
                    hover
                    onClick={() => {
                      sendDriver(obj);
                    }}
                  >
                    <TableCell>{parsedId[0]}</TableCell>
                    <TableCell>{parsedId[1]}</TableCell>
                    <TableCell>{obj.fullName}</TableCell>
                    <TableCell>{obj.license}</TableCell>
                  </TableRow>
                );
              })
          ) : (
            <CircularProgress disableShrink sx={{m: '10px'}} />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

SelectDriver.propTypes = {
  fcData: PropTypes.func.isRequired,
};

export default SelectDriver;
