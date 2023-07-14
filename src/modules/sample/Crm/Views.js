import React, {useEffect, useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import {Button} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import {getCampaigns} from '../../../redux/actions/Campaign';
import {convertToDate} from '../../../Utils/utils';
import {useDispatch, useSelector} from 'react-redux';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
  CREATE_CAMPAIGN,
} from '../../../shared/constants/ActionTypes';

function createData(name, fecha, containt, receipt) {
  return {name, fecha, containt, receipt};
}

const rows = [
  createData(
    'Nueva Dental',
    '12-07-2023',
    'Por apertura descuentos en curaciones',
    'TODOS LOS CLIENTES',
  ),
  createData(
    'Mejores Defensas bucales',
    '12-07-2023',
    'Recreación de dientes, curaciones',
    'ALGUNOS CLIENTES',
  ),
];

export default function Views() {
  const dispatch = useDispatch();

  const getCampaign = (payload) => {
    dispatch(getCampaigns(payload));
  };
  const {userDataRes} = useSelector(({user}) => user);

  const {listCampaigns, campaingsLastEvaluatedKey_pageListCampaigns} =
    useSelector(({campaigns}) => campaigns);

  console.log('confeti las campañas', listCampaigns);

  useEffect(() => {
    console.log('Estamos userDataRes', userDataRes);
    if (
      userDataRes &&
      userDataRes.merchantSelected &&
      userDataRes.merchantSelected.merchantId
    ) {
      console.log('Estamos entrando al getCampañas');
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      //dispatch({type: GET_CLIENTS, payload: undefined});
      let listPayload = {
        request: {
          payload: {
            typeDocumentClient: '',
            numberDocumentClient: '',
            denominationClient: '',
            merchantId: userDataRes.merchantSelected.merchantId,
            LastEvaluatedKey: null,
          },
        },
      };
      getCampaign(listPayload);
      // setFirstload(true);
    }
  }, [userDataRes]);

  return (
    <Card sx={{p: 4}}>
      <span>{`Items: ${listCampaigns?.length}`}</span>
      <TableContainer component={Paper} sx={{maxHeight: 440}}>
        <Table
          sx={{minWidth: 650}}
          stickyHeader
          size='small'
          aria-label='sticky table'
        >
          <TableHead>
            <TableRow>
              <TableCell>Fecha de creación</TableCell>
              <TableCell>Nombre de la campaña</TableCell>
              <TableCell>Contenido</TableCell>
              <TableCell>Fecha/Hora de envío</TableCell>
              <TableCell>Imagen</TableCell>
              <TableCell>Receptores</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listCampaigns?.map((row) => (
              <TableRow
                key={row.campaignId}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
              >
                <TableCell>{convertToDate(row.createdAt)}</TableCell>
                <TableCell component='th' scope='row'>
                  {row.campaignName}
                </TableCell>
                <TableCell>{row.messages[0].text}</TableCell>
                <TableCell>{convertToDate(row.scheduledAt)}</TableCell>
                <TableCell>
                  <img src={row.messages[0].img_url} alt='Imagen' width='100' />
                </TableCell>
                <TableCell>{row.receivers.length}</TableCell>
                <TableCell>
                  <Button id='basic-button'>
                    <KeyboardArrowDownIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
