import React, { useEffect } from 'react';
import {
    Divider,
    Card,
    Box,
    Typography,
    Button,
    Stack,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    DialogContentText,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    LinearProgress,
} from '@mui/material';

import { ClickAwayListener } from '@mui/base';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { red } from '@mui/material/colors';
import PropTypes from 'prop-types';
import { Fonts } from '../../../shared/constants/AppEnums';
import { makeStyles } from '@mui/styles';
import Router, { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import SettingsIcon from '@mui/icons-material/Settings';

import {
    FETCH_SUCCESS,
    FETCH_ERROR,
    CLEAR_S3_OBJECTS,
} from '../../../shared/constants/ActionTypes';
import {
    clearS3Objects
} from '../../../redux/actions/Admin';
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

function LinearProgressWithLabel(props) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant='determinate' {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
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

const CleanUp = (props) => {
    const classes = useStyles(props);
    const dispatch = useDispatch();
    const router = useRouter();
    const { query } = router; //query es el objeto seleccionado
    console.log('query', query);
    //USE STATES
    const [selectedFolder, setSelectedFolder] = React.useState('provisional');
    const { userDataRes } = useSelector(({ user }) => user);
    const { successMessage } = useSelector(({ admin }) => admin);
    console.log('successMessage', successMessage);
    const { errorMessage } = useSelector(({ admin }) => admin);
    console.log('errorMessage', errorMessage);
    const [openStatus, setOpenStatus] = React.useState(false);
    const [openCleanConfirmation, setOpenCleanConfirmation] = React.useState(false);
    const { clearS3ObjectsRes } = useSelector(({ admin }) => admin);
    //GET APIS RES
    const toClearS3Objects = (payload) => {
        dispatch(clearS3Objects(payload));
    };

    const handleClickAway = () => {
        // Evita que se cierre el diálogo haciendo clic fuera del contenido
        // Puedes agregar condiciones adicionales aquí si deseas una lógica más específica.
    };

    const handleCloseCleanConfirmation = () => {
        setOpenCleanConfirmation(false);
    };

    const onCleanUpHandler = () => {
        let clearPayload = {
            request: {
                payload: {
                    type: selectedFolder,
                },
            },
        };
        dispatch({ type: FETCH_SUCCESS, payload: undefined });
        dispatch({ type: FETCH_ERROR, payload: undefined });
        dispatch({ type: CLEAR_S3_OBJECTS, payload: undefined });
        console.log('clearPayload',clearPayload)
        toClearS3Objects(clearPayload);
        setOpenCleanConfirmation(false);
        setOpenStatus(true);
    };

    const handleFieldFolder = (event) => {
        console.log('evento SelectedFolder', event);
        setSelectedFolder(event.target.value);
    }

    const showMessage = () => {
        if (clearS3ObjectsRes && clearS3ObjectsRes.deleted >= 0) {
            return (
                <>
                    <CheckCircleOutlineOutlinedIcon
                        color='success'
                        sx={{ fontSize: '6em', mx: 2 }}
                    />
                    <DialogContentText
                        sx={{ fontSize: '1.2em', m: 'auto' }}
                        id='alert-dialog-description'
                    >
                        Se ha limpiado correctamente
                    </DialogContentText>
                </>
            );
        } else if (
            clearS3ObjectsRes &&
            clearS3ObjectsRes.name == 'Error'
        ) {
            return (
                <>
                    <CancelOutlinedIcon sx={{ fontSize: '6em', mx: 2, color: red[500] }} />
                    <DialogContentText
                        sx={{ fontSize: '1.2em', m: 'auto' }}
                        id='alert-dialog-description'
                    >
                        {clearS3ObjectsRes.error}
                    </DialogContentText>
                </>
            );
        } else {
            return <CircularProgress disableShrink />;
        }
    };

    return userDataRes ? (
        <>
            <Card sx={{ p: 4 }}>
                <Typography
                    component='h3'
                    sx={{
                        fontSize: 16,
                        fontWeight: Fonts.BOLD,
                        mb: { xs: 3, lg: 4 },
                    }}
                >
                    <IntlMessages id='common.admin.cleanUp' />
                </Typography>
                <Stack
                    direction='row'
                    spacing={2}
                    sx={{ display: 'flex', alignItems: 'center' }}
                >
                    <FormControl fullWidth>
                        <InputLabel
                            id='folder-label'
                            style={{ fontWeight: 200 }}
                        >
                            Carpeta
                        </InputLabel>
                        <Select
                            value={selectedFolder}
                            name='folder'
                            labelId='folder-label'
                            label='Carpeta'
                            onChange={handleFieldFolder}
                        >
                            <MenuItem
                                value='qr'
                                style={{ fontWeight: 200 }}
                            >
                                {'QR'}
                            </MenuItem>
                            <MenuItem
                                value='provisional'
                                style={{ fontWeight: 200 }}
                            >
                                {'Provisional'}
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        startIcon={<SettingsIcon />}
                        variant='contained'
                        color='primary'
                        onClick={() => setOpenCleanConfirmation(true)}
                    >
                        Limpiar
                    </Button>
                </Stack>
                <Divider sx={{ my: 2 }} />
                {clearS3ObjectsRes && successMessage && !clearS3ObjectsRes.error ? (
                    <>
                        <CheckCircleOutlineOutlinedIcon
                            color='success'
                            sx={{ fontSize: '1.5em', mx: 2 }}
                        />
                        {clearS3ObjectsRes
                            ? `Se limpiaron ${clearS3ObjectsRes.deleted} objetos con ${clearS3ObjectsRes.errors} errores`
                            : 'Limpieza exitosa'}
                    </>
                ) : (
                    <></>
                )}
                {(clearS3ObjectsRes && clearS3ObjectsRes.error) || errorMessage ? (
                    <>
                        <CancelOutlinedIcon
                            sx={{ fontSize: '1.5em', mx: 2, color: red[500] }}
                        />
                        {clearS3ObjectsRes && clearS3ObjectsRes.error
                            ? clearS3ObjectsRes.error
                            : 'Hubo un error durante el proceso'}
                    </>
                ) : (
                    <></>
                )}
            </Card>

            <ClickAwayListener onClickAway={handleClickAway}>
                <Dialog
                    open={openStatus}
                    onClose={() => setOpenStatus(false)}
                    sx={{ textAlign: 'center' }}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'
                >
                    <DialogTitle sx={{ fontSize: '1.5em' }} id='alert-dialog-title'>
                        {`Limpieza de la carpeta ${selectedFolder}`}
                    </DialogTitle>
                    <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
                        {showMessage()}
                    </DialogContent>
                    {clearS3ObjectsRes ? (
                        <>
                            <DialogActions sx={{ justifyContent: 'center' }}>
                                <Button variant='outlined' onClick={() => setOpenStatus(false)}>
                                    Aceptar
                                </Button>
                            </DialogActions>
                        </>
                    ) : (
                        <></>
                    )}
                </Dialog>
            </ClickAwayListener>
            <Dialog
                open={openCleanConfirmation}
                onClose={handleCloseCleanConfirmation}
                sx={{ textAlign: 'center' }}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle sx={{ fontSize: '1.5em' }} id='alert-dialog-title'>
                    {`Limpieza de la carpeta ${selectedFolder}`}
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
                    <PriorityHighIcon sx={{ fontSize: '6em', mx: 2, color: red[500] }} />
                    <DialogContentText
                        sx={{ fontSize: '1.2em', m: 'auto' }}
                        id='alert-dialog-description'
                    >
                        ¿Desea eliminar realmente todos los archivos? Esta
                        operación no podrá revertirse
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button variant='outlined' onClick={onCleanUpHandler}>
                        Sí
                    </Button>
                    <Button variant='outlined' onClick={handleCloseCleanConfirmation}>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    ) : (
        <></>
    );
};

export default CleanUp;
