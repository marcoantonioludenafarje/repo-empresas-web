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

const SelectLocation = ({fcData, typeLocation}) => {
  const {getLocationsRes} = useSelector(({locations}) => locations);
  console.log('getLocationsRes', getLocationsRes);
  const [searchTerm, setSearchTerm] = React.useState('');
  const sendLocation = (obj) => {
    fcData(obj);
  };

  return (
    <TableContainer component={Paper}>
      <TextField
        value={searchTerm}
        label='Buscar por nombre'
        onChange={(event) => {
          console.log('location field', event.target.value);
          setSearchTerm(event.target.value);
        }}
      />
      <Table sx={{minWidth: 650}} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Ubigeo</TableCell>
            <TableCell>Dirección Completa</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {getLocationsRes && typeof getLocationsRes !== 'string' ? (
            getLocationsRes
              .filter((obj) =>
                obj.locationName
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()),
              )
              .sort((b, a) => {
                if (a.locationName > b.locationName) {
                  return -1;
                }
                if (a.locationName < b.locationName) {
                  return 1;
                }
                return 0;
              })
              .map((obj) => {
                return (
                  <TableRow
                    sx={{
                      '&:last-child td, &:last-child th': {border: 0},
                      cursor: 'pointer',
                    }}
                    key={obj.locationId}
                    id={obj.locationId}
                    hover
                    onClick={() => {
                      sendLocation({
                        ...obj,
                        label: obj.locationName,
                      });
                    }}
                  >
                    <TableCell>{obj.locationName}</TableCell>
                    <TableCell>{obj.ubigeo}</TableCell>
                    <TableCell>{obj.locationDetail}</TableCell>
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

SelectLocation.propTypes = {
  fcData: PropTypes.func.isRequired,
  typeLocation: PropTypes.string.isRequired,
};

export default SelectLocation;
