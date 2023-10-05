import React, { useEffect, useRef } from 'react';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import { useIntl } from 'react-intl';

import AddClientForm from '../ClientSelection/AddClientForm';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import AppLoader from '../../../@crema/core/AppLoader';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress,
    IconButton,
    Collapse,
    useTheme,
    useMediaQuery,
    Grid,
    Select,
    FormControl,
    FormControlLabel,
    InputLabel,
    Checkbox,
    TableSortLabel,
    ToggleButtonGroup,
    Divider,
    Alert,
} from '@mui/material';
import ProductsList from './ProductsList';
import AppPageMeta from '../../../@crema/core/AppPageMeta';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { red } from '@mui/material/colors';
import {
    getMovements,
    getOutputItems_pageListOutput,
    deleteMovement,
    generateInvoice,
    generateSellTicket,
} from '../../../redux/actions/Movements';
import { Form, Formik } from 'formik';
import Router, { useRouter } from 'next/router';
import {
} from '../../../Utils/utils';
import {
    FETCH_SUCCESS,
    FETCH_ERROR,
    LIST_SALES,
    UPDATE_SALE,
} from '../../../shared/constants/ActionTypes';
import MoreFilters from '../Filters/MoreFilters';
import { listSales, updateSale } from '../../../redux/actions/Sales';

import AddProductForm from './AddProductForm';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { orange } from '@mui/material/colors';
import SchoolIcon from '@mui/icons-material/School';
//ESTILOS
const useStyles = makeStyles((theme) => ({
    btnGroup: {
        marginTop: '2rem',
    },
    btnSplit: {
        display: 'flex',
        justifyContent: 'center',
    },
    stack: {
        justifyContent: 'center',
        marginBottom: '10px',
    },
}));
let deletePayload = {
    request: {
        payload: {
            movementType: 'OUTPUT',
            movementTypeMerchantId: '',
            createdAt: null,
            movementHeaderId: '',
            folderMovement: '',
            contableMovementId: '',
            userUpdated: '',
            userUpdatedMetadata: {
                nombreCompleto: '',
                email: '',
            },
        },
    },
};

let invoicePayload = {
    request: {
        payload: {
            merchantId: '',
            movementTypeMerchantId: '',
            createdAt: '',
            clientId: '',
            totalPriceWithIgv: '',
            issueDate: '',
            exchangeRate: '',
            documentIntern: '',
            numberBill: '',
            automaticSendSunat: true,
            automaticSendClient: true,
            formatPdf: 'A4',
            referralGuide: true,
            creditSale: true,
        },
    },
};

const validationSchema = yup.object({
    transactionNumber: yup.string(),
});

let codProdSelected = '';
let selectedOutput = {};
let selectedProducts = [];
let total = 0;
let typeAlert = '';
let redirect = false;
//FORCE UPDATE
const useForceUpdate = () => {
    const [reload, setReload] = React.useState(0); // integer state
    return () => setReload((value) => value + 1); // update the state to force render
};

const UpdateSale = (props) => {
    const classes = useStyles(props);
    const dispatch = useDispatch();
    const forceUpdate = useForceUpdate();
    const router = useRouter();
    const { query } = router;
    console.log('query', query);
    //VARIABLES DE PARAMETROS
    let money_unit;
    let weight_unit;
    let changeValueField;
    let getValueField;
    let isFormikSubmitting;
    let setFormikSubmitting;
    //USE STATES
    const [isIgvChecked, setIsIgvChecked] = React.useState(query.igv || false);
    const [selectedClient, setSelectedClient] = React.useState(query.client);
    const [proofOfPaymentType, setProofOfPaymentType] = React.useState(
        query.proofOfPaymentType,
    );
    const [igvDefault, setIgvDefault] = React.useState(0);
    const [typeDialog, setTypeDialog] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [openStatus, setOpenStatus] = React.useState(false);
    const [showDelete, setShowDelete] = React.useState(false);
    const [showAlert, setShowAlert] = React.useState(false);
    const [moneyUnit, setMoneyUnit] = React.useState('');
    const [editTotal, setEditTotal] = React.useState(false);
    const [exchangeRate, setExchangeRate] = React.useState('');
    const prevExchangeRateRef = useRef();
    const [serial, setSerial] = React.useState('');
    const [registerType, setRegisterType] = React.useState(
        'saleWithProofOfPayment',
    );
    const [minTutorial, setMinTutorial] = React.useState(false);
    const [selectedSale, setSelectedSale] = React.useState('');
    //CALENDARIO
    //FUNCIONES DIALOG
    const [moneyToConvert, setMoneyToConvert] = React.useState('');

    const { listSalesRes, salesLastEvaluatedKey_pageListSales } = useSelector(
        ({ sale }) => sale,
    );
    const { listProducts } = useSelector(({ products }) => products);
    console.log('listProducts', listProducts);
    const { businessParameter } = useSelector(({ general }) => general);
    console.log('businessParameter', businessParameter);
    const { globalParameter } = useSelector(({ general }) => general);
    console.log('globalParameter123', globalParameter);
    const { updateSaleRes } = useSelector(({ movements }) => movements);
    console.log('updateSaleRes', updateSaleRes);
    const { successMessage } = useSelector(({ sale }) => sale);
    console.log('successMessage', successMessage);
    const { errorMessage } = useSelector(({ sale }) => sale);
    console.log('errorMessage', errorMessage);
    const { userDataRes } = useSelector(({ user }) => user);
    let defaultValues = {
        receiver: '',
        totalField: Number(query.totalPriceWithIgv - query.totalIgv),
        totalFieldIgv: Number(query.totalPriceWithIgv),
        money_unit: money_unit,
        clientEmail: query.clientEmail,
        transactionNumber: '',
    };
    const actualValues = {
        guide: '',
        receiver: '',
        totalField: '',
        totalFieldIgv: '',
        money_unit: '',
    };
    const toUpdateSale = (payload) => {
        dispatch(updateSale(payload));
    };
    useEffect(() => {
        prevExchangeRateRef.current = exchangeRate;
    });
    const prevExchangeRate = prevExchangeRateRef.current;

    const prevMoneyToConvertRef = useRef();

    useEffect(() => {
        prevMoneyToConvertRef.current = moneyToConvert;
    });
    const prevMoneyToConvert = prevMoneyToConvertRef.current;

    useEffect(() => {
        if (businessParameter) {
            dispatch({ type: FETCH_SUCCESS, payload: undefined });
            dispatch({ type: FETCH_ERROR, payload: undefined });

            let obtainedMoneyUnit = businessParameter.find(
                (obj) => obj.abreParametro == 'DEFAULT_MONEY_UNIT',
            ).value;
            let igvDefaultParam = businessParameter.find(
                (obj) => obj.abreParametro == 'IGV',
            ).value;
            setIgvDefault(igvDefaultParam);
            setIsIgvChecked(Number(igvDefaultParam) > 0 ? true : false);
            setMoneyUnit(obtainedMoneyUnit);
            setMoneyToConvert(obtainedMoneyUnit);

            console.log('moneyUnit', moneyUnit);

            console.log('query.saleId', query.saleId);
            let sale = listSalesRes.find((obj) => obj.saleId == query.saleId);
            setSelectedSale(sale);
            setSelectedClient({
                clientId: sale.client.id,
                denominationClient: sale.client.denomination,
                addressClient: sale.client.address,
                emailClient: sale.client.email,
                typeDocumentClient: sale.client.type,
            }),
                console.log('sale seleccionado', sale);
            if (sale.products) {
                selectedProducts = sale.products.map((obj) => {
                    let count = Number(obj.quantityMovement);
                    let price = Number(obj.unitPrice);
                    return {
                        product: obj.product,
                        description: obj.description,
                        unitMeasure: obj.unitMeasure,
                        stockChange: obj.stockChange,
                        customCodeProduct: obj.customCodeProduct,
                        businessProductCode: obj.product,
                        taxCode: obj.taxCode || '',
                        igvCode: obj.igvCode || '',
                        quantityMovement: count,
                        unitPrice: price,
                        subtotal: obj.subtotal || Number((price * count).toFixed(2)),
                    };
                });
            }
            console.log('selectedProducts', selectedProducts);

            let totalWithIgv = 0;
            let calculatedtotal = 0;
            selectedProducts.map((obj) => {
                calculatedtotal += Number(obj.subtotal);
                totalWithIgv +=
                    obj.taxCode == 1000 &&
                        Number(igvDefaultParam) > 0 &&
                        (Number(igvDefaultParam) > 0 ? true : false)
                        ? Number((Number(obj.subtotal) * (1 + igvDefaultParam)).toFixed(2))
                        : Number(obj.subtotal);
            });
            total = Number(calculatedtotal.toFixed(2));
            changeValueField('totalField', Number(calculatedtotal.toFixed(2)));
            changeValueField('totalFieldIgv', Number(totalWithIgv.toFixed(2)));
            forceUpdate();
            setTimeout(() => {
                setMinTutorial(true);
            }, 2000);
        }
    }, [businessParameter]);
    useEffect(() => {
        if (globalParameter && moneyUnit && prevMoneyToConvert !== moneyToConvert) {
            let obtainedExchangeRate = globalParameter.find(
                (obj) =>
                    obj.abreParametro == `ExchangeRate_${moneyToConvert}_${moneyUnit}`,
            ).value;
            setExchangeRate(obtainedExchangeRate);
            console.log('exchangeRate', exchangeRate);
        }
    }, [globalParameter && moneyUnit, moneyToConvert]);

    //SETEANDO PARAMETROS
    if (businessParameter != undefined) {
        weight_unit = businessParameter.find(
            (obj) => obj.abreParametro == 'DEFAULT_WEIGHT_UNIT',
        ).value;
    }
    const handleClickAway = () => {
      // Evita que se cierre el diálogo haciendo clic fuera del contenido
      // Puedes agregar condiciones adicionales aquí si deseas una lógica más específica.
    };

    const registerSuccess = () => {
        return (
          successMessage != undefined &&
          updateSaleRes != undefined &&
          !('error' in updateSaleRes)
        );
      };
    
      const registerError = () => {
        return (
          (successMessage != undefined &&
            updateSaleRes !== undefined &&
            'error' in updateSaleRes) ||
          errorMessage
        );
      };
    
    const getClient = (client) => {
        console.log('Estoy en el getClient');
        setSelectedClient(client);
        console.log('Cliente seleccionado', client);
        forceUpdate();
        setOpen(false);
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
                  {updateSaleRes !== undefined && 'error' in updateSaleRes
                    ? updateSaleRes.error
                    : null}
                </DialogContentText>
              </DialogContent>
              <DialogActions sx={{justifyContent: 'center'}}>
                <Button variant='outlined' onClick={() => setOpenStatus(false)}>
                  Aceptar
                </Button>
              </DialogActions>
            </>
          );
        } else {
          return <CircularProgress disableShrink sx={{mx: 'auto', my: '20px'}} />;
        }
      };
    const sendStatus = () => {
      if (registerSuccess()) {
        dispatch({type: UPDATE_SALE, payload: undefined});
        setOpenStatus(false);
        Router.push('/sample/sales/table');
      } else if (registerError()) {
        setOpenStatus(false);
      } else {
        setOpenStatus(false);
      }
    };
    const getNewProduct = (product) => {
      console.log('ver ahora nuevo producto', product);
      product.subtotal = Number(product.subtotal);
      console.log('ver ahora selectedProducts', selectedProducts);
      if (selectedProducts && selectedProducts.length >= 1) {
        selectedProducts.map((obj, index) => {
          console.log('obj', obj);
          if (
            obj.product == product.product &&
            obj.description == product.description &&
            obj.customCodeProduct == product.customCodeProduct
          ) {
            console.log('selectedProducts 1', selectedProducts);
            selectedProducts.splice(index, 1);
            console.log('selectedProducts 2', selectedProducts);
          }
        });
      }
      selectedProducts.push(product);
      let totalWithIgv = 0;
      let calculatedtotal = 0;
      selectedProducts.map((obj) => {
        calculatedtotal += Number(obj.subtotal);
        totalWithIgv +=
          obj.taxCode == 1000 && Number(igvDefault) > 0 && isIgvChecked
            ? Number((Number(obj.subtotal) * (1 + igvDefault)).toFixed(2))
            : Number(obj.subtotal);
      });
      total = Number(calculatedtotal.toFixed(2));
      changeValueField('totalField', Number(calculatedtotal.toFixed(2)));
      changeValueField('totalFieldIgv', Number(totalWithIgv.toFixed(2)));
      console.log('total de los productos', total);
      forceUpdate();
    };
  
    const handleData = (data, { setSubmitting }) => {
        dispatch({ type: FETCH_SUCCESS, payload: undefined });
        dispatch({ type: FETCH_ERROR, payload: undefined });
        dispatch({ type: UPDATE_SALE, payload: undefined });
        let finalPayload;
        const listTypeIgvCode = {
            1000: 10,
            9997: 20,
            9998: 30,
        };
        // Validar si hay al menos un producto
        if (selectedProducts && selectedProducts.length >= 1) {
            setSubmitting(true);
            try {
                finalPayload = {
                    request: {
                        payload: {
                            saleId: query.saleId,
                            merchantId: userDataRes.merchantSelected.merchantId,
                            exchangeRate: exchangeRate,
                            moneyUnit: moneyToConvert,
                            clientId:
                                selectedClient && selectedClient.clientId
                                    ? selectedClient.clientId
                                    : '',
                            client: {
                                id: selectedClient.clientId || '',
                                denomination:
                                    selectedClient.denominationClient || 'Cliente No Definido',
                                address: selectedClient.addressClient || '',
                                email: selectedClient.emailClient || '',
                                type: selectedClient.typeDocumentClient || '',
                            },
                            totalPriceWithIgv: Number(data.totalFieldIgv.toFixed(2)),
                            observation: data.observation ? data.observation : '',
                            igv: isIgvChecked ? Number(igvDefault) : 0,
                            productsInfo: selectedProducts.map((obj) => {
                                return {
                                    product: obj.product || obj.businessProductCode,
                                    quantityMovement: Number(obj.quantityMovement),
                                    unitPrice: Number(obj.unitPrice),
                                    stockChange: obj.stockChange,
                                    category: obj.category || '',
                                    customCodeProduct: obj.customCodeProduct,
                                    description: obj.description,
                                    unitMeasure: obj.unitMeasure,
                                    businessProductCode: obj.businessProductCode,
                                    taxCode: obj.taxCode,
                                    igvCode: listTypeIgvCode[`${obj.taxCode}`],
                                };
                            }),
                            userUpdated: userDataRes.userId,
                            userUpdatedMetadata: {
                                nombreCompleto: userDataRes.nombreCompleto,
                                email: userDataRes.email,
                            },
                        },
                    },
                };
            } catch (error) {
                console.log('Este es el error al generar el payload', error);
                throw new Error('Algo pasa al crear el payload de boleta');
            }
            console.log('finalPayload', finalPayload);
            toUpdateSale(finalPayload);
            console.log('Data formulario principal', finalPayload);
            setOpenStatus(true);
            setSubmitting(false);
        } else {
            typeAlert = 'product';
            setShowAlert(true);
            setSubmitting(false);
        }
    };

    const handleMoney = (event) => {
        console.log('evento onchange', event);
        setMoneyToConvert(event.target.value);
        Object.keys(actualValues).map((key) => {
            if (key == event.target.name) {
                actualValues[key] = event.target.value;
            }
        });
        console.log('actualValues', actualValues);
    };

    const handleIGV = (event, isInputChecked) => {
        if (isInputChecked) {
            let totalWithIgv = 0;
            if (selectedProducts.length == 0) {
                total = 0;
            } else {
                let calculatedtotal = 0;
                selectedProducts = selectedProducts.map((obj) => {
                    obj.taxCode = 1000;
                    calculatedtotal += obj.subtotal;
                    totalWithIgv +=
                        obj.taxCode == 1000 && Number(igvDefault) > 0 && isInputChecked
                            ? Number((obj.subtotal * (1 + igvDefault)).toFixed(2))
                            : obj.subtotal;
                    return obj;
                });
                total = calculatedtotal;
            }
            changeValueField('totalField', Number(total.toFixed(2)));
            changeValueField('totalFieldIgv', Number(totalWithIgv.toFixed(2)));
            forceUpdate();
        } else {
            let totalWithIgv = 0;
            if (selectedProducts.length == 0) {
                total = 0;
            } else {
                let calculatedtotal = 0;
                selectedProducts = selectedProducts.map((obj) => {
                    obj.taxCode = 9998;
                    calculatedtotal += obj.subtotal;
                    totalWithIgv +=
                        obj.taxCode == 1000 && Number(igvDefault) > 0 && isInputChecked
                            ? Number((obj.subtotal * (1 + igvDefault)).toFixed(2))
                            : obj.subtotal;
                    return obj;
                });
                total = calculatedtotal;
            }
            changeValueField('totalField', Number(total.toFixed(2)));
            changeValueField('totalFieldIgv', Number(totalWithIgv.toFixed(2)));
            forceUpdate();
        }
        setIsIgvChecked(isInputChecked);
        console.log('Evento de IGV cbx', isInputChecked);
    };
    const handleClose = () => {
      setOpen(false);
    };
    const closeDelete = () => {
      setShowDelete(false);
    };
    const handleClickOpen = (type) => {
        setOpen(true);
        setTypeDialog(type);
        setShowAlert(false);
    };
    const cancel = () => {
        setShowDelete(true);
    };
    const valueWithIGV = (value) => {
        const IGV = igvDefault;
        const precioConIGV = (value * (1 + IGV)).toFixed(10);
        return precioConIGV;
    };
    const removeProduct = (index) => {
        selectedProducts.splice(index, 1);
        let totalWithIgv = 0;
        if (selectedProducts.length == 0) {
            total = 0;
        } else {
            let calculatedtotal = 0;
            selectedProducts.map((obj) => {
                calculatedtotal += obj.subtotal;
                totalWithIgv +=
                    obj.taxCode == 1000 && Number(igvDefault) > 0 && isIgvChecked
                        ? Number((obj.subtotal * (1 + igvDefault)).toFixed(2))
                        : obj.subtotal;
            });
            total = calculatedtotal;
        }
        changeValueField('totalField', Number(total.toFixed(2)));
        changeValueField('totalFieldIgv', Number(totalWithIgv.toFixed(2)));
        forceUpdate();
    };
    const changeTaxCode = (index, taxCode) => {
        console.log('selectedProducts wtf', selectedProducts);
        console.log('selectedProducts index', index);

        console.log('selectedProducts product', selectedProducts[index]);
        console.log('selectedProducts taxCode', taxCode);
        const subTotalWithPreviousTaxCode =
            selectedProducts[index].taxCode == 1000 &&
                Number(igvDefault) > 0 &&
                isIgvChecked
                ? Number(
                    (selectedProducts[index].subtotal * (1 + igvDefault)).toFixed(2),
                )
                : Number(selectedProducts[index].subtotal);
        const subTotalWithNextTaxCode =
            taxCode == 1000 && Number(igvDefault) > 0 && isIgvChecked
                ? Number(
                    (selectedProducts[index].subtotal * (1 + igvDefault)).toFixed(2),
                )
                : Number(selectedProducts[index].subtotal);
        let calculatedtotalIgv =
            getValueField('totalFieldIgv').value -
            subTotalWithPreviousTaxCode +
            subTotalWithNextTaxCode;

        let actualProduct = {
            ...selectedProducts[index],
            taxCode: taxCode,
        };
        console.log('selectedProducts product 2', actualProduct);
        selectedProducts = selectedProducts.map((obj, i) => {
            if (i == index) {
                return actualProduct;
            } else {
                return obj;
            }
        });
        changeValueField('totalFieldIgv', Number(calculatedtotalIgv.toFixed(2)));
        forceUpdate();
    };
    const changeUnitMeasure = (index, unitMeasure) => {
        console.log('selectedProducts product', selectedProducts[index]);
        console.log('selectedProducts unitMeasure', unitMeasure);
        selectedProducts[index].unitMeasure = unitMeasure;
        forceUpdate();
    };
    const changeQuantity = (index, quantity) => {
        console.log('selectedProducts product', selectedProducts[index]);
        console.log('selectedProducts quantity', quantity);
        const subTotalWithPreviousQuantity =
            selectedProducts[index].taxCode == 1000 &&
                Number(igvDefault) > 0 &&
                isIgvChecked
                ? Number(
                    (selectedProducts[index].subtotal * (1 + igvDefault)).toFixed(2),
                )
                : Number(selectedProducts[index].subtotal);
        const subTotalWithNextQuantity =
            selectedProducts[index].taxCode == 1000 &&
                Number(igvDefault) > 0 &&
                isIgvChecked
                ? Number(
                    (
                        quantity *
                        selectedProducts[index].unitPrice *
                        (1 + igvDefault)
                    ).toFixed(2),
                )
                : Number(quantity * selectedProducts[index].unitPrice);

        let calculatedTotal =
            getValueField('totalField').value +
            (quantity - selectedProducts[index].quantityMovement) *
            selectedProducts[index].unitPrice;

        selectedProducts[index].quantityMovement = quantity;
        selectedProducts[index].subtotal =
            quantity * selectedProducts[index].unitPrice;
        let calculatedtotalIgv =
            getValueField('totalFieldIgv').value -
            subTotalWithPreviousQuantity +
            subTotalWithNextQuantity;
        total = Number(calculatedTotal.toFixed(2));
        changeValueField('totalField', Number(calculatedTotal.toFixed(2)));
        changeValueField('totalFieldIgv', Number(calculatedtotalIgv.toFixed(2)));
        forceUpdate();
    };
    return (
        <Card sx={{ p: 4 }}>
            <Box sx={{ width: 1, textAlign: 'center' }}>
                <Typography
                    sx={{ mx: 'auto', my: '10px', fontWeight: 600, fontSize: 25 }}
                >
                    ACTUALIZAR VENTA
                </Typography>
            </Box>
            <Box>
                <AppPageMeta />

                <Formik
                    validateOnChange={true}
                    validationSchema={validationSchema}
                    initialValues={{ ...defaultValues }}
                    onSubmit={handleData}
                >
                    {({ isSubmitting, setFieldValue, getFieldProps, setSubmitting }) => {
                        changeValueField = setFieldValue;
                        getValueField = getFieldProps;
                        setFormikSubmitting = setSubmitting;
                        isFormikSubmitting = isSubmitting;
                        return (
                            <Form
                                noValidate
                                autoComplete='on'
                            /* onChange={handleActualData} */
                            >
                                <Grid container sx={{ maxWidth: 500, margin: 'auto' }}>
                                    <Grid sx={{ px: 1, mt: 2 }} xs={12}>
                                        <Button
                                            sx={{ width: 1 }}
                                            variant='outlined'
                                            onClick={handleClickOpen.bind(this, 'client')}
                                        >
                                            Selecciona un cliente
                                        </Button>
                                    </Grid>
                                    <Grid sx={{ px: 1, mt: 2 }} xs={11}>
                                        <Typography sx={{ mx: 'auto', my: '10px' }}>
                                            Cliente:{' '}
                                            {selectedClient && selectedClient.denominationClient
                                                ? selectedClient.denominationClient
                                                : 'No Definido'}
                                        </Typography>
                                    </Grid>
                                    {selectedClient && selectedClient.denominationClient ? (
                                        <Grid sx={{ px: 1, mt: 2 }} xs={1}>
                                            <IconButton
                                                sx={{ width: 1 }}
                                                onClick={() => {
                                                    setSerial('S');
                                                    setProofOfPaymentType('ticket');
                                                    setSelectedClient('Cliente No Definido');
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Grid>
                                    ) : null}
                                </Grid>

                                <Grid
                                    container
                                    spacing={2}
                                    sx={{ maxWidth: 500, mx: 'auto', mb: 4, mt: 4 }}
                                >

                                    <Grid xs={6} sm={4} sx={{ px: 1, mt: 2 }}>
                                        <FormControl fullWidth sx={{ my: 2 }}>
                                            <InputLabel id='moneda-label' style={{ fontWeight: 200 }}>
                                                Moneda
                                            </InputLabel>
                                            <Select
                                                value={moneyToConvert}
                                                name='money_unit'
                                                labelId='moneda-label'
                                                label='Moneda'
                                                onChange={handleMoney}
                                            >
                                                <MenuItem value='USD' style={{ fontWeight: 200 }}>
                                                    Dólares
                                                </MenuItem>
                                                <MenuItem value='PEN' style={{ fontWeight: 200 }}>
                                                    Soles
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    {registerType == 'saleWithProofOfPayment' ? (
                                        <Grid xs={6} sm={4} sx={{ px: 1, mt: 2 }}>
                                            <AppTextField
                                                label={`Total ${moneyUnit} sin IGV`}
                                                name='totalField'
                                                disabled
                                                variant='outlined'
                                                sx={{
                                                    width: '100%',
                                                    '& .MuiInputBase-input': {
                                                        fontSize: 14,
                                                    },
                                                    my: 2,
                                                }}
                                            />
                                        </Grid>
                                    ) : null}
                                    <Grid xs={6} sm={4} sx={{ px: 1, mt: 2 }}>
                                        <AppTextField
                                            label={`Total ${moneyUnit} con IGV`}
                                            name='totalFieldIgv'
                                            disabled
                                            variant='outlined'
                                            sx={{
                                                width: '100%',
                                                '& .MuiInputBase-input': {
                                                    fontSize: 14,
                                                },
                                                my: 2,
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        xs={6}
                                        sm={4}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            px: 1,
                                            mt: 2,
                                            mr: 0,
                                        }}
                                    >
                                        <FormControlLabel
                                            label='IGV'
                                            disabled={Number(igvDefault) > 0 ? false : true}
                                            checked={isIgvChecked}
                                            sx={{ mr: 1 }}
                                            control={<Checkbox onChange={handleIGV} />}
                                        />
                                        {igvDefault}
                                    </Grid>
                                    <Grid xs={12} sx={{ px: 1, mt: 2, my: 2 }}>
                                        <Button
                                            sx={{ width: 1 }}
                                            variant='outlined'
                                            onClick={handleClickOpen.bind(this, 'product')}
                                        >
                                            Añade productos
                                        </Button>
                                    </Grid>
                                </Grid>

                                {selectedProducts && selectedProducts.length > 0 ? (
                                    <>
                                        <Divider sx={{ my: 3 }} />
                                        <ProductsList
                                            data={selectedProducts}
                                            valueWithIGV={valueWithIGV}
                                            toDelete={removeProduct}
                                            toChangeTaxCode={changeTaxCode}
                                            toChangeUnitMeasure={changeUnitMeasure}
                                            toChangeQuantity={changeQuantity}
                                            igvEnabled={
                                                Number(igvDefault) > 0 && isIgvChecked ? true : false
                                            }
                                        ></ProductsList>
                                    </>
                                ) : null}
                                <Divider sx={{ my: 3 }} />
                                <ButtonGroup
                                    orientation='vertical'
                                    variant='outlined'
                                    sx={{ width: 1 }}
                                    aria-label='outlined button group'
                                >
                                    <Button
                                        color='primary'
                                        sx={{ mx: 'auto', width: '50%', py: 3 }}
                                        type='submit'
                                        variant='contained'
                                        disabled={isSubmitting}
                                        startIcon={<SaveAltOutlinedIcon />}
                                    >
                                        Finalizar
                                    </Button>
                                    <Button
                                        sx={{ mx: 'auto', width: '50%', py: 3 }}
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
                                            top: { xs: 325, xl: 305 },
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
                                                onClick={() => window.open('https://www.youtube.com/')}
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
                                            top: { xs: 325, xl: 305 },
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
                                                onClick={() => window.open('https://www.youtube.com/')}
                                            >
                                                VER TUTORIAL
                                            </IconButton>
                                        </Box>
                                    </Box>
                                )}
                            </Form>)
                    }}
                </Formik>
            </Box>

            <ClickAwayListener onClickAway={handleClickAway}>
                <Dialog
                    open={openStatus}
                    onClose={sendStatus}
                    sx={{ textAlign: 'center' }}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                >
                    <DialogTitle sx={{ fontSize: '1.5em' }} id='alert-dialog-title'>
                        {'Registro de Comprobante'}
                    </DialogTitle>
                    {showMessage()}
                </Dialog>
            </ClickAwayListener>
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
                    sx={{ mb: 2 }}
                >
                    {typeAlert == 'product'
                        ? 'Por favor selecciona al menos un producto.'
                        : null}
                    {typeAlert == 'client' ? 'Por favor selecciona un cliente.' : null}
                </Alert>
            </Collapse>
            <Dialog
                open={open}
                onClose={handleClose}
                sx={{ textAlign: 'center' }}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                {typeDialog == 'product' ? (
                    <>
                        <DialogTitle sx={{ fontSize: '1.5em' }} id='alert-dialog-title'>
                            {'Selecciona los productos'}
                            <CancelOutlinedIcon
                                onClick={setOpen.bind(this, false)}
                                className={classes.closeButton}
                            />
                        </DialogTitle>
                        <DialogContent>
                            <AddProductForm
                                type='sale'
                                igvDefault={Number(igvDefault)}
                                sendData={getNewProduct}
                                igvEnabled={
                                    Number(igvDefault) > 0 && isIgvChecked ? true : false
                                }
                            />
                        </DialogContent>
                    </>
                ) : null}
                {typeDialog == 'client' ? (
                    <>
                        <DialogTitle sx={{ fontSize: '1.5em' }} id='alert-dialog-title'>
                            {'Búsqueda de clientes'}
                            <CancelOutlinedIcon
                                onClick={setOpen.bind(this, false)}
                                className={classes.closeButton}
                            />
                        </DialogTitle>
                        <DialogContent>
                            <AddClientForm sendData={getClient} />
                        </DialogContent>
                    </>
                ) : (
                    <></>
                )}
            </Dialog>
            <Dialog
                open={showDelete}
                onClose={closeDelete}
                sx={{ textAlign: 'center' }}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle sx={{ fontSize: '1.5em' }} id='alert-dialog-title'>
                    Actualizar Venta
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
                    <PriorityHighIcon sx={{ fontSize: '6em', mx: 2, color: red[500] }} />
                    <DialogContentText
                        sx={{ fontSize: '1.2em', m: 'auto' }}
                        id='alert-dialog-description'
                    >
                        Desea cancelar esta operación?. <br /> Se perderá la información
                        ingresada
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button
                        variant='outlined'
                        onClick={() => {
                            setShowDelete(false);
                            Router.push('/sample/sales/table');
                        }}
                    >
                        Sí
                    </Button>
                    <Button variant='outlined' onClick={closeDelete}>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>)
}
export default UpdateSale  