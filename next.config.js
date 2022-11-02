const withTM = require('next-transpile-modules')([
  '@mui/material',
  '@mui/system',
  '@mui/icons-material',
]); // pass the modules you would like to see transpiled

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
};

module.exports = withTM({
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
  env: env
});
