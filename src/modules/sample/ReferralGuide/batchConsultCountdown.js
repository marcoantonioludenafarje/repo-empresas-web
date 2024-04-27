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
  Button,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import FindReplaceIcon from '@mui/icons-material/FindReplace';

const BatchConsultCountdown = ({loading}) => {
  const [batchConsultIsActive, setBatchConsultIsActive] = React.useState(false);
  const [countdown, setCountdown] = React.useState('');
  const sendLocation = (obj) => {
    fcData(obj);
  };
  useEffect(() => {
    const timerInterval = 1 * 60 * 1000; // 1 minuto en milisegundos
    const activeInterval = 4 * 60 * 1000; // 4 minutos en milisegundos
    //const baseTime = new Date().getTime(); // Hora actual en milisegundos
    const baseTime = new Date(); // -5 UTC
    baseTime.setHours(1);
    baseTime.setMinutes(36);
    baseTime.setSeconds(22);
    baseTime.setMilliseconds(921);
    const offsetMinutes = -300; // Offset de tiempo para GMT-5 (horario estándar del este de los Estados Unidos)
    const offsetMilliseconds = offsetMinutes * 60 * 1000; // Convertir el offset a milisegundos

    baseTime.setUTCMinutes(baseTime.getUTCMinutes() + offsetMinutes); // Ajustar el offset de tiempo

    console.log('baseTime2');
    console.log('baseTime', baseTime);
    const checkTime = () => {
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - baseTime;
      setCountdown(
        (timerInterval +
          activeInterval -
          (elapsedTime % (timerInterval + activeInterval))) /
          1000,
      );
      if (elapsedTime % (timerInterval + activeInterval) < timerInterval) {
        setBatchConsultIsActive(false);
      } else {
        setBatchConsultIsActive(true);
      }
    };

    const intervalId = setInterval(checkTime, 1000); // Verificar el tiempo cada segundo

    return () => {
      clearInterval(intervalId); // Limpiar el intervalo cuando el componente se desmonte
    };
  }, []);
  useEffect(() => {
    if (batchConsultIsActive) {
      setCountdown(240);
    }
  }, [batchConsultIsActive]);
  useEffect(() => {
    let intervalId;

    if (countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [countdown]);
  const renderTimer = (countdown) => {
    const remainingTime = Math.floor(countdown);
    if (remainingTime === 0) {
      return (
        <>
          <FindReplaceIcon />
          <Typography ml={1}>
            <FindReplaceIcon /> Consulta Masiva SUNAT en progreso
          </Typography>
        </>
      );
    }

    return (
      <>
        <FindReplaceIcon />
        <Typography ml={1}>
          Consulta Masiva SUNAT en {remainingTime} segundos restantes
        </Typography>
      </>
    );
  };
  return (
    <Button
      //onClick={batchConsultReferralGuide}
      disabled={loading || !batchConsultIsActive}
      color='success'
      disableRipple
      disableFocusRipple
      disableElevation
      sx={{cursor: 'default'}}
    >
      {renderTimer(countdown)}
      {(loading || !batchConsultIsActive) && (
        <CircularProgress sx={{ml: 2}} size={24} />
      )}
    </Button>
  );
};

BatchConsultCountdown.propTypes = {
  //fcData: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default BatchConsultCountdown;
