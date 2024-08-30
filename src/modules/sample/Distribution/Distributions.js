import React, {useEffect} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  Box,
  IconButton,
  CircularProgress,
  Collapse,
  Button,
  MenuItem,
  Menu,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Stack,
  useTheme,
  useMediaQuery,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Alert,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Radio,
  OutlinedInput,
  ListItemText,
  Checkbox
} from '@mui/material';

import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DirectionsBusFilledIcon from '@mui/icons-material/DirectionsBusFilled';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import DataSaverOffOutlinedIcon from '@mui/icons-material/DataSaverOffOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FilePresentIcon from '@mui/icons-material/FilePresent';

import CancelIcon from '@mui/icons-material/Cancel';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloseIcon from '@mui/icons-material/Close';
import PendingIcon from '@mui/icons-material/Pending';
import {red, amber} from '@mui/material/colors';
import {getUserData} from '../../../redux/actions/User';
import CachedIcon from '@mui/icons-material/Cached';
import ExcelIcon from '../../../assets/icon/excel.svg';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  LIST_ROUTE,
  GET_USER_DATA,
  ROUTE_TO_REFERRAL_GUIDE,
  GENERATE_EXCEL_SUMMARY_ROUTES,
} from '../../../shared/constants/ActionTypes';
import Router, {useRouter} from 'next/router';
import {
  listDistributions,
  getDistribution,
  getOneDistribution,
  exportExcelSummaryRoutes,
  excelSummaryRoutesRes,
} from '../../../redux/actions/Movements';
import {
  generatePresigned, 
  uploadFile, collateRecordsAndGuides} from '../../../redux/actions/FileExplorer';
import {useDispatch, useSelector} from 'react-redux';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import {getYear, justDate, showSubtypeMovement} from '../../../Utils/utils';
import {makeStyles} from '@mui/styles';
const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
  },
  btnGroup: {
    marginTop: '1em',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  btn: {
    margin: '3px 0',
    width: '260px',
  },
  noSub: {
    textDecoration: 'none',
  },
  field: {
    marginTop: '10px',
  },
  imgPreview: {
    display: 'flex',
    justifyContent: 'center',
  },
  img: {
    width: '80%',
  },
  fixPosition: {
    position: 'relative',
    bottom: '-8px',
  },
  searchIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonAddProduct: {},
  closeButton: {
    cursor: 'pointer',
    float: 'right',
    marginTop: '5px',
    width: '20px',
  },
  detailRoutes: {
    maxWidth: '90vw',
  },
  stack: {
    justifyContent: 'center',
    marginBottom: '10px',
  },
}));
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
let listDistributionsPayload = {
  request: {
    payload: {
      merchantId: '',
    },
  },
};
let codFinanceSelected = '';
let selectedDistribution = '';
let selectedRoute = '';

let selectedDelivery = {};
let selectedSummaryRow = {};
let fileToUpload;
let toUpload = false;
let urlToUpload;
const FinancesTable = (props) => {
  let typeAlert = 'sizeOverWeightLimit';

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open2, setOpen2] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [resultState, setResultState] = React.useState(false);
  const [openSummaryGuide, setOpenSummaryGuide] = React.useState(false);
  const [openCollateRecordsAndGuides, setOpenCollateRecordsAndGuides] =
    React.useState(false);
    
  const [openCollateRecordsAndDistributions, setOpenCollateRecordsAndDistributions] =
    React.useState(false);
  //const [openMenu, setOpenMenu] = React.useState(false);
  const [openRoutes, setOpenRoutes] = React.useState(false);
  const [openProducts, setOpenProducts] = React.useState(false);
  const [rowNumber, setRowNumber] = React.useState(0);
  const [rowNumber2, setRowNumber2] = React.useState(0);
  const [listDeliveryDetail, setListDeliveryDetail] = React.useState([]);
  const [searchObservation, setSearchObservation] = React.useState('');
  const [summaryType, setSummaryType] = React.useState('driver');
  const [nombreAgrupador, setNombreAgrupador] = React.useState('');
  const [cantidadAgrupacion, setCantidadAgrupacion] = React.useState('');
  const [openSummary, setOpenSummary] = React.useState(false);
  const [openSummaryProducts, setOpenSummaryProducts] = React.useState(false);
  const [openSummaryPoints, setOpenSummaryPoints] = React.useState(false);
  const [summaryRowNumber, setSummaryRowNumber] = React.useState(0);
  const [selectedLocations, setSelectedLocations] = React.useState([]);
  const [selectedLocation, setSelectedLocation] = React.useState('TODOS');
  const [typeFileRecords, setTypeFileRecords] = React.useState('');
  const [nameFileRecords, setNameFileRecords] = React.useState('');
  const [base64, setBase64] = React.useState('');
  const {presigned} = useSelector(({general}) => general);
  const [showAlert, setShowAlert] = React.useState(false);
  const [records, setRecords] = React.useState('');
  const [openEndCollate, setOpenEndCollate] = React.useState(false);
  const [openEndCollate2, setOpenEndCollate2] = React.useState(false);
  const [randomNumber, setRandomNumber] = React.useState('0');
  const [loading, setLoading] = React.useState(true);
  const [orderBy, setOrderBy] = React.useState('O');
  const [downloadExcel, setDownloadExcel] = React.useState(false);
  const [distributionName, setDistributionName] = React.useState([]);

  const openMenu = Boolean(anchorEl);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();
  const router = useRouter();
  const {query} = router;
  console.log('query', query);

  const {listDistribution} = useSelector(({movements}) => movements);
  console.log('listDistribution', listDistribution);
  const {successMessage} = useSelector(({movements}) => movements);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({movements}) => movements);
  console.log('errorMessage', errorMessage);
  const {excelSummaryRoutesRes} = useSelector(({movements}) => movements);
  console.log('excelSummaryRoutesRes', excelSummaryRoutesRes);
  const {getPresignedRes} = useSelector(({fileExplorer}) => fileExplorer);
  console.log('getPresignedRes', getPresignedRes);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  const {collateRecordsAndGuidesRes} = useSelector(
    ({fileExplorer}) => fileExplorer,
  );
  const [distributionSelected, setDistributionSelected] = React.useState(null);
  const [indexDistributionSelected, setIndexDistributionSelected] =
    React.useState(null);

  const [typeDialog, setTypeDialog] = React.useState('');
  const {getStartingLocationsRes} = useSelector(({locations}) => locations);

  //APIS
  const toListDistributions = (payload) => {
    dispatch(listDistributions(payload));
  };
  const toGeneratePresigned = (payload) => {
    dispatch(generatePresigned(payload));
  };
  const toExportExcelSummaryRoutes = (payload) => {
    dispatch(exportExcelSummaryRoutes(payload));
  };
  const toUploadFile = (url, data) => {
    dispatch(uploadFile(url, data));
  };

  if (getPresignedRes != undefined) {
    urlToUpload = getPresignedRes.response.payload.presignedS3Url;
    console.log('urlToUpload', urlToUpload);
  }
  if (urlToUpload && fileToUpload && toUpload) {
    toUploadFile(getPresignedRes.response.payload.presignedS3Url, fileToUpload);
    toUpload = false;
  }

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
  useEffect(() => {
    if (userDataRes) {
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      dispatch({type: LIST_ROUTE, payload: undefined});
      if (query.id) {
        toGetOneDistribution({
          deliveryDistributionId: query.id,
          //indexDistributionSelected: indexDistributionSelected,
          merchantId: userDataRes.merchantSelected.merchantId,
        });
      } else {
        listDistributionsPayload.request.payload.merchantId =
          userDataRes.merchantSelected.merchantId;
        listDistributionsPayload.request.payload.locations =
          userDataRes.locations;
        setSelectedLocations(userDataRes.locations);
        toListDistributions(listDistributionsPayload);
      }
    }
  }, [userDataRes, query]);

  const compare = (a, b) => {
    if (a.createdAt < b.createdAt) {
      return 1;
    }
    if (a.createdAt > b.createdAt) {
      return -1;
    }
    return 0;
  };

  const checkRoutes = (input, index) => {
    selectedDistribution = input;
    console.log('selectedDistribution', selectedDistribution);
    setOpenRoutes(false);
    setOpenRoutes(true);
    if (openRoutes == true && rowNumber == index) {
      setOpenRoutes(false);
    }
    setRowNumber(index);
  };

  const checkProducts = (delivery, index) => {
    if (openProducts == true && rowNumber2 == index) {
      console.log('Va a cerrar el openProducts');
      setOpenProducts(false);
    } else {
      console.log('Va a abrir el openProducts');
      setRowNumber2(index);
      setOpenProducts(true);
    }
  };

  const newRoute = () => {
    Router.push('/sample/distribution/create-routes');
  };

  const handleClick = (routex, event) => {
    setAnchorEl(event.currentTarget);
    // selectedRoute = route;
    // console.log('selectedRoute', selectedRoute);
  };

  const handleClickOpen = (type) => {
    console.log('Este es el type', type);
    if (type == 'viewDetail') {
      setTypeDialog(type);
      if (
        listDistribution[indexDistributionSelected] &&
        listDistribution[indexDistributionSelected].deliveries.length == 0
      ) {
        console.log('Obtendra el listDistribution');
        toGetDistribution({
          deliveryDistributionId: distributionSelected,
          indexDistributionSelected: indexDistributionSelected,
          merchantId: userDataRes.merchantSelected.merchantId,
        });
      } else {
        console.log('Se reutilizara el metodo');
      }
      setOpen(true);
    } else if (type == 'viewSummary') {
      setTypeDialog(type);
      if (
        listDistribution[indexDistributionSelected] &&
        listDistribution[indexDistributionSelected].deliveries.length == 0
      ) {
        console.log('Obtendra el listDistribution');
        toGetDistribution({
          deliveryDistributionId: distributionSelected,
          indexDistributionSelected: indexDistributionSelected,
          merchantId: userDataRes.merchantSelected.merchantId,
        });
      } else {
        console.log('Se reutilizara el metodo');
      }
      setOpenSummary(true);
    } else if (type == 'generateSummaryGuide') {
      console.log('Selected Distribution', selectedDistribution);
      setTypeDialog(type);
      if (
        listDistribution[indexDistributionSelected] &&
        listDistribution[indexDistributionSelected].deliveries.length == 0
      ) {
        console.log('Obtendra el listDistribution');
        toGetDistribution({
          deliveryDistributionId: distributionSelected,
          indexDistributionSelected: indexDistributionSelected,
          merchantId: userDataRes.merchantSelected.merchantId,
        });
      } else {
        console.log('Se reutilizara el metodo');
      }
      setOpenSummaryGuide(true);
      
    } else if (type == 'collateRecordsAndDistributions') {
      console.log('Selected Distribution', selectedDistribution);
      setTypeDialog(type);
      setOpenCollateRecordsAndDistributions(true);
    } else if (type == 'collateRecordsAndGuides') {
      console.log('Selected Distribution', selectedDistribution);
      setTypeDialog(type);
      if (
        listDistribution[indexDistributionSelected] &&
        listDistribution[indexDistributionSelected].deliveries.length == 0
      ) {
        console.log('Obtendra el listDistribution');
        toGetDistribution({
          deliveryDistributionId: distributionSelected,
          indexDistributionSelected: indexDistributionSelected,
          merchantId: userDataRes.merchantSelected.merchantId,
        });
      } else {
        console.log('Se reutilizara el metodo');
      }
      //setOpenMenu(false);
      setOpenCollateRecordsAndGuides(true);
    }
    // console.log('Veamos el total', selectedRoute);
    // let routePredefinedId = selectedRoute.routePredefinedId;
    // console.log('EY que tal', userDataRes.merchantSelected.merchantId);
    // toListNewRoutes({
    //   routePredefinedId,
    //   merchantId: userDataRes.merchantSelected.merchantId,
    // });

    // setOpen(true);
    // toListNewRoutes()
    // setTypeDialog(type);
    // setShowAlert(false);
  };
  const sendQuerySummaryGuide = () => {
    const querySummaryGuide = {
      type: 'summaryGuideSinceDistribution',
      movementHeaderId:
        listDistribution[indexDistributionSelected].movementHeaderId,
      deliveryDistributionId:
        listDistribution[indexDistributionSelected].deliveryDistributionId,
    };
    Router.push({
      pathname: '/sample/referral-guide/get',
      query: querySummaryGuide,
    });
  };

  const toGetDistribution = (payload) => {
    dispatch(getDistribution(payload));
  };

  const toCollateRecordsAndGuides = (payload) => {
    dispatch(collateRecordsAndGuides(payload));
  };

  const toGetOneDistribution = (payload) => {
    dispatch(getOneDistribution(payload));
  };
  const handleClickFather = (deliveryDistributionId, index, event) => {
    setAnchorEl(event.currentTarget);
    setDistributionSelected(deliveryDistributionId);
    setIndexDistributionSelected(index);
  };
  const sendCollate = () => {
    if (listDistribution[indexDistributionSelected].deliveries !== 0) {
      const random = Math.floor(Math.random() * (10000 - 1)) + 1;
      setRandomNumber(random);
      // Ejecutar toCollateRecordsAndGuides después de 15 segundos
      setTimeout(() => {
        toCollateRecordsAndGuides({
          request: {
            payload: {
              deliveryDistributionId: listDistribution[indexDistributionSelected].deliveryDistributionId,
              distributions: [`${listDistribution[indexDistributionSelected].deliveryDistributionId}`],
              pathActas: `private/merchant/${listDistribution[indexDistributionSelected].merchantId}/distributions/${listDistribution[indexDistributionSelected].routeName}-${listDistribution[indexDistributionSelected].deliveryDistributionId}/${fileToUpload.name}`,
              randomNumber: random,
              orderBy: orderBy,
            },
          },
        });
       }, 60000); // 15000 milisegundos = 15 segundos
      
      
    }
    setOpenCollateRecordsAndGuides(false);
    setOpenEndCollate(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 120000);

    // Limpia el temporizador si el componente se desmonta
    return () => clearTimeout(timer);
  };
  const sendCollate2 = () => {
    if (distributionName.length !== 0) {
      const random = Math.floor(Math.random() * (10000 - 1)) + 1;
      setRandomNumber(random);
      // Ejecutar toCollateRecordsAndGuides después de 15 segundos
      setTimeout(() => {
        toCollateRecordsAndGuides({
          request: {
            payload: {
              deliveryDistributionId: distributionName[0].deliveryDistributionId,
              distributions: distributionName.map(obj=>obj.deliveryDistributionId),
              pathActas: `private/merchant/${distributionName[0].merchantId}/distributions/${distributionName[0].routeName}-${distributionName[0].deliveryDistributionId}/${fileToUpload.name}`,
              randomNumber: random,
              orderBy: orderBy,
            },
          },
        });
       }, 60000); // 15000 milisegundos = 15 segundos
      
      
    }
    setOpenCollateRecordsAndDistributions(false);
    setOpenEndCollate2(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 120000);

    // Limpia el temporizador si el componente se desmonta
    return () => clearTimeout(timer);
  };
  const getReferralGuide = () => {
    console.log('Selected distribution', selectedDistribution);
    console.log('Selected route', selectedRoute);
    dispatch({
      type: ROUTE_TO_REFERRAL_GUIDE,
      payload: {
        ...selectedRoute,
        reasonForTransfer: selectedDistribution.reasonForTransfer,
        typeOfTransport: selectedDistribution.typeOfTransport,
        observation: selectedDistribution.observation,
        deliveries: selectedDistribution.deliveries.map((delivery, index) => ({
          ...delivery,
          localRouteId: index,
        })),
        deliveryDistributionId: selectedDistribution.deliveryDistributionId,
      },
    });
    Router.push({
      pathname: '/sample/referral-guide/get',
      query: {
        movementHeaderId: selectedDistribution.movementHeaderId,
        useLocaleRoute: true,
      },
    });
  };
  const showObject = (codOutput, type) => {
    // if (type == 'income') {
    //   Router.push({
    //     pathname: '/sample/finances/table',
    //     query: {contableMovementId: selectedOutput.contableMovementId},
    //   });
    // } else if (type == 'bill') {
    //   Router.push({
    //     pathname: '/sample/bills/table',
    //     query: {billId: selectedOutput.billId},
    //   });
    // } else

    if (type == 'referralGuide') {
      console.log('Esta es la id de la guia', codOutput);
      Router.push({
        pathname: '/sample/referral-guide/table',
        query: {referralGuideId: codOutput},
      });
    } else if (type == 'distribution') {
      console.log('Esta es la id de la guia', codOutput);
      Router.push({
        pathname: '/sample/referral-guide/table',
        query: {deliveryDistributionId: codOutput},
      });
    } else {
      return null;
    }
  };
  const goToFiles = (folderMovement) => {
    const data = {
      goDirectory: true,
      path: folderMovement,
    };
    localStorage.setItem('redirectUrl', JSON.stringify(data));
    window.open('/sample/explorer');
  };
  const showIconStatus = (bool, obj) => {
    switch (bool) {
      case 'waiting':
        return <PendingIcon sx={{color: amber[500]}} />;
        break;
      case null:
        return <PendingIcon sx={{color: amber[500]}} />;
        break;
      case 'accepted':
        return (
          <Button
            variant='secondary'
            sx={{fontSize: '1em'}}
            /* disabled={type == 'referralGuide'} */
            onClick={() =>
              showObject(obj.referralGuideMovementHeaderId, 'referralGuide')
            }
          >
            <CheckCircleIcon color='success' />
          </Button>
        );
        break;
      case true:
        return (
          <Button
            variant='secondary'
            sx={{fontSize: '1em'}}
            /* disabled={type == 'referralGuide'} */
            onClick={() =>
              showObject(obj.referralGuideMovementHeaderId, 'referralGuide')
            }
          >
            <CheckCircleIcon color='success' />
          </Button>
        );
        break;
      case 'denied':
        return <CancelIcon sx={{color: red[500]}} />;
        break;
      case false:
        return <CancelIcon sx={{color: red[500]}} />;
        break;
      default:
        return null;
    }
  };

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseSummaryGuide = () => {
    setOpenSummaryGuide(false);
  };
  const handleCloseCollateRecordsAndGuides = () => {
    setOpenCollateRecordsAndGuides(false);
  };
  const handleCloseCollateRecordsAndDistributions = () => {
    setOpenCollateRecordsAndDistributions(false);
  };
  const handleOpenEndCollate = () => {
    setOpenEndCollate(false);
  };
  const handleOpenEndCollate2 = () => {
    setOpenEndCollate2(false);
  };
  const handleSearchValues = (event) => {
    if (event.target.name == 'searchObservation') {
      if (event.target.value == '') {
        setSearchObservation('');
      } else {
        event.target.value = event.target.value.toLowerCase();
        setSearchObservation(event.target.value);
      }
    }
  };
  const acumularProductosPorConductor = (entregas) => {
    const acumulador = {};

    entregas.forEach((entrega) => {
      const conductorKey = `${entrega.driverDocumentType}_${entrega.driverDocumentNumber}`;

      if (!acumulador[conductorKey]) {
        acumulador[conductorKey] = {
          driverDocumentType: entrega.driverDocumentType,
          driverDocumentNumber: entrega.driverDocumentNumber,
          driverDenomination: entrega.driverDenomination,
          driverLastName: entrega.driverLastName,
          carrierPlateNumber: entrega.carrierPlateNumber,
          points: [
            {
              arrivalPointUbigeo: entrega.arrivalPointUbigeo,
              arrivalPointAddress: entrega.arrivalPointAddress,
              arrivalInternalCode: entrega.arrivalInternalCode,
              startingInternalCode: entrega.startingInternalCode,
              startingPointAddress: entrega.startingPointAddress,
              startingPointUbigeo: entrega.startingPointUbigeo,
            },
          ],
          productsInfo: [],
        };
      }

      entrega.productsInfo.forEach((producto) => {
        const conductorProducto = acumulador[conductorKey].productsInfo.find(
          (item) => item.product === producto.product,
        );

        if (conductorProducto) {
          conductorProducto.quantityMovement += producto.quantityMovement;
        } else {
          acumulador[conductorKey].productsInfo.push({
            product: producto.product,
            quantityMovement: producto.quantityMovement,
            description: producto.description,
            weight: Number(producto.weight),
            unitMeasure: producto.unitMeasure,
          });
        }
      });

      const conductorPuntos = acumulador[conductorKey].points.find(
        (item) =>
          item.arrivalInternalCode === entrega.arrivalInternalCode &&
          item.startingInternalCode === entrega.startingInternalCode,
      );

      if (!conductorPuntos) {
        acumulador[conductorKey].points.push({
          arrivalPointUbigeo: entrega.arrivalPointUbigeo,
          arrivalPointAddress: entrega.arrivalPointAddress,
          arrivalInternalCode: entrega.arrivalInternalCode,
          startingInternalCode: entrega.startingInternalCode,
          startingPointAddress: entrega.startingPointAddress,
          startingPointUbigeo: entrega.startingPointUbigeo,
        });
      }
    });

    return Object.values(acumulador);
  };
  // Creamos una función para acumular los productos por conductor (driver)
  const acumularProductos = (entregas) => {
    const acumulador = {};

    entregas.forEach((entrega) => {
      entrega.productsInfo.forEach((producto) => {
        const productoKey = producto.product;

        if (!acumulador[productoKey]) {
          acumulador[productoKey] = {
            product: producto.product,
            quantityMovement: producto.quantityMovement,
            description: producto.description,
            weight: Number(producto.weight),
            unitMeasure: producto.unitMeasure,
          };
        } else {
          acumulador[productoKey].quantityMovement += producto.quantityMovement;
        }
      });
    });

    return Object.values(acumulador);
  };
  const checkSummaryProducts = (row, index) => {
    selectedSummaryRow = row;
    console.log('selectedSummaryRow', selectedSummaryRow);
    setOpenSummaryProducts(false);
    setOpenSummaryProducts(true);
    if (openSummaryProducts == true && summaryRowNumber == index) {
      setOpenSummaryProducts(false);
    }
    setSummaryRowNumber(index);
  };
  const checkSummaryPoints = (row, index) => {
    selectedSummaryRow = row;
    console.log('selectedSummaryRow', selectedSummaryRow);
    setOpenSummaryPoints(false);
    setOpenSummaryPoints(true);
    if (openSummaryPoints == true && summaryRowNumber == index) {
      setOpenSummaryPoints(false);
    }
    setSummaryRowNumber(index);
  };
  const newDistribution = () => {
    Router.push({
      pathname: '/sample/distribution/new-distribution',
      query: {},
    });
  };

  const uploadNewFile = (event) => {
    if (event.target.value !== '') {
      console.log('archivo', event.target.files[0]);
      fileToUpload = event.target.files[0];
      let generatePresignedPayload = {
        request: {
          payload: {
            key: '',
            path: '',
            action: 'putObject',
            merchantId: userDataRes.merchantSelected.merchantId,
            contentType: '',
          },
        },
      };
      console.log('fileToUpload', fileToUpload);
      console.log(
        'nombre de archivo',
        fileToUpload.name.split('.').slice(0, -1).join('.'),
      );
      generatePresignedPayload.request.payload.key = fileToUpload.name
        .split('.')
        .slice(0, -1)
        .join('.');
      generatePresignedPayload.request.payload.path = listDistribution[indexDistributionSelected]
      .folderMovement
      ? listDistribution[indexDistributionSelected]
          .folderMovement
      : `distributions/${listDistribution[indexDistributionSelected].routeName}-${listDistribution[indexDistributionSelected].deliveryDistributionId}`;
      generatePresignedPayload.request.payload.contentType = fileToUpload.type;
      getBase64(fileToUpload);
      setTypeFileRecords(fileToUpload.type);
      setNameFileRecords(fileToUpload.name);
      toGeneratePresigned(generatePresignedPayload);
      setTimeout(() => {
        toUpload = true;
      }, 1000);
      
      /* setOpenStatus(true); */
    } else {
      event = null;
      console.log('no se selecciono un archivo');
    }
  };

  const uploadNewFile2 = (event) => {
    if (event.target.value !== '') {
      console.log('archivo', event.target.files[0]);
      fileToUpload = event.target.files[0];
      let generatePresignedPayload = {
        request: {
          payload: {
            key: '',
            path: '',
            action: 'putObject',
            merchantId: userDataRes.merchantSelected.merchantId,
            contentType: '',
          },
        },
      };
      console.log('fileToUpload', fileToUpload);
      console.log(
        'nombre de archivo',
        fileToUpload.name.split('.').slice(0, -1).join('.'),
      );
      generatePresignedPayload.request.payload.key = fileToUpload.name
        .split('.')
        .slice(0, -1)
        .join('.');
      generatePresignedPayload.request.payload.path = distributionName[0]
      .folderMovement
      ? distributionName[0]
          .folderMovement
      : `distributions/${distributionName[0].routeName}-${distributionName[0].deliveryDistributionId}`;
      generatePresignedPayload.request.payload.contentType = fileToUpload.type;
      getBase64(fileToUpload);
      setTypeFileRecords(fileToUpload.type);
      setNameFileRecords(fileToUpload.name);
      toGeneratePresigned(generatePresignedPayload);
      setTimeout(() => {
        toUpload = true;
      }, 1000);
      /* setOpenStatus(true); */
    } else {
      event = null;
      console.log('no se selecciono un archivo');
    }
  };

  useEffect(() => {
    if (excelSummaryRoutesRes && downloadExcel) {
      setDownloadExcel(false);
      const byteCharacters = atob(excelSummaryRoutesRes);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'SummaryRoutes.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [excelSummaryRoutesRes, downloadExcel]);
  const exportToExcel = () => {
    let listPayload = {
      request: {
        payload: {
          deliveryDistributionId: distributionSelected,
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };
    const excelPayload = listPayload;

    console.log('excelPayload', excelPayload);
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({
      type: GENERATE_EXCEL_SUMMARY_ROUTES,
      payload: undefined,
    });
    toExportExcelSummaryRoutes(excelPayload);
    setDownloadExcel(true);
  };

  // useEffect(() => {
  //   if (open && listDistribution &&
  //     listDistribution.length > 0 &&
  //     listDistribution[indexDistributionSelected] &&
  //     listDistribution[indexDistributionSelected].deliveries.length > 0) {
  //     const detail = listDistribution[
  //       indexDistributionSelected
  //     ].deliveries
  //     setListDeliveryDetail(detail)
  //   }
  // }, [open, listDistribution])
  const searchDistributions = () => {
    listDistributionsPayload.request.payload.merchantId =
      userDataRes.merchantSelected.merchantId;
    listDistributionsPayload.request.payload.locations = selectedLocations;
    console.log('payload listDistributions', listDistributionsPayload);

    toListDistributions(listDistributionsPayload);
  };
  useEffect(() => {
    if (base64) {
      setRecords({
        base64: base64,
        name: nameFileRecords,
        type: typeFileRecords,
      });
    }
  }, [base64]);

  const onLoad = (fileString) => {
    console.log('llega aquí?');
    setBase64(fileString);
  };
  const getBase64 = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      onLoad(reader.result);
    };
  };
  const uploadRecords = (event) => {
    if (event.target.value !== '') {
      console.log('archivo', event.target.files[0]);
      var imgsize = event.target.files[0].size;
      console.log('Cuánto es el filesize', imgsize);
      if (imgsize > 12000000) {
        typeAlert = 'sizeOverWeightLimit';
        setShowAlert(true);
      } else {
        uploadRecords2(event);
      }
    }
  };
  const uploadRecords2 = (event) => {
    if (event.target.value !== '') {
      fileToUpload = event.target.files[0];
      getBase64(fileToUpload);
      console.log('fileToUpload', fileToUpload);
      console.log(
        'nombre de archivo',
        fileToUpload.name.split('.').slice(0, -1).join('.'),
      );
      setTypeFileRecords(fileToUpload.type);
      setNameFileRecords(fileToUpload.name);
    } else {
      event = null;
      console.log('no se selecciono un archivo');
    }
  };

  const handleChangeOrderBy = (event) => {
    setOrderBy(event.target.value);
  };

  const handleChangeGuidesAndDistributions = (event) => {
    console.log("event guides", event)
    const {
      target: { value },
    } = event;
    setDistributionName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <Card sx={{p: 4}}>
      <Stack
        sx={{m: 2}}
        direction={isMobile ? 'column' : 'row'}
        spacing={2}
        className={classes.stack}
      >
        {userDataRes &&
        getStartingLocationsRes &&
        userDataRes.locations &&
        userDataRes.locations.length > 0 ? (
          <FormControl sx={{my: 0, width: 160}}>
            <InputLabel id='selectedLocation-label' style={{fontWeight: 200}}>
              Almacén
            </InputLabel>
            <Select
              name='selectedLocation'
              labelId='selectedLocation-label'
              label='Almacén'
              onChange={(event) => {
                console.log(event.target.value);
                setSelectedLocation(event.target.value);
                if (event.target.value == 'TODOS') {
                  let allLocations = userDataRes.locations;
                  setSelectedLocations(allLocations);
                } else {
                  setSelectedLocations([event.target.value]);
                }
              }}
              defaultValue={selectedLocation}
            >
              <MenuItem value={'TODOS'} style={{fontWeight: 200}}>
                TODOS
              </MenuItem>
              {userDataRes.locations.map((actualLocation, index) => {
                const locationName = getStartingLocationsRes.find(
                  (obj) => obj.modularCode == actualLocation,
                ).locationName;
                return (
                  <MenuItem
                    key={`locationItem-${index}`}
                    value={actualLocation}
                    style={{fontWeight: 200}}
                  >
                    {locationName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        ) : null}
        <Button
          variant='contained'
          startIcon={<ManageSearchOutlinedIcon />}
          color='primary'
          onClick={searchDistributions}
        >
          Buscar
        </Button>
      </Stack>
      <TableContainer component={Paper} sx={{maxHeight: 440}}>
        <Table stickyHeader size='small' aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Fecha de creación</TableCell>
              <TableCell>Nombre de ruta</TableCell>
              <TableCell>Cant.Puntos</TableCell>
              <TableCell>Guías</TableCell>
              <TableCell>Razón para transferir</TableCell>
              <TableCell>Observación</TableCell>
              {/* <TableCell>Entregas</TableCell> */}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listDistribution && Array.isArray(listDistribution) ? (
              listDistribution.sort(compare).map((obj, index) => {
                const routes = obj.deliveries;
                return (
                  <>
                    <TableRow
                      sx={{'&:last-child td, &:last-child th': {border: 0}}}
                      key={`route${index}`}
                    >
                      <TableCell>{justDate(obj.createdAt)}</TableCell>
                      <TableCell>{obj.routeName}</TableCell>
                      <TableCell>{obj.cantDeliveries}</TableCell>
                      <TableCell>
                        {obj.serialNumberRange
                          ? `${obj.serialNumberRange[0]} al ${obj.serialNumberRange[1]}`
                          : ''}
                      </TableCell>
                      <TableCell>
                        {showSubtypeMovement(obj.reasonForTransfer)}
                      </TableCell>
                      <TableCell>{obj.observation}</TableCell>
                      {/* <TableCell>
                        {routes.length !== 0 ? (
                          <IconButton
                            onClick={() => checkRoutes(obj, index)}
                            size='small'
                          >
                            <FormatListBulletedIcon fontSize='small' />
                          </IconButton>
                        ) : null}
                      </TableCell> */}
                      <TableCell>
                        <Button
                          id='basic-button'
                          aria-controls={openMenu ? 'basic-menu' : undefined}
                          aria-haspopup='true'
                          aria-expanded={openMenu ? 'true' : undefined}
                          onClick={handleClickFather.bind(
                            this,
                            obj.deliveryDistributionId,
                            index,
                          )}
                        >
                          <KeyboardArrowDownIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </>
                );
              })
            ) : (
              <CircularProgress
                disableShrink
                sx={{m: '10px', position: 'relative'}}
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack
        sx={{mt: 2}}
        spacing={2}
        direction={isMobile ? 'column' : 'row'}
        className={classes.stack}
      >
        <Button
          variant='outlined'
          startIcon={<AddCircleOutlineOutlinedIcon />}
          onClick={newDistribution}
        >
          Nuevo
        </Button>
        <Button
          variant='outlined'
          onClick={handleClickOpen.bind(this, 'collateRecordsAndDistributions')}
        >
          Compaginar actas con distribuciones
        </Button>
      </Stack>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={openMenu}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClickOpen.bind(this, 'viewDetail')}>
          <CachedIcon sx={{mr: 1, my: 'auto'}} />
          Ver detalle
        </MenuItem>
        <MenuItem onClick={handleClickOpen.bind(this, 'viewSummary')}>
          <CachedIcon sx={{mr: 1, my: 'auto'}} />
          Ver resumen
        </MenuItem>
        <MenuItem onClick={handleClickOpen.bind(this, 'generateSummaryGuide')}>
          <LocalShippingOutlinedIcon sx={{mr: 1, my: 'auto'}} />
          Generar Guía Conglomerada
        </MenuItem>
        <MenuItem
          onClick={handleClickOpen.bind(this, 'collateRecordsAndGuides')}
        >
          <ReceiptLongIcon sx={{mr: 1, my: 'auto'}} />
          Compaginar actas y guías
        </MenuItem>
      </Menu>
      <Dialog
        open={openCollateRecordsAndGuides}
        onClose={handleCloseCollateRecordsAndGuides}
        PaperProps={{sx: {textAlign: 'center'}}} // Aplicar textAlign: 'center' al PaperProps
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Compaginar Guías y Actas'}
        </DialogTitle>
        <DialogContent sx={{justifyContent: 'center'}}>
          <Stack sx={{mt: 2}} direction={'column'} className={classes.stack}>
          <FormLabel component='legend'>Ordenar por:</FormLabel>
            <RadioGroup
              aria-label='gender'
              defaultValue='O'
              value={orderBy}
              onChange={handleChangeOrderBy}
              name='radio-buttons-group'
            >
              <FormControlLabel value='O' control={<Radio />} label='Mantener orden original' />
              <FormControlLabel value='G' control={<Radio />} label='Por número de guía' />
            </RadioGroup>
          </Stack>
          <Stack sx={{mt: 2}} direction={'column'} className={classes.stack}>
            <Button variant='contained' color='primary' component='label'>
              Adjuntar Actas
              <input
                type='file'
                hidden
                //onChange={uploadRecords}
                onChange={uploadNewFile}
                id='newFile'
                name='newfile'
                accept='.pdf'
              />
            </Button>
            {records ? (
              <IconButton onClick={uploadRecords2}>
                <FilePresentIcon
                  color='success'
                  sx={{fontSize: '2em', mx: 2}}
                />
                {records.name}
              </IconButton>
            ) : (
              <></>
            )}
          </Stack>
          <Collapse in={showAlert}>
            <Alert
              severity='error'
              action={
                <IconButton
                  aria-label='close'
                  color='inherit'
                  size='small'
                  onClick={() => {
                    setShowAlert(false);
                  }}
                >
                  <CloseIcon fontSize='inherit' />
                </IconButton>
              }
              sx={{mb: 2}}
            >
              {typeAlert == 'sizeOverWeightLimit' ? (
                'El archivo supera los 12Mb.'
              ) : (
                <></>
              )}
            </Alert>
          </Collapse>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button
            disabled={
              (listDistribution &&
              listDistribution[indexDistributionSelected] &&
              listDistribution[indexDistributionSelected].deliveries == 0)
            }
            variant='outlined'
            onClick={sendCollate}
          >
            Generar compaginado
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openCollateRecordsAndDistributions}
        onClose={handleCloseCollateRecordsAndDistributions}
        PaperProps={{sx: {textAlign: 'center'}}} // Aplicar textAlign: 'center' al PaperProps
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Compaginar Guías y Distribuciones'}
        </DialogTitle>
        <DialogContent sx={{justifyContent: 'center'}}>
          <Stack sx={{mt: 2}} direction={'column'} className={classes.stack}>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="demo-multiple-checkbox-label">Distribuciones</InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={distributionName}
                onChange={handleChangeGuidesAndDistributions}
                input={<OutlinedInput label="Nameasd" />}
                renderValue={(selected) => selected.map((item) => item.routeName).join(', ')}
                MenuProps={MenuProps}
                key={'SelectCollate'}
              >
                {listDistribution && Array.isArray(listDistribution) ? (
                  listDistribution.map((distrib, index) => (
                        <MenuItem
                          
                          key={distrib.deliveryDistributionId}
                          value={distrib}
                          style={getStyles(distrib, distributionName, theme)}
                        >
                          <Checkbox checked={distributionName.some(item => item.deliveryDistributionId === distrib.deliveryDistributionId)} />
                          <ListItemText primary={distrib.routeName} />
                        </MenuItem>
                      ))
                    ) : null}
              </Select>
            </FormControl>
          </Stack>
          <Stack sx={{mt: 2}} direction={'column'} className={classes.stack}>
            <Button variant='contained' color='primary' component='label'>
              Adjuntar Actas
              <input
                type='file'
                hidden
                //onChange={uploadRecords}
                onChange={uploadNewFile2}
                id='newFile'
                name='newfile'
                accept='.pdf'
              />
            </Button>
            {records ? (
              <IconButton onClick={uploadRecords2}>
                <FilePresentIcon
                  color='success'
                  sx={{fontSize: '2em', mx: 2}}
                />
                {records.name}
              </IconButton>
            ) : (
              <></>
            )}
          </Stack>
          <Collapse in={showAlert}>
            <Alert
              severity='error'
              action={
                <IconButton
                  aria-label='close'
                  color='inherit'
                  size='small'
                  onClick={() => {
                    setShowAlert(false);
                  }}
                >
                  <CloseIcon fontSize='inherit' />
                </IconButton>
              }
              sx={{mb: 2}}
            >
              {typeAlert == 'sizeOverWeightLimit' ? (
                'El archivo supera los 12Mb.'
              ) : (
                <></>
              )}
            </Alert>
          </Collapse>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button
            disabled={
              (listDistribution &&
              listDistribution[indexDistributionSelected] &&
              listDistribution[indexDistributionSelected].deliveries == 0)
            }
            variant='outlined'
            onClick={sendCollate2}
          >
            Generar compaginado
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openEndCollate}
        onClose={handleOpenEndCollate}
        PaperProps={{sx: {textAlign: 'center'}}} // Aplicar textAlign: 'center' al PaperProps
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {
            `El PDF se guardará en los Archivos de la distribución en dos minutos con el nombre ActasConsolidado-${randomNumber}.pdf.`
          }
        </DialogTitle>

        <DialogContent>
          <Stack
            sx={{mt: 2}}
            direction={'column'}
            alignItems='center' // Añade esta línea
            className={classes.stack}
          >
            {loading && <CircularProgress />}
            <Button
              color='secondary'
              variant='outlined'
              disabled={loading}
              sx={{mt: 2}}
              // onClick={() =>
              //   window.open(
              //     `${
              //       listDistribution[
              //         indexDistributionSelected
              //       ].deliveries[0].linkPdf.split('pdf/')[0]
              //     }ActasConsolidado-${randomNumber}.pdf`,
              //   )
              // }
              onClick={() =>
                goToFiles(
                  listDistribution[indexDistributionSelected]
                    .folderMovement
                    ? listDistribution[indexDistributionSelected]
                        .folderMovement
                    : `distributions/${listDistribution[indexDistributionSelected].routeName}-${listDistribution[indexDistributionSelected].deliveryDistributionId}`,
                )
              }
            >
              Dirigirse a los Archivos
            </Button>
          </Stack>
        </DialogContent>

        <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={handleOpenEndCollate}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openEndCollate2}
        onClose={handleOpenEndCollate2}
        PaperProps={{sx: {textAlign: 'center'}}} // Aplicar textAlign: 'center' al PaperProps
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {
            `El PDF se guardará en los Archivos de la distribución en dos minutos con el nombre ActasConsolidado-${randomNumber}.pdf.`
          }
        </DialogTitle>

        <DialogContent>
          <Stack
            sx={{mt: 2}}
            direction={'column'}
            alignItems='center' // Añade esta línea
            className={classes.stack}
          >
            {loading && <CircularProgress />}
            <Button
              color='secondary'
              variant='outlined'
              disabled={loading}
              sx={{mt: 2}}
              onClick={() =>
                goToFiles(
                  distributionName[0]
                    .folderMovement
                    ? distributionName[0]
                        .folderMovement
                    : `distributions/${distributionName[0].routeName}-${distributionName[0].deliveryDistributionId}`,
                )
              }
            >
              Dirigirse a los Archivos
            </Button>
          </Stack>
        </DialogContent>

        <DialogActions sx={{justifyContent: 'center'}}>
          <Button variant='outlined' onClick={handleOpenEndCollate2}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openSummaryGuide}
        onClose={handleCloseSummaryGuide}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Guía de Remisión Conglomerada'}
        </DialogTitle>
        {listDistribution &&
        listDistribution.length > 0 &&
        listDistribution[indexDistributionSelected] &&
        listDistribution[indexDistributionSelected].deliveries.length > 0 ? (
          <DialogActions sx={{justifyContent: 'center'}}>
            <Button variant='outlined' onClick={sendQuerySummaryGuide}>
              Dirigirse
            </Button>
          </DialogActions>
        ) : (
          <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
            <CircularProgress disableShrink />
          </DialogContent>
        )}
      </Dialog>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        fullWidth
        maxWidth='x1'
      >
        {typeDialog == 'viewDetail' ? (
          <>
            <DialogTitle
              sx={{fontSize: '1.5em', display: 'flex', alignItems: 'center'}}
              id='alert-dialog-title'
            >
              <Stack
                sx={{m: 2, justifyContent: 'center', marginBottom: '10px'}}
                direction={isMobile ? 'column' : 'row'}
                spacing={2}
              >
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() =>
                    showObject(
                      listDistribution[indexDistributionSelected]
                        .deliveryDistributionId,
                      'distribution',
                    )
                  }
                  disabled={
                    !(
                      listDistribution[indexDistributionSelected] &&
                      listDistribution[indexDistributionSelected].deliveries
                        .length > 0
                    )
                  }
                >
                  <ArrowForwardIcon />
                  <div style={{marginLeft: '5px'}}>GUÍAS</div>
                </Button>
                {listDistribution[indexDistributionSelected].folderMovement ? (
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() =>
                      goToFiles(
                        listDistribution[indexDistributionSelected]
                          .folderMovement
                          ? listDistribution[indexDistributionSelected]
                              .folderMovement
                          : `distributions/${listDistribution[indexDistributionSelected].routeName}-${listDistribution[indexDistributionSelected].deliveryDistributionId}`,
                      )
                    }
                    sx={{ml: 5}}
                  >
                    <FolderOutlinedIcon />
                    <div style={{marginLeft: '5px'}}>Archivos</div>
                  </Button>
                ) : null}
                <Typography sx={{ml: 5, fontSize: 20}}>
                  Puntos de entrega
                </Typography>
              </Stack>
            </DialogTitle>
            <DialogContent>
              {/* <Stack
                sx={{ m: 2 }}
                direction={isMobile ? 'column' : 'row'}
                spacing={2}
                className={classes.stack}
              >
                <TextField
                  label='Observación'
                  variant='outlined'
                  name='searchObservation'
                  size='small'
                  onChange={handleSearchValues}
                />
                <Button
                  startIcon={<ManageSearchOutlinedIcon />}
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    const detail = listDistribution[
                      indexDistributionSelected
                    ].deliveries.filter((obj) =>
                      obj.observationDelivery
                        .toLowerCase()
                        .includes(searchObservation.toLowerCase()),
                    )
                    setListDeliveryDetail(detail)
                  }
                  }
                >
                  Buscar
                </Button>
              </Stack> */}
              <TextField
                sx={{m: 2}}
                label='Observación'
                variant='outlined'
                name='searchObservation'
                size='small'
                onChange={handleSearchValues}
              />
              <TableContainer component={Paper} sx={{maxHeight: 440}}>
                <Table stickyHeader size='small' aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableCell>Serie-Número</TableCell>
                      <TableCell>Estado Guía Sunat</TableCell>
                      <TableCell>Dirección de punto de partida</TableCell>
                      <TableCell>Ubigeo de punto de partida</TableCell>
                      <TableCell>CodInterno de punto de partida</TableCell>
                      <TableCell>Dirección de punto de llegada</TableCell>
                      <TableCell>Ubigeo de punto de llegada</TableCell>
                      <TableCell>CodInterno de punto de llegada</TableCell>
                      <TableCell>Documento de conductor</TableCell>
                      <TableCell>Nombre de conductor</TableCell>
                      <TableCell>Apellidos de conductor</TableCell>
                      <TableCell>Licencia de conductor</TableCell>
                      <TableCell>Placa del vehículo</TableCell>
                      <TableCell>Productos</TableCell>
                      <TableCell>Observaciones</TableCell>
                      <TableCell>Peso total</TableCell>
                      <TableCell>Número de paquetes</TableCell>
                      <TableCell>Fecha de Entrega</TableCell>

                      {/* <TableCell></TableCell> */}
                    </TableRow>
                  </TableHead>
                  {/* {JSON.stringify(listDistribution[indexDistributionSelected].deliveries)} */}
                  <TableBody>
                    {listDistribution[indexDistributionSelected] &&
                    listDistribution[indexDistributionSelected].deliveries
                      .length > 0 ? (
                      listDistribution[indexDistributionSelected].deliveries
                        .filter((obj) =>
                          String(obj.observationDelivery || '')
                            .toLowerCase()
                            .includes(searchObservation.toLowerCase()),
                        )
                        .map((deliveryItem, index) => {
                          const products = deliveryItem.productsInfo;
                          return (
                            <>
                              <TableRow
                                sx={{
                                  '&:last-child td, &:last-child th': {
                                    border: 0,
                                  },
                                }}
                                key={`points-located-${index}`}
                              >
                                {/* <TableCell>{deliveryItem.serialNumber}</TableCell> */}
                                <TableCell>
                                  {deliveryItem.serialNumber}
                                </TableCell>
                                <TableCell align='center'>
                                  {showIconStatus(
                                    deliveryItem.generateReferralGuide,
                                    deliveryItem,
                                  )}
                                </TableCell>
                                <TableCell>
                                  {deliveryItem.startingPointAddress}
                                </TableCell>
                                <TableCell>
                                  {deliveryItem.startingPointUbigeo}
                                </TableCell>
                                <TableCell>
                                  {deliveryItem.startingInternalCode || ''}
                                </TableCell>
                                <TableCell>
                                  {deliveryItem.arrivalPointAddress}
                                </TableCell>
                                <TableCell>
                                  {deliveryItem.arrivalPointUbigeo}
                                </TableCell>
                                <TableCell>
                                  {deliveryItem.arrivalInternalCode || ''}
                                </TableCell>
                                <TableCell>
                                  {deliveryItem.driverDocumentType &&
                                  deliveryItem.driverDocumentNumber
                                    ? `${deliveryItem.driverDocumentType.toUpperCase()} - ${
                                        deliveryItem.driverDocumentNumber
                                      }`
                                    : null}
                                </TableCell>
                                <TableCell>
                                  {deliveryItem.driverDenomination}
                                </TableCell>
                                <TableCell>
                                  {deliveryItem.driverLastName}
                                </TableCell>
                                <TableCell>
                                  {deliveryItem.driverLicenseNumber}
                                </TableCell>
                                <TableCell>
                                  {deliveryItem.carrierPlateNumber}
                                </TableCell>
                                <TableCell>
                                  {products && products.length !== 0 ? (
                                    <IconButton
                                      onClick={() =>
                                        checkProducts(deliveryItem, index)
                                      }
                                      size='small'
                                    >
                                      <FormatListBulletedIcon fontSize='small' />
                                    </IconButton>
                                  ) : null}
                                </TableCell>
                                <TableCell>
                                  {deliveryItem.observationDelivery}
                                </TableCell>
                                <TableCell>
                                  {Number.parseFloat(
                                    deliveryItem.totalGrossWeight,
                                  ).toFixed(3)}
                                </TableCell>
                                <TableCell>
                                  {deliveryItem.numberOfPackages}
                                </TableCell>
                                <TableCell>
                                  {deliveryItem.transferStartDate}
                                </TableCell>
                              </TableRow>

                              <TableRow key={`sub-${index}`}>
                                <TableCell sx={{p: 0}} colSpan={10}>
                                  <Collapse
                                    in={openProducts && index === rowNumber2}
                                    timeout='auto'
                                    unmountOnExit
                                  >
                                    <Box sx={{margin: 0}}>
                                      <Table
                                        size='small'
                                        aria-label='purchases'
                                      >
                                        <TableHead
                                          sx={{
                                            backgroundColor: '#ededed',
                                          }}
                                        >
                                          <TableRow>
                                            <TableCell>Código</TableCell>
                                            <TableCell>Descripción</TableCell>
                                            <TableCell>Cantidad</TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {products && products.length !== 0
                                            ? products.map(
                                                (product, index3) => {
                                                  return (
                                                    <TableRow
                                                      key={`${index3}-${index3}`}
                                                    >
                                                      <TableCell>
                                                        {product.businessProductCode !=
                                                        null
                                                          ? product.businessProductCode
                                                          : product.product}
                                                      </TableCell>
                                                      <TableCell>
                                                        {product.description}
                                                      </TableCell>
                                                      <TableCell>
                                                        {
                                                          product.quantityMovement
                                                        }
                                                      </TableCell>
                                                    </TableRow>
                                                  );
                                                },
                                              )
                                            : null}
                                        </TableBody>
                                      </Table>
                                    </Box>
                                  </Collapse>
                                </TableCell>
                              </TableRow>
                            </>
                          );
                        })
                    ) : (
                      <CircularProgress
                        disableShrink
                        sx={{m: '10px', position: 'relative'}}
                      />
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
          </>
        ) : null}
      </Dialog>
      <Dialog
        open={openSummary}
        onClose={() => setOpenSummary(false)}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle
          sx={{
            fontSize: '1.5em',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack
            sx={{m: 2, justifyContent: 'center', marginBottom: '10px'}}
            direction={isMobile ? 'column' : 'row'}
            spacing={2}
          >
            <FormControl sx={{my: 0, mx: 'auto', width: 160}}>
              <InputLabel id='summary-label' style={{fontWeight: 200}}>
                Tipo Resumen
              </InputLabel>
              <Select
                name='summary'
                labelId='summary-label'
                label='Tipo Resumen'
                onChange={(event) => {
                  console.log(event.target.value);
                  setSummaryType(event.target.value);
                }}
                value={summaryType}
              >
                <MenuItem value='driver' style={{fontWeight: 200}}>
                  Chofer
                </MenuItem>
                <MenuItem value='all' style={{fontWeight: 200}}>
                  Todo
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              label='Nombre Agrupador'
              value={nombreAgrupador}
              onChange={(e) => setNombreAgrupador(e.target.value)}
              variant='outlined'
            />
            <TextField
              label='Cantidad Agrupación'
              value={cantidadAgrupacion}
              onChange={(e) => setCantidadAgrupacion(e.target.value)}
              variant='outlined'
            />
            <IconButton
              sx={{
                mt: 1,
                '& svg': {
                  height: 35,
                  width: 35,
                },
                color: 'text.secondary',
              }}
              edge='end'
              color='inherit'
              aria-label='open drawer'
              onClick={exportToExcel}
            >
              <ExcelIcon />
            </IconButton>
          </Stack>

          <IconButton
            edge='end'
            onClick={() => setOpenSummary(false)}
            aria-label='close'
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        {summaryType == 'driver' ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Chofer</TableCell>
                <TableCell>Placa</TableCell>
                <TableCell>Productos</TableCell>
                <TableCell>Puntos de Partida - Llegada</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listDistribution &&
              listDistribution[indexDistributionSelected] &&
              listDistribution[indexDistributionSelected].deliveries.length > 0
                ? acumularProductosPorConductor(
                    listDistribution[indexDistributionSelected].deliveries,
                  ).map((fila, indexSummary) => {
                    const summaryProducts = fila.productsInfo;
                    const summaryPoints = fila.points;
                    return (
                      <>
                        <TableRow key={indexSummary}>
                          <TableCell>
                            {fila.driverDenomination +
                              ' ' +
                              fila.driverLastName}
                          </TableCell>
                          <TableCell>{fila.carrierPlateNumber}</TableCell>
                          <TableCell>
                            {fila.productsInfo &&
                            fila.productsInfo.length !== 0 ? (
                              <IconButton
                                onClick={() =>
                                  checkSummaryProducts(fila, indexSummary)
                                }
                                size='small'
                              >
                                <FormatListBulletedIcon fontSize='small' />
                              </IconButton>
                            ) : null}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() =>
                                checkSummaryPoints(fila, indexSummary)
                              }
                              size='small'
                            >
                              <FormatListBulletedIcon fontSize='small' />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        <TableRow key={`sub-${indexSummary}`}>
                          <TableCell sx={{p: 0}} colSpan={10}>
                            <Collapse
                              in={
                                openSummaryProducts &&
                                indexSummary === summaryRowNumber
                              }
                              timeout='auto'
                              unmountOnExit
                            >
                              <Box sx={{margin: 0}}>
                                <Table size='small' aria-label='purchases'>
                                  <TableHead
                                    sx={{
                                      backgroundColor: '#ededed',
                                    }}
                                  >
                                    <TableRow>
                                      <TableCell>Código</TableCell>
                                      <TableCell>Descripción</TableCell>
                                      <TableCell>Cantidad</TableCell>
                                      <TableCell>Peso Unitario</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {summaryProducts &&
                                    summaryProducts.length !== 0
                                      ? summaryProducts.map(
                                          (product, indexSummaryProducts) => {
                                            return (
                                              <TableRow
                                                key={`${indexSummaryProducts}-${indexSummaryProducts}`}
                                              >
                                                <TableCell>
                                                  {product.product}
                                                </TableCell>
                                                <TableCell>
                                                  {product.description}
                                                </TableCell>
                                                <TableCell>
                                                  {product.quantityMovement}
                                                </TableCell>
                                                <TableCell>
                                                  {product.weight}
                                                </TableCell>
                                              </TableRow>
                                            );
                                          },
                                        )
                                      : null}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                        <TableRow key={`sub-${indexSummary}-2`}>
                          <TableCell sx={{p: 0}} colSpan={10}>
                            <Collapse
                              in={
                                openSummaryPoints &&
                                indexSummary === summaryRowNumber
                              }
                              timeout='auto'
                              unmountOnExit
                            >
                              <Box sx={{margin: 0}}>
                                <Table size='small' aria-label='purchases'>
                                  <TableHead
                                    sx={{
                                      backgroundColor: '#ededed',
                                    }}
                                  >
                                    <TableRow>
                                      <TableCell>Punto Partida</TableCell>
                                      <TableCell>Direccion Partida</TableCell>
                                      <TableCell>Punto Llegada</TableCell>
                                      <TableCell>Direccion Llegada</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {summaryPoints && summaryPoints.length !== 0
                                      ? summaryPoints.map(
                                          (point, indexSummaryPoints) => {
                                            return (
                                              <TableRow
                                                key={`${indexSummaryPoints}-${indexSummaryPoints}`}
                                              >
                                                <TableCell>
                                                  {point.startingInternalCode}
                                                </TableCell>
                                                <TableCell>
                                                  {point.startingPointAddress}
                                                </TableCell>
                                                <TableCell>
                                                  {point.arrivalInternalCode}
                                                </TableCell>
                                                <TableCell>
                                                  {point.arrivalPointAddress}
                                                </TableCell>
                                              </TableRow>
                                            );
                                          },
                                        )
                                      : null}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })
                : null}
            </TableBody>
          </Table>
        ) : null}
        {summaryType == 'all' ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Descripcion</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Peso</TableCell>
                <TableCell>Peso Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listDistribution &&
              listDistribution[indexDistributionSelected] &&
              listDistribution[indexDistributionSelected].deliveries.length > 0
                ? acumularProductos(
                    listDistribution[indexDistributionSelected].deliveries,
                  ).map((fila, indexSummary) => {
                    return (
                      <>
                        <TableRow key={`finances-${indexSummary}`}>
                          <TableCell>{fila.product}</TableCell>
                          <TableCell>{fila.description}</TableCell>
                          <TableCell>{fila.quantityMovement}</TableCell>
                          <TableCell>{fila.weight}</TableCell>
                          <TableCell>
                            {Number(
                              fila.quantityMovement * fila.weight,
                            ).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })
                : null}
            </TableBody>
          </Table>
        ) : null}
      </Dialog>
    </Card>
  );
};

export default FinancesTable;
