import React from 'react';
import {makeStyles} from '@mui/styles';
import {Card, Typography, Box, Stack, Grid, styled, Paper} from '@mui/material';
import AppInfoView from '@crema/core/AppInfoView';

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
  console.log('Iniciando Home');
  return (
    <Card sx={{px: 4, py: 20}}>
      <Typography
        variant='h1'
        sx={{textAlign: 'center'}}
        className={classes.header}
        component='div'
        gutterBottom
      >
        Bienvenidos al <br />
        Dashboard
      </Typography>
      <Box sx={{textAlign: 'center', my: 20, fontSize: '1.3em'}}>
        Seleccione una opción <br />
        del menú para comenzar
      </Box>
      <Stack
        direction='row'
        spacing={6}
        className={classes.horizontalCenter}
        sx={{mt: 10}}
      >
        <Typography>Copyright 2022®</Typography>
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
      <AppInfoView />
    </Card>
  );
};

export default Home;
