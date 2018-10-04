const webpack = require('webpack');

var exclude = /node_modules/;

var defineObj = {
  ON_DEVELOPMENT: process.env.NODE_ENV === 'development',
  ON_PRODUCTION: process.env.NODE_ENV === 'production'
};

var plugins = [new webpack.DefinePlugin(defineObj), new webpack.NoEmitOnErrorsPlugin()];

if (defineObj.ON_PRODUCTION) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: { warnings: false },
      output: { comments: false }
    })
  );
}

module.exports = {
  context: __dirname + '/src',
  entry: './index.ts',
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: __dirname + '/public/dist',
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['ng-annotate-loader', 'ts-loader', 'tslint-loader'],
        exclude: exclude
      },
      {
        test: /\.css/,
        use: defineObj.ON_PRODUCTION
          ? ['style-loader', 'css-loader?minimize']
          : ['style-loader', 'css-loader']
      },
      {
        test: /\.scss/,
        use: defineObj.ON_PRODUCTION
          ? ['style-loader', 'css-loader?minimize', 'sass-loader']
          : ['style-loader', 'css-loader', 'sass-loader']
      },
      { test: /\.html/, use: 'html-loader' },
      { test: /\.(png|gif)/, use: 'file-loader?name=img/[name].[ext]' },
      { test: /\.(ttf|eot|svg|woff)/, use: 'file-loader?name=fonts/[name].[ext]' }
    ]
  },
  mode: defineObj.ON_PRODUCTION ? 'production' : 'development',
  devtool: '#source-maps',
  plugins: plugins
};
