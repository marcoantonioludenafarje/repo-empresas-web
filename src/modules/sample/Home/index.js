import React, {useState, useEffect, useCallback, useRef} from 'react';
import {makeStyles} from '@mui/styles';
import {
  Card,
  Typography,
  Box,
  Stack,
  Grid,
  styled,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from '@mui/material';
import AppInfoView from '@crema/core/AppInfoView';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {red} from '@mui/material/colors';
import {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
const useStyles = makeStyles((theme) => ({
  header: {
    fontSize: '2.5em',
  },
  horizontalCenter: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

const Home = (props) => {
  const classes = useStyles(props);
  let currentCountMovement;
  let ecommerceParameterState;
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
  };
  const router = useRouter();
  const {getRolUserRes} = useSelector(({general}) => general);
  console.log('getRolUserRes en Home', getRolUserRes);
  console.log('Iniciando Home');
  //API RESPONSES
  const {businessParameter} = useSelector(({general}) => general);
  console.log('businessParameter en Home', businessParameter);

  //Dispatch
  const toGetRolUser = (payload) => {
    dispatch(getRolUser(payload));
  };
  if (businessParameter) {
    currentCountMovement = businessParameter.find(
      (obj) => obj.abreParametro == 'CURRENT_COUNT_MOVEMENT',
    );
    console.log('currentCountMovement', currentCountMovement);
    ecommerceParameterState = businessParameter.find(
      (obj) => obj.abreParametro == 'ECOMMERCE_PRODUCT_PARAMETERS',
    ).value;
    console.log('ecommerceParameterState', ecommerceParameterState);
  }

  useEffect(() => {
    console.log('Veamos que hay previo', getRolUserRes);
    if (
      getRolUserRes &&
      getRolUserRes.merchantSelected &&
      (getRolUserRes.merchantSelected.firstPlanDefault ||
        getRolUserRes.merchantSelected.upgradeToNewPlan)
    ) {
      console.log('Veamos que hay');
      router.push('/sample/planRegistration');
    }
  }, [getRolUserRes]);

  return currentCountMovement && getRolUserRes ? (
    <Card sx={{px: 4, py: 20}}>
      <Typography
        variant='h1'
        sx={{textAlign: 'center'}}
        className={classes.header}
        component='div'
        gutterBottom
      >
        Empezando en TuNexo
      </Typography>
      {/* <Box sx={{textAlign: 'center', my: 20, fontSize: '1.3em'}}>
        Seleccione una opción <br />
        del menú para comenzar
      </Box> */}
      <Box
        sx={{
          ml: {md: 18, lg: 20, xl: 24},
          mr: {md: 18, lg: 20, xl: 24},
          textAlign: 'left',
          position: 'relative',
          '& img': {
            maxHeight: '100%',
            maxWidth: '100%',
          },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Divider sx={{mt: 2, mb: 4}} />
        <Box
          sx={{
            m: 0,
            textAlign: 'left',
            position: 'relative',
            '& img': {
              maxHeight: '100%',
              maxWidth: '100%',
            },
            display: 'flex',
            flexDirection: 'row',
            fontSize: 18,
            '&:hover': {
              color: '#f00',
              cursor: 'pointer',
            },
          }}
        >
          <Box
            sx={{
              m: 0,
            }}
            onClick={() => router.replace('/sample/parameters/update')}
          >
            Tener Parámetros Listos (Configuraciones / Parámetros)
          </Box>
          <Box
            sx={{
              m: 0,
            }}
          >
            {ecommerceParameterState === 'UPDATED' ? (
              <>
                <CheckCircleOutlineOutlinedIcon
                  color='success'
                  sx={{fontSize: '1.5em', mx: 2}}
                />
              </>
            ) : (
              <>
                <CancelOutlinedIcon
                  sx={{fontSize: '1.5em', mx: 2, color: red[500]}}
                />
              </>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            m: 0,
            textAlign: 'left',
            position: 'relative',
            '& img': {
              maxHeight: '100%',
              maxWidth: '100%',
            },
            display: 'flex',
            flexDirection: 'row',
            fontSize: 18,
            '&:hover': {
              color: '#f00',
              cursor: 'pointer',
            },
          }}
        >
          <Box
            sx={{
              m: 0,
            }}
            onClick={() => router.replace('/sample/products/table')}
          >
            Tener al menos un producto a vender (Configuraciones / Productos)
          </Box>
          <Box
            sx={{
              m: 0,
            }}
          >
            {currentCountMovement.catalogNumberProducts > 0 ? (
              <>
                <CheckCircleOutlineOutlinedIcon
                  color='success'
                  sx={{fontSize: '1.5em', mx: 2}}
                />
              </>
            ) : (
              <>
                <CancelOutlinedIcon
                  sx={{fontSize: '1.5em', mx: 2, color: red[500]}}
                />
              </>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            m: 0,
            textAlign: 'left',
            position: 'relative',
            '& img': {
              maxHeight: '100%',
              maxWidth: '100%',
            },
            display: 'flex',
            flexDirection: 'row',
            fontSize: 18,
            '&:hover': {
              color: '#f00',
              cursor: 'pointer',
            },
          }}
        >
          <Box
            sx={{
              m: 0,
            }}
            onClick={() => router.replace('/sample/inputs/table')}
          >
            Tener al menos una entrada de producto (Inventario / Entradas)
          </Box>
          <Box
            sx={{
              m: 0,
            }}
          >
            {currentCountMovement.transactionalInput > 0 ? (
              <>
                <CheckCircleOutlineOutlinedIcon
                  color='success'
                  sx={{fontSize: '1.5em', mx: 2}}
                />
              </>
            ) : (
              <>
                <CancelOutlinedIcon
                  sx={{fontSize: '1.5em', mx: 2, color: red[500]}}
                />
              </>
            )}
          </Box>
        </Box>
        {getRolUserRes.merchantSelected.isEcommerceEnabled ? (
          <Box
            sx={{
              m: 0,
              textAlign: 'left',
              position: 'relative',
              '& img': {
                maxHeight: '100%',
                maxWidth: '100%',
              },
              display: 'flex',
              flexDirection: 'row',
              fontSize: 18,
              '&:hover': {
                color: '#f00',
                cursor: 'pointer',
              },
            }}
          >
            <Box
              sx={{
                m: 0,
              }}
              onClick={() => router.replace('/my-account')}
            >
              Subir links de redes sociales y foto del negocio
            </Box>
            <Box
              sx={{
                m: 0,
              }}
            >
              {getRolUserRes.merchantSelected.imgUrlLogo &&
              getRolUserRes.merchantSelected.facebookUrl &&
              getRolUserRes.merchantSelected.instagramUrl ? (
                <>
                  <CheckCircleOutlineOutlinedIcon
                    color='success'
                    sx={{fontSize: '1.5em', mx: 2}}
                  />
                </>
              ) : (
                <>
                  <CancelOutlinedIcon
                    sx={{fontSize: '1.5em', mx: 2, color: red[500]}}
                  />
                </>
              )}
            </Box>
          </Box>
        ) : (
          <></>
        )}
        <Divider sx={{mt: 2, mb: 4}} />
        <Box
          sx={{
            m: 0,
            textAlign: 'left',
            position: 'relative',
            fontWeight: '700',
          }}
        >
          <Box
            sx={{
              m: 0,
            }}
          >
            {'"'}Si quieres vender un producto en tu tienda, dale check en el
            botón superior{' '}
            <span style={{color: red[500]}}>
              &ldquo;Publicar en ecommerce&rdquo;
            </span>{' '}
            al registrar o actualizar *{'"'}
          </Box>
        </Box>
        {/* <Box
            sx={{
              m: 0,
              textAlign: 'left',
              position: 'relative',
              '& img': {
                maxHeight: '100%',
                maxWidth: '100%',
              },
              display: 'flex',
              flexDirection: "row",
              fontWeight: '700'
            }}
          >
            <Box
              sx={{
                m: 0,
              }}
            >
              Puedes acceder a tu ecommerce en la sgte ruta *
            </Box>
          </Box> */}
      </Box>

      {/* <Box
        sx={{
          m: 0,
          textAlign: 'left',
          position: 'relative',
          '& img': {
            maxHeight: '100%',
            maxWidth: '100%',
          },
          display: 'flex',
          flexDirection: "row",
          fontWeight: '700'
        }}
      >
        <Box
          sx={{
            m: 0,
          }}
        >
          Puedes acceder a tu ecommerce en la sgte ruta *
        </Box>
      </Box> */}
      <AppInfoView />
      <Stack
        direction='row'
        spacing={6}
        className={classes.horizontalCenter}
        sx={{mt: 10}}
      >
        <Typography>Copyright 2023®</Typography>
        <Typography>Powered by TuNexo</Typography>
      </Stack>
      {/* <Grid container spacing={6} sx={{textAlign: 'center'}}>
        <Grid item xs='auto'>
          Copyright 2022®
        </Grid>
        <Grid item xs='auto'>
          Powered by
        </Grid>
      </Grid> */}
      {/* {businessParameter && currentCountMovement && ecommerceParameterState ? (
        <>
          <Dialog
            open={open}
            onClose={handleClose}
            sx={{textAlign: 'center'}}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle sx={{fontSize: '1.5em'}} id='alert-dialog-title'>
              {'Empezando en Tunexo'}
            </DialogTitle>
            <DialogContent sx={{display: 'flex'}}>
              <Box
                sx={{
                  m: 0,
                  textAlign: 'left',
                  position: 'relative',
                  '& img': {
                    maxHeight: '100%',
                    maxWidth: '100%',
                  },
                  display: 'flex',
                  flexDirection: "column"
                }}
              >
                  <Box
                    sx={{
                      m: 0,
                      textAlign: 'left',
                      position: 'relative',
                      '& img': {
                        maxHeight: '100%',
                        maxWidth: '100%',
                      },
                      display: 'flex',
                      flexDirection: "row",
                      fontSize: 18
                    }}
                  >
                    <Box
                      sx={{
                        m: 0,
                      }}
                    >
                      Tener Parámetros Listos
                    </Box>
                    <Box
                      sx={{
                        m: 0,
                      }}
                    >
                      {ecommerceParameterState === "UPDATED" ? (
                        <>
                          <CheckCircleOutlineOutlinedIcon
                            color='success'
                            sx={{fontSize: '1.5em', mx: 2}}
                          />
                        </>
                      ) : (
                        <>
                          <CancelOutlinedIcon sx={{fontSize: '1.5em', mx: 2, color: red[500]}} />
                        </>
                      )}
                      
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      m: 0,
                      textAlign: 'left',
                      position: 'relative',
                      '& img': {
                        maxHeight: '100%',
                        maxWidth: '100%',
                      },
                      display: 'flex',
                      flexDirection: "row",
                      fontSize: 18
                    }}
                  >
                    <Box
                      sx={{
                        m: 0,
                      }}
                    >
                      Tener al menos un producto a vender
                    </Box>
                    <Box
                      sx={{
                        m: 0,
                      }}
                    >
                      {currentCountMovement.catalogNumberProducts > 0 ? (
                        <>
                          <CheckCircleOutlineOutlinedIcon
                            color='success'
                            sx={{fontSize: '1.5em', mx: 2}}
                          />
                        </>
                      ) : (
                        <>
                          <CancelOutlinedIcon sx={{fontSize: '1.5em', mx: 2, color: red[500]}} />
                        </>
                      )}
                      
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      m: 0,
                      textAlign: 'left',
                      position: 'relative',
                      '& img': {
                        maxHeight: '100%',
                        maxWidth: '100%',
                      },
                      display: 'flex',
                      flexDirection: "row",
                      fontSize: 18
                    }}
                  >
                    <Box
                      sx={{
                        m: 0,
                      }}
                    >
                      Tener al menos una entrada si es que esta con stock 0
                    </Box>
                    <Box
                      sx={{
                        m: 0,
                      }}
                    >
                      {currentCountMovement.transactionalInput > 0 ? (
                        <>
                          <CheckCircleOutlineOutlinedIcon
                            color='success'
                            sx={{fontSize: '1.5em', mx: 2}}
                          />
                        </>
                      ) : (
                        <>
                          <CancelOutlinedIcon sx={{fontSize: '1.5em', mx: 2, color: red[500]}} />
                        </>
                      )}
                      
                    </Box>
                  </Box>
                  <Divider sx={{mt: 2, mb: 4}} />
                  <Box
                    sx={{
                      m: 0,
                      textAlign: 'left',
                      position: 'relative',
                      fontWeight: '700'
                    }}
                  >
                    <Box
                      sx={{
                        m: 0,
                      }}
                    >
                      Si quieres vender un producto en tu tienda, dale check en <span style={{color: red[500]}}>
                      "Publicar en ecommerce"
                  </span>  al registrar o actualizar *
                    </Box>
                  </Box>
              </Box>
              
              <AppInfoView />
            </DialogContent>
            <DialogActions sx={{justifyContent: 'center'}}>
              <Button
                variant='outlined'
                onClick={handleClose}
              >
                Aceptar
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <>
          
        </>
      )} */}
    </Card>
  ) : null;
};

export default Home;
