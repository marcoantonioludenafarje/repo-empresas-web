import React, {useEffect, useRef} from 'react';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import originalUbigeos from '../../../Utils/ubigeo.json';
import {makeStyles} from '@mui/styles';

import {
  ButtonGroup,
  Card,
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  Collapse,
  Alert,
} from '@mui/material';
import Router, {useRouter} from 'next/router';
import {ClickAwayListener} from '@mui/base';

import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import AppLowerCaseTextField from '../../../@crema/core/AppFormComponents/AppLowerCaseTextField';
import AppUpperCaseTextField from '../../../@crema/core/AppFormComponents/AppUpperCaseTextField';
import {useDispatch, useSelector} from 'react-redux';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CachedIcon from '@mui/icons-material/Cached';
import SchoolIcon from '@mui/icons-material/School';
import {DesktopDatePicker, DateTimePicker} from '@mui/lab';
import {
  parseToGoodDate,
  isObjEmpty,
  convertToDateWithoutTime,
  specialFormatToSunat,
  dateWithHyphen,
  strDateToDateObject,
} from '../../../Utils/utils';
import SelectedProducts from './SelectedProducts';
import SelectCarrier from './SelectCarrier';
import SelectDriver from './SelectDriver';
import SelectLocation from './SelectLocation';
import {getCarriers} from '../../../redux/actions/Carriers';
import {getLocations} from '../../../redux/actions/Locations';
import {getDrivers} from '../../../redux/actions/Drivers';
import {getUbigeos} from '../../../redux/actions/General';
import {
  getMovements,
  getOutputItems_pageListOutput,
  updateReferralGuideValue,
  addReferrealGuide,
  previsualizeReferralGuide,
} from '../../../redux/actions/Movements';
import {onGetBusinessParameter} from '../../../redux/actions/General';
import {red} from '@mui/material/colors';
import {orange} from '@mui/material/colors';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  ADD_REFERRAL_GUIDE,
  GET_MOVEMENTS,
  GET_BUSINESS_PARAMETER,
  ROUTE_TO_REFERRAL_GUIDE,
  UPDATE_GENERATE_REFERRAL_GUIDE_VALUE,
} from '../../../shared/constants/ActionTypes';
import AddProductForm from './AddProductForm';
import AddClientForm from '../ClientSelection/AddClientForm';

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
}));
const validationSchema = yup.object({
  startingPoint: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />),
  arrivalPoint: yup
    .string()
    .required(<IntlMessages id='validation.required' />)
    .typeError(<IntlMessages id='validation.string' />),
  licensePlate: yup
    .string()
    .required(<IntlMessages id='validation.required' />)
    .typeError(<IntlMessages id='validation.string' />),
  driverName: yup
    .string()
    .required(<IntlMessages id='validation.required' />)
    .typeError(<IntlMessages id='validation.string' />),
  driverLastName: yup
    .string()
    .required(<IntlMessages id='validation.required' />)
    .typeError(<IntlMessages id='validation.string' />),
  totalWeight: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .required(<IntlMessages id='validation.required' />)
    .test(
      'maxDigitsAfterDecimal',
      'El número puede contener como máximo 3 decimales',
      (number) => /^\d+(\.\d{1,3})?$/.test(number),
    ),
  numberPackages: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .required(<IntlMessages id='validation.required' />)
    .integer(<IntlMessages id='validation.number.integer' />),
  driverLicenseNumber: yup
    .string()
    .required(<IntlMessages id='validation.required' />)
    .typeError(<IntlMessages id='validation.string' />),
  driverDocumentNumber: yup
    .number()
    .typeError(<IntlMessages id='validation.number' />)
    .required(<IntlMessages id='validation.required' />)
    .integer(<IntlMessages id='validation.number.integer' />),
  observation: yup.string().typeError(<IntlMessages id='validation.string' />),
  clientEmail: yup
    .string()
    .email(<IntlMessages id='validation.emailFormat' />)
    .required(<IntlMessages id='validation.required' />),
});

const objectsAreEqual = (a, b) => {
  // Comprobar si los dos valores son objetos
  if (typeof a === 'object' && typeof b === 'object') {
    // Comprobar si los objetos tienen las mismas propiedades
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) {
      return false;
    }
    // Comparar el valor de cada propiedad de forma recursiva
    for (const key of aKeys) {
      if (!objectsAreEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }
  // Comparar los valores directamente
  return a === b;
};

const useForceUpdate = () => {
  const [reload, setReload] = React.useState(0); // integer state
  return () => setReload((value) => value + 1); // update the state to force render
};
let parsedUbigeos = [];
let getValueField;
const GetReferralGuide = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {query} = router;

  const classes = useStyles(props);
  let canvasRef = useRef(null);
  console.log('query', query);
  const forceUpdate = useForceUpdate();
  const [issueDate, setIssueDate] = React.useState(Date.now());
  const [dateStartTransfer, setDateStartTransfer] = React.useState(Date.now());
  const [selectedProducts, setSelectedProducts] = React.useState([]);
  const [selectedOutput, setSelectedOutput] = React.useState('');
  const [totalWeight, setTotalWeight] = React.useState(0);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [typeDialog, setTypeDialog] = React.useState('');
  const [transportModeVal, setTransportModeVal] = React.useState(
    'privateTransportation',
  );

  const [scale, setScale] = React.useState(1.0);
  const [urlPdf, setUrlPdf] = React.useState('');
  const [reasonVal, setReasonVal] = React.useState('sale');
  const [sendClient, setSendClient] = React.useState(false);
  const [sendSunat, setSendSunat] = React.useState(false);
  const [driverDocumentType, setDriverDocumentType] = React.useState('DNI');
  const [ubigeoStartingPoint, setUbigeoStartingPoint] = React.useState(0);
  const [existStartingUbigeo, setExistStartingUbigeo] = React.useState(true);
  const [selectedStartingUbigeo, setSelectedStartingUbigeo] = React.useState(
    {},
  );
  const [selectedStartingLocation, setSelectedStartingLocation] =
    React.useState({});
  const [selectedArrivalLocation, setSelectedArrivalLocation] = React.useState(
    {},
  );
  const [internalLocations, setInternalLocations] = React.useState([]);
  const [selectedDeliveryState, setSelectedDeliveryState] = React.useState('');
  const [ubigeoArrivalPoint, setUbigeoArrivalPoint] = React.useState(0);
  const [existArrivalUbigeo, setExistArrivalUbigeo] = React.useState(true);
  const [selectedArrivalUbigeo, setSelectedArrivalUbigeo] = React.useState({});
  const [selectedCarrier, setSelectedCarrier] = React.useState({});
  const [selectedDriver, setSelectedDriver] = React.useState({});
  const [selectedAddressee, setSelectedAddressee] = React.useState('');
  const [existCarrier, setExistCarrier] = React.useState(false);
  const [showForms, setShowForms] = React.useState(false);
  const [openAddProduct, setOpenAddProduct] = React.useState(false);
  const [serial, setSerial] = React.useState('');
  const [changeGenerateRG, setChangeGenerateRG] = React.useState(false);
  const [dataFinal, setDataFinal] = React.useState({});
  const [minTutorial, setMinTutorial] = React.useState(false);
  const [basicUrl, setBasicUrl] = React.useState('');
  const [openPrevisualizer, setOpenPrevisualizer] = React.useState(false);
  //PDF
  const [pdfScale, setPdfScale] = React.useState('100');
  const [weightFields, setWeightFields] = React.useState(true);
  const [complianceSeal, setComplianceSeal] = React.useState(false);
  const [complianceSealOnlySign, setComplianceSealOnlySign] =
    React.useState(false);
  let changeValueField;

  const {listDistribution} = useSelector(({movements}) => movements);
  console.log('listDistribution', listDistribution);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);
  const {addReferralGuideRes} = useSelector(({movements}) => movements);
  console.log('addReferralGuideRes', addReferralGuideRes);
  const {outputItems_pageListOutput} = useSelector(({movements}) => movements);
  console.log('outputItems_pageListOutput', outputItems_pageListOutput);
  const {businessParameter} = useSelector(({general}) => general);
  console.log('businessParameter', businessParameter);
  const {successMessage} = useSelector(({movements}) => movements);
  console.log('successMessage', successMessage);
  const {routeToReferralGuide} = useSelector(({movements}) => movements);
  console.log('routeToReferralGuide', routeToReferralGuide);
  const {errorMessage} = useSelector(({movements}) => movements);
  console.log('errorMessage', errorMessage);
  const {getCarriersRes} = useSelector(({carriers}) => carriers);
  console.log('getCarriersRes', getCarriersRes);
  const {updateGenerateReferralGuideRes} = useSelector(
    ({movements}) => movements,
  );
  console.log('updateGenerateReferralGuideRes', updateGenerateReferralGuideRes);
  const {jwtToken} = useSelector(({general}) => general);
  console.log('jwtToken', jwtToken);
  const {getLocationsRes} = useSelector(({locations}) => locations);

  const {previsualizeReferralGuideRes} = useSelector(
    ({movements}) => movements,
  );
  const toGetCarriers = (payload, token) => {
    dispatch(getCarriers(payload, token));
  };
  const toGetLocations = (payload, jwtToken) => {
    dispatch(getLocations(payload, jwtToken));
  };
  const toGetDrivers = (payload, jwtToken) => {
    dispatch(getDrivers(payload, jwtToken));
  };
  const toAddReferrealGuide = (payload, jwtToken) => {
    dispatch(addReferrealGuide(payload, jwtToken));
  };
  const toPrevisualizeReferralGuide = (payload, jwtToken) => {
    dispatch(previsualizeReferralGuide(payload, jwtToken));
  };
  const toGetMovements = (payload) => {
    dispatch(getOutputItems_pageListOutput(payload));
  };
  const getBusinessParameter = (payload) => {
    dispatch(onGetBusinessParameter(payload));
  };
  const updateReferralGuide = (payload, jwtToken) => {
    dispatch(updateReferralGuideValue(payload, jwtToken));
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
  let listPayload = {
    request: {
      payload: {
        initialTime: null,
        finalTime: null,
        businessProductCode: null,
        movementType: 'OUTPUT',
        merchantId: userDataRes.merchantSelected.merchantId,
      },
    },
  };
  let listMovements = {
    request: {
      payload: {
        initialTime: null,
        finalTime: null,
        businessProductCode: null,
        movementType: 'OUTPUT',
        merchantId: userDataRes.merchantSelected.merchantId,
        createdAt: null,
        searchByDocument: null,
        movementHeaderId: null,
        outputId: null,
      },
    },
  };

  useEffect(() => {
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: GET_BUSINESS_PARAMETER, payload: undefined});
    getBusinessParameter(businessParameterPayload);
    let listCarriersPayload = {
      request: {
        payload: {
          typeDocumentCarrier: '',
          numberDocumentCarrier: '',
          denominationCarrier: '',
          merchantId: userDataRes.merchantSelected.merchantId,
          LastEvaluatedKey: null,
          needItems: true,
        },
      },
    };
    let listOutputPayload = {
      request: {
        payload: {
          initialTime: null,
          finalTime: null,
          businessProductCode: null,
          movementType: 'OUTPUT',
          merchantId: userDataRes.merchantSelected.merchantId,
          movementHeaderId: query.movementHeaderId,
        },
      },
    };
    toGetMovements(listOutputPayload);
    toGetCarriers(listCarriersPayload, jwtToken);
    let listLocationsPayload = {
      request: {
        payload: {
          locationName: '',
          type: '',
          ubigeo: '',
          merchantId: userDataRes.merchantSelected.merchantId,
          modularCode: '',
          LastEvaluatedKey: null,
          needItems: true,
        },
      },
    };
    toGetLocations(listLocationsPayload, jwtToken);
    let listDriversPayload = {
      request: {
        payload: {
          typeDocumentDriver: '',
          numberDocumentDriver: '',
          fullName: '',
          merchantId: userDataRes.merchantSelected.merchantId,
          LastEvaluatedKey: null,
          needItems: true,
        },
      },
    };
    toGetDrivers(listDriversPayload, jwtToken);
    originalUbigeos.map((obj, index) => {
      parsedUbigeos[index] = {
        label: `${obj.descripcion} - ${obj.ubigeo}`,
        ...obj,
      };
    });
    console.log('parsedUbigeos', parsedUbigeos);
    setUbigeoStartingPoint(parsedUbigeos[0].ubigeo);
    setSelectedArrivalUbigeo(parsedUbigeos[0]);
    setSelectedStartingUbigeo(parsedUbigeos[0]);
    setUbigeoArrivalPoint(parsedUbigeos[0].ubigeo);
    console.log('parsedUbigeos[0]', parsedUbigeos[0]);
    let domain = new URL(window.location.href);
    setBasicUrl(domain.origin);
    const selfCarrier = {
      nameContact: userDataRes.merchantSelected.denominationMerchant,
      typeDocumentCarrier: userDataRes.merchantSelected.typeDocumentMerchant,
      extraInformationCarrier: 'Info para Guía',
      emailContact: userDataRes.merchantSelected.emailAdminUserId,
      carrierId: `${userDataRes.merchantSelected.typeDocumentMerchant}-${
        userDataRes.merchantSelected.numberDocumentMerchant
      }-${String(userDataRes.merchantSelected.denominationMerchant)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '')}-${userDataRes.merchantSelected.merchantId}`,
      addressCarrier: userDataRes.merchantSelected.addressMerchant,
      numberContact: '51994683152',
      emailCarrier: userDataRes.merchantSelected.emailAdminUserId,
      numberDocumentCarrier:
        userDataRes.merchantSelected.numberDocumentMerchant,
      denominationCarrier: userDataRes.merchantSelected.denominationMerchant,
      merchantId: userDataRes.merchantSelected.merchantId,
    };
    setSelectedCarrier(selfCarrier);
    setExistCarrier(true);
    setTimeout(() => {
      setMinTutorial(true);
    }, 2000);
  }, []);
  useEffect(() => {
    if (previsualizeReferralGuideRes && previsualizeReferralGuideRes.url) {
      setUrlPdf(previsualizeReferralGuideRes.url);
    }
  }, [previsualizeReferralGuideRes]);

  useEffect(() => {
    console.log('openPrevisualizer', openPrevisualizer);
    console.log('urlPdf', urlPdf);
    console.log('canvasRef', canvasRef);
    setTimeout(() => {
      if (openPrevisualizer && urlPdf && canvasRef.current) {
        console.log('hola urlPdf');
        const canvas = canvasRef.current;
        const canvasContext = canvas.getContext('2d');

        const renderCanvas = async () => {
          const pdfJS = await import('pdfjs-dist/build/pdf');
          pdfJS.GlobalWorkerOptions.workerSrc =
            window.location.origin + '/pdf.worker.min.js';
          // const buffer = Uint8Array.from(atob(pdfBase64), (c) => c.charCodeAt(0));
          // const pdf = await pdfJS.getDocument(buffer).promise;
          const pdf = await pdfJS.getDocument(urlPdf).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({scale});

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {canvasContext, viewport};
          page.render(renderContext);
        };

        renderCanvas();
      }
    }, 500);
  }, [urlPdf, canvasRef, openPrevisualizer]);
  useEffect(() => {
    if (getLocationsRes && getLocationsRes.length > 0) {
      console.log('locaciones internas', getLocationsRes);
      const internalLocationsMin = getLocationsRes
        .map((obj) => {
          obj.label = obj.locationName;
          return obj;
        })
        .sort((a, b) => {
          if (a.locationName > b.locationName) {
            return -1;
          }
          if (a.locationName < b.locationName) {
            return 1;
          }
          return 0;
        });
      setInternalLocations(internalLocationsMin);
      setSelectedStartingLocation({
        locationId: '',
        label: '',
        ubigeo: '',
        value: '',
      });
      setSelectedArrivalLocation({
        locationId: '',
        label: '',
        ubigeo: '',
        value: '',
      });
    }
  }, [getLocationsRes]);

  useEffect(() => {
    if (businessParameter != undefined) {
      let serieParameter = businessParameter.find(
        (obj) => obj.abreParametro == 'SERIES_REFERRAL_GUIDE',
      );
      console.log('serieParameter', serieParameter);
      console.log('serieParameter.metadata', serieParameter.metadata);
      setSerial(serieParameter.metadata ? serieParameter.metadata : '');

      let referralGuideParameter = businessParameter.find(
        (obj) => obj.abreParametro == 'SERIES_REFERRAL_GUIDE',
      );
      if (referralGuideParameter.weightFields == false) {
        setWeightFields(false);
      } else {
        setWeightFields(true);
      }
      if (referralGuideParameter.complianceSeal == false) {
        setComplianceSeal(false);
      } else {
        setComplianceSeal(true);
      }
      if (referralGuideParameter.complianceSealOnlySign == false) {
        setComplianceSealOnlySign(false);
      } else {
        setComplianceSealOnlySign(true);
      }
      if (referralGuideParameter.pdfScale) {
        setPdfScale(referralGuideParameter.pdfScale);
      } else {
        setPdfScale('100');
      }
    }
  }, [businessParameter]);

  const queryDistribution = () => {
    return (
      'useLocaleRoute' in query &&
      query.useLocaleRoute == 'true' &&
      routeToReferralGuide
    );
  };
  useEffect(() => {
    if (query.type == 'summaryGuideSinceDistribution') {
      const selectedDistribution = listDistribution.find(
        (obj) => obj.deliveryDistributionId == query.deliveryDistributionId,
      );
      const selectedDelivery = selectedDistribution.deliveries[0];
      setSelectedDeliveryState(selectedDelivery);
      const date = selectedDelivery.transferStartDate;
      const dateTranslate = strDateToDateObject(date);
      console.log('date', dateTranslate);
      setDateStartTransfer(dateTranslate);

      // let startingUbigeo = parsedUbigeos.find(
      //   (ubigeo) => ubigeo.ubigeo == selectedDelivery.startingPointUbigeo,
      // );
      // let arrivalUbigeo = parsedUbigeos.find(
      //   (ubigeo) => ubigeo.ubigeo == selectedDelivery.arrivalPointUbigeo,
      // );
      // setUbigeoStartingPoint(startingUbigeo.ubigeo);
      // setUbigeoArrivalPoint(arrivalUbigeo.ubigeo);
      // setExistArrivalUbigeo(true);
      // setSelectedStartingUbigeo(startingUbigeo);
      // setSelectedArrivalUbigeo(arrivalUbigeo);
      // setExistStartingUbigeo(true);
      // changeValueField('startingPoint', selectedDelivery.startingPointAddress);
      // changeValueField('arrivalPoint', selectedDelivery.arrivalPointAddress);
      const acumularProductos = (entregas) => {
        const acumulador = {};
        let totalWeightSummary = 0;
        let numberOfPackages = 0;

        entregas.forEach((entrega) => {
          if (
            !query.driversSelected ||
            query.driversSelected.some(
              (item) => Number(item) === Number(entrega.driverDocumentNumber),
            )
          ) {
            numberOfPackages += Number(entrega.numberOfPackages);
            console.log('entrega2', entrega);
            entrega.productsInfo.forEach((producto) => {
              const productoKey = producto.product;
              totalWeightSummary +=
                Number(producto.weight) * producto.quantityMovement;
              if (!acumulador[productoKey]) {
                acumulador[productoKey] = {
                  product: producto.product,
                  count: producto.quantityMovement,
                  description: producto.description,
                  weight: Number(producto.weight),
                  unitMeasure: producto.unitMeasure,
                  quantityMovement: producto.quantityMovement,
                };
              } else {
                acumulador[productoKey].count += producto.quantityMovement;
                acumulador[productoKey].quantityMovement +=
                  producto.quantityMovement;
              }
            });
          }
        });
        return {
          items: Object.values(acumulador),
          totalWeightSummary: totalWeightSummary,
          numberOfPackages: numberOfPackages,
        };
      };
      const products = acumularProductos(selectedDistribution.deliveries);
      changeValueField(
        'totalWeight',
        Number(products.totalWeightSummary).toFixed(2),
      );
      changeValueField('numberPackages', products.numberOfPackages);
      setTransportModeVal(selectedDistribution.typeOfTransport);
      setReasonVal(selectedDistribution.reasonForTransfer);

      setSelectedProducts(products.items);
      console.log('productos a pasar', products.items);

      // const carrier = {
      //   typeDocumentCarrier: selectedDelivery.carrierDocumentType,
      //   carrierDocumentNumber: selectedDelivery.carrierDocumentNumber,
      //   denominationCarrier: selectedDelivery.carrierDenomination,
      // };
      // setSelectedCarrier(carrier);
      // setExistCarrier(true);
      // changeValueField('addressee', selectedDelivery.carrierDenomination);
      // changeValueField('licensePlate', selectedDelivery.carrierPlateNumber);
      // changeValueField('driverName', selectedDelivery.driverDenomination);
      // changeValueField(
      //   'driverLastName',
      //   selectedDelivery.driverLastName ? selectedDelivery.driverLastName : '',
      // );
      // if (
      //   selectedDelivery.carrierDocumentType &&
      //   typeof selectedDelivery.carrierDocumentType === 'string'
      // ) {
      //   setDriverDocumentType(
      //     selectedDelivery.driverDocumentType.toString().toUpperCase(),
      //   );
      // }
      // changeValueField(
      //   'driverDocumentNumber',
      //   selectedDelivery.driverDocumentNumber,
      // );
      // changeValueField(
      //   'driverLicenseNumber',
      //   selectedDelivery.driverLicenseNumber
      //     ? selectedDelivery.driverLicenseNumber
      //     : '',
      // );
      changeValueField('observation', selectedDistribution.observation);
    }
  }, [query]);
  useEffect(() => {
    if (query.movementHeaderId) {
      if (
        outputItems_pageListOutput === undefined ||
        !Array.isArray(outputItems_pageListOutput) ||
        outputItems_pageListOutput.length < 1
      ) {
        toGetMovements(listMovements);
      }
      if (
        outputItems_pageListOutput &&
        outputItems_pageListOutput.length !== 0
      ) {
        let weight = 0;
        let output = outputItems_pageListOutput.find(
          (obj) => obj.movementHeaderId == query.movementHeaderId,
        );
        console.log('output', output);
        setSelectedOutput(output);
        if (
          !('useLocaleRoute' in query) &&
          query.type !== 'summaryGuideSinceDistribution'
        ) {
          console.log(
            'output.descriptionProductsInfo',
            output.descriptionProductsInfo,
          );
          setSelectedProducts(output.descriptionProductsInfo);
          output.descriptionProductsInfo.map((obj) => {
            weight += obj.weight * obj.quantityMovement;
          });
          console.log('weight', weight);

          setTotalWeight(Number(weight.toFixed(3)));
          changeValueField('totalWeight', Number(weight.toFixed(3)));
          changeValueField('addressee', output.clientName);
          changeValueField('clientEmail', output.clientEmail);
        } else if (queryDistribution()) {
          const date = routeToReferralGuide.transferStartDate;
          const dateTranslate = strDateToDateObject(date);
          console.log('date', dateTranslate);
          setDateStartTransfer(dateTranslate);

          let startingUbigeo = parsedUbigeos.find(
            (ubigeo) =>
              ubigeo.ubigeo == routeToReferralGuide.startingPointUbigeo,
          );
          let arrivalUbigeo = parsedUbigeos.find(
            (ubigeo) =>
              ubigeo.ubigeo == routeToReferralGuide.arrivalPointUbigeo,
          );
          setUbigeoStartingPoint(startingUbigeo.ubigeo);
          setUbigeoArrivalPoint(arrivalUbigeo.ubigeo);
          setExistArrivalUbigeo(true);
          setSelectedStartingUbigeo(startingUbigeo);
          setSelectedArrivalUbigeo(arrivalUbigeo);
          setExistStartingUbigeo(true);
          changeValueField(
            'startingPoint',
            routeToReferralGuide.startingPointAddress,
          );
          changeValueField(
            'arrivalPoint',
            routeToReferralGuide.arrivalPointAddress,
          );

          changeValueField(
            'numberPackages',
            routeToReferralGuide.numberOfPackages,
          );
          setTransportModeVal(routeToReferralGuide.typeOfTransport);
          setReasonVal(routeToReferralGuide.reasonForTransfer);

          setSelectedProducts(routeToReferralGuide.productsInfo);
          console.log('productos a pasar', routeToReferralGuide.productsInfo);
          weight = routeToReferralGuide.totalGrossWeight;
          console.log('weight', weight);

          setTotalWeight(Number(weight.toFixed(3)));
          changeValueField('totalWeight', Number(weight.toFixed(3)));
          const carrier = {
            typeDocumentCarrier: routeToReferralGuide.carrierDocumentType,
            carrierDocumentNumber: routeToReferralGuide.carrierDocumentNumber,
            denominationCarrier: routeToReferralGuide.carrierDenomination,
          };
          setSelectedCarrier(carrier);
          setExistCarrier(true);
          changeValueField(
            'addressee',
            routeToReferralGuide.carrierDenomination,
          );
          changeValueField(
            'licensePlate',
            routeToReferralGuide.carrierPlateNumber,
          );
          changeValueField(
            'driverName',
            routeToReferralGuide.driverDenomination,
          );
          changeValueField(
            'driverLastName',
            routeToReferralGuide.driverLastName
              ? routeToReferralGuide.driverLastName
              : '',
          );
          if (
            routeToReferralGuide.carrierDocumentType &&
            typeof routeToReferralGuide.carrierDocumentType === 'string'
          ) {
            setDriverDocumentType(
              routeToReferralGuide.driverDocumentType.toString().toUpperCase(),
            );
          }
          changeValueField(
            'driverDocumentNumber',
            routeToReferralGuide.driverDocumentNumber,
          );
          changeValueField(
            'driverLicenseNumber',
            routeToReferralGuide.driverLicenseNumber
              ? routeToReferralGuide.driverLicenseNumber
              : '',
          );
          changeValueField('observation', routeToReferralGuide.observation);
        }
        /* dispatch({
          type: ROUTE_TO_REFERRAL_GUIDE,
          payload: null,
        }); */
      }
    }
  }, [outputItems_pageListOutput, routeToReferralGuide]);

  useEffect(() => {
    if (successMessage && addReferralGuideRes && changeGenerateRG) {
      dispatch({
        type: UPDATE_GENERATE_REFERRAL_GUIDE_VALUE,
        payload: undefined,
      });
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      console.log('dataFinal', dataFinal);
      routeToReferralGuide.deliveries.find((delivery) => delivery);
      const parsedProducts = dataFinal.productsInfo.map((prod) => {
        return {
          productId: '',
          product: prod.product,
          description: prod.description,
          unitMeasure: prod.unitMeasure,
          quantityMovement: prod.quantityMovement,
          weight: prod.weight,
          businessProductCode: prod.businessProductCode,
        };
      });

      const indexDelivery = routeToReferralGuide.deliveries.findIndex(
        (delivery) =>
          delivery.localRouteId === routeToReferralGuide.localRouteId,
      );
      let changedDelivery = {
        arrivalPointAddress: dataFinal.arrivalPointAddress,
        serialNumber: addReferralGuideRes.serialNumber,
        arrivalPointUbigeo: dataFinal.arrivalPointUbigeo,
        generateReferralGuide: true,
        localRouteId: routeToReferralGuide.localRouteId,
        destination: dataFinal.arrivalPointAddress,
        driverDocumentNumber: dataFinal.driverDocumentNumber,
        driverDenomination: dataFinal.driverDenomination,
        productsInfo: parsedProducts,
        numberOfPackages: dataFinal.numberOfPackages,
        carrierDenomination: dataFinal.carrierDenomination,
        driverDocumentType: dataFinal.driverDocumentType,
        totalGrossWeight: dataFinal.totalGrossWeight,
        referralGuideMovementHeaderId:
          addReferralGuideRes.referralGuideMovementHeaderId,
        driverLicenseNumber: dataFinal.driverLicenseNumber,
        driverId: '',
        carrierPlateNumber: dataFinal.carrierPlateNumber,
        carrierDocumentType: dataFinal.carrierDocumentType,
        transferStartDate: dataFinal.transferStartDate,
        driverLastName: dataFinal.driverLastName,
        carrierDocumentNumber: dataFinal.carrierDocumentNumber,
        startingPointUbigeo: dataFinal.startingPointUbigeo,
        startingPointAddress: dataFinal.startingPointAddress,
      };
      let parsedDeliveries = routeToReferralGuide.deliveries;
      parsedDeliveries[indexDelivery] = changedDelivery;
      let payloadUpdateRF = {
        request: {
          payload: {
            userActor: userAttributes['sub'],
            deliveries: parsedDeliveries,
            deliveryDistributionId: routeToReferralGuide.deliveryDistributionId,
          },
        },
      };
      updateReferralGuide(payloadUpdateRF, jwtToken);
      setChangeGenerateRG(false);
    }
  }, [successMessage, errorMessage, addReferralGuideRes]);

  const defaultValues = {
    nroReferralGuide: 'Autogenerado',
    addressee: '',
    totalWeight: totalWeight,
    reasonDescription: '',
    numberPackages: 1,
    startingPoint: '',
    startingSunatCode: '',
    arrivalPoint: '',
    arrivalSunatCode: '',
    licensePlate: '',
    driverName: '',
    driverLastName: '',
    driverDocumentNumber: '',
    driverLicenseNumber: '',
    observation: '',
    clientEmail: '',
  };

  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    dispatch({type: ADD_REFERRAL_GUIDE, payload: undefined});
    /* dispatch({
      type: ROUTE_TO_REFERRAL_GUIDE,
      payload: undefined,
    }); */
    console.log(
      'existArrivalUbigeo && existStartingUbigeo && existCarrier',
      existArrivalUbigeo,
      existStartingUbigeo,
      existCarrier,
    );
    if (existArrivalUbigeo && existStartingUbigeo && existCarrier) {
      let parsedProducts = [];
      if (selectedProducts.length !== 0) {
        selectedProducts.map((obj) => {
          parsedProducts.push({
            product: obj.product,
            quantityMovement: obj.quantityMovement,
            weight: obj.weight,
            customCodeProduct: obj.customCodeProduct,
            description: obj.description,
            unitMeasure: obj.unitMeasure,
            businessProductCode: obj.businessProductCode,
          });
        });
      }

      let docMoves = [];
      if (
        selectedOutput &&
        selectedOutput.documentsMovement &&
        selectedOutput.documentsMovement.length !== 0
      ) {
        selectedOutput.documentsMovement.map((obj) => {
          docMoves.push({
            issueDate: obj.issueDate,
            typeDocument: obj.typeDocument,
            serialDocument: obj.serialDocument,
          });
        });
      }

      let finalPayload = {
        request: {
          payload: {
            merchantId: userDataRes.merchantSelected.merchantId,
            deliveryDistributionId: routeToReferralGuide
              ? routeToReferralGuide.deliveryDistributionId
              : '',
            movementTypeMerchantId: selectedOutput?.movementTypeMerchantId,
            movementHeaderId: selectedOutput?.movementHeaderId,
            contableMovementId: selectedOutput?.contableMovementId || '',
            createdAt: selectedOutput?.createdAt,
            clientId: selectedOutput
              ? selectedOutput.clientId
              : selectedAddressee.clientId,
            // issueDate: specialFormatToSunat(),
            issueDate: dateWithHyphen(issueDate),
            serial: serial,
            automaticSendSunat: /* sendClient */ true,
            automaticSendClient: /* sendSunat */ true,
            reasonForTransfer: reasonVal,
            totalGrossWeight: data.totalWeight,
            addressee: selectedAddressee,
            type: query.type || '',
            reasonDescription: data.reasonDescription || '',
            numberOfPackages: data.numberPackages,
            typeOfTransport: transportModeVal,
            transferStartDate: dateWithHyphen(dateStartTransfer),
            carrierDocumentType: selectedCarrier.typeDocumentCarrier,
            carrierDocumentNumber: selectedCarrier.carrierId
              ? selectedCarrier.carrierId.split('-')[1]
              : selectedCarrier.carrierDocumentNumber,
            carrierDenomination: selectedCarrier.denominationCarrier,
            carrierId: selectedCarrier.carrierId,
            carrierPlateNumber:
              /* selectedCarrier.plateNumberCarrier */ data.licensePlate,
            driverDocumentType: driverDocumentType.toLowerCase(),
            driverDocumentNumber: data.driverDocumentNumber,
            driverLicenseNumber: data.driverLicenseNumber,
            driverDenomination: data.driverName,
            driverLastName: data.driverLastName,
            startingPointUbigeo: ubigeoStartingPoint.toString(),
            startingPointAddress: data.startingPoint,
            startingSunatCode: data.startingSunatCode,
            startingInternalCode: selectedStartingLocation?.modularCode || '',
            arrivalPointUbigeo: ubigeoArrivalPoint.toString(),
            arrivalPointAddress: data.arrivalPoint,
            arrivalSunatCode: data.arrivalSunatCode,
            observation: data.observation,
            productsInfo: parsedProducts,
            documentsMovement: selectedOutput?.documentsMovement,
            clientEmail: selectedOutput?.clientEmail,
            typePDF: userDataRes.merchantSelected.typeMerchant,
            folderMovement: selectedOutput?.folderMovement,
            denominationMerchant:
              userDataRes.merchantSelected.denominationMerchant,
            weightFields: weightFields,
            complianceSeal: complianceSeal,
            complianceSealOnlySign: complianceSealOnlySign,
            pdfScale: pdfScale,
          },
        },
      };
      console.log('finalPayload', finalPayload);
      setDataFinal(finalPayload.request.payload);
      toAddReferrealGuide(finalPayload, jwtToken);
      console.log('queryDistribution', queryDistribution());
      if (queryDistribution()) {
        setChangeGenerateRG(true);
      }
      setTypeDialog('add');
      setOpenDialog(true);
    }
    setTimeout(() => {
      setSubmitting(false);
    }, 2000);
  };

  const cancel = () => {
    setTypeDialog('confirmCancel');
    setOpenDialog(true);
  };

  const handleZoomIn = () => {
    setScale((prevScale) => prevScale + 0.1);
  };

  const handleZoomOut = () => {
    setScale((prevScale) => prevScale - 0.1);
  };

  const handleResetZoom = () => {
    setScale(1.0);
  };
  const closeDialog = () => {
    if (typeDialog === 'add') {
      /* if (
        !(selectedOutput.existBill && selectedOutput.existReferralGuide) &&
        updateGenerateReferralGuideRes !== undefined &&
        !('error' in updateGenerateReferralGuideRes)
      ) {
        dispatch({type: GET_MOVEMENTS, payload: undefined});
        toGetMovements(listPayload);
        setShowForms(true);
      } else { */
      Router.push('/sample/referral-guide/table');
      /* } */
    }
    setOpenDialog(false);
  };

  const registerSuccess = () => {
    console.log('queryDistribution() 1', queryDistribution());
    if (queryDistribution()) {
      return (
        successMessage != undefined &&
        updateGenerateReferralGuideRes != undefined &&
        (!('error' in updateGenerateReferralGuideRes) ||
          objectsAreEqual(updateGenerateReferralGuideRes.error, {}))
      );
    } else {
      return (
        successMessage != undefined &&
        addReferralGuideRes != undefined &&
        (!('error' in addReferralGuideRes) ||
          objectsAreEqual(addReferralGuideRes.error, {}))
      );
    }
  };
  const registerError = () => {
    console.log('queryDistribution() 1', queryDistribution());
    if (queryDistribution()) {
      return (
        (successMessage != undefined &&
          updateGenerateReferralGuideRes &&
          'error' in updateGenerateReferralGuideRes &&
          !objectsAreEqual(updateGenerateReferralGuideRes.error, {})) ||
        errorMessage
      );
    } else {
      return (
        (successMessage != undefined &&
          addReferralGuideRes &&
          'error' in addReferralGuideRes &&
          !objectsAreEqual(addReferralGuideRes.error, {})) ||
        errorMessage
      );
    }
  };

  const sendStatus = () => {
    if (registerSuccess()) {
      closeDialog();
      setOpenDialog(false);
    } else if (registerError()) {
      setOpenDialog(false);
    } else {
      setOpenDialog(false);
    }
  };

  const showMessage = () => {
    if (registerSuccess()) {
      return (
        <>
          <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
            <CheckCircleOutlineOutlinedIcon
              color='success'
              sx={{fontSize: '6em', mx: 2}}
            />
            <DialogContentText
              sx={{fontSize: '1.2em', m: 'auto'}}
              id='alert-dialog-description'
            >
              Se ha registrado la información <br />
              correctamente
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{justifyContent: 'center'}}>
            <Button variant='outlined' onClick={sendStatus}>
              Aceptar
            </Button>
          </DialogActions>
        </>
      );
    } else if (registerError()) {
      return (
        <>
          <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
            <CancelOutlinedIcon
              sx={{fontSize: '6em', mx: 2, color: red[500]}}
            />
            <DialogContentText
              sx={{fontSize: '1.2em', m: 'auto'}}
              id='alert-dialog-description'
            >
              Se ha producido un error al registrar. <br />
              {addReferralGuideRes !== undefined &&
              'error' in addReferralGuideRes
                ? addReferralGuideRes.error
                : null}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{justifyContent: 'center'}}>
            <Button variant='outlined' onClick={() => setOpenDialog(false)}>
              Aceptar
            </Button>
          </DialogActions>
        </>
      );
    } else {
      return <CircularProgress disableShrink sx={{mx: 'auto', my: '20px'}} />;
    }
  };

  const showCancelMessage = () => {
    return (
      <>
        <PriorityHighIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
        <DialogContentText
          sx={{fontSize: '1.2em', m: 'auto'}}
          id='alert-dialog-description'
        >
          Desea cancelar esta operación?. <br /> Se perderá la información
          ingresada
        </DialogContentText>
      </>
    );
  };

  const showSelectCarrier = () => {
    return <SelectCarrier fcData={saveCarrier} />;
  };
  const showSelectDriver = () => {
    return <SelectDriver fcData={saveDriver} />;
  };
  const showSelectStartingLocation = () => {
    return (
      <SelectLocation fcData={saveStartingLocation} typeLocation='starting' />
    );
  };
  const showSelectArrivalLocation = () => {
    return (
      <SelectLocation fcData={saveArrivalLocation} typeLocation='arrival' />
    );
  };
  const showSelectAddressee = () => {
    return <AddClientForm sendData={saveAddressee} />;
  };
  const handleSendClient = (event, isInputChecked) => {
    setSendClient(isInputChecked);
    console.log('Enviar a cliente', isInputChecked);
  };
  const handleSendSunat = (event, isInputChecked) => {
    setSendSunat(isInputChecked);
    console.log('Enviar a Sunat', isInputChecked);
  };
  const handleDriverDocumentType = (event) => {
    setDriverDocumentType(event.target.value);
    console.log('Tipo de documento conductor', event.target.value);
  };
  const handleClosePrevisualizer = () => {
    setOpenPrevisualizer(false);
  };
  const handleClickAway = () => {
    // Evita que se cierre el diálogo haciendo clic fuera del contenido
    // Puedes agregar condiciones adicionales aquí si deseas una lógica más específica.
  };
  const openSelectCarrier = () => {
    setTypeDialog('selectCarrier');
    setOpenDialog(true);
  };
  const openSelectDriver = () => {
    setTypeDialog('selectDriver');
    setOpenDialog(true);
  };
  const openSelectStartingLocation = () => {
    setTypeDialog('selectStartingLocation');
    setOpenDialog(true);
  };
  const openSelectArrivalLocation = () => {
    setTypeDialog('selectArrivalLocation');
    setOpenDialog(true);
  };
  const openSelectAddressee = () => {
    setTypeDialog('selectAddressee');
    setOpenDialog(true);
  };
  const saveCarrier = (carrier) => {
    setSelectedCarrier(carrier);
    setExistCarrier(true);
    console.log('Transportista', carrier);
    setOpenDialog(false);
  };

  const saveDriver = (driver) => {
    setSelectedDriver(driver);
    changeValueField('driverName', driver.firstName);
    changeValueField('driverLastName', driver.lastName);
    setDriverDocumentType(driver.driverId.split('-')[0]);
    changeValueField('driverDocumentNumber', driver.driverId.split('-')[1]);
    changeValueField('driverLicenseNumber', driver.license);
    console.log('Conductor', driver);
    setOpenDialog(false);
  };
  const saveAddressee = (addressee) => {
    setSelectedAddressee(addressee);
    changeValueField('addressee', addressee.denominationClient);
    setOpenDialog(false);
  };
  const saveStartingLocation = (location) => {
    setSelectedStartingLocation(location);
    setUbigeoStartingPoint(location.ubigeo);
    let selectedUbigeoValue = parsedUbigeos.find(
      (ubigeo) => ubigeo.ubigeo == location.ubigeo,
    );
    changeValueField('startingPoint', location.locationDetail);
    setSelectedStartingUbigeo(selectedUbigeoValue);
    setExistStartingUbigeo(true);
    if (location.sunatEstablishmentCode) {
      changeValueField('startingSunatCode', location.sunatEstablishmentCode);
    }
    console.log('Locación de partida interna', location);
    setOpenDialog(false);
  };
  const saveArrivalLocation = (location) => {
    setSelectedArrivalLocation(location);
    setUbigeoArrivalPoint(location.ubigeo);
    let selectedUbigeoValue = parsedUbigeos.find(
      (ubigeo) => ubigeo.ubigeo == location.ubigeo,
    );
    changeValueField('arrivalPoint', location.locationDetail);
    setSelectedArrivalUbigeo(selectedUbigeoValue);
    setExistArrivalUbigeo(true);
    if (location.sunatEstablishmentCode) {
      changeValueField('arrivalSunatCode', location.sunatEstablishmentCode);
    }
    console.log('Locación de llegada interna', location);
    setOpenDialog(false);
  };
  const searchAProduct = () => {
    setOpenAddProduct(true);
  };
  const getNewProduct = (product) => {
    console.log('ver ahora nuevo producto', product);
    console.log('ver ahora selectedProducts', selectedProducts);
    let newProducts = selectedProducts;
    if (newProducts && newProducts.length >= 1) {
      newProducts.map((obj, index) => {
        console.log('obj', obj);
        if (
          obj.product == product.product &&
          obj.description == product.description &&
          obj.customCodeProduct == product.customCodeProduct
        ) {
          console.log('selectedProducts 1', newProducts);
          newProducts.splice(index, 1);
          console.log('newProducts 2', newProducts);
        }
      });
    }
    newProducts.push(product);
    setSelectedProducts(newProducts);
    calculateWeight(newProducts);
    forceUpdate();
  };

  const calculateWeight = (products) => {
    let weight = 0;
    if (products.length >= 1) {
      products.map((obj) => {
        weight += obj.weight * obj.quantityMovement;
      });
    }
    console.log('weight', weight);
    setTotalWeight(Number(weight.toFixed(3)));
    changeValueField('totalWeight', Number(weight.toFixed(3)));
  };

  const removeProduct = (index) => {
    let newProducts = selectedProducts;
    newProducts.splice(index, 1);
    setSelectedProducts(newProducts);
    calculateWeight(newProducts);
    forceUpdate();
  };

  const changeUnitMeasure = (index, unitMeasure) => {
    console.log('selectedProducts product', selectedProducts[index]);
    console.log('selectedProducts unitMeasure', unitMeasure);
    let newProducts = selectedProducts;
    newProducts[index].unitMeasure = unitMeasure;
    setSelectedProducts(newProducts);
    forceUpdate();
  };
  const changeQuantity = (index, quantity) => {
    console.log('selectedProducts product', selectedProducts[index]);
    console.log('selectedProducts quantity', quantity);
    let newProducts = selectedProducts;
    newProducts[index].quantityMovement = quantity;
    calculateWeight(newProducts);
    forceUpdate();
  };
  const availableUbigeos = () => {
    return (
      parsedUbigeos && Array.isArray(parsedUbigeos) && parsedUbigeos.length >= 1
    );
  };
  const availableLocations = () => {
    return (
      internalLocations &&
      Array.isArray(internalLocations) &&
      internalLocations.length >= 1
    );
  };
  const handleClickUpdateCarrierList = () => {
    //setShowAlert(false);
    let listCarriersPayload = {
      request: {
        payload: {
          typeDocumentCarrier: '',
          numberDocumentCarrier: '',
          denominationCarrier: '',
          merchantId: userDataRes.merchantSelected.merchantId,
          LastEvaluatedKey: null,
          needItems: true,
        },
      },
    };
    toGetCarriers(listCarriersPayload, jwtToken);
    //setOpen(true);
  };
  const handleClickOpenPrevisualizer = () => {
    setOpenPrevisualizer(true);
    setUrlPdf('');
    console.log(
      'existArrivalUbigeo && existStartingUbigeo && existCarrier',
      existArrivalUbigeo,
      existStartingUbigeo,
      existCarrier,
    );
    let parsedProducts = [];
    if (selectedProducts.length !== 0) {
      selectedProducts.map((obj) => {
        parsedProducts.push({
          product: obj.product,
          quantityMovement: obj.quantityMovement,
          weight: obj.weight,
          customCodeProduct: obj.customCodeProduct,
          description: obj.description,
          unitMeasure: obj.unitMeasure,
          businessProductCode: obj.businessProductCode,
        });
      });
    }

    let docMoves = [];
    if (
      selectedOutput &&
      selectedOutput.documentsMovement &&
      selectedOutput.documentsMovement.length !== 0
    ) {
      selectedOutput.documentsMovement.map((obj) => {
        docMoves.push({
          issueDate: obj.issueDate,
          typeDocument: obj.typeDocument,
          serialDocument: obj.serialDocument,
        });
      });
    }

    let previsualizePayload = {
      request: {
        payload: {
          merchantId: userDataRes.merchantSelected.merchantId,
          deliveryDistributionId: routeToReferralGuide
            ? routeToReferralGuide.deliveryDistributionId
            : '',
          movementTypeMerchantId: selectedOutput?.movementTypeMerchantId,
          movementHeaderId: selectedOutput?.movementHeaderId,
          contableMovementId: selectedOutput?.contableMovementId || '',
          createdAt: selectedOutput?.createdAt,
          clientId: selectedOutput
            ? selectedOutput.clientId
            : selectedAddressee.clientId,
          //issueDate: specialFormatToSunat(),
          issueDate: dateWithHyphen(issueDate),
          serial: serial,
          automaticSendSunat: /* sendClient */ true,
          automaticSendClient: /* sendSunat */ true,
          reasonForTransfer: reasonVal,
          totalGrossWeight: getValueField('totalWeight').value,
          addressee: selectedAddressee,
          type: query.type || '',
          reasonDescription: getValueField('reasonDescription').value || '',
          numberOfPackages: getValueField('numberPackages').value,
          typeOfTransport: transportModeVal,
          transferStartDate: dateWithHyphen(dateStartTransfer),
          carrierDocumentType: selectedCarrier.typeDocumentCarrier,
          carrierDocumentNumber: selectedCarrier.carrierId
            ? selectedCarrier.carrierId.split('-')[1]
            : selectedCarrier.carrierDocumentNumber,
          carrierDenomination: selectedCarrier.denominationCarrier,
          carrierId: selectedCarrier.carrierId,
          carrierPlateNumber:
            /* selectedCarrier.plateNumberCarrier */ getValueField(
              'licensePlate',
            ).value,
          driverDocumentType: driverDocumentType.toLowerCase(),
          driverDocumentNumber: getValueField('driverDocumentNumber').value,
          driverLicenseNumber: getValueField('driverLicenseNumber').value,
          driverDenomination: getValueField('driverName').value,
          driverLastName: getValueField('driverLastName').value,
          startingPointUbigeo: ubigeoStartingPoint.toString(),
          startingPointAddress: getValueField('startingPoint').value,
          startingSunatCode: getValueField('startingSunatCode').value,
          arrivalPointUbigeo: ubigeoArrivalPoint.toString(),
          arrivalPointAddress: getValueField('arrivalPoint').value,
          arrivalSunatCode: getValueField('arrivalSunatCode').value,
          observation: getValueField('observation').value,
          productsInfo: parsedProducts,
          documentsMovement: selectedOutput?.documentsMovement,
          clientEmail: selectedOutput?.clientEmail,
          typePDF: userDataRes.merchantSelected.typeMerchant,
          folderMovement: selectedOutput?.folderMovement,
          denominationMerchant:
            userDataRes.merchantSelected.denominationMerchant,
          weightFields: weightFields,
          complianceSeal: complianceSeal,
          complianceSealOnlySign: complianceSealOnlySign,
          pdfScale: pdfScale,
        },
      },
    };
    console.log('previsualizePayload', previsualizePayload);
    toPrevisualizeReferralGuide(previsualizePayload, jwtToken);
  };

  return (
    <Card sx={{p: 4}}>
      <Box sx={{width: 1, textAlign: 'center'}}>
        <Typography
          sx={{mx: 'auto', my: '10px', fontWeight: 600, fontSize: 25}}
        >
          GENERAR GUÍA DE REMISIÓN
        </Typography>
      </Box>
      <Divider sx={{mt: 2, mb: 4}} />
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          mb: 5,
          mx: 'auto',
        }}
      >
        <Formik
          validateOnChange={false}
          validationSchema={validationSchema}
          initialValues={{...defaultValues}}
          onSubmit={handleData}
        >
          {({
            isSubmitting,
            setFieldValue,
            values,
            getFieldProps,
            validateForm,
          }) => {
            changeValueField = setFieldValue;
            getValueField = getFieldProps;
            {
              console.log('values', values);
            }
            return (
              <Form
                style={{textAlign: 'left', justifyContent: 'center'}}
                noValidate
                autoComplete='on'
                /* onChange={handleActualData} */
              >
                <Grid
                  container
                  sx={{width: '100%', margin: 'auto'}}
                  maxWidth={600}
                >
                  <Grid xs={6} sm={4} sx={{px: 1, mt: 2}}>
                    <AppTextField
                      label='Nro Guía de Remisión'
                      name='nroReferralGuide'
                      disabled
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                        mx: 0,
                      }}
                    />
                  </Grid>
                  <Grid xs={6} sm={4} sx={{px: 1, mt: 2}}>
                    <DesktopDatePicker
                      renderInput={(params) => (
                        <TextField
                          sx={{position: 'relative', bottom: '-8px'}}
                          {...params}
                        />
                      )}
                      required
                      value={issueDate}
                      // disabled
                      label='Fecha de emisión'
                      minDate={new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)} // establece la fecha mínima en dos días a partir de la actual
                      maxDate={new Date(Date.now())}
                      inputFormat='dd/MM/yyyy'
                      name='issueDate'
                      onChange={(newValue) => {
                        console.log('Fecha de emisión', issueDate);
                        console.log('Campo de fecha', newValue);
                        setIssueDate(newValue);
                      }}
                    />
                  </Grid>
                  <Grid xs={6} sm={4} sx={{px: 1, mt: 2}}>
                    <DesktopDatePicker
                      renderInput={(params) => (
                        <TextField
                          sx={{position: 'relative', bottom: '-8px'}}
                          {...params}
                        />
                      )}
                      required
                      value={dateStartTransfer}
                      label='Fecha inicio traslado'
                      inputFormat='dd/MM/yyyy'
                      name='dateStartTransfer'
                      minDate={new Date(issueDate)}
                      // minDate={new Date()}
                      onChange={(newValue) => {
                        setDateStartTransfer(newValue);
                        console.log('Fecha de inicio de traslado', newValue);
                      }}
                    />
                  </Grid>

                  <Grid xs={12} sm={8} sx={{px: 1, mt: 2}}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel id='reason-label' style={{fontWeight: 200}}>
                        Motivo
                      </InputLabel>
                      <Select
                        sx={{textAlign: 'left'}}
                        onChange={(event) => {
                          setReasonVal(event.target.value);
                          if (
                            event.target.value == 'buy' ||
                            event.target.value ==
                              'transferBetweenEstablishmentsOfTheSameCompany'
                          ) {
                            changeValueField(
                              'addressee',
                              userDataRes.merchantSelected.denominationMerchant,
                            );
                          } else {
                            changeValueField(
                              'addressee',
                              selectedOutput?.clientName ||
                                selectedDeliveryState?.carrierDenomination ||
                                routeToReferralGuide?.carrierDenomination,
                            );
                          }
                          console.log('Motivo', event.target.value);
                        }}
                        name='reason'
                        labelId='reason-label'
                        label='Modo'
                        value={reasonVal}
                      >
                        <MenuItem value='sale' style={{fontWeight: 200}}>
                          Venta
                        </MenuItem>
                        <MenuItem
                          value='saleSubjectToBuyersConfirmation'
                          style={{fontWeight: 200}}
                        >
                          Venta sujeta a confirmación del comprador
                        </MenuItem>
                        <MenuItem
                          value='saleToThirdParties'
                          style={{fontWeight: 200}}
                        >
                          Venta con entrega a terceros
                        </MenuItem>
                        <MenuItem value='buy' style={{fontWeight: 200}}>
                          Compra
                        </MenuItem>
                        <MenuItem value='consignment' style={{fontWeight: 200}}>
                          Consignación
                        </MenuItem>
                        <MenuItem
                          value='collectionOfTransformedGoods'
                          style={{fontWeight: 200}}
                        >
                          Recojo de bienes transformados
                        </MenuItem>
                        <MenuItem
                          value='transferBetweenEstablishmentsOfTheSameCompany'
                          style={{fontWeight: 200}}
                        >
                          Traslado entre establecimientos de la misma empresa
                        </MenuItem>
                        <MenuItem
                          value='transferItinerantIssuerCP'
                          style={{fontWeight: 200}}
                        >
                          Traslado emisor itinerante CP
                        </MenuItem>
                        <MenuItem value='import' style={{fontWeight: 200}}>
                          Importación
                        </MenuItem>
                        <MenuItem value='export' style={{fontWeight: 200}}>
                          Exportación
                        </MenuItem>
                        <MenuItem
                          value='transferToPrimaryZone'
                          style={{fontWeight: 200}}
                        >
                          Traslado a zona primaria
                        </MenuItem>
                        <MenuItem value='return' style={{fontWeight: 200}}>
                          Devolución
                        </MenuItem>
                        <MenuItem value='others' style={{fontWeight: 200}}>
                          Otros
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} sm={4} sx={{px: 1, mt: 2}}>
                    <AppLowerCaseTextField
                      label='Correo de cliente'
                      name='clientEmail'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                        mx: 0,
                      }}
                    />
                  </Grid>

                  {reasonVal == 'others' ? (
                    <Grid xs={12} sm={12} sx={{px: 1, mt: 2}}>
                      <AppLowerCaseTextField
                        label='Descripción de Motivo de Traslado'
                        name='reasonDescription'
                        variant='outlined'
                        sx={{
                          width: '100%',
                          '& .MuiInputBase-input': {
                            fontSize: 14,
                          },
                          my: 2,
                          mx: 0,
                        }}
                      />
                    </Grid>
                  ) : null}
                  <Grid xs={12} sm={12} sx={{px: 1, mt: 2}}>
                    <Button
                      sx={{width: 1}}
                      variant='outlined'
                      onClick={() => openSelectAddressee()}
                      //disabled={!selectedDeliveryState}
                    >
                      {reasonVal == 'buy' || reasonVal == 'return'
                        ? 'Seleccionar Proveedor'
                        : 'Seleccionar Destinatario (Cliente)'}
                    </Button>
                  </Grid>
                  <Grid xs={6} sm={8} sx={{px: 1, mt: 2}}>
                    <AppTextField
                      label={reasonVal == 'buy' ? 'Proveedor' : 'Destinatario'}
                      name='addressee'
                      disabled
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                        mx: 0,
                      }}
                    />
                  </Grid>
                  <Grid xs={12} sm={4} sx={{px: 1, mt: 2}}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel
                        id='transportMode-label'
                        style={{fontWeight: 200}}
                      >
                        Modalidad de transporte
                      </InputLabel>
                      <Select
                        sx={{textAlign: 'left'}}
                        onChange={(event) => {
                          setTransportModeVal(event.target.value);

                          if (event.target.value == 'privateTransportation') {
                            const selfCarrier = {
                              nameContact:
                                userDataRes.merchantSelected
                                  .denominationMerchant,
                              typeDocumentCarrier:
                                userDataRes.merchantSelected
                                  .typeDocumentMerchant,
                              extraInformationCarrier: 'Info para Guía',
                              emailContact:
                                userDataRes.merchantSelected.emailAdminUserId,
                              carrierId: `${
                                userDataRes.merchantSelected
                                  .typeDocumentMerchant
                              }-${
                                userDataRes.merchantSelected
                                  .numberDocumentMerchant
                              }-${String(
                                userDataRes.merchantSelected
                                  .denominationMerchant,
                              )
                                .toLowerCase()
                                .trim()
                                .replace(/\s+/g, '')}-${
                                userDataRes.merchantSelected.merchantId
                              }`,
                              addressCarrier:
                                userDataRes.merchantSelected.addressMerchant,
                              numberContact: '51994683152',
                              emailCarrier:
                                userDataRes.merchantSelected.emailAdminUserId,
                              numberDocumentCarrier:
                                userDataRes.merchantSelected
                                  .numberDocumentMerchant,
                              denominationCarrier:
                                userDataRes.merchantSelected
                                  .denominationMerchant,
                              merchantId:
                                userDataRes.merchantSelected.merchantId,
                            };
                            setSelectedCarrier(selfCarrier);
                            setExistCarrier(true);
                          } else {
                            setSelectedCarrier({});
                            setExistCarrier(false);
                          }
                          console.log('modo de transporte', event.target.value);
                        }}
                        name='transportMode'
                        labelId='transportMode-label'
                        label='Modalidad de transporte'
                        value={transportModeVal}
                      >
                        <MenuItem
                          value='privateTransportation'
                          style={{fontWeight: 200}}
                        >
                          Transporte privado
                        </MenuItem>
                        <MenuItem
                          value='publicTransportation'
                          style={{fontWeight: 200}}
                        >
                          Transporte público
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Divider sx={{mt: 2, mb: 4}} />

                <Grid
                  container
                  sx={{width: '100%', margin: 'auto'}}
                  maxWidth={500}
                >
                  {availableLocations() ? (
                    <>
                      <Grid xs={12} sm={12} sx={{px: 1, mt: 2}}>
                        <Typography sx={{mx: 'auto'}}>
                          {selectedStartingLocation.locationDetail || ''}
                        </Typography>
                        {/* <Autocomplete
                          disablePortal
                          id='combo-box-location'
                          value={selectedStartingLocation}
                          isOptionEqualToValue={(option, value) =>
                            option.locationId === value.locationId
                          }
                          onChange={(option, value) => {
                            if (
                              typeof value === 'object' &&
                              value != null &&
                              value !== ''
                            ) {
                              console.log('option location', option);
                              console.log('valor location inicial', value);
                              setUbigeoStartingPoint(value.ubigeo);
                              let selectedLocationValue =
                                internalLocations.find(
                                  (obj) => obj.locationId == value.locationId,
                                );
                              let selectedUbigeoValue = parsedUbigeos.find(
                                (ubigeo) =>
                                  ubigeo.ubigeo == selectedLocationValue.ubigeo,
                              );
                              setSelectedStartingLocation(value);
                              changeValueField(
                                'startingPoint',
                                selectedLocationValue.locationDetail,
                              );
                              setSelectedStartingUbigeo(selectedUbigeoValue);
                              setExistStartingUbigeo(true);
                              if (value.sunatEstablishmentCode) {
                                changeValueField(
                                  'startingSunatCode',
                                  value.sunatEstablishmentCode,
                                );
                              }
                            }
                          }}
                          disabled
                          options={internalLocations}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label='Locación Interna de Partida'
                              onChange={(event) => {
                                console.log(
                                  'location field',
                                  event.target.value,
                                );
                              }}
                            />
                          )}
                        /> */}
                      </Grid>
                      <Grid xs={12} sm={12} sx={{px: 1, mt: 2}}>
                        <Button
                          sx={{width: 1}}
                          variant='outlined'
                          onClick={() => openSelectStartingLocation()}
                          disabled={!availableLocations()}
                        >
                          Seleccionar Locación Interna de Partida (Opcional)
                        </Button>
                      </Grid>
                    </>
                  ) : null}

                  {availableUbigeos() ? (
                    <>
                      <Grid xs={12} sm={12} sx={{px: 1, mt: 2}}>
                        <Autocomplete
                          disablePortal
                          id='combo-box-demo'
                          value={selectedStartingUbigeo}
                          isOptionEqualToValue={(option, value) =>
                            option.ubigeo === value.ubigeo
                          }
                          onChange={(option, value) => {
                            if (
                              typeof value === 'object' &&
                              value != null &&
                              value !== ''
                            ) {
                              console.log(
                                'valor ubigeo anterior',
                                ubigeoStartingPoint,
                              );
                              setUbigeoStartingPoint(value.ubigeo);
                              let selectedStringValue = parsedUbigeos.find(
                                (ubigeo) => ubigeo.ubigeo == value.ubigeo,
                              );
                              setSelectedStartingUbigeo(selectedStringValue);
                              setExistStartingUbigeo(true);
                            } else {
                              setExistStartingUbigeo(false);
                            }
                            console.log('ubigeo, punto de partida', value);
                          }}
                          options={parsedUbigeos}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label='Distrito - Ubigeo de punto de partida'
                              onChange={(event) => {
                                console.log('event field', event.target.value);
                                if (event.target.value === '') {
                                  console.log('si se cambia a null');
                                  setExistStartingUbigeo(false);
                                }
                              }}
                            />
                          )}
                        />
                        <Collapse in={!existStartingUbigeo}>
                          <Alert severity='error' sx={{mb: 2}}>
                            Es necesario que selecciones un ubigeo para el punto
                            de partida.
                          </Alert>
                        </Collapse>
                      </Grid>
                      <Grid xs={12} sm={12} sx={{px: 1, mt: 2}}>
                        <AppUpperCaseTextField
                          label='Punto de partida'
                          name='startingPoint'
                          variant='outlined'
                          sx={{
                            width: '100%',
                            '& .MuiInputBase-input': {
                              fontSize: 14,
                            },
                            my: 2,
                            mx: 0,
                          }}
                        />
                      </Grid>
                      {reasonVal ==
                      'transferBetweenEstablishmentsOfTheSameCompany' ? (
                        <Grid xs={12} sm={12} sx={{px: 1, mt: 2}}>
                          <AppUpperCaseTextField
                            label='Codigo de establecimiento Sunat (Domicilio Fiscal = 0000) **'
                            name='startingSunatCode'
                            variant='outlined'
                            sx={{
                              width: '100%',
                              '& .MuiInputBase-input': {
                                fontSize: 14,
                              },
                              my: 2,
                              mx: 0,
                            }}
                          />
                        </Grid>
                      ) : null}
                    </>
                  ) : null}
                  {availableLocations() ? (
                    <>
                      <Grid xs={12} sm={12} sx={{px: 1, mt: 2}}>
                        <Typography sx={{mx: 'auto'}}>
                          {selectedArrivalLocation.locationDetail || ''}
                        </Typography>
                        {/* <Autocomplete
                          disablePortal
                          id='combo-box-location'
                          value={selectedArrivalLocation}
                          isOptionEqualToValue={(option, value) =>
                            option.locationId === value.locationId
                          }
                          onChange={(option, value) => {
                            if (
                              typeof value === 'object' &&
                              value != null &&
                              value !== ''
                            ) {
                              console.log('option location', option);
                              console.log('valor location inicial', value);
                              setUbigeoArrivalPoint(value.ubigeo);
                              let selectedLocationValue =
                                internalLocations.find(
                                  (obj) => obj.locationId == value.locationId,
                                );
                              let selectedUbigeoValue = parsedUbigeos.find(
                                (ubigeo) =>
                                  ubigeo.ubigeo == selectedLocationValue.ubigeo,
                              );
                              setSelectedArrivalLocation(value);
                              changeValueField(
                                'arrivalPoint',
                                selectedLocationValue.locationDetail,
                              );
                              setSelectedArrivalUbigeo(selectedUbigeoValue);
                              setExistArrivalUbigeo(true);

                              if (value.sunatEstablishmentCode) {
                                changeValueField(
                                  'arrivalSunatCode',
                                  value.sunatEstablishmentCode,
                                );
                              }
                            }
                          }}
                          disabled
                          options={internalLocations}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label='Locación Interna de Llegada'
                              onChange={(event) => {
                                console.log(
                                  'location field',
                                  event.target.value,
                                );
                              }}
                            />
                          )}
                        /> */}
                      </Grid>
                      <Grid xs={12} sm={12} sx={{px: 1, mt: 2}}>
                        <Button
                          sx={{width: 1}}
                          variant='outlined'
                          onClick={() => openSelectArrivalLocation()}
                          disabled={!availableLocations()}
                        >
                          Seleccionar Locación Interna de Llegada (Opcional)
                        </Button>
                      </Grid>
                    </>
                  ) : null}
                  {availableUbigeos() ? (
                    <>
                      <Grid xs={12} sm={12} sx={{px: 1, mt: 2}}>
                        <Autocomplete
                          disablePortal
                          id='combo-box-demo'
                          value={selectedArrivalUbigeo}
                          isOptionEqualToValue={(option, value) =>
                            option.ubigeo === value.ubigeo
                          }
                          onChange={(event, value) => {
                            if (
                              typeof value === 'object' &&
                              value != null &&
                              value !== ''
                            ) {
                              console.log(
                                'valor ubigeo anterior',
                                ubigeoArrivalPoint,
                              );
                              setUbigeoArrivalPoint(value.ubigeo);

                              let selectedStringValue = parsedUbigeos.find(
                                (ubigeo) => ubigeo.ubigeo == value.ubigeo,
                              );
                              setSelectedArrivalUbigeo(selectedStringValue);

                              setExistArrivalUbigeo(true);
                            } else {
                              setExistArrivalUbigeo(false);
                            }
                            console.log('ubigeo, punto de llegada', value);
                          }}
                          options={parsedUbigeos}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label='Distrito - Ubigeo de punto de llegada'
                              onChange={(event) => {
                                console.log('event field', event.target.value);
                                if (event.target.value === '') {
                                  console.log('si se cambia a null');
                                  setExistArrivalUbigeo(false);
                                }
                              }}
                            />
                          )}
                        />
                        <Collapse in={!existArrivalUbigeo}>
                          <Alert
                            severity='error'
                            /* action={
                          <IconButton
                            aria-label='close'
                            color='inherit'
                            size='small'
                            onClick={() => {
                              setExistArrivalUbigeo(false);
                            }}
                          >
                            <CloseIcon fontSize='inherit' />
                          </IconButton>
                        } */
                            sx={{mb: 2}}
                          >
                            Es necesario que selecciones un ubigeo para el punto
                            de llegada.
                          </Alert>
                        </Collapse>
                      </Grid>
                      <Grid xs={12} sm={12} sx={{px: 1, mt: 2}}>
                        <AppUpperCaseTextField
                          label='Punto de llegada'
                          name='arrivalPoint'
                          variant='outlined'
                          sx={{
                            width: '100%',
                            '& .MuiInputBase-input': {
                              fontSize: 14,
                            },
                            my: 2,
                            mx: 0,
                          }}
                        />
                      </Grid>
                      {reasonVal ==
                      'transferBetweenEstablishmentsOfTheSameCompany' ? (
                        <Grid xs={12} sm={12} sx={{px: 1, mt: 2}}>
                          <AppUpperCaseTextField
                            label='Codigo de establecimiento Sunat (Domicilio Fiscal = 0000) **'
                            name='arrivalSunatCode'
                            variant='outlined'
                            sx={{
                              width: '100%',
                              '& .MuiInputBase-input': {
                                fontSize: 14,
                              },
                              my: 2,
                              mx: 0,
                            }}
                          />
                        </Grid>
                      ) : null}
                    </>
                  ) : null}
                </Grid>

                <Divider sx={{mt: 2, mb: 4}} />

                <Grid
                  container
                  sx={{width: '100%', margin: 'auto'}}
                  maxWidth={500}
                >
                  <Grid xs={12} sm={12} sx={{px: 1, mt: 2}}>
                    <Button
                      sx={{width: 1}}
                      variant='outlined'
                      onClick={() => openSelectCarrier()}
                      disabled={transportModeVal == 'privateTransportation'}
                    >
                      Seleccionar transportista
                    </Button>
                  </Grid>
                  <Grid item xs={6} sx={{textAlign: 'center'}}>
                    <Typography sx={{mx: 'auto', my: '10px'}}>
                      {selectedCarrier.denominationCarrier}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sx={{textAlign: 'center'}}>
                    <Collapse in={!existCarrier}>
                      <Alert severity='error' sx={{mb: 2}}>
                        Es necesario que selecciones un ubigeo para el punto de
                        partida.
                      </Alert>
                    </Collapse>
                  </Grid>
                </Grid>

                <Grid
                  container
                  sx={{width: '100%', margin: 'auto'}}
                  maxWidth={500}
                >
                  <Grid xs={12} sm={12} sx={{px: 1, mt: 2}}>
                    <AppUpperCaseTextField
                      label='Placa de vehículo'
                      name='licensePlate'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                        mx: 0,
                      }}
                    />
                  </Grid>
                  <Grid xs={12} sm={12} sx={{px: 1, mt: 2}}>
                    <Button
                      sx={{width: 1}}
                      variant='outlined'
                      onClick={() => openSelectDriver()}
                    >
                      Seleccionar conductor (Opcional)
                    </Button>
                  </Grid>
                  <Grid xs={12} sm={12} sx={{px: 1, mt: 2}}>
                    <AppUpperCaseTextField
                      label='Nombre del conductor'
                      name='driverName'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                        mx: 0,
                      }}
                    />
                  </Grid>
                  <Grid xs={12} sm={12} sx={{px: 1, mt: 2}}>
                    <AppUpperCaseTextField
                      label='Apellidos del conductor'
                      name='driverLastName'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                        mx: 0,
                      }}
                    />
                  </Grid>
                  <Grid xs={12} sm={12} sx={{px: 1, mt: 2}}>
                    <FormControl fullWidth sx={{my: 2}}>
                      <InputLabel
                        id='driverDocumentType-label'
                        style={{fontWeight: 200}}
                      >
                        Tipo de documento identificador
                      </InputLabel>
                      <Select
                        value={driverDocumentType}
                        name='driverDocumentType'
                        labelId='driverDocumentType-label'
                        label='Tipo de documento identificador'
                        onChange={handleDriverDocumentType}
                      >
                        <MenuItem value='DNI' style={{fontWeight: 200}}>
                          DNI
                        </MenuItem>
                        <MenuItem value='RUC' style={{fontWeight: 200}}>
                          RUC
                        </MenuItem>
                        <MenuItem value='CE' style={{fontWeight: 200}}>
                          Carnet de extranjería
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid xs={12} sm={12} sx={{px: 1, mt: 2}}>
                    <AppTextField
                      label='Número identificador del conductor'
                      name='driverDocumentNumber'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                        mx: 0,
                      }}
                    />
                  </Grid>
                  <Grid xs={12} sm={12} sx={{px: 1, mt: 2}}>
                    <AppUpperCaseTextField
                      label='Licencia del conductor'
                      name='driverLicenseNumber'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                        mx: 0,
                      }}
                    />
                  </Grid>
                  <Grid xs={12} sm={12} sx={{px: 1, mt: 2}}>
                    <AppTextField
                      label='Observación'
                      name='observation'
                      variant='outlined'
                      multiline
                      rows={4}
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                      }}
                    />
                  </Grid>
                  <Grid xs={12} sm={12} sx={{px: 1, mt: 2}}>
                    <Button
                      sx={{width: 1}}
                      variant='outlined'
                      onClick={() => searchAProduct('product')}
                    >
                      Añade productos
                    </Button>
                  </Grid>
                </Grid>
                <Box sx={{my: 5}}>
                  <SelectedProducts
                    arrayObjs={selectedProducts}
                    toDelete={removeProduct}
                    toChangeQuantity={changeQuantity}
                    toChangeUnitMeasure={changeUnitMeasure}
                  />
                </Box>
                <Grid
                  container
                  sx={{width: '100%', margin: 'auto'}}
                  maxWidth={500}
                >
                  <Grid xs={6} sm={6} sx={{px: 1, mt: 2}}>
                    <AppTextField
                      label='Peso bruto total'
                      name='totalWeight'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                        mx: 0,
                      }}
                    />
                  </Grid>
                  <Grid xs={6} sm={6} sx={{px: 1, mt: 2}}>
                    <AppTextField
                      label='Número de bultos'
                      name='numberPackages'
                      variant='outlined'
                      sx={{
                        width: '100%',
                        '& .MuiInputBase-input': {
                          fontSize: 14,
                        },
                        my: 2,
                        mx: 0,
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={2}
                  sx={{width: '100%', margin: 'auto', mb: 2}}
                  maxWidth={500}
                >
                  <Grid item xs={12} sm={12} sx={{mt: 2}}>
                    <Button
                      sx={{width: 1}}
                      color='secondary'
                      variant='outlined'
                      onClick={() => {
                        validateForm().then(() => {
                          // Aquí puedes realizar cualquier acción adicional después de la validación del formulario
                          // Si no hay errores de validación, puedes continuar con la lógica para previsualizar el PDF
                          // De lo contrario, los mensajes de error se mostrarán automáticamente en los campos del formulario
                          handleClickOpenPrevisualizer();
                        });
                      }}
                    >
                      Previsualizar PDF
                    </Button>
                  </Grid>
                </Grid>
                <ButtonGroup
                  orientation='vertical'
                  variant='outlined'
                  sx={{width: 1}}
                  aria-label='outlined button group'
                >
                  <Button
                    color='primary'
                    sx={{mx: 'auto', width: '50%', py: 3}}
                    type='submit'
                    variant='contained'
                    disabled={isSubmitting}
                    startIcon={<SaveAltOutlinedIcon />}
                  >
                    Finalizar
                  </Button>
                  <Button
                    sx={{mx: 'auto', width: '50%', py: 3}}
                    variant='outlined'
                    startIcon={<ArrowCircleLeftOutlinedIcon />}
                    onClick={cancel}
                  >
                    Cancelar
                  </Button>
                </ButtonGroup>
                {minTutorial ? (
                  <Box
                    sx={{
                      position: 'fixed',
                      right: 0,
                      top: {xs: 325, xl: 305},
                      zIndex: 1110,
                    }}
                    className='customizerOption'
                  >
                    <Box
                      sx={{
                        borderRadius: '30px 0 0 30px',
                        mb: 1,
                        backgroundColor: orange[500],
                        '&:hover': {
                          backgroundColor: orange[700],
                        },
                        '& button': {
                          borderRadius: '30px 0 0 30px',

                          '&:focus': {
                            borderRadius: '30px 0 0 30px',
                          },
                        },
                      }}
                    >
                      <IconButton
                        sx={{
                          mt: 1,
                          '& svg': {
                            height: 35,
                            width: 35,
                          },
                          color: 'white',
                          pr: 5,
                        }}
                        edge='end'
                        color='inherit'
                        aria-label='open drawer'
                        onClick={() =>
                          window.open('https://youtu.be/eGpwPJ6USVM/')
                        }
                      >
                        <SchoolIcon fontSize='inherit' />
                      </IconButton>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      position: 'fixed',
                      right: 0,
                      top: {xs: 325, xl: 305},
                      zIndex: 1110,
                    }}
                    className='customizerOption'
                  >
                    <Box
                      sx={{
                        borderRadius: '30px 0 0 30px',
                        mb: 1,
                        backgroundColor: orange[500],
                        '&:hover': {
                          backgroundColor: orange[700],
                        },
                        '& button': {
                          borderRadius: '30px 0 0 30px',

                          '&:focus': {
                            borderRadius: '30px 0 0 30px',
                          },
                        },
                      }}
                    >
                      <IconButton
                        sx={{
                          mt: 1,
                          '& svg': {
                            height: 35,
                            width: 35,
                          },
                          color: 'white',
                        }}
                        edge='end'
                        color='inherit'
                        aria-label='open drawer'
                        onClick={() =>
                          window.open('https://youtu.be/eGpwPJ6USVM/')
                        }
                      >
                        VER TUTORIAL
                      </IconButton>
                    </Box>
                  </Box>
                )}
              </Form>
            );
          }}
        </Formik>
      </Box>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Dialog
          open={openDialog}
          onClose={sendStatus}
          sx={{textAlign: 'center'}}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
          maxWidth='xl'
          disableEscapeKeyDown
        >
          <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
            <Box sx={{mx: 10}}>
              {(typeDialog == 'add') | (typeDialog == 'confirmCancel')
                ? 'Registro de Guía de Remisión'
                : null}
              {typeDialog == 'selectCarrier' ? (
                <>
                  <div>{`Listado de Transportistas`}</div>
                  <Button
                    sx={{mx: 'auto', mx: 1, my: 1, py: 3}}
                    variant='outlined'
                    startIcon={<CachedIcon sx={{m: 1, my: 'auto'}} />}
                    onClick={() => handleClickUpdateCarrierList()}
                  >
                    {'Actualizar'}
                  </Button>
                  <Button
                    sx={{mx: 'auto', py: 3, mx: 1, my: 1}}
                    variant='outlined'
                    startIcon={<ArrowCircleLeftOutlinedIcon />}
                    onClick={() =>
                      window.open(`${basicUrl}/sample/carriers/new`)
                    }
                  >
                    Agregar nuevo Transportista
                  </Button>
                </>
              ) : null}
              {/* {typeDialog == 'selectStartingLocation' ? (
                <>
                  <div>{`Listado de Locaciones`}</div>
                  <Button
                    sx={{mx: 'auto', mx: 1, my: 1, py: 3}}
                    variant='outlined'
                    startIcon={<CachedIcon sx={{m: 1, my: 'auto'}} />}
                    onClick={() => handleClickUpdateCarrierList()}
                  >
                    {'Actualizar'}
                  </Button>
                  <Button
                    sx={{mx: 'auto', py: 3, mx: 1, my: 1}}
                    variant='outlined'
                    startIcon={<ArrowCircleLeftOutlinedIcon />}
                    onClick={() =>
                      window.open(`${basicUrl}/sample/carriers/new`)
                    }
                  >
                    Agregar nuevo Transportista
                  </Button>
                </>
              ) : null} */}
            </Box>

            <IconButton
              aria-label='close'
              disabled={!registerError() && !registerSuccess()}
              onClick={sendStatus}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          {typeDialog == 'add' ? (
            showMessage()
          ) : (
            <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
              {typeDialog == 'confirmCancel' ? showCancelMessage() : null}
              {typeDialog == 'selectCarrier' ? showSelectCarrier() : null}
              {typeDialog == 'selectDriver' ? showSelectDriver() : null}
              {typeDialog == 'selectStartingLocation'
                ? showSelectStartingLocation()
                : null}
              {typeDialog == 'selectArrivalLocation'
                ? showSelectArrivalLocation()
                : null}
              {typeDialog == 'selectAddressee' ? showSelectAddressee() : null}
            </DialogContent>
          )}

          <DialogActions sx={{justifyContent: 'center'}}>
            {/* {typeDialog == 'add' ? (
              <Button variant='outlined' onClick={closeDialog}>
                Aceptar
              </Button>
            ) : null} */}

            {typeDialog == 'confirmCancel' ? (
              <>
                <Button
                  variant='outlined'
                  onClick={() => {
                    Router.push('/sample/referral-guide/table');
                  }}
                >
                  Sí
                </Button>
                <Button variant='outlined' onClick={() => setOpenDialog(false)}>
                  No
                </Button>
              </>
            ) : null}
          </DialogActions>
        </Dialog>
      </ClickAwayListener>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Dialog
          open={showForms}
          onClose={() => Router.push('/sample/outputs/table')}
          sx={{textAlign: 'center'}}
          fullWidth
          maxWidth='xs'
          disableEscapeKeyDown
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
            <DialogContentText
              sx={{fontSize: '1.2em', m: 'auto'}}
              id='alert-dialog-description'
            >
              {outputItems_pageListOutput &&
              Array.isArray(outputItems_pageListOutput) ? (
                <>
                  {selectedOutput && !selectedOutput.existBill ? (
                    <Button
                      color='primary'
                      sx={{width: 1, px: 7, my: 2}}
                      variant='contained'
                      onClick={() => {
                        Router.push({
                          pathname: '/sample/bills/get',
                          query: outputItems_pageListOutput.find(
                            (obj) =>
                              obj.movementHeaderId ==
                              selectedOutput.movementHeaderId,
                          ),
                        });
                      }}
                    >
                      Generar Factura
                    </Button>
                  ) : null}
                  {selectedOutput && selectedOutput.existBill ? (
                    <Button
                      color='primary'
                      sx={{width: 1, px: 7, my: 2}}
                      variant='contained'
                      onClick={() => {
                        Router.push({
                          pathname: '/sample/finances/new-earning',
                          query: outputItems_pageListOutput.find(
                            (obj) =>
                              obj.movementHeaderId ==
                              selectedOutput.movementHeaderId,
                          ),
                        });
                      }}
                    >
                      Generar Ingreso
                    </Button>
                  ) : null}
                  <Button
                    color='primary'
                    sx={{width: 1, px: 7, my: 2}}
                    variant='outlined'
                    onClick={() => Router.push('/sample/outputs/table')}
                  >
                    Ir a Listado
                  </Button>
                </>
              ) : (
                <CircularProgress />
              )}
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </ClickAwayListener>

      <ClickAwayListener onClickAway={handleClickAway}>
        <Dialog
          disableEscapeKeyDown
          open={openAddProduct}
          onClose={() => setOpenAddProduct(false)}
          sx={{textAlign: 'center'}}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
            {'Selecciona los productos'}
            <CancelOutlinedIcon
              onClick={() => setOpenAddProduct(false)}
              sx={{
                cursor: 'pointer',
                float: 'right',
                marginTop: '5px',
                width: '20px',
              }}
            />
          </DialogTitle>
          <DialogContent>
            <AddProductForm type='input' sendData={getNewProduct} />
          </DialogContent>
        </Dialog>
      </ClickAwayListener>

      <Dialog
        open={openPrevisualizer}
        onClose={handleClosePrevisualizer}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'GUÍA DE REMISIÓN PDF'}
          <CancelOutlinedIcon
            onClick={setOpenPrevisualizer.bind(this, false)}
            className={classes.closeButton}
          />
        </DialogTitle>
        <DialogContent>
          <Button
            color='primary'
            sx={{width: 1}}
            variant='outlined'
            onClick={() => window.open(urlPdf)}
          >
            Redirigir
          </Button>
          {urlPdf ? (
            <Box sx={{width: 1, textAlign: 'center'}}>
              <canvas ref={canvasRef} style={{height: '100vh'}} />
            </Box>
          ) : (
            <CircularProgress size={16} />
          )}

          <Box
            sx={{display: 'flex', justifyContent: 'center', marginTop: '1rem'}}
          >
            <IconButton onClick={handleZoomIn}>
              <ZoomInIcon />
            </IconButton>
            <IconButton onClick={handleZoomOut}>
              <ZoomOutIcon />
            </IconButton>
            <IconButton onClick={handleResetZoom}>
              <ZoomOutMapIcon />
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default GetReferralGuide;
