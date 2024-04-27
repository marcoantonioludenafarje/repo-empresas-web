import React, {useEffect} from 'react';
import {
  Divider,
  Card,
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
} from '@mui/material';

import IntlMessages from '../../../@crema/utility/IntlMessages';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';

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

import {makeStyles} from '@mui/styles';
import Router, {useRouter} from 'next/router';
import {getUserData} from '../../../redux/actions/User';

import {
  getData,
  generatePresigned,
  uploadFile,
  deleteObject,
  changeNameObject,
  downloadZip,
} from '../../../redux/actions/FileExplorer';
import {
  FETCH_SUCCESS,
  FETCH_ERROR,
  GET_DATA,
  CHANGE_NAME_OBJECT,
  DOWNLOAD_ZIP,
  GET_USER_DATA,
} from '../../../shared/constants/ActionTypes';
import {useDispatch, useSelector} from 'react-redux';
import {array} from 'prop-types';

const listDefaultNames = [
  'Papelera de Reciclaje',
  'entradas',
  'movimientos_contables',
  'productos',
  'salidas',
  'zipCollection',
];
const maxLength = 11111111111111111111; //20 caracteres
const validationSchema = yup.object({
  name: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />)
    .required(<IntlMessages id='validation.required' />)
    .matches(/^[a-z0-9\s]+$/i, 'No se permiten caracteres especiales'),
});

import {ClickAwayListener} from '@mui/base';
const defaultValues = {
  name: '',
};

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

let typeForm = '';
let fileToUpload;
let urlToUpload;
let toUpload = false;
let loadThis = '';
let oneLoad = true;
let checkStatus = false;
let selectedObject = {};
let typeAlert = '';

const FileExplorer = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [actualPath, setActualPath] = React.useState('');
  const [openDelete, setOpenDelete] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const router = useRouter();
  const {query} = router; //query es el objeto seleccionado
  console.log('query', query);

  //GET APIS RES
  const {getDataRes} = useSelector(({fileExplorer}) => fileExplorer);
  console.log('getDataRes', getDataRes);
  const {deleteObjectRes} = useSelector(({fileExplorer}) => fileExplorer);
  console.log('deleteObjectRes', deleteObjectRes);
  const {getPresignedRes} = useSelector(({fileExplorer}) => fileExplorer);
  console.log('getPresignedRes', getPresignedRes);
  const {uploadFileRes} = useSelector(({fileExplorer}) => fileExplorer);
  console.log('uploadFileRes', uploadFileRes);
  const {changeNameObjectRes} = useSelector(({fileExplorer}) => fileExplorer);
  console.log('changeNameObjectRes', changeNameObjectRes);
  const {downloadZipRes} = useSelector(({fileExplorer}) => fileExplorer);
  console.log('downloadZipRes', downloadZipRes);
  const {successMessage} = useSelector(({fileExplorer}) => fileExplorer);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({fileExplorer}) => fileExplorer);
  console.log('errorMessage', errorMessage);
  const {userAttributes} = useSelector(({user}) => user);
  const {userDataRes} = useSelector(({user}) => user);

  let listGetFilesPath = localStorage.getItem('pathsBack').split(',');
  console.log('Lista inicial de paths para listar archivo', listGetFilesPath);
  listGetFilesPath = listGetFilesPath.filter((path) =>
    path.includes('/utility/listObjectsPathMerchant?path='),
  );
  console.log('Lista de paths para listar archivos', listGetFilesPath);
  let getDataPayload = {
    request: {
      payload: {
        path: actualPath,
      },
    },
  };
  listGetFilesPath = listGetFilesPath.map((path) => {
    let path2 = path.split('/')[3];
    return path2;
  });
  console.log('Lista final de paths para listar archivos', listGetFilesPath);

  const existQuery = () => {
    return query && query.goDirectory;
  };

  console.log('redirectUrl', JSON.parse(localStorage.getItem('redirectUrl')));
  const existStorage = () => {
    const data = JSON.parse(localStorage.getItem('redirectUrl'));
    return data && data.goDirectory && data.path;
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
  //
  useEffect(() => {
    if (userDataRes) {
      dispatch({type: FETCH_SUCCESS, payload: undefined});
      dispatch({type: FETCH_ERROR, payload: undefined});
      dispatch({type: GET_DATA, payload: undefined});

      getDataPayload.request.payload.merchantId =
        userDataRes.merchantSelected.merchantId;

      toGetData(getDataPayload);
    }
  }, [userDataRes]);
  useEffect(() => {
    if (existStorage()) {
      const data = JSON.parse(localStorage.getItem('redirectUrl'));
      console.log('data xd', data);
      getDataPayload.request.payload.path = data.path;
      setActualPath(data.path);
      localStorage.setItem('redirectUrl', null);
    } else if (existQuery()) {
      getDataPayload.request.payload.path = query.path;
      setActualPath(query.path);
    }
  }, []);

  const toGetData = (payload) => {
    dispatch(getData(payload));
  };
  const toGeneratePresigned = (payload) => {
    dispatch(generatePresigned(payload));
  };
  const toUploadFile = (url, data) => {
    dispatch(uploadFile(url, data));
  };
  const toDeleteProduct = (url, data) => {
    dispatch(deleteObject(url, data));
  };
  const toChangeNameObject = (payload) => {
    dispatch(changeNameObject(payload));
  };
  const toDownloadZip = (payload) => {
    dispatch(downloadZip(payload));
  };

  console.log('actualPath principal', actualPath);

  if (getPresignedRes != undefined) {
    urlToUpload = getPresignedRes.response.payload.presignedS3Url;
    console.log('urlToUpload', urlToUpload);
  }

  if (urlToUpload && fileToUpload && toUpload) {
    toUploadFile(getPresignedRes.response.payload.presignedS3Url, fileToUpload);
    toUpload = false;
  }

  if (
    uploadFileRes &&
    uploadFileRes.status != undefined &&
    loadThis == 'uploadFile'
  ) {
    console.log('estado de la subida', uploadFileRes.status);
    console.log('Todo correcto al subir el archivo');
    let getDataPayload = {
      request: {
        payload: {
          path: actualPath,
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };
    dispatch({type: GET_DATA, payload: []});
    setTimeout(() => {
      toGetData(getDataPayload);
    }, 2000);
    loadThis = '';
  }

  const openFolder = (path) => {
    let newPath;
    if (actualPath === '') {
      newPath = path;
    } else {
      newPath = actualPath + '/' + path;
    }
    let getDataPayload = {
      request: {
        payload: {
          path: actualPath,
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };
    console.log('newPath', newPath);
    setActualPath(newPath);
    getDataPayload.request.payload.path = newPath;
    console.log('actualPath', actualPath);
    console.log('getDataPayload', getDataPayload);
    dispatch({type: GET_DATA, payload: []});
    toGetData(getDataPayload);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const back = () => {
    let levels = actualPath.split('/');
    levels.pop();
    let getDataPayload = {
      request: {
        payload: {
          path: actualPath,
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };
    levels = levels.join('/');
    console.log('newPath', levels);
    setActualPath(levels);
    console.log('actualPath', actualPath);
    getDataPayload.request.payload.path = levels;
    console.log('getDataPayload', getDataPayload);
    dispatch({type: GET_DATA, payload: []});
    toGetData(getDataPayload);
  };

  const sendStatus = () => {
    setOpenStatus(false);
  };

  const handleClickAway = () => {
    // Evita que se cierre el diálogo haciendo clic fuera del contenido
    // Puedes agregar condiciones adicionales aquí si deseas una lógica más específica.
  };
  const showMessage = () => {
    if (successMessage != undefined) {
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
            Se ha eliminado el elemento <br />
            correctamente
          </DialogContentText>
        </>
      );
    } else if (errorMessage) {
      return (
        <>
          <CancelOutlinedIcon sx={{fontSize: '6em', mx: 2, color: red[500]}} />
          <DialogContentText
            sx={{fontSize: '1.2em', m: 'auto'}}
            id='alert-dialog-description'
          >
            Se ha producido un error al eliminar.
          </DialogContentText>
        </>
      );
    } else {
      return <></>;
    }
  };

  const createFolder = (data, {setSubmitting}) => {
    setSubmitting(true);
    console.log('data', data);
    console.log('typeForm', typeForm);
    fileToUpload = 'initialFolder';
    let changeNameObjPayload = {
      request: {
        payload: {
          merchantId: userDataRes.merchantSelected.merchantId,
          path: '',
          newPath: '',
          isFolder: false,
        },
      },
    };
    let generateFolderPayload = {
      request: {
        payload: {
          key: 'initialFolder',
          path: '',
          action: 'putObject',
          merchantId: userDataRes.merchantSelected.merchantId,
          contentType: 'text/plain',
          isFolder: true,
        },
      },
    };
    let getDataPayload = {
      request: {
        payload: {
          path: actualPath,
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };
    let nameObject =
      typeof selectedObject === 'object'
        ? selectedObject.nameWithoutExtension
        : selectedObject;
    /* generatePresignedPayload.request.payload.key = data.name;
    generatePresignedPayload.request.payload.contentType = 'text/plain'; */
    if (actualPath === '') {
      generateFolderPayload.request.payload.path = data.name;
      changeNameObjPayload.request.payload.path = nameObject;
      changeNameObjPayload.request.payload.newPath = data.name;
    } else {
      generateFolderPayload.request.payload.path = actualPath + '/' + data.name;
      changeNameObjPayload.request.payload.path = `${actualPath}/${nameObject}`;
      changeNameObjPayload.request.payload.newPath = `${actualPath}/${data.name}`;
    }
    changeNameObjPayload.request.payload.isFolder =
      typeof selectedObject !== 'object';
    if (typeForm == 'newFolder') {
      dispatch({type: GET_DATA, payload: []});
      toGeneratePresigned(generateFolderPayload);
    } else if (typeForm == 'changeName') {
      dispatch({type: CHANGE_NAME_OBJECT, payload: []});
      toChangeNameObject(changeNameObjPayload);
    } else {
      null;
    }
    setOpen(false);
    setTimeout(() => {
      toGetData(getDataPayload);
    }, 2000);
    checkStatus = true;
    /* toUpload = true;
    loadThis = 'uploadFile'; */
    setSubmitting(false);
  };

  const uploadNewFile = (event) => {
    if (event.target.value !== '') {
      typeForm = 'newFile';
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
      generatePresignedPayload.request.payload.path = actualPath;
      generatePresignedPayload.request.payload.contentType = fileToUpload.type;
      toGeneratePresigned(generatePresignedPayload);
      toUpload = true;
      loadThis = 'uploadFile';
      /* setOpenStatus(true); */
    } else {
      event = null;
      console.log('no se selecciono un archivo');
    }
  };
  const setDeleteState = (obj) => {
    selectedObject = obj;
    console.log('selectedObject', selectedObject);
    typeAlert = 'delete';
    setOpen2(true);
  };
  const changeName = (obj) => {
    selectedObject = obj;
    console.log('selectedObject', selectedObject);
    typeForm = 'changeName';
    setOpen(true);
  };

  const confirmDelete = () => {
    setOpen2(false);
    let nameObject =
      typeof selectedObject !== 'object'
        ? selectedObject
        : selectedObject.nameWithoutExtension;
    let pathObject =
      actualPath === '' ? nameObject : `${actualPath}/${nameObject}`;
    console.log('Path de objeto', pathObject);
    let deleteObjectPayload = {
      request: {
        payload: {
          merchantId: userDataRes.merchantSelected.merchantId,
          objects: [],
        },
      },
    };
    deleteObjectPayload.request.payload.objects = [
      {path: pathObject, isFolder: typeof selectedObject !== 'object'},
    ];
    toDeleteProduct(deleteObjectPayload);
    setOpenStatus(true);
  };
  const handleOpenStatus = () => {
    setOpenStatus(false);
    let getDataPayload = {
      request: {
        payload: {
          path: actualPath,
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };
    dispatch({type: GET_DATA, payload: []});
    setTimeout(() => {
      toGetData(getDataPayload);
    }, 1000);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };

  const download = (url) => {
    const fileName = url.split('/').pop();
    var el = document.createElement('a');
    el.setAttribute('href', url);
    el.setAttribute('download', fileName);
    document.body.appendChild(el);
    el.click();
    el.remove();
  };

  const getZipFolder = (folder) => {
    let newPath;
    if (actualPath === '') {
      newPath = folder;
    } else {
      newPath = `${actualPath}/${folder}`;
    }
    let downloadZipPayload = {
      request: {
        payload: {
          merchantId: userDataRes.merchantSelected.merchantId,
          objects: [
            {
              path: '',
              isFolder: null,
            },
          ],
          pathStream: '',
          zipFileName: '',
        },
      },
    };
    downloadZipPayload.request.payload.objects[0].path = newPath;
    downloadZipPayload.request.payload.objects[0].isFolder = true;
    downloadZipPayload.request.payload.pathStream = actualPath;
    let randomValue = Math.floor(Math.random() * (10000 - 1)) + 1;
    downloadZipPayload.request.payload.zipFileName = `${folder}-${randomValue}.zip`;
    console.log('Path para setear', newPath);
    dispatch({type: DOWNLOAD_ZIP, payload: undefined});
    toDownloadZip(downloadZipPayload);
  };

  useEffect(() => {
    if (typeof downloadZipRes === 'string') {
      window.open(downloadZipRes);
      reloadData();
      /* dispatch({type: DOWNLOAD_ZIP, payload: undefined}); */
    }
  }, [downloadZipRes]);

  const reloadData = () => {
    let getDataPayload = {
      request: {
        payload: {
          path: actualPath,
          merchantId: userDataRes.merchantSelected.merchantId,
        },
      },
    };
    dispatch({type: GET_DATA, payload: []});
    toGetData(getDataPayload);
  };
  return (
    <>
      <Card sx={{p: 4}}>
        <Stack
          direction='row'
          spacing={2}
          sx={{display: 'flex', alignItems: 'center'}}
        >
          <IconButton
            disabled={
              (!listGetFilesPath.some(function (arrVal) {
                return actualPath.split('/')[0] === arrVal;
              }) ||
                (actualPath.split('/').length == 1 &&
                  !localStorage
                    .getItem('pathsBack')
                    .includes('/utility/listObjectsPathMerchant?path=/*'))) &&
              !localStorage
                .getItem('pathsBack')
                .includes('/utility/listObjectsPathMerchant?path=/*')
            }
            aria-label='upload picture'
            component='span'
            onClick={back}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            sx={{
              my: '10px',
              letterSpacing: 2,
              fontWeight: 'medium',
              color: '#424242',
            }}
          >
            {actualPath}
          </Typography>
        </Stack>
        <Divider sx={{my: 2}} />

        <Grid container justifyContent='space-between' alignItems='center'>
          <Grid item>
            <Stack direction='row' spacing={2} alignItems='center'>
              <Button
                disabled={
                  !localStorage
                    .getItem('pathsBack')
                    .includes('/utility/preSignAnyPathMerchant?path=/*')
                }
                variant='contained'
                color='primary'
                onClick={() => {
                  typeForm = 'newFolder';
                  setOpen(true);
                }}
              >
                Nueva carpeta
              </Button>

              <Button
                disabled={
                  !localStorage
                    .getItem('pathsBack')
                    .includes('/utility/preSignAnyPathMerchant?path=/*')
                }
                variant='contained'
                color='primary'
                component='label'
              >
                Nuevo Archivo
                <input
                  type='file'
                  hidden
                  onChange={uploadNewFile}
                  id='newFile'
                  name='newfile'
                />
              </Button>
            </Stack>
          </Grid>

          {getDataRes &&
          getDataRes.objects &&
          typeof getDataRes.objects !== 'string' ? (
            <Grid item>
              <Typography
                sx={{
                  letterSpacing: 2,
                  fontWeight: 'medium',
                  color: '#424242',
                  textAlign: 'right',
                  mr: 4,
                }}
              >
                {`Cantidad de archivos: ${
                  getDataRes.objects
                    ? getDataRes.objects.some(
                        (obj) =>
                          obj.nameFile == 'initialFolder.txt' ||
                          obj.nameFile == 'initialFolder',
                      )
                      ? getDataRes.objects.length - 1
                      : getDataRes.objects.length
                    : 0
                }`}
              </Typography>
            </Grid>
          ) : null}
        </Grid>
        <Divider sx={{my: 2}} />

        <TableContainer component={Paper} sx={{maxHeight: 440, width: '100%'}}>
          <TableHead>
            <TableRow>
              <TableCell sx={{width: '80%'}}>Nombre</TableCell>

              {/* <TableCell align='right' sx={{width: '10%'}}>
                Descargar
              </TableCell> */}
              <TableCell align='center' sx={{width: '10%'}}>
                Descargar zip
              </TableCell>
              <TableCell align='center' sx={{width: '10%'}}>
                Cambiar Nombre
              </TableCell>
              <TableCell align='center' sx={{width: '10%'}}>
                Eliminar
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getDataRes &&
            getDataRes.nameFolders &&
            typeof getDataRes.nameFolders !== 'string' ? (
              getDataRes.nameFolders.map((folder, index) => {
                if (folder !== 'zipCollection2') {
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        '&:last-child td, &:last-child th': {border: 0},
                        cursor: 'pointer',
                      }}
                      hover
                    >
                      {listGetFilesPath.some(function (arrVal) {
                        if (actualPath == '') {
                          return folder === arrVal;
                        } else {
                          return actualPath.split('/')[0] === arrVal;
                        }
                      }) === true ||
                      localStorage
                        .getItem('pathsBack')
                        .includes(
                          '/utility/listObjectsPathMerchant?path=/*',
                        ) ? (
                        <TableCell
                          sx={{alignItems: 'center'}}
                          onClick={() => openFolder(folder)}
                        >
                          <FolderOpenOutlinedIcon className={classes.icon} />
                          {folder}
                        </TableCell>
                      ) : null}
                      {/* <TableCell
                        align='right'
                        sx={{textAlign: 'center'}}
                        onClick={{}}
                      ></TableCell> */}
                      {localStorage
                        .getItem('pathsBack')
                        .includes(
                          '/utility/generateZipObjectsPathMerchant?path=/*',
                        ) === true ? (
                        <TableCell align='right' sx={{textAlign: 'center'}}>
                          <IconButton
                            disabled={
                              !localStorage
                                .getItem('pathsBack')
                                .includes(
                                  '/utility/generateZipObjectsPathMerchant?path=/*',
                                )
                            }
                            onClick={() => getZipFolder(folder)}
                          >
                            <FolderZipIcon />
                          </IconButton>
                        </TableCell>
                      ) : null}

                      {localStorage
                        .getItem('pathsBack')
                        .includes(
                          '/utility/changeNameObjectsPathMerchant?path=/*',
                        ) === true ? (
                        <TableCell align='right' sx={{textAlign: 'center'}}>
                          {!actualPath && !listDefaultNames.includes(folder) ? (
                            <IconButton
                              disabled={
                                !localStorage
                                  .getItem('pathsBack')
                                  .includes(
                                    '/utility/changeNameObjectsPathMerchant?path=/*',
                                  )
                              }
                              onClick={changeName.bind(this, folder)}
                            >
                              <EditIcon />
                            </IconButton>
                          ) : null}
                        </TableCell>
                      ) : null}
                      {localStorage
                        .getItem('pathsBack')
                        .includes(
                          '/utility/deleteObjectsPathMerchant?path=/*',
                        ) === true ? (
                        <TableCell align='right' sx={{textAlign: 'center'}}>
                          {!actualPath && !listDefaultNames.includes(folder) ? (
                            <IconButton
                              disabled={
                                !localStorage
                                  .getItem('pathsBack')
                                  .includes(
                                    '/utility/deleteObjectsPathMerchant?path=/*',
                                  )
                              }
                              onClick={setDeleteState.bind(this, folder)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          ) : null}
                        </TableCell>
                      ) : null}
                    </TableRow>
                  );
                }
              })
            ) : (
              <CircularProgress
                disableShrink
                sx={{m: '10px', position: 'relative'}}
              />
            )}
            {getDataRes &&
            getDataRes.objects &&
            typeof getDataRes.objects !== 'string' ? (
              getDataRes.objects
                .filter(
                  (obj) =>
                    obj.nameFile !== 'initialFolder.txt' &&
                    obj.nameFile !== 'initialFolder',
                )
                .sort((a, b) => a.nameFile.localeCompare(b.nameFile)) // Ordena por el valor de nameFile
                .map((obj, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      '&:last-child td, &:last-child th': {border: 0},
                      cursor: 'pointer',
                    }}
                    hover
                  >
                    {listGetFilesPath.some(function (arrVal) {
                      return actualPath.split('/')[0] === arrVal;
                    }) === true ||
                    localStorage
                      .getItem('pathsBack')
                      .includes('/utility/listObjectsPathMerchant?path=/*') ? (
                      <TableCell
                        sx={{alignItems: 'center'}}
                        onClick={() => window.open(obj.UrlFile)}
                      >
                        <InsertDriveFileOutlinedIcon className={classes.icon} />
                        {obj.nameFile}
                      </TableCell>
                    ) : null}
                    {/* <TableCell align='right' sx={{textAlign: 'center'}}>
                          <FileDownloadIcon
                            onClick={download.bind(this, obj.UrlFile)}
                          />
                        </TableCell> */}
                    <TableCell
                      align='right'
                      sx={{textAlign: 'center'}}
                    ></TableCell>

                    {localStorage
                      .getItem('pathsBack')
                      .includes(
                        '/utility/changeNameObjectsPathMerchant?path=/*',
                      ) === true ? (
                      <TableCell align='right' sx={{textAlign: 'center'}}>
                        <IconButton
                          disabled={
                            !localStorage
                              .getItem('pathsBack')
                              .includes(
                                '/utility/changeNameObjectsPathMerchant?path=/*',
                              )
                          }
                          onClick={changeName.bind(this, obj)}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    ) : null}

                    {localStorage
                      .getItem('pathsBack')
                      .includes(
                        '/utility/deleteObjectsPathMerchant?path=/*',
                      ) === true ? (
                      <TableCell align='right' sx={{textAlign: 'center'}}>
                        <IconButton
                          disabled={
                            !localStorage
                              .getItem('pathsBack')
                              .includes(
                                '/utility/deleteObjectsPathMerchant?path=/*',
                              )
                          }
                          onClick={setDeleteState.bind(this, obj)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))
            ) : (
              <></>
            )}
            {!getDataRes ? <></> : null}

            <TableRow
              sx={{
                '&:last-child td, &:last-child th': {border: 0},
                cursor: 'pointer',
              }}
              hover
            >
              {/* <TableCell
                sx={{display: 'flex', alignItems: 'center'}}
                onClick={() => {
                  window
                    .open(
                      'https://d2moc5ro519bc0.cloudfront.net/merchant/51a26ecdafd549f2913a7080a49190c9/productos/11002233/PruebaGoogleDrive',
                      '_blank',
                    )
                    .focus();
                }}
              >
                <img
                  className={classes.icon}
                  src='https://d2moc5ro519bc0.cloudfront.net/merchant/51a26ecdafd549f2913a7080a49190c9/productos/11002233/PruebaGoogleDrive'
                />
                Imagen prueba
              </TableCell> */}
            </TableRow>
          </TableBody>
        </TableContainer>
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth='lg'
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
          {'Crear Carpeta'}
        </DialogTitle>
        <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
          <Formik
            validateOnChange={true}
            validationSchema={validationSchema}
            initialValues={{...defaultValues}}
            onSubmit={createFolder}
          >
            {({isSubmitting}) => {
              return (
                <>
                  <Form
                    style={{textAlign: 'left', justifyContent: 'center'}}
                    noValidate
                    autoComplete='on'
                  >
                    <Stack
                      sx={{m: 2}}
                      direction='row'
                      spacing={2}
                      className={classes.stack}
                    >
                      <AppTextField
                        label='Nombre de archivo'
                        name='name'
                        htmlFor='filled-adornment-password'
                        variant='outlined'
                        sx={{
                          width: '100%',
                          '& .MuiInputBase-input': {
                            fontSize: 14,
                          },
                          my: 2,
                        }}
                      />
                      <Button
                        color='primary'
                        type='submit'
                        variant='contained'
                        size='small'
                        sx={{height: 50, top: '8px'}}
                        disabled={isSubmitting}
                      >
                        Agregar
                      </Button>
                    </Stack>
                  </Form>
                </>
              );
            }}
          </Formik>
        </DialogContent>
      </Dialog>

      <Dialog
        open={open2}
        onClose={handleClose2}
        sx={{textAlign: 'center'}}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        {typeAlert == 'delete' ? (
          <>
            <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
              {'Eliminar Archivo'}
            </DialogTitle>
            <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
              <PriorityHighIcon
                sx={{fontSize: '6em', mx: 2, color: red[500]}}
              />
              <DialogContentText
                sx={{fontSize: '1.2em', m: 'auto'}}
                id='alert-dialog-description'
              >
                ¿Desea eliminar realmente el elemento seleccionado?
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{justifyContent: 'center'}}>
              <Button variant='outlined' onClick={confirmDelete}>
                Sí
              </Button>
              <Button variant='outlined' onClick={handleClose2}>
                No
              </Button>
            </DialogActions>
          </>
        ) : (
          <></>
        )}
        {typeAlert == 'changeName' ? (
          <>
            <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
              {'Cambio de nombre'}
            </DialogTitle>
            <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
              <PriorityHighIcon
                sx={{fontSize: '6em', mx: 2, color: red[500]}}
              />
              <DialogContentText
                sx={{fontSize: '1.2em', m: 'auto'}}
                id='alert-dialog-description'
              ></DialogContentText>
            </DialogContent>
          </>
        ) : (
          <></>
        )}
      </Dialog>

      <ClickAwayListener onClickAway={handleClickAway}>
        <Dialog
          open={openStatus}
          onClose={handleOpenStatus}
          sx={{textAlign: 'center'}}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
            {'Eliminar Archivo'}
          </DialogTitle>
          <DialogContent sx={{display: 'flex', justifyContent: 'center'}}>
            {showMessage()}
          </DialogContent>
          <DialogActions sx={{justifyContent: 'center'}}>
            <Button variant='outlined' onClick={handleOpenStatus}>
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      </ClickAwayListener>
    </>
  );
};

export default FileExplorer;
