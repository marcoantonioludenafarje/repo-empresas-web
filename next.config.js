const withTM = require('next-transpile-modules')([
  '@mui/material',
  '@mui/system',
  '@mui/icons-material',
]); // pass the modules you would like to see transpiled
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
let env = {
  REACT_APP_REGION: process.env.REACT_APP_REGION,
  REACT_APP_USERPOOL_ID: process.env.REACT_APP_USERPOOL_ID,
  REACT_APP_IDENTITY_POOL_ID: process.env.REACT_APP_IDENTITY_POOL_ID,
  REACT_APP_APP_CLIENT_ID: process.env.REACT_APP_APP_CLIENT_ID,
  REACT_APP_ENDPOINT_NAME: process.env.REACT_APP_ENDPOINT_NAME,
  REACT_APP_ENDPOINT_GATEWAY_URL: process.env.REACT_APP_ENDPOINT_GATEWAY_URL,
  REACT_APP_ENDPOINT_REGION: process.env.REACT_APP_ENDPOINT_REGION,
  REACT_APP_STORAGE_REGION: process.env.REACT_APP_STORAGE_REGION,
  REACT_APP_STORAGE_BUCKET: process.env.REACT_APP_STORAGE_BUCKET,
  REACT_APP_ECOMMERCE_URL: process.env.REACT_APP_ECOMMERCE_URL
};

module.exports = withTM({
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.join(__dirname, 'public/service-worker.js'),
              to: path.join(__dirname, '.next', 'service-worker.js')
            }
          ]
        })
      );
      config.plugins.push(
        new WorkboxWebpackPlugin.InjectManifest({
          swSrc: path.join(__dirname, 'public/service-worker.js'),
          swDest: path.join(__dirname, '.next', 'service-worker.js'),
          exclude: [/\.map$/, /_app/, /_document/, /_error/],
          maximumFileSizeToCacheInBytes: 10000000 // Ajusta este valor según tus necesidades
        })
      );
    }
    return config;
  },
  env: env
});
