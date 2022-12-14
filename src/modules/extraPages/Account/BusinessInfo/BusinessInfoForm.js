import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {alpha, Box, Button, Typography} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import AppGridContainer from '../../../../@crema/core/AppGridContainer';
import Grid from '@mui/material/Grid';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {
  CustomizerItemWrapper,
  StyledToggleButton,
} from '../../../../@crema/core/AppThemeSetting/index.style';

import clsx from 'clsx';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
} from '@mui/material';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {useDropzone} from 'react-dropzone';
import {Form} from 'formik';
import PropTypes from 'prop-types';
import AppTextField from '../../../../@crema/core/AppFormComponents/AppTextField';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {styled} from '@mui/material/styles';
import {Fonts} from '../../../../shared/constants/AppEnums';
import {makeStyles} from '@mui/styles';

import {createPresigned} from '../../../../redux/actions/General';
import {updateUser} from '../../../../redux/actions/User';
const AvatarViewWrapper = styled('div')(({theme}) => {
  return {
    position: 'relative',
    cursor: 'pointer',
    '& .edit-icon': {
      position: 'absolute',
      bottom: 0,
      right: 0,
      zIndex: 1,
      border: `solid 2px ${theme.palette.background.paper}`,
      backgroundColor: alpha(theme.palette.primary.main, 0.7),
      color: theme.palette.primary.contrastText,
      borderRadius: '50%',
      width: 26,
      height: 26,
      display: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.4s ease',
      cursor: 'pointer',
      '& .MuiSvgIcon-root': {
        fontSize: 16,
      },
    },
    '&.dropzone': {
      outline: 0,
      '&:hover .edit-icon, &:focus .edit-icon': {
        display: 'flex',
      },
    },
  };
});
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
  closeButton: {
    cursor: 'pointer',
    float: 'right',
    marginTop: '5px',
    width: '20px',
  },
}));
let fileToUpload;
const BusinessInfoForm = ({
  values,
  setFieldValue,
  moveData,
  moveLogo,
  logoImage,
}) => {
  const dispatch = useDispatch();
  const classes = useStyles({values, setFieldValue, moveData, moveLogo});
  let imagePayload = {
    request: {
      payload: {
        key: 'general',
        action: 'putObject',
        contentType: '',
      },
    },
  };

  console.log('valores', values);
  const [typeDocument, setTypeDocument] = React.useState(values.documentType);
  const [selectedImages, setSelectedImages] = React.useState(logoImage);
  const [selectedJsonImages, setSelectedJsonImages] = React.useState(logoImage);
  const [typeFile, setTypeFile] = React.useState('');
  const [nameFile, setNameFile] = React.useState('');
  const [base64, setBase64] = React.useState('');
  const {presigned} = useSelector(({general}) => general);
  console.log('createPresigned', presigned);
  console.log('Valores', values);
  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setFieldValue('photoURL', URL.createObjectURL(acceptedFiles[0]));
    },
  });
  const toCreatePresigned = (payload, file) => {
    dispatch(createPresigned(payload, file));
  };

  useEffect(() => {
    if (presigned) {
      console.log('useEffect presigned', presigned);
      let actualSelectedJsonImages = selectedJsonImages;
      const newJsonImages = {
        keyMaster: presigned.keymaster,
        nameFile: imagePayload.request.payload.name || presigned.name,
      };
      console.log('newJsonImages', newJsonImages);
      actualSelectedJsonImages = [newJsonImages];
      console.log('actualSelectedJsonImages', actualSelectedJsonImages);
      setSelectedJsonImages(actualSelectedJsonImages);
    }
  }, [presigned]);
  useEffect(() => {
    if (selectedJsonImages) {
      moveLogo(selectedJsonImages);
    }
  }, [selectedJsonImages]);
  const handleField = (event) => {
    console.log('evento', event);
    console.log('valor', event.target.value);
    if (event.target.name == 'documentType') {
      setTypeDocument(event.target.value);
    }
    moveData(event.target.value);
  };
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
  const deleteImage = (index, itemSelected) => {
    console.log('delete la imagen de index: ', index);
    // setSelectedImages(selectedImages.splice(index,1))
    setSelectedImages((oldState) =>
      oldState.filter((item) => item !== itemSelected),
    );
    let newImagesJson = selectedJsonImages;
    delete newImagesJson[index];
    setSelectedJsonImages(newImagesJson);
    setTimeout(() => {
      console.log('Imagenes luego de eliminar ', selectedImages);
      console.log('Imagenes luego de eliminar 2', selectedJsonImages);
    }, 2000);
  };
  const getImage = (event) => {
    if (event.target.value !== '') {
      console.log('archivo', event.target.files[0]);
      fileToUpload = event.target.files[0];
      getBase64(fileToUpload);
      console.log('fileToUpload', fileToUpload);
      console.log(
        'nombre de archivo',
        fileToUpload.name.split('.').slice(0, -1).join('.'),
      );
      if (event.target.files) {
        const fileArray = Array.from(event.target.files).map((file) => {
          imagePayload.request.payload.contentType = fileToUpload.type;
          imagePayload.request.payload.name = fileToUpload.name;
          toCreatePresigned(imagePayload, {
            image: fileToUpload,
            type: fileToUpload?.type || null,
          });
          return URL.createObjectURL(file);
        });

        setSelectedImages((prevImages) => (prevImages = [fileArray[0]]));

        Array.from(event.target.files).map((file) => URL.revokeObjectURL(file));
      }
      setTypeFile(fileToUpload.type);
      setNameFile(fileToUpload.name);

      /* setOpenStatus(true); */
    } else {
      event = null;
      console.log('no se selecciono un archivo');
    }
  };
  return (
    <Form noValidate autoComplete='off'>
      <Typography
        component='h3'
        sx={{
          fontSize: 16,
          fontWeight: Fonts.BOLD,
          mb: {xs: 3, lg: 4},
        }}
      >
        <IntlMessages id='common.businessInfo' />
      </Typography>

      <AppGridContainer spacing={4}>
        <Grid item xs={12} md={12}>
          <AppTextField
            name='companyName'
            fullWidth
            label={<IntlMessages id='common.companyName' />}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth sx={{my: 2}}>
            <InputLabel id='documentType-label' style={{fontWeight: 200}}>
              <IntlMessages id='common.busines.documentType' />
            </InputLabel>
            <Select
              name='documentType'
              labelId='documentType-label'
              label={<IntlMessages id='common.busines.documentType' />}
              displayEmpty
              onChange={handleField}
              value={typeDocument}
            >
              <MenuItem value='RUC' style={{fontWeight: 200}}>
                RUC
              </MenuItem>
              <MenuItem value='DNI' style={{fontWeight: 200}}>
                DNI
              </MenuItem>
              <MenuItem value='CE' style={{fontWeight: 200}}>
                CE
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={12}>
          <AppTextField
            name='documentNumber'
            fullWidth
            label={<IntlMessages id='common.busines.documentNumber' />}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <AppTextField
            name='direction'
            fullWidth
            label={<IntlMessages id='common.busines.direction' />}
          />
        </Grid>
        <Grid item xs={7} md={7}>
          <Box sx={{textAlign: 'left'}}>
            <Typography 
              variant='h4'
              sx={{
                fontSize: 12,
                textAlign: 'left',
              }}
              paragraph='true'
            >
              {process.env.REACT_APP_ECOMMERCE_URL}{values.eMerchantSlugName}
            </Typography>
          </Box>
          
        </Grid>
        <Grid item xs={5} md={5}>
          <AppTextField
            name='eMerchantSlugName'
            fullWidth
            label={`Ruta del Comercio`}
          />
        </Grid>
        {/* <Grid item xs={12} md={12}>
          <AppTextField
            name='eMerchantSlugName'
            fullWidth
            label={`Ruta del Comercio: ${process.env.REACT_APP_ECOMMERCE_URL}${values.eMerchantSlugName}`}
          />
        </Grid> */}
        <Grid item xs={12} md={12}>
          <AppTextField
            name='facebook'
            fullWidth
            label={<IntlMessages id='common.facebook' />}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <AppTextField
            name='twitter'
            fullWidth
            label={<IntlMessages id='common.twitter' />}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <AppTextField
            name='instagram'
            fullWidth
            label={<IntlMessages id='common.instagram' />}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <AppTextField
            name='youtube'
            fullWidth
            label={<IntlMessages id='common.youtube' />}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <Button variant='contained' color='secondary' component='label'>
            Subir Logo Empresarial
            <input
              type='file'
              hidden
              onChange={getImage}
              id='imgInp'
              name='imgInp'
              accept='.png, .jpeg, .jpg'
            />
          </Button>
        </Grid>
        {selectedImages.length > 0 ? (
          <ImageList
            sx={{
              // width: 300,
              // height: 450,
              // Promote the list into its own layer in Chrome. This costs memory, but helps keeping high FPS.
              transform: 'translateZ(0)',
              my: 1,
              p: 4,
            }}
            rowHeight={150}
            gap={1}
          >
            {selectedImages.map((item, index) => {
              const cols = item.featured ? 2 : 1;
              const rows = item.featured ? 2 : 1;

              return (
                <ImageListItem key={item} cols={cols} rows={rows}>
                  <img
                    className={classes.img}
                    src={item.src ? item.src : item}
                    key={item}
                  ></img>
                  <ImageListItemBar
                    sx={{
                      background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                        'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                    }}
                    // title={"Prueba"}
                    position='top'
                    actionIcon={
                      <IconButton
                        sx={{color: 'white'}}
                        aria-label={`star prueba`}
                        onClick={() => {
                          deleteImage(index, item);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                    actionPosition='left'
                  />
                </ImageListItem>
              );
            })}
          </ImageList>
        ) : (
          <></>
        )}

        <Grid item xs={12} md={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Button
              sx={{
                position: 'relative',
                minWidth: 100,
              }}
              color='primary'
              variant='contained'
              type='submit'
            >
              <IntlMessages id='common.saveChanges' />
            </Button>
            <Button
              sx={{
                position: 'relative',
                minWidth: 100,
                ml: 2.5,
              }}
              color='primary'
              variant='outlined'
              type='cancel'
            >
              <IntlMessages id='common.cancel' />
            </Button>
          </Box>
        </Grid>
      </AppGridContainer>
    </Form>
  );
};

export default BusinessInfoForm;
BusinessInfoForm.propTypes = {
  setFieldValue: PropTypes.func,
  moveData: PropTypes.func,
  values: PropTypes.object,
  moveLogo: PropTypes.func,
  logoImage: PropTypes.array,
};
