import React from 'react';
import AppPageMeta from '../../../@crema/core/AppPageMeta';

import Card from '@mui/material/Card';
import ProductTable from './ProductTable';

const Products = (props) => {
  return (
    <>
      <AppPageMeta />
      <Card sx={{p: 4}}>
        <ProductTable />
      </Card>
    </>
  );
};

export default Products;
