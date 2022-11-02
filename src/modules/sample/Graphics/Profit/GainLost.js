import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import PropTypes from 'prop-types';
import {useThemeContext} from '../../../../@crema/utility/AppContextProvider/ThemeContextProvider';

const GainLost = ({data, gainName, lostName}) => {
  const {theme} = useThemeContext();
  return (
    <ResponsiveContainer width='100%' height={320}>
      <BarChart data={data} margin={{top: 10, right: 10, left: 0, bottom: 0}}>
        <XAxis dataKey='name' />
        <YAxis />
        <CartesianGrid strokeDasharray='3 3' />
        <Tooltip />
        <Legend />
        <Bar dataKey='gain' name={gainName} fill={theme.palette.primary.main} />
        <Bar
          dataKey='lost'
          name={lostName}
          fill={theme.palette.secondary.main}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

GainLost.propTypes = {
  data: PropTypes.array.isRequired,
  gainName: PropTypes.string,
  lostName: PropTypes.string,
};

export default GainLost;
