const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

const paths = require("./paths");
const loadAppEnv = require("./loadAppEnv");

const applicationEnv = loadAppEnv(process.env);

module.exports = {
  entry: ["./app/index.tsx"],
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  output: {
    path: paths.dist,
    publicPath: "/",
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./app/external/*", to: "./external/", flatten: true }]),
    new HtmlWebpackPlugin({
      template: paths.appHtml,
      favicon: paths.favicon,
    }),
    new webpack.DefinePlugin({
      "process.env": applicationEnv,
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    new WorkboxPlugin.GenerateSW({
      swDest: "sw.js",
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com/,
          handler: "staleWhileRevalidate",
          options: {
            cacheName: "google-fonts-stylesheets",
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com/,
          handler: "cacheFirst",
          options: {
            cacheName: "google-fonts-cache",
            expiration: {
              maxEntries: 5,
              maxAgeSeconds: 600,
            },
          },
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(jpg|png|svg|gif)$/,
            loader: "url-loader",
            exclude: paths.inlineIcons,
            options: {
              limit: 5000,
              name: "images/[hash:8].[ext]",
            },
          },
          {
            test: /\.(mp4|webm)$/,
            loader: "url-loader",
            exclude: paths.inlineIcons,
            options: {
              limit: 5000,
              name: "videos/[hash:8].[ext]",
            },
          },
          // raw-loader for svg is used inside `paths.inlineIcons` directory only
          {
            test: /\.(svg)$/,
            loader: "raw-loader",
            include: paths.inlineIcons,
          },
          {
            test: /\.(woff2|woff|ttf|eot|otf)$/,
            loader: "file-loader",
            options: {
              name: "fonts/[name].[hash:8].[ext]",
            },
          },
        ],
      },
    ],
  },
};
