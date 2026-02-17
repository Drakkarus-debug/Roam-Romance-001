const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    { ...env, babel: { dangerouslyAddModulePathsToTranspile: [] } },
    argv
  );
  config.devServer = {
    ...config.devServer,
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: 'all',
  };
  return config;
};
