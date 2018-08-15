const path = require("path");
const paths = require("../webpack/paths");
const devConfig = require("../webpack/webpack.config.dev");
const webpack = require("webpack");

module.exports = (baseConfig, env, config) => {
  const pathToStyleLoader = path.join(__dirname, "./setup-styles.ts");

  config.entry.preview.push(pathToStyleLoader);

  config.module.rules = [...devConfig.module.rules];

  config.resolve.extensions = devConfig.resolve.extensions;

  const isMakingScreenshots = process.env.npm_lifecycle_event === "storybook:screenshots";
  if (isMakingScreenshots) {
    config.mode = 'none'
    config.devServer = {
      hot: false
    }
    config.entry.preview = config.entry.preview.filter(
      x => x.indexOf("webpack-hot-middleware") === -1,
    );
    config.plugins = config.plugins.filter(
      plugin => plugin.constructor.name !== "HotModuleReplacementPlugin",
    );
  }

  return config;
};
