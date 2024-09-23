import React, {useEffect, useRef} from 'react';
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
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  useTheme,
  ButtonGroup,
} from '@mui/material';

import {ClickAwayListener} from '@mui/base';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
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
import {
  getMovements,
  getOutputItems_pageListOutput,
  updateReferralGuideValue,
  addReferrealGuide,
  previsualizeReferralGuide,
} from '../../../redux/actions/Movements';
import {customizePdf} from '../../../redux/actions/General';
import {
  getYear,
  getActualMonth,
  translateValue,
  fixDecimals,
} from '../../../Utils/utils';
const validationSchema = yup.object({});
const defaultValues = {};
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_USER_DATA,
  GET_BUSINESS_PARAMETER,
} from '../../../shared/constants/ActionTypes';
import {onGetBusinessParameter} from 'redux/actions/General';
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
const Customize = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  //PREVISUALIZE
  let canvasRef = useRef(null);
  const {query} = router; //query es el objeto seleccionado
  console.log('query', query);

  let changeValueField;
  let getValueField;
  let isFormikSubmitting;
  let setFormikSubmitting;

  //PREVISUALIZE
  const toPrevisualizeReferralGuide = (payload, jwtToken) => {
    dispatch(previsualizeReferralGuide(payload, jwtToken));
  };
  const toCustomizePdf = (payload) => {
    dispatch(customizePdf(payload));
  };

  const [openCustomizeUpdate, setOpenCustomizeUpdate] = React.useState('');
  const [pdfScale, setPdfScale] = React.useState('100');
  const [weightFields, setWeightFields] = React.useState(false);
  const [complianceSeal, setComplianceSeal] = React.useState(false);
  const [complianceSealOnlySign, setComplianceSealOnlySign] =
    React.useState(false);

  //PREVISUALIZE
  const [scale, setScale] = React.useState(1.0);
  const [urlPdf, setUrlPdf] = React.useState('');
  const [openPrevisualizer, setOpenPrevisualizer] = React.useState(false);
  //GET APIS RES
  const {generalSuccess} = useSelector(({general}) => general);
  console.log('generalSuccess', generalSuccess);
  const {generalError} = useSelector(({general}) => general);
  console.log('generalError', generalError);
  const {userDataRes} = useSelector(({user}) => user);
  const {businessParameter, customizePdfRes} = useSelector(
    ({general}) => general,
  );
  console.log('businessParameter', businessParameter);
  //PREVISUALIZE
  const {previsualizeReferralGuideRes} = useSelector(
    ({movements}) => movements,
  );
  const {jwtToken} = useSelector(({general}) => general);

  console.log('redirectUrl', JSON.parse(localStorage.getItem('redirectUrl')));
  useEffect(() => {}, []);
  //PREVISUALIZE
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
    if (userDataRes && !businessParameter) {
      console.log('Esto se ejecuta?');
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
    if (businessParameter && businessParameter.length >= 1) {
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
      if (!referralGuideParameter.complianceSealOnlySign) {
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
  const handleClosePrevisualizer = () => {
    setOpenPrevisualizer(false);
  };

  const handleClickOpenPrevisualizer = () => {
    setOpenPrevisualizer(true);
    setUrlPdf('');
    let previsualizePayload = {
      request: {
        payload: {
          merchantId: userDataRes.merchantSelected.merchantId,
          deliveryDistributionId: '',
          movementTypeMerchantId: '',
          movementHeaderId: '',
          contableMovementId: '',
          createdAt: 1691335785110,
          clientId:
            'RUC-20606168978-digisolutionssrl-cb1b5aff10ca4a548afae5b1f959e286',
          client: {
            denomination: 'DIGISOLUTIONS SRL',
            address: 'SERGIO BERNALES CON VICTOR ALZAMORA',
            email: 'acaedric@gmail.com',
          },
          issueDate: '04-09-2023',
          serial: 'T001',
          automaticSendSunat: true,
          automaticSendClient: true,
          reasonForTransfer: 'sale',
          totalGrossWeight: 22078.6,
          addressee: '',
          type: '',
          reasonDescription: '',
          numberOfPackages: 1,
          typeOfTransport: 'privateTransportation',
          transferStartDate: '04-09-2023',
          carrierDocumentType: 'RUC',
          carrierDocumentNumber: '20606168978',
          carrierDenomination: 'DIGISOLUTIONS SRL',
          carrierId:
            'RUC-20606168978-digisolutionssrl-cb1b5aff10ca4a548afae5b1f959e286',
          carrierPlateNumber: 'KDS-465',
          driverDocumentType: 'dni',
          driverDocumentNumber: '00829280',
          driverLicenseNumber: 'Q00829280',
          driverDenomination: 'MARCO ANTONIO',
          driverLastName: 'LUDEÑA TERRONES',
          startingPointUbigeo: '010701',
          startingPointAddress:
            'II EE, 16221 LEONCIO PRADO, NIVEL PRIMARIA, COLLICATE S/N',
          startingSunatCode: '',
          arrivalPointUbigeo: '010705',
          arrivalPointAddress:
            'II EE, 16260 JOSE ANTONIO ENCINAS FRANCO, NIVEL PRIMARIA, DUELAC',
          arrivalSunatCode: '',
          observation: '',
          productsInfo: [
            {
              product: '1',
              quantityMovement: '1100',
              weight: 0.214,
              customCodeProduct: '',
              description: 'ACEITE VEGETAL X 0.200 L, MARCA DEL CIELO',
              unitMeasure: 'NIU',
              businessProductCode: '1',
            },
            {
              product: '5',
              quantityMovement: 680,
              weight: 0.24,
              customCodeProduct: '',
              description:
                'HOJUELAS DE QUINUA X 0.240 KG, MARCA CAXAS SUPERFOODSSUPERFOODS X 240G',
              unitMeasure: 'NIU',
              businessProductCode: '5',
            },
            {
              product: '9',
              quantityMovement: 2450,
              weight: 0.425,
              customCodeProduct: '',
              description:
                'CONSERVA DE PESCADO EN AGUA Y SAL X 0.425 KG, MARCA CASALI',
              unitMeasure: 'NIU',
              businessProductCode: '9',
            },
            {
              product: '3',
              quantityMovement: 54090,
              weight: 0.25,
              customCodeProduct: '',
              description:
                "AZUCAR RUBIA X 0.250 KG, MARCA  JIKEL'S - DULCE CAÑAVERAL\nKG",
              unitMeasure: 'NIU',
              businessProductCode: '3',
            },
            {
              product: '2',
              quantityMovement: 28465,
              weight: 0.25,
              customCodeProduct: '',
              description: 'ARROZ X 0.250 KG, MARCA RIO BRANCO',
              unitMeasure: 'NIU',
              businessProductCode: '2',
            },
          ],
          documentsMovement: [],
          typePDF: 'PROD',
          folderMovement: 'salidas/RUC-20606168978/73',
          denominationMerchant: 'DIGISOLUTIONS SRL',
          weightFields: weightFields,
          pdfScale: pdfScale,
          complianceSeal: complianceSeal,
          complianceSealOnlySign: complianceSealOnlySign,
        },
      },
    };
    console.log('previsualizePayload', previsualizePayload);
    toPrevisualizeReferralGuide(previsualizePayload, jwtToken);
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
  const handlePdfScale = (event, newPdfScale) => {
    setPdfScale(newPdfScale);
  };
  const handleData = (data, {setSubmitting}) => {
    setSubmitting(true);
    dispatch({type: FETCH_SUCCESS, payload: undefined});
    dispatch({type: FETCH_ERROR, payload: undefined});
    let newBusinessParameter = businessParameter.map((obj) => {
      if (obj.abreParametro == 'SERIES_REFERRAL_GUIDE') {
        obj.weightFields = weightFields;
        obj.pdfScale = pdfScale;
        obj.complianceSeal = complianceSeal;
        obj.complianceSealOnlySign = complianceSealOnlySign;
      }
      return obj;
    });
    console.log('newBUsinessParameter', newBusinessParameter);
    dispatch({
      type: 'GET_BUSINESS_PARAMETER',
      payload: newBusinessParameter,
    });
    const finalPayload = {
      request: {
        payload: {
          merchantId: userDataRes.merchantSelected.merchantId,
          referralGuide: {
            weightFields: weightFields,
            pdfScale: pdfScale,
            complianceSeal: complianceSeal,
            complianceSealOnlySign: complianceSealOnlySign,
          },
        },
      },
    };
    console.log('finalPayload', finalPayload);
    toCustomizePdf(finalPayload);
    setOpenCustomizeUpdate(true);
    setSubmitting(false);
  };
  const handleChange = (event) => {
    // if (event.target.name == 'defaultIgvActivation') {
    //     setDefaultIgvActivation(event.target.value);
    //     console.log('Es el activation IGV: ', event.target.value);
    // }
    // if (event.target.name == 'defaultProductsPayDetail') {
    //     setDefaultProductsPayDetail(event.target.value);
    //     console.log('Es el setDefaultProductsPayDetail: ', event.target.value);
    // }
    // if (event.target.name == 'defaultMinPrice') {
    //     let priceRange = defaultPriceRange;
    //     priceRange[0] = event.target.value;
    //     setDefaultPriceRange(priceRange);
    //     console.log('Es precio mínimo: ', event.target.value);
    // }
    // if (event.target.name == 'defaultMaxPrice') {
    //     let priceRange = defaultPriceRange;
    //     priceRange[1] = event.target.value;
    //     setDefaultPriceRange(priceRange);
    //     console.log('Es precio máximo: ', event.target.value);
    // }
  };
  const registerSuccess = () => {
    console.log('Registro Exitoso?', generalSuccess);
    console.log('El res de updateParameters', customizePdfRes);
    return (
      generalSuccess != undefined &&
      customizePdfRes != undefined &&
      !('error' in customizePdfRes)
    );
  };
  const registerError = () => {
    console.log('Registro Erróneo?', generalSuccess);
    console.log('El res de updateParameters', customizePdfRes);
    return (
      (generalSuccess != undefined && customizePdfRes) ||
      generalError != undefined
    );
  };
  const sendStatus = () => {
    if (registerSuccess()) {
      Router.push('/sample/home');
      setOpenCustomizeUpdate(false);
    } else if (registerError()) {
      setOpenCustomizeUpdate(false);
    } else {
      setOpenCustomizeUpdate(false);
    }
  };
  const handleClickAway = () => {
    // Evita que se cierre el diálogo haciendo clic fuera del contenido
    // Puedes agregar condiciones adicionales aquí si deseas una lógica más específica.
  };
  const showMessage = () => {
    if (registerSuccess()) {
      console.log('Fue exitoso?');
      return (
        <>
          <CheckCircleOutlineOutlinedIcon
            color='success'
            sx={{fontSize: '6em', mx: 2}}
          />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            <IntlMessages id='message.register.data.success' />
          </DialogContentText>
        </>
      );
    } else if (registerError()) {
      console.log('No Fue exitoso?');
      return (
        <>
          <CancelOutlinedIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            <IntlMessages id='message.register.data.error' />
            <br />
            {customizePdfRes && 'error' in customizePdfRes
              ? customizePdfRes.error
              : null}
          </DialogContentText>
        </>
      );
    } else {
      return <CircularProgress disableShrink sx={{mx: 'auto', my: '20px'}} />;
    }
  };
  return businessParameter ? (
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
            }}
          >
            Personalizar PDF Guía
          </Typography>
        </Stack>
        <Divider sx={{my: 2}} />

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
            validateOnChange={true}
            validationSchema={validationSchema}
            initialValues={{...defaultValues}}
            onSubmit={handleData}
          >
            {({isSubmitting, setFieldValue, getFieldProps, setSubmitting}) => {
              changeValueField = setFieldValue;
              getValueField = getFieldProps;
              setFormikSubmitting = setSubmitting;
              isFormikSubmitting = isSubmitting;
              return (
                <Form
                  id='principal-form'
                  style={{textAlign: 'left', justifyContent: 'center'}}
                  noValidate
                  autoComplete='on'
                  onChange={handleChange}
                >
                  <Stack
                    sx={{
                      m: 2,
                    }}
                    direction={isMobile ? 'column' : 'row'}
                    spacing={2}
                    className={classes.stack}
                  >
                    <ToggleButtonGroup
                      value={pdfScale}
                      color='primary'
                      exclusive
                      onChange={handlePdfScale}
                      aria-label='text alignment'
                    >
                      <ToggleButton
                        value='75'
                        aria-label='left aligned'
                        disabled
                      >
                        75%
                      </ToggleButton>
                      <ToggleButton value='100' aria-label='centered'>
                        100%
                      </ToggleButton>
                      <ToggleButton value='150' aria-label='right aligned'>
                        150%
                      </ToggleButton>
                      <ToggleButton value='180' aria-label='justified' disabled>
                        180%
                      </ToggleButton>
                    </ToggleButtonGroup>

                    <ToggleButton
                      sx={{ml: 2}}
                      value='check'
                      selected={weightFields}
                      color='primary'
                      onChange={() => {
                        setWeightFields(!weightFields);
                      }}
                    >
                      Peso unitario y Peso Total
                    </ToggleButton>

                    <ToggleButton
                      sx={{ml: 2}}
                      value='check'
                      selected={complianceSeal}
                      color='primary'
                      onChange={() => {
                        setComplianceSeal(!complianceSeal);
                      }}
                    >
                      Sello de Conformidad
                    </ToggleButton>

                    <ToggleButton
                      sx={{ml: 2}}
                      value='check'
                      selected={complianceSealOnlySign}
                      color='primary'
                      onChange={() => {
                        setComplianceSealOnlySign(!complianceSealOnlySign);
                      }}
                    >
                      Conformidad Solo Firma
                    </ToggleButton>
                  </Stack>
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      mb: 5,
                    }}
                  >
                    <Button
                      sx={{width: 1}}
                      color='secondary'
                      variant='outlined'
                      onClick={() => handleClickOpenPrevisualizer()}
                    >
                      Previsualizar PDF
                    </Button>
                  </Box>
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
                      form='principal-form'
                      disabled={isSubmitting}
                      variant='contained'
                      startIcon={<SaveAltOutlinedIcon />}
                    >
                      Finalizar
                    </Button>
                  </ButtonGroup>
                </Form>
              );
            }}
          </Formik>
        </Box>
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
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1rem',
              }}
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

        <ClickAwayListener onClickAway={handleClickAway}>
          <Dialog
            open={openCustomizeUpdate}
            onClose={sendStatus}
            sx={{textAlign: 'center'}}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
              {<IntlMessages id='message.update.configurationParameters' />}
            </DialogTitle>
            <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
              {showMessage()}
            </DialogContent>
            <DialogActions sx={{justifyContent: 'center'}}>
              <Button variant='outlined' onClick={sendStatus}>
                Aceptar
              </Button>
            </DialogActions>
          </Dialog>
        </ClickAwayListener>
      </Card>
    </>
  ) : (
    <></>
  );
};

export default Customize;
