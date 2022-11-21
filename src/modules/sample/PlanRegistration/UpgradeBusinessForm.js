import React, {useEffect} from 'react';
import {v4 as uuidv4} from 'uuid';
import {
  alpha,
  Box,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Stack,
  Divider,
  IconButton,
  Card,
  FormGroup,
  Switch,
} from '@mui/material';
import {blue, green, red} from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import AppGridContainer from '../../../@crema/core/AppGridContainer';
import {useDispatch, useSelector} from 'react-redux';
import Grid from '@mui/material/Grid';
import {FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import {useDropzone} from 'react-dropzone';
import {Form} from 'formik';
import PropTypes from 'prop-types';
import AppTextField from '../../../@crema/core/AppFormComponents/AppTextField';
import EditIcon from '@mui/icons-material/Edit';
import {styled} from '@mui/material/styles';
import {Fonts} from '../../../shared/constants/AppEnums';
import {onGetBusinessPlan} from '../../../redux/actions/General';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import DeliveryCard from './DeliveryCard';
import CategoryCard from './CategoryCard';
import {
  FETCH_ERROR,
  FETCH_SUCCESS,
  GET_BUSINESS_PLAN,
} from '../../../shared/constants/ActionTypes';
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

const UpgradeBusinessForm = ({
  values,
  setFieldValue,
  moveData,
  updateCategories,
  updateFilters,
  execAll,
  handlePublicChange,
  publish,
}) => {
  console.log('valores', values);
  const dispatch = useDispatch();
  const [typeDocument, setTypeDocument] = React.useState(values.documentType);
  const [defaultPriceRange, setDefaultPriceRange] = React.useState([0, 1000]);
  const [filters, setFilters] = React.useState([]);
  const [initialCategories, setInitialCategories] = React.useState([]);
  const [reload, setReload] = React.useState(false);

  const {getBusinessPlanRes} = useSelector(({general}) => general);
  console.log('getBusinessPlanRes', getBusinessPlanRes);
  const {userDataRes} = useSelector(({user}) => user);
  console.log('userDataRes', userDataRes);
  const {businessParameter} = useSelector(({general}) => general);
  console.log('globalParameter123', businessParameter);
  console.log('Valores', values);
  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setFieldValue('photoURL', URL.createObjectURL(acceptedFiles[0]));
    },
  });
  const reloadPage = () => {
    setReload(!reload);
  };
  const emptyFilter = {
    products: [],
  };
  const emptyCategory = {
    active: true,
    default: false,
    description: '',
    productCategoryId: '',
  };
  useEffect(() => {
    if (!getBusinessPlanRes) {
      console.log('Plan de negocio');

      const toGetBusinessPlan = (payload) => {
        dispatch(onGetBusinessPlan(payload));
      };
      let getBusinessPlanPayload = {
        request: {
          payload: {
            subscriptionPlanId: userDataRes.merchantSelected.planDesiredId,
          },
        },
      };

      toGetBusinessPlan(getBusinessPlanPayload);
    }
  }, []);
  useEffect(() => {
    updateCategories(initialCategories);
  }, [initialCategories]);
  useEffect(() => {
    updateFilters(filters);
  }, [filters]);
  useEffect(() => {
    if (businessParameter !== undefined && businessParameter.length >= 1) {
      let ecommerceProductParameter = businessParameter.find(
        (obj) => obj.abreParametro == 'ECOMMERCE_PRODUCT_PARAMETERS',
      );
      let initialCategoriesProductParameter = businessParameter.find(
        (obj) => obj.abreParametro == 'DEFAULT_CATEGORIES_PRODUCTS',
      ).value;
      console.log(
        'initialCategoriesProductParameter',
        initialCategoriesProductParameter,
      );
      console.log(
        'ecommerceTagsProductParameter',
        ecommerceProductParameter.tags,
      );
      console.log(
        'ecommercePriceProductParameter',
        ecommerceProductParameter.price,
      );

      setFilters(ecommerceProductParameter.tags);
      setDefaultPriceRange([
        Number(ecommerceProductParameter.price.min),
        Number(ecommerceProductParameter.price.max),
      ]);
      setInitialCategories(initialCategoriesProductParameter);
      setFieldValue(
        'defaultMinPrice',
        Number(ecommerceProductParameter.price.min),
      );
      setFieldValue(
        'defaultMaxPrice',
        Number(ecommerceProductParameter.price.max),
      );
      console.log('initialCategories Cambio Business', initialCategories);
      console.log('defaultPriceRange hay', defaultPriceRange);
    }
  }, [businessParameter]);
  const handleField = (event) => {
    console.log('evento', event);
    console.log('valor', event.target.value);
    setTypeDocument(event.target.value);
    moveData(event.target.value);
  };
  const setFilterIndex = (index, obj) => {
    console.log('obj: ', obj);
    let changedFilters = filters;
    changedFilters[index] = obj;
    setFilters(changedFilters);
    console.log('changedFilters', changedFilters);
    console.log('filters', filters);
  };
  const setCategoryIndex = (index, obj) => {
    console.log('obj: ', obj);
    let changedCategories = initialCategories;
    changedCategories[index] = obj;
    setInitialCategories(changedCategories);
    console.log('changedCategories', changedCategories);
    console.log('initialCategories', initialCategories);
  };
  const handleChange = (event) => {
    if (event.target.name == 'defaultIgvActivation') {
      setDefaultIgvActivation(event.target.value);
      console.log('Es el activation IGV: ', event.target.value);
    }
    if (event.target.name == 'defaultMinPrice') {
      let priceRange = defaultPriceRange;
      priceRange[0] = event.target.value;
      setDefaultPriceRange(priceRange);
      console.log('Es precio mínimo: ', event.target.value);
    }
    if (event.target.name == 'defaultMaxPrice') {
      let priceRange = defaultPriceRange;
      priceRange[1] = event.target.value;
      setDefaultPriceRange(priceRange);
      console.log('Es precio máximo: ', event.target.value);
    }
    if (event.target.name == 'isEcommerceEnabled') {
      console.log('Es ecommerce público: ', event.target.value);
    }
    // if (event.target.name == 'totalAmounth') {
    //   setTotalAmountWithConcepts(event.target.value);
    // }
  };
  return getBusinessPlanRes || userDataRes.merchantSelected.firstPlanDefault ? (
    <>
      <Form
        noValidate
        autoComplete='off'
        id='principal-form'
        style={{textAlign: 'left', justifyContent: 'center'}}
        onChange={handleChange}
      >
        <Typography
          component='h3'
          sx={{
            fontSize: 16,
            fontWeight: Fonts.BOLD,
            mb: {xs: 3, lg: 4},
          }}
        >
          <IntlMessages id='userProfile.upgradeBusiness' />
        </Typography>
        <AppGridContainer spacing={4}>
          {getBusinessPlanRes ? (
            <>
              <Grid item xs={12} md={12}>
                <FormControlLabel
                  control={<Checkbox />}
                  label='Declaro bajo mi responsabilidad haber dado de alta y mantenerme activo en la SUNAT para efectos de la generación de facturación electrónica'
                />
              </Grid>
            </>
          ) : (
            <></>
          )}
          {userDataRes.merchantSelected.firstPlanDefault ? (
            <>
              <Grid item xs={6} md={6}>
                <Typography
                  component='h3'
                  sx={{
                    fontSize: 16,
                  }}
                >
                  <IntlMessages id='common.eMerchantSlugName' />
                </Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <AppTextField
                  name='eMerchantSlugName'
                  fullWidth
                  label={<IntlMessages id='common.slug' />}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    component='h3'
                    sx={{
                      fontSize: 16,
                    }}
                  >
                    Rango de Precio de Productos:
                  </Typography>
                  <Grid item xs={4} md={4} sx={{mr: 2}}>
                    <AppTextField
                      name='defaultMinPrice'
                      value={defaultPriceRange[0]}
                      fullWidth
                      label={'Mínimo'}
                    />
                  </Grid>
                  <Grid item xs={4} md={4}>
                    <AppTextField
                      name='defaultMaxPrice'
                      variant='outlined'
                      value={defaultPriceRange[1]}
                      fullWidth
                      label={'Máximo'}
                    />
                  </Grid>
                </Box>
              </Grid>
              {businessParameter ? (
                <>
                  {/* */}
                  <Grid item xs={12} md={12}>
                    <Box
                      sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        mb: 5,
                        mx: 'auto',
                      }}
                    >
                      <Box
                        sx={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          mb: 5,
                        }}
                      >
                        <Stack
                          direction='row'
                          divider={<Divider orientation='vertical' flexItem />}
                          spacing={2}
                        >
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: 20,
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <IntlMessages id='common.productTags' />
                          </Typography>
                          <IconButton
                            onClick={() => {
                              console.log('filters', filters);
                              let newFilters = filters;
                              newFilters.push(emptyFilter);
                              setFilters(newFilters);
                              reloadPage();
                              updateFilters(filters);
                            }}
                            aria-label='delete'
                            size='large'
                          >
                            <AddIcon fontSize='inherit' />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              console.log('filters', filters);
                              let newFilters = filters;
                              newFilters.pop();
                              setFilters(newFilters);
                              reloadPage();
                              updateFilters(filters);
                            }}
                            aria-label='delete'
                            size='large'
                          >
                            <RemoveIcon fontSize='inherit' />
                          </IconButton>
                        </Stack>
                      </Box>

                      <Box
                        sx={{
                          m: 'auto',
                          mb: 5,
                          border: '1px solid grey',
                          borderRadius: '10px',
                          width: '100%',
                        }}
                      >
                        {filters &&
                          filters.map((filter, index) => (
                            <DeliveryCard
                              // key={`count${index}`}
                              key={index}
                              order={index}
                              execFunctions={execAll}
                              newValuesData={setFilterIndex}
                              initialValues={filter}
                            />
                          ))}
                      </Box>
                      <Box
                        sx={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          mb: 5,
                        }}
                      >
                        <Stack
                          direction='row'
                          divider={<Divider orientation='vertical' flexItem />}
                          spacing={2}
                        >
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: 20,
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <IntlMessages id='common.productCategories' />
                          </Typography>
                          <IconButton
                            onClick={() => {
                              console.log(
                                'initialCategories',
                                initialCategories,
                              );
                              let newCategories = initialCategories;
                              let newEmptyCategory = {
                                active: true,
                                default: false,
                                description: '',
                                productCategoryId: uuidv4(),
                              };
                              if (newCategories.length < 1) {
                                console.log(
                                  'newCategories.length',
                                  newCategories.length,
                                );
                                newEmptyCategory.default = true;
                              } else {
                                console.log(
                                  'newCategories.length',
                                  newCategories.length,
                                );

                                newEmptyCategory.default = false;
                              }
                              console.log('newEmptyCategory', newEmptyCategory);
                              newCategories.push(newEmptyCategory);
                              setInitialCategories(newCategories);

                              console.log('initialCategories2', newCategories);
                              reloadPage();
                            }}
                            aria-label='delete'
                            size='large'
                          >
                            <AddIcon fontSize='inherit' />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              console.log(
                                'initialCategories',
                                initialCategories,
                              );
                              let newCategories = initialCategories;
                              newCategories.pop();
                              setInitialCategories(newCategories);
                              reloadPage();
                            }}
                            aria-label='delete'
                            size='large'
                          >
                            <RemoveIcon fontSize='inherit' />
                          </IconButton>
                        </Stack>
                      </Box>
                      <Box
                        sx={{
                          m: 'auto',
                          border: '1px solid grey',
                          borderRadius: '10px',
                          width: '100%',
                        }}
                      >
                        {initialCategories &&
                          initialCategories.map((category, index) => (
                            <Card key={index} sx={{p: 2}}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <CategoryCard
                                  key={index}
                                  order={index}
                                  execFunctions={execAll}
                                  newValuesData={setCategoryIndex}
                                  initialValues={category}
                                />

                                <IconButton
                                  onClick={() => {
                                    console.log(
                                      'initialCategories',
                                      initialCategories,
                                    );
                                    let newCategories = initialCategories;
                                    newCategories = newCategories.filter(
                                      (item) =>
                                        item.productCategoryId !==
                                        category.productCategoryId,
                                    );
                                    setInitialCategories(newCategories);
                                    reloadPage();
                                  }}
                                  aria-label='delete'
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </Card>
                          ))}
                      </Box>
                    </Box>
                  </Grid>
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
          {getBusinessPlanRes ? (
            <>
              <Grid item xs={6} md={6}>
                <Typography
                  component='h3'
                  sx={{
                    fontSize: 16,
                  }}
                >
                  <IntlMessages id='userProfile.planDesired' />
                </Typography>
              </Grid>
              <Grid item xs={3} md={3}>
                <AppTextField
                  name='planDesired'
                  disabled
                  fullWidth
                  label={getBusinessPlanRes[0].description}
                />
              </Grid>
            </>
          ) : (
            <></>
          )}

          {getBusinessPlanRes &&
          getBusinessPlanRes[0].modules.find(
            (module) => module?.moduleName === 'Ecommerce',
          ) ? (
            <>
              <Grid item xs={6} md={6}>
                <Typography
                  component='h3'
                  sx={{
                    fontSize: 16,
                  }}
                >
                  <IntlMessages id='common.eMerchantSlugName' />
                </Typography>
              </Grid>
              <Grid item xs={6} md={6}>
                <AppTextField
                  name='eMerchantSlugName'
                  fullWidth
                  label={<IntlMessages id='common.slug' />}
                />
              </Grid>
            </>
          ) : (
            <></>
          )}
          {getBusinessPlanRes &&
          getBusinessPlanRes[0].modules
            .find((module) => module?.moduleName === 'Finance')
            .submodule.find(
              (subModule) => subModule?.submoduleId === 'BILLS',
            ) ? (
            <>
              <Grid item xs={6} md={6}>
                <Typography
                  component='h3'
                  sx={{
                    fontSize: 16,
                  }}
                >
                  <IntlMessages id='common.eBilling' />
                </Typography>
              </Grid>
              <Grid item xs={3} md={3}>
                <AppTextField
                  name='serieDocumenteBilling'
                  fullWidth
                  label={<IntlMessages id='common.serieDocument' />}
                />
              </Grid>
              <Grid item xs={3} md={3}>
                <AppTextField
                  name='serieBackDocumenteBilling'
                  fullWidth
                  label={<IntlMessages id='common.serieBackDocument' />}
                />
              </Grid>
            </>
          ) : (
            <></>
          )}
          {getBusinessPlanRes &&
          getBusinessPlanRes[0].modules
            .find((module) => module?.moduleName === 'Finance')
            .submodule.find(
              (subModule) => subModule?.submoduleId === 'RECEIPTS',
            ) ? (
            <>
              <Grid item xs={6} md={6}>
                <Typography
                  component='h3'
                  sx={{
                    fontSize: 16,
                  }}
                >
                  <IntlMessages id='common.eReceipt' />
                </Typography>
              </Grid>
              <Grid item xs={3} md={3}>
                <AppTextField
                  name='serieDocumenteReceipt'
                  fullWidth
                  label={<IntlMessages id='common.serieDocument' />}
                />
              </Grid>
              <Grid item xs={3} md={3}>
                <AppTextField
                  name='serieBackDocumenteReceipt'
                  fullWidth
                  label={<IntlMessages id='common.serieBackDocument' />}
                />
              </Grid>
            </>
          ) : (
            <></>
          )}

          {getBusinessPlanRes &&
          getBusinessPlanRes[0].modules
            .find((module) => module?.moduleName === 'Finance')
            .submodule.find(
              (subModule) => subModule?.submoduleId === 'REFERRAL GUIDES',
            ) ? (
            <>
              <Grid item xs={6} md={6}>
                <Typography
                  component='h3'
                  sx={{
                    fontSize: 16,
                  }}
                >
                  <IntlMessages id='common.eReferralGuide' />
                </Typography>
              </Grid>
              <Grid item xs={3} md={3}>
                <AppTextField
                  name='serieDocumenteReferralGuide'
                  fullWidth
                  label={<IntlMessages id='common.serieDocument' />}
                />
              </Grid>
              <Grid item xs={3} md={3}>
                <AppTextField
                  name='serieBackDocumenteReferralGuide'
                  fullWidth
                  label={<IntlMessages id='common.serieBackDocument' />}
                />
              </Grid>
            </>
          ) : (
            <></>
          )}
          <Grid item xs={12} md={12}>
            <FormGroup
              sx={{
                ml: 2,
              }}
            >
              <FormControlLabel
                control={
                  <Switch checked={publish} onChange={handlePublicChange} />
                }
                label='Dejar público Ecommerce'
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12} md={12}>
            <Typography
              component='h3'
              sx={{
                fontSize: 16,
                fontWeight: Fonts.BOLD,
                mb: {xs: 3, lg: 4},
                color: 'secondary.main',
              }}
            >
              Recuerda, esto será siempre editable en la sección
              Configuración/Parámetros *
            </Typography>
          </Grid>
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
    </>
  ) : (
    <></>
  );
};

export default UpgradeBusinessForm;
UpgradeBusinessForm.propTypes = {
  setFieldValue: PropTypes.func,
  moveData: PropTypes.func,
  values: PropTypes.object,
  updateCategories: PropTypes.func,
  updateFilters: PropTypes.func,
  execAll: PropTypes.bool.isRequired,
  handlePublicChange: PropTypes.func,
  publish: PropTypes.bool.isRequired,
};
