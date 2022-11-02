import React, {useEffect} from 'react';
const XLSX = require('xlsx');

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  ButtonGroup,
  Button,
  MenuItem,
  Menu,
  MenuList,
  ClickAwayListener,
  Popper,
  Grow,
  Stack,
  TextField,
  Card,
  Grid,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  FolderIcon,
  Avatar,
  ImageIcon,
  WorkIcon,
  BeachAccessIcon,
} from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import GridOnOutlinedIcon from '@mui/icons-material/GridOnOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {red} from '@mui/material/colors';

const BulkLoad = (props) => {
  let uploadedProducts = [];
  /* let rightUploads = 0;
  let badUploads = 0; */
  let eventImage;
  const [reload, setReload] = React.useState(0); // integer state
  const [rows, setRows] = React.useState([]);
  const [rightUploads, setRightUploads] = React.useState(0);
  const [badUploads, setBadUploads] = React.useState(0);
  const [listUploads, setListUploads] = React.useState([]);
  const keys_to_keep = [
    'businessProductCode',
    'description',
    'unitMeasure',
    'costPriceUnit',
    'weight',
    'category',
    'imgKey',
    'initialStock',
    'unitMeasureWeight',
    'unitMeasureMoney',
  ];

  /* useEffect(() => {
    setListUploads([]);
  }, []); */

  const useForceUpdate = () => {
    return () => setReload((value) => value + 1); // update the state to force render
  };

  const redux = (array) =>
    array.map((o) =>
      keys_to_keep.reduce((acc, curr) => {
        acc[curr] = o[curr];
        return acc;
      }, {}),
    );

  const selectImage = (e) => {
    console.log('evento', e);
    eventImage = e;
  };

  const onChangeHandler = () => {
    try {
      console.log('Funcionando');
      eventImage.preventDefault();
      if (eventImage.target.files) {
        const reader = new FileReader();
        reader.onload = (eventImage) => {
          const data = eventImage.target.result;
          const workbook = XLSX.read(data, {type: 'array'});
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          console.log('Array json en duro', json);
          parseArray(json);
          console.log('Array parseado', listUploads);
          console.log('Tipo de array parseado', typeof listUploads);
        };
        reader.readAsArrayBuffer(eventImage.target.files[0]);
      }
    } catch (error) {
      console.log('Ocurrio un error', error);
    }
  };

  const handleList = (value) => {
    setListUploads(listUploads.push(value));
  };

  const parseArray = (array) => {
    let newArray = [];
    let goods = 0;
    let bads = 0;
    setBadUploads(0);
    setRightUploads(0);
    array.map((obj) => {
      try {
        if (isNaN(Number(obj['costo referencial']) || Number(obj['peso']))) {
          goods += 1;
          console.log('badUploads', badUploads);
          throw new Error('Ocurrio un error al crear la fila');
        } else {
          bads += 1;
          console.log('rightUploads', rightUploads);
          handleList({
            businessProductCode: obj['codigo'].toString(),
            description: obj['descripcion'].toString(),
            unitMeasure: 'NIU',
            costPriceUnit: Number(obj['costo referencial']),
            weight: Number(obj['peso']),
            category: obj['categoria'].toString(),
            imgKey: null,
            initialStock: Number(obj['stock']),
            /* setListUploads(
            listUploads.push({
              businessProductCode: obj['codigo'].toString(),
              description: obj['descripcion'].toString(),
              unitMeasure: 'NIU',
              costPriceUnit: Number(obj['costo referencial']),
              weight: Number(obj['peso']),
              category: obj['categoria'].toString(),
              imgKey: null,
              initialStock: Number(obj['stock']),
            }),*/
          });
          console.log('newArray', newArray);
          console.log('listUploads', listUploads);
        }
      } catch (error) {
        console.log('error al crear fila', error);
      }
    });
    setBadUploads(goods);
    setRightUploads(bads);
    return listUploads;
  };

  return (
    <Card sx={{p: 4}}>
      <Stack
        sx={{m: 2, justifyContent: 'center', marginBottom: '10px'}}
        direction='row'
        spacing={2}
      >
        <Button
          sx={{width: 1 / 2}}
          variant='outlined'
          component='label'
          endIcon={<FileUploadOutlinedIcon />}
        >
          Subir archivo
          <input
            type='file'
            hidden
            onChange={selectImage}
            on
            id='imgInp'
            name='imgInp'
            accept='.xlsx, .csv'
          />
        </Button>
        <Button
          startIcon={<SettingsIcon />}
          variant='contained'
          color='primary'
          onClick={onChangeHandler}
        >
          Procesar
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}} size='small' aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Fila</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Mensaje</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {console.log('list uploads', listUploads)}
            {listUploads && typeof listUploads !== 'string' ? (
              listUploads.map((obj, index) => (
                <TableRow
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  key={index}
                >
                  {/* <TableCell>{obj.row}</TableCell>
                  <TableCell>{obj.code}</TableCell>
                  <TableCell>{obj.message}</TableCell>
                  <TableCell>{obj.status.toFixed(2)}</TableCell> */}
                  <TableCell>{obj.businessProductCode}</TableCell>
                  <TableCell>{obj.description}</TableCell>
                  <TableCell>{obj.unitMeasure}</TableCell>
                  <TableCell>{obj.costPriceUnit}</TableCell>
                </TableRow>
              ))
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{p: 'auto', textAlign: 'center', margin: '20px'}}>
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
          <Grid container spacing={2} sx={{width: '50%'}}>
            <Grid item xs={2} sx={{textAlign: 'center'}}>
              <CheckCircleOutlineOutlinedIcon color='success' />
            </Grid>
            <Grid item xs={10} sx={{textAlign: 'left'}}>
              <Typography sx={{color: 'success.main'}}>
                {rightUploads} Productos nuevos cargados exitosamente
              </Typography>
            </Grid>

            <Grid item xs={2} sx={{textAlign: 'center'}}>
              <CheckCircleOutlineOutlinedIcon color='success' />
            </Grid>
            <Grid item xs={10} sx={{textAlign: 'left'}}>
              <Typography sx={{color: 'success.main'}}>
                XX Productos actualizados exitosamente
              </Typography>
            </Grid>
            <Grid item xs={2} sx={{textAlign: 'center'}}>
              <CancelOutlinedIcon sx={{color: red[500]}} />
            </Grid>
            <Grid item xs={10} sx={{textAlign: 'left'}}>
              <Typography sx={{color: 'error.main'}}>
                {badUploads} Productos no cargados por errores
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Card>
  );
};

export default BulkLoad;
