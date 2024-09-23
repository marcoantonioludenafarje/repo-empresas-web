import React, {useEffect} from 'react';
import {
  Divider,
  Card,
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  Tab,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import IntlMessages from '../../../@crema/utility/IntlMessages';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';

import AppGridContainer from '../../../@crema/core/AppGridContainer';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import EditIcon from '@mui/icons-material/Edit';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import {red} from '@mui/material/colors';
import PropTypes from 'prop-types';
import {Fonts} from '../../../shared/constants/AppEnums';
import {makeStyles} from '@mui/styles';
import Router, {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {array} from 'prop-types';
import {getUserData} from '../../../redux/actions/User';
import {getCurrentMovementsDocumentsBusiness} from '../../../redux/actions/MyBilling';
import {
  getYear,
  getActualMonth,
  translateValue,
  fixDecimals,
} from '../../../Utils/utils';
const maxLength = 11111111111111111111; //20 caracteres
import {convertToDate, convertToDateWithoutTime} from '../../../Utils/utils';

const validationSchema = yup.object({
  name: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />)
    .matches(/^[a-z0-9\s]+$/i, 'No se permiten caracteres especiales'),
});
const defaultValues = {
  name: '',
};
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
  GET_BUSINESS_PARAMETER,
  GET_CURRENT_MOVEMENTS_DOCUMENTS,
} from '../../../shared/constants/ActionTypes';
import {onGetBusinessParameter} from 'redux/actions/General';
import myBilling from 'pages/sample/myBilling';
import {ConstructionRounded} from '@mui/icons-material';
//ESTILOS
const useStyles = makeStyles((theme) => ({
  icon: {
    width: '30px',
    height: '30px',
    marginRight: '10px',
  },
  tableRow: {
    '&:last-child th, &:last-child td': {
      borderBottom: 0,
    },
  },
}));

let typeAlert = '';
const months = {
  all: 'Todos',
  January: 'Enero',
  February: 'Febrero',
  March: 'Marzo',
  April: 'Abril',
  May: 'Mayo',
  June: 'Junio',
  July: 'Julio',
  August: 'Agosto',
  September: 'Septiembre',
  October: 'Octubre',
  November: 'Noviembre',
  December: 'Diciembre',
};
const monthsInEnglish = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
function LinearProgressWithLabel(props) {
  return (
    <Box sx={{display: 'flex', alignItems: 'center'}}>
      <Box sx={{width: '100%', mr: 1}}>
        <LinearProgress variant='determinate' {...props} />
      </Box>
      <Box sx={{minWidth: 35}}>
        <Typography variant='body2' color='text.secondary'>{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};
function createData(name, calories, fat, carbs, protein, million) {
  return {name, calories, fat, carbs, protein, million};
}

const rows = [createData(0.035, 0.03, 0.025, 0.02, 0.015, 0.01)];
const rows2 = [createData(0.03, 0.025, 0.02, 0.015, 0.01, 0.005)];

const MyBilling = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [actualPath, setActualPath] = React.useState('');
  const [openDelete, setOpenDelete] = React.useState(false);
  const [year, setYear] = React.useState(getYear());
  const [month, setMonth] = React.useState(getActualMonth().toUpperCase());
  const [monthYearStatus, setMonthYearStatus] = React.useState(true);
  const [open2, setOpen2] = React.useState(false);
  const [monthPrice, setMonthPrice] = React.useState('S/0.00');
  const [aditionalMonthPrice, setAditionalMonthPrice] =
    React.useState('S/0.00');
  const [totalPrice, setTotalPrice] = React.useState('S/0.00');
  const [actualDocuments, setActualDocuments] = React.useState(0);
  const [availableDocuments, setAvailableDocuments] = React.useState(0);
  const [aditionalDocuments, setAditionalDocuments] = React.useState(0);
  const [progressDocument, setProgressDocument] = React.useState(0);
  const [businessDebt, setBusinessDebt] = React.useState(0);
  const router = useRouter();
  const {query} = router; //query es el objeto seleccionado
  console.log('query', query);

  //GET APIS RES
  const {successMessage} = useSelector(({myBilling}) => myBilling);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({myBilling}) => myBilling);
  console.log('errorMessage', errorMessage);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  const {businessParameter} = useSelector(({general}) => general);
  const {currentMovementsDocuments} = useSelector(({myBilling}) => myBilling);
  console.log('businessParameter', businessParameter);
  const {jwtToken} = useSelector(({general}) => general);
  
  const indicadorDesarrollo = false;

  console.log('redirectUrl', JSON.parse(localStorage.getItem('redirectUrl')));

  const toGetCurrentMovementsDocumentsBusiness = (payload, jwtToken) => {
    dispatch(getCurrentMovementsDocumentsBusiness(payload, jwtToken));
  };
  const handleClose = () => {
    setOpen(false);
  };

  const sendStatus = () => {
    setOpenStatus(false);
  };

  const handleOpenStatus = () => {
    setOpenStatus(false);
    dispatch({type: GET_DATA, payload: []});
    setTimeout(() => {
      toGetData(getDataPayload);
    }, 1000);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };
  useEffect(() => {
    setMonthYearStatus(true);
  }, [month || year]);
  useEffect(() => {
    if (!userDataRes) {
      console.log('Esto se ejecuta?');
      dispatch({type: GET_USER_DATA, payload: undefined});

      const toGetUserData = (payload) => {
        dispatch(getUserData(payload));
      };
      let getUserDataPayload = {
        request: {
          payload: {
            userId: JSON.parse(localStorage.getItem('payload')).sub,
          },
        },
      };

      toGetUserData(getUserDataPayload);
    } else {
      console.log(
        'Por que no me quiere',
        userDataRes.merchantSelected.businessDebt,
      );
      const deuda = userDataRes.merchantSelected.businessDebt;
      setBusinessDebt(deuda);
      // setBusinessDebt(userDataRes.merchantSelected.businessDebt)
    }
  }, []);

  useEffect(() => {
    if (userDataRes && !businessParameter) {
      console.log('Esto se ejecuta?');

      dispatch({type: GET_BUSINESS_PARAMETER, payload: undefined});
      const getBusinessParameter = (payload) => {
        dispatch(onGetBusinessParameter(payload));
      };
      let businessParameterPayload = {
        request: {
          payload: {
            abreParametro: null,
            codTipoparametro: null,
            merchantId: userDataRes.merchantSelected.merchantId,
          },
        },
      };

      getBusinessParameter(businessParameterPayload);
    }
  }, [userDataRes]);
  useEffect(() => {
    if (!currentMovementsDocuments && userDataRes) {
      dispatch({type: GET_CURRENT_MOVEMENTS_DOCUMENTS, payload: undefined});
      let today = new Date();
      const currentMonth = today.getMonth() + 1;
      const finalOperationDate = new Date(
        userDataRes.merchantSelected.plans.find(
          (obj) => obj.active == true,
        ).finishAt,
      );
      const finalOperationDay = finalOperationDate.getDate();
      const initialTime = new Date(
        `${year}-${currentMonth}-${finalOperationDay}`,
      ).getTime();
      const finalTime = new Date(
        `${currentMonth == 12 ? Number(year) + 1 : year}-${
          currentMonth == 12 ? 1 : currentMonth + 1
        }-${finalOperationDay}`,
      ).getTime();
      const toGetCurrentMovementsDocumentsBusinessPayload = {
        request: {
          payload: {
            numberDocumentMerchant: indicadorDesarrollo
              ? '20561337633'
              : userDataRes.merchantSelected.numberDocumentMerchant,
            merchantId: userDataRes.merchantSelected.merchantId,
            initialTime: initialTime,
            finalTime: finalTime,
            year: year,
            month: month,
          },
        },
      };
      toGetCurrentMovementsDocumentsBusiness(
        toGetCurrentMovementsDocumentsBusinessPayload, jwtToken
      );
    }
  }, [currentMovementsDocuments || userDataRes]);
  useEffect(() => {
    if (userDataRes && businessParameter && currentMovementsDocuments) {
      //Para consultar Peso en archivos
      let getDataPayload = {
        request: {
          payload: {
            path: actualPath,
            merchantId: userDataRes.merchantSelected.merchantId,
          },
        },
      };
      const monthPriceStart = userDataRes.merchantSelected.plans.find(
        (element) => element.active == true,
      ).cost;
      console.log('Precio del mes', monthPriceStart);
      setMonthPrice(`S/${monthPriceStart}.00`);
      let actualDocumentsParam = businessParameter.find(
        (element) => element.abreParametro == 'CURRENT_COUNT_MOVEMENT',
      ).sunatDocuments;
      if (userDataRes.merchantSelected.isBillingEnabled) {
        actualDocumentsParam =
          actualDocumentsParam[`${year}`][`${month}`].quantity;
      }

      setActualDocuments(actualDocumentsParam);
      const availableDocumentsData = userDataRes.merchantSelected.plans.find(
        (element) => element.active == true,
      ).limits.transactionalSunatDocuments;
      setAvailableDocuments(availableDocumentsData);
      let aditionalMonthPrice;

      if (actualDocumentsParam > availableDocumentsData) {
        setProgressDocument(100);
        aditionalMonthPrice = actualDocumentsParam - availableDocumentsData;
        console.log('precio adicional sin multiplicador', aditionalMonthPrice);
      } else {
        const progress = actualDocumentsParam / availableDocumentsData;

        console.log('Este es el porcentaje de progreso', progress);
        const truncProgress = Math.trunc(progress * 100);
        console.log(
          'Este es el porcentaje de progreso truncado',
          truncProgress,
        );
        setProgressDocument(truncProgress);
        aditionalMonthPrice = 0;
      }

      setAditionalDocuments(aditionalMonthPrice);
      if (aditionalMonthPrice >= 0 && aditionalMonthPrice <= 1000) {
        aditionalMonthPrice = aditionalMonthPrice * 0.035;
      } else if (aditionalMonthPrice > 1001 && aditionalMonthPrice <= 5000) {
        aditionalMonthPrice = aditionalMonthPrice * 0.03;
      } else if (aditionalMonthPrice > 5001 && aditionalMonthPrice <= 10000) {
        aditionalMonthPrice = aditionalMonthPrice * 0.025;
      } else if (aditionalMonthPrice > 10001 && aditionalMonthPrice <= 50000) {
        aditionalMonthPrice = aditionalMonthPrice * 0.02;
      } else if (aditionalMonthPrice > 50001 && aditionalMonthPrice <= 100000) {
        aditionalMonthPrice = aditionalMonthPrice * 0.015;
      } else if (aditionalMonthPrice > 100001) {
        aditionalMonthPrice = aditionalMonthPrice * 0.01;
      }
      setAditionalMonthPrice(`S/${aditionalMonthPrice.toFixed(0)}.00`);
      setTotalPrice(
        `S/${Number(aditionalMonthPrice.toFixed(0)) + monthPriceStart}.00`,
      );
      console.log(
        'Por que no me quiere',
        userDataRes.merchantSelected.businessDebt,
      );
      const deuda = userDataRes.merchantSelected.businessDebt;
      setBusinessDebt(deuda);
    }
  }, [userDataRes && currentMovementsDocuments, month]);
  return businessParameter && currentMovementsDocuments ? (
    <>
      <Card sx={{p: 4}}>
        <Stack
          direction={isMobile ? 'column' : 'row'}
          spacing={2}
          sx={{display: 'flex', alignItems: 'center'}}
        >
          <Typography
            component='h3'
            sx={{
              fontSize: 16,
              fontWeight: Fonts.BOLD,
              mb: {xs: 3, lg: 4},
            }}
          >
            <IntlMessages id='common.myBilling' /> del {year}
          </Typography>
          <FormControl sx={{my: 0}}>
            <InputLabel id='moneda-label' style={{fontWeight: 200}}>
              Mes
            </InputLabel>
            <Select
              name='month_unit'
              labelId='month-label'
              label='Mes'
              onChange={(event) => {
                console.log(event.target.value);
                setMonth(event.target.value);
                // if (event.target.value == 'ALL') {
                //   listFinancesPayload.request.payload.monthMovement = null;
                // } else {
                //   listFinancesPayload.request.payload.monthMovement =
                //     event.target.value;
                //   listFinancesForResultStatePayload.request.payload.monthMovement =
                //     event.target.value;
                // }
              }}
              defaultValue={getActualMonth().toUpperCase()}
            >
              {Object.keys(months).map((monthName, index) => {
                const dayForPay = new Date(
                  userDataRes.merchantSelected.plans.find(
                    (obj) => obj.active == true,
                  ).finishAt,
                ).getDate();
                const nextMonth = monthsInEnglish[index];
                let monthLabel = `${months[monthName]}`;
                if (index !== 0 && index !== 12) {
                  monthLabel = `${months[monthName]} ${dayForPay} - ${months[nextMonth]} ${dayForPay}`;
                } else if (index == 12) {
                  monthLabel = `${months[monthName]} ${dayForPay} - ${months['January']} ${dayForPay}`;
                }
                return (
                  <MenuItem
                    key={index}
                    value={monthName.toUpperCase()}
                    style={{fontWeight: 200}}
                  >
                    {monthLabel}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Stack>
        <Divider sx={{my: 2}} />

        <Box>
          <AppGridContainer
            container
            spacing={0}
            sx={{maxWidth: 1000, width: 'auto', margin: 'auto'}}
          >
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
              <Stack
                direction='row'
                spacing={2}
                sx={{display: 'flex', alignItems: 'center'}}
              >
                <Typography
                  component='h3'
                  sx={{
                    fontSize: 16,
                    fontWeight: Fonts.BOLD,
                    mb: {xs: 3, lg: 4},
                    maxWidth: 1000,
                    width: 'auto',
                    margin: 'auto',
                  }}
                >
                  Plan Premium{' '}
                  {businessDebt == 0 || !businessDebt ? (
                    <Chip label='Al día' color='success' />
                  ) : (
                    <Chip
                      label={`En deuda ${businessDebt} soles`}
                      color='secondary'
                    />
                  )}
                </Typography>
              </Stack>
            </Grid>
          </AppGridContainer>
          <AppGridContainer
            container
            spacing={0}
            sx={{maxWidth: 1000, width: 'auto', margin: 'auto'}}
          >
            <Grid item xs={2}></Grid>
            <Grid item xs={8}>
              <Typography
                component='h3'
                sx={{
                  fontSize: 16,
                  fontWeight: Fonts.BOLD,
                  mb: {xs: 3, lg: 4},
                }}
              >
                Ud va utilizando {actualDocuments} documentos SUNAT de{' '}
                {availableDocuments} disponibles
              </Typography>

              <LinearProgressWithLabel value={progressDocument} />
              <Typography
                component='h3'
                sx={{
                  fontSize: 16,
                  fontWeight: Fonts.BOLD,
                  mb: {xs: 3, lg: 4},
                }}
              >
                Ud va utilizando {aditionalDocuments} documentos SUNAT
                adicionales
              </Typography>
            </Grid>
          </AppGridContainer>
          <AppGridContainer
            container
            spacing={0}
            sx={{maxWidth: 1000, width: 'auto', margin: 'auto'}}
          >
            <Grid item xs={2}></Grid>
            <Grid item xs={8}>
              <AppGridContainer
                container
                spacing={0}
                sx={{maxWidth: 1000, width: 'auto', margin: 'auto'}}
              >
                <Grid item xs={9}>
                  <Typography
                    component='h3'
                    sx={{
                      fontSize: 16,
                      fontWeight: Fonts.BOLD,
                      mb: {xs: 3, lg: 4},
                    }}
                  >
                    Costo suscripción mensual:
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    component='h3'
                    sx={{
                      fontSize: 16,
                      fontWeight: Fonts.BOLD,
                      mb: {xs: 3, lg: 4},
                    }}
                  >
                    {monthPrice}
                  </Typography>
                </Grid>
              </AppGridContainer>
            </Grid>
          </AppGridContainer>
          <AppGridContainer
            container
            spacing={0}
            sx={{maxWidth: 1000, width: 'auto', margin: 'auto'}}
          >
            <Grid item xs={2}></Grid>
            <Grid item xs={8}>
              <AppGridContainer
                container
                spacing={0}
                sx={{maxWidth: 1000, width: 'auto', margin: 'auto'}}
              >
                <Grid item xs={9}>
                  <Typography
                    component='h3'
                    sx={{
                      fontSize: 16,
                      fontWeight: Fonts.BOLD,
                      mb: {xs: 3, lg: 4},
                    }}
                  >
                    Costo adicional documentos SUNAT:
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    component='h3'
                    sx={{
                      fontSize: 16,
                      fontWeight: Fonts.BOLD,
                      mb: {xs: 3, lg: 4},
                    }}
                  >
                    {aditionalMonthPrice}
                  </Typography>
                </Grid>
              </AppGridContainer>
            </Grid>
          </AppGridContainer>
          <AppGridContainer
            container
            spacing={0}
            sx={{maxWidth: 1000, width: 'auto', margin: 'auto'}}
          >
            <Grid item xs={2}></Grid>
            <Grid item xs={8}>
              <AppGridContainer
                container
                spacing={0}
                sx={{maxWidth: 1000, width: 'auto', margin: 'auto'}}
              >
                <Grid item xs={9}>
                  <Typography
                    component='h3'
                    sx={{
                      fontSize: 16,
                      fontWeight: Fonts.BOLD,
                      mb: {xs: 3, lg: 4},
                    }}
                  >
                    Costo Total:
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    component='h3'
                    sx={{
                      fontSize: 16,
                      fontWeight: Fonts.BOLD,
                      mb: {xs: 3, lg: 4},
                    }}
                  >
                    {totalPrice}
                  </Typography>
                </Grid>
              </AppGridContainer>
            </Grid>
          </AppGridContainer>
        </Box>

        <Divider sx={{my: 2}} />
        <Box>
          <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>0-1000 documentos SUNAT</TableCell>
                  <TableCell align='right'>
                    1001-5000 documentos SUNAT
                  </TableCell>
                  <TableCell align='right'>
                    5001-10000 documentos SUNAT
                  </TableCell>
                  <TableCell align='right'>
                    10001-50000 documentos SUNAT
                  </TableCell>
                  <TableCell align='right'>
                    50001-100000 documentos SUNAT
                  </TableCell>
                  <TableCell align='right'>1M a 1MM </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rows || rows2).map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                  >
                    <TableCell component='th' scope='row'>
                      {row.name}
                    </TableCell>
                    <TableCell align='right'>{row.calories}</TableCell>
                    <TableCell align='right'>{row.fat}</TableCell>
                    <TableCell align='right'>{row.carbs}</TableCell>
                    <TableCell align='right'>{row.protein}</TableCell>
                    <TableCell align='right'>{row.million}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Card>
    </>
  ) : (
    <></>
  );
};

export default MyBilling;
