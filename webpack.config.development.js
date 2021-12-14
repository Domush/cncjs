import path from 'path';
import _CSSSplitWebpackPlugin from 'css-split-webpack-plugin';
import { createCommons } from 'simport';

const { __filename, __dirname, require } = createCommons(import.meta.url);

const CSSSplitWebpackPlugin = _CSSSplitWebpackPlugin.default;
import dotenv from 'dotenv';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import without from 'lodash/without';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import nib from 'nib';
import stylusLoader from 'stylus-loader';
import webpack from 'webpack';
import ManifestPlugin from 'webpack-manifest-plugin';
import WriteFileWebpackPlugin from 'write-file-webpack-plugin';
import babelConfig from './babel.config.cjs.js';
import buildConfig from './build.config.js';
const pkg = require('./src/package.json');

dotenv.config();

const publicPath = process.env.PUBLIC_PATH || '';
const buildVersion = pkg.version;
const timestamp = new Date().getTime();

export default {
  mode: 'development',
  cache: true,
  target: 'web',
  context: path.resolve(__dirname, 'src/app'),
  devtool: 'inline-cheap-module-source-map',
  entry: {
    polyfill: [
      path.resolve(__dirname, 'src/app/polyfill/index.js'),
      'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true',
    ],
    app: [
      path.resolve(__dirname, 'src/app/index.jsx'),
      'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true',
    ],
  },
  output: {
    path: path.resolve(__dirname, 'output/cncjs/app'),
    chunkFilename: `[id].[name].bundle.js?_=${timestamp}`,
    chunkFormat: 'module',
    chunkLoading: 'import',
    filename: `[id].[name].bundle.js?_=${timestamp}`,
    pathinfo: true,
    publicPath: publicPath,
    clean: true,
    environment: {
      // The environment supports arrow functions ('() => { ... }').
      arrowFunction: true,
      // The environment supports BigInt as literal (123n).
      bigIntLiteral: false,
      // The environment supports const and let for variable declarations.
      const: true,
      // The environment supports destructuring ('{ a, b } = obj').
      destructuring: true,
      // The environment supports an async import() function to import EcmaScript modules.
      dynamicImport: true,
      // The environment supports 'for of' iteration ('for (const x of array) { ... }').
      forOf: true,
      // The environment supports ECMAScript Module syntax to import ECMAScript modules (import ... from '...').
      module: true,
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        options: {
          ...babelConfig,
          env: {
            development: {
              plugins: ['react-hot-loader/babel'],
            },
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.styl$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                auto: true,
                exportLocalsConvention: 'camelCase',
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
              },
            },
          },
          {
            loader: 'stylus-loader',
            options: {
              stylusOptions: {
                // nib - CSS3 extensions for Stylus
                use: ['nib'],
                // no need to have a '@import "nib"' in the stylesheet
                import: ['~nib/lib/nib/index.styl'],
              },
            },
          },
        ],
        exclude: [path.resolve(__dirname, 'src/app/styles')],
      },
      {
        test: /\.styl$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: false,
            },
          },
          'stylus-loader',
        ],
        include: [path.resolve(__dirname, 'src/app/styles')],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff',
        },
      },
      {
        test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },
    ],
  },
  node: {
    console: true,
    global: true,
    process: true,
    Buffer: true,
    __filename: true, // Use relative path
    __dirname: true, // Use relative path
    setImmediate: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        BUILD_VERSION: JSON.stringify(buildVersion),
        LANGUAGES: JSON.stringify(buildConfig.languages),
        TRACKING_ID: JSON.stringify(buildConfig.analytics.trackingId),
      },
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
    // https://github.com/gajus/write-file-webpack-plugin
    // Forces webpack-dev-server to write bundle files to the file system.
    new WriteFileWebpackPlugin(),
    new webpack.ContextReplacementPlugin(
      /moment[\/\\]locale$/,
      new RegExp('^./(' + without(buildConfig.languages, 'en').join('|') + ')$')
    ),
    // Generates a manifest.json file in your root output directory with a mapping of all source file names to their corresponding output file.
    new ManifestPlugin({
      fileName: 'manifest.json',
    }),
    new MiniCssExtractPlugin({
      filename: `[name].css?_=${timestamp}`,
      chunkFilename: `[id].css?_=${timestamp}`,
    }),
    new CSSSplitWebpackPlugin({
      size: 4000,
      imports: '[name].[ext]?[hash]',
      filename: '[name]-[part].[ext]?[hash]',
      preserve: false,
    }),
    new HtmlWebpackPlugin({
      filename: 'index.hbs',
      template: path.resolve(__dirname, 'index.hbs'),
    }),
  ],
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.cjs', '.mjs'],
  },
  experiments: {
    asyncWebAssembly: true,
    buildHttp: true,
    layers: true,
    lazyCompilation: true,
    outputModule: true,
    syncWebAssembly: true,
    topLevelAwait: true,
  },
};
