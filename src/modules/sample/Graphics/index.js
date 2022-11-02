import React, {useLayoutEffect, useState} from 'react';
import {Grid, Card} from '@mui/material';
import ProductVsStock from './StatusStock/ProductVsStock';
import StockTable from './StatusStock/StockTable';
import GainLost from './Profit/GainLost';
import ProfitTable from './Profit/ProfitTable';

const data = [
  {name: 'Azúcar', value: 300},
  {name: 'Conserva de pescado', value: 150},
  {name: 'Leche Gloria', value: 100},
  {name: 'Aceite', value: 250},
  /* {name: 'Mercedes', value: 10000},
  {name: 'Audi', value: 100},
  {name: 'Lexus', value: 25000},
  {name: 'Opel', value: 5000}, 
  {name: 'Seat', value: 600},
  {name: 'BMW', value: 10000}, */
];

const profit = [
  {name: 'Enero', gain: 30000, lost: 400},
  {name: 'Febrero', gain: 5000, lost: 2500},
  {name: 'Marzo', gain: 25000, lost: 3200},
  {name: 'Abril', gain: 20000, lost: 10000},
  {name: 'Mayo', gain: 10000, lost: 15000},
  {name: 'Junio', gain: 17000, lost: 10000},
  {name: 'Julio', gain: 25000, lost: 2500},
  {name: 'Agosto', gain: 5000, lost: 6000},
  {name: 'Septiembre', gain: 600, lost: 60},
  {name: 'Octubre', gain: 10000, lost: 2000},
  {name: 'Noviembre', gain: 600, lost: 180},
  {name: 'Diciembre', gain: 10000, lost: 20000},
];

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

const Graphics = () => {
  /* const {innerWidth: width, innerHeight: height} = window;
  console.log('width', innerWidth);
  console.log('height', innerHeight); */

  const [width, height] = useWindowSize();
  console.log('dimensiones', width, 'y', height);

  return (
    <Grid container spacing={2} sx={{p: 2}}>
      <Grid item xs={width > 780 ? 7 : 12} sx={{width: '50%'}}>
        <Card sx={{p: 4}}>
          <ProductVsStock data={data} linex={'Stock'} />
        </Card>
      </Grid>
      <Grid item xs={width > 780 ? 5 : 12} sx={{width: '50%'}}>
        <Card sx={{p: 4}}>
          <StockTable data={data} />
        </Card>
      </Grid>
      <Grid item xs={width > 780 ? 7 : 12} sx={{width: '50%'}}>
        <Card sx={{p: 4}}>
          <GainLost data={profit} gainName={'Ingresos'} lostName={'Egresos'} />
        </Card>
      </Grid>
      <Grid item xs={width > 780 ? 5 : 12} sx={{width: '50%'}}>
        <Card sx={{p: 4}}>
          <ProfitTable data={profit} />
        </Card>
      </Grid>
    </Grid>
  );
};

export default Graphics;
