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
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
const maxLength = 11111111111111111111; //20 caracteres
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
  UPDATE_CATALOGS,
} from '../../../shared/constants/ActionTypes';
import {
  onGetBusinessParameter,
  updateAllBusinessParameter,
  updateCatalogs,
} from '../../../redux/actions/General';
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

const XLSX = require('xlsx');

const BulkLoad = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const router = useRouter();
  const {query} = router; //query es el objeto seleccionado
  console.log('query', query);

  const [typeAlert, setTypeAlert] = React.useState(
    'existProductsWithThisCategory',
  );
  const [excelOrCsv, setExcelOrCsv] = React.useState('');
  const [excelOrCsvName, setExcelOrCsvName] = React.useState('');
  //GET APIS RES
  const {userDataRes} = useSelector(({user}) => user);
  const {updateCatalogsRes} = useSelector(({general}) => general);
  console.log('updateCatalogsRes', updateCatalogsRes);
  const {generalSuccess} = useSelector(({general}) => general);
  console.log('generalSuccess', generalSuccess);
  const {generalError} = useSelector(({general}) => general);
  console.log('generalError', generalError);

  const toUpdateCatalogs = (payload) => {
    dispatch(updateCatalogs(payload));
  };

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
    }
  }, []);

  const processData = (data) => {
    const keys = data[0];
    const datav2 = data
      .slice(1)
      .filter((row) => row[0] !== undefined && row[0] !== null)
      .map((row) =>
        keys.reduce((obj, key, i) => {
          obj[key] = row[i];
          return obj;
        }, {}),
      );
    return datav2;
  };

  const onChangeHandler = (event) => {
    if (excelOrCsv.target.files) {
      const reader = new FileReader();
      reader.onload = (excelOrCsv) => {
        const bstr = excelOrCsv.target.result;
        const wb = XLSX.read(bstr, {type: 'binary'});
        console.log('wb', wb);

        const productsSheet = wb.Sheets['PRODUCTOS'];
        const productsData = XLSX.utils.sheet_to_json(productsSheet, {
          header: 1,
        });
        const productsDataV2 = processData(productsData);

        const clientsSheet = wb.Sheets['CLIENTES'];
        const clientsData = XLSX.utils.sheet_to_json(clientsSheet, {header: 1});
        const clientsDataV2 = processData(clientsData);

        const deliveryPointsSheet = wb.Sheets['PUNTOS_ENTREGA'];
        const deliveryPointsData = XLSX.utils.sheet_to_json(
          deliveryPointsSheet,
          {
            header: 1,
          },
        );
        const deliveryPointsDataV2 = processData(deliveryPointsData);

        const driversSheet = wb.Sheets['CHOFERES'];
        const driversData = XLSX.utils.sheet_to_json(driversSheet, {header: 1});
        const driversDataV2 = processData(driversData);

        const carriersSheet = wb.Sheets['EMPRESA TRANSPORTISTA'];
        const carriersData = XLSX.utils.sheet_to_json(carriersSheet, {
          header: 1,
        });
        const carriersDataV2 = processData(carriersData);

        const providersSheet = wb.Sheets['PROVEEDORES'];
        const providersData = XLSX.utils.sheet_to_json(providersSheet, {
          header: 1,
        });
        const providersData2 = processData(providersData);

        console.log('productsDataV2', productsDataV2);
        console.log('routesDataV2', clientsDataV2);

        const payloadCatalogs = {
          request: {
            payload: {
              merchantId: userDataRes.merchantSelected.merchantId,
              data: {
                products: productsDataV2,
                clients: clientsDataV2,
                providers: providersData2,
                carriers: carriersDataV2,
                drivers: driversDataV2,
                deliveryPoints: deliveryPointsDataV2,
              },
            },
          },
        };
        console.log('payloadCatalogs', payloadCatalogs);
        dispatch({type: FETCH_SUCCESS, payload: undefined});
        dispatch({type: FETCH_ERROR, payload: undefined});
        dispatch({type: UPDATE_CATALOGS, payload: undefined});
        toUpdateCatalogs(payloadCatalogs);
      };
      reader.readAsBinaryString(excelOrCsv.target.files[0]);
    }
  };
  const handleFile = (event) => {
    console.log('evento', event);
    setExcelOrCsvName(
      event.target.files[0].name.split('.').slice(0, -1).join('.'),
    );
    setExcelOrCsv(event);
  };
  return userDataRes ? (
    <>
      <Card sx={{p: 4}}>
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
            }}
          >
            <IntlMessages id='common.bulkLoad' />
          </Typography>
        </Stack>
        <Divider sx={{my: 2}} />
        <Box>
          <Button
            variant='outlined'
            component='label'
            endIcon={!excelOrCsvName ? <FileUploadOutlinedIcon /> : null}
          >
            {excelOrCsvName || 'Subir archivo'}
            <input
              type='file'
              hidden
              onChange={handleFile}
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
          {updateCatalogsRes && generalSuccess && !updateCatalogsRes.error ? (
            <>
              <CheckCircleOutlineOutlinedIcon
                color='success'
                sx={{fontSize: '1.5em', mx: 2}}
              />
            </>
          ) : (
            <></>
          )}
          {(updateCatalogsRes && updateCatalogsRes.error) || generalError ? (
            <>
              <CancelOutlinedIcon
                sx={{fontSize: '1.5em', mx: 2, color: red[500]}}
              />
              {updateCatalogsRes
                ? updateCatalogsRes.error
                : 'Hubo un error durante el proceso'}
            </>
          ) : (
            <></>
          )}
        </Box>
      </Card>
    </>
  ) : (
    <></>
  );
};

export default BulkLoad;
