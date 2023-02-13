import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import {
    IconButton,
    TextField,
    Button,
    Grid,
    Collapse,
    Box,
    Typography,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    Autocomplete,
    FormControl,
    MenuItem,
    Select,
    InputLabel,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper
} from '@mui/material';

import IntlMessages from '../../../@crema/utility/IntlMessages';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';

import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import TransformIcon from '@mui/icons-material/Transform';

import PropTypes from 'prop-types';

import originalUbigeos from '../../../Utils/ubigeo.json';
import SelectCarrier from '../ReferralGuide/SelectCarrier';
import SelectProduct from '../AddExisingProduct/SelectProduct';


import { fixDecimals, isEmpty, dateWithHyphen } from '../../../Utils/utils';
import { FETCH_ERROR } from '../../../shared/constants/ActionTypes';
const EditRouteDeliveryModal = ({
    selectedDeliveryState,
    editFunction,
}) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { messages } = useIntl();
    const [parsedUbigeos, setParsedUbigeos] = React.useState([]);

    const [temporaryDelivery, setTemporaryDelivery] = React.useState("");

    const [openCarrierDialog, setOpenCarrierDialog] = React.useState(false);
    const [openSelectProductDialog, setOpenSelectProductDialog] = React.useState(false);

    const [productsList, setProductsList] = React.useState("");
    const [indexProduct, setIndexProduct] = React.useState(null);
    const [counter, setCounter] = React.useState(1);

    const { listProducts } = useSelector(({ products }) => products);
    const [reload, setReload] = React.useState(false);

    const emptyProduct = {
        description: '',
        count: 0,
        weight: 0,
        productId: null,
        inputProduct: false,
        invalidate: false,
    };

    useEffect(() => {
        const ubigeos = originalUbigeos.map((obj, index) => {
            return {
                label: `${obj.descripcion} - ${obj.ubigeo}`,
                ...obj,
            };
        });
        setParsedUbigeos(ubigeos);
        if (selectedDeliveryState) {
            console.log("hola, estás?")
            const startingObjUbigeo = ubigeos.find(
                (ubigeo) => ubigeo.ubigeo == selectedDeliveryState.startingPointUbigeo,
            );
            console.log('initial starting address', startingObjUbigeo);
            const arrivalObjUbigeo = ubigeos.find(
                (ubigeo) => ubigeo.ubigeo == selectedDeliveryState.arrivalPointUbigeo,
            );
            console.log('initial arrival address', arrivalObjUbigeo);

            let newProds = [];
            let internalCounter = 1;
            let productsToSet = selectedDeliveryState.products || selectedDeliveryState.productsInfo || [];
            productsToSet.forEach((prod) => {
                let originalProduct = getOriginalProduct(prod.productId);
                newProds.push({
                    ...originalProduct,
                    count: prod.quantityMovement || prod.count,
                    weight: originalProduct.weight || 0.1,
                    invalidate: false,
                    inputProduct: false,
                    rowId: internalCounter,
                });
                internalCounter += 1;
            });
            setCounter(internalCounter);
            setProductsList(newProds);
            // newProds.forEach((prod) => {
            //     changeValue(`count${prod.rowId}`, prod.count);
            // });


            const newSelectedDeliveryState = {
                ...selectedDeliveryState,
                startingObjUbigeo: startingObjUbigeo,
                arrivalObjUbigeo: arrivalObjUbigeo,
            }

            setTemporaryDelivery(newSelectedDeliveryState);
        }
    }, []);
    useEffect(() => {
        if (productsList && temporaryDelivery) {
            console.log("productsList", productsList)
            setTemporaryDelivery({
                ...temporaryDelivery,
                products: productsList
            })

            reloadPage();
        }
    }, [productsList])

    const reloadPage = () => {
        setReload(!reload);
    };
    const getOriginalProduct = (productId) => {
        return listProducts.find((prod) => prod.productId == productId);
    };
    const openSelectCarrier = () => {
        setOpenCarrierDialog(true);
    };
    const closeSelectCarrier = () => {
        setOpenCarrierDialog(false);
    };
    const saveCarrier = (carrier) => {
        setTemporaryDelivery({
            ...temporaryDelivery,
            carrierDenomination: carrier.denominationCarrier ? carrier.denominationCarrier : carrier.carrierDenomination,
            carrierDocumentType: carrier.typeDocumentCarrier ? carrier.typeDocumentCarrier : carrier.carrierDocumentType,
            carrierDocumentNumber: carrier.numberDocumentCarrier ? carrier.numberDocumentCarrier : carrier.carrierDocumentNumber,
        })
        console.log('Transportista', carrier);
        console.log('Nuevo Delivery Transportista', temporaryDelivery);
        setOpenCarrierDialog(false);
    };
    const updateDelivery = (event) => {
        console.log("updateDelivery ejecutándose")
        event.preventDefault();
        let newTemporaryDelivery = {
            ...temporaryDelivery,
            startingAddress: event.target.startingAddress.value,
            arrivalAddress: event.target.startingAddress.value,
            driverDocumentNumber: event.target.driverDocumentNumber.value,
            driverName: event.target.driverName.value,
            driverLastName: event.target.driverLastName.value,
            driverLicenseNumber: event.target.driverLicenseNumber.value,
            plate: event.target.plate.value,
            products: productsList,
            numberPackages: event.target.numberPackages.value,
            observationDelivery: event.target.observationDelivery.value,
        }
        setTemporaryDelivery(newTemporaryDelivery);
        editFunction(newTemporaryDelivery);
    };
    const handleDriverDocumentField = (event) => {
        setTemporaryDelivery({
            ...temporaryDelivery,
            driverDocumentType: event.target.value
        });
    };
    const setTotalWeight = (products) => {
        let totalWeight = 0;
        products.forEach((prod) => {
            if (!prod.invalidate) {
                totalWeight += fixDecimals(prod.count * prod.weight);
            }
        });
        setTemporaryDelivery({
            ...temporaryDelivery,
            totalWeight: fixDecimals(totalWeight)
        });
    };
    const showTotalWeight = (weight, count) => {
        if (weight && count) return fixDecimals(weight * count);
    };
    const getNewProduct = (product) => {
        console.log('nuevo producto', product);
        const productExists = productsList.some((obj) => obj.rowId === product.rowId || obj.productId === product.productId);

        if (!productExists) {
            const newProds = [...productsList];
            newProds[indexProduct] = { ...newProds[indexProduct], ...product };
            setTotalWeight(newProds);
            setProductsList(newProds);
            reloadPage();
        } else {
            dispatch({
                type: FETCH_ERROR,
                payload: messages['error.repeat.product'],
            });
        }

        setOpenSelectProductDialog(false);
    };
    const deleteProduct = (rowId) => {
        let newProds = productsList;
        console.log('lista antes', newProds);
        newProds = newProds.filter((item) => item.rowId !== rowId);
        console.log('lista despues', newProds);
        setProductsList(newProds);
        setTotalWeight(newProds);
        reloadPage();
    };
    const addRow = () => {
        let newProds = productsList;
        console.log('lista antes', newProds);
        newProds.push({ ...emptyProduct, rowId: counter });
        console.log('lista despues', newProds);
        setCounter(counter + 1);
        setProductsList(newProds);
        reloadPage();
    };
    const addInputToProducts = (preCount, rowIdSelected, newProducts) => {
        let newProds = productsList.filter(p => p.rowId !== rowIdSelected);
        let valToMultiply = isNaN(preCount) || preCount === '' || preCount === 0 ? 1 : preCount;
        let internCounter = counter;
        newProducts.forEach(prod => {
            let existingProduct = productsList.find(p => p.product === prod.productId.replace(/^(0+)/g, '').split('-')[0]);
            if (existingProduct) {
                existingProduct.count += fixDecimals(valToMultiply * Number(prod.quantity));
                //existingProduct.weight += fixDecimals(valToMultiply * Number(prod.quantity))*existingProduct.weight;
            } else {
                newProds.push({
                    ...prod,
                    rowId: internCounter,
                    count: fixDecimals(valToMultiply * Number(prod.quantity)),
                    weight: 'weight' in prod ? Number(prod.weight) : 0.1,
                    inputProduct: true,
                    invalidate: false,
                    product: prod.productId.replace(/^(0+)/g, '').split('-')[0],
                })
                internCounter = internCounter + 1;

            }
        });
        setCounter(internCounter);
        setProductsList(newProds);
        setTotalWeight(newProds);
        reloadPage();
    };

    const toInputs = (index, rowId, inputsProduct, preCount) => {
        //const preCount = productsList.find((prod) => prod.rowId == rowId).count;

        addInputToProducts(preCount, rowId, inputsProduct);
        reloadPage();
    };
    const setCountOfProduct = (rowId, count) => {
        console.log(`valores rowid: ${rowId} count: ${count}`);
        const newProds = productsList;
        console.log('lista antes', productsList);
        const foundIndex = newProds.findIndex((prod) => prod.rowId == rowId);
        const prod = newProds[foundIndex];
        prod.count = count ? fixDecimals(Number(count)) : 0;
        setTotalWeight(newProds);
        setProductsList(newProds);
        console.log('lista despues', productsList);
    };
    const handleChange = (event) => {
        console.log("Detecta")
        if (event.target.name.includes('count')) {
            const rowId = event.target.name.replace('count', '');
            setCountOfProduct(rowId, event.target.value);
        }
    };
    return temporaryDelivery ? (
        <>
            <form onSubmit={updateDelivery} onChange={handleChange}>
                <Grid container spacing={2} sx={{ width: 'auto' }}>
                    <Grid item xs={12} sm={8} sx={{ mt: 2 }}>
                        <Button
                            sx={{ width: 1 }}
                            variant='outlined'
                            onClick={() => openSelectCarrier()}
                        >
                            <IntlMessages id='message.selectCarrier' />
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography sx={{ mx: 'auto', my: '10px' }}>
                            {temporaryDelivery.carrierDenomination}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                        <Collapse in={!temporaryDelivery.carrierDenomination}>
                            <Alert severity='error' sx={{ mb: 2 }}>
                                <IntlMessages id='message.error.selectCarrier' />
                            </Alert>
                        </Collapse>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <Autocomplete
                            disablePortal
                            id='combo-box-demo'
                            value={temporaryDelivery.startingObjUbigeo}
                            isOptionEqualToValue={(option, value) =>
                                option.ubigeo == value.ubigeo
                            }
                            getOptionLabel={(option) => option.label || ''}
                            onChange={(event, value) => {
                                if (
                                    typeof value === 'object' &&
                                    value != null &&
                                    value !== ''
                                ) {
                                    console.log('objeto ubigeo', value);
                                    setTemporaryDelivery({
                                        ...temporaryDelivery,
                                        startingObjUbigeo: value,
                                        startingPointUbigeo: value.ubigeo,

                                    })
                                }
                                console.log('ubigeo, punto de partida', value);
                            }}
                            options={parsedUbigeos}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={
                                        <IntlMessages id='ubigeo.startingDistrictUbigeo' />
                                    }
                                />
                            )}
                        />
                        <Collapse in={!temporaryDelivery.startingObjUbigeo}>
                            <Alert severity='error' sx={{ mb: 2 }}>
                                <IntlMessages id='message.importantSelectStartingUbigeo' />
                            </Alert>
                        </Collapse>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label={
                                <IntlMessages id='common.busines.startingDirection' />
                            }
                            defaultValue={temporaryDelivery.startingAddress}
                            name='startingAddress'
                            variant='outlined'
                            sx={{
                                width: '100%',
                                '& .MuiInputBase-input': {
                                    fontSize: 14,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <Autocomplete
                            disablePortal
                            id='combo-box-demo'
                            value={temporaryDelivery.arrivalObjUbigeo}
                            isOptionEqualToValue={(option, value) =>
                                option.ubigeo == value.ubigeo
                            }
                            getOptionLabel={(option) => option.label || ''}
                            onChange={(event, value) => {
                                if (
                                    typeof value === 'object' &&
                                    value != null &&
                                    value !== ''
                                ) {
                                    console.log('objeto ubigeo', value);
                                    setTemporaryDelivery({
                                        ...temporaryDelivery,
                                        arrivalObjUbigeo: value,
                                        arrivalPointUbigeo: value.ubigeo,

                                    })
                                }
                                console.log('ubigeo, punto de llegada', value);
                            }}
                            options={parsedUbigeos}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={
                                        <IntlMessages id='ubigeo.arrivalDistrictUbigeo' />
                                    }
                                />
                            )}
                        />
                        <Collapse in={!temporaryDelivery.arrivalObjUbigeo}>
                            <Alert severity='error' sx={{ mb: 2 }}>
                                <IntlMessages id='message.importantSelectArrivalUbigeo' />
                            </Alert>
                        </Collapse>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label={
                                <IntlMessages id='common.busines.arrivalDirection' />
                            }
                            defaultValue={temporaryDelivery.arrivalAddress}
                            name='arrivalAddress'
                            variant='outlined'
                            sx={{
                                width: '100%',
                                '& .MuiInputBase-input': {
                                    fontSize: 14,
                                },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography sx={{ m: 2 }}>
                            <IntlMessages id='common.driver.data' />
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <TextField
                            label={<IntlMessages id='common.busines.driver.name' />}
                            defaultValue={temporaryDelivery.driverName}
                            name='driverName'
                            variant='outlined'
                            sx={{
                                width: '100%',
                                '& .MuiInputBase-input': {
                                    fontSize: 14,
                                },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <TextField
                            label={<IntlMessages id='common.busines.driver.lastName' />}
                            defaultValue={temporaryDelivery.driverLastName}
                            name='driverLastName'
                            variant='outlined'
                            sx={{
                                width: '100%',
                                '& .MuiInputBase-input': {
                                    fontSize: 14,
                                },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth>
                            <InputLabel
                                id='documentType-label'
                                style={{ fontWeight: 200 }}
                            >
                                <IntlMessages id='common.busines.documentType' />
                            </InputLabel>
                            <Select
                                name='documentType'
                                labelId='documentType-label'
                                label={
                                    <IntlMessages id='common.busines.documentType' />
                                }
                                displayEmpty
                                onChange={handleDriverDocumentField}
                                value={temporaryDelivery.driverDocumentType.toUpperCase()}
                            >
                                <MenuItem value='RUC' style={{ fontWeight: 200 }}>
                                    RUC
                                </MenuItem>
                                <MenuItem value='DNI' style={{ fontWeight: 200 }}>
                                    DNI
                                </MenuItem>
                                <MenuItem value='CE' style={{ fontWeight: 200 }}>
                                    CE
                                </MenuItem>
                                <MenuItem value='VARIOUS' style={{ fontWeight: 200 }}>
                                    Varios
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label={
                                <IntlMessages id='common.busines.driver.document.number' />
                            }
                            name='driverDocumentNumber'
                            defaultValue={temporaryDelivery.driverDocumentNumber}
                            variant='outlined'
                            sx={{
                                width: '100%',
                                '& .MuiInputBase-input': {
                                    fontSize: 14,
                                },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <TextField
                            label={<IntlMessages id='common.busines.driver.licenseNumber' />}
                            name='driverLicenseNumber'
                            defaultValue={temporaryDelivery.driverLicenseNumber}
                            variant='outlined'
                            sx={{
                                width: '100%',
                                '& .MuiInputBase-input': {
                                    fontSize: 14,
                                },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <TextField
                            label={<IntlMessages id='common.busines.plate' />}
                            name='plate'
                            variant='outlined'
                            defaultValue={temporaryDelivery.plate}
                            placeholder='ABC-123'
                            sx={{
                                width: '100%',
                                '& .MuiInputBase-input': {
                                    fontSize: 14,
                                },
                            }}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ width: 'auto', mt: 1 }}>
                    <Grid item xs={12}>
                        <Typography sx={{ m: 2 }}>
                            <IntlMessages id='common.load.data' />
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <TextField
                            label={<IntlMessages id='common.busines.weigth' />}
                            //defaultValue={temporaryDelivery.totalWeight}
                            disabled
                            value={temporaryDelivery.totalWeight}
                            name='totalWeight'
                            variant='outlined'
                            sx={{
                                width: '100%',
                                '& .MuiInputBase-input': {
                                    fontSize: 14,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label={
                                <IntlMessages id='common.busines.packages.number' />
                            }
                            name='numberPackages'
                            defaultValue={temporaryDelivery.numberPackages}
                            variant='outlined'
                            sx={{
                                width: '100%',
                                '& .MuiInputBase-input': {
                                    fontSize: 14,
                                },
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography sx={{ m: 2 }}>
                            <IntlMessages id='sidebar.ecommerce.products' />
                        </Typography>
                    </Grid>
                    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                        <Table stickyHeader size='small' aria-label='simple table'>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>
                                        <IntlMessages id='product.type.product' />
                                    </TableCell>
                                    <TableCell align='center'>
                                        <IntlMessages id='common.amount' />
                                    </TableCell>
                                    <TableCell align='center'>
                                        <IntlMessages id='common.busines.weigth' />
                                    </TableCell>
                                    <TableCell align='center'>
                                        <IntlMessages id='common.busines.total.weigth' />
                                    </TableCell>
                                    <TableCell align='center'>
                                        <IntlMessages id='product.type.transform.rawMaterial' />
                                    </TableCell>
                                    <TableCell align='center'>
                                        <IntlMessages id='mailApp.remove' />
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {productsList
                                    ? productsList.map((obj, index) => {
                                        if (obj && obj.invalidate !== true) {
                                            return (
                                                <TableRow
                                                    sx={{
                                                        '&:last-child td, &:last-child th': {
                                                            border: 0,
                                                        },
                                                    }}
                                                    key={index}
                                                >
                                                    <TableCell>
                                                        <Button
                                                            variant='text'
                                                            href='#contained-buttons'
                                                            sx={{
                                                                color: 'black',
                                                                fontWeight: '400',
                                                            }}
                                                            disabled={obj.invalidate}
                                                            onClick={() => {
                                                                setIndexProduct(index);
                                                                setOpenSelectProductDialog(true);
                                                            }}
                                                        >
                                                            {obj.description ? (
                                                                obj.description
                                                            ) : (
                                                                <IntlMessages id='sidebar.ecommerce.selectProduct' />
                                                            )}
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            label={
                                                                obj.productId ? (
                                                                    <IntlMessages id='common.amount' />
                                                                ) : (
                                                                    <IntlMessages id='validation.select.product' />
                                                                )
                                                            }
                                                            name={`count${obj.rowId}`}
                                                            defaultValue={obj.count}
                                                            value={obj.count}
                                                            disabled={!obj.productId}
                                                            variant='outlined'
                                                            sx={{
                                                                my: 2,
                                                                width: '100%',
                                                                '& .MuiInputBase-input': {
                                                                    fontSize: 14,
                                                                },
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align='center'>
                                                        <Typography>{obj.weight}</Typography>
                                                    </TableCell>
                                                    <TableCell align='center'>
                                                        <Typography>
                                                            {showTotalWeight(obj.weight, obj.count)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align='center'>
                                                        <IconButton
                                                            aria-label='delete'
                                                            disabled={
                                                                obj.invalidate ||
                                                                (obj.typeProduct !=
                                                                    'intermediateProduct' && obj.typeProduct != 'endProduct')
                                                                || obj.count == 0
                                                            }
                                                            onClick={() =>
                                                                toInputs(
                                                                    index,
                                                                    obj.rowId,
                                                                    obj.inputsProduct,
                                                                    obj.count
                                                                )
                                                            }
                                                        >
                                                            {(obj.typeProduct ===
                                                                'intermediateProduct' || obj.typeProduct === 'endProduct') ? (
                                                                <TransformIcon />
                                                            ) : null}
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell align='center'>
                                                        <IconButton
                                                            disabled={obj.invalidate}
                                                            onClick={() => deleteProduct(obj.rowId)}
                                                            aria-label='delete'
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        } else {
                                            return null;
                                        }
                                    })
                                    : null}
                                <TableRow>
                                    <TableCell align='center' colSpan={6}>
                                        <IconButton
                                            onClick={() => {
                                                addRow();
                                            }}
                                            aria-label='delete'
                                            size='large'
                                        >
                                            <AddIcon fontSize='inherit' />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Grid item xs={12}>
                        <TextField
                            label='Observación'
                            name='observationDelivery'
                            defaultValue={temporaryDelivery.observationDelivery}
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
                </Grid>
                <Button type="submit" variant='outlined'>
                    Editar
                </Button>
            </form>


            <Dialog
                open={openSelectProductDialog}
                onClose={() => setOpenSelectProductDialog(false)}
                maxWidth='lg'
                sx={{ textAlign: 'center' }}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle sx={{ fontSize: '1.5em' }} id='alert-dialog-title'>
                    {<IntlMessages id='sidebar.ecommerce.selectProduct' />}
                </DialogTitle>
                <DialogContent sx={{ justifyContent: 'center' }}>
                    <SelectProduct fcData={getNewProduct} search={false} />
                </DialogContent>
            </Dialog>

            <Dialog
                open={openCarrierDialog}
                onClose={closeSelectCarrier}
                sx={{ textAlign: 'center' }}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
                maxWidth='xl'
            >
                <DialogTitle sx={{ fontSize: '1.5em' }} id='alert-dialog-title'>
                    <Box sx={{ mx: 10 }}>Selecciona un transportista</Box>
                    <IconButton
                        aria-label='close'
                        onClick={closeSelectCarrier}
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
                <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
                    <SelectCarrier fcData={saveCarrier} />
                </DialogContent>
            </Dialog>
        </>
    ) : null;
};

export default EditRouteDeliveryModal;

EditRouteDeliveryModal.defaultProps = {
};

EditRouteDeliveryModal.propTypes = {
    selectedDeliveryState: PropTypes.object,
    editFunction: PropTypes.func,
};
