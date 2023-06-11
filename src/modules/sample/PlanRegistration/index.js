import React from 'react';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {Formik} from 'formik';
import * as yup from 'yup';
import UpgradeBusinessForm from './UpgradeBusinessForm';
import {blue, green, red} from '@mui/material/colors';

import Router, {useRouter} from 'next/router';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  AppPageMeta,
  AppAnimate,
  AccountTabsWrapper,
  Card,
} from '@mui/material';
import {Fonts} from '../../../shared/constants/AppEnums';
import {useDispatch, useSelector} from 'react-redux';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  GET_DATA_BUSINESS,
  UPGRADE_TO_NEW_PLAN,
} from '../../../shared/constants/ActionTypes';
import {
  getDataBusiness,
  onGetBusinessParameter,
  upgradeToNewPlan,
} from '../../../redux/actions/General';
import {GET_ROL_USER} from 'shared/constants/ActionTypes';
import {useEffect} from 'react';
const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
const validationSchema = yup.object({
  serieDocumenteBilling: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
  serieBackDocumenteBilling: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
  serieDocumenteReceipt: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
  serieBackDocumenteReceipt: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
  serieDocumenteReferralGuide: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
  serieBackDocumenteReferralGuide: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
  eMerchantSlugName: yup
    .string()
    .typeError(<IntlMessages id='validation.string' />),
});
const UpgradeBusiness = () => {
  const [openStatus, setOpenStatus] = React.useState(false);
  const {user} = useAuthUser();
  console.log('datos user', user);
  const {userAttributes} = useSelector(({user}) => user);
  console.log('userAttributes', userAttributes);
  const {upgradeToNewPlanRes} = useSelector(({general}) => general);
  console.log('registerUserRes', upgradeToNewPlanRes);
  const {successMessage} = useSelector(({user}) => user);
  console.log('successMessage', successMessage);
  const {errorMessage} = useSelector(({user}) => user);
  console.log('errorMessage', errorMessage);
  const {getRolUserRes} = useSelector(({general}) => general);
  const [docType, setDocType] = React.useState(
    userAttributes['custom:businessDocumentType'],
  );
  const [reload, setReload] = React.useState(false);
  const [filters, setFilters] = React.useState([]);
  const [initialCategories, setInitialCategories] = React.useState([]);
  const [publish, setPublish] = React.useState(false);
  const [execAll, setExecAll] = React.useState(false);
  const [typeDialog, setTypeDialog] = React.useState('darDeAlta');
  const toUpgradeToNewPlan = (payload) => {
    dispatch(upgradeToNewPlan(payload));
  };
  const reloadPage = () => {
    setReload(!reload);
  };
  const getDocumentType = (value) => {
    console.log('tipo desde index', value);
    setDocType(value);
  };

  const dispatch = useDispatch();

  const {dataBusinessRes} = useSelector(({general}) => general);
  console.log('dataBusinessRes', dataBusinessRes);
  const {userDataRes} = useSelector(({user}) => user);
  const [initialValues, setInitialValues] = React.useState({});

  useEffect(() => {
    if (userDataRes && userDataRes.merchantSelected) {
      setInitialValues({
        planDesired: userDataRes.merchantSelected.planDesired,
        planDesiredId: userDataRes.merchantSelected.planDesiredId,
        documentType:
          docType /* userAttributes['custom:businessDocumentType'] */,
        serieDocumenteBilling: '',
        serieBackDocumenteBilling: '',
        serieDocumenteReceipt: '',
        serieBackDocumenteReceipt: '',
        serieDocumenteReferralGuide: '',
        serieBackDocumenteReferralGuide: '',
        eMerchantSlugName: '',
        defaultMaxPrice: 1000,
        defaultMinPrice: 0,
        isEcommerceEnabled: true,
      });
    }
  }, [userDataRes]);

  const registerSuccess = () => {
    return (
      successMessage != undefined && upgradeToNewPlanRes != undefined
      // && !('error' in upgradeToNewPlanRes)
    );
  };

  const registerError = () => {
    return (upgradeToNewPlanRes && successMessage != undefined) || errorMessage;
  };

  const sendStatus = () => {
    if (registerSuccess()) {
      let getRolUserRes2 = getRolUserRes;
      getRolUserRes2.merchantSelected.firstPlanDefault = false;
      dispatch({
        type: GET_ROL_USER,
        payload: getRolUserRes2,
      });
      setOpenStatus(false);
      Router.push('/sample/home');
    } else if (registerError()) {
      setOpenStatus(false);
    } else {
      setOpenStatus(false);
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
              Se ha dado de alta, cierre sesión <br />y vuelva a ingresar.
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
              Se ha producido un error al dar de alta. <br />
              {/* {registerError() ? registerUserRes : null} */}
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
  const updateCategories = (newCategories) => {
    console.log('initialCategories', initialCategories);
    setInitialCategories(newCategories);
    reloadPage();
  };

  const handlePublicChange = (event) => {
    console.log('Switch ecommerce cambio', event);
    setPublish(event.target.checked);
  };
  const updateFilters = (newFilters) => {
    console.log('filters', filters);
    setFilters(newFilters);
    reloadPage();
  };
  return (
    <>
      {initialValues != {} ? (
        <Card sx={{p: 4}}>
          <Box className='account-tabs-content'>
            <Box
              sx={{
                position: 'relative',
                maxWidth: 750,
              }}
            >
              <Formik
                validateOnChange={false}
                validateOnBlur={true}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(data, {setSubmitting}) => {
                  console.log('Este es initialCategories', initialCategories);
                  console.log('Este es filters', filters);

                  if (!userDataRes.merchantSelected.planDesiredId) {
                    if (!data.eMerchantSlugName) {
                      setTypeDialog('nonSlug');
                      setOpenStatus(true);
                    } else if (
                      publish &&
                      (!data.defaultMaxPrice ||
                        data.defaultMinPrice == undefined)
                    ) {
                      setTypeDialog('nonPriceRange');
                      setOpenStatus(true);
                    } else if (
                      publish &&
                      Number(data.defaultMinPrice) < 0 &&
                      Number(data.defaultMaxPrice) < 0
                    ) {
                      setTypeDialog('priceIsMoreThanZero');
                      setOpenStatus(true);
                    } else if (
                      publish &&
                      Number(data.defaultMaxPrice) <
                        Number(data.defaultMinPrice)
                    ) {
                      setTypeDialog('maxPriceIsLessThanMinPrice');
                      setOpenStatus(true);
                    } else if (
                      initialCategories.length == 0 ||
                      !initialCategories ||
                      initialCategories === []
                    ) {
                      setTypeDialog('nonCategories');
                      setOpenStatus(true);
                    } else if (
                      initialCategories.some(
                        (arrVal) => '' === arrVal.description,
                      )
                    ) {
                      setTypeDialog('someCategoriesAreEmpty');
                      setOpenStatus(true);
                    } else if (
                      publish &&
                      (filters.length == 0 || !filters || filters === [])
                    ) {
                      setTypeDialog('nonFilters');
                      setOpenStatus(true);
                      // } else if(filters.some(arrVal => "" === arrVal.filterName)) {
                      //   setTypeDialog("someFiltersAreEmpty")
                      //   setOpenStatus(true);
                      // } else if(filters.some(arrVal => 0 === arrVal.options.length)) {
                      //   setTypeDialog("someFiltersAreEmpty")
                      //   setOpenStatus(true);
                    } else if (
                      publish &&
                      filters.some((arrVal) => undefined === arrVal.filterName)
                    ) {
                      setTypeDialog('someFiltersAreEmpty');
                      setOpenStatus(true);
                    } else {
                      setTypeDialog('darDeAlta');
                      setSubmitting(true);
                      console.log('data filters: ', {filters: filters});
                      console.log('data planRegistration: ', {
                        ...data,
                        documentType: docType,
                        filters: filters,
                      });
                      // TODO Api Call here to save user info
                      dispatch({type: FETCH_SUCCESS, payload: undefined});
                      dispatch({type: FETCH_ERROR, payload: undefined});
                      dispatch({type: UPGRADE_TO_NEW_PLAN, payload: undefined});

                      setExecAll(true);
                      setExecAll(false);
                      toUpgradeToNewPlan({
                        request: {
                          payload: {
                            merchantId: userDataRes.merchantSelected.merchantId,
                            planDesiredId:
                              userDataRes.merchantSelected.planDesiredId,
                            promotionCodeId:
                              userDataRes.merchantSelected.promotionCodeId,
                            serieDocumenteBilling:
                              data.serieDocumenteBilling || '',
                            serieBackDocumenteBilling:
                              data.serieBackDocumenteBilling || '',
                            serieDocumenteReceipt:
                              data.serieDocumenteReceipt || '',
                            serieBackDocumenteReceipt:
                              data.serieBackDocumenteReceipt || '',
                            serieDocumenteReferralGuide:
                              data.serieDocumenteReferralGuide || '',
                            serieBackDocumenteReferralGuide:
                              data.serieBackDocumenteReferralGuide || '',
                            eMerchantSlugName: data.eMerchantSlugName || '',
                            merchantMasterId: userDataRes.merchantMasterId,
                            firstPlanDefault:
                              userDataRes.merchantSelected.firstPlanDefault,
                            typeMerchant:
                              userDataRes.merchantSelected.typeMerchant,
                            categories: initialCategories,
                            filters: filters,
                            price: [data.defaultMinPrice, data.defaultMaxPrice],
                            isEcommerceEnabled: publish,
                          },
                        },
                      });
                      console.log('Esto se envia', {
                        request: {
                          payload: {
                            merchantId: userDataRes.merchantSelected.merchantId,
                            planDesiredId:
                              userDataRes.merchantSelected.planDesiredId,
                            promotionCodeId:
                              userDataRes.merchantSelected.promotionCodeId,
                            serieDocumenteBilling:
                              data.serieDocumenteBilling || '',
                            serieBackDocumenteBilling:
                              data.serieBackDocumenteBilling || '',
                            serieDocumenteReceipt:
                              data.serieDocumenteReceipt || '',
                            serieBackDocumenteReceipt:
                              data.serieBackDocumenteReceipt || '',
                            serieDocumenteReferralGuide:
                              data.serieDocumenteReferralGuide || '',
                            serieBackDocumenteReferralGuide:
                              data.serieBackDocumenteReferralGuide || '',
                            eMerchantSlugName: data.eMerchantSlugName || '',
                            merchantMasterId: userDataRes.merchantMasterId,
                            firstPlanDefault:
                              userDataRes.merchantSelected.firstPlanDefault,
                            typeMerchant:
                              userDataRes.merchantSelected.typeMerchant,
                            categories: initialCategories,
                            filters: filters,
                            price: [
                              Number(data.defaultMinPrice),
                              Number(data.defaultMaxPrice),
                            ],
                          },
                        },
                      });
                      setOpenStatus(true);
                      setSubmitting(false);
                    }
                  } else {
                    //Falta Validaciones para este apartado
                    setTypeDialog('darDeAlta');
                    setSubmitting(true);
                    // TODO Api Call here to save user info
                    dispatch({type: FETCH_SUCCESS, payload: undefined});
                    dispatch({type: FETCH_ERROR, payload: undefined});
                    dispatch({type: UPGRADE_TO_NEW_PLAN, payload: undefined});

                    setExecAll(true);
                    setExecAll(false);
                    toUpgradeToNewPlan({
                      request: {
                        payload: {
                          merchantId: userDataRes.merchantSelected.merchantId,
                          planDesiredId:
                            userDataRes.merchantSelected.planDesiredId,
                          promotionCodeId:
                            userDataRes.merchantSelected.promotionCodeId,
                          serieDocumenteBilling:
                            data.serieDocumenteBilling || '',
                          serieBackDocumenteBilling:
                            data.serieBackDocumenteBilling || '',
                          serieDocumenteReceipt:
                            data.serieDocumenteReceipt || '',
                          serieBackDocumenteReceipt:
                            data.serieBackDocumenteReceipt || '',
                          serieDocumenteReferralGuide:
                            data.serieDocumenteReferralGuide || '',
                          serieBackDocumenteReferralGuide:
                            data.serieBackDocumenteReferralGuide || '',
                          eMerchantSlugName: data.eMerchantSlugName || '',
                          merchantMasterId: userDataRes.merchantMasterId,
                          firstPlanDefault:
                            userDataRes.merchantSelected.firstPlanDefault,
                          typeMerchant:
                            userDataRes.merchantSelected.typeMerchant,
                          //categories: initialCategories,
                          //filters: filters,
                          //price: [data.defaultMinPrice, data.defaultMaxPrice],
                          //isEcommerceEnabled: publish,
                        },
                      },
                    });
                    console.log('Esto se envia', {
                      request: {
                        payload: {
                          merchantId: userDataRes.merchantSelected.merchantId,
                          planDesiredId:
                            userDataRes.merchantSelected.planDesiredId,
                          promotionCodeId:
                            userDataRes.merchantSelected.promotionCodeId,
                          serieDocumenteBilling:
                            data.serieDocumenteBilling || '',
                          serieBackDocumenteBilling:
                            data.serieBackDocumenteBilling || '',
                          serieDocumenteReceipt:
                            data.serieDocumenteReceipt || '',
                          serieBackDocumenteReceipt:
                            data.serieBackDocumenteReceipt || '',
                          serieDocumenteReferralGuide:
                            data.serieDocumenteReferralGuide || '',
                          serieBackDocumenteReferralGuide:
                            data.serieBackDocumenteReferralGuide || '',
                          eMerchantSlugName: data.eMerchantSlugName || '',
                          merchantMasterId: userDataRes.merchantMasterId,
                          firstPlanDefault:
                            userDataRes.merchantSelected.firstPlanDefault,
                          typeMerchant:
                            userDataRes.merchantSelected.typeMerchant,
                          // categories: initialCategories,
                          // filters: filters,
                          // price: [
                          //   Number(data.defaultMinPrice),
                          //   Number(data.defaultMaxPrice),
                          // ],
                        },
                      },
                    });
                    setOpenStatus(true);
                    setSubmitting(false);
                  }
                }}
              >
                {({values, setFieldValue}) => {
                  return (
                    <UpgradeBusinessForm
                      values={values}
                      setFieldValue={setFieldValue}
                      moveData={getDocumentType}
                      updateCategories={updateCategories}
                      updateFilters={updateFilters}
                      handlePublicChange={handlePublicChange}
                      execAll={execAll}
                      publish={publish}
                    />
                  );
                }}
              </Formik>

              <Dialog
                open={openStatus}
                onClose={sendStatus}
                sx={{textAlign: 'center'}}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
              >
                {typeDialog == 'darDeAlta' ? (
                  <>
                    <DialogTitle
                      sx={{fontSize: '1.5em'}}
                      id='alert-dialog-title'
                    >
                      {'Alta de plan'}
                    </DialogTitle>
                    {showMessage()}
                  </>
                ) : (
                  <>
                    {typeDialog == 'nonSlug' ? (
                      <>
                        <DialogTitle
                          sx={{fontSize: '1.5em'}}
                          id='alert-dialog-title'
                        >
                          {'Falta llenar la ruta del comercio'}
                        </DialogTitle>
                      </>
                    ) : (
                      <></>
                    )}
                    {typeDialog == 'nonPriceRange' ? (
                      <>
                        <DialogTitle
                          sx={{fontSize: '1.5em'}}
                          id='alert-dialog-title'
                        >
                          {'Falta llenar algunos de los límites de precio'}
                        </DialogTitle>
                      </>
                    ) : (
                      <></>
                    )}
                    {typeDialog == 'nonCategories' ? (
                      <>
                        <DialogTitle
                          sx={{fontSize: '1.5em'}}
                          id='alert-dialog-title'
                        >
                          {'Llene al menos una categoría'}
                        </DialogTitle>
                      </>
                    ) : (
                      <></>
                    )}
                    {typeDialog == 'nonFilters' ? (
                      <>
                        <DialogTitle
                          sx={{fontSize: '1.5em'}}
                          id='alert-dialog-title'
                        >
                          {'Llene al menos un filtro y una opción'}
                        </DialogTitle>
                      </>
                    ) : (
                      <></>
                    )}
                    {typeDialog == 'priceIsMoreThanZero' ? (
                      <>
                        <DialogTitle
                          sx={{fontSize: '1.5em'}}
                          id='alert-dialog-title'
                        >
                          {
                            'Los límites de precio tienen que ser mayores o iguales a cero'
                          }
                        </DialogTitle>
                      </>
                    ) : (
                      <></>
                    )}
                    {typeDialog == 'maxPriceIsLessThanMinPrice' ? (
                      <>
                        <DialogTitle
                          sx={{fontSize: '1.5em'}}
                          id='alert-dialog-title'
                        >
                          {
                            'El precio mínimo tiene que ser menor que el precio máximo'
                          }
                        </DialogTitle>
                      </>
                    ) : (
                      <></>
                    )}
                    {typeDialog == 'someCategoriesAreEmpty' ? (
                      <>
                        <DialogTitle
                          sx={{fontSize: '1.5em'}}
                          id='alert-dialog-title'
                        >
                          {'No pueden haber categorías vacías'}
                        </DialogTitle>
                      </>
                    ) : (
                      <></>
                    )}
                    {typeDialog == 'someFiltersAreEmpty' ? (
                      <>
                        <DialogTitle
                          sx={{fontSize: '1.5em'}}
                          id='alert-dialog-title'
                        >
                          {'No pueden haber filtros o sus opciones vacías'}
                        </DialogTitle>
                      </>
                    ) : (
                      <></>
                    )}
                    <DialogContent>
                      <CancelOutlinedIcon
                        //onClick={setOpen.bind(this, false)}
                        sx={{fontSize: '6em', mx: 2, color: red[500]}}
                      />
                      <DialogContentText
                        sx={{fontSize: '1.2em', m: 'auto'}}
                        id='alert-dialog-description'
                      ></DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{justifyContent: 'center'}}>
                      <Button
                        variant='outlined'
                        onClick={() => setOpenStatus(false)}
                      >
                        Aceptar
                      </Button>
                    </DialogActions>
                  </>
                )}
              </Dialog>
            </Box>
          </Box>
        </Card>
      ) : null}
    </>
  );
};

export default UpgradeBusiness;

UpgradeBusiness.propTypes = {
  setFieldValue: PropTypes.func,
  values: PropTypes.string,
};
