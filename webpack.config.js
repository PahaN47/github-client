const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const TsCheckerPlugin = require('fork-ts-checker-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const buildPath = path.resolve(__dirname, 'dist');
const srcPath = path.resolve(__dirname, 'src');

const isDev = process.env.NODE_ENV === 'development';

const styleSettings = (module = false) => [
  isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: module
      ? {
          modules: {
            localIdentName: isDev ? '[path][name]__[local]' : '[contenthash:base64]',
          },
        }
      : undefined,
  },
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: ['autoprefixer'],
      },
    },
  },
  'sass-loader',
];

module.exports = {
  entry: path.join(srcPath, './index.tsx'),
  target: isDev ? 'web' : 'browserslist',
  devtool: isDev ? 'eval-source-map' : 'hidden-source-map',
  output: {
    path: buildPath,
    filename: 'bundle.js',
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.join(srcPath, 'index.html'),
      favicon: path.join(srcPath, 'assets/icons/logo.svg'),
    }),
    isDev && new ReactRefreshWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
    }),
    new TsCheckerPlugin(),
    new Dotenv({
      systemvars: true,
    }),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.module\.s?css$/,
        use: styleSettings(true),
      },
      {
        test: /\.s?css$/,
        exclude: /\.module\.s?css$/,
        use: styleSettings(),
      },
      {
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(png|jpg|svg|woff2)$/,
        type: 'asset',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      assets: path.join(srcPath, 'assets'),
      components: path.join(srcPath, 'components'),
      config: path.join(srcPath, 'config'),
      router: path.join(srcPath, 'router.tsx'),
      store: path.join(srcPath, 'store'),
      styles: path.join(srcPath, 'styles'),
      utils: path.join(srcPath, 'utils'),
    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  devServer: {
    host: '127.0.0.1',
    port: 3000,
    hot: true,
    historyApiFallback: {
      disableDotRule: true,
    },
  },
};
